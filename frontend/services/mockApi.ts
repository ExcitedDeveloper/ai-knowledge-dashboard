import type {
  UploadResponse,
  UploadedFile,
  SearchResponse,
} from '../types/api';

// In-memory storage for mock data
let mockFiles: UploadedFile[] = [
  {
    id: '1',
    filename: 'sample-document.pdf',
    text: 'This is a sample document about artificial intelligence and machine learning. It covers various topics including neural networks, deep learning, and natural language processing.',
    timestamp: Date.now() - 86400000, // 1 day ago
    embedding: Array(1536).fill(0).map(() => Math.random()),
  },
  {
    id: '2',
    filename: 'meeting-notes.txt',
    text: 'Meeting notes from team sync. Discussed project timeline, resource allocation, and upcoming milestones. Action items: Review design mockups, schedule user testing sessions.',
    timestamp: Date.now() - 172800000, // 2 days ago
    embedding: Array(1536).fill(0).map(() => Math.random()),
  },
];

let nextId = 3;

class MockApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'MockApiError';
  }
}

/**
 * Simulate file reading and text extraction
 */
const extractTextFromFile = async (file: File): Promise<string> => {
  // Simulate async processing delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock text extraction based on file type
  const extension = file.name.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'txt':
      return `Mock text content from ${file.name}. This simulates the extracted text from a plain text file.`;
    case 'pdf':
      return `Mock PDF content from ${file.name}. This simulates text extracted from a PDF document with multiple sections and paragraphs.`;
    case 'doc':
    case 'docx':
      return `Mock Word document content from ${file.name}. This simulates text extracted from a Microsoft Word document.`;
    default:
      return `Mock content from ${file.name}. Unsupported file type simulation.`;
  }
};

/**
 * Generate a mock embedding vector
 */
const generateMockEmbedding = (): number[] => {
  return Array(1536)
    .fill(0)
    .map(() => Math.random());
};

/**
 * Mock implementation: Upload a file
 */
export const uploadFile = async (file: File): Promise<UploadResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Validate file
  if (!file) {
    throw new MockApiError('No file provided', 400);
  }

  // Simulate file size limit
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new MockApiError('File size exceeds 10MB limit', 400);
  }

  // Extract text and generate embedding
  const text = await extractTextFromFile(file);
  const embedding = generateMockEmbedding();

  // Add to mock storage
  const newFile: UploadedFile = {
    id: String(nextId++),
    filename: file.name,
    text,
    timestamp: Date.now(),
    embedding,
  };

  mockFiles.push(newFile);

  console.log('[MOCK API] File uploaded:', file.name);

  return {
    filename: file.name,
    text,
    embedding,
  };
};

/**
 * Mock implementation: Get all uploaded files
 */
export const getFiles = async (): Promise<UploadedFile[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  console.log('[MOCK API] Fetching files, count:', mockFiles.length);

  // Return a copy to prevent external mutations
  return mockFiles.map((file) => ({ ...file }));
};

/**
 * Mock implementation: Search files by query
 */
export const searchFiles = async (query: string): Promise<SearchResponse> => {
  if (!query.trim()) {
    return { results: [], message: 'Please enter a search query' };
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  const queryLower = query.toLowerCase();
  const results = mockFiles
    .filter((file) => {
      const textLower = file.text.toLowerCase();
      const filenameLower = file.filename.toLowerCase();
      return textLower.includes(queryLower) || filenameLower.includes(queryLower);
    })
    .map((file) => {
      // Find matches in text
      const textLower = file.text.toLowerCase();
      const matches = (textLower.match(new RegExp(queryLower, 'g')) || [])
        .length;

      // Extract excerpt around first match
      const matchIndex = textLower.indexOf(queryLower);
      const excerptStart = Math.max(0, matchIndex - 50);
      const excerptEnd = Math.min(file.text.length, matchIndex + query.length + 50);
      const excerpt = file.text.substring(excerptStart, excerptEnd);

      return {
        filename: file.filename,
        excerpt: excerptStart > 0 ? '...' + excerpt : excerpt,
        matches,
      };
    });

  console.log('[MOCK API] Search results for query:', query, 'found:', results.length);

  return {
    results,
    // Only include message when there are NO results (to match backend behavior)
    message: results.length === 0 ? `No results found for "${query}"` : undefined,
  };
};

/**
 * Mock implementation: Delete a file by ID
 */
export const deleteFile = async (id: string): Promise<void> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  const index = mockFiles.findIndex((file) => file.id === id);

  if (index === -1) {
    throw new MockApiError('File not found', 404);
  }

  const deletedFile = mockFiles.splice(index, 1)[0];
  console.log('[MOCK API] File deleted:', deletedFile.filename);
};

/**
 * Reset mock data to initial state (useful for testing)
 */
export const resetMockData = (): void => {
  mockFiles = [
    {
      id: '1',
      filename: 'sample-document.pdf',
      text: 'This is a sample document about artificial intelligence and machine learning. It covers various topics including neural networks, deep learning, and natural language processing.',
      timestamp: Date.now() - 86400000,
      embedding: Array(1536).fill(0).map(() => Math.random()),
    },
    {
      id: '2',
      filename: 'meeting-notes.txt',
      text: 'Meeting notes from team sync. Discussed project timeline, resource allocation, and upcoming milestones. Action items: Review design mockups, schedule user testing sessions.',
      timestamp: Date.now() - 172800000,
      embedding: Array(1536).fill(0).map(() => Math.random()),
    },
  ];
  nextId = 3;
  console.log('[MOCK API] Data reset to initial state');
};
