# RAG Implementation Plan

## Overview
Transform the current retrieval-only search endpoint into a full RAG (Retrieval-Augmented Generation) system that returns:
- LLM-generated answers
- Retrieved document chunks with metadata
- Agent workflow steps
- Token usage statistics
- Debug logs

**Strategy**: Add document chunking at upload time, use Cohere Chat API for answer generation, track agent workflow steps, and return comprehensive response metadata.

---

## Implementation Steps

### Step 1: Database Schema Changes

**Create new `document_chunks` table in Supabase:**

```sql
CREATE TABLE document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  text TEXT NOT NULL,
  embedding VECTOR(1024),
  start_offset INTEGER NOT NULL,
  end_offset INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(file_id, chunk_index)
);

CREATE INDEX idx_chunks_file_id ON document_chunks(file_id);
CREATE INDEX idx_chunks_embedding ON document_chunks
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
```

Execute this in Supabase SQL Editor.

---

### Step 2: Type Definitions

**Create `backend/types/rag.ts`** (new file):

```typescript
export interface DocumentChunk {
  id: string;
  file_id: string;
  chunk_index: number;
  text: string;
  embedding: number[];
  start_offset: number;
  end_offset: number;
}

export interface RetrievedChunk {
  doc_id: string;
  filename: string;
  chunk_id: string;
  text: string;
  similarity: number;
  start_offset: number;
  end_offset: number;
}

export interface AgentStep {
  type: 'thought' | 'action' | 'tool_result';
  text: string;
  tool?: string;
  tool_input?: string;
  tool_output?: string;
}

export interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens?: number;
}

export interface RAGResponse {
  query: string;
  final_answer: string;
  model: string;
  token_usage: TokenUsage;
  retrieved_chunks: RetrievedChunk[];
  final_prompt: string;
  agent_steps: AgentStep[];
  debug_logs?: string[];
}
```

**Update `frontend/types/api.ts`**:

Add optional `rag` field to `SearchResponse`:

```typescript
export interface SearchResponse {
  results: SearchResult[];
  message?: string;
  rag?: {
    query: string;
    final_answer: string;
    model: string;
    token_usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens?: number;
    };
    retrieved_chunks: Array<{
      doc_id: string;
      filename: string;
      chunk_id: string;
      text: string;
      similarity: number;
      start_offset: number;
      end_offset: number;
    }>;
    final_prompt: string;
    agent_steps: Array<{
      type: 'thought' | 'action' | 'tool_result';
      text: string;
      tool?: string;
      tool_input?: string;
      tool_output?: string;
    }>;
    debug_logs?: string[];
  };
}
```

---

### Step 3: Chunking Service

**Create `backend/services/chunkingService.ts`** (new file):

**Key functions:**
- `estimateTokens(text: string): number` - Simple heuristic: `chars / 4`
- `chunkDocument(text: string): Array<{text, startOffset, endOffset}>` - Split text into ~512-token chunks with 128-token overlap

**Chunking algorithm:**
1. Split text by sentences (regex: `/[.!?]+\s/`)
2. Group sentences into chunks of ~512 tokens
3. Add 25% overlap (128 tokens) between adjacent chunks
4. Track character offsets (start_offset, end_offset) for each chunk
5. Return array of chunk objects

---

### Step 4: Cohere Chat Service

**Create `backend/services/cohereService.ts`** (new file):

```typescript
import { CohereClient } from 'cohere-ai';

export interface CohereGenerateResponse {
  text: string;
  model: string;
  tokenUsage: {
    promptTokens: number;
    completionTokens: number;
  };
}

export const generateChatResponse = async (
  prompt: string,
  options: { temperature?: number; maxTokens?: number; model?: string } = {}
): Promise<CohereGenerateResponse> => {
  const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY!,
  });

  const response = await cohere.chat({
    message: prompt,
    model: options.model || 'command-r-plus-08-2024',
    temperature: options.temperature || 0.3,
    maxTokens: options.maxTokens || 2000,
  });

  return {
    text: response.text,
    model: response.model || options.model || 'command-r-plus-08-2024',
    tokenUsage: {
      promptTokens: response.meta?.tokens?.inputTokens || 0,
      completionTokens: response.meta?.tokens?.outputTokens || 0,
    },
  };
};
```

---

### Step 5: Implement Rate Limiting

**Create `backend/services/rateLimitService.ts`** (new file):

Implements a hybrid rate limiting approach:
1. Application-level limit: 10,000 RAG requests per month
2. Cohere billing limit: $10/month (set in dashboard as safety net)

