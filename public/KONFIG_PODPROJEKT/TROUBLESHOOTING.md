# Troubleshooting Guide - Rozwiązywanie Problemów

## 🔴 Problem: 404 na podstronie (/subpage/*)

### Symptom
```
https://example.com/subpage/ → 404 Not Found
```

### Możliwe Przyczyny

#### 1. Błędny base path w astro.config.mjs

**Diagnoza**:
```powershell
cd subpage
cat astro.config.mjs | Select-String "base"
```

**Fix**:
```javascript
// subpage/astro.config.mjs
export default defineConfig({
  base: '/subpage/',  // MUSI być z trailing slash!
  // ...
});
```

**Deploy po zmianie**:
```powershell
cd subpage
npm run deploy
```

#### 2. Worker proxy nie kieruje do subpage

**Diagnoza**:
```powershell
curl -I https://example.com/subpage/
# Sprawdź header: X-Proxy-Route
```

**Fix w worker-proxy/index.js**:
```javascript
const ROUTES = [
  {
    prefix: '/subpage/',  // MUSI być dokładnie tak!
    target: SUBPAGE_URL,
    name: 'Subpage'
  },
];
```

**Redeploy worker**:
```powershell
cd worker-proxy
npm run deploy
```

#### 3. Subpage deployment nie istnieje

**Diagnoza**:
```powershell
wrangler pages deployments list --project-name=mybonzo-subpage
```

**Fix**:
```powershell
cd subpage
npm run deploy
```

---

## 🔴 Problem: Assets nie loadują się (404 na CSS/JS)

### Symptom
```
https://example.com/subpage/about
✅ HTML loaduje się
❌ CSS/JS 404: /_astro/style.xxx.css
```

### Przyczyna
Assets mają błędny path - brak base path prefix.

### Fix

#### 1. Sprawdź base path w config
```javascript
// subpage/astro.config.mjs
export default defineConfig({
  base: '/subpage/',  // KRYTYCZNE!
  // ...
});
```

#### 2. Rebuild projekt
```powershell
cd subpage
Remove-Item -Recurse dist
npm run build
```

#### 3. Sprawdź outputted HTML
```powershell
cat dist/index.html | Select-String "href"
# Powinno być: href="/subpage/_astro/..."
# NIE: href="/_astro/..."
```

#### 4. Redeploy
```powershell
npm run deploy
```

### Weryfikacja
```powershell
# Otwórz DevTools → Network
# Wszystkie assets powinny mieć status 200
# URLs: https://example.com/subpage/_astro/...
```

---

## 🔴 Problem: Worker proxy nie działa

### Symptom
```
https://example.com → 522 Connection timed out
```

### Diagnoza

#### 1. Sprawdź czy Worker jest deployed
```powershell
wrangler worker info mybonzo-proxy-worker
```

Jeśli error → Worker nie istnieje:
```powershell
cd worker-proxy
npm run deploy
```

#### 2. Sprawdź routing
```powershell
# Test health endpoint
curl https://example.com/_proxy-health
```

Jeśli 404 → Custom domain nie skonfigurowana:
- Dashboard → Workers & Pages → mybonzo-proxy-worker → Settings → Triggers → Add Custom Domain

#### 3. Sprawdź logi Worker
```powershell
wrangler tail mybonzo-proxy-worker
# Wykonaj request w przeglądarce
# Sprawdź logi - powinny pokazać routing
```

### Fix: URL-e Pages w Worker

```javascript
// worker-proxy/index.js
const MAIN_APP_URL = 'https://mybonzo-main-app.pages.dev';  // ZMIEŃ!
const SUBPAGE_URL = 'https://mybonzo-subpage.pages.dev';    // ZMIEŃ!
```

**Znajdź poprawne URL-e**:
```powershell
wrangler pages deployments list --project-name=mybonzo-main-app
# Skopiuj URL deployment
```

**Redeploy Worker**:
```powershell
cd worker-proxy
npm run deploy
```

---

## 🔴 Problem: CORS Errors

### Symptom
```
Access to fetch at 'https://example.com/api/...' has been blocked by CORS policy
```

