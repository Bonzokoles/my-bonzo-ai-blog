# Komendy Terminalowe - Quick Reference

## Setup Początkowy

### 1. Instalacja Wrangler CLI (globalnie)
```powershell
npm install -g wrangler

# Weryfikacja
wrangler --version
```

### 2. Login do Cloudflare
```powershell
# Opcja A: Interactive login (otwiera przeglądarkę)
wrangler login

# Opcja B: Użyj API token
$env:CLOUDFLARE_API_TOKEN = "twój-token-tutaj"
$env:CLOUDFLARE_ACCOUNT_ID = "twój-account-id-tutaj"
```

---

## Main App

### Development
```powershell
# Przejdź do katalogu
cd main-app

# Zainstaluj dependencies
npm install

# Development server (localhost:4321)
npm run dev

# Build production
npm run build

# Preview build lokalnie
npm run preview

# Astro check (TypeScript + błędy)
npm run check
```

### Deployment
```powershell
# Build + Deploy (jeden komenda)
npm run deploy

# Lub osobno:
npm run build
wrangler pages deploy ./dist --project-name=mybonzo-main-app

# Deploy z custom branch name
npm run build
wrangler pages deploy ./dist --project-name=mybonzo-main-app --branch=production

# Deploy + commit message
npm run build
wrangler pages deploy ./dist --project-name=mybonzo-main-app --commit-message="Version 1.0.0"
```

### Monitoring & Debug
```powershell
# Lista deploymentów
wrangler pages deployments list --project-name=mybonzo-main-app

# Szczegóły konkretnego deploymentu
wrangler pages deployment tail <deployment-id>

# Logs (real-time)
wrangler pages deployment tail --project-name=mybonzo-main-app

# Rollback do poprzedniej wersji
wrangler pages deployment rollback <deployment-id> --project-name=mybonzo-main-app
```

---

## Subpage

### Development
```powershell
cd subpage

npm install

# Dev server z custom portem (4322)
npm run dev

# Preview
npm run preview

npm run check
```

### Deployment
```powershell
# Deploy
npm run deploy

# Manual
npm run build
wrangler pages deploy ./dist --project-name=mybonzo-subpage

# Deploy production branch
npm run deploy:prod
```

### Test Base Path
```powershell
# Test czy wszystkie linki mają prefix /subpage/
npm run build

# Sprawdź outputed HTML
cat dist/index.html | Select-String "/subpage/"

# Powinny być ścieżki typu:
# <link href="/subpage/_astro/..." />
```

---

## Worker Proxy

### Development
```powershell
cd worker-proxy

npm install

# Dev server lokalnie (localhost:8787)
npm run dev

# Dev z custom port
wrangler dev index.js --port=9000
```

### Deployment
```powershell
# Deploy worker
npm run deploy

# Deploy do production environment
npm run deploy:prod

# Deploy z custom name
wrangler deploy index.js --name=my-custom-proxy
```

### Monitoring
```powershell
# Real-time logs (tail)
npm run logs
# lub
wrangler tail mybonzo-proxy-worker

# Filtruj tylko errors
wrangler tail mybonzo-proxy-worker --status error

# Filtruj po HTTP method
wrangler tail mybonzo-proxy-worker --method POST

# Format JSON
wrangler tail mybonzo-proxy-worker --format json

# Zapisz logi do pliku
wrangler tail mybonzo-proxy-worker > logs.txt
```

### Testing
```powershell
# Test health endpoint
curl http://localhost:8787/_proxy-health

# Test routing lokalnie
curl http://localhost:8787/
# → powinien proxy do main app

curl http://localhost:8787/subpage/
# → powinien proxy do subpage

# Test w produkcji
curl https://example.com/_proxy-health

curl -I https://example.com/
# Sprawdź header: X-Proxy-Route: Main App

curl -I https://example.com/subpage/
# Sprawdź header: X-Proxy-Route: Subpage: /subpage/
```

