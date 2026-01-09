/**
 * Cloudflare Worker - Cron Job for automatic Pumo API synchronization
 * Runs daily at 3 AM UTC to sync products from Meble Pumo API
 */

interface Env {
    PUMO_DB: D1Database;
    PUMO_API_KEY?: string;
    PUMO_API_BASE_URL?: string;
    // Add other environment variables as needed
}

interface ScheduledEvent {
    cron: string;
    scheduledTime: number;
    type: 'scheduled';
}

export default {
    async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
        console.log('🔄 Cron job triggered:', event.cron, new Date(event.scheduledTime));

        // Prevent timeout by using waitUntil
        ctx.waitUntil(performSync(env));
    },

    // Also allow manual triggering via HTTP
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);

        if (url.pathname === '/trigger-sync' && request.method === 'POST') {
            console.log('🔄 Manual sync trigger via HTTP');

            try {
                const result = await performSync(env);

                return new Response(JSON.stringify({
                    success: true,
                    message: 'Sync completed successfully',
                    data: result
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });

            } catch (error: any) {
                console.error('❌ Manual sync failed:', error);

                return new Response(JSON.stringify({
                    success: false,
                    error: error.message
                }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }

        return new Response(JSON.stringify({
            message: 'Pumo API Sync Worker',
            endpoints: {
                'POST /trigger-sync': 'Trigger manual sync'
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

async function performSync(env: Env): Promise<any> {
    const syncStartTime = Date.now();
    let syncId: number | null = null;

    try {
        console.log('🚀 Starting automated Pumo API sync...');

        // Check if PUMO_DB is available
        if (!env.PUMO_DB) {
            throw new Error('PUMO_DB not configured');
        }

        if (!env.PUMO_API_KEY) {
            throw new Error('PUMO_API_KEY not configured');
        }

        // Start sync record
        const syncResult = await env.PUMO_DB.prepare(`
      INSERT INTO sync_history (sync_type, started_at, status, metadata)
      VALUES ('cron_sync', ?, 'running', ?)
    `).bind(
            new Date().toISOString(),
            JSON.stringify({ cron: true, trigger: 'scheduled' })
        ).run();

        syncId = syncResult.meta.last_row_id;
        console.log(`📊 Sync record created: #${syncId}`);

        // Call our main API sync endpoint
        const syncApiUrl = 'https://mybonzoaiblog.pages.dev/api/pumo-api-sync';

        const response = await fetch(syncApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'MyBonzo-Cron-Worker/1.0'
            }
        });

        if (!response.ok) {
            throw new Error(`API sync failed: ${response.status} ${response.statusText}`);
        }

        const syncData = await response.json();

        if (!syncData.success) {
            throw new Error(`API sync failed: ${syncData.error}`);
        }

        const syncDuration = Date.now() - syncStartTime;

        // Update sync record with success
        await env.PUMO_DB.prepare(`
      UPDATE sync_history 
      SET completed_at = ?, status = 'success', duration_ms = ?, 
          products_synced = ?, metadata = ?
      WHERE id = ?
    `).bind(
            new Date().toISOString(),
            syncDuration,
            syncData.data?.statistics?.processed || 0,
            JSON.stringify({
                cron: true,
                trigger: 'scheduled',
                api_response: syncData.data
            }),
            syncId
        ).run();

        console.log(`✅ Cron sync completed successfully in ${syncDuration}ms`);
        console.log(`📊 Statistics:`, syncData.data?.statistics);

        return {
            sync_id: syncId,
            duration_ms: syncDuration,
            statistics: syncData.data?.statistics,
            status: 'success'
        };

    } catch (error: any) {
        console.error('❌ Cron sync failed:', error);

        // Update sync record with error
        if (syncId) {
            await env.PUMO_DB.prepare(`
        UPDATE sync_history 
        SET completed_at = ?, status = 'failed', error_message = ?, duration_ms = ?
        WHERE id = ?
      `).bind(
                new Date().toISOString(),
                error.message,
                Date.now() - syncStartTime,
                syncId
            ).run();
        }

        throw error;
    }
}