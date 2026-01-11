# GitHub Actions - Quick Settings Reference

**Ostatnia aktualizacja:** 2026-01-11

## 🎯 Aktywne Workflow-y

| Workflow | Status | Częstotliwość | Cel |
|----------|--------|---------------|-----|
| deploy.yml | ✅ Active | On push/PR | Deployment pipeline |
| cloudflare-cache-purge.yml | ✅ Active | After deploy | Clear Cloudflare cache |
| keep-alive.yml | ✅ Active | 10-30 min | Keep site alive |
| advanced-monitoring.yml | ✅ Active | 1-2h | Health & performance |
| auto-index.yml | ✅ Active | 30 min | SEO indexing |
| emergency-keep-alive.yml | ❌ **DISABLED** | ~~5 min~~ | Emergency mode |

## 🔑 Wymagane Secrets

Skonfigurowane w: Settings → Secrets and variables → Actions

| Secret Name | Wymagane przez | Status |
|-------------|----------------|--------|
| `CLOUDFLARE_API_TOKEN` | deploy.yml, cloudflare-cache-purge.yml | ✅ Required |
| `CLOUDFLARE_ACCOUNT_ID` | deploy.yml | ✅ Required |
| `CLOUDFLARE_ZONE_ID` | cloudflare-cache-purge.yml | ✅ Required |

## 📊 Zużycie Actions Minutes (szacunkowe/miesiąc)

| Workflow | Wykonań | Czas | Minuty |
|----------|---------|------|--------|
| deploy.yml | ~30-60 | ~5 min | ~150-300 |
| cloudflare-cache-purge.yml | ~30-60 | <1 min | ~30-60* |
| keep-alive.yml | ~10,000 | <1 min | ~200-500* |
| advanced-monitoring.yml | ~360 | ~2 min | ~720 |
| auto-index.yml | ~1,440 | <1 min | ~100-200* |
| **RAZEM** | ~11,860 | - | **~1,200-1,780** |

*\* Keep-alive workflows używają minimalnych zasobów (tylko curl)*

### Porównanie z limitami:

- **Free tier:** 2,000 min/miesiąc
- **Obecne zużycie:** ~1,200-1,780 min/miesiąc
- **Margin:** ✅ W limicie (~10-40% bufforu)

## ⚙️ Ważne ustawienia repozytorium

### Settings → Actions → General

**Zalecane ustawienia:**

1. **Actions permissions:**
   - ✅ Allow all actions and reusable workflows

2. **Workflow permissions:**
   - ✅ Read repository contents and packages permissions
   - ⚠️ Rozważ: Read and write (dla PR comments w deploy.yml)

3. **Fork pull request workflows:**
   - ⚠️ Require approval for first-time contributors

## 🔐 Security Best Practices

### ✅ Zaimplementowane:
- Secrets używane przez environment variables
- No hardcoded credentials
- Minimum required workflows

### ⚠️ Do rozważenia:
1. Dodaj explicit `permissions:` do każdego workflow
2. Enable Dependabot dla Actions dependencies
3. Setup secret scanning
4. Regular token rotation

### Przykład permissions:

```yaml
# Dodaj na początku każdego workflow:
permissions:
  contents: read
  # Tylko w deploy.yml:
  pull-requests: write  # Dla PR comments
  deployments: write     # Dla production deploys
```

## 🚨 Troubleshooting

### Workflow nie działa?

1. **Sprawdź status:**
   - Idź do: Actions → Wybierz workflow
   - Sprawdź ostatnie wykonania

2. **Common issues:**
   - ❌ Brak secrets → Dodaj w Settings → Secrets
   - ❌ Syntax error → Sprawdź YAML formatting
   - ❌ Quota exceeded → Sprawdź zużycie minut

### Deployment fails?

1. **Check secrets:**
   ```bash
   # W Settings → Secrets sprawdź:
   - CLOUDFLARE_API_TOKEN
   - CLOUDFLARE_ACCOUNT_ID
   ```

2. **Check logs:**
   - Actions → deploy.yml → Najnowsze wykonanie
   - Kliknij failed step
   - Czytaj error message

3. **Manual deployment:**
   ```bash
   # Local test:
   npm ci
   npm run build
   npx wrangler pages deploy ./dist --project-name=mybonzoaiblog
   ```

### Keep-alive not working?

1. **Sprawdź czy włączony:**
   ```bash
   ls .github/workflows/keep-alive.yml  # Powinien istnieć
   ```

2. **Sprawdź logs:**
   - Actions → Keep Site Alive
   - Sprawdź HTTP response codes

3. **Test manually:**
   ```bash
   curl -I https://mybonzoaiblog.pages.dev
   # Powinno zwrócić 200 OK
   ```

## 📞 Szybkie komendy

### Ręczne czyszczenie cache Cloudflare:
1. Idź do: Actions
2. Wybierz "Clear Cloudflare Cache" z lewej
3. Kliknij "Run workflow"
4. (Opcjonalnie) Podaj powód w polu "Reason for manual cache purge"
5. Kliknij "Run workflow"

**Kiedy używać:**
- Po wdrożeniu ważnych zmian, które muszą być natychmiast widoczne
- Gdy automatyczne czyszczenie nie zadziałało
- Podczas testowania nowych funkcji na produkcji

### Ręczne uruchomienie workflow:
1. Idź do: Actions
2. Wybierz workflow z lewej
3. Kliknij "Run workflow"
4. Wybierz branch (zazwyczaj `main`)
5. Kliknij "Run workflow"

### Wyłączenie workflow:
```bash
cd .github/workflows
git mv nazwa-workflow.yml nazwa-workflow.yml.disabled
git commit -m "Disable workflow: nazwa"
git push
```

### Włączenie workflow:
```bash
cd .github/workflows
git mv nazwa-workflow.yml.disabled nazwa-workflow.yml
git commit -m "Enable workflow: nazwa"
git push
```

## 🔗 Przydatne linki

- **Actions dashboard:** https://github.com/Bonzokoles/my-bonzo-ai-blog/actions
- **Settings:** https://github.com/Bonzokoles/my-bonzo-ai-blog/settings/actions
- **Secrets:** https://github.com/Bonzokoles/my-bonzo-ai-blog/settings/secrets/actions
- **Cloudflare Pages:** https://dash.cloudflare.com/

## 📖 Dokumentacja szczegółowa

Pełna analiza dostępna w: [`GITHUB_ACTIONS_ANALYSIS.md`](../../GITHUB_ACTIONS_ANALYSIS.md)

---

**Pytania?** Sprawdź pełną analizę lub utwórz issue w repo.
