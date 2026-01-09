$categories = @(
    "Biurka/Biurka gamingowe",
    "Biurka/Biurka narożne",
    "Biurka/Biurka proste",
    "Biurka/Biurka z regulacją wysokości",
    "Biurka/Biurka z szufladami i drzwiami",
    "Biurka/Części do biurek",
    "Dodatki do mebli/Akcesoria ",
    "Dodatki do mebli/Części do mebli",
    "Dodatki do mebli/Oświetlenie LED",
    "Fotele/Fotele bujane",
    "Fotele/Fotele do biurka",
    "Fotele/Fotele kubełkowe",
    "Fotele/Fotele młodzieżowe",
    "Fotele/Fotele ogrodowe",
    "Fotele/Fotele rozkładane",
    "Fotele/Fotele wypoczynkowe",
    "Hokery",
    "Komody/Komody z drzwiami",
    "Komody/Komody z szufladami",
    "Komody/Komody z szufladami i drzwiami",
    "Kontenerki",
    "Krzesła/Krzesła biurowe",
    "Krzesła/Krzesła do jadalni",
    "Krzesła/Krzesła na płozie",
    "Krzesła/Krzesła ogrodowe",
    "Lustra",
    "Materace/Materace piankowe",
    "Materace/Materace sprężynowe kieszeniowe",
    "Meblościanki",
    "Pozostałe produkty",
    "Pufy",
    "Półki wiszące",
    "Regały",
    "Sofy i narożniki/Narożniki",
    "Sofy i narożniki/Sofy 2-osobowe",
    "Sofy i narożniki/Sofy 3-osobowe",
    "Sofy i narożniki/Sofy ogrodowe",
    "Stelaże",
    "Stoliki kawowe i ławy/Stoliki kawowe",
    "Stoliki kawowe i ławy/Stoliki pomocnicze",
    "Stoliki kawowe i ławy/Ławostoły",
    "Stoliki kawowe i ławy/Ławy",
    "Stoly/Stoły nierozkładane",
    "Stoly/Stoły ogrodowe",
    "Stoly/Stoły rozkładane",
    "Szafki",
    "Szafki RTV",
    "Szafki kuchenne",
    "Szafki modułowe",
    "Szafki na buty",
    "Szafki nocne",
    "Szafy/Nadstawki na szafę",
    "Szafy/Szafy uchylne",
    "Szezlongi",
    "Toaletki i konsole/Konsole ",
    "Toaletki i konsole/Toaletki",
    "Wieszaki na ubrania/Wieszaki stojące",
    "Wieszaki na ubrania/Wieszaki ścienne",
    "Witryny i kredensy/Kredensy",
    "Witryny i kredensy/Witryny",
    "Zestawy mebli/Zestawy mebli do jadalni",
    "Zestawy mebli/Zestawy mebli kuchennych",
    "halmar tymczasowa",
    "Ławki do przedpokoju",
    "Łóżka dziecięce",
    "Łóżka i części/Części do łóżek",
    "Łóżka i części/Stelaże do łóżek",
    "Łóżka i części/Łóżka"
)

$API_BASE = "https://mybonzoaiblog.pages.dev"
$OUTPUT_DIR = "./src/pages/pumo-guide"
$success = 0
$failed = 0

Write-Host "Regenerating $($categories.Count) guides with UTM tracking...`n" -ForegroundColor Cyan

foreach ($category in $categories) {
    try {
        Write-Host " $category..." -NoNewline
        
        $url = "$API_BASE/api/generate-guides?category=" + [System.Web.HttpUtility]::UrlEncode($category)
        $response = Invoke-RestMethod -Uri $url -Method Post -Headers @{
            "Content-Type" = "application/json"
            "Origin" = $API_BASE
        } -UseBasicParsing -TimeoutSec 60
        
        if ($response.success) {
            $slug = $category.ToLower() -replace '[^a-z0-9\s\-]', '' -replace '[\s\-_]+', '_'
            $filename = "$slug.md"
            
            # API returns path but not full content - we need to fetch the generated guide
            Write-Host " OK ($($response.data.tracked_products_count) products)" -ForegroundColor Green
            $success++
        } else {
            Write-Host " WARNING: API returned success:false" -ForegroundColor Yellow
            $failed++
        }
        
        Start-Sleep -Milliseconds 500
        
    } catch {
        Write-Host " ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $failed++
    }
}

Write-Host "`nRegeneration summary:" -ForegroundColor Cyan
Write-Host "Success: $success" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red

if ($success -gt 0) {
    Write-Host "`nNOTE: Guides generated to KV cache, but .md files not written." -ForegroundColor Yellow
    Write-Host "The API generates guides dynamically. Static .md files require different approach." -ForegroundColor Yellow
}
