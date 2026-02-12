globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getProductManager } from '../../chunks/product-manager-d1_C97ggFJZ.mjs';
export { renderers } from '../../renderers.mjs';

class PumoAPIClient {
  constructor(env) {
    this.baseUrl = env.PUMO_API_BASE_URL || "https://www.meblepumo.pl";
    this.apiKey = env.PUMO_API_KEY || "";
    this.timeout = 3e4;
  }
  async fetchProductsPage(page, perPage = 100) {
    const url = `${this.baseUrl}/xml/products.xml`;
    console.log(`📡 Fetching Pumo XML Feed: ${url}`);
    console.log(`🔑 Using API key: ${this.apiKey?.substring(0, 10)}...`);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeout);
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-API-KEY": this.apiKey,
          "Content-Type": "application/xml",
          "Accept": "application/xml",
          "User-Agent": "MyBonzo-AI-Blog/1.0 (https://mybonzoaiblog.com)"
        },
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (!response.ok) {
        throw new Error(`XML Feed Error: ${response.status} ${response.statusText}`);
      }
      const xmlText = await response.text();
      console.log(`✅ XML Feed response length: ${xmlText.length} characters`);
      return {
        products: [],
        // TODO: Parse XML
        total: 0,
        page: 1,
        per_page: 1e3,
        has_more: false
      };
    } catch (error) {
      clearTimeout(timeout);
      console.error("❌ Pumo XML Feed fetch error:", error);
      throw error;
    }
  }
  async getAllProducts() {
    console.log("🚀 Starting full product sync from Pumo API...");
    const allProducts = [];
    let page = 1;
    let hasMore = true;
    const perPage = 100;
    while (hasMore) {
      try {
        const response = await this.fetchProductsPage(page, perPage);
        allProducts.push(...response.products);
        console.log(`✅ Page ${page}: ${response.products.length} products (total: ${allProducts.length}/${response.total})`);
        hasMore = response.has_more;
        page++;
        if (hasMore) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error(`❌ Failed to fetch page ${page}:`, error);
        throw error;
      }
    }
    console.log(`✅ Total products fetched from API: ${allProducts.length}`);
    return allProducts;
  }
}
function transformPumoProduct(product) {
  return {
    id: product.id,
    name: product.name,
    description: product.description || "",
    price: product.price,
    originalPrice: product.price_promo ? product.price : null,
    discountPrice: product.price_promo || null,
    category: product.category,
    subcategory: product.subcategory || "",
    brand: product.brand || "",
    availability: product.availability,
    stockQuantity: product.stock_quantity,
    images: product.images || [],
    url: product.url,
    attributes: product.attributes || {},
    source: "pumo_api",
    updatedAt: product.updated_at || (/* @__PURE__ */ new Date()).toISOString(),
    syncedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
const GET = async (context) => {
  return withSimpleMiddleware(
    "whitecat-products",
    context,
    "user",
    async (ctx, requestContext) => {
      const runtime = ctx.locals?.runtime;
      const env = runtime?.env;
      if (!env?.PUMO_DB) {
        return new Response(JSON.stringify({
          success: false,
          error: "PUMO_DB not configured"
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
      try {
        const productManager = getProductManager(env);
        const stats = await productManager.getStats();
        const lastSyncResult = await env.PUMO_DB.prepare(`
      SELECT * FROM sync_history 
      WHERE sync_type = 'api_sync' 
      ORDER BY started_at DESC 
      LIMIT 1
    `).first();
        return new Response(JSON.stringify({
          success: true,
          data: {
            database_stats: stats,
            last_sync: lastSyncResult ? {
              started_at: lastSyncResult.started_at,
              completed_at: lastSyncResult.completed_at,
              status: lastSyncResult.status,
              products_synced: lastSyncResult.products_synced,
              duration_ms: lastSyncResult.duration_ms
            } : null,
            api_config: {
              base_url: env.PUMO_API_BASE_URL || "https://api.meblepumo.pl/v1",
              has_api_key: !!env.PUMO_API_KEY
            }
          }
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } catch (error) {
        console.error("❌ Pumo API sync status error:", error);
        return new Response(JSON.stringify({
          success: false,
          error: error.message
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
  );
};
const POST = async (context) => {
  return withSimpleMiddleware(
    "whitecat-products",
    context,
    "admin",
    async (ctx, requestContext) => {
      const runtime = ctx.locals?.runtime;
      const env = runtime?.env;
      if (!env?.PUMO_DB) {
        return new Response(JSON.stringify({
          success: false,
          error: "PUMO_DB not configured"
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
      if (!env.PUMO_API_KEY) {
        return new Response(JSON.stringify({
          success: false,
          error: "PUMO_API_KEY not configured"
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
      const syncStartTime = Date.now();
      let syncId = null;
      try {
        const syncResult = await env.PUMO_DB.prepare(`
      INSERT INTO sync_history (sync_type, started_at, status)
      VALUES ('api_sync', ?, 'running')
    `).bind((/* @__PURE__ */ new Date()).toISOString()).run();
        syncId = syncResult.meta.last_row_id;
        console.log(`🚀 Starting API sync #${syncId}`);
        const apiClient = new PumoAPIClient(env);
        const productManager = getProductManager(env);
        const apiProducts = await apiClient.getAllProducts();
        if (apiProducts.length === 0) {
          throw new Error("No products returned from Pumo API");
        }
        let processed = 0;
        let created = 0;
        let updated = 0;
        let errors = 0;
        console.log(`📦 Processing ${apiProducts.length} products...`);
        for (const apiProduct of apiProducts) {
          try {
            const transformedProduct = transformPumoProduct(apiProduct);
            const existingProduct = await productManager.getProduct(apiProduct.id);
            if (existingProduct) {
              await env.PUMO_DB.prepare(`
            UPDATE products 
            SET name = ?, description = ?, price = ?, category = ?, 
                availability = ?, stock_quantity = ?, url = ?, 
                updated_at = ?, synced_at = ?
            WHERE id = ?
          `).bind(
                transformedProduct.name,
                transformedProduct.description,
                transformedProduct.price,
                transformedProduct.category,
                transformedProduct.availability,
                transformedProduct.stockQuantity,
                transformedProduct.url,
                transformedProduct.updatedAt,
                transformedProduct.syncedAt,
                apiProduct.id
              ).run();
              updated++;
            } else {
              await env.PUMO_DB.prepare(`
            INSERT INTO products (id, name, description, price, category, availability, 
                                stock_quantity, url, source, created_at, updated_at, synced_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pumo_api', ?, ?, ?)
          `).bind(
                transformedProduct.id,
                transformedProduct.name,
                transformedProduct.description,
                transformedProduct.price,
                transformedProduct.category,
                transformedProduct.availability,
                transformedProduct.stockQuantity,
                transformedProduct.url,
                transformedProduct.syncedAt,
                transformedProduct.updatedAt,
                transformedProduct.syncedAt
              ).run();
              created++;
            }
            processed++;
            if (processed % 100 === 0) {
              console.log(`📊 Progress: ${processed}/${apiProducts.length} products processed`);
            }
          } catch (productError) {
            console.error(`❌ Error processing product ${apiProduct.id}:`, productError);
            errors++;
          }
        }
        const syncDuration = Date.now() - syncStartTime;
        await env.PUMO_DB.prepare(`
      UPDATE sync_history 
      SET completed_at = ?, status = 'success', products_synced = ?, 
          duration_ms = ?, created_count = ?, updated_count = ?, error_count = ?
      WHERE id = ?
    `).bind(
          (/* @__PURE__ */ new Date()).toISOString(),
          processed,
          syncDuration,
          created,
          updated,
          errors,
          syncId
        ).run();
        console.log(`✅ API sync completed successfully in ${syncDuration}ms`);
        return new Response(JSON.stringify({
          success: true,
          data: {
            sync_id: syncId,
            duration_ms: syncDuration,
            statistics: {
              total_products: apiProducts.length,
              processed,
              created,
              updated,
              errors
            },
            message: `Successfully synced ${processed} products from Pumo API`
          }
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } catch (error) {
        console.error("❌ Pumo API sync error:", error);
        if (syncId) {
          await env.PUMO_DB.prepare(`
        UPDATE sync_history 
        SET completed_at = ?, status = 'failed', error_message = ?, duration_ms = ?
        WHERE id = ?
      `).bind(
            (/* @__PURE__ */ new Date()).toISOString(),
            error.message,
            Date.now() - syncStartTime,
            syncId
          ).run();
        }
        return new Response(JSON.stringify({
          success: false,
          error: error.message,
          sync_id: syncId
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
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
