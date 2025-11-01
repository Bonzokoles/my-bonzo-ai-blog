# ✅ SZABLON GOTOWY - Start Guide

**Data**: 1 listopada 2025  
**Status**: ✅ Kompletny i gotowy do użycia

---

## 🎉 Co Zostało Utworzone?

### 📁 Struktura Foldera `eksperymenty/`:

```
Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty\
│
├── _SZABLON/                              ← GŁÓWNY SZABLON
│   ├── INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md  ← 📖 ZACZNIJ TUTAJ!
│   ├── README.md                          ← Przegląd szablonu
│   ├── QUICK_REFERENCE.md                 ← Ściągawka (1 strona)
│   │
│   ├── main-app/                          ← Główna aplikacja
│   │   ├── astro.config.mjs
│   │   ├── package.json
│   │   ├── wrangler.jsonc
│   │   ├── public/_headers
│   │   └── src/pages/index.example.astro
│   │
│   ├── subpage/                           ← Podstrona (z base path)
│   │   ├── astro.config.mjs
│   │   ├── package.json
│   │   ├── wrangler.jsonc
│   │   ├── public/_headers
│   │   └── src/pages/index.example.astro
│   │
│   └── worker-proxy/                      ← Reverse Proxy
│       ├── index.js
│       ├── package.json
│       └── wrangler.jsonc
│
├── INDEX.md                               ← Index wszystkich eksperymentów
├── README_EKSPERYMENTY.md                 ← Dokumentacja foldera
├── .gitignore                             ← Ochrona sekretów
│
└── [twoje-eksperymenty-tutaj]/            ← Miejsce na nowe projekty
```

---

## 🚀 Jak Zacząć? (3 kroki)

### Krok 1: Skopiuj szablon
```powershell
cd Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty
Copy-Item -Recurse "_SZABLON" "nazwa-mojego-projektu"
cd nazwa-mojego-projektu
```

### Krok 2: Otwórz instrukcję
```powershell
notepad INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md
```

### Krok 3: Postępuj według checklisty
- [ ] Zmień nazwy w wrangler.jsonc (3 pliki)
- [ ] Ustaw base path (subpage)
- [ ] Zbuduj lokalnie
- [ ] Deploy na Cloudflare
- [ ] Skonfiguruj Worker Proxy
- [ ] Przetestuj

**To wszystko!** 🎯

---

## 📚 Dokumentacja - Gdzie Czego Szukać?

### 🆕 Tworzę NOWY eksperyment:
→ `_SZABLON/INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md`  
→ `_SZABLON/QUICK_REFERENCE.md` (ściągawka)

### 📖 Chcę zrozumieć ARCHITEKTURĘ:
→ `README_EKSPERYMENTY.md`  
→ `Q:\mybonzo\mybonzoAIblog\public\KONFIG_PODPROJEKT\README.md`

### 🔧 Mam PROBLEM z deploymentem:
→ `_SZABLON/INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md` → Sekcja "Rozwiązywanie Problemów"  
→ `Q:\mybonzo\mybonzoAIblog\public\KONFIG_PODPROJEKT\TROUBLESHOOTING.md`

### 💻 Potrzebuję KOMENDY PowerShell:
→ `_SZABLON/QUICK_REFERENCE.md`  
→ `Q:\mybonzo\mybonzoAIblog\public\KONFIG_PODPROJEKT\TERMINAL_COMMANDS.md`

### 📊 Chcę zobaczyć WSZYSTKIE eksperymenty:
→ `INDEX.md` (lista projektów, statystyki)

### 🎓 Szczegółowy PRZEWODNIK wdrożenia:
→ `Q:\mybonzo\mybonzoAIblog\public\KONFIG_PODPROJEKT\STEP_BY_STEP_GUIDE.md`

---

## 🎯 Przykład: Tworzenie Pierwszego Eksperymentu

