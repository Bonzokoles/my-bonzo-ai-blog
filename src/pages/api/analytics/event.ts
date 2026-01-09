import type { APIRoute } from 'astro';

export const POST: APIRoute = async (context) => {
    // Get env from context locals
    const runtime = (context.locals as any)?.runtime;
    const env = runtime?.env;

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (!env) {
        return new Response(JSON.stringify({
            success: false,
            error: 'Missing runtime environment'
        }), { status: 500, headers: corsHeaders });
    }

    try {
        const data = await context.request.json() as {
            event: string;
            category?: string;
            product_id?: string;
            utm_campaign?: string;
        };

        const { event, category, product_id, utm_campaign } = data;

        // Validacja podstawowa
        if (!event) {
             return new Response(JSON.stringify({ error: 'Event type required' }), { status: 400, headers: corsHeaders });
        }

        await env.DB.prepare(`
          INSERT INTO analytics_events (event_type, category, product_id, utm_campaign)
          VALUES (?, ?, ?, ?)
        `).bind(event, category || null, product_id || null, utm_campaign || null).run();
        
        return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });

    } catch (error: any) {
        console.error('Analytics error:', error);
        return new Response(JSON.stringify({ 
          success: false, 
          error: error.message 
        }), { status: 500, headers: corsHeaders });
    }
};

export const OPTIONS: APIRoute = async () => {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    });
};
