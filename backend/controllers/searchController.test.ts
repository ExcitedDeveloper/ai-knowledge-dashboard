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

      expect(res.json).toHaveBeenCalledWith({
        results: [],
        message: 'No matches found for query.',
      })
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

      const expectedResult = {
        results: [{
          filename: 'test.pdf',
          excerpt: expect.stringContaining('<mark>important</mark>'),
          matches: 1,
        }],
      }

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

      // Empty query should return error
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing or empty search query.' })
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
      expect(result.results).toHaveLength(2)
      expect(result.results[0].filename).toBe('file1.pdf')
      expect(result.results[1].filename).toBe('file2.pdf')
      expect(result.message).toBeUndefined()
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
      expect(result.results).toHaveLength(1)
      expect(result.results[0].matches).toBe(3)
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
      expect(result.results[0].excerpt).toContain('...')
      expect(result.results[0].excerpt).toContain('<mark>keyword</mark>')
    })

    test('should include message when no matches found', async () => {
      const mockFiles: UploadedFile[] = [
        {
          filename: 'file1.pdf',
          text: 'JavaScript is great',
          timestamp: Date.now(),
        },
        {
          filename: 'file2.pdf',
          text: 'Python is awesome',
          timestamp: Date.now() + 1000,
        },
      ]

      store.files = mockFiles

      const req = {
        query: { q: 'nonexistent' },
      } as Request<{}, {}, {}, SearchQuery>
      const res = mockResponse()

      await handleSearch(req, res)

      const result = (res.json as jest.Mock).mock.calls[0][0]
      expect(result.results).toHaveLength(0)
      expect(result.message).toBe('No matches found for query.')
    })

    test('should not include message when matches are found', async () => {
      const mockFile: UploadedFile = {
        filename: 'test.pdf',
        text: 'This has a match',
        timestamp: Date.now(),
      }

      store.files = [mockFile]

      const req = {
        query: { q: 'match' },
      } as Request<{}, {}, {}, SearchQuery>
      const res = mockResponse()

      await handleSearch(req, res)

      const result = (res.json as jest.Mock).mock.calls[0][0]
      expect(result.results).toHaveLength(1)
      expect(result.message).toBeUndefined()
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