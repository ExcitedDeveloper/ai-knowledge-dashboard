import { createEmbedding } from './embeddingService.js';
import { CohereClient } from 'cohere-ai';
import * as logger from '../utils/logger.js';

// Mock the Cohere client
jest.mock('cohere-ai');
jest.mock('../utils/logger.js');

const mockCohereClient = CohereClient as jest.MockedClass<typeof CohereClient>;
const mockLogError = logger.logError as jest.MockedFunction<
  typeof logger.logError
>;

describe('embeddingService', () => {
  describe('createEmbedding', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      process.env.COHERE_API_KEY = 'test-api-key';
    });

    afterEach(() => {
      delete process.env.COHERE_API_KEY;
    });

    it('should create an embedding for valid text', async () => {
      const mockEmbedding = [0.1, 0.2, 0.3, 0.4, 0.5];
      const mockEmbed = jest.fn().mockResolvedValue({
        embeddings: [mockEmbedding],
      });

      mockCohereClient.prototype.embed = mockEmbed;

      const result = await createEmbedding('test text');

      expect(result).toEqual(mockEmbedding);
      expect(mockEmbed).toHaveBeenCalledWith({
        model: 'embed-english-v3.0',
        texts: ['test text'],
        inputType: 'search_document',
      });
    });

    it('should initialize CohereClient with API key from environment', async () => {
      const mockEmbedding = [0.1, 0.2, 0.3];
      const mockEmbed = jest.fn().mockResolvedValue({
        embeddings: [mockEmbedding],
      });

      mockCohereClient.prototype.embed = mockEmbed;

      await createEmbedding('test');

      expect(mockCohereClient).toHaveBeenCalledWith({
        token: 'test-api-key',
      });
    });

    it('should handle empty text', async () => {
      const mockEmbedding = [0.0];
      const mockEmbed = jest.fn().mockResolvedValue({
        embeddings: [mockEmbedding],
      });

      mockCohereClient.prototype.embed = mockEmbed;

      const result = await createEmbedding('');

      expect(result).toEqual(mockEmbedding);
      expect(mockEmbed).toHaveBeenCalledWith({
        model: 'embed-english-v3.0',
        texts: [''],
        inputType: 'search_document',
      });
    });

    it('should handle long text', async () => {
      const longText = 'a'.repeat(10000);
      const mockEmbedding = Array(1024).fill(0.1);
      const mockEmbed = jest.fn().mockResolvedValue({
        embeddings: [mockEmbedding],
      });

      mockCohereClient.prototype.embed = mockEmbed;

      const result = await createEmbedding(longText);

      expect(result).toEqual(mockEmbedding);
      expect(mockEmbed).toHaveBeenCalledWith({
        model: 'embed-english-v3.0',
        texts: [longText],
        inputType: 'search_document',
      });
    });

    it('should handle special characters', async () => {
      const specialText = '!@#$%^&*()_+{}|:"<>?[]\\;\',./';
      const mockEmbedding = [0.1, 0.2, 0.3];
      const mockEmbed = jest.fn().mockResolvedValue({
        embeddings: [mockEmbedding],
      });

      mockCohereClient.prototype.embed = mockEmbed;

      const result = await createEmbedding(specialText);

      expect(result).toEqual(mockEmbedding);
      expect(mockEmbed).toHaveBeenCalledWith({
        model: 'embed-english-v3.0',
        texts: [specialText],
        inputType: 'search_document',
      });
    });

    it('should handle unicode characters', async () => {
      const unicodeText = 'Hello 世界 🌍 مرحبا';
      const mockEmbedding = [0.1, 0.2, 0.3];
      const mockEmbed = jest.fn().mockResolvedValue({
        embeddings: [mockEmbedding],
      });

      mockCohereClient.prototype.embed = mockEmbed;

      const result = await createEmbedding(unicodeText);

      expect(result).toEqual(mockEmbedding);
      expect(mockEmbed).toHaveBeenCalledWith({
        model: 'embed-english-v3.0',
        texts: [unicodeText],
        inputType: 'search_document',
      });
    });

    describe('error handling', () => {
      it('should log error and rethrow when API call fails', async () => {
        const apiError = new Error('API Error');
        const mockEmbed = jest.fn().mockRejectedValue(apiError);

        mockCohereClient.prototype.embed = mockEmbed;

        await expect(createEmbedding('test text')).rejects.toThrow('API Error');
        expect(mockLogError).toHaveBeenCalledWith(
          'Failed to create embedding',
          apiError
        );
      });

      it('should handle network errors', async () => {
        const networkError = new Error('Network Error');
        const mockEmbed = jest.fn().mockRejectedValue(networkError);

        mockCohereClient.prototype.embed = mockEmbed;

        await expect(createEmbedding('test')).rejects.toThrow('Network Error');
        expect(mockLogError).toHaveBeenCalledWith(
          'Failed to create embedding',
          networkError
        );
      });

      it('should handle invalid API key errors', async () => {
        const authError = new Error('Invalid API key');
        const mockEmbed = jest.fn().mockRejectedValue(authError);

        mockCohereClient.prototype.embed = mockEmbed;

        await expect(createEmbedding('test')).rejects.toThrow(
          'Invalid API key'
        );
        expect(mockLogError).toHaveBeenCalledWith(
          'Failed to create embedding',
          authError
        );
      });

      it('should handle rate limiting errors', async () => {
        const rateLimitError = new Error('Rate limit exceeded');
        const mockEmbed = jest.fn().mockRejectedValue(rateLimitError);

        mockCohereClient.prototype.embed = mockEmbed;

        await expect(createEmbedding('test')).rejects.toThrow(
          'Rate limit exceeded'
        );
        expect(mockLogError).toHaveBeenCalledWith(
          'Failed to create embedding',
          rateLimitError
        );
      });

      it('should handle malformed response', async () => {
        const mockEmbed = jest.fn().mockResolvedValue({
          embeddings: null,
        });

        mockCohereClient.prototype.embed = mockEmbed;

        await expect(createEmbedding('test')).rejects.toThrow();
      });
    });

    describe('response parsing', () => {
      it('should correctly extract first embedding from response', async () => {
        const mockEmbeddings = [
          [0.1, 0.2, 0.3],
          [0.4, 0.5, 0.6], // This should not be returned
        ];
        const mockEmbed = jest.fn().mockResolvedValue({
          embeddings: mockEmbeddings,
        });

        mockCohereClient.prototype.embed = mockEmbed;

        const result = await createEmbedding('test');

        expect(result).toEqual(mockEmbeddings[0]);
        expect(result).not.toEqual(mockEmbeddings[1]);
      });

      it('should handle embedding with many dimensions', async () => {
        const mockEmbedding = Array(1024)
          .fill(0)
          .map((_, i) => i * 0.001);
        const mockEmbed = jest.fn().mockResolvedValue({
          embeddings: [mockEmbedding],
        });

        mockCohereClient.prototype.embed = mockEmbed;

        const result = await createEmbedding('test');

        expect(result).toHaveLength(1024);
        expect(result).toEqual(mockEmbedding);
      });

      it('should handle embedding with negative values', async () => {
        const mockEmbedding = [-0.5, -0.3, 0.2, 0.4];
        const mockEmbed = jest.fn().mockResolvedValue({
          embeddings: [mockEmbedding],
        });

        mockCohereClient.prototype.embed = mockEmbed;

        const result = await createEmbedding('test');

        expect(result).toEqual(mockEmbedding);
      });
    });
  });
});
