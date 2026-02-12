globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const GET = async (context) => {
  try {
    const runtime = context.locals?.runtime;
    const env = runtime?.env;
    if (!env || !env.DB) {
      return Response.json({
        success: false,
        error: "Database not available",
        debug: {
          hasRuntime: !!runtime,
          hasEnv: !!env,
          hasDB: !!env?.DB
        }
      }, { status: 500 });
    }
    const result = await env.DB.prepare("SELECT COUNT(*) as count FROM products").first();
    return Response.json({
      success: true,
      products: result?.count || 0,
      message: "WHITECAT Simple API working"
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
