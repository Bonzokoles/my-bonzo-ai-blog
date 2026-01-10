/**
 * Business Analytics Reports
 * Gotowe raporty i analizy biznesowe z danych historycznych
 */

import { withSimpleMiddleware } from '@/middleware/simple-middleware';
import type { APIRoute } from 'astro';

interface BusinessReport {
    report_type: string;
    period: string;
    generated_at: string;
    data: any;
    summary: {
        total_value: number;
        change_percentage: number;
        trend: 'up' | 'down' | 'stable';
    };
}

interface PriceAnalysis {
    product_id: string;
    product_name: string;
    current_price: number;
    min_price_3m: number;
    max_price_3m: number;
    avg_price_3m: number;
    price_volatility: number;
    price_trend: 'increasing' | 'decreasing' | 'stable';
    discount_frequency: number;
    competitor_comparison?: {
        position: 'lowest' | 'competitive' | 'premium';
        price_difference: number;
    };
}

interface StockAnalysis {
    product_id: string;
    product_name: string;
    current_stock: number;
    avg_stock_3m: number;
    stock_turnover_rate: number;
    days_out_of_stock: number;
    restock_frequency: number;
    stock_alerts_count: number;
    recommended_action: string;
}

class BusinessAnalyticsEngine {
    private env: any;

    constructor(env: any) {
        this.env = env;
    }

    async generatePriceAnalysisReport(period: string = '3 months'): Promise<BusinessReport> {
        const priceAnalysis = await this.env.PUMO_DB.prepare(`
            SELECT 
                ph.product_id,
                ph.name as product_name,
                ph.price as current_price,
                price_stats.min_price,
                price_stats.max_price,
                price_stats.avg_price,
                price_stats.price_changes_count,
                price_stats.discount_days
            FROM (
                SELECT product_id, name, price, 
                       ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY scraped_at DESC) as rn
                FROM product_history
            ) ph
            LEFT JOIN (
                SELECT 
                    product_id,
                    MIN(price) as min_price,
                    MAX(price) as max_price,
                    AVG(price) as avg_price,
                    COUNT(DISTINCT price) as price_changes_count,
                    SUM(CASE WHEN price_promo IS NOT NULL THEN 1 ELSE 0 END) as discount_days
                FROM product_history 
                WHERE scraped_at > datetime('now', '-3 months')
                GROUP BY product_id
            ) price_stats ON ph.product_id = price_stats.product_id
            WHERE ph.rn = 1
            ORDER BY (price_stats.max_price - price_stats.min_price) DESC
            LIMIT 100
        `).all();

        const analysisData: PriceAnalysis[] = priceAnalysis.results.map((row: any) => {
            const volatility = (row.max_price - row.min_price) / row.avg_price * 100;
            const trend = row.current_price > row.avg_price ? 'increasing' :
                row.current_price < row.avg_price ? 'decreasing' : 'stable';

            return {
                product_id: row.product_id,
                product_name: row.product_name,
                current_price: row.current_price,
                min_price_3m: row.min_price,
                max_price_3m: row.max_price,
                avg_price_3m: row.avg_price,
                price_volatility: Math.round(volatility * 100) / 100,
                price_trend: trend,
                discount_frequency: row.discount_days || 0
            };
        });

        const totalValue = analysisData.reduce((sum, item) => sum + item.current_price, 0);
        const avgVolatility = analysisData.reduce((sum, item) => sum + item.price_volatility, 0) / analysisData.length;

        return {
            report_type: 'price_analysis',
            period: period,
            generated_at: new Date().toISOString(),
            data: {
                products_analyzed: analysisData.length,
                most_volatile_products: analysisData.slice(0, 10),
                price_trends: {
                    increasing: analysisData.filter(p => p.price_trend === 'increasing').length,
                    decreasing: analysisData.filter(p => p.price_trend === 'decreasing').length,
                    stable: analysisData.filter(p => p.price_trend === 'stable').length
                },
                discount_activity: {
                    products_with_discounts: analysisData.filter(p => p.discount_frequency > 0).length,
                    avg_discount_frequency: analysisData.reduce((sum, p) => sum + p.discount_frequency, 0) / analysisData.length
                }
            },
            summary: {
                total_value: Math.round(totalValue),
                change_percentage: Math.round(avgVolatility * 100) / 100,
                trend: avgVolatility > 15 ? 'up' : avgVolatility < 5 ? 'stable' : 'down'
            }
        };
    }

