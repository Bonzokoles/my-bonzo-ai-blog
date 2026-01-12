/**
 * WHITECAT Simple API - Direct DB access
 */
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
    try {
        // Direct runtime access
        const runtime = (context.locals as any)?.runtime;
        const env = runtime?.env;

        if (!env || !env.DB) {
            return Response.json({
                success: false,
                error: 'Database not available',
                debug: {
                    hasRuntime: !!runtime,
                    hasEnv: !!env,
                    hasDB: !!(env?.DB)
                }
            }, { status: 500 });
        }

        // Simple query
        const result = await env.DB.prepare('SELECT COUNT(*) as count FROM products').first();

        return Response.json({
            success: true,
            products: result?.count || 0,
            message: 'WHITECAT Simple API working'
        });

    } catch (error) {
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
};