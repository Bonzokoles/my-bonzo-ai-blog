/**
 * Cloudflare AI Gateway wrapper for OpenAI API
 * Provides caching, rate limiting, and analytics
 * 
 * AI Gateway URL format:
 * https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_slug}/openai
 */

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIChatRequest {
  model: string;
  messages: OpenAIMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

export interface OpenAIChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: OpenAIMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenAIGateway {
  private gatewayUrl: string;
  private apiKey: string;

  constructor(accountId: string, gatewaySlug: string, apiKey: string) {
    // AI Gateway endpoint format
    this.gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewaySlug}/openai`;
    this.apiKey = apiKey;
  }

  /**
   * Chat completion request through AI Gateway
   */
  async chatCompletion(request: OpenAIChatRequest): Promise<OpenAIChatResponse> {
    const response = await fetch(`${this.gatewayUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    return response.json() as Promise<OpenAIChatResponse>;
  }

  /**
   * Streaming chat completion through AI Gateway
   */
  async chatCompletionStream(request: OpenAIChatRequest): Promise<ReadableStream> {
    const response = await fetch(`${this.gatewayUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        ...request,
        stream: true
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    return response.body;
  }

  /**
   * Embeddings through AI Gateway
   */
  async createEmbedding(input: string | string[], model: string = 'text-embedding-ada-002') {
    const response = await fetch(`${this.gatewayUrl}/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model,
        input
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * Moderation through AI Gateway
   */
  async moderate(input: string) {
    const response = await fetch(`${this.gatewayUrl}/moderations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({ input })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    return response.json();
  }
}

/**
 * Helper to create OpenAI Gateway instance from environment
 */
export function createOpenAIGateway(env: any): OpenAIGateway {
  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  const gatewaySlug = env.AI_GATEWAY_SLUG || 'mybonzo-ai-gateway';
  const apiKey = env.OPENAI_API_KEY;

  if (!accountId) {
    throw new Error('CLOUDFLARE_ACCOUNT_ID not configured');
  }

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  return new OpenAIGateway(accountId, gatewaySlug, apiKey);
}
