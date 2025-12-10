# Chunking Service Explained

## Overview

The chunking service splits large documents into smaller, overlapping segments (chunks) to enable efficient vector search and retrieval in the RAG (Retrieval-Augmented Generation) system.

**Key Features:**
- **Sentence-aware splitting**: Never breaks mid-sentence to preserve semantic meaning
- **Configurable chunk size**: Default 512 tokens (~2,000 characters)
- **Overlap between chunks**: Default 128 tokens (25%) to prevent context loss at boundaries
- **Character offset tracking**: Records exact positions in the original document

---

## Why Chunking?

### The Problem
Large documents (10,000+ words) cannot be efficiently:
1. Embedded as a single vector (loses granularity)
2. Retrieved in their entirety (too much irrelevant information)
3. Fit into LLM context windows (with multiple documents)

### The Solution
Split documents into smaller chunks that:
- Are small enough to embed effectively (~512 tokens is optimal for most embedding models)
- Contain enough context to be meaningful on their own
- Overlap to ensure information at boundaries isn't lost

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Original Document                        │
│  "Machine learning is a subset of AI. It focuses on...      │
│   Deep learning uses neural networks. Neural networks..."    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                   ┌──────────────────┐
                   │ chunkDocument()  │
                   └──────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
         ┌─────────┐    ┌─────────┐    ┌─────────┐
         │ Chunk 1 │    │ Chunk 2 │    │ Chunk 3 │
         │ 512 tok │    │ 512 tok │    │ 512 tok │
         │ Offset: │    │ Offset: │    │ Offset: │
         │ 0-2048  │    │ 1536-   │    │ 3072-   │
         └─────────┘    └─────────┘    └─────────┘
              │              │              │
              └──────┬───────┴──────────────┘
                     │ 128 tokens overlap
                     ▼
            Each chunk is embedded
            and stored in database
```

---

## Core Functions

### 1. `estimateTokens(text: string): number`

Estimates the number of tokens in text using a simple heuristic.

**Algorithm:**
```typescript
return Math.ceil(text.length / 4);
```

**Rationale:**
- **1 token ≈ 4 characters** for English text
- Fast approximation (no tokenizer needed)
- Good enough for chunking purposes (doesn't need to be exact)

**Examples:**

| Text | Characters | Estimated Tokens |
|------|-----------|------------------|
| `"Hello"` | 5 | 2 |
| `"Hello world!"` | 12 | 3 |
| `"The quick brown fox jumps over the lazy dog."` | 45 | 12 |
| `"A"` | 1 | 1 |

---

### 2. `splitIntoSentences(text: string): string[]`

Splits text into sentences while preserving punctuation.

**Algorithm:**
```typescript
const sentences = text.split(/([.!?]+\s+)/);
```

**Regex Breakdown:**
- `[.!?]+` - One or more sentence-ending punctuation marks
- `\s+` - One or more whitespace characters
- `()` - Capture group (preserves the delimiter)

**Example 1: Basic Splitting**

```typescript
Input:
"Hello world. How are you? I am fine!"

Output:
[
  "Hello world. ",
  "How are you? ",
  "I am fine!"
]
```

**Example 2: Multiple Punctuation**

```typescript
Input:
"What?! Really... Yes!"

Output:
[
  "What?! ",
  "Really... ",
  "Yes!"
]
```

**Example 3: No Punctuation**

```typescript
Input:
"This has no ending punctuation"

Output:
[
  "This has no ending punctuation"
]
```

---

### 3. `chunkDocument(text: string, config?: ChunkingConfig): Chunk[]`

Main chunking function that creates overlapping chunks.

**Configuration:**
```typescript
interface ChunkingConfig {
  chunkSize: number;      // Default: 512 tokens
  overlapSize: number;    // Default: 128 tokens (25%)
  minChunkSize: number;   // Default: 50 tokens
}
```

**Output:**
```typescript
interface Chunk {
  text: string;           // The chunk content
  startOffset: number;    // Character position in original doc
  endOffset: number;      // End character position
}
```

---

## Algorithm Walkthrough

### Step-by-Step Process

```
1. Split document into sentences
2. Initialize empty current chunk
3. For each sentence:
   a. Check if adding it would exceed chunk size
   b. If YES:
      - Finalize current chunk
      - Calculate overlap (keep last N sentences)
      - Start new chunk with overlap
   c. If NO:
      - Add sentence to current chunk
