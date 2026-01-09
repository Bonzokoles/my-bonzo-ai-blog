import type { APIRoute } from 'astro';
import { SitemapSync } from '../../../lib/whitecat/sitemap-sync';

export const POST: APIRoute = async (context) => {
    // Get env from context locals
    const runtime = (context.locals as any)?.runtime;
    const env = runtime?.env;

    if (!env) {
        return new Response(JSON.stringify({
            success: false,
            error: 'Missing runtime environment'
        }), { status: 500 });
    }

    try {
        const sync = new SitemapSync(env);
        const result = await sync.syncProductUrls();

        return new Response(JSON.stringify({
            success: true,
            data: result,
            message: 'Product URLs synced from sitemap'
        }));
    } catch (error: any) {
        return new Response(JSON.stringify({
            success: false,
            error: error.message
        }), { status: 500 });
    }
};
