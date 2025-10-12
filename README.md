# AI Knowledge Dashboard

A modern knowledge management dashboard powered by AI to help organize, search, and discover insights from your data.

## Project Structure

```
ai-knowledge-dashboard/
├── backend/          # Backend API and services
├── frontend/         # Frontend React application
├── docs/            # Documentation
└── README.md        # Project documentation
```

## Features

- **Knowledge Management**: Organize and categorize your information
- **AI-Powered Search**: Intelligent search capabilities across your knowledge base
- **Interactive Dashboard**: Clean, intuitive interface for data visualization
- **Real-time Updates**: Live synchronization of data changes
- **Export/Import**: Flexible data management options

## Tech Stack

### Frontend
- React with TypeScript
- Modern ES modules
- Responsive design with accessibility support

### Backend
- Node.js with TypeScript
- RESTful API architecture
- Comprehensive error handling

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-knowledge-dashboard
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Development

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:3000` (frontend) with the API running on `http://localhost:3001` (backend).

## API Documentation

Base URL: `http://localhost:3001`

### Upload File

Upload a document file and extract its text content for searching.

**Endpoint**: `POST /api/upload`

**Supported File Types**: `.txt`, `.pdf`, `.docx`

**File Size Limit**: 2MB

**Request**:
```bash
curl -X POST http://localhost:3001/api/upload \
  -F "file=@/path/to/your/document.txt"
```

**Success Response** (200 OK):
```json
{
  "filename": "document.txt",
  "text": "This is the extracted text content from the uploaded file..."
}
```

**Error Responses**:
```json
// 400 Bad Request - No file provided
{ "error": "No file uploaded" }

// 400 Bad Request - Unsupported file type
{ "error": "Unsupported file type" }

// 400 Bad Request - Empty file
{ "error": "Uploaded file is empty" }

// 500 Internal Server Error
{ "error": "Server error" }
```

---

### Get All Files

Retrieve a list of all uploaded files.

**Endpoint**: `GET /api/files`

**Request**:
```bash
curl http://localhost:3001/api/files
```

**Success Response** (200 OK):
```json
[
  {
    "filename": "document1.txt",
    "text": "Content of the first document...",
    "timestamp": 1697811234567
  },
  {
    "filename": "report.pdf",
    "text": "Extracted text from PDF report...",
    "timestamp": 1697811345678
  }
]
```

---

### Search Files

Search through uploaded file contents for a specific query.

**Endpoint**: `GET /api/search?q={query}`

**Query Parameters**:
- `q` (required): Search query string

**Request**:
```bash
curl "http://localhost:3001/api/search?q=knowledge"
```

**Success Response** (200 OK):
```json
{
  "results": [
    {
      "filename": "document1.txt",
      "excerpt": "...the <mark>knowledge</mark> base contains...",
      "matches": 3
    },
    {
      "filename": "report.pdf",
      "excerpt": "...artificial intelligence and <mark>knowledge</mark> management...",
      "matches": 1
    }
  ]
}
```

**Success Response** (200 OK - No results):
```json
{
  "results": [],
  "message": "No matches found for query."
}
```

**Error Responses**:
```json
// 400 Bad Request - Missing or empty query
{ "error": "Missing or empty search query." }

// 500 Internal Server Error
{ "error": "An unexpected error occurred during search." }
```

## Development Guidelines

- Follow TypeScript best practices with proper type definitions
- Maintain 80%+ code coverage for all new features
- Use ES modules (import/export) syntax
- Implement proper error handling and accessibility features
- Run tests before committing changes

## Testing

```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd backend
npm test
```

## Contributing

1. Create a feature branch from main
2. Make your changes following the coding standards
3. Ensure all tests pass
4. Submit a pull request with a clear description

## License

MIT License - see LICENSE file for details