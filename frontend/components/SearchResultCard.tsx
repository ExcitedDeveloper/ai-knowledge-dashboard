import React, { useState } from 'react';
import { FileText, File, ChevronDown, ChevronUp } from 'lucide-react';
import type { SearchResult } from '../types/api';

interface SearchResultCardProps {
  result: SearchResult;
  index: number;
}

const getFileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();

  // You can add more specific icons from lucide-react if needed
  // For now, using FileText for all types with different colors
  const iconProps = { className: 'h-6 w-6', 'aria-hidden': true };

  switch (ext) {
    case 'pdf':
      return <FileText {...iconProps} style={{ color: '#DC2626' }} />;
    case 'docx':
    case 'doc':
      return <FileText {...iconProps} style={{ color: '#2563EB' }} />;
    case 'txt':
      return <File {...iconProps} style={{ color: '#059669' }} />;
    default:
      return <FileText {...iconProps} style={{ color: 'var(--color-primary)' }} />;
  }
};

const getFileTypeLabel = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ext?.toUpperCase() || 'FILE';
};

export const SearchResultCard: React.FC<SearchResultCardProps> = ({
  result,
  index,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const fileTypeLabel = getFileTypeLabel(result.filename);

  return (
    <div
      className="group rounded-xl bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
      style={{
        border: '1px solid var(--color-border-light)',
      }}
    >
      {/* Header Section */}
      <div className="flex items-start gap-4 mb-4">
        {/* File Icon */}
        <div
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg"
          style={{
            backgroundColor: 'var(--color-background-tertiary)',
          }}
        >
          {getFileIcon(result.filename)}
        </div>

        {/* Title and Metadata */}
        <div className="flex-1 min-w-0">
          <h3
            className="heading-small mb-1 truncate"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {result.filename}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="caption inline-flex items-center rounded-full px-2 py-0.5"
              style={{
                backgroundColor: 'var(--color-background-tertiary)',
                color: 'var(--color-primary)',
              }}
            >
              {fileTypeLabel}
            </span>
            <span
              className="caption rounded-full px-2 py-0.5"
              style={{
                backgroundColor: 'var(--color-background-tertiary)',
                color: 'var(--color-primary)',
              }}
            >
              {result.matches} match{result.matches !== 1 ? 'es' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Preview Section - Always visible */}
      <div className="mb-3">
        <div
          className="body-small line-clamp-2"
          style={{ color: 'var(--color-text-secondary)' }}
          dangerouslySetInnerHTML={{ __html: result.excerpt }}
        />
      </div>

      {/* Expandable Section */}
      <div>
        <button
          onClick={toggleExpanded}
          className="flex w-full items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-gray-50"
          aria-expanded={isExpanded}
          aria-controls={`details-${index}`}
          style={{ cursor: 'pointer' }}
        >
          <span
            className="caption font-medium"
            style={{ color: 'var(--color-primary)' }}
          >
            {isExpanded ? 'Show less' : 'Show full excerpt'}
          </span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
          ) : (
            <ChevronDown className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
          )}
        </button>

        {/* Animated Collapsible Content */}
        <div
          id={`details-${index}`}
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: isExpanded ? '500px' : '0',
            opacity: isExpanded ? 1 : 0,
          }}
        >
          <div
            className="mt-3 rounded-lg p-4"
            style={{
              backgroundColor: 'var(--color-background-tertiary)',
            }}
          >
            <h4
              className="caption font-medium mb-2"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              Full Excerpt
            </h4>
            <div
              className="body-small"
              style={{ color: 'var(--color-text-secondary)' }}
              dangerouslySetInnerHTML={{ __html: result.excerpt }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
