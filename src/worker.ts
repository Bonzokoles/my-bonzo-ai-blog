import type { SSRManifest } from 'astro';
import { App } from 'astro/app';
import { DurableObject } from 'cloudflare:workers';

// Durable Object dla real-time chat/AI
export class ChatRoom extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    
    if (url.pathname === "/websocket") {
      return this.handleWebSocket(request);
    }
    
    return new Response("Not found", { status: 404 });
  }

  private async handleWebSocket(request: Request): Promise<Response> {
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);

    server.accept();
    
    server.addEventListener('message', async (event) => {
      const message = JSON.parse(event.data as string);
      
      if (message.type === 'ai_request') {
        // Wykorzystaj AI Workers do przetwarzania
        const aiResponse = await this.env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
          messages: [{ role: 'user', content: message.content }]
        });
        
        server.send(JSON.stringify({
          type: 'ai_response',
          data: aiResponse
        }));
      }
    });

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }
}

// Image Processor dla optymalizacji obrazów
export class ImageProcessor extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }

  async processImage(imageData: ArrayBuffer, options: any): Promise<ArrayBuffer> {
    // Wykorzystaj Cloudflare Images API
    const formData = new FormData();
    formData.append('file', new Blob([imageData]));
    
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${this.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.env.CLOUDFLARE_API_TOKEN}`,
      },
      body: formData
    });
    
    return response.arrayBuffer();
  }
}

// Główny export funkcji
export function createExports(manifest: SSRManifest) {
  const app = new App(manifest);
  
  return {
    default: {
      async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        // Logging do queue
        if (env.IMAGE_QUEUE) {
          await env.IMAGE_QUEUE.send({
            url: request.url,
            timestamp: Date.now(),
            userAgent: request.headers.get('User-Agent')
          });
        }

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

        // Default Astro handling
        return app.render(request, { locals: {} });
      },

      // Queue consumer dla przetwarzania obrazów
      async queue(batch: MessageBatch<unknown>, env: Env): Promise<void> {
        for (const message of batch.messages) {
          console.log(`Processing: ${JSON.stringify(message.body)}`);
          // Tutaj można dodać logikę przetwarzania
        }
      }
    } satisfies ExportedHandler<Env>
  };
}

// AI Request Handler
async function handleAIRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  
  if (url.pathname === '/api/ai/generate-text') {
    const body = await request.json() as { prompt: string };
    
    const response = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
      messages: [{ role: 'user', content: body.prompt }]
    });
    
    return Response.json(response);
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
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Upload do R2
    const key = `uploads/${Date.now()}-${file.name}`;
    await env.MEDIA_BUCKET.put(key, file.stream());
    
    return Response.json({
      success: true,
      url: `https://media.mybonzoaiblog.com/${key}`
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
        return Response.json({ error: 'Invalid email address' }, { status: 400 });
      }

      await env.NEWSLETTER_SUBSCRIPTIONS.put(body.email, new Date().toISOString());

      return Response.json({ success: true });
    } catch (error) {
      console.error('Subscription error:', error);
      return Response.json({ error: 'Could not subscribe. Please try again later.' }, { status: 500 });
    }
  }

  return new Response('Not found', { status: 404 });
}

// TypeScript types dla środowiska
interface Env {
  AI: Ai;
  SESSION: KVNamespace;
  CACHE: KVNamespace;
  MEDIA_BUCKET: R2Bucket;
  IMAGE_QUEUE: Queue;
  CHAT_ROOM: DurableObjectNamespace;
  NEWSLETTER_SUBSCRIPTIONS: KVNamespace;
  CLOUDFLARE_API_TOKEN: string;
  CLOUDFLARE_ACCOUNT_ID: string;
}