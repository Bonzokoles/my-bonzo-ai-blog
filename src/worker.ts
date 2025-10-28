// Simplified worker without Durable Objects for easier deployment

// Główny handler export  
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);

        // Handle AI API routes
        if (url.pathname.startsWith('/api/ai/')) {
          return handleAIRequest(request, env);
        }

        // Handle media processing
        if (url.pathname.startsWith('/api/media/')) {
          return handleMediaRequest(request, env);
        }

        // Handle newsletter subscription
        if (url.pathname.startsWith('/api/newsletter/')) {
          return handleNewsletterRequest(request, env);
        }

        // Default response
        return new Response('Not found', { status: 404 });
  },

};

// AI Request Handler
async function handleAIRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  
  if (url.pathname === '/api/ai/generate-text') {
    const body = await request.json() as { prompt: string };
    
    const response = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
      messages: [{ role: 'user', content: body.prompt }]
    });
    
    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (url.pathname === '/api/ai/generate-image') {
    const body = await request.json() as { prompt: string };
    
    const response = await env.AI.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', {
      prompt: body.prompt
    });
    
    return new Response(response, {
      headers: { 'Content-Type': 'image/png' }
    });
  }
  
  return new Response('Not found', { status: 404 });
}

// Media Request Handler
async function handleMediaRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  
  if (url.pathname === '/api/media/upload' && request.method === 'POST') {
    // Media upload temporarily disabled - R2 bucket not configured
    return new Response(JSON.stringify({
      error: 'Media upload temporarily disabled'
    }), { 
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response('Not found', { status: 404 });
}

// Newsletter Request Handler
async function handleNewsletterRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname === '/api/newsletter/subscribe' && request.method === 'POST') {
    try {
      const body = await request.json() as { email: string };

      if (!body.email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(body.email)) {
        return new Response(JSON.stringify({ error: 'Invalid email address' }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      await env.CACHE.put(`newsletter:${body.email}`, new Date().toISOString());

      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Subscription error:', error);
      return new Response(JSON.stringify({ error: 'Could not subscribe. Please try again later.' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response('Not found', { status: 404 });
}

// TypeScript types dla środowiska
interface Env {
  AI: Ai;
  SESSION: KVNamespace;
  CACHE: KVNamespace;
  CLOUDFLARE_API_TOKEN: string;
  CLOUDFLARE_ACCOUNT_ID: string;
}