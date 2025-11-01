# Struktura Katalogu KONFIG_PODPROJEKT

```
KONFIG_PODPROJEKT/
│
├── README.md                          # Główna dokumentacja projektu
├── STEP_BY_STEP_GUIDE.md              # Przewodnik krok po kroku
├── TERMINAL_COMMANDS.md               # Quick reference komend
├── TROUBLESHOOTING.md                 # Ten plik - rozwiązywanie problemów
│
├── main-app/                          # Główna aplikacja Astro
│   ├── astro.config.mjs              # Konfiguracja Astro (base: '/')
│   ├── wrangler.jsonc                # Cloudflare Pages config
│   ├── package.json                  # Dependencies + scripts
│   └── public/
│       └── _headers                  # Custom HTTP headers
│
├── subpage/                           # Podstrona z base path
│   ├── astro.config.mjs              # Konfiguracja (base: '/subpage/')
│   ├── wrangler.jsonc                # Pages config
│   ├── package.json                  # Dependencies + scripts
│   └── public/
│       └── _headers                  # Custom headers
│
├── worker-proxy/                      # Cloudflare Worker - Reverse Proxy
│   ├── index.js                      # Główny kod Workera
│   ├── wrangler.jsonc                # Worker config
│   └── package.json                  # Minimal deps (tylko wrangler)
│
└── .github/
    └── workflows/                     # GitHub Actions CI/CD
        ├── deploy-main.yml           # Auto-deploy main app
        ├── deploy-subpage.yml        # Auto-deploy subpage
        ├── deploy-proxy.yml          # Auto-deploy worker
        └── deploy-all.yml            # Deploy wszystkiego (manual)
```

## Pliki Konfiguracyjne - Quick Reference

### astro.config.mjs

**Main App**: `base: '/'` (brak prefiksu)  
**Subpage**: `base: '/subpage/'` (KRYTYCZNE!)

```javascript
export default defineConfig({
  adapter: cloudflare(),
  output: 'server',
  site: 'https://example.com',
  base: '/subpage/',  // Tylko dla podstron!
});
```

### wrangler.jsonc

**Pages (main-app/subpage)**:
```json
{
  "name": "mybonzo-main-app",
  "compatibility_date": "2025-10-31",
  "pages_build_output_dir": "./dist"
}
```

**Worker (proxy)**:
```json
{
  "name": "mybonzo-proxy-worker",
  "compatibility_date": "2025-10-31",
  "main": "index.js"
}
```

### package.json Scripts

