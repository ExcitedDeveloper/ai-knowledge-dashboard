# Cohere Service Architecture Explained

## Overview

The Cohere Service provides a clean abstraction layer over Cohere's Chat API, enabling the application to generate LLM-powered responses for the RAG (Retrieval-Augmented Generation) system.

**Key Responsibilities:**
- Interface with Cohere's Chat API
- Track token usage for cost monitoring
- Handle errors gracefully
- Provide sensible defaults for RAG use cases
- Abstract API complexity from the rest of the application

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Application Layer                           │
│  (ragService.ts, searchController.ts, etc.)                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ generateChatResponse(prompt, options?)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    cohereService.ts                             │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  generateChatResponse()                                   │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ 1. Initialize CohereClient                          │ │ │
│  │  │ 2. Build request with defaults                      │ │ │
│  │  │ 3. Call cohere.chat()                               │ │ │
│  │  │ 4. Extract response + token usage                   │ │ │
│  │  │ 5. Return structured response                       │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  Configuration:                                           │ │
│  │  • DEFAULT_MODEL = 'command-r-08-2024'                   │ │
│  │  • Default temperature = 0.3                             │ │
│  │  • Default maxTokens = 2000                              │ │
│  └───────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP POST (JSON)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Cohere API                                 │
│  https://api.cohere.ai/v1/chat                                 │
│                                                                 │
│  Request:                                                       │
│  {                                                              │
│    "message": "Your prompt here...",                           │
│    "model": "command-r-08-2024",                               │
│    "temperature": 0.3,                                         │
│    "max_tokens": 2000                                          │
│  }                                                              │
│                                                                 │
│  Response:                                                      │
│  {                                                              │
│    "text": "Generated answer...",                              │
│    "model": "command-r-08-2024",                               │
│    "meta": {                                                   │
│      "tokens": {                                               │
│        "input_tokens": 1234,                                   │
│        "output_tokens": 567                                    │
│      }                                                          │
│    }                                                            │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Type Definitions

The service defines clear TypeScript interfaces for type safety and developer experience.

#### `CohereGenerateOptions`
Configuration options for generating responses.

```typescript
export interface CohereGenerateOptions {
  temperature?: number;    // Randomness (0-1): lower = focused, higher = creative
  maxTokens?: number;      // Maximum response length
  model?: string;          // Cohere model to use
}
```

**Field Details:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `temperature` | number | 0.3 | Controls randomness. 0 = deterministic, 1 = very creative |
| `maxTokens` | number | 2000 | Maximum tokens in response (not including prompt) |
| `model` | string | `command-r-08-2024` | Which Cohere model to use |

#### `CohereGenerateResponse`
Structured response from the service.

```typescript
export interface CohereGenerateResponse {
  text: string;           // The generated answer
  model: string;          // Model that generated the response
  tokenUsage: {
    promptTokens: number;       // Tokens in the input prompt
    completionTokens: number;   // Tokens in the generated response
  };
}
```

**Example Response:**
```typescript
{
  text: "Machine learning is a subset of artificial intelligence...",
  model: "command-r-08-2024",
  tokenUsage: {
    promptTokens: 3542,
    completionTokens: 487
  }
}
```

---

### 2. Model Configuration

```typescript
const DEFAULT_MODEL = 'command-r-08-2024';
```

**Why command-r?**

| Aspect | command-r | command-r-plus | Comparison |
|--------|-----------|----------------|------------|
| **Input cost** | $0.15 / 1M tokens | $2.50 / 1M tokens | **94% cheaper** |
| **Output cost** | $0.60 / 1M tokens | $10.00 / 1M tokens | **94% cheaper** |
| **Context window** | 128k tokens | 128k tokens | Same |
| **Quality** | Very good | Excellent | Slight difference |
| **Best for** | RAG, Q&A, summarization | Complex reasoning, coding | - |
| **Cost per RAG query** | ~$0.0008 | ~$0.014 | **17x cheaper** |

**When to use command-r-plus:**
- Complex multi-step reasoning
- Advanced code generation
- Tasks requiring maximum accuracy
- When cost is less important than quality

**When to use command-r (default):**
- Document Q&A (RAG) ✅ Our use case
- Summarization
- Simple chat interactions
- When cost efficiency matters

---

### 3. Main Function: `generateChatResponse()`

The core function that communicates with Cohere's API.

```typescript
export const generateChatResponse = async (
  prompt: string,
  options: CohereGenerateOptions = {}
): Promise<CohereGenerateResponse> => {
  try {
    // 1. Initialize Cohere client
    const cohere = new CohereClient({
      token: process.env.COHERE_API_KEY!,
    });

    // 2. Call Chat API with merged options
    const response = await cohere.chat({
      message: prompt,
      model: options.model || DEFAULT_MODEL,
      temperature: options.temperature || 0.3,
      maxTokens: options.maxTokens || 2000,
    });

    // 3. Extract and return structured response
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
```

---

## Step-by-Step Workflow

### Request Flow

```
User Query
    ↓
┌───────────────────────────────────────────┐
│ 1. Application calls generateChatResponse │
│    with prompt and options                │
└───────────────┬───────────────────────────┘
                ↓
┌───────────────────────────────────────────┐
│ 2. Service initializes CohereClient       │
│    using COHERE_API_KEY from .env         │
└───────────────┬───────────────────────────┘
                ↓
┌───────────────────────────────────────────┐
│ 3. Merge user options with defaults:      │
│    • model: options.model || 'command-r'  │
│    • temperature: options.temp || 0.3     │
│    • maxTokens: options.max || 2000       │
└───────────────┬───────────────────────────┘
                ↓
┌───────────────────────────────────────────┐
│ 4. Send HTTP POST to Cohere API:          │
│    POST https://api.cohere.ai/v1/chat     │
│    {                                      │
│      "message": "Your prompt...",         │
│      "model": "command-r-08-2024",        │
│      "temperature": 0.3,                  │
│      "max_tokens": 2000                   │
│    }                                      │
└───────────────┬───────────────────────────┘
                ↓
┌───────────────────────────────────────────┐
│ 5. Cohere processes request:              │
│    • Tokenizes prompt                     │
│    • Runs inference through model         │
│    • Generates response                   │
│    • Counts tokens used                   │
└───────────────┬───────────────────────────┘
                ↓
┌───────────────────────────────────────────┐
│ 6. Service receives response:             │
│    {                                      │
│      "text": "Generated answer...",       │
│      "model": "command-r-08-2024",        │
│      "meta": {                            │
│        "tokens": {                        │
│          "input_tokens": 1234,            │
│          "output_tokens": 567             │
│        }                                  │
│      }                                    │
│    }                                      │
└───────────────┬───────────────────────────┘
                ↓
┌───────────────────────────────────────────┐
│ 7. Service extracts data and returns:     │
│    {                                      │
│      text: "Generated answer...",         │
│      model: "command-r-08-2024",          │
│      tokenUsage: {                        │
│        promptTokens: 1234,                │
│        completionTokens: 567              │
│      }                                    │
│    }                                      │
└───────────────┬───────────────────────────┘
                ↓
Application receives structured response
```

---

## Usage Examples

### Example 1: Basic Usage (Default Settings)

```typescript
import { generateChatResponse } from './services/cohereService.js';

const prompt = "What is machine learning?";

const response = await generateChatResponse(prompt);

console.log(response.text);
// "Machine learning is a subset of artificial intelligence..."

console.log(response.tokenUsage);
// { promptTokens: 12, completionTokens: 156 }

console.log(response.model);
// "command-r-08-2024"
```

**What happens:**
- Uses default model: `command-r-08-2024`
- Uses default temperature: `0.3` (focused, consistent responses)
- Uses default maxTokens: `2000` (allows detailed answers)

---

### Example 2: Custom Temperature (More Creative)

```typescript
const prompt = "Write a creative story about AI.";

const response = await generateChatResponse(prompt, {
  temperature: 0.8  // Higher = more creative/random
});

console.log(response.text);
// Very creative, varied story about AI...
```

**Temperature Comparison:**

| Temperature | Behavior | Use Case |
|-------------|----------|----------|
| 0.0 - 0.3 | Deterministic, focused | RAG Q&A, factual responses |
| 0.4 - 0.6 | Balanced | General chat, explanations |
| 0.7 - 1.0 | Creative, random | Storytelling, brainstorming |

---

### Example 3: Shorter Response (Limit Tokens)

```typescript
const prompt = "Explain quantum computing in simple terms.";

const response = await generateChatResponse(prompt, {
  maxTokens: 100  // Keep answer concise
});

console.log(response.text);
// Brief, ~100 token explanation
```

**Cost Impact:**
- Input: 12 tokens × $0.15/1M = $0.0000018
- Output: 100 tokens × $0.60/1M = $0.00006
- **Total: $0.0000618** (vs $0.0008 with 2000 max tokens)

---

### Example 4: RAG Use Case (Actual Usage in System)

```typescript
// From ragService.ts
const context = retrievedChunks
  .map((chunk, i) => `[Document ${i + 1}: ${chunk.filename}]\n${chunk.text}`)
  .join('\n\n---\n\n');

const finalPrompt = `You are a helpful AI assistant that answers questions based on provided document context.

Context from knowledge base:
${context}

User Question: ${query}

Instructions:
- Answer using ONLY information from the context above
- If context doesn't contain relevant information, say so clearly
- Cite specific documents when possible (e.g., "According to Document 2...")
- Be concise but complete

Answer:`;

const llmResponse = await generateChatResponse(finalPrompt, {
  temperature: 0.3,  // Focused, factual
  maxTokens: 2000    // Allow detailed answers
});

console.log(llmResponse.text);
// "According to Document 2, machine learning is..."

console.log(llmResponse.tokenUsage);
// { promptTokens: 3542, completionTokens: 487 }

// Calculate cost
const cost =
  (llmResponse.tokenUsage.promptTokens / 1_000_000) * 0.15 +
  (llmResponse.tokenUsage.completionTokens / 1_000_000) * 0.60;

console.log(`Query cost: $${cost.toFixed(6)}`);
// "Query cost: $0.000823"
```

---

### Example 5: Using Different Model

```typescript
const prompt = "Solve this complex reasoning problem...";

const response = await generateChatResponse(prompt, {
  model: 'command-r-plus-08-2024',  // Upgrade to better model
  temperature: 0.2,
  maxTokens: 3000
});

// Uses more powerful (and expensive) model
// Cost: ~17x more than command-r
```

---

## Error Handling

### Error Flow

```typescript
try {
  const response = await generateChatResponse(prompt);
  console.log(response.text);
} catch (error) {
  // Error is logged by cohereService, then re-thrown
  console.error('Chat generation failed:', error.message);

  // Handle different error types
  if (error.status === 429) {
    console.log('Rate limit exceeded');
  } else if (error.status === 401) {
    console.log('Invalid API key');
  } else if (error.status === 400) {
    console.log('Invalid request (check prompt/options)');
  }
}
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| **401 Unauthorized** | Invalid/missing `COHERE_API_KEY` | Check `.env` file, verify key is correct |
| **429 Too Many Requests** | Rate limit exceeded | Wait and retry, check Cohere dashboard limits |
| **400 Bad Request** | Invalid parameters | Check prompt isn't empty, maxTokens <= model limit |
| **500 Server Error** | Cohere API issues | Retry with exponential backoff |
| **Network timeout** | Slow connection | Increase timeout, check internet connection |

### Error Logging

The service uses the application's logging utility:

```typescript
catch (err) {
  logError('Failed to generate chat response with Cohere', err);
  throw err;
}
```

**What gets logged:**
- Error timestamp
- Error message and stack trace
- Request context (if available)
- Stored in application logs for debugging

**Philosophy: "Fail Fast"**
- Log the error locally for debugging
- Re-throw immediately to let caller handle
- Don't hide errors or return null/empty responses
- Caller decides how to handle (retry, fallback, etc.)

---

## Token Tracking & Cost Calculation

### Understanding Tokens

**What is a token?**
- A piece of text (word, subword, or character)
- English: ~1 token = 4 characters
- Examples:
  - `"Hello"` = 1 token
  - `"Hello world!"` = 3 tokens
  - `"Machine learning"` = 2 tokens

### Token Usage Tracking

Every response includes exact token counts:

```typescript
const response = await generateChatResponse(prompt);

console.log(response.tokenUsage);
// {
//   promptTokens: 3542,    // What you sent
//   completionTokens: 487  // What Cohere generated
// }
```

### Cost Calculation

**command-r pricing:**
- Input: $0.15 per 1 million tokens
- Output: $0.60 per 1 million tokens

**Formula:**
```typescript
const inputCost = (promptTokens / 1_000_000) * 0.15;
const outputCost = (completionTokens / 1_000_000) * 0.60;
const totalCost = inputCost + outputCost;
```

**Example:**
```typescript
// RAG query with 3,500 input tokens, 500 output tokens
const inputCost = (3500 / 1_000_000) * 0.15;   // $0.000525
const outputCost = (500 / 1_000_000) * 0.60;   // $0.0003
const totalCost = inputCost + outputCost;      // $0.000825

console.log(`Cost: $${totalCost.toFixed(6)}`);
// "Cost: $0.000825"
```

### Monthly Cost Projections

| Queries/Month | Avg Tokens (in/out) | Cost per Query | Total Cost |
|---------------|---------------------|----------------|------------|
| 100 | 3500/500 | $0.000825 | **$0.08** |
| 1,000 | 3500/500 | $0.000825 | **$0.83** |
| 10,000 | 3500/500 | $0.000825 | **$8.25** |
| 50,000 | 3500/500 | $0.000825 | **$41.25** |
| 100,000 | 3500/500 | $0.000825 | **$82.50** |

**With 10,000 request/month rate limit:** Maximum cost = ~$8.25/month

---

## Integration Points

### Where the Service is Used

```
cohereService.ts
      ↑
      │ import { generateChatResponse }
      │
┌─────┴──────────────────────────────────┐
│                                        │
│  ragService.ts                         │
│  • Generates final answers             │
│  • Passes RAG prompt with context      │
│                                        │
└────────────────┬───────────────────────┘
                 ↑
                 │ import { performRAGSearch }
                 │
┌────────────────┴───────────────────────┐
│                                        │
│  searchController.ts                   │
│  • Handles /api/search?rag=true        │
│  • Checks rate limits                  │
│  • Calls RAG pipeline                  │
│                                        │
└────────────────┬───────────────────────┘
                 ↑
                 │ HTTP GET request
                 │
┌────────────────┴───────────────────────┐
│                                        │
│  Frontend (User)                       │
│  • Sends search query                  │
│  • Displays generated answer           │
│                                        │
└────────────────────────────────────────┘
```

### Data Flow Example

**User Query: "What is machine learning?"**

1. **Frontend → Backend**
   ```
   GET /api/search?q=What+is+machine+learning&rag=true
   ```

2. **searchController.ts**
   ```typescript
   const query = "What is machine learning?";
   const ragResponse = await performRAGSearch(query, 5);
   ```

3. **ragService.ts**
   ```typescript
   // Retrieve relevant chunks
   const chunks = await retrieveChunks(query);

   // Build prompt with context
   const prompt = buildRAGPrompt(chunks, query);

   // Generate answer
   const llmResponse = await generateChatResponse(prompt);
   ```

4. **cohereService.ts**
   ```typescript
   // Send to Cohere API
   const response = await cohere.chat({
     message: prompt,
     model: 'command-r-08-2024',
     temperature: 0.3,
     maxTokens: 2000
   });

   return {
     text: response.text,
     model: response.model,
     tokenUsage: { ... }
   };
   ```

5. **Backend → Frontend**
   ```json
   {
     "rag": {
       "query": "What is machine learning?",
       "final_answer": "Machine learning is...",
       "model": "command-r-08-2024",
       "token_usage": {
         "prompt_tokens": 3542,
         "completion_tokens": 487
       },
       "retrieved_chunks": [...],
       ...
     }
   }
   ```

---

## Environment Configuration

### Required Environment Variable

```bash
# .env file
COHERE_API_KEY=your_cohere_api_key_here
```

### Getting an API Key

1. Go to https://dashboard.cohere.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create new API key
5. Copy to `.env` file

### Key Security

**✅ DO:**
- Store in `.env` file (gitignored)
- Use environment variables in production
- Rotate keys periodically
- Set up billing alerts

**❌ DON'T:**
- Hardcode in source code
- Commit to version control
- Share in public repositories
- Use in client-side code

---

## Performance Considerations

### Latency

**Typical response times:**

| Request Type | Tokens | Latency |
|-------------|--------|---------|
| Short answer | 500-1000 | 1-2 seconds |
| Medium answer | 1000-2000 | 2-4 seconds |
| Long answer | 2000-4000 | 4-8 seconds |

**Factors affecting latency:**
- Prompt length (more tokens = slower)
- Response length (maxTokens setting)
- Cohere API load
- Network conditions

### Optimization Tips

**1. Use appropriate maxTokens:**
```typescript
// Don't use 2000 if you only need 200
await generateChatResponse(prompt, {
  maxTokens: 200  // 10x faster for short answers
});
```

**2. Cache common queries:**
```typescript
// Cache layer (pseudo-code)
const cached = await cache.get(promptHash);
if (cached) return cached;

const response = await generateChatResponse(prompt);
await cache.set(promptHash, response, TTL);
```

**3. Use streaming (future enhancement):**
```typescript
// Not yet implemented, but Cohere supports it
const stream = await cohere.chatStream({
  message: prompt,
  ...
});

for await (const chunk of stream) {
  console.log(chunk.text); // Display incrementally
}
```

---

## Testing

### Unit Test Example

```typescript
import { generateChatResponse } from './cohereService';

describe('cohereService', () => {
  it('should generate response with default settings', async () => {
    const response = await generateChatResponse('What is AI?');

    expect(response.text).toBeDefined();
    expect(response.text.length).toBeGreaterThan(0);
    expect(response.model).toBe('command-r-08-2024');
    expect(response.tokenUsage.promptTokens).toBeGreaterThan(0);
    expect(response.tokenUsage.completionTokens).toBeGreaterThan(0);
  });

  it('should respect custom options', async () => {
    const response = await generateChatResponse('Hello', {
      temperature: 0.8,
      maxTokens: 50,
      model: 'command-r-plus-08-2024'
    });

    expect(response.model).toBe('command-r-plus-08-2024');
    expect(response.tokenUsage.completionTokens).toBeLessThanOrEqual(50);
  });

  it('should handle errors gracefully', async () => {
    // Mock invalid API key
    process.env.COHERE_API_KEY = 'invalid';

    await expect(
      generateChatResponse('Test')
    ).rejects.toThrow();
  });
});
```

### Manual Testing

```bash
# Test basic functionality
curl -X POST http://localhost:3001/api/search?q=test&rag=true

# Check token usage in response
# Verify model is command-r-08-2024
# Calculate cost based on tokens
```

---

## Future Enhancements

### 1. Streaming Responses

**Current:** Wait for full response
**Future:** Stream tokens as they're generated

```typescript
export const generateChatResponseStream = async (
  prompt: string,
  options: CohereGenerateOptions = {}
) => {
  const stream = await cohere.chatStream({
    message: prompt,
    model: options.model || DEFAULT_MODEL,
    ...
  });

  return stream; // Return async iterator
};

// Usage
for await (const chunk of stream) {
  console.log(chunk.text); // Display incrementally
}
```

**Benefits:**
- Better UX (users see responses immediately)
- Lower perceived latency
- Can stop generation early

### 2. Response Caching

**Cache identical prompts:**

```typescript
import { createHash } from 'crypto';

const cache = new Map<string, CohereGenerateResponse>();

export const generateChatResponseCached = async (
  prompt: string,
  options: CohereGenerateOptions = {}
): Promise<CohereGenerateResponse> => {
  const cacheKey = createHash('sha256')
    .update(prompt + JSON.stringify(options))
    .digest('hex');

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  const response = await generateChatResponse(prompt, options);
  cache.set(cacheKey, response);

  return response;
};
```

**Benefits:**
- Zero cost for repeated queries
- Instant responses
- Reduced API load

### 3. Retry Logic with Exponential Backoff

**Handle transient failures:**

```typescript
const retry = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      await sleep(2 ** i * 1000); // 1s, 2s, 4s
    }
  }
};

