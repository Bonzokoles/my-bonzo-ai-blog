-- Add tracking columns
ALTER TABLE products ADD COLUMN real_url TEXT;
ALTER TABLE products ADD COLUMN url_slug TEXT;
CREATE INDEX IF NOT EXISTS idx_products_real_url ON products(real_url);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(url_slug);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,
  category TEXT,
  product_id TEXT,
  utm_campaign TEXT,
  timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
  session_id TEXT
);

CREATE INDEX idx_analytics_event ON analytics_events(event_type, timestamp);
