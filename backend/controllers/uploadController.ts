import { Request, Response } from 'express'
import fs from 'fs'
import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'
import { UploadedFile } from '../lib/store'
import { addFile, validateFile } from './filesController'
import { logInfo, logError } from '../utils/logger'

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

    const uploadedFile: UploadedFile = {
      filename: file.originalname,
      text: text,
      timestamp: Date.now(),
    }

    // Save uploaded file information to the store
    addFile(uploadedFile)

    logInfo(`File uploaded: ${file.originalname}`)

    // Return success response with extracted text
    res.status(200).json({
      filename: file.originalname,
      text: text,
    })
  } catch (err) {
    logError('Upload failed: Server error', err)
    res.status(500).json({ error: 'Server error' })
  }
}
