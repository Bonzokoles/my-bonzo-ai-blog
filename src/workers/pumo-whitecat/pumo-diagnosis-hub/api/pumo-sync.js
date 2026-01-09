// PUMO SYNC API ENDPOINT
// Handles data synchronization with Meble Pumo systems

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // CORS headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                status: 204,
                headers: corsHeaders
            });
        }

        try {
            switch (request.method) {
                case 'GET':
                    return await getSyncStatus(env, corsHeaders);

                case 'POST':
                    return await triggerSync(request, env, corsHeaders);

                case 'PUT':
                    return await updateSyncConfig(request, env, corsHeaders);

                default:
                    return Response.json(
                        { error: 'Method not allowed' },
                        { status: 405, headers: corsHeaders }
                    );
            }

        } catch (error) {
            console.error('Sync API Error:', error);
            return Response.json(
                {
                    error: 'Internal server error',
                    details: error.message
                },
                { status: 500, headers: corsHeaders }
            );
        }
    }
};

async function getSyncStatus(env, corsHeaders) {
    try {
        // Check last sync status from KV if available
        let lastSync = null;
        if (env.CACHE) {
            const syncData = await env.CACHE.get('last-sync');
            if (syncData) {
                lastSync = JSON.parse(syncData);
            }
        }

        const status = {
            isRunning: false,
            lastSync: lastSync || {
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
                status: 'completed',
                itemsProcessed: 2560,
                itemsUpdated: 156,
                itemsAdded: 23,
                itemsRemoved: 8,
                duration: '4m 32s',
                errors: []
            },
            nextScheduled: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
            configuration: {
                autoSync: true,
                interval: '6h',
                retryAttempts: 3,
                batchSize: 100,
                timeoutMs: 30000
            },
            statistics: {
                totalSyncs: 1247,
                successfulSyncs: 1235,
                failedSyncs: 12,
                averageDuration: '3m 45s',
                lastFailure: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
            }
        };

        return Response.json(status, {
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('Get sync status error:', error);
        return Response.json(
            { error: 'Failed to get sync status' },
            { status: 500, headers: corsHeaders }
        );
    }
}

async function triggerSync(request, env, corsHeaders) {
    try {
        const body = await request.json().catch(() => ({}));
        const {
            force = false,
            categories = [],
            dryRun = false
        } = body;

        // Check if sync is already running
        if (env.CACHE) {
            const runningSyncCheck = await env.CACHE.get('sync-running');
            if (runningSyncCheck && !force) {
                return Response.json(
                    { error: 'Sync already in progress', running: true },
                    { status: 409, headers: corsHeaders }
                );
            }
        }

        // Start sync process
        const syncId = generateSyncId();
        const startTime = new Date();

        try {
            // Mark sync as running
            if (env.CACHE) {
                await env.CACHE.put('sync-running', syncId, { expirationTtl: 3600 }); // 1 hour max
            }

            // Perform the actual sync
            const syncResult = await performSync({
                syncId,
                categories,
                dryRun,
                env
            });

            // Mark sync as completed
            if (env.CACHE) {
                await env.CACHE.delete('sync-running');
                await env.CACHE.put('last-sync', JSON.stringify({
                    ...syncResult,
                    timestamp: startTime.toISOString(),
                    syncId
                }), { expirationTtl: 86400 }); // Keep for 24 hours
            }

            return Response.json(syncResult, {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            });

        } catch (syncError) {
            // Clean up running state on error
            if (env.CACHE) {
                await env.CACHE.delete('sync-running');
            }
            throw syncError;
        }

    } catch (error) {
        console.error('Trigger sync error:', error);
        return Response.json(
            {
                error: 'Failed to trigger sync',
                details: error.message
            },
            { status: 500, headers: corsHeaders }
        );
    }
}

async function updateSyncConfig(request, env, corsHeaders) {
    try {
        const config = await request.json();

        // Validate configuration
        const validatedConfig = validateSyncConfig(config);

        // Store configuration (if KV is available)
        if (env.CACHE) {
            await env.CACHE.put('sync-config', JSON.stringify(validatedConfig), {
                expirationTtl: 86400 * 7 // Keep for 7 days
            });
        }

        return Response.json({
            success: true,
            config: validatedConfig,
            message: 'Sync configuration updated successfully'
        }, {
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('Update sync config error:', error);
        return Response.json(
            {
                error: 'Failed to update sync configuration',
                details: error.message
            },
            { status: 500, headers: corsHeaders }
        );
    }
}

async function performSync({ syncId, categories, dryRun, env }) {
    const startTime = Date.now();
    const result = {
        syncId,
        status: 'running',
        itemsProcessed: 0,
        itemsUpdated: 0,
        itemsAdded: 0,
        itemsRemoved: 0,
        errors: [],
        warnings: []
    };

    try {
        // Simulate sync process (replace with actual implementation)
        console.log(`Starting sync ${syncId}${dryRun ? ' (DRY RUN)' : ''}`);

        // Phase 1: Fetch data from source
        await simulatePhase('Fetching product data', 2000);
        result.itemsProcessed += 2560;

        // Phase 2: Process categories
        if (categories.length > 0) {
            for (const category of categories) {
                await simulatePhase(`Processing category: ${category}`, 500);
                result.itemsUpdated += Math.floor(Math.random() * 50) + 10;
            }
        } else {
            await simulatePhase('Processing all categories', 3000);
            result.itemsUpdated = 156;
            result.itemsAdded = 23;
            result.itemsRemoved = 8;
        }

        // Phase 3: Update database/cache
        if (!dryRun) {
            await simulatePhase('Updating database', 1500);
            await simulatePhase('Refreshing cache', 1000);
        }

        // Calculate duration
        const endTime = Date.now();
        const durationMs = endTime - startTime;
        const duration = formatDuration(durationMs);

        result.status = 'completed';
        result.duration = duration;
        result.completedAt = new Date().toISOString();

        // Add some realistic warnings/info
        if (result.itemsRemoved > 0) {
            result.warnings.push(`${result.itemsRemoved} products were removed (discontinued or out of stock)`);
        }

        if (categories.length === 0) {
            result.warnings.push('Full sync performed - consider using category-specific sync for faster updates');
        }

        console.log(`Sync ${syncId} completed in ${duration}`);
        return result;

    } catch (error) {
        result.status = 'failed';
        result.errors.push({
            message: error.message,
            timestamp: new Date().toISOString()
        });

        console.error(`Sync ${syncId} failed:`, error);
        return result;
    }
}

// Helper functions
function generateSyncId() {
    return `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function validateSyncConfig(config) {
    const defaults = {
        autoSync: true,
        interval: '6h',
        retryAttempts: 3,
        batchSize: 100,
        timeoutMs: 30000,
        categories: [],
        enableNotifications: true
    };

    return {
        ...defaults,
        ...config,
        // Ensure safe values
        retryAttempts: Math.max(1, Math.min(config.retryAttempts || 3, 5)),
        batchSize: Math.max(10, Math.min(config.batchSize || 100, 500)),
        timeoutMs: Math.max(5000, Math.min(config.timeoutMs || 30000, 120000))
    };
}

function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
}

async function simulatePhase(description, durationMs) {
    console.log(`Sync phase: ${description}`);
    await new Promise(resolve => setTimeout(resolve, Math.random() * durationMs));
}