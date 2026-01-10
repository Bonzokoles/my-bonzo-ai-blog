import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
    try {
        console.log('[DEBUG] Testing middleware imports');

        // Test imports step by step
        let response: any = {
            success: true,
            imports: {},
            timestamp: new Date().toISOString()
        };

        try {
            const { createRequestContext } = await import('@/middleware/api-middleware');
            response.imports.middleware = 'OK';

            const requestContext = createRequestContext(context);
            response.requestContext = requestContext;
        } catch (error) {
            response.imports.middleware = `ERROR: ${error instanceof Error ? error.message : error}`;
        }

        try {
            const { FEATURES } = await import('@/config/features');
            response.imports.features = 'OK';
            response.featuresCount = FEATURES.length;
        } catch (error) {
            response.imports.features = `ERROR: ${error instanceof Error ? error.message : error}`;
        }

        try {
            const { getFeatureFlagsManager } = await import('@/lib/features/feature-flags');
            response.imports.featureFlags = 'OK';
        } catch (error) {
            response.imports.featureFlags = `ERROR: ${error instanceof Error ? error.message : error}`;
        }

        return new Response(
            JSON.stringify(response, null, 2),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            }
        );
    } catch (error) {
        console.error('[DEBUG] Error in import test:', error);

        return new Response(
            JSON.stringify({
                error: 'Import test failed',
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