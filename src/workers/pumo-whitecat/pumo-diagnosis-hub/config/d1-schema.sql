-- PUMO D1 Database Schema
-- SQLite schema for PUMO system data storage

-- Products table - Core product information
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    external_id TEXT UNIQUE NOT NULL, -- ID from Meble Pumo system
    name TEXT NOT NULL,
    description TEXT,
    category_id INTEGER,
    price DECIMAL(10,2),
    original_price DECIMAL(10,2),
    discount_percentage INTEGER DEFAULT 0,
    in_stock BOOLEAN DEFAULT TRUE,
    stock_quantity INTEGER DEFAULT 0,
    sku TEXT UNIQUE,
    barcode TEXT,
    brand TEXT,
    material TEXT,
    color TEXT,
    dimensions_width DECIMAL(8,2),
    dimensions_height DECIMAL(8,2),
    dimensions_depth DECIMAL(8,2),
    weight DECIMAL(8,2),
    warranty_months INTEGER,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    image_url TEXT,
    gallery_urls TEXT, -- JSON array of image URLs
    product_url TEXT,
    tags TEXT, -- JSON array of tags
    features TEXT, -- JSON array of features
    specifications TEXT, -- JSON object of detailed specs
    seo_title TEXT,
    seo_description TEXT,
    status TEXT DEFAULT 'active', -- active, inactive, discontinued
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    synced_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Categories table - Product categorization
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    external_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    parent_id INTEGER,
    level INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    image_url TEXT,
    seo_title TEXT,
    seo_description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    product_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- Queries table - Search query analytics
CREATE TABLE IF NOT EXISTS queries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    query_text TEXT NOT NULL,
    query_hash TEXT NOT NULL, -- MD5 hash for fast lookups
    user_ip TEXT,
    user_agent TEXT,
    session_id TEXT,
    category_filter TEXT,
    price_min DECIMAL(10,2),
    price_max DECIMAL(10,2),
    sort_by TEXT,
    sort_order TEXT,
    results_count INTEGER DEFAULT 0,
    clicked_product_id INTEGER,
    response_time_ms INTEGER,
    status TEXT NOT NULL, -- success, timeout, error, no_results
    error_message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    converted BOOLEAN DEFAULT FALSE,
    converted_at DATETIME,
    FOREIGN KEY (clicked_product_id) REFERENCES products(id)
);

-- Query analytics aggregated by day
CREATE TABLE IF NOT EXISTS query_analytics_daily (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    query_text TEXT NOT NULL,
    query_hash TEXT NOT NULL,
    category TEXT,
    total_queries INTEGER DEFAULT 0,
    unique_users INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    timeout_count INTEGER DEFAULT 0,
    no_results_count INTEGER DEFAULT 0,
    avg_response_time DECIMAL(8,2) DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    total_conversions INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, query_hash)
);

-- System metrics table - Performance tracking
CREATE TABLE IF NOT EXISTS system_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    metric_type TEXT NOT NULL, -- queries, performance, cache, errors
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(12,4),
    metric_unit TEXT,
    dimensions TEXT, -- JSON object for additional dimensions
    tags TEXT -- JSON array of tags
);

-- Sync logs table - Data synchronization tracking
CREATE TABLE IF NOT EXISTS sync_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sync_id TEXT UNIQUE NOT NULL,
    sync_type TEXT NOT NULL, -- full, incremental, category
    status TEXT NOT NULL, -- running, completed, failed, cancelled
    items_processed INTEGER DEFAULT 0,
    items_added INTEGER DEFAULT 0,
    items_updated INTEGER DEFAULT 0,
    items_removed INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    warning_count INTEGER DEFAULT 0,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    duration_seconds INTEGER,
    configuration TEXT, -- JSON object of sync settings
    errors TEXT, -- JSON array of error messages
    warnings TEXT -- JSON array of warning messages
);

-- User sessions table - User behavior tracking (if needed)
CREATE TABLE IF NOT EXISTS user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT UNIQUE NOT NULL,
    user_ip TEXT,
    user_agent TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    first_visit DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
    page_views INTEGER DEFAULT 1,
    query_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    conversion_count INTEGER DEFAULT 0,
    session_duration_seconds INTEGER DEFAULT 0
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_updated ON products(updated_at);
CREATE INDEX IF NOT EXISTS idx_products_external ON products(external_id);

CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);

CREATE INDEX IF NOT EXISTS idx_queries_timestamp ON queries(timestamp);
CREATE INDEX IF NOT EXISTS idx_queries_hash ON queries(query_hash);
CREATE INDEX IF NOT EXISTS idx_queries_status ON queries(status);
CREATE INDEX IF NOT EXISTS idx_queries_session ON queries(session_id);

CREATE INDEX IF NOT EXISTS idx_analytics_date ON query_analytics_daily(date);
CREATE INDEX IF NOT EXISTS idx_analytics_hash ON query_analytics_daily(query_hash);
CREATE INDEX IF NOT EXISTS idx_analytics_category ON query_analytics_daily(category);

CREATE INDEX IF NOT EXISTS idx_metrics_timestamp ON system_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_metrics_type ON system_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_metrics_name ON system_metrics(metric_name);

CREATE INDEX IF NOT EXISTS idx_sync_status ON sync_logs(status);
CREATE INDEX IF NOT EXISTS idx_sync_started ON sync_logs(started_at);

