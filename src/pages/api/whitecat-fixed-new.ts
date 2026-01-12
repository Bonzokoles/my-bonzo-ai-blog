/**
 * WHITECAT API Endpoint - Fixed version  
 * Only product manager, no guide generator for now
 */
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
    try {
        const url = new URL(context.request.url);
        const action = url.searchParams.get('action') || 'stats';
        const category = url.searchParams.get('category');

        // Direct runtime access
        const runtime = (context.locals as any)?.runtime;
        const env = runtime?.env;

        if (!env || !env.DB) {
            return Response.json({
                success: false,
                error: 'Database not available'
            }, { status: 500 });
        }

        switch (action) {
            case 'stats': {
                // Simple query for product stats
                const result = await env.DB.prepare('SELECT COUNT(*) as count FROM products').first();
                const categoryResult = await env.DB.prepare('SELECT COUNT(DISTINCT category) as categories FROM products').first();

                return Response.json({
                    success: true,
                    data: {
                        total_products: result?.count || 0,
                        categories_count: categoryResult?.categories || 0,
                        version: 'v2.0-fixed'
                    }
                });
            }

            case 'categories': {
                const result = await env.DB.prepare(`
                    SELECT category, COUNT(*) as product_count 
                    FROM products 
                    GROUP BY category 
                    ORDER BY product_count DESC
                `).all();

                return Response.json({
                    success: true,
                    data: result?.results || []
                });
            }

            case 'products': {
                const limit = parseInt(url.searchParams.get('limit') || '20');
                
                let query = 'SELECT * FROM products';
                let params: any[] = [];
                
                if (category) {
                    query += ' WHERE category = ?';
                    params.push(category);
                }
                
                query += ' LIMIT ?';
                params.push(limit);

                const result = await env.DB.prepare(query).bind(...params).all();

                return Response.json({
                    success: true,
                    data: result?.results || [],
                    count: result?.results?.length || 0
                });
            }

            default:
                return Response.json({
                    success: false,
                    error: 'Unknown action. Available: stats, categories, products'
                }, { status: 400 });
        }
    } catch (error) {
        console.error('❌ WHITECAT API error:', error);
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error'
        }, { status: 500 });
    }
};