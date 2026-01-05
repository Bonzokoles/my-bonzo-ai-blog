import type { APIRoute } from 'astro';
import { createHash } from 'crypto';

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

// Generate unique hash for image content
function generateImageHash(prompt: string, model: string, params: any): string {
  const hashInput = `${prompt}:${model}:${JSON.stringify(params)}`;
  return createHash('sha256').update(hashInput).digest('hex');
}

// Image metadata interface
interface ImageMetadata {
  id: string;
  prompt: string;
  model: string;
  params: {
    num_steps: number;
    guidance: number;
    strength: number;
  };
  createdAt: number;
  size: number;
  r2Key: string;
}

export const POST: APIRoute = async ({ request, locals, clientAddress }) => {
  try {
    const body = await request.json() as {
      prompt?: string;
      model?: string;
      num_steps?: number;
      guidance?: number;
      strength?: number;
    };
    
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

    // Basic moderation (simple keyword filter)
    const bannedWords = ["nude", "blood", "gore"];
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

  // Access Cloudflare AI
  const env = (locals as any).runtime?.env;

    // Optional AI moderation (best-effort, won't block on failure unless flagged)
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
    } catch (e) {
      console.warn('AI moderation check failed (non-blocking):', e);
    }

    // Translate PL->EN using Workers AI (best-effort) with KV cache
    let translatedPrompt = prompt;
    try {
      const translateKey = `translate:${prompt}`;
      const cachedTranslation = await env.CACHE.get(translateKey);
      if (cachedTranslation) {
        translatedPrompt = cachedTranslation;
      } else if (env.AI) {
        const tr = await env.AI.run("@cf/meta/m2m100-1.2b", {
          text: prompt,
          source_lang: "pl",
          target_lang: "en",
        });
        const maybe = (tr as any)?.translated_text;
        if (maybe && typeof maybe === 'string') {
          translatedPrompt = maybe;
          await env.CACHE.put(translateKey, translatedPrompt, { expirationTtl: 86400 });
        }
      }
    } catch (e) {
      console.warn('Translation failed, using original prompt');
    }

    // Generate parameters object
    const params = {
      num_steps: Math.min(Math.max(num_steps, 1), 50),
      guidance: Math.min(Math.max(guidance, 1), 20),
      strength: Math.min(Math.max(strength, 0), 1)
    };

    // Try prompt-level mapping to deduplicate repeated prompts regardless of params
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
              'Cache-Control': 'public, max-age=86400',
            },
          });
        }
        const kvBuf = await env.CACHE.get(`img-cache:${mapped.imageId}`, 'arrayBuffer');
        if (kvBuf) {
          return new Response(kvBuf, {
            headers: {
              'Content-Type': 'image/png',
              'X-Cache': 'PROMPT-MAP-KV',
              'X-Image-ID': mapped.imageId,
              'Cache-Control': 'public, max-age=3600',
            },
          });
        }
      }
    } catch (e) {
      console.warn('Prompt map lookup failed:', e);
    }

    // Generate unique hash for this exact request
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

    // If image exists, return it with metadata
    if (existingImage) {
      // Get metadata from KV
      const metadata = await env.CACHE.get(`img-meta:${imageHash}`, 'json') as ImageMetadata | null;
      
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

    // Check KV cache for temporary storage (faster than R2 for recent images)
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

    // Generate new image
    const inputs = {
      prompt: translatedPrompt,
      ...params
    };

    const response = await env.AI.run(model, inputs);
    const imageBuffer = response as ArrayBuffer;
    const imageSize = imageBuffer.byteLength;

    // Create metadata
    const metadata: ImageMetadata = {
      id: imageHash,
      prompt: translatedPrompt,
      model,
      params,
      createdAt: Date.now(),
      size: imageSize,
      r2Key
    };

    // Store in R2 for long-term persistence; if it fails, return image directly
    try {
      await env.MEDIA_BUCKET.put(r2Key, imageBuffer, {
        httpMetadata: {
          contentType: 'image/png'
        },
        customMetadata: {
          prompt_translated: translatedPrompt.slice(0, 200), // Truncate for metadata limits
          model,
          createdAt: Date.now().toString()
        }
      });
    } catch (error) {
      console.warn('R2 storage failed, returning direct image:', error);
      return new Response(imageBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'X-Cache': 'MISS-NO-R2',
          'X-Image-ID': imageHash,
          'X-Translated': translatedPrompt !== prompt ? 'pl->en' : 'no',
          'Cache-Control': 'public, max-age=1800'
        }
      });
    }

    // Store metadata in KV
    await env.CACHE.put(`img-meta:${imageHash}`, JSON.stringify(metadata), {
      expirationTtl: 86400 * 30 // 30 days
    });

    // Cache image in KV for fast access (1 hour)
    await env.CACHE.put(kvCacheKey, imageBuffer, {
      expirationTtl: 3600
    });

    // Save prompt mapping for future deduplication
    try {
      const promptMapKey = `img-map:${model}:${translatedPrompt}`;
      await env.CACHE.put(promptMapKey, JSON.stringify({ imageId: imageHash }), {
        expirationTtl: 86400 * 7,
      });
    } catch (e) {
      console.warn('Prompt map write failed:', e);
    }

    // Add to recent images list (for gallery)
    const recentKey = 'recent-images';
    const recent = await env.CACHE.get(recentKey, 'json') as string[] || [];
    recent.unshift(imageHash);
    
    // Keep last 50 images
    if (recent.length > 50) recent.length = 50;
    
    await env.CACHE.put(recentKey, JSON.stringify(recent), {
      expirationTtl: 86400 * 7 // 7 days
    });

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'X-Cache': 'MISS',
        'X-Image-ID': imageHash,
        'X-Translated': translatedPrompt !== prompt ? 'pl->en' : 'no',
        'X-Created-At': metadata.createdAt.toString(),
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