globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const GET = async (context) => {
  try {
    console.log("[DEBUG] Testing completely isolated middleware");
    const response = {
      success: true,
      steps: [],
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    try {
      const basicContext = {
        clientAddress: context.clientAddress || "unknown",
        userAgent: context.request.headers.get("user-agent") || void 0,
        timestamp: Date.now(),
        apiKey: context.request.headers.get("x-api-key") || void 0
      };
      response.steps.push({
        step: "basic_context",
        status: "OK",
        data: basicContext
      });
    } catch (error) {
      response.steps.push({
        step: "basic_context",
        status: "ERROR",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
    try {
      const healthCheckFeature = {
        id: "health-check",
        name: "Health Check",
        status: "enabled",
        permissions: ["public", "user", "admin"]
      };
      const hasPublicAccess = healthCheckFeature.permissions.includes("public");
      response.steps.push({
        step: "manual_feature_check",
        status: "OK",
        data: {
          feature: healthCheckFeature.name,
          hasAccess: hasPublicAccess
        }
      });
    } catch (error) {
      response.steps.push({
        step: "manual_feature_check",
        status: "ERROR",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
    return new Response(
      JSON.stringify(response, null, 2),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  } catch (error) {
    console.error("[DEBUG] Error in isolated middleware test:", error);
    return new Response(
      JSON.stringify({
        error: "Isolated middleware test failed",
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
