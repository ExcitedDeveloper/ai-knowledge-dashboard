# AI Knowledge Dashboard

> A full-stack intelligent document management system with AI-powered semantic search, built with TypeScript, Supabase, and Cohere embeddings.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-green.svg)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-pgvector-brightgreen.svg)](https://supabase.com/)

## 📌 Overview

AI Knowledge Dashboard is a modern knowledge management platform that enables users to upload documents and search through them using AI-powered semantic understanding. The system combines traditional keyword matching with vector similarity search to deliver highly relevant results, even when search terms don't exactly match the document content.

**Key Highlights:**
- 🔍 **Hybrid Search**: Combines semantic similarity (Cohere embeddings) with keyword matching for optimal results
- 🗄️ **Persistent Storage**: All documents and embeddings stored in Supabase with pgvector support
- ⚡ **Production-Ready**: Fully deployed with comprehensive error handling and logging
- ♿ **Accessible**: WCAG-compliant with full keyboard navigation and screen reader support
- 🧪 **Well-Tested**: 80%+ code coverage with Jest unit and integration tests

---

## 🚀 Live Demo

- **Frontend**: *[Add your Vercel URL here]*
- **Backend API**: https://ai-knowledge-dashboard-production.up.railway.app

---

## ✨ Features

### Core Functionality
- ✅ **Multi-Format File Upload**: Support for `.txt`, `.pdf`, and `.docx` files with drag-and-drop interface
- ✅ **AI-Powered Semantic Search**: Cohere embeddings enable understanding of context and meaning, not just keywords
- ✅ **Document Management**: View, search, and delete uploaded documents with metadata tracking
- ✅ **Hybrid Search Algorithm**: Combines vector similarity (cosine similarity ≥ 0.25) with exact keyword matching
- ✅ **Real-Time Updates**: Interactive dashboard with instant feedback and error handling
- ✅ **Persistent Storage**: Supabase PostgreSQL with pgvector extension for efficient vector operations

### Technical Features
- 🔐 **Type-Safe**: End-to-end TypeScript with strict type checking
- 🎨 **Modern UI**: TailwindCSS v4 with responsive design and dark mode support
- 📊 **Comprehensive Logging**: Request lifecycle tracking and detailed error logging
- 🧪 **Test Coverage**: Jest unit and integration tests with 80%+ coverage
- 🔄 **CI/CD Ready**: Automated testing and deployment pipelines

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with server-side rendering |
| **React 18** | Component-based UI library |
| **TypeScript 5.3** | Type safety and developer experience |
| **TailwindCSS 4** | Utility-first CSS framework |
| **Lucide React** | Modern icon library |
| **Jest** | Testing framework |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime |
| **Express 4.21** | Web application framework |
| **TypeScript 5.9** | Type-safe server code |
| **Multer** | File upload middleware |
| **pdf-parse** | PDF text extraction |
| **mammoth** | DOCX document parsing |
| **Cohere AI** | Semantic embeddings generation |
| **Jest + Supertest** | API testing |

### Database & Infrastructure
| Technology | Purpose |
|------------|---------|
| **Supabase** | PostgreSQL database hosting |
| **pgvector** | Vector similarity search |
| **Railway** | Backend deployment |
| **Vercel** | Frontend deployment *(assumed)* |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                        │
│                    Next.js 14 + React 18                        │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend API (Railway)                      │
│                    Express + TypeScript                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Upload     │  │    Search    │  │    Files     │          │
│  │  Controller  │  │  Controller  │  │  Controller  │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                  │                  │
│         │                 │                  │                  │
│         ▼                 ▼                  ▼                  │
│  ┌──────────────────────────────────────────────────┐          │
│  │           File Processing Services                │          │
│  │  • PDF Parser  • DOCX Parser  • Text Extractor   │          │
│  └──────────────────────┬───────────────────────────┘          │
└─────────────────────────┼────────────────────────────────────────┘
                          │
         ┌────────────────┴────────────────┐
         │                                 │
         ▼                                 ▼
┌─────────────────┐              ┌─────────────────┐
│  Cohere AI API  │              │    Supabase     │
│                 │              │   PostgreSQL    │
│  • embed-v3.0   │              │   + pgvector    │
│  • 1024-dim     │              │                 │
│    embeddings   │              │  • Files table  │
│                 │              │  • Embeddings   │
└─────────────────┘              │  • Metadata     │
                                 └─────────────────┘
```

### Data Flow

1. **Upload**: User uploads file → Backend extracts text → Generates Cohere embedding → Stores in Supabase
2. **Search**: User enters query → Generate query embedding → Compare with stored embeddings using cosine similarity → Return ranked results
3. **Hybrid Matching**: Results include documents that match EITHER semantic similarity (≥0.25) OR contain exact keyword matches

---

## 📦 Installation & Setup

### Prerequisites

- **Node.js** v16+ and npm
- **Supabase account** (free tier works)
- **Cohere API key** (free tier available)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-knowledge-dashboard.git
cd ai-knowledge-dashboard
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cat > .env << EOF
PORT=3001
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
COHERE_API_KEY=your_cohere_api_key
EOF

# Run database migrations (if applicable)
# Set up Supabase table:
# - Create 'files' table with columns: id (uuid), filename (text), content (text), embedding (vector(1024)), created_at (timestamp)
# - Enable pgvector extension in Supabase

# Build TypeScript
npm run build

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd ../frontend

# Install dependencies
npm install

# Create environment file
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=AI Knowledge Dashboard
NEXT_PUBLIC_APP_VERSION=1.0.0
EOF

# Start development server
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

---

## 🗄️ Database Schema

### Supabase `files` Table

```sql
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1024),  -- Cohere embed-multilingual-v3.0 dimension
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create index for vector similarity search
CREATE INDEX ON files USING ivfflat (embedding vector_cosine_ops);
```

---

## 🔌 API Documentation

Base URL: `https://ai-knowledge-dashboard-production.up.railway.app`

