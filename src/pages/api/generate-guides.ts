/**
 * Direct Guide Generation Endpoint - No Middleware
 */
import { getGuideGenerator } from '@/lib/whitecat/guide-generator';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async (context) => {
    // Get env
    const runtime = (context.locals as any)?.runtime;
    const env = runtime?.env;
    
    // Get params
    const url = new URL(context.request.url);
    const category = url.searchParams.get('category');

    if (!env) {
        return new Response(JSON.stringify({
            success: false,
            error: 'Missing runtime environment'
        }), { status: 500 });
    }

    if (!category) {
        return new Response(JSON.stringify({
            success: false,
            error: 'Category parameter required (e.g. ?category=Łóżka)'
        }), { status: 400 });
    }

    try {
        console.log(`🚀 Triggering guide generation for: ${category}`);
        const generator = getGuideGenerator(env);
        
        // This now includes the tracking logic we added!
        const guide = await generator.generateCategoryGuide(category);

        return new Response(JSON.stringify({
            success: true,
            data: {
                message: `Guide generated with TRACKING links!`,
                path: `/guides/${guide.metadata.slug}`,
                tracked_products_count: guide.metadata.products.length,
                sample_tracked_url: guide.metadata.products[0]?.tracked_url,
                metadata: guide.metadata
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('❌ Guide generation failed:', error);
        return new Response(JSON.stringify({
            success: false,
            error: error.message,
            stack: error.stack
        }), { status: 500 });
    }
};
