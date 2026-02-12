globalThis.process ??= {}; globalThis.process.env ??= {};
import { w as withSimpleMiddleware } from '../../chunks/simple-middleware_r0Pc6JYM.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async (context) => {
  return withSimpleMiddleware(
    "health-check",
    context,
    "public",
    async (ctx, requestContext) => {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Simple middleware working perfectly!",
          middleware: "simple",
          feature: "health-check",
          clientAddress: requestContext.clientAddress,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          environment: "cloudflare"
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
