# KONFIG_PODPROJEKT - Kompletna Dokumentacja

## 📚 Spis Plików Konfiguracyjnych

### 📖 Dokumentacja

| Plik | Opis | Przeznaczenie |
|------|------|---------------|
| **README.md** | Główna dokumentacja projektu | Start tutaj! Wprowadzenie i architektura |
| **STEP_BY_STEP_GUIDE.md** | Przewodnik krok po kroku | Pełny proces setup i deployment |
| **TERMINAL_COMMANDS.md** | Quick reference komend | Wszystkie komendy PowerShell |
| **TROUBLESHOOTING.md** | Rozwiązywanie problemów | Najczęstsze problemy i fixes |
| **PROJECT_STRUCTURE.md** | Struktura projektu | Organizacja plików i katalogów |
| **INDEX.md** | Ten plik | Spis wszystkich plików |

---

## 🚀 Main App - Główna Aplikacja

```
main-app/
├── astro.config.mjs          # Konfiguracja Astro (base: '/')
├── wrangler.jsonc            # Cloudflare Pages config
├── package.json              # Dependencies + scripts
├── public/
│   └── _headers              # Custom HTTP headers
└── src/
    └── pages/
        └── index.example.astro  # Przykładowa strona główna
```

### Kluczowe Pliki

#### `astro.config.mjs`
```javascript
export default defineConfig({
  adapter: cloudflare(),
  output: 'server',
  site: 'https://example.com',
  // base: '/' - brak base path dla root domain
});
```

**Ważne parametry:**
- `adapter: cloudflare()` - SSR na Cloudflare
- `output: 'server'` - Server-side rendering
- `site` - Zmień na swoją domenę!

#### `wrangler.jsonc`
```json
{
  "name": "mybonzo-main-app",
  "compatibility_date": "2025-10-31",
  "pages_build_output_dir": "./dist"
}
```

**Ważne parametry:**
- `name` - Nazwa projektu w Cloudflare Dashboard
- `compatibility_date` - ZAWSZE aktualizuj do daty deployu
- `pages_build_output_dir` - Output directory (./dist)

#### `package.json` - Scripts
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "wrangler pages dev ./dist",
    "deploy": "npm run build && wrangler pages deploy ./dist --project-name=mybonzo-main-app"
  }
}
```

---

## 📦 Subpage - Podstrona z Base Path

```
subpage/
├── astro.config.mjs          # Konfiguracja z base: '/subpage/'
├── wrangler.jsonc            # Pages config
├── package.json              # Dependencies + scripts
├── public/
│   └── _headers              # Headers dla subpage
└── src/
    └── pages/
        └── index.example.astro  # Przykładowa strona subpage
```

### Kluczowe Różnice vs Main App

#### `astro.config.mjs`
```javascript
export default defineConfig({
  adapter: cloudflare(),
  output: 'server',
  site: 'https://example.com',
  base: '/subpage/',  // ⚠️ KRYTYCZNE! Musi być ustawione
});
```

**Co to zmienia:**
- Wszystkie linki prefixowane `/subpage/`
- Assets URL: `/subpage/_astro/...`
- Routing: `/subpage/about` zamiast `/about`

#### Użycie w kodzie
```astro
---
const basePath = '/subpage';
---

<a href={`${basePath}/about`}>About</a>
<img src={`${basePath}/assets/image.png`} />
```

---

## 🌐 Worker Proxy - Reverse Proxy Routing

```
worker-proxy/
├── index.js          # Główny kod Worker
├── wrangler.jsonc    # Worker config
└── package.json      # Minimal deps
```

### `index.js` - Główny Kod

**Routing Logic:**
```javascript
const MAIN_APP_URL = 'https://mybonzo-main-app.pages.dev';
const SUBPAGE_URL = 'https://mybonzo-subpage.pages.dev';

