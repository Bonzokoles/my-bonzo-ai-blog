import type { APIRoute } from 'astro';

// Baza wiedzy o drzwiach PORTA dla audio agenta
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

export const POST: APIRoute = async ({ request }) => {
  try {
    const apiKey = import.meta.env.OPENAI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API configuration missing' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create ephemeral token for Realtime API
    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-realtime-preview-2024-12-17',
        voice: 'echo', // Męski, przyjazny głos
        instructions: SYSTEM_INSTRUCTIONS,
        input_audio_transcription: {
          model: 'whisper-1'
        },
        turn_detection: {
          type: 'server_vad',
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
      console.error('OpenAI Realtime API error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to create session' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const session = await response.json();

    return new Response(
      JSON.stringify({
        client_secret: session.client_secret.value,
        expires_at: session.client_secret.expires_at,
        session_id: session.id
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Bonzo voice session error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
