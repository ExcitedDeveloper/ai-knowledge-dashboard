import request from 'supertest'
import express from 'express'
import filesRoutes from './filesRoutes'
import { addFile } from '../controllers/filesController'
import store, { UploadedFile } from '../lib/store'

const app = express()
app.use(express.json())
app.use('/files', filesRoutes)

describe('GET /files', () => {
  beforeEach(() => {
    // Clear store before each test
    store.files = []
  })

  test('should return empty array when no files exist', async () => {
    const response = await request(app).get('/files')

    expect(response.status).toBe(200)
    expect(response.body).toEqual([])
  })

  test('should return all files when files exist', async () => {
    const mockFiles: UploadedFile[] = [
      {
        filename: 'test1.pdf',
        text: 'Test content 1',
        timestamp: 1640995200000,
        embedding: [0.1, 0.2, 0.3],
      },
      {
        filename: 'test2.pdf',
        text: 'Test content 2',
        timestamp: 1640995300000,
        embedding: [0.4, 0.5, 0.6],
      },
    ]

    // Add files to store
    mockFiles.forEach(file => addFile(file))

    const response = await request(app).get('/files')

    expect(response.status).toBe(200)
    expect(response.body).toEqual(mockFiles)
    expect(response.body).toHaveLength(2)
  })

  test('should return JSON content type', async () => {
    const response = await request(app).get('/files')

    expect(response.status).toBe(200)
    expect(response.headers['content-type']).toMatch(/application\/json/)
  })

  test('should handle single file correctly', async () => {
    const mockFile: UploadedFile = {
      filename: 'single.pdf',
      text: 'Single file content',
      timestamp: 1640995200000,
      embedding: [0.1, 0.2, 0.3],
    }

    addFile(mockFile)

    const response = await request(app).get('/files')

    expect(response.status).toBe(200)
    expect(response.body).toEqual([mockFile])
    expect(response.body).toHaveLength(1)
  })
})