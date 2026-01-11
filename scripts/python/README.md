# Python Scripts

Utility scripts for the MyBonzo AI Blog project.

## Import Scripts

### Product Import
- `auto_import.py` - Automated product import
- `batch_import_all.py` - Batch import for all products
- `import_all_products.py` - Import all products to database

### D1 Database Import
- `d1_api_import.py` - Import data via D1 API
- `manual_d1_import.py` - Manual D1 database import
- `simple_d1_import.py` - Simplified D1 import script

## Maintenance Scripts

- `clean_md_files.py` - Clean and format markdown files
- `disable_api_prerender.py` - Disable API prerendering
- `fix_prerender.py` - Fix prerender issues

## Usage

### Prerequisites
```bash
pip install -r requirements.txt  # If requirements file exists
```

### Running Scripts
```bash
# Example: Run product import
python scripts/python/import_all_products.py

# Example: Clean markdown files
python scripts/python/clean_md_files.py
```

## Environment Variables

Some scripts may require environment variables:
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare account ID
- `CLOUDFLARE_API_TOKEN` - Cloudflare API token
- Database connection strings (set in `.env`)
