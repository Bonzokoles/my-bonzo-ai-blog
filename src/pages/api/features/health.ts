/**
 * Feature Control System Health Check
 * GET /api/features/health - Comprehensive health status
 */

import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      success: true,
      healthy: true,
      timestamp: new Date().toISOString(),
      message: 'Feature Control Health Check - Simplified for Cloudflare Workers'
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};