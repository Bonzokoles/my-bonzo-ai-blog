import type { APIRoute } from 'astro';

/**
 * HeyGen Interactive Avatar with Gemini AI
 * Creates streaming avatar session with real-time responses
 */

const DOOR_KNOWLEDGE_BASE = `
You are Bonzo, expert on PORTA doors. Knowledge base:

1. The Urbanist - Modern steel exterior, matte black aluminum (U-value: 0.8)
2. The Highlander - Rustic oak traditional with acoustic insulation
3. The Sentinel - High-security RC3 certified, anthracite grey
4. The Lumina - Interior frosted glass, modern bright style
5. The EcoScape - Eco-friendly 95% reclaimed wood, Scandinavian style

**IMPORTANT**: Respond in POLISH language. Keep responses SHORT (1-2 sentences) for avatar speech.
`;

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json() as {
            action: 'create' | 'talk' | 'close';
            sessionId?: string;
            message?: string;
        };

        const heygenApiKey = import.meta.env.HEYGEN_API_KEY;
        const cfAccountId = import.meta.env.CF_ACCOUNT_ID;

        if (!heygenApiKey) {
            return new Response(
                JSON.stringify({ error: 'HEYGEN_API_KEY not configured' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // CREATE SESSION
        if (body.action === 'create') {
            const response = await fetch('https://api.heygen.com/v1/streaming.new', {
                method: 'POST',
                headers: {
                    'X-Api-Key': heygenApiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    quality: 'high',
                    avatar_name: '4d8080384450417b84ebf008487a6b35',
                    voice: {
                        voice_id: '30e127089cf14adfad2d8d2eed5e3efe', // Polish voice
                        rate: 1.0,
                        emotion: 'friendly'
                    },
                    language: 'pl',
                    version: 'v2',
                }),
            });

            if (!response.ok) {
                const error = await response.text();
                console.error('HeyGen create session error:', error);
                return new Response(
                    JSON.stringify({ error: 'Failed to create avatar session' }),
                    { status: 500, headers: { 'Content-Type': 'application/json' } }
                );
            }

            const data = await response.json();
            return new Response(
                JSON.stringify(data),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // TALK - Send message to avatar
        if (body.action === 'talk' && body.sessionId && body.message) {
            // 1. Get Gemini response
            if (!cfAccountId) {
                return new Response(
                    JSON.stringify({ error: 'CF_ACCOUNT_ID not configured' }),
                    { status: 500, headers: { 'Content-Type': 'application/json' } }
                );
            }

            const gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${cfAccountId}/google_ai_gate/google-ai-studio/v1beta/models/gemini-2.0-flash-exp:generateContent`;

            const geminiResponse = await fetch(gatewayUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `${DOOR_KNOWLEDGE_BASE}\n\nUser: ${body.message}\n\nBonzo (respond in 1-2 short sentences in Polish):`
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 100, // Short responses for avatar
                    }
                })
            });

            if (!geminiResponse.ok) {
                const error = await geminiResponse.text();
                console.error('Gemini API error:', error);
                return new Response(
                    JSON.stringify({ error: 'AI service unavailable' }),
                    { status: 500, headers: { 'Content-Type': 'application/json' } }
                );
            }

            const geminiData = await geminiResponse.json() as {
                candidates: Array<{
                    content: {
                        parts: Array<{ text: string }>;
                    };
                }>;
            };

            const aiReply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ||
                'Przepraszam, nie mogę teraz odpowiedzieć.';

            // 2. Send to HeyGen avatar to speak
            const talkResponse = await fetch(
                `https://api.heygen.com/v1/streaming.task`,
                {
                    method: 'POST',
                    headers: {
                        'X-Api-Key': heygenApiKey,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        session_id: body.sessionId,
                        text: aiReply,
                        task_type: 'repeat',
                    }),
                }
            );

            if (!talkResponse.ok) {
                const error = await talkResponse.text();
                console.error('HeyGen talk error:', error);
                return new Response(
                    JSON.stringify({ error: 'Failed to send message to avatar' }),
                    { status: 500, headers: { 'Content-Type': 'application/json' } }
                );
            }

            return new Response(
                JSON.stringify({
                    success: true,
                    reply: aiReply
                }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // CLOSE SESSION
        if (body.action === 'close' && body.sessionId) {
            const response = await fetch(
                `https://api.heygen.com/v1/streaming.stop`,
                {
                    method: 'POST',
                    headers: {
                        'X-Api-Key': heygenApiKey,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        session_id: body.sessionId,
                    }),
                }
            );

            if (!response.ok) {
                console.error('HeyGen close session error:', await response.text());
            }

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
        console.error('Avatar stream error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
