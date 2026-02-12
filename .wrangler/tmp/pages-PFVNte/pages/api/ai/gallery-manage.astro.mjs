globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request, locals }) => {
  try {
    const { env } = locals.runtime;
    const body = await request.json();
    const { action, imageId } = body;
    if (action === "clear-all") {
      await env.CACHE.delete("recent-images");
      return new Response(
        JSON.stringify({
          success: true,
          message: "Gallery cleared successfully"
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    if (action === "delete-image" && imageId) {
      const recent = await env.CACHE.get("recent-images", "json") || [];
      const filtered = recent.filter((id) => id !== imageId);
      await env.CACHE.put("recent-images", JSON.stringify(filtered), {
        expirationTtl: 86400 * 7
      });
      await env.CACHE.delete(`img-cache:${imageId}`);
      await env.CACHE.delete(`img-meta:${imageId}`);
      return new Response(
        JSON.stringify({
          success: true,
          message: "Image removed from gallery"
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Gallery management error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to manage gallery",
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
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
