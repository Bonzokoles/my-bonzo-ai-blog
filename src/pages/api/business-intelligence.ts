/**
 * Business Intelligence Data Collector
 * Pobiera pełną zawartość biznesową z historią 3-miesięczną
 */

import { withSimpleMiddleware } from '@/middleware/simple-middleware';
import type { APIRoute } from 'astro';

interface BusinessDataCollection {
    products: boolean;
    prices: boolean;
    stock: boolean;
    categories: boolean;
    competitors: boolean;
    seo: boolean;
    pageSnapshots: boolean;
}

interface CollectionStats {
    total_items: number;
    processed: number;
    created: number;
    updated: number;
    failed: number;
    duration_ms: number;
}

interface FullBusinessData {
    product_id: string;
    name: string;
    description: string;
    price: number;
    price_promo?: number;
    stock_quantity: number;
    availability: string;
    category: string;
    subcategory?: string;
    brand?: string;
    url: string;
    images: string[];
    attributes: Record<string, any>;
    seo_data: {
        title: string;
        meta_description: string;
        keywords: string[];
        content_length: number;
    };
    competitive_data?: {
        competitor_prices: Array<{
            competitor: string;
            price: number;
            url: string;
        }>;
    };
}

class BusinessIntelligenceCollector {
    private env: any;
    private startTime: number;

    constructor(env: any) {
        this.env = env;
        this.startTime = Date.now();
    }

