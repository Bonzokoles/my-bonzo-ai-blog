import type { APIRoute } from 'astro';

/**
 * Gemini AI Chat API
 * Google Gemini multi-modal chat with PORTA doors knowledge base
 */

const DOOR_KNOWLEDGE_BASE = `
You are an expert on our exclusive line of doors. Knowledge base:

1. Model: The Urbanist
   - Type: Exterior, Front Door
   - Style: Modern, Minimalist
   - Material: Reinforced steel core, matte black aluminum, frosted glass inlay
   - Features: Smart lock compatible, thermal insulation (U-value: 0.8 W/m²K), weatherproof
   - Best For: Modern apartments, city homes, minimalist architecture

2. Model: The Highlander
   - Type: Exterior, Front Door
   - Style: Rustic, Traditional
   - Material: Solid oak wood, natural grain, wrought iron hardware
   - Features: Acoustic insulation, multi-point locking, classic peephole
   - Best For: Country houses, traditional homes

3. Model: The Sentinel
   - Type: Exterior, High-Security
   - Style: Contemporary, Secure
   - Material: Multi-layered steel, composite core, RC3 certified, anthracite grey
   - Features: Fingerprint scanner, digital keypad, anti-pry hinges, fire-resistant (30min)
   - Best For: Maximum security with modern aesthetics

4. Model: The Lumina
   - Type: Interior Door
   - Style: Modern, Bright
   - Material: Laminated frosted glass, slim white-painted wooden frame
   - Features: Light-passing, privacy, silent magnetic lock
   - Best For: Living rooms, hallways, kitchens - increase space and light

5. Model: The EcoScape
   - Type: Exterior/Interior
   - Style: Scandinavian, Eco-Friendly
   - Material: 95% reclaimed wood, recycled materials, pine/birch veneer
   - Features: Thermal properties, low footprint, water-based non-toxic finish
   - Best For: Eco-conscious homeowners, Scandinavian-style, sustainable projects

**IMPORTANT**: Respond in POLISH language. You are Bonzo, friendly door expert.
`;

export const POST: APIRoute = async ({ request }) => {
    try {
        const { message } = await request.json() as { message: string };

        if (!message) {
            return new Response(
                JSON.stringify({ error: 'Message is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const geminiApiKey = import.meta.env.GEMINI_API_KEY;

        if (!geminiApiKey) {
            return new Response(
                JSON.stringify({ error: 'Gemini API key not configured' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Call Gemini API
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `${DOOR_KNOWLEDGE_BASE}\n\nUser question: ${message}\n\nRespond in Polish as Bonzo, the door expert.`
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 500,
                    }
                })
            }
        );

        if (!response.ok) {
            const error = await response.text();
            console.error('Gemini API error:', error);
            return new Response(
                JSON.stringify({ error: 'Gemini API unavailable' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const data = await response.json() as {
            candidates: Array<{
                content: {
                    parts: Array<{ text: string }>;
                };
            }>;
        };

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ||
            'Przepraszam, nie mogę odpowiedzieć w tym momencie.';

        return new Response(
            JSON.stringify({ reply }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Gemini chat error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
