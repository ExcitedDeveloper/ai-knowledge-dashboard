import request from 'supertest';
import express from 'express';
import searchRoutes from './searchRoutes';
import { handleSearch } from '../controllers/searchController';

// Mock the search controller
jest.mock('../controllers/searchController');

const mockHandleSearch = handleSearch as jest.MockedFunction<
  typeof handleSearch
>;

describe('searchRoutes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/search', searchRoutes);
    jest.clearAllMocks();
  });

  describe('GET /search', () => {
    test('should call handleSearch controller with correct parameters', async () => {
      mockHandleSearch.mockImplementation(async (_req, res) => {
        res.status(200).json({ results: [] });
      });

      const queryParams = {
        query: 'test search',
        limit: '10',
        offset: '0',
      };

      const response = await request(app).get('/search').query(queryParams);

      expect(response.status).toBe(200);
      expect(mockHandleSearch).toHaveBeenCalledTimes(1);
      expect(mockHandleSearch).toHaveBeenCalledWith(
        expect.objectContaining({
          query: expect.objectContaining(queryParams),
        }),
        expect.any(Object)
      );
    });

    test('should handle search with minimal query parameters', async () => {
      mockHandleSearch.mockImplementation(async (_req, res) => {
        res.status(200).json({ results: [] });
      });

      const response = await request(app)
        .get('/search')
        .query({ query: 'minimal' });

      expect(response.status).toBe(200);
      expect(mockHandleSearch).toHaveBeenCalledTimes(1);
    });

    test('should handle search with all query parameters', async () => {
      mockHandleSearch.mockImplementation(async (_req, res) => {
        res.status(200).json({ results: [] });
      });

      const queryParams = {
        query: 'comprehensive search',
        limit: '25',
        offset: '50',
        sort: 'relevance',
      };

      const response = await request(app).get('/search').query(queryParams);

      expect(response.status).toBe(200);
      expect(mockHandleSearch).toHaveBeenCalledTimes(1);
      expect(mockHandleSearch).toHaveBeenCalledWith(
        expect.objectContaining({
          query: expect.objectContaining(queryParams),
        }),
        expect.any(Object)
      );
    });

    test('should handle empty query parameters', async () => {
      mockHandleSearch.mockImplementation(async (_req, res) => {
        res.status(400).json({ error: 'Query is required' });
      });

      const response = await request(app).get('/search');

      expect(response.status).toBe(400);
      expect(mockHandleSearch).toHaveBeenCalledTimes(1);
    });

    test('should propagate controller errors', async () => {
      mockHandleSearch.mockImplementation(async (_req, res) => {
        res.status(500).json({ error: 'Internal server error' });
      });

      const response = await request(app)
        .get('/search')
        .query({ query: 'error test' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
      expect(mockHandleSearch).toHaveBeenCalledTimes(1);
    });

    test('should handle special characters in query', async () => {
      mockHandleSearch.mockImplementation(async (_req, res) => {
        res.status(200).json({ results: [] });
      });

      const specialQuery = 'test & special characters #@$%';

      const response = await request(app)
        .get('/search')
        .query({ query: specialQuery });

      expect(response.status).toBe(200);
      expect(mockHandleSearch).toHaveBeenCalledWith(
        expect.objectContaining({
          query: expect.objectContaining({
            query: specialQuery,
          }),
        }),
        expect.any(Object)
      );
    });

    test('should handle numeric string parameters correctly', async () => {
      mockHandleSearch.mockImplementation(async (_req, res) => {
        res.status(200).json({ results: [] });
      });

      const response = await request(app).get('/search').query({
        query: 'numeric test',
        limit: '100',
        offset: '500',
      });

      expect(response.status).toBe(200);
      expect(mockHandleSearch).toHaveBeenCalledWith(
        expect.objectContaining({
          query: expect.objectContaining({
            query: 'numeric test',
            limit: '100',
            offset: '500',
          }),
        }),
        expect.any(Object)
      );
    });

    test('should handle multiple query parameters with same name', async () => {
      mockHandleSearch.mockImplementation(async (_req, res) => {
        res.status(200).json({ results: [] });
      });

      // Express will handle this as an array or the last value
      const response = await request(app).get(
        '/search?query=first&query=second'
      );

      expect(response.status).toBe(200);
      expect(mockHandleSearch).toHaveBeenCalledTimes(1);
    });

    test('should preserve request and response objects', async () => {
      let capturedReq: unknown;
      let capturedRes: unknown;

      mockHandleSearch.mockImplementation(async (req, res) => {
        capturedReq = req;
        capturedRes = res;
        res.status(200).json({ results: [] });
      });

      await request(app).get('/search').query({ query: 'test' });

      expect(capturedReq).toBeDefined();
      expect(capturedRes).toBeDefined();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((capturedReq as any).method).toBe('GET');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((capturedReq as any).query).toEqual({ query: 'test' });
    });
  });

  describe('Route configuration', () => {
    test('should only accept GET requests', async () => {
      const response = await request(app)
        .post('/search')
        .send({ query: 'test' });

      expect(response.status).toBe(404);
      expect(mockHandleSearch).not.toHaveBeenCalled();
    });

    test('should not accept PUT requests', async () => {
      const response = await request(app)
        .put('/search')
        .send({ query: 'test' });

      expect(response.status).toBe(404);
      expect(mockHandleSearch).not.toHaveBeenCalled();
    });

    test('should not accept DELETE requests', async () => {
      const response = await request(app).delete('/search');

      expect(response.status).toBe(404);
      expect(mockHandleSearch).not.toHaveBeenCalled();
    });
  });
});
