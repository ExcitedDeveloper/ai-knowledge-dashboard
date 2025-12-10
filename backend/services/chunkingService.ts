/**
 * Chunking Service
 *
 * Handles document chunking with configurable chunk size and overlap.
 * Uses sentence-aware splitting to avoid breaking mid-sentence.
 */

export interface ChunkingConfig {
  chunkSize: number; // in tokens
  overlapSize: number; // in tokens
  minChunkSize: number; // minimum viable chunk
}

export interface Chunk {
  text: string;
  startOffset: number;
  endOffset: number;
}

// Token estimation constant: approximately 4 characters per token for English text
const CHARS_PER_TOKEN = 4;

const DEFAULT_CONFIG: ChunkingConfig = {
  chunkSize: 512,
  overlapSize: 128,
  minChunkSize: 50,
};

/**
 * Estimates the number of tokens in a text using a simple heuristic.
 * Approximation: 1 token ≈ 4 characters (works well for English text)
 *
 * @param text - The text to estimate tokens for
 * @returns Estimated token count
 */
export const estimateTokens = (text: string): number => {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
};

/**
 * Splits text into sentences using common sentence-ending punctuation.
 * Preserves the sentence-ending punctuation with each sentence.
 *
 * @param text - The text to split into sentences
 * @returns Array of sentences
 */
const splitIntoSentences = (text: string): string[] => {
  // Split by sentence-ending punctuation followed by whitespace
  // Handles: period, exclamation, question mark
  const sentences = text.split(/([.!?]+\s+)/);

  // The regex split with capturing group creates pairs: [text, delimiter, text, delimiter, ...]
  // Example: "A. B." -> ["A", ". ", "B", ". ", ""]
  // So we step by 2 to process each sentence + its punctuation
  const result: string[] = [];
  for (let i = 0; i < sentences.length; i += 2) {
    const sentence = sentences[i];
    const punctuation = sentences[i + 1] || '';
    if (sentence.trim()) {
      result.push(sentence + punctuation);
    }
  }

  return result.length > 0 ? result : [text];
};

/**
 * Chunks a document into overlapping segments of approximately equal token size.
 * Uses sentence-aware splitting to avoid breaking in the middle of sentences.
 *
 * @param text - The document text to chunk
 * @param config - Configuration for chunk size and overlap
 * @returns Array of chunks with text and character offsets
 */
export const chunkDocument = (
  text: string,
  config: ChunkingConfig = DEFAULT_CONFIG
): Chunk[] => {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const sentences = splitIntoSentences(text);
  const chunks: Chunk[] = [];

  let currentChunk: string[] = [];
  let currentTokens = 0;
  let currentStartOffset = 0;

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    const sentenceTokens = estimateTokens(sentence);

    // If adding this sentence would exceed chunk size, finalize current chunk
    if (currentTokens + sentenceTokens > config.chunkSize && currentChunk.length > 0) {
      const chunkText = currentChunk.join('').trim();

      // Only add chunk if it meets minimum size requirement
      if (estimateTokens(chunkText) >= config.minChunkSize) {
        chunks.push({
          text: chunkText,
          startOffset: currentStartOffset,
          endOffset: currentStartOffset + chunkText.length,
        });
      }

      // Calculate overlap: keep last N sentences to create overlap
      const overlapSentences: string[] = [];
      let overlapTokens = 0;

      // Work backwards from current chunk to build overlap
      for (let j = currentChunk.length - 1; j >= 0; j--) {
        const overlapSentence = currentChunk[j];
        const overlapSentenceTokens = estimateTokens(overlapSentence);

        if (overlapTokens + overlapSentenceTokens <= config.overlapSize) {
          overlapSentences.unshift(overlapSentence);
          overlapTokens += overlapSentenceTokens;
        } else {
          break;
        }
      }

      // Start new chunk with overlap
      currentChunk = overlapSentences;
      currentTokens = overlapTokens;

      // Update start offset (account for overlap)
      const overlapText = overlapSentences.join('');
      currentStartOffset = currentStartOffset + chunkText.length - overlapText.length;
    }

    // Add sentence to current chunk
    currentChunk.push(sentence);
    currentTokens += sentenceTokens;
  }

  // Add final chunk if it has content
  if (currentChunk.length > 0) {
    const chunkText = currentChunk.join('').trim();

    if (estimateTokens(chunkText) >= config.minChunkSize) {
      chunks.push({
        text: chunkText,
        startOffset: currentStartOffset,
        endOffset: currentStartOffset + chunkText.length,
      });
    }
  }

  // Edge case: if no chunks were created (very short document), create one chunk
  if (chunks.length === 0 && text.trim().length > 0) {
    chunks.push({
      text: text.trim(),
      startOffset: 0,
      endOffset: text.trim().length,
    });
  }

  return chunks;
};