const response = await retry(() =>
  generateChatResponse(prompt)
);
```

### 4. Token Counting Before API Call

**Estimate cost before sending:**

```typescript
import { encode } from 'gpt-tokenizer';

const estimateTokens = (text: string): number => {
  return encode(text).length;
};

const promptTokens = estimateTokens(prompt);
const estimatedCost = (promptTokens / 1_000_000) * 0.15;

console.log(`Estimated input cost: $${estimatedCost.toFixed(6)}`);

if (estimatedCost > 0.01) {
  console.warn('High cost query!');
}
```

### 5. Multi-Model Support

**Fallback to cheaper model:**

```typescript
export const generateChatResponseSmart = async (
  prompt: string,
  complexity: 'simple' | 'medium' | 'complex'
) => {
  const models = {
    simple: 'command-r-08-2024',      // Cheapest
    medium: 'command-r-08-2024',      // Same
    complex: 'command-r-plus-08-2024' // Most capable
  };

  return generateChatResponse(prompt, {
    model: models[complexity]
  });
};
```

---

## Best Practices

### ✅ DO

1. **Always track token usage**
   ```typescript
   const response = await generateChatResponse(prompt);
   logTokenUsage(response.tokenUsage);
   ```

2. **Use appropriate temperature**
   - RAG/Q&A: 0.1-0.3 (focused)
   - Chat: 0.4-0.6 (balanced)
   - Creative: 0.7-1.0 (varied)

3. **Set reasonable maxTokens**
   - Don't use 2000 if 200 is enough
   - Saves cost and latency

4. **Handle errors gracefully**
   ```typescript
   try {
     const response = await generateChatResponse(prompt);
   } catch (err) {
     // Fallback or user-friendly error
   }
   ```

5. **Monitor costs**
   - Check Cohere dashboard regularly
   - Set up billing alerts
   - Track token usage in logs

### ❌ DON'T

1. **Don't ignore token limits**
   - command-r max: 128k tokens
   - Includes prompt + response

2. **Don't hardcode API keys**
   - Use environment variables

3. **Don't send sensitive data**
   - Cohere may log requests
   - Sanitize PII before sending

4. **Don't use high temperature for factual tasks**
   - RAG needs consistency (0.1-0.3)

5. **Don't forget rate limits**
   - Implement application-level limits
   - Handle 429 errors

---

## Summary

The Cohere Service is a **thin, focused abstraction layer** that:

### Key Design Principles

✅ **Simple:** One main function, clear parameters
✅ **Type-safe:** Full TypeScript support
✅ **Cost-aware:** Tracks token usage for monitoring
✅ **Configurable:** Sensible defaults, easy to override
✅ **Resilient:** Logs errors, fails fast
✅ **Efficient:** Uses cost-effective command-r model

### Architecture Benefits

1. **Abstraction:** Application doesn't need to know Cohere API details
2. **Consistency:** All LLM calls go through one interface
3. **Maintainability:** Easy to change models or add features
4. **Testability:** Can mock the service for tests
5. **Observability:** Token tracking built-in

### Cost Efficiency

- **Model:** command-r (94% cheaper than command-r-plus)
- **Per query:** ~$0.0008 (less than 0.1 cents)
- **10k queries:** ~$8.25/month
- **With rate limit:** Max $8.25/month

The service provides a clean, production-ready interface to Cohere's Chat API, optimized for RAG use cases while maintaining flexibility for future enhancements.
