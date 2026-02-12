globalThis.process ??= {}; globalThis.process.env ??= {};
import { withFeatureMiddleware } from '../../../chunks/api-middleware_MytvPj0_.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const SYSTEM_INSTRUCTIONS = `Jesteś Bonzo – sprzedawca drzwi wewnętrznych marki PORTA.

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
- Odpowiadaj krótko i zwięźle w rozmowie głosowej

BAZA WIEDZY:
PORTA - Katalog Drzwi Wewnętrznych

1. PORTA FOCUS PREMIUM model 5.A - od 1033 PLN netto
   - Wypełnienie: plaster miodu lub płyta wiórowa + płyta HDF
   - Powierzchnia: trwała, odporna na ścieranie, matowa
   - Szyba: szkło hartowane matowe 8mm
   - Kolory: białe lakierowane lub farba akrylowa UV

2. PORTA FACTOR model 5 - od 629 PLN netto
   - Design: minimalistyczny, biały z symetrycznym frezowaniem
   - Wypełnienie: płyta wiórowa
   - Zawiasy: 2-3 sztuki czopowe
   - Możliwość niestandardowych wymiarów

3. PORTA DESIRE 5 - cena po kontakcie
   - Płyta wiórowa otworowa z aluminiowymi listwami
   - Powłoka: farba akrylowa UV
   - Wymiary: 60-100cm, Gwarancja: 2 lata

4. PORTA ART DECO model 5 - cena po kontakcie
   - Styl art deco, lakierowane lub malowane
   - Szerokości: 60-100cm

5. PORTA VERTE HOME model H.5 - cena po kontakcie
   - Konstrukcja ramiakowa z szybami matowymi 4mm
   - Opcje dwuskrzydłowe, szeroki wybór kolorów

KONTAKT:
Sprzedawca: Norbert
Telefon: 790 645 410
Dostępność: tylko po 23:00 w środę`;
const POST = async (context) => {
  return withFeatureMiddleware(
    "ai-bonzo-voice",
    context,
    "user",
    async (ctx, requestContext) => {
      try {
        const env = ctx.locals?.runtime?.env;
        const apiKey = env?.OPENAI_API_KEY || (typeof process !== "undefined" ? process.env.OPENAI_API_KEY : void 0) || process.env.OPENAI_API_KEY;
        if (!apiKey) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "OpenAI API key not configured"
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
        const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "gpt-4o-realtime-preview-2024-12-17",
            voice: "echo",
            // Męski, przyjazny głos
            instructions: SYSTEM_INSTRUCTIONS,
            input_audio_transcription: {
              model: "whisper-1"
            },
            turn_detection: {
              type: "server_vad",
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 500
            },
            temperature: 0.7,
            max_response_output_tokens: 500
          })
        });
        if (!response.ok) {
          const error = await response.text();
          console.error("OpenAI Realtime API error:", error);
          return new Response(
            JSON.stringify({
              success: false,
              error: "Failed to create voice session",
              details: error
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
        const session = await response.json();
        return new Response(
          JSON.stringify({
            success: true,
            data: {
              client_secret: session.client_secret.value,
              expires_at: session.client_secret.expires_at,
              session_id: session.id
            },
            metadata: {
              featureId: "ai-bonzo-voice",
              clientAddress: requestContext.clientAddress,
              timestamp: requestContext.timestamp
            }
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      } catch (error) {
        console.error("Bonzo voice session error:", error);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Internal server error",
            details: error instanceof Error ? error.message : "Unknown error"
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }
  );
};
const GET = async (context) => {
  return withFeatureMiddleware(
    "ai-bonzo-voice",
    context,
    "public",
    async () => {
      return new Response(
        JSON.stringify({
          success: true,
          info: {
            service: "Bonzo Voice API",
            model: "gpt-4o-realtime-preview-2024-12-17",
            voice: "echo (male, friendly)",
            features: [
              "OpenAI Realtime API",
              "Voice Activity Detection (VAD)",
              "Whisper transcription",
              "PORTA doors knowledge base"
            ],
            rateLimit: "10 requests per 5 minutes"
          }
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
