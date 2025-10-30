import type { APIRoute } from 'astro';
import { createHash } from 'crypto';

// Simple rate limiter
const rateLimiter = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // Increased since we're not blocking on generation
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

// Generate unique hash for image content
function generateImageHash(prompt: string, model: string, params: any): string {
  const hashInput = `${prompt}:${model}:${JSON.stringify(params)}`;
  return createHash('sha256').update(hashInput).digest('hex');
}

// Generate unique request ID
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export const POST: APIRoute = async ({ request, locals, clientAddress }) => {
  try {
    const body = await request.json() as {
      prompt?: string;
      model?: string;
      num_steps?: number;
      guidance?: number;
      strength?: number;
      userId?: string;
      async?: boolean; // New parameter to choose sync/async mode
    };

    const {
      prompt,
      model = '@cf/stabilityai/stable-diffusion-xl-base-1.0',
      num_steps = 20,
      guidance = 7.5,
      strength = 1,
      userId,
      async = true // Default to async mode
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

    // Basic moderation (simple keyword filter)
    const bannedWords = ["nude", "blood", "gore", "porn", "explicit", "hate", "weapon"];
    const lower = prompt.toLowerCase();
    if (bannedWords.some((w) => lower.includes(w))) {
      return new Response(
        JSON.stringify({ error: 'Unsafe content' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
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

    // Access Cloudflare services
    const env = (locals as any).runtime?.env;

    // Validate env availability
    if (!env || !env.AI) {
      return new Response(
        JSON.stringify({
          error: 'AI service not available',
          details: 'Cloudflare AI binding not found'
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Optional AI moderation (best-effort)
    try {
      if (env?.AI) {
        const mod = await env.AI.run('@cf/openai/moderation-latest', { input: prompt });
        const flagged = (mod as any)?.results?.[0]?.flagged;
        if (flagged) {
          return new Response(
            JSON.stringify({ error: 'Prompt violates safety policy' }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }
    } catch { }

    // Generate parameters object
    const params = {
      num_steps: Math.min(Math.max(num_steps, 1), 50),
      guidance: Math.min(Math.max(guidance, 1), 20),
      strength: Math.min(Math.max(strength, 0), 1)
    };

    // Translate PL->EN with KV cache (best-effort)
    let translatedPrompt = prompt;
    try {
      const tKey = `translate:${prompt}`;
      const cachedT = await env.CACHE.get(tKey);
      if (cachedT) {
        translatedPrompt = cachedT;
      } else if (env?.AI) {
        const tr = await env.AI.run('@cf/meta/m2m100-1.2b', {
          text: prompt,
          source_lang: 'pl',
          target_lang: 'en'
        });
        const tText = (tr as any)?.translated_text;
        if (tText && typeof tText === 'string') {
          translatedPrompt = tText;
          await env.CACHE.put(tKey, translatedPrompt, { expirationTtl: 86400 });
        }
      }
    } catch { }

    // Generate unique hash for this exact request (based on translated prompt)
    const imageHash = generateImageHash(translatedPrompt, model, params);

    // Check if image already exists in R2
    const r2Key = `images/${imageHash}.png`;
    let existingImage: ArrayBuffer | null = null;

    try {
      const r2Object = await env.MEDIA_BUCKET.get(r2Key);
      if (r2Object) {
        existingImage = await r2Object.arrayBuffer();
      }
    } catch (error) {
      console.warn('R2 lookup failed:', error);
    }

    // If image exists, return it immediately
    if (existingImage) {
      // Get metadata from KV
      const metadata = await env.CACHE.get(`img-meta:${imageHash}`, 'json');

      return new Response(existingImage, {
        headers: {
          'Content-Type': 'image/png',
          'X-Cache': 'R2-HIT',
          'X-Image-ID': imageHash,
          'X-Created-At': metadata?.createdAt?.toString() || 'unknown',
          'Cache-Control': 'public, max-age=86400' // 24 hours for R2 content
        }
      });
    }

    // Check KV cache for temporary storage
    const kvCacheKey = `img-cache:${imageHash}`;
    const cachedBuffer = await env.CACHE.get(kvCacheKey, 'arrayBuffer');

    if (cachedBuffer) {
      return new Response(cachedBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'X-Cache': 'KV-HIT',
          'X-Image-ID': imageHash,
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }

    // Prompt-level mapping dedupe (return existing image if prompt was generated before)
    try {
      const promptMapKey = `img-map:${model}:${translatedPrompt}`;
      const mapped = await env.CACHE.get(promptMapKey, 'json') as { imageId?: string } | null;
      if (mapped?.imageId) {
        const mappedR2Key = `images/${mapped.imageId}.png`;
        const obj = await env.MEDIA_BUCKET.get(mappedR2Key);
        if (obj) {
          const buf = await obj.arrayBuffer();
          return new Response(buf, {
            headers: {
              'Content-Type': 'image/png',
              'X-Cache': 'PROMPT-MAP-R2',
              'X-Image-ID': mapped.imageId,
              'Cache-Control': 'public, max-age=86400'
            }
          });
        }
        const kvBuf = await env.CACHE.get(`img-cache:${mapped.imageId}`, 'arrayBuffer');
        if (kvBuf) {
          return new Response(kvBuf, {
            headers: {
              'Content-Type': 'image/png',
              'X-Cache': 'PROMPT-MAP-KV',
              'X-Image-ID': mapped.imageId,
              'Cache-Control': 'public, max-age=3600'
            }
          });
        }
      }
    } catch { }

    // If async mode is enabled and we have queue support
    if (async && env.IMAGE_QUEUE) {
      const requestId = generateRequestId();

      // Send to queue for background processing
      const queueMessage = {
        prompt: translatedPrompt,
        originalPrompt: prompt,
        model,
        params,
        userId,
        requestId,
        timestamp: Date.now()
      };

      await env.IMAGE_QUEUE.send(queueMessage);

      // Return immediately with request ID for polling
      return new Response(
        JSON.stringify({
          status: 'queued',
          requestId,
          imageId: imageHash,
          message: 'Image generation queued. Poll /api/ai/queue-status/{requestId} for updates.',
          pollUrl: `/api/ai/queue-status/${requestId}`
        }),
        {
          status: 202, // Accepted
          headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': requestId,
            'X-Image-ID': imageHash
          }
        }
      );
    }

    // Fallback to synchronous generation (original logic)
    const inputs = {
      prompt: translatedPrompt,
      ...params
    };

    let imageBuffer: ArrayBuffer;

    try {
      // Cloudflare AI returns ReadableStream for image models
      const response = await env.AI.run(model, inputs);

      // Response is a ReadableStream - convert to ArrayBuffer
      if (response instanceof ReadableStream) {
        const reader = response.getReader();
        const chunks: Uint8Array[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
        }

        // Combine chunks into single buffer
        const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
        const combined = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
          combined.set(chunk, offset);
          offset += chunk.length;
        }
        imageBuffer = combined.buffer;
      } else if (response instanceof ArrayBuffer) {
        imageBuffer = response;
      } else if (response && typeof response === 'object' && 'blob' in response) {
        const blob = await (response as any).blob();
        imageBuffer = await blob.arrayBuffer();
      } else {
        throw new Error('Unexpected response type: ' + typeof response);
      }
    } catch (aiError) {
      console.error('AI.run failed:', aiError);
      return new Response(
        JSON.stringify({
          error: 'Failed to generate image',
          details: aiError instanceof Error ? aiError.message : 'AI service error',
          model,
          prompt: translatedPrompt.slice(0, 100)
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const imageSize = imageBuffer.byteLength;

    if (imageSize === 0) {
      return new Response(
        JSON.stringify({
          error: 'Empty image generated',
          details: 'AI returned empty buffer'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Store in R2 for long-term persistence with fallback
    try {
      await env.MEDIA_BUCKET.put(r2Key, imageBuffer, {
        httpMetadata: { contentType: 'image/png' },
        customMetadata: {
          prompt_original: (prompt || '').slice(0, 200),
          prompt_translated: translatedPrompt.slice(0, 200),
          model,
          createdAt: Date.now().toString(),
          userId: userId || 'anonymous'
        }
      });
    } catch (e) {
      console.warn('R2 storage failed, returning direct image');
      return new Response(imageBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'X-Cache': 'SYNC-NO-R2',
          'X-Image-ID': imageHash,
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }

    // Store metadata and cache
    const metadata = {
      id: imageHash,
      prompt: translatedPrompt,
      model,
      params,
      createdAt: Date.now(),
      size: imageSize,
      r2Key,
      userId
    };

    await env.CACHE.put(`img-meta:${imageHash}`, JSON.stringify(metadata), {
      expirationTtl: 86400 * 30
    });

    await env.CACHE.put(kvCacheKey, imageBuffer, {
      expirationTtl: 3600
    });

    // Save prompt mapping for future dedupe (7 days)
    try {
      const promptMapKey = `img-map:${model}:${translatedPrompt}`;
      await env.CACHE.put(promptMapKey, JSON.stringify({ imageId: imageHash }), {
        expirationTtl: 86400 * 7
      });
    } catch { }

    // Update recent images list
    const recentKey = 'recent-images';
    const recent = await env.CACHE.get(recentKey, 'json') as string[] || [];
    recent.unshift(imageHash);
    if (recent.length > 50) recent.length = 50;
    await env.CACHE.put(recentKey, JSON.stringify(recent), {
      expirationTtl: 86400 * 7
    });

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'X-Cache': 'SYNC-GENERATED',
        'X-Image-ID': imageHash,
        'X-Created-At': metadata.createdAt.toString(),
        'Cache-Control': 'public, max-age=3600'
      }
    });

  } catch (error) {
    console.error('Image Generation Error:', error);

    // Enhanced error reporting
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack?.split('\n').slice(0, 3).join('\n') : undefined,
      type: error?.constructor?.name || typeof error
    };

    return new Response(
      JSON.stringify({
        error: 'Failed to generate image',
        details: errorDetails.message,
        debugInfo: errorDetails
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
      service: 'AI Image Generation API (Queue-enabled)',
      modes: ['synchronous', 'asynchronous'],
      models: [
        '@cf/stabilityai/stable-diffusion-xl-base-1.0',
        '@cf/bytedance/stable-diffusion-xl-lightning',
        '@cf/lykon/dreamshaper-8-lcm'
      ],
      limits: {
        rate: '10 requests per 5 minutes',
        promptLength: 500,
        numSteps: '1-50',
        guidance: '1-20'
      },
      queueSupport: true
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};