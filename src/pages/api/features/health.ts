/**
 * Feature Control System Health Check
 * GET /api/features/health - Comprehensive health status
 */

import type { APIRoute } from 'astro';
import { withFeatureMiddleware } from '@/middleware/api-middleware';
import { getFeatureManager } from '@/middleware/api-middleware';
import { getFunctionRegistry } from '@/lib/registry/function-registry';
import { validateFeatureControlSystem } from '@/lib/features/validator';

export const GET: APIRoute = async (context) => {
  return withFeatureMiddleware(
    'health-check',
    context,
    'public',
    async () => {
      const featureManager = getFeatureManager();
      const registry = getFunctionRegistry();
      const validation = validateFeatureControlSystem();

      const stats = {
        features: featureManager.getStats(),
        functions: registry.getStats(),
        validation: {
          valid: validation.valid,
          errors: validation.stats.errors,
          warnings: validation.stats.warnings
        }
      };

      // Get enabled features list
      const enabledFeatures = featureManager.getFeaturesByStatus('enabled').map(f => ({
        id: f.id,
        name: f.name,
        status: f.status
      }));

      // Get system info
      const systemInfo = {
        timestamp: new Date().toISOString(),
        environment: typeof process !== 'undefined' ? process.env.NODE_ENV : 'production',
        version: '1.0.0'
      };

      return new Response(
        JSON.stringify({
          success: true,
          healthy: validation.valid && validation.stats.errors === 0,
          data: {
            system: systemInfo,
            stats,
            enabledFeatures,
            issues: validation.issues.filter(i => i.type === 'error' || i.type === 'warning')
          }
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'X-System-Health': validation.valid ? 'healthy' : 'degraded'
          }
        }
      );
    }
  );
};
