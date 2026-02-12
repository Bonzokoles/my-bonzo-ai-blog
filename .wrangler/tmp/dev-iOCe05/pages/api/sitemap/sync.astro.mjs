globalThis.process ??= {}; globalThis.process.env ??= {};
import { S as SitemapSync } from '../../../chunks/sitemap-sync_DD1fc-5F.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async (context) => {
  const runtime = context.locals?.runtime;
  const env = runtime?.env;
  if (!env) {
    return new Response(JSON.stringify({
      success: false,
      error: "Missing runtime environment"
    }), { status: 500 });
  }
  try {
    const sync = new SitemapSync(env);
    const result = await sync.syncProductUrls();
    return new Response(JSON.stringify({
      success: true,
      data: result,
      message: "Product URLs synced from sitemap"
    }));
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
