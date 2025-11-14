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
  // Log incoming request details for debugging
  logInfo('=== SEARCH REQUEST RECEIVED ===', {
    method: req.method,
    url: req.url,
    query: req.query,
    headers: {
      origin: req.headers.origin,
      host: req.headers.host,
      userAgent: req.headers['user-agent'],
      contentType: req.headers['content-type'],
      referer: req.headers.referer
    },
    ip: req.ip || req.socket.remoteAddress,
    timestamp: new Date().toISOString()
  })

  // Validate that a non-empty search query was provided
  if (!req.query.q || req.query.q.trim() === '') {
    logError('Search validation failed: Missing or empty query')
    res.status(400).json({ error: 'Missing or empty search query.' })
    return
  }

  try {
    const query = req.query.q
    logInfo(`Search query: "${query}"`)

    // Fetch all files from Supabase
    logInfo('Attempting to fetch files from Supabase...', {
      supabaseConfigured: !!supabase,
      tableName: 'files'
    })

    const { data: files, error: fetchError } = await supabase
      .from('files')
      .select('*')

    if (fetchError) {
      logError('Failed to fetch files from Supabase', {
        error: fetchError,
        code: fetchError.code,
        message: fetchError.message,
        details: fetchError.details,
        hint: fetchError.hint
      })
      res.status(500).json({ error: 'Failed to retrieve files for search' })
      return
    }

    logInfo('Successfully fetched files from Supabase', {
      fileCount: files?.length || 0,
      hasFiles: !!files && files.length > 0
    })

    // Return empty results if no files have been uploaded yet
    if (!files || files.length === 0) {
      logInfo('No files found in database')
      res.json({ results: [], message: 'No documents available to search' })
      return
    }

    logInfo(`Found ${files.length} file(s) to search through`)

    // Generate embedding for the query using Cohere
    let queryEmbedding: number[]
    try {
      logInfo('Generating embedding for search query...', {
        queryLength: query.length,
        queryPreview: query.substring(0, 50)
      })
      queryEmbedding = await createEmbedding(query)

      // Validate embedding format
      if (!Array.isArray(queryEmbedding) || queryEmbedding.length === 0) {
        throw new Error('Invalid embedding format received from service')
      }
      logInfo(`Query embedding generated successfully (dimension: ${queryEmbedding.length})`)
    } catch (embeddingError) {
      logError('Failed to generate query embedding', {
        error: embeddingError,
        errorType: embeddingError instanceof Error ? embeddingError.constructor.name : typeof embeddingError,
        errorMessage: embeddingError instanceof Error ? embeddingError.message : String(embeddingError),
        errorStack: embeddingError instanceof Error ? embeddingError.stack : undefined
      })
      res.status(500).json({
        error: 'Failed to process search query. Please try again.'
      })
      return
    }

    // Compare query embedding with all stored file embeddings
    logInfo('Calculating similarity scores for all files...')
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

      logInfo(
        `File: "${file.filename}" | Similarity: ${similarity.toFixed(4)} | Matches: ${matches}`
      )

      return {
        filename: file.filename,
        similarity,
        excerpt: createExcerpt(content, query),
        matches,
      }
    })

    // Sort results by similarity score (descending - highest similarity first)
    // Filter out results below the 0.25 similarity threshold
    const sortedResults = results.sort((a, b) => b.similarity - a.similarity)
    logInfo(`Results before filtering (threshold: 0.25): ${sortedResults.length}`)

    const filteredResults = sortedResults
      .filter(result => result.similarity >= 0.25)
      .map(({ filename, excerpt, matches }) => ({ filename, excerpt, matches }))

    logInfo(`Results after filtering: ${filteredResults.length}`)

    // Return results with optional message
    if (filteredResults.length === 0) {
      logInfo(`No results found for query: "${query}"`)
      const responsePayload = {
        results: [],
        message: `No results found for '${query}'`
      }
      logInfo('Sending empty results response', { payload: responsePayload })
      res.json(responsePayload)
      logInfo('Response sent successfully')
    } else {
      logInfo(
        `Returning ${filteredResults.length} result(s) for query: "${query}"`,
        { filenames: filteredResults.map(r => r.filename) }
      )
      const responsePayload = { results: filteredResults }
      logInfo('Sending search results response', {
        resultCount: filteredResults.length,
        payloadSize: JSON.stringify(responsePayload).length
      })
      res.json(responsePayload)
      logInfo('Response sent successfully')
    }
  } catch (error) {
    // Log and return a 500 error if anything unexpected happens
    logError('Search failed: Unexpected error', {
      error,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined
    })
    res
      .status(500)
      .json({ error: 'An unexpected error occurred during search.' })
  }
}