### Upload File

Upload a document and generate its semantic embedding.

**Endpoint**: `POST /api/upload`

**Supported Formats**: `.txt`, `.pdf`, `.docx`

**File Size Limit**: 2MB

**Request**:
```bash
curl -X POST https://ai-knowledge-dashboard-production.up.railway.app/api/upload \
  -F "file=@/path/to/document.pdf"
```

**Response** (200 OK):
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "filename": "document.pdf",
  "content": "Extracted text from the document...",
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Error Responses**:
```json
// 400 Bad Request - No file provided
{ "error": "No file uploaded" }

// 400 Bad Request - Unsupported file type
{ "error": "Unsupported file type. Allowed: .txt, .pdf, .docx" }

// 413 Payload Too Large
{ "error": "File too large. Maximum size: 2MB" }

// 500 Internal Server Error
{ "error": "Failed to process file" }
```

---

### Get All Files

Retrieve all uploaded documents with metadata.

**Endpoint**: `GET /api/files`

**Request**:
```bash
curl https://ai-knowledge-dashboard-production.up.railway.app/api/files
```

**Response** (200 OK):
```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "filename": "research-paper.pdf",
    "content": "Full extracted text...",
    "created_at": "2024-01-15T10:30:00Z"
  },
  {
    "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "filename": "notes.txt",
    "content": "My notes on AI...",
    "created_at": "2024-01-15T11:00:00Z"
  }
]
```

---

### Search Files

Search documents using hybrid semantic + keyword matching.

**Endpoint**: `GET /api/search?q={query}`

**Query Parameters**:
- `q` (required): Search query string

**Request**:
```bash
curl "https://ai-knowledge-dashboard-production.up.railway.app/api/search?q=machine%20learning"
```

**Response** (200 OK):
```json
{
  "results": [
    {
      "filename": "research-paper.pdf",
      "excerpt": "...applications of <mark>machine learning</mark> in healthcare...",
      "matches": 5
    },
    {
      "filename": "ai-notes.txt",
      "excerpt": "...deep neural networks and <mark>machine learning</mark> algorithms...",
      "matches": 3
    }
  ]
}
```

