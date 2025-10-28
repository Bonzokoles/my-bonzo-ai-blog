Write-Host "🚀 Starting blog migration to R2..." -ForegroundColor Green

$WorkerURL = "https://mybonzo-blog-worker.stolarnia-ams.workers.dev"
$BlogDir = "../src/data/blog"

function Parse-Frontmatter {
    param($Content)
    
    if ($Content -match "(?ms)^---\s*\n(.*?)\n---\s*\n(.*)$") {
        $frontmatter = $Matches[1]
        $body = $Matches[2]
        
        $metadata = @{}
        $frontmatter -split "\n" | ForEach-Object {
            if ($_ -match "^([^:]+):(.*)$") {
                $key = $Matches[1].Trim()
                $value = $Matches[2].Trim() -replace '^["'']|["'']$', ''
                $metadata[$key] = $value
            }
        }
        
        return @{
            title   = if ($metadata.title) { $metadata.title } else { "Untitled Post" }
            excerpt = if ($metadata.excerpt) { $metadata.excerpt } elseif ($metadata.description) { $metadata.description } else { "" }
            date    = if ($metadata.date) { $metadata.date } else { Get-Date -Format "yyyy-MM-dd" }
            content = $body.Trim()
        }
    }
    
    return @{
        title   = "Untitled Post"
        excerpt = ""
        date    = Get-Date -Format "yyyy-MM-dd"  
        content = $Content
    }
}

function Upload-BlogPost {
    param($PostData)
    
    $boundary = [System.Guid]::NewGuid().ToString()
    $bodyLines = @()
    
    # Title
    $bodyLines += "--$boundary"
    $bodyLines += 'Content-Disposition: form-data; name="title"'
    $bodyLines += ""
    $bodyLines += $PostData.title
    
    # Content (clean up MDX)
    $content = $PostData.content
    $content = $content -replace "import\s+.*", ""  # Remove imports
    $content = $content -replace "<([A-Z][A-Za-z0-9]*)[^>]*>(.*?)</\1>", '$2'  # Remove JSX components
    $content = $content.Trim()
    
    $bodyLines += "--$boundary"
    $bodyLines += 'Content-Disposition: form-data; name="content"'
    $bodyLines += ""
    $bodyLines += $content
    
    # Excerpt
    $bodyLines += "--$boundary"
    $bodyLines += 'Content-Disposition: form-data; name="excerpt"'
    $bodyLines += ""
    $bodyLines += $PostData.excerpt
    
    $bodyLines += "--$boundary--"
    
    $body = $bodyLines -join "`r`n"
    
    try {
        $response = Invoke-RestMethod -Uri "$WorkerURL/api/blog/upload" `
            -Method POST `
            -Body $body `
            -ContentType "multipart/form-data; boundary=$boundary"
        
        return $response
    }
    catch {
        Write-Error "Failed to upload post: $($_.Exception.Message)"
        return $null
    }
}

# Get all MDX files
$mdxFiles = Get-ChildItem -Path $BlogDir -Filter "*.mdx" | Sort-Object Name

Write-Host "📁 Found $($mdxFiles.Count) blog posts to migrate" -ForegroundColor Cyan

foreach ($file in $mdxFiles) {
    Write-Host "📝 Processing: $($file.Name)" -ForegroundColor Yellow
    
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $postData = Parse-Frontmatter $content
    
    Write-Host "   Title: $($postData.title)" -ForegroundColor Gray
    Write-Host "   Date: $($postData.date)" -ForegroundColor Gray
    
    $result = Upload-BlogPost $postData
    
    if ($result -and $result.success) {
        Write-Host "✅ Uploaded: $($file.Name) -> $($result.postId).md" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Failed to upload $($file.Name)" -ForegroundColor Red
    }
    
    Start-Sleep -Milliseconds 1000  # Rate limiting
}

# Refresh index
Write-Host "🔄 Refreshing blog index..." -ForegroundColor Cyan
try {
    $indexResponse = Invoke-RestMethod -Uri "$WorkerURL/api/blog/refresh" -Method GET
    Write-Host "✅ Index refreshed: $($indexResponse.posts.Count) posts indexed" -ForegroundColor Green
    
    Write-Host "`n📊 Migration Summary:" -ForegroundColor Cyan
    $indexResponse.posts | ForEach-Object {
        Write-Host "   - $($_.id): $($_.title)" -ForegroundColor Gray
    }
}
catch {
    Write-Host "❌ Failed to refresh index: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n✅ Migration completed!" -ForegroundColor Green
Write-Host "🌐 Blog API available at: $WorkerURL" -ForegroundColor Cyan