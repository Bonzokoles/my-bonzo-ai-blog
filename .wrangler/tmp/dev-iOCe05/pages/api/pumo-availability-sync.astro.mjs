globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

async function checkProductAvailability(productId) {
  try {
    const url = `https://www.meblepumo.pl/pl/products/product-${productId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "MyBonzo-Availability-Checker/1.0",
        "Accept": "text/html"
      },
      signal: AbortSignal.timeout(8e3)
    });
    if (!response.ok) return { available: false, stock_status: "unknown" };
    const html = await response.text();
    if (html.includes("Produkt w magazynie w bardzo dużej ilości") || html.includes("graph_1_4.png")) {
      return { available: true, stock_status: "high_stock" };
    } else if (html.includes("Produkt w magazynie w małej ilości") || html.includes("graph_1_2.png")) {
      return { available: true, stock_status: "low_stock" };
    } else if (html.includes("Produkt wyprzedany") || html.includes("Produkt niedostępny")) {
      return { available: false, stock_status: "out_of_stock" };
    }
    return { available: true, stock_status: "unknown" };
  } catch (error) {
    console.error(`Error checking availability for ${productId}:`, error);
    return { available: false, stock_status: "error" };
  }
}
const POST = async (context) => {
  return withSimpleMiddleware(
    "whitecat-products",
    context,
    "admin",
    async (ctx, requestContext) => {
      const runtime = ctx.locals?.runtime;
      const env = runtime?.env;
      if (!env?.DB || !env?.PUMO_DB) {
        return new Response(JSON.stringify({
          success: false,
          error: "Missing required database bindings"
        }), { status: 500, headers: { "Content-Type": "application/json" } });
      }
      console.log("🔄 Starting PUMO availability sync...");
      try {
        const { results: pumoProducts } = await env.PUMO_DB.prepare(`
                    SELECT id, name, stock FROM products 
                    WHERE deleted_at IS NULL 
                    LIMIT 50
                `).all();
        console.log(`📊 Found ${pumoProducts.length} products in PUMO_DB`);
        const updates = [];
        let syncedCount = 0;
        let updatedCount = 0;
        let errorCount = 0;
        for (const product of pumoProducts) {
          try {
            const { available, stock_status } = await checkProductAvailability(product.id);
            let newStock = 0;
            if (stock_status === "high_stock") newStock = 10;
            else if (stock_status === "low_stock") newStock = 3;
            else if (stock_status === "out_of_stock") newStock = 0;
            else newStock = available ? 5 : 0;
            const oldStock = product.stock || 0;
            const availabilityChanged = oldStock > 0 !== newStock > 0;
            if (oldStock !== newStock) {
              updates.push({
                product_id: product.id,
                old_stock: oldStock,
                new_stock: newStock,
                availability_changed: availabilityChanged
              });
              await env.PUMO_DB.prepare(`
                                UPDATE products 
                                SET stock = ?, updated_at = ?
                                WHERE id = ?
                            `).bind(newStock, (/* @__PURE__ */ new Date()).toISOString(), product.id).run();
              await env.DB.prepare(`
                                UPDATE products 
                                SET stock = ?, updated_at = ?
                                WHERE id = ?
                            `).bind(newStock, (/* @__PURE__ */ new Date()).toISOString(), product.id).run();
              updatedCount++;
              console.log(`✅ Updated ${product.name}: ${oldStock} → ${newStock} (${stock_status})`);
            }
            syncedCount++;
            await new Promise((resolve) => setTimeout(resolve, 200));
          } catch (error) {
            console.error(`❌ Error syncing product ${product.id}:`, error);
            errorCount++;
          }
        }
        if (updates.length > 0) {
          for (const update of updates) {
            await env.PUMO_DB.prepare(`
                            INSERT INTO product_changes (
                                product_id, change_type, old_value, new_value, timestamp
                            ) VALUES (?, ?, ?, ?, ?)
                        `).bind(
              update.product_id,
              "stock_change",
              update.old_stock,
              update.new_stock,
              (/* @__PURE__ */ new Date()).toISOString()
            ).run().catch(() => {
            });
          }
        }
        const result = {
          synced_products: syncedCount,
          updated_availability: updatedCount,
          errors: errorCount,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
        console.log("✅ PUMO sync completed:", result);
        return new Response(JSON.stringify({
          success: true,
          data: result,
          updates
        }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
          }
        });
      } catch (error) {
        console.error("❌ PUMO sync failed:", error);
        return new Response(JSON.stringify({
          success: false,
          error: "Sync failed",
          details: error.message
        }), { status: 500, headers: { "Content-Type": "application/json" } });
      }
    }
  );
};
const GET = async (context) => {
  return withSimpleMiddleware(
    "whitecat-products",
    context,
    "public",
    async (ctx) => {
      const runtime = ctx.locals?.runtime;
      const env = runtime?.env;
      if (!env?.DB || !env?.PUMO_DB) {
        return new Response(JSON.stringify({
          status: "error",
          error: "Missing database bindings"
        }), { status: 500, headers: { "Content-Type": "application/json" } });
      }
      try {
        const [pumoCount, ragCount] = await Promise.all([
          env.PUMO_DB.prepare("SELECT COUNT(*) as count FROM products WHERE deleted_at IS NULL").first(),
          env.DB.prepare("SELECT COUNT(*) as count FROM products WHERE deleted_at IS NULL").first()
        ]);
        return new Response(JSON.stringify({
          status: "ok",
          service: "PUMO Availability Sync",
          databases: {
            pumo_db_products: pumoCount.count,
            rag_db_products: ragCount.count,
            sync_needed: pumoCount.count !== ragCount.count
          },
          features: {
            live_scraping: true,
            automatic_sync: true,
            availability_tracking: true
          },
          endpoints: {
            sync: "POST /api/pumo-availability-sync",
            status: "GET /api/pumo-availability-sync"
          },
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } catch (error) {
        return new Response(JSON.stringify({
          status: "error",
          error: error.message
        }), { status: 500, headers: { "Content-Type": "application/json" } });
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
