// PUMO METRICS API ENDPOINT
// Provides real-time metrics and analytics data

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // CORS headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                status: 204,
                headers: corsHeaders
            });
        }

        try {
            if (request.method === 'GET') {
                const metricsData = await getMetrics(env, url.searchParams);

                return Response.json(metricsData, {
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json',
                        'Cache-Control': 'max-age=300' // 5 minutes cache
                    }
                });
            }

            return Response.json(
                { error: 'Method not allowed' },
                { status: 405, headers: corsHeaders }
            );

        } catch (error) {
            console.error('Metrics API Error:', error);
            return Response.json(
                {
                    error: 'Internal server error',
                    details: error.message
                },
                { status: 500, headers: corsHeaders }
            );
        }
    }
};

async function getMetrics(env, searchParams) {
    const period = searchParams.get('period') || 'day';
    const category = searchParams.get('category');
    const detailed = searchParams.get('detailed') === 'true';

    try {
        // If KV storage is available, try to get cached metrics
        if (env.CACHE) {
            const cacheKey = `metrics-${period}-${category || 'all'}-${detailed}`;
            const cached = await env.CACHE.get(cacheKey);

            if (cached) {
                return JSON.parse(cached);
            }
        }

        // Generate fresh metrics
        const metrics = await generateMetrics(period, category, detailed);

        // Cache the results if KV is available
        if (env.CACHE) {
            const cacheKey = `metrics-${period}-${category || 'all'}-${detailed}`;
            await env.CACHE.put(cacheKey, JSON.stringify(metrics), {
                expirationTtl: 300 // 5 minutes
            });
        }

        return metrics;

    } catch (error) {
        console.error('Metrics generation error:', error);
        return generateMockMetrics();
    }
}

async function generateMetrics(period, category, detailed) {
    // This would typically query your database/analytics system
    // For now, return realistic mock data

    const baseMetrics = {
        timestamp: new Date().toISOString(),
        period,
        totalProducts: 2560,
        activeQueries: 847,
        successRate: 94.2,
        dailyVolume: 15420,
        weeklyGrowth: 12.5,
        categories: 68,
        averageResponseTime: 245,
        cacheHitRate: 78.2,
        errorRate: 1.8,
        uptime: 99.8
    };

    if (category) {
        // Filter by specific category
        baseMetrics.category = category;
        baseMetrics.categoryMetrics = getCategorySpecificMetrics(category);
    }

    if (detailed) {
        // Add detailed breakdowns
        baseMetrics.hourlyData = generateHourlyData();
        baseMetrics.categoryBreakdown = generateCategoryBreakdown();
        baseMetrics.performanceMetrics = generatePerformanceMetrics();
        baseMetrics.topQueries = generateTopQueries();
        baseMetrics.geographicData = generateGeographicData();
    }

    return baseMetrics;
}

function getCategorySpecificMetrics(category) {
    const categoryData = {
        furniture: {
            productCount: 520,
            queryVolume: 8450,
            conversionRate: 13.2,
            averagePrice: 899,
            topProduct: 'Szafa IKEA MALM',
            growth: 15.2
        },
        lighting: {
            productCount: 380,
            queryVolume: 3200,
            conversionRate: 9.8,
            averagePrice: 349,
            topProduct: 'Lampa wisząca LED',
            growth: 8.7
        },
        storage: {
            productCount: 290,
            queryVolume: 2850,
            conversionRate: 11.5,
            averagePrice: 649,
            topProduct: 'Komoda z szufladami',
            growth: 12.1
        },
        decor: {
            productCount: 410,
            queryVolume: 1920,
            conversionRate: 7.4,
            averagePrice: 299,
            topProduct: 'Obraz skandynawski',
            growth: 6.8
        }
    };

    return categoryData[category] || categoryData.furniture;
}

