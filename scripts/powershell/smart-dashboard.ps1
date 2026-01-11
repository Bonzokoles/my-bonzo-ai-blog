$ErrorActionPreference = "Stop"

Write-Host "=== AI SEO DASHBOARD (local D1 only) ===" -ForegroundColor Cyan
Write-Host "Time: $(Get-Date)" -ForegroundColor Gray

# Execute D1 query via Wrangler (remote to get real data)
$query = "
  SELECT 
    event_type, 
    category, 
    COUNT(*) as count,
    ROUND(
      SUM(CASE WHEN event_type='shop_link' THEN 1 ELSE 0 END)*100.0 / 
      MAX(SUM(CASE WHEN event_type='page_view' THEN 1 ELSE 0 END), 1), 
      1
    ) as ctr_percent
  FROM analytics_events 
  WHERE timestamp > datetime('now', '-1 day')
  GROUP BY event_type, category 
  HAVING count > 0
  ORDER BY count DESC 
  LIMIT 10;
"

# We use --remote to see PRODUCTION data
wrangler d1 execute jimbo-rag-db --command=$query --remote

Write-Host "======================================" -ForegroundColor Cyan
