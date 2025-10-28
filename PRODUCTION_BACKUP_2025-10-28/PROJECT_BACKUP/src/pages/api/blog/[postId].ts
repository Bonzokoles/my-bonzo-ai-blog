import type { APIRoute } from 'astro';

// Disable prerendering for dynamic API routes
export const prerender = false;

// Proxy API endpoint for individual blog post
const WORKER_URL = 'https://mybonzo-blog-worker.stolarnia-ams.workers.dev';

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const { postId } = params;
    
    if (!postId) {
      return new Response(JSON.stringify({ 
        error: 'Post ID is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const response = await fetch(`${WORKER_URL}/api/blog/post/${postId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return new Response(JSON.stringify({ 
          error: 'Post not found' 
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`Worker request failed: ${response.status}`);
    }
    
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=600', // 10 minutes cache
      },
    });

  } catch (error) {
    console.error('Blog post API error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch blog post',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};

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