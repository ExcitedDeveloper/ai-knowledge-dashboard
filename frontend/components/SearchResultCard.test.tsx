import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchResultCard } from './SearchResultCard';
import type { SearchResult } from '../types/api';

describe('SearchResultCard', () => {
  const mockResult: SearchResult = {
    filename: 'test-document.pdf',
    excerpt: 'This is a <mark>test</mark> excerpt with highlighted text.',
    matches: 3,
  };

  it('renders the search result card', () => {
    render(<SearchResultCard result={mockResult} index={0} />);

    expect(screen.getByText('test-document.pdf')).toBeInTheDocument();
    expect(screen.getByText('PDF')).toBeInTheDocument();
    expect(screen.getByText('3 matches')).toBeInTheDocument();
  });

  it('displays singular "match" when matches is 1', () => {
    const singleMatchResult = { ...mockResult, matches: 1 };
    render(<SearchResultCard result={singleMatchResult} index={0} />);

    expect(screen.getByText('1 match')).toBeInTheDocument();
  });

  it('toggles expanded state when button is clicked', () => {
    render(<SearchResultCard result={mockResult} index={0} />);

    const toggleButton = screen.getByRole('button', { name: /show full excerpt/i });
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(toggleButton);

    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Show less')).toBeInTheDocument();

    fireEvent.click(toggleButton);

    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Show full excerpt')).toBeInTheDocument();
  });

  it('renders HTML content from excerpt', () => {
    render(<SearchResultCard result={mockResult} index={0} />);

    // The excerpt contains HTML, so we check for the mark element
    const excerptElements = screen.getAllByText((content, element) => {
      return element?.innerHTML.includes('<mark>test</mark>') ?? false;
    });

    expect(excerptElements.length).toBeGreaterThan(0);
  });

  it('displays correct file type for different extensions', () => {
    const { rerender } = render(
      <SearchResultCard result={{ ...mockResult, filename: 'doc.txt' }} index={0} />
    );
    expect(screen.getByText('TXT')).toBeInTheDocument();

    rerender(
      <SearchResultCard result={{ ...mockResult, filename: 'doc.docx' }} index={0} />
    );
    expect(screen.getByText('DOCX')).toBeInTheDocument();

    rerender(
      <SearchResultCard result={{ ...mockResult, filename: 'doc.pdf' }} index={0} />
    );
    expect(screen.getByText('PDF')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<SearchResultCard result={mockResult} index={0} />);

    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toHaveAttribute('aria-expanded');
    expect(toggleButton).toHaveAttribute('aria-controls', 'details-0');

    const detailsSection = document.getElementById('details-0');
    expect(detailsSection).toBeInTheDocument();
  });

  it('shows expandable content with proper animation classes', () => {
    render(<SearchResultCard result={mockResult} index={0} />);

    const detailsSection = document.getElementById('details-0');
    expect(detailsSection).toHaveClass('overflow-hidden', 'transition-all', 'duration-300', 'ease-in-out');
  });
});
