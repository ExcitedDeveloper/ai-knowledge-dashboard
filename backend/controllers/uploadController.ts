import { Request, Response } from 'express'
import fs from 'fs'
import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'
import { UploadedFile } from '../lib/store'
import { addFile, validateFile } from './filesController'
import { logInfo, logError } from '../utils/logger'
import { CohereClient } from 'cohere-ai'

/**
 * Creates an embedding vector for the given text using Cohere's embedding model.
 * @param text - The text to generate an embedding for
 * @returns Promise resolving to an array of numbers representing the embedding vector
 */
const createEmbedding = async (text: string): Promise<number[]> => {
  try {
    console.log(`COHERE_API_KEY: ${process.env.COHERE_API_KEY}`)
    const cohere = new CohereClient({
      token: process.env.COHERE_API_KEY!,
    })

    const res = await cohere.embed({
      model: 'embed-english-v3.0',
      texts: [text],
      inputType: 'search_document',
    })

    // Cohere returns embeddings as number[][]
    const embeddings = res.embeddings as number[][]
    return embeddings[0]
  } catch (err) {
    logError('Failed to create embedding', err)
    throw err
  }
}

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

    // Save uploaded file information to the store
    addFile(uploadedFile)

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
