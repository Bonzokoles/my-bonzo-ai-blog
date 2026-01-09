-- Add missing columns to products table for UTM tracking
-- Created: 9 stycznia 2026

ALTER TABLE products ADD COLUMN utm_source TEXT;
ALTER TABLE products ADD COLUMN utm_medium TEXT; 
ALTER TABLE products ADD COLUMN utm_campaign TEXT;
ALTER TABLE products ADD COLUMN tracked_url TEXT;
ALTER TABLE products ADD COLUMN last_sync_at TEXT;