### Scenariusz: Chcesz stworzyć projekt "ai-chat"

```powershell
# 1. Skopiuj szablon
cd Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty
Copy-Item -Recurse "_SZABLON" "ai-chat"
cd ai-chat

# 2. Zmień nazwy w wrangler.jsonc (3 pliki)
# main-app/wrangler.jsonc    → "name": "mybonzo-EXP-ai-chat-main"
# subpage/wrangler.jsonc     → "name": "mybonzo-EXP-ai-chat-subpage"
# worker-proxy/wrangler.jsonc → "name": "mybonzo-EXP-ai-chat-proxy"

# 3. Ustaw base path (2 pliki)
# subpage/astro.config.mjs  → base: '/ai-chat/'
# subpage/wrangler.jsonc    → "BASE_PATH": "/ai-chat/"

# 4. Deploy main-app
cd main-app
npm install
npm run build
npm run deploy
# Wynik: https://mybonzo-exp-ai-chat-main.pages.dev ← ZAPISZ!

# 5. Deploy subpage
cd ../subpage
npm install
npm run build
npm run deploy
# Wynik: https://mybonzo-exp-ai-chat-subpage.pages.dev ← ZAPISZ!

# 6. Konfiguruj Worker
cd ../worker-proxy
# Edytuj index.js:
# - MAIN_APP_URL = 'https://mybonzo-exp-ai-chat-main.pages.dev'
# - SUBPAGE_URL = 'https://mybonzo-exp-ai-chat-subpage.pages.dev'
# - prefix: '/ai-chat/'

# 7. Deploy Worker
npm install
npm run deploy

# 8. Dodaj custom domain w Dashboard
# Workers & Pages → mybonzo-EXP-ai-chat-proxy → Settings → Triggers
# Add Custom Domain: ai-chat.mybonzo.com

# 9. Test
curl https://ai-chat.mybonzo.com/_proxy-health
curl -I https://ai-chat.mybonzo.com/
curl -I https://ai-chat.mybonzo.com/ai-chat/

# 10. Dodaj do INDEX.md
# Edytuj: Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty\INDEX.md
```

**Gotowe!** 🎉 Twój eksperyment działa na https://ai-chat.mybonzo.com

---

## 🔥 Quick Commands - Skopiuj i Użyj

### Nowy eksperyment (wklej nazwę):
```powershell
$nazwa = "NAZWA-PROJEKTU"  # ← ZMIEŃ TO
cd Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty
Copy-Item -Recurse "_SZABLON" $nazwa
Write-Host "✅ Utworzono: $nazwa" -ForegroundColor Green
Write-Host "📖 Otwórz: $nazwa\INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md" -ForegroundColor Cyan
```

### Deploy wszystkich części (w folderze eksperymentu):
```powershell
# Main App
cd main-app; npm install; npm run build; npm run deploy; cd ..

# Subpage
cd subpage; npm install; npm run build; npm run deploy; cd ..

# ⚠️ TERAZ: Edytuj worker-proxy/index.js (linie 17-18, 25)

# Worker Proxy
cd worker-proxy; npm install; npm run deploy; cd ..

Write-Host "✅ Deployment zakończony!" -ForegroundColor Green
```

### Sprawdź status deploymentu:
```powershell
# Lista Pages projects
wrangler pages project list | Select-String "mybonzo-EXP"

# Lista Workers
wrangler deployments list | Select-String "mybonzo-EXP"

# Logi Worker (real-time)
wrangler tail mybonzo-EXP-NAZWA-proxy
```

---

## ⚠️ WAŻNE - Przeczytaj Przed Startem!

### ✅ Pamiętaj o:
1. **Prefiks `mybonzo-EXP-`** - ZAWSZE dla eksperymentów
2. **Base path ze slashami** - `/sciezka/` (początek + koniec!)
3. **Synchronizacja base path** - 3 miejsca (astro, wrangler, worker)
4. **Deploy Pages PRZED Worker** - Worker potrzebuje URL-i
5. **Custom domain** - 2-5 minut na SSL provisioning

