/**
 * WHITECAT API Endpoint - Bez middleware (TEMP)
 * Generowanie przewodników zakupowych z UTM tracking
 */
import { getGuideGenerator } from '@/lib/whitecat/guide-generator';
import { getProductManager } from '@/lib/whitecat/product-manager-d1';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
    try {
        const url = new URL(context.request.url);
        const action = url.searchParams.get('action') || 'stats';
        const category = url.searchParams.get('category');

        const runtime = (context.locals as any)?.runtime;
        const env = runtime?.env;

        switch (action) {
            case 'stats': {
                const generator = getGuideGenerator(env);
                const productManager = getProductManager(env);

                const [guideStats, productStats] = await Promise.all([
                    generator.getStats(),
                    productManager.getStats()
                ]);

                return new Response(JSON.stringify({
                    success: true,
                    data: {
                        guides: guideStats,
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
                const categories = await productManager.getCategories();

                return new Response(JSON.stringify({
                    success: true,
                    data: {
                        categories,
                        total: categories.length
                    }
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            case 'products': {
                const productManager = getProductManager(env);

                if (!category) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'Category parameter required for products action'
                    }), { status: 400 });
                }

                const products = await productManager.getProductsByCategory(category);

                return new Response(JSON.stringify({
                    success: true,
                    data: {
                        category,
                        products,
                        total: products.length
                    }
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            case 'search': {
                const query = url.searchParams.get('query');
                const productManager = getProductManager(env);

                if (!query) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'Query parameter required for search'
                    }), { status: 400 });
                }

                const products = await productManager.searchProducts(query, 10);

                return new Response(JSON.stringify({
                    success: true,
                    data: {
                        query,
                        products,
                        total: products.length
                    }
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            default:
                return new Response(JSON.stringify({
                    success: false,
                    error: 'Invalid action. Available: stats, categories, products, search'
                }), { status: 400 });
        }

    } catch (error) {
        console.error('[WHITECAT API] Error:', error);

        return new Response(JSON.stringify({
            success: false,
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

export const POST: APIRoute = async (context) => {
    try {
        const runtime = (context.locals as any)?.runtime;
        const env = runtime?.env;

        const body = await context.request.json();
        const { action, category, data } = body;

        switch (action) {
            case 'generate-guide': {
                const generator = getGuideGenerator(env);
                const guide = await generator.generateCategoryGuide(category);

                return new Response(JSON.stringify({
                    success: true,
                    data: {
                        message: `Guide generated for category: ${category}`,
                        path: `/guides/${guide.metadata.slug}`,
                        metadata: guide.metadata
                    }
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            default:
                return new Response(JSON.stringify({
                    success: false,
                    error: 'Invalid action for POST. Available: generate-guide'
                }), { status: 400 });
        }

    } catch (error) {
        console.error('[WHITECAT POST] Error:', error);

        return new Response(JSON.stringify({
            success: false,
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};