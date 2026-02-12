globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const GET = async (context) => {
  const runtime = context.locals?.runtime;
  const env = runtime?.env;
  try {
    if (!env?.PUMO_DB) {
      return new Response(JSON.stringify({
        error: "PUMO_DB not available",
        available_bindings: env ? Object.keys(env) : []
      }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
    const count = await env.PUMO_DB.prepare("SELECT COUNT(*) as total FROM products").first();
    const products = await env.PUMO_DB.prepare("SELECT id, name, price FROM products LIMIT 5").all();
    return new Response(JSON.stringify({
      success: true,
      data: {
        total_products: count,
        sample_products: products.results
      }
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : void 0
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
