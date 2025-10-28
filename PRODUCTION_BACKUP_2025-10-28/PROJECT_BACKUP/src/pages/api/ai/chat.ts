import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { prompt, model = '@cf/meta/llama-2-7b-chat-int8' } = await request.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Dostęp do Cloudflare AI przez runtime
    const { env } = locals.runtime;
    
    const aiResponse = await env.AI.run(model, {
      messages: [
        {
          role: 'system',
          content: 'Jesteś pomocnym asystentem AI na polskim blogu o sztucznej inteligencji. Odpowiadaj po polsku.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 512,
      temperature: 0.7
    });

    // Cache odpowiedzi w KV
    const cacheKey = `ai:${Buffer.from(prompt).toString('base64')}`;
    await env.CACHE.put(cacheKey, JSON.stringify(aiResponse), {
      expirationTtl: 3600 // 1 godzina
    });

    return new Response(
      JSON.stringify({
        success: true,
        response: aiResponse.response,
        model: model,
        cached: false
      }),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('AI API Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate AI response',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

export const GET: APIRoute = async ({ url, locals }) => {
  const { env } = locals.runtime;
  const prompt = url.searchParams.get('prompt');
  
  if (!prompt) {
    return new Response(
      JSON.stringify({ error: 'Prompt parameter is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Sprawdź cache
  const cacheKey = `ai:${Buffer.from(prompt).toString('base64')}`;
  const cached = await env.CACHE.get(cacheKey);
  
  if (cached) {
    const cachedResponse = JSON.parse(cached);
    return new Response(
      JSON.stringify({
        success: true,
        response: cachedResponse.response,
        model: 'cached',
        cached: true
      }),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  return new Response(
    JSON.stringify({ error: 'No cached response found. Use POST to generate new response.' }),
    { status: 404, headers: { 'Content-Type': 'application/json' } }
  );
};