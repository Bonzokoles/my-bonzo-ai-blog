/**
 * RAG Search API Endpoint
 * Semantic search przez Vectorize + Cloudflare AI
 */

import { SearchService } from '@/lib/whitecat/search-service';
import { withFeatureMiddleware } from '@/middleware/api-middleware';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
    return withFeatureMiddleware(
        'ai-rag-chat',
        context,
        'public',
        async (ctx, requestContext) => {
            const url = new URL(ctx.request.url);
            const query = url.searchParams.get('q') || '';
            const mode = url.searchParams.get('mode') || 'hybrid';
            const limit = parseInt(url.searchParams.get('limit') || '10');

            const runtime = (ctx.locals as any)?.runtime;
            const env = runtime?.env;

            if (!query.trim()) {
                return new Response(JSON.stringify({
                    success: false,
                    error: 'Query parameter "q" is required'
                }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            try {
                const searchService = new SearchService(env);

                const results = await searchService.search({
                    query: query.trim(),
                    mode: mode as 'semantic' | 'hybrid' | 'keyword',
                    limit,
                    filters: {}
                });

                return new Response(JSON.stringify({
                    success: true,
                    data: {
                        query,
                        mode,
                        results: results.map(r => ({
                            id: r.id,
                            name: r.product.name,
                            category: r.product.category,
                            price: r.product.price,
                            url: r.product.url,
                            score: r.score,
                            match_type: r.match_type
                        })),
                        total: results.length,
                        vectorize_enabled: !!env?.VECTORIZE_INDEX
                    }
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });

            } catch (error: any) {
                console.error('RAG Search Error:', error);

                return new Response(JSON.stringify({
                    success: false,
                    error: 'Search failed',
                    details: error.message,
                    query,
                    mode
                }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }
    );
};