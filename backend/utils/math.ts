/**
 * Calculates the cosine similarity between two vectors
 *
 * Cosine similarity measures the cosine of the angle between two vectors,
 * resulting in a value between -1 and 1 where:
 * - 1 means the vectors are identical in direction
 * - 0 means the vectors are orthogonal (perpendicular)
 * - -1 means the vectors are opposite in direction
 *
 * @param a - First vector as an array of numbers
 * @param b - Second vector as an array of numbers
 * @returns The cosine similarity score between -1 and 1, or 0 if vectors have zero magnitude, are empty, or have different lengths
 *
 * @example
 * ```typescript
 * cosineSimilarity([1, 2, 3], [4, 5, 6]) // Returns ~0.974
 * cosineSimilarity([1, 0], [0, 1]) // Returns 0 (orthogonal)
 * cosineSimilarity([1, 1], [1, 1]) // Returns 1 (identical)
 * ```
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  // Validate inputs
  if (!a || !b || a.length === 0 || b.length === 0) {
    return 0
  }

  if (a.length !== b.length) {
    return 0
  }

  // Calculate dot product
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0)

  // Calculate magnitudes
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))

  // Handle zero magnitude vectors (avoid division by zero)
  if (magA === 0 || magB === 0) {
    return 0
  }

  return dot / (magA * magB)
}