    async generateStockAnalysisReport(period: string = '3 months'): Promise<BusinessReport> {
        const stockAnalysis = await this.env.PUMO_DB.prepare(`
            SELECT 
                ph.product_id,
                ph.name as product_name,
                ph.stock_quantity as current_stock,
                stock_stats.avg_stock,
                stock_stats.min_stock,
                stock_stats.max_stock,
                stock_stats.out_of_stock_days,
                stock_stats.stock_changes,
                stock_stats.alert_count
            FROM (
                SELECT product_id, name, stock_quantity,
                       ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY scraped_at DESC) as rn
                FROM product_history
            ) ph
            LEFT JOIN (
                SELECT 
                    product_id,
                    AVG(stock_quantity) as avg_stock,
                    MIN(stock_quantity) as min_stock,
                    MAX(stock_quantity) as max_stock,
                    SUM(CASE WHEN stock_quantity = 0 THEN 1 ELSE 0 END) as out_of_stock_days,
                    COUNT(*) as stock_changes
                FROM product_history 
                WHERE scraped_at > datetime('now', '-3 months')
                GROUP BY product_id
            ) stock_stats ON ph.product_id = stock_stats.product_id
            LEFT JOIN (
                SELECT product_id, COUNT(*) as alert_count
                FROM stock_history 
                WHERE alert_threshold_reached = TRUE 
                  AND recorded_at > datetime('now', '-3 months')
                GROUP BY product_id
            ) alerts ON ph.product_id = alerts.product_id
            WHERE ph.rn = 1
            ORDER BY stock_stats.out_of_stock_days DESC, alerts.alert_count DESC
            LIMIT 100
        `).all();

        const analysisData: StockAnalysis[] = stockAnalysis.results.map((row: any) => {
            const turnoverRate = row.avg_stock > 0 ? (row.stock_changes / row.avg_stock) * 30 : 0;
            let recommendedAction = 'monitor';

            if (row.current_stock === 0) {
                recommendedAction = 'urgent_restock';
            } else if (row.current_stock <= 5) {
                recommendedAction = 'low_stock_alert';
            } else if (row.out_of_stock_days > 7) {
                recommendedAction = 'improve_inventory_management';
            } else if (turnoverRate < 1) {
                recommendedAction = 'reduce_inventory';
            } else if (turnoverRate > 10) {
                recommendedAction = 'increase_inventory';
            }

            return {
                product_id: row.product_id,
                product_name: row.product_name,
                current_stock: row.current_stock,
                avg_stock_3m: Math.round(row.avg_stock || 0),
                stock_turnover_rate: Math.round(turnoverRate * 100) / 100,
                days_out_of_stock: row.out_of_stock_days || 0,
                restock_frequency: Math.round((row.stock_changes || 0) / 90 * 30), // per month
                stock_alerts_count: row.alert_count || 0,
                recommended_action: recommendedAction
            };
        });

        const totalCurrentStock = analysisData.reduce((sum, item) => sum + item.current_stock, 0);
        const outOfStockProducts = analysisData.filter(p => p.current_stock === 0).length;

        return {
            report_type: 'stock_analysis',
            period: period,
            generated_at: new Date().toISOString(),
            data: {
                products_analyzed: analysisData.length,
                critical_stock_issues: analysisData.filter(p =>
                    p.recommended_action === 'urgent_restock' ||
                    p.recommended_action === 'low_stock_alert'
                ),
                inventory_recommendations: {
                    urgent_restock: analysisData.filter(p => p.recommended_action === 'urgent_restock').length,
                    low_stock_alert: analysisData.filter(p => p.recommended_action === 'low_stock_alert').length,
                    reduce_inventory: analysisData.filter(p => p.recommended_action === 'reduce_inventory').length,
                    increase_inventory: analysisData.filter(p => p.recommended_action === 'increase_inventory').length
                },
                stock_metrics: {
                    total_products_analyzed: analysisData.length,
                    out_of_stock_products: outOfStockProducts,
                    avg_turnover_rate: analysisData.reduce((sum, p) => sum + p.stock_turnover_rate, 0) / analysisData.length,
                    products_with_alerts: analysisData.filter(p => p.stock_alerts_count > 0).length
                }
            },
            summary: {
                total_value: totalCurrentStock,
                change_percentage: (outOfStockProducts / analysisData.length) * 100,
                trend: outOfStockProducts > analysisData.length * 0.1 ? 'down' :
                    outOfStockProducts < analysisData.length * 0.05 ? 'up' : 'stable'
            }
        };
    }

