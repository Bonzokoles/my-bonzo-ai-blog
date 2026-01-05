/**
 * RAG Chat API Endpoint
 * Proxy do Worker Michael z feature control i KV caching
 */
import { withFeatureMiddleware } from '@/middleware/api-middleware';
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

export const POST: APIRoute = async (context) => {
    return withFeatureMiddleware(
        'ai-rag-chat',
        context,
        'public',
        async (ctx, requestContext) => {
            try {
                const runtime = (ctx.locals as any)?.runtime;
                const env = runtime?.env;

                const body = await ctx.request.json() as RAGRequest;
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

                // Check KV cache first
                const cacheKey = `rag:${namespace}:${query.substring(0, 100)}`;
                if (env?.CACHE) {
                    try {
                        const cached = await env.CACHE.get(cacheKey);
                        if (cached) {
                            console.log('[RAG] Cache HIT for:', query.substring(0, 50));
                            return new Response(cached, {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-Cache': 'HIT',
                                    'Cache-Control': `public, max-age=${CACHE_TTL}`
                                }
                            });
                        }
                    } catch (cacheError) {
                        console.warn('[RAG] Cache read error:', cacheError);
                    }
                }

                console.log('[RAG] Cache MISS - fetching from Worker Michael');

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

                const data = await response.json() as RAGResponse;

                const responseData = {
                    success: true,
                    answer: data.answer,
                    sources: data.sources,
                    metadata: {
                        namespace,
                        topK,
                        timestamp: new Date().toISOString(),
                        cached: false
                    }
                };

                const responseBody = JSON.stringify(responseData);

                // Save to cache (fire-and-forget)
                if (env?.CACHE && data.answer) {
                    try {
                        await env.CACHE.put(cacheKey, responseBody, {
                            expirationTtl: CACHE_TTL
                        });
                        console.log('[RAG] Saved to cache:', query.substring(0, 50));
                    } catch (cacheError) {
                        console.warn('[RAG] Cache write error:', cacheError);
                    }
                }

                return new Response(responseBody, {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Cache': 'MISS',
                        'Cache-Control': `public, max-age=${CACHE_TTL}`
                    }
                });

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
        }
    );
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
