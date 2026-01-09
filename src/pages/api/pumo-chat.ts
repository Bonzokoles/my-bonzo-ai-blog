import { getLinkEnrichmentService } from '@/lib/whitecat/link-enrichment';
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
    try {
        const { query, context } = await request.json();

        // @ts-ignore - Cloudflare env bindings
        const env = locals.runtime?.env;
        const apiKey = env?.DEEPSEEK_API_KEY || env?.DEEP_SEEK_API_KEY;

        if (!apiKey) {
            return new Response(
                JSON.stringify({
                    error: 'API key not configured',
                    reply: 'Przepraszam, system AI jest obecnie niedostępny. Sprawdź ofertę bezpośrednio na www.meblepumo.pl'
                }),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // 1. RAG: Search for products in The_whitecat Worker
        let productContext = '';
        try {
            const searchResponse = await fetch('https://pumo-chunk-processor.stolarnia-ams.workers.dev/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: query,
                    limit: 5,
                    threshold: 0.6 // Semantic similarity threshold
                })
            });

            if (searchResponse.ok) {
                const searchData: any = await searchResponse.json();
                if (searchData.success && searchData.data && searchData.data.length > 0) {
                    productContext = "ZNALTEZIONE PRODUKTY W BAZIE SKLEPU:\n" + 
                        searchData.data.map((p: any) => 
                            `- ${p.name} (Cena: ${p.price} zł): ${p.description?.substring(0, 150)}... [Link: ${p.link}]`
                        ).join("\n") + "\n\n";
                    
                    console.log(`RAG: Found ${searchData.data.length} products for context.`);
                } else {
                    console.log('RAG: No matching products found.');
                }
            } else {
                console.warn('RAG: Search worker returned error:', searchResponse.status);
            }
        } catch (err) {
            console.error('RAG: Fetch error:', err);
            // Continue without context if RAG fails
        }

        // 2. DeepSeek R1 API Call with RAG Context
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-reasoner',
                messages: [
                    {
                        role: 'system',
                        content: `Jesteś Inteligentnym Asystentem Sklepu Meble Pumo (www.meblepumo.pl). 
            
ZASADY:
1. Opieraj się na dostarczonym KONTEKŚCIE PRODUKTOWYM. Jeśli produkt jest na liście, poleć go.
2. Bądź uprzejmy i profesjonalny.
3. Jeśli polecasz produkt, ZAWSZE podawaj jego cenę i link z kontekstu.
4. Jeśli nie ma produktu w kontekście, zaproś ogólnie na stronę główną lub do kategorii.
5. Nie zmyślaj produktów, których nie ma w bazie.

KONTEKST PRODUKTOWY Z BAZY DANYCH:
${productContext}

Kontekst strony: ${context || 'Strona główna przewodnika'}`
                    },
                    {
                        role: 'user',
                        content: query
                    }
                ],
                stream: false
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('DeepSeek API error:', errorText);
            return new Response(
                JSON.stringify({
                    error: 'API request failed',
                    reply: 'Wystąpił problem z połączeniem. Odwiedź www.meblepumo.pl lub zobacz nasze przewodniki.'
                }),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        const data = await response.json();
        let reply = data.choices?.[0]?.message?.content || 'Brak odpowiedzi';

        // ENHANCEMENT: Enrich response with clickable product links
        if (env) {
            try {
                const linkService = getLinkEnrichmentService(env);
                reply = await linkService.enrichWithProductLinks(reply);
                console.log('[PumoChat] Link enrichment applied');
            } catch (enrichError) {
                console.error('[PumoChat] Link enrichment failed:', enrichError);
                // Continue with original reply if enrichment fails
            }
        }

        return new Response(
            JSON.stringify({ reply }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        );

    } catch (error) {
        console.error('Chat API error:', error);
        return new Response(
            JSON.stringify({
                error: error instanceof Error ? error.message : 'Unknown error',
                reply: 'Przepraszam za problem. Sprawdź ofertę na www.meblepumo.pl'
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
};

// CORS preflight
export const OPTIONS: APIRoute = async () => {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    });
};
