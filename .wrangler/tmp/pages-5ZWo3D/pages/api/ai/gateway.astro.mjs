globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const CLOUDFLARE_AI_GATEWAY_BASE = "https://gateway.ai.cloudflare.com/v1";
function getClientIP(request) {
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
}
const POST = async ({ request }) => {
  try {
    const clientIP = getClientIP(request);
    console.log(`AI Gateway request from IP: ${clientIP}`);
    const body = await request.json();
    if (!body.messages || !Array.isArray(body.messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid request: messages array required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const env = request.env || {};
    const accountId = env.CLOUDFLARE_ACCOUNT_ID ?? (typeof process !== "undefined" ? process.env.CLOUDFLARE_ACCOUNT_ID : void 0);
    const gatewayId = env.CLOUDFLARE_AI_GATEWAY_ID ?? (typeof process !== "undefined" ? process.env.CLOUDFLARE_AI_GATEWAY_ID : void 0);
    const apiToken = env.CLOUDFLARE_API_TOKEN ?? (typeof process !== "undefined" ? process.env.CLOUDFLARE_API_TOKEN : void 0);
    if (!accountId || !gatewayId) {
      return new Response(
        JSON.stringify({
          error: "AI Gateway not configured. Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_AI_GATEWAY_ID"
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const gatewayUrl = `${CLOUDFLARE_AI_GATEWAY_BASE}/${accountId}/${gatewayId}/compat/chat/completions`;
    const requestBody = {
      model: body.model || "@cf/google/gemma-3-12b-it",
      messages: body.messages,
      temperature: body.temperature ?? 0.7,
      max_tokens: body.max_tokens ?? 512
    };
    const headers = {
      "Content-Type": "application/json",
      "User-Agent": "MyBonzo-AI-Blog/1.0"
    };
    if (apiToken) {
      headers["Authorization"] = `Bearer ${apiToken}`;
    }
    console.log(`Calling AI Gateway: ${gatewayUrl}`);
    console.log("Request payload:", JSON.stringify(requestBody, null, 2));
    const response = await fetch(gatewayUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody)
    });
    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(`AI Gateway error ${response.status}:`, errorText);
      return new Response(
        JSON.stringify({
          error: `AI Gateway error: ${response.status} ${response.statusText}`,
          details: errorText
        }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }
    const result = await response.json();
    console.log("AI Gateway response:", JSON.stringify(result, null, 2));
    return new Response(
      JSON.stringify({
        success: true,
        ...result
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      }
    );
  } catch (error) {
    console.error("AI Gateway endpoint error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
const OPTIONS = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  OPTIONS,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
