import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { env } = locals.runtime as { env: any };
    const body = await request.json() as { action?: string; imageId?: string };
    
    const { action, imageId } = body;

    if (action === 'clear-all') {
      // Clear recent images list
      await env.CACHE.delete('recent-images');
      
      // Note: We don't delete R2 storage as that's permanent archive
      // Only clear KV cache for faster cleanup
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Gallery cleared successfully' 
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (action === 'delete-image' && imageId) {
      // Remove from recent list
      const recent = await env.CACHE.get('recent-images', 'json') as string[] || [];
      const filtered = recent.filter(id => id !== imageId);
      
      await env.CACHE.put('recent-images', JSON.stringify(filtered), {
        expirationTtl: 86400 * 7
      });

      // Delete from KV cache
      await env.CACHE.delete(`img-cache:${imageId}`);
      await env.CACHE.delete(`img-meta:${imageId}`);

      // Note: R2 object remains for recovery/audit purposes
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Image removed from gallery' 
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Gallery management error:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Failed to manage gallery',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};