# Update Karol's Biography with Full Version
# This script replaces the shortened biography with the complete version

$workerUrl = "https://mybonzo-blog-worker.stolarnia-ams.workers.dev"

# Read the full biography
$fullBiography = Get-Content "Q:\mybonzo\mybonzoAIblog\public\Od najwcześniejszych wspomnień.md" -Raw -Encoding UTF8

# Prepare the full blog post
$updatedPost = @{
    title     = "Karol Życiorys - Historia jednego życia"
    content   = $fullBiography
    tags      = @("autobiografia", "skateboarding", "londyn", "surfing", "życie", "transformacja")
    published = $true
    password  = "HAOS77"
} | ConvertTo-Json -Depth 3

try {
    Write-Host "Aktualizowanie biografii Karola..." -ForegroundColor Green
    Write-Host "Długość pełnej biografii: $($fullBiography.Length) znaków" -ForegroundColor Cyan
    
    # Update post with ID 005 (Karol's biography)
    $response = Invoke-RestMethod -Uri "$workerUrl/api/blog/005" -Method PUT -Body $updatedPost -ContentType "application/json"
    
    Write-Host "✅ Biografia zaktualizowana pomyślnie!" -ForegroundColor Green
    Write-Host "ID: $($response.id)" -ForegroundColor Cyan
    Write-Host "URL: https://www.mybonzoaiblog.com/blog/$($response.id)" -ForegroundColor Cyan
    
    Write-Host "`n📖 Pełna biografia Karola jest teraz dostępna na stronie!" -ForegroundColor Yellow
    Write-Host "Sprawdź: https://www.mybonzoaiblog.com/blog/karol-zyciorys" -ForegroundColor White
    
}
catch {
    Write-Host "❌ Błąd podczas aktualizacji: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorContent = $reader.ReadToEnd()
        Write-Host "Szczegóły błędu: $errorContent" -ForegroundColor Red
    }
}