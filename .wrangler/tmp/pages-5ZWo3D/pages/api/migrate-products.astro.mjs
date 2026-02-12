globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const POST = async (context) => {
  const runtime = context.locals?.runtime;
  const env = runtime?.env;
  if (!env?.DB || !env?.PUMO_DB) {
    return new Response(JSON.stringify({
      success: false,
      error: "Both databases required for migration"
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
  try {
    const sourceProducts = await env.DB.prepare(`
            SELECT id, name, description, category, price, manufacturer, url, image_url, sku
            FROM products
            ORDER BY id
        `).all();
    console.log(`📦 Found ${sourceProducts.results.length} products to migrate`);
    await env.PUMO_DB.prepare("DELETE FROM products").run();
    const batchSize = 50;
    let migrated = 0;
    for (let i = 0; i < sourceProducts.results.length; i += batchSize) {
      const batch = sourceProducts.results.slice(i, i + batchSize);
      const statements = [];
      for (const product of batch) {
        statements.push(env.PUMO_DB.prepare(`
                    INSERT INTO products (
                        id, name, description, category, price, 
                        price_before_discount, url, image_url, sku,
                        created_at, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `).bind(
          product.id,
          product.name,
          product.description || "",
          product.category || "Uncategorized",
          product.price || 0,
          (product.price || 0) * 1.1,
          // Assume 10% discount
          product.url,
          product.image_url || "",
          product.sku || "",
          (/* @__PURE__ */ new Date()).toISOString(),
          (/* @__PURE__ */ new Date()).toISOString()
        ));
      }
      await env.PUMO_DB.batch(statements);
      migrated += batch.length;
      console.log(`✅ Migrated ${migrated}/${sourceProducts.results.length} products`);
    }
    const finalCount = await env.PUMO_DB.prepare("SELECT COUNT(*) as count FROM products").first();
    return new Response(JSON.stringify({
      success: true,
      data: {
        source_count: sourceProducts.results.length,
        migrated_count: migrated,
        final_count: finalCount?.count || 0
      }
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("❌ Migration error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Migration failed"
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};
const GET = async (context) => {
  const runtime = context.locals?.runtime;
  const env = runtime?.env;
  if (!env?.DB || !env?.PUMO_DB) {
    return new Response(JSON.stringify({
      success: false,
      error: "Databases not available"
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
  try {
    const [sourceCount, targetCount] = await Promise.all([
      env.DB.prepare("SELECT COUNT(*) as count FROM products").first(),
      env.PUMO_DB.prepare("SELECT COUNT(*) as count FROM products").first()
    ]);
    return new Response(JSON.stringify({
      success: true,
      data: {
        source_db_products: sourceCount?.count || 0,
        target_db_products: targetCount?.count || 0,
        migration_needed: sourceCount?.count !== targetCount?.count
      }
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Status check failed"
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
