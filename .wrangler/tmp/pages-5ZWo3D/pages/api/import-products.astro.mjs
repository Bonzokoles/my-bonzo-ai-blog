globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getProductManager } from '../../chunks/product-manager-d1_C97ggFJZ.mjs';
import { withFeatureMiddleware } from '../../chunks/api-middleware_MytvPj0_.mjs';
export { renderers } from '../../renderers.mjs';

const POST = async (context) => {
  return withFeatureMiddleware(
    "whitecat-products",
    context,
    "admin",
    // Tylko admin może importować
    async (ctx, requestContext) => {
      const runtime = ctx.locals?.runtime;
      const env = runtime?.env;
      if (!env?.DB) {
        return new Response(JSON.stringify({
          success: false,
          error: "D1 Database not configured"
        }), { status: 500 });
      }
      try {
        const body = await ctx.request.json();
        const { action, data, source } = body;
        const productManager = getProductManager(env);
        switch (action) {
          case "import-json": {
            if (!data) {
              return new Response(JSON.stringify({
                success: false,
                error: "Missing data field"
              }), { status: 400 });
            }
            const importedCount = await productManager.importProductsFromJson(data);
            return new Response(JSON.stringify({
              success: true,
              data: {
                message: "Products imported successfully",
                imported: importedCount,
                source: source || "manual"
              }
            }), {
              status: 200,
              headers: { "Content-Type": "application/json" }
            });
          }
          case "import-from-whitecat": {
            console.log("📥 Fetching products from WHITECAT JSON...");
            const fs = require("fs");
            const path = "U:/JIMBO_UNIFIED_CONTROL_hub/LIBRARIES/CONTROL_CENTER/MEBLEPUMO_INTEL/PUMO_AI_FRENDLY_operacja_WHITECAT/products.json";
            let productsData;
            try {
              const jsonContent = fs.readFileSync(path, "utf8");
              productsData = JSON.parse(jsonContent);
              console.log(`📊 Loaded ${Object.keys(productsData).length} products from WHITECAT`);
            } catch (error) {
              console.error("❌ Failed to read WHITECAT JSON:", error);
              return new Response(JSON.stringify({
                success: false,
                error: "Failed to read WHITECAT products.json file",
                details: error instanceof Error ? error.message : "Unknown error"
              }), { status: 500 });
            }
            const importedCount = await productManager.importProductsFromJson(productsData);
            return new Response(JSON.stringify({
              success: true,
              data: {
                message: "WHITECAT products imported to D1",
                imported: importedCount,
                source: "whitecat-json",
                total: Object.keys(productsData).length
              }
            }), {
              status: 200,
              headers: { "Content-Type": "application/json" }
            });
          }
          case "verify-import": {
            const stats = await productManager.getStats();
            const categories = await productManager.getCategories();
            return new Response(JSON.stringify({
              success: true,
              data: {
                stats,
                categoriesCount: categories.length,
                sampleCategories: categories.slice(0, 10),
                message: "Import verification completed"
              }
            }), {
              status: 200,
              headers: { "Content-Type": "application/json" }
            });
          }
          default:
            return new Response(JSON.stringify({
              success: false,
              error: "Invalid action. Available: import-json, import-from-whitecat, verify-import"
            }), { status: 400 });
        }
      } catch (error) {
        console.error("[IMPORT] Error:", error);
        return new Response(JSON.stringify({
          success: false,
          error: "Import failed",
          details: error instanceof Error ? error.message : "Unknown error"
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
  );
};
const GET = async (context) => {
  return withFeatureMiddleware(
    "whitecat-products",
    context,
    "admin",
    async (ctx, requestContext) => {
      const runtime = ctx.locals?.runtime;
      const env = runtime?.env;
      if (!env?.DB) {
        return new Response(JSON.stringify({
          success: false,
          error: "D1 Database not configured"
        }), { status: 500 });
      }
      try {
        const productManager = getProductManager(env);
        const stats = await productManager.getStats();
        const categories = await productManager.getCategories();
        const sampleProducts = await productManager.searchProducts("", 5);
        return new Response(JSON.stringify({
          success: true,
          data: {
            stats,
            categories: {
              count: categories.length,
              sample: categories.slice(0, 10)
            },
            sampleProducts,
            database: "D1",
            ready: stats.totalProducts > 0
          }
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } catch (error) {
        console.error("[IMPORT GET] Error:", error);
        return new Response(JSON.stringify({
          success: false,
          error: "Failed to get import status",
          details: error instanceof Error ? error.message : "Unknown error"
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
    GET,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
