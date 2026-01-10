-- Business Analytics Database Schema
-- Tabele do przechowywania pełnej analizy biznesowej z historią 3-miesięczną

-- Historia produktów z pełnymi danymi
CREATE TABLE IF NOT EXISTS product_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    price_promo REAL,
    stock_quantity INTEGER DEFAULT 0,
    availability TEXT DEFAULT 'unavailable',
    category TEXT,
    subcategory TEXT,
    brand TEXT,
    url TEXT,
    images TEXT, -- JSON array
    attributes TEXT, -- JSON object
    scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_source TEXT DEFAULT 'api', -- api, scraper, manual
    changes_detected TEXT, -- JSON array of detected changes
    raw_data TEXT -- Full raw data for deep analysis
);

-- Indeksy dla wydajności
CREATE INDEX IF NOT EXISTS idx_product_history_product_id ON product_history(product_id);
CREATE INDEX IF NOT EXISTS idx_product_history_scraped_at ON product_history(scraped_at);
CREATE INDEX IF NOT EXISTS idx_product_history_price ON product_history(price);
CREATE INDEX IF NOT EXISTS idx_product_history_stock ON product_history(stock_quantity);

-- Historia cen dla analizy trendów
CREATE TABLE IF NOT EXISTS price_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id TEXT NOT NULL,
    regular_price REAL NOT NULL,
    promo_price REAL,
    discount_percentage REAL,
    price_change_type TEXT, -- increase, decrease, promo_start, promo_end
    previous_price REAL,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    validity_period TEXT, -- JSON with start/end dates
    source_page_url TEXT
);

CREATE INDEX IF NOT EXISTS idx_price_history_product_id ON price_history(product_id);
CREATE INDEX IF NOT EXISTS idx_price_history_recorded_at ON price_history(recorded_at);

-- Historia dostępności i stanów magazynowych
CREATE TABLE IF NOT EXISTS stock_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id TEXT NOT NULL,
    stock_quantity INTEGER NOT NULL,
    availability_status TEXT NOT NULL, -- available, limited, unavailable, discontinued
    warehouse_location TEXT,
    last_restock_date DATETIME,
    estimated_restock_date DATETIME,
    stock_change INTEGER, -- +/- change from previous record
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    alert_threshold_reached BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_stock_history_product_id ON stock_history(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_history_recorded_at ON stock_history(recorded_at);

-- Kategorie i struktura sklepu
CREATE TABLE IF NOT EXISTS category_structure_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id TEXT,
    category_name TEXT NOT NULL,
    parent_category TEXT,
    category_path TEXT, -- full hierarchical path
    product_count INTEGER DEFAULT 0,
    subcategories TEXT, -- JSON array
    category_url TEXT,
    seo_data TEXT, -- JSON with meta titles, descriptions
    scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    structure_change_type TEXT -- new, modified, deleted, moved
);

-- Analiza konkurencji i pozycjonowania
CREATE TABLE IF NOT EXISTS competitive_analysis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id TEXT NOT NULL,
    competitor_name TEXT,
    competitor_price REAL,
    competitor_url TEXT,
    our_price REAL,
    price_difference REAL,
    price_advantage TEXT, -- higher, lower, equal
    competitor_availability TEXT,
    competitor_rating REAL,
    market_position_score REAL,
    analyzed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Metryki biznesowe i KPI
CREATE TABLE IF NOT EXISTS business_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    metric_date DATE NOT NULL,
    total_products INTEGER DEFAULT 0,
    available_products INTEGER DEFAULT 0,
    products_on_promo INTEGER DEFAULT 0,
    average_price REAL,
    price_range_min REAL,
    price_range_max REAL,
    top_categories TEXT, -- JSON array
    stock_alerts INTEGER DEFAULT 0,
    new_products_added INTEGER DEFAULT 0,
    products_discontinued INTEGER DEFAULT 0,
    total_inventory_value REAL,
    calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- SEO i dane marketingowe
CREATE TABLE IF NOT EXISTS seo_marketing_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id TEXT NOT NULL,
    page_title TEXT,
    meta_description TEXT,
    keywords TEXT, -- JSON array
    page_content_length INTEGER,
    images_count INTEGER,
    internal_links_count INTEGER,
    page_load_time REAL,
    mobile_friendly_score REAL,
    seo_score REAL,
    social_signals TEXT, -- JSON with shares, likes, etc.
    scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Logi scrapingu i zbierania danych
CREATE TABLE IF NOT EXISTS data_collection_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    collection_type TEXT NOT NULL, -- full_site_scrape, api_sync, category_update, etc.
    started_at DATETIME NOT NULL,
    completed_at DATETIME,
    status TEXT DEFAULT 'running', -- running, completed, failed, partial
    items_processed INTEGER DEFAULT 0,
    items_updated INTEGER DEFAULT 0,
    items_created INTEGER DEFAULT 0,
    items_failed INTEGER DEFAULT 0,
    errors_log TEXT, -- JSON array of errors
    performance_metrics TEXT, -- JSON with timing, memory usage, etc.
    data_quality_score REAL,
    next_scheduled_run DATETIME
);

-- Tabela do przechowywania pełnych zrzutów stron (dla głębokiej analizy)
CREATE TABLE IF NOT EXISTS page_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    page_type TEXT, -- product, category, homepage, etc.
    html_content TEXT, -- Full HTML
    extracted_data TEXT, -- JSON with structured data
    screenshot_url TEXT, -- Link to screenshot in R2
    page_size_kb REAL,
    load_time_ms INTEGER,
    accessibility_score REAL,
    captured_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    analysis_status TEXT DEFAULT 'pending' -- pending, analyzed, archived
);

-- Indeksy dla page_snapshots
CREATE INDEX IF NOT EXISTS idx_page_snapshots_url ON page_snapshots(url);
CREATE INDEX IF NOT EXISTS idx_page_snapshots_captured_at ON page_snapshots(captured_at);
CREATE INDEX IF NOT EXISTS idx_page_snapshots_page_type ON page_snapshots(page_type);

-- Alerts i powiadomienia
CREATE TABLE IF NOT EXISTS business_alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alert_type TEXT NOT NULL, -- price_change, stock_low, competitor_alert, etc.
    severity TEXT DEFAULT 'medium', -- low, medium, high, critical
    product_id TEXT,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data_context TEXT, -- JSON with relevant data
    triggered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    acknowledged_at DATETIME,
    resolved_at DATETIME,
    status TEXT DEFAULT 'active' -- active, acknowledged, resolved, dismissed
);

CREATE INDEX IF NOT EXISTS idx_business_alerts_triggered_at ON business_alerts(triggered_at);
CREATE INDEX IF NOT EXISTS idx_business_alerts_status ON business_alerts(status);