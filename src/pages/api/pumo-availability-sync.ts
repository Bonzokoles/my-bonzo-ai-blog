/**
 * PUMO Product Availability Sync API
 * Synchronizuje dostępność produktów między bazą PUMO_DB i główną bazą RAG
 */

import { withFeatureMiddleware } from '@/middleware/api-middleware';
import type { APIRoute } from 'astro';

interface SyncResult {
    synced_products: number;
    updated_availability: number;
    errors: number;
    timestamp: string;
}

interface ProductAvailabilityUpdate {
    product_id: string;
    old_stock: number;
    new_stock: number;
    availability_changed: boolean;
}

/**
 * Sprawdza dostępność produktu przez scraping
 */
async function checkProductAvailability(productId: string): Promise<{ available: boolean, stock_status: string }> {
    try {
        const url = `https://www.meblepumo.pl/pl/products/product-${productId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'MyBonzo-Availability-Checker/1.0',
                'Accept': 'text/html'
            },
            signal: AbortSignal.timeout(8000)
        });

        if (!response.ok) return { available: false, stock_status: 'unknown' };

        const html = await response.text();

        if (html.includes('Produkt w magazynie w bardzo dużej ilości') || html.includes('graph_1_4.png')) {
            return { available: true, stock_status: 'high_stock' };
        } else if (html.includes('Produkt w magazynie w małej ilości') || html.includes('graph_1_2.png')) {
            return { available: true, stock_status: 'low_stock' };
        } else if (html.includes('Produkt wyprzedany') || html.includes('Produkt niedostępny')) {
            return { available: false, stock_status: 'out_of_stock' };
        }

        return { available: true, stock_status: 'unknown' };
    } catch (error) {
        console.error(`Error checking availability for ${productId}:`, error);
        return { available: false, stock_status: 'error' };
    }
}

/**
 * Główna funkcja synchronizacji
 */
export const POST: APIRoute = async (context) => {
    return withFeatureMiddleware(
        'whitecat-products',
        context,
        'admin',
        async (ctx, requestContext) => {
            const runtime = (ctx.locals as any)?.runtime;
            const env = runtime?.env;

            if (!env?.DB || !env?.PUMO_DB) {
                return new Response(JSON.stringify({
                    success: false,
                    error: 'Missing required database bindings'
                }), { status: 500, headers: { 'Content-Type': 'application/json' } });
            }

            console.log('🔄 Starting PUMO availability sync...');

            try {
                // 1. Pobierz produkty z bazy PUMO_DB
                const { results: pumoProducts } = await env.PUMO_DB.prepare(`
                    SELECT id, name, stock FROM products 
                    WHERE deleted_at IS NULL 
                    LIMIT 50
                `).all();

                console.log(`📊 Found ${pumoProducts.length} products in PUMO_DB`);

                const updates: ProductAvailabilityUpdate[] = [];
                let syncedCount = 0;
                let updatedCount = 0;
                let errorCount = 0;

                // 2. Sprawdź każdy produkt na stronie
                for (const product of pumoProducts) {
                    try {
                        const { available, stock_status } = await checkProductAvailability(product.id);

                        // Mapowanie stock_status na liczbową wartość
                        let newStock = 0;
                        if (stock_status === 'high_stock') newStock = 10;
                        else if (stock_status === 'low_stock') newStock = 3;
                        else if (stock_status === 'out_of_stock') newStock = 0;
                        else newStock = available ? 5 : 0; // domyślne wartości

                        const oldStock = product.stock || 0;
                        const availabilityChanged = (oldStock > 0) !== (newStock > 0);

                        if (oldStock !== newStock) {
                            updates.push({
                                product_id: product.id,
                                old_stock: oldStock,
                                new_stock: newStock,
                                availability_changed: availabilityChanged
                            });

                            // 3. Aktualizuj PUMO_DB
                            await env.PUMO_DB.prepare(`
                                UPDATE products 
                                SET stock = ?, updated_at = ?
                                WHERE id = ?
                            `).bind(newStock, new Date().toISOString(), product.id).run();

                            // 4. Aktualizuj główną bazę RAG
                            await env.DB.prepare(`
                                UPDATE products 
                                SET stock = ?, updated_at = ?
                                WHERE id = ?
                            `).bind(newStock, new Date().toISOString(), product.id).run();

                            updatedCount++;

                            console.log(`✅ Updated ${product.name}: ${oldStock} → ${newStock} (${stock_status})`);
                        }

                        syncedCount++;

                        // Rate limiting - 200ms między requestami
                        await new Promise(resolve => setTimeout(resolve, 200));

                    } catch (error) {
                        console.error(`❌ Error syncing product ${product.id}:`, error);
                        errorCount++;
                    }
                }

                // 5. Log historii zmian
                if (updates.length > 0) {
                    for (const update of updates) {
                        await env.PUMO_DB.prepare(`
                            INSERT INTO product_changes (
                                product_id, change_type, old_value, new_value, timestamp
                            ) VALUES (?, ?, ?, ?, ?)
                        `).bind(
                            update.product_id,
                            'stock_change',
                            update.old_stock,
                            update.new_stock,
                            new Date().toISOString()
                        ).run().catch(() => { }); // Ignore if table doesn't exist
                    }
                }

                const result: SyncResult = {
                    synced_products: syncedCount,
                    updated_availability: updatedCount,
                    errors: errorCount,
                    timestamp: new Date().toISOString()
                };

                console.log('✅ PUMO sync completed:', result);

                return new Response(JSON.stringify({
                    success: true,
                    data: result,
                    updates: updates
                }), {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache'
                    }
                });

            } catch (error: any) {
                console.error('❌ PUMO sync failed:', error);

                return new Response(JSON.stringify({
                    success: false,
                    error: 'Sync failed',
                    details: error.message
                }), { status: 500, headers: { 'Content-Type': 'application/json' } });
            }
        }
    );
};

// Status endpoint
export const GET: APIRoute = async (context) => {
    return withFeatureMiddleware(
        'whitecat-products',
        context,
        'public',
        async (ctx) => {
            const runtime = (ctx.locals as any)?.runtime;
            const env = runtime?.env;

            if (!env?.DB || !env?.PUMO_DB) {
                return new Response(JSON.stringify({
                    status: 'error',
                    error: 'Missing database bindings'
                }), { status: 500, headers: { 'Content-Type': 'application/json' } });
            }

            try {
                // Sprawdź ostatnią synchronizację
                const [pumoCount, ragCount] = await Promise.all([
                    env.PUMO_DB.prepare('SELECT COUNT(*) as count FROM products WHERE deleted_at IS NULL').first(),
                    env.DB.prepare('SELECT COUNT(*) as count FROM products WHERE deleted_at IS NULL').first()
                ]);

                return new Response(JSON.stringify({
                    status: 'ok',
                    service: 'PUMO Availability Sync',
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
                        sync: 'POST /api/pumo-availability-sync',
                        status: 'GET /api/pumo-availability-sync'
                    },
                    timestamp: new Date().toISOString()
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });

            } catch (error: any) {
                return new Response(JSON.stringify({
                    status: 'error',
                    error: error.message
                }), { status: 500, headers: { 'Content-Type': 'application/json' } });
            }
        }
    );
};