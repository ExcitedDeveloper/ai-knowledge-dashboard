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

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new ApiError(errorData.error || 'Upload failed', response.status)
  }

  return response.json()
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
