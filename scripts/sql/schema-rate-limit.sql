CREATE TABLE IF NOT EXISTS rate_limits (
  id INTEGER PRIMARY KEY,
  store TEXT,
  date TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_store_date ON rate_limits(store, date);
