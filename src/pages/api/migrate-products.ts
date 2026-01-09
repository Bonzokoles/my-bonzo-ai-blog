/**
 * Migration script: Copy products from jimbo-rag-db to pumo_products
 * One-time migration to move data to proper analytics-enabled database
 */
import type { APIRoute } from 'astro';

export const POST: APIRoute = async (context) => {
    const runtime = (context.locals as any)?.runtime;
    const env = runtime?.env;

    if (!env?.DB || !env?.PUMO_DB) {
        return new Response(JSON.stringify({
            success: false,
            error: 'Both databases required for migration'
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        // Get products from jimbo-rag-db
        const sourceProducts = await env.DB.prepare(`
            SELECT id, name, description, category, price, manufacturer, url, image_url, sku
            FROM products
            ORDER BY id
        `).all();

        console.log(`📦 Found ${sourceProducts.results.length} products to migrate`);

        // Clear existing products in pumo_products
        await env.PUMO_DB.prepare('DELETE FROM products').run();

        // Batch insert in groups of 50
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
                    product.description || '',
                    product.category || 'Uncategorized',
                    product.price || 0,
                    (product.price || 0) * 1.1, // Assume 10% discount
                    product.url,
                    product.image_url || '',
                    product.sku || '',
                    new Date().toISOString(),
                    new Date().toISOString()
                ));
            }

            await env.PUMO_DB.batch(statements);
            migrated += batch.length;
            console.log(`✅ Migrated ${migrated}/${sourceProducts.results.length} products`);
        }

        // Verify migration
        const finalCount = await env.PUMO_DB.prepare('SELECT COUNT(*) as count FROM products').first();

        return new Response(JSON.stringify({
            success: true,
            data: {
                source_count: sourceProducts.results.length,
                migrated_count: migrated,
                final_count: (finalCount as any)?.count || 0
            }
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error('❌ Migration error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Migration failed'
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};

export const GET: APIRoute = async (context) => {
    const runtime = (context.locals as any)?.runtime;
    const env = runtime?.env;

    if (!env?.DB || !env?.PUMO_DB) {
        return new Response(JSON.stringify({
            success: false,
            error: 'Databases not available'
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        const [sourceCount, targetCount] = await Promise.all([
            env.DB.prepare('SELECT COUNT(*) as count FROM products').first(),
            env.PUMO_DB.prepare('SELECT COUNT(*) as count FROM products').first()
        ]);

        return new Response(JSON.stringify({
            success: true,
            data: {
                source_db_products: (sourceCount as any)?.count || 0,
                target_db_products: (targetCount as any)?.count || 0,
                migration_needed: (sourceCount as any)?.count !== (targetCount as any)?.count
            }
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Status check failed'
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};