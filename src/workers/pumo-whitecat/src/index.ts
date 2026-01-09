import { Env, ChunkData } from './types';

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Health check
      if (path === '/health') {
        return jsonResponse({ status: 'ok', timestamp: new Date().toISOString() }, 200, corsHeaders);
      }

      // Chunk processing
      if (path === '/api/chunk/process' && request.method === 'POST') {
        return await handleChunkProcess(request, env, corsHeaders);
      }

      // Search
      if (path === '/api/search' && request.method === 'POST') {
        return await handleSearch(request, env, corsHeaders);
      }

      // Guide generation
      if (path === '/api/generate-guides' && request.method === 'POST') {
        return await handleGenerateGuides(env, corsHeaders);
      }

      if (path.startsWith('/api/guide/')) {
        const guidePath = path.replace('/api/guide', '');
        return await handleGetGuide(guidePath, env, corsHeaders);
      }

      // Analytics endpoints
      if (path === '/api/track' && request.method === 'POST') {
        return await handleTrackEvent(request, env, corsHeaders);
      }

      if (path === '/api/analytics/kpis' && request.method === 'GET') {
        return await handleKPIs(request, env, corsHeaders);
      }

      if (path === '/api/analytics/ai-impact' && request.method === 'GET') {
        return await handleAIImpact(env, corsHeaders);
      }

      if (path === '/api/analytics/revenue-trend' && request.method === 'GET') {
        return await handleRevenueTrend(request, env, corsHeaders);
      }

      if (path === '/api/analytics/traffic-sources' && request.method === 'GET') {
        return await handleTrafficSources(env, corsHeaders);
      }

      if (path === '/api/analytics/category-performance' && request.method === 'GET') {
        return await handleCategoryPerformance(env, corsHeaders);
      }

      if (path === '/api/analytics/top-products' && request.method === 'GET') {
        return await handleTopProducts(request, env, corsHeaders);
      }

      if (path === '/api/analytics/realtime' && request.method === 'GET') {
        return await handleRealtimeStats(env, corsHeaders);
      }

      if (path === '/api/analytics/reports' && request.method === 'GET') {
        return await handleGetReports(env, corsHeaders);
      }

      if (path.startsWith('/api/analytics/report/')) {
        const reportId = path.split('/').pop();
        return await handleGetReport(reportId!, env, corsHeaders);
      }

      // Dashboard
      if (path === '/dashboard' && request.method === 'GET') {
        return await handleDashboard(env);
      }

      // Email endpoints
      if (path === '/api/email/subscribe' && request.method === 'POST') {
        return await handleEmailSubscribe(request, env, corsHeaders);
      }

      if (path === '/api/email/unsubscribe' && request.method === 'POST') {
        return await handleEmailUnsubscribe(request, env, corsHeaders);
      }

      if (path === '/api/email/update-frequency' && request.method === 'POST') {
        return await handleUpdateFrequency(request, env, corsHeaders);
      }

      if (path === '/api/email/subscribers' && request.method === 'GET') {
        return await handleGetSubscribers(request, env, corsHeaders);
      }

      if (path === '/api/email/stats' && request.method === 'GET') {
        return await handleEmailStats(env, corsHeaders);
      }

      if (path === '/api/email/send-test' && request.method === 'POST') {
        return await handleSendTestEmail(request, env, corsHeaders);
      }

      // === NEW SYNC ENDPOINTS ===

      // Product sync
      if (path === '/api/sync/full' && request.method === 'POST') {
        return await handleFullSync(env, corsHeaders);
      }

      if (path === '/api/sync/incremental' && request.method === 'POST') {
        return await handleIncrementalSync(env, corsHeaders);
      }

      if (path === '/api/sync/test' && request.method === 'GET') {
        return await handleTestAPIConnection(env, corsHeaders);
      }

      if (path === '/api/sync/status' && request.method === 'GET') {
        return await handleSyncStatus(env, corsHeaders);
      }

      if (path === '/api/changes' && request.method === 'GET') {
        return await handleGetChanges(request, env, corsHeaders);
      }

      // Order sync & stats
      if (path === '/api/orders/sync' && request.method === 'POST') {
        return await handleOrdersSync(request, env, corsHeaders);
      }

      if (path === '/api/orders/stats' && request.method === 'GET') {
        return await handleOrdersStats(request, env, corsHeaders);
      }

      if (path.startsWith('/api/orders/')) {
        const orderId = path.split('/').pop();
        return await handleGetOrder(orderId!, env, corsHeaders);
      }

      if (path === '/api/revenue/attribution' && request.method === 'GET') {
        return await handleRevenueAttribution(request, env, corsHeaders);
      }

      return jsonResponse({ error: 'Not found' }, 404, corsHeaders);

    } catch (error: any) {
      console.error('Request error:', error);
      return jsonResponse({ error: error.message }, 500, corsHeaders);
    }
  },

  async scheduled(event: any, env: Env, ctx: any) {
    console.log('⏰ Cron triggered at:', new Date().toISOString());
    
    try {
      const { DailySyncWorkflow } = await import('./workflows/daily-sync');
      const workflow = new DailySyncWorkflow(env);
      await workflow.run();
      console.log('✅ Scheduled sync completed');
    } catch (error) {
      console.error('❌ Scheduled sync failed:', error);
    }
  }
};