### ❌ NIE commituj:
- `.dev.vars` (sekrety lokalne)
- `node_modules/`
- `dist/`
- `.wrangler/`
- `.env*`

(Wszystko zabezpieczone w `.gitignore`)

---

## 🎓 Następne Kroki

### Po pierwszym eksperymencie:
1. ✅ Zaktualizuj `INDEX.md` (dodaj projekt do listy)
2. ✅ Napisz README.md w folderze projektu (cel, status, notatki)
3. ✅ Monitoruj metryki w Cloudflare Dashboard
4. ✅ Sprawdź logi: `wrangler tail mybonzo-EXP-nazwa-proxy`

### Jeśli eksperyment się udał:
1. Rozważ przeniesienie do produkcji (poza folder `eksperymenty/`)
2. Zmień prefiks `mybonzo-EXP-` na produkcyjny
3. Skonfiguruj GitHub Actions dla CI/CD
4. Dodaj monitoring i alerty

### Jeśli nie udał się:
1. Zapisz wnioski w README projektu
2. Cleanup Cloudflare (delete projects)
3. Przenieś wpis do "Archiwalne" w INDEX.md
4. Backup lokalny (zip) i usuń folder

---

## 📊 Monitoring i Statystyki

### Dashboard Cloudflare:
→ https://dash.cloudflare.com → Workers & Pages → Overview

### Sprawdź limity (Free Tier):
- Workers: 100 unique scripts
- Pages: 500 projects
- Requests: 100,000/day

### CLI Monitoring:
```powershell
# Real-time logs
wrangler tail mybonzo-EXP-nazwa-proxy

# Deployment history
wrangler pages deployment list --project-name=mybonzo-EXP-nazwa-main

# Worker analytics
# (Dashboard tylko - Analytics → Workers → wybierz projekt)
```

---

## 🆘 Szybka Pomoc

| Problem | Rozwiązanie |
|---------|-------------|
| **404 na subpage** | Sprawdź base path (3 miejsca!) |
| **Assets 404** | Przebuduj z poprawnym base path |
| **Worker error** | Sprawdź URL-e w `index.js` linie 17-18 |
| **CORS error** | Redeploy worker (automatyczne headers) |
| **SSL error** | Poczekaj 5 minut po dodaniu domeny |

**Pełna lista**: `_SZABLON/INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md` → "Rozwiązywanie Problemów"

---

## 📞 Wsparcie

### Dokumentacja szczegółowa:
- `_SZABLON/INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md` - Kompletna instrukcja
- `Q:\mybonzo\mybonzoAIblog\public\KONFIG_PODPROJEKT\` - Źródłowa dokumentacja

### Online:
- [Astro Docs](https://docs.astro.build)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)

---

## ✅ Checklist Weryfikacji Szablonu

Przed pierwszym użyciem sprawdź:

- [x] Struktura folderów utworzona
- [x] Pliki skopiowane z KONFIG_PODPROJEKT
- [x] Dokumentacja kompletna (3 pliki markdown)
- [x] .gitignore zabezpiecza sekrety
- [x] INDEX.md gotowy do aktualizacji
- [x] README_EKSPERYMENTY.md opisuje proces
- [x] QUICK_REFERENCE.md zawiera ściągawkę

**Status**: ✅ WSZYSTKO GOTOWE!

---

## 🎉 Gotowy do Startu!

Szablon jest kompletny i gotowy do użycia. Powodzenia w eksperymentowaniu! 🚀

**Następny krok**: Skopiuj `_SZABLON` i otwórz `INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md`

---

**Data utworzenia**: 1 listopada 2025  
**Compatibility date**: 2025-10-31  
**Źródło**: Q:\mybonzo\mybonzoAIblog\public\KONFIG_PODPROJEKT\
