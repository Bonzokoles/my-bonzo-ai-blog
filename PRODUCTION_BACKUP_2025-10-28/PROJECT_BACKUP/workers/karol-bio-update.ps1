Write-Host "Karol Biography Update Script" -ForegroundColor Green

# Worker URL
$url = "https://mybonzo-blog-worker.stolarnia-ams.workers.dev/api/blog/005"

# Read the biography file content
$bioFile = "Q:\mybonzo\mybonzoAIblog\public\Od najwczesniejszych wspomnien.md"
Write-Host "Reading biography file..." -ForegroundColor Yellow

try {
    $content = [System.IO.File]::ReadAllText("Q:\mybonzo\mybonzoAIblog\public\Od najwcześniejszych wspomnień.md", [System.Text.Encoding]::UTF8)
    
    Write-Host "File read successfully. Length: $($content.Length)" -ForegroundColor Green
    
    # Prepare data
    $data = @{
        title     = "Karol Zyciorys - Historia jednego zycia"
        content   = $content
        tags      = @("autobiografia", "skateboarding", "londyn", "surfing", "zycie")
        published = $true
        password  = "HAOS77"
    }
    
    $json = ConvertTo-Json $data -Depth 3
    
    Write-Host "Sending update to worker..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri $url -Method PUT -Body $json -ContentType "application/json"
    
    Write-Host "SUCCESS! Biography updated" -ForegroundColor Green
    Write-Host "URL: https://www.mybonzoaiblog.com/blog/karol-zyciorys" -ForegroundColor Cyan
    
}
catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}