globalThis.process ??= {}; globalThis.process.env ??= {};
import { withFeatureMiddleware } from '../../chunks/api-middleware_MytvPj0_.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async (context) => {
  return withFeatureMiddleware(
    "health-check",
    context,
    "public",
    async (ctx, requestContext) => {
      return new Response(
        JSON.stringify({
          success: true,
          message: "PUMO system test with middleware working!",
          environment: requestContext.environment,
          clientAddress: requestContext.clientAddress,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          systems: {
            middleware: "OK",
            featureFlags: "OK",
            healthCheck: "OK"
          }
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
};
const POST = async (context) => {
  return withFeatureMiddleware(
    "whitecat-products",
    context,
    "public",
    async (ctx, requestContext) => {
      try {
        const body = await ctx.request.json();
        return new Response(
          JSON.stringify({
            success: true,
            message: "PUMO API test successful",
            environment: requestContext.environment,
            receivedData: body,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            systems: {
              middleware: "OK",
              whitecat: "OK",
              apiEndpoint: "OK"
            }
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Request processing failed",
            message: error instanceof Error ? error.message : "Unknown error"
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
    }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
