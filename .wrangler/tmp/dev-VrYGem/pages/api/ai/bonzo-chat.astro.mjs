globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const KNOWLEDGE_BASE = `
MyBonzo AI Blog - Twój przewodnik po świecie sztucznej inteligencji

TEMATYKA:
- Najnowsze osiągnięcia w AI i machine learning
- Praktyczne zastosowania AI w biznesie
- Tutoriale i przykłady kodu
- Recenzje narzędzi AI
- Etyka i przyszłość sztucznej inteligencji

KONTAKT:
Email: kontakt@mybonzo.pl
Telefon: 790 645 410
`;
const SYSTEM_PROMPT = `Jesteś Bonzo – asystent AI bloga MyBonzo.

OSOBOWOŚĆ:
- Odpowiadasz po polsku, rzeczowo i konkretnie
- Z lekkim sarkazmem i humorem (ale nie przesadzaj!)
- Jesteś ekspertem od sztucznej inteligencji
- Pomagasz użytkownikom znaleźć interesujące treści
- Znasz najnowsze trendy w AI

ZASADY:
- Zawsze podawaj dokładne informacje
- Proponuj artykuły dopasowane do zainteresowań użytkownika
- Jeśli nie wiesz czegoś, przyznaj się
- Bądź pomocny, ale nie nachalny

BAZA WIEDZY:
${KNOWLEDGE_BASE}`;
const POST = async ({ request }) => {
  try {
    const { message } = await request.json();
    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const accountId = undefined                                     ;
    const apiKey = process.env.OPENAI_API_KEY;
    if (!accountId || !apiKey) {
      return new Response(
        JSON.stringify({ error: "API configuration missing" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${accountId}/bonzo-ai-gateway/openai/chat/completions`;
    const response = await fetch(gatewayUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });
    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API error:", error);
      return new Response(
        JSON.stringify({ error: "AI service unavailable" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "Przepraszam, nie mogę odpowiedzieć w tym momencie.";
    return new Response(
      JSON.stringify({ reply }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Bonzo chat error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