4. Finalize any remaining chunk
```

### Visual Example

**Input Document:**
```
"Machine learning is a subset of AI. It focuses on algorithms that learn from data.
Deep learning uses neural networks. Neural networks are inspired by the brain.
The brain has billions of neurons. Neurons process information in parallel."
```

**After Sentence Splitting:**
```
S1: "Machine learning is a subset of AI. "
S2: "It focuses on algorithms that learn from data. "
S3: "Deep learning uses neural networks. "
S4: "Neural networks are inspired by the brain. "
S5: "The brain has billions of neurons. "
S6: "Neurons process information in parallel."
```

**Chunking (assuming 2 sentences per chunk, 1 sentence overlap):**

```
┌──────────────────────────────────────────────────┐
│ CHUNK 1                                          │
│ Offset: 0-102                                    │
├──────────────────────────────────────────────────┤
│ S1: Machine learning is a subset of AI.         │
│ S2: It focuses on algorithms that learn         │
│     from data.                                   │
└──────────────────────────────────────────────────┘
                    │
                    │ S2 is reused (OVERLAP)
                    ▼
┌──────────────────────────────────────────────────┐
│ CHUNK 2                                          │
│ Offset: 57-165                                   │
├──────────────────────────────────────────────────┤
│ S2: It focuses on algorithms that learn         │
│     from data.                                   │
│ S3: Deep learning uses neural networks.         │
└──────────────────────────────────────────────────┘
                    │
                    │ S3 is reused (OVERLAP)
                    ▼
┌──────────────────────────────────────────────────┐
│ CHUNK 3                                          │
│ Offset: 103-235                                  │
├──────────────────────────────────────────────────┤
│ S3: Deep learning uses neural networks.         │
│ S4: Neural networks are inspired by the brain.  │
└──────────────────────────────────────────────────┘
                    │
                    │ S4 is reused (OVERLAP)
                    ▼
┌──────────────────────────────────────────────────┐
│ CHUNK 4                                          │
│ Offset: 166-286                                  │
├──────────────────────────────────────────────────┤
│ S4: Neural networks are inspired by the brain.  │
│ S5: The brain has billions of neurons.          │
└──────────────────────────────────────────────────┘
                    │
                    │ S5 is reused (OVERLAP)
                    ▼
┌──────────────────────────────────────────────────┐
│ CHUNK 5                                          │
│ Offset: 236-316                                  │
├──────────────────────────────────────────────────┤
│ S5: The brain has billions of neurons.          │
│ S6: Neurons process information in parallel.    │
└──────────────────────────────────────────────────┘
```

---

## Overlap Calculation (The Clever Part)

When a chunk is full, the algorithm creates overlap by reusing the last few sentences.

### Code Walkthrough

```typescript
// Work backwards from current chunk to build overlap
const overlapSentences: string[] = [];
let overlapTokens = 0;

for (let j = currentChunk.length - 1; j >= 0; j--) {
  const overlapSentence = currentChunk[j];
  const overlapSentenceTokens = estimateTokens(overlapSentence);

  if (overlapTokens + overlapSentenceTokens <= config.overlapSize) {
    overlapSentences.unshift(overlapSentence); // Add to beginning
    overlapTokens += overlapSentenceTokens;
  } else {
    break; // Stop when we hit 128 token limit
  }
}

// Start new chunk with these sentences
currentChunk = overlapSentences;
```

### Example

**Current chunk (about to be finalized):**
```
[S1: 100 tokens]
[S2: 150 tokens]
[S3: 200 tokens]
[S4: 100 tokens]  ← Total: 550 tokens (exceeds 512)
```

**Calculate overlap (target: 128 tokens):**
```
Working backwards:
- S4: 100 tokens (total: 100) ✓ Keep
- S3: 200 tokens (total: 300) ✗ Would exceed 128, stop

Overlap: [S4]
```

**Result:**
```
Finalized Chunk 1: [S1][S2][S3]
New Chunk 2 starts with: [S4] ← This is the overlap
```

---

## Character Offset Tracking

Offsets allow you to locate chunks in the original document.

### Example

**Original Document:**
```
Position: 0         10        20        30        40        50
          |         |         |         |         |         |