### Fix w Worker Proxy

Worker automatycznie obsługuje CORS. Sprawdź `handleCORS()` w index.js:

```javascript
// worker-proxy/index.js - już zaimplementowane
if (request.method === 'OPTIONS') {
  modifiedResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  modifiedResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  modifiedResponse.headers.set('Access-Control-Max-Age', '86400');
}
```

### Jeśli dalej nie działa

#### 1. Sprawdź origin
```powershell
curl -H "Origin: https://example.com" \
     -X OPTIONS \
     https://example.com/api/test \
     -I
```

#### 2. Dodaj custom header w Pages (_headers)
```
# main-app/public/_headers
/api/*
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, POST, OPTIONS
  Access-Control-Allow-Headers: Content-Type
```

#### 3. Redeploy
```powershell
cd main-app
npm run deploy
```

---

## 🔴 Problem: GitHub Actions Failed

### Symptom
```
GitHub Actions → Deploy Main App → ❌ Failed
```

### Diagnoza

#### 1. Sprawdź logs w GitHub
```
GitHub → Actions → Deploy Main App → Zobacz details
```

#### 2. Najczęstsze errory

**Error: Invalid API token**
```
Fix: GitHub Secrets → CLOUDFLARE_API_TOKEN → Verify token
```

**Error: Account ID not found**
```
Fix: GitHub Secrets → CLOUDFLARE_ACCOUNT_ID → Verify ID
```

**Error: Project not found**
```
Fix: Utwórz projekt w Cloudflare:
wrangler pages project create mybonzo-main-app
```

**Error: Build failed (TypeScript errors)**
```
Fix lokalnie:
cd main-app
npm run check
# Napraw błędy
git commit && git push
```

### Test lokalnie przed push

```powershell
# Symuluj GitHub Actions lokalnie
cd main-app
npm ci                    # Tak jak w CI
npm run check             # TypeScript check
npm run build             # Build
wrangler pages deploy ./dist --project-name=mybonzo-main-app
```

---

## 🔴 Problem: Slow Build Times

### Symptom
```
GitHub Actions build time > 5 minut
```

### Optimizations

#### 1. Enable dependency caching (już w workflow)
```yaml
# .github/workflows/deploy-main.yml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'  # ✅ Już dodane
```

#### 2. Incremental builds (Astro 5.x)
```javascript
// astro.config.mjs
export default defineConfig({
  experimental: {
    contentCollectionCache: true,
  },
});
```

#### 3. Parallel builds (jeśli multiple projects)
```yaml
# .github/workflows/deploy-all.yml
jobs:
  deploy-main:
    # ...
  deploy-subpage:
    # ...  (runs w parallel z deploy-main)
```

---

## 🔴 Problem: Stary content po deploy

### Symptom
```
Deploy successful, ale strona pokazuje stary content
```

### Przyczyna: Cache

#### 1. Cloudflare CDN Cache

**Fix**:
```powershell
# Purge cache w Dashboard:
# Caching → Configuration → Purge Everything
```

Lub via API:
```powershell
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

#### 2. Browser Cache

**Fix**:
```
Ctrl+Shift+R (hard refresh)
Lub: DevTools → Network → Disable cache
```

#### 3. Pages Deployment Cache

```powershell
# Force fresh deployment
cd main-app
npm run build
wrangler pages deploy ./dist --project-name=mybonzo-main-app --branch=production-$(date +%s)
```

---

## 🔴 Problem: Worker CPU Time Exceeded

### Symptom
```
Worker Error: CPU time limit exceeded
```

### Diagnoza
```powershell
wrangler tail mybonzo-proxy-worker
# Zobacz: CPU time per request
```

### Fix

#### 1. Optimize proxy logic
```javascript
// worker-proxy/index.js
// BEFORE: Multiple fetches
const response1 = await fetch(url1);
const response2 = await fetch(url2);