    async generateBusinessOverviewReport(): Promise<BusinessReport> {
        const overview = await this.env.PUMO_DB.prepare(`
            SELECT 
                COUNT(DISTINCT product_id) as total_products,
                AVG(price) as avg_price,
                SUM(price * stock_quantity) as total_inventory_value,
                COUNT(CASE WHEN stock_quantity > 0 THEN 1 END) as available_products,
                COUNT(CASE WHEN price_promo IS NOT NULL THEN 1 END) as products_on_sale
            FROM (
                SELECT DISTINCT product_id, price, stock_quantity, price_promo
                FROM product_history 
                WHERE scraped_at > datetime('now', '-1 day')
            ) latest
        `).first();

        // Trend z ostatnich 7 dni
        const weeklyTrend = await this.env.PUMO_DB.prepare(`
            SELECT 
                DATE(scraped_at) as date,
                COUNT(DISTINCT product_id) as daily_products,
                AVG(price) as daily_avg_price,
                SUM(stock_quantity) as daily_total_stock
            FROM product_history 
            WHERE scraped_at > datetime('now', '-7 days')
            GROUP BY DATE(scraped_at)
            ORDER BY date DESC
        `).all();

        const recentMetrics = await this.env.PUMO_DB.prepare(`
            SELECT * FROM business_metrics 
            ORDER BY metric_date DESC 
            LIMIT 7
        `).all();

        return {
            report_type: 'business_overview',
            period: 'current',
            generated_at: new Date().toISOString(),
            data: {
                current_snapshot: overview,
                weekly_trends: weeklyTrend.results,
                key_metrics: recentMetrics.results,
                alerts: {
                    low_stock_products: await this.getLowStockAlerts(),
                    price_changes: await this.getRecentPriceChanges(),
                    new_products: await this.getNewProducts()
                }
            },
            summary: {
                total_value: Math.round(overview.total_inventory_value || 0),
                change_percentage: await this.calculateWeeklyChange(),
                trend: 'stable' // będzie obliczone dynamicznie
            }
        };
    }

    private async getLowStockAlerts(): Promise<any[]> {
        const alerts = await this.env.PUMO_DB.prepare(`
            SELECT product_id, name, stock_quantity
            FROM (
                SELECT product_id, name, stock_quantity,
                       ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY scraped_at DESC) as rn
                FROM product_history
            ) latest
            WHERE rn = 1 AND stock_quantity <= 5
            ORDER BY stock_quantity ASC
            LIMIT 10
        `).all();

        return alerts.results;
    }

    private async getRecentPriceChanges(): Promise<any[]> {
        const changes = await this.env.PUMO_DB.prepare(`
            SELECT product_id, regular_price, previous_price, price_change_type
            FROM price_history 
            WHERE recorded_at > datetime('now', '-7 days')
              AND price_change_type IN ('increase', 'decrease', 'promo_start', 'promo_end')
            ORDER BY recorded_at DESC
            LIMIT 10
        `).all();

        return changes.results;
    }

