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

The application will be available at `http://localhost:3000` (frontend) with the API running on `http://localhost:8000` (backend).

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