// Helper function
function jsonResponse(data: any, status = 200, additionalHeaders = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...additionalHeaders
    }
  });
}

// === HANDLER IMPLEMENTATIONS ===

async function handleChunkProcess(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  try {
    const chunkData: ChunkData = await request.json();
    const { ChunkProcessor } = await import('./processors/chunk-processor');
    const processor = new ChunkProcessor(env);
    await processor.processChunk(chunkData);
    return jsonResponse({
      success: true,
      message: `Chunk ${chunkData.metadata.chunk_index}/${chunkData.metadata.total_chunks} processed`,
      timestamp: new Date().toISOString()
    }, 200, corsHeaders);
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
  }
}

async function handleSearch(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  try {
    const searchQuery = await request.json();
    const { SearchService } = await import('./services/search-service');
    const searchService = new SearchService(env);
    const results = await searchService.search(searchQuery);
    return jsonResponse({
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    }, 200, corsHeaders);
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
  }
}

async function handleGenerateGuides(env: Env, corsHeaders: any): Promise<Response> {
  try {
    const { GuideGenerator } = await import('./generators/guide-generator');
    const generator = new GuideGenerator(env);
    const guides = await generator.generateAllGuides();
    return jsonResponse({
      success: true,
      data: { guides_generated: guides.size, paths: Array.from(guides.keys()) }
    }, 200, corsHeaders);
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
  }
}

async function handleGetGuide(guidePath: string, env: Env, corsHeaders: any): Promise<Response> {
  try {
    const cached = await env.CACHE.get(`guide:${guidePath}`);
    if (!cached) {
      return jsonResponse({ success: false, error: 'Guide not found' }, 404, corsHeaders);
    }
    return new Response(cached, {
      headers: { 'Content-Type': 'text/markdown; charset=utf-8', ...corsHeaders }
    });
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
  }
}

async function handleKPIs(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  try {
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get('days') || '30');
    const { AnalyticsAggregator } = await import('./services/analytics-aggregator');
    const aggregator = new AnalyticsAggregator(env);
    const metrics = await aggregator.getDailyMetrics(days);
    
    const currentPeriod = metrics.slice(0, days);
    const previousPeriod = metrics.slice(days, days * 2);
    
    const totalRevenue = currentPeriod.reduce((sum, m) => sum + m.revenue, 0);
    const prevRevenue = previousPeriod.reduce((sum, m) => sum + m.revenue, 0);
    const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue * 100) : 0;
    
    const totalClicks = currentPeriod.reduce((sum, m) => sum + m.product_clicks, 0);
    const prevClicks = previousPeriod.reduce((sum, m) => sum + m.product_clicks, 0);
    const clicksChange = prevClicks > 0 ? ((totalClicks - prevClicks) / prevClicks * 100) : 0;
    
    const avgConversion = currentPeriod.reduce((sum, m) => sum + m.conversion_rate, 0) / currentPeriod.length;
    const prevAvgConversion = previousPeriod.reduce((sum, m) => sum + m.conversion_rate, 0) / previousPeriod.length;
    const conversionChange = avgConversion - prevAvgConversion;
    
    const aiClicks = currentPeriod.reduce((sum, m) => sum + m.ai_seo_clicks, 0);
    const aiRevenue = totalRevenue * (aiClicks / totalClicks);
    const aiRevenueShare = (aiRevenue / totalRevenue * 100) || 0;
    
    return jsonResponse({
      success: true,
      data: {
        total_revenue: totalRevenue,
        revenue_change: revenueChange,
        ai_revenue: aiRevenue,
        ai_revenue_share: aiRevenueShare,
        total_clicks: totalClicks,
        clicks_change: clicksChange,
        conversion_rate: avgConversion,
        conversion_change: conversionChange
      }
    }, 200, corsHeaders);
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
  }
}