const ROUTES = [
  {
    prefix: '/subpage/',
    target: SUBPAGE_URL,
    name: 'Subpage'
  },
];
```

**Flow:**
1. Request → `example.com/subpage/about`
2. Worker match: `/subpage/*` → SUBPAGE_URL
3. Proxy → `mybonzo-subpage.pages.dev/subpage/about`
4. Response + Security Headers

**Features:**
- ✅ Automatic routing na podstawie ścieżki
- ✅ Security headers (HSTS, CSP, etc.)
- ✅ CORS handling
- ✅ Error handling z fallback page
- ✅ Health check endpoint: `/_proxy-health`

### `wrangler.jsonc`
```json
{
  "name": "mybonzo-proxy-worker",
  "compatibility_date": "2025-10-31",
  "main": "index.js"
}
```

**Deployment:**
```powershell
npm run deploy
# Worker będzie dostępny na: *.workers.dev
# Custom domain: Dashboard → Settings → Triggers
```

---

## ⚙️ GitHub Actions - CI/CD Workflows

```
.github/
└── workflows/
    ├── deploy-main.yml       # Auto-deploy main app
    ├── deploy-subpage.yml    # Auto-deploy subpage
    ├── deploy-proxy.yml      # Auto-deploy worker
    └── deploy-all.yml        # Deploy wszystkiego (manual)
```

### Triggery

| Workflow | Trigger | Path Filter |
|----------|---------|-------------|
| `deploy-main.yml` | Push to main | `main-app/**` |
| `deploy-subpage.yml` | Push to main | `subpage/**` |
| `deploy-proxy.yml` | Push to main | `worker-proxy/**` |
| `deploy-all.yml` | Manual / Tag | Wszystko |

### Required GitHub Secrets

```
Repository Settings → Secrets → Actions:

1. CLOUDFLARE_API_TOKEN
   - Permissions: Workers:Edit, Pages:Edit
   - Get from: https://dash.cloudflare.com/profile/api-tokens

2. CLOUDFLARE_ACCOUNT_ID
   - Get from: Dashboard → Workers & Pages → Overview
```

### Workflow Structure

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Node.js (v18)
      - Install dependencies (npm ci)
      - Run checks (npm run check)
      - Build (npm run build)
      - Deploy to Cloudflare (wrangler-action@v3)
```

---

## 🔧 Inne Pliki

### `.gitignore`
Chroni przed commitowaniem:
- `node_modules/` - Dependencies
- `dist/` - Build output
- `.dev.vars` - Local secrets
- `.wrangler/` - Cloudflare cache
- `.env*` - Environment variables

### `public/_headers` (Main App & Subpage)

**Security Headers:**
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Strict-Transport-Security: max-age=31536000
```

**Cache Headers:**
```
/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/api/*
  Cache-Control: no-store, no-cache, must-revalidate
```

---

## 📋 Quick Start Checklist

### Lokalne Setup

- [ ] 1. Zainstaluj Node.js 18+
- [ ] 2. Zainstaluj Wrangler: `npm install -g wrangler`
- [ ] 3. Login do Cloudflare: `wrangler login`
- [ ] 4. Skopiuj pliki konfiguracyjne do swojego repo
- [ ] 5. Dostosuj URL-e w `worker-proxy/index.js`
- [ ] 6. Zmień `site` w `astro.config.mjs` na swoją domenę

### Deploy Projects

- [ ] 7. Deploy Main App: `cd main-app && npm run deploy`
- [ ] 8. Deploy Subpage: `cd subpage && npm run deploy`
- [ ] 9. Zapisz URL-e Pages deploymentów
- [ ] 10. Update `MAIN_APP_URL` i `SUBPAGE_URL` w Worker
- [ ] 11. Deploy Worker: `cd worker-proxy && npm run deploy`

### Konfiguracja Domain

- [ ] 12. Dashboard → Workers → mybonzo-proxy-worker → Settings → Triggers
- [ ] 13. Add Custom Domain: `example.com`
- [ ] 14. Wait for SSL provisioning (2-5 min)
- [ ] 15. Test: `curl https://example.com/_proxy-health`

### GitHub Actions

- [ ] 16. Dodaj secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
- [ ] 17. Skopiuj workflows: `cp -r .github/workflows ...`
- [ ] 18. Push to GitHub: `git push origin main`
- [ ] 19. Sprawdź Actions: GitHub → Actions → Verify runs

---

## 🎯 Najważniejsze Komendy

### Development
```powershell
# Main App
cd main-app && npm run dev          # localhost:4321

# Subpage
cd subpage && npm run dev           # localhost:4322

# Worker
cd worker-proxy && npm run dev      # localhost:8787
```

### Build & Deploy
```powershell
# Main App
cd main-app && npm run deploy

# Subpage
cd subpage && npm run deploy

# Worker
cd worker-proxy && npm run deploy
```

### Monitoring
```powershell
# Worker logs
wrangler tail mybonzo-proxy-worker

# Pages deployments
wrangler pages deployments list --project-name=mybonzo-main-app
```

### Testing
```powershell
# Test routing
curl -I https://example.com/
curl -I https://example.com/subpage/

# Health check
curl https://example.com/_proxy-health
```

---

## 📊 Kompatybilność

| Component | Version | Date |
|-----------|---------|------|
| Astro | v5.0.0+ | 2025-10-31 |
| @astrojs/cloudflare | v12.0.0+ | 2025-10-31 |
| Wrangler | v3.80.0+ | 2025-10-31 |
| Node.js | v18+ | - |
| Cloudflare Compatibility Date | 2025-10-31 | ⚠️ Aktualizuj! |

---

## 🔗 Linki do Dokumentacji

### Cloudflare
- [Workers Docs](https://developers.cloudflare.com/workers/)
- [Pages Docs](https://developers.cloudflare.com/pages/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

### Astro
- [Astro Docs](https://docs.astro.build)
- [Cloudflare Adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [Deploy Guide](https://docs.astro.build/en/guides/deploy/cloudflare/)

### GitHub
- [Actions Docs](https://docs.github.com/en/actions)
- [Wrangler Action](https://github.com/cloudflare/wrangler-action)

---

## 🆘 Pomoc

### Problemy?
Zobacz: **TROUBLESHOOTING.md**

### Komendy?
Zobacz: **TERMINAL_COMMANDS.md**

### Setup?
Zobacz: **STEP_BY_STEP_GUIDE.md**

### Community
- Cloudflare: https://community.cloudflare.com/
- Astro Discord: https://astro.build/chat

---

## 📝 Notatki

### Bezpieczeństwo
- ⚠️ **NIGDY** nie commituj `.dev.vars`, API tokens, secrets
- ✅ Używaj GitHub Secrets dla CI/CD
- ✅ Używaj `wrangler secret put` dla produkcji
- ✅ Regularnie rotuj API tokens

### Performance
- ✅ Cloudflare Edge = ultra low latency
- ✅ Automatic HTTP/2, HTTP/3, Brotli compression
- ✅ Smart routing & caching
- ✅ Worker CPU time < 10ms typowo

### Cost
- Free tier: 100k Workers requests/day
- Pages: Unlimited (free)
- Dla większości projektów: **$0-5/miesiąc**

---

**Utworzono**: 2025-10-31  
**Compatibility Date**: 2025-10-31  
**Wersja**: 1.0.0  
**Autor**: MyBonzo Team  
**Licencja**: MIT
