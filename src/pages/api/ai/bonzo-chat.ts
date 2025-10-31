import type { APIRoute } from 'astro';

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

BAZA WIEDZY:
${KNOWLEDGE_BASE}`;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { message } = await request.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Use Cloudflare AI Gateway for OpenAI
    const accountId = import.meta.env.CLOUDFLARE_ACCOUNT_ID;
    const apiKey = import.meta.env.OPENAI_API_KEY;

    if (!accountId || !apiKey) {
      return new Response(
        JSON.stringify({ error: 'API configuration missing' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${accountId}/bonzo-ai-gateway/openai/chat/completions`;

    const response = await fetch(gatewayUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      return new Response(
        JSON.stringify({ error: 'AI service unavailable' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || 'Przepraszam, nie mogę odpowiedzieć w tym momencie.';

    return new Response(
      JSON.stringify({ reply }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Bonzo chat error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
