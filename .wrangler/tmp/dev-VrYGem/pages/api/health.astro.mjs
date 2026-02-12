globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async ({ request }) => {
  try {
    return new Response(JSON.stringify({
      status: "ok",
      service: "MyBonzo API",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      version: "1.0.0",
      endpoints: [
        "/api/health",
        "/api/containers/test",
        "/api/containers/manage"
      ]
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      status: "error",
      error: error.message || "Health check failed"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
