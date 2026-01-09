
import type { APIRoute } from 'astro';
import { SitemapSync } from '../../../../lib/whitecat/sitemap-sync';

export const GET: APIRoute = async (context) => {
    const { id } = context.params;
    const url = new URL(context.request.url);
    const campaign = url.searchParams.get('campaign') || 'direct';

    // Get env from context locals
    const runtime = (context.locals as any)?.runtime;
    const env = runtime?.env;

    if (!id) {
        return new Response(JSON.stringify({
            success: false,
            error: 'Product ID required'
        }), { status: 400 });
    }

    if (!env) {
        return new Response(JSON.stringify({
            success: false,
            error: 'Missing runtime environment'
        }), { status: 500 });
    }

    try {
        const sync = new SitemapSync(env);
        const trackedUrl = await sync.generateTrackedUrl(id, campaign);

        return new Response(JSON.stringify({
            success: true,
            data: { product_id: id, tracked_url: trackedUrl }
        }));
    } catch (error: any) {
        return new Response(JSON.stringify({
            success: false,
            error: error.message
        }), { status: 500 });
    }
};
