globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getRuntimeConfig } from '../../chunks/environment_D7FRwqP1.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async (context) => {
  try {
    const { runtime, config } = getRuntimeConfig();
    console.log(`[Environment Test] Running in ${runtime} environment`);
    const response = {
      success: true,
      environment: {
        runtime,
        config,
        nodeVersion: typeof process !== "undefined" ? process.version : "N/A",
        cloudflareWorker: runtime === "cloudflare",
        localDev: runtime === "local"
      },
      middleware: {
        allowGlobalInit: config.allowGlobalInit,
        rateLimitStorage: config.rateLimitStorage
      },
      context: {
        clientAddress: context.clientAddress,
        url: context.url.href,
        method: context.request.method
      },
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (config.allowGlobalInit || runtime === "cloudflare") {
      try {
        const { createRequestContext } = await import('../../chunks/api-middleware_MytvPj0_.mjs');
        const requestContext = createRequestContext(context);
        response.middleware.contextTest = "SUCCESS";
        response.middleware.sampleContext = {
          environment: requestContext.environment,
          clientAddress: requestContext.clientAddress
        };
      } catch (error) {
        response.middleware.contextTest = "FAILED";
        response.middleware.error = error instanceof Error ? error.message : "Unknown error";
      }
    }
    return new Response(
      JSON.stringify(response, null, 2),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache"
        }
      }
    );
  } catch (error) {
    console.error("[Environment Test] Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Environment test failed",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : void 0
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
