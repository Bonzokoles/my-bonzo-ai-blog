/**
 * Feature Registry API Endpoint
 * Provides access to the function registry and feature flags
 */

import { getFunctionRegistry } from '@/lib/registry/function-registry';
import { withFeatureMiddleware } from '@/middleware/api-middleware';
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  return withFeatureMiddleware(
    'health-check', // Using health-check feature for registry access
    context,
    'public',
    async (ctx, requestContext) => {
      const { url } = ctx.request;
      const action = url.searchParams.get('action') || 'list';

      const registry = getFunctionRegistry();
      const featureManager = getFeatureManagerInstance();

      switch (action) {
        case 'list':
          // List all registered functions
          return new Response(
            JSON.stringify({
              success: true,
              data: {
                functions: registry.getAllFunctions(),
                stats: registry.getStats()
              }
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            }
          );

        case 'enabled':
          // List only enabled functions
          return new Response(
            JSON.stringify({
              success: true,
              data: {
                functions: registry.getEnabledFunctions(),
                count: registry.getEnabledFunctions().length
              }
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            }
          );

        case 'features':
          // List feature flags
          return new Response(
            JSON.stringify({
              success: true,
              data: {
                features: featureManager.getAllFeatures(),
                stats: featureManager.getStats()
              }
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            }
          );

        case 'docs':
          // Generate documentation
          const docs = registry.generateDocs();
          return new Response(docs, {
            status: 200,
            headers: { 'Content-Type': 'text/markdown' }
          });

        case 'stats':
          // Get statistics
          return new Response(
            JSON.stringify({
              success: true,
              data: {
                functions: registry.getStats(),
                features: featureManager.getStats()
              }
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            }
          );

        case 'category':
          // Get functions by category
          const category = url.searchParams.get('name');
          if (!category) {
            return new Response(
              JSON.stringify({
                success: false,
                error: 'Category name is required'
              }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
              }
            );
          }

          const categoryFunctions = registry.getFunctionsByCategory(
            category as any
          );

          return new Response(
            JSON.stringify({
              success: true,
              data: {
                category,
                functions: categoryFunctions,
                count: categoryFunctions.length
              }
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            }
          );

        default:
          return new Response(
            JSON.stringify({
              success: false,
              error: `Unknown action: ${action}`
            }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            }
          );
      }
    }
  );
};