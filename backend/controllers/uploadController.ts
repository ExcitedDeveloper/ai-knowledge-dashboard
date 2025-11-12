import { Request, Response } from 'express'
import fs from 'fs'
import { PDFParse } from 'pdf-parse'
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
  const startTime = Date.now()
  try {
    logInfo('Upload request received', {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      headers: {
        'content-type': req.headers['content-type'],
        'content-length': req.headers['content-length'],
        'origin': req.headers.origin,
        'user-agent': req.headers['user-agent']
      },
      ip: req.ip,
      protocol: req.protocol
    })

    const file: Express.Multer.File | undefined = req.file

    logInfo(`File received: ${file?.originalname || 'no file'}, mimetype: ${file?.mimetype || 'unknown'}, size: ${file?.size || 0} bytes`, {
      fileDetails: file ? {
        fieldname: file.fieldname,
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        destination: file.destination,
        filename: file.filename,
        path: file.path,
        size: file.size
      } : null
    })

    if (!validateFile(res, file)) {
      logError('File validation failed', new Error('Invalid file'))
      return
    }

    // After validation, file is guaranteed to be Express.Multer.File
    logInfo(`File validation passed for: ${file.originalname}`)

    let text: string = ''

    // Determine file type and extract text
    if (file.mimetype === 'application/pdf') {
      logInfo(`Extracting text from PDF: ${file.originalname}`)
      const dataBuffer = fs.readFileSync(file.path)
      const parser = new PDFParse({ data: dataBuffer })
      const pdfData = await parser.getText()
      text = pdfData.text
      logInfo(`PDF text extracted, length: ${text.length} characters`)
    } else if (
      file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      logInfo(`Extracting text from DOCX: ${file.originalname}`)
      const result = await mammoth.extractRawText({ path: file.path })
      text = result.value
      logInfo(`DOCX text extracted, length: ${text.length} characters`)
    } else if (file.mimetype === 'text/plain') {
      logInfo(`Reading text file: ${file.originalname}`)
      text = fs.readFileSync(file.path, 'utf-8')
      logInfo(`Text file read, length: ${text.length} characters`)
    } else {
      logError('Unsupported file type', new Error(`Mimetype: ${file.mimetype}`))
      return res.status(400).json({ error: 'Unsupported file type' })
    }

    logInfo('Creating embedding...')
    const uploadedFile = await getUploadedFile(file, text)
    logInfo('Embedding created successfully')

    // Save uploaded file information to Supabase
    logInfo('Saving file to database...')
    await addFile(uploadedFile, file.mimetype)
    logInfo(`File saved to database: ${file.originalname}`)

    const totalTime = Date.now() - startTime
    logInfo(`File upload completed successfully: ${file.originalname}`, {
      totalDuration: `${totalTime}ms`
    })

    // Return success response with extracted text
    res.status(200).json({
      filename: file.originalname,
      text: text,
      embedding: uploadedFile.embedding,
    })
  } catch (err) {
    const totalTime = Date.now() - startTime
    logError('Upload failed: Server error', err)
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    const errorStack = err instanceof Error ? err.stack : undefined
    logError('Error details:', {
      message: errorMessage,
      stack: errorStack,
      duration: `${totalTime}ms`,
      errorType: err instanceof Error ? err.constructor.name : typeof err
    })
    res.status(500).json({ error: 'Server error', details: errorMessage })
  }
}