function generateHourlyData() {
    const hours = [];
    const now = new Date();

    for (let i = 23; i >= 0; i--) {
        const hour = new Date(now);
        hour.setHours(hour.getHours() - i);

        hours.push({
            hour: hour.getHours(),
            timestamp: hour.toISOString(),
            queries: Math.floor(Math.random() * 800) + 400,
            responseTime: Math.floor(Math.random() * 200) + 150,
            errors: Math.floor(Math.random() * 20),
            cacheHits: Math.floor(Math.random() * 30) + 70
        });
    }

    return hours;
}

function generateCategoryBreakdown() {
    return [
        { name: 'Meble', count: 520, percentage: 20.3, queries: 8450, growth: 15.2 },
        { name: 'Oświetlenie', count: 380, percentage: 14.8, queries: 3200, growth: 8.7 },
        { name: 'Przechowywanie', count: 290, percentage: 11.3, queries: 2850, growth: 12.1 },
        { name: 'Dekoracje', count: 410, percentage: 16.0, queries: 1920, growth: 6.8 },
        { name: 'Kuchnia', count: 350, percentage: 13.7, queries: 2100, growth: 9.4 },
        { name: 'Sypialnia', count: 315, percentage: 12.3, queries: 1800, growth: 7.2 },
        { name: 'Inne', count: 295, percentage: 11.6, queries: 1100, growth: 3.9 }
    ];
}

function generatePerformanceMetrics() {
    return {
        database: {
            connections: 45,
            queryTime: 12,
            status: 'healthy'
        },
        cache: {
            hitRate: 78.2,
            size: '2.1GB',
            status: 'healthy'
        },
        api: {
            requestsPerSecond: 145,
            averageResponseTime: 245,
            errorRate: 1.8,
            status: 'healthy'
        },
        workers: {
            active: 12,
            queued: 0,
            status: 'healthy'
        }
    };
}

function generateTopQueries() {
    return [
        { query: 'szafa', count: 1250, conversionRate: 12.4, category: 'furniture' },
        { query: 'stół', count: 980, conversionRate: 15.6, category: 'furniture' },
        { query: 'lampa', count: 845, conversionRate: 9.8, category: 'lighting' },
        { query: 'komoda', count: 723, conversionRate: 11.2, category: 'storage' },
        { query: 'krzesło', count: 689, conversionRate: 13.8, category: 'furniture' },
        { query: 'łóżko', count: 612, conversionRate: 14.2, category: 'furniture' },
        { query: 'regał', count: 567, conversionRate: 8.9, category: 'storage' },
        { query: 'sofa', count: 534, conversionRate: 16.7, category: 'furniture' },
        { query: 'biurko', count: 489, conversionRate: 10.5, category: 'furniture' },
        { query: 'szafka', count: 445, conversionRate: 9.1, category: 'storage' }
    ];
}

function generateGeographicData() {
    return {
        topCities: [
            { city: 'Warszawa', queries: 2450, conversions: 245, percentage: 15.9 },
            { city: 'Kraków', queries: 1890, conversions: 201, percentage: 12.3 },
            { city: 'Gdańsk', queries: 1234, conversions: 156, percentage: 8.0 },
            { city: 'Wrocław', queries: 1156, conversions: 134, percentage: 7.5 },
            { city: 'Poznań', queries: 998, conversions: 112, percentage: 6.5 }
        ],
        topRegions: [
            { region: 'Mazowieckie', queries: 3450, percentage: 22.4 },
            { region: 'Małopolskie', queries: 2340, percentage: 15.2 },
            { region: 'Pomorskie', queries: 1890, percentage: 12.3 },
            { region: 'Dolnośląskie', queries: 1567, percentage: 10.2 }
        ]
    };
}

function generateMockMetrics() {
    return {
        timestamp: new Date().toISOString(),
        totalProducts: 2560,
        activeQueries: 847,
        successRate: 94.2,
        dailyVolume: 15420,
        weeklyGrowth: 12.5,
        categories: 68,
        averageResponseTime: 245,
        cacheHitRate: 78.2,
        errorRate: 1.8,
        uptime: 99.8,
        lastSync: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        status: 'healthy',
        version: '1.0.0'
    };
}