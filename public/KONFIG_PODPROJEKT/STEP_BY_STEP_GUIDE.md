# Step-by-Step Deployment Guide

## Przygotowanie Przed Deploymentem

### 1. Wymagania

- ✅ Konto Cloudflare (darmowe lub płatne)
- ✅ Node.js 18+ zainstalowane lokalnie
- ✅ npm/pnpm/yarn
- ✅ Wrangler CLI: `npm install -g wrangler`
- ✅ Git repository (GitHub)
- ✅ Domena dodana do Cloudflare DNS (jeśli używasz custom domain)

### 2. Cloudflare API Token

#### Utwórz API Token w Dashboard:

1. Zaloguj się do https://dash.cloudflare.com
2. Przejdź do: **Profile** → **API Tokens** → **Create Token**
3. Wybierz template: **Edit Cloudflare Workers**
4. Lub utwórz custom token z permissions:
   - Account → Workers Scripts → Edit
   - Account → Account Settings → Read
   - Account → Cloudflare Pages → Edit
5. Zapisz token - **NIGDY NIE COMMITUJ DO GIT!**

#### Account ID:

1. Dashboard → Workers & Pages → Overview
2. Skopiuj "Account ID" z prawej strony

---

## Krok 1: Lokalny Setup i Test

### A. Main App

```powershell
# Przejdź do katalogu main-app
cd main-app

# Zainstaluj dependencies
npm install

# Utwórz plik .dev.vars (local secrets)
# UWAGA: Dodaj .dev.vars do .gitignore!
echo "ENVIRONMENT=development" > .dev.vars

# Test build lokalnie
npm run build

# Test preview z Wrangler
npm run preview

# Otwórz: http://localhost:4321
```

### B. Subpage

```powershell
cd ../subpage

npm install

echo "ENVIRONMENT=development" > .dev.vars
echo "BASE_PATH=/subpage/" >> .dev.vars

npm run build
npm run preview

# Otwórz: http://localhost:4322
# Wszystkie URL będą z prefiksem /subpage/
```

### C. Worker Proxy

```powershell
cd ../worker-proxy

npm install

# Edytuj index.js - ustaw URL-e Pages (wkrótce otrzymasz po deploy)
# const MAIN_APP_URL = 'https://mybonzo-main-app.pages.dev';
# const SUBPAGE_URL = 'https://mybonzo-subpage.pages.dev';

# Test lokalnie
npm run dev

# Otwórz: http://localhost:8787
# Test health: http://localhost:8787/_proxy-health
```

---

## Krok 2: Deploy do Cloudflare (Lokalnie)

### Autentykacja Wrangler

```powershell
# Logowanie do Cloudflare
wrangler login

# Lub użyj API token (jeśli login nie działa)
$env:CLOUDFLARE_API_TOKEN = "twój-api-token"
$env:CLOUDFLARE_ACCOUNT_ID = "twój-account-id"
```

### Deploy Main App

```powershell
cd main-app

# Build
npm run build

# Deploy do Cloudflare Pages
wrangler pages deploy ./dist --project-name=mybonzo-main-app

# Output: 🔗 URL: https://mybonzo-main-app.pages.dev
# ZAPISZ TEN URL!
```

### Deploy Subpage

```powershell
cd ../subpage

npm run build

wrangler pages deploy ./dist --project-name=mybonzo-subpage

# Output: 🔗 URL: https://mybonzo-subpage.pages.dev
# ZAPISZ TEN URL!
```

### Deploy Worker Proxy

```powershell
cd ../worker-proxy

# WAŻNE: Edytuj index.js - wstaw URL-e z poprzednich deploymentów
# const MAIN_APP_URL = 'https://mybonzo-main-app.pages.dev';
# const SUBPAGE_URL = 'https://mybonzo-subpage.pages.dev';

# Deploy Worker
wrangler deploy index.js

# Output: 🔗 Published mybonzo-proxy-worker
#         https://mybonzo-proxy-worker.your-subdomain.workers.dev
```

---

## Krok 3: Konfiguracja Custom Domain

### Opcja A: Worker Custom Domain (Zalecana)

1. Dashboard → **Workers & Pages** → **mybonzo-proxy-worker**
2. Kliknij **Settings** → **Triggers** → **Custom Domains**
3. Kliknij **Add Custom Domain**
4. Wpisz: `example.com` (lub `www.example.com`)
5. Cloudflare automatycznie skonfiguruje DNS
6. Poczekaj 2-5 minut na propagację SSL

### Opcja B: Worker Route (Jeśli masz Cloudflare DNS)

