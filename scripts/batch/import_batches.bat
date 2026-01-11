@echo off
REM Batch import script for D1 - Windows
REM Importuje kolejne partie produktów

echo 🚀 Starting D1 batch import...
echo.

set /a counter=1
set /a success=0
set /a errors=0

for %%f in (d1_import_batches\batch_*.sql) do (
    echo 📝 Importing %%f [!counter!/256]...
    
    npx wrangler d1 execute jimbo-rag-db --remote --file=%%f
    
    if !ERRORLEVEL! equ 0 (
        echo ✅ Success
        set /a success+=1
    ) else (
        echo ❌ Error importing %%f
        set /a errors+=1
    )
    
    set /a counter+=1
    
    REM Small delay between batches
    timeout /t 1 /nobreak >nul
    
    echo.
)

echo.
echo 📊 Import Summary:
echo ✅ Success: %success%
echo ❌ Errors: %errors%
echo 📦 Total: 256 batches
echo.
echo 🎯 Test at: http://localhost:4322/whitecat