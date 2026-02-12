globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getGuideGenerator } from '../../chunks/guide-generator_B8ZqTjA1.mjs';
import { g as getProductManager } from '../../chunks/product-manager-d1_C97ggFJZ.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async (context) => {
  const runtime = context.locals?.runtime;
  const env = runtime?.env;
  try {
    console.log("🎯 Simple WHITECAT Test - start");
    if (!env || !env.DB) {
      return new Response(JSON.stringify({
        error: "Missing env or DB binding"
      }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
    const productManager = getProductManager(env);
    const guideGenerator = getGuideGenerator(env);
    console.log("🎯 Managers created, testing stats...");
    const productStats = await productManager.getStats();
    console.log("🎯 Product stats OK:", productStats);
    const guideStats = await guideGenerator.getStats();
    console.log("🎯 Guide stats OK:", guideStats);
    return new Response(JSON.stringify({
      success: true,
      data: {
        products: productStats,
        guides: guideStats
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("❌ Simple WHITECAT Test error:", error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error",
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
