/**
 * Debug endpoint dla pumo-api-sync
 */

import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
    try {
        const runtime = (context.locals as any)?.runtime;
        const env = runtime?.env;

        return new Response(JSON.stringify({
            success: true,
            debug: {
                hasRuntime: !!runtime,
                hasEnv: !!env,
                hasPUMO_DB: !!env?.PUMO_DB,
                hasPUMO_API_KEY: !!env?.PUMO_API_KEY,
                environment: typeof process === 'undefined' ? 'cloudflare' : 'node',
                timestamp: new Date().toISOString()
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({
            success: false,
            error: error.message,
            stack: error.stack
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};