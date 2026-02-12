globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const GET = async ({ params, url, locals }) => {
  try {
    const { env } = locals.runtime;
    const imageId = params.imageId;
    const searchParams = new URL(url).searchParams;
    const size = searchParams.get("size");
    if (!imageId) {
      return new Response(
        JSON.stringify({ error: "Image ID required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const kvCacheKey = `img-cache:${imageId}`;
    const cachedImage = await env.CACHE.get(kvCacheKey, "arrayBuffer");
    if (cachedImage) {
      return new Response(cachedImage, {
        headers: {
          "Content-Type": "image/png",
          "X-Cache": "KV-HIT",
          "Cache-Control": "public, max-age=86400"
        }
      });
    }
    const r2Key = `images/${imageId}.png`;
    const r2Object = await env.MEDIA_BUCKET.get(r2Key);
    if (!r2Object) {
      return new Response(
        JSON.stringify({ error: "Image not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    const imageBuffer = await r2Object.arrayBuffer();
    env.CACHE.put(kvCacheKey, imageBuffer, {
      expirationTtl: 3600
      // 1 hour
    }).catch((error) => {
      console.warn("KV cache failed:", error);
    });
    return new Response(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "X-Cache": "R2-HIT",
        "Cache-Control": "public, max-age=86400",
        // 24 hours
        "Last-Modified": r2Object.httpMetadata?.lastModified || (/* @__PURE__ */ new Date()).toUTCString()
      }
    });
  } catch (error) {
    console.error("Image fetch error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch image",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
