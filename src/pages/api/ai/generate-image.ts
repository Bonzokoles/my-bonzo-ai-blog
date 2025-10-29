import type { APIRoute } from 'astro';

// Simple rate limiter
const rateLimiter = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // requests per window
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
    const body = await request.json();
    const {
      prompt,
      model = '@cf/stabilityai/stable-diffusion-xl-base-1.0',
      num_steps = 20,
      guidance = 7.5,
      strength = 1
    } = body;

    // Validation
    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Valid prompt is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (prompt.length > 500) {
      return new Response(
        JSON.stringify({ error: 'Prompt too long (max 500 characters)' }),
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

    // Access Cloudflare AI
    const { env } = locals.runtime;

    // Check cache first
    const cacheKey = `img:${model}:${Buffer.from(prompt).toString('base64').slice(0, 100)}`;
    const cached = await env.CACHE.get(cacheKey, 'arrayBuffer');

    if (cached) {
      return new Response(cached, {
        headers: {
          'Content-Type': 'image/png',
          'X-Cache': 'HIT'
        }
      });
    }

    // Generate image
    const inputs = {
      prompt: prompt,
      num_steps: Math.min(Math.max(num_steps, 1), 50),
      guidance: Math.min(Math.max(guidance, 1), 20),
      strength: Math.min(Math.max(strength, 0), 1)
    };

    const response = await env.AI.run(model, inputs);

    // Response is an ArrayBuffer with PNG image
    const imageBuffer = response as ArrayBuffer;

    // Cache the image (1 hour)
    await env.CACHE.put(cacheKey, imageBuffer, {
      expirationTtl: 3600
    });

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'X-Cache': 'MISS',
        'Cache-Control': 'public, max-age=3600'
      }
    });

  } catch (error) {
    console.error('Image Generation Error:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to generate image',
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
      service: 'AI Image Generation API',
      models: [
        '@cf/stabilityai/stable-diffusion-xl-base-1.0',
        '@cf/bytedance/stable-diffusion-xl-lightning',
        '@cf/lykon/dreamshaper-8-lcm'
      ],
      limits: {
        rate: '5 requests per 5 minutes',
        promptLength: 500,
        numSteps: '1-50',
        guidance: '1-20'
      }
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};