# 🚀 Instrukcja Wdrożenia Nowego Eksperymentu

**Data utworzenia szablonu**: 1 listopada 2025  
**Compatibility date**: 2025-10-31  
**Źródło**: `Q:\mybonzo\mybonzoAIblog\public\KONFIG_PODPROJEKT\`

---

## 📋 Checklist Szybkiego Startu

### ⚡ Quick Deploy (5 minut)
- [ ] Skopiuj folder `_SZABLON` → `nazwa-projektu`
- [ ] Zmień nazwę projektu w 3 miejscach (patrz: Krok 1)
- [ ] Ustaw base path dla subpage (patrz: Krok 2)
- [ ] Zbuduj i przetestuj lokalnie (patrz: Krok 3)
- [ ] Deploy na Cloudflare (patrz: Krok 4)
- [ ] Skonfiguruj Worker Proxy (patrz: Krok 5)
- [ ] Dodaj GitHub Actions (opcjonalnie, Krok 6)

---

## 🎯 Krok 1: Tworzenie Nowego Projektu

### Skopiuj szablon:
```powershell
cd Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty

# Przykład: nowy projekt "moj-test"
Copy-Item -Recurse "_SZABLON" "moj-test"
cd moj-test
```

### Zmień nazwy projektu w plikach:

#### 📁 `main-app/wrangler.jsonc` - linia 6:
```jsonc
"name": "mybonzo-EXP-moj-test-main",
```

#### 📁 `subpage/wrangler.jsonc` - linia 6:
```jsonc
"name": "mybonzo-EXP-moj-test-subpage",
```

#### 📁 `worker-proxy/wrangler.jsonc` - linia 6:
```jsonc
"name": "mybonzo-EXP-moj-test-proxy",
```

**⚠️ WAŻNE**: Prefiks `mybonzo-EXP-` odróżnia eksperymenty od produkcji!

---

## 🎯 Krok 2: Konfiguracja Base Path

### A. Decyzja o routing:
- **Główna strona**: `example.com/` → `base: '/'` (bez zmian)
- **Podstrona**: `example.com/moj-test/` → ustaw `base: '/moj-test/'`

### B. Edytuj `subpage/astro.config.mjs` - linia 39:
```javascript
// Zmień z:
base: '/subpage/',

// Na:
base: '/moj-test/',  // ← TWOJA ŚCIEŻKA
```

### C. Edytuj `subpage/wrangler.jsonc` - linia 23:
```jsonc
"vars": {
    "ENVIRONMENT": "production",
    "LOG_LEVEL": "info",
    "BASE_PATH": "/moj-test/"  // ← SYNCHRONIZUJ Z ASTRO
}
```

---

## 🎯 Krok 3: Lokalny Test

### A. Main App:
```powershell
cd main-app
npm install
npm run build      # Test kompilacji
npm run preview    # Test lokalny na http://localhost:4321
```

**Sprawdź**: Czy strona działa poprawnie?

### B. Subpage:
```powershell
cd ../subpage
npm install
npm run build
npm run preview    # Na http://localhost:4322 (inny port!)
```

**Sprawdź**: Czy wszystkie linki zawierają `/moj-test/`?

### C. Worker Proxy (później, po deploy Pages):
```powershell
cd ../worker-proxy
npm install
# Poczekaj na Krok 5 przed testowaniem
```

---

## 🎯 Krok 4: Deploy na Cloudflare Pages

### Autentykacja (jednorazowo):
```powershell
wrangler login
```

### Deploy Main App:
```powershell
cd main-app
npm run deploy
```

**Zapisz URL**: `https://mybonzo-exp-moj-test-main.pages.dev` ← POTRZEBNE W KROKU 5!

### Deploy Subpage:
```powershell
cd ../subpage
npm run deploy
```

**Zapisz URL**: `https://mybonzo-exp-moj-test-subpage.pages.dev` ← POTRZEBNE W KROKU 5!

