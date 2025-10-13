import { Request, Response } from 'express'
import fs from 'fs'
import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'
import { handleFileUpload } from './uploadController'
import { addFile } from './filesController'
import store from '../lib/store'
import OpenAI from 'openai'

// Mock dependencies
jest.mock('fs')
jest.mock('pdf-parse')
jest.mock('mammoth')
jest.mock('./filesController', () => ({
  addFile: jest.fn(),
  validateFile: jest.fn(),
}))
jest.mock('openai')
jest.mock('../utils/logger', () => ({
  logInfo: jest.fn(),
  logError: jest.fn(),
}))

const mockFs = fs as jest.Mocked<typeof fs>
const mockPdfParse = pdfParse as jest.MockedFunction<typeof pdfParse>
const mockMammoth = mammoth as jest.Mocked<typeof mammoth>
const mockAddFile = addFile as jest.MockedFunction<typeof addFile>
const mockValidateFile = require('./filesController').validateFile as jest.MockedFunction<any>

describe('uploadController', () => {
  let mockReq: Partial<Request>
  let mockRes: Partial<Response>
  let mockJson: jest.Mock
  let mockStatus: jest.Mock
  let mockEmbeddingsCreate: jest.Mock

  beforeEach(() => {
    // Clear store
    store.files = []

    // Reset all mocks
    jest.clearAllMocks()

    // Mock response object
    mockJson = jest.fn()
    mockStatus = jest.fn().mockReturnValue({ json: mockJson })

    mockRes = {
      status: mockStatus,
      json: mockJson,
    }

    // Mock validateFile to return true by default (successful validation)
    mockValidateFile.mockReturnValue(true)

    // Mock OpenAI embeddings
    mockEmbeddingsCreate = jest.fn().mockResolvedValue({
      data: [{ embedding: [0.1, 0.2, 0.3, 0.4, 0.5] }],
    })
    ;(OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(() => ({
      embeddings: {
        create: mockEmbeddingsCreate,
      },
    } as any))

    // Mock console.error to avoid noise in tests
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('handleFileUpload', () => {
    describe('when no file is uploaded', () => {
      test('should return 400 error', async () => {
        mockReq = { file: undefined }
        // Mock validateFile to return false for no file
        mockValidateFile.mockReturnValue(false)

        await handleFileUpload(mockReq as Request, mockRes as Response)

        expect(mockValidateFile).toHaveBeenCalled()
        expect(mockAddFile).not.toHaveBeenCalled()
      })
    })

    describe('when handling PDF files', () => {
      test('should extract text and save PDF file successfully', async () => {
        const mockFile = {
          originalname: 'test.pdf',
          path: '/path/to/test.pdf',
          mimetype: 'application/pdf',
          fieldname: 'file',
          encoding: '7bit',
          size: 1000,
        } as Express.Multer.File
        mockReq = { file: mockFile }

        const mockPdfData = {
          text: 'Extracted PDF text content'
        } as any
        const mockBuffer = Buffer.from('pdf content')

        mockFs.readFileSync.mockReturnValue(mockBuffer)
        mockPdfParse.mockResolvedValue(mockPdfData)

        await handleFileUpload(mockReq as Request, mockRes as Response)

        expect(mockFs.readFileSync).toHaveBeenCalledWith('/path/to/test.pdf')
        expect(mockPdfParse).toHaveBeenCalledWith(mockBuffer)
        expect(mockEmbeddingsCreate).toHaveBeenCalledWith({
          model: 'text-embedding-3-small',
          input: 'Extracted PDF text content',
        })
        expect(mockAddFile).toHaveBeenCalledWith({
          filename: 'test.pdf',
          text: 'Extracted PDF text content',
          timestamp: expect.any(Number),
          embedding: [0.1, 0.2, 0.3, 0.4, 0.5],
        })
        expect(mockStatus).toHaveBeenCalledWith(200)
        expect(mockJson).toHaveBeenCalledWith({
          filename: 'test.pdf',
          text: 'Extracted PDF text content',
        })
      })

      test('should handle PDF parsing errors', async () => {
        const mockFile = {
          originalname: 'test.pdf',
          path: '/path/to/test.pdf',
          mimetype: 'application/pdf',
          fieldname: 'file',
          encoding: '7bit',
          size: 1000,
        } as Express.Multer.File
        mockReq = { file: mockFile }

        mockFs.readFileSync.mockReturnValue(Buffer.from('pdf content'))
        mockPdfParse.mockRejectedValue(new Error('PDF parsing failed'))

        await handleFileUpload(mockReq as Request, mockRes as Response)

        expect(mockStatus).toHaveBeenCalledWith(500)
        expect(mockJson).toHaveBeenCalledWith({ error: 'Server error' })
        expect(mockAddFile).not.toHaveBeenCalled()
      })
    })

    describe('when handling Word documents', () => {
      test('should extract text and save DOCX file successfully', async () => {
        const mockFile = {
          originalname: 'test.docx',
          path: '/path/to/test.docx',
          mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          fieldname: 'file',
          encoding: '7bit',
          size: 1000,
        } as Express.Multer.File
        mockReq = { file: mockFile }

        const mockResult = {
          value: 'Extracted Word document text',
          messages: []
        }
        mockMammoth.extractRawText.mockResolvedValue(mockResult)

        await handleFileUpload(mockReq as Request, mockRes as Response)

        expect(mockMammoth.extractRawText).toHaveBeenCalledWith({ path: '/path/to/test.docx' })
        expect(mockEmbeddingsCreate).toHaveBeenCalledWith({
          model: 'text-embedding-3-small',
          input: 'Extracted Word document text',
        })
        expect(mockAddFile).toHaveBeenCalledWith({
          filename: 'test.docx',
          text: 'Extracted Word document text',
          timestamp: expect.any(Number),
          embedding: [0.1, 0.2, 0.3, 0.4, 0.5],
        })
        expect(mockStatus).toHaveBeenCalledWith(200)
        expect(mockJson).toHaveBeenCalledWith({
          filename: 'test.docx',
          text: 'Extracted Word document text',
        })
      })

      test('should handle Word document parsing errors', async () => {
        const mockFile = {
          originalname: 'test.docx',
          path: '/path/to/test.docx',
          mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          fieldname: 'file',
          encoding: '7bit',
          size: 1000,
        } as Express.Multer.File
        mockReq = { file: mockFile }

        mockMammoth.extractRawText.mockRejectedValue(new Error('Word parsing failed'))

        await handleFileUpload(mockReq as Request, mockRes as Response)

        expect(mockStatus).toHaveBeenCalledWith(500)
        expect(mockJson).toHaveBeenCalledWith({ error: 'Server error' })
        expect(mockAddFile).not.toHaveBeenCalled()
      })
    })

    describe('when handling text files', () => {
      test('should read and save text file successfully', async () => {
        const mockFile = {
          originalname: 'test.txt',
          path: '/path/to/test.txt',
          mimetype: 'text/plain',
          fieldname: 'file',
          encoding: '7bit',
          size: 1000,
        } as Express.Multer.File
        mockReq = { file: mockFile }

        const textContent = 'Plain text file content'
        mockFs.readFileSync.mockReturnValue(textContent)

        await handleFileUpload(mockReq as Request, mockRes as Response)

        expect(mockFs.readFileSync).toHaveBeenCalledWith('/path/to/test.txt', 'utf-8')
        expect(mockEmbeddingsCreate).toHaveBeenCalledWith({
          model: 'text-embedding-3-small',
          input: 'Plain text file content',
        })
        expect(mockAddFile).toHaveBeenCalledWith({
          filename: 'test.txt',
          text: 'Plain text file content',
          timestamp: expect.any(Number),
          embedding: [0.1, 0.2, 0.3, 0.4, 0.5],
        })
        expect(mockStatus).toHaveBeenCalledWith(200)
        expect(mockJson).toHaveBeenCalledWith({
          filename: 'test.txt',
          text: 'Plain text file content',
        })
      })

      test('should handle text file reading errors', async () => {
        const mockFile = {
          originalname: 'test.txt',
          path: '/path/to/test.txt',
          mimetype: 'text/plain',
          fieldname: 'file',
          encoding: '7bit',
          size: 1000,
        } as Express.Multer.File
        mockReq = { file: mockFile }

        mockFs.readFileSync.mockImplementation(() => {
          throw new Error('File read failed')
        })

        await handleFileUpload(mockReq as Request, mockRes as Response)

        expect(mockStatus).toHaveBeenCalledWith(500)
        expect(mockJson).toHaveBeenCalledWith({ error: 'Server error' })
        expect(mockAddFile).not.toHaveBeenCalled()
      })
    })

    describe('when handling unsupported file types', () => {
      test('should return 400 error for unsupported file type', async () => {
        const mockFile = {
          originalname: 'test.jpg',
          path: '/path/to/test.jpg',
          mimetype: 'image/jpeg',
          fieldname: 'file',
          encoding: '7bit',
          size: 1000,
        } as Express.Multer.File
        mockReq = { file: mockFile }

        await handleFileUpload(mockReq as Request, mockRes as Response)

        expect(mockStatus).toHaveBeenCalledWith(400)
        expect(mockJson).toHaveBeenCalledWith({ error: 'Unsupported file type' })
        expect(mockAddFile).not.toHaveBeenCalled()
      })

      test('should return 400 error for unknown mimetype', async () => {
        const mockFile = {
          originalname: 'test.unknown',
          path: '/path/to/test.unknown',
          mimetype: 'application/unknown',
          fieldname: 'file',
          encoding: '7bit',
          size: 1000,
        } as Express.Multer.File
        mockReq = { file: mockFile }

        await handleFileUpload(mockReq as Request, mockRes as Response)

        expect(mockStatus).toHaveBeenCalledWith(400)
        expect(mockJson).toHaveBeenCalledWith({ error: 'Unsupported file type' })
        expect(mockAddFile).not.toHaveBeenCalled()
      })
    })

    describe('error handling', () => {
      test('should handle general errors and return 500', async () => {
        const mockFile = {
          originalname: 'test.txt',
          path: '/path/to/test.txt',
          mimetype: 'text/plain',
          fieldname: 'file',
          encoding: '7bit',
          size: 1000,
        } as Express.Multer.File
        mockReq = { file: mockFile }

        // Mock addFile to throw an error
        mockFs.readFileSync.mockReturnValue('content')
        mockAddFile.mockImplementation(() => {
          throw new Error('Store error')
        })

        await handleFileUpload(mockReq as Request, mockRes as Response)

        expect(mockStatus).toHaveBeenCalledWith(500)
        expect(mockJson).toHaveBeenCalledWith({ error: 'Server error' })
      })
    })

    describe('timestamp generation', () => {
      test('should generate timestamps for uploaded files', async () => {
        const mockFile = {
          originalname: 'test.txt',
          path: '/path/to/test.txt',
          mimetype: 'text/plain',
          fieldname: 'file',
          encoding: '7bit',
          size: 1000,
        } as Express.Multer.File

        mockFs.readFileSync.mockReturnValue('content')
        mockReq = { file: mockFile }

        await handleFileUpload(mockReq as Request, mockRes as Response)

        const timestamp = (mockAddFile.mock.calls[0] as any)[0].timestamp
        expect(timestamp).toBeGreaterThan(0)
        expect(typeof timestamp).toBe('number')
      })
    })

    describe('embedding generation', () => {
      test('should create embeddings for uploaded file text', async () => {
        const mockFile = {
          originalname: 'test.txt',
          path: '/path/to/test.txt',
          mimetype: 'text/plain',
          fieldname: 'file',
          encoding: '7bit',
          size: 1000,
        } as Express.Multer.File
        mockReq = { file: mockFile }

        const textContent = 'Test content for embedding'
        mockFs.readFileSync.mockReturnValue(textContent)

        await handleFileUpload(mockReq as Request, mockRes as Response)

        expect(mockEmbeddingsCreate).toHaveBeenCalledWith({
          model: 'text-embedding-3-small',
          input: textContent,
        })
        const uploadedFile = (mockAddFile.mock.calls[0] as any)[0]
        expect(uploadedFile.embedding).toEqual([0.1, 0.2, 0.3, 0.4, 0.5])
      })

      test('should handle embedding creation failures', async () => {
        const mockFile = {
          originalname: 'test.txt',
          path: '/path/to/test.txt',
          mimetype: 'text/plain',
          fieldname: 'file',
          encoding: '7bit',
          size: 1000,
        } as Express.Multer.File
        mockReq = { file: mockFile }

        mockFs.readFileSync.mockReturnValue('content')
        mockEmbeddingsCreate.mockRejectedValue(new Error('OpenAI API error'))

        await handleFileUpload(mockReq as Request, mockRes as Response)

        expect(mockStatus).toHaveBeenCalledWith(500)
        expect(mockJson).toHaveBeenCalledWith({ error: 'Server error' })
        expect(mockAddFile).not.toHaveBeenCalled()
      })
    })
  })
})