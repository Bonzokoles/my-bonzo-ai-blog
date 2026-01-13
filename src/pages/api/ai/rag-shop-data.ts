/**
 * API Route: /api/ai/rag-shop-data
 * Real-time shop data from IdoSell for RAG system
 */
import type { APIRoute } from 'astro';

const JIMBO77_API_BASE = 'http://localhost:8001/v1/idosell';

export const GET: APIRoute = async ({ request }) => {
    try {
        // Pobierz aktualne dane z JIMBO77 API
        const response = await fetch(`${JIMBO77_API_BASE}/blog-rag-data`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`JIMBO77 API error: ${response.status}`);
        }

        const shopData = await response.json();

        // Przygotuj dane RAG dla AI chat
        const ragContext = {
            shop: {
                name: 'Meble Pumo',
                status: shopData.business_data?.live_metrics?.shop_activity || 'unknown',
                todayOrders: shopData.business_data?.live_metrics?.today_orders || 0,
                todayRevenue: shopData.business_data?.live_metrics?.today_revenue || 0,
                totalOrders: shopData.business_data?.analytics?.total_orders || 0,
                avgOrderValue: shopData.business_data?.analytics?.average_order_value || 0
            },
            context: shopData.rag_prompts || {},
            updatedAt: shopData.updated_at || new Date().toISOString()
        };

        return new Response(JSON.stringify(ragContext), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'max-age=300' // Cache 5 minutes
            }
        });

    } catch (error) {
        console.error('Shop RAG data error:', error);

        // Fallback data when IdoSell is not available
        const fallbackData = {
            shop: {
                name: 'Meble Pumo',
                status: 'offline',
                todayOrders: 0,
                todayRevenue: 0,
                totalOrders: 0,
                avgOrderValue: 0
            },
            context: {
                business_summary: 'Meble Pumo - sklep meblowy online (dane niedostępne)',
                current_status: 'System shop data obecnie niedostępny',
                recommendations: 'Sprawdź status połączenia z API sklepu'
            },
            updatedAt: new Date().toISOString(),
            error: 'Shop data temporarily unavailable'
        };

        return new Response(JSON.stringify(fallbackData), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};

export const POST: APIRoute = async ({ request }) => {
    try {
        // Force refresh shop data
        const refreshResponse = await fetch(`${JIMBO77_API_BASE}/sync-to-blog`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!refreshResponse.ok) {
            throw new Error(`Sync failed: ${refreshResponse.status}`);
        }

        const result = await refreshResponse.json();

        return new Response(JSON.stringify({
            status: 'success',
            message: 'Shop data refreshed for RAG system',
            syncResult: result,
            updatedAt: new Date().toISOString()
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('Shop data refresh error:', error);

        return new Response(JSON.stringify({
            status: 'error',
            message: 'Failed to refresh shop data',
            error: error.message,
            updatedAt: new Date().toISOString()
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};