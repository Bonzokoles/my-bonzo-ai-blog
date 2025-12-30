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

        // DeepSeek R1 API Call
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
1. Opieraj się na kontekście i wiedzy o meblarstwie
2. Bądź uprzejmy i profesjonalny
3. Zawsze podawaj link do www.meblepumo.pl
4. Sugeruj sprawdzenie przewodników na mybonzoaiblog.com/pumo-guide/
5. Prezentuj wszystkie marki obiektywnie, bazując na danych z przewodników

Kontekst: ${context || 'Strona główna przewodnika'}`
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
        const reply = data.choices?.[0]?.message?.content || 'Brak odpowiedzi';

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
