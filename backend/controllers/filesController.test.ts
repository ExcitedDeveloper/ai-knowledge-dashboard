import { addFile, getFiles } from './filesController'
import store, { UploadedFile } from '../lib/store'

describe('filesController', () => {
  beforeEach(() => {
    // Clear store before each test
    store.files = []
  })

  describe('addFile', () => {
    test('should add a file to the store', () => {
      const mockFile: UploadedFile = {
        filename: 'test.pdf',
        text: 'Test content',
        timestamp: Date.now(),
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
      }

      const mockFile2: UploadedFile = {
        filename: 'test2.pdf',
        text: 'Test content 2',
        timestamp: Date.now() + 1000,
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
        },
        {
          filename: 'test2.pdf',
          text: 'Test content 2',
          timestamp: Date.now() + 1000,
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
      }

      addFile(mockFile)
      const files = getFiles()

      expect(files).toBe(store.files)
    })
  })
})