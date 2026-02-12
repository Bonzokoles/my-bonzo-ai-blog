PRAGMA defer_foreign_keys=TRUE;

CREATE TABLE categories (
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

INSERT INTO "categories" VALUES(1,'cat_001','Meble','furniture','Wszystkie rodzaje mebli do domu i biura',NULL,0,0,NULL,NULL,NULL,1,4,'2026-02-12 06:36:52','2026-02-12 06:37:38');
INSERT INTO "categories" VALUES(2,'cat_002','Oświetlenie','lighting','Lampy, żyrandole i oprawy oświetleniowe',NULL,0,0,NULL,NULL,NULL,1,1,'2026-02-12 06:36:52','2026-02-12 06:36:52');
INSERT INTO "categories" VALUES(3,'cat_003','Przechowywanie','storage','Szafy, komody, regały i organizery',NULL,0,0,NULL,NULL,NULL,1,1,'2026-02-12 06:36:52','2026-02-12 06:36:52');
INSERT INTO "categories" VALUES(4,'cat_004','Dekoracje','decor','Dodatki dekoracyjne i ozdoby',NULL,0,0,NULL,NULL,NULL,1,0,'2026-02-12 06:36:52','2026-02-12 06:36:52');
INSERT INTO "categories" VALUES(5,'cat_005','Kuchnia','kitchen','Meble i akcesoria kuchenne',NULL,0,0,NULL,NULL,NULL,1,0,'2026-02-12 06:36:52','2026-02-12 06:36:52');
INSERT INTO "categories" VALUES(6,'cat_006','Sypialnia','bedroom','Meble i akcesoria do sypialni',NULL,0,0,NULL,NULL,NULL,1,0,'2026-02-12 06:36:52','2026-02-12 06:36:52');

CREATE TABLE products (
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

INSERT INTO "products" VALUES(1,'prod_001','Szafa IKEA MALM','Przestronna szafa z lustrem w kolorze białym',1,899,1099,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4.5,127,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'active','2026-02-12 06:36:52','2026-02-12 06:36:52','2026-02-12 06:36:52');
INSERT INTO "products" VALUES(2,'prod_002','Stół dębowy rustical','Masywny stół z drewna dębowego w stylu rustykalnym',1,1299,1299,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4.8,89,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'active','2026-02-12 06:36:52','2026-02-12 06:36:52','2026-02-12 06:36:52');
INSERT INTO "products" VALUES(3,'prod_003','Lampa wisząca LED','Nowoczesna lampa LED do salonu i jadalni',2,349,449,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4.2,45,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'active','2026-02-12 06:36:52','2026-02-12 06:36:52','2026-02-12 06:36:52');
INSERT INTO "products" VALUES(4,'prod_004','Komoda z szufladami','Praktyczna komoda z 6 szufladami',3,649,749,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4.6,78,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'active','2026-02-12 06:36:52','2026-02-12 06:36:52','2026-02-12 06:36:52');
INSERT INTO "products" VALUES(5,'prod_005','Fotel biurowy ergonomiczny','Wygodny fotel obrotowy do pracy',1,799,999,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4.7,156,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'active','2026-02-12 06:36:52','2026-02-12 06:36:52','2026-02-12 06:36:52');
INSERT INTO "products" VALUES(6,'TEST-001','Test Sofa Dynamic','This is a dynamic product fetched from D1',1,999,NULL,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'active','2026-02-12 06:37:38','2026-02-12 06:37:38','2026-02-12 06:37:38');

CREATE TABLE queries (
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
CREATE TABLE query_analytics_daily (
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
CREATE TABLE system_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    metric_type TEXT NOT NULL, -- queries, performance, cache, errors
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(12,4),
    metric_unit TEXT,
    dimensions TEXT, -- JSON object for additional dimensions
    tags TEXT -- JSON array of tags
);
INSERT INTO "system_metrics" VALUES(1,'2026-02-12 06:36:52','queries','daily_volume',15420,'count',NULL,NULL);
INSERT INTO "system_metrics" VALUES(2,'2026-02-12 06:36:52','queries','success_rate',94.2,'percentage',NULL,NULL);
INSERT INTO "system_metrics" VALUES(3,'2026-02-12 06:36:52','performance','avg_response_time',245,'milliseconds',NULL,NULL);
INSERT INTO "system_metrics" VALUES(4,'2026-02-12 06:36:52','cache','hit_rate',78.2,'percentage',NULL,NULL);
INSERT INTO "system_metrics" VALUES(5,'2026-02-12 06:36:52','system','uptime',99.8,'percentage',NULL,NULL);
CREATE TABLE sync_logs (
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
    configuration TEXT, -- JSON object for sync settings
    errors TEXT, -- JSON array of error messages
    warnings TEXT -- JSON array of warning messages
);
CREATE TABLE user_sessions (
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
DELETE FROM sqlite_sequence;
INSERT INTO "sqlite_sequence" VALUES('categories',6);
INSERT INTO "sqlite_sequence" VALUES('products',6);
INSERT INTO "sqlite_sequence" VALUES('system_metrics',5);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_updated ON products(updated_at);
CREATE INDEX idx_products_external ON products(external_id);
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active);
CREATE INDEX idx_queries_timestamp ON queries(timestamp);
CREATE INDEX idx_queries_hash ON queries(query_hash);
CREATE INDEX idx_queries_status ON queries(status);
CREATE INDEX idx_queries_session ON queries(session_id);
CREATE INDEX idx_analytics_date ON query_analytics_daily(date);
CREATE INDEX idx_analytics_hash ON query_analytics_daily(query_hash);
CREATE INDEX idx_analytics_category ON query_analytics_daily(category);
CREATE INDEX idx_metrics_timestamp ON system_metrics(timestamp);
CREATE INDEX idx_metrics_type ON system_metrics(metric_type);
CREATE INDEX idx_metrics_name ON system_metrics(metric_name);
CREATE INDEX idx_sync_status ON sync_logs(status);
CREATE INDEX idx_sync_started ON sync_logs(started_at);
CREATE TRIGGER update_product_timestamp 
    AFTER UPDATE ON products
BEGIN
    UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
CREATE TRIGGER update_category_timestamp 
    AFTER UPDATE ON categories
BEGIN
    UPDATE categories SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
CREATE TRIGGER update_category_count_insert
    AFTER INSERT ON products
    WHEN NEW.status = 'active'
BEGIN
    UPDATE categories 
    SET product_count = product_count + 1 
    WHERE id = NEW.category_id;
END;
CREATE TRIGGER update_category_count_update
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
CREATE TRIGGER update_category_count_delete
    AFTER DELETE ON products
    WHEN OLD.status = 'active'
BEGIN
    UPDATE categories 
    SET product_count = product_count - 1 
    WHERE id = OLD.category_id;
END;
CREATE VIEW product_summary AS
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
CREATE VIEW daily_query_stats AS
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
CREATE VIEW top_queries AS
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
