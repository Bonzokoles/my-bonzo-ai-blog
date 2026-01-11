# SQL Scripts

Database migration and schema scripts for the MyBonzo AI Blog.

## Files

### Migration Scripts
- `migration.sql` - Main database migration
- `schema-business-analytics.sql` - Business analytics schema
- `schema-rate-limit.sql` - Rate limiting schema
- `schema-tracking.sql` - Tracking and analytics schema

### Update Scripts
- `update-product-urls.sql` - Product URL updates (production)
- `update-product-urls-test.sql` - Product URL updates (test)

## Usage

These scripts are designed to work with Cloudflare D1 databases.

### Local Development
```bash
# Apply migration locally
wrangler d1 execute jimbo-rag-db --local --file=scripts/sql/migration.sql
```

### Production
```bash
# Apply migration to production
wrangler d1 execute jimbo-rag-db --remote --file=scripts/sql/migration.sql
```

## Database Bindings

See `wrangler.toml` for database bindings:
- `DB` - Main RAG database (jimbo-rag-db)
- `PUMO_DB` - Product database (pumo_products)
