# 📊 Index Wszystkich Eksperymentów

**Lokalizacja**: `Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty\`  
**Ostatnia aktualizacja**: 1 listopada 2025

---

## 🎯 Szablon Bazowy

| Element | Status | Opis | Lokalizacja |
|---------|--------|------|-------------|
| **_SZABLON** | ✅ Gotowy | Szablon do kopiowania dla nowych projektów | `_SZABLON/` |
| Instrukcja | ✅ Kompletna | Pełna instrukcja wdrożenia | `_SZABLON/INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md` |
| Quick Reference | ✅ Gotowy | Ściągawka (1 strona) | `_SZABLON/QUICK_REFERENCE.md` |
| README | ✅ Gotowy | Przegląd szablonu | `_SZABLON/README.md` |

---

## 📋 Lista Eksperymentów

### Format wpisu:
```markdown
| Nazwa | Status | URL | Cloudflare Projects | Base Path | Utworzono | Notatki |
```

### Aktywne Projekty:

| Nazwa | Status | URL | Cloudflare Projects | Base Path | Utworzono | Notatki |
|-------|--------|-----|---------------------|-----------|-----------|---------|
| - | - | - | - | - | - | Brak aktywnych projektów |

### Archiwalne/Nieudane:

| Nazwa | Status | Przyczyna archiwizacji | Data |
|-------|--------|------------------------|------|
| - | - | - | - |

---

## 🚀 Jak Dodać Nowy Eksperyment?

### 1. Utwórz projekt:
```powershell
cd Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty
Copy-Item -Recurse "_SZABLON" "nazwa-projektu"
```

### 2. Po pomyślnym deploymencie, dodaj wpis do tabeli:
```markdown
| nazwa-projektu | ✅ Działa | https://nazwa.mybonzo.com | main: `mybonzo-EXP-nazwa-main`<br>subpage: `mybonzo-EXP-nazwa-subpage`<br>proxy: `mybonzo-EXP-nazwa-proxy` | `/sciezka/` | 1 listopada 2025 | Krótki opis |
```

### 3. Statusy:
- 🚧 **W budowie** - Projekt w trakcie developmentu
- ✅ **Działa** - Wdrożony i funkcjonalny
- ⚠️ **Issues** - Problemy do rozwiązania
- 🔒 **Wstrzymany** - Tymczasowo nieaktywny
- ❌ **Nieudany** - Zakończony niepowodzeniem
- 📦 **Zarchiwizowany** - Zakończony, zapisany do historii

---

## 📊 Statystyki

**Aktualne liczby** (aktualizuj przy każdej zmianie):

- **Łącznie eksperymentów**: 0
- **Aktywnych**: 0
- **W budowie**: 0
- **Zarchiwizowanych**: 0
- **Wykorzystane Cloudflare Workers**: 0/100 (free tier limit)
- **Wykorzystane Cloudflare Pages**: 0/500 (free tier limit)

---

## 🔧 Przydatne Komendy

### Lista wszystkich eksperymentów:
```powershell
Get-ChildItem -Path "Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty" -Directory -Exclude "_SZABLON" | Select-Object Name
```

### Sprawdź size projektu:
```powershell
Get-ChildItem -Path ".\nazwa-projektu" -Recurse | Measure-Object -Property Length -Sum | Select-Object Count, @{Name="SizeMB";Expression={[math]::Round($_.Sum / 1MB, 2)}}
```

### Lista deploymentów Cloudflare:
```powershell
# Pages projects
wrangler pages project list | Select-String "mybonzo-EXP"

