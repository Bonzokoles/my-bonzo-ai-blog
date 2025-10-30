import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, locals }) => {
  try {
    const { requestId } = params;

    if (!requestId || typeof requestId !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Request ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Access Cloudflare KV
    const env = (locals as any).runtime?.env;

    // Check queue result status
    const result = await env.CACHE.get(`queue-result:${requestId}`, 'json');

    if (!result) {
      return new Response(
        JSON.stringify({
          status: 'pending',
          message: 'Request is still processing or not found'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // If completed successfully
    if (result.status === 'completed') {
      return new Response(
        JSON.stringify({
          status: 'completed',
          imageId: result.imageId,
          cached: result.cached || false,
          completedAt: result.timestamp,
          imageUrl: `/api/ai/image/${result.imageId}`
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // If error occurred
    if (result.status === 'error') {
      return new Response(
        JSON.stringify({
          status: 'error',
          error: result.error,
          timestamp: result.timestamp
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Default response for unknown status
    return new Response(
      JSON.stringify({
        status: result.status || 'unknown',
        timestamp: result.timestamp
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Queue Status Check Error:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to check queue status',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};