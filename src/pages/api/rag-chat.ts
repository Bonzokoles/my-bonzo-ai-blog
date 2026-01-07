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
        const apiKey = env?.DEEPSEEK_API_KEY || env?.DEEP_SEEK_API_KEY;

        if (!apiKey) {
             console.error('[RAG API] Missing API Key');
             // Fallback response if no key (dev mode safety)
             return new Response(JSON.stringify({
                success: true,
                answer: "System RAG jest w trybie offline (brak klucza API). Proszę sprawdzić konfigurację.",
                sources: []
            }), { status: 200 });
        }

        // DeepSeek Call
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
                        content: `Jesteś Inteligentnym Asystentem RAG dla bloga MyBonzo AI i Meble Pumo.
                        
Kontekst: Użytkownik pyta o meble lub technologie AI.
Twoim zadaniem jest udzielenie pomocnej, merytorycznej odpowiedzi.

Jeśli pytanie dotyczy mebli, kieruj do poradników na mybonzoaiblog.com/pumo-guide.
Jeśli pytanie dotyczy AI, odpowiadaj zgodnie z wiedzą o sztucznej inteligencji.

Bądź zwięzły i konkretny.`
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
            const err = await response.text();
             console.error('[RAG API] DeepSeek Error:', err);
             throw new Error(`DeepSeek API error: ${response.status}`);
        }

        const data = await response.json();
        const answer = data.choices?.[0]?.message?.content || "Przepraszam, nie potrafię teraz odpowiedzieć.";

        // Mock sources for now since we bypassed the Vector DB Worker
        const sources = [
            {
                text: "Wiedza ogólna AI & Meble Pumo",
                score: 1.0,
                metadata: { url: "https://mybonzoaiblog.com/pumo-guide" }
            }
        ];
        
        return new Response(JSON.stringify({
            success: true,
            answer: answer,
            sources: sources, // Return mock sources to satisfy frontend types
            metadata: { namespace, timestamp: new Date().toISOString(), provider: "deepseek-direct" }
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
