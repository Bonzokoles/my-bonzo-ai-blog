# GitHub Actions Workflows

System automatycznego deploymentu i utrzymywania strony MyBonzo AI Blog w aktywności.

---

## 🔔 WAŻNE AKTUALIZACJE (2026-01-11)

### Nowe funkcje w `deploy.yml`:
- ✅ **Weryfikacja build output** - sprawdzanie krytycznych plików przed deployem
- ✅ **Automatyczne czyszczenie cache** - cache Cloudflare jest czyszczony natychmiast po deploy
- ✅ **Weryfikacja live URLs** - potwierdzenie dostępności plików po deploymencie
- ✅ **NPM cache** - szybsze buildy dzięki cachowaniu dependencies
- ✅ **Fail-fast strategy** - deploy zatrzymuje się przy błędach

### Pozostałe aktualizacje:
- ✅ **Dodano automatyczne czyszczenie cache Cloudflare** - nowy workflow `cloudflare-cache-purge.yml`
- ✅ Cache jest teraz automatycznie czyszczony po każdym udanym wdrożeniu
- 🎯 **Możliwość ręcznego czyszczenia** przez interfejs GitHub Actions

## 🔔 WAŻNE AKTUALIZACJE (2026-01-09)

- ✅ **Przeprowadzono pełną analizę** ustawień GitHub Actions
- ⚠️ **Emergency Keep-Alive WYŁĄCZONY** - zużywał zbyt dużo minut Actions
- 📊 **Obecne zużycie:** ~1,200-1,780 min/miesiąc (w limicie 2,000)
- 📚 **Nowa dokumentacja:** Zobacz [`SETTINGS_QUICK_REFERENCE.md`](./SETTINGS_QUICK_REFERENCE.md) i [`GITHUB_ACTIONS_ANALYSIS.md`](../../GITHUB_ACTIONS_ANALYSIS.md)

---

## 📁 Pliki Workflow

### 0. `deploy.yml` - **GŁÓWNY DEPLOYMENT WORKFLOW** 🚀 **[ZAKTUALIZOWANY]**
- **Użycie**: Automatyczny deployment przy każdym push do `main`
- **Trigger**: 
  - Push do `main`
  - Ręczny: `workflow_dispatch`
  - Scheduled: Co 6 godzin (keep-alive)
- **Funkcje**:
  - ✅ Build projektu Astro z cache npm (szybsze buildy)
  - ✅ **Weryfikacja krytycznych plików SEO** przed deployem
  - ✅ Deploy do Cloudflare Pages
  - ✅ **Automatyczne czyszczenie cache Cloudflare**
  - ✅ **Weryfikacja live URLs** (sprawdza czy pliki są dostępne)
  - ✅ Prefetch zasobów
  - ✅ Health check
- **Krytyczne pliki SEO weryfikowane**:
  - `robots.txt` - instrukcje dla crawlerów
  - `sitemap-pumo.xml` - mapa strony dla wyszukiwarek
  - `llms.txt` - manifest dla AI crawlerów (ChatGPT, Perplexity)
  - `8f9a2d4e6b1c3a5d7e9f0a2b4c6d8e0f.txt` - klucz weryfikacyjny IndexNow
  - `.well-known/` - katalog AI metadata
- **Fail-fast strategy**:
  - ❌ Brak krytycznych plików → STOP (deploy przerwany)
  - ❌ Deploy failed → STOP
  - ⚠️ Cache clear failed → WARNING (kontynuuj)
  - ❌ Live URLs failed → STOP (sprawdź ręcznie)
- **Wymagane secrets**: 
  - `CLOUDFLARE_API_TOKEN` - token API Cloudflare (wymagane)
  - `CLOUDFLARE_ACCOUNT_ID` - ID konta Cloudflare (wymagane)
  - `CLOUDFLARE_ZONE_ID` - ID strefy DNS (wymagane dla cache purge)

### 1. `cloudflare-cache-purge.yml` - **CZYSZCZENIE CACHE** 🧹
- **Użycie**: Ręczne czyszczenie cache (bez pełnego deployu)
- **Trigger**: 
  - Automatyczny: Po udanym wdrożeniu (`deployment_status: success`) - **może nie działać z wrangler**
  - Ręczny: Przez interfejs GitHub Actions (zalecane)
- **Funkcje**:
  - Pełne czyszczenie cache Cloudflare
  - Weryfikacja powodzenia operacji
  - Cache warming po wyczyszczeniu
  - Szczegółowe logowanie
- **Kiedy używać**:
  - Zmiany tylko w treści (bez rebuildu)
  - Debug problemów z cache
  - Emergency cache clear
- **Jak uruchomić ręcznie**:
  1. GitHub → Actions → "Clear Cloudflare Cache"
  2. Run workflow → Run
- **Wymagane secrets**: `CLOUDFLARE_ZONE_ID`, `CLOUDFLARE_API_TOKEN`
- **Uwaga**: Główny deployment (`deploy.yml`) czyści cache automatycznie, więc ten workflow jest potrzebny tylko do ręcznych interwencji

