globalThis.process ??= {}; globalThis.process.env ??= {};
import { w as withSimpleMiddleware } from '../../chunks/simple-middleware_r0Pc6JYM.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async (context) => {
  return withSimpleMiddleware(
    "whitecat-products",
    context,
    "public",
    async (ctx, requestContext) => {
      const runtime = ctx.locals?.runtime;
      const env = runtime?.env;
      const checks = {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        clientAddress: requestContext.clientAddress,
        environment: "cloudflare",
        middleware: "simple",
        databases: {
          jimbo_rag_db: "unknown",
          pumo_db: "unknown"
        },
        systems: {
          cloudflare_ai: env?.AI ? "available" : "unavailable",
          kv_storage: env?.SESSION ? "available" : "unavailable",
          r2_storage: env?.MEDIA_BUCKET ? "available" : "unavailable"
        }
      };
      if (env?.jimbo_rag_db) {
        try {
          const result = await env.jimbo_rag_db.prepare("SELECT COUNT(*) as count FROM products").first();
          checks.databases.jimbo_rag_db = `OK (${result?.count || 0} products)`;
        } catch (error) {
          checks.databases.jimbo_rag_db = `ERROR: ${error instanceof Error ? error.message : "Unknown error"}`;
        }
      }
      if (env?.PUMO_DB) {
        try {
          const result = await env.PUMO_DB.prepare("SELECT COUNT(*) as count FROM products").first();
          checks.databases.pumo_db = `OK (${result?.count || 0} products)`;
        } catch (error) {
          checks.databases.pumo_db = `ERROR: ${error instanceof Error ? error.message : "Unknown error"}`;
        }
      }
      return new Response(
        JSON.stringify({
          success: true,
          message: "PUMO System Manager - Working with Simple Middleware!",
          checks
        }, null, 2),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
