import React, { useState, useEffect, useCallback } from 'react'
import { Upload, Search, FileText, Clock, Loader2, AlertCircle, X } from 'lucide-react'
import { uploadFile, getFiles, searchFiles } from '../services/api'
import type { UploadedFile, SearchResult } from '../types/api'

const Dashboard: React.FC = () => {
  // State management
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchMessage, setSearchMessage] = useState<string>('')

  // Loading and error states
  const [isUploading, setIsUploading] = useState(false)
  const [isLoadingFiles, setIsLoadingFiles] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [uploadError, setUploadError] = useState<string>('')
  const [filesError, setFilesError] = useState<string>('')
  const [searchError, setSearchError] = useState<string>('')

  // Drag and drop states
  const [isDragging, setIsDragging] = useState(false)

  // Load files on mount
  useEffect(() => {
    loadFiles()
  }, [])

  const loadFiles = async () => {
    try {
      setIsLoadingFiles(true)
      setFilesError('')
      const fetchedFiles = await getFiles()
      setFiles(fetchedFiles)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load files'
      setFilesError(errorMessage)
    } finally {
      setIsLoadingFiles(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true)
      setUploadError('')
      await uploadFile(file)
      // Reload files after successful upload
      await loadFiles()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      setUploadError(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      handleFileUpload(selectedFile)
    }
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setIsDragging(false)

    const droppedFile = event.dataTransfer.files?.[0]
    if (droppedFile) {
      handleFileUpload(droppedFile)
    }
  }, [])

  const handleSearch = async (query: string) => {
    try {
      setIsSearching(true)
      setSearchError('')
      setSearchMessage('')

      const response = await searchFiles(query)
      setSearchResults(response.results)

      if (response.message) {
        setSearchMessage(response.message)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Search failed'
      setSearchError(errorMessage)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value
    setSearchQuery(query)

    // Trigger search on input change
    if (query.trim()) {
      handleSearch(query.trim())
    } else {
      setSearchResults([])
      setSearchMessage('')
      setSearchError('')
    }
  }, [])

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`

    return date.toLocaleDateString()
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Knowledge Dashboard
          </h1>
          <p className="text-gray-600">
            Upload, organize, and search your documents with AI-powered semantic search
          </p>
        </div>

        {/* File Upload Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Document</h2>

          <label
            htmlFor="file-upload"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
              ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input
              id="file-upload"
              type="file"
              accept=".txt,.pdf,.docx"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="sr-only"
              aria-label="Upload document file"
            />

            <div className="flex flex-col items-center">
              {isUploading ? (
                <Loader2 className="w-12 h-12 text-blue-500 mb-3 animate-spin" />
              ) : (
                <Upload className="w-12 h-12 text-gray-400 mb-3" />
              )}

              <p className="text-lg font-medium text-gray-700 mb-1">
                {isUploading ? 'Uploading...' : 'Upload a document'}
              </p>
              <p className="text-sm text-gray-500">
                Drag and drop or click to select (.txt, .pdf, .docx)
              </p>
              <p className="text-xs text-gray-400 mt-2">Maximum file size: 2MB</p>
            </div>
          </label>

          {uploadError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2" role="alert">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Upload failed</p>
                <p className="text-sm text-red-700">{uploadError}</p>
              </div>
              <button
                onClick={() => setUploadError('')}
                className="ml-auto text-red-600 hover:text-red-800"
                aria-label="Dismiss error"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>

        {/* Files List Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Documents</h2>

          {filesError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2" role="alert">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Failed to load files</p>
                <p className="text-sm text-red-700">{filesError}</p>
              </div>
              <button
                onClick={loadFiles}
                className="ml-auto text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Retry
              </button>
            </div>
          )}

          {isLoadingFiles ? (
            <div className="flex items-center justify-center py-12" role="status" aria-live="polite">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" aria-hidden="true" />
              <span className="sr-only">Loading files...</span>
            </div>
          ) : files.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No documents yet. Upload your first document to get started.</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Filename
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preview
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploaded
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {files.map((file, index) => (
                    <tr key={`${file.filename}-${index}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                          <span className="font-medium text-gray-900">{file.filename}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {file.text.substring(0, 150)}...
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          {formatTimestamp(file.timestamp)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Search Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Documents</h2>

          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search your documents..."
              className="w-full h-12 pl-12 pr-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Search documents"
            />
          </div>

          {searchError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2" role="alert">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Search failed</p>
                <p className="text-sm text-red-700">{searchError}</p>
              </div>
              <button
                onClick={() => setSearchError('')}
                className="ml-auto text-red-600 hover:text-red-800"
                aria-label="Dismiss error"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {isSearching ? (
            <div className="flex items-center justify-center py-12" role="status" aria-live="polite">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" aria-hidden="true" />
              <span className="sr-only">Searching...</span>
            </div>
          ) : searchMessage ? (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{searchMessage}</p>
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((result, index) => (
                <div
                  key={`${result.filename}-${index}`}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <h3 className="font-semibold text-gray-900">{result.filename}</h3>
                    </div>
                    <span className="text-sm font-medium text-blue-600 flex-shrink-0">
                      {result.matches} match{result.matches !== 1 ? 'es' : ''}
                    </span>
                  </div>
                  <div
                    className="text-sm text-gray-600"
                    dangerouslySetInnerHTML={{ __html: result.excerpt }}
                  />
                </div>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No results found for "{searchQuery}"</p>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  )
}

export default Dashboard
