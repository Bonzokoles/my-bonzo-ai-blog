globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const DEFAULT_MODEL = "@cf/google/gemma-3-12b-it";
const DEFAULT_TEMPERATURE = 0.7;
const DEFAULT_MAX_TOKENS = 1024;
const MAX_PROMPT_LENGTH = 2e3;
const rateLimiter = /* @__PURE__ */ new Map();
const RATE_LIMIT = 15;
const RATE_WINDOW = 6e4;
function getClientIP(request) {
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
}
function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimiter.get(ip);
  if (!record || now > record.resetTime) {
    rateLimiter.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return { allowed: true };
  }
  if (record.count >= RATE_LIMIT) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1e3);
    return { allowed: false, retryAfter };
  }
  record.count++;
  return { allowed: true };
}
function sanitiseHistory(history) {
  if (!Array.isArray(history)) return [];
  return history.filter((entry) => {
    return entry && typeof entry === "object" && "role" in entry && "content" in entry && typeof entry.content === "string" && entry.content.trim().length > 0;
  }).slice(-6).map((entry) => ({
    role: entry.role === "user" || entry.role === "assistant" ? entry.role : "assistant",
    content: entry.content.trim()
  }));
}
function buildSystemPrompt(model) {
  return `Jesteś pomocnym asystentem AI MyBonzo. Odpowiadasz po polsku.

Używaj markdown do formatowania:
- **pogrubienie**
- *kursywa*
- \`kod inline\`
- Bloki kodu: \`\`\`język\\nkod\\n\`\`\`
- [linki](url)

Model: ${model}
MCP Tools: dostępne (Context7, Sequential Thinking)

Odpowiadaj rzeczowo i profesjonalnie. Jeśli nie znasz odpowiedzi, powiedz o tym otwarcie.`;
}
const POST = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  const clientIP = getClientIP(request);
  const rateLimitCheck = checkRateLimit(clientIP);
  if (!rateLimitCheck.allowed) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Przekroczono limit zapytań. Spróbuj ponownie za chwilę."
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(rateLimitCheck.retryAfter ?? 60)
        }
      }
    );
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Nieprawidłowe dane wejściowe."
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
  const { prompt, history: rawHistory, model, temperature, max_tokens } = body;
  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Pole "prompt" jest wymagane.'
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return new Response(
      JSON.stringify({
        success: false,
        error: `Prompt jest zbyt długi (limit ${MAX_PROMPT_LENGTH} znaków).`
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
  const history = sanitiseHistory(rawHistory);
  const selectedModel = model && typeof model === "string" ? model : DEFAULT_MODEL;
  const temp = typeof temperature === "number" ? Math.max(0, Math.min(1, temperature)) : DEFAULT_TEMPERATURE;
  const maxTokens = typeof max_tokens === "number" ? Math.max(128, Math.min(2048, max_tokens)) : DEFAULT_MAX_TOKENS;
  const systemPrompt = buildSystemPrompt(selectedModel);
  const messages = [
    { role: "system", content: systemPrompt },
    ...history.slice(-6),
    { role: "user", content: prompt.trim() }
  ];
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        if (!env?.AI) {
          throw new Error("AI binding niedostępny");
        }
        const aiResponse = await env.AI.run(selectedModel, {
          messages,
          temperature: temp,
          max_tokens: maxTokens,
          stream: true
        });
        if (aiResponse instanceof ReadableStream) {
          const reader = aiResponse.getReader();
          const decoder = new TextDecoder();
          let accumulatedText = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              const data = JSON.stringify({ done: true, fullText: accumulatedText });
              controller.enqueue(encoder.encode(`data: ${data}

`));
              break;
            }
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const jsonData = JSON.parse(line.slice(6));
                  if (jsonData.response) {
                    accumulatedText += jsonData.response;
                    const data = JSON.stringify({
                      chunk: jsonData.response,
                      accumulated: accumulatedText
                    });
                    controller.enqueue(encoder.encode(`data: ${data}

`));
                  }
                } catch (e) {
                  console.error("Error parsing AI stream chunk:", e);
                }
              }
            }
          }
        } else {
          const response = aiResponse.response;
          const words = response.split(" ");
          let accumulatedText = "";
          for (let i = 0; i < words.length; i++) {
            const word = words[i] + (i < words.length - 1 ? " " : "");
            accumulatedText += word;
            const data2 = JSON.stringify({
              chunk: word,
              accumulated: accumulatedText
            });
            controller.enqueue(encoder.encode(`data: ${data2}

`));
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
          const data = JSON.stringify({ done: true, fullText: accumulatedText });
          controller.enqueue(encoder.encode(`data: ${data}

`));
        }
      } catch (error) {
        console.error("Streaming error:", error);
        const errorData = JSON.stringify({
          error: "Nie udało się wygenerować odpowiedzi AI.",
          details: error instanceof Error ? error.message : String(error)
        });
        controller.enqueue(encoder.encode(`data: ${errorData}

`));
      } finally {
        controller.close();
      }
    }
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "X-Content-Type-Options": "nosniff"
    }
  });
};
const GET = async () => {
  return new Response(
    JSON.stringify({
      status: "healthy",
      endpoint: "chat-stream",
      features: ["streaming", "sse", "progressive-rendering"],
      rateLimit: {
        requests: RATE_LIMIT,
        window: `${RATE_WINDOW / 1e3}s`
      }
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
};
const OPTIONS = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
