/**
 * Database Migration: Create Analytics Table
 * Creates table for UTM tracking and analytics
 */
import type { APIRoute } from 'astro';

const ANALYTICS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS analytics_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL DEFAULT 'utm_click',
    url TEXT NOT NULL,
    utm_source TEXT,
    utm_medium TEXT, 
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TEXT NOT NULL,
    
    -- Indexes for performance
    INDEX idx_event_type ON analytics_events(event_type),
    INDEX idx_created_at ON analytics_events(created_at),
    INDEX idx_utm_source ON analytics_events(utm_source),
    INDEX idx_utm_medium ON analytics_events(utm_medium),
    INDEX idx_utm_campaign ON analytics_events(utm_campaign)
);
`;

export const POST: APIRoute = async ({ locals }) => {
    try {
        // @ts-ignore
        const env = locals.runtime?.env;

        if (!env?.DB) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Database not available'
            }), { status: 500 });
        }

        // Create the analytics table
        await env.DB.exec(ANALYTICS_TABLE_SQL);

        // Verify table was created
        const { results } = await env.DB.prepare(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='analytics_events'"
        ).all();

        if (results.length === 0) {
            throw new Error('Table creation verification failed');
        }

        return new Response(JSON.stringify({
            success: true,
            message: 'Analytics table created successfully',
            data: {
                table_name: 'analytics_events',
                created_at: new Date().toISOString(),
                schema: {
                    columns: [
                        'id (PRIMARY KEY)',
                        'event_type (utm_click, page_view, conversion)',
                        'url, utm_source, utm_medium, utm_campaign, utm_term, utm_content',
                        'ip_address, user_agent, created_at'
                    ],
                    indexes: [
                        'idx_event_type', 'idx_created_at',
                        'idx_utm_source', 'idx_utm_medium', 'idx_utm_campaign'
                    ]
                }
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('[Analytics Migration] Error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Migration failed'
        }), { status: 500 });
    }
};

// Get current table status
export const GET: APIRoute = async ({ locals }) => {
    try {
        // @ts-ignore
        const env = locals.runtime?.env;

        if (!env?.DB) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Database not available'
            }), { status: 500 });
        }

        try {
            // Check if table exists
            const { results: tableCheck } = await env.DB.prepare(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='analytics_events'"
            ).all();

            if (tableCheck.length === 0) {
                return new Response(JSON.stringify({
                    success: false,
                    table_exists: false,
                    message: 'Analytics table does not exist',
                    action: 'POST to this endpoint to create table'
                }), { status: 404 });
            }

            // Get table info
            const { results: tableInfo } = await env.DB.prepare(
                "PRAGMA table_info(analytics_events)"
            ).all();

            // Get record count
            const { results: countResult } = await env.DB.prepare(
                "SELECT COUNT(*) as count FROM analytics_events"
            ).all();

            const recordCount = (countResult[0] as any)?.count || 0;

            return new Response(JSON.stringify({
                success: true,
                table_exists: true,
                record_count: recordCount,
                schema: tableInfo,
                endpoints: {
                    'POST /api/analytics/utm-tracking': 'Track UTM clicks',
                    'GET /api/analytics/utm-tracking': 'Get stats',
                    'POST /api/analytics/setup-db': 'Create table (this endpoint)',
                    'GET /api/analytics/setup-db': 'Check table status (this endpoint)'
                }
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });

        } catch (dbError) {
            return new Response(JSON.stringify({
                success: false,
                table_exists: false,
                error: 'Database access failed',
                message: 'Run POST to create analytics table'
            }), { status: 404 });
        }

    } catch (error) {
        console.error('[Analytics Setup Check] Error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }), { status: 500 });
    }
};