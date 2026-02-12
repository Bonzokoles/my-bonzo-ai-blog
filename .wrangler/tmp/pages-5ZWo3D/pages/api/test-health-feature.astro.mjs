globalThis.process ??= {}; globalThis.process.env ??= {};
import { withFeatureMiddleware } from '../../chunks/api-middleware_MytvPj0_.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async (context) => {
  return withFeatureMiddleware(
    "health-check",
    context,
    "public",
    async () => {
      return new Response(JSON.stringify({
        success: true,
        message: "Health feature middleware test working",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