async function handleAIImpact(env: Env, corsHeaders: any): Promise<Response> {
  try {
    const { AnalyticsAggregator } = await import('./services/analytics-aggregator');
    const aggregator = new AnalyticsAggregator(env);
    const impact = await aggregator.getAISEOImpact();
    return jsonResponse({ success: true, data: impact }, 200, corsHeaders);
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
  }
}

async function handleRevenueTrend(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  try {
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get('days') || '30');
    const { AnalyticsAggregator } = await import('./services/analytics-aggregator');
    const aggregator = new AnalyticsAggregator(env);
    const metrics = await aggregator.getDailyMetrics(days);
    
    const enrichedMetrics = metrics.map(m => ({
      date: m.date,
      total_revenue: m.revenue,
      ai_revenue: m.revenue * (m.ai_seo_clicks / m.product_clicks || 0)
    }));
    
    return jsonResponse({ success: true, data: enrichedMetrics }, 200, corsHeaders);
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
  }
}

async function handleTrafficSources(env: Env, corsHeaders: any): Promise<Response> {
  try {
    const { AnalyticsAggregator } = await import('./services/analytics-aggregator');
    const aggregator = new AnalyticsAggregator(env);
    const sources = await aggregator.getSourceAttribution();
    
    const aiSEO = sources.find(s => s.source === 'mybonzo')?.clicks || 0;
    const organic = sources.filter(s => s.source.includes('google') || s.source.includes('organic')).reduce((sum, s) => sum + s.clicks, 0);
    const paid = sources.filter(s => s.source.includes('ads') || s.source.includes('paid')).reduce((sum, s) => sum + s.clicks, 0);
    const direct = sources.find(s => s.source === 'direct')?.clicks || 0;
    
    return jsonResponse({
      success: true,
      data: { ai_seo: aiSEO, organic, paid, direct }
    }, 200, corsHeaders);
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
  }
}

async function handleCategoryPerformance(env: Env, corsHeaders: any): Promise<Response> {
  try {
    const { AnalyticsAggregator } = await import('./services/analytics-aggregator');
    const aggregator = new AnalyticsAggregator(env);
    const categories = await aggregator.getCategoryPerformance();
    return jsonResponse({ success: true, data: categories }, 200, corsHeaders);
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
  }
}

async function handleTopProducts(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const { AnalyticsAggregator } = await import('./services/analytics-aggregator');
    const aggregator = new AnalyticsAggregator(env);
    const products = await aggregator.getTopProducts(limit);
    return jsonResponse({ success: true, data: products }, 200, corsHeaders);
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
  }
}

async function handleRealtimeStats(env: Env, corsHeaders: any): Promise<Response> {
  try {
    const { AnalyticsAggregator } = await import('./services/analytics-aggregator');
    const aggregator = new AnalyticsAggregator(env);
    const stats = await aggregator.getRealtimeStats();
    
    const { results } = await env.DB.prepare(`
      SELECT SUM(p.price) as revenue_24h
      FROM analytics_events ae
      JOIN products p ON ae.product_id = p.id
      WHERE ae.event_type = 'purchase'
        AND ae.timestamp >= datetime('now', '-24 hours')
    `).all();
    
    stats.current.revenue_24h = results[0]?.revenue_24h || 0;
    return jsonResponse({ success: true, data: stats }, 200, corsHeaders);
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
  }
}

async function handleGetReports(env: Env, corsHeaders: any): Promise<Response> {
  try {
    const { ReportGenerator } = await import('./services/report-generator');
    const generator = new ReportGenerator(env);
    const [daily, weekly, monthly] = await Promise.all([
      generator.listReports('daily', 7),
      generator.listReports('weekly', 4),
      generator.listReports('monthly', 3)
    ]);
    return jsonResponse({ success: true, data: { daily, weekly, monthly } }, 200, corsHeaders);
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
  }
}

