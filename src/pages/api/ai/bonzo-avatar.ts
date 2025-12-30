import { withFeatureMiddleware } from '@/middleware/api-middleware';
import type { APIRoute } from 'astro';

export const prerender = false;

const HEYGEN_API_URL = 'https://api.heygen.com/v1/streaming.new';

// Baza wiedzy o drzwiach PORTA
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
- Odpowiadasz po polsku, rzeczowo i konkretnie
- Z lekkim sarkazmem i humorem (ale nie przesadzaj!)
- Jesteś ekspertem od drzwi PORTA
- Pomagasz klientom wybrać odpowiedni model
- Znasz wszystkie szczegóły techniczne

ZASADY:
- Zawsze podawaj dokładne informacje z bazy wiedzy
- Jeśli pytają o cenę, podaj ją (jeśli jest dostępna)
- Proponuj konkretne modele dopasowane do potrzeb klienta
- Jeśli chcą kupić, podaj dane kontaktowe Norberta
- Bądź pomocny, ale nie nachalny
- Odpowiadaj krótko (2-3 zdania max), bo to rozmowa z awatarem

BAZA WIEDZY:
${KNOWLEDGE_BASE}`;

export const POST: APIRoute = async (context) => {
  return withFeatureMiddleware(
    'ai-bonzo-avatar',
    context,
    'user',
    async (ctx, requestContext) => {
      try {
        const { action, sessionId, text } = await ctx.request.json();

        // Get API keys from environment
        const env = (ctx.locals as any)?.runtime?.env;
        const heygenKey =
          env?.HEYGEN_API_KEY ||
          (typeof process !== 'undefined' ? process.env.HEYGEN_API_KEY : undefined) ||
          (import.meta as any).env?.HEYGEN_API_KEY;

        if (!heygenKey) {
          return new Response(
            JSON.stringify({
              success: false,
              error: 'HeyGen API key not configured'
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }

        if (action === 'new') {
          // Create new streaming avatar session
          const response = await fetch(HEYGEN_API_URL, {
            method: 'POST',
            headers: {
              'X-Api-Key': heygenKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              quality: 'high',
              avatar_name: 'Wayne_20240711', // Default avatar
              voice: {
                voice_id: '30e127089cf14adfad2d8d2eed5e3efe', // Polish male voice
                language: 'Polish'
              }
            })
          });

          if (!response.ok) {
            const error = await response.text();
            console.error('HeyGen session creation error:', error);
            return new Response(
              JSON.stringify({
                success: false,
                error: 'Failed to create avatar session',
                details: error
              }),
              { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
          }

          const data = await response.json();
          return new Response(
            JSON.stringify({
              success: true,
              data
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        }

        if (action === 'speak' && sessionId && text) {
          // Get AI response first
          const accountId =
            env?.CLOUDFLARE_ACCOUNT_ID ||
            (typeof process !== 'undefined' ? process.env.CLOUDFLARE_ACCOUNT_ID : undefined) ||
            (import.meta as any).env?.CLOUDFLARE_ACCOUNT_ID;

          const openaiKey =
            env?.OPENAI_API_KEY ||
            (typeof process !== 'undefined' ? process.env.OPENAI_API_KEY : undefined) ||
            (import.meta as any).env?.OPENAI_API_KEY;

          if (!accountId || !openaiKey) {
            return new Response(
              JSON.stringify({
                success: false,
                error: 'OpenAI configuration missing'
              }),
              { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
          }

          const aiResponse = await fetch(
            `https://gateway.ai.cloudflare.com/v1/${accountId}/bonzo-ai-gateway/openai/chat/completions`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiKey}`
              },
              body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                  { role: 'system', content: SYSTEM_PROMPT },
                  { role: 'user', content: text }
                ],
                temperature: 0.7,
                max_tokens: 150
              })
            }
          );

          const aiData = await aiResponse.json();
          const reply = aiData.choices[0]?.message?.content || 'Przepraszam, nie zrozumiałem.';

          // Send text to avatar to speak
          const speakResponse = await fetch(`https://api.heygen.com/v1/streaming.task`, {
            method: 'POST',
            headers: {
              'X-Api-Key': heygenKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              session_id: sessionId,
              text: reply
            })
          });

          if (!speakResponse.ok) {
            const error = await speakResponse.text();
            console.error('HeyGen speak error:', error);
            return new Response(
              JSON.stringify({
                success: false,
                error: 'Failed to send text to avatar',
                details: error
              }),
              { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify({
              success: true,
              data: { reply }
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        }

        if (action === 'stop' && sessionId) {
          // Stop streaming session
          const stopResponse = await fetch(`https://api.heygen.com/v1/streaming.stop`, {
            method: 'POST',
            headers: {
              'X-Api-Key': heygenKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              session_id: sessionId
            })
          });

          if (!stopResponse.ok) {
            console.error('HeyGen stop error:', await stopResponse.text());
          }

          return new Response(
            JSON.stringify({ success: true }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({
            success: false,
            error: 'Invalid action. Valid actions: new, speak, stop'
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );

      } catch (error) {
        console.error('Avatar API error:', error);
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  );
};

export const GET: APIRoute = async (context) => {
  return withFeatureMiddleware(
    'ai-bonzo-avatar',
    context,
    'public',
    async () => {
      return new Response(
        JSON.stringify({
          success: true,
          info: {
            service: 'Bonzo Avatar API',
            provider: 'HeyGen',
            features: [
              'Streaming video avatar',
              'Polish voice support',
              'OpenAI GPT-4o-mini integration',
              'PORTA doors knowledge base',
              'Real-time conversation'
            ],
            actions: [
              'new - Create new avatar session',
              'speak - Send text for avatar to speak',
              'stop - Stop avatar session'
            ],
            rateLimit: '3 requests per 5 minutes'
          }
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  );
};
