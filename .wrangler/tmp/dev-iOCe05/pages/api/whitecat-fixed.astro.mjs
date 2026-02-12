globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getProductManager } from '../../chunks/product-manager-d1_C97ggFJZ.mjs';
import { withFeatureMiddleware } from '../../chunks/api-middleware_MytvPj0_.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async (context) => {
  return withFeatureMiddleware(
    "whitecat-guides",
    context,
    "public",
    async (ctx, requestContext) => {
      const url = new URL(ctx.request.url);
      const action = url.searchParams.get("action") || "stats";
      const category = url.searchParams.get("category");
      const runtime = ctx.locals?.runtime;
      const env = runtime?.env;
      if (!env || !env.DB) {
        return new Response(JSON.stringify({
          success: false,
          error: "Database not available"
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
      try {
        switch (action) {
          case "stats": {
            const productManager = getProductManager(env);
            await productManager.initialize();
            const productStats = await productManager.getStats();
            return new Response(JSON.stringify({
              success: true,
              data: {
                products: productStats,
                system: "WHITECAT Integration",
                version: "1.0.0"
              }
            }), {
              status: 200,
              headers: { "Content-Type": "application/json" }
            });
          }
          case "categories": {
            const productManager = getProductManager(env);
            await productManager.initialize();
            const categories = await productManager.getCategories();
            return new Response(JSON.stringify({
              success: true,
              data: categories
            }), {
              status: 200,
              headers: { "Content-Type": "application/json" }
            });
          }
          case "products": {
            const productManager = getProductManager(env);
            await productManager.initialize();
            const limit = parseInt(url.searchParams.get("limit") || "20");
            let products;
            if (category) {
              products = await productManager.getProductsByCategory(category, limit);
            } else {
              products = await productManager.getAllProducts(limit);
            }
            return new Response(JSON.stringify({
              success: true,
              data: products,
              count: products.length
            }), {
              status: 200,
              headers: { "Content-Type": "application/json" }
            });
          }
          default:
            return new Response(JSON.stringify({
              success: false,
              error: "Unknown action. Available: stats, categories, products"
            }), {
              status: 400,
              headers: { "Content-Type": "application/json" }
            });
        }
      } catch (error) {
        console.error("❌ WHITECAT API error:", error);
        return new Response(JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : "Internal server error"
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
