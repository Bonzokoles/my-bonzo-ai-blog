@echo off
echo ================================================
echo   WYMUSZANIE INDEKSACJI MEBLE PUMO - SITEMAP
echo ================================================
echo.
echo Pingowanie wyszukiwarek...
echo.

REM Ping wyszukiwarek
curl -X POST https://mybonzoaiblog.pages.dev/api/ping-search-engines
echo.
echo.

REM IndexNow - wyślij wszystkie URL z sitemap
echo Wysyłanie do IndexNow (Bing/Yandex)...
curl -X POST https://mybonzoaiblog.pages.dev/api/index-now ^
  -H "Content-Type: application/json" ^
  -d "{\"urls\":[\"/pumo-guide/\",\"/pumo-guide/agent\",\"/pumo-guide/Biurka_Biurka_gamingowe\",\"/pumo-guide/Fotele_Fotele_do_biurka\",\"/pumo-guide/Sofy_i_narożniki_Sofy_3_osobowe\"]}"

echo.
echo.
echo ================================================
echo   INDEKSACJA WYSŁANA!
echo ================================================
echo.
echo Status:
echo - Bing: Ping sitemap + IndexNow
echo - Google: Ping sitemap
echo - ChatGPT: Sitemap + JSON-LD ready
echo - Yandex: IndexNow submitted
echo.
echo Sprawdź wyniki w:
echo - Bing Webmaster: https://www.bing.com/webmasters
echo - Google Search Console: https://search.google.com/search-console
echo.
pause
