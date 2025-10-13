import { addFile, getFiles, validateFile } from './filesController'
import store, { UploadedFile } from '../lib/store'
import { Response } from 'express'

// Mock response object helper
const mockResponse = () => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  }
  return res as Response
}

describe('filesController', () => {
  beforeEach(() => {
    // Clear store before each test
    store.files = []
    jest.clearAllMocks()
  })

  describe('addFile', () => {
    test('should add a file to the store', () => {
      const mockFile: UploadedFile = {
        filename: 'test.pdf',
        text: 'Test content',
        timestamp: Date.now(),
        embedding: [0.1, 0.2, 0.3],
      }

      addFile(mockFile)

      expect(store.files).toHaveLength(1)
      expect(store.files[0]).toEqual(mockFile)
    })

    test('should add multiple files to the store', () => {
      const mockFile1: UploadedFile = {
        filename: 'test1.pdf',
        text: 'Test content 1',
        timestamp: Date.now(),
        embedding: [0.1, 0.2, 0.3],
      }

      const mockFile2: UploadedFile = {
        filename: 'test2.pdf',
        text: 'Test content 2',
        timestamp: Date.now() + 1000,
        embedding: [0.4, 0.5, 0.6],
      }

      addFile(mockFile1)
      addFile(mockFile2)

      expect(store.files).toHaveLength(2)
      expect(store.files[0]).toEqual(mockFile1)
      expect(store.files[1]).toEqual(mockFile2)
    })
  })

  describe('getFiles', () => {
    test('should return empty array when no files exist', () => {
      const files = getFiles()

      expect(files).toEqual([])
      expect(files).toHaveLength(0)
    })

    test('should return all files from the store', () => {
      const mockFiles: UploadedFile[] = [
        {
          filename: 'test1.pdf',
          text: 'Test content 1',
          timestamp: Date.now(),
          embedding: [0.1, 0.2, 0.3],
        },
        {
          filename: 'test2.pdf',
          text: 'Test content 2',
          timestamp: Date.now() + 1000,
          embedding: [0.4, 0.5, 0.6],
        },
      ]

      // Add files to store
      mockFiles.forEach(file => addFile(file))

      const files = getFiles()

      expect(files).toEqual(mockFiles)
      expect(files).toHaveLength(2)
    })

    test('should return reference to actual store array', () => {
      const mockFile: UploadedFile = {
        filename: 'test.pdf',
        text: 'Test content',
        timestamp: Date.now(),
        embedding: [0.1, 0.2, 0.3],
      }

      addFile(mockFile)
      const files = getFiles()

      expect(files).toBe(store.files)
    })
  })

  describe('validateFile', () => {
    test('should return false when no file is provided', () => {
      const res = mockResponse()

      const result = validateFile(res, undefined)

      expect(result).toBe(false)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toHaveBeenCalledWith('No file uploaded')
    })

    test('should return false when file has no extension', () => {
      const res = mockResponse()
      const mockFile = {
        originalname: 'fileWithoutExtension',
        size: 100,
      } as Express.Multer.File

      const result = validateFile(res, mockFile)

      expect(result).toBe(false)
      expect(res.status).toHaveBeenCalledWith(400)
      // The file name 'fileWithoutExtension' will be treated as the extension
      expect(res.send).toHaveBeenCalledWith("Invalid file type fileExtension: 'filewithoutextension'")
    })

    test('should return false when filename is empty string with dot', () => {
      const res = mockResponse()
      const mockFile = {
        originalname: '.',
        size: 100,
      } as Express.Multer.File

      const result = validateFile(res, mockFile)

      expect(result).toBe(false)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toHaveBeenCalledWith('A file was not specified for upload')
    })

    test('should return false when file extension is invalid', () => {
      const res = mockResponse()
      const mockFile = {
        originalname: 'test.pdf',
        size: 100,
      } as Express.Multer.File

      const result = validateFile(res, mockFile)

      expect(result).toBe(false)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toHaveBeenCalledWith("Invalid file type fileExtension: 'pdf'")
    })

    test('should return false when file is empty', () => {
      const res = mockResponse()
      const mockFile = {
        originalname: 'test.txt',
        size: 0,
      } as Express.Multer.File

      const result = validateFile(res, mockFile)

      expect(result).toBe(false)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toHaveBeenCalledWith('Uploaded file is empty')
    })

    test('should return true for valid txt file', () => {
      const res = mockResponse()
      const mockFile = {
        originalname: 'test.txt',
        size: 100,
      } as Express.Multer.File

      const result = validateFile(res, mockFile)

      expect(result).toBe(true)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
    })

    test('should handle uppercase file extensions', () => {
      const res = mockResponse()
      const mockFile = {
        originalname: 'test.TXT',
        size: 100,
      } as Express.Multer.File

      const result = validateFile(res, mockFile)

      expect(result).toBe(true)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
    })

    test('should handle mixed case file extensions', () => {
      const res = mockResponse()
      const mockFile = {
        originalname: 'test.TxT',
        size: 100,
      } as Express.Multer.File

      const result = validateFile(res, mockFile)

      expect(result).toBe(true)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
    })

    test('should handle files with multiple dots in filename', () => {
      const res = mockResponse()
      const mockFile = {
        originalname: 'my.test.file.txt',
        size: 100,
      } as Express.Multer.File

      const result = validateFile(res, mockFile)

      expect(result).toBe(true)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
    })

    test('should reject files with invalid extensions after multiple dots', () => {
      const res = mockResponse()
      const mockFile = {
        originalname: 'my.test.file.pdf',
        size: 100,
      } as Express.Multer.File

      const result = validateFile(res, mockFile)

      expect(result).toBe(false)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toHaveBeenCalledWith("Invalid file type fileExtension: 'pdf'")
    })
  })
})