**Main App / Subpage**:
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "wrangler pages dev ./dist",
    "deploy": "npm run build && wrangler pages deploy ./dist --project-name=..."
  }
}
```

**Worker**:
```json
{
  "scripts": {
    "dev": "wrangler dev index.js",
    "deploy": "wrangler deploy index.js",
    "tail": "wrangler tail"
  }
}
```

## Routing Flow

```
User Request: https://example.com/subpage/about
                        ↓
        Cloudflare Edge (DNS/SSL)
                        ↓
        Worker: mybonzo-proxy-worker
                        ↓
        Match route: /subpage/* → SUBPAGE_URL
                        ↓
        Proxy to: mybonzo-subpage.pages.dev/subpage/about
                        ↓
        Astro renders page (base path aware)
                        ↓
        Response + Security Headers
                        ↓
        User receives HTML
```

## Environment Variables

### Development (.dev.vars)

**NIE COMMITUJ!**

```env
# main-app/.dev.vars
ENVIRONMENT=development
LOG_LEVEL=debug
```

### Production (Wrangler Secrets)

```powershell
wrangler secret put MY_SECRET
# Wpisz wartość w prompt
```

### GitHub Actions (Repository Secrets)

- `CLOUDFLARE_API_TOKEN` - API token z pełnymi uprawnieniami
- `CLOUDFLARE_ACCOUNT_ID` - Account ID z Dashboard

## URLs i Endpoints

### Development (lokalnie)

- Main App: http://localhost:4321
- Subpage: http://localhost:4322
- Worker Proxy: http://localhost:8787
- Health check: http://localhost:8787/_proxy-health

### Production (przez proxy)

- Main App: https://example.com
- Subpage: https://example.com/subpage/
- Health: https://example.com/_proxy-health

### Direct URLs (Pages deployments)

- Main: https://mybonzo-main-app.pages.dev
- Subpage: https://mybonzo-subpage.pages.dev

## Custom Headers

Headery dodawane przez Worker Proxy:

- `X-Proxy-Route` - Nazwa route (Main App / Subpage)
- `X-Proxy-Target` - Target hostname Pages deployment
- `X-Forwarded-Host` - Oryginalna domena (example.com)
- `X-Forwarded-Proto` - Protokół (https)
- `X-Real-IP` - IP użytkownika

Security headers (wszystkie responses):

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=31536000`

## Ważne Zależności

### Main App / Subpage

```json
{
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/cloudflare": "^12.0.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.0",
    "typescript": "^5.6.0",
    "wrangler": "^3.80.0"
  }
}
```

### Worker Proxy

```json
{
  "devDependencies": {
    "wrangler": "^3.80.0"
  }
}
```

## Compatibility Flags

Użyte flagi kompatybilności Cloudflare:

### Pages (main-app/subpage)
- `nodejs_compat` - Node.js runtime APIs
- `disable_nodejs_process_v2` - Nowa wersja process
- `global_fetch_strictly_public` - Strict fetch security

### Worker (proxy)
- `nodejs_compat` - Node.js APIs (jeśli potrzebne)
- `global_fetch_strictly_public` - Security

## Monitoring Endpoints

### Cloudflare Dashboard

- Workers Analytics: https://dash.cloudflare.com → Workers & Pages → mybonzo-proxy-worker → Analytics
- Pages Analytics: https://dash.cloudflare.com → Workers & Pages → mybonzo-main-app → Analytics
- Logs: wrangler tail mybonzo-proxy-worker

### Health Checks

```powershell
# Worker health
curl https://example.com/_proxy-health

# Expected response:
{
  "status": "ok",
  "timestamp": "2025-10-31T12:00:00.000Z",
  "routes": [
    {"prefix": "/subpage/", "name": "Subpage"}
  ]
}
```

## Cache Strategy

### Static Assets (_astro/*, assets/*)

- Cache-Control: `public, max-age=31536000, immutable`
- CDN cache: Cloudflare automatic
- Browser cache: 1 year

### HTML Pages

- Cache-Control: `public, max-age=3600, must-revalidate`
- CDN cache: 1 hour
- Browser cache: 1 hour

### API Endpoints

- Cache-Control: `no-store, no-cache, must-revalidate`
- Brak cachowania

## Security Considerations

### ✅ Zrobione

- Security headers w Worker
- HTTPS everywhere (Cloudflare SSL)
- API token nie w kodzie (GitHub Secrets)
- .dev.vars w .gitignore
- Minimal permissions dla tokenów

### ⚠️ Do rozważenia

- Rate limiting (Cloudflare Rate Limiting Rules)
- WAF (Web Application Firewall)
- Bot protection
- DDoS mitigation (Cloudflare automatic)
- Content Security Policy fine-tuning

## Performance Metrics

### Expected Performance

- **Worker CPU time**: < 10ms per request
- **Pages build time**: 30-90 seconds
- **TTFB (Time to First Byte)**: < 100ms (global edge)
- **LCP (Largest Contentful Paint)**: < 2.5s
- **CLS (Cumulative Layout Shift)**: < 0.1

### Monitoring

```powershell
# Worker metrics
wrangler tail mybonzo-proxy-worker

# Pages build time
# Dashboard → mybonzo-main-app → Deployments → Zobacz build duration
```

## Cloudflare Limits (Free Tier)

- **Workers**: 100k requests/day
- **Pages**: Unlimited bandwidth
- **Pages Builds**: 500 builds/month
- **KV**: 100k reads/day, 1k writes/day
- **R2**: 10 GB storage

## Git Workflow

### Branch Strategy

```
main (production)
├── develop (staging)
├── feature/new-component
└── hotfix/critical-bug
```

### Deployment Branches

- `main` → Production deployment (auto via GH Actions)
- `develop` → Preview deployment
- `feature/*` → Preview deployment (URL: feature-name.mybonzo-main-app.pages.dev)

## Dodatkowe Resources

### Oficjalna Dokumentacja

- [Astro Docs](https://docs.astro.build)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

### Community

- Astro Discord: https://astro.build/chat
- Cloudflare Community: https://community.cloudflare.com/
- GitHub Discussions: https://github.com/withastro/astro/discussions

---

**Ostatnia aktualizacja**: 2025-10-31  
**Wersja**: 1.0.0
