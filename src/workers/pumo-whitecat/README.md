# PUMO Whitecat Worker (Deploy-ready)

Ten folder zawiera niezależnego Cloudflare Workera (API + dashboard).

## Lokalne uruchomienie

W tym folderze:

- `npm ci`
- `npx wrangler dev --port 8787`

Dashboard:

- `http://127.0.0.1:8787/`

## Konfiguracja (bez sekretów w repo)

### Vars (jawne, w `wrangler.toml` / `.dev.vars`)

- `PUMO_API_BASE_URL` (np. `https://api.meblepumo.pl/v1`)
- `ALLOWED_ORIGINS`
- `DASHBOARD_API_BASE` (opcjonalnie; domyślny base URL do requestów dashboardu)
- `GA4_PROPERTY_ID` (dla GA4 Data API odczytu raportów)

### Secrets (tylko Cloudflare / GitHub secrets → Wrangler)

Ustaw przez `wrangler secret put <NAME>`:

- `PUMO_API_KEY`
- `GA4_SERVICE_ACCOUNT_JSON`
- (opcjonalnie) `GA4_MEASUREMENT_ID`, `GA4_API_SECRET` (Measurement Protocol – wysyłka eventów)

## GitHub Actions deploy

Repo ma workflow:

- `.github/workflows/deploy-pumo-whitecat-worker.yml`

W GitHub ustaw:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Deploy wykona się na `push` do `main` dla zmian w `src/workers/pumo-whitecat/**`.

## Domeny

Domyślnie Worker dostaje adres `*.workers.dev` (zależny od nazwy workera z `wrangler.toml`).
Custom domain (`www.jimbolikepumo.dev`) podpina się w Cloudflare: Workers & Pages → Worker → Triggers → Custom Domains.
