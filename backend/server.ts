// Import required dependencies
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import uploadRoutes from './routes/uploadRoutes.js'
import filesRoutes from './routes/filesRoutes.js'
import searchRoutes from './routes/searchRoutes.js'

// Create Express application instance
const app = express()

// Enable Cross-Origin Resource Sharing (CORS) for all routes
// This allows the frontend to make requests to the backend from a different origin
app.use(cors())

// Parse incoming JSON requests and make the data available in req.body
app.use(express.json())

// Parse URL-encoded data (from HTML forms)
app.use(express.urlencoded({ extended: true }))

// Mount routes
app.use('/api/upload', uploadRoutes)
app.use('/api/files', filesRoutes)
app.use('/api/search', searchRoutes)

// Set the port from environment variable or default to 3001
const PORT = process.env.PORT || 3001

// Start the server and listen on the specified port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
