<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# 🚀 WHITECAT Analytics - Complete Implementation

## 1. D1 Schema + Migrations (15 min)

### Migration Script (`migrate-analytics.sql`):

```sql
-- 001_create_analytics_tables.sql
CREATE TABLE IF NOT EXISTS queries_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_query TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  rag_hits INTEGER DEFAULT 0,
  products_returned INTEGER DEFAULT 0,
  response_time_ms INTEGER DEFAULT 0,
  user_agent TEXT,
  session_id TEXT,
  ip_address TEXT
);

CREATE TABLE IF NOT EXISTS product_clicks (
  product_id TEXT PRIMARY KEY,
  name TEXT,
  category_path TEXT,
  clicks INTEGER DEFAULT 0,
  unique_clicks INTEGER DEFAULT 0,
  first_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_clicked DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS utm_performance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  utm_source TEXT DEFAULT 'mybonzo',
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  clicks INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_queries_timestamp ON queries_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_queries_query ON queries_log(user_query);
CREATE INDEX IF NOT EXISTS idx_utm_timestamp ON utm_performance(timestamp);
```


### Deploy Migration:

```powershell
# Run migration
wrangler d1 execute jimbo-rag-db --file=./migrate-analytics.sql --local=false

# Verify tables created
wrangler d1 execute jimbo-rag-db --command="SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%log%'"
```


## 2. Logging Wrappers (30 min)

### Update Existing Endpoints (`/api/rag-search.js`, `/api/simple-whitecat.js`):

```javascript
// utils/analytics.js
export async function logQuery(env, query, results, responseTime, userAgent = '') {
  try {
    await env.DB.prepare(`
      INSERT INTO queries_log 
      (user_query, rag_hits, products_returned, response_time_ms, user_agent)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      query,
      results.length > 0 ? 1 : 0,
      results.length,
      responseTime,
      userAgent
    ).run();
  } catch (e) {
    console.error('Analytics log failed:', e);
  }
}