---

## 🎯 Krok 5: Konfiguracja Worker Proxy

### A. Edytuj `worker-proxy/index.js` - linie 17-18:
```javascript
// ZMIEŃ NA SWOJE URL-E Z KROKU 4:
const MAIN_APP_URL = 'https://mybonzo-exp-moj-test-main.pages.dev';
const SUBPAGE_URL = 'https://mybonzo-exp-moj-test-subpage.pages.dev';
```

### B. Edytuj `worker-proxy/index.js` - linie 23-27:
```javascript
const ROUTES = [
    {
        prefix: '/moj-test/',  // ← TWÓJ BASE PATH
        target: SUBPAGE_URL,
        name: 'Moj Test Subpage'
    },
];
```

### C. Deploy Worker:
```powershell
cd worker-proxy
npm run deploy
```

### D. Przypisz Custom Domain (Cloudflare Dashboard):

1. Idź do: **Workers & Pages** → **mybonzo-EXP-moj-test-proxy**
2. **Settings** → **Triggers** → **Add Custom Domain**
3. Dodaj: `moj-test.mybonzo.com` (lub subdomenę eksperymentów)
4. Poczekaj 2-5 minut na SSL provisioning

### E. Testuj routing:
```powershell
# Health check
curl https://moj-test.mybonzo.com/_proxy-health

# Main app (root)
curl -I https://moj-test.mybonzo.com/

# Subpage
curl -I https://moj-test.mybonzo.com/moj-test/
```

---

## 🎯 Krok 6: GitHub Actions (Opcjonalnie)

### Skopiuj workflow template:
```powershell
cd Q:\mybonzo\mybonzoAIblog
mkdir .github\workflows\eksperymenty -Force

# Skopiuj z KONFIG_PODPROJEKT:
Copy-Item "public\KONFIG_PODPROJEKT\.github\workflows\deploy-main.yml" ".github\workflows\eksperymenty\deploy-moj-test-main.yml"
Copy-Item "public\KONFIG_PODPROJEKT\.github\workflows\deploy-subpage.yml" ".github\workflows\eksperymenty\deploy-moj-test-subpage.yml"
Copy-Item "public\KONFIG_PODPROJEKT\.github\workflows\deploy-proxy.yml" ".github\workflows\eksperymenty\deploy-moj-test-proxy.yml"
```

### Edytuj każdy workflow:

#### Zmień path trigger (przykład dla `deploy-moj-test-main.yml`):
```yaml
on:
  push:
    branches: [main]
    paths:
      - 'src/pages/eksperymenty/moj-test/main-app/**'  # ← TWOJA ŚCIEŻKA
```

#### Zmień working directory:
```yaml
jobs:
  deploy:
    steps:
      - name: Deploy to Cloudflare Pages
        working-directory: ./src/pages/eksperymenty/moj-test/main-app  # ← TWOJA ŚCIEŻKA
```

### Dodaj secrets w GitHub:
1. Repository → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret**:
   - `CLOUDFLARE_API_TOKEN` → (skopiuj z Cloudflare Dashboard)
   - `CLOUDFLARE_ACCOUNT_ID` → (Workers & Pages → Overview → Account ID)

---

## 📚 Rozwiązywanie Problemów

### ❌ Problem: "404 Not Found" na subpage
**Diagnoza**: Base path nie jest ustawiony poprawnie.

**Fix**:
1. Sprawdź `subpage/astro.config.mjs` → `base: '/moj-test/'` (ze slashami!)
2. Sprawdź `worker-proxy/index.js` → `prefix: '/moj-test/'` (synchronizacja!)
3. Przebuduj i redeploy:
   ```powershell
   cd subpage && npm run build && npm run deploy
   cd ../worker-proxy && npm run deploy
   ```

---

### ❌ Problem: "Assets nie ładują się" (404 dla CSS/JS)
**Diagnoza**: Niepoprawne ścieżki do assetów z base path.

**Fix**:
1. W Astro używaj zawsze:
   ```astro
   ---
   import { getImage } from 'astro:assets';
   const basePath = import.meta.env.BASE_URL; // Automatycznie '/moj-test/'
   ---
   <link rel="stylesheet" href={`${basePath}_astro/styles.css`}>
   ```
2. Lub korzystaj z Astro's automatic handling:
   ```astro
   <link rel="stylesheet" href="/_astro/styles.css">
   <!-- Astro automatycznie dodaje base path -->
   ```

---

### ❌ Problem: Worker proxy nie działa
**Diagnoza**: Niepoprawne URL-e w `worker-proxy/index.js`.

**Fix**:
1. Sprawdź czy URL-e Pages są poprawne:
   ```powershell
   wrangler pages project list
   ```
2. Zweryfikuj URL-e w `worker-proxy/index.js` (linie 17-18)
3. Redeploy worker:
   ```powershell
   cd worker-proxy && npm run deploy
   ```
4. Sprawdź logi:
   ```powershell
   wrangler tail mybonzo-EXP-moj-test-proxy
   ```

---

### ❌ Problem: "Error 1101" - Worker Error
**Diagnoza**: Worker przekracza limity CPU/memory lub ma błąd w kodzie.

**Fix**:
1. Sprawdź logi:
   ```powershell
   wrangler tail mybonzo-EXP-moj-test-proxy
   ```
2. Sprawdź limity w `worker-proxy/wrangler.jsonc`:
   ```jsonc
   "limits": {
     "cpu_ms": 50  // Zwiększ do 100 jeśli potrzeba
   }
   ```
3. Sprawdź czy Pages URL-e są osiągalne:
   ```powershell
   curl -I https://mybonzo-exp-moj-test-main.pages.dev
   ```

---

### ❌ Problem: CORS errors
**Diagnoza**: Proxy nie dodaje poprawnych headerów CORS.

**Fix**: Worker automatycznie obsługuje CORS (patrz `worker-proxy/index.js` linia 246-259), ale jeśli problem persystuje:
1. Sprawdź czy requesty pochodzą z właściwej domeny
2. Dodaj domenę do `Access-Control-Allow-Origin` jeśli potrzeba custom origin

---

## 🔧 Zaawansowana Konfiguracja

### Dodanie KV Storage (cache, sessions):
```jsonc
// W wrangler.jsonc (main-app lub subpage):
"kv_namespaces": [
  {
    "binding": "CACHE",
    "id": "abcd1234...",           // Utwórz: wrangler kv:namespace create CACHE
    "preview_id": "xyz5678..."     // Utwórz: wrangler kv:namespace create CACHE --preview
  }
]
```

### Dodanie R2 Storage (pliki, media):
```jsonc
"r2_buckets": [
  {
    "binding": "MEDIA",
    "bucket_name": "mybonzo-exp-moj-test-media",
    "preview_bucket_name": "mybonzo-exp-moj-test-media-preview"
  }
]
```

Utwórz bucket:
```powershell
wrangler r2 bucket create mybonzo-exp-moj-test-media
```

### Dodanie D1 Database (SQL):
```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "mybonzo-exp-moj-test-db",
    "database_id": "abc-123-def"  // Z: wrangler d1 create mybonzo-exp-moj-test-db
  }
]
```

---

## 📝 Pełna Ścieżka Deployu - Przykład

```powershell
# 1. Skopiuj szablon
cd Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty
Copy-Item -Recurse "_SZABLON" "ai-generator"
cd ai-generator

# 2. Zmień nazwy w wrangler.jsonc (3 pliki)
# main-app/wrangler.jsonc → "name": "mybonzo-EXP-ai-generator-main"
# subpage/wrangler.jsonc → "name": "mybonzo-EXP-ai-generator-subpage"
# worker-proxy/wrangler.jsonc → "name": "mybonzo-EXP-ai-generator-proxy"

# 3. Ustaw base path w subpage
# subpage/astro.config.mjs → base: '/ai-generator/'
# subpage/wrangler.jsonc → "BASE_PATH": "/ai-generator/"

# 4. Zbuduj i deploy Pages
cd main-app
npm install && npm run build && npm run deploy
# Zapisz URL: https://mybonzo-exp-ai-generator-main.pages.dev

cd ../subpage
npm install && npm run build && npm run deploy
# Zapisz URL: https://mybonzo-exp-ai-generator-subpage.pages.dev

# 5. Skonfiguruj Worker Proxy
cd ../worker-proxy
# Edytuj index.js:
# - MAIN_APP_URL = 'https://mybonzo-exp-ai-generator-main.pages.dev'
# - SUBPAGE_URL = 'https://mybonzo-exp-ai-generator-subpage.pages.dev'
# - prefix: '/ai-generator/'

npm install && npm run deploy

# 6. Dodaj custom domain w Dashboard:
# Workers & Pages → mybonzo-EXP-ai-generator-proxy → Settings → Triggers
# Add Custom Domain: ai-generator.mybonzo.com

# 7. Test
curl https://ai-generator.mybonzo.com/_proxy-health
curl -I https://ai-generator.mybonzo.com/
curl -I https://ai-generator.mybonzo.com/ai-generator/
```

---

## 🎓 Dodatkowe Zasoby

### Dokumentacja z KONFIG_PODPROJEKT:
- `README.md` - Architektura i przegląd
- `STEP_BY_STEP_GUIDE.md` - Szczegółowy przewodnik deployu
- `TERMINAL_COMMANDS.md` - Szybka ściągawka komend PowerShell
- `TROUBLESHOOTING.md` - Rozwiązywanie problemów
- `PROJECT_STRUCTURE.md` - Struktura plików i konfiguracji

### Oficjalna dokumentacja:
- [Astro Docs](https://docs.astro.build)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

---

## ✅ Checklist Po Deploymencie

- [ ] Main app działa: `https://nazwa-projektu.mybonzo.com/`
- [ ] Subpage działa: `https://nazwa-projektu.mybonzo.com/sciezka/`
- [ ] Worker health check: `https://nazwa-projektu.mybonzo.com/_proxy-health`
- [ ] Assets ładują się poprawnie (CSS, JS, obrazy)
- [ ] Routing działa: główna → main-app, subpage → subpage
- [ ] SSL certificate aktywny (🔒 w przeglądarce)
- [ ] GitHub Actions workflow dodany (opcjonalnie)
- [ ] Secrets dodane w GitHub (jeśli workflow)
- [ ] Dokumentacja zaktualizowana w README projektu
- [ ] Projekt dodany do głównego INDEX wszystkich eksperymentów

---

## 🚨 WAŻNE PRZYPOMNIENIA

1. **Prefiks `mybonzo-EXP-`** w nazwach odróżnia eksperymenty od produkcji
2. **Base path MUSI mieć slashe**: `/nazwa/` (początek i koniec!)
3. **Synchronizuj base path** w 3 miejscach:
   - `subpage/astro.config.mjs` → `base:`
   - `subpage/wrangler.jsonc` → `BASE_PATH` var
   - `worker-proxy/index.js` → `prefix:` w ROUTES
4. **Worker proxy** wymaga URL-i AFTER deployu Pages
5. **Custom domain** potrzebuje 2-5 minut na SSL
6. **GitHub Actions** wymaga secrets: `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`
7. **Compatibility date**: 2025-10-31 (aktualizuj przy każdym deploymencie)

---

**Powodzenia! 🚀**

Jeśli coś nie działa, sprawdź sekcję "Rozwiązywanie Problemów" powyżej lub pełną dokumentację w `KONFIG_PODPROJEKT/TROUBLESHOOTING.md`.
