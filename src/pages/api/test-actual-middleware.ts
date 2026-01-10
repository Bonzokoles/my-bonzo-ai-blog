import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
    try {
        console.log('[DEBUG] Testing actual withFeatureMiddleware');

        // Test the actual withFeatureMiddleware function
        const { withFeatureMiddleware } = await import('@/middleware/api-middleware');

        return withFeatureMiddleware(
            'health-check',
            context,
            'public',
            async (ctx, requestContext) => {
                return new Response(
                    JSON.stringify({
                        success: true,
                        message: 'WithFeatureMiddleware is working!',
                        environment: requestContext.environment,
                        clientAddress: requestContext.clientAddress,
                        timestamp: new Date().toISOString()
                    }),
                    {
                        status: 200,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    }
                );
            }
        );

    } catch (error) {
        console.error('[DEBUG] Error in withFeatureMiddleware test:', error);

        return new Response(
            JSON.stringify({
                error: 'WithFeatureMiddleware test failed',
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