import { Request, Response } from 'express'
import { handleSearch, SearchResult } from './searchController'
import store, { UploadedFile } from '../lib/store'
import { SearchQuery } from '../types/search'

// Mock response object
const mockResponse = () => {
  const res: Partial<Response> = {
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
  }
  return res as Response
}

describe('searchController', () => {
  beforeEach(() => {
    // Clear store before each test
    store.files = []
    jest.clearAllMocks()
  })

  describe('handleSearch', () => {
    test('should return empty array when no files match query', async () => {
      const mockFile: UploadedFile = {
        filename: 'test.pdf',
        text: 'This is some content',
        timestamp: Date.now(),
      }

      store.files = [mockFile]

      const req = {
        query: { q: 'nonexistent' },
      } as Request<{}, {}, {}, SearchQuery>
      const res = mockResponse()

      await handleSearch(req, res)

      expect(res.json).toHaveBeenCalledWith([])
    })

    test('should return matching files with excerpts', async () => {
      const mockFile: UploadedFile = {
        filename: 'test.pdf',
        text: 'This is some important content about testing',
        timestamp: Date.now(),
      }

      store.files = [mockFile]

      const req = {
        query: { q: 'important' },
      } as Request<{}, {}, {}, SearchQuery>
      const res = mockResponse()

      await handleSearch(req, res)

      const expectedResult: SearchResult[] = [{
        filename: 'test.pdf',
        excerpt: expect.stringContaining('<mark>important</mark>'),
        matches: 1,
      }]

      expect(res.json).toHaveBeenCalledWith(expectedResult)
    })

    test('should handle empty query', async () => {
      const mockFile: UploadedFile = {
        filename: 'test.pdf',
        text: 'Some content',
        timestamp: Date.now(),
      }

      store.files = [mockFile]

      const req = {
        query: {},
      } as Request<{}, {}, {}, SearchQuery>
      const res = mockResponse()

      await handleSearch(req, res)

      // Empty query should return the file
      const result = (res.json as jest.Mock).mock.calls[0][0]
      expect(result).toHaveLength(1)
      expect(result[0].filename).toBe('test.pdf')
      expect(result[0].excerpt).toContain('S') // Check for partial content since it gets highlighted
    })

    test('should handle multiple files with matches', async () => {
      const mockFiles: UploadedFile[] = [
        {
          filename: 'file1.pdf',
          text: 'JavaScript is great for web development',
          timestamp: Date.now(),
        },
        {
          filename: 'file2.pdf',
          text: 'Python is also great for backend development',
          timestamp: Date.now() + 1000,
        },
        {
          filename: 'file3.pdf',
          text: 'Java is used for enterprise applications',
          timestamp: Date.now() + 2000,
        },
      ]

      store.files = mockFiles

      const req = {
        query: { q: 'great' },
      } as Request<{}, {}, {}, SearchQuery>
      const res = mockResponse()

      await handleSearch(req, res)

      const result = (res.json as jest.Mock).mock.calls[0][0]
      expect(result).toHaveLength(2)
      expect(result[0].filename).toBe('file1.pdf')
      expect(result[1].filename).toBe('file2.pdf')
    })

    test('should handle case-insensitive search', async () => {
      const mockFile: UploadedFile = {
        filename: 'test.pdf',
        text: 'JavaScript and JAVASCRIPT and javascript',
        timestamp: Date.now(),
      }

      store.files = [mockFile]

      const req = {
        query: { q: 'javascript' },
      } as Request<{}, {}, {}, SearchQuery>
      const res = mockResponse()

      await handleSearch(req, res)

      const result = (res.json as jest.Mock).mock.calls[0][0]
      expect(result).toHaveLength(1)
      expect(result[0].matches).toBe(3)
    })

    test('should create proper excerpts with context', async () => {
      const longText = 'This is a very long document with lots of content. ' +
                       'Somewhere in the middle we have the important keyword that we are searching for. ' +
                       'And then there is more content after the keyword.'

      const mockFile: UploadedFile = {
        filename: 'long.pdf',
        text: longText,
        timestamp: Date.now(),
      }

      store.files = [mockFile]

      const req = {
        query: { q: 'keyword' },
      } as Request<{}, {}, {}, SearchQuery>
      const res = mockResponse()

      await handleSearch(req, res)

      const result = (res.json as jest.Mock).mock.calls[0][0]
      expect(result[0].excerpt).toContain('...')
      expect(result[0].excerpt).toContain('<mark>keyword</mark>')
    })
  })
})