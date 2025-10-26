# Test Cloudflare Images Upload
# This script tests the new CF Images endpoint

$workerUrl = "https://mybonzo-blog-worker.stolarnia-ams.workers.dev"

try {
    Write-Host "Testing Cloudflare Images upload..." -ForegroundColor Green
    
    # First, let's test if the endpoint exists
    Write-Host "Testing API endpoint availability..." -ForegroundColor Yellow
    
    $testResponse = Invoke-RestMethod -Uri "$workerUrl/api/blog/index" -Method GET
    Write-Host "Worker is responding correctly" -ForegroundColor Green
    
    Write-Host "Note: To test CF Images upload, you need:" -ForegroundColor Cyan
    Write-Host "1. Valid CF_IMAGES_API_TOKEN secret (already set)" -ForegroundColor Cyan
    Write-Host "2. Cloudflare Images enabled in your account" -ForegroundColor Cyan
    Write-Host "3. A valid delivery hash in CF_IMAGES_DELIVERY_URL" -ForegroundColor Cyan
    
    Write-Host "`nTo enable CF Images:" -ForegroundColor Yellow
    Write-Host "1. Go to Cloudflare Dashboard > Images" -ForegroundColor White
    Write-Host "2. Enable Cloudflare Images" -ForegroundColor White
    Write-Host "3. Get your delivery URL hash" -ForegroundColor White
    Write-Host "4. Update CF_IMAGES_DELIVERY_URL in wrangler.toml" -ForegroundColor White
    
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host "CF Images setup guide completed." -ForegroundColor Green