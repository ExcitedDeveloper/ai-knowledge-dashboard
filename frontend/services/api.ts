import type { UploadResponse, UploadedFile, SearchResponse } from '../types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Upload a file to the backend
 */
export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const startTime = Date.now()
  console.log('[Upload] Starting file upload:', {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    apiUrl: `${API_BASE_URL}/api/upload`,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  })

  const formData = new FormData()
  formData.append('file', file)

  console.log('[Upload] FormData created, sending request to backend...')

  try {
    console.log('[Upload] Fetch initiated at:', new Date().toISOString())
    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    })
    const fetchTime = Date.now() - startTime

    console.log('[Upload] Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      fetchDuration: `${fetchTime}ms`,
      headers: Object.fromEntries(response.headers.entries()),
      url: response.url,
      redirected: response.redirected,
      type: response.type
    })

    if (!response.ok) {
      let errorData
      const contentType = response.headers.get('content-type')
      console.error('[Upload] Failed response content-type:', contentType)

      try {
        const responseText = await response.text()
        console.error('[Upload] Raw error response:', responseText)
        errorData = responseText ? JSON.parse(responseText) : { error: 'Unknown error' }
      } catch (parseError) {
        console.error('[Upload] Failed to parse error response:', parseError)
        errorData = { error: 'Unable to parse error response' }
      }

      console.error('[Upload] Upload failed:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        duration: `${fetchTime}ms`
      })
      throw new ApiError(errorData.error || 'Upload failed', response.status)
    }

    const result = await response.json()
    const totalTime = Date.now() - startTime
    console.log('[Upload] Upload successful:', {
      fileName: result.filename,
      textLength: result.text?.length || 0,
      hasEmbedding: !!result.embedding,
      totalDuration: `${totalTime}ms`
    })

    return result
  } catch (error) {
    const totalTime = Date.now() - startTime
    console.error('[Upload] Error occurred:', {
      error,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      duration: `${totalTime}ms`,
      isApiError: error instanceof ApiError,
      statusCode: error instanceof ApiError ? error.statusCode : undefined
    })
    throw error
  }
}

/**
 * Get all uploaded files
 */
export const getFiles = async (): Promise<UploadedFile[]> => {
  const response = await fetch(`${API_BASE_URL}/api/files`)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new ApiError(errorData.error || 'Failed to fetch files', response.status)
  }

  return response.json()
}

/**
 * Search files by query
 */
export const searchFiles = async (query: string): Promise<SearchResponse> => {
  const startTime = Date.now()
  console.log('[Search] ========== SEARCH REQUEST STARTED ==========')
  console.log('[Search] Environment Info:', {
    API_BASE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NODE_ENV: process.env.NODE_ENV,
    windowLocation: typeof window !== 'undefined' ? window.location.href : 'SSR',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
    onLine: typeof navigator !== 'undefined' ? navigator.onLine : 'N/A'
  })
  console.log('[Search] Starting search request:', {
    query,
    queryLength: query.length,
    apiUrl: `${API_BASE_URL}/api/search`,
    fullUrl: `${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  })

  if (!query.trim()) {
    console.log('[Search] Empty query provided, returning early')
    return { results: [], message: 'Please enter a search query' }
  }

  console.log('[Search] Validating API configuration...')
  if (!API_BASE_URL) {
    console.error('[Search] CRITICAL: API_BASE_URL is not configured!')
    throw new Error('API_BASE_URL is not configured')
  }
  console.log('[Search] API configuration valid, sending request to backend...')

  try {
    const fullUrl = `${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`
    console.log('[Search] Fetch initiated at:', new Date().toISOString())
    console.log('[Search] Full request URL:', fullUrl)
    console.log('[Search] Fetch options:', {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit'
    })

    const response = await fetch(fullUrl)
    const fetchTime = Date.now() - startTime
    console.log('[Search] Fetch completed in', fetchTime, 'ms')

    console.log('[Search] Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      fetchDuration: `${fetchTime}ms`,
      headers: Object.fromEntries(response.headers.entries()),
      url: response.url,
      redirected: response.redirected,
      type: response.type
    })

    if (!response.ok) {
      let errorData
      const contentType = response.headers.get('content-type')
      console.error('[Search] ❌ Request failed with status:', response.status)
      console.error('[Search] Failed response details:', {
        status: response.status,
        statusText: response.statusText,
        contentType,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url,
        redirected: response.redirected
      })

      try {
        const responseText = await response.text()
        console.error('[Search] Raw error response body:', responseText)
        console.error('[Search] Response body length:', responseText.length)
        errorData = responseText ? JSON.parse(responseText) : { error: 'Unknown error' }
        console.error('[Search] Parsed error data:', errorData)
      } catch (parseError) {
        console.error('[Search] Failed to parse error response:', {
          parseError,
          errorType: parseError instanceof Error ? parseError.constructor.name : typeof parseError,
          errorMessage: parseError instanceof Error ? parseError.message : String(parseError)
        })
        errorData = { error: 'Unable to parse error response' }
      }

      console.error('[Search] ❌ Search request failed:', {
        query,
        status: response.status,
        statusText: response.statusText,
        errorData,
        duration: `${fetchTime}ms`,
        url: fullUrl
      })
      throw new ApiError(errorData.error || 'Search failed', response.status)
    }

    console.log('[Search] Parsing JSON response...')
    const result = await response.json()
    const totalTime = Date.now() - startTime

    console.log('[Search] ✅ Search completed successfully!')
    console.log('[Search] Response data:', {
      query,
      resultCount: result.results?.length || 0,
      hasMessage: !!result.message,
      message: result.message,
      totalDuration: `${totalTime}ms`,
      fetchDuration: `${fetchTime}ms`,
      parsingDuration: `${totalTime - fetchTime}ms`
    })
    console.log('[Search] Result details:', {
      results: result.results?.map((r: { filename: string; matches: number }) => ({
        filename: r.filename,
        matches: r.matches
      }))
    })
    console.log('[Search] Raw result object keys:', Object.keys(result))
    console.log('[Search] ========== SEARCH REQUEST COMPLETED ==========')

    return result
  } catch (error) {
    const totalTime = Date.now() - startTime
    console.error('[Search] ❌ Exception caught in search request')
    console.error('[Search] Error details:', {
      query,
      error,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      duration: `${totalTime}ms`,
      isApiError: error instanceof ApiError,
      statusCode: error instanceof ApiError ? error.statusCode : undefined,
      isNetworkError: error instanceof TypeError,
      navigatorOnline: typeof navigator !== 'undefined' ? navigator.onLine : 'N/A'
    })

    // Additional context for network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('[Search] 🌐 Network Error Detected:', {
        possibleCauses: [
          'CORS misconfiguration',
          'Backend server not running',
          'Incorrect API_BASE_URL',
          'Network connectivity issue',
          'DNS resolution failure'
        ],
        API_BASE_URL,
        attemptedUrl: `${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`
      })
    }

    console.error('[Search] ========== SEARCH REQUEST FAILED ==========')
    throw error
  }
}

/**
 * Delete a file by ID
 */
export const deleteFile = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/files/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new ApiError(errorData.error || 'Failed to delete file', response.status)
  }
}
