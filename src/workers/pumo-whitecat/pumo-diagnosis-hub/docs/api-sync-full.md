<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## /api/sync/full (handleFullSync z index.ts)[1]

**Cel**: Pełna synchronizacja produktów z Pumo API.

```typescript
async function handleFullSync(env: Env, corsHeaders: any): Promise<Response> {
  try {
    const ProductSync = await import('./services/product-sync');
    const sync = new ProductSync(env);
    
    const result = await sync.fullSync();  // Pobiera WSZYSTKIE produkty
    /*
    product-sync.ts fullSync:
    const response = await fetch(PUMO_API + '/products', {
      headers: { Authorization: `Bearer ${env.PUMO_API_KEY}` }
    });
    const products = await response.json();
    
    for (const product of products) {
      await env.DB.prepare(`
        INSERT OR REPLACE INTO products 
        (id, name, category, price, stock, description)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(product.id, product.name, product.category_path, 
              product.price, product.stock, product.description).run();
      
      // Vectorize upsert dla RAG
      await env.VECTORIZE.upsert([{ id: product.id, values: embed(product.description) }]);
    }
    */
    
    return jsonResponse({ 
      success: true, 
      synced: result.count, 
      duration_ms: result.duration 
    }, 200, corsHeaders);
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500, corsHeaders);
  }
}
```

**Rezultat**: products table + Vectorize zaktualizowane.[^2][^1]

## /api/email/subscribe (handleEmailSubscribe)[^3][^1]

**Cel**: Subskrypcja daily/weekly raportów.

```typescript
async function handleEmailSubscribe(request: Request, env: Env) {
  const body = await request.json() as { email: string, frequency: 'daily'|'weekly'|'monthly' };
  
  if (!body.email || !body.email.includes('@')) {
    return jsonResponse({ success: false, error: 'Invalid email' }, 400);
  }
  
  const SubscriberManager = await import('./services/subscriber-manager');
  const manager = new SubscriberManager(env);
  
  const success = await manager.subscribe(body.email, body.name || '', body.frequency || 'daily');
  /*
  subscriber-manager.ts subscribe:
  await env.DB.prepare(`
    INSERT OR REPLACE INTO subscribers (email, name, frequency, active, subscribed_at)
    VALUES (?, ?, ?, 1, ?)
  `).bind(email, name, frequency, new Date().toISOString()).run();
  */
  
  return jsonResponse({ 
    success, 
    message: success ? 'Subscribed!' : 'Failed' 
  });
}
```

**Tabela**: subscribers (email, frequency, active).[^3]

## /api/analytics/category-performance (handleCategoryPerformance)[^4][^1]

**Cel**: Performance per kategoria.

```typescript
async function handleCategoryPerformance(env: Env) {
  const aggregator = new AnalyticsAggregator(env);
  const categories = await aggregator.getCategoryPerformance();
  /*
  analytics-aggregator.ts:
  SELECT p.category, COUNT(clicks) as totalclicks, SUM(revenue),
  AVG(price) FROM products p JOIN analyticsevents ae ON p.id = ae.productid
  WHERE timestamp > datetime('now', '-30 days')
  GROUP BY category HAVING clicks > 0 ORDER BY revenue DESC
  */
  
  return jsonResponse({ 
    data: categories  // [{category: 'Szafki kuchenne', revenue: 12500, clicks: 2100}]
  });
}
```

**Chart**: Bar revenue/clicks per kategoria.[^4]

## /api/generate-guides (handleGenerateGuides)[^5][^1]

**Cel**: Auto-generuje SEO guides z top queries.

```typescript
async function handleGenerateGuides(env: Env) {
  const GuideGenerator = await import('./generators/guide-generator');
  const generator = new GuideGenerator(env);
  
  const guides = await generator.generateAllGuides();
  /*
  guide-generator.ts:
  const topQueries = await env.DB.prepare(
    `SELECT userquery FROM querieslog 
     GROUP BY userquery HAVING COUNT(*) > 5 
     ORDER BY COUNT(*) DESC LIMIT 20`
  ).all();
  
  for (const {userquery} of topQueries) {
    const guide = await env.AI.run('@cf/deepseek', 
      `Napisz przewodnik SEO: "${userquery}" dla meblepumo.pl`);
    await env.CACHE.put(`guide/${slug(userquery)}`, guide);
  }
  */
  
  return jsonResponse({ 
    generated: guides.size, 
    paths: Array.from(guides.keys()) 
  });
}
```

**Użycie**: /api/guide/szafka-kuchenna.md.[^5]

## /api/realtime (handleRealtimeStats)[^1][^4]

**Cel**: Live metryki.

```typescript
async function handleRealtimeStats(env: Env) {
  const aggregator = new AnalyticsAggregator(env);
  const stats = await aggregator.getRealtimeStats();
  /*
  SQL: SELECT COUNT(*) as events24h FROM analyticsevents 
  WHERE timestamp > datetime('now', '-24 hours')
  */
  
  const revenue24h = await env.DB.prepare(`
    SELECT SUM(p.price) FROM analyticsevents ae 
    JOIN products p ON ae.productid = p.id 
    WHERE eventtype='purchase' AND timestamp > datetime('now', '-24 hours')
  `).first();
  
  return jsonResponse({ 
    events24h: stats.current.totalevents,
    revenue24h: revenue24h || 0,
    hourly: stats.hourly  // Array[24h]
  });
}
```

**Auto-refresh**: every 30s w JS.[^4]

## Cron: daily-sync.ts (scheduled)[^6][^1]

```typescript
export default class DailySyncWorkflow {
  async run(env: Env) {
    // Orders + Products + Reports
    await new ProductSync(env).incrementalSync();
    await new OrderSync(env).syncRecentOrders(24);
    await new ReportGenerator(env).generateAndSendDailyReport();
  }
}
```

**wrangler.toml**: `[[triggers.crons]] cron = "0 9 * * *"` (daily 9AM).[^6]

Wszystko gotowe do deploy – real data flow![^1]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: index.ts

[^2]: product-sync.ts

[^3]: subscriber-manager.ts

[^4]: analytics-aggregator.ts

[^5]: guide-generator.ts

[^6]: daily-sync.ts

[^7]: simple_library_viewer.html

[^8]: UNIFIED_OPERATIONS_DASHBOARD.html

[^9]: Plan-Rozwoju-Dashboard-TYLKO-Real-Data.md

[^10]: WHITECAT-Analytics-Complete-Implementation.md

[^11]: types.ts

[^12]: email-service.ts

[^13]: order-sync.ts

[^14]: ga4-analytics.ts

[^15]: report-generator.ts

[^16]: search-service.ts

[^17]: pumo-api-client.ts

[^18]: pumo-orders-client.ts

[^19]: chunk-processor.ts

