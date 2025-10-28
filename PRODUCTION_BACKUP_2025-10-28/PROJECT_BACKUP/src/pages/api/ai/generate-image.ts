import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { prompt, model = '@cf/stabilityai/stable-diffusion-xl-base-1.0' } = await request.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Dostęp do Cloudflare AI
    const runtime = (locals as any).runtime;
    const env = runtime?.env;
    
    if (!env?.AI) {
      return new Response(
        JSON.stringify({ error: 'AI binding not available' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generuj obraz z AI
    const aiResponse = await env.AI.run(model, {
      prompt: prompt,
      num_steps: 20,
      strength: 1.0,
      guidance: 7.5
    });

    // Konwertuj na ArrayBuffer jeśli potrzeba
    const imageData = aiResponse instanceof ArrayBuffer ? aiResponse : aiResponse.image;
    
    if (!imageData) {
      throw new Error('No image data returned from AI');
    }

    // Upload do R2 bucket
    const imageKey = `ai-generated/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
    
    if (env.MEDIA_BUCKET) {
      await env.MEDIA_BUCKET.put(imageKey, imageData, {
        httpMetadata: {
          contentType: 'image/png',
        },
        customMetadata: {
          prompt: prompt,
          model: model,
          generated: new Date().toISOString()
        }
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        imageUrl: `https://media.mybonzoaiblog.com/${imageKey}`,
        prompt: prompt,
        model: model
      }),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Image Generation Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate image',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};