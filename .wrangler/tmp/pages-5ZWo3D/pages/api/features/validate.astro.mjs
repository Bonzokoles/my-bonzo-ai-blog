globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async () => {
  return new Response(
    JSON.stringify({
      success: true,
      valid: true,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      message: "Feature Control Validation - Simplified for Cloudflare Workers"
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
