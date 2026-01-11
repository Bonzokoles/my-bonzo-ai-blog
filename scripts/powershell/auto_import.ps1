# PowerShell import script
# Auto import z proper error handling

Write-Host "🚀 Starting PowerShell import..." -ForegroundColor Green

$batchDir = "d1_import_batches"
if (!(Test-Path $batchDir)) {
    Write-Host "❌ Directory $batchDir not found" -ForegroundColor Red
    exit 1
}

$sqlFiles = Get-ChildItem -Path $batchDir -Filter "batch_*.sql" | Sort-Object Name
Write-Host "📦 Found $($sqlFiles.Count) batch files" -ForegroundColor Yellow

$successCount = 0
$errorCount = 0

for ($i = 0; $i -lt $sqlFiles.Count; $i++) {
    $file = $sqlFiles[$i]
    $progress = $i + 1
    
    Write-Host "📝 Importing $($file.Name) ($progress/$($sqlFiles.Count))..." -ForegroundColor Cyan
    
    try {
        # Use full path to wrangler
        $result = & npx --yes wrangler d1 execute jimbo-rag-db --remote --file="$($file.FullName)" --yes 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $($file.Name) imported successfully" -ForegroundColor Green
            $successCount++
        }
        else {
            Write-Host "❌ $($file.Name) failed: $result" -ForegroundColor Red
            $errorCount++
        }
    }
    catch {
        Write-Host "💥 $($file.Name) error: $($_.Exception.Message)" -ForegroundColor Red
        $errorCount++
    }
    
    # Small delay
    Start-Sleep -Milliseconds 500
}

Write-Host "`n📊 Final Summary:" -ForegroundColor Yellow
Write-Host "✅ Success: $successCount" -ForegroundColor Green
Write-Host "❌ Errors: $errorCount" -ForegroundColor Red
Write-Host "📦 Total products: $($successCount * 10)" -ForegroundColor Cyan
Write-Host "🎯 Test at: http://localhost:4322/whitecat" -ForegroundColor Magenta