1. Dashboard → **Websites** → wybierz swoją domenę
2. **Workers Routes** → **Add Route**
3. Route: `example.com/*`
4. Worker: `mybonzo-proxy-worker`
5. Zapisz

### Test Custom Domain

```powershell
# Test routing
curl -I https://example.com
# Sprawdź header: X-Proxy-Route: Main App

curl -I https://example.com/subpage/
# Sprawdź header: X-Proxy-Route: Subpage: /subpage/

# Health check
curl https://example.com/_proxy-health
# Powinien zwrócić JSON z status: "ok"
```

---

## Krok 4: GitHub Actions CI/CD

### A. Dodaj Secrets do GitHub

1. GitHub → Twoje repo → **Settings** → **Secrets and variables** → **Actions**
2. Kliknij **New repository secret**
3. Dodaj dwa secrets:

**CLOUDFLARE_API_TOKEN**
```
twój-cloudflare-api-token-tutaj
```

**CLOUDFLARE_ACCOUNT_ID**
```
twój-cloudflare-account-id-tutaj
```

### B. Skopiuj Workflow Files

```powershell
# Skopiuj pliki workflow do swojego repo
cp -r KONFIG_PODPROJEKT/.github .

# Commit i push
git add .github/workflows/
git commit -m "Add CI/CD workflows for Cloudflare deployment"
git push origin main
```

### C. Test Automatycznego Deployu

```powershell
# Zmień coś w main-app
echo "<!-- test -->" >> main-app/src/pages/index.astro

git add .
git commit -m "test: trigger main app deployment"
git push

# Sprawdź: GitHub → Actions → "Deploy Main App"
# Workflow powinien się uruchomić automatycznie
```

---

## Krok 5: Weryfikacja Deployment

### Checklist

- [ ] **Main App działa**: https://example.com → Main App content
- [ ] **Subpage działa**: https://example.com/subpage/ → Subpage content
- [ ] **Routing poprawny**: Worker proxy kieruje requesty prawidłowo
- [ ] **SSL działa**: Certyfikat ważny, HTTPS
- [ ] **Assets loadują się**: Sprawdź Console w DevTools
- [ ] **Base path OK**: Linki w subpage używają /subpage/ prefix
- [ ] **Headers OK**: X-Proxy-Route header obecny
- [ ] **GitHub Actions działa**: Push triggertuje deploy

### Debugowanie

#### Problem: 404 na /subpage/*

```powershell
# Sprawdź base path w subpage/astro.config.mjs
# Powinno być: base: '/subpage/'

# Rebuild i redeploy
cd subpage
npm run deploy
```

#### Problem: Worker proxy nie działa

```powershell
# Check worker logs
wrangler tail mybonzo-proxy-worker

# Test health endpoint
curl https://example.com/_proxy-health

# Sprawdź URL-e w worker-proxy/index.js
# MAIN_APP_URL i SUBPAGE_URL muszą być poprawne
```

#### Problem: Assets nie loadują się (404)

```powershell
# Sprawdź w DevTools → Network
# Jeśli assets mają błędny path:
# - Sprawdź base path w astro.config.mjs
# - Zweryfikuj czy proxy przepisuje URL poprawnie
```

#### Problem: CORS errors

```powershell
# Worker automatycznie obsługuje CORS
# Sprawdź headers w Response:
curl -H "Origin: https://example.com" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     https://example.com/api/test

# Powinny być headery:
# Access-Control-Allow-Origin: https://example.com
# Access-Control-Allow-Methods: GET, POST, ...
```

---

## Krok 6: Monitoring i Maintenance

### Cloudflare Analytics

1. Dashboard → **Workers & Pages** → **mybonzo-proxy-worker**
2. Tab **Analytics** → Zobacz metryki:
   - Requests per second
   - Errors
   - Duration
   - CPU time

### Worker Logs (Real-time)

```powershell
# Live tail logs
wrangler tail mybonzo-proxy-worker

# Filtruj tylko errors
wrangler tail mybonzo-proxy-worker --status error

# Połącz z grep (PowerShell)
wrangler tail mybonzo-proxy-worker | Select-String "ERROR"
```

### Pages Analytics

1. Dashboard → **Workers & Pages** → **mybonzo-main-app**
2. Tab **Analytics** → Zobacz:
   - Page views
   - Bandwidth
   - Requests
   - Build time

### Alerty (Opcjonalnie)

1. Dashboard → **Notifications**
2. **Create** → **Workers** → **Worker exceeds error rate**
3. Ustaw threshold (np. 5% error rate)
4. Dodaj email/webhook do powiadomień

---

## Krok 7: Dodanie Nowego Podprojektu

