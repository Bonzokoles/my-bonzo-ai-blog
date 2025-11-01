# 🧪 Folder Eksperymentów - Astro + Cloudflare

**Lokalizacja**: `Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty\`  
**Cel**: Szybkie prototypowanie i testowanie nowych funkcji  
**Szablon**: `_SZABLON/`

---

## 📁 Struktura Foldera

```
eksperymenty/
├── _SZABLON/                          ← SZABLON DO KOPIOWANIA
│   ├── INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md
│   ├── README.md
│   ├── main-app/
│   ├── subpage/
│   └── worker-proxy/
│
├── projekt-1/                         ← Twoje eksperymenty tutaj
│   ├── main-app/
│   ├── subpage/
│   └── worker-proxy/
│
├── projekt-2/
│   └── ...
│
└── README_EKSPERYMENTY.md            ← Ten plik
```

---

## 🚀 Jak Utworzyć Nowy Eksperyment?

### Krok 1: Skopiuj szablon
```powershell
cd Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty
Copy-Item -Recurse "_SZABLON" "nazwa-eksperymentu"
cd nazwa-eksperymentu
```

### Krok 2: Przeczytaj instrukcję
```powershell
notepad INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md
```

### Krok 3: Postępuj według checklisty
- [ ] Zmień nazwy projektów w wrangler.jsonc (3 pliki)
- [ ] Ustaw base path w subpage (2 pliki)
- [ ] Zbuduj lokalnie (main-app + subpage)
- [ ] Deploy na Cloudflare Pages
- [ ] Skonfiguruj Worker Proxy (URL-e + routing)
- [ ] Deploy Worker
- [ ] Dodaj custom domain
- [ ] Przetestuj routing

---

## 📋 Lista Eksperymentów

### Aktywne Projekty:

| Nazwa | Status | URL | Opis | Data utworzenia |
|-------|--------|-----|------|-----------------|
| `_SZABLON` | 📝 Template | - | Szablon dla nowych projektów | 1 listopada 2025 |
| - | - | - | - | - |

**Instrukcja**: Po utworzeniu nowego eksperymentu dodaj go do powyższej tabeli.

---

## 🎯 Konwencje Nazewnictwa

### Nazwa folderu:
- Małe litery
- Myślniki zamiast spacji: `moj-eksperyment`
- Krótka, opisowa: `ai-chat`, `image-gen`, `voice-clone`

### Nazwa projektu w Cloudflare:
- Prefiks: `mybonzo-EXP-`
- Nazwa folderu: `nazwa-eksperymentu`
- Sufiks: `-main`, `-subpage`, `-proxy`
- Przykład: `mybonzo-EXP-ai-chat-main`

### Custom domain:
- Subdomena eksperymentów: `nazwa-eksperymentu.mybonzo.com`
- Lub subdomena dev: `nazwa-eksperymentu.dev.mybonzo.com`
- Przykład: `ai-chat.mybonzo.com`

---

## 🔧 Narzędzia i Komendy

### Szybkie kopiowanie szablonu:
```powershell
# Alias PowerShell (opcjonalnie dodaj do profilu)
function New-Eksperyment {
    param($nazwa)
    $source = "Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty\_SZABLON"
    $dest = "Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty\$nazwa"
    Copy-Item -Recurse $source $dest
    Write-Host "✅ Utworzono eksperyment: $nazwa" -ForegroundColor Green
    Write-Host "📖 Przeczytaj: $dest\INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md" -ForegroundColor Cyan
}

# Użycie:
New-Eksperyment "moj-test"
```

### Deployment wszystkich części eksperymentu:
```powershell
# W katalogu eksperymentu:
function Deploy-Eksperyment {
    Write-Host "🚀 Deploying main-app..." -ForegroundColor Cyan
    cd main-app
    npm install
    npm run build
    npm run deploy
    
    Write-Host "🚀 Deploying subpage..." -ForegroundColor Cyan
    cd ../subpage
    npm install
    npm run build
    npm run deploy
    
    Write-Host "⚠️ Skonfiguruj URL-e w worker-proxy/index.js" -ForegroundColor Yellow
    Read-Host "Naciśnij Enter gdy gotowe"
    
    Write-Host "🚀 Deploying worker-proxy..." -ForegroundColor Cyan
    cd ../worker-proxy
    npm install
    npm run deploy
    
    Write-Host "✅ Deployment zakończony!" -ForegroundColor Green
}

# Użycie:
cd Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty\moj-eksperyment
Deploy-Eksperyment
```

---

## 📚 Dokumentacja

### Dla nowych eksperymentów:
1. **START**: `_SZABLON/INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md` ← Zacznij tutaj!
2. **Przegląd**: `_SZABLON/README.md`

### Pełna dokumentacja:
1. `Q:\mybonzo\mybonzoAIblog\public\KONFIG_PODPROJEKT\README.md`
2. `Q:\mybonzo\mybonzoAIblog\public\KONFIG_PODPROJEKT\STEP_BY_STEP_GUIDE.md`
3. `Q:\mybonzo\mybonzoAIblog\public\KONFIG_PODPROJEKT\TERMINAL_COMMANDS.md`
4. `Q:\mybonzo\mybonzoAIblog\public\KONFIG_PODPROJEKT\TROUBLESHOOTING.md`

### Online:
- [Astro Docs](https://docs.astro.build)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)

---

## 🔄 Aktualizacja Szablonu

Jeśli wprowadzono zmiany w `KONFIG_PODPROJEKT`, zaktualizuj `_SZABLON`:

```powershell
cd Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty

# Backup starego szablonu (opcjonalnie)
Rename-Item "_SZABLON" "_SZABLON_backup_$(Get-Date -Format 'yyyyMMdd')"

