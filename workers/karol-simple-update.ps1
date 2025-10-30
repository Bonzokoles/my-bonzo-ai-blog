# Simple Karol Biography Update Script
Write-Host "Updating Karol's Biography..." -ForegroundColor Green

$workerUrl = "https://mybonzo-blog-worker.stolarnia-ams.workers.dev"

# Read full biography
$bioPath = "q:\mybonzo\mybonzoAIblog\public\Od najwcześniejszych wspomnień.md"
$fullBio = Get-Content $bioPath -Raw -Encoding UTF8

Write-Host "Full bio length: $($fullBio.Length) characters" -ForegroundColor Cyan

# Create update payload
$updateData = @{
    title     = "Karol Życiorys - Historia jednego życia"
    content   = $fullBio
    tags      = "autobiografia,skateboarding,londyn,surfing,życie,transformacja"
    published = $true
    password  = "HAOS77"
}

$jsonPayload = $updateData | ConvertTo-Json -Compress

try {
    # Try different endpoints
    Write-Host "Trying to update via PUT /api/blog/karol-zyciorys..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "$workerUrl/api/blog/karol-zyciorys" -Method PUT -Body $jsonPayload -ContentType "application/json"
    Write-Host "✅ SUCCESS!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor White
}
catch {
    Write-Host "❌ PUT failed: $($_.Exception.Message)" -ForegroundColor Red
    
    try {
        Write-Host "Trying POST /api/blog/upload..." -ForegroundColor Yellow
        $response = Invoke-RestMethod -Uri "$workerUrl/api/blog/upload" -Method POST -Body $jsonPayload -ContentType "application/json"
        Write-Host "✅ SUCCESS via POST!" -ForegroundColor Green
        Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor White
    }
    catch {
        Write-Host "❌ POST also failed: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Available endpoints might be different. Check worker configuration." -ForegroundColor Yellow
    }
}

Write-Host "`nFull biography should now be available at:" -ForegroundColor Cyan
Write-Host "https://www.mybonzoaiblog.com/blog/karol-zyciorys" -ForegroundColor White