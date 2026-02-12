
import type { APIRoute } from 'astro';
import { getProductManager } from '@/lib/whitecat/product-manager-d1';

/**
 * API Route: /api/ai/vector-search
 * Performs hybrid search: Vectorize embedding search + D1 filtering
 * 
 * @principle API Design: Standardized Error Responses
 * @principle TypeScript Pro: Strict typing for request/response bodies
 */

interface VectorSearchRequest {
    query: string;
    domain?: string; // For multi-tenancy (future proofing)
    limit?: number;
    threshold?: number;
}

interface VectorSearchResult {
    id: string; // Product ID
    score: number;
    metadata?: Record<string, any>;
    product?: any; // Hydrated product data from D1
}

interface VectorSearchResponse {
    success: boolean;
    data?: {
        results: VectorSearchResult[];
        count: number;
        processingTimeMs: number;
    };
    error?: {
        code: string;
        message: string;
        details?: any;
    };
}

export const POST: APIRoute = async ({ request, locals }) => {
    const startTime = performance.now();

    // 1. Validate Environment & Bindings
    const runtime = (locals as any)?.runtime;
    const env = runtime?.env;

    if (!env?.VECTORIZE_INDEX || !env?.AI || !env?.DB) {
        return new Response(JSON.stringify({
            success: false,
            error: {
                code: 'CONFIG_ERROR',
                message: 'Server misconfiguration: AI, DB or Vectorize binding missing.'
            }
        } as VectorSearchResponse), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        // 2. Parse & Validate Request
        const body: VectorSearchRequest = await request.json();

        if (!body.query || typeof body.query !== 'string') {
            return new Response(JSON.stringify({
                success: false,
                error: {
                    code: 'INVALID_REQUEST',
                    message: "Missing or invalid 'query' parameter."
                }
            } as VectorSearchResponse), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const limit = body.limit || 5;
        const threshold = body.threshold || 0.6;

        // 3. Generate Embedding
        // Using generic 'bge-base-en-v1.5' or similar available in CF Workers AI
        // Note: Check actual model name in Cloudflare dashboard if needed. 
        // We use a safe default or env var.
        const embeddingModel = '@cf/baai/bge-base-en-v1.5';

        const embeddingResponse = await env.AI.run(embeddingModel, {
            text: [body.query]
        });

        if (!embeddingResponse || !embeddingResponse.data || !embeddingResponse.data[0]) {
            throw new Error('Failed to generate embeddings from AI service.');
        }

        const queryVector = embeddingResponse.data[0];

        // 4. Query Vectorize Index
        const vectorResults = await env.VECTORIZE_INDEX.query(queryVector, {
            topK: limit,
            returnMetadata: true
        });

        // 5. Hydrate with D1 Data (Hybrid Fetch)
        // If we found vector matches, we need to get the full product details from D1
        const results: VectorSearchResult[] = [];

        if (vectorResults && vectorResults.matches && vectorResults.matches.length > 0) {
            const productManager = getProductManager(env);

            // Extract IDs to fetch in bulk if possible, or iterate
            // Ideally productManager has getProductsByIds, relying on getProductById for now

            for (const match of vectorResults.matches) {
                if (match.score < threshold) continue; // Filter low confidence

                let productData = null;
                try {
                    // Assuming vector ID matches D1 product ID or 'sku'
                    // We might need a lookup map if they differ. 
                    // For now, assuming vector ID = Product ID (UUID)
                    productData = await productManager.getProductById(match.id);
                } catch (e) {
                    console.warn(`Failed to hydrate product ${match.id}`, e);
                }

                if (productData) {
                    results.push({
                        id: match.id,
                        score: match.score,
                        metadata: match.metadata,
                        product: productData
                    });
                }
            }
        }

        const endTime = performance.now();

        return new Response(JSON.stringify({
            success: true,
            data: {
                results: results,
                count: results.length,
                processingTimeMs: Math.round(endTime - startTime)
            }
        } as VectorSearchResponse), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('[Vector Search Error]:', error);

        return new Response(JSON.stringify({
            success: false,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: 'An unexpected error occurred during vector search.',
                details: error.message
            }
        } as VectorSearchResponse), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};
