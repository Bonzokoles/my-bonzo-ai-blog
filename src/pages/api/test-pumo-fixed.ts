import { withFeatureMiddleware } from '@/middleware/api-middleware';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
    return withFeatureMiddleware(
        'health-check',
        context,
        'public',
        async (ctx, requestContext) => {
            return new Response(
                JSON.stringify({
                    success: true,
                    message: 'PUMO system test with middleware working!',
                    environment: requestContext.environment,
                    clientAddress: requestContext.clientAddress,
                    timestamp: new Date().toISOString(),
                    systems: {
                        middleware: 'OK',
                        featureFlags: 'OK',
                        healthCheck: 'OK'
                    }
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
};

export const POST: APIRoute = async (context) => {
    return withFeatureMiddleware(
        'whitecat-products',
        context,
        'public',
        async (ctx, requestContext) => {
            try {
                const body = await ctx.request.json();

                return new Response(
                    JSON.stringify({
                        success: true,
                        message: 'PUMO API test successful',
                        environment: requestContext.environment,
                        receivedData: body,
                        timestamp: new Date().toISOString(),
                        systems: {
                            middleware: 'OK',
                            whitecat: 'OK',
                            apiEndpoint: 'OK'
                        }
                    }),
                    {
                        status: 200,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    }
                );
            } catch (error) {
                return new Response(
                    JSON.stringify({
                        success: false,
                        error: 'Request processing failed',
                        message: error instanceof Error ? error.message : 'Unknown error'
                    }),
                    {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            }
        }
    );
};