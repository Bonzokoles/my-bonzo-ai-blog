/**
 * Debug PUMO Endpoint - Simple Test
 */

import { withFeatureMiddleware } from '@/middleware/api-middleware';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
    return withFeatureMiddleware(
        'whitecat-products',
        context,
        'public',
        async (ctx) => {
            const runtime = (ctx.locals as any)?.runtime;
            const env = runtime?.env;

            try {
                return new Response(JSON.stringify({
                    success: true,
                    debug: 'PUMO Debug Endpoint Working',
                    env_check: {
                        has_runtime: !!runtime,
                        has_env: !!env,
                        has_db: !!env?.DB,
                        has_pumo_db: !!env?.PUMO_DB,
                        has_ai: !!env?.AI
                    },
                    timestamp: new Date().toISOString()
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });

            } catch (error: any) {
                return new Response(JSON.stringify({
                    success: false,
                    error: error.message,
                    stack: error.stack
                }), { status: 500, headers: { 'Content-Type': 'application/json' } });
            }
        }
    );
};