async function handleGetReport(reportId: string, env: Env, corsHeaders: any): Promise<Response> {
  try {
    const { ReportGenerator } = await import('./services/report-generator');
    const generator = new ReportGenerator(env);
    const report = await generator.getReport(reportId);
    if (!report) {
      return jsonResponse({ success: false, error: 'Report not found' }, 404, corsHeaders);
    }
    return jsonResponse({ success: true, data: report }, 200, corsHeaders);
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
  }
}

async function handleEmailSubscribe(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  try {
    const body = await request.json() as any;
    const { email, name, frequency } = body;
    if (!email || !email.includes('@')) {
      return jsonResponse({ success: false, error: 'Invalid email' }, 400, corsHeaders);
    }
    const { SubscriberManager } = await import('./services/subscriber-manager');
    const manager = new SubscriberManager(env);
    const success = await manager.subscribe(email, name, frequency || 'daily');
    return jsonResponse({
      success,
      message: success ? 'Successfully subscribed to reports' : 'Failed to subscribe'
    }, 200, corsHeaders);
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
  }
}

async function handleEmailUnsubscribe(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  try {
    const body = await request.json() as any;
    const { email } = body;
    if (!email) {
      return jsonResponse({ success: false, error: 'Email required' }, 400, corsHeaders);
    }
    const { SubscriberManager } = await import('./services/subscriber-manager');
    const manager = new SubscriberManager(env);
    const success = await manager.unsubscribe(email);
    return jsonResponse({
      success,
      message: success ? 'Successfully unsubscribed' : 'Failed to unsubscribe'
    }, 200, corsHeaders);
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
  }
}

async function handleUpdateFrequency(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  try {
    const body = await request.json() as any;
    const { email, frequency } = body;
    if (!email || !frequency || !['daily', 'weekly', 'monthly'].includes(frequency)) {
      return jsonResponse({ success: false, error: 'Invalid parameters' }, 400, corsHeaders);
    }
    const { SubscriberManager } = await import('./services/subscriber-manager');
    const manager = new SubscriberManager(env);
    const success = await manager.updateFrequency(email, frequency);
    return jsonResponse({
      success,
      message: success ? 'Frequency updated' : 'Failed to update'
    }, 200, corsHeaders);
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
  }
}

async function handleGetSubscribers(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  try {
    const url = new URL(request.url);
    const frequency = url.searchParams.get('frequency') as 'daily' | 'weekly' | 'monthly' | undefined;
    const { SubscriberManager } = await import('./services/subscriber-manager');
    const manager = new SubscriberManager(env);
    const subscribers = await manager.getActiveSubscribers(frequency);
    return jsonResponse({ success: true, data: subscribers }, 200, corsHeaders);
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
  }
}

async function handleEmailStats(env: Env, corsHeaders: any): Promise<Response> {
  try {
    const { SubscriberManager } = await import('./services/subscriber-manager');
    const manager = new SubscriberManager(env);
    const stats = await manager.getStats();
    const { results: emailStats } = await env.DB.prepare(`
      SELECT 
        COUNT(*) as total_sent,
        SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successful,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
      FROM email_log
      WHERE sent_at >= date('now', '-30 days')
    `).all();
    return jsonResponse({
      success: true,
      data: { subscribers: stats, emails: emailStats[0] }
    }, 200, corsHeaders);
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
  }
}

async function handleSendTestEmail(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  try {
    const body = await request.json() as any;
    const { email } = body;
    if (!email) {
      return jsonResponse({ success: false, error: 'Email required' }, 400, corsHeaders);
    }
    const { ReportGenerator } = await import('./services/report-generator');
    const generator = new ReportGenerator(env);
    const report = await generator.generateDailyReport();
    const { EmailService } = await import('./services/email-service');
    const emailService = new EmailService(env);
    const success = await emailService.sendReportEmail({
      report,
      recipient: email,
      recipientName: 'Test User'
    });
    return jsonResponse({
      success,
      message: success ? 'Test email sent' : 'Failed to send test email'
    }, 200, corsHeaders);
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
  }
}

// === NEW HANDLERS ===

async function handleFullSync(env: Env, corsHeaders: any): Promise<Response> {
  try {
    const { ProductSync } = await import('./services/product-sync');
    const sync = new ProductSync(env);
    const result = await sync.fullSync();
    return jsonResponse({ success: true, data: result }, 200, corsHeaders);
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
  }
}

async function handleIncrementalSync(env: Env, corsHeaders: any): Promise<Response> {
  try {
    const { ProductSync } = await import('./services/product-sync');
    const sync = new ProductSync(env);
    const result = await sync.incrementalSync();
    return jsonResponse({ success: true, data: result }, 200, corsHeaders);
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
  }
}

