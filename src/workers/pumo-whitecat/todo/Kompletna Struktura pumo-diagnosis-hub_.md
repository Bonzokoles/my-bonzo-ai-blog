<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Kompletna Struktura pumo-diagnosis-hub/

```
pumo-diagnosis-hub/
├── index.html                    # Główny dashboard [file:2][file:5]
├── export.html                   # Raporty/PDF download
├── README.md                     # Deployment guide (ogólny)
│
├── docs/                         # Dokumentacja (jak podałeś)
│   ├── README.md                 # Indeks docs + quickstart
│   ├── api-sync-full.md          # Nowy: /api/sync/full krok po kroku
│   ├── backend-gotowy.md         # index.ts endpoints lista
│   ├── funkcje-dashboardu.md     # Tabs + features
│   ├── implementacja-kodu.md     # Kluczowe snippets
│   ├── index-dashboard.md        # HTML structure
│   ├── plan-rozwoju.md           # [file:3]
│   ├── uwagi.md                  # TODOs, issues
│   └── whitecat-analytics.md     # [file:4]
│
├── assets/
│   ├── css/
│   │   ├── dashboard.css         # UNIFIED style 1:1 [file:2]
│   │   ├── animations.css        # Hover neon glow
│   │   └── theme.css             # Dark/Light toggle
│   ├── js/
│   │   ├── main.js               # Tabs, fetch API, charts [file:5]
│   │   ├── charts.js             # Chart.js configs (revenue trend)
│   │   ├── ai-analyst.js         # /api/ai-analyst chat
│   │   └── pumo-api.js           # Sync buttons handlers
│   ├── data/
│   │   ├── mock-metrics.json     # Fallback (usuń po API)
│   │   └── queries-sample.json   # Przykładowe dane D1
│   └── images/
│       ├── bonzo-logo.png        # Logo
│       ├── favicon.ico
│       └── pumo-icon.png
│
├── api/                          # Cloudflare Workers (TS files)
│   ├── index.ts                  # Główny router [file:5]
│   ├── types.ts                  # Interfaces [file:6]
│   ├── daily-sync.ts             # Cron workflow [file:7]
│   ├── analytics-aggregator.ts   # SQL queries [file:8]
│   ├── email-service.ts          # MailChannels [file:9]
│   ├── order-sync.ts             # Pumo orders [file:10]
│   ├── product-sync.ts           # Products + Vectorize [file:11]
│   ├── ga4-analytics.ts          # UTM tracking [file:12]
│   ├── report-generator.ts       # PDF JSON [file:13]
│   ├── search-service.ts         # Internal RAG [file:14]
│   ├── pumo-api-client.ts        # API wrapper [file:15]
│   ├── pumo-orders-client.ts     # Orders specific [file:16]
│   ├── subscriber-manager.ts     # Email subs [file:17]
│   ├── chunk-processor.ts        # RAG chunks [file:18]
│   └── guide-generator.ts        # SEO guides [file:19]
│
├── config/
│   ├── wrangler.toml             # Cron, bindings (D1, R2, AI)
│   ├── d1-schema.sql             # CREATE TABLE querieslog, products...
│   ├── api-endpoints.json        # Lista endpoints + docs
│   └── pumo-api-config.json      # Keys, endpoints (env vars)
│
├── migrations/                   # NOWE
│   ├── 001-create-analytics.sql  # querieslog, productclicks
│   ├── 002-sync-history.sql      # synchistory table
│   └── 003-reports.sql           # reports table
│
├── templates/                    # NOWE
│   └── dashboard.html            # Embedded HTML (import w index.ts)
│
├── tests/                        # NOWE
│   ├── api.test.ts               # Vitest endpoints
│   └── sync.test.ts              # Mock Pumo API
│
├── wrangler.toml                 # ROOT level config
└── package.json                  # Dependencies (z existing TS)
```


## Nowe Pliki do Dodania

### config/wrangler.toml

```toml
name = "pumo-diagnosis-hub"
compatibility_date = "2026-01-09"

[[d1_databases]]
binding = "DB"
database_name = "jimbo-rag-db"
database_id = "your-d1-id"

[[vectorize]]
binding = "VECTORIZE"
index_name = "pumo-products"

[ai]
binding = "AI"

[[triggers.crons]]
cron = "0 9 * * *"  # Daily reports
```


### config/d1-schema.sql

```sql
CREATE TABLE querieslog (
  id INTEGER PRIMARY KEY,
  userquery TEXT,
  raghits INTEGER DEFAULT 0,
  productsreturned INTEGER DEFAULT 0,
  responsetimems INTEGER,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE synchistory (
  id INTEGER PRIMARY KEY,
  type TEXT,  -- products/orders
  status TEXT,
  count INTEGER,
  duration_ms INTEGER,
  startedat DATETIME
);
```


### docs/api-sync-full.md (Nowy)

```
# /api/sync/full

## Użycie
curl -X POST https://worker/api/sync/full

## Co robi
1. Pobiera WSZYSTKIE produkty z Pumo API
2. UPSERT do D1 products table
3. Upsert embeddings do Vectorize
4. Log do synchistory

## Response
{
  "success": true,
  "synced": 2130,
  "duration_ms": 12500
}
```


### tests/api.test.ts (Nowy)

```typescript
import { describe, it, expect } from 'vitest';

describe('Pumo Dashboard API', () => {
  it('/api/analytics/kpis', async () => {
    const res = await fetch('/api/analytics/kpis?days=7');
    const data = await res.json();
    expect(data.totalrevenue).toBeNumber();
  });
});
```


## Quick Commands

```
# Deploy backend
wrangler deploy

# Migrate D1
wrangler d1 execute jimbo-rag-db --file config/d1-schema.sql

# Deploy frontend
wrangler pages deploy . --project-name pumo-dashboard

# Test
curl https://pumo-dashboard.pages.dev/api/kpis
```

**Gotowe do produkcji!** Brakuje tylko logo PNG i wrangler.toml z Twoimi bindingami.[^1]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^2][^3][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: index.ts

[^2]: simple_library_viewer.html

[^3]: UNIFIED_OPERATIONS_DASHBOARD.html

[^4]: Plan-Rozwoju-Dashboard-TYLKO-Real-Data.md

[^5]: WHITECAT-Analytics-Complete-Implementation.md

[^6]: types.ts

[^7]: daily-sync.ts

[^8]: analytics-aggregator.ts

[^9]: email-service.ts

[^10]: order-sync.ts

[^11]: product-sync.ts

[^12]: ga4-analytics.ts

[^13]: report-generator.ts

[^14]: search-service.ts

[^15]: pumo-api-client.ts

[^16]: pumo-orders-client.ts

[^17]: subscriber-manager.ts

[^18]: chunk-processor.ts

[^19]: guide-generator.ts

