/**
 * API Middleware Layer
 * Centralized middleware for feature flags, rate limiting, and authorization
 */

import type { APIContext } from 'astro';
import type {
  FeatureFlag,
  Permission,
  MiddlewareResult,
  RequestContext,
  RateLimitConfig
} from '@/Types/features';
import { getFeatureFlagsManager } from '@/lib/features/feature-flags';
import { FEATURES, getCurrentEnvironment } from '@/config/features';

// Initialize features
const featureManager = getFeatureFlagsManager(getCurrentEnvironment());
featureManager.registerBatch(FEATURES);

// Rate limiter storage (in-memory per worker instance)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Create request context from API context
 */
export function createRequestContext(context: APIContext): RequestContext {
  return {
    clientAddress: context.clientAddress || 'unknown',
    userAgent: context.request.headers.get('user-agent') || undefined,
    timestamp: Date.now(),
    environment: getCurrentEnvironment(),
    apiKey: context.request.headers.get('x-api-key') || undefined
  };
}

/**
 * Check rate limit for a request
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;
  const record = rateLimitStore.get(key);

  // No record or expired - create new
  if (!record || now > record.resetTime) {
    const resetTime = now + config.window;
    rateLimitStore.set(key, { count: 1, resetTime });

    return {
      allowed: true,
      remaining: config.requests - 1,
      resetTime
    };
  }

  // Check if limit exceeded
  if (record.count >= config.requests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime
    };
  }

  // Increment counter
  record.count++;

  return {
    allowed: true,
    remaining: config.requests - record.count,
    resetTime: record.resetTime
  };
}

/**
 * Get rate limit identifier based on config
 */
function getRateLimitIdentifier(
  context: RequestContext,
  config: RateLimitConfig
): string {
  const idType = config.identifier || 'ip';

  switch (idType) {
    case 'user':
      return context.userId || context.clientAddress;
    case 'api-key':
      return context.apiKey || context.clientAddress;
    case 'ip':
    default:
      return context.clientAddress;
  }
}

/**
 * Validate feature access
 */
export function validateFeatureAccess(
  featureId: string,
  permission: Permission = 'public',
  context: RequestContext
): MiddlewareResult {
  // Check if feature exists
  const feature = featureManager.getFeature(featureId);

  if (!feature) {
    return {
      allowed: false,
      reason: `Feature not found: ${featureId}`,
      context
    };
  }

  // Check if feature is enabled
  if (!featureManager.isEnabled(featureId, permission)) {
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

  // Check rate limiting
  if (feature.rateLimit) {
    const identifier = getRateLimitIdentifier(context, feature.rateLimit);
    const rateLimitResult = checkRateLimit(identifier, feature.rateLimit);

    if (!rateLimitResult.allowed) {
      return {
        allowed: false,
        reason: 'Rate limit exceeded',
        context,
        metadata: {
          rateLimit: {
            remaining: rateLimitResult.remaining,
            resetTime: rateLimitResult.resetTime
          }
        }
      };
    }

    // Add rate limit info to metadata
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

/**
 * API Middleware wrapper
 */
export async function withFeatureMiddleware(
  featureId: string,
  context: APIContext,
  permission: Permission = 'public',
  handler: (ctx: APIContext, requestContext: RequestContext) => Promise<Response>
): Promise<Response> {
  const requestContext = createRequestContext(context);

  // Validate access
  const validation = validateFeatureAccess(featureId, permission, requestContext);

  if (!validation.allowed) {
    // Return error response
    const status = validation.reason?.includes('Rate limit') ? 429 : 403;

    return new Response(
      JSON.stringify({
        success: false,
        error: validation.reason,
        metadata: validation.metadata
      }),
      {
        status,
        headers: {
          'Content-Type': 'application/json',
          ...(validation.metadata?.rateLimit && {
            'X-RateLimit-Remaining': String(validation.metadata.rateLimit.remaining),
            'X-RateLimit-Reset': String(validation.metadata.rateLimit.resetTime)
          })
        }
      }
    );
  }

  // Log request
  console.log(`[API] ${featureId} - ${requestContext.clientAddress} - ${new Date().toISOString()}`);

  try {
    // Execute handler
    const response = await handler(context, requestContext);

    // Add rate limit headers if available
    if (validation.metadata?.rateLimit) {
      const headers = new Headers(response.headers);
      headers.set('X-RateLimit-Remaining', String(validation.metadata.rateLimit.remaining));
      headers.set('X-RateLimit-Reset', String(validation.metadata.rateLimit.resetTime));

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
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * Get feature flags manager instance
 */
export function getFeatureManager() {
  return featureManager;
}

/**
 * Clean up expired rate limit records (call periodically)
 */
export function cleanupRateLimits(): void {
  const now = Date.now();

  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimits, 5 * 60 * 1000);
}
