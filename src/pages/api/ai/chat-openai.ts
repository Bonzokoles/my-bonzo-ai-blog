import type { APIRoute } from 'astro';
import { createOpenAIGateway, type OpenAIChatRequest } from '../../../lib/openai-gateway';

// Simple rate limiter
const rateLimiter = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20; // requests per window
const RATE_WINDOW = 300000; // 5 minutes

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimiter.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimiter.set(identifier, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

export const POST: APIRoute = async ({ request, locals, clientAddress }) => {
  try {
    const body = await request.json() as OpenAIChatRequest & {
      stream?: boolean;
    };

    // Validation
    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting
    const clientId = clientAddress || 'unknown';
    if (!checkRateLimit(clientId)) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded. Please wait 5 minutes.',
          retryAfter: 300
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '300'
          }
        }
      );
    }

    // Access environment
    const env = (locals as any).runtime?.env;
    
    // Create OpenAI Gateway client
    const gateway = createOpenAIGateway(env);

    // Default parameters
    const model = body.model || 'gpt-4o-mini';
    const temperature = body.temperature ?? 0.7;
    const max_tokens = body.max_tokens || 1000;

    const chatRequest: OpenAIChatRequest = {
      model,
      messages: body.messages,
      temperature,
      max_tokens,
      top_p: body.top_p,
      frequency_penalty: body.frequency_penalty,
      presence_penalty: body.presence_penalty
    };

    // Handle streaming
    if (body.stream) {
      const stream = await gateway.chatCompletionStream(chatRequest);

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'X-Accel-Buffering': 'no'
        }
      });
    }

    // Non-streaming response
    const response = await gateway.chatCompletion(chatRequest);

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Model': model,
          'X-Tokens-Used': response.usage.total_tokens.toString()
        }
      }
    );

  } catch (error) {
    console.error('OpenAI Chat Error:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      status: 'healthy',
      service: 'OpenAI Chat API (via AI Gateway)',
      models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
      features: ['streaming', 'caching', 'rate-limiting', 'analytics'],
      limits: {
        rate: '20 requests per 5 minutes',
        maxTokens: 4096,
        temperature: '0-2'
      }
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
