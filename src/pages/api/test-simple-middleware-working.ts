import { withSimpleMiddleware } from '@/middleware/simple-middleware';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
    return withSimpleMiddleware(
        'health-check',
        context,
        'public',
        async (ctx, requestContext) => {
            return new Response(
                JSON.stringify({
                    success: true,
                    message: 'Simple middleware working perfectly!',
                    middleware: 'simple',
                    feature: 'health-check',
                    clientAddress: requestContext.clientAddress,
                    timestamp: new Date().toISOString(),
                    environment: 'cloudflare'
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