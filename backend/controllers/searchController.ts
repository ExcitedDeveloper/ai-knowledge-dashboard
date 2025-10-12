import store, { UploadedFile } from '../lib/store'
import { Request, Response } from 'express'
import { SearchQuery } from '../types/search'

export const escapeRegex = (text: string): string => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const highlight = (excerpt: string, query: string): string => {
  // Case-insensitive regex for the query
  const regex = new RegExp('(' + escapeRegex(query) + ')', 'gi')

  // Replace matches with <mark>...</mark> for highlighting
  const highlighted = excerpt.replace(regex, '<mark>$1</mark>')

  return highlighted
}

export const createExcerpt = (documentText: string, query: string): string => {
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

export const countMatches = (text: string, query: string): number => {
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
  if (!req.query.q || req.query.q.trim() === '') {
    res.status(400).json({ error: 'Missing or empty search query.' })
    return
  }

  if (store.files.length <= 0) {
    res.json([])
    return
  }

  try {
    const query = req.query.q

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

    const response: { results: SearchResult[]; message?: string } = {
      results: files,
    }

    if (files.length === 0) {
      response.message = 'No matches found for query.'
    }

    res.json(response)
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An unexpected error occurred during search.' })
  }
}