    private async getNewProducts(): Promise<any[]> {
        const newProducts = await this.env.PUMO_DB.prepare(`
            SELECT product_id, name, price, category
            FROM product_history 
            WHERE scraped_at > datetime('now', '-7 days')
              AND changes_detected LIKE '%new_product%'
            ORDER BY scraped_at DESC
            LIMIT 10
        `).all();

        return newProducts.results;
    }

    private async calculateWeeklyChange(): Promise<number> {
        const thisWeek = await this.env.PUMO_DB.prepare(`
            SELECT SUM(price * stock_quantity) as value
            FROM (
                SELECT DISTINCT product_id, price, stock_quantity
                FROM product_history 
                WHERE scraped_at > datetime('now', '-7 days')
            ) current_week
        `).first();

        const lastWeek = await this.env.PUMO_DB.prepare(`
            SELECT SUM(price * stock_quantity) as value
            FROM (
                SELECT DISTINCT product_id, price, stock_quantity
                FROM product_history 
                WHERE scraped_at BETWEEN datetime('now', '-14 days') AND datetime('now', '-7 days')
            ) last_week
        `).first();

        if (!lastWeek?.value || lastWeek.value === 0) return 0;

        return Math.round(((thisWeek?.value || 0) - lastWeek.value) / lastWeek.value * 100 * 100) / 100;
    }
}

// GET endpoint - Lista dostępnych raportów i ostatnie raporty
export const GET: APIRoute = async (context) => {
    return withSimpleMiddleware(
        'whitecat-products',
        context,
        'public',
        async (ctx, requestContext) => {
            const runtime = (ctx.locals as any)?.runtime;
            const env = runtime?.env;
            const url = new URL(ctx.request.url);
            const reportType = url.searchParams.get('type');
            const period = url.searchParams.get('period') || '3 months';

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
                const analytics = new BusinessAnalyticsEngine(env);

                if (reportType) {
                    // Generuj konkretny raport
                    let report: BusinessReport;

                    switch (reportType) {
                        case 'price_analysis':
                            report = await analytics.generatePriceAnalysisReport(period);
                            break;
                        case 'stock_analysis':
                            report = await analytics.generateStockAnalysisReport(period);
                            break;
                        case 'business_overview':
                            report = await analytics.generateBusinessOverviewReport();
                            break;
                        default:
                            return new Response(JSON.stringify({
                                success: false,
                                error: 'Unknown report type'
                            }), {
                                status: 400,
                                headers: { 'Content-Type': 'application/json' }
                            });
                    }

                    return new Response(JSON.stringify({
                        success: true,
                        report
                    }), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    });
                } else {
                    // Lista dostępnych raportów
                    return new Response(JSON.stringify({
                        success: true,
                        available_reports: [
                            {
                                type: 'business_overview',
                                name: 'Przegląd Biznesowy',
                                description: 'Ogólny przegląd kluczowych metryk biznesowych',
                                url: '/api/business-analytics?type=business_overview'
                            },
                            {
                                type: 'price_analysis',
                                name: 'Analiza Cen',
                                description: 'Szczegółowa analiza trendów cenowych i konkurencyjności',
                                url: '/api/business-analytics?type=price_analysis'
                            },
                            {
                                type: 'stock_analysis',
                                name: 'Analiza Stanów Magazynowych',
                                description: 'Analiza dostępności produktów i zarządzania zapasami',
                                url: '/api/business-analytics?type=stock_analysis'
                            }
                        ],
                        usage_examples: [
                            'GET /api/business-analytics?type=business_overview',
                            'GET /api/business-analytics?type=price_analysis&period=1 month',
                            'GET /api/business-analytics?type=stock_analysis&period=6 months'
                        ]
                    }), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }

            } catch (error: any) {
                console.error('❌ Business analytics error:', error);
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