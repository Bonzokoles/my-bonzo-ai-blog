/**
 * AI Chat Streaming Endpoint
 * Provides real-time streaming responses using Server-Sent Events (SSE)
 *
 * Features:
 * - Live token-by-token streaming
 * - Progressive response rendering
 * - Error handling with graceful degradation
 * - Rate limiting integration
 * - Conversation history support
 */

import type { APIRoute } from 'astro';

// ========== Types ==========
interface ChatRequest {
  prompt: string;
  history?: unknown;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

interface ChatHistoryEntry {
  role: 'user' | 'assistant';
  content: string;
}

interface CloudflareEnv {
  AI: {
    run(model: string, options: {
      messages: Array<{ role: string; content: string }>;
      temperature?: number;
      max_tokens?: number;
      stream?: boolean;
    }): Promise<ReadableStream<Uint8Array> | { response: string }>;
  };
  CACHE?: KVNamespace;
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_API_TOKEN?: string;
}

// ========== Configuration ==========
const DEFAULT_MODEL = '@cf/google/gemma-3-12b-it';
const DEFAULT_TEMPERATURE = 0.7;
const DEFAULT_MAX_TOKENS = 1024;
const MAX_PROMPT_LENGTH = 2000;
const MAX_HISTORY_LENGTH = 6;

// Rate limiting
const rateLimiter = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 15; // requests per window
const RATE_WINDOW = 60_000; // 1 minute

// ========== Helper Functions ==========

function getClientIP(request: Request): string {
  return request.headers.get('cf-connecting-ip')
      || request.headers.get('x-forwarded-for')?.split(',')[0]
      || 'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimiter.get(ip);

  if (!record || now > record.resetTime) {
    rateLimiter.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count++;
  return { allowed: true };
}

function sanitiseHistory(history: unknown): ChatHistoryEntry[] {
  if (!Array.isArray(history)) return [];

  return history
    .filter((entry): entry is ChatHistoryEntry => {
      return (
        entry &&
        typeof entry === 'object' &&
        'role' in entry &&
        'content' in entry &&
        typeof entry.content === 'string' &&
        entry.content.trim().length > 0
      );
    })
    .slice(-MAX_HISTORY_LENGTH)
    .map((entry) => ({
      role: entry.role === 'user' || entry.role === 'assistant' ? entry.role : 'assistant',
      content: entry.content.trim()
    }));
}

function buildSystemPrompt(model: string): string {
  return `Jesteś pomocnym asystentem AI MyBonzo. Odpowiadasz po polsku.

Używaj markdown do formatowania:
- **pogrubienie**
- *kursywa*
- \`kod inline\`
- Bloki kodu: \`\`\`język\\nkod\\n\`\`\`
- [linki](url)

Model: ${model}
MCP Tools: dostępne (Context7, Sequential Thinking)

Odpowiadaj rzeczowo i profesjonalnie. Jeśli nie znasz odpowiedzi, powiedz o tym otwarcie.`;
}

// ========== Main Handler ==========

export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime?.env as CloudflareEnv | undefined;

  // Rate limiting
  const clientIP = getClientIP(request);
  const rateLimitCheck = checkRateLimit(clientIP);

  if (!rateLimitCheck.allowed) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Przekroczono limit zapytań. Spróbuj ponownie za chwilę.'
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(rateLimitCheck.retryAfter ?? 60)
        }
      }
    );
  }

  // Parse and validate request
  let body: ChatRequest;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Nieprawidłowe dane wejściowe.'
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  const { prompt, history: rawHistory, model, temperature, max_tokens } = body;

  // Validate prompt
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Pole "prompt" jest wymagane.'
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  if (prompt.length > MAX_PROMPT_LENGTH) {
    return new Response(
      JSON.stringify({
        success: false,
        error: `Prompt jest zbyt długi (limit ${MAX_PROMPT_LENGTH} znaków).`
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // Sanitize history
  const history = sanitiseHistory(rawHistory);

  // Model configuration
  const selectedModel = model && typeof model === 'string' ? model : DEFAULT_MODEL;
  const temp = typeof temperature === 'number' ? Math.max(0, Math.min(1, temperature)) : DEFAULT_TEMPERATURE;
  const maxTokens = typeof max_tokens === 'number'
    ? Math.max(128, Math.min(2048, max_tokens))
    : DEFAULT_MAX_TOKENS;

  // Build messages
  const systemPrompt = buildSystemPrompt(selectedModel);
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-MAX_HISTORY_LENGTH),
    { role: 'user', content: prompt.trim() }
  ];

  // Create SSE stream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Try to get streaming response from AI
        if (!env?.AI) {
          throw new Error('AI binding niedostępny');
        }

        const aiResponse = await env.AI.run(selectedModel, {
          messages,
          temperature: temp,
          max_tokens: maxTokens,
          stream: true
        });

        if (aiResponse instanceof ReadableStream) {
          // Stream AI response
          const reader = aiResponse.getReader();
          const decoder = new TextDecoder();
          let accumulatedText = '';

          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              // Send final done message
              const data = JSON.stringify({ done: true, fullText: accumulatedText });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              break;
            }

            // Decode chunk
            const chunk = decoder.decode(value, { stream: true });

            // Parse streaming response
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const jsonData = JSON.parse(line.slice(6));

                  if (jsonData.response) {
                    accumulatedText += jsonData.response;

                    // Send chunk to client
                    const data = JSON.stringify({
                      chunk: jsonData.response,
                      accumulated: accumulatedText
                    });
                    controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                  }
                } catch (e) {
                  console.error('Error parsing AI stream chunk:', e);
                }
              }
            }
          }
        } else {
          // Fallback: non-streaming response
          const response = (aiResponse as { response: string }).response;

          // Simulate streaming by sending word by word
          const words = response.split(' ');
          let accumulatedText = '';

          for (let i = 0; i < words.length; i++) {
            const word = words[i] + (i < words.length - 1 ? ' ' : '');
            accumulatedText += word;

            const data = JSON.stringify({
              chunk: word,
              accumulated: accumulatedText
            });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));

            // Small delay to simulate streaming
            await new Promise(resolve => setTimeout(resolve, 50));
          }

          // Send done
          const data = JSON.stringify({ done: true, fullText: accumulatedText });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        }

      } catch (error) {
        console.error('Streaming error:', error);

        const errorData = JSON.stringify({
          error: 'Nie udało się wygenerować odpowiedzi AI.',
          details: error instanceof Error ? error.message : String(error)
        });
        controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'X-Content-Type-Options': 'nosniff'
    }
  });
};

// ========== GET Handler (Health Check) ==========

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      status: 'healthy',
      endpoint: 'chat-stream',
      features: ['streaming', 'sse', 'progressive-rendering'],
      rateLimit: {
        requests: RATE_LIMIT,
        window: `${RATE_WINDOW / 1000}s`
      }
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};
