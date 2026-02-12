globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const GET = async (context) => {
  try {
    console.log("[DEBUG] Testing actual withFeatureMiddleware");
    const { withFeatureMiddleware } = await import('../../chunks/api-middleware_MytvPj0_.mjs');
    return withFeatureMiddleware(
      "health-check",
      context,
      "public",
      async (ctx, requestContext) => {
        return new Response(
          JSON.stringify({
            success: true,
            message: "WithFeatureMiddleware is working!",
            environment: requestContext.environment,
            clientAddress: requestContext.clientAddress,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }
    );
  } catch (error) {
    console.error("[DEBUG] Error in withFeatureMiddleware test:", error);
    return new Response(
      JSON.stringify({
        error: "WithFeatureMiddleware test failed",
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
