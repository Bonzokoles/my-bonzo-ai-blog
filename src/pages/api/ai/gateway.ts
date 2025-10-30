import type { APIRoute } from 'astro';

// ========== Constants ==========
const CLOUDFLARE_AI_GATEWAY_BASE = 'https://gateway.ai.cloudflare.com/v1';

// ========== Types ==========
interface ChatRequest {
  messages: Array<{ role: string; content: string }>;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

interface CloudflareEnv {
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_AI_GATEWAY_ID?: string;
  CLOUDFLARE_API_TOKEN?: string;
}

// ========== Helper Functions ==========
function getClientIP(request: Request): string {
  return request.headers.get('cf-connecting-ip')
      || request.headers.get('x-forwarded-for')?.split(',')[0]
      || 'unknown';
}

// ========== Main Handler ==========
export const POST: APIRoute = async ({ request }) => {
  try {
    // Rate limiting by IP
    const clientIP = getClientIP(request);
    console.log(`AI Gateway request from IP: ${clientIP}`);

    // Parse request body
    const body = await request.json() as ChatRequest;
    
    if (!body.messages || !Array.isArray(body.messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: messages array required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get environment variables
    const env = (request as any).env as CloudflareEnv || {};
    
    const accountId = env.CLOUDFLARE_ACCOUNT_ID ?? 
      (typeof process !== 'undefined' ? process.env.CLOUDFLARE_ACCOUNT_ID : undefined);
    
    const gatewayId = env.CLOUDFLARE_AI_GATEWAY_ID ?? 
      (typeof process !== 'undefined' ? process.env.CLOUDFLARE_AI_GATEWAY_ID : undefined);
      
    const apiToken = env.CLOUDFLARE_API_TOKEN ?? 
      (typeof process !== 'undefined' ? process.env.CLOUDFLARE_API_TOKEN : undefined);

    if (!accountId || !gatewayId) {
      return new Response(
        JSON.stringify({ 
          error: 'AI Gateway not configured. Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_AI_GATEWAY_ID' 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Prepare request to AI Gateway
    const gatewayUrl = `${CLOUDFLARE_AI_GATEWAY_BASE}/${accountId}/${gatewayId}/compat/chat/completions`;
    
    const requestBody = {
      model: body.model || '@cf/google/gemma-3-12b-it',
      messages: body.messages,
      temperature: body.temperature ?? 0.7,
      max_tokens: body.max_tokens ?? 512
    };

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'User-Agent': 'MyBonzo-AI-Blog/1.0'
    };

    // Add authorization if API token is available
    if (apiToken) {
      headers['Authorization'] = `Bearer ${apiToken}`;
    }

    console.log(`Calling AI Gateway: ${gatewayUrl}`);
    console.log('Request payload:', JSON.stringify(requestBody, null, 2));

    // Call Cloudflare AI Gateway
    const response = await fetch(gatewayUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error(`AI Gateway error ${response.status}:`, errorText);
      
      return new Response(
        JSON.stringify({ 
          error: `AI Gateway error: ${response.status} ${response.statusText}`,
          details: errorText
        }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse and forward response
    const result = await response.json();
    
    console.log('AI Gateway response:', JSON.stringify(result, null, 2));

    return new Response(
      JSON.stringify({
        success: true,
        ...result
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        } 
      }
    );

  } catch (error) {
    console.error('AI Gateway endpoint error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Handle OPTIONS requests for CORS
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
};