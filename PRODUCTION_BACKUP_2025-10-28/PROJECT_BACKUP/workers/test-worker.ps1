Write-Host "Testing Worker API..." -ForegroundColor Green

$WorkerURL = "https://mybonzo-blog-worker.stolarnia-ams.workers.dev"

# Test 1: Get blog index
Write-Host "1. Testing blog index..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$WorkerURL/api/blog/index" -Method GET
    Write-Host "✅ Blog index retrieved: $($response.posts.Count) posts" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
}
catch {
    Write-Host "❌ Failed to get blog index: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Upload a simple post using form data
Write-Host "`n2. Testing post upload..." -ForegroundColor Yellow

try {
    $boundary = [System.Guid]::NewGuid().ToString()
    $bodyLines = @()
    
    # Title
    $bodyLines += "--$boundary"
    $bodyLines += 'Content-Disposition: form-data; name="title"'
    $bodyLines += ""
    $bodyLines += "Test Post from PowerShell"
    
    # Content
    $bodyLines += "--$boundary"
    $bodyLines += 'Content-Disposition: form-data; name="content"'
    $bodyLines += ""
    $bodyLines += "This is a test post uploaded via PowerShell script."
    
    # Excerpt
    $bodyLines += "--$boundary"
    $bodyLines += 'Content-Disposition: form-data; name="excerpt"'
    $bodyLines += ""
    $bodyLines += "A simple test post"
    
    $bodyLines += "--$boundary--"
    
    $body = $bodyLines -join "`r`n"
    
    $response = Invoke-RestMethod -Uri "$WorkerURL/api/blog/upload" -Method POST -Body $body -ContentType "multipart/form-data; boundary=$boundary"
    Write-Host "✅ Post uploaded successfully!" -ForegroundColor Green
    $response | ConvertTo-Json
}
catch {
    Write-Host "❌ Failed to upload post: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
}

# Test 3: Refresh index
Write-Host "`n3. Refreshing index..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$WorkerURL/api/blog/refresh" -Method GET
    Write-Host "✅ Index refreshed: $($response.posts.Count) posts" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to refresh index: $($_.Exception.Message)" -ForegroundColor Red
}