1. Utwórz folder projektu
Struktura katalogów powinna wyglądać tak:

text
eksperymenty\NAZWA_PROJEKTU\
    main-app\
    subpage\
    worker-proxy\
2. Skopiuj pliki konfiguracyjne z katalogu KONFIG_PODPROJEKT
Do każdego podfolderu (main-app, subpage, worker-proxy) skopiuj odpowiedni szablon:

astro.config.mjs, package.json, wrangler.toml/jsonc, public/_headers, src/pages/index.astro (dla app i subpage)

index.js, package.json, wrangler.toml/jsonc (dla worker-proxy)

Dokumentację: README.md lub INSTRUKCJA.md

3. Ustawienia konfiguracyjne
Edytuj nazwę projektu, route, zone_id i account_id w plikach wrangler.toml.

W astro.config.mjs w subpage ustaw base: "/subpage/".

4. Instalacja zależności (każdy podprojekt osobno)
bash
npm install
5. Build i deploy (każdy podprojekt osobno)
bash
npm run build
npm run deploy
albo (jeśli skrypt deploy = wrangler publish):

bash
npx wrangler publish
6. Routing
Worker-proxy rozdziela ruch na domenie na podstawie ścieżki /subpage/* do podstrony, a resztę do main-app.

Skonfiguruj domenę w Cloudflare tak, by requests przechodziły przez Workera.

7. Automatyzacja — GitHub Actions
Skopiuj i ustaw workflow z .github/workflows jeśli korzystasz z GitHub.

8. Checklist & troubleshooting
Sprawdź ścieżki w base, route i adresach proxy (index.js w worker-proxy).

Po zmianach w worker-proxy nie zapomnij ponownie go zdeployować.

Więcej porad/typowych błędów znajdziesz w plikach TROUBLESHOOTING.md i STEP_BY_STEP_GUIDE.md.

9. Dodawanie nowych podstron/eksperymentów
Powielaj ten szablon — zawsze trzy foldery, spójne nazwy, komplet plików konfiguracyjnych.

Wskazówki:

Pracuj zawsze na osobnych gałęziach repozytorium dla każdego eksperymentu.

Aktualizuj instrukcje na bieżąco według własnego doświadczenia (dla siebie i współpracowników).

Dokumentację i troubleshooting trzymaj zawsze w głównym folderze projektu.