# Utwórz nowy szablon
New-Item -ItemType Directory "_SZABLON" -Force
New-Item -ItemType Directory "_SZABLON\main-app" -Force
New-Item -ItemType Directory "_SZABLON\subpage" -Force
New-Item -ItemType Directory "_SZABLON\worker-proxy" -Force

# Kopiuj z KONFIG_PODPROJEKT
Copy-Item "..\..\..\..\public\KONFIG_PODPROJEKT\main-app\*" "_SZABLON\main-app\" -Recurse -Force
Copy-Item "..\..\..\..\public\KONFIG_PODPROJEKT\subpage\*" "_SZABLON\subpage\" -Recurse -Force
Copy-Item "..\..\..\..\public\KONFIG_PODPROJEKT\worker-proxy\*" "_SZABLON\worker-proxy\" -Recurse -Force

# Skopiuj/zaktualizuj dokumentację
# (INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md i README.md)

Write-Host "✅ Szablon zaktualizowany!" -ForegroundColor Green
```

---

## 🚨 Ważne Zasady

### ✅ DO:
- ✅ Używaj prefiksu `mybonzo-EXP-` dla nazw projektów
- ✅ Testuj lokalnie przed deploymentem
- ✅ Dokumentuj zmiany w README projektu
- ✅ Używaj subdomen eksperymentalnych (np. `exp.mybonzo.com`)
- ✅ Dodawaj projekty do tabeli powyżej

### ❌ NIE:
- ❌ Nie commituj `.dev.vars` (sekrety!)
- ❌ Nie używaj produkcyjnych domen dla eksperymentów
- ❌ Nie deployuj bez testów lokalnych
- ❌ Nie zapominaj o synchronizacji base path (3 miejsca!)
- ❌ Nie edytuj `_SZABLON` bezpośrednio (skopiuj najpierw!)

---

## 🎓 Best Practices

1. **Jeden eksperyment = jeden folder**
   - Oddzielna konfiguracja
   - Niezależny deployment
   - Łatwe usunięcie

2. **Dokumentuj natychmiast**
   - Dodaj README.md w folderze projektu
   - Opisz cel eksperymentu
   - Zapisz kluczowe decyzje

3. **Izoluj środowiska**
   - Dev: lokalne testy
   - Staging: `*.pages.dev` (automatyczne URL Cloudflare)
   - Experiment: custom subdomena (np. `exp.mybonzo.com`)
   - Production: osobny deployment (poza folderem `eksperymenty`)

4. **Monitoring**
   - Używaj `wrangler tail` do logów Worker
   - Cloudflare Analytics dla metryk
   - `/_proxy-health` endpoint dla health check

5. **Sprzątanie**
   - Usuń nieudane eksperymenty po testach
   - Archive (zip + remove) starych projektów
   - Cleanup Cloudflare Dashboard (Workers & Pages)

---

## 🆘 Pomoc i Troubleshooting

### Problem z deploymentem?
→ `_SZABLON/INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md` → Sekcja "Rozwiązywanie Problemów"

### Problem z routingiem?
→ `public/KONFIG_PODPROJEKT/TROUBLESHOOTING.md`

### Ogólne pytania?
→ Sprawdź pełną dokumentację w `public/KONFIG_PODPROJEKT/`

### Błędy Cloudflare Worker?
```powershell
# Real-time logs
wrangler tail mybonzo-EXP-twoj-projekt-proxy

# Lub w Dashboard:
# Workers & Pages → twój-proxy → Logs → Real-time Logs
```

---

## 📊 Metryki i Monitoring

### Dashboard Cloudflare:
1. **Workers & Pages** → Overview
2. Wybierz projekt (main/subpage/proxy)
3. **Analytics** → Requests, Errors, CPU Time

### CLI Monitoring:
```powershell
# Worker logs (real-time)
wrangler tail mybonzo-EXP-projekt-proxy

# Pages deployment status
wrangler pages deployment list --project-name=mybonzo-EXP-projekt-main

# Metrics (opcjonalnie, wymaga wrangler.toml config)
wrangler metrics
```

---

## 🔒 Bezpieczeństwo

### Sekrety:
- **Lokalne**: `.dev.vars` (NIGDY nie commituj!)
- **Production**: `wrangler secret put NAZWA_SEKRETU`
- **GitHub Actions**: Repository Secrets

### Headers:
- Security headers automatyczne w `public/_headers`
- Worker proxy dodaje dodatkowe headers (CORS, CSP)

### Limity:
- Free tier: 100,000 requests/day (Worker)
- Free tier: Unlimited bandwidth (Pages)
- CPU limit: 50ms/request (Worker)

---

## ✅ Checklist Przed Usunięciem Eksperymentu

Przed usunięciem folderu eksperymentu:

- [ ] Zapisz wnioski/wyniki w oddzielnym dokumencie
- [ ] Usuń deployment z Cloudflare:
  ```powershell
  wrangler pages project delete mybonzo-EXP-projekt-main
  wrangler pages project delete mybonzo-EXP-projekt-subpage
  wrangler delete mybonzo-EXP-projekt-proxy
  ```
- [ ] Usuń custom domain z Dashboard
- [ ] Usuń GitHub Actions workflow (jeśli utworzono)
- [ ] Usuń folder lokalnie:
  ```powershell
  Remove-Item -Recurse -Force "nazwa-projektu"
  ```
- [ ] Zaktualizuj tabelę projektów w tym README

---

**Powodzenia w eksperymentowaniu! 🚀🧪**

Pamiętaj: To środowisko testowe - fail fast, learn faster!
