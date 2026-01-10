import { getRuntimeConfig } from '@/lib/runtime/environment';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
    try {
        const { runtime, config } = getRuntimeConfig();

        // Test basic middleware functionality
        console.log(`[Environment Test] Running in ${runtime} environment`);

        const response = {
            success: true,
            environment: {
                runtime,
                config,
                nodeVersion: typeof process !== 'undefined' ? process.version : 'N/A',
                cloudflareWorker: runtime === 'cloudflare',
                localDev: runtime === 'local'
            },
            middleware: {
                allowGlobalInit: config.allowGlobalInit,
                rateLimitStorage: config.rateLimitStorage
            },
            context: {
                clientAddress: context.clientAddress,
                url: context.url.href,
                method: context.request.method
            },
            timestamp: new Date().toISOString()
        };

        // Test middleware import only if safe
        if (config.allowGlobalInit || runtime === 'cloudflare') {
            try {
                const { createRequestContext } = await import('@/middleware/api-middleware');
                const requestContext = createRequestContext(context);
                response.middleware.contextTest = 'SUCCESS';
                response.middleware.sampleContext = {
                    environment: requestContext.environment,
                    clientAddress: requestContext.clientAddress
                };
            } catch (error) {
                response.middleware.contextTest = 'FAILED';
                response.middleware.error = error instanceof Error ? error.message : 'Unknown error';
            }
        }

        return new Response(
            JSON.stringify(response, null, 2),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'no-cache'
                }
            }
        );
    } catch (error) {
        console.error('[Environment Test] Error:', error);

        return new Response(
            JSON.stringify({
                success: false,
                error: 'Environment test failed',
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