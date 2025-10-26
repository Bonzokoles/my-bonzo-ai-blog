Write-Host "Starting blog migration to R2..." -ForegroundColor Green

$WorkerURL = "https://mybonzo-blog-worker.stolarnia-ams.workers.dev"
$BlogDir = "../src/data/blog"

function ParseFrontmatter($Content) {
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
            content = $body.Trim()
        }
    }
    
    return @{
        title   = "Untitled Post"
        excerpt = ""
        content = $Content
    }
}

function UploadBlogPost($PostData) {
    $boundary = [System.Guid]::NewGuid().ToString()
    $bodyLines = @()
    
    $bodyLines += "--$boundary"
    $bodyLines += 'Content-Disposition: form-data; name="title"'
    $bodyLines += ""
    $bodyLines += $PostData.title
    
    $content = $PostData.content -replace "import\s+.*", "" -replace "<([A-Z][A-Za-z0-9]*)[^>]*>(.*?)</\1>", '$2'
    $content = $content.Trim()
    
    $bodyLines += "--$boundary"
    $bodyLines += 'Content-Disposition: form-data; name="content"'
    $bodyLines += ""
    $bodyLines += $content
    
    $bodyLines += "--$boundary"
    $bodyLines += 'Content-Disposition: form-data; name="excerpt"'
    $bodyLines += ""
    $bodyLines += $PostData.excerpt
    
    $bodyLines += "--$boundary--"
    
    $body = $bodyLines -join "`r`n"
    
    try {
        $response = Invoke-RestMethod -Uri "$WorkerURL/api/blog/upload" -Method POST -Body $body -ContentType "multipart/form-data; boundary=$boundary"
        return $response
    }
    catch {
        Write-Error "Failed to upload: $($_.Exception.Message)"
        return $null
    }
}

# Main execution
$mdxFiles = Get-ChildItem -Path $BlogDir -Filter "*.mdx" | Sort-Object Name
Write-Host "Found $($mdxFiles.Count) blog posts to migrate" -ForegroundColor Cyan

foreach ($file in $mdxFiles) {
    Write-Host "Processing: $($file.Name)" -ForegroundColor Yellow
    
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $postData = ParseFrontmatter $content
    
    Write-Host "  Title: $($postData.title)" -ForegroundColor Gray
    
    $result = UploadBlogPost $postData
    
    if ($result -and $result.success) {
        Write-Host "  Uploaded as: $($result.postId).md" -ForegroundColor Green
    }
    else {
        Write-Host "  Failed to upload" -ForegroundColor Red
    }
    
    Start-Sleep -Milliseconds 1000
}

Write-Host "Refreshing blog index..." -ForegroundColor Cyan
try {
    $indexResponse = Invoke-RestMethod -Uri "$WorkerURL/api/blog/refresh" -Method GET
    Write-Host "Index refreshed: $($indexResponse.posts.Count) posts indexed" -ForegroundColor Green
    
    Write-Host "Migration Summary:" -ForegroundColor Cyan
    $indexResponse.posts | ForEach-Object {
        Write-Host "  - $($_.id): $($_.title)" -ForegroundColor Gray
    }
}
catch {
    Write-Host "Failed to refresh index: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Migration completed!" -ForegroundColor Green