### 2. `keep-alive.yml` - **KEEP-ALIVE WORKFLOW** ⭐
- **Użycie**: Codzienna podstawowa aktywność
- **Częstotliwość**: 
  - Co 10 minut (6:00-22:00 UTC)
  - Co 30 minut (22:00-6:00 UTC)
- **Funkcje**:
  - Ping głównych URL-i
  - Sprawdzanie API endpoints
  - Symulacja aktywności użytkownika

### 2. `keep-alive.yml` - **KEEP-ALIVE WORKFLOW** ⭐
- **Użycie**: Codzienna podstawowa aktywność
- **Częstotliwość**: 
  - Co 10 minut (6:00-22:00 UTC)
  - Co 30 minut (22:00-6:00 UTC)
- **Funkcje**:
  - Ping głównych URL-i
  - Sprawdzanie API endpoints
  - Symulacja aktywności użytkownika

### 3. `advanced-monitoring.yml` - **MONITORING ZAAWANSOWANY** 🔍  
- **Użycie**: Dogłębne sprawdzanie zdrowia strony
- **Częstotliwość**:
  - Co godzinę w dzień (6:00-22:00 UTC)
  - Co 2 godziny w nocy
- **Funkcje**:
  - Health check z retry logic
  - Testy wydajności
  - Cache warming
### 3. `advanced-monitoring.yml` - **MONITORING ZAAWANSOWANY** 🔍  
- **Użycie**: Dogłębne sprawdzanie zdrowia strony
- **Częstotliwość**:
  - Co godzinę w dzień (6:00-22:00 UTC)
  - Co 2 godziny w nocy
- **Funkcje**:
  - Health check z retry logic
  - Testy wydajności
  - Cache warming
  - Szczegółowe raporty

### 4. `auto-index.yml` - **AUTO-INDEXING** 🔎
- **Użycie**: Automatyczne powiadamianie wyszukiwarek o nowych/zaktualizowanych stronach
- **Trigger**: Push do `main` lub ręczny
- **Funkcje**:
  - Powiadomienia do Google Search Console
  - Powiadomienia do Bing Webmaster Tools
  - IndexNow API calls

### 5. `emergency-keep-alive.yml` - **TRYB AWARYJNY** 🚨
- **Status**: ❌ **WYŁĄCZONY (2026-01-09)** - oszczędność minut Actions
- **Użycie**: Tylko w przypadku krytycznych problemów z usypianiem
- **Częstotliwość**: Co 5 minut (24/7) - **288 razy dziennie!**
- **⚠️ UWAGA**: Zużywa ~43,200 minut/miesiąc - ponad 20x limit!
- **Lokalizacja**: `emergency-keep-alive.yml.disabled`
- **Szczegóły**: Zobacz [`README_EMERGENCY_DISABLED.md`](./README_EMERGENCY_DISABLED.md)

---

## 🔐 Wymagane GitHub Secrets

Aby wszystkie workflow-y działały poprawnie, musisz ustawić następujące secrets w:
**Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Gdzie znaleźć | Wymagane dla | Status |
|------------|---------------|--------------|--------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare Dashboard → My Profile → API Tokens → Create Token | deploy.yml, cache-purge | ✅ Wymagane |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Dashboard → Overview → Account ID (prawy panel) | deploy.yml | ✅ Wymagane |
| `CLOUDFLARE_ZONE_ID` | Cloudflare Dashboard → mybonzoaiblog.com → Overview → Zone ID (prawy panel) | deploy.yml, cache-purge | ✅ Wymagane |

### Jak ustawić Cloudflare API Token:
1. Zaloguj się do Cloudflare Dashboard
2. Przejdź do **My Profile → API Tokens**
3. Kliknij **Create Token**
4. Użyj szablonu **"Edit Cloudflare Workers"** lub stwórz custom token z uprawnieniami:
   - Account: Cloudflare Pages (Edit)
   - Zone: Cache Purge (Purge)
   - Zone: Zone (Read)
5. Skopiuj token (będzie pokazany tylko raz!)
6. Dodaj go jako `CLOUDFLARE_API_TOKEN` w GitHub Secrets

---

## 🚀 Deployment Process (deploy.yml)

Workflow `deploy.yml` wykonuje następujące kroki w kolejności:

### 1. **Build Phase**
- Checkout kodu z repository
- Setup Node.js 20 z npm cache
- Instalacja dependencies (`npm ci`)
- Build Astro (`npm run build`)

### 2. **Verification Phase** ✨ NOWE
- **Weryfikacja build output** - sprawdza czy krytyczne pliki istnieją w `dist/`:
  - `robots.txt` - instrukcje dla crawlerów
  - `sitemap-pumo.xml` - mapa strony
  - `llms.txt` - manifest dla AI botów
  - `8f9a2d4e6b1c3a5d7e9f0a2b4c6d8e0f.txt` - klucz IndexNow
  - `.well-known/` - katalog z AI metadata