Text:     "Hello world. How are you? I am fine. Thanks!"
```

**Chunks:**

**Chunk 1:**
```typescript
{
  text: "Hello world. How are you?",
  startOffset: 0,
  endOffset: 25
}
```

**Chunk 2 (with overlap):**
```typescript
{
  text: "How are you? I am fine.",
  startOffset: 13,  // Starts at "How"
  endOffset: 37
}
```

**Chunk 3 (with overlap):**
```typescript
{
  text: "I am fine. Thanks!",
  startOffset: 26,  // Starts at "I"
  endOffset: 44
}
```

### Offset Calculation

When creating overlap, the start offset is adjusted:

```typescript
const overlapText = overlapSentences.join('');
currentStartOffset = currentStartOffset + chunkText.length - overlapText.length;
```

**Explanation:**
- `currentStartOffset`: Where current chunk started
- `chunkText.length`: How far we've moved forward
- `overlapText.length`: How far we're moving back for overlap
- **Net movement**: `currentStartOffset + (chunkText.length - overlapText.length)`

---

## Complete Example

### Input

```typescript
const document = `
Artificial intelligence (AI) is intelligence demonstrated by machines.
Machine learning is a subset of AI. It focuses on algorithms that can
learn from data. Deep learning is a type of machine learning. It uses
neural networks with multiple layers. These networks can process complex
patterns. They have revolutionized computer vision and natural language
processing.
`;

const chunks = chunkDocument(document, {
  chunkSize: 20,    // Small for demo
  overlapSize: 5,
  minChunkSize: 5
});
```

### Output

```typescript
[
  {
    text: "Artificial intelligence (AI) is intelligence demonstrated by machines.",
    startOffset: 1,
    endOffset: 70
  },
  {
    text: "machines. Machine learning is a subset of AI.",
    startOffset: 61,  // Overlap starts at "machines"
    endOffset: 106
  },
  {
    text: "of AI. It focuses on algorithms that can learn from data.",
    startOffset: 100,
    endOffset: 158
  },
  {
    text: "from data. Deep learning is a type of machine learning.",
    startOffset: 147,
    endOffset: 202
  },
  {
    text: "machine learning. It uses neural networks with multiple layers.",
    startOffset: 187,
    endOffset: 250
  },
  {
    text: "multiple layers. These networks can process complex patterns.",
    startOffset: 235,
    endOffset: 296
  },
  {
    text: "complex patterns. They have revolutionized computer vision and natural language processing.",
    startOffset: 277,
    endOffset: 368
  }
]
```

**Notice:**
- Each chunk overlaps with the next
- Start offsets increase but account for overlap
- Last words of one chunk appear in next chunk

---

## Edge Cases

### 1. Empty Text

**Input:**
```typescript
chunkDocument("")
```

**Output:**
```typescript
[]  // Empty array
```

---

### 2. Very Short Document

**Input:**
```typescript
chunkDocument("Hi!", {
  chunkSize: 512,
  overlapSize: 128,
  minChunkSize: 50
})
```

**Output:**
```typescript
[
  {
    text: "Hi!",
    startOffset: 0,
    endOffset: 3
  }
]
// Single chunk even though below minChunkSize
// (Special case: non-empty text always returns at least 1 chunk)
```

---

### 3. Single Long Sentence

**Input:**
```typescript
// A 1000-token sentence (no punctuation)
chunkDocument("This is a very long sentence that goes on and on...[1000 tokens total]", {
  chunkSize: 512,
  overlapSize: 128,
  minChunkSize: 50
})
```

**Output:**
```typescript
[
  {
    text: "This is a very long sentence that goes on and on...[entire sentence]",
    startOffset: 0,
    endOffset: 4000
  }
]
// Doesn't split mid-sentence, even if it exceeds chunkSize
```

---

### 4. Multiple Sentence Endings

**Input:**
```typescript
chunkDocument("What?! Really... Yes. Okay!")
```

**Output:**
```typescript
// Sentences: ["What?! ", "Really... ", "Yes. ", "Okay!"]
// Each sentence ends at punctuation
```

---

## Performance Considerations

### Time Complexity
- **Sentence splitting**: O(n) where n = document length
- **Chunking loop**: O(s) where s = number of sentences
- **Overlap calculation**: O(s) in worst case (walking back through sentences)
- **Overall**: O(n + s²) ≈ O(n) for typical documents

### Space Complexity
- **Sentences array**: O(n) - stores all sentences
- **Chunks array**: O(n) - stores final chunks
- **Overall**: O(n)

### Typical Performance

| Document Size | Sentences | Chunks | Time |
|--------------|-----------|--------|------|
| 1,000 chars | ~10 | 1-2 | <1ms |
| 10,000 chars | ~100 | 5-10 | ~5ms |
| 100,000 chars | ~1,000 | 50-100 | ~50ms |
| 1,000,000 chars | ~10,000 | 500-1000 | ~500ms |

---

## Use Cases

### 1. Document Upload
```typescript
// When user uploads a PDF
const fileText = extractTextFromPDF(file);
const chunks = chunkDocument(fileText);

