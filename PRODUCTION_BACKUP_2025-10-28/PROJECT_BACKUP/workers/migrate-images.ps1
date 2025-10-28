Write-Host "Starting image migration to R2..." -ForegroundColor Green

$WorkerURL = "https://mybonzo-blog-worker.stolarnia-ams.workers.dev"
$ImagesDir = "../src/data/blog/images"

function Upload-ImageToR2 {
    param(
        $FilePath,
        $PostId,
        $ImageName
    )
    
    try {
        # Read image file as bytes
        $imageBytes = [System.IO.File]::ReadAllBytes($FilePath)
        $fileName = [System.IO.Path]::GetFileName($FilePath)
        $mimeType = switch ([System.IO.Path]::GetExtension($fileName).ToLower()) {
            ".jpg" { "image/jpeg" }
            ".jpeg" { "image/jpeg" } 
            ".png" { "image/png" }
            ".webp" { "image/webp" }
            ".gif" { "image/gif" }
            default { "image/jpeg" }
        }
        
        # Create multipart form data
        $boundary = [System.Guid]::NewGuid().ToString()
        $bodyLines = @()
        
        # PostId
        $bodyLines += "--$boundary"
        $bodyLines += 'Content-Disposition: form-data; name="postId"'
        $bodyLines += ""
        $bodyLines += $PostId
        
        # Image name
        $bodyLines += "--$boundary"
        $bodyLines += 'Content-Disposition: form-data; name="imageName"'
        $bodyLines += ""
        $bodyLines += $ImageName
        
        # Image file
        $bodyLines += "--$boundary"
        $bodyLines += "Content-Disposition: form-data; name=`"image`"; filename=`"$fileName`""
        $bodyLines += "Content-Type: $mimeType"
        $bodyLines += ""
        
        # Convert to proper encoding
        $textPart = $bodyLines -join "`r`n"
        $textBytes = [System.Text.Encoding]::UTF8.GetBytes($textPart + "`r`n")
        $endBoundary = [System.Text.Encoding]::UTF8.GetBytes("`r`n--$boundary--`r`n")
        
        # Combine all parts
        $totalBytes = New-Object byte[] ($textBytes.Length + $imageBytes.Length + $endBoundary.Length)
        [Array]::Copy($textBytes, 0, $totalBytes, 0, $textBytes.Length)
        [Array]::Copy($imageBytes, 0, $totalBytes, $textBytes.Length, $imageBytes.Length)
        [Array]::Copy($endBoundary, 0, $totalBytes, $textBytes.Length + $imageBytes.Length, $endBoundary.Length)
        
        $response = Invoke-RestMethod -Uri "$WorkerURL/api/blog/upload-image" `
            -Method POST `
            -Body $totalBytes `
            -ContentType "multipart/form-data; boundary=$boundary"
        
        return $response
    }
    catch {
        Write-Error "Failed to upload image: $($_.Exception.Message)"
        return $null
    }
}

# Check if images directory exists
if (-not (Test-Path $ImagesDir)) {
    Write-Host "Images directory not found: $ImagesDir" -ForegroundColor Red
    exit 1
}

# Get all image files
$imageFiles = Get-ChildItem -Path $ImagesDir -File | Where-Object { 
    $_.Extension -match '\.(jpg|jpeg|png|webp|gif)$' 
}

if ($imageFiles.Count -eq 0) {
    Write-Host "No image files found in $ImagesDir" -ForegroundColor Yellow
    exit 0
}

Write-Host "Found $($imageFiles.Count) images to migrate" -ForegroundColor Cyan

# Image mapping for different posts
$imageMapping = @{
    "alk-cover-2.webp" = @{ postId = "004"; name = "004-1.webp" }  # Alkaline Design
    "alk4.png"         = @{ postId = "004"; name = "004-2.png" }
    "logo.webp"        = @{ postId = "006"; name = "006-1.webp" }  # MyBonzo Pro
    "og-image.png"     = @{ postId = "002"; name = "002-1.png" }  # AI Tools
}

foreach ($file in $imageFiles) {
    Write-Host "Processing: $($file.Name)" -ForegroundColor Yellow
    
    if ($imageMapping.ContainsKey($file.Name)) {
        $mapping = $imageMapping[$file.Name]
        $postId = $mapping.postId
        $imageName = $mapping.name
        
        Write-Host "  Mapping to post $postId as $imageName" -ForegroundColor Gray
        
        $result = Upload-ImageToR2 $file.FullName $postId $imageName
        
        if ($result -and $result.success) {
            Write-Host "  Uploaded: $($result.imageName) -> $($result.imageUrl)" -ForegroundColor Green
        }
        else {
            Write-Host "  Failed to upload $($file.Name)" -ForegroundColor Red
        }
    }
    else {
        Write-Host "  No mapping found for $($file.Name), skipping..." -ForegroundColor Gray
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host "Image migration completed!" -ForegroundColor Green

# Test image access
Write-Host "Testing image access..." -ForegroundColor Cyan
try {
    $testUrl = "$WorkerURL/blog/images/004-1.webp"
    $response = Invoke-WebRequest -Uri $testUrl -Method HEAD -ErrorAction Stop
    Write-Host "Image access test successful! Status: $($response.StatusCode)" -ForegroundColor Green
}
catch {
    Write-Host "Image access test failed: $($_.Exception.Message)" -ForegroundColor Red
}