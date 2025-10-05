import request from 'supertest'
import express from 'express'
import uploadRoutes from './uploadRoutes'
import { handleFileUpload } from '../controllers/uploadController'
import multer from 'multer'

// Mock the upload controller
jest.mock('../controllers/uploadController')

const mockHandleFileUpload = handleFileUpload as jest.MockedFunction<any>

describe('uploadRoutes', () => {
  let app: express.Application

  beforeEach(() => {
    app = express()
    app.use('/upload', uploadRoutes)
    jest.clearAllMocks()
  })

  describe('POST /upload', () => {
    test('should call handleFileUpload controller when file is uploaded', async () => {
      mockHandleFileUpload.mockImplementation(async (req: any, res: any) => {
        res.status(200).json({
          filename: 'test.txt',
          text: 'Test file content'
        })
      })

      const response = await request(app)
        .post('/upload')
        .attach('file', Buffer.from('test content'), 'test.txt')

      expect(response.status).toBe(200)
      expect(mockHandleFileUpload).toHaveBeenCalledTimes(1)
      // Verify the controller was called with correct file info
      const callArgs = mockHandleFileUpload.mock.calls[0]
      expect(callArgs[0].file.originalname).toBe('test.txt')
      expect(callArgs[0].file.mimetype).toBe('text/plain')
    })

    test('should handle PDF file upload', async () => {
      mockHandleFileUpload.mockImplementation(async (req: any, res: any) => {
        res.status(200).json({
          filename: 'document.pdf',
          text: 'Extracted PDF content'
        })
      })

      const response = await request(app)
        .post('/upload')
        .attach('file', Buffer.from('PDF content'), {
          filename: 'document.pdf',
          contentType: 'application/pdf'
        })

      expect(response.status).toBe(200)
      expect(mockHandleFileUpload).toHaveBeenCalledTimes(1)
      // Verify the controller was called with correct file info
      const callArgs = mockHandleFileUpload.mock.calls[0]
      expect(callArgs[0].file.originalname).toBe('document.pdf')
      expect(callArgs[0].file.mimetype).toBe('application/pdf')
    })

    test('should handle Word document upload', async () => {
      mockHandleFileUpload.mockImplementation(async (req: any, res: any) => {
        res.status(200).json({
          filename: 'document.docx',
          text: 'Extracted Word content'
        })
      })

      const response = await request(app)
        .post('/upload')
        .attach('file', Buffer.from('DOCX content'), {
          filename: 'document.docx',
          contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        })

      expect(response.status).toBe(200)
      expect(mockHandleFileUpload).toHaveBeenCalledTimes(1)
      // Verify the controller was called with correct file info
      const callArgs = mockHandleFileUpload.mock.calls[0]
      expect(callArgs[0].file.originalname).toBe('document.docx')
      expect(callArgs[0].file.mimetype).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    })

    test('should handle request without file', async () => {
      mockHandleFileUpload.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ error: 'No file uploaded' })
      })

      const response = await request(app)
        .post('/upload')

      expect(response.status).toBe(400)
      expect(mockHandleFileUpload).toHaveBeenCalledTimes(1)
      // Verify the controller was called without a file
      const callArgs = mockHandleFileUpload.mock.calls[0]
      expect(callArgs[0].file).toBeUndefined()
    })

    test('should handle controller errors', async () => {
      mockHandleFileUpload.mockImplementation(async (req: any, res: any) => {
        res.status(500).json({ error: 'Server error' })
      })

      const response = await request(app)
        .post('/upload')
        .attach('file', Buffer.from('test content'), 'test.txt')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Server error' })
      expect(mockHandleFileUpload).toHaveBeenCalledTimes(1)
    })


    test('should handle large file uploads', async () => {
      mockHandleFileUpload.mockImplementation(async (req: any, res: any) => {
        res.status(200).json({
          filename: 'large-file.txt',
          text: 'Large file content'
        })
      })

      const largeContent = 'A'.repeat(10000) // 10KB file
      const response = await request(app)
        .post('/upload')
        .attach('file', Buffer.from(largeContent), 'large-file.txt')

      expect(response.status).toBe(200)
      expect(mockHandleFileUpload).toHaveBeenCalledTimes(1)
    })

    test('should handle files with special characters in filename', async () => {
      mockHandleFileUpload.mockImplementation(async (req: any, res: any) => {
        res.status(200).json({
          filename: 'file with spaces & special chars.txt',
          text: 'Content'
        })
      })

      const response = await request(app)
        .post('/upload')
        .attach('file', Buffer.from('content'), 'file with spaces & special chars.txt')

      expect(response.status).toBe(200)
      // Verify the controller was called with correct file info
      const callArgs = mockHandleFileUpload.mock.calls[0]
      expect(callArgs[0].file.originalname).toBe('file with spaces & special chars.txt')
    })

    test('should handle multiple calls to upload endpoint', async () => {
      mockHandleFileUpload.mockImplementation(async (req: any, res: any) => {
        res.status(200).json({
          filename: req.file?.originalname || 'unknown',
          text: 'File content'
        })
      })

      const response1 = await request(app)
        .post('/upload')
        .attach('file', Buffer.from('content1'), 'file1.txt')

      const response2 = await request(app)
        .post('/upload')
        .attach('file', Buffer.from('content2'), 'file2.txt')

      expect(response1.status).toBe(200)
      expect(response2.status).toBe(200)
      expect(mockHandleFileUpload).toHaveBeenCalledTimes(2)
    })

    test('should configure multer to save files to uploads directory', async () => {
      mockHandleFileUpload.mockImplementation(async (req: any, res: any) => {
        // Check that the file object has the expected structure from multer
        const file = req.file
        expect(file).toBeDefined()
        expect(file?.destination).toBeDefined()
        expect(file?.filename).toBeDefined()
        expect(file?.path).toBeDefined()

        res.status(200).json({
          filename: file?.originalname || 'unknown',
          text: 'File content'
        })
      })

      const response = await request(app)
        .post('/upload')
        .attach('file', Buffer.from('test content'), 'test.txt')

      expect(response.status).toBe(200)
      expect(mockHandleFileUpload).toHaveBeenCalledTimes(1)
    })

    test('should preserve file metadata in request object', async () => {
      let capturedFile: any

      mockHandleFileUpload.mockImplementation(async (req: any, res: any) => {
        capturedFile = req.file
        res.status(200).json({ success: true })
      })

      await request(app)
        .post('/upload')
        .attach('file', Buffer.from('test content'), 'metadata-test.txt')

      expect(capturedFile).toBeDefined()
      expect(capturedFile.originalname).toBe('metadata-test.txt')
      expect(capturedFile.mimetype).toBe('text/plain')
      expect(capturedFile.size).toBeGreaterThan(0)
    })
  })

  describe('Route configuration', () => {
    test('should only accept POST requests', async () => {
      const response = await request(app)
        .get('/upload')

      expect(response.status).toBe(404)
      expect(mockHandleFileUpload).not.toHaveBeenCalled()
    })

    test('should not accept PUT requests', async () => {
      const response = await request(app)
        .put('/upload')
        .attach('file', Buffer.from('content'), 'test.txt')

      expect(response.status).toBe(404)
      expect(mockHandleFileUpload).not.toHaveBeenCalled()
    })

    test('should not accept DELETE requests', async () => {
      const response = await request(app)
        .delete('/upload')

      expect(response.status).toBe(404)
      expect(mockHandleFileUpload).not.toHaveBeenCalled()
    })

  })
})