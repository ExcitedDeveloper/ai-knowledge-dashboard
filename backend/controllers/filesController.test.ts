import { addFile, deleteFile, getFiles, validateFile } from './filesController'
import { UploadedFile } from '../lib/store'
import { Response } from 'express'
import { supabase } from '../supabase/supabaseClient'
import { UUID } from 'crypto'

// Mock Supabase client
jest.mock('../supabase/supabaseClient', () => ({
  supabase: {
    from: jest.fn(),
  },
}))

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
    jest.clearAllMocks()
  })

  describe('addFile', () => {
    test('should add a file to Supabase', async () => {
      const mockFile: UploadedFile = {
        filename: 'test.pdf',
        text: 'Test content',
        timestamp: Date.now(),
        embedding: [0.1, 0.2, 0.3],
      }

      const mockInsert = jest.fn().mockResolvedValue({ error: null })
      ;(supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert,
      })

      await addFile(mockFile, 'application/pdf')

      expect(supabase.from).toHaveBeenCalledWith('files')
      expect(mockInsert).toHaveBeenCalledWith({
        filename: mockFile.filename,
        mimetype: 'application/pdf',
        content: mockFile.text,
        embedding: mockFile.embedding,
      })
    })

    test('should throw error when Supabase insert fails', async () => {
      const mockFile: UploadedFile = {
        filename: 'test.pdf',
        text: 'Test content',
        timestamp: Date.now(),
        embedding: [0.1, 0.2, 0.3],
      }

      const mockError = new Error('Database error')
      const mockInsert = jest.fn().mockResolvedValue({ error: mockError })
      ;(supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert,
      })

      await expect(addFile(mockFile, 'application/pdf')).rejects.toThrow()
    })
  })

  describe('getFiles', () => {
    test('should return empty array when no files exist', async () => {
      const mockSelect = jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      })
      ;(supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
      })

      const files = await getFiles()

      expect(files).toEqual([])
      expect(files).toHaveLength(0)
    })

    test('should return all files from Supabase', async () => {
      const mockDbFiles = [
        {
          filename: 'test1.pdf',
          content: 'Test content 1',
          uploaded_at: new Date().toISOString(),
          embedding: [0.1, 0.2, 0.3],
        },
        {
          filename: 'test2.pdf',
          content: 'Test content 2',
          uploaded_at: new Date().toISOString(),
          embedding: [0.4, 0.5, 0.6],
        },
      ]

      const mockSelect = jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({ data: mockDbFiles, error: null }),
      })
      ;(supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
      })

      const files = await getFiles()

      expect(files).toHaveLength(2)
      expect(files[0].filename).toBe('test1.pdf')
      expect(files[1].filename).toBe('test2.pdf')
    })

    test('should throw error when Supabase query fails', async () => {
      const mockError = new Error('Database error')
      const mockSelect = jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({ data: null, error: mockError }),
      })
      ;(supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
      })

      await expect(getFiles()).rejects.toThrow()
    })
  })

  describe('deleteFile', () => {
    test('should delete a file from Supabase', async () => {
      const testId = '123e4567-e89b-12d3-a456-426614174000' as UUID

      const mockEq = jest.fn().mockResolvedValue({ error: null })
      const mockDelete = jest.fn().mockReturnValue({
        eq: mockEq,
      })
      ;(supabase.from as jest.Mock).mockReturnValue({
        delete: mockDelete,
      })

      await deleteFile(testId)

      expect(supabase.from).toHaveBeenCalledWith('files')
      expect(mockDelete).toHaveBeenCalled()
      expect(mockEq).toHaveBeenCalledWith('id', testId)
    })

    test('should throw error when Supabase delete fails', async () => {
      const testId = '123e4567-e89b-12d3-a456-426614174000' as UUID
      const mockError = new Error('Database error')

      const mockEq = jest.fn().mockResolvedValue({ error: mockError })
      const mockDelete = jest.fn().mockReturnValue({
        eq: mockEq,
      })
      ;(supabase.from as jest.Mock).mockReturnValue({
        delete: mockDelete,
      })

      await expect(deleteFile(testId)).rejects.toThrow()
    })

    test('should throw error on database exception', async () => {
      const testId = '123e4567-e89b-12d3-a456-426614174000' as UUID

      const mockEq = jest.fn().mockRejectedValue(new Error('Connection error'))
      const mockDelete = jest.fn().mockReturnValue({
        eq: mockEq,
      })
      ;(supabase.from as jest.Mock).mockReturnValue({
        delete: mockDelete,
      })

      await expect(deleteFile(testId)).rejects.toThrow('Connection error')
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