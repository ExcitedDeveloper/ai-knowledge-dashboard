import { Request, Response } from 'express'
import {
  handleSearch,
  SearchResult,
  escapeRegex,
  highlight,
  createExcerpt,
  countMatches,
} from './searchController'
import store, { UploadedFile } from '../lib/store'
import { SearchQuery } from '../types/search'
import { createEmbedding } from '../services/embeddingService'

// Mock the embedding service
jest.mock('../services/embeddingService')
const mockCreateEmbedding = createEmbedding as jest.MockedFunction<typeof createEmbedding>

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
    beforeEach(() => {
      mockCreateEmbedding.mockClear()
    })

    test('should return empty array when no files in store', async () => {
      store.files = []

      const req = {
        query: { q: 'test query' },
      } as Request<{}, {}, {}, SearchQuery>
      const res = mockResponse()

      await handleSearch(req, res)

      expect(res.json).toHaveBeenCalledWith([])
      expect(mockCreateEmbedding).not.toHaveBeenCalled()
    })

    test('should return results sorted by similarity (descending)', async () => {
      const mockFiles: UploadedFile[] = [
        {
          filename: 'low-match.pdf',
          text: 'JavaScript is great for web development',
          timestamp: Date.now(),
          embedding: [0.1, 0.2, 0.3],
        },
        {
          filename: 'high-match.pdf',
          text: 'Python is also great for backend development',
          timestamp: Date.now() + 1000,
          embedding: [0.9, 0.8, 0.7],
        },
        {
          filename: 'mid-match.pdf',
          text: 'Java is used for enterprise applications',
          timestamp: Date.now() + 2000,
          embedding: [0.5, 0.5, 0.5],
        },
      ]

      store.files = mockFiles
      mockCreateEmbedding.mockResolvedValue([1.0, 0.9, 0.8])

      const req = {
        query: { q: 'programming' },
      } as Request<{}, {}, {}, SearchQuery>
      const res = mockResponse()

      await handleSearch(req, res)

      const result = (res.json as jest.Mock).mock.calls[0][0]
      expect(result).toHaveLength(3)
      expect(result[0].similarity).toBeGreaterThanOrEqual(result[1].similarity)
      expect(result[1].similarity).toBeGreaterThanOrEqual(result[2].similarity)
      expect(result[0]).toHaveProperty('filename')
      expect(result[0]).toHaveProperty('similarity')
      expect(result[0]).toHaveProperty('excerpt')
    })

    test('should handle empty query', async () => {
      const req = {
        query: {},
      } as Request<{}, {}, {}, SearchQuery>
      const res = mockResponse()

      await handleSearch(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing or empty search query.' })
      expect(mockCreateEmbedding).not.toHaveBeenCalled()
    })

    test('should handle whitespace-only query', async () => {
      const req = {
        query: { q: '   ' },
      } as Request<{}, {}, {}, SearchQuery>
      const res = mockResponse()

      await handleSearch(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing or empty search query.' })
      expect(mockCreateEmbedding).not.toHaveBeenCalled()
    })

    test('should create excerpts with highlighted query terms', async () => {
      const mockFile: UploadedFile = {
        filename: 'test.pdf',
        text: 'This is some important content about testing',
        timestamp: Date.now(),
        embedding: [0.1, 0.2, 0.3],
      }

      store.files = [mockFile]
      mockCreateEmbedding.mockResolvedValue([0.1, 0.2, 0.3])

      const req = {
        query: { q: 'important' },
      } as Request<{}, {}, {}, SearchQuery>
      const res = mockResponse()

      await handleSearch(req, res)

      const result = (res.json as jest.Mock).mock.calls[0][0]
      expect(result[0].excerpt).toContain('<mark>important</mark>')
    })

    test('should handle files without embeddings', async () => {
      const mockFiles: UploadedFile[] = [
        {
          filename: 'with-embedding.pdf',
          text: 'Has embedding',
          timestamp: Date.now(),
          embedding: [0.1, 0.2, 0.3],
        },
        {
          filename: 'no-embedding.pdf',
          text: 'No embedding',
          timestamp: Date.now(),
          embedding: undefined,
        },
      ]

      store.files = mockFiles
      mockCreateEmbedding.mockResolvedValue([0.1, 0.2, 0.3])

      const req = {
        query: { q: 'test' },
      } as Request<{}, {}, {}, SearchQuery>
      const res = mockResponse()

      await handleSearch(req, res)

      const result = (res.json as jest.Mock).mock.calls[0][0]
      // File without embedding has similarity 0, filtered out by threshold
      expect(result).toHaveLength(1)
      expect(result.find((r: { filename: string }) => r.filename === 'no-embedding.pdf')).toBeUndefined()
    })

    test('should handle embedding dimension mismatch', async () => {
      const mockFile: UploadedFile = {
        filename: 'wrong-dimensions.pdf',
        text: 'Test content',
        timestamp: Date.now(),
        embedding: [0.1, 0.2], // 2 dimensions
      }

      store.files = [mockFile]
      mockCreateEmbedding.mockResolvedValue([0.1, 0.2, 0.3]) // 3 dimensions

      const req = {
        query: { q: 'test' },
      } as Request<{}, {}, {}, SearchQuery>
      const res = mockResponse()

      await handleSearch(req, res)

      const result = (res.json as jest.Mock).mock.calls[0][0]
      // File with dimension mismatch has similarity 0, filtered out by threshold
      expect(result).toHaveLength(0)
    })

    test('should handle embedding service failure', async () => {
      const mockFile: UploadedFile = {
        filename: 'test.pdf',
        text: 'Some content',
        timestamp: Date.now(),
        embedding: [0.1, 0.2, 0.3],
      }

      store.files = [mockFile]
      mockCreateEmbedding.mockRejectedValue(new Error('API error'))

      const req = {
        query: { q: 'test' },
      } as Request<{}, {}, {}, SearchQuery>
      const res = mockResponse()

      await handleSearch(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to process search query. Please try again.'
      })
    })

    test('should handle invalid embedding format from service', async () => {
      const mockFile: UploadedFile = {
        filename: 'test.pdf',
        text: 'Some content',
        timestamp: Date.now(),
        embedding: [0.1, 0.2, 0.3],
      }

      store.files = [mockFile]
      mockCreateEmbedding.mockResolvedValue([] as number[])

      const req = {
        query: { q: 'test' },
      } as Request<{}, {}, {}, SearchQuery>
      const res = mockResponse()

      await handleSearch(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to process search query. Please try again.'
      })
    })

    test('should create excerpts with ellipsis for long documents', async () => {
      const longText = 'This is a very long document with lots of content. ' +
                       'Somewhere in the middle we have the important keyword that we are searching for. ' +
                       'And then there is more content after the keyword.'

      const mockFile: UploadedFile = {
        filename: 'long.pdf',
        text: longText,
        timestamp: Date.now(),
        embedding: [0.1, 0.2, 0.3],
      }

      store.files = [mockFile]
      mockCreateEmbedding.mockResolvedValue([0.1, 0.2, 0.3])

      const req = {
        query: { q: 'keyword' },
      } as Request<{}, {}, {}, SearchQuery>
      const res = mockResponse()

      await handleSearch(req, res)

      const result = (res.json as jest.Mock).mock.calls[0][0]
      expect(result[0].excerpt).toContain('...')
      expect(result[0].excerpt).toContain('<mark>keyword</mark>')
    })

    test('should filter out results below 0.25 similarity threshold', async () => {
      const mockFiles: UploadedFile[] = [
        {
          filename: 'high-similarity.pdf',
          text: 'Highly relevant content',
          timestamp: Date.now(),
          embedding: [1.0, 0.9, 0.8], // Will have high similarity
        },
        {
          filename: 'medium-similarity.pdf',
          text: 'Somewhat relevant content',
          timestamp: Date.now() + 1000,
          embedding: [0.3, 0.3, 0.3], // Will have medium similarity
        },
        {
          filename: 'low-similarity.pdf',
          text: 'Not very relevant',
          timestamp: Date.now() + 2000,
          embedding: [-0.5, -0.5, -0.5], // Will have low similarity (negative, opposite direction)
        },
      ]

      store.files = mockFiles
      mockCreateEmbedding.mockResolvedValue([1.0, 0.9, 0.8])

      const req = {
        query: { q: 'test query' },
      } as Request<{}, {}, {}, SearchQuery>
      const res = mockResponse()

      await handleSearch(req, res)

      const result = (res.json as jest.Mock).mock.calls[0][0]

      // Verify all returned results have similarity >= 0.25
      result.forEach((item: { similarity: number }) => {
        expect(item.similarity).toBeGreaterThanOrEqual(0.25)
      })

      // Verify low-similarity file is not in results
      const lowSimilarityFile = result.find((r: { filename: string }) => r.filename === 'low-similarity.pdf')
      expect(lowSimilarityFile).toBeUndefined()
    })
  })

  describe('escapeRegex', () => {
    test('should escape special regex characters', () => {
      const input = 'test.with*special?chars'
      const result = escapeRegex(input)
      expect(result).toBe('test\\.with\\*special\\?chars')
    })

    test('should escape all regex metacharacters', () => {
      const input = '.*+?^${}()|[]\\/'
      const result = escapeRegex(input)
      expect(result).toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\\/')
    })

    test('should not modify regular text', () => {
      const input = 'regular text without special chars'
      const result = escapeRegex(input)
      expect(result).toBe('regular text without special chars')
    })

    test('should handle empty string', () => {
      const result = escapeRegex('')
      expect(result).toBe('')
    })

    test('should handle parentheses correctly', () => {
      const input = 'function(param)'
      const result = escapeRegex(input)
      expect(result).toBe('function\\(param\\)')
    })

    test('should handle square brackets correctly', () => {
      const input = 'array[0]'
      const result = escapeRegex(input)
      expect(result).toBe('array\\[0\\]')
    })
  })

  describe('highlight', () => {
    test('should wrap query matches with <mark> tags', () => {
      const excerpt = 'This is a test string'
      const query = 'test'
      const result = highlight(excerpt, query)
      expect(result).toBe('This is a <mark>test</mark> string')
    })

    test('should handle case-insensitive matching', () => {
      const excerpt = 'Test TEST test'
      const query = 'test'
      const result = highlight(excerpt, query)
      expect(result).toBe('<mark>Test</mark> <mark>TEST</mark> <mark>test</mark>')
    })

    test('should handle multiple occurrences', () => {
      const excerpt = 'test and test again'
      const query = 'test'
      const result = highlight(excerpt, query)
      expect(result).toBe('<mark>test</mark> and <mark>test</mark> again')
    })

    test('should handle special regex characters in query', () => {
      const excerpt = 'What is 2+2?'
      const query = '2+2'
      const result = highlight(excerpt, query)
      expect(result).toBe('What is <mark>2+2</mark>?')
    })

    test('should not modify text when query is not found', () => {
      const excerpt = 'This is a test'
      const query = 'notfound'
      const result = highlight(excerpt, query)
      expect(result).toBe('This is a test')
    })

    test('should handle empty query', () => {
      const excerpt = 'Some text'
      const query = ''
      const result = highlight(excerpt, query)
      // Empty query will wrap every character with <mark></mark>
      expect(result.length).toBeGreaterThan(excerpt.length)
    })
  })

  describe('createExcerpt', () => {
    test('should create excerpt with context around query', () => {
      const text = 'The quick brown fox jumps over the lazy dog'
      const query = 'fox'
      const result = createExcerpt(text, query)
      expect(result).toContain('quick brown <mark>fox</mark> jumps over')
    })

    test('should add leading ellipsis when match is not at start', () => {
      const text = 'A'.repeat(100) + 'keyword' + 'B'.repeat(100)
      const query = 'keyword'
      const result = createExcerpt(text, query)
      expect(result).toMatch(/^\.\.\./)
    })

    test('should add trailing ellipsis when match is not at end', () => {
      const text = 'keyword' + 'A'.repeat(200)
      const query = 'keyword'
      const result = createExcerpt(text, query)
      expect(result).toMatch(/\.\.\.$/)
    })

    test('should handle query at the beginning of text', () => {
      const text = 'keyword at the start of a longer text that continues'
      const query = 'keyword'
      const result = createExcerpt(text, query)
      expect(result).not.toMatch(/^\.\.\./)
      expect(result).toContain('<mark>keyword</mark>')
    })

    test('should handle query at the end of text', () => {
      const text = 'This is a longer text that ends with keyword'
      const query = 'keyword'
      const result = createExcerpt(text, query)
      expect(result).not.toMatch(/\.\.\.$/)
      expect(result).toContain('<mark>keyword</mark>')
    })

    test('should return first 200 chars when query not found', () => {
      const text = 'A'.repeat(300)
      const query = 'notfound'
      const result = createExcerpt(text, query)
      expect(result).toHaveLength(203) // 200 + '...'
      expect(result).toMatch(/\.\.\.$/)
    })

    test('should handle short text without query', () => {
      const text = 'Short text'
      const query = 'notfound'
      const result = createExcerpt(text, query)
      expect(result).toBe('Short text...')
    })

    test('should handle case-insensitive search', () => {
      const text = 'The KEYWORD is in uppercase'
      const query = 'keyword'
      const result = createExcerpt(text, query)
      expect(result).toContain('<mark>KEYWORD</mark>')
    })

    test('should handle very short text with match', () => {
      const text = 'word'
      const query = 'word'
      const result = createExcerpt(text, query)
      expect(result).toBe('<mark>word</mark>')
    })
  })

  describe('countMatches', () => {
    test('should count single occurrence', () => {
      const text = 'This is a test string'
      const query = 'test'
      const result = countMatches(text, query)
      expect(result).toBe(1)
    })

    test('should count multiple occurrences', () => {
      const text = 'test test test'
      const query = 'test'
      const result = countMatches(text, query)
      expect(result).toBe(3)
    })

    test('should be case-insensitive', () => {
      const text = 'Test TEST test'
      const query = 'test'
      const result = countMatches(text, query)
      expect(result).toBe(3)
    })

    test('should return 0 when no matches found', () => {
      const text = 'This is a string'
      const query = 'notfound'
      const result = countMatches(text, query)
      expect(result).toBe(0)
    })

    test('should handle special regex characters', () => {
      const text = '2+2=4 and 3+3=6'
      const query = '2+2'
      const result = countMatches(text, query)
      expect(result).toBe(1)
    })

    test('should handle empty query', () => {
      const text = 'Some text'
      const query = ''
      const result = countMatches(text, query)
      // Empty string matches every position in the string
      expect(result).toBeGreaterThan(0)
    })

    test('should count overlapping pattern occurrences correctly', () => {
      const text = 'aaaa'
      const query = 'aa'
      const result = countMatches(text, query)
      // Non-overlapping matches: 'aa' appears 2 times
      expect(result).toBe(2)
    })
  })
})