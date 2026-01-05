/**
 * RAG Chat API Endpoint
 * Proxy do Worker Michael z feature control
 */
import type { APIRoute } from 'astro';

const WORKER_URL = 'https://jimbo-angels-worker.stolarnia-ams.workers.dev/orchestrate';

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { query, namespace = 'pumo-blog', topK = 5 } = body;

        if (!query) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'Missing query parameter'
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Forward to Worker Michael
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                namespace,
                topK
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            return new Response(
                JSON.stringify({
                    success: false,
                    error: `Worker Michael error: ${response.status}`,
                    details: errorText
                }),
                {
                    status: response.status,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        const data = await response.json();

        return new Response(
            JSON.stringify({
                success: true,
                ...data
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            }
        );

    } catch (error) {
        console.error('[RAG Chat API]', error);

        return new Response(
            JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
};

// Health check
export const GET: APIRoute = async () => {
    return new Response(
        JSON.stringify({
            status: 'ok',
            service: 'RAG Chat API',
            workerUrl: WORKER_URL,
            timestamp: new Date().toISOString()
        }),
        {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        }
    );
};
