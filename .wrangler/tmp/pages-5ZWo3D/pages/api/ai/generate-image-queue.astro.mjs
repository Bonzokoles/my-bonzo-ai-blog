globalThis.process ??= {}; globalThis.process.env ??= {};
import { createHash } from 'crypto';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const rateLimiter = /* @__PURE__ */ new Map();
const RATE_LIMIT = 10;
const RATE_WINDOW = 3e5;
function checkRateLimit(identifier) {
  const now = Date.now();
  const record = rateLimiter.get(identifier);
  if (!record || now > record.resetTime) {
    rateLimiter.set(identifier, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  record.count++;
  return true;
}
function generateImageHash(prompt, model, params) {
  const hashInput = `${prompt}:${model}:${JSON.stringify(params)}`;
  return createHash("sha256").update(hashInput).digest("hex");
}
function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
const POST = async ({ request, locals, clientAddress }) => {
  try {
    const body = await request.json();
    const {
      prompt,
      model = "@cf/stabilityai/stable-diffusion-xl-base-1.0",
      num_steps = 20,
      guidance = 7.5,
      strength = 1,
      userId,
      async = true
      // Default to async mode
    } = body;
    if (!prompt || typeof prompt !== "string") {
      return new Response(
        JSON.stringify({ error: "Valid prompt is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (prompt.length > 500) {
      return new Response(
        JSON.stringify({ error: "Prompt too long (max 500 characters)" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const bannedWords = ["nude", "blood", "gore", "porn", "explicit", "hate", "weapon"];
    const lower = prompt.toLowerCase();
    if (bannedWords.some((w) => lower.includes(w))) {
      return new Response(
        JSON.stringify({ error: "Unsafe content" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }
    const clientId = clientAddress || "unknown";
    if (!checkRateLimit(clientId)) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded. Please wait 5 minutes.",
          retryAfter: 300
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "300"
          }
        }
      );
    }
    const env = locals.runtime?.env;
    if (!env || !env.AI) {
      return new Response(
        JSON.stringify({
          error: "AI service not available",
          details: "Cloudflare AI binding not found"
        }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }
    try {
      if (env?.AI) {
        const mod = await env.AI.run("@cf/openai/moderation-latest", { input: prompt });
        const flagged = mod?.results?.[0]?.flagged;
        if (flagged) {
          return new Response(
            JSON.stringify({ error: "Prompt violates safety policy" }),
            { status: 403, headers: { "Content-Type": "application/json" } }
          );
        }
      }
    } catch {
    }
    const params = {
      num_steps: Math.min(Math.max(num_steps, 1), 50),
      guidance: Math.min(Math.max(guidance, 1), 20),
      strength: Math.min(Math.max(strength, 0), 1)
    };
    let translatedPrompt = prompt;
    try {
      const tKey = `translate:${prompt}`;
      const cachedT = await env.CACHE.get(tKey);
      if (cachedT) {
        translatedPrompt = cachedT;
      } else if (env?.AI) {
        const tr = await env.AI.run("@cf/meta/m2m100-1.2b", {
          text: prompt,
          source_lang: "pl",
          target_lang: "en"
        });
        const tText = tr?.translated_text;
        if (tText && typeof tText === "string") {
          translatedPrompt = tText;
          await env.CACHE.put(tKey, translatedPrompt, { expirationTtl: 86400 });
        }
      }
    } catch {
    }
    const imageHash = generateImageHash(translatedPrompt, model, params);
    const r2Key = `images/${imageHash}.png`;
    let existingImage = null;
    try {
      const r2Object = await env.MEDIA_BUCKET.get(r2Key);
      if (r2Object) {
        existingImage = await r2Object.arrayBuffer();
      }
    } catch (error) {
      console.warn("R2 lookup failed:", error);
    }
    if (existingImage) {
      const metadata2 = await env.CACHE.get(`img-meta:${imageHash}`, "json");
      return new Response(existingImage, {
        headers: {
          "Content-Type": "image/png",
          "X-Cache": "R2-HIT",
          "X-Image-ID": imageHash,
          "X-Created-At": metadata2?.createdAt?.toString() || "unknown",
          "Cache-Control": "public, max-age=86400"
          // 24 hours for R2 content
        }
      });
    }
    const kvCacheKey = `img-cache:${imageHash}`;
    const cachedBuffer = await env.CACHE.get(kvCacheKey, "arrayBuffer");
    if (cachedBuffer) {
      return new Response(cachedBuffer, {
        headers: {
          "Content-Type": "image/png",
          "X-Cache": "KV-HIT",
          "X-Image-ID": imageHash,
          "Cache-Control": "public, max-age=3600"
        }
      });
    }
    try {
      const promptMapKey = `img-map:${model}:${translatedPrompt}`;
      const mapped = await env.CACHE.get(promptMapKey, "json");
      if (mapped?.imageId) {
        const mappedR2Key = `images/${mapped.imageId}.png`;
        const obj = await env.MEDIA_BUCKET.get(mappedR2Key);
        if (obj) {
          const buf = await obj.arrayBuffer();
          return new Response(buf, {
            headers: {
              "Content-Type": "image/png",
              "X-Cache": "PROMPT-MAP-R2",
              "X-Image-ID": mapped.imageId,
              "Cache-Control": "public, max-age=86400"
            }
          });
        }
        const kvBuf = await env.CACHE.get(`img-cache:${mapped.imageId}`, "arrayBuffer");
        if (kvBuf) {
          return new Response(kvBuf, {
            headers: {
              "Content-Type": "image/png",
              "X-Cache": "PROMPT-MAP-KV",
              "X-Image-ID": mapped.imageId,
              "Cache-Control": "public, max-age=3600"
            }
          });
        }
      }
    } catch {
    }
    if (async && env.IMAGE_QUEUE) {
      const requestId = generateRequestId();
      const queueMessage = {
        prompt: translatedPrompt,
        originalPrompt: prompt,
        model,
        params,
        userId,
        requestId,
        timestamp: Date.now()
      };
      await env.IMAGE_QUEUE.send(queueMessage);
      return new Response(
        JSON.stringify({
          status: "queued",
          requestId,
          imageId: imageHash,
          message: "Image generation queued. Poll /api/ai/queue-status/{requestId} for updates.",
          pollUrl: `/api/ai/queue-status/${requestId}`
        }),
        {
          status: 202,
          // Accepted
          headers: {
            "Content-Type": "application/json",
            "X-Request-ID": requestId,
            "X-Image-ID": imageHash
          }
        }
      );
    }
    const inputs = {
      prompt: translatedPrompt,
      ...params
    };
    let imageBuffer;
    try {
      const response = await env.AI.run(model, inputs);
      if (response instanceof ReadableStream) {
        const reader = response.getReader();
        const chunks = [];
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
        }
        const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
        const combined = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
          combined.set(chunk, offset);
          offset += chunk.length;
        }
        imageBuffer = combined.buffer;
      } else if (response instanceof ArrayBuffer) {
        imageBuffer = response;
      } else if (response && typeof response === "object" && "blob" in response) {
        const blob = await response.blob();
        imageBuffer = await blob.arrayBuffer();
      } else {
        throw new Error("Unexpected response type: " + typeof response);
      }
    } catch (aiError) {
      console.error("AI.run failed:", aiError);
      return new Response(
        JSON.stringify({
          error: "Failed to generate image",
          details: aiError instanceof Error ? aiError.message : "AI service error",
          model,
          prompt: translatedPrompt.slice(0, 100)
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const imageSize = imageBuffer.byteLength;
    if (imageSize === 0) {
      return new Response(
        JSON.stringify({
          error: "Empty image generated",
          details: "AI returned empty buffer"
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    try {
      await env.MEDIA_BUCKET.put(r2Key, imageBuffer, {
        httpMetadata: { contentType: "image/png" },
        customMetadata: {
          prompt_original: (prompt || "").slice(0, 200),
          prompt_translated: translatedPrompt.slice(0, 200),
          model,
          createdAt: Date.now().toString(),
          userId: userId || "anonymous"
        }
      });
    } catch (e) {
      console.warn("R2 storage failed, returning direct image");
      return new Response(imageBuffer, {
        headers: {
          "Content-Type": "image/png",
          "X-Cache": "SYNC-NO-R2",
          "X-Image-ID": imageHash,
          "Cache-Control": "public, max-age=3600"
        }
      });
    }
    const metadata = {
      id: imageHash,
      prompt: translatedPrompt,
      model,
      params,
      createdAt: Date.now(),
      size: imageSize,
      r2Key,
      userId
    };
    await env.CACHE.put(`img-meta:${imageHash}`, JSON.stringify(metadata), {
      expirationTtl: 86400 * 30
    });
    await env.CACHE.put(kvCacheKey, imageBuffer, {
      expirationTtl: 3600
    });
    try {
      const promptMapKey = `img-map:${model}:${translatedPrompt}`;
      await env.CACHE.put(promptMapKey, JSON.stringify({ imageId: imageHash }), {
        expirationTtl: 86400 * 7
      });
    } catch {
    }
    const recentKey = "recent-images";
    const recent = await env.CACHE.get(recentKey, "json") || [];
    recent.unshift(imageHash);
    if (recent.length > 50) recent.length = 50;
    await env.CACHE.put(recentKey, JSON.stringify(recent), {
      expirationTtl: 86400 * 7
    });
    return new Response(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "X-Cache": "SYNC-GENERATED",
        "X-Image-ID": imageHash,
        "X-Created-At": metadata.createdAt.toString(),
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (error) {
    console.error("Image Generation Error:", error);
    const errorDetails = {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack?.split("\n").slice(0, 3).join("\n") : void 0,
      type: error?.constructor?.name || typeof error
    };
    return new Response(
      JSON.stringify({
        error: "Failed to generate image",
        details: errorDetails.message,
        debugInfo: errorDetails
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
const GET = async () => {
  return new Response(
    JSON.stringify({
      status: "healthy",
      service: "AI Image Generation API (Queue-enabled)",
      modes: ["synchronous", "asynchronous"],
      models: [
        "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        "@cf/bytedance/stable-diffusion-xl-lightning",
        "@cf/lykon/dreamshaper-8-lcm"
      ],
      limits: {
        rate: "10 requests per 5 minutes",
        promptLength: 500,
        numSteps: "1-50",
        guidance: "1-20"
      },
      queueSupport: true
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
