import { uploadFile, getFiles, searchFiles } from './api'

// Mock fetch globally
global.fetch = jest.fn()

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('uploadFile', () => {
    it('should upload a file successfully', async () => {
      const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' })
      const mockResponse = {
        filename: 'test.txt',
        text: 'test content',
        embedding: [0.1, 0.2, 0.3],
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await uploadFile(mockFile)

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/upload',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('should throw an error when upload fails', async () => {
      const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' })

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Invalid file type' }),
      })

      await expect(uploadFile(mockFile)).rejects.toThrow('Invalid file type')
    })

    it('should handle network errors', async () => {
      const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' })

      ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      await expect(uploadFile(mockFile)).rejects.toThrow('Network error')
    })
  })

  describe('getFiles', () => {
    it('should fetch files successfully', async () => {
      const mockFiles = [
        {
          filename: 'test1.txt',
          text: 'content 1',
          timestamp: 1234567890,
          embedding: [0.1, 0.2],
        },
        {
          filename: 'test2.txt',
          text: 'content 2',
          timestamp: 1234567891,
          embedding: [0.3, 0.4],
        },
      ]

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockFiles,
      })

      const result = await getFiles()

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/files')
      expect(result).toEqual(mockFiles)
    })

    it('should throw an error when fetching files fails', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Server error' }),
      })

      await expect(getFiles()).rejects.toThrow('Server error')
    })
  })

  describe('searchFiles', () => {
    it('should search files successfully', async () => {
      const mockSearchResults = {
        results: [
          {
            filename: 'test.txt',
            excerpt: 'This is a <mark>test</mark>',
            matches: 1,
          },
        ],
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSearchResults,
      })

      const result = await searchFiles('test')

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/search?q=test'
      )
      expect(result).toEqual(mockSearchResults)
    })

    it('should return empty results for empty query', async () => {
      const result = await searchFiles('')

      expect(fetch).not.toHaveBeenCalled()
      expect(result).toEqual({
        results: [],
        message: 'Please enter a search query',
      })
    })

    it('should return empty results for whitespace-only query', async () => {
      const result = await searchFiles('   ')

      expect(fetch).not.toHaveBeenCalled()
      expect(result).toEqual({
        results: [],
        message: 'Please enter a search query',
      })
    })

    it('should encode special characters in query', async () => {
      const mockSearchResults = {
        results: [],
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSearchResults,
      })

      await searchFiles('test & special')

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/search?q=test%20%26%20special'
      )
    })

    it('should throw an error when search fails', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Invalid query' }),
      })

      await expect(searchFiles('test')).rejects.toThrow('Invalid query')
    })
  })
})