---

## Zarządzanie Secrets

### Development (.dev.vars)
```powershell
# Utwórz .dev.vars lokalnie (NIE commituj!)
echo "MY_SECRET=test-value" > .dev.vars
echo "API_KEY=local-key" >> .dev.vars

# Test z secrets
wrangler dev index.js
# Worker będzie miał dostęp do env.MY_SECRET
```

### Production (Wrangler Secrets)
```powershell
# Dodaj secret do worker
wrangler secret put MY_SECRET
# Wpisz wartość w prompt

# Lista secrets (tylko nazwy, nie wartości!)
wrangler secret list

# Usuń secret
wrangler secret delete MY_SECRET

# Dla Pages projektu
wrangler pages secret put MY_SECRET --project-name=mybonzo-main-app
wrangler pages secret list --project-name=mybonzo-main-app
```

---

## KV Storage (Jeśli używasz)

### Zarządzanie Namespace
```powershell
# Utwórz KV namespace
wrangler kv:namespace create "CACHE"
# Zapisz ID do wrangler.jsonc

# Lista namespace
wrangler kv:namespace list

# Delete namespace
wrangler kv:namespace delete --namespace-id=<id>
```

### Zarządzanie Kluczami
```powershell
# Dodaj klucz-wartość
wrangler kv:key put "my-key" "my-value" --namespace-id=<id>

# Pobierz wartość
wrangler kv:key get "my-key" --namespace-id=<id>

# Lista kluczy
wrangler kv:key list --namespace-id=<id>

# Usuń klucz
wrangler kv:key delete "my-key" --namespace-id=<id>

# Bulk operations
wrangler kv:bulk put data.json --namespace-id=<id>
wrangler kv:bulk delete keys.json --namespace-id=<id>
```

---

## Multi-Project Deploy

### Deploy wszystkich projektów (lokalnie)
```powershell
# Build i deploy wszystko
# Main App
cd main-app && npm run build && wrangler pages deploy ./dist --project-name=mybonzo-main-app

# Subpage
cd ../subpage && npm run build && wrangler pages deploy ./dist --project-name=mybonzo-subpage

# Worker Proxy
cd ../worker-proxy && wrangler deploy index.js

# Powrót do root
cd ..
```

### Lub użyj PowerShell script
```powershell
# Utwórz deploy-all.ps1
@"
Write-Host "🚀 Deploying all projects..." -ForegroundColor Green

# Main App
Write-Host "`n📦 Building Main App..." -ForegroundColor Yellow
Set-Location main-app
npm run build
wrangler pages deploy ./dist --project-name=mybonzo-main-app
Set-Location ..

# Subpage
Write-Host "`n📦 Building Subpage..." -ForegroundColor Yellow
Set-Location subpage
npm run build
wrangler pages deploy ./dist --project-name=mybonzo-subpage
Set-Location ..

# Worker
Write-Host "`n📦 Deploying Worker..." -ForegroundColor Yellow
Set-Location worker-proxy
wrangler deploy index.js
Set-Location ..

Write-Host "`n✅ All projects deployed!" -ForegroundColor Green
"@ | Out-File -FilePath deploy-all.ps1

# Uruchom
.\deploy-all.ps1
```

---

## Git & GitHub Actions

### Lokalne komendy Git
```powershell
# Dodaj wszystko
git add .

# Commit
git commit -m "feat: add new feature"

# Push (triggertuje GitHub Actions jeśli skonfigurowane)
git push origin main

# Tag release
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
# → triggertuje workflow "Deploy All Projects"
```

### GitHub CLI (opcjonalnie)
```powershell
# Zainstaluj GitHub CLI
winget install GitHub.cli

# Login
gh auth login

# Trigger manual workflow
gh workflow run "Deploy Main App"

# Lista workflow runs
gh run list --workflow="Deploy Main App"

# Zobacz logi ostatniego run
gh run view --log

