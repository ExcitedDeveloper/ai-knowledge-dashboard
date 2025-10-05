import store, { UploadedFile } from '../lib/store'
import { Request, Response } from 'express'
import { SearchQuery } from '../types/search'

const escapeRegex = (text: string): string => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const highlight = (excerpt: string, query: string): string => {
  // Case-insensitive regex for the query
  const regex = new RegExp('(' + escapeRegex(query) + ')', 'gi')

  // Replace matches with <mark>...</mark> for highlighting
  const highlighted = excerpt.replace(regex, '<mark>$1</mark>')

  return highlighted
}

const createExcerpt = (documentText: string, query: string): string => {
  // 1. Normalize text and query for case-insensitive search
  const lowerText = documentText.toLowerCase()
  const lowerQuery = query.toLowerCase()

  // 2. Find the first occurrence of the query in the text
  const index = lowerText.indexOf(lowerQuery)
  console.log('query', query, 'index', index)

  if (index == -1) {
    // If no match, return just the first ~200 characters as fallback
    return documentText.substring(0, 200) + '...'
  }

  // 3. Define how much text we want around the match
  const contextLength = 50 // characters before and after

  // 4. Calculate start and end positions
  const start = Math.max(0, index - contextLength)
  const end = Math.min(
    documentText.length,
    index + query.length + contextLength
  )

  // 5. Extract the substring
  let excerpt = documentText.substring(start, end)
  console.log('excerpt', excerpt)

  // 6. Add ellipses to show it's a partial snippet
  if (start > 0) {
    excerpt = '...' + excerpt
  }

  if (end < documentText.length) {
    excerpt = excerpt + '...'
  }

  // 7. (Optional) Highlight the matched query
  excerpt = highlight(excerpt, query)

  return excerpt
}

const countMatches = (text: string, query: string): number => {
  const regex = new RegExp(escapeRegex(query), 'gi')
  const matches = text.match(regex)
  return matches ? matches.length : 0
}

export type SearchResult = {
  filename: string
  excerpt: string
  matches: number
}

export const handleSearch = async (
  req: Request<{}, {}, {}, SearchQuery>,
  res: Response
): Promise<void> => {
  const query = req.query.q || ''
  console.log('Searching for:', query)

  // TODO : Rather than returining the entire file, return only relevant excerpts
  // See claude.ai for its implementation
  const files = store.files.reduce((acc: SearchResult[], file) => {
    if (file.text.includes(query)) {
      acc.push({
        filename: file.filename,
        excerpt: createExcerpt(file.text, query),
        matches: countMatches(file.text, query),
      })
    }
    return acc
  }, [])

  res.json(files)
}
