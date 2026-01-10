/**
 * Test with Health Feature
 */

import { withFeatureMiddleware } from '@/middleware/api-middleware';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
    return withFeatureMiddleware(
        'health-check',
        context,
        'public',
        async () => {
            return new Response(JSON.stringify({
                success: true,
                message: 'Health feature middleware test working',
                timestamp: new Date().toISOString()
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    );
};