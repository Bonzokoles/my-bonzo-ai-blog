# Update Karol Biography - Full Version
$workerUrl = "https://mybonzo-blog-worker.stolarnia-ams.workers.dev"

# Read full biography
$fullBiography = Get-Content "Q:\mybonzo\mybonzoAIblog\public\Od najwcześniejszych wspomnień.md" -Raw -Encoding UTF8

$postData = @{
    title     = "Karol Zyciorys - Historia jednego zycia"
    content   = $fullBiography
    tags      = @("autobiografia", "skateboarding", "londyn", "surfing", "zycie", "transformacja")
    published = $true
    password  = "HAOS77"
}

$json = $postData | ConvertTo-Json -Depth 3

try {
    Write-Host "Updating Karol biography..." -ForegroundColor Green
    Write-Host "Biography length: $($fullBiography.Length) characters" -ForegroundColor Cyan
    
    $response = Invoke-RestMethod -Uri "$workerUrl/api/blog/005" -Method PUT -Body $json -ContentType "application/json"
    
    Write-Host "Success! Biography updated" -ForegroundColor Green
    Write-Host "ID: $($response.id)" -ForegroundColor Cyan
    Write-Host "URL: https://www.mybonzoaiblog.com/blog/karol-zyciorys" -ForegroundColor White
    
}
catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}