globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ url, locals }) => {
  try {
    const { env } = locals.runtime;
    const searchParams = new URL(url).searchParams;
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const offset = Math.max(parseInt(searchParams.get("offset") || "0"), 0);
    const recentImages = await env.CACHE.get("recent-images", "json") || [];
    const pageImages = recentImages.slice(offset, offset + limit);
    const gallery = await Promise.all(
      pageImages.map(async (imageId) => {
        const metadata = await env.CACHE.get(`img-meta:${imageId}`, "json");
        if (!metadata) return null;
        return {
          id: imageId,
          prompt: metadata.prompt,
          model: metadata.model,
          createdAt: metadata.createdAt,
          size: metadata.size,
          url: `/api/ai/image/${imageId}`,
          // URL to get the actual image
          thumbnail: `/api/ai/image/${imageId}?size=thumb`
        };
      })
    );
    const validGallery = gallery.filter((item) => item !== null);
    return new Response(
      JSON.stringify({
        images: validGallery,
        total: recentImages.length,
        hasMore: offset + limit < recentImages.length,
        pagination: {
          limit,
          offset,
          nextOffset: offset + limit < recentImages.length ? offset + limit : null
        }
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=300"
          // 5 minutes
        }
      }
    );
  } catch (error) {
    console.error("Gallery fetch error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch image gallery",
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
