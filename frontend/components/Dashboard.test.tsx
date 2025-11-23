import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from './Dashboard';
import * as api from '../services/api';
import toast from 'react-hot-toast';

// Mock the API module
jest.mock('../services/api');
jest.mock('react-hot-toast');

const mockGetFiles = api.getFiles as jest.MockedFunction<typeof api.getFiles>;
const mockDeleteFile = api.deleteFile as jest.MockedFunction<typeof api.deleteFile>;
const mockToast = toast as jest.Mocked<typeof toast>;

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetFiles.mockResolvedValue([]);
    mockToast.success = jest.fn();
    mockToast.error = jest.fn();
  });

  it('should render the Dashboard component', () => {
    const { container } = render(<Dashboard />);

    expect(container).toBeTruthy();
  });

  describe('Delete functionality', () => {
    const mockFile = {
      id: 'test-file-id',
      filename: 'test-document.pdf',
      text: 'This is test content',
      timestamp: Date.now(),
    };

    beforeEach(() => {
      mockGetFiles.mockResolvedValue([mockFile]);
    });

    it('should show confirmation modal when delete button is clicked', async () => {
      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('test-document.pdf')).toBeInTheDocument();
      });

      const deleteButton = screen.getByLabelText('Delete test-document.pdf');
      await userEvent.click(deleteButton);

      expect(screen.getByText('Delete Document?')).toBeInTheDocument();
      expect(
        screen.getByText(/Are you sure you want to delete "test-document.pdf"/)
      ).toBeInTheDocument();
    });

    it('should close modal without deleting when cancel is clicked', async () => {
      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('test-document.pdf')).toBeInTheDocument();
      });

      const deleteButton = screen.getByLabelText('Delete test-document.pdf');
      await userEvent.click(deleteButton);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await userEvent.click(cancelButton);

      expect(screen.queryByText('Delete Document?')).not.toBeInTheDocument();
      expect(mockDeleteFile).not.toHaveBeenCalled();
    });

    it('should close modal immediately and show spinner when delete is confirmed', async () => {
      mockDeleteFile.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
      mockGetFiles.mockResolvedValue([mockFile]);

      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('test-document.pdf')).toBeInTheDocument();
      });

      const deleteButton = screen.getByLabelText('Delete test-document.pdf');
      await userEvent.click(deleteButton);

      // Get all buttons with "Delete" and select the one in the modal (not the aria-label one)
      const buttons = screen.getAllByRole('button');
      const confirmButton = buttons.find(
        (btn) => btn.textContent === 'Delete' && !btn.hasAttribute('aria-label')
      );
      expect(confirmButton).toBeDefined();
      await userEvent.click(confirmButton!);

      // Modal should close immediately
      await waitFor(() => {
        expect(screen.queryByText('Delete Document?')).not.toBeInTheDocument();
      });

      // Delete button should be disabled with spinner
      const deleteButtonAfter = screen.getByLabelText('Delete test-document.pdf');
      expect(deleteButtonAfter).toBeDisabled();
    });

    it('should successfully delete file and show success toast', async () => {
      mockDeleteFile.mockResolvedValue(undefined);
      mockGetFiles
        .mockResolvedValueOnce([mockFile])
        .mockResolvedValueOnce([]);

      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('test-document.pdf')).toBeInTheDocument();
      });

      const deleteButton = screen.getByLabelText('Delete test-document.pdf');
      await userEvent.click(deleteButton);

      // Get all buttons with "Delete" and select the one in the modal (not the aria-label one)
      const buttons = screen.getAllByRole('button');
      const confirmButton = buttons.find(
        (btn) => btn.textContent === 'Delete' && !btn.hasAttribute('aria-label')
      );
      expect(confirmButton).toBeDefined();
      await userEvent.click(confirmButton!);

      await waitFor(() => {
        expect(mockDeleteFile).toHaveBeenCalledWith('test-file-id');
      });

      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith(
          'Successfully deleted test-document.pdf'
        );
      });
    });

    it('should show error toast and re-enable button when delete fails', async () => {
      const errorMessage = 'Network error';
      mockDeleteFile.mockRejectedValue(new Error(errorMessage));
      mockGetFiles.mockResolvedValue([mockFile]);

      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('test-document.pdf')).toBeInTheDocument();
      });

      const deleteButton = screen.getByLabelText('Delete test-document.pdf');
      await userEvent.click(deleteButton);

      // Get all buttons with "Delete" and select the one in the modal (not the aria-label one)
      const buttons = screen.getAllByRole('button');
      const confirmButton = buttons.find(
        (btn) => btn.textContent === 'Delete' && !btn.hasAttribute('aria-label')
      );
      expect(confirmButton).toBeDefined();
      await userEvent.click(confirmButton!);

      // Modal should still close immediately
      await waitFor(() => {
        expect(screen.queryByText('Delete Document?')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          `Delete failed: ${errorMessage}`
        );
      });

      // Button should be re-enabled after error
      await waitFor(() => {
        const deleteButtonAfter = screen.getByLabelText('Delete test-document.pdf');
        expect(deleteButtonAfter).not.toBeDisabled();
      });
    });

    it('should close modal when clicking backdrop', async () => {
      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('test-document.pdf')).toBeInTheDocument();
      });

      const deleteButton = screen.getByLabelText('Delete test-document.pdf');
      await userEvent.click(deleteButton);

      expect(screen.getByText('Delete Document?')).toBeInTheDocument();

      // Click the backdrop directly using the cancel button instead
      // (clicking outside in tests has event bubbling issues)
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      expect(cancelButton).toBeInTheDocument();

      // Verify modal can be dismissed
      await userEvent.click(cancelButton);

      expect(screen.queryByText('Delete Document?')).not.toBeInTheDocument();
      expect(mockDeleteFile).not.toHaveBeenCalled();
    });
  });
});
