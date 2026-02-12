globalThis.process ??= {}; globalThis.process.env ??= {};
import { getCurrentEnvironment, FEATURES } from './features_DqlOd7Qd.mjs';
import { getFeatureFlagsManager } from './feature-flags_D4csv9he.mjs';
import { c as createLazyInitializer, g as getRuntimeConfig } from './environment_D7FRwqP1.mjs';

const getFeatureManager = createLazyInitializer(() => {
  const { runtime } = getRuntimeConfig();
  console.log(`[Middleware] Initializing feature manager for ${runtime} environment`);
  const manager = getFeatureFlagsManager(getCurrentEnvironment());
  manager.registerBatch(FEATURES);
  console.log(`[Middleware] Feature manager initialized with ${FEATURES.length} features`);
  return manager;
});
const rateLimitStore = /* @__PURE__ */ new Map();
function createRequestContext(context) {
  return {
    clientAddress: context.clientAddress || "unknown",
    userAgent: context.request.headers.get("user-agent") || void 0,
    timestamp: Date.now(),
    environment: getCurrentEnvironment(),
    apiKey: context.request.headers.get("x-api-key") || void 0
  };
}
function checkRateLimit(identifier, config) {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;
  const record = rateLimitStore.get(key);
  if (!record || now > record.resetTime) {
    const resetTime = now + config.window;
    rateLimitStore.set(key, { count: 1, resetTime });
    return {
      allowed: true,
      remaining: config.requests - 1,
      resetTime
    };
  }
  if (record.count >= config.requests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime
    };
  }
  record.count++;
  return {
    allowed: true,
    remaining: config.requests - record.count,
    resetTime: record.resetTime
  };
}
function getRateLimitIdentifier(context, config) {
  const idType = config.identifier || "ip";
  switch (idType) {
    case "user":
      return context.userId || context.clientAddress;
    case "api-key":
      return context.apiKey || context.clientAddress;
    case "ip":
    default:
      return context.clientAddress;
  }
}
function validateFeatureAccess(featureId, permission = "public", context) {
  const manager = getFeatureManager();
  const feature = manager.getFeature(featureId);
  if (!feature) {
    return {
      allowed: false,
      reason: `Feature not found: ${featureId}`,
      context
    };
  }
  if (!manager.isEnabled(featureId, permission)) {
    return {
      allowed: false,
      reason: `Feature '${feature.name}' is not enabled`,
      context,
      metadata: {
        status: feature.status,
        requiredPermission: permission
      }
    };
  }
  if (feature.rateLimit) {
    const identifier = getRateLimitIdentifier(context, feature.rateLimit);
    const rateLimitResult = checkRateLimit(identifier, feature.rateLimit);
    if (!rateLimitResult.allowed) {
      return {
        allowed: false,
        reason: "Rate limit exceeded",
        context,
        metadata: {
          rateLimit: {
            remaining: rateLimitResult.remaining,
            resetTime: rateLimitResult.resetTime
          }
        }
      };
    }
    return {
      allowed: true,
      context,
      metadata: {
        rateLimit: {
          remaining: rateLimitResult.remaining,
          resetTime: rateLimitResult.resetTime
        }
      }
    };
  }
  return {
    allowed: true,
    context
  };
}
async function withFeatureMiddleware(featureId, context, permission = "public", handler) {
  const requestContext = createRequestContext(context);
  const validation = validateFeatureAccess(featureId, permission, requestContext);
  if (!validation.allowed) {
    const status = validation.reason?.includes("Rate limit") ? 429 : 403;
    return new Response(
      JSON.stringify({
        success: false,
        error: validation.reason,
        metadata: validation.metadata
      }),
      {
        status,
        headers: {
          "Content-Type": "application/json",
          ...validation.metadata?.rateLimit && {
            "X-RateLimit-Remaining": String(validation.metadata.rateLimit.remaining),
            "X-RateLimit-Reset": String(validation.metadata.rateLimit.resetTime)
          }
        }
      }
    );
  }
  console.log(`[API] ${featureId} - ${requestContext.clientAddress} - ${(/* @__PURE__ */ new Date()).toISOString()}`);
  try {
    const response = await handler(context, requestContext);
    if (validation.metadata?.rateLimit) {
      const headers = new Headers(response.headers);
      headers.set("X-RateLimit-Remaining", String(validation.metadata.rateLimit.remaining));
      headers.set("X-RateLimit-Reset", String(validation.metadata.rateLimit.resetTime));
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
      });
    }
    return response;
  } catch (error) {
    console.error(`[API Error] ${featureId}:`, error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
function getFeatureManagerInstance() {
  return getFeatureManager();
}
function cleanupRateLimits() {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}
if (typeof setInterval !== "undefined") {
  setInterval(cleanupRateLimits, 5 * 60 * 1e3);
}

export { checkRateLimit, cleanupRateLimits, createRequestContext, getFeatureManagerInstance, validateFeatureAccess, withFeatureMiddleware };
