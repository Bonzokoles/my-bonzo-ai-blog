import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, url, locals }) => {
  try {
    const { env } = locals.runtime as { env: any };
    const imageId = params.imageId;
    const searchParams = new URL(url).searchParams;
    const size = searchParams.get('size'); // 'thumb' for thumbnail
    
    if (!imageId) {
      return new Response(
        JSON.stringify({ error: 'Image ID required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Try KV cache first (faster)
    const kvCacheKey = `img-cache:${imageId}`;
    const cachedImage = await env.CACHE.get(kvCacheKey, 'arrayBuffer');
    
    if (cachedImage) {
      return new Response(cachedImage, {
        headers: {
          'Content-Type': 'image/png',
          'X-Cache': 'KV-HIT',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    }

    // Try R2 storage
    const r2Key = `images/${imageId}.png`;
    const r2Object = await env.MEDIA_BUCKET.get(r2Key);
    
    if (!r2Object) {
      return new Response(
        JSON.stringify({ error: 'Image not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const imageBuffer = await r2Object.arrayBuffer();

    // Cache back in KV for faster future access
    env.CACHE.put(kvCacheKey, imageBuffer, {
      expirationTtl: 3600 // 1 hour
    }).catch((error: any) => {
      console.warn('KV cache failed:', error);
    });

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'X-Cache': 'R2-HIT',
        'Cache-Control': 'public, max-age=86400', // 24 hours
        'Last-Modified': r2Object.httpMetadata?.lastModified || new Date().toUTCString()
      }
    });

  } catch (error) {
    console.error('Image fetch error:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch image',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};