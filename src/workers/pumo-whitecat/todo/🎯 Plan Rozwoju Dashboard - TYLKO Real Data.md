<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## 🎯 Plan Rozwoju Dashboard - TYLKO Real Data

**ZERO mock data, zero fake numbers** - wszystko z Twoich źródeł (Cloudflare, D1, GA, API Pumo).

## 1. Źródła Danych (Real-time)

```
✅ Cloudflare Analytics → traffic, bots, cache hit [file:142][file:143]
✅ D1 Database → products, queries_log, rag_hits [file:144]
✅ Google Analytics → UTM tracking, conversions  
✅ Meble Pumo API → revenue, stock levels
✅ Vectorize metadata → query coverage
```


## 2. Core Metrics (Implementacja 1-2 dni)

### Sekcja 1: **System Health**

```
RAG Hit Rate: X% (queries z wynikami / total queries)
API Success: 80% [file:144]
Error Rate: 20% [file:144]
Avg Response Time: 1.2s
Uptime: 99.8%
```


### Sekcja 2: **Traffic Overview**

```
Total Visitors: 5.6K [file:143]
Requests: 54K [file:143]
AI Bots: X% (ChatGPT, Perplexity...)
Top Countries: PL 92%, DE 3%, UK 2%
```


### Sekcja 3: **Query Analytics**

```
Top Queries (24h):
1. "szafka kuchenna" → 45 requests → Y% hit rate
2. "łóżko 160x200" → 32 requests → Z% hit rate

Missing Coverage:
"biurko gaming" → 0/15 results
"materac sprężynowy" → 0/8 results
```


### Sekcja 4: **Product Performance**

```
Top Categories (Traffic):
1. Szafki kuchenne → 2.1K views
2. Łóżka → 1.8K views  
3. Biurka → 1.2K views

Zero Coverage:
X kategorii bez produktów w D1
```


## 3. **AI ANALYST CHATBOT** - Najważniejsze! 🤖

**Cel:** Model analizuje dane sklepu i generuje raporty/insights.

### Funkcjonalności:

```
1. "Jakie produkty mają najniższy CTR?"
2. "Które kategorie mają zero coverage?"
3. "Pokaż revenue z AI traffic za tydzień"
4. "Jakie zapytania generują konwersje?"
5. "Sugeruj nowe przewodniki na podstawie popularnych queries"
```


### Real-time Data Sources dla AI:

```
D1 Tables:
- queries_log (user_query, timestamp, rag_hits, products_returned)
- product_clicks (product_id, clicks, conversions)  
- utm_performance (source, medium, revenue)
- category_coverage (category, products_count, traffic)
```


## 4. **Quick Implementation - MVP (Dziś/Jutro)**

### Krok 1: D1 Schema dla Analytics

```sql
-- queries_log
CREATE TABLE queries_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_query TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  rag_hits INTEGER DEFAULT 0,
  products_returned INTEGER DEFAULT 0,
  response_time_ms INTEGER,
  user_agent TEXT
);

-- product_performance  
CREATE TABLE product_clicks (
  product_id TEXT,
  category TEXT,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- utm_tracking
CREATE TABLE utm_performance (
  utm_source TEXT,
  utm_medium TEXT,
  clicks INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```


### Krok 2: Logowanie w RAG Chatbot

```javascript
// W każdym /api/rag-chat endpoint
const logQuery = async (env, query, results) => {
  await env.DB.prepare(`
    INSERT INTO queries_log 
    (user_query, rag_hits, products_returned, response_time_ms, user_agent)
    VALUES (?, ?, ?, ?, ?)
  `).bind(
    query,
    results.length > 0 ? 1 : 0,
    results.length,
    Date.now() - startTime,
    request.headers.get('user-agent')
  ).run();
};
```


### Krok 3: AI Analyst Endpoint

```javascript
// /api/ai-analyst
export default {
  async fetch(request, env) {
    const { question } = await request.json();
    
    // Query D1 za real data
    const recentQueries = await env.DB.prepare(`
      SELECT user_query, rag_hits, products_returned 
      FROM queries_log 
      WHERE timestamp > datetime('now', '-24 hours')
      ORDER BY timestamp DESC
    `).all();
    
    const topCategories = await env.DB.prepare(`
      SELECT category, SUM(clicks) as total_clicks
      FROM product_clicks 
      GROUP BY category 
      ORDER BY total_clicks DESC 
      LIMIT 10
    `).all();
    
    // RAG context dla AI
    const context = `
    Recent Queries (24h): ${JSON.stringify(recentQueries.results)}
    Top Categories: ${JSON.stringify(topCategories.results)}
    Total Products: 2130
    `;
    
    const prompt = `
    Jesteś AI Analystem dla systemu RAG Meble Pumo.
    Analizuj PODANE DANE i odpowiadaj na pytanie: "${question}"
    
    METRYKI DO ŚLĘDZENIA:
    - RAG Hit Rate (>80% = good)
    - Error Rate (<10% = good)  
    - Top performing categories
    - Missing coverage opportunities
    
    Daj konkretne rekomendacje.
    `;
    
    return await callLLM(prompt + context);
  }
}
```


### Krok 4: Frontend Chat Interface

```
Dashboard → Sidebar → "🤖 AI Analyst"

Input: "Jakie zapytania mają najniższy hit rate?"
Output: "Top 5 queries z 0% RAG hit rate:
1. materac 160x200 (12 requests)
2. biurko gaming (8 requests)
Rekomendacja: Dodaj te kategorie do bazy."
```


## 5. **Deployment Plan (48h)**

```
Dziś wieczór (4h):
✅ D1 schema + migrations
✅ Logging w istniejących endpoints
✅ Basic AI analyst endpoint

Jutro (4h):  
✅ Dashboard sections z real data
✅ Chat interface
✅ Filters i exports
```


## 6. **Success Metrics dla AI Analyst**

```
Week 1 Goal:
✅ 80% queries logged
✅ AI analyst odpowiada sensownie
✅ Basic dashboard z real metrics

Week 2 Goal:
✅ UTM revenue tracking  
✅ Category performance
✅ Automated alerts
```

**Startujemy od D1 schema?** Mogę napisać kompletny migration script + logging wrappers.

**Co robimy jako pierwszy krok?** 🛠️
<span style="display:none">[^1][^2][^3]</span>

<div align="center">⁂</div>

[^1]: image.jpg

[^2]: image.jpg

[^3]: image.jpg

