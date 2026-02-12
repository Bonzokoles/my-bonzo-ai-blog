globalThis.process ??= {}; globalThis.process.env ??= {};
import { C as CHAT_MODELS, D as DEFAULT_CHAT_MODEL } from '../../../chunks/ai-chat-models_DfqCo_61.mjs';
export { renderers } from '../../../renderers.mjs';

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://www.mybonzoaiblog.com", "SSR": true};
const MCP_TOOLS = [
  {
    name: "search_context7_docs",
    description: "Search technical documentation and library contexts",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query for documentation" }
      },
      required: ["query"]
    }
  },
  {
    name: "sequential_thinking",
    description: "Break down complex problems into sequential steps",
    inputSchema: {
      type: "object",
      properties: {
        problem: { type: "string", description: "Complex problem to analyze" }
      },
      required: ["problem"]
    }
  },
  {
    name: "get_shop_data",
    description: "Get real-time shop data from Meble Pumo IdoSell integration",
    inputSchema: {
      type: "object",
      properties: {
        data_type: { type: "string", enum: ["current_status", "analytics", "orders"], description: "Type of shop data to retrieve" }
      },
      required: ["data_type"]
    }
  }
];
const SUPPORTED_MODEL_IDS = new Set(CHAT_MODELS.map((model) => model.id));
const DEFAULT_MODEL_META = CHAT_MODELS.find((model) => model.id === DEFAULT_CHAT_MODEL) ?? CHAT_MODELS[0];
const rateLimiter = /* @__PURE__ */ new Map();
const RATE_LIMIT = 10;
const RATE_WINDOW = 6e4;
function checkRateLimit(identifier) {
  const now = Date.now();
  const record = rateLimiter.get(identifier);
  if (!record || now > record.resetTime) {
    rateLimiter.set(identifier, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  record.count++;
  return true;
}
function buildSystemPrompt() {
  return [
    "Jestes pomocnym i przyjaznym asystentem AI na polskim blogu MyBonzo z dostepem do narzedzi MCP.",
    "",
    "Zasady odpowiedzi:",
    "- pisz zawsze po polsku, krotko i jasno;",
    "- korzystaj z markdown (np. **pogrubienie**, *kursywa*, `kod`, listy);",
    "- jezeli rozmowa dotyczy AI/ML/technologii, dodawaj wartosciowe szczegoly;",
    "- badz uprzejmy i informuj o ewentualnych ograniczeniach;",
    "- uwzgledniaj kontekst poprzednich wiadomosci;",
    `- gdy pojawia sie pytania o modele, poinformuj, ze domyslnie dziala ${DEFAULT_MODEL_META.label} i opisz roznice miedzy dostepnymi opcjami;`,
    "- masz dostep do narzedzi MCP (Context7, Sequential Thinking) - uzywaj ich gdy potrzebne."
  ].join("\n");
}
function sanitiseHistory(rawHistory) {
  if (!Array.isArray(rawHistory)) {
    return [];
  }
  return rawHistory.slice(-8).map((entry) => {
    const role = entry && typeof entry === "object" && "role" in entry && typeof entry.role === "string" ? entry.role : "user";
    const content = entry && typeof entry === "object" && "content" in entry && typeof entry.content === "string" ? entry.content.trim() : "";
    return {
      role: role === "assistant" || role === "system" ? role : "user",
      content
    };
  }).filter((entry) => entry.content.length > 0);
}
function createCacheKey(payload) {
  const seed = JSON.stringify(payload);
  return `ai:${Buffer.from(seed).toString("base64").slice(0, 120)}`;
}
const POST = async ({ request, locals, clientAddress }) => {
  console.log("🚀 AI Chat API Called");
  console.log("📍 clientAddress:", clientAddress);
  console.log("🔍 locals.runtime:", locals?.runtime ? "Available" : "Not Available");
  try {
    const body = await request.json();
    console.log("📝 Request body:", JSON.stringify(body, null, 2));
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    if (!prompt) {
      console.log("❌ No prompt provided");
      return new Response(
        JSON.stringify({ error: 'Pole "prompt" jest wymagane.' }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (prompt.length > 2e3) {
      return new Response(
        JSON.stringify({ error: "Prompt jest zbyt dlugi (limit 2000 znakow)." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const selectedModel = SUPPORTED_MODEL_IDS.has(body.model || "") ? body.model : DEFAULT_CHAT_MODEL;
    const temperature = Math.max(0, Math.min(body.temperature ?? 0.7, 1));
    const maxTokens = Math.min(body.max_tokens ?? 1024, 2048);
    const clientId = clientAddress || "unknown";
    if (!checkRateLimit(clientId)) {
      return new Response(
        JSON.stringify({
          error: "Przekroczono limit zapytan. Odczekaj chwile przed kolejnym pytaniem.",
          retryAfter: 60
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "60"
          }
        }
      );
    }
    const runtime = locals?.runtime;
    const env = runtime?.env;
    const cfAccountId = env?.CLOUDFLARE_ACCOUNT_ID ?? (typeof process !== "undefined" ? process.env.CLOUDFLARE_ACCOUNT_ID : void 0) ?? Object.assign(__vite_import_meta_env__, { OS: process.env.OS })?.CLOUDFLARE_ACCOUNT_ID;
    const cfApiToken = env?.CLOUDFLARE_API_TOKEN ?? (typeof process !== "undefined" ? process.env.CLOUDFLARE_API_TOKEN : void 0) ?? Object.assign(__vite_import_meta_env__, { OS: process.env.OS })?.CLOUDFLARE_API_TOKEN;
    const history = sanitiseHistory(body.history);
    const cacheKey = createCacheKey({
      model: selectedModel,
      prompt,
      history,
      temperature,
      maxTokens
    });
    if (env.CACHE) {
      const cached = await env.CACHE.get(cacheKey);
      if (cached) {
        const cachedData = JSON.parse(cached);
        return new Response(
          JSON.stringify({
            success: true,
            response: cachedData.response,
            model: cachedData.model,
            cached: true
          }),
          { headers: { "Content-Type": "application/json" } }
        );
      }
    } else {
      console.warn("CACHE namespace is not configured. Responses will not be cached.");
    }
    const messages = [
      { role: "system", content: buildSystemPrompt() },
      ...history.slice(-6),
      { role: "user", content: prompt }
    ];
    let responseText = "";
    console.log("🤖 AI Binding Available:", !!env?.AI);
    console.log("🔑 CF AccountId:", !!cfAccountId);
    console.log("🔑 CF API Token:", !!cfApiToken);
    console.log("📄 Selected Model:", selectedModel);
    if (env?.AI) {
      console.log("✅ Using AI binding...");
      const aiResponse = await env.AI.run(selectedModel, {
        messages,
        temperature,
        max_tokens: maxTokens
      });
      responseText = typeof aiResponse === "string" ? aiResponse : typeof aiResponse?.response === "string" ? aiResponse.response : "";
      console.log("🎯 AI Response received, length:", responseText.length);
    } else if (cfAccountId && cfApiToken) {
      console.log("🌐 Using REST API fallback...");
      const endpoint = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(
        cfAccountId
      )}/ai/run/${selectedModel}`;
      const resp = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cfApiToken}`
        },
        body: JSON.stringify({ messages, temperature, max_tokens: maxTokens })
      });
      if (!resp.ok) {
        const errText = await resp.text().catch(() => "");
        throw new Error(`Cloudflare AI REST error ${resp.status}: ${errText || "unknown"}`);
      }
      const json = await resp.json();
      responseText = json && (json.result?.response || json.response || json.result) || "";
      if (typeof responseText !== "string") {
        responseText = JSON.stringify(responseText);
      }
    } else {
      console.warn("env.AI not available and no REST credentials found. Returning fallback.");
      return new Response(
        JSON.stringify({
          error: "AI runtime niedostepny lokalnie. Skorzystaj z wrangler dev lub ustaw CLOUDFLARE_ACCOUNT_ID i CLOUDFLARE_API_TOKEN w .env."
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    if (!responseText) {
      throw new Error("AI model returned empty response.");
    }
    if (env.CACHE) {
      await env.CACHE.put(
        cacheKey,
        JSON.stringify({
          response: responseText,
          model: selectedModel,
          timestamp: Date.now()
        }),
        { expirationTtl: 3600 }
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        response: responseText,
        model: selectedModel,
        cached: false
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("AI Chat API error:", error);
    return new Response(
      JSON.stringify({
        error: "Nie udalo sie wygenerowac odpowiedzi AI.",
        details: error instanceof Error ? error.message : "Nieznany blad"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
const GET = async ({ url, locals }) => {
  const runtime = locals?.runtime;
  const env = runtime?.env;
  const prompt = url.searchParams.get("prompt");
  const mcpStatus = url.searchParams.get("mcp-status");
  if (mcpStatus === "true") {
    return new Response(
      JSON.stringify({
        mcp: {
          enabled: true,
          tools: MCP_TOOLS.map((tool) => ({ name: tool.name, description: tool.description })),
          servers: [
            { name: "Context7", status: "active", description: "Documentation search" },
            { name: "Sequential Thinking", status: "active", description: "Problem decomposition" },
            { name: "Filesystem", status: "active", description: "File operations" },
            { name: "Memory", status: "active", description: "Context storage" }
          ]
        }
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
  if (!prompt) {
    return new Response(
      JSON.stringify({
        status: "healthy",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        mcp_enabled: true
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
  try {
    const model = "@cf/meta/llama-2-7b-chat-int8";
    const messages = [
      { role: "system", content: buildSystemPrompt() },
      { role: "user", content: prompt }
    ];
    let text = "";
    if (env?.AI) {
      const r = await env.AI.run(model, { messages });
      text = r?.response || "";
    } else {
      const accountId = env?.CLOUDFLARE_ACCOUNT_ID ?? (typeof process !== "undefined" ? process.env.CLOUDFLARE_ACCOUNT_ID : void 0) ?? Object.assign(__vite_import_meta_env__, { OS: process.env.OS })?.CLOUDFLARE_ACCOUNT_ID;
      const token = env?.CLOUDFLARE_API_TOKEN ?? (typeof process !== "undefined" ? process.env.CLOUDFLARE_API_TOKEN : void 0) ?? Object.assign(__vite_import_meta_env__, { OS: process.env.OS })?.CLOUDFLARE_API_TOKEN;
      if (!accountId || !token) {
        return new Response(
          JSON.stringify({ error: "AI binding and REST creds missing." }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
      const endpoint = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(
        accountId
      )}/ai/run/${model}`;
      const resp = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ messages })
      });
      if (!resp.ok) {
        const errText = await resp.text().catch(() => "");
        throw new Error(`Cloudflare AI REST error ${resp.status}: ${errText || "unknown"}`);
      }
      const json = await resp.json();
      text = json?.result?.response || json?.response || "";
    }
    if (!text) {
      throw new Error("Empty response from AI.");
    }
    return new Response(
      JSON.stringify({ response: text, model, mcp_enabled: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Chat failed", details: error?.message, mcp_status: "available" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
