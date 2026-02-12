globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../../renderers.mjs';

const POST = async (context) => {
  const runtime = context.locals?.runtime;
  const env = runtime?.env;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (!env) {
    return new Response(JSON.stringify({
      success: false,
      error: "Missing runtime environment"
    }), { status: 500, headers: corsHeaders });
  }
  try {
    const data = await context.request.json();
    const { event, category, product_id, utm_campaign } = data;
    if (!event) {
      return new Response(JSON.stringify({ error: "Event type required" }), { status: 400, headers: corsHeaders });
    }
    await env.DB.prepare(`
          INSERT INTO analytics_events (event_type, category, product_id, utm_campaign)
          VALUES (?, ?, ?, ?)
        `).bind(event, category || null, product_id || null, utm_campaign || null).run();
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("Analytics error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), { status: 500, headers: corsHeaders });
  }
};
const OPTIONS = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    OPTIONS,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
