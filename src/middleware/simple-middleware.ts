/**
 * Simple API Middleware - Cloudflare Worker Compatible
 * No global scope operations, all initialization is lazy
 */

import type { APIContext } from 'astro';

// Types
type Permission = 'public' | 'user' | 'admin' | 'system';
type FeatureStatus = 'enabled' | 'disabled' | 'beta' | 'deprecated';

interface SimpleFeature {
    id: string;
    name: string;
    status: FeatureStatus;
    permissions: Permission[];
}

interface SimpleRequestContext {
    clientAddress: string;
    userAgent?: string;
    timestamp: number;
    apiKey?: string;
}

// Simple feature registry (no complex managers)
const SIMPLE_FEATURES: SimpleFeature[] = [
    {
        id: 'health-check',
        name: 'Health Check',
        status: 'enabled',
        permissions: ['public', 'user', 'admin', 'system']
    },
    {
        id: 'whitecat-products',
        name: 'WHITECAT Products',
        status: 'enabled',
        permissions: ['public', 'user', 'admin']
    },
    {
        id: 'ai-chat',
        name: 'AI Chat',
        status: 'enabled',
        permissions: ['public', 'user', 'admin']
    }
];

/**
 * Create request context (pure function, no side effects)
 */
export function createSimpleRequestContext(context: APIContext): SimpleRequestContext {
    return {
        clientAddress: context.clientAddress || 'unknown',
        userAgent: context.request.headers.get('user-agent') || undefined,
        timestamp: Date.now(),
        apiKey: context.request.headers.get('x-api-key') || undefined
    };
}

/**
 * Check if feature is enabled (pure function)
 */
export function isSimpleFeatureEnabled(featureId: string, permission: Permission = 'public'): boolean {
    const feature = SIMPLE_FEATURES.find(f => f.id === featureId);

    if (!feature) {
        console.warn(`Feature not found: ${featureId}`);
        return false;
    }

    if (feature.status !== 'enabled') {
        return false;
    }

    return feature.permissions.includes(permission);
}

/**
 * Simple middleware wrapper - no global operations
 */
export async function withSimpleMiddleware(
    featureId: string,
    context: APIContext,
    permission: Permission = 'public',
    handler: (ctx: APIContext, requestContext: SimpleRequestContext) => Promise<Response>
): Promise<Response> {
    // Create request context
    const requestContext = createSimpleRequestContext(context);

    // Check feature access
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
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }

    // Log request
    console.log(`[SimpleMiddleware] ${featureId} - ${requestContext.clientAddress} - ${new Date().toISOString()}`);

    try {
        // Execute handler
        return await handler(context, requestContext);
    } catch (error) {
        console.error(`[SimpleMiddleware] ${featureId} error:`, error);

        return new Response(
            JSON.stringify({
                success: false,
                error: 'Internal server error',
                featureId
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}