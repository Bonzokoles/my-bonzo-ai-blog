globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../../renderers.mjs';

class OpenAIGateway {
  constructor(accountId, gatewaySlug, apiKey) {
    this.gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewaySlug}/openai`;
    this.apiKey = apiKey;
  }
  /**
   * Chat completion request through AI Gateway
   */
  async chatCompletion(request) {
    const response = await fetch(`${this.gatewayUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(request)
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }
    return response.json();
  }
  /**
   * Streaming chat completion through AI Gateway
   */
  async chatCompletionStream(request) {
    const response = await fetch(`${this.gatewayUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        ...request,
        stream: true
      })
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }
    if (!response.body) {
      throw new Error("Response body is null");
    }
    return response.body;
  }
  /**
   * Embeddings through AI Gateway
   */
  async createEmbedding(input, model = "text-embedding-ada-002") {
    const response = await fetch(`${this.gatewayUrl}/embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model,
        input
      })
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }
    return response.json();
  }
  /**
   * Moderation through AI Gateway
   */
  async moderate(input) {
    const response = await fetch(`${this.gatewayUrl}/moderations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({ input })
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }
    return response.json();
  }
}
function createOpenAIGateway(env) {
  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  const gatewaySlug = env.AI_GATEWAY_SLUG || "mybonzo-ai-gateway";
  const apiKey = env.OPENAI_API_KEY;
  if (!accountId) {
    throw new Error("CLOUDFLARE_ACCOUNT_ID not configured");
  }
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not configured");
  }
  return new OpenAIGateway(accountId, gatewaySlug, apiKey);
}

const prerender = false;
const rateLimiter = /* @__PURE__ */ new Map();
const RATE_LIMIT = 20;
const RATE_WINDOW = 3e5;
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
const POST = async ({ request, locals, clientAddress }) => {
  try {
    const body = await request.json();
    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const clientId = clientAddress || "unknown";
    if (!checkRateLimit(clientId)) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded. Please wait 5 minutes.",
          retryAfter: 300
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "300"
          }
        }
      );
    }
    const env = locals.runtime?.env;
    const gateway = createOpenAIGateway(env);
    const model = body.model || "gpt-4o-mini";
    const temperature = body.temperature ?? 0.7;
    const max_tokens = body.max_tokens || 1e3;
    const chatRequest = {
      model,
      messages: body.messages,
      temperature,
      max_tokens,
      top_p: body.top_p,
      frequency_penalty: body.frequency_penalty,
      presence_penalty: body.presence_penalty
    };
    if (body.stream) {
      const stream = await gateway.chatCompletionStream(chatRequest);
      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
          "X-Accel-Buffering": "no"
        }
      });
    }
    const response = await gateway.chatCompletion(chatRequest);
    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Model": model,
          "X-Tokens-Used": response.usage.total_tokens.toString()
        }
      }
    );
  } catch (error) {
    console.error("OpenAI Chat Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
const GET = async () => {
  return new Response(
    JSON.stringify({
      status: "healthy",
      service: "OpenAI Chat API (via AI Gateway)",
      models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"],
      features: ["streaming", "caching", "rate-limiting", "analytics"],
      limits: {
        rate: "20 requests per 5 minutes",
        maxTokens: 4096,
        temperature: "0-2"
      }
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
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