### Przykład: Dodanie /projekt-2/

```powershell
# 1. Utwórz nowy folder
mkdir projekt-2
cd projekt-2

# 2. Inicjalizuj Astro project
npm create astro@latest .

# 3. Edytuj astro.config.mjs
# base: '/projekt-2/'
# adapter: cloudflare()

# 4. Skopiuj wrangler.jsonc z subpage/
cp ../subpage/wrangler.jsonc .
# Zmień name na: mybonzo-projekt-2

# 5. Skopiuj package.json scripts
# Dostosuj project name

# 6. Deploy
npm run build
wrangler pages deploy ./dist --project-name=mybonzo-projekt-2

# 7. Dodaj do Worker Proxy routing
# Edytuj: worker-proxy/index.js
# W tablicy ROUTES dodaj:
{
  prefix: '/projekt-2/',
  target: 'https://mybonzo-projekt-2.pages.dev',
  name: 'Projekt 2'
}

# 8. Redeploy Worker
cd ../worker-proxy
wrangler deploy index.js

# 9. Test
curl https://example.com/projekt-2/

# 10. Dodaj GitHub workflow (opcjonalnie)
cp .github/workflows/deploy-subpage.yml .github/workflows/deploy-projekt-2.yml
# Zmień paths i WORKING_DIRECTORY
```

---

## Best Practices

### Bezpieczeństwo

- ✅ **NIGDY** nie commituj `.dev.vars`, API tokens, secrets
- ✅ Używaj `wrangler secret put` dla production secrets
- ✅ GitHub Secrets dla CI/CD
- ✅ Regularnie rotuj API tokens (co 3-6 miesięcy)
- ✅ Użyj minimal permissions dla tokenów

### Performance

- ✅ Enable caching dla static assets
- ✅ Użyj Cloudflare Images dla optymalizacji obrazów
- ✅ Minifikuj assets w produkcji
- ✅ Enable HTTP/3 w Cloudflare
- ✅ Użyj CDN caching headers

### Development

- ✅ Test lokalnie przed deployem
- ✅ Używaj branches dla features (deploy preview)
- ✅ Semantic versioning dla releases
- ✅ Dokumentuj zmiany w CHANGELOG.md
- ✅ Code review przed merge do main

### Monitoring

- ✅ Sprawdzaj Analytics regularnie
- ✅ Ustaw alerty dla error rate > 5%
- ✅ Monitor CPU time - opt. jeśli > 30ms
- ✅ Track build times - powinny być < 60s
- ✅ Loguj ważne eventy w Worker

---

## Troubleshooting Commands

```powershell
# Lista wszystkich deploymentów
wrangler pages deployments list --project-name=mybonzo-main-app

# Rollback do poprzedniej wersji
wrangler pages deployments rollback <deployment-id> --project-name=mybonzo-main-app

# Delete deployment
wrangler pages deployments delete <deployment-id> --project-name=mybonzo-main-app

# Worker info
wrangler worker info mybonzo-proxy-worker

# KV namespace list (jeśli używasz)
wrangler kv:namespace list

# Clear KV cache
wrangler kv:key bulk delete --namespace-id=<id>

# Check wrangler version
wrangler --version

# Update wrangler
npm update -g wrangler
```

---

## FAQ

**Q: Czy mogę używać różnych frameworków dla podstron?**  
A: Tak! Każdy projekt może używać innego framework (Next.js, SvelteKit, etc.) dopóki działa na Cloudflare.

**Q: Ile kosztuje hosting?**  
A: Cloudflare Workers Free tier: 100k requests/day. Pages: unlimited. W praktyce dla małych/średnich projektów: $0-5/miesiąc.

**Q: Czy mogę używać bazy danych?**  
A: Tak! Cloudflare D1 (SQL), KV (key-value), R2 (object storage), Durable Objects.

**Q: Jak długo trwa deployment?**  
A: Pages build: 30-90s. Worker deploy: 5-10s. Propagacja DNS: 2-5 minut.

**Q: Czy mogę używać environment variables?**  
A: Tak! W wrangler.jsonc: `vars`, lub przez: `wrangler secret put KEY`

---

## Linki Pomocnicze

- 📚 [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- 📚 [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- 📚 [Astro Cloudflare Guide](https://docs.astro.build/en/guides/deploy/cloudflare/)
- 📚 [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
- 💬 [Cloudflare Community](https://community.cloudflare.com/)
- 💬 [Astro Discord](https://astro.build/chat)

---

**Data utworzenia**: 2025-10-31  
**Ostatnia aktualizacja**: 2025-10-31  
**Wersja**: 1.0.0