-- Views for common queries
CREATE VIEW IF NOT EXISTS product_summary AS
SELECT 
    p.id,
    p.external_id,
    p.name,
    p.price,
    p.in_stock,
    p.rating,
    p.review_count,
    c.name as category_name,
    c.slug as category_slug,
    p.created_at,
    p.updated_at
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.status = 'active';

CREATE VIEW IF NOT EXISTS daily_query_stats AS
SELECT 
    DATE(timestamp) as date,
    COUNT(*) as total_queries,
    COUNT(DISTINCT user_ip) as unique_users,
    AVG(response_time_ms) as avg_response_time,
    COUNT(CASE WHEN status = 'success' THEN 1 END) as successful_queries,
    COUNT(CASE WHEN status = 'error' THEN 1 END) as error_queries,
    COUNT(CASE WHEN converted = TRUE THEN 1 END) as conversions,
    ROUND(COUNT(CASE WHEN converted = TRUE THEN 1 END) * 100.0 / COUNT(*), 2) as conversion_rate
FROM queries 
GROUP BY DATE(timestamp)
ORDER BY date DESC;

CREATE VIEW IF NOT EXISTS top_queries AS
SELECT 
    query_text,
    COUNT(*) as query_count,
    COUNT(DISTINCT user_ip) as unique_users,
    AVG(response_time_ms) as avg_response_time,
    COUNT(CASE WHEN converted = TRUE THEN 1 END) as conversions,
    ROUND(COUNT(CASE WHEN converted = TRUE THEN 1 END) * 100.0 / COUNT(*), 2) as conversion_rate,
    MAX(timestamp) as last_queried
FROM queries 
WHERE timestamp >= datetime('now', '-30 days')
  AND status = 'success'
GROUP BY query_text
HAVING query_count >= 5
ORDER BY query_count DESC
LIMIT 100;

-- Triggers for automatic timestamps
CREATE TRIGGER IF NOT EXISTS update_product_timestamp 
    AFTER UPDATE ON products
BEGIN
    UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_category_timestamp 
    AFTER UPDATE ON categories
BEGIN
    UPDATE categories SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger to update category product counts
CREATE TRIGGER IF NOT EXISTS update_category_count_insert
    AFTER INSERT ON products
    WHEN NEW.status = 'active'
BEGIN
    UPDATE categories 
    SET product_count = product_count + 1 
    WHERE id = NEW.category_id;
END;

CREATE TRIGGER IF NOT EXISTS update_category_count_update
    AFTER UPDATE ON products
    WHEN OLD.status != NEW.status OR OLD.category_id != NEW.category_id
BEGIN
    -- Decrease count for old category
    UPDATE categories 
    SET product_count = product_count - 1 
    WHERE id = OLD.category_id AND OLD.status = 'active';
    
    -- Increase count for new category
    UPDATE categories 
    SET product_count = product_count + 1 
    WHERE id = NEW.category_id AND NEW.status = 'active';
END;

CREATE TRIGGER IF NOT EXISTS update_category_count_delete
    AFTER DELETE ON products
    WHEN OLD.status = 'active'
BEGIN
    UPDATE categories 
    SET product_count = product_count - 1 
    WHERE id = OLD.category_id;
END;

-- Sample data insertion (for testing)
INSERT OR IGNORE INTO categories (external_id, name, slug, description) VALUES
('cat_001', 'Meble', 'furniture', 'Wszystkie rodzaje mebli do domu i biura'),
('cat_002', 'Oświetlenie', 'lighting', 'Lampy, żyrandole i oprawy oświetleniowe'),
('cat_003', 'Przechowywanie', 'storage', 'Szafy, komody, regały i organizery'),
('cat_004', 'Dekoracje', 'decor', 'Dodatki dekoracyjne i ozdoby'),
('cat_005', 'Kuchnia', 'kitchen', 'Meble i akcesoria kuchenne'),
('cat_006', 'Sypialnia', 'bedroom', 'Meble i akcesoria do sypialni');

INSERT OR IGNORE INTO products (external_id, name, description, category_id, price, original_price, in_stock, rating, review_count) VALUES
('prod_001', 'Szafa IKEA MALM', 'Przestronna szafa z lustrem w kolorze białym', 1, 899.00, 1099.00, TRUE, 4.5, 127),
('prod_002', 'Stół dębowy rustical', 'Masywny stół z drewna dębowego w stylu rustykalnym', 1, 1299.00, 1299.00, TRUE, 4.8, 89),
('prod_003', 'Lampa wisząca LED', 'Nowoczesna lampa LED do salonu i jadalni', 2, 349.00, 449.00, FALSE, 4.2, 45),
('prod_004', 'Komoda z szufladami', 'Praktyczna komoda z 6 szufladami', 3, 649.00, 749.00, TRUE, 4.6, 78),
('prod_005', 'Fotel biurowy ergonomiczny', 'Wygodny fotel obrotowy do pracy', 1, 799.00, 999.00, TRUE, 4.7, 156);

-- Initial system metrics
INSERT INTO system_metrics (metric_type, metric_name, metric_value, metric_unit) VALUES
('queries', 'daily_volume', 15420, 'count'),
('queries', 'success_rate', 94.2, 'percentage'),
('performance', 'avg_response_time', 245, 'milliseconds'),
('cache', 'hit_rate', 78.2, 'percentage'),
('system', 'uptime', 99.8, 'percentage');