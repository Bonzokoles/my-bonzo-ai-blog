<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Backend gotowy

Pliki TS (index.ts, analytics-aggregator.ts, ga4-analytics.ts) definiują gotowy Cloudflare Worker z endpointami /api/analytics/kpis, /api/ai-analyst, /api/revenue-trend itp. dla real data z D1 (Pumo orders, GA4 traffic, RAG hits).[^1][^2][^3]

## Dashboard HTML

Utwórz `templates/dashboard.html` w `pumo-diagnosis-hub` używając stylu z UNIFIED_OPERATIONS_DASHBOARD.html. Serwuj via `if (path === '/') return new Response(DASHBOARDHTML)`.[^4][^1]

```
<!-- Topbar: JIMBO PUMO WHITECAT | Revenue: ${revenue} | Visitors: ${visits} -->
<!-- Tabs: Overview | Revenue | Queries | AI Insights | Reports | Sync -->
<!-- Panels z fetch('/api/analytics/kpis'), Chart.js dla trends -->
<div id="ai-chat">
  <input id="ai-query" placeholder="Jakie kategorie mają zero RAG coverage?">
  <div id="ai-response"></div>
</div>
<script>
async function askAI(q) {
  const res = await fetch('/api/ai-analyst', {method:'POST', body:JSON.stringify({question:q})});
  document.getElementById('ai-response').innerHTML = (await res.json()).answer;
}
fetch('/api/analytics/realtime').then(r=>r.json()).then(updateMetrics);
</script>
```

Kopiuj CSS neon (--hot \#7cffb2, zero radius).[^5][^4]

## Kroki wdrożenia

```
1. wrangler deploy  # Worker z endpointami [file:5]
2. wrangler d1 execute jimbo-rag-db --file migrate-analytics.sql  # Tabele querieslog, productclicks [file:4]
3. Test: curl https://your-worker/apianalytics/kpis?days=7 [file:5]
4. Deploy Pages: wrangler pages deploy pumo-diagnosis-hub --project-name mybonzoaiblog [file:2]
```

Integruj z Meble Pumo API (pumo-api-client.ts).[^6]

## Kluczowe metryki

| Metryka | Endpoint | Źródło |
| :-- | :-- | :-- |
| Revenue Trend | /api/revenue-trend?days=30 | D1 + Pumo orders [^1][^7] |
| RAG Hit Rate | /api/analytics/kpis | querieslog [^2] |
| Top Products | /api/top-products?limit=10 | productclicks [^1] |
| AI Impact | /api/ai-impact | utmperformance [^1] |
| Real-time | /api/realtime | GA4 + D1 [^3] |

AI Analyst analizuje real data (hit rate, missing coverage), sugeruje fixes.[^8][^5]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^9]</span>

<div align="center">⁂</div>

[^1]: index.ts

[^2]: analytics-aggregator.ts

[^3]: ga4-analytics.ts

[^4]: UNIFIED_OPERATIONS_DASHBOARD.html

[^5]: WHITECAT-Analytics-Complete-Implementation.md

[^6]: pumo-api-client.ts

[^7]: order-sync.ts

[^8]: Plan-Rozwoju-Dashboard-TYLKO-Real-Data.md

[^9]: types.ts

[^10]: daily-sync.ts

[^11]: email-service.ts

[^12]: product-sync.ts

[^13]: report-generator.ts

[^14]: search-service.ts

[^15]: pumo-orders-client.ts

[^16]: subscriber-manager.ts

[^17]: chunk-processor.ts

[^18]: guide-generator.ts

[^19]: simple_library_viewer.html

