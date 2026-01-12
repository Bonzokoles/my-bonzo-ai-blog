/**
 * WHITECAT API Endpoint - Fixed version  
 * Only product manager, no guide generator for now
 */
import { getProductManager } from '@/lib/whitecat/product-manager-d1';
import { withFeatureMiddleware } from '@/middleware/api-middleware';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
    return withFeatureMiddleware(
        'whitecat-guides',
        context,
        'public',
        async (ctx, requestContext) => {
            const url = new URL(ctx.request.url);
            const action = url.searchParams.get('action') || 'stats';
            const category = url.searchParams.get('category');

            const runtime = (ctx.locals as any)?.runtime;
            const env = runtime?.env;

            if (!env || !env.DB) {
                return new Response(JSON.stringify({
                    success: false,
                    error: 'Database not available'
                }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            try {
                switch (action) {
                    case 'stats': {
                        const productManager = getProductManager(env);
                        await productManager.initialize();
                        const productStats = await productManager.getStats();

                        return new Response(JSON.stringify({
                            success: true,
                            data: {
                                products: productStats,
                                system: 'WHITECAT Integration',
                                version: '1.0.0'
                            }
                        }), {
                            status: 200,
                            headers: { 'Content-Type': 'application/json' }
                        });
                    }

                    case 'categories': {
                        const productManager = getProductManager(env);
                        await productManager.initialize();
                        const categories = await productManager.getCategories();

                        return new Response(JSON.stringify({
                            success: true,
                            data: categories
                        }), {
                            status: 200,
                            headers: { 'Content-Type': 'application/json' }
                        });
                    }

                    case 'products': {
                        const productManager = getProductManager(env);
                        await productManager.initialize();
                        const limit = parseInt(url.searchParams.get('limit') || '20');

                        let products;
                        if (category) {
                            products = await productManager.getProductsByCategory(category, limit);
                        } else {
                            products = await productManager.getAllProducts(limit);
                        }

                        return new Response(JSON.stringify({
                            success: true,
                            data: products,
                            count: products.length
                        }), {
                            status: 200,
                            headers: { 'Content-Type': 'application/json' }
                        });
                    }

                    default:
                        return new Response(JSON.stringify({
                            success: false,
                            error: 'Unknown action. Available: stats, categories, products'
                        }), {
                            status: 400,
                            headers: { 'Content-Type': 'application/json' }
                        });
                }
            } catch (error) {
                console.error('❌ WHITECAT API error:', error);
                return new Response(JSON.stringify({
                    success: false,
                    error: error instanceof Error ? error.message : 'Internal server error'
                }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }
    );
};