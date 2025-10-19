import { cosineSimilarity } from './math'

describe('cosineSimilarity', () => {
  describe('valid inputs', () => {
    test('should return 1 for identical vectors', () => {
      const result = cosineSimilarity([1, 2, 3], [1, 2, 3])
      expect(result).toBeCloseTo(1, 5)
    })

    test('should return 1 for proportional vectors', () => {
      const result = cosineSimilarity([1, 2, 3], [2, 4, 6])
      expect(result).toBeCloseTo(1, 5)
    })

    test('should return 0 for orthogonal vectors', () => {
      const result = cosineSimilarity([1, 0, 0], [0, 1, 0])
      expect(result).toBeCloseTo(0, 5)
    })

    test('should return -1 for opposite vectors', () => {
      const result = cosineSimilarity([1, 2, 3], [-1, -2, -3])
      expect(result).toBeCloseTo(-1, 5)
    })

    test('should calculate similarity for positive correlation', () => {
      const result = cosineSimilarity([1, 2, 3], [4, 5, 6])
      expect(result).toBeCloseTo(0.9746318461970762, 5)
    })

    test('should handle vectors with decimals', () => {
      const result = cosineSimilarity([0.5, 1.5, 2.5], [1.0, 2.0, 3.0])
      expect(result).toBeCloseTo(0.9938586931957764, 5)
    })

    test('should handle negative values', () => {
      const result = cosineSimilarity([1, -2, 3], [4, -5, 6])
      expect(result).toBeCloseTo(0.9746318461970762, 5)
    })

    test('should handle single element vectors', () => {
      const result = cosineSimilarity([5], [10])
      expect(result).toBeCloseTo(1, 5)
    })

    test('should handle large vectors', () => {
      const a = Array.from({ length: 1000 }, (_, i) => i)
      const b = Array.from({ length: 1000 }, (_, i) => i + 1)
      const result = cosineSimilarity(a, b)
      expect(result).toBeGreaterThan(0.99)
    })
  })

  describe('edge cases', () => {
    test('should return 0 for zero-magnitude vector (first)', () => {
      const result = cosineSimilarity([0, 0, 0], [1, 2, 3])
      expect(result).toBe(0)
    })

    test('should return 0 for zero-magnitude vector (second)', () => {
      const result = cosineSimilarity([1, 2, 3], [0, 0, 0])
      expect(result).toBe(0)
    })

    test('should return 0 for both zero-magnitude vectors', () => {
      const result = cosineSimilarity([0, 0, 0], [0, 0, 0])
      expect(result).toBe(0)
    })

    test('should handle vectors with some zero elements', () => {
      const result = cosineSimilarity([1, 0, 3], [0, 2, 0])
      expect(result).toBeCloseTo(0, 5)
    })
  })

  describe('invalid inputs', () => {
    test('should return 0 for empty first array', () => {
      const result = cosineSimilarity([], [1, 2, 3])
      expect(result).toBe(0)
    })

    test('should return 0 for empty second array', () => {
      const result = cosineSimilarity([1, 2, 3], [])
      expect(result).toBe(0)
    })

    test('should return 0 for both empty arrays', () => {
      const result = cosineSimilarity([], [])
      expect(result).toBe(0)
    })

    test('should return 0 for mismatched array lengths', () => {
      const result = cosineSimilarity([1, 2], [1, 2, 3])
      expect(result).toBe(0)
    })

    test('should return 0 for mismatched array lengths (reverse)', () => {
      const result = cosineSimilarity([1, 2, 3, 4], [1, 2])
      expect(result).toBe(0)
    })
  })

  describe('real-world embedding scenarios', () => {
    test('should calculate similarity for embeddings (high similarity)', () => {
      // Simulate similar document embeddings
      const embedding1 = [0.1, 0.2, 0.3, 0.4, 0.5]
      const embedding2 = [0.12, 0.19, 0.31, 0.39, 0.51]
      const result = cosineSimilarity(embedding1, embedding2)
      expect(result).toBeGreaterThan(0.99)
    })

    test('should calculate similarity for embeddings (low similarity)', () => {
      // Simulate dissimilar document embeddings
      const embedding1 = [0.9, 0.1, 0.0, 0.0, 0.0]
      const embedding2 = [0.0, 0.0, 0.1, 0.9, 0.0]
      const result = cosineSimilarity(embedding1, embedding2)
      expect(result).toBeLessThan(0.1)
    })

    test('should calculate similarity for normalized embeddings', () => {
      // Many embedding models return unit vectors
      const embedding1 = [0.6, 0.8, 0.0]
      const embedding2 = [0.8, 0.6, 0.0]
      const result = cosineSimilarity(embedding1, embedding2)
      expect(result).toBeCloseTo(0.96, 2)
    })
  })
})
