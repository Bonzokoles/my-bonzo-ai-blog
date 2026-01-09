/**
 * UTM Tracking Test Endpoint
 */
import type { APIRoute } from 'astro';

export const POST: APIRoute = async (context) => {
    const runtime = (context.locals as any)?.runtime;
    const env = runtime?.env;

    if (!env?.PUMO_DB) {
        return new Response(JSON.stringify({
            error: 'PUMO_DB not available'
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        const body = await context.request.json();
        
        // Track click event
        await env.PUMO_DB.prepare(`
            INSERT INTO analytics_events (
                event_type, product_id, source, 
                utm_source, utm_medium, utm_campaign,
                session_id, timestamp
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            'product_click',
            body.product_id || '15956',
            'mybonzo_test',
            'mybonzo',
            'ai_guide',
            'whitecat_test',
            'test_session_' + Date.now(),
            new Date().toISOString()
        ).run();

        return new Response(JSON.stringify({
            success: true,
            message: 'UTM click tracked',
            data: body
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        return new Response(JSON.stringify({
            error: error instanceof Error ? error.message : 'Tracking failed'
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};

export const GET: APIRoute = async (context) => {
    const runtime = (context.locals as any)?.runtime;
    const env = runtime?.env;

    if (!env?.PUMO_DB) {
        return new Response(JSON.stringify({
            error: 'PUMO_DB not available'
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        // Get analytics stats
        const [events, revenue] = await Promise.all([
            env.PUMO_DB.prepare('SELECT COUNT(*) as total_clicks FROM analytics_events WHERE event_type = ?').bind('product_click').first(),
            env.PUMO_DB.prepare('SELECT COUNT(*) as total_orders, SUM(revenue) as total_revenue FROM revenue_attribution').first()
        ]);

        const recentClicks = await env.PUMO_DB.prepare(`
            SELECT product_id, utm_source, utm_campaign, timestamp 
            FROM analytics_events 
            ORDER BY timestamp DESC 
            LIMIT 10
        `).all();

        return new Response(JSON.stringify({
            success: true,
            analytics: {
                total_clicks: (events as any)?.total_clicks || 0,
                total_orders: (revenue as any)?.total_orders || 0,
                total_revenue: (revenue as any)?.total_revenue || 0,
                recent_clicks: recentClicks.results
            }
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        return new Response(JSON.stringify({
            error: error instanceof Error ? error.message : 'Analytics failed'
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};