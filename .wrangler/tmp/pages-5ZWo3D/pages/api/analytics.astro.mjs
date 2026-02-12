globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const POST = async (context) => {
  const runtime = context.locals?.runtime;
  const env = runtime?.env;
  if (!env?.PUMO_DB) {
    return new Response(JSON.stringify({
      success: false,
      error: "PUMO database not available"
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
  try {
    const body = await context.request.json();
    const { action, data } = body;
    switch (action) {
      case "track_click":
        await env.PUMO_DB.prepare(`
                    INSERT INTO analytics_events (
                        event_type, product_id, source, 
                        utm_source, utm_medium, utm_campaign, 
                        session_id, timestamp
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `).bind(
          "product_click",
          data.product_id,
          data.source || "mybonzo_blog",
          data.utm_source || "mybonzo",
          data.utm_medium || "ai_guide",
          data.utm_campaign || "whitecat_guide",
          data.session_id,
          (/* @__PURE__ */ new Date()).toISOString()
        ).run();
        break;
      case "track_purchase":
        await env.PUMO_DB.prepare(`
                    INSERT INTO revenue_attribution (
                        order_id, source, utm_source, utm_medium, 
                        utm_campaign, revenue, timestamp
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                `).bind(
          data.order_id,
          data.source || "mybonzo_blog",
          data.utm_source || "mybonzo",
          data.utm_medium || "ai_guide",
          data.utm_campaign || "whitecat_guide",
          data.revenue,
          (/* @__PURE__ */ new Date()).toISOString()
        ).run();
        break;
      case "get_stats":
        const [clickStats, revenueStats] = await Promise.all([
          env.PUMO_DB.prepare(`
                        SELECT 
                            COUNT(*) as total_clicks,
                            COUNT(DISTINCT session_id) as unique_sessions,
                            utm_source, utm_medium, utm_campaign
                        FROM analytics_events 
                        WHERE event_type = 'product_click'
                        GROUP BY utm_source, utm_medium, utm_campaign
                    `).all(),
          env.PUMO_DB.prepare(`
                        SELECT 
                            COUNT(*) as total_orders,
                            SUM(revenue) as total_revenue,
                            AVG(revenue) as avg_order_value,
                            utm_source, utm_medium, utm_campaign
                        FROM revenue_attribution
                        GROUP BY utm_source, utm_medium, utm_campaign
                    `).all()
        ]);
        return new Response(JSON.stringify({
          success: true,
          data: {
            clicks: clickStats.results,
            revenue: revenueStats.results
          }
        }), { status: 200, headers: { "Content-Type": "application/json" } });
      default:
        return new Response(JSON.stringify({
          success: false,
          error: "Unknown action"
        }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({
      success: true,
      message: `${action} tracked successfully`
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("❌ Analytics API error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};
const GET = async (context) => {
  const runtime = context.locals?.runtime;
  const env = runtime?.env;
  const url = new URL(context.request.url);
  const action = url.searchParams.get("action");
  if (!env?.PUMO_DB) {
    return new Response(JSON.stringify({
      success: false,
      error: "PUMO database not available"
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
  try {
    switch (action) {
      case "dashboard":
        const [totalClicks, totalRevenue, topProducts] = await Promise.all([
          env.PUMO_DB.prepare("SELECT COUNT(*) as count FROM analytics_events").first(),
          env.PUMO_DB.prepare("SELECT SUM(revenue) as total FROM revenue_attribution").first(),
          env.PUMO_DB.prepare(`
                        SELECT 
                            product_id,
                            COUNT(*) as clicks,
                            SUM(CASE WHEN event_type = 'product_click' THEN 1 ELSE 0 END) as total_clicks
                        FROM analytics_events
                        WHERE product_id IS NOT NULL
                        GROUP BY product_id
                        ORDER BY clicks DESC
                        LIMIT 10
                    `).all()
        ]);
        return new Response(JSON.stringify({
          success: true,
          data: {
            total_clicks: totalClicks?.count || 0,
            total_revenue: totalRevenue?.total || 0,
            top_products: topProducts.results
          }
        }), { status: 200, headers: { "Content-Type": "application/json" } });
      default:
        return new Response(JSON.stringify({
          success: false,
          error: "Action required: ?action=dashboard"
        }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
  } catch (error) {
    console.error("❌ Analytics GET error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
