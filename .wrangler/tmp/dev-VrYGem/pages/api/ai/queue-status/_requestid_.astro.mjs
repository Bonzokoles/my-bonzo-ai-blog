globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const GET = async ({ params, locals }) => {
  try {
    const { requestId } = params;
    if (!requestId || typeof requestId !== "string") {
      return new Response(
        JSON.stringify({ error: "Request ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const env = locals.runtime?.env;
    const result = await env.CACHE.get(`queue-result:${requestId}`, "json");
    if (!result) {
      return new Response(
        JSON.stringify({
          status: "pending",
          message: "Request is still processing or not found"
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    if (result.status === "completed") {
      return new Response(
        JSON.stringify({
          status: "completed",
          imageId: result.imageId,
          cached: result.cached || false,
          completedAt: result.timestamp,
          imageUrl: `/api/ai/image/${result.imageId}`
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    if (result.status === "error") {
      return new Response(
        JSON.stringify({
          status: "error",
          error: result.error,
          timestamp: result.timestamp
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({
        status: result.status || "unknown",
        timestamp: result.timestamp
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Queue Status Check Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to check queue status",
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