**Response** (200 OK - No results):
```json
{
  "results": [],
  "message": "No results found for 'quantum computing'"
}
```

**Search Algorithm**:
- Generates Cohere embedding for query
- Computes cosine similarity with all stored document embeddings
- Includes results with **either**:
  - Semantic similarity ≥ 0.25, **OR**
  - Exact keyword matches in content
- Sorts by: 1) Number of keyword matches (desc), 2) Similarity score (desc)

**Error Responses**:
```json
// 400 Bad Request
{ "error": "Missing or empty search query." }

// 500 Internal Server Error
{ "error": "An unexpected error occurred during search." }
```

---

### Delete File

Delete a document by its UUID.

**Endpoint**: `DELETE /api/files/:id`

**Request**:
```bash
curl -X DELETE https://ai-knowledge-dashboard-production.up.railway.app/api/files/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**Response** (204 No Content):
```
[Empty response body]
```

**Error Responses**:
```json
// 400 Bad Request - Invalid UUID
{ "error": "Invalid UUID format" }

// 500 Internal Server Error
{ "error": "Failed to delete file" }
```

---

## 🧪 Testing

### Run All Tests

```bash
# Backend tests
cd backend
npm test                 # Run all tests
npm run test:coverage    # Run with coverage report

# Frontend tests
cd frontend
npm test                 # Run all tests
npm run test:coverage    # Run with coverage report
```

### Test Coverage

Both frontend and backend maintain **80%+ code coverage** across:
- Unit tests for utilities and services
- Integration tests for API endpoints
- Component tests for React UI

---

## 📂 Project Structure

```
ai-knowledge-dashboard/
├── backend/
│   ├── controllers/          # Request handlers
│   │   ├── uploadController.ts
│   │   ├── filesController.ts
│   │   └── searchController.ts
│   ├── routes/               # API route definitions
│   ├── services/             # Business logic (embeddings, etc.)
│   ├── supabase/             # Database client
│   ├── utils/                # Helper functions
│   ├── types/                # TypeScript type definitions
│   ├── server.ts             # Express app entry point
│   └── package.json
├── frontend/
│   ├── components/           # React components
│   ├── pages/                # Next.js pages
│   ├── services/             # API client
│   ├── types/                # TypeScript types
│   ├── styles/               # Global styles
│   └── package.json
└── README.md
```

---

## 🚀 Deployment

### Backend (Railway)

1. Connect your GitHub repository to Railway
2. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `COHERE_API_KEY`
3. Railway auto-deploys on push to `main`

### Frontend (Vercel)

1. Import project from GitHub
2. Set framework preset to **Next.js**
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app`
4. Deploy

---

## 💡 Key Technical Decisions

### Why Hybrid Search?

Pure semantic search can miss exact keyword matches, while pure keyword search misses contextual relevance. Our hybrid approach:
- Returns documents with **either** semantic similarity OR keyword matches
- Prioritizes exact matches first, then semantic similarity
- Provides best of both worlds for user experience

### Why Cohere Embeddings?

- **1024-dimensional vectors** balance quality and performance
- **Multilingual support** for international documents
- **Free tier** generous enough for portfolio projects
- **Production-ready** with excellent documentation

### Why Supabase + pgvector?

- **PostgreSQL** reliability with vector search capabilities
- **Open-source** alternative to proprietary vector databases
- **Generous free tier** perfect for portfolio projects
- **Easy integration** with existing SQL knowledge

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the coding standards:
   - Use TypeScript strict mode
   - Maintain 80%+ test coverage for new code
   - Follow existing code style (ESLint + Prettier)
4. Run tests: `npm test`
5. Commit with clear messages
6. Push to your branch
7. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Portfolio: [yourwebsite.com](https://yourwebsite.com)

---

## 🙏 Acknowledgments

- [Cohere AI](https://cohere.ai/) for semantic embeddings API
- [Supabase](https://supabase.com/) for database and vector support
- [Next.js](https://nextjs.org/) team for excellent framework
- [TailwindCSS](https://tailwindcss.com/) for styling utilities

---

**⭐ If you find this project useful, please consider giving it a star!**
