/**
 * API Route: /api/ai/rag-shop-data
 * RAG Context Provider for AI Chat
 * 
 * @principle API Design: Context-aware responses
 */
import type { APIRoute } from 'astro';

interface RagContextRequest {
    query: string;
    domain?: string;
}

export const POST: APIRoute = async ({ request, locals }) => {
    try {
        const body: RagContextRequest = await request.json();
        const { query, domain } = body;

        // 1. Perform Vector Search (Internal Call)
        // We reuse the logic or call the endpoint. For performance in Workers, 
        // direct function call is better if shared code, but here we simulate internal fetch
        // or just implement the logic directly to avoid self-fetch overhead if possible.
        // However, reusing the new vector-search endpoint via URL is standard for separation.

        const url = new URL(request.url);
        const origin = url.origin;

        const searchResponse = await fetch(`${origin}/api/ai/vector-search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, limit: 5, domain })
        });

        const searchResult = await searchResponse.json() as { data?: { results: any[] } };
        const products = searchResult.data?.results || [];

        // 2. Format Context for LLM
        // Convert product data into semantic text chunks
        const productContext = products.map((p: any) => {
            const prod = p.product;
            if (!prod) return '';
            return `Product: ${prod.name}
Price: ${prod.price} PLN
Category: ${prod.category}
Availability: ${prod.availability || 'Unknown'}
Link: ${prod.url}`;
        }).join('\n---\n');

        // 3. Business Context (Static or fetched from D1 config)
        const businessContext = `Shop: Meble Pumo
Domain: ${domain || 'meblepumo.pl'}
Special offers: Free shipping over 2000 PLN.
Return policy: 30 days.`;

        return new Response(JSON.stringify({
            context: `
[BUSINESS INFO]
${businessContext}

[RELEVANT PRODUCTS]
${productContext}
            `,
            sourceDocs: products
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('RAG Data Error:', error);
        return new Response(JSON.stringify({
            error: 'Failed to generate RAG context',
            context: 'System unavailable.'
        }), { status: 500 });
    }
};

export const GET: APIRoute = async () => {
    return new Response(JSON.stringify({
        message: 'Use POST with { query } to get RAG context.'
    }), { status: 405 });
};