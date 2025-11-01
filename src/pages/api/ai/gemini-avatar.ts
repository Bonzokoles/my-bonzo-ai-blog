import type { APIRoute } from 'astro';

/**
 * Google Gemini Multimodal Avatar API
 * Handles video + audio streaming with Gemini 2.0 Flash
 */

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json() as {
            action: 'connect' | 'talk' | 'disconnect';
            message?: string;
        };

        const geminiApiKey = import.meta.env.GEMINI_API_KEY;
        const cfAccountId = import.meta.env.CF_ACCOUNT_ID;

        if (!geminiApiKey) {
            return new Response(
                JSON.stringify({ error: 'GEMINI_API_KEY not configured' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // CONNECT - Initialize Gemini session
        if (body.action === 'connect') {
            // TODO: Initialize Gemini 2.0 Multimodal Live API
            // https://ai.google.dev/api/multimodal-live
            
            return new Response(
                JSON.stringify({ 
                    success: true,
                    sessionId: 'test-session-' + Date.now()
                }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // TALK - Send message to Gemini
        if (body.action === 'talk' && body.message) {
            if (!cfAccountId) {
                return new Response(
                    JSON.stringify({ error: 'CF_ACCOUNT_ID not configured' }),
                    { status: 500, headers: { 'Content-Type': 'application/json' } }
                );
            }

            // Use AI Gateway for Gemini
            const gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${cfAccountId}/google_ai_gate/google-ai-studio/v1beta/models/gemini-2.0-flash-exp:generateContent`;

            const response = await fetch(gatewayUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `You are Bonzo, expert on PORTA doors. User: ${body.message}\n\nRespond in Polish, 1-2 sentences.`
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 150,
                    }
                })
            });

            if (!response.ok) {
                const error = await response.text();
                console.error('Gemini error:', error);
                return new Response(
                    JSON.stringify({ error: 'Failed to get response from Gemini' }),
                    { status: 500, headers: { 'Content-Type': 'application/json' } }
                );
            }

            const data = await response.json() as any;
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Przepraszam, nie mogę odpowiedzieć.';

            return new Response(
                JSON.stringify({ reply }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // DISCONNECT - Close session
        if (body.action === 'disconnect') {
            return new Response(
                JSON.stringify({ success: true }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ error: 'Invalid action' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Gemini avatar error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
