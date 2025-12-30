/**
 * Example API Endpoint with Feature Control Middleware
 * Demonstrates how to use the new feature control system
 */

import type { APIRoute } from 'astro';
import { withFeatureMiddleware } from '@/middleware/api-middleware';

export const prerender = false;

/**
 * Example: AI Chat endpoint with middleware
 *
 * Before middleware:
 * - Manual rate limiting
 * - Manual feature flag checking
 * - Scattered authorization logic
 *
 * With middleware:
 * - Automatic rate limiting
 * - Automatic feature flag checking
 * - Centralized authorization
 * - Consistent error handling
 */

export const POST: APIRoute = async (context) => {
  return withFeatureMiddleware(
    'ai-chat', // Feature ID from config/features.ts
    context,
    'public', // Required permission level
    async (ctx, requestContext) => {
      // Your business logic here
      // The middleware has already:
      // - Checked if the feature is enabled
      // - Validated permissions
      // - Applied rate limiting
      // - Created request context

      try {
        const body = await ctx.request.json();
        const { prompt } = body;

        if (!prompt) {
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Prompt is required'
            }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }

        // Your actual implementation
        const response = `Echo: ${prompt}`;

        return new Response(
          JSON.stringify({
            success: true,
            data: { response },
            metadata: {
              featureId: 'ai-chat',
              timestamp: requestContext.timestamp,
              environment: requestContext.environment
            }
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }
        );

      } catch (error) {
        return new Response(
          JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }
  );
};

export const GET: APIRoute = async (context) => {
  return withFeatureMiddleware(
    'ai-chat',
    context,
    'public',
    async (ctx, requestContext) => {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'AI Chat endpoint is available',
          info: {
            featureId: 'ai-chat',
            method: 'GET',
            environment: requestContext.environment,
            clientAddress: requestContext.clientAddress
          }
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  );
};