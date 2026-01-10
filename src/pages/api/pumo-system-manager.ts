/**
 * PUMO System Manager
 * Centralny endpoint do zarządzania systemem Meble Pumo
 */

import { withSimpleMiddleware } from '@/middleware/simple-middleware';
import type { APIRoute } from 'astro';

interface SystemStatus {
    databases_connected: boolean;
    last_sync: string | null;
    product_counts: {
        pumo_db: number;
        rag_db: number;
        sync_needed: boolean;
    };
    available_actions: string[];
}

export const GET: APIRoute = async (context) => {
    return withSimpleMiddleware(
        'whitecat-products',
        context,
        'public',
        async (ctx) => {
            const runtime = (ctx.locals as any)?.runtime;
            const env = runtime?.env;

            try {
                const status: SystemStatus = {
                    databases_connected: !!(env?.DB && env?.PUMO_DB),
                    last_sync: null,
                    product_counts: {
                        pumo_db: 0,
                        rag_db: 0,
                        sync_needed: false
                    },
                    available_actions: [
                        'sync-availability',
                        'test-connection',
                        'update-products',
                        'check-changes'
                    ]
                };

                if (env?.DB && env?.PUMO_DB) {
                    const [pumoCount, ragCount] = await Promise.all([
                        env.PUMO_DB.prepare('SELECT COUNT(*) as count FROM products WHERE deleted_at IS NULL').first(),
                        env.DB.prepare('SELECT COUNT(*) as count FROM products WHERE deleted_at IS NULL').first()
                    ]);

                    status.product_counts.pumo_db = pumoCount.count;
                    status.product_counts.rag_db = ragCount.count;
                    status.product_counts.sync_needed = pumoCount.count !== ragCount.count;
                }

                return new Response(JSON.stringify({
                    success: true,
                    system: 'MyBonzo × Meble Pumo Integration',
                    status,
                    endpoints: {
                        manager: 'GET/POST /api/pumo-system-manager',
                        availability_sync: 'GET/POST /api/pumo-availability-sync',
                        rag_chat: 'GET/POST /api/rag-chat',
                        utm_tracking: 'GET/POST /api/utm-tracking',
                        product_availability: 'GET/POST /api/check-product-availability'
                    },
                    connections: {
                        databases: {
                            main_rag: { connected: !!env?.DB, products: status.product_counts.rag_db },
                            pumo_products: { connected: !!env?.PUMO_DB, products: status.product_counts.pumo_db }
                        },
                        external_apis: {
                            meble_pumo_scraping: { status: 'available' },
                            utm_tracking: { status: 'active' }
                        }
                    },
                    timestamp: new Date().toISOString()
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });

            } catch (error: any) {
                return new Response(JSON.stringify({
                    success: false,
                    error: error.message
                }), { status: 500, headers: { 'Content-Type': 'application/json' } });
            }
        }
    );
};

export const POST: APIRoute = async (context) => {
    return withSimpleMiddleware(
        'whitecat-products',
        context,
        'admin',
        async (ctx) => {
            const { action } = await ctx.request.json();

            switch (action) {
                case 'sync-availability':
                    // Trigger availability sync
                    const syncResponse = await fetch(`${ctx.url.origin}/api/pumo-availability-sync`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' }
                    });
                    const syncResult = await syncResponse.json();

                    return new Response(JSON.stringify({
                        success: true,
                        action: 'sync-availability',
                        result: syncResult
                    }), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    });

                case 'test-connection':
                    // Test all connections
                    const runtime = (ctx.locals as any)?.runtime;
                    const env = runtime?.env;

                    const tests = {
                        main_db: !!env?.DB,
                        pumo_db: !!env?.PUMO_DB,
                        vectorize: !!env?.VECTORIZE_INDEX,
                        ai_model: !!env?.AI
                    };

                    return new Response(JSON.stringify({
                        success: true,
                        action: 'test-connection',
                        tests,
                        all_connected: Object.values(tests).every(t => t)
                    }), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    });

                default:
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'Unknown action',
                        available_actions: [
                            'sync-availability',
                            'test-connection'
                        ]
                    }), { status: 400, headers: { 'Content-Type': 'application/json' } });
            }
        }
    );
};