globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const GET = async (context) => {
  try {
    const runtime = context.locals?.runtime;
    const env = runtime?.env;
    return new Response(JSON.stringify({
      success: true,
      debug: {
        hasRuntime: !!runtime,
        hasEnv: !!env,
        hasPUMO_DB: !!env?.PUMO_DB,
        hasPUMO_API_KEY: !!env?.PUMO_API_KEY,
        environment: typeof process === "undefined" ? "cloudflare" : "node",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
