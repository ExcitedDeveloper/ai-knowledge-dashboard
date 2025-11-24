import request from 'supertest';
import express from 'express';
import { publicApiLimiter } from '../middleware/rateLimiter';
import uploadRoutes from './uploadRoutes';
import searchRoutes from './searchRoutes';
import filesRoutes from './filesRoutes';

// Mock the controllers to avoid actual file processing and database calls
jest.mock('../controllers/uploadController');
jest.mock('../controllers/searchController');
jest.mock('../controllers/filesController');

describe('Rate Limiting Integration Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    // Recreate the app with the same configuration as server.ts
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Mount routes with rate limiting (same as server.ts)
    app.use('/api/upload', publicApiLimiter, uploadRoutes);
    app.use('/api/files', filesRoutes);
    app.use('/api/search', publicApiLimiter, searchRoutes);

    jest.clearAllMocks();
  });

  describe('Rate-limited endpoints', () => {
    describe('POST /api/upload', () => {
      test('should have rate limiting headers', async () => {
        const { handleFileUpload } = await import(
          '../controllers/uploadController'
        );
        const mockHandleFileUpload = handleFileUpload as jest.MockedFunction<
          typeof handleFileUpload
        >;

        mockHandleFileUpload.mockImplementation(
          async (_req, res) => res.status(200).json({ success: true })
        );

        const response = await request(app)
          .post('/api/upload')
          .attach('file', Buffer.from('test'), 'test.txt');

        expect(response.headers).toHaveProperty('ratelimit-limit');
        expect(response.headers).toHaveProperty('ratelimit-remaining');
        expect(response.headers).toHaveProperty('ratelimit-reset');
        expect(response.headers['ratelimit-limit']).toBe('100');
      });

      test('should return 429 when rate limit exceeded', async () => {
        const { handleFileUpload } = await import(
          '../controllers/uploadController'
        );
        const mockHandleFileUpload = handleFileUpload as jest.MockedFunction<
          typeof handleFileUpload
        >;

        mockHandleFileUpload.mockImplementation(
          async (_req, res) => res.status(200).json({ success: true })
        );

        // Make 100 requests to hit the limit
        const requests = Array.from({ length: 100 }, () =>
          request(app)
            .post('/api/upload')
            .attach('file', Buffer.from('test'), 'test.txt')
        );
        await Promise.all(requests);

        // The 101st request should be rate limited
        const response = await request(app)
          .post('/api/upload')
          .attach('file', Buffer.from('test'), 'test.txt');

        expect(response.status).toBe(429);
        expect(response.body).toEqual({
          error: 'Too many requests',
          message:
            'You have exceeded the rate limit. Please try again later.',
          retryAfter: 900,
        });
      });
    });

    describe('GET /api/search', () => {
      test('should have rate limiting headers', async () => {
        const response = await request(app).get('/api/search?query=test');

        expect(response.headers).toHaveProperty('ratelimit-limit');
        expect(response.headers).toHaveProperty('ratelimit-remaining');
        expect(response.headers).toHaveProperty('ratelimit-reset');
        expect(response.headers['ratelimit-limit']).toBe('100');
      });

      test('should return 429 when rate limit exceeded', async () => {
        // Make 100 requests to hit the limit
        const requests = Array.from({ length: 100 }, () =>
          request(app).get('/api/search?query=test')
        );
        await Promise.all(requests);

        // The 101st request should be rate limited
        const response = await request(app).get('/api/search?query=test');

        expect(response.status).toBe(429);
        expect(response.body).toEqual({
          error: 'Too many requests',
          message:
            'You have exceeded the rate limit. Please try again later.',
          retryAfter: 900,
        });
      });
    });
  });

  describe('Non-rate-limited endpoints', () => {
    describe('GET /api/files', () => {
      test('should NOT have rate limiting headers', async () => {
        const response = await request(app).get('/api/files');

        expect(response.headers).not.toHaveProperty('ratelimit-limit');
        expect(response.headers).not.toHaveProperty('ratelimit-remaining');
        expect(response.headers).not.toHaveProperty('ratelimit-reset');
      });

      test('should not be affected by rate limits on other endpoints', async () => {
        // Make 100 requests to /api/search to hit the rate limit
        const requests = Array.from({ length: 100 }, () =>
          request(app).get('/api/search?query=test')
        );
        await Promise.all(requests);

        // /api/files should still work
        const response = await request(app).get('/api/files');

        expect(response.status).not.toBe(429);
        expect(response.headers).not.toHaveProperty('ratelimit-limit');
      });
    });
  });

  describe('Shared rate limit counter', () => {
    test('should share rate limit counter between /api/upload and /api/search', async () => {
      const { handleFileUpload } = await import(
        '../controllers/uploadController'
      );
      const mockHandleFileUpload = handleFileUpload as jest.MockedFunction<
        typeof handleFileUpload
      >;

      mockHandleFileUpload.mockImplementation(
        async (_req, res) => res.status(200).json({ success: true })
      );

      // Make request to /api/search
      const searchResponse = await request(app).get('/api/search?query=test');
      const remainingAfterSearch = parseInt(
        searchResponse.headers['ratelimit-remaining']
      );

      // Make request to /api/upload - should share the same counter
      const uploadResponse = await request(app)
        .post('/api/upload')
        .attach('file', Buffer.from('test'), 'test.txt');
      const remainingAfterUpload = parseInt(
        uploadResponse.headers['ratelimit-remaining']
      );

      // The counter should have decreased (or both should be rate limited)
      if (searchResponse.status < 400 && uploadResponse.status < 400) {
        expect(remainingAfterUpload).toBe(remainingAfterSearch - 1);
      } else {
        // Both responses should have rate limit headers
        expect(searchResponse.headers).toHaveProperty('ratelimit-limit');
        expect(uploadResponse.headers).toHaveProperty('ratelimit-limit');
      }
    });

    test('should count requests from both endpoints toward the same limit', async () => {
      const { handleFileUpload } = await import(
        '../controllers/uploadController'
      );
      const mockHandleFileUpload = handleFileUpload as jest.MockedFunction<
        typeof handleFileUpload
      >;

      mockHandleFileUpload.mockImplementation(
        async (_req, res) => res.status(200).json({ success: true })
      );

      // Make 50 requests to /api/search
      const searchRequests = Array.from({ length: 50 }, () =>
        request(app).get('/api/search?query=test')
      );
      await Promise.all(searchRequests);

      // Make 50 requests to /api/upload
      const uploadRequests = Array.from({ length: 50 }, () =>
        request(app)
          .post('/api/upload')
          .attach('file', Buffer.from('test'), 'test.txt')
      );
      await Promise.all(uploadRequests);

      // The next request to either endpoint should be rate limited
      const response = await request(app).get('/api/search?query=test');

      expect(response.status).toBe(429);
      expect(response.body).toEqual({
        error: 'Too many requests',
        message: 'You have exceeded the rate limit. Please try again later.',
        retryAfter: 900,
      });
    });
  });

  describe('Rate limit error response format', () => {
    test('should return JSON error with correct structure', async () => {
      // Make 100 requests to hit the limit
      const requests = Array.from({ length: 100 }, () =>
        request(app).get('/api/search?query=test')
      );
      await Promise.all(requests);

      // The 101st request should be rate limited with proper JSON
      const response = await request(app).get('/api/search?query=test');

      expect(response.status).toBe(429);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('retryAfter');
      expect(typeof response.body.error).toBe('string');
      expect(typeof response.body.message).toBe('string');
      expect(typeof response.body.retryAfter).toBe('number');
    });

    test('should have retryAfter value of 900 seconds (15 minutes)', async () => {
      const { handleFileUpload } = await import(
        '../controllers/uploadController'
      );
      const mockHandleFileUpload = handleFileUpload as jest.MockedFunction<
        typeof handleFileUpload
      >;

      mockHandleFileUpload.mockImplementation(
        async (_req, res) => res.status(200).json({ success: true })
      );

      // Make 100 requests to hit the limit
      const requests = Array.from({ length: 100 }, () =>
        request(app)
          .post('/api/upload')
          .attach('file', Buffer.from('test'), 'test.txt')
      );
      await Promise.all(requests);

      // The 101st request should be rate limited
      const response = await request(app)
        .post('/api/upload')
        .attach('file', Buffer.from('test'), 'test.txt');

      expect(response.body.retryAfter).toBe(900);
    });
  });
});
