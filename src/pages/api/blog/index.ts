import type { APIRoute } from 'astro';

// Proxy API endpoint for blog operations
// This endpoint forwards requests to our Cloudflare Worker

const WORKER_URL = 'https://mybonzo-blog-worker.stolarnia-ams.workers.dev';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const refresh = url.searchParams.get('refresh') === 'true';
    
    const workerEndpoint = refresh ? '/api/blog/refresh' : '/api/blog/index';
    const response = await fetch(`${WORKER_URL}${workerEndpoint}`);
    
    if (!response.ok) {
      throw new Error(`Worker request failed: ${response.status}`);
    }
    
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300', // 5 minutes cache
      },
    });

  } catch (error) {
    console.error('Blog index API error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch blog index',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'javascript',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};

// Enable CORS for all methods
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};