globalThis.process ??= {}; globalThis.process.env ??= {};
import { withFeatureMiddleware } from '../../chunks/api-middleware_MytvPj0_.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const POST = async (context) => {
  return withFeatureMiddleware(
    "ai-chat",
    // Feature ID from config/features.ts
    context,
    "public",
    // Required permission level
    async (ctx, requestContext) => {
      try {
        const body = await ctx.request.json();
        const { prompt } = body;
        if (!prompt) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Prompt is required"
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" }
            }
          );
        }
        const response = `Echo: ${prompt}`;
        return new Response(
          JSON.stringify({
            success: true,
            data: { response },
            metadata: {
              featureId: "ai-chat",
              timestamp: requestContext.timestamp,
              environment: requestContext.environment
            }
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" }
          }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
    }
  );
};
const GET = async (context) => {
  return withFeatureMiddleware(
    "ai-chat",
    context,
    "public",
    async (ctx, requestContext) => {
      return new Response(
        JSON.stringify({
          success: true,
          message: "AI Chat endpoint is available",
          info: {
            featureId: "ai-chat",
            method: "GET",
            environment: requestContext.environment,
            clientAddress: requestContext.clientAddress
          }
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
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
