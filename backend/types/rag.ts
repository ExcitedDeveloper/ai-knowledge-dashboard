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
