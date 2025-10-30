import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import Dashboard from './Dashboard'
import * as api from '../services/api'

// Mock the API module
jest.mock('../services/api')

const mockUploadFile = api.uploadFile as jest.MockedFunction<typeof api.uploadFile>
const mockGetFiles = api.getFiles as jest.MockedFunction<typeof api.getFiles>
const mockSearchFiles = api.searchFiles as jest.MockedFunction<typeof api.searchFiles>

describe('Dashboard Component', () => {
  const mockFiles = [
    {
      filename: 'test1.txt',
      text: 'This is test content for the first file',
      timestamp: Date.now() - 3600000, // 1 hour ago
      embedding: [0.1, 0.2, 0.3],
    },
    {
      filename: 'test2.pdf',
      text: 'This is test content for the second file',
      timestamp: Date.now() - 7200000, // 2 hours ago
      embedding: [0.4, 0.5, 0.6],
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetFiles.mockResolvedValue(mockFiles)
  })

  describe('Initial Load', () => {
    it('should render the dashboard with main sections', async () => {
      render(<Dashboard />)

      expect(screen.getByText('AI Knowledge Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Upload Document')).toBeInTheDocument()
      expect(screen.getByText('Your Documents')).toBeInTheDocument()
      expect(screen.getByText('Search Documents')).toBeInTheDocument()
    })

    it('should load and display files on mount', async () => {
      render(<Dashboard />)

      await waitFor(() => {
        expect(mockGetFiles).toHaveBeenCalledTimes(1)
      })

      expect(await screen.findByText('test1.txt')).toBeInTheDocument()
      expect(await screen.findByText('test2.pdf')).toBeInTheDocument()
    })

    it('should display loading state while fetching files', async () => {
      mockGetFiles.mockImplementation(() => new Promise(() => {})) // Never resolves

      render(<Dashboard />)

      const loadingSpinners = await screen.findAllByRole('status', { hidden: true })
      expect(loadingSpinners.length).toBeGreaterThan(0)
    })

    it('should display error when files fail to load', async () => {
      mockGetFiles.mockRejectedValue(new Error('Failed to load files'))

      render(<Dashboard />)

      const alert = await screen.findByRole('alert')
      expect(alert).toHaveTextContent('Failed to load files')
      expect(await screen.findByText('Retry')).toBeInTheDocument()
    })

    it('should display empty state when no files exist', async () => {
      mockGetFiles.mockResolvedValue([])

      render(<Dashboard />)

      expect(await screen.findByText(/No documents yet/i)).toBeInTheDocument()
    })
  })

  describe('File Upload', () => {
    it('should upload file when selected', async () => {
      const user = userEvent.setup()
      mockUploadFile.mockResolvedValue({
        filename: 'new-file.txt',
        text: 'New file content',
        embedding: [0.7, 0.8, 0.9],
      })

      render(<Dashboard />)

      await waitFor(() => {
        expect(mockGetFiles).toHaveBeenCalled()
      })

      const fileInput = screen.getByLabelText(/upload document file/i)
      const file = new File(['test content'], 'new-file.txt', { type: 'text/plain' })

      await user.upload(fileInput, file)

      await waitFor(() => {
        expect(mockUploadFile).toHaveBeenCalledWith(file)
      })

      // Should reload files after successful upload
      await waitFor(() => {
        expect(mockGetFiles).toHaveBeenCalledTimes(2)
      })
    })

    it('should display loading state during upload', async () => {
      const user = userEvent.setup()
      mockUploadFile.mockImplementation(() => new Promise(() => {})) // Never resolves

      render(<Dashboard />)

      await waitFor(() => {
        expect(mockGetFiles).toHaveBeenCalled()
      })

      const fileInput = screen.getByLabelText(/upload document file/i)
      const file = new File(['test content'], 'test.txt', { type: 'text/plain' })

      await user.upload(fileInput, file)

      expect(await screen.findByText('Uploading...')).toBeInTheDocument()
    })

    it('should display error when upload fails', async () => {
      const user = userEvent.setup()
      mockUploadFile.mockRejectedValue(new Error('Upload failed'))

      render(<Dashboard />)

      await waitFor(() => {
        expect(mockGetFiles).toHaveBeenCalled()
      })

      const fileInput = screen.getByLabelText(/upload document file/i)
      const file = new File(['test content'], 'test.txt', { type: 'text/plain' })

      await user.upload(fileInput, file)

      const alert = await screen.findByRole('alert')
      expect(alert).toHaveTextContent('Upload failed')
    })

    it('should dismiss upload error when X is clicked', async () => {
      const user = userEvent.setup()
      mockUploadFile.mockRejectedValue(new Error('Upload failed'))

      render(<Dashboard />)

      await waitFor(() => {
        expect(mockGetFiles).toHaveBeenCalled()
      })

      const fileInput = screen.getByLabelText(/upload document file/i)
      const file = new File(['test content'], 'test.txt', { type: 'text/plain' })

      await user.upload(fileInput, file)

      const alert = await screen.findByRole('alert')
      expect(alert).toHaveTextContent('Upload failed')

      const dismissButton = screen.getAllByLabelText(/dismiss error/i)[0]
      await user.click(dismissButton)

      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      })
    })
  })

  describe('Search Functionality', () => {
    it('should search files when query is entered', async () => {
      const user = userEvent.setup()
      const mockSearchResults = {
        results: [
          {
            filename: 'test1.txt',
            excerpt: 'This is a <mark>test</mark> result',
            matches: 2,
          },
        ],
      }
      mockSearchFiles.mockResolvedValue(mockSearchResults)

      render(<Dashboard />)

      await waitFor(() => {
        expect(mockGetFiles).toHaveBeenCalled()
      })

      const searchInput = screen.getByPlaceholderText(/search your documents/i)
      await user.type(searchInput, 'test')

      await waitFor(() => {
        expect(mockSearchFiles).toHaveBeenCalledWith('test')
      })

      expect(await screen.findByText('2 matches')).toBeInTheDocument()
    })

    it('should display search loading state', async () => {
      const user = userEvent.setup()
      mockSearchFiles.mockImplementation(() => new Promise(() => {})) // Never resolves

      render(<Dashboard />)

      await waitFor(() => {
        expect(mockGetFiles).toHaveBeenCalled()
      })

      const searchInput = screen.getByPlaceholderText(/search your documents/i)
      await user.type(searchInput, 'test')

      // Wait for loading spinner to appear
      await waitFor(() => {
        const spinners = screen.getAllByRole('status', { hidden: true })
        expect(spinners.length).toBeGreaterThan(0)
      })
    })

    it('should display message when search returns no results', async () => {
      const user = userEvent.setup()
      mockSearchFiles.mockResolvedValue({
        results: [],
        message: 'No matches found for query.',
      })

      render(<Dashboard />)

      await waitFor(() => {
        expect(mockGetFiles).toHaveBeenCalled()
      })

      const searchInput = screen.getByPlaceholderText(/search your documents/i)
      await user.type(searchInput, 'nonexistent')

      await waitFor(
        () => {
          expect(mockSearchFiles).toHaveBeenCalledWith('nonexistent')
        },
        { timeout: 10000 }
      )

      expect(
        await screen.findByText('No matches found for query.', {}, { timeout: 10000 })
      ).toBeInTheDocument()
    })

    it('should clear search results when query is cleared', async () => {
      const user = userEvent.setup()
      const mockSearchResults = {
        results: [
          {
            filename: 'test1.txt',
            excerpt: 'This is a <mark>test</mark> result',
            matches: 1,
          },
        ],
      }
      mockSearchFiles.mockResolvedValue(mockSearchResults)

      render(<Dashboard />)

      await waitFor(() => {
        expect(mockGetFiles).toHaveBeenCalled()
      })

      const searchInput = screen.getByPlaceholderText(/search your documents/i)
      await user.type(searchInput, 'test')

      expect(await screen.findByText('1 match')).toBeInTheDocument()

      await user.clear(searchInput)

      await waitFor(() => {
        expect(screen.queryByText('1 match')).not.toBeInTheDocument()
      })
    })

    it('should display error when search fails', async () => {
      const user = userEvent.setup()
      mockSearchFiles.mockRejectedValue(new Error('Search failed'))

      render(<Dashboard />)

      await waitFor(() => {
        expect(mockGetFiles).toHaveBeenCalled()
      })

      const searchInput = screen.getByPlaceholderText(/search your documents/i)
      await user.type(searchInput, 'test')

      const alert = await screen.findByRole('alert')
      expect(alert).toHaveTextContent('Search failed')
    })
  })

  describe('Accessibility', () => {
    it('should have accessible file upload input', async () => {
      render(<Dashboard />)

      const fileInput = screen.getByLabelText(/upload document file/i)
      expect(fileInput).toHaveAttribute('type', 'file')
      expect(fileInput).toHaveAttribute('accept', '.txt,.pdf,.docx')
    })

    it('should have accessible search input', async () => {
      render(<Dashboard />)

      const searchInput = screen.getByLabelText(/search documents/i)
      expect(searchInput).toHaveAttribute('type', 'search')
    })

    it('should have proper table structure', async () => {
      render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument()
      })

      expect(screen.getByRole('columnheader', { name: /filename/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /preview/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /uploaded/i })).toBeInTheDocument()
    })

    it('should have ARIA alerts for errors', async () => {
      mockGetFiles.mockRejectedValue(new Error('Failed to load files'))

      render(<Dashboard />)

      const alert = await screen.findByRole('alert')
      expect(alert).toHaveTextContent('Failed to load files')
    })
  })

  describe('File List Display', () => {
    it('should display file metadata correctly', async () => {
      render(<Dashboard />)

      expect(await screen.findByText('test1.txt')).toBeInTheDocument()
      expect(await screen.findByText('test2.pdf')).toBeInTheDocument()

      // Check for text previews
      expect(screen.getByText(/This is test content for the first file/i)).toBeInTheDocument()
      expect(screen.getByText(/This is test content for the second file/i)).toBeInTheDocument()
    })

    it('should format timestamps correctly', async () => {
      render(<Dashboard />)

      // Wait for files to load first
      expect(await screen.findByText('test1.txt')).toBeInTheDocument()

      // Then check for timestamp (should show hours ago)
      const timestamps = screen.getAllByText(/hour/i)
      expect(timestamps.length).toBeGreaterThan(0)
    })
  })
})