async function handleTestAPIConnection(env: Env, corsHeaders: any): Promise<Response> {
  try {
    const { ProductSync } = await import('./services/product-sync');
    const sync = new ProductSync(env);
    const connected = await sync.testAPIConnection();
    return jsonResponse({ 
      success: connected, 
      message: connected ? 'API connection successful' : 'API connection failed' 
    }, 200, corsHeaders);
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
  }
}

async function handleSyncStatus(env: Env, corsHeaders: any): Promise<Response> {
  try {
    const { results } = await env.DB.prepare(`
      SELECT * FROM sync_history
      ORDER BY started_at DESC
      LIMIT 10
    `).all();
    return jsonResponse({ success: true, data: results }, 200, corsHeaders);
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
  }
}

async function handleGetChanges(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const type = url.searchParams.get('type');
    let query = `
      SELECT * FROM product_changes
      ${type ? 'WHERE change_type = ?' : ''}
      ORDER BY timestamp DESC
      LIMIT ?
    `;
    const bindings = type ? [type, limit] : [limit];
    const { results } = await env.DB.prepare(query).bind(...bindings).all();
    return jsonResponse({ success: true, data: results }, 200, corsHeaders);
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
  }
}

async function handleOrdersSync(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  try {
    const body = await request.json() as any;
    const hours = body.hours || 24;
    const { OrderSync } = await import('./services/order-sync');
    const sync = new OrderSync(env);
    await sync.syncRecentOrders(hours);
    return jsonResponse({ success: true, message: `Orders from last ${hours}h synced` }, 200, corsHeaders);
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
  }
}

async function handleOrdersStats(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  try {
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get('days') || '30');
    const { OrderSync } = await import('./services/order-sync');
    const sync = new OrderSync(env);
    const stats = await sync.getOrderStats(days);
    return jsonResponse({ success: true, data: stats }, 200, corsHeaders);
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
  }
}

async function handleGetOrder(orderId: string, env: Env, corsHeaders: any): Promise<Response> {
  try {
    const { results } = await env.DB.prepare(`
      SELECT o.*, 
        json_group_array(
          json_object(
            'product_id', oi.product_id,
            'product_name', oi.product_name,
            'quantity', oi.quantity,
            'price', oi.price,
            'total', oi.total
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = ?
      GROUP BY o.id
    `).bind(orderId).all();
    
    if (results.length === 0) {
      return jsonResponse({ success: false, error: 'Order not found' }, 404, corsHeaders);
    }
    
    const order = results[0];
    order.items = JSON.parse(order.items as string);
    return jsonResponse({ success: true, data: order }, 200, corsHeaders);
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
  }
}

async function handleRevenueAttribution(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  try {
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get('days') || '30');
    const { results } = await env.DB.prepare(`
      SELECT 
        COALESCE(utm_source, source, 'direct') as source,
        COUNT(*) as orders_count,
        SUM(revenue) as total_revenue,
        AVG(revenue) as avg_order_value
      FROM revenue_attribution
      WHERE timestamp >= datetime('now', '-' || ? || ' days')
      GROUP BY source
      ORDER BY total_revenue DESC
    `).bind(days).all();
    return jsonResponse({ success: true, data: results }, 200, corsHeaders);
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
  }
}

async function handleTrackEvent(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  try {
    const eventData = await request.json() as any;
    
    // Validate required fields
    if (!eventData.name) {
      return jsonResponse({ success: false, error: 'Event name required' }, 400, corsHeaders);
    }

    const { GA4Analytics } = await import('./services/ga4-analytics');
    const analytics = new GA4Analytics(env);
    
    // Extract client ID from request headers or body, fallback to random
    const clientId = request.headers.get('x-client-id') || eventData.client_id || 'anonymous';

    // Track the event (Dual-write: D1 + GA4)
    await analytics.trackEvent({
      name: eventData.name,
      params: eventData.params || {}
    }, clientId);

    return jsonResponse({ success: true, message: 'Event tracked' }, 200, corsHeaders);
  } catch (error: any) {
    console.error('Track error:', error);
    return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
  }
}

// Dashboard Handler
async function handleDashboard(env: Env): Promise<Response> {
  const { DASHBOARD_HTML } = await import('./templates/dashboard');
  return new Response(DASHBOARD_HTML, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  });
}


