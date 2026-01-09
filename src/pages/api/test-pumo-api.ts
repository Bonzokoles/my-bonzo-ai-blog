/**
 * Test Meble Pumo API Connection
 * Quick test endpoint to verify API key and connection
 */

import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
    const runtime = (context.locals as any)?.runtime;
    const env = runtime?.env;

    if (!env?.PUMO_API_KEY) {
        return new Response(JSON.stringify({
            success: false,
            error: 'PUMO_API_KEY not configured'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const baseUrl = env.PUMO_API_BASE_URL || 'https://api.meblepumo.pl/v1';
        const testUrl = `${baseUrl}/products?page=1&per_page=5`;

        console.log(`🧪 Testing Pumo API connection: ${testUrl}`);
        console.log(`🔑 Using API key: ${env.PUMO_API_KEY?.substring(0, 10)}...`);

        const response = await fetch(testUrl, {
            method: 'GET',
            headers: {
                'X-API-KEY': env.PUMO_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'MyBonzo-AI-Blog/1.0 (https://mybonzoaiblog.com)'
            }
        });

        console.log(`📊 API Response status: ${response.status}`);
        console.log(`📊 API Response headers:`, Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ API Error Response: ${errorText}`);

            return new Response(JSON.stringify({
                success: false,
                error: `API Error: ${response.status} ${response.statusText}`,
                details: errorText,
                test_url: testUrl
            }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const data = await response.json();
        console.log(`✅ API Response data:`, data);

        return new Response(JSON.stringify({
            success: true,
            data: {
                api_working: true,
                test_url: testUrl,
                response_status: response.status,
                products_returned: data.products?.length || 0,
                total_available: data.total || 0,
                has_more: data.has_more || false,
                sample_product: data.products?.[0] || null
            },
            message: `✅ Meble Pumo API connection successful! Found ${data.products?.length || 0} products`
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('❌ API Test Error:', error);

        return new Response(JSON.stringify({
            success: false,
            error: error.message,
            details: 'Connection test failed'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};