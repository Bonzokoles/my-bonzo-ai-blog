# ⚡ Szybka Ściągawka - Nowy Eksperyment

**Wydrukuj i trzymaj pod ręką! 📌**

---

## 🚀 Szybki Start (5 minut)

```powershell
# 1. SKOPIUJ SZABLON
cd Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty
Copy-Item -Recurse "_SZABLON" "NAZWA"
cd NAZWA

# 2. ZMIEŃ 3 NAZWY (wrangler.jsonc)
# main-app/wrangler.jsonc    → "name": "mybonzo-EXP-NAZWA-main"
# subpage/wrangler.jsonc     → "name": "mybonzo-EXP-NAZWA-subpage"
# worker-proxy/wrangler.jsonc → "name": "mybonzo-EXP-NAZWA-proxy"

# 3. USTAW BASE PATH (2 pliki)
# subpage/astro.config.mjs  → base: '/SCIEZKA/'
# subpage/wrangler.jsonc    → "BASE_PATH": "/SCIEZKA/"

# 4. BUILD + DEPLOY PAGES
cd main-app
npm install && npm run build && npm run deploy
# ZAPISZ URL: https://mybonzo-exp-NAZWA-main.pages.dev

cd ../subpage
npm install && npm run build && npm run deploy
# ZAPISZ URL: https://mybonzo-exp-NAZWA-subpage.pages.dev

# 5. KONFIGURUJ WORKER (index.js)
cd ../worker-proxy
# Edytuj linie 17-18: MAIN_APP_URL, SUBPAGE_URL
# Edytuj linię 25: prefix: '/SCIEZKA/'

# 6. DEPLOY WORKER
npm install && npm run deploy

# 7. CUSTOM DOMAIN (Dashboard)
# Workers & Pages → mybonzo-EXP-NAZWA-proxy → Settings → Triggers
# Add Custom Domain: NAZWA.mybonzo.com

# 8. TEST
curl https://NAZWA.mybonzo.com/_proxy-health
```

---

## 📝 Checklist "Must Change"

### ✅ Nazwy (3 pliki):
- [ ] `main-app/wrangler.jsonc` linia 6
- [ ] `subpage/wrangler.jsonc` linia 6
- [ ] `worker-proxy/wrangler.jsonc` linia 6

### ✅ Base Path (2 pliki):
- [ ] `subpage/astro.config.mjs` linia ~39
- [ ] `subpage/wrangler.jsonc` linia ~25

### ✅ Worker URLs (1 plik, PO deploymencie):
- [ ] `worker-proxy/index.js` linie 17-18

### ✅ Worker Routing (1 plik):
- [ ] `worker-proxy/index.js` linia 25 (prefix)

---

## 🔧 Komendy Deploy

```powershell
# Main App
cd main-app
npm install
npm run build
npm run deploy

# Subpage
cd ../subpage
npm install
npm run build
npm run deploy

# Worker Proxy (OSTATNI!)
cd ../worker-proxy
npm install
npm run deploy
```

---

## 🚨 Najczęstsze Błędy

| Problem | Przyczyna | Fix |
|---------|-----------|-----|
| **404 na subpage** | Base path źle | Sprawdź slash: `/path/` |
| **Assets 404** | Base path niesynchronizowany | Synchronizuj 3 miejsca |
| **Worker error** | Złe URL-e Pages | Sprawdź linie 17-18 |
| **CORS error** | Worker nie dodaje headers | Redeploy worker |

---

## 📍 Lokalizacje Kluczowych Plików

```
eksperyment/
├── main-app/
│   ├── astro.config.mjs        [line 39: base - NIE ZMIENIAJ]
│   └── wrangler.jsonc          [line 6: name - ZMIEŃ]
│
├── subpage/
│   ├── astro.config.mjs        [line 39: base - ZMIEŃ]
│   └── wrangler.jsonc          [line 6: name, line 25: BASE_PATH - ZMIEŃ]
│
└── worker-proxy/
    ├── index.js                [line 17-18: URLs, line 25: prefix - ZMIEŃ]
    └── wrangler.jsonc          [line 6: name - ZMIEŃ]
```

---

## 🎯 Pattern Nazewnictwa

| Element | Pattern | Przykład |
|---------|---------|----------|
| Folder | `nazwa-eksperymentu` | `ai-chat` |
| Main Project | `mybonzo-EXP-nazwa-main` | `mybonzo-EXP-ai-chat-main` |
| Subpage Project | `mybonzo-EXP-nazwa-subpage` | `mybonzo-EXP-ai-chat-subpage` |
| Worker Project | `mybonzo-EXP-nazwa-proxy` | `mybonzo-EXP-ai-chat-proxy` |
| Base Path | `/nazwa/` | `/ai-chat/` |
| Custom Domain | `nazwa.mybonzo.com` | `ai-chat.mybonzo.com` |

---

## 💡 Pro Tips

1. **Deploy Pages PRZED Worker** - Worker potrzebuje URL-i
2. **Slash na końcu!** Base path: `/path/` (nie `/path`)
3. **Test lokalnie** przed deploymentem: `npm run preview`
4. **Logs Worker**: `wrangler tail mybonzo-EXP-nazwa-proxy`
5. **Health check**: `/_proxy-health` endpoint

---

## 📚 Pełna Dokumentacja

→ `INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md` w folderze eksperymentu

---

**Data**: 1 listopada 2025 | **Compatibility**: 2025-10-31
