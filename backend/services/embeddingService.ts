import { CohereClient } from 'cohere-ai'
import { logInfo, logError } from '../utils/logger'

/**
 * Creates an embedding vector for the given text using Cohere's embedding model.
 * @param text - The text to generate an embedding for
 * @returns Promise resolving to an array of numbers representing the embedding vector
 */
export const createEmbedding = async (text: string): Promise<number[]> => {
  try {
    const cohere = new CohereClient({
      token: process.env.COHERE_API_KEY!,
    })

    const res = await cohere.embed({
      model: 'embed-english-v3.0',
      texts: [text],
      inputType: 'search_document',
    })

    // Cohere returns embeddings as number[][]
    const embeddings = res.embeddings as number[][]
    return embeddings[0]
  } catch (err) {
    logError('Failed to create embedding', err)
    throw err
  }
}