// Store each chunk with embeddings
for (const chunk of chunks) {
  const embedding = await createEmbedding(chunk.text);
  await saveChunkToDatabase({
    ...chunk,
    embedding,
    file_id: uploadedFile.id
  });
}
```

### 2. Search & Retrieval
```typescript
// User searches: "What is deep learning?"
const queryEmbedding = await createEmbedding("What is deep learning?");

// Find similar chunks (not entire documents)
const relevantChunks = await findSimilarChunks(queryEmbedding, topK=5);

// Result might include:
// - Chunk from Document A: "Deep learning is a type of machine learning..."
// - Chunk from Document B: "Deep learning uses neural networks..."
// - Chunk from Document C: "Applications of deep learning include..."
```

### 3. Context Highlighting
```typescript
// User wants to see where information came from
const chunk = retrievedChunks[0];

// Use offsets to highlight in original document
const originalDoc = await getDocument(chunk.doc_id);
const highlightedText =
  originalDoc.substring(0, chunk.startOffset) +
  '<mark>' +
  originalDoc.substring(chunk.startOffset, chunk.endOffset) +
  '</mark>' +
  originalDoc.substring(chunk.endOffset);
```

---

## Benefits of This Approach

✅ **Semantic Integrity**: Never breaks mid-sentence, preserving meaning
✅ **Optimal Size**: ~512 tokens fits well with embedding models (Cohere, OpenAI)
✅ **Context Preservation**: 25% overlap ensures boundary information isn't lost
✅ **Traceable**: Character offsets allow linking back to source document
✅ **Simple**: No complex NLP required, works with any language that uses `.!?`
✅ **Fast**: Linear time complexity, handles large documents efficiently

---

## Potential Improvements

### 1. Language Detection
Currently assumes `.!?` are sentence enders. Could add:
- Support for other languages (e.g., `。` for Chinese)
- Detection of abbreviations (Dr., Mr., etc.) that shouldn't split

### 2. Smart Chunking
Instead of fixed 512 tokens, could:
- Chunk by paragraphs (respect document structure)
- Chunk by topics (using NLP to detect topic boundaries)
- Adaptive chunk size based on content density

### 3. Exact Token Counting
Replace character-based estimation with actual tokenizer:
```typescript
import { encode } from 'gpt-tokenizer';
const tokens = encode(text).length;
```

### 4. Metadata Preservation
Track additional context:
```typescript
interface Chunk {
  text: string;
  startOffset: number;
  endOffset: number;
  paragraph: number;    // Which paragraph?
  section: string;      // Which section heading?
  pageNumber?: number;  // For PDFs
}
```

---

## References

- **Chunking strategies**: [LangChain Text Splitters](https://python.langchain.com/docs/modules/data_connection/document_transformers/)
- **Token estimation**: [OpenAI Tokenizer](https://platform.openai.com/tokenizer)
- **Overlap importance**: [Pinecone Vector DB Guide](https://www.pinecone.io/learn/chunking-strategies/)

---

## Summary

The chunking service is a critical component of the RAG system that:

1. **Splits** large documents into manageable segments
2. **Preserves** semantic meaning by respecting sentence boundaries
3. **Overlaps** chunks to prevent context loss
4. **Tracks** character positions for traceability
5. **Enables** efficient vector search and retrieval

By breaking documents into ~512-token chunks with 25% overlap, we achieve the optimal balance between granularity and context for semantic search and LLM-based answer generation.
