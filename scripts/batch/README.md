# Batch Scripts

Windows batch files for deployment and maintenance tasks.

## Scripts

### Deployment Scripts
- `DEPLOY_CRON_WORKER.bat` - Deploy cron worker to Cloudflare
- `FORCE_INDEX_NOW.bat` - Force immediate vector index update

### Import Scripts
- `import_batches.bat` - Batch import operations

## Usage

### Prerequisites
- Windows environment
- Cloudflare CLI (wrangler) installed
- Proper environment variables configured

### Running Scripts
```cmd
REM Example: Deploy cron worker
.\scripts\batch\DEPLOY_CRON_WORKER.bat

REM Example: Force index update
.\scripts\batch\FORCE_INDEX_NOW.bat
```

## Environment Variables

Ensure these are set before running batch scripts:
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID
- `CLOUDFLARE_API_TOKEN` - Your Cloudflare API token

## Cross-Platform Alternative

For cross-platform support, use the npm scripts instead:
```bash
npm run deploy
wrangler vectorize insert <index-name> --file=<data-file>
```
