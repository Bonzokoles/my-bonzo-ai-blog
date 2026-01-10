/**
 * RAG Chat API Endpoint - Local Implementation
 * Uses local D1 + Vectorize + AI to prevent hallucinations
 * Enhanced with product link enrichment
 */
import { SearchService } from '@/lib/whitecat/search-service';
import type { APIRoute } from 'astro';

const CACHE_TTL = 3600; // 1 hour cache

interface RAGRequest {
    query: string;
    context?: string;
    max_products?: number;
}

interface ProductContext {
    id: string;
    name: string;
    category: string;
    price: number;
    url: string;
}

interface RAGResponse {
    answer: string;
    products_found: ProductContext[];
    sources?: Array<{
        text: string;
        score: number;
        metadata?: Record<string, unknown>;
    }>;
}

export const POST: APIRoute = async ({ request, locals }) => {
    try {
        const body = await request.json() as RAGRequest;
        const { query, context, max_products = 5 } = body;

        console.log('[RAG Chat] Processing query:', query);

        if (!query?.trim()) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Missing query'
            }), { status: 400 });
        }

        // @ts-ignore
        const env = locals.runtime?.env;

        if (!env) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Missing runtime environment'
            }), { status: 500 });
        }

        // Initialize search service
        const searchService = new SearchService(env);

        // 1. Search for relevant products
        console.log('[RAG Chat] Searching for products...');
        const searchResults = await searchService.search({
            query: query.trim(),
            mode: 'hybrid',
            limit: max_products,
            filters: {}
        });

        console.log(`[RAG Chat] Found ${searchResults.length} products`);

        // 2. If no products found, return honest response
        if (searchResults.length === 0) {
            return new Response(JSON.stringify({
                success: true,
                answer: `Przepraszam, ale nie znalazłem w naszym sklepie produktów pasujących do zapytania "${query}". 

Możliwe że:
- Nie mamy takiego asortymentu w ofercie
- Spróbuj inne słowa kluczowe (np. "szafka nocna" zamiast "szafka kuchenna")
- Sprawdź nasze kategorie: fotele, łóżka, biurka, stoły, szafy, komody

Czy mogę pomóc Ci znaleźć coś innego?`,
                products_found: [],
                sources: [],
                metadata: {
                    query,
                    products_searched: 0,
                    no_results_reason: 'No products found in database',
                    provider: 'local-rag',
                    timestamp: new Date().toISOString()
                }
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 3. Prepare context for AI
        const productsContext = searchResults.map((result, index) => ({
            id: result.product.id,
            name: result.product.name,
            category: result.product.category,
            price: result.product.price,
            url: result.product.tracked_url || result.product.url,
            score: result.score,
            position: index + 1
        }));

        const systemPrompt = `Jesteś konsultantem w sklepie meblowym Meble Pumo. 

KRYTYCZNE ZASADY:
1. Odpowiadaj WYŁĄCZNIE na podstawie produktów z bazy danych poniżej
2. NIGDY nie wymyślaj produktów, cen, ani specyfikacji
3. Używaj dokładnie tych nazw i cen które podałem
4. Zawsze podawaj linki do produktów w formacie [Nazwa produktu](URL)
5. Jeśli klient pyta o coś czego nie ma w bazie - powiedz szczerze że nie mamy

DOSTĘPNE PRODUKTY:
${productsContext.map(p =>
            `${p.position}. ${p.name} (${p.category}) - ${p.price} zł
   Link: ${p.url}`
        ).join('\n')}

Odpowiadaj naturalnie, pomocnie, ale tylko na podstawie powyższych danych.`;

        const userMessage = `${query}${context ? `\n\nDodatkowy kontekst: ${context}` : ''}`;

        // 4. Generate AI response
        console.log('[RAG Chat] Generating AI response...');
        const aiResponse = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            max_tokens: 800,
            temperature: 0.1 // Low temperature to reduce hallucinations
        });

        // 5. Check product availability in real-time
        console.log('[RAG Chat] Checking product availability...');
        const productIds = productsContext.map(p => {
            // Extract product ID from URL or use direct ID
            const match = p.url.match(/-([0-9]+)(?:\?|$)/);
            return match ? match[1] : p.id;
        });

        let availableProducts = productsContext;
        try {
            const availabilityResponse = await fetch(`${context.url.origin}/api/check-product-availability`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_ids: productIds.slice(0, 5) }) // Max 5 for performance
            });

            if (availabilityResponse.ok) {
                const availabilityData = await availabilityResponse.json();

                if (availabilityData.success) {
                    // Filter only available products
                    const availabilityMap = new Map(
                        availabilityData.data.products.map((p: any) => [p.id, p])
                    );

                    availableProducts = productsContext.filter((product, index) => {
                        const checkId = productIds[index];
                        const availability = availabilityMap.get(checkId);
                        return availability?.available === true;
                    });

                    console.log(`[RAG Chat] Filtered to ${availableProducts.length} available products`);
                }
            }
        } catch (availError) {
            console.warn('[RAG Chat] Availability check failed, showing all products:', availError);
            // Continue with all products if availability check fails
        }

        // If no products are available, provide honest response
        if (availableProducts.length === 0) {
            return new Response(JSON.stringify({
                success: true,
                answer: `Przepraszam, ale produkty pasujące do zapytania "${query}" są obecnie wyprzedane lub niedostępne. 

Mogę polecić sprawdzenie naszej oferty później lub wyszukanie podobnych produktów w innych kategoriach. Czy mogę pomóc Ci znaleźć alternatywę?`,
                products_found: [],
                sources: [],
                metadata: {
                    query,
                    products_searched: productsContext.length,
                    products_available: 0,
                    availability_checked: true,
                    provider: 'local-rag-d1',
                    timestamp: new Date().toISOString()
                }
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 6. Regenerate AI response with only available products
        const availableSystemPrompt = `Jesteś konsultantem w sklepie meblowym Meble Pumo. 

KRYTYCZNE ZASADY:
1. Odpowiadaj WYŁĄCZNIE na podstawie produktów z bazy danych poniżej
2. NIGDY nie wymyślaj produktów, cen, ani specyfikacji
3. Używaj dokładnie tych nazw i cen które podałem
4. Zawsze podawaj linki do produktów w formacie [Nazwa produktu](URL)
5. Wszystkie podane produkty są DOSTĘPNE DO ZAKUPU

DOSTĘPNE PRODUKTY:
${availableProducts.map(p =>
            `${p.position}. ${p.name} (${p.category}) - ${p.price} zł
   Link: ${p.url}`
        ).join('\n')}

Odpowiadaj naturalnie, pomocnie, ale tylko na podstawie powyższych danych.`;

        const finalAiResponse = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
            messages: [
                { role: 'system', content: availableSystemPrompt },
                { role: 'user', content: userMessage }
            ],
            max_tokens: 800,
            temperature: 0.1
        });

        const answer = finalAiResponse.response || 'Przepraszam, wystąpił błąd podczas generowania odpowiedzi.';

        return new Response(JSON.stringify({
            success: true,
            answer,
            products_found: availableProducts,
            sources: searchResults.slice(0, availableProducts.length).map(r => ({
                text: `${r.product.name} - ${r.product.category}`,
                score: r.score,
                metadata: {
                    product_id: r.product.id,
                    match_type: r.match_type
                }
            })),
            metadata: {
                query,
                products_searched: searchResults.length,
                products_available: availableProducts.length,
                availability_checked: true,
                provider: "local-rag-d1",
                timestamp: new Date().toISOString(),
                model: '@cf/meta/llama-3.3-70b-instruct-fp8-fast'
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('[RAG Chat] Fatal Error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Wystąpił błąd podczas przetwarzania zapytania.',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), { status: 500 });
    }
};

// Health check
export const GET: APIRoute = async ({ locals }) => {
    // @ts-ignore  
    const env = locals.runtime?.env;

    return new Response(
        JSON.stringify({
            status: 'ok',
            service: 'RAG Chat API (Local D1)',
            features: {
                database: !!env?.DB,
                vectorize: !!env?.VECTORIZE_INDEX,
                ai_model: !!env?.AI,
                search_modes: ['semantic', 'hybrid', 'keyword']
            },
            model: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
            provider: 'local-rag-d1',
            anti_hallucination: 'enabled',
            timestamp: new Date().toISOString()
        }),
        {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        }
    );
};
