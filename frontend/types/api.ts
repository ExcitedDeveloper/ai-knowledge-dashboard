// API request and response types

export interface UploadedFile {
  id?: string;
  filename: string;
  text: string;
  timestamp: number;
  embedding?: number[];
}

export interface UploadResponse {
  filename: string;
  text: string;
  embedding?: number[];
}

export interface SearchResult {
  filename: string;
  excerpt: string;
  matches: number;
}

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

export interface ApiError {
  error: string;
}
