/**
 * Meble Pumo API Sync System
 * Automatyczna synchronizacja produktów z API Meble Pumo zamiast scrapingu
 */

import { getProductManager } from '@/lib/whitecat/product-manager-d1';
import type { APIRoute } from 'astro';

interface PumoAPIProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    price_promo?: number;
    category: string;
    subcategory?: string;
    brand?: string;
    availability: string;
    stock_quantity: number;
    images: string[];
    url: string;
    attributes?: Record<string, any>;
    updated_at?: string;
}

interface PumoAPIResponse {
    products: PumoAPIProduct[];
    total: number;
    page: number;
    per_page: number;
    has_more: boolean;
}

class PumoAPIClient {
    private baseUrl: string;
    private apiKey: string;
    private timeout: number;

    constructor(env: any) {
        this.baseUrl = env.PUMO_API_BASE_URL || 'https://api.meblepumo.pl/v1';
        this.apiKey = env.PUMO_API_KEY || '';
        this.timeout = 30000;
    }

    async fetchProductsPage(page: number, perPage: number = 100): Promise<PumoAPIResponse> {
        const url = `${this.baseUrl}/products?page=${page}&per_page=${perPage}`;

        console.log(`📡 Fetching Pumo API: ${url}`);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-API-KEY': this.apiKey,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'User-Agent': 'MyBonzo-AI-Blog/1.0 (https://mybonzoaiblog.com)'
                },
                signal: controller.signal
            });

            clearTimeout(timeout);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            return {
                products: data.products || [],
                total: data.total || 0,
                page: data.page || page,
                per_page: data.per_page || perPage,
                has_more: data.has_more || false
            };

        } catch (error: any) {
            clearTimeout(timeout);
            console.error('❌ Pumo API fetch error:', error);
            throw error;
        }
    }

    async getAllProducts(): Promise<PumoAPIProduct[]> {
        console.log('🚀 Starting full product sync from Pumo API...');

        const allProducts: PumoAPIProduct[] = [];
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

                // Rate limiting - 100ms delay
                if (hasMore) {
                    await new Promise(resolve => setTimeout(resolve, 100));
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

function transformPumoProduct(product: PumoAPIProduct): any {
    // Transform Pumo API product to our internal format
    return {
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        originalPrice: product.price_promo ? product.price : null,
        discountPrice: product.price_promo || null,
        category: product.category,
        subcategory: product.subcategory || '',
        brand: product.brand || '',
        availability: product.availability,
        stockQuantity: product.stock_quantity,
        images: product.images || [],
        url: product.url,
        attributes: product.attributes || {},
        source: 'pumo_api',
        updatedAt: product.updated_at || new Date().toISOString(),
        syncedAt: new Date().toISOString()
    };
}

// GET endpoint - Status i statystyki
export const GET: APIRoute = async (context) => {
    const runtime = (context.locals as any)?.runtime;
    const env = runtime?.env;

    if (!env?.PUMO_DB) {
        return new Response(JSON.stringify({
            success: false,
            error: 'PUMO_DB not configured'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const productManager = getProductManager(env);
        const stats = await productManager.getStats();

        // Check last sync time
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
                    base_url: env.PUMO_API_BASE_URL || 'https://api.meblepumo.pl/v1',
                    has_api_key: !!env.PUMO_API_KEY
                }
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('❌ Pumo API sync status error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

// POST endpoint - Manual sync trigger
export const POST: APIRoute = async (context) => {
    const runtime = (context.locals as any)?.runtime;
    const env = runtime?.env;

    if (!env?.PUMO_DB) {
        return new Response(JSON.stringify({
            success: false,
            error: 'PUMO_DB not configured'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (!env.PUMO_API_KEY) {
        return new Response(JSON.stringify({
            success: false,
            error: 'PUMO_API_KEY not configured'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const syncStartTime = Date.now();
    let syncId: number | null = null;

    try {
        // Start sync record
        const syncResult = await env.PUMO_DB.prepare(`
      INSERT INTO sync_history (sync_type, started_at, status)
      VALUES ('api_sync', ?, 'running')
    `).bind(new Date().toISOString()).run();

        syncId = syncResult.meta.last_row_id;
        console.log(`🚀 Starting API sync #${syncId}`);

        // Initialize API client
        const apiClient = new PumoAPIClient(env);
        const productManager = getProductManager(env);

        // Fetch all products from API
        const apiProducts = await apiClient.getAllProducts();

        if (apiProducts.length === 0) {
            throw new Error('No products returned from Pumo API');
        }

        // Process products
        let processed = 0;
        let created = 0;
        let updated = 0;
        let errors = 0;

        console.log(`📦 Processing ${apiProducts.length} products...`);

        for (const apiProduct of apiProducts) {
            try {
                const transformedProduct = transformPumoProduct(apiProduct);

                // Check if product exists
                const existingProduct = await productManager.getProduct(apiProduct.id);

                if (existingProduct) {
                    // Update existing product
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
                    // Create new product
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

            } catch (productError: any) {
                console.error(`❌ Error processing product ${apiProduct.id}:`, productError);
                errors++;
            }
        }

        const syncDuration = Date.now() - syncStartTime;

        // Complete sync record
        await env.PUMO_DB.prepare(`
      UPDATE sync_history 
      SET completed_at = ?, status = 'success', products_synced = ?, 
          duration_ms = ?, created_count = ?, updated_count = ?, error_count = ?
      WHERE id = ?
    `).bind(
            new Date().toISOString(),
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
                    processed: processed,
                    created: created,
                    updated: updated,
                    errors: errors
                },
                message: `Successfully synced ${processed} products from Pumo API`
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('❌ Pumo API sync error:', error);

        // Update sync record with error
        if (syncId) {
            await env.PUMO_DB.prepare(`
        UPDATE sync_history 
        SET completed_at = ?, status = 'failed', error_message = ?, duration_ms = ?
        WHERE id = ?
      `).bind(
                new Date().toISOString(),
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
            headers: { 'Content-Type': 'application/json' }
        });
    }
};