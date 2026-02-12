globalThis.process ??= {}; globalThis.process.env ??= {};
const SIMPLE_FEATURES = [
  {
    id: "health-check",
    name: "Health Check",
    status: "enabled",
    permissions: ["public", "user", "admin", "system"]
  },
  {
    id: "whitecat-products",
    name: "WHITECAT Products",
    status: "enabled",
    permissions: ["public", "user", "admin"]
  },
  {
    id: "ai-chat",
    name: "AI Chat",
    status: "enabled",
    permissions: ["public", "user", "admin"]
  }
];
function createSimpleRequestContext(context) {
  return {
    clientAddress: context.clientAddress || "unknown",
    userAgent: context.request.headers.get("user-agent") || void 0,
    timestamp: Date.now(),
    apiKey: context.request.headers.get("x-api-key") || void 0
  };
}
function isSimpleFeatureEnabled(featureId, permission = "public") {
  const feature = SIMPLE_FEATURES.find((f) => f.id === featureId);
  if (!feature) {
    console.warn(`Feature not found: ${featureId}`);
    return false;
  }
  if (feature.status !== "enabled") {
    return false;
  }
  return feature.permissions.includes(permission);
}
async function withSimpleMiddleware(featureId, context, permission = "public", handler) {
  const requestContext = createSimpleRequestContext(context);
  if (!isSimpleFeatureEnabled(featureId, permission)) {
    return new Response(
      JSON.stringify({
        success: false,
        error: `Feature '${featureId}' is not enabled or permission '${permission}' denied`,
        featureId,
        permission
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
  console.log(`[SimpleMiddleware] ${featureId} - ${requestContext.clientAddress} - ${(/* @__PURE__ */ new Date()).toISOString()}`);
  try {
    return await handler(context, requestContext);
  } catch (error) {
    console.error(`[SimpleMiddleware] ${featureId} error:`, error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error",
        featureId
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

export { withSimpleMiddleware as w };
