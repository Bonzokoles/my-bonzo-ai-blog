globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, clientAddress, locals }) => {
  try {
    const body = await request.json();
    const { url, utm_source, utm_medium, utm_campaign, utm_term, utm_content } = body;
    if (!url) {
      return new Response(JSON.stringify({
        success: false,
        error: "URL is required"
      }), { status: 400 });
    }
    const env = locals.runtime?.env;
    if (!env?.DB) {
      return new Response(JSON.stringify({
        success: false,
        error: "Database not available"
      }), { status: 500 });
    }
    const analyticsEvent = {
      event_type: "utm_click",
      data: {
        url,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_term,
        utm_content,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      },
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      ip_address: clientAddress || "unknown",
      user_agent: request.headers.get("user-agent") || "unknown"
    };
    try {
      await env.DB.prepare(`
                INSERT OR IGNORE INTO analytics_events 
                (event_type, url, utm_source, utm_medium, utm_campaign, utm_term, utm_content, ip_address, user_agent, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
        analyticsEvent.event_type,
        url,
        utm_source || null,
        utm_medium || null,
        utm_campaign || null,
        utm_term || null,
        utm_content || null,
        analyticsEvent.ip_address,
        analyticsEvent.user_agent,
        analyticsEvent.created_at
      ).run();
      console.log("[UTM Analytics] Event stored in D1:", {
        url,
        utm_source,
        utm_medium,
        utm_campaign,
        ip: clientAddress
      });
    } catch (dbError) {
      console.warn("[UTM Analytics] D1 storage failed:", dbError);
    }
    if (env.ANALYTICS_KV) {
      const eventId = `utm_click_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      try {
        await env.ANALYTICS_KV.put(eventId, JSON.stringify(analyticsEvent), {
          expirationTtl: 86400 * 30
          // 30 days
        });
      } catch (kvError) {
        console.warn("[UTM Analytics] KV storage failed:", kvError);
      }
    }
    return new Response(JSON.stringify({
      success: true,
      message: "UTM click tracked successfully",
      data: {
        event_type: "utm_click",
        url,
        utm_source,
        utm_medium,
        utm_campaign,
        tracked_at: analyticsEvent.created_at
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("[UTM Analytics] Error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }), { status: 500 });
  }
};
const GET = async ({ url, locals }) => {
  try {
    const env = locals.runtime?.env;
    if (!env?.DB) {
      return new Response(JSON.stringify({
        success: false,
        error: "Database not available"
      }), { status: 500 });
    }
    const urlParams = new URL(url).searchParams;
    const days = parseInt(urlParams.get("days") || "7");
    const source = urlParams.get("utm_source");
    const medium = urlParams.get("utm_medium");
    try {
      let query = `
                SELECT 
                    utm_source, utm_medium, utm_campaign,
                    COUNT(*) as clicks,
                    COUNT(DISTINCT ip_address) as unique_visitors,
                    DATE(created_at) as date
                FROM analytics_events 
                WHERE event_type = 'utm_click'
                AND datetime(created_at) >= datetime('now', '-${days} days')
            `;
      const bindings = [];
      if (source) {
        query += ` AND utm_source = ?`;
        bindings.push(source);
      }
      if (medium) {
        query += ` AND utm_medium = ?`;
        bindings.push(medium);
      }
      query += ` GROUP BY utm_source, utm_medium, utm_campaign, date ORDER BY clicks DESC`;
      const { results } = await env.DB.prepare(query).bind(...bindings).all();
      return new Response(JSON.stringify({
        success: true,
        data: {
          stats: results,
          period_days: days,
          total_entries: results.length,
          filters: { utm_source: source, utm_medium: medium }
        }
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (dbError) {
      console.warn("[UTM Analytics] Database query failed:", dbError);
      return new Response(JSON.stringify({
        success: false,
        error: "Analytics table not found - run database migration first",
        hint: "Create analytics_events table in D1 database"
      }), { status: 404 });
    }
  } catch (error) {
    console.error("[UTM Analytics] Stats error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }), { status: 500 });
  }
};
const OPTIONS = async () => {
  return new Response(JSON.stringify({
    service: "UTM Analytics Tracking",
    endpoints: {
      "POST /": "Track UTM click event",
      "GET /": "Get analytics stats",
      "GET /?days=30": "Stats for last 30 days",
      "GET /?utm_source=mybonzo": "Filter by UTM source",
      "GET /?utm_medium=whitecat": "Filter by UTM medium"
    },
    status: "ok",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    OPTIONS,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
