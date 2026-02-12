globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getProductManager } from '../../chunks/product-manager-d1_C97ggFJZ.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async (context) => {
  console.log("🔧 DEBUG: WHITECAT Debug endpoint started");
  try {
    const runtime = context.locals?.runtime;
    const env = runtime?.env;
    console.log("🔧 DEBUG: Env available:", !!env);
    console.log("🔧 DEBUG: DB available:", !!env?.DB);
    const productManager = getProductManager(env);
    console.log("🔧 DEBUG: ProductManager created");
    const stats = await productManager.getStats();
    console.log("🔧 DEBUG: Stats retrieved:", stats);
    return new Response(JSON.stringify({
      success: true,
      debug: "WHITECAT Debug endpoint working",
      stats,
      env_check: {
        has_runtime: !!runtime,
        has_env: !!env,
        has_db: !!env?.DB
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("❌ DEBUG ERROR:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Debug endpoint failed",
      details: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : void 0
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