export async function logProductClick(env, productId, category, name) {
  try {
    await env.DB.prepare(`
      INSERT OR REPLACE INTO product_clicks 
      (product_id, name, category_path, clicks, last_clicked)
      VALUES (?, ?, ?, 
        COALESCE((SELECT clicks FROM product_clicks WHERE product_id = ?), 0) + 1, 
        CURRENT_TIMESTAMP
      )
    `).bind(productId, name, category, productId).run();
  } catch (e) {
    console.error('Product click log failed:', e);
  }
}
```


### Update RAG Endpoints:

```javascript
// /api/simple-whitecat.js (example)
export default {
  async fetch(request, env) {
    const startTime = Date.now();
    const userAgent = request.headers.get('user-agent') || '';
    
    try {
      const { query } = await request.json();
      
      // Existing RAG logic...
      const results = await searchProducts(query, env.DB, env.VECTORIZE);
      
      // LOGGING
      await logQuery(env, query, results, Date.now() - startTime, userAgent);
      
      return Response.json({
        results,
        rag_hits: results.length > 0
      });
      
    } catch (error) {
      await logQuery(env, query || 'unknown', [], Date.now() - startTime, userAgent);
      throw error;
    }
  }
};
```


## 3. AI Analyst Endpoint (45 min)

### `/api/ai-analyst.js`:

```javascript
export default {
  async fetch(request, env) {
    const { question, hours = 24 } = await request.json();
    const cutoff = `datetime('now', '-${hours} hours')`;
    
    // Real data queries
    const recentQueries = await env.DB.prepare(`
      SELECT 
        user_query,
        rag_hits,
        products_returned,
        response_time_ms,
        COUNT(*) as frequency
      FROM queries_log 
      WHERE timestamp > ${cutoff}
      GROUP BY user_query
      HAVING frequency > 1
      ORDER BY frequency DESC
      LIMIT 20
    `).all();
    
    const ragPerformance = await env.DB.prepare(`
      SELECT 
        AVG(rag_hits * 100.0) as hit_rate_pct,
        AVG(response_time_ms) as avg_response_time,
        COUNT(*) as total_queries,
        SUM(rag_hits) as successful_queries
      FROM queries_log 
      WHERE timestamp > ${cutoff}
    `).first();
    
    const topProducts = await env.DB.prepare(`
      SELECT 
        name,
        category_path,
        clicks
      FROM product_clicks 
      ORDER BY clicks DESC 
      LIMIT 10
    `).all();
    
    const context = {
      rag_stats: ragPerformance,
      recent_queries: recentQueries.results,
      top_products: topProducts.results,
      total_products: 2130,
      system_age_days: 8
    };
    
    const prompt = `
    Jesteś AI Analyst dla systemu RAG Meble Pumo.
    
    DANE SYSTEMU:
    ${JSON.stringify(context, null, 2)}
    
    ANALIZUJ i odpowiedz na pytanie: "${question}"
    
    KLUCZOWE METRYKI:
    - RAG Hit Rate: ${context.rag_stats?.hit_rate_pct?.toFixed(1)}%
    - Avg Response Time: ${context.rag_stats?.avg_response_time?.toFixed(0)}ms  
    - Top failing queries (0% hit rate)
    - Best performing categories (clicks)
    
    Daj konkretne, actionable rekomendacje.
    Format: 
    1. [Observation]
    2. [Recommendation]
    3. [Expected Impact]
    `;
    
    const response = await env.AI.run('@cf/deepseek/deepseek-r1/distil', {
      prompt,
      max_tokens: 1000
    });
    
    return Response.json({
      answer: response.response,
      data_used: context,
      question
    });
  }
};
```


## 4. Frontend Dashboard Components (2h)

### React/Vue Components:

```jsx
// Dashboard.jsx
function AnalyticsDashboard() {
  const [aiAnswer, setAiAnswer] = useState('');
  
  const askAI = async (question) => {
    const res = await fetch('/api/ai-analyst', {
      method: 'POST',
      body: JSON.stringify({ question })
    });
    const data = await res.json();
    setAiAnswer(data.answer);
  };
  
  return (
    <div className="dashboard">
      {/* Existing charts */}
      
      {/* NEW: AI Analyst Chat */}
      <section className="ai-analyst">
        <h3>🤖 AI Analyst</h3>
        <input 
          placeholder="Np. Jakie zapytania mają najniższy hit rate?"
          onKeyPress={(e) => e.key === 'Enter' && askAI(e.target.value)}
        />
        <div className="ai-response">
          {aiAnswer}
        </div>
      </section>
      
      {/* Quick Insights Buttons */}
      <div className="quick-questions">
        <button onClick={() => askAI('Podsumuj performance ostatnich 24h')}>
          📊 24h Summary
        </button>
        <button onClick={() => askAI('Znajdź słabe punkty systemu')}>
          🔍 Find Issues
        </button>
        <button onClick={() => askAI('Rekomendacje nowych kategorii')}>
          💡 New Categories
        </button>
      </div>
    </div>
  );
}
```


## 5. Quick Deploy Checklist (1h)

```powershell
# 1. Deploy migrations
wrangler d1 execute jimbo-rag-db --file=migrate-analytics.sql

# 2. Deploy updated endpoints  
wrangler deploy
wrangler pages deploy --project-name=mybonzoaiblog

# 3. Test logging
curl -X POST https://your-site/api/simple-whitecat \
  -d '{"query":"test"}'

# 4. Test AI Analyst
curl -X POST https://your-site/api/ai-analyst \
  -d '{"question":"Podsumuj ostatnie 24h"}'

# 5. Verify data in D1
wrangler d1 execute jimbo-rag-db --command="SELECT COUNT(*) FROM queries_log"
```


## 6. Expected Output Examples (Real Data)

```
User: "Jakie zapytania mają najniższy hit rate?"
AI: "1. OBSERVATION: 42% queries mają 0% RAG hit rate
     2. TOP PROBLEMY: 'łóżko 140x200' (15 req, 0 hits), 'biurko gaming' (8 req, 0 hits)
     3. REKOMENDACJA: Dodaj te kategorie do D1 lub popraw embeddings
     4. EXPECTED IMPACT: +25% overall hit rate"

User: "Podsumuj performance"
AI: "✅ 24h: 245 queries, 68% hit rate, avg 1.2s response
   ✅ Top category: Szafki kuchenne (42 clicks)
   ⚠️ 32% queries bez wyników - optimize coverage"
```


## 🎯 Startujemy?

**Pierwszy plik do zrobienia: `migrate-analytics.sql`** - skopiuj i uruchom.

**Co deployujemy jako pierwsze?** Migration → logging → AI analyst? 🛠️
<span style="display:none">[^1][^2][^3]</span>

<div align="center">⁂</div>

[^1]: image.jpg

[^2]: image.jpg

[^3]: image.jpg

