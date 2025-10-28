# Karol Biography Update
$workerUrl = "https://mybonzo-blog-worker.stolarnia-ams.workers.dev"

try {
    # Read biography file
    $biographyPath = "Q:\mybonzo\mybonzoAIblog\public\Od najwcześniejszych wspomnień.md"
    $fullBio = Get-Content $biographyPath -Raw -Encoding UTF8
    
    Write-Host "Biography loaded: $($fullBio.Length) chars" -ForegroundColor Green
    
    # Create update data
    $updateData = @{
        title     = "Karol Zyciorys - Historia jednego zycia"
        content   = $fullBio
        tags      = @("autobiografia", "skateboarding", "londyn", "surfing")
        published = $true
        password  = "HAOS77"
    }
    
    # Convert to JSON
    $jsonData = $updateData | ConvertTo-Json -Depth 3
    
    # Make API call
    Write-Host "Sending update request..." -ForegroundColor Yellow
    $result = Invoke-RestMethod -Uri "$workerUrl/api/blog/005" -Method PUT -Body $jsonData -ContentType "application/json"
    
    Write-Host "SUCCESS! Biography updated" -ForegroundColor Green
    Write-Host "Check: https://www.mybonzoaiblog.com/blog/karol-zyciorys" -ForegroundColor Cyan
    
}
catch {
    Write-Host "ERROR occurred" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}