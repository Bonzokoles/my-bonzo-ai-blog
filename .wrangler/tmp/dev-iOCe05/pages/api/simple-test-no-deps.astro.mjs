globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const GET = async ({ locals }) => {
  try {
    const runtime = locals?.runtime;
    const env = runtime?.env;
    console.log("🧪 Simple test bez product-manager - start");
    return new Response(
      JSON.stringify({
        success: true,
        message: "Simple test bez ProductManager - działa!",
        mockStats: {
          totalProducts: 2130,
          categories: 68,
          avgPrice: 1020,
          priceRange: { min: 50, max: 15e3 }
        },
        mockCategories: [
          "Biurka",
          "Krzesła",
          "Szafy",
          "Stoły",
          "Łóżka",
          "Komody",
          "Regały",
          "Fotele",
          "Sofy",
          "Szafki"
        ],
        debug: {
          nodeEnv: process?.env?.NODE_ENV,
          hasDB: !!env?.DB,
          hasAI: !!env?.AI,
          hasVectorize: !!env?.VECTORIZE_INDEX,
          timestamp: Date.now()
        }
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("❌ Simple test error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
