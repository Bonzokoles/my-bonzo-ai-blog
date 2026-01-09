import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
    try {
        const runtime = (locals as any)?.runtime;
        const env = runtime?.env;

        console.log('🧪 Ultimate test - start');
        console.log('🧪 NODE_ENV =', process?.env?.NODE_ENV);
        console.log('🧪 Has DB =', !!env?.DB);
        console.log('🧪 Has AI =', !!env?.AI);
        console.log('🧪 Has VECTORIZE_INDEX =', !!env?.VECTORIZE_INDEX);

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Ultimate test successful!',
                debug: {
                    nodeEnv: process?.env?.NODE_ENV,
                    hasDB: !!env?.DB,
                    hasAI: !!env?.AI,
                    hasVectorize: !!env?.VECTORIZE_INDEX,
                    timestamp: Date.now()
                }
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );

    } catch (error) {
        console.error('❌ Ultimate test error:', error);
        return new Response(
            JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
};