/**
 * Simple WHITECAT Test - bez middleware
 */
import { getProductManager } from '@/lib/whitecat/product-manager-d1';
import { getGuideGenerator } from '@/lib/whitecat/guide-generator';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
    const runtime = (context.locals as any)?.runtime;
    const env = runtime?.env;

    try {
        console.log('🎯 Simple WHITECAT Test - start');
        
        if (!env || !env.DB) {
            return new Response(JSON.stringify({
                error: 'Missing env or DB binding'
            }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        const productManager = getProductManager(env);
        const guideGenerator = getGuideGenerator(env);

        console.log('🎯 Managers created, testing stats...');
        
        // Test tylko product stats
        const productStats = await productManager.getStats();
        console.log('🎯 Product stats OK:', productStats);

        // Test guide stats
        const guideStats = await guideGenerator.getStats();
        console.log('🎯 Guide stats OK:', guideStats);

        return new Response(JSON.stringify({
            success: true,
            data: {
                products: productStats,
                guides: guideStats
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('❌ Simple WHITECAT Test error:', error);
        return new Response(JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};