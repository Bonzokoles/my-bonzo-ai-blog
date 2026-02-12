globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getGuideGenerator } from '../../chunks/guide-generator_B8ZqTjA1.mjs';
import { g as getProductManager } from '../../chunks/product-manager-d1_C97ggFJZ.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async (context) => {
  const url = new URL(context.request.url);
  const test = url.searchParams.get("test") || "basic";
  const runtime = context.locals?.runtime;
  const env = runtime?.env;
  try {
    console.log("🔍 Debug WHITECAT API - env check:", !!env);
    console.log("🔍 Debug WHITECAT API - DB check:", !!env?.DB);
    if (!env || !env.DB) {
      return new Response(JSON.stringify({
        error: "Missing environment or DB binding",
        env_available: !!env,
        db_available: !!env?.DB
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const productManager = getProductManager(env);
    console.log("🔍 Debug WHITECAT API - productManager:", !!productManager);
    if (test === "guide") {
      const guideGenerator = getGuideGenerator(env);
      console.log("🔍 Debug WHITECAT API - guideGenerator:", !!guideGenerator);
      const guideStats = await guideGenerator.getStats();
      return new Response(JSON.stringify({
        success: true,
        test: "guide-generator",
        data: {
          guide_stats: guideStats,
          env_available: !!env,
          db_available: !!env?.DB
        }
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (test === "stats") {
      const productStats = await productManager.getStats();
      return new Response(JSON.stringify({
        success: true,
        test: "product-stats",
        data: {
          product_stats: productStats,
          env_available: !!env,
          db_available: !!env?.DB
        }
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const result = await env.DB.prepare("SELECT COUNT(*) as count FROM products").first();
    return new Response(JSON.stringify({
      success: true,
      debug: {
        env_available: !!env,
        db_available: !!env.DB,
        product_manager: !!productManager,
        db_test: result
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("❌ Debug WHITECAT API error:", error);
    return new Response(JSON.stringify({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
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
