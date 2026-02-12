globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const GET = async (context) => {
  try {
    console.log("[DEBUG] Testing middleware imports");
    let response = {
      success: true,
      imports: {},
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    try {
      const { createRequestContext } = await import('../../chunks/api-middleware_MytvPj0_.mjs');
      response.imports.middleware = "OK";
      const requestContext = createRequestContext(context);
      response.requestContext = requestContext;
    } catch (error) {
      response.imports.middleware = `ERROR: ${error instanceof Error ? error.message : error}`;
    }
    try {
      const { FEATURES } = await import('../../chunks/features_DqlOd7Qd.mjs');
      response.imports.features = "OK";
      response.featuresCount = FEATURES.length;
    } catch (error) {
      response.imports.features = `ERROR: ${error instanceof Error ? error.message : error}`;
    }
    try {
      const { getFeatureFlagsManager } = await import('../../chunks/feature-flags_D4csv9he.mjs');
      response.imports.featureFlags = "OK";
    } catch (error) {
      response.imports.featureFlags = `ERROR: ${error instanceof Error ? error.message : error}`;
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
    console.error("[DEBUG] Error in import test:", error);
    return new Response(
      JSON.stringify({
        error: "Import test failed",
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
