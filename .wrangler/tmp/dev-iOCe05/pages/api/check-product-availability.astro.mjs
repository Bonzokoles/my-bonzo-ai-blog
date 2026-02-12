globalThis.process ??= {}; globalThis.process.env ??= {};
import { withFeatureMiddleware } from '../../chunks/api-middleware_MytvPj0_.mjs';
export { renderers } from '../../renderers.mjs';

async function checkProductAvailabilityByScraping(productId, baseUrl = "https://www.meblepumo.pl") {
  try {
    const productUrl = `${baseUrl}/pl/products/${productId}`;
    console.log(`🔍 Checking availability: ${productUrl}`);
    const response = await fetch(productUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 MyBonzo-Availability-Checker/1.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "pl-PL,pl;q=0.8,en;q=0.6",
        "Cache-Control": "no-cache"
      },
      // Timeout after 10 seconds
      signal: AbortSignal.timeout(1e4)
    });
    if (!response.ok) {
      return {
        id: productId,
        available: false,
        stock_status: "unknown",
        last_checked: (/* @__PURE__ */ new Date()).toISOString(),
        error: `HTTP ${response.status}`
      };
    }
    const html = await response.text();
    let stock_status = "unknown";
    let available = false;
    if (html.includes("Produkt w magazynie w bardzo dużej ilości") || html.includes("graph_1_4.png")) {
      stock_status = "in_stock";
      available = true;
    } else if (html.includes("Produkt w magazynie w małej ilości") || html.includes("graph_1_2.png")) {
      stock_status = "low_stock";
      available = true;
    } else if (html.includes("Produkt w magazynie w bardzo małej ilości") || html.includes("graph_1_1.png")) {
      stock_status = "low_stock";
      available = true;
    } else if (html.includes("Produkt wyprzedany") || html.includes("Produkt niedostępny")) {
      stock_status = "out_of_stock";
      available = false;
    }
    console.log(`✅ Product ${productId}: ${stock_status} (available: ${available})`);
    return {
      id: productId,
      available,
      stock_status,
      last_checked: (/* @__PURE__ */ new Date()).toISOString()
    };
  } catch (error) {
    console.error(`❌ Error checking product ${productId}:`, error.message);
    return {
      id: productId,
      available: false,
      stock_status: "unknown",
      last_checked: (/* @__PURE__ */ new Date()).toISOString(),
      error: error.message
    };
  }
}
async function checkMultipleProducts(productIds) {
  const promises = productIds.map((id) => checkProductAvailabilityByScraping(id));
  return await Promise.all(promises);
}
const POST = async (context) => {
  return withFeatureMiddleware(
    "whitecat-products",
    context,
    "public",
    async (ctx, requestContext) => {
      try {
        const body = await ctx.request.json();
        const { product_ids } = body;
        if (!product_ids || !Array.isArray(product_ids) || product_ids.length === 0) {
          return new Response(JSON.stringify({
            success: false,
            error: "Missing or invalid product_ids array"
          }), { status: 400, headers: { "Content-Type": "application/json" } });
        }
        if (product_ids.length > 10) {
          return new Response(JSON.stringify({
            success: false,
            error: "Maximum 10 products per request"
          }), { status: 400, headers: { "Content-Type": "application/json" } });
        }
        console.log(`🔍 Checking availability for ${product_ids.length} products:`, product_ids);
        const results = await checkMultipleProducts(product_ids);
        const response = {
          products: results,
          checked_at: (/* @__PURE__ */ new Date()).toISOString(),
          source: "live_scraping"
        };
        return new Response(JSON.stringify({
          success: true,
          data: response
        }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=300"
            // Cache 5 minutes
          }
        });
      } catch (error) {
        console.error("❌ Availability check error:", error);
        return new Response(JSON.stringify({
          success: false,
          error: "Failed to check product availability",
          details: error.message
        }), { status: 500, headers: { "Content-Type": "application/json" } });
      }
    }
  );
};
const GET = async (context) => {
  return withFeatureMiddleware(
    "whitecat-products",
    context,
    "public",
    async () => {
      return new Response(JSON.stringify({
        status: "ok",
        service: "Product Availability Checker",
        features: {
          live_scraping: true,
          batch_checking: true,
          max_products_per_request: 10
        },
        cache_duration: "5 minutes",
        supported_statuses: [
          "in_stock",
          "low_stock",
          "out_of_stock",
          "discontinued",
          "unknown"
        ],
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
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
