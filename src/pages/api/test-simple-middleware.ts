import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
    try {
        console.log('[DEBUG] Testing simple middleware usage');

        // Test basic imports step by step
        let response: any = {
            success: true,
            step: 'start',
            timestamp: new Date().toISOString()
        };

        // Step 1: Try basic middleware import
        try {
            const { createRequestContext } = await import('@/middleware/api-middleware');
            response.step = 'middleware_imported';

            // Step 2: Try to use it
            const requestContext = createRequestContext(context);
            response.step = 'context_created';
            response.requestContext = requestContext;

        } catch (error) {
            response.step = 'middleware_failed';
            response.error = error instanceof Error ? error.message : 'Unknown error';
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
        console.error('[DEBUG] Error in simple middleware test:', error);

        return new Response(
            JSON.stringify({
                error: 'Simple middleware test failed',
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