    async initializeSchema(): Promise<void> {
        const tables = [
            `CREATE TABLE IF NOT EXISTS product_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id TEXT NOT NULL,
                name TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL,
                price_promo REAL,
                stock_quantity INTEGER DEFAULT 0,
                availability TEXT DEFAULT 'unavailable',
                category TEXT,
                subcategory TEXT,
                brand TEXT,
                url TEXT,
                images TEXT,
                attributes TEXT,
                scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                data_source TEXT DEFAULT 'api',
                changes_detected TEXT,
                raw_data TEXT
            )`,
            `CREATE INDEX IF NOT EXISTS idx_product_history_product_id ON product_history(product_id)`,
            `CREATE INDEX IF NOT EXISTS idx_product_history_scraped_at ON product_history(scraped_at)`,

            `CREATE TABLE IF NOT EXISTS price_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id TEXT NOT NULL,
                regular_price REAL NOT NULL,
                promo_price REAL,
                discount_percentage REAL,
                price_change_type TEXT,
                previous_price REAL,
                recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                validity_period TEXT,
                source_page_url TEXT
            )`,

            `CREATE TABLE IF NOT EXISTS stock_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id TEXT NOT NULL,
                stock_quantity INTEGER NOT NULL,
                availability_status TEXT NOT NULL,
                warehouse_location TEXT,
                last_restock_date DATETIME,
                estimated_restock_date DATETIME,
                stock_change INTEGER,
                recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                alert_threshold_reached BOOLEAN DEFAULT FALSE
            )`,

            `CREATE TABLE IF NOT EXISTS business_metrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                metric_date DATE NOT NULL,
                total_products INTEGER DEFAULT 0,
                available_products INTEGER DEFAULT 0,
                products_on_promo INTEGER DEFAULT 0,
                average_price REAL,
                price_range_min REAL,
                price_range_max REAL,
                top_categories TEXT,
                stock_alerts INTEGER DEFAULT 0,
                new_products_added INTEGER DEFAULT 0,
                products_discontinued INTEGER DEFAULT 0,
                total_inventory_value REAL,
                calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,

            `CREATE TABLE IF NOT EXISTS data_collection_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                collection_type TEXT NOT NULL,
                started_at DATETIME NOT NULL,
                completed_at DATETIME,
                status TEXT DEFAULT 'running',
                items_processed INTEGER DEFAULT 0,
                items_updated INTEGER DEFAULT 0,
                items_created INTEGER DEFAULT 0,
                items_failed INTEGER DEFAULT 0,
                errors_log TEXT,
                performance_metrics TEXT,
                data_quality_score REAL,
                next_scheduled_run DATETIME
            )`,

            `CREATE TABLE IF NOT EXISTS page_snapshots (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                url TEXT NOT NULL,
                page_type TEXT,
                html_content TEXT,
                extracted_data TEXT,
                screenshot_url TEXT,
                page_size_kb REAL,
                load_time_ms INTEGER,
                accessibility_score REAL,
                captured_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                analysis_status TEXT DEFAULT 'pending'
            )`
        ];

        for (const tableSQL of tables) {
            await this.env.PUMO_DB.prepare(tableSQL).run();
        }
    }

    async collectFullBusinessData(options: BusinessDataCollection): Promise<CollectionStats> {
        const collectionId = await this.startCollection();

        try {
            const stats: CollectionStats = {
                total_items: 0,
                processed: 0,
                created: 0,
                updated: 0,
                failed: 0,
                duration_ms: 0
            };

            // 1. Pobierz wszystkie produkty z API
            if (options.products) {
                const productsStats = await this.collectProductsData();
                this.mergeStats(stats, productsStats);
            }

            // 2. Zbierz historię cen
            if (options.prices) {
                const priceStats = await this.collectPriceHistory();
                this.mergeStats(stats, priceStats);
            }

            // 3. Monitoruj stany magazynowe
            if (options.stock) {
                const stockStats = await this.collectStockData();
                this.mergeStats(stats, stockStats);
            }

            // 4. Mapuj strukturę kategorii
            if (options.categories) {
                const categoryStats = await this.collectCategoryStructure();
                this.mergeStats(stats, categoryStats);
            }

            // 5. Dane konkurencji
            if (options.competitors) {
                const competitorStats = await this.collectCompetitorData();
                this.mergeStats(stats, competitorStats);
            }

            // 6. SEO i marketing
            if (options.seo) {
                const seoStats = await this.collectSEOData();
                this.mergeStats(stats, seoStats);
            }

            // 7. Pełne snapshoty stron
            if (options.pageSnapshots) {
                const snapshotStats = await this.collectPageSnapshots();
                this.mergeStats(stats, snapshotStats);
            }

            // 8. Oblicz metryki biznesowe
            await this.calculateBusinessMetrics();

            stats.duration_ms = Date.now() - this.startTime;
            await this.completeCollection(collectionId, stats);

            return stats;
        } catch (error) {
            await this.failCollection(collectionId, error);
            throw error;
        }
    }

    private async collectProductsData(): Promise<CollectionStats> {
        const stats: CollectionStats = { total_items: 0, processed: 0, created: 0, updated: 0, failed: 0, duration_ms: 0 };

        try {
            // Pobierz produkty z PUMO API
            const response = await fetch(`${this.env.PUMO_API_BASE_URL}/xml/products.xml`, {
                headers: {
                    'Authorization': `Bearer ${this.env.PUMO_API_KEY}`,
                    'User-Agent': 'MyBonzo-BusinessIntelligence/1.0'
                }
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const xmlData = await response.text();
            const products = await this.parseXMLProducts(xmlData);
            stats.total_items = products.length;

            for (const product of products) {
                try {
                    // Sprawdź czy produkt już istnieje w historii
                    const existing = await this.env.PUMO_DB.prepare(`
                        SELECT id, price, stock_quantity, attributes 
                        FROM product_history 
                        WHERE product_id = ? 
                        ORDER BY scraped_at DESC 
                        LIMIT 1
                    `).bind(product.product_id).first();

                    const changes = this.detectChanges(existing, product);

                    // Zapisz do historii
                    await this.env.PUMO_DB.prepare(`
                        INSERT INTO product_history (
                            product_id, name, description, price, price_promo,
                            stock_quantity, availability, category, subcategory,
                            brand, url, images, attributes, data_source,
                            changes_detected, raw_data
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `).bind(
                        product.product_id,
                        product.name,
                        product.description,
                        product.price,
                        product.price_promo,
                        product.stock_quantity,
                        product.availability,
                        product.category,
                        product.subcategory,
                        product.brand,
                        product.url,
                        JSON.stringify(product.images),
                        JSON.stringify(product.attributes),
                        'api',
                        JSON.stringify(changes),
                        JSON.stringify(product)
                    ).run();

                    if (existing) {
                        stats.updated++;
                    } else {
                        stats.created++;
                    }

                    stats.processed++;
                } catch (error) {
                    console.error(`Failed to process product ${product.product_id}:`, error);
                    stats.failed++;
                }
            }

        } catch (error) {
            console.error('Failed to collect products data:', error);
            throw error;
        }

        return stats;
    }

    private async collectPriceHistory(): Promise<CollectionStats> {
        const stats: CollectionStats = { total_items: 0, processed: 0, created: 0, updated: 0, failed: 0, duration_ms: 0 };

        // Pobierz wszystkie produkty z ostatnich zmian cen
        const products = await this.env.PUMO_DB.prepare(`
            SELECT DISTINCT product_id, price, price_promo
            FROM product_history 
            WHERE scraped_at > datetime('now', '-1 day')
        `).all();

        stats.total_items = products.results.length;

        for (const product of products.results) {
            try {
                // Sprawdź poprzednią cenę
                const previousPrice = await this.env.PUMO_DB.prepare(`
                    SELECT regular_price 
                    FROM price_history 
                    WHERE product_id = ? 
                    ORDER BY recorded_at DESC 
                    LIMIT 1
                `).bind(product.product_id).first();

                let priceChangeType = 'no_change';
                if (!previousPrice) {
                    priceChangeType = 'initial';
                } else if (product.price > previousPrice.regular_price) {
                    priceChangeType = 'increase';
                } else if (product.price < previousPrice.regular_price) {
                    priceChangeType = 'decrease';
                }

                if (product.price_promo && !previousPrice?.promo_price) {
                    priceChangeType = 'promo_start';
                } else if (!product.price_promo && previousPrice?.promo_price) {
                    priceChangeType = 'promo_end';
                }

                const discountPercentage = product.price_promo ?
                    ((product.price - product.price_promo) / product.price * 100) : null;

                await this.env.PUMO_DB.prepare(`
                    INSERT INTO price_history (
                        product_id, regular_price, promo_price, discount_percentage,
                        price_change_type, previous_price
                    ) VALUES (?, ?, ?, ?, ?, ?)
                `).bind(
                    product.product_id,
                    product.price,
                    product.price_promo,
                    discountPercentage,
                    priceChangeType,
                    previousPrice?.regular_price
                ).run();

                stats.created++;
                stats.processed++;
            } catch (error) {
                console.error(`Failed to record price history for ${product.product_id}:`, error);
                stats.failed++;
            }
        }

        return stats;
    }

    private async collectStockData(): Promise<CollectionStats> {
        const stats: CollectionStats = { total_items: 0, processed: 0, created: 0, updated: 0, failed: 0, duration_ms: 0 };

        const products = await this.env.PUMO_DB.prepare(`
            SELECT DISTINCT product_id, stock_quantity, availability
            FROM product_history 
            WHERE scraped_at > datetime('now', '-1 day')
        `).all();

        stats.total_items = products.results.length;

        for (const product of products.results) {
            try {
                const previousStock = await this.env.PUMO_DB.prepare(`
                    SELECT stock_quantity 
                    FROM stock_history 
                    WHERE product_id = ? 
                    ORDER BY recorded_at DESC 
                    LIMIT 1
                `).bind(product.product_id).first();

                const stockChange = previousStock ?
                    product.stock_quantity - previousStock.stock_quantity : 0;

                const alertThreshold = product.stock_quantity <= 5;

                await this.env.PUMO_DB.prepare(`
                    INSERT INTO stock_history (
                        product_id, stock_quantity, availability_status,
                        stock_change, alert_threshold_reached
                    ) VALUES (?, ?, ?, ?, ?)
                `).bind(
                    product.product_id,
                    product.stock_quantity,
                    product.availability,
                    stockChange,
                    alertThreshold
                ).run();

                stats.created++;
                stats.processed++;
            } catch (error) {
                stats.failed++;
            }
        }

        return stats;
    }

    private async collectCategoryStructure(): Promise<CollectionStats> {
        // Placeholder - implementacja scrapingu struktury kategorii
        return { total_items: 0, processed: 0, created: 0, updated: 0, failed: 0, duration_ms: 0 };
    }

    private async collectCompetitorData(): Promise<CollectionStats> {
        // Placeholder - implementacja analizy konkurencji
        return { total_items: 0, processed: 0, created: 0, updated: 0, failed: 0, duration_ms: 0 };
    }

    private async collectSEOData(): Promise<CollectionStats> {
        // Placeholder - implementacja zbierania danych SEO
        return { total_items: 0, processed: 0, created: 0, updated: 0, failed: 0, duration_ms: 0 };
    }

    private async collectPageSnapshots(): Promise<CollectionStats> {
        // Placeholder - implementacja pełnych snapshotów stron
        return { total_items: 0, processed: 0, created: 0, updated: 0, failed: 0, duration_ms: 0 };
    }

    private async calculateBusinessMetrics(): Promise<void> {
        const today = new Date().toISOString().split('T')[0];

        // Oblicz podstawowe metryki
        const metrics = await this.env.PUMO_DB.prepare(`
            SELECT 
                COUNT(*) as total_products,
                COUNT(CASE WHEN availability = 'available' THEN 1 END) as available_products,
                COUNT(CASE WHEN price_promo IS NOT NULL THEN 1 END) as products_on_promo,
                AVG(price) as average_price,
                MIN(price) as price_range_min,
                MAX(price) as price_range_max,
                SUM(price * stock_quantity) as total_inventory_value
            FROM (
                SELECT DISTINCT product_id, price, price_promo, availability, stock_quantity
                FROM product_history 
                WHERE DATE(scraped_at) = ?
            ) latest_products
        `).bind(today).first();

        await this.env.PUMO_DB.prepare(`
            INSERT OR REPLACE INTO business_metrics (
                metric_date, total_products, available_products, products_on_promo,
                average_price, price_range_min, price_range_max, total_inventory_value
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            today,
            metrics.total_products,
            metrics.available_products,
            metrics.products_on_promo,
            metrics.average_price,
            metrics.price_range_min,
            metrics.price_range_max,
            metrics.total_inventory_value
        ).run();
    }

    private async parseXMLProducts(xml: string): Promise<FullBusinessData[]> {
        // Simplified XML parsing - w rzeczywistości użyj właściwego parsera XML
        // To jest placeholder implementation
        return [];
    }

    private detectChanges(existing: any, current: any): string[] {
        const changes: string[] = [];
        if (!existing) return ['new_product'];

        if (existing.price !== current.price) changes.push('price_changed');
        if (existing.stock_quantity !== current.stock_quantity) changes.push('stock_changed');
        if (JSON.stringify(existing.attributes) !== JSON.stringify(current.attributes)) {
            changes.push('attributes_changed');
        }

        return changes;
    }

    private mergeStats(target: CollectionStats, source: CollectionStats): void {
        target.total_items += source.total_items;
        target.processed += source.processed;
        target.created += source.created;
        target.updated += source.updated;
        target.failed += source.failed;
    }

    private async startCollection(): Promise<number> {
        const result = await this.env.PUMO_DB.prepare(`
            INSERT INTO data_collection_logs (
                collection_type, started_at, status
            ) VALUES (?, ?, ?)
        `).bind(
            'full_business_intelligence',
            new Date().toISOString(),
            'running'
        ).run();

        return result.meta.last_row_id;
    }

    private async completeCollection(collectionId: number, stats: CollectionStats): Promise<void> {
        await this.env.PUMO_DB.prepare(`
            UPDATE data_collection_logs 
            SET completed_at = ?, status = ?, items_processed = ?, 
                items_created = ?, items_updated = ?, items_failed = ?,
                performance_metrics = ?
            WHERE id = ?
        `).bind(
            new Date().toISOString(),
            'completed',
            stats.processed,
            stats.created,
            stats.updated,
            stats.failed,
            JSON.stringify(stats),
            collectionId
        ).run();
    }

    private async failCollection(collectionId: number, error: any): Promise<void> {
        await this.env.PUMO_DB.prepare(`
            UPDATE data_collection_logs 
            SET completed_at = ?, status = ?, errors_log = ?
            WHERE id = ?
        `).bind(
            new Date().toISOString(),
            'failed',
            JSON.stringify({ error: error.message, stack: error.stack }),
            collectionId
        ).run();
    }
}

// GET endpoint - Status i historia zbierania danych
export const GET: APIRoute = async (context) => {
    return withSimpleMiddleware(
        'whitecat-products',
        context,
        'public',
        async (ctx, requestContext) => {
            const runtime = (ctx.locals as any)?.runtime;
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
                // Pobierz ostatnie zbieranie danych
                const lastCollection = await env.PUMO_DB.prepare(`
                    SELECT * FROM data_collection_logs 
                    ORDER BY started_at DESC 
                    LIMIT 1
                `).first();

                // Statystyki z ostatnich 3 miesięcy
                const stats = await env.PUMO_DB.prepare(`
                    SELECT 
                        COUNT(DISTINCT product_id) as unique_products,
                        COUNT(*) as total_records,
                        MIN(scraped_at) as oldest_record,
                        MAX(scraped_at) as newest_record
                    FROM product_history 
                    WHERE scraped_at > datetime('now', '-3 months')
                `).first();

                // Ostatnie metryki biznesowe
                const businessMetrics = await env.PUMO_DB.prepare(`
                    SELECT * FROM business_metrics 
                    ORDER BY metric_date DESC 
                    LIMIT 7
                `).all();

                return new Response(JSON.stringify({
                    success: true,
                    status: {
                        database_connected: true,
                        last_collection: lastCollection,
                        historical_data: {
                            timeframe: '3 months',
                            unique_products: stats.unique_products,
                            total_records: stats.total_records,
                            data_range: {
                                from: stats.oldest_record,
                                to: stats.newest_record
                            }
                        },
                        recent_business_metrics: businessMetrics.results
                    },
                    available_actions: [
                        'collect-full-data',
                        'collect-products-only',
                        'collect-prices-only',
                        'collect-stock-only',
                        'initialize-schema',
                        'cleanup-old-data'
                    ]
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });

            } catch (error: any) {
                console.error('❌ Business Intelligence status error:', error);
                return new Response(JSON.stringify({
                    success: false,
                    error: error.message
                }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }
    );
};

// POST endpoint - Trigger zbierania danych
export const POST: APIRoute = async (context) => {
    return withSimpleMiddleware(
        'whitecat-products',
        context,
        'admin',
        async (ctx, requestContext) => {
            const runtime = (ctx.locals as any)?.runtime;
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
                const body = await ctx.request.json();
                const { action, options = {} } = body;

                const collector = new BusinessIntelligenceCollector(env);

                switch (action) {
                    case 'initialize-schema':
                        await collector.initializeSchema();
                        return new Response(JSON.stringify({
                            success: true,
                            message: 'Business Intelligence schema initialized'
                        }), {
                            status: 200,
                            headers: { 'Content-Type': 'application/json' }
                        });

                    case 'collect-full-data':
                        const fullOptions: BusinessDataCollection = {
                            products: true,
                            prices: true,
                            stock: true,
                            categories: options.categories ?? false,
                            competitors: options.competitors ?? false,
                            seo: options.seo ?? false,
                            pageSnapshots: options.pageSnapshots ?? false
                        };

                        const fullStats = await collector.collectFullBusinessData(fullOptions);

                        return new Response(JSON.stringify({
                            success: true,
                            message: 'Full business data collection completed',
                            stats: fullStats
                        }), {
                            status: 200,
                            headers: { 'Content-Type': 'application/json' }
                        });

                    case 'collect-products-only':
                        const productStats = await collector.collectFullBusinessData({
                            products: true,
                            prices: false,
                            stock: false,
                            categories: false,
                            competitors: false,
                            seo: false,
                            pageSnapshots: false
                        });

                        return new Response(JSON.stringify({
                            success: true,
                            message: 'Products data collection completed',
                            stats: productStats
                        }), {
                            status: 200,
                            headers: { 'Content-Type': 'application/json' }
                        });

                    case 'cleanup-old-data':
                        // Usuń dane starsze niż 3 miesiące
                        await env.PUMO_DB.prepare(`
                            DELETE FROM product_history 
                            WHERE scraped_at < datetime('now', '-3 months')
                        `).run();

                        return new Response(JSON.stringify({
                            success: true,
                            message: 'Old data cleaned up (kept last 3 months)'
                        }), {
                            status: 200,
                            headers: { 'Content-Type': 'application/json' }
                        });

                    default:
                        return new Response(JSON.stringify({
                            success: false,
                            error: `Unknown action: ${action}`
                        }), {
                            status: 400,
                            headers: { 'Content-Type': 'application/json' }
                        });
                }

            } catch (error: any) {
                console.error('❌ Business Intelligence action error:', error);
                return new Response(JSON.stringify({
                    success: false,
                    error: error.message
                }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }
    );
};