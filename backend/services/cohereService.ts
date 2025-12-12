/**
 * Cohere Chat Service
 *
 * Provides interface to Cohere's Chat API for generating LLM responses.
 * Handles token tracking and error management.
 */

import { CohereClient } from 'cohere-ai';
import { logError } from '../utils/logger.js';

export interface CohereGenerateOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface CohereGenerateResponse {
  text: string;
  model: string;
  tokenUsage: {
    promptTokens: number;
    completionTokens: number;
  };
}

// Default model: command-r is cost-effective and high quality for RAG use cases
// Pricing: $0.15/1M input tokens, $0.60/1M output tokens (94% cheaper than command-r-plus)
// Context window: 128k tokens
// Cost per query: ~$0.0008 (less than 0.1 cents)
const DEFAULT_MODEL = 'command-r-08-2024';

/**
 * Generates a chat response using Cohere's Chat API.
 *
 * @param prompt - The prompt/message to send to the LLM
 * @param options - Configuration options for generation
 * @returns Promise resolving to the generated response with token usage
 * @throws Error if Cohere API call fails
 */
export const generateChatResponse = async (
  prompt: string,
  options: CohereGenerateOptions = {}
): Promise<CohereGenerateResponse> => {
  try {
    const cohere = new CohereClient({
      token: process.env.COHERE_API_KEY!,
    });

    const response = await cohere.chat({
      message: prompt,
      model: options.model || DEFAULT_MODEL,
      temperature: options.temperature || 0.3,
      maxTokens: options.maxTokens || 2000,
    });

    return {
      text: response.text,
      model: response.model || options.model || DEFAULT_MODEL,
      tokenUsage: {
        promptTokens: response.meta?.tokens?.inputTokens || 0,
        completionTokens: response.meta?.tokens?.outputTokens || 0,
      },
    };
  } catch (err) {
    logError('Failed to generate chat response with Cohere', err);
    throw err;
  }
};
