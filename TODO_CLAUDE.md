# TODO dla Claude - MyBonzo AI Blog

## Priorytet 1: Testy i Weryfikacja ✅

### Generator Grafiki
- [x] Zdeployowano nową wersję: https://ee304a89.gemini-ai-generator.pages.dev
- [x] Status HTTP: 200 OK ✅
- [x] Otwarty w przeglądarce do manualnych testów
- [ ] Przetestować wszystkie funkcje (wymaga manualnej interakcji):
  - [ ] Generowanie Obrazów (różne aspect ratio)
  - [ ] Edycja Obrazów
  - [ ] Analiza Obrazów
  - [ ] Generowanie Video
  - [ ] Kontynuacja Video
- [ ] Sprawdzić czy polskie znaki wyświetlają się poprawnie
- [ ] Zweryfikować działanie na mobile

### AI Chat
- [x] Strona istnieje: https://mybonzoaiblog.pages.dev/system/ai-chat
- [x] Status HTTP: 200 OK ✅
- [x] Otwarty w przeglądarce do manualnych testów
- [x] Modele zdefiniowane: Gemma 3 12B IT, Qwen QWQ 32B, Phi-2, OpenChat 3.5
- [ ] Przetestować chat z różnymi modelami (wymaga manualnej interakcji)
- [ ] Sprawdzić responsywność
- [ ] Zweryfikować obsługę błędów API

## Priorytet 2: Integracje i Funkcjonalność

### Menu Nawigacji
- [x] Dodano "Generator Grafiki" do menu głównego
- [ ] Dodać ikony do menu (opcjonalnie)
- [ ] Rozważyć submenu dla narzędzi AI
- [ ] Dodać breadcrumbs na stronach systemowych

### System Kontroli Funkcji
- [x] Zmergowano FEATURE_CONTROL_SYSTEM
- [x] Przetestować `/api/features/health` - ❌ **500 ERROR - wymaga naprawy**
- [x] Przetestować `/api/features/validate` - ❌ **500 ERROR - wymaga naprawy**
- [ ] **NAPRAWIĆ**: Błędy 500 w feature control API (prawdopodobnie brakujące moduły w Cloudflare deployment)
- [ ] Dodać feature flags do istniejących API endpoints
- [ ] Dokumentacja użycia dla nowych funkcji

### API Endpoints
- [x] Naprawić `/api/ai/chat` - ✅ **DZIAŁA** (200 OK, zwraca {"status":"healthy","timestamp":"..."})
- [ ] Dodać rate limiting do API
- [ ] Zaimplementować error tracking (Sentry?)
- [ ] Dodać monitoring czasu odpowiedzi

## Priorytet 3: Cloudflare i DevOps

### Cleanup Cloudflare Pages
- [ ] Usunąć stare projekty:
  - [ ] `gemini-graph-generator` (nieużywany)
  - [ ] `gemini-graph-dobre` (stary)
- [ ] Zostawić tylko:
  - [x] `mybonzoaiblog` (blog główny)
  - [x] `gemini-ai-generator` (generator grafiki)

### GitHub Actions
- [x] Naprawiono health check (zwraca exit 0)
- [ ] Dodać notyfikacje Discord/Slack przy failed deployments
- [ ] Zoptymalizować cache dependencies
- [ ] Rozważyć preview deployments dla PR

### Environment Variables
- [x] CLOUDFLARE_API_TOKEN zaktualizowany
- [ ] Dodać SENTRY_DSN (jeśli używamy Sentry)
- [ ] Rotacja kluczy API co 90 dni (ustawić reminder)

## Priorytet 4: Content i SEO

### Strony Informacyjne
- [ ] Zaktualizować `/o-nas` z informacją o nowych narzędziach
- [ ] Utworzyć landing page dla Generator Grafiki na blogu
- [ ] Dodać tutorial "Jak używać AI Chat"
- [ ] Utworzyć stronę `/ai-tools` z przeglądem wszystkich narzędzi

### Blog Posts
- [ ] Post: "Jak stworzyliśmy Generator Grafiki AI"
- [ ] Post: "System kontroli funkcji - architektura"
- [ ] Post: "Integracja Google Gemini z blogiem"

### SEO
- [ ] Dodać meta descriptions do `/system/*` stron
- [ ] Zoptymalizować Open Graph images
- [ ] Sitemap - sprawdzić czy zawiera nowe strony
- [ ] robots.txt - zweryfikować konfigurację

## Priorytet 5: Performance i Optymalizacja

### Frontend
- [ ] Lazy loading dla komponentów React (generator)
- [ ] Code splitting w bundlu
- [ ] Optymalizacja fontów (Steelfish)
- [ ] Compress images w /public

### Backend
- [ ] Cache responses dla API endpoints (Cloudflare KV?)
- [ ] Optymalizacja cold starts
- [ ] Worker metrics - monitoring użycia

## Priorytet 6: Bezpieczeństwo

### API Security
- [ ] Rate limiting per IP
- [ ] CAPTCHA dla public endpoints (opcjonalnie)
- [ ] Input validation i sanitization
- [ ] CORS configuration review

### Secrets Management
- [ ] Audit wszystkich secrets w repo
- [ ] `.gitignore` - verify że `.env` jest excluded
- [ ] `.env.example` aktualny dla wszystkich projektów

## Priorytet 7: Dokumentacja

### Dokumentacja Techniczna
- [x] FEATURE_CONTROL_SYSTEM.md
- [x] FEATURE_CONTROL_QUICK_START.md
- [ ] API_DOCUMENTATION.md - wszystkie endpointy
- [ ] DEPLOYMENT_GUIDE.md - szczegółowy proces
- [ ] TROUBLESHOOTING.md - common issues

### Developer Guide
- [ ] Setup lokalnego środowiska (krok po kroku)
- [ ] Jak dodać nową funkcję
- [ ] Jak debugować problemy deployment
- [ ] Architecture decision records (ADRs)

## Backlog (Nice to Have)

### Features
- [ ] Dark/Light mode toggle zapisywany w localStorage
- [ ] Historia wygenerowanych obrazów (localStorage)
- [ ] Share button dla wygenerowanych grafik
- [ ] User authentication (opcjonalnie)

### Analytics
- [ ] Google Analytics / Plausible
- [ ] Heatmaps (Hotjar?)
- [ ] Error tracking dashboard
- [ ] API usage statistics

### Mobile
- [ ] PWA support
- [ ] Offline mode dla bloga
- [ ] Push notifications (opcjonalnie)

---

## Notes
- **Ostatni deployment bloga**: Działa, ale wymaga testów health checks
- **Generator Grafiki**: Nowy deployment live, trzeba przetestować
- **Workflow status**: Health checks poprawione, czekamy na następny deploy

## Quick Commands

```powershell
# Deploy generatora
cd Q:\mybonzo\mybonzoAIBLOG_COMONENTS\gemini-ai-generator
npm run build && npx wrangler pages deploy dist --project-name=gemini-ai-generator

# Deploy bloga (auto via GitHub Actions)
git push origin main

# Test local
npm run dev  # localhost:4321

# Check workflow status
gh run list --repo Bonzokoles/my-bonzo-ai-blog --limit 5
```