- **Fail-fast**: Jeśli którykolwiek plik brakuje, deployment STOP ❌

### 3. **Deploy Phase**
- Deploy `dist/` do Cloudflare Pages przez `wrangler`
- Automatyczne przypisanie do production environment

### 4. **Cache Management Phase** ✨ NOWE
- **Automatyczne czyszczenie cache Cloudflare**:
  - Purge entire cache dla całej strefy
  - Zapewnia, że crawlery widzą najnowsze pliki
  - Jeśli `CLOUDFLARE_ZONE_ID` nie jest ustawione → WARNING (kontynuuj)
  - Jeśli cache purge failuje → WARNING (kontynuuj)

### 5. **Live Verification Phase** ✨ NOWE
- **Weryfikacja live URLs** - sprawdza dostępność przez HTTP:
  - `https://mybonzoaiblog.pages.dev/robots.txt`
  - `https://mybonzoaiblog.pages.dev/sitemap-pumo.xml`
  - `https://mybonzoaiblog.pages.dev/llms.txt`
  - `https://mybonzoaiblog.pages.dev/8f9a2d4e6b1c3a5d7e9f0a2b4c6d8e0f.txt`
- Czeka 15 sekund na propagację cache
- **Fail-fast**: Jeśli którykolwiek URL zwraca 4xx/5xx → STOP ❌

### 6. **Post-Deploy Phase**
- Prefetch critical paths (cache warming)
- Health check API endpoint
- Ignoruje błędy (non-blocking)

### Fail-Fast Strategy 🛡️

Deployment zostanie **przerwany** (exit 1) w przypadku:
- ❌ Brak któregokolwiek krytycznego pliku w build output
- ❌ Wrangler deploy failuje
- ❌ Live URL verification failuje (HTTP 4xx/5xx)

Deployment **kontynuuje** mimo:
- ⚠️ Cache purge failuje (stary cache może pozostać)
- ⚠️ Prefetch failuje
- ⚠️ Health check failuje

---

## 🎯 Monitored URLs

Wszystkie workflow-y sprawdzają:
- `https://mybonzoaiblog.pages.dev` (główny)
- `https://www.mybonzoaiblog.com` (custom domain)
- `https://mybonzoaiblog.com` (bez www)

## ⚙️ Zarządzanie

### Włączanie/Wyłączanie workflow-ów:

1. **Aby wyłączyć workflow**:
   ```bash
   # Zmień nazwę pliku (GitHub ignoruje pliki bez .yml/.yaml)
   git mv .github/workflows/emergency-keep-alive.yml .github/workflows/emergency-keep-alive.yml.disabled
   ```

2. **Aby włączyć z powrotem**:
   ```bash  
   git mv .github/workflows/emergency-keep-alive.yml.disabled .github/workflows/emergency-keep-alive.yml
   ```

### Ręczne uruchomienie:
- Idź na GitHub → Actions → wybierz workflow → "Run workflow"

## 📊 Monitoring wyników:
- GitHub Actions → zakładka "Actions" w repo
- Sprawdzaj logi dla błędów i problemów z dostępnością

## 🔧 Konfiguracja

### Zmiana częstotliwości:
Edytuj sekcję `cron` w plikach .yml:
```yaml
schedule:
  - cron: '*/10 * * * *'  # Co 10 minut
  - cron: '0 */2 * * *'   # Co 2 godziny  
```

### Dodawanie nowych URL-i:
Edytuj tablice `urls` w workflow-ach:
```bash
urls=(
  "https://mybonzoaiblog.pages.dev"
  "https://twoj-nowy-url.com"
)
```

## 💡 Zalecenia

1. **Start z podstawowym**: Używaj tylko `keep-alive.yml` 
2. **Dodaj monitoring**: Włącz `advanced-monitoring.yml` jeśli potrzebujesz szczegółów
3. **Tryb awaryjny**: Używaj `emergency-keep-alive.yml` tylko w kryzysie
4. **Obserwuj koszty**: Sprawdzaj zużycie minut GitHub Actions

## 🛠️ Troubleshooting

### Jeśli strona nadal zasypia:
1. Sprawdź logi workflow-ów na błędy
2. Zwiększ częstotliwość pingowania  
3. Dodaj więcej endpoint-ów do pingowania
4. Włącz tryb awaryjny tymczasowo

### Jeśli workflow-y nie działają:
1. Sprawdź czy są włączone w Settings → Actions
2. Upewnij się że repo ma włączone GitHub Actions
3. Sprawdź uprawnienia workflow-ów w Settings → Actions → General

## 📅 Harmonogram UTC vs Lokalny

- UTC 6:00 = 8:00 PL (zimą) / 9:00 PL (latem)  
- UTC 22:00 = 00:00 PL (zimą) / 01:00 PL (latem)

Dostosuj czasy w `cron` według potrzeb lokalnego ruchu.