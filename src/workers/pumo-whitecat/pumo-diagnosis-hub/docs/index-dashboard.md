<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## index.html (Główny Dashboard)

Skopiuj strukturę z UNIFIED_OPERATIONS_DASHBOARD.html, zmień na Pumo theme. Fetch data z /api/analytics/*.[^1][^2]

```html
<!DOCTYPE html>
<html lang="pl">
<head>
  <title>PUMO WHITECAT Dashboard</title>
  <link rel="stylesheet" href="assets/css/dashboard.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <header class="topbar">
    <div class="brand">
      <h1>JIMBO PUMO WHITECAT</h1>
      <span>Real Analytics Hub</span>
    </div>
    <div class="status-bar">
      <div class="stat"><span class="dot"></span><strong id="revenue">--</strong></div>
      <div class="stat"><span class="dot cold"></span><strong id="visits">--</strong></div>
      <div class="stat"><span class="dot"></span><strong id="rag-hit">--%</strong></div>
    </div>
  </header>
  <main class="container">
    <div class="tabs">
      <button class="tab active" data-tab="overview">Overview</button>
      <button class="tab" data-tab="revenue">Revenue</button>
      <button class="tab" data-tab="queries">Queries</button>
      <button class="tab" data-tab="ai">AI Analyst</button>
      <button class="tab" data-tab="sync">Sync</button>
    </div>
    <div id="content-overview" class="tab-content active">
      <div class="grid">
        <div class="panel">
          <div class="panel-header"><h3>KPIs (7d)</h3></div>
          <div class="panel-body">
            <canvas id="kpi-chart" width="400" height="200"></canvas>
          </div>
        </div>
        <!-- Więcej panels -->
      </div>
    </div>
    <!-- Inne tabs -->
    <div id="content-ai" class="tab-content">
      <div class="panel">
        <input id="ai-query" placeholder="Np. Jakie zapytania mają 0% hit rate?">
        <button onclick="askAI()">Analizuj</button>
        <div id="ai-response"></div>
      </div>
    </div>
  </main>
  <script src="assets/js/main.js"></script>
</body>
</html>
```


## assets/css/dashboard.css

Wyodrębnij z UNIFIED (root vars, .topbar, .panel, neon glow).[^1]

```css
:root {
  --bg: #07090f; --hot: #7cffb2; --cold: #6aa6ff;
  --panel: #0b0f1a; --text: #e7ecff;
  /* Pełny CSS z file:2 */
}
```


## assets/js/main.js

```javascript
// Tabs logic z UNIFIED
document.querySelectorAll('.tab').forEach(tab => {
  tab.onclick = () => switchTab(tab.dataset.tab);
});

// Load data
async function loadKPIs() {
  const res = await fetch('/api/analytics/kpis?days=7');
  const data = await res.json();
  document.getElementById('revenue').textContent = `${data.totalrevenue}zł`;
  // Chart.js render
}

async function askAI() {
  const q = document.getElementById('ai-query').value;
  const res = await fetch('/api/ai-analyst', {
    method: 'POST', body: JSON.stringify({question: q})
  });
  document.getElementById('ai-response').innerHTML = (await res.json()).answer;
}

// Auto-refresh
setInterval(loadKPIs, 30000);
loadKPIs();
```


## assets/data/mock-metrics.json (Fallback)

```json
{
  "revenue": 12500, "visits": 5600, "ragHit": 68,
  "topQueries": [{"query": "szafka kuchenna", "hits": 45}]
}
```


## api/ai-analyst.js (Worker endpoint)

Już w index.ts – używa D1 querieslog, productclicks dla AI prompt.[^3][^2]

## Deployment

```
cd U:\JIMBO_UNIFIELD_WEBSIDES_hub\my-bonzo-ai-blog\src\workers\pumo-whitecat\pumo-diagnosis-hub
wrangler pages project create pumo-dashboard
wrangler pages deploy . --project-name pumo-dashboard
```

Dostęp: https://pumo-dashboard.your-account.pages.dev/[^2]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: UNIFIED_OPERATIONS_DASHBOARD.html

[^2]: index.ts

[^3]: WHITECAT-Analytics-Complete-Implementation.md

[^4]: simple_library_viewer.html

[^5]: Plan-Rozwoju-Dashboard-TYLKO-Real-Data.md

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

