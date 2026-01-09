<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Funkcje po Strukturze (Kompletne)

### index.html – Core Functions

```
- Tabs switching (Overview/Revenue/Queries/AI/Sync/Reports)
- Real-time KPIs fetch('/api/analytics/kpis') → revenue, rag-hit
- Charts: Revenue trend (Chart.js z /api/revenue-trend)
- AI Chat: Input → POST /api/ai-analyst → Response render
- Auto-refresh: setInterval(loadKPIs, 30s)
```

**JS Events**: onclick="askAI()", onkeyup Enter.[^1]

### export.html – Reports

```
- Lista raportów GET /api/analytics/reports (daily/weekly)
- Download: /api/analytics/report/:id → JSON/PDF
- Generate: Button → report-generator.ts → EmailService
- Filter: Date range, type (daily/weekly)
```

**Buttons**: "Generate Weekly", "Send Test".[^2][^3]

### assets/js/*

- **main.js**: Tabs, fetch wrappers, error handling
- **charts.js**:

```js
const ctx = document.getElementById('revenue-chart');
new Chart(ctx, {
  type: 'line',
  data: await (await fetch('/api/revenue-trend')).json()
});
```

- **ai-analyst.js**: Chat history, quick questions ("24h summary")
- **pumo-api.js**: Sync buttons (/api/sync/full, /api/orders/sync)[^1]


### api/* – Backend Endpoints (index.ts Router)

```
GET /api/analytics/kpis           → KPIs 7d/30d [file:5]
POST /api/ai-analyst              → AI analiza D1 data
GET /api/revenue-trend?days=30    → Chart data
GET /api/top-products?limit=10    → Best sellers
POST /api/sync/full               → Full products sync [file:11]
POST /api/email/subscribe         → Daily reports [file:17]
GET /api/sync-status              → Last sync log
POST /api/generate-guides         → SEO guides z queries [file:19]
GET /api/realtime                 → Live stats (orders/h)
```


### config/*

- **d1-schema.sql**: Tables: querieslog, products, synchistory, reports, subscribers
- **api-endpoints.json**:

```json
{
  "kpis": "/api/analytics/kpis?days=7",
  "ai": "/api/ai-analyst",
  "sync": "/api/sync/full"
}
```

- **pumo-api-config.json**: `{ "baseUrl": "https://api.meblepumo.pl", "key": "${PUMO_API_KEY}" }`


### docs/* – Użytkownik

```
README.md: npm install && wrangler deploy && wrangler pages deploy
api-sync-full.md: curl -X POST /api/sync/full → 2130 products synced
funkcje-dashboardu.md: Screenshots + features list
plan-rozwoju.md: Roadmap (GA4, more AI) [file:3]
```


### migrations/*

```
001-create-analytics.sql: querieslog + productclicks [file:4]
002-sync-history.sql: synchistory table
003-reports.sql: reports + emaillog
```

**Run**: `wrangler d1 execute DB --file migrations/001-*.sql`

### tests/*

```
api.test.ts: Vitest /api/kpis → expect(data.revenue).toBeNumber()
sync.test.ts: Mock Pumo API → expect(synced).toBe(2130)
```

**Run**: `npm test`

### Cron (wrangler.toml)

```
[[triggers.crons]]
cron = "0 9 * * *"  # Daily: sync + reports + email
```

**Effect**: Automatyczne daily-sync.ts → generateAndSendDailyReport.[^4][^3]

## Deployment Flow

```
1. wrangler deploy          # API endpoints live
2. wrangler d1 execute ...  # Tables created
3. wrangler pages deploy .  # Frontend live
4. curl /api/sync/full      # Initial data
5. https://pages.dev        # Dashboard ready
```

**Zero mocks** – wszystko z D1/Pumo/GA4![^1]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: index.ts

[^2]: email-service.ts

[^3]: report-generator.ts

[^4]: daily-sync.ts

[^5]: simple_library_viewer.html

[^6]: UNIFIED_OPERATIONS_DASHBOARD.html

[^7]: Plan-Rozwoju-Dashboard-TYLKO-Real-Data.md

[^8]: WHITECAT-Analytics-Complete-Implementation.md

[^9]: types.ts

[^10]: analytics-aggregator.ts

[^11]: order-sync.ts

[^12]: product-sync.ts

[^13]: ga4-analytics.ts

[^14]: search-service.ts

[^15]: pumo-api-client.ts

[^16]: pumo-orders-client.ts

[^17]: subscriber-manager.ts

[^18]: chunk-processor.ts

[^19]: guide-generator.ts

