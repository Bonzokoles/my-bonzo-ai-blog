/**
 * Debug WHITECAT API Endpoint
 * Testowy endpoint bez middleware
 */
import { getGuideGenerator } from '@/lib/whitecat/guide-generator';
import { getProductManager } from '@/lib/whitecat/product-manager-d1';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
    const url = new URL(context.request.url);
    const test = url.searchParams.get('test') || 'basic';

    const runtime = (context.locals as any)?.runtime;
    const env = runtime?.env;

    try {
        console.log('🔍 Debug WHITECAT API - env check:', !!env);
        console.log('🔍 Debug WHITECAT API - DB check:', !!env?.DB);

        if (!env || !env.DB) {
            return new Response(JSON.stringify({
                error: 'Missing environment or DB binding',
                env_available: !!env,
                db_available: !!env?.DB
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const productManager = getProductManager(env);
        console.log('🔍 Debug WHITECAT API - productManager:', !!productManager);

        if (test === 'guide') {
            // Test guide generator
            const guideGenerator = getGuideGenerator(env);
            console.log('🔍 Debug WHITECAT API - guideGenerator:', !!guideGenerator);

            const guideStats = await guideGenerator.getStats();

            return new Response(JSON.stringify({
                success: true,
                test: 'guide-generator',
                data: {
                    guide_stats: guideStats,
                    env_available: !!env,
                    db_available: !!env?.DB
                }
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (test === 'stats') {
            // Test product manager stats
            const productStats = await productManager.getStats();

            return new Response(JSON.stringify({
                success: true,
                test: 'product-stats',
                data: {
                    product_stats: productStats,
                    env_available: !!env,
                    db_available: !!env?.DB
                }
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        // Simple DB test
        const result = await env.DB.prepare('SELECT COUNT(*) as count FROM products').first();

        return new Response(JSON.stringify({
            success: true,
            debug: {
                env_available: !!env,
                db_available: !!env.DB,
                product_manager: !!productManager,
                db_test: result
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('❌ Debug WHITECAT API error:', error);
        return new Response(JSON.stringify({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};