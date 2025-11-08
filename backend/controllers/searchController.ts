/**
 * Search Controller
 *
 * Handles text-based search functionality for uploaded files.
 * Provides utilities for query matching, excerpt creation, and highlighting.
 */

import { UploadedFile } from '../lib/store.js'
import { Request, Response } from 'express'
import { SearchQuery } from '../types/search.js'
import { logInfo, logError } from '../utils/logger.js'
import { createEmbedding } from '../services/embeddingService.js'
import { cosineSimilarity } from '../utils/math.js'
import { supabase } from '../supabase/supabaseClient.js'

/**
 * Escapes special regular expression characters in a string
 * @param text - The text to escape
 * @returns The escaped text safe for use in regex patterns
 */
export const escapeRegex = (text: string): string => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Highlights all occurrences of the search query in an excerpt
 * @param excerpt - The text excerpt to highlight
 * @param query - The search query to highlight
 * @returns The excerpt with matched terms wrapped in <mark> tags
 */
export const highlight = (excerpt: string, query: string): string => {
  // Case-insensitive regex for the query
  const regex = new RegExp('(' + escapeRegex(query) + ')', 'gi')

  // Replace matches with <mark>...</mark> for highlighting
  const highlighted = excerpt.replace(regex, '<mark>$1</mark>')

  return highlighted
}

/**
 * Creates a contextual excerpt from a document containing the search query
 * @param documentText - The full document text
 * @param query - The search query to find
 * @returns An excerpt centered around the first match, with highlighting, or the first 200 chars if no match
 */
export const createExcerpt = (documentText: string, query: string): string => {
  // 1. Normalize text and query for case-insensitive search
  const lowerText = documentText.toLowerCase()
  const lowerQuery = query.toLowerCase()

  // 2. Find the first occurrence of the query in the text
  const index = lowerText.indexOf(lowerQuery)

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

/**
 * Counts the number of times a query appears in the text (case-insensitive)
 * @param text - The text to search in
 * @param query - The search query to count
 * @returns The number of matches found
 */
export const countMatches = (text: string, query: string): number => {
  const regex = new RegExp(escapeRegex(query), 'gi')
  const matches = text.match(regex)
  return matches ? matches.length : 0
}

/**
 * Represents a single search result
 */
export type SearchResult = {
  /** The name of the file containing matches */
  filename: string
  /** A contextual excerpt with highlighted matches */
  excerpt: string
  /** The number of times the query appears in the file */
  matches: number
}

/**
 * Handles search requests for uploaded files
 * Searches through all stored files for matches and returns results with excerpts
 * @param req - Express request with search query in query params
 * @param res - Express response containing search results or error
 */
export const handleSearch = async (
  req: Request<{}, {}, {}, SearchQuery>,
  res: Response
): Promise<void> => {
  // Validate that a non-empty search query was provided
  if (!req.query.q || req.query.q.trim() === '') {
    res.status(400).json({ error: 'Missing or empty search query.' })
    return
  }

  try {
    const query = req.query.q
    logInfo(`Search query: "${query}"`)

    // Fetch all files from Supabase
    const { data: files, error: fetchError } = await supabase
      .from('files')
      .select('*')

    if (fetchError) {
      logError('Failed to fetch files from Supabase', fetchError)
      res.status(500).json({ error: 'Failed to retrieve files for search' })
      return
    }

    // Return empty results if no files have been uploaded yet
    if (!files || files.length === 0) {
      res.json({ results: [], message: 'No documents available to search' })
      return
    }

    // Generate embedding for the query using Cohere
    let queryEmbedding: number[]
    try {
      queryEmbedding = await createEmbedding(query)

      // Validate embedding format
      if (!Array.isArray(queryEmbedding) || queryEmbedding.length === 0) {
        throw new Error('Invalid embedding format received from service')
      }
    } catch (embeddingError) {
      logError('Failed to generate query embedding', embeddingError)
      res.status(500).json({
        error: 'Failed to process search query. Please try again.'
      })
      return
    }

    // Compare query embedding with all stored file embeddings
    const results = files.map((file) => {
      // Guard against missing embeddings
      if (!file.embedding) {
        logError(`File "${file.filename}" has no embedding - skipping`)
        return { filename: file.filename, similarity: 0, excerpt: '', matches: 0 }
      }

      // Parse embedding if it's a string (Supabase returns vectors as strings)
      const embedding = typeof file.embedding === 'string'
        ? JSON.parse(file.embedding)
        : file.embedding

      // Validate embedding dimensions match
      if (embedding.length !== queryEmbedding.length) {
        logError(
          `Embedding dimension mismatch for file "${file.filename}": ` +
          `expected ${queryEmbedding.length}, got ${embedding.length}`
        )
        return { filename: file.filename, similarity: 0, excerpt: '', matches: 0 }
      }

      const similarity = cosineSimilarity(queryEmbedding, embedding)
      const content = file.content || ''
      const matches = countMatches(content, query)

      return {
        filename: file.filename,
        similarity,
        excerpt: createExcerpt(content, query),
        matches,
      }
    })

    // Sort results by similarity score (descending - highest similarity first)
    // Filter out results below the 0.25 similarity threshold
    const filteredResults = results
      .sort((a, b) => b.similarity - a.similarity)
      .filter(result => result.similarity >= 0.25)
      .map(({ filename, excerpt, matches }) => ({ filename, excerpt, matches }))

    // Return results with optional message
    if (filteredResults.length === 0) {
      res.json({
        results: [],
        message: `No results found for '${query}'`
      })
    } else {
      res.json({ results: filteredResults })
    }
  } catch (error) {
    // Log and return a 500 error if anything unexpected happens
    logError('Search failed: Unexpected error', error)
    res
      .status(500)
      .json({ error: 'An unexpected error occurred during search.' })
  }
}