# Cancel running workflow
gh run cancel <run-id>

# Re-run failed workflow
gh run rerun <run-id>
```

---

## Diagnostyka i Debug

### Sprawdź wersje
```powershell
node --version        # v18+
npm --version
wrangler --version    # 3.x
astro --version       # 5.x
```

### Network debug
```powershell
# Test SSL certificate
curl -v https://example.com 2>&1 | Select-String "SSL\|certificate"

# Test response time
Measure-Command { curl https://example.com }

# Test różnych endpoints
curl https://example.com/ -I
curl https://example.com/subpage/ -I
curl https://example.com/_proxy-health

# Test z custom headers
curl -H "User-Agent: TestBot/1.0" https://example.com/
```

### Build debug
```powershell
# Clear cache i rebuild
cd main-app
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force dist
Remove-Item -Recurse -Force .astro
npm install
npm run build

# Debug build errors
npm run build -- --verbose

# Check TypeScript errors
npm run check -- --verbose
```

### Worker debug
```powershell
# Test worker lokalnie z custom env vars
wrangler dev index.js --var LOG_LEVEL:debug

# Test z binding
wrangler dev index.js --kv CACHE

# Inspect bindings
wrangler worker info mybonzo-proxy-worker
```

---

## Cleanup i Maintenance

### Usuń stare deploymenty
```powershell
# Lista deploymentów (sortuj po dacie)
wrangler pages deployments list --project-name=mybonzo-main-app

# Usuń konkretny deployment
wrangler pages deployment delete <deployment-id> --project-name=mybonzo-main-app

# UWAGA: Nie usuwaj production deployment!
```

### Update dependencies
```powershell
# W każdym projekcie
cd main-app
npm outdated
npm update
npm audit fix

cd ../subpage
npm update

cd ../worker-proxy
npm update

# Update Astro do latest
npm install astro@latest @astrojs/cloudflare@latest
```

### Clean workspace
```powershell
# Usuń node_modules i dist we wszystkich projektach
Get-ChildItem -Path . -Recurse -Include node_modules,dist,.astro -Directory | 
    Remove-Item -Recurse -Force

# Reinstall wszystko
cd main-app && npm install
cd ../subpage && npm install
cd ../worker-proxy && npm install
```

---

## Performance Testing

### Lighthouse CI
```powershell
# Zainstaluj
npm install -g @lhci/cli

# Run Lighthouse
lhci autorun --collect.url=https://example.com

# Z custom config
lhci autorun --config=lighthouserc.json
```

### Load Testing
```powershell
# Zainstaluj Apache Bench (Windows)
# Lub użyj: https://github.com/wg/wrk

# Test 1000 requests, 10 concurrent
ab -n 1000 -c 10 https://example.com/

# Test POST endpoint
ab -n 100 -c 5 -p data.json -T application/json https://example.com/api/test
```

---

## Helpful Aliases (PowerShell Profile)

Dodaj do `$PROFILE` (otwórz: `notepad $PROFILE`):

```powershell
# Cloudflare aliases
function cf-login { wrangler login }
function cf-tail { wrangler tail mybonzo-proxy-worker }
function cf-deploy-all {
    Set-Location main-app; npm run deploy
    Set-Location ../subpage; npm run deploy
    Set-Location ../worker-proxy; npm run deploy
    Set-Location ..
}

# Project aliases
function dev-main { Set-Location main-app; npm run dev }
function dev-sub { Set-Location subpage; npm run dev }
function dev-worker { Set-Location worker-proxy; npm run dev }

# Git aliases
function gs { git status }
function ga { git add . }
function gc { param($msg) git commit -m $msg }
function gp { git push }
```

Użycie:
```powershell
# Zamiast: wrangler tail mybonzo-proxy-worker
cf-tail

# Zamiast: cd main-app && npm run dev
dev-main
```

---

**Ostatnia aktualizacja**: 2025-10-31  
**Wersja**: 1.0.0
