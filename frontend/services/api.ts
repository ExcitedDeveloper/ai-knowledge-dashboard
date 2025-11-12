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
  if (!query.trim()) {
    return { results: [], message: 'Please enter a search query' }
  }

  const response = await fetch(
    `${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new ApiError(errorData.error || 'Search failed', response.status)
  }

  return response.json()
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
