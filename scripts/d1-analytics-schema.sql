-- =====================================================
-- 🎯 MyBonzo AI Blog Analytics Schema
-- D1 Database Schema dla Dashboard Real Data
-- =====================================================

-- Tabela logowania zapytań AI (RAG + Chat)
CREATE TABLE IF NOT EXISTS queries_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  user_query TEXT NOT NULL,
  query_type TEXT NOT NULL CHECK (query_type IN ('rag', 'chat', 'image', 'voice')),
  user_ip TEXT,
  user_agent TEXT,
  
  -- RAG specific
  rag_hits INTEGER DEFAULT 0,
  products_returned INTEGER DEFAULT 0,
  categories_found TEXT, -- JSON array
  
  -- Response metadata
  response_time_ms INTEGER,
  model_used TEXT,
  tokens_used INTEGER,
  
  -- Success tracking
  success BOOLEAN NOT NULL DEFAULT 1,
  error_message TEXT,
  
  -- Context
  referrer TEXT,
  session_id TEXT,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_timestamp (timestamp),
  INDEX idx_query_type (query_type),
  INDEX idx_user_ip (user_ip),
  INDEX idx_success (success)
);

-- Tabela kliknięć produktów (tracking UTM i conversions)
CREATE TABLE IF NOT EXISTS product_clicks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  
  -- Product info
  product_id TEXT NOT NULL,
  product_name TEXT,
  category TEXT,
  price REAL,
  
  -- Click context
  source_page TEXT, -- '/pumo-guide/kategoria'
  user_ip TEXT,
  user_agent TEXT,
  
  -- UTM tracking (dla Meble Pumo)
  utm_source TEXT DEFAULT 'mybonzo_ai',
  utm_medium TEXT DEFAULT 'ai_guide',
  utm_campaign TEXT,
  utm_content TEXT, -- product_id or category
  utm_term TEXT, -- search query that led to product
  
  -- Conversion tracking
  click_target TEXT, -- 'shop_link', 'price_check', 'details'
  converted BOOLEAN DEFAULT 0,
  conversion_value REAL,
  
  -- Session context
  session_id TEXT,
  query_id INTEGER, -- Link do queries_log
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (query_id) REFERENCES queries_log(id),
  INDEX idx_timestamp (timestamp),
  INDEX idx_product_id (product_id),
  INDEX idx_category (category),
  INDEX idx_utm_campaign (utm_campaign),
  INDEX idx_converted (converted)
);

-- Tabela wydajności UTM campaigns
CREATE TABLE IF NOT EXISTS utm_performance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL, -- YYYY-MM-DD
  
  utm_source TEXT NOT NULL,
  utm_medium TEXT NOT NULL,
  utm_campaign TEXT,
  
  -- Metrics
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue REAL DEFAULT 0.0,
  
  -- CTR calculations
  impressions INTEGER DEFAULT 0, -- ile razy pokazany
  ctr REAL GENERATED ALWAYS AS (CASE WHEN impressions > 0 THEN CAST(clicks AS REAL) / impressions * 100 ELSE 0 END),
  
  -- Conversion rate
  conversion_rate REAL GENERATED ALWAYS AS (CASE WHEN clicks > 0 THEN CAST(conversions AS REAL) / clicks * 100 ELSE 0 END),
  
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(date, utm_source, utm_medium, utm_campaign),
  INDEX idx_date (date),
  INDEX idx_campaign (utm_campaign),
  INDEX idx_ctr (ctr),
  INDEX idx_conversion_rate (conversion_rate)
);

-- Tabela pokrycia kategorii (coverage analysis)
CREATE TABLE IF NOT EXISTS category_coverage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL UNIQUE,
  
  -- Product counts
  total_products INTEGER DEFAULT 0,
  active_products INTEGER DEFAULT 0,
  
  -- Query analysis
  total_queries INTEGER DEFAULT 0,
  successful_queries INTEGER DEFAULT 0,
  zero_result_queries INTEGER DEFAULT 0,
  
  -- Performance metrics
  avg_products_per_query REAL DEFAULT 0.0,
  hit_rate REAL GENERATED ALWAYS AS (CASE WHEN total_queries > 0 THEN CAST(successful_queries AS REAL) / total_queries * 100 ELSE 0 END),
  
  -- Traffic analysis
  total_clicks INTEGER DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  total_revenue REAL DEFAULT 0.0,
  
  -- Coverage status
  coverage_status TEXT CHECK (coverage_status IN ('good', 'poor', 'missing', 'excellent')) DEFAULT 'missing',
  priority_score INTEGER DEFAULT 0, -- 1-100, higher = more important to fix
  
  -- Timestamps
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_query DATETIME,
  
  INDEX idx_hit_rate (hit_rate),
  INDEX idx_priority_score (priority_score),
  INDEX idx_coverage_status (coverage_status)
);

-- =====================================================
-- 🤖 AI Analyst Helper Views
-- =====================================================

-- View: Top zapytań z niskim hit rate (do poprawy)
CREATE VIEW IF NOT EXISTS v_low_hit_queries AS
SELECT 
  user_query,
  query_type,
  COUNT(*) as total_requests,
  SUM(CASE WHEN rag_hits > 0 THEN 1 ELSE 0 END) as successful_requests,
  CAST(SUM(CASE WHEN rag_hits > 0 THEN 1 ELSE 0 END) AS REAL) / COUNT(*) * 100 as hit_rate,
  AVG(rag_hits) as avg_products_found,
  MAX(timestamp) as last_requested
FROM queries_log 
WHERE query_type = 'rag' 
GROUP BY user_query 
HAVING COUNT(*) >= 3 AND hit_rate < 50
ORDER BY total_requests DESC, hit_rate ASC;

