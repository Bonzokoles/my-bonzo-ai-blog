globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const GET = async (context) => {
  try {
    console.log("[DEBUG] Starting middleware debug endpoint");
    const response = {
      success: true,
      message: "Direct endpoint without middleware",
      context_available: !!context,
      request_available: !!context.request,
      locals_available: !!context.locals,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    console.log("[DEBUG] Response prepared:", response);
    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  } catch (error) {
    console.error("[DEBUG] Error in endpoint:", error);
    return new Response(
      JSON.stringify({
        error: "Debug endpoint failed",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : void 0
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
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
