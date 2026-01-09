/**
 * Ultra simple WHITECAT test
 */
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
    const runtime = (context.locals as any)?.runtime;
    const env = runtime?.env;

    return new Response(JSON.stringify({
        test: 'ultra-simple',
        success: true,
        env_check: {
            has_runtime: !!runtime,
            has_env: !!env,
            has_db: !!env?.DB,
            has_pumo_db: !!env?.PUMO_DB,
            all_env_keys: env ? Object.keys(env) : []
        }
    }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};