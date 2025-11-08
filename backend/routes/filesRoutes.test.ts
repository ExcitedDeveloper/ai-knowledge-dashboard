import request from 'supertest'
import express from 'express'
import filesRoutes from './filesRoutes'
import { deleteFile, getFiles } from '../controllers/filesController'
import { UploadedFile } from '../lib/store'

// Mock the filesController
jest.mock('../controllers/filesController')

const app = express()
app.use(express.json())
app.use('/files', filesRoutes)

describe('GET /files', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return empty array when no files exist', async () => {
    ;(getFiles as jest.Mock).mockResolvedValue([])

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

    ;(getFiles as jest.Mock).mockResolvedValue(mockFiles)

    const response = await request(app).get('/files')

    expect(response.status).toBe(200)
    expect(response.body).toEqual(mockFiles)
    expect(response.body).toHaveLength(2)
  })

  test('should return JSON content type', async () => {
    ;(getFiles as jest.Mock).mockResolvedValue([])

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

    ;(getFiles as jest.Mock).mockResolvedValue([mockFile])

    const response = await request(app).get('/files')

    expect(response.status).toBe(200)
    expect(response.body).toEqual([mockFile])
    expect(response.body).toHaveLength(1)
  })

  test('should handle database errors', async () => {
    ;(getFiles as jest.Mock).mockRejectedValue(new Error('Database error'))

    const response = await request(app).get('/files')

    expect(response.status).toBe(500)
    expect(response.body).toEqual({ error: 'Failed to retrieve files' })
  })
})

describe('DELETE /files/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should successfully delete file with valid UUID', async () => {
    ;(deleteFile as jest.Mock).mockResolvedValue(undefined)

    const validUuid = '123e4567-e89b-12d3-a456-426614174000'
    const response = await request(app).delete(`/files/${validUuid}`)

    expect(response.status).toBe(204)
    expect(deleteFile).toHaveBeenCalledWith(validUuid)
  })

  test('should reject invalid UUID format', async () => {
    const invalidUuid = 'not-a-valid-uuid'
    const response = await request(app).delete(`/files/${invalidUuid}`)

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ error: 'Invalid UUID format' })
    expect(deleteFile).not.toHaveBeenCalled()
  })

  test('should reject UUID with wrong segment lengths', async () => {
    const invalidUuid = '123e4567-e89b-12d3-a456-42661417400'
    const response = await request(app).delete(`/files/${invalidUuid}`)

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ error: 'Invalid UUID format' })
    expect(deleteFile).not.toHaveBeenCalled()
  })

  test('should reject UUID with invalid characters', async () => {
    const invalidUuid = '123g4567-e89b-12d3-a456-426614174000'
    const response = await request(app).delete(`/files/${invalidUuid}`)

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ error: 'Invalid UUID format' })
    expect(deleteFile).not.toHaveBeenCalled()
  })

  test('should reject empty UUID', async () => {
    const response = await request(app).delete('/files/')

    expect(response.status).toBe(404)
    expect(deleteFile).not.toHaveBeenCalled()
  })

  test('should handle database errors', async () => {
    ;(deleteFile as jest.Mock).mockRejectedValue(new Error('Database error'))

    const validUuid = '123e4567-e89b-12d3-a456-426614174000'
    const response = await request(app).delete(`/files/${validUuid}`)

    expect(response.status).toBe(500)
    expect(response.body).toEqual({ error: 'Failed to delete file' })
  })

  test('should handle uppercase UUIDs', async () => {
    ;(deleteFile as jest.Mock).mockResolvedValue(undefined)

    const validUuid = '123E4567-E89B-12D3-A456-426614174000'
    const response = await request(app).delete(`/files/${validUuid}`)

    expect(response.status).toBe(204)
    expect(deleteFile).toHaveBeenCalledWith(validUuid)
  })

  test('should handle mixed case UUIDs', async () => {
    ;(deleteFile as jest.Mock).mockResolvedValue(undefined)

    const validUuid = '123e4567-E89B-12d3-A456-426614174000'
    const response = await request(app).delete(`/files/${validUuid}`)

    expect(response.status).toBe(204)
    expect(deleteFile).toHaveBeenCalledWith(validUuid)
  })
})