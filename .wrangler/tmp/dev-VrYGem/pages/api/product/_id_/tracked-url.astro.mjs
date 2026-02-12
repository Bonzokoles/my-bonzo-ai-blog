globalThis.process ??= {}; globalThis.process.env ??= {};
import { S as SitemapSync } from '../../../../chunks/sitemap-sync_DD1fc-5F.mjs';
export { renderers } from '../../../../renderers.mjs';

const GET = async (context) => {
  const { id } = context.params;
  const url = new URL(context.request.url);
  const campaign = url.searchParams.get("campaign") || "direct";
  const runtime = context.locals?.runtime;
  const env = runtime?.env;
  if (!id) {
    return new Response(JSON.stringify({
      success: false,
      error: "Product ID required"
    }), { status: 400 });
  }
  if (!env) {
    return new Response(JSON.stringify({
      success: false,
      error: "Missing runtime environment"
    }), { status: 500 });
  }
  try {
    const sync = new SitemapSync(env);
    const trackedUrl = await sync.generateTrackedUrl(id, campaign);
    return new Response(JSON.stringify({
      success: true,
      data: { product_id: id, tracked_url: trackedUrl }
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
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
