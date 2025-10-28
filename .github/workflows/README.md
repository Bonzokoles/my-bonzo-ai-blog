# GitHub Actions Keep-Alive System

System automatycznego utrzymywania strony MyBonzo AI Blog w aktywności.

## 📁 Pliki Workflow

### 1. `keep-alive.yml` - **GŁÓWNY WORKFLOW** ⭐
- **Użycie**: Codzienna podstawowa aktywność
- **Częstotliwość**: 
  - Co 10 minut (6:00-22:00 UTC)
  - Co 30 minut (22:00-6:00 UTC)
- **Funkcje**:
  - Ping głównych URL-i
  - Sprawdzanie API endpoints
  - Symulacja aktywności użytkownika

### 2. `advanced-monitoring.yml` - **MONITORING ZAAWANSOWANY** 🔍  
- **Użycie**: Dogłębne sprawdzanie zdrowia strony
- **Częstotliwość**:
  - Co godzinę w dzień (6:00-22:00 UTC)
  - Co 2 godziny w nocy
- **Funkcje**:
  - Health check z retry logic
  - Testy wydajności
  - Cache warming
  - Szczegółowe raporty

### 3. `emergency-keep-alive.yml` - **TRYB AWARYJNY** 🚨
- **Użycie**: Tylko w przypadku problemów z usypianiem
- **Częstotliwość**: Co 5 minut (24/7)
- **⚠️ UWAGA**: Zużywa dużo minut GitHub Actions!

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