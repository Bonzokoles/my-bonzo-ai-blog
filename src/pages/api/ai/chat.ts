import type { APIRoute } from 'astro';

// Simple in-memory rate limiter
const rateLimiter = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per window
const RATE_WINDOW = 60000; // 1 minute

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
    const body = await request.json() as {
      prompt: string;
      history?: Array<{role: string; content: string}>;
      model?: string;
      temperature?: number;
      max_tokens?: number;
    };
    
    const {
      prompt,
      history = [],
      model = '@cf/meta/llama-2-7b-chat-int8',
      temperature = 0.7,
      max_tokens = 1024
    } = body;

    // Validation
    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Valid prompt is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (prompt.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Prompt too long (max 2000 characters)' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting
    const clientId = clientAddress || 'unknown';
    if (!checkRateLimit(clientId)) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded. Please wait a moment.',
          retryAfter: 60
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60'
          }
        }
      );
    }

    // Dostęp do Cloudflare AI przez runtime
    const { env } = (locals as any).runtime;

    // Check cache first
    const cacheKey = `ai:${Buffer.from(prompt).toString('base64').slice(0, 100)}`;
    const cached = await env.CACHE.get(cacheKey);

    if (cached) {
      const cachedData = JSON.parse(cached);
      return new Response(
        JSON.stringify({
          success: true,
          response: cachedData.response,
          model: 'cached',
          cached: true
        }),
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Build messages with conversation history
    const messages = [
      {
        role: 'system',
        content: `Jesteś pomocnym i przyjaznym asystentem AI na polskim blogu MyBonzo o sztucznej inteligencji.

Twoje zadania:
- Odpowiadaj zawsze po polsku, jasno i zwięźle
- Używaj formatowania markdown (np. **pogrubienie**, *kursywa*, \`kod\`, listy)
- Jeśli pytanie dotyczy AI/ML/technologii - udzielaj szczegółowych odpowiedzi
- Bądź pomocny, ale przyznawaj się do ograniczeń
- W odpowiedziach uwzględniaj kontekst poprzednich wiadomości`
      },
      ...history.slice(-6), // Include last 6 messages for context
      {
        role: 'user',
        content: prompt
      }
    ];

    const aiResponse = await env.AI.run(model, {
      messages,
      max_tokens: Math.min(max_tokens, 2048), // Cap at 2048 for safety
      temperature: Math.max(0, Math.min(temperature, 1)) // Clamp between 0 and 1
    });

    const responseText = aiResponse.response || aiResponse;

    // Cache the response (store only the text response)
    await env.CACHE.put(cacheKey, JSON.stringify({
      response: responseText,
      timestamp: Date.now()
    }), {
      expirationTtl: 3600 // 1 hour
    });

    return new Response(
      JSON.stringify({
        success: true,
        response: responseText,
        model: model,
        cached: false
      }),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('AI API Error:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to generate AI response',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

export const GET: APIRoute = async ({ url, locals }) => {
  const { env } = (locals as any).runtime;
  const prompt = url.searchParams.get('prompt');
  
  // Health check endpoint - return status if no prompt
  if (!prompt) {
    return new Response(
      JSON.stringify({ 
        status: 'healthy',
        service: 'AI Chat API',
        endpoints: ['POST /api/ai/chat', 'GET /api/ai/chat?prompt=...'],
        models: ['@cf/meta/llama-2-7b-chat-int8']
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Sprawdź cache
  const cacheKey = `ai:${Buffer.from(prompt).toString('base64')}`;
  const cached = await env.CACHE.get(cacheKey);
  
  if (cached) {
    const cachedResponse = JSON.parse(cached);
    return new Response(
      JSON.stringify({
        success: true,
        response: cachedResponse.response,
        model: 'cached',
        cached: true
      }),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  return new Response(
    JSON.stringify({ error: 'No cached response found. Use POST to generate new response.' }),
    { status: 404, headers: { 'Content-Type': 'application/json' } }
  );
};