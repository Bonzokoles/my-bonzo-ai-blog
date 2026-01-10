import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
    try {
        console.log('[DEBUG] Testing completely isolated middleware');

        // Import only what we need step by step
        const response = {
            success: true,
            steps: [],
            timestamp: new Date().toISOString()
        };

        // Step 1: Test basic context creation (without middleware)
        try {
            const basicContext = {
                clientAddress: context.clientAddress || 'unknown',
                userAgent: context.request.headers.get('user-agent') || undefined,
                timestamp: Date.now(),
                apiKey: context.request.headers.get('x-api-key') || undefined
            };

            response.steps.push({
                step: 'basic_context',
                status: 'OK',
                data: basicContext
            });

        } catch (error) {
            response.steps.push({
                step: 'basic_context',
                status: 'ERROR',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }

        // Step 2: Test feature flag check (manual, no middleware)
        try {
            // Basic feature check without importing middleware
            const healthCheckFeature = {
                id: 'health-check',
                name: 'Health Check',
                status: 'enabled',
                permissions: ['public', 'user', 'admin']
            };

            // Simple permission check
            const hasPublicAccess = healthCheckFeature.permissions.includes('public');

            response.steps.push({
                step: 'manual_feature_check',
                status: 'OK',
                data: {
                    feature: healthCheckFeature.name,
                    hasAccess: hasPublicAccess
                }
            });

        } catch (error) {
            response.steps.push({
                step: 'manual_feature_check',
                status: 'ERROR',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }

        return new Response(
            JSON.stringify(response, null, 2),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        );

    } catch (error) {
        console.error('[DEBUG] Error in isolated middleware test:', error);

        return new Response(
            JSON.stringify({
                error: 'Isolated middleware test failed',
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
};