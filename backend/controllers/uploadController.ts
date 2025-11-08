import { Request, Response } from 'express'
import fs from 'fs'
import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'
import { UploadedFile } from '../lib/store.js'
import { addFile, validateFile } from './filesController.js'
import { logInfo, logError } from '../utils/logger.js'
import { createEmbedding } from '../services/embeddingService.js'

/**
 * Constructs an UploadedFile object with metadata and embedding from the uploaded file.
 * @param file - The Multer file object containing file metadata
 * @param text - The extracted text content from the file
 * @returns Promise resolving to an UploadedFile object with filename, text, timestamp, and embedding
 */
const getUploadedFile = async (file: Express.Multer.File, text: string) => {
  const uploadedFile: UploadedFile = {
    filename: file.originalname,
    text: text,
    timestamp: Date.now(),
    embedding: await createEmbedding(text),
  }

  return uploadedFile
}

/**
 * Handles file upload requests, extracts text from supported file types (PDF, DOCX, TXT), generates embeddings, and stores the file data.
 * @param req - Express request object containing the uploaded file
 * @param res - Express response object for sending the result
 */
export const handleFileUpload = async (req: Request, res: Response) => {
  try {
    const file = req.file

    if (!validateFile(res, file)) {
      return
    }

    let text: string = ''

    // Determine file type and extract text
    if (file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(file.path)
      const pdfData = await pdfParse(dataBuffer)
      text = pdfData.text
    } else if (
      file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({ path: file.path })
      text = result.value
    } else if (file.mimetype === 'text/plain') {
      text = fs.readFileSync(file.path, 'utf-8')
    } else {
      return res.status(400).json({ error: 'Unsupported file type' })
    }

    const uploadedFile = await getUploadedFile(file, text)

    // Save uploaded file information to Supabase
    await addFile(uploadedFile, file.mimetype)

    logInfo(`File uploaded: ${file.originalname}`)

    // Return success response with extracted text
    res.status(200).json({
      filename: file.originalname,
      text: text,
      embedding: uploadedFile.embedding,
    })
  } catch (err) {
    logError('Upload failed: Server error', err)
    res.status(500).json({ error: 'Server error' })
  }
}
