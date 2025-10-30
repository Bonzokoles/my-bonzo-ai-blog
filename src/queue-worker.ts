import { createHash } from 'crypto';

// Image metadata interface
interface ImageMetadata {
  id: string;
  prompt: string;
  model: string;
  params: {
    num_steps: number;
    guidance: number;
    strength: number;
  };
  createdAt: number;
  size: number;
  r2Key: string;
  userId?: string;
}

// Queue message interface
interface ImageGenerationMessage {
  prompt: string; // should be translated prompt when available
  originalPrompt?: string;
  translatedPrompt?: string;
  model: string;
  params: {
    num_steps: number;
    guidance: number;
    strength: number;
  };
  userId?: string;
  requestId: string;
  timestamp: number;
}

// Generate unique hash for image content
function generateImageHash(prompt: string, model: string, params: any): string {
  const hashInput = `${prompt}:${model}:${JSON.stringify(params)}`;
  return createHash('sha256').update(hashInput).digest('hex');
}

export default {
  async queue(batch: any, env: any): Promise<void> {
    console.log(`Processing batch of ${batch.messages.length} image generation requests`);

    for (const message of batch.messages) {
      try {
        const body = message.body as ImageGenerationMessage;
        const { prompt, translatedPrompt, originalPrompt, model, params, userId, requestId, timestamp } = body;

        console.log(`Processing image generation for request: ${requestId}`);

        const usedPrompt = translatedPrompt || prompt;

        // Generate unique hash for this exact request
        const imageHash = generateImageHash(usedPrompt, model, params);
        const r2Key = `images/${imageHash}.png`;

        // Prompt mapping fast-path
        try {
          const mapKey = `img-map:${model}:${usedPrompt}`;
          const mapped = await env.CACHE.get(mapKey, 'json') as { imageId?: string } | null;
          if (mapped?.imageId) {
            const mappedR2Key = `images/${mapped.imageId}.png`;
            const r2Obj = await env.MEDIA_BUCKET.get(mappedR2Key);
            if (r2Obj) {
              await updateRecentImagesList(env, mapped.imageId);
              await env.CACHE.put(`queue-result:${requestId}`, JSON.stringify({
                status: 'completed',
                imageId: mapped.imageId,
                cached: true,
                timestamp: Date.now()
              }), { expirationTtl: 3600 });
              continue;
            }
          }
        } catch {}

        // Check if image already exists in R2 (deduplication)
        let existingImage: ArrayBuffer | null = null;
        try {
          const r2Object = await env.MEDIA_BUCKET.get(r2Key);
          if (r2Object) {
            existingImage = await r2Object.arrayBuffer();
            console.log(`Image already exists in R2: ${imageHash}`);
            
            // Update recent images list since user requested it again
            await updateRecentImagesList(env, imageHash);
            
            // Store completion status
            await env.CACHE.put(`queue-result:${requestId}`, JSON.stringify({
              status: 'completed',
              imageId: imageHash,
              cached: true,
              timestamp: Date.now()
            }), { expirationTtl: 3600 }); // 1 hour
            
            continue;
          }
        } catch (error) {
          console.warn('R2 lookup failed during queue processing:', error);
        }

        // Generate new image using AI
        const inputs = {
          prompt: usedPrompt,
          ...params
        };

        console.log(`Generating new image with model: ${model}`);
        const response = await env.AI.run(model, inputs);
        const imageBuffer = response as ArrayBuffer;
        const imageSize = imageBuffer.byteLength;

        console.log(`Generated image of size: ${imageSize} bytes`);

        // Create metadata
        const metadata: ImageMetadata = {
          id: imageHash,
          prompt: usedPrompt,
          model,
          params,
          createdAt: timestamp,
          size: imageSize,
          r2Key,
          userId
        };

        // Store in R2 for long-term persistence
        await env.MEDIA_BUCKET.put(r2Key, imageBuffer, {
          httpMetadata: { contentType: 'image/png' },
          customMetadata: {
            prompt_original: (originalPrompt || '').slice(0, 200),
            prompt_translated: usedPrompt.slice(0, 200),
            model,
            createdAt: timestamp.toString(),
            userId: userId || 'anonymous',
            requestId
          }
        });

        console.log(`Stored image in R2: ${r2Key}`);

        // Store metadata in KV
        await env.CACHE.put(`img-meta:${imageHash}`, JSON.stringify(metadata), {
          expirationTtl: 86400 * 30 // 30 days
        });

        // Cache image in KV for fast access
        await env.CACHE.put(`img-cache:${imageHash}`, imageBuffer, {
          expirationTtl: 3600 // 1 hour
        });

        // Save prompt mapping
        try {
          const mapKey = `img-map:${model}:${usedPrompt}`;
          await env.CACHE.put(mapKey, JSON.stringify({ imageId: imageHash }), { expirationTtl: 86400 * 7 });
        } catch {}

        // Update recent images list
        await updateRecentImagesList(env, imageHash);

        // Store completion status for the requesting client
        await env.CACHE.put(`queue-result:${requestId}`, JSON.stringify({
          status: 'completed',
          imageId: imageHash,
          cached: false,
          timestamp: Date.now()
        }), { expirationTtl: 3600 }); // 1 hour

        console.log(`Successfully processed image generation for request: ${requestId}`);

      } catch (error) {
        console.error('Queue processing error:', error);
        
        // Store error status
        const body = message.body as ImageGenerationMessage;
        await env.CACHE.put(`queue-result:${body.requestId}`, JSON.stringify({
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: Date.now()
        }), { expirationTtl: 3600 }); // 1 hour
      }
    }
  }
};

async function updateRecentImagesList(env: any, imageHash: string): Promise<void> {
  try {
    const recentKey = 'recent-images';
    const recent = await env.CACHE.get(recentKey, 'json') as string[] || [];
    
    // Remove if already exists (to move to front)
    const index = recent.indexOf(imageHash);
    if (index > -1) {
      recent.splice(index, 1);
    }
    
    // Add to front
    recent.unshift(imageHash);
    
    // Keep last 50 images
    if (recent.length > 50) recent.length = 50;
    
    await env.CACHE.put(recentKey, JSON.stringify(recent), {
      expirationTtl: 86400 * 7 // 7 days
    });
  } catch (error) {
    console.error('Failed to update recent images list:', error);
  }
}