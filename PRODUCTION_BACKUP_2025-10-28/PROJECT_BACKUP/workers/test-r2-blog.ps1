# Test R2 Blog System
# This script creates a test blog post

$workerUrl = "https://mybonzo-blog-worker.stolarnia-ams.workers.dev"

$testPost = @{
    title     = "Test Post - CF Integration Check"
    content   = @"
# Test Cloudflare Integration

To jest testowy wpis utworzony **$(Get-Date -Format 'yyyy-MM-dd HH:mm')**

## Status systemu:
- ✅ R2 Storage - działa 
- 🔄 Cloudflare Images - w trakcie konfiguracji
- ✅ Worker API - aktywny
- ✅ Frontend - responsywny

### Kolejne kroki:
1. Włączenie CF Images w Dashboard
2. Konfiguracja delivery hash
3. Test upload obrazków

*Ten wpis zostanie usunięty po teście.*
"@
    tags      = @("test", "system", "cloudflare")
    published = $true
} | ConvertTo-Json -Depth 3

try {
    Write-Host "Tworzenie testowego wpisu..." -ForegroundColor Green
    
    $response = Invoke-RestMethod -Uri "$workerUrl/api/blog" -Method POST -Body $testPost -ContentType "application/json"
    
    Write-Host "✅ Wpis utworzony pomyślnie!" -ForegroundColor Green
    Write-Host "ID: $($response.id)" -ForegroundColor Cyan
    Write-Host "URL: https://www.mybonzoaiblog.com/blog/$($response.id)" -ForegroundColor Cyan
    
    Write-Host "`n🌐 Sprawdź wpis na stronie głównej:" -ForegroundColor Yellow
    Write-Host "https://www.mybonzoaiblog.com" -ForegroundColor White
    
}
catch {
    Write-Host "❌ Błąd: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorContent = $_.Exception.Response.GetResponseStream()
        Write-Host "Details: $errorContent" -ForegroundColor Red
    }
}