-- View: Category Performance Dashboard
CREATE VIEW IF NOT EXISTS v_category_dashboard AS
SELECT 
  cc.category,
  cc.total_products,
  cc.total_queries,
  cc.hit_rate,
  cc.total_clicks,
  cc.total_conversions,
  cc.total_revenue,
  cc.coverage_status,
  cc.priority_score,
  CASE 
    WHEN cc.hit_rate >= 80 THEN '🟢'
    WHEN cc.hit_rate >= 50 THEN '🟡' 
    ELSE '🔴'
  END as status_emoji,
  cc.last_updated
FROM category_coverage cc
ORDER BY cc.priority_score DESC, cc.hit_rate ASC;

-- View: Daily UTM Performance
CREATE VIEW IF NOT EXISTS v_daily_utm_performance AS
SELECT 
  date,
  utm_campaign,
  SUM(clicks) as total_clicks,
  SUM(conversions) as total_conversions,
  SUM(revenue) as total_revenue,
  AVG(ctr) as avg_ctr,
  AVG(conversion_rate) as avg_conversion_rate
FROM utm_performance 
WHERE date >= date('now', '-30 days')
GROUP BY date, utm_campaign
ORDER BY date DESC, total_revenue DESC;

-- View: AI Query Success Analysis
CREATE VIEW IF NOT EXISTS v_ai_success_analysis AS
SELECT 
  DATE(created_at) as date,
  query_type,
  COUNT(*) as total_queries,
  SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful_queries,
  CAST(SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) AS REAL) / COUNT(*) * 100 as success_rate,
  AVG(response_time_ms) as avg_response_time,
  SUM(tokens_used) as total_tokens
FROM queries_log 
WHERE created_at >= datetime('now', '-7 days')
GROUP BY DATE(created_at), query_type
ORDER BY date DESC, query_type;

-- =====================================================
-- 📊 Initial Data & Triggers
-- =====================================================

-- Trigger: Auto-update category_coverage gdy dodajemy query
CREATE TRIGGER IF NOT EXISTS update_category_coverage_on_query
AFTER INSERT ON queries_log
WHEN NEW.query_type = 'rag' AND NEW.categories_found IS NOT NULL
BEGIN
  -- Update existing categories or insert new ones
  INSERT OR IGNORE INTO category_coverage (category, total_queries) 
  SELECT TRIM(value) as category, 0 FROM json_each(NEW.categories_found);
  
  UPDATE category_coverage 
  SET 
    total_queries = total_queries + 1,
    successful_queries = successful_queries + CASE WHEN NEW.rag_hits > 0 THEN 1 ELSE 0 END,
    zero_result_queries = zero_result_queries + CASE WHEN NEW.rag_hits = 0 THEN 1 ELSE 0 END,
    last_query = datetime('now'),
    last_updated = datetime('now')
  WHERE category IN (SELECT TRIM(value) FROM json_each(NEW.categories_found));
END;

-- Trigger: Auto-update UTM performance on product clicks
CREATE TRIGGER IF NOT EXISTS update_utm_on_click
AFTER INSERT ON product_clicks
BEGIN
  INSERT OR REPLACE INTO utm_performance 
  (date, utm_source, utm_medium, utm_campaign, clicks, conversions, revenue)
  VALUES (
    date('now'),
    COALESCE(NEW.utm_source, 'mybonzo_ai'),
    COALESCE(NEW.utm_medium, 'ai_guide'),
    NEW.utm_campaign,
    1,
    CASE WHEN NEW.converted = 1 THEN 1 ELSE 0 END,
    COALESCE(NEW.conversion_value, 0)
  )
  ON CONFLICT(date, utm_source, utm_medium, utm_campaign) DO UPDATE SET
    clicks = clicks + 1,
    conversions = conversions + CASE WHEN NEW.converted = 1 THEN 1 ELSE 0 END,
    revenue = revenue + COALESCE(NEW.conversion_value, 0),
    updated_at = datetime('now');
END;

-- =====================================================
-- 🎯 Przykładowe dane testowe (opcjonalnie)
-- =====================================================

-- Przykładowe zapytania
INSERT OR IGNORE INTO queries_log (user_query, query_type, rag_hits, products_returned, categories_found, response_time_ms, model_used, success) VALUES
('szafka kuchenna biała', 'rag', 5, 5, '["Szafki kuchenne"]', 1200, '@cf/meta/llama-3', 1),
('łóżko 160x200 materac', 'rag', 3, 3, '["Łóżka", "Materace"]', 1100, '@cf/meta/llama-3', 1),
('biurko gaming podświetlane', 'rag', 0, 0, '["Biurka"]', 900, '@cf/meta/llama-3', 1),
('materac sprężynowy twardy', 'rag', 0, 0, '["Materace"]', 800, '@cf/meta/llama-3', 1),
('krzesło biurowe ergonomiczne', 'rag', 2, 2, '["Krzesła"]', 950, '@cf/meta/llama-3', 1);

-- Przykładowe kategorie
INSERT OR IGNORE INTO category_coverage (category, total_products, active_products, coverage_status, priority_score) VALUES
('Szafki kuchenne', 45, 42, 'good', 85),
('Łóżka', 23, 21, 'good', 80),
('Materace', 15, 12, 'poor', 90),
('Biurka', 8, 6, 'poor', 95),
('Krzesła', 12, 10, 'missing', 88);

-- =====================================================
-- ✅ Schema Ready!
-- =====================================================

-- Query do sprawdzenia czy wszystko działa:
-- SELECT * FROM v_category_dashboard;
-- SELECT * FROM v_low_hit_queries;
-- SELECT * FROM v_ai_success_analysis;