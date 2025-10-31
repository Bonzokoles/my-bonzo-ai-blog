import type { APIRoute } from 'astro';

/**
 * Avatar Chat API - Bonzo Door Sales Avatar with HeyGen Voice
 * This endpoint combines OpenAI chat with HeyGen TTS for avatar interactions
 */

// PORTA knowledge base
const KNOWLEDGE_BASE = `
PORTA - Katalog Drzwi Wewnętrznych

1. PORTA FOCUS PREMIUM model 5.A - od 1033 PLN netto
   - Wypełnienie: plaster miodu lub płyta wiórowa + płyta HDF
   - Powierzchnia: trwała, odporna na ścieranie, matowa
   - Szyba: szkło hartowane matowe 8mm (wersje przeszklone)
   - Kolory: białe lakierowane lub farba akrylowa UV
   - Okucia: zamki na klucz, blokada WC, wkładka patentowa, zawiasy trzyczęściowe

2. PORTA FACTOR model 5 - od 629 PLN netto
   - Design: minimalistyczny, biały z symetrycznym frezowaniem
   - Wypełnienie: płyta wiórowa
   - Zawiasy: 2-3 sztuki czopowe
   - Zamki: klucz zwykły, blokada WC, wkładka patentowa
   - Możliwość niestandardowych wymiarów

3. PORTA DESIRE 5 - cena po kontakcie
   - Płyta wiórowa otworowa + aluminiowe listwy dekoracyjne
   - Powłoka: farba akrylowa UV
   - Zawiasy: 3 Prime lub 2 zawiasy 3D
   - Wymiary: 60-100cm szerokości
   - Gwarancja: 2 lata

4. PORTA ART DECO model 5 - cena po kontakcie
   - Styl: art deco
   - Wykończenie: lakierowane lub malowane
   - Szerokości: 60-100cm
   - Typ: przylgowe lub bezprzylgowe

5. PORTA VERTE HOME model H.5 - cena po kontakcie
   - Konstrukcja: ramiakowa z szybami matowymi 4mm
   - Opcje: dwuskrzydłowe
   - Kolory: szeroki wybór
   - Trwała konstrukcja, estetyczne wykończenie

KONTAKT:
Sprzedawca: Norbert king bruce lee karate mistrz
Adres: ul. Jacka niezbyt Mądrego 13
Telefon: 790 645 410
Dostępność: tylko po 23:00 w środę
`;

const SYSTEM_PROMPT = `Jesteś Bonzo – sprzedawca drzwi wewnętrznych marki PORTA.

OSOBOWOŚĆ:
- Odpowiadasz po polsku, rzeczowo i z lekkim sarkazmem
- Jesteś ekspertem od drzwi PORTA
- Mówisz krótko i na temat (max 2-3 zdania na odpowiedź)
- Używasz humoru, ale nie przesadzasz
- Znasz wszystkie modele i ceny na pamięć

ZASADY:
- Zawsze podawaj dokładne informacje z bazy wiedzy
- Jeśli pytają o cenę, podaj ją natychmiast
- Proponuj konkretne modele dopasowane do potrzeb
- Jeśli chcą kupić, podaj dane kontaktowe Norberta
- Bądź pomocny, ale nie nachalny

BAZA WIEDZY:
${KNOWLEDGE_BASE}`;

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json() as { message: string };
        const { message } = body;

        if (!message) {
            return new Response(
                JSON.stringify({ error: 'Message is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Get environment variables
        const accountId = import.meta.env.CLOUDFLARE_ACCOUNT_ID;
        const openaiKey = import.meta.env.OPENAI_API_KEY;
        const heygenKey = import.meta.env.HEYGEN_API_KEY;

        if (!accountId || !openaiKey) {
            return new Response(
                JSON.stringify({ error: 'API configuration missing' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 1. Get AI response from OpenAI via Cloudflare AI Gateway
        const gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${accountId}/bonzo-ai-gateway/openai/chat/completions`;

        const chatResponse = await fetch(gatewayUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: message }
                ],
                temperature: 0.7,
                max_tokens: 200 // Short responses for avatar
            })
        });

        if (!chatResponse.ok) {
            const error = await chatResponse.text();
            console.error('OpenAI API error:', error);
            return new Response(
                JSON.stringify({ error: 'AI service unavailable' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const chatData = await chatResponse.json() as { choices: Array<{ message: { content: string } }> };
        const reply = chatData.choices[0]?.message?.content || 'Przepraszam, nie mogę odpowiedzieć.';

        // 2. Generate voice with HeyGen TTS
        let audioUrl = null;

        if (heygenKey) {
            try {
                const ttsResponse = await fetch('https://api.heygen.com/v1/voice.create', {
                    method: 'POST',
                    headers: {
                        'X-Api-Key': heygenKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        text: reply,
                        voice_id: '30e127089cf14adfad2d8d2eed5e3efe', // Your HeyGen voice ID
                        language: 'pl-PL'
                    })
                });

                if (ttsResponse.ok) {
                    const audioArrayBuffer = await ttsResponse.arrayBuffer();
                    const audioBase64 = Buffer.from(audioArrayBuffer).toString('base64');
                    audioUrl = `data:audio/mp3;base64,${audioBase64}`;
                } else {
                    console.error('HeyGen TTS error:', await ttsResponse.text());
                }
            } catch (ttsError) {
                console.error('HeyGen TTS request failed:', ttsError);
            }
        }

        // 3. Return both text and audio
        return new Response(
            JSON.stringify({ reply, audioUrl }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );

    } catch (error) {
        console.error('Avatar API error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
