globalThis.process ??= {}; globalThis.process.env ??= {};
import { withFeatureMiddleware } from '../../../chunks/api-middleware_MytvPj0_.mjs';
import { createHash } from 'crypto';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
function generateImageHash(prompt, model, params) {
  const hashInput = `${prompt}:${model}:${JSON.stringify(params)}`;
  return createHash("sha256").update(hashInput).digest("hex");
}
const POST = async (context) => {
  return withFeatureMiddleware(
    "ai-image-generation",
    context,
    "user",
    async (ctx, requestContext) => {
      try {
        const body = await ctx.request.json();
        const {
          prompt,
          model = "@cf/stabilityai/stable-diffusion-xl-base-1.0",
          num_steps = 20,
          guidance = 7.5,
          strength = 1
        } = body;
        if (!prompt || typeof prompt !== "string") {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Valid prompt is required"
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
        if (prompt.length > 500) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Prompt too long (max 500 characters)"
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
        const bannedWords = ["nude", "blood", "gore"];
        const lower = prompt.toLowerCase();
        if (bannedWords.some((w) => lower.includes(w))) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Unsafe content detected"
            }),
            { status: 403, headers: { "Content-Type": "application/json" } }
          );
        }
        const env = ctx.locals.runtime?.env;
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
        } catch (e) {
          console.warn("AI moderation check failed (non-blocking):", e);
        }
        let translatedPrompt = prompt;
        try {
          const translateKey = `translate:${prompt}`;
          const cachedTranslation = await env.CACHE.get(translateKey);
          if (cachedTranslation) {
            translatedPrompt = cachedTranslation;
          } else if (env.AI) {
            const tr = await env.AI.run("@cf/meta/m2m100-1.2b", {
              text: prompt,
              source_lang: "pl",
              target_lang: "en"
            });
            const maybe = tr?.translated_text;
            if (maybe && typeof maybe === "string") {
              translatedPrompt = maybe;
              await env.CACHE.put(translateKey, translatedPrompt, { expirationTtl: 86400 });
            }
          }
        } catch (e) {
          console.warn("Translation failed, using original prompt");
        }
        const params = {
          num_steps: Math.min(Math.max(num_steps, 1), 50),
          guidance: Math.min(Math.max(guidance, 1), 20),
          strength: Math.min(Math.max(strength, 0), 1)
        };
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
        } catch (e) {
          console.warn("Prompt map lookup failed:", e);
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
        const inputs = {
          prompt: translatedPrompt,
          ...params
        };
        const response = await env.AI.run(model, inputs);
        const imageBuffer = response;
        const imageSize = imageBuffer.byteLength;
        const metadata = {
          id: imageHash,
          prompt: translatedPrompt,
          model,
          params,
          createdAt: Date.now(),
          size: imageSize,
          r2Key
        };
        try {
          await env.MEDIA_BUCKET.put(r2Key, imageBuffer, {
            httpMetadata: {
              contentType: "image/png"
            },
            customMetadata: {
              prompt_translated: translatedPrompt.slice(0, 200),
              // Truncate for metadata limits
              model,
              createdAt: Date.now().toString()
            }
          });
        } catch (error) {
          console.warn("R2 storage failed, returning direct image:", error);
          return new Response(imageBuffer, {
            headers: {
              "Content-Type": "image/png",
              "X-Cache": "MISS-NO-R2",
              "X-Image-ID": imageHash,
              "X-Translated": translatedPrompt !== prompt ? "pl->en" : "no",
              "Cache-Control": "public, max-age=1800"
            }
          });
        }
        await env.CACHE.put(`img-meta:${imageHash}`, JSON.stringify(metadata), {
          expirationTtl: 86400 * 30
          // 30 days
        });
        await env.CACHE.put(kvCacheKey, imageBuffer, {
          expirationTtl: 3600
        });
        try {
          const promptMapKey = `img-map:${model}:${translatedPrompt}`;
          await env.CACHE.put(promptMapKey, JSON.stringify({ imageId: imageHash }), {
            expirationTtl: 86400 * 7
          });
        } catch (e) {
          console.warn("Prompt map write failed:", e);
        }
        const recentKey = "recent-images";
        const recent = await env.CACHE.get(recentKey, "json") || [];
        recent.unshift(imageHash);
        if (recent.length > 50) recent.length = 50;
        await env.CACHE.put(recentKey, JSON.stringify(recent), {
          expirationTtl: 86400 * 7
          // 7 days
        });
        return new Response(imageBuffer, {
          headers: {
            "Content-Type": "image/png",
            "X-Cache": "MISS",
            "X-Image-ID": imageHash,
            "X-Translated": translatedPrompt !== prompt ? "pl->en" : "no",
            "X-Created-At": metadata.createdAt.toString(),
            "X-Feature-ID": "ai-image-generation",
            "Cache-Control": "public, max-age=3600"
          }
        });
      } catch (error) {
        console.error("Image Generation Error:", error);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Failed to generate image",
            details: error instanceof Error ? error.message : "Unknown error"
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
    }
  );
};
const GET = async (context) => {
  return withFeatureMiddleware(
    "ai-image-generation",
    context,
    "public",
    async () => {
      return new Response(
        JSON.stringify({
          success: true,
          info: {
            service: "AI Image Generation API",
            models: [
              "@cf/stabilityai/stable-diffusion-xl-base-1.0",
              "@cf/bytedance/stable-diffusion-xl-lightning",
              "@cf/lykon/dreamshaper-8-lcm"
            ],
            features: [
              "Cloudflare Workers AI",
              "Stable Diffusion XL",
              "Automatic PL->EN translation",
              "R2 storage + KV cache",
              "Image deduplication",
              "Content moderation"
            ],
            limits: {
              rate: "5 requests per 5 minutes",
              promptLength: 500,
              numSteps: "1-50",
              guidance: "1-20"
            }
          }
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
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