// AFTER: Parallel fetches
const [response1, response2] = await Promise.all([
  fetch(url1),
  fetch(url2)
]);
```

#### 2. Remove unnecessary processing
```javascript
// UNIKAJ: Heavy regex w każdym request
// UŻYWAJ: Simple string operations
```

#### 3. Enable caching (opcjonalnie)
```javascript
// Cache dla static assets
if (url.pathname.startsWith('/_astro/')) {
  const cache = caches.default;
  const cachedResponse = await cache.match(request);
  if (cachedResponse) return cachedResponse;
  
  const response = await fetch(request);
  ctx.waitUntil(cache.put(request, response.clone()));
  return response;
}
```

---

## 🔴 Problem: Environment Variables nie działają

### Symptom
```javascript
const secret = env.MY_SECRET;  // → undefined
```

### Fix

#### Development (.dev.vars)
```powershell
# Utwórz .dev.vars
echo "MY_SECRET=test-value" > .dev.vars

# Test
wrangler dev index.js
# env.MY_SECRET powinno być dostępne
```

#### Production (Wrangler Secrets)
```powershell
# Dodaj secret
wrangler secret put MY_SECRET
# Wpisz wartość

# Verify (tylko nazwa, nie wartość)
wrangler secret list
```

#### GitHub Actions
```
GitHub → Settings → Secrets → Actions → New secret
Name: MY_SECRET
Value: production-value
```

Użycie w workflow:
```yaml
- name: Deploy
  env:
    MY_SECRET: ${{ secrets.MY_SECRET }}
```

---

## 🔴 Problem: SSL Certificate Error

### Symptom
```
NET::ERR_CERT_COMMON_NAME_INVALID
```

### Diagnoza
```powershell
curl -v https://example.com 2>&1 | Select-String "SSL"
```

### Fix

#### 1. Verify Custom Domain w Cloudflare
```
Dashboard → Workers & Pages → mybonzo-proxy-worker → Settings → Triggers
→ Custom Domains → example.com → Status: Active
```

#### 2. Wait for SSL provisioning
```
Cloudflare automatycznie provisionuje SSL.
Czas: 2-15 minut.
```

#### 3. Force SSL/TLS
```
Dashboard → SSL/TLS → Overview → Full (strict)
```

---

## 🟡 Warning: Rate Limiting

### Symptom
```
429 Too Many Requests
```

### Free Tier Limits
- Workers: 100k requests/day
- Pages: Unlimited

### Monitoring
```powershell
# Dashboard → Workers & Pages → Analytics
# Zobacz: Requests per day
```

### Solutions

#### 1. Upgrade to Paid Plan
```
Workers Paid: $5/month → 10M requests/month
```

#### 2. Optimize requests
```javascript
// Cache w Workers
// Reduce API calls
// Use KV dla read-heavy operations
```

---

## 📊 Debug Checklist

Przed otwarciem issue/support ticket:

- [ ] Sprawdź wszystkie URL-e w worker-proxy/index.js
- [ ] Verify base path w astro.config.mjs
- [ ] Test lokalnie przed deploy: npm run preview
- [ ] Check GitHub Actions logs
- [ ] Sprawdź wrangler tail logs
- [ ] Test health endpoint: /_proxy-health
- [ ] Verify DNS w Cloudflare Dashboard
- [ ] Check SSL certificate status
- [ ] Purge cache (CDN + browser)
- [ ] Verify API tokens/secrets

---

## 🆘 Gdzie Szukać Pomocy

### Logi
```powershell
# Worker logs
wrangler tail mybonzo-proxy-worker

# Pages build logs
# Dashboard → Workers & Pages → mybonzo-main-app → Deployments → View build log

# GitHub Actions logs
# GitHub → Actions → [workflow name] → Details
```

### Cloudflare Status
- https://www.cloudflarestatus.com/

### Community
- Cloudflare Community: https://community.cloudflare.com/
- Astro Discord: https://astro.build/chat
- GitHub Issues: https://github.com/withastro/astro/issues

### Support
- Cloudflare Support (paid plans): Dashboard → Help → Contact Support
- Astro: Discord #support channel

---

**Ostatnia aktualizacja**: 2025-10-31  
**Wersja**: 1.0.0
