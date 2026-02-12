globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const GET = async (context) => {
  const runtime = context.locals?.runtime;
  const env = runtime?.env;
  try {
    if (!env?.DB) {
      return new Response(JSON.stringify({
        success: false,
        error: "DB binding not found",
        available_bindings: Object.keys(env || {})
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const result = await env.DB.prepare("SELECT COUNT(*) as count FROM products").first();
    return new Response(JSON.stringify({
      success: true,
      data: {
        db_working: true,
        product_count: result?.count || 0,
        bindings: Object.keys(env).filter((key) => key.includes("DB") || key.includes("VECTOR"))
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: "D1 test failed",
      details: error.message,
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
