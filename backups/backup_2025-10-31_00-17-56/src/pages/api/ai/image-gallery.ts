import type { APIRoute } from 'astro';

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

export const GET: APIRoute = async ({ url, locals }) => {
  try {
    const { env } = locals.runtime as { env: any };
    const searchParams = new URL(url).searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0);

    // Get recent images list
    const recentImages = await env.CACHE.get('recent-images', 'json') as string[] || [];
    
    // Paginate
    const pageImages = recentImages.slice(offset, offset + limit);
    
    // Get metadata for each image
    const gallery = await Promise.all(
      pageImages.map(async (imageId: string) => {
        const metadata = await env.CACHE.get(`img-meta:${imageId}`, 'json') as ImageMetadata | null;
        
        if (!metadata) return null;
        
        return {
          id: imageId,
          prompt: metadata.prompt,
          model: metadata.model,
          createdAt: metadata.createdAt,
          size: metadata.size,
          url: `/api/ai/image/${imageId}`, // URL to get the actual image
          thumbnail: `/api/ai/image/${imageId}?size=thumb`
        };
      })
    );

    // Filter out null entries
    const validGallery = gallery.filter(item => item !== null);

    return new Response(
      JSON.stringify({
        images: validGallery,
        total: recentImages.length,
        hasMore: offset + limit < recentImages.length,
        pagination: {
          limit,
          offset,
          nextOffset: offset + limit < recentImages.length ? offset + limit : null
        }
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300' // 5 minutes
        }
      }
    );

  } catch (error) {
    console.error('Gallery fetch error:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch image gallery',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};