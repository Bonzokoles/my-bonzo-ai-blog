globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const GET = async (context) => {
  try {
    console.log("[DEBUG] Testing simple middleware usage");
    let response = {
      success: true,
      step: "start",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    try {
      const { createRequestContext } = await import('../../chunks/api-middleware_MytvPj0_.mjs');
      response.step = "middleware_imported";
      const requestContext = createRequestContext(context);
      response.step = "context_created";
      response.requestContext = requestContext;
    } catch (error) {
      response.step = "middleware_failed";
      response.error = error instanceof Error ? error.message : "Unknown error";
    }
    return new Response(
      JSON.stringify(response, null, 2),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  } catch (error) {
    console.error("[DEBUG] Error in simple middleware test:", error);
    return new Response(
      JSON.stringify({
        error: "Simple middleware test failed",
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
