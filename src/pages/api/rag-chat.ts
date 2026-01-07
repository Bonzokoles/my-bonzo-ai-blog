/**
 * RAG Chat API Endpoint
 * Proxy do Worker Michael z feature control i KV caching
 */
import type { APIRoute } from 'astro';

const WORKER_URL = 'https://jimbo-angels-worker.stolarnia-ams.workers.dev/orchestrate';
const CACHE_TTL = 3600; // 1 hour cache

interface RAGRequest {
    query: string;
    namespace?: string;
    topK?: number;
}

interface RAGResponse {
    answer?: string;
    sources?: Array<{
        text: string;
        score: number;
        metadata?: Record<string, unknown>;
    }>;
    [key: string]: unknown;
}

export const POST: APIRoute = async ({ request, locals }) => {
    try {
        const body = await request.json() as RAGRequest;
        const { query, namespace = 'pumo-blog', topK = 5 } = body;

        console.log('[RAG API] Processing query:', query);

        if (!query) {
            return new Response(JSON.stringify({ error: 'Missing query' }), { status: 400 });
        }

        // @ts-ignore
        const env = locals.runtime?.env || process.env;
        
        // Use Cloud Worker (Proven to work)
        console.log('[RAG API] Sending to Worker:', WORKER_URL);
        
        const workerResponse = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, namespace, topK })
        });

        if (!workerResponse.ok) {
            const errText = await workerResponse.text();
            console.error('[RAG API] Worker Error:', workerResponse.status, errText);
            throw new Error(`Worker returned ${workerResponse.status}: ${errText}`);
        }

        const data = await workerResponse.json() as RAGResponse;
        
        // Log partial response for debug
        console.log('[RAG API] Worker success. Answer length:', data.answer?.length);

        return new Response(JSON.stringify({
            success: true,
            answer: data.answer,
            sources: data.sources || [],
            metadata: { 
                namespace, 
                timestamp: new Date().toISOString(),
                provider: "cloud-worker" 
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('[RAG API] Fatal Error:', error);
        return new Response(JSON.stringify({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
        }), { status: 500 });
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
