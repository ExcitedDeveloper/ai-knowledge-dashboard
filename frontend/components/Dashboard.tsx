import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Upload,
  Search,
  FileText,
  Clock,
  X,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadFile, getFiles, searchFiles, deleteFile } from '../services/api';
import type { UploadedFile, SearchResult } from '../types/api';
import { Button } from './Button';
import { Card } from './Card';
import { SearchResultCard } from './SearchResultCard';

const Dashboard: React.FC = () => {
  // State management
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchMessage, setSearchMessage] = useState<string>('');

  // Loading and error states
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [filesError, setFilesError] = useState<string>('');
  const [searchError, setSearchError] = useState<string>('');
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);

  // Drag and drop states
  const [isDragging, setIsDragging] = useState(false);

  // Confirmation dialog state
  const [fileToDelete, setFileToDelete] = useState<{
    id: string;
    filename: string;
  } | null>(null);

  // Refs for debouncing and race condition prevention
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentQueryRef = useRef<string>('');

  const loadFiles = useCallback(async () => {
    try {
      setIsLoadingFiles(true);
      setFilesError('');
      const fetchedFiles = await getFiles();
      setFiles(fetchedFiles);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load files';
      setFilesError(errorMessage);
      toast.error(`Network error: ${errorMessage}`);
    } finally {
      setIsLoadingFiles(false);
    }
  }, []);

  // Load files on mount
  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleFileUpload = useCallback(
    async (file: File) => {
      try {
        setIsUploading(true);
        setUploadError('');
        await uploadFile(file);
        await loadFiles();

        toast.success(`Successfully uploaded ${file.name}`);

        // Clear search input after successful upload
        setSearchQuery('');
        setSearchResults([]);
        setSearchMessage('');
        setSearchError('');
        currentQueryRef.current = '';
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Upload failed';
        setUploadError(errorMessage);
        toast.error(`Upload failed: ${errorMessage}`);
      } finally {
        setIsUploading(false);
      }
    },
    [loadFiles]
  );

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (selectedFile) {
        handleFileUpload(selectedFile);
      }
    },
    [handleFileUpload]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragging(false);

      const droppedFile = event.dataTransfer.files?.[0];
      if (droppedFile) {
        handleFileUpload(droppedFile);
      }
    },
    [handleFileUpload]
  );

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    // Update the current query ref
    currentQueryRef.current = query;

    try {
      setIsSearching(true);
      setSearchError('');
      setSearchMessage('');

      const response = await searchFiles(query);

      // Only update state if this is still the current query (prevent race conditions)
      if (currentQueryRef.current === query) {
        setSearchResults(response.results);

        if (response.message) {
          setSearchMessage(response.message);
          toast(response.message, {
            icon: '🔍',
          });
        } else if (response.results.length > 0) {
          toast.success(
            `Found ${response.results.length} result${response.results.length !== 1 ? 's' : ''}`
          );
        } else {
          toast('No results found', {
            icon: '🔍',
          });
        }
      }
    } catch (error) {
      // Only update error state if this is still the current query
      if (currentQueryRef.current === query) {
        const errorMessage =
          error instanceof Error ? error.message : 'Search failed';
        setSearchError(errorMessage);
        setSearchResults([]);
        toast.error(`Search failed: ${errorMessage}`);
      }
    } finally {
      // Only update loading state if this is still the current query
      if (currentQueryRef.current === query) {
        setIsSearching(false);
      }
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Clear any pending search timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim()) {
      // Debounce search - wait 300ms after user stops typing
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch(query.trim());
      }, 300);
    } else {
      // Clear results immediately if query is empty
      currentQueryRef.current = '';
      setSearchResults([]);
      setSearchMessage('');
      setSearchError('');
      setIsSearching(false);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleDeleteClick = (fileId: string, filename: string) => {
    setFileToDelete({ id: fileId, filename });
  };

  const handleConfirmDelete = async () => {
    if (!fileToDelete?.id) return;

    const fileId = fileToDelete.id;
    const filename = fileToDelete.filename;

    // Close modal immediately
    setFileToDelete(null);

    try {
      setDeletingFileId(fileId);
      setFilesError('');
      await deleteFile(fileId);
      await loadFiles();

      toast.success(`Successfully deleted ${filename}`);

      // Clear search input after successful deletion
      setSearchQuery('');
      setSearchResults([]);
      setSearchMessage('');
      setSearchError('');
      currentQueryRef.current = '';
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete file';
      setFilesError(errorMessage);
      toast.error(`Delete failed: ${errorMessage}`);
    } finally {
      setDeletingFileId(null);
    }
  };

  const handleCancelDelete = () => {
    setFileToDelete(null);
  };

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Confirmation Dialog */}
      {fileToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleCancelDelete}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div
            className="mx-4 max-w-md rounded-xl p-6"
            style={{ backgroundColor: 'white' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              id="delete-dialog-title"
              className="heading-small mb-4"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Delete Document?
            </h3>
            <p
              className="body mb-6"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Are you sure you want to delete &quot;{fileToDelete.filename}
              &quot;? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={handleCancelDelete}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      <div
        className="min-h-screen w-full"
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        <div className="mx-auto max-w-[1280px] px-6 py-8 md:px-8 md:py-12">
          {/* Header */}
          <header className="mb-12">
            <h1
              className="heading-display mb-3"
              style={{ color: 'var(--color-text-primary)' }}
            >
              AI Knowledge Dashboard
            </h1>
            <p
              className="body-large"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Upload, organize, and search your documents with AI-powered
              semantic search
            </p>
          </header>

          {/* File Upload Section */}
          <section className="mb-12">
            <h2
              className="heading-subsection mb-6"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Upload Document
            </h2>

            <label
              htmlFor="file-upload"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="block cursor-pointer transition-all duration-200"
              style={{
                minHeight: '240px',
                borderRadius: 'var(--radius-lg)',
                border: isDragging
                  ? '2px solid var(--color-primary)'
                  : '2px dashed var(--color-accent-clay)',
                backgroundColor: isDragging
                  ? 'var(--color-background)'
                  : 'var(--color-background-tertiary)',
                opacity: isUploading ? 0.5 : 1,
                cursor: isUploading ? 'not-allowed' : 'pointer',
              }}
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

              <div className="flex h-full min-h-[240px] flex-col items-center justify-center p-8">
                {isUploading ? (
                  <div className="animate-spin mb-4">
                    <Upload
                      className="h-16 w-16"
                      style={{ color: 'var(--color-primary)' }}
                    />
                  </div>
                ) : (
                  <Upload
                    className="mb-4 h-16 w-16"
                    style={{ color: 'var(--color-accent-clay)' }}
                  />
                )}

                <p
                  className="heading-small mb-2"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {isUploading ? 'Uploading...' : 'Upload a document'}
                </p>
                <p
                  className="body-small mb-2"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Drag and drop or click to select (.txt, .pdf, .docx)
                </p>
                <p
                  className="caption"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  Maximum file size: 2MB
                </p>
              </div>
            </label>

            {uploadError && (
              <div
                className="mt-4 flex items-start gap-3 rounded-xl p-4"
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid var(--color-error)',
                }}
                role="alert"
              >
                <AlertCircle
                  className="mt-0.5 h-5 w-5 flex-shrink-0"
                  style={{ color: 'var(--color-error)' }}
                />
                <div className="flex-1">
                  <p
                    className="heading-small"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    Upload failed
                  </p>
                  <p
                    className="body-small mt-1"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {uploadError}
                  </p>
                </div>
                <button
                  onClick={() => setUploadError('')}
                  className="ml-auto transition-colors hover:opacity-70"
                  style={{ color: 'var(--color-error)' }}
                  aria-label="Dismiss error"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </section>

          {/* Files List Section */}
          <section className="mb-12">
            <h2
              className="heading-subsection mb-6"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Your Documents
            </h2>

            {filesError && (
              <div
                className="mb-6 flex items-start gap-3 rounded-xl p-4"
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid var(--color-error)',
                }}
                role="alert"
              >
                <AlertCircle
                  className="mt-0.5 h-5 w-5 flex-shrink-0"
                  style={{ color: 'var(--color-error)' }}
                />
                <div className="flex-1">
                  <p
                    className="heading-small"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    Failed to load files
                  </p>
                  <p
                    className="body-small mt-1"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {filesError}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={loadFiles}>
                  Retry
                </Button>
              </div>
            )}

            {isLoadingFiles ? (
              <div
                className="flex items-center justify-center py-16"
                role="status"
                aria-live="polite"
              >
                <div className="animate-spin">
                  <FileText
                    className="h-12 w-12"
                    style={{ color: 'var(--color-primary)' }}
                  />
                </div>
                <span className="sr-only">Loading files...</span>
              </div>
            ) : files.length === 0 ? (
              <Card padding="lg">
                <div className="flex flex-col items-center py-12 text-center">
                  <FileText
                    className="mb-4 h-16 w-16"
                    style={{ color: 'var(--color-accent-sand)' }}
                  />
                  <p
                    className="body"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    No documents yet. Upload your first document to get started.
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {files.map((file, index) => (
                  <Card
                    key={`${file.filename}-${index}`}
                    variant="elevated"
                    padding="lg"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg"
                        style={{
                          backgroundColor: 'var(--color-background-tertiary)',
                        }}
                      >
                        <FileText
                          className="h-6 w-6"
                          style={{ color: 'var(--color-primary)' }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3
                          className="heading-small mb-2"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {file.filename}
                        </h3>
                        <p
                          className="body-small mb-3 line-clamp-2"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {file.text.substring(0, 200)}...
                        </p>
                        <div className="flex items-center gap-2">
                          <Clock
                            className="h-4 w-4"
                            style={{ color: 'var(--color-text-tertiary)' }}
                          />
                          <span
                            className="caption"
                            style={{ color: 'var(--color-text-tertiary)' }}
                          >
                            {formatTimestamp(file.timestamp)}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          file.id && handleDeleteClick(file.id, file.filename)
                        }
                        disabled={deletingFileId === file.id || !file.id}
                        aria-label={`Delete ${file.filename}`}
                      >
                        {deletingFileId === file.id ? (
                          <div className="animate-spin">
                            <Trash2 className="h-4 w-4" />
                          </div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Search Section */}
          <section>
            <h2
              className="heading-subsection mb-6"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Search Documents
            </h2>

            <div className="relative mb-6">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2"
                style={{ color: 'var(--color-text-tertiary)' }}
              />
              <input
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search your documents..."
                className="w-full h-[52px] rounded-xl pl-12 pr-4 transition-all focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  backgroundColor: 'white',
                  border: '1.5px solid var(--color-border-medium)',
                  color: 'var(--color-text-primary)',
                  outlineColor: 'var(--color-primary)',
                }}
                aria-label="Search documents"
              />
            </div>

            {searchError && (
              <div
                className="mb-6 flex items-start gap-3 rounded-xl p-4"
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid var(--color-error)',
                }}
                role="alert"
              >
                <AlertCircle
                  className="mt-0.5 h-5 w-5 flex-shrink-0"
                  style={{ color: 'var(--color-error)' }}
                />
                <div className="flex-1">
                  <p
                    className="heading-small"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    Search failed
                  </p>
                  <p
                    className="body-small mt-1"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {searchError}
                  </p>
                </div>
                <button
                  onClick={() => setSearchError('')}
                  className="ml-auto transition-colors hover:opacity-70"
                  style={{ color: 'var(--color-error)' }}
                  aria-label="Dismiss error"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {isSearching ? (
              <div
                className="flex items-center justify-center py-16"
                role="status"
                aria-live="polite"
              >
                <div className="animate-spin">
                  <Search
                    className="h-12 w-12"
                    style={{ color: 'var(--color-primary)' }}
                  />
                </div>
                <span className="sr-only">Searching...</span>
              </div>
            ) : searchMessage ? (
              <Card padding="lg">
                <div className="flex flex-col items-center py-12 text-center">
                  <Search
                    className="mb-4 h-16 w-16"
                    style={{ color: 'var(--color-accent-sand)' }}
                  />
                  <p
                    className="body"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {searchMessage}
                  </p>
                </div>
              </Card>
            ) : searchResults && searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((result, index) => (
                  <SearchResultCard
                    key={`${result.filename}-${index}`}
                    result={result}
                    index={index}
                  />
                ))}
              </div>
            ) : searchQuery ? (
              <Card padding="lg">
                <div className="flex flex-col items-center py-12 text-center">
                  <Search
                    className="mb-4 h-16 w-16"
                    style={{ color: 'var(--color-accent-sand)' }}
                  />
                  <p
                    className="body"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    No results found for &quot;{searchQuery}&quot;
                  </p>
                </div>
              </Card>
            ) : null}
          </section>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
