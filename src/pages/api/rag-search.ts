/**
 * RAG Search API Endpoint
 * Semantic search przez Vectorize + Cloudflare AI
 * Direct implementation without middleware for debugging
 */

import { SearchService } from '@/lib/whitecat/search-service';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
    console.log("🧪 [RAG-SEARCH] Start - NO MIDDLEWARE");
    
    try {
        const url = new URL(context.request.url);
        const query = url.searchParams.get('q') || '';
        const mode = url.searchParams.get('mode') || 'hybrid';
        const limit = parseInt(url.searchParams.get('limit') || '10');

        if (!query.trim()) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Query parameter "q" is required'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        console.log(`🔍 [RAG-SEARCH] Query: "${query}"`);

        // Get env from context locals (standard in Astro+Cloudflare adapter)
        const runtime = (context.locals as any)?.runtime;
        const env = runtime?.env;

        // 1. Check bindings
        if (!env) {
             console.error('❌ [RAG-SEARCH] Missing runtime.env');
             throw new Error('Missing runtime environment');
        }
        if (!env.DB) {
             console.error('❌ [RAG-SEARCH] Check: DB binding missing');
             // Don't throw immediately, maybe we can survive? No, DB is critical.
             throw new Error('DB binding missing'); 
        } else {
             console.log('✅ [RAG-SEARCH] Check: DB binding OK');
        }
        
        if (!env.VECTORIZE_INDEX) {
             console.warn('⚠️ [RAG-SEARCH] Check: VECTORIZE_INDEX binding missing (Semantic search will fail)');
        } else {
             console.log('✅ [RAG-SEARCH] Check: VECTORIZE_INDEX binding OK');
        }

        if (!env.AI) {
             console.warn('⚠️ [RAG-SEARCH] Check: AI binding missing (Semantic search will fail)');
        } else {
             console.log('✅ [RAG-SEARCH] Check: AI binding OK');
        }

        // 2. Execute Search via Service
        console.log('🚀 [RAG-SEARCH] Initializing SearchService...');
        const searchService = new SearchService(env);

        console.log(`🚀 [RAG-SEARCH] Executing search (mode=${mode})...`);
        const results = await searchService.search({
            query: query.trim(),
            mode: mode as 'semantic' | 'hybrid' | 'keyword',
            limit,
            filters: {}
        });

        console.log(`✅ [RAG-SEARCH] Success. Found ${results.length} results.`);

        return new Response(JSON.stringify({
            success: true,
            data: {
                query,
                mode,
                results: results.map(r => ({
                    id: r.product.id,
                    name: r.product.name,
                    category: r.product.category,
                    price: r.product.price,
                    url: r.product.url,
                    score: r.score,
                    match_type: r.match_type
                })),
                total: results.length,
                vectorize_enabled: !!env?.VECTORIZE_INDEX,
                debug_source: 'no-middleware-handler'
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('💥 [RAG-SEARCH] ERROR:', error);
        
        return new Response(JSON.stringify({
            success: false,
            error: 'RAG Search failed (Direct Handler)',
            details: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            query: new URL(context.request.url).searchParams.get('q')
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};