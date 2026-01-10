/**
 * Ultra Simple Test - No Middleware
 */

import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
    return new Response(JSON.stringify({
        success: true,
        message: 'Ultra simple test working',
        timestamp: new Date().toISOString()
    }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};