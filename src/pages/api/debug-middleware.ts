import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
    try {
        console.log('[DEBUG] Starting middleware debug endpoint');

        // Test basic response
        const response = {
            success: true,
            message: 'Direct endpoint without middleware',
            context_available: !!context,
            request_available: !!context.request,
            locals_available: !!context.locals,
            timestamp: new Date().toISOString()
        };

        console.log('[DEBUG] Response prepared:', response);

        return new Response(
            JSON.stringify(response),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            }
        );
    } catch (error) {
        console.error('[DEBUG] Error in endpoint:', error);

        return new Response(
            JSON.stringify({
                error: 'Debug endpoint failed',
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