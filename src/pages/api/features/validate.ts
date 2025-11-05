/**
 * Feature Control System Validation Endpoint
 * GET /api/features/validate - Validates system consistency
 */

import type { APIRoute } from 'astro';
import { withFeatureMiddleware } from '@/middleware/api-middleware';
import {
  validateFeatureControlSystem,
  getValidationReport,
  validateFeatureFunctionPair
} from '@/lib/features/validator';

export const GET: APIRoute = async (context) => {
  return withFeatureMiddleware(
    'health-check',
    context,
    'public',
    async (ctx) => {
      const { url } = ctx.request;
      const format = url.searchParams.get('format') || 'json';
      const featureId = url.searchParams.get('feature');

      // Validate specific feature-function pair
      if (featureId) {
        const result = validateFeatureFunctionPair(featureId);

        return new Response(
          JSON.stringify({
            success: true,
            data: {
              featureId,
              valid: result.valid,
              issues: result.issues
            }
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // Full system validation
      const report = validateFeatureControlSystem();

      // Return markdown format
      if (format === 'markdown' || format === 'md') {
        const mdReport = getValidationReport();

        return new Response(mdReport, {
          status: 200,
          headers: {
            'Content-Type': 'text/markdown',
            'X-Validation-Status': report.valid ? 'valid' : 'invalid'
          }
        });
      }

      // Return JSON format
      return new Response(
        JSON.stringify({
          success: true,
          data: report
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'X-Validation-Status': report.valid ? 'valid' : 'invalid'
          }
        }
      );
    }
  );
};
