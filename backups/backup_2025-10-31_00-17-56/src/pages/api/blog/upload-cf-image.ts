// Astro API endpoint for Cloudflare Images upload
// Proxies to the Worker's CF Images endpoint

export async function POST({ request }: { request: Request }) {
  try {
    const workerUrl = 'https://mybonzo-blog-worker.stolarnia-ams.workers.dev';
    
    // Forward the request to the worker
    const response = await fetch(`${workerUrl}/api/blog/upload-cf-image`, {
      method: 'POST',
      body: request.body,
      headers: {
        ...Object.fromEntries(request.headers.entries()),
      },
    });

    const result = await response.text();
    
    return new Response(result, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('CF Images proxy error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to upload to CF Images' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}