-- Analytics tables only (without modifying products)
-- Created: 9 stycznia 2026

-- Analytics events tracking
CREATE TABLE IF NOT EXISTS analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL, -- 'click', 'view', 'purchase', 'search'
  category TEXT,            -- Product category  
  product_id TEXT,          -- Product ID
  product_name TEXT,        -- Product name
  utm_source TEXT,          -- mybonzo, direct, google
  utm_medium TEXT,          -- ai_guide, rag_search, email
  utm_campaign TEXT,        -- buying_guide_lozka, search_results
  session_id TEXT,          -- User session
  user_agent TEXT,          -- Browser info
  ip_address TEXT,          -- Client IP
  timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
  metadata TEXT,            -- JSON with extra data
  revenue DECIMAL(10,2) DEFAULT 0, -- Revenue from this event
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type, timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_utm_source ON analytics_events(utm_source, timestamp);

-- Daily KPI aggregates (for faster dashboard queries)
CREATE TABLE IF NOT EXISTS daily_kpis (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT UNIQUE NOT NULL,        -- YYYY-MM-DD
  total_clicks INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  total_purchases INTEGER DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  ai_clicks INTEGER DEFAULT 0,     -- Clicks from AI sources
  ai_revenue DECIMAL(10,2) DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  ai_conversion_rate DECIMAL(5,2) DEFAULT 0,
  top_category TEXT,
  top_product TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_daily_kpis_date ON daily_kpis(date DESC);

-- Reports storage
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,              -- UUID
  type TEXT NOT NULL,               -- 'daily', 'weekly', 'monthly'
  period_start TEXT NOT NULL,       -- ISO timestamp
  period_end TEXT NOT NULL,         -- ISO timestamp
  summary TEXT NOT NULL,            -- JSON summary data
  details TEXT,                     -- Detailed JSON data
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reports_type_date ON reports(type, period_end DESC);