@echo off
echo ================================================
echo   DEPLOY CLOUDFLARE CRON WORKER
echo   Auto-indexing co 30 minut
echo ================================================
echo.

REM Deploy worker z cron trigger
cd /d "%~dp0"
echo Deploying auto-index-cron worker...
npx wrangler deploy workers/auto-index-cron.js --config wrangler-cron.toml

echo.
echo ================================================
echo   WORKER DEPLOYED!
echo ================================================
echo.
echo Cron schedule: Co 30 minut (*/30 * * * *)
echo Worker URL: https://auto-index-cron.{your-subdomain}.workers.dev
echo.
echo Sprawdź w Cloudflare Dashboard:
echo https://dash.cloudflare.com/ > Workers ^& Pages > auto-index-cron
echo.
echo Uruchom ręcznie pierwszy raz:
echo wrangler tail auto-index-cron
echo.
pause
