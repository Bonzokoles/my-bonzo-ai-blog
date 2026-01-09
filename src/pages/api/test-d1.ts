/**
 * Simple D1 Test - bez middleware
 */
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
    const runtime = (context.locals as any)?.runtime;
    const env = runtime?.env;

    try {
        if (!env?.DB) {
            return new Response(JSON.stringify({
                success: false,
                error: 'DB binding not found',
                available_bindings: Object.keys(env || {})
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Test basic D1 query
        const result = await env.DB.prepare('SELECT COUNT(*) as count FROM products').first();

        return new Response(JSON.stringify({
            success: true,
            data: {
                db_working: true,
                product_count: result?.count || 0,
                bindings: Object.keys(env).filter(key => key.includes('DB') || key.includes('VECTOR'))
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        return new Response(JSON.stringify({
            success: false,
            error: 'D1 test failed',
            details: error.message,
            stack: error.stack
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};