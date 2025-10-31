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

export default {
  async fetch(request, env) {
    const { message } = await request.json();
    const base = `https://gateway.ai.cloudflare.com/v1/${env.CF_ACCOUNT_ID}/bonzo-ai-gateway/openai`;

    const chat = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Jesteś Bonzo – sprzedawca drzwi wewnętrznych marki PORTA.

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
${KNOWLEDGE_BASE}
`
          },
          { role: "user", content: message }
        ]
      })
    });
    const data = await chat.json();
    const text = data.choices[0].message.content;

    // generuj głos
    const tts = await fetch(`${base}/audio/speech`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice: "oak",
        input: text
      })
    });
    const audioArrayBuffer = await tts.arrayBuffer();
    const audioBase64 = Buffer.from(audioArrayBuffer).toString("base64");
    const audioUrl = `data:audio/mp3;base64,${audioBase64}`;

    return new Response(JSON.stringify({ reply: text, audioUrl }), {
      headers: { "Content-Type": "application/json" }
    });
  }
};
