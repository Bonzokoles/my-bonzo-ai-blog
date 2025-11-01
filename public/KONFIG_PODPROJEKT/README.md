# Konfiguracja Monorepo z Cloudflare Workers Proxy

## Architektura

Ten setup pozwala na:
- **Oddzielne deploymentty**: Główna aplikacja i podstrony jako niezależne projekty Cloudflare Pages
- **Unified routing**: Cloudflare Worker jako reverse proxy na głównej domenie
- **Automatyzacja CI/CD**: GitHub Actions dla każdego projektu
- **Izolacja projektów**: Każdy projekt może używać różnych technologii

## Struktura Repozytorium

```
mybonzo-monorepo/
├── main-app/              # Główna aplikacja Astro
│   ├── astro.config.mjs
│   ├── wrangler.jsonc
│   ├── package.json
│   └── src/
├── subpage/               # Podstrona Astro z base /subpage/
│   ├── astro.config.mjs
│   ├── wrangler.jsonc
│   ├── package.json
│   └── src/
├── worker-proxy/          # Cloudflare Worker Proxy
│   ├── index.js
│   └── wrangler.jsonc
└── .github/
    └── workflows/
        ├── deploy-main.yml
        ├── deploy-subpage.yml
        └── deploy-proxy.yml
```

## Routing

- `example.com/*` → Główna aplikacja (main-app)
- `example.com/subpage/*` → Podstrona (subpage)
- Worker proxy decyduje na podstawie path

## Bezpieczeństwo

✅ **Compatibility date**: 2025-10-31
✅ **Node.js compatibility**: `nodejs_compat` flag
✅ **Secrets management**: Wrangler secrets + GitHub Secrets
✅ **Minimal permissions**: Każdy deployment ma własne tokeny
✅ **CORS handling**: Proxy Worker zarządza headerami

## Quick Start

### 1. Zbuduj wszystkie projekty lokalnie:
```bash
# Main app
cd main-app
npm install
npm run build

# Subpage
cd ../subpage
npm install
npm run build

# Proxy worker
cd ../worker-proxy
npm install
```

### 2. Preview lokalnie:
```bash
# Main app (port 4321)
cd main-app
npm run preview

# Subpage (port 4322)
cd subpage
npm run preview

# Proxy worker (port 8787)
cd worker-proxy
npm run dev
```

### 3. Deploy do Cloudflare:
```bash
# Main app
cd main-app
npm run deploy

# Subpage
cd subpage
npm run deploy

# Proxy worker
cd worker-proxy
npm run deploy
```

## GitHub Actions Setup

### Wymagane Secrets w GitHub:

1. **CLOUDFLARE_API_TOKEN**: Token API z Cloudflare Dashboard
   - Permissions: Workers:Edit, Account Settings:Read, Cloudflare Pages:Edit
   - Utwórz w: https://dash.cloudflare.com/profile/api-tokens

2. **CLOUDFLARE_ACCOUNT_ID**: ID konta Cloudflare
   - Znajdź w: https://dash.cloudflare.com → Workers & Pages → Overview

### Dodanie Secrets do GitHub:

```
Repository Settings → Secrets and variables → Actions → New repository secret
```

## Konfiguracja Domeny w Cloudflare

### Krok 1: Deploy projektów jako Pages
```bash
cd main-app && npm run deploy
cd ../subpage && npm run deploy
```

Po deployu otrzymasz URL-e typu:
- `main-app-xyz.pages.dev`
- `subpage-xyz.pages.dev`

### Krok 2: Skonfiguruj Worker Proxy

W `worker-proxy/index.js` ustaw zmienne:
```javascript
const MAIN_APP_URL = 'https://main-app-xyz.pages.dev';
const SUBPAGE_URL = 'https://subpage-xyz.pages.dev';
```

### Krok 3: Deploy Worker
```bash
cd worker-proxy
npm run deploy
```

### Krok 4: Przypisz Custom Domain

W Cloudflare Dashboard:
1. Workers & Pages → worker-proxy → Settings → Triggers
2. Custom Domains → Add Custom Domain
3. Dodaj swoją domenę (np. `example.com`)

## Kompatybilność

- **Astro**: v5.x
- **Cloudflare Adapter**: @astrojs/cloudflare@latest
- **Wrangler**: v3.x
- **Node.js**: v18+ (lokalnie)
- **Compatibility Date**: 2025-10-31

## Najlepsze Praktyki

### 1. Environment Variables
- Nigdy nie commituj `.dev.vars`
- Używaj `wrangler secret put` dla produkcyjnych sekretów
- W CI/CD używaj GitHub Secrets

### 2. Caching
- Main app i subpage: długi TTL dla assetów (1 rok)
- Worker proxy: nie cachuje (zawsze fresh routing)

### 3. Error Handling
- Worker proxy zwraca fallback 500 page przy błędach
- Każdy projekt ma własny error handling

### 4. Monitoring
- Enable observability w wrangler.jsonc
- Użyj Cloudflare Analytics do śledzenia requestów
- Loguj błędy w Worker do Logpush/Tail

## Troubleshooting

### Problem: 404 na /subpage/*
**Rozwiązanie**: Sprawdź czy `base: '/subpage/'` jest ustawione w `subpage/astro.config.mjs`

### Problem: CORS errors
**Rozwiązanie**: Worker proxy automatycznie przepisuje CORS headers. Sprawdź `handleCORS()` w `index.js`

### Problem: Build fails w GitHub Actions
**Rozwiązanie**: 
1. Sprawdź czy CLOUDFLARE_API_TOKEN ma odpowiednie permissions
2. Verify CLOUDFLARE_ACCOUNT_ID jest poprawny

### Problem: Stare assety po deploy
**Rozwiązanie**: Cloudflare Pages automatycznie invaliduje cache. Poczekaj 5-10 minut.

## Rozszerzanie o Nowe Podstrony

### 1. Utwórz nową podstronę:
```bash
mkdir project-2
cd project-2
npm create astro@latest .
```

### 2. Skonfiguruj `astro.config.mjs`:
```javascript
export default defineConfig({
  base: '/project-2/',
  adapter: cloudflare()
});
```

### 3. Dodaj routing w Worker Proxy:
```javascript
if (url.pathname.startsWith('/project-2/')) {
  return proxyRequest(request, 'https://project-2-xyz.pages.dev');
}
```

### 4. Utwórz nowy workflow w `.github/workflows/deploy-project-2.yml`

## Linki

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Astro Cloudflare Adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

---

**Data utworzenia**: 2025-10-31
**Compatibility Date**: 2025-10-31
**Wersja**: 1.0.0
