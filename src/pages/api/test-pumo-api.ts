/**
 * Test Meble Pumo XML Feed Connection
 * Quick test endpoint to verify XML feed access
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
        const baseUrl = env.PUMO_API_BASE_URL || 'https://www.meblepumo.pl';
        const testUrl = `${baseUrl}/xml/products.xml`;

        console.log(`🧪 Testing Pumo XML Feed connection: ${testUrl}`);
        console.log(`🔑 Using API key: ${env.PUMO_API_KEY?.substring(0, 10)}...`);

        const response = await fetch(testUrl, {
            method: 'GET',
            headers: {
                'X-API-KEY': env.PUMO_API_KEY,
                'Content-Type': 'application/xml',
                'Accept': 'application/xml',
                'User-Agent': 'MyBonzo-AI-Blog/1.0 (https://mybonzoaiblog.com)'
            }
        });

        console.log(`📊 XML Feed Response status: ${response.status}`);
        console.log(`📊 XML Feed Response headers:`, Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ XML Feed Error Response: ${errorText}`);

            return new Response(JSON.stringify({
                success: false,
                error: `XML Feed Error: ${response.status} ${response.statusText}`,
                details: errorText,
                test_url: testUrl
            }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const xmlData = await response.text();
        console.log(`✅ XML Feed Response length: ${xmlData.length} characters`);

        // Quick XML validation
        const hasProducts = xmlData.includes('<product>') || xmlData.includes('<item>');

        return new Response(JSON.stringify({
            success: true,
            data: {
                xml_feed_working: true,
                test_url: testUrl,
                response_status: response.status,
                xml_length: xmlData.length,
                has_products: hasProducts,
                xml_preview: xmlData.substring(0, 500) + '...'
            },
            message: `✅ Meble Pumo XML Feed connection successful! XML length: ${xmlData.length} chars`
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