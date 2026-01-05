import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  try {
    return new Response(JSON.stringify({
      status: 'ok',
      service: 'MyBonzo API',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      endpoints: [
        '/api/health',
        '/api/containers/test',
        '/api/containers/manage'
      ]
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      status: 'error',
      error: error.message || 'Health check failed'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};