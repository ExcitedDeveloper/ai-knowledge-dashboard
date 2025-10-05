import { SearchQuery } from './search'

describe('SearchQuery interface', () => {
  test('should allow optional query parameter', () => {
    // Test that SearchQuery interface is properly typed
    const validQuery1: SearchQuery = { q: 'test' }
    const validQuery2: SearchQuery = {}
    const validQuery3: SearchQuery = { q: undefined }

    expect(validQuery1.q).toBe('test')
    expect(validQuery2.q).toBeUndefined()
    expect(validQuery3.q).toBeUndefined()
  })

  test('should handle string values for query', () => {
    const query: SearchQuery = { q: 'javascript testing' }

    expect(typeof query.q).toBe('string')
    expect(query.q).toContain('javascript')
    expect(query.q).toContain('testing')
  })

  test('should handle empty string query', () => {
    const query: SearchQuery = { q: '' }

    expect(query.q).toBe('')
    expect(typeof query.q).toBe('string')
  })
})