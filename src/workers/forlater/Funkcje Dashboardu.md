<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Funkcje Dashboardu

### Overview Tab

- **KPIs Cards**: Revenue 7d/30d (Pumo API + D1), Visits (GA4), RAG Hit Rate (querieslog).[^1][^2]
- **Realtime Panel**: Orders/h, AI SEO clicks, Sync status (daily-sync.ts).[^3][^1]
- **Top Queries**: 24h zapytania z najniższym hit rate (0% coverage).[^4]


### Revenue Tab

- **Trend Chart**: Revenue vs AI traffic (utmperformance, revenue attribution).[^1]
- **Category Breakdown**: Szafki/Łóżka/Biurka – clicks → revenue conversion.[^5]
- **Top Products**: 10 produktów z revenue/click ratio.[^1]


### Queries Tab

- **RAG Analytics**: Hit rate, avg response time, missing coverage (biurko gaming: 0/15).[^4]
- **Search Log**: Filtr po dacie/query, export CSV.[^1]
- **Coverage Gaps**: Kategorie bez produktów w D1/Vectorize.[^6]


### AI Analyst Tab

- **Chat Interface**: Pytaj: "Jakie zapytania generują konwersje?" → Analiza D1 + rekomendacje.[^1]
- **Auto-Insights**: Buttons: "24h Summary", "Find Issues", "New Categories".[^4]
- **Expected Output**:

```
1. OBSERVATION: 42 queries 0% hit rate
2. TOP: materac 160x200 (12 req)
3. REKOMENDACJA: Dodaj do D1
4. IMPACT: +25% hit rate
```


[^6]

### Sync Tab

- **Status**: Last sync (product-sync.ts, order-sync.ts), errors.[^2][^7]
- **Manual Trigger**: /api/sync-trigger (full/incremental).[^1]
- **History**: Tabela zmian (productchanges).[^1]


## API Endpoints (z index.ts)

| Path | Dane | Użycie |
| :-- | :-- | :-- |
| `/api/analytics/kpis?days=7` | Revenue change, conversion rate [^1] |  |
| `/api/ai-analyst` | POST {question} → AI response [^1] |  |
| `/api/revenue-trend?days=30` | Chart data [^1] |  |
| `/api/top-products?limit=10` | Najlepsze produkty [^1] |  |
| `/api/sync-status` | Ostatni sync [^1] |  |

## AI Prompt Template (w ai-analyst)

```
Analizuj D1 data: {recentQueries, topCategories, revenue}
Rekomendacje: coverage gaps, optimize embeddings
```

Real data z querieslog (timestamp > now-24h).[^4][^1]

## Alerts/Reports

- **Daily Email**: /api/email-subscribe (subscriber-manager.ts).[^8]
- **Export**: PDF/CSV via report-generator.ts.[^9]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19]</span>

<div align="center">⁂</div>

[^1]: index.ts

[^2]: order-sync.ts

[^3]: daily-sync.ts

[^4]: WHITECAT-Analytics-Complete-Implementation.md

[^5]: analytics-aggregator.ts

[^6]: Plan-Rozwoju-Dashboard-TYLKO-Real-Data.md

[^7]: product-sync.ts

[^8]: subscriber-manager.ts

[^9]: report-generator.ts

[^10]: simple_library_viewer.html

[^11]: UNIFIED_OPERATIONS_DASHBOARD.html

[^12]: types.ts

[^13]: email-service.ts

[^14]: ga4-analytics.ts

[^15]: search-service.ts

[^16]: pumo-api-client.ts

[^17]: pumo-orders-client.ts

[^18]: chunk-processor.ts

[^19]: guide-generator.ts

