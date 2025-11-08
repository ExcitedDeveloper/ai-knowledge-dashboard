// API request and response types

export interface UploadedFile {
  id?: string
  filename: string
  text: string
  timestamp: number
  embedding?: number[]
}

export interface UploadResponse {
  filename: string
  text: string
  embedding?: number[]
}

export interface SearchResult {
  filename: string
  excerpt: string
  matches: number
}

export interface SearchResponse {
  results: SearchResult[]
  message?: string
}

export interface ApiError {
  error: string
}
