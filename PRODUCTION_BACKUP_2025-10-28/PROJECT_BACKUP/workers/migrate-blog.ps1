# Blog Migration Script for PowerShell
# Migrates blog posts from MDX files to Cloudflare R2 via Worker API

$WorkerURL = "https://mybonzo-blog-worker.stolarnia-ams.workers.dev"
$BlogDir = "../src/data/blog"
$ImagesDir = "../src/data/blog/images"

function Parse-Frontmatter {
    param($Content)
    
    if ($Content -match "^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$") {
        $frontmatter = $Matches[1]
        $body = $Matches[2]
        
        $metadata = @{}
        $frontmatter -split "\n" | ForEach-Object {
            if ($_ -match "^([^:]+):(.*)$") {
                $key = $Matches[1].Trim()
                $value = $Matches[2].Trim() -replace '^[""'']|[""'']$', ''
                $metadata[$key] = $value
            }
        }
        
        return @{
            title   = $metadata.title -or "Untitled Post"
            excerpt = $metadata.excerpt -or $metadata.description -or ""
            date    = $metadata.date -or (Get-Date -Format "yyyy-MM-dd")
            content = $body
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
    param($FilePath, $PostData)
    
    $boundary = [System.Guid]::NewGuid().ToString()
    $bodyLines = @()
    
    # Title
    $bodyLines += "--$boundary"
    $bodyLines += 'Content-Disposition: form-data; name="title"'
    $bodyLines += ""
    $bodyLines += $PostData.title
    
    # Excerpt
    $bodyLines += "--$boundary"
    $bodyLines += 'Content-Disposition: form-data; name="excerpt"'
    $bodyLines += ""
    $bodyLines += $PostData.excerpt
    
    # Content
    $bodyLines += "--$boundary"
    $bodyLines += 'Content-Disposition: form-data; name="content"'
    $bodyLines += ""
    $bodyLines += $PostData.content
    
    # Date
    $bodyLines += "--$boundary"
    $bodyLines += 'Content-Disposition: form-data; name="date"'
    $bodyLines += ""
    $bodyLines += $PostData.date
    
    $bodyLines += "--$boundary--"
    
    $body = $bodyLines -join "`r`n"
    
    try {
        $response = Invoke-RestMethod -Uri "$WorkerURL/api/blog/upload" `
            -Method POST `
            -Body $body `
            -ContentType "multipart/form-data; boundary=$boundary" `
            -Headers @{
            "Access-Control-Allow-Origin" = "*"
        }
        
        return $response
    }
    catch {
        Write-Error "Failed to upload post: $($_.Exception.Message)"
        return $null
    }
}

# Main migration process
Write-Host "🚀 Starting blog migration to R2..." -ForegroundColor Green

# Get all MDX files
$mdxFiles = Get-ChildItem -Path $BlogDir -Filter "*.mdx" | Sort-Object Name

Write-Host "📁 Found $($mdxFiles.Count) blog posts to migrate" -ForegroundColor Cyan

$postCounter = 1

foreach ($file in $mdxFiles) {
    Write-Host "📝 Processing: $($file.Name)" -ForegroundColor Yellow
    
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $postData = Parse-Frontmatter $content
    
    # Convert MDX to Markdown
    $postData.content = $postData.content -replace 'import\s+.*', ''
    $postData.content = $postData.content -replace '<([A-Z][A-Za-z0-9]*)[^>]*>(.*?)</\1>', '$2'
    
    $result = Upload-BlogPost $file.FullName $postData
    
    if ($result -and $result.success) {
        Write-Host "✅ Uploaded: $($file.Name) -> $($result.postId).md" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Failed to upload $($file.Name)" -ForegroundColor Red
    }
    
    $postCounter++
    Start-Sleep -Milliseconds 500  # Rate limiting
}

# Refresh index
Write-Host "🔄 Refreshing blog index..." -ForegroundColor Cyan
try {
    $indexResponse = Invoke-RestMethod -Uri "$WorkerURL/api/blog/refresh" -Method GET
    Write-Host "✅ Index refreshed: $($indexResponse.posts.Count) posts indexed" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to refresh index: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "✅ Migration completed!" -ForegroundColor Green