# 🎯 Szablon Eksperymentalnego Projektu Astro + Cloudflare

**Lokalizacja**: `Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty\_SZABLON\`  
**Źródło**: `Q:\mybonzo\mybonzoAIblog\public\KONFIG_PODPROJEKT\`  
**Data**: 1 listopada 2025

---

## 🚀 Szybki Start (30 sekund)

```powershell
# 1. Skopiuj szablon
cd Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty
Copy-Item -Recurse "_SZABLON" "NAZWA-PROJEKTU"

# 2. Przeczytaj instrukcję
cd NAZWA-PROJEKTU
notepad INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md

# 3. Postępuj według kroków w instrukcji
```

---

## 📁 Struktura Szablonu

```
_SZABLON/
├── INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md  ← ZACZNIJ TUTAJ!
├── README.md                           ← Ten plik
│
├── main-app/                           ← Główna aplikacja (root domain)
│   ├── astro.config.mjs               ← Konfiguracja Astro (bez base path)
│   ├── package.json                   ← Dependencies + scripts
│   ├── wrangler.jsonc                 ← Cloudflare Pages config
│   ├── public/
│   │   └── _headers                   ← Security headers
│   └── src/
│       └── pages/
│           └── index.example.astro    ← Przykładowa strona
│
├── subpage/                            ← Podstrona (z base path)
│   ├── astro.config.mjs               ← !!! USTAW base: '/twoja-sciezka/' !!!
│   ├── package.json                   ← Dependencies + scripts
│   ├── wrangler.jsonc                 ← Cloudflare Pages config
│   ├── public/
│   │   └── _headers                   ← Security headers
│   └── src/
│       └── pages/
│           └── index.example.astro    ← Przykładowa strona z base path
│
└── worker-proxy/                       ← Reverse Proxy (routing)
    ├── index.js                       ← !!! USTAW URL-E PO DEPLOYMENCIE !!!
    ├── package.json                   ← Minimal deps
    └── wrangler.jsonc                 ← Cloudflare Worker config
```

---

## ⚡ Co Musisz Zmienić?

### 1️⃣ Nazwy projektów (3 pliki):
- `main-app/wrangler.jsonc` → `"name": "mybonzo-EXP-TWOJA-NAZWA-main"`
- `subpage/wrangler.jsonc` → `"name": "mybonzo-EXP-TWOJA-NAZWA-subpage"`
- `worker-proxy/wrangler.jsonc` → `"name": "mybonzo-EXP-TWOJA-NAZWA-proxy"`

### 2️⃣ Base path dla subpage (2 pliki):
- `subpage/astro.config.mjs` → `base: '/twoja-sciezka/'`
- `subpage/wrangler.jsonc` → `"BASE_PATH": "/twoja-sciezka/"`

### 3️⃣ URL-e Pages w Worker (PO deploymencie!):
- `worker-proxy/index.js` → linie 17-18:
  ```javascript
  const MAIN_APP_URL = 'https://TWOJ-URL-MAIN.pages.dev';
  const SUBPAGE_URL = 'https://TWOJ-URL-SUBPAGE.pages.dev';
  ```

### 4️⃣ Routing w Worker:
- `worker-proxy/index.js` → linie 23-27:
  ```javascript
  const ROUTES = [
      {
          prefix: '/twoja-sciezka/',  // ← SYNCHRONIZUJ Z BASE PATH!
          target: SUBPAGE_URL,
          name: 'Twoja Nazwa Subpage'
      },
  ];
  ```

---

## 📋 Kolejność Działań

1. ✅ **Skopiuj szablon** → nowy folder z nazwą projektu
2. ✅ **Zmień nazwy** w wrangler.jsonc (3 miejsca)
3. ✅ **Ustaw base path** w subpage (2 miejsca)
4. ✅ **Zbuduj lokalnie** (main-app + subpage)
5. ✅ **Deploy Pages** (main-app + subpage) → ZAPISZ URL-E!
6. ✅ **Skonfiguruj Worker** (URL-e + routing)
7. ✅ **Deploy Worker**
8. ✅ **Dodaj custom domain** (Cloudflare Dashboard)
9. ✅ **Test routing** (health check + curl)
10. ✅ **GitHub Actions** (opcjonalnie)

---

## 🎓 Dokumentacja

### W tym folderze:
- **INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md** ← Pełna instrukcja krok po kroku

### W folderze KONFIG_PODPROJEKT:
- `README.md` - Architektura systemu
- `STEP_BY_STEP_GUIDE.md` - Szczegółowy przewodnik wdrożenia
- `TERMINAL_COMMANDS.md` - Ściągawka komend PowerShell
- `TROUBLESHOOTING.md` - Rozwiązywanie problemów
- `PROJECT_STRUCTURE.md` - Struktura i konfiguracja plików

### Online:
- [Astro Docs](https://docs.astro.build)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)

---

## 🔧 Wymagania

- ✅ **Node.js** 18+
- ✅ **Wrangler CLI**: `npm install -g wrangler`
- ✅ **Konto Cloudflare** (darmowe wystarczy)
- ✅ **Git** (dla GitHub Actions)
- ✅ **PowerShell** (dla skryptów)

---

## 🚨 WAŻNE UWAGI

1. **Prefiks `mybonzo-EXP-`** - odróżnia eksperymenty od produkcji
2. **Base path ZAWSZE ze slashami**: `/sciezka/` (początek + koniec!)
3. **Synchronizacja base path** w 3 miejscach (astro + wrangler + worker)
4. **Worker wymaga URL-i** - deploy Pages PRZED Workerem!
5. **Custom domain** potrzebuje 2-5 min na SSL provisioning
6. **Compatibility date**: 2025-10-31 (aktualizuj przy każdym deploymencie)

---

## 💡 Przykład Kompletnego Wdrożenia

Zobacz plik: `INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md` → Sekcja "📝 Pełna Ścieżka Deployu"

Przykład pokazuje krok po kroku deployment projektu "ai-generator" od zera do działającego URL.

---

## 🆘 Pomoc

### Problem z deploymentem?
→ `INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md` → "📚 Rozwiązywanie Problemów"

### Nie wiesz jak zacząć?
→ `INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md` → "📋 Checklist Szybkiego Startu"

### Potrzebujesz więcej kontekstu?
→ `Q:\mybonzo\mybonzoAIblog\public\KONFIG_PODPROJEKT\STEP_BY_STEP_GUIDE.md`

---

**Gotowy? Otwórz `INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md` i zacznij! 🚀**
