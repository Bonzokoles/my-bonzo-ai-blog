<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Kod: /api/analytics/kpis (handleKPIs z index.ts)[1]

```typescript
async function handleKPIs(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  const url = new URL(request.url);
  const days = parseInt(url.searchParams.get('days') || '30');
  const aggregator = new AnalyticsAggregator(env);
  const metrics = await aggregator.getDailyMetrics(days);
  
  const currentPeriod = metrics.slice(0, days);
  const previousPeriod = metrics.slice(days, days * 2);
  
  const totalRevenue = currentPeriod.reduce((sum, m) => sum + m.revenue, 0);
  const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue * 100) : 0;
  
  return jsonResponse({
    totalrevenue: totalRevenue,
    revenuechange: revenueChange,
    conversionrate: avgConversion,
    airevenueshare: aiRevenueShare
  }, 200, corsHeaders);
}
```

Pobiera z D1, porównuje period current/prev.[^2]

## Kod: /api/ai-analyst (index.ts + prompt z file:4)

```typescript
// W index.ts: 
const prompt = `Jesteś AI Analyst dla Meble Pumo.
DANE: ${JSON.stringify(context)}  // {ragstats, recentQueries}
PYTANIE: ${question}
FORMAT: 1. Observation 2. Recommendation 3. Impact`;

const response = await env.AI.run('@cf/deepseek/...', prompt);
```

Real data z querieslog (hitrate, top failing queries).[^3][^1]

## Kod: /api/revenue-trend (handleRevenueTrend)[^1]

```typescript
async function handleRevenueTrend(request: Request, env: Env) {
  const days = parseInt(url.searchParams.get('days') || '30');
  const aggregator = new AnalyticsAggregator(env);
  const metrics = await aggregator.getDailyMetrics(days);
  
  const enrichedMetrics = metrics.map(m => ({
    date: m.date,
    totalrevenue: m.revenue,
    airevenue: m.revenue * (m.aiseoclicks / m.productclicks || 0)
  }));
  
  return jsonResponse({ data: enrichedMetrics });
}
```

SQL z analytics-aggregator.ts (daily revenue + AI share).[^2]

## Kod: /api/top-products (handleTopProducts)[^1]

```typescript
const results = await env.DB.prepare(`
  SELECT p.name, p.category, clicks, revenue,
  ROUND(CAST(clicks AS FLOAT) / views * 100, 2) as ctr
  FROM products p JOIN analyticsevents ae ON p.id = ae.productid
  WHERE ae.timestamp > datetime('now', '-30 days')
  GROUP BY p.id ORDER BY clicks DESC LIMIT ?
`).bind(limit).all();
```

Top 20 produktów po clicks/revenue.[^2]

## Kod: Report Generator (generateDailyReport z report-generator.ts)[^4]

```typescript
async generateDailyReport(): Promise<Report> {
  const aggregator = new AnalyticsAggregator(this.env);
  const [dailyMetrics, topProducts] = await Promise.all([
    aggregator.getDailyMetrics(1),
    aggregator.getTopProducts(20)
  ]);
  
  const report: Report = {
    id: `daily-${today}`,
    type: 'daily',
    data: { kpis: dailyMetrics[^0], topproducts: topProducts },
    summary: this.generateSummary(reportData)  // totalrevenue, topcategory
  };
  
  await this.saveReport(report);  // D1 + CACHE
  return report;
}
```

Generuje PDF-ready JSON + summary.[^4]

## Kod: Email Service (sendReportEmail z email-service.ts)[^5]

```typescript
async sendReportEmail(data: ReportEmailData): Promise<boolean> {
  const template = this.buildReportEmailTemplate(data.report);
  const payload = {
    personalizations: [{ to: [{ email: data.recipient }] }],
    from: { email: 'analytics@mybonzoaiblog.com' },
    subject: template.subject,
    content: [{ type: 'text/html', value: template.html }]
  };
  
  const res = await fetch('https://api.mailchannels.net/tx/v1/send', {
    method: 'POST', body: JSON.stringify(payload)
  });
  await this.logEmailSent(data.recipient, data.report.id, res.ok ? 'success' : 'failed');
  return res.ok;
}
```

HTML template z neon CSS (00ff41 accents).[^5]

## Kod: Sync Status (/api/sync-status)[^1]

```typescript
const results = await env.DB.prepare(`
  SELECT * FROM synchistory 
  ORDER BY startedat DESC LIMIT 10
`).all();
```

Tabela: id, type (products/orders), status, duration_ms.[^1]

Te funkcje używają real D1 data – deploy via `wrangler deploy`![^1]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: index.ts

[^2]: analytics-aggregator.ts

[^3]: WHITECAT-Analytics-Complete-Implementation.md

[^4]: report-generator.ts

[^5]: email-service.ts

[^6]: simple_library_viewer.html

[^7]: UNIFIED_OPERATIONS_DASHBOARD.html

[^8]: Plan-Rozwoju-Dashboard-TYLKO-Real-Data.md

[^9]: types.ts

[^10]: daily-sync.ts

[^11]: order-sync.ts

[^12]: product-sync.ts

[^13]: ga4-analytics.ts

[^14]: search-service.ts

[^15]: pumo-api-client.ts

[^16]: pumo-orders-client.ts

[^17]: subscriber-manager.ts

[^18]: chunk-processor.ts

[^19]: guide-generator.ts

