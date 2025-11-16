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
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      let errorData
      try {
        const responseText = await response.text()
        errorData = responseText ? JSON.parse(responseText) : { error: 'Unknown error' }
      } catch (parseError) {
        errorData = { error: 'Unable to parse error response' }
      }

      throw new ApiError(errorData.error || 'Upload failed', response.status)
    }

    const result = await response.json()
    return result
  } catch (error) {
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

  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured')
  }

  try {
    const fullUrl = `${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`
    const response = await fetch(fullUrl)

    if (!response.ok) {
      let errorData
      try {
        const responseText = await response.text()
        errorData = responseText ? JSON.parse(responseText) : { error: 'Unknown error' }
      } catch (parseError) {
        errorData = { error: 'Unable to parse error response' }
      }

      throw new ApiError(errorData.error || 'Search failed', response.status)
    }

    const result = await response.json()
    return result
  } catch (error) {
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