# Workers
wrangler deployments list | Select-String "mybonzo-EXP"
```

---

## 📚 Dokumentacja Globalna

### W tym folderze:
- `README_EKSPERYMENTY.md` - Przegląd foldera eksperymentów
- `_SZABLON/INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md` - Instrukcja wdrożenia
- `_SZABLON/QUICK_REFERENCE.md` - Szybka ściągawka
- `INDEX.md` - Ten plik (index wszystkich projektów)

### Źródło (KONFIG_PODPROJEKT):
- `Q:\mybonzo\mybonzoAIblog\public\KONFIG_PODPROJEKT\README.md`
- `Q:\mybonzo\mybonzoAIblog\public\KONFIG_PODPROJEKT\STEP_BY_STEP_GUIDE.md`
- `Q:\mybonzo\mybonzoAIblog\public\KONFIG_PODPROJEKT\TERMINAL_COMMANDS.md`
- `Q:\mybonzo\mybonzoAIblog\public\KONFIG_PODPROJEKT\TROUBLESHOOTING.md`

---

## 🔄 Proces Archiwizacji

Przed usunięciem nieudanego eksperymentu:

### 1. Zapisz wnioski:
```markdown
## Eksperyment: nazwa-projektu
**Data**: 1 listopada 2025
**Cel**: [Opisz co chciałeś osiągnąć]
**Wynik**: [Co się udało/nie udało]
**Wnioski**: [Czego się nauczyłeś]
**Przyczyna zakończenia**: [Dlaczego projekt został zamknięty]
```

### 2. Cleanup Cloudflare:
```powershell
# Usuń Pages projects
wrangler pages project delete mybonzo-EXP-nazwa-main
wrangler pages project delete mybonzo-EXP-nazwa-subpage

# Usuń Worker
wrangler delete mybonzo-EXP-nazwa-proxy

# Usuń custom domain w Dashboard:
# Workers & Pages → Settings → Triggers → Remove Custom Domain
```

### 3. Backup lokalny (opcjonalnie):
```powershell
# Compress do .zip
Compress-Archive -Path ".\nazwa-projektu" -DestinationPath ".\ARCHIVE\nazwa-projektu_$(Get-Date -Format 'yyyyMMdd').zip"

# Usuń folder
Remove-Item -Recurse -Force ".\nazwa-projektu"
```

### 4. Zaktualizuj INDEX.md:
- Przenieś wpis z "Aktywne" do "Archiwalne"
- Dodaj przyczynę archiwizacji
- Zaktualizuj statystyki

---

## 🎓 Best Practices

### ✅ DO:
1. **Dokumentuj od razu** - Dodaj README w folderze projektu
2. **Testuj lokalnie** - `npm run preview` przed deploymentem
3. **Monitoruj logi** - `wrangler tail` po deploymencie
4. **Aktualizuj INDEX** - Po każdym nowym projekcie
5. **Używaj prefiksu** - `mybonzo-EXP-` dla wszystkich nazw

### ❌ NIE:
1. **Nie commituj sekretów** - `.dev.vars` w .gitignore
2. **Nie używaj prod domen** - Subdomeny eksperymentalne tylko
3. **Nie zapomnij cleanup** - Usuń nieudane projekty
4. **Nie duplikuj nazw** - Każdy projekt unikalna nazwa
5. **Nie edytuj `_SZABLON`** - Zawsze kopiuj najpierw

---

## 🚨 Limity Free Tier Cloudflare

**Sprawdzaj regularnie!**

| Resource | Limit | Aktualne użycie |
|----------|-------|-----------------|
| Workers | 100,000 req/day | - |
| Workers (unique scripts) | 100 | 0 |
| Pages (projects) | 500 | 0 |
| Pages (bandwidth) | Unlimited | - |
| R2 Storage | 10 GB | - |
| D1 Database | 5 GB | - |
| KV Storage | 1 GB | - |

**Dashboard**: https://dash.cloudflare.com → Account Home → Usage

---

## 📞 Kontakt i Pomoc

### Problem z szablonem?
→ Sprawdź `_SZABLON/INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md` → Sekcja "Rozwiązywanie Problemów"

### Problem z deploymentem?
→ `Q:\mybonzo\mybonzoAIblog\public\KONFIG_PODPROJEKT\TROUBLESHOOTING.md`

### Ogólne pytania?
→ Pełna dokumentacja w `KONFIG_PODPROJEKT/`

---

## 📅 Historia Zmian

| Data | Zmiana | Autor |
|------|--------|-------|
| 1 listopada 2025 | Utworzenie INDEX.md i struktury foldera | AI Assistant |
| 1 listopada 2025 | Dodanie szablonu `_SZABLON` z pełną dokumentacją | AI Assistant |
| - | - | - |

---

**Aktualizuj ten plik przy każdej zmianie w eksperymentach!** 📝
