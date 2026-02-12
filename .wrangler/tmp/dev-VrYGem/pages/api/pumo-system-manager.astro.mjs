globalThis.process ??= {}; globalThis.process.env ??= {};
import { w as withSimpleMiddleware } from '../../chunks/simple-middleware_r0Pc6JYM.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async (context) => {
  return withSimpleMiddleware(
    "whitecat-products",
    context,
    "public",
    async (ctx) => {
      const runtime = ctx.locals?.runtime;
      const env = runtime?.env;
      try {
        const status = {
          databases_connected: !!(env?.DB && env?.PUMO_DB),
          last_sync: null,
          product_counts: {
            pumo_db: 0,
            rag_db: 0,
            sync_needed: false
          },
          available_actions: [
            "sync-availability",
            "test-connection",
            "update-products",
            "check-changes"
          ]
        };
        if (env?.DB && env?.PUMO_DB) {
          const [pumoCount, ragCount] = await Promise.all([
            env.PUMO_DB.prepare("SELECT COUNT(*) as count FROM products WHERE deleted_at IS NULL").first(),
            env.DB.prepare("SELECT COUNT(*) as count FROM products WHERE deleted_at IS NULL").first()
          ]);
          status.product_counts.pumo_db = pumoCount.count;
          status.product_counts.rag_db = ragCount.count;
          status.product_counts.sync_needed = pumoCount.count !== ragCount.count;
        }
        return new Response(JSON.stringify({
          success: true,
          system: "MyBonzo × Meble Pumo Integration",
          status,
          endpoints: {
            manager: "GET/POST /api/pumo-system-manager",
            availability_sync: "GET/POST /api/pumo-availability-sync",
            rag_chat: "GET/POST /api/rag-chat",
            utm_tracking: "GET/POST /api/utm-tracking",
            product_availability: "GET/POST /api/check-product-availability"
          },
          connections: {
            databases: {
              main_rag: { connected: !!env?.DB, products: status.product_counts.rag_db },
              pumo_products: { connected: !!env?.PUMO_DB, products: status.product_counts.pumo_db }
            },
            external_apis: {
              meble_pumo_scraping: { status: "available" },
              utm_tracking: { status: "active" }
            }
          },
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } catch (error) {
        return new Response(JSON.stringify({
          success: false,
          error: error.message
        }), { status: 500, headers: { "Content-Type": "application/json" } });
      }
    }
  );
};
const POST = async (context) => {
  return withSimpleMiddleware(
    "whitecat-products",
    context,
    "admin",
    async (ctx) => {
      const { action } = await ctx.request.json();
      switch (action) {
        case "sync-availability":
          const syncResponse = await fetch(`${ctx.url.origin}/api/pumo-availability-sync`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
          });
          const syncResult = await syncResponse.json();
          return new Response(JSON.stringify({
            success: true,
            action: "sync-availability",
            result: syncResult
          }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        case "test-connection":
          const runtime = ctx.locals?.runtime;
          const env = runtime?.env;
          const tests = {
            main_db: !!env?.DB,
            pumo_db: !!env?.PUMO_DB,
            vectorize: !!env?.VECTORIZE_INDEX,
            ai_model: !!env?.AI
          };
          return new Response(JSON.stringify({
            success: true,
            action: "test-connection",
            tests,
            all_connected: Object.values(tests).every((t) => t)
          }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        default:
          return new Response(JSON.stringify({
            success: false,
            error: "Unknown action",
            available_actions: [
              "sync-availability",
              "test-connection"
            ]
          }), { status: 400, headers: { "Content-Type": "application/json" } });
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