**Database schema changes:**

Execute in Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS rate_limits (
  id TEXT PRIMARY KEY,
  request_count INTEGER DEFAULT 0,
  period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  period_end TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 month'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Single row for monthly RAG quota
INSERT INTO rate_limits (id, request_count)
VALUES ('rag_monthly', 0)
ON CONFLICT (id) DO NOTHING;

-- Atomic increment function
CREATE OR REPLACE FUNCTION increment_rag_count()
RETURNS void AS $$
BEGIN
  UPDATE rate_limits
  SET request_count = request_count + 1,
      updated_at = NOW()
  WHERE id = 'rag_monthly';
END;
$$ LANGUAGE plpgsql;
```

**Service implementation:**

```typescript
import { supabase } from '../supabase/supabaseClient.js';
import { logError } from '../utils/logger.js';

const MONTHLY_LIMIT = 10000;
const RATE_LIMIT_ID = 'rag_monthly';

export const trackRAGRequest = async (): Promise<void> => {
  const { error } = await supabase.rpc('increment_rag_count');

  if (error) {
    logError('Failed to track RAG request', error);
    // Don't throw - don't block user if rate limit tracking fails
  }
};

export const getRemainingRequests = async (): Promise<number> => {
  const { data, error } = await supabase
    .from('rate_limits')
    .select('request_count')
    .eq('id', RATE_LIMIT_ID)
    .single();

  if (error) {
    logError('Failed to get rate limit data', error);
    return MONTHLY_LIMIT; // Fail open
  }

  return Math.max(0, MONTHLY_LIMIT - (data?.request_count || 0));
};

export const hasReachedLimit = async (): Promise<boolean> => {
  const remaining = await getRemainingRequests();
  return remaining <= 0;
};

export const resetMonthlyCounter = async (): Promise<void> => {
  const { error } = await supabase
    .from('rate_limits')
    .update({
      request_count: 0,
      period_start: new Date().toISOString(),
      period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', RATE_LIMIT_ID);

  if (error) {
    logError('Failed to reset monthly counter', error);
  }
};
```

**Cohere Dashboard Setup:**

1. Go to https://dashboard.cohere.com/billing
2. Set monthly budget limit: **$10** (safety net for ~12,000 queries with command-r)
3. Enable email notifications at 80% and 100% of budget
4. This prevents unexpected overages if application-level limit fails

---

### Step 6: Agent Workflow Service

**Create `backend/services/agentService.ts`** (new file):

```typescript
import { AgentStep } from '../types/rag.js';

export class AgentWorkflow {
  private steps: AgentStep[] = [];
  private debugLogs: string[] = [];

  addThought(text: string): void {
    this.steps.push({ type: 'thought', text });
    this.log(`[THOUGHT] ${text}`);
  }

  addAction(tool: string, input: string): void {
    this.steps.push({
      type: 'action',
      text: `Using tool: ${tool}`,
      tool,
      tool_input: input,
    });
    this.log(`[ACTION] ${tool}: ${input}`);
  }

  addToolResult(tool: string, output: string): void {
    this.steps.push({
      type: 'tool_result',
      text: `Tool result from ${tool}`,
      tool,
      tool_output: output,
    });
    this.log(`[RESULT] ${tool} returned ${output.length} chars`);
  }

  private log(message: string): void {
    this.debugLogs.push(`[${new Date().toISOString()}] ${message}`);
  }

  getSteps(): AgentStep[] {
    return this.steps;
  }

  getDebugLogs(): string[] {
    return this.debugLogs;
  }
}
```

---

### Step 7: RAG Orchestration Service

**Create `backend/services/ragService.ts`** (new file):

**Main function: `performRAGSearch(query: string, topK: number = 5): Promise<RAGResponse>`**

**Workflow:**
1. Initialize `AgentWorkflow` instance
2. Add thought: "I need to search the knowledge base..."
3. Add action: "semantic_search"
4. Generate query embedding using `createEmbedding(query)`
5. Query `document_chunks` table with vector similarity search
6. Calculate cosine similarity for all chunks
7. Filter chunks with similarity >= 0.25
8. Sort by similarity descending
9. Take top K chunks (5-10)
10. Map to `RetrievedChunk[]` format
11. Add tool result: "Retrieved N chunks"
12. Add thought: "I will synthesize an answer..."
13. Build context from retrieved chunks
14. Construct final prompt:
    ```
    You are a helpful AI assistant that answers questions based on provided document context.

    Context from knowledge base:
    [Document 1: filename]
    chunk text...

    ---

    [Document 2: filename]
    chunk text...

    User Question: {query}

    Instructions:
    - Answer using ONLY information from the context above
    - If context doesn't contain relevant information, say so clearly
    - Cite specific documents when possible
    - Be concise but complete

    Answer:
    ```
15. Add action: "generate_answer"
16. Call `generateChatResponse(finalPrompt)`
17. Add tool result: "Answer generated"
18. Return complete `RAGResponse` object

---

### Step 8: Update Upload Controller

**Modify `backend/controllers/uploadController.ts`:**

**After line 59** (after text extraction), add chunking logic:

```typescript
// Line 60: const uploadedFile = await getUploadedFile(file, text);

// NEW: Chunk the document
const chunks = chunkDocument(text);

// NEW: Generate embeddings for each chunk
const chunksWithEmbeddings = await Promise.all(
  chunks.map(async (chunk, index) => ({
    text: chunk.text,
    start_offset: chunk.startOffset,
    end_offset: chunk.endOffset,
    embedding: await createEmbedding(chunk.text),
    chunk_index: index,
  }))
);

// Line 62-63: Save file (modify addFile to return ID)
const fileRecord = await addFile(uploadedFile, file.mimetype);

// NEW: Save chunks to database
await saveChunks(fileRecord.id, chunksWithEmbeddings);
```

**Add import:**
```typescript
import { chunkDocument } from '../services/chunkingService.js';
import { saveChunks } from './filesController.js';
```

---

### Step 9: Update Files Controller

**Modify `backend/controllers/filesController.ts`:**

**Change `addFile` return type** (line 14-17):

```typescript
export const addFile = async (
  file: UploadedFile,
  mimetype: string
): Promise<{ id: string }> => {  // Changed return type
  try {
    const { data, error } = await supabase
      .from('files')
      .insert({
        filename: file.filename,
        mimetype,
        content: file.text,
        embedding: file.embedding,
      })
      .select('id')  // NEW: Select ID
      .single();     // NEW: Get single record

    if (error) {
      logError('Failed to insert file into Supabase', error);
      throw error;
    }

    return data;  // NEW: Return the record with ID
  } catch (err) {
    logError('Error adding file to Supabase', err);
    throw err;
  }
};
```

**Add new function** (at end of file):

```typescript
export const saveChunks = async (
  fileId: string,
  chunks: Array<{
    text: string;
    embedding: number[];
    chunk_index: number;
    start_offset: number;
    end_offset: number;
  }>
): Promise<void> => {
  try {
    const records = chunks.map(chunk => ({
      file_id: fileId,
      chunk_index: chunk.chunk_index,
      text: chunk.text,
      embedding: chunk.embedding,
      start_offset: chunk.start_offset,
      end_offset: chunk.end_offset,
    }));

    const { error } = await supabase
      .from('document_chunks')
      .insert(records);

    if (error) {
      logError('Failed to insert chunks into Supabase', error);
      throw error;
    }
  } catch (err) {
    logError('Error saving chunks to Supabase', err);
    throw err;
  }
};
```

---

### Step 10: Update Search Controller

**Modify `backend/controllers/searchController.ts`:**

**Replace lines 117-249** (the `handleSearch` function):

```typescript
export const handleSearch = async (
  req: Request<...>,
  res: Response
): Promise<void> => {
  // Validate query (keep existing validation)
  if (!req.query.q || req.query.q.trim() === '') {
    res.status(400).json({ error: 'Missing or empty search query.' });
    return;
  }

  const query = req.query.q;
  const enableRAG = req.query.rag === 'true';  // NEW: Check for RAG mode

  try {
    if (enableRAG) {
      // NEW: Check rate limit before processing
      if (await hasReachedLimit()) {
        const remaining = await getRemainingRequests();
        res.status(429).json({
          error: 'Monthly RAG query limit reached',
          limit: 10000,
          remaining: 0,
          resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString()
        });
        return;
      }

      // Track this request
      await trackRAGRequest();

      // NEW: RAG Mode
      const ragResponse = await performRAGSearch(query, 5);
      const remaining = await getRemainingRequests();

      res.json({
        results: [],  // Empty for backward compatibility
        rag: {
          ...ragResponse,
          rateLimit: {
            limit: 10000,
            remaining,
            resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString()
          }
        }
      });
    } else {
      // EXISTING: Keep current implementation for legacy mode
      // (Lines 136-242 - no changes)
      // ... existing code ...
    }
  } catch (error) {
    logError('Search failed: Unexpected error', error);
    res
      .status(500)
      .json({ error: 'An unexpected error occurred during search.' });
  }
};
```

**Add imports:**
```typescript
import { performRAGSearch } from '../services/ragService.js';
import { hasReachedLimit, trackRAGRequest, getRemainingRequests } from '../services/rateLimitService.js';
```

**Update `SearchQuery` type in `backend/types/search.ts`:**
```typescript
export interface SearchQuery {
  q?: string;
  rag?: string;  // NEW: Optional RAG mode flag
}
```

---

### Step 11: Testing

**Manual testing steps:**

1. **Test database schema:**
   - Verify `document_chunks` table exists in Supabase
   - Check indexes are created

2. **Test file upload with chunking:**
   ```bash
   curl -X POST http://localhost:3001/api/upload \
     -F "file=@test.txt"
   ```
   - Verify chunks are saved to `document_chunks` table
   - Check embeddings are generated

3. **Test RAG search endpoint:**
   ```bash
   curl "http://localhost:3001/api/search?q=test%20query&rag=true"
   ```
   - Verify response includes `rag` object with all fields:
     - `final_answer`
     - `retrieved_chunks`
     - `final_prompt`
     - `agent_steps`
     - `token_usage`
     - `debug_logs`

4. **Test backward compatibility:**
   ```bash
   curl "http://localhost:3001/api/search?q=test%20query"
   ```
   - Verify response only includes `results` array (legacy format)
   - No `rag` field present

---

## Critical Files to Modify

### New Files (7):
1. `backend/types/rag.ts` - Type definitions for RAG response structure
2. `backend/services/chunkingService.ts` - Document chunking logic
3. `backend/services/cohereService.ts` - Cohere Chat API wrapper (uses command-r model)
4. `backend/services/rateLimitService.ts` - Rate limiting (10k requests/month)
5. `backend/services/agentService.ts` - Agent workflow tracking
6. `backend/services/ragService.ts` - RAG orchestration (main logic)
7. `backend/migrations/001_add_chunks_table.sql` - Database schema

### Modified Files (5):
1. `backend/controllers/searchController.ts:117-249` - Add RAG mode to search endpoint
2. `backend/controllers/uploadController.ts:60-63` - Add chunking to upload flow
3. `backend/controllers/filesController.ts:14-34` - Update `addFile` return type, add `saveChunks` function
4. `backend/types/search.ts:1-3` - Add `rag` param to `SearchQuery`
5. `frontend/types/api.ts:23-26` - Add optional `rag` field to `SearchResponse`

---

## Key Technical Decisions

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Chunk size** | 512 tokens (~2,000 chars) | Optimal for Cohere embeddings; balances context vs. granularity |
| **Chunk overlap** | 128 tokens (25%) | Industry standard; prevents context loss at boundaries |
| **Top-K chunks** | 5 (configurable to 10) | ~2,500 tokens of context; leaves room for prompt + response |
| **Cohere model** | `command-r-08-2024` | Cost-effective model ($0.15/1M input, $0.60/1M output); 94% cheaper than command-r-plus; 128k context |
| **Rate limiting** | 10,000 requests/month | Application-level cap + $10 Cohere billing limit as safety net |
| **Similarity threshold** | 0.25 | Same as existing search; filters low-relevance chunks |
| **RAG mode** | Opt-in (`?rag=true`) | Backward compatible; gradual rollout; zero frontend changes initially |

**Estimated cost per RAG query:** ~$0.0008 (less than 0.1 cents with command-r)

---

## Implementation Order

1. ✅ Database schema (Step 1) - COMPLETED
2. ✅ Type definitions (Step 2) - COMPLETED
3. ✅ Chunking service (Step 3) - COMPLETED
4. ✅ Cohere service (Step 4) - COMPLETED (using command-r model)
5. ⬜ Rate limiting service (Step 5) - 10k requests/month cap
6. ⬜ Agent workflow service (Step 6)
7. ⬜ RAG orchestration service (Step 7)
8. ⬜ Update upload controller (Step 8)
9. ⬜ Update files controller (Step 9)
10. ⬜ Update search controller with RAG + rate limiting (Step 10)
11. ⬜ Test end-to-end (Step 11)

**Total implementation time estimate:** 5-9 days

---

## Notes

- **Backward compatibility preserved:** Default search behavior unchanged; RAG mode requires `?rag=true` query param
- **No new npm packages needed:** `cohere-ai` already installed
- **Environment variables:** Uses existing `COHERE_API_KEY`
- **Migration path:** New uploads automatically chunked; old documents can be backfilled later with a script
- **Frontend changes:** Optional `rag` field added to response type; no UI changes required initially
