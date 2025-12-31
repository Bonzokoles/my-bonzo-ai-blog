# 📋 Przewodnik Meble Pumo - Informacje dla Zespołu Technicznego

## 🌐 **Dostępność Przewodnika**

### URLs Przewodnika (wszystkie powinny działać):
1. **Główny index**: 
   - https://www.mybonzoaiblog.com/pumo-guide/
   - https://mybonzoaiblog.com/pumo-guide/
   - https://mybonzo-ai-blog.pages.dev/pumo-guide/

2. **Chatbot AI (DeepSeek R1)**:
   - https://www.mybonzoaiblog.com/pumo-guide/agent
   - Endpoint API: https://www.mybonzoaiblog.com/api/pumo-chat

3. **Przykładowe przewodniki**:
   - https://www.mybonzoaiblog.com/pumo-guide/Biurka_Biurka_proste
   - https://www.mybonzoaiblog.com/pumo-guide/Fotele_Fotele_bujane
   - https://www.mybonzoaiblog.com/pumo-guide/Krzesła_Krzesła_do_jadalni

---

## 📊 **Zawartość Przewodnika**

### Statystyki:
- **63 przewodniki zakupowe** (pliki .md w `/src/pages/pumo-guide/`)
- **65 wygenerowanych stron HTML** w `dist/pumo-guide/`
- **Wszystkie kategorie mebli** z www.meblepumo.pl

### Kategorie:
- Biurka (5 podkategorii)
- Fotele (7 podkategorii)
- Krzesła (3 podkategorii)
- Komody (3 podkategorii)
- Łóżka i materace
- Sofy i narożniki
- Stoły i stoliki
- Szafy i regały
- I wiele więcej...

---

## 🔧 **Architektura Techniczna**

### Stack:
- **Framework**: Astro v5.16.6 (najnowszy)
- **Output**: Static (prerendered HTML)
- **Hosting**: Cloudflare Pages
- **API**: Cloudflare Workers (serverless)
- **AI**: DeepSeek R1 Reasoner (chatbot)

### Struktura plików:
```
src/pages/pumo-guide/
├── index.astro              # Lista wszystkich przewodników
├── agent.astro              # Chatbot AI
├── Biurka_Biurka_proste.md  # Przewodnik kategoria 1
├── Fotele_Fotele_bujane.md  # Przewodnik kategoria 2
└── ... (63 pliki .md total)

src/api/
└── pumo-chat.ts             # API endpoint dla chatbota

src/components/
├── PumoStructuredData.astro # Schema.org markup
├── PumoEnhancedSEO.astro    # Meta tagi SEO
└── PumoBreadcrumbs.astro    # Nawigacja okruszkowa

src/layouts/
└── PumoGuideLayout.astro    # Layout dla przewodników
```

---

## ✅ **SEO i Indeksacja**

### Schema.org Markup (na każdej stronie):
- ✅ Organization Schema (Meble Pumo)
- ✅ WebSite Schema
- ✅ BreadcrumbList Schema
- ✅ Article Schema
- ✅ Product Category Schema

### Meta tagi dla AI Crawlers:
```html
<meta name="product-source" content="https://www.meblepumo.pl">
<meta name="data-provider" content="Meble Pumo - www.meblepumo.pl">
<meta name="canonical-store" content="https://www.meblepumo.pl">
<meta name="AI:source" content="Meble Pumo (www.meblepumo.pl)">
<meta name="AI:data-origin" content="https://www.meblepumo.pl product catalog">
```

### Canonical Links:
- Każda strona linkuje do `https://www.meblepumo.pl`
- Breadcrumbs zaczynają się od www.meblepumo.pl
- CTA buttony kierują do sklepu

---

## 🤖 **Chatbot AI (DeepSeek R1)**

### Endpoint API:
- **URL**: `/api/pumo-chat`
- **Method**: POST
- **Request**:
```json
{
  "query": "Jakie biurka polecacie?",
  "context": "Strona główna przewodnika"
}
```

### Response:
```json
{
  "reply": "Polecam Biurko loftowe dąb złoty / czarne mat 110 cm B43 za 719 zł. Doskonały stosunek jakości do ceny..."
}
```

### Konfiguracja (Cloudflare Secrets):
- `DEEPSEEK_API_KEY` - klucz API DeepSeek (ustawiony w Cloudflare Dashboard)
- Model: `deepseek-reasoner` (najnowszy model reasoning)

---

## 🚀 **Deployment Process**

### GitHub Actions Workflow:
1. Commit do `main` branch
2. Automatyczny build: `npm run build`
3. Deploy do Cloudflare Pages
4. Propagacja przez CDN (2-5 minut)

### Ostatni deployment:
- **Commit**: `197d969` (security fixes + Astro 5.16.6)
- **Status**: ✅ Sukces
- **Data**: 30 grudnia 2025, 20:02

---

## 🔍 **Weryfikacja Dostępności**

### Testy które możecie wykonać:

1. **Strona główna przewodnika**:
```bash
curl -I https://www.mybonzoaiblog.com/pumo-guide/
# Powinno zwrócić: HTTP/2 200
```

2. **Pojedynczy przewodnik**:
```bash
curl -I https://www.mybonzoaiblog.com/pumo-guide/Biurka_Biurka_proste
# Powinno zwrócić: HTTP/2 200
```

3. **Chatbot API**:
```bash
curl -X POST https://www.mybonzoaiblog.com/api/pumo-chat \
  -H "Content-Type: application/json" \
  -d '{"query":"test","context":"test"}'
# Powinno zwrócić: {"reply":"..."}
```

4. **Agent page**:
```bash
curl -I https://www.mybonzoaiblog.com/pumo-guide/agent
# Powinno zwrócić: HTTP/2 200
```

---

## ❓ **Możliwe Problemy i Rozwiązania**

### Problem 1: "404 Not Found"
**Przyczyny**:
- DNS nie propagował się (czekaj 24-48h)
- Błędny routing w Cloudflare Pages
- Build zawierał błędy

**Rozwiązanie**:
1. Sprawdź Cloudflare Pages Dashboard > Deployments
2. Zweryfikuj czy ostatni deployment ma status "Success"
3. Sprawdź logi buildu czy nie ma błędów
4. Sprawdź czy katalog `dist/pumo-guide/` zawiera pliki HTML

### Problem 2: "ERR_NAME_NOT_RESOLVED"
**Przyczyny**:
- Domena nie jest poprawnie skonfigurowana w Cloudflare
- Custom domain nie został dodany w Pages

**Rozwiązanie**:
1. Cloudflare Dashboard > Pages > Custom Domains
2. Dodaj domenę: `www.mybonzoaiblog.com`
3. Zweryfikuj DNS records (CNAME do Pages)

### Problem 3: API endpoint zwraca błąd
**Przyczyny**:
- Brak DEEPSEEK_API_KEY w environment variables
- Worker nie został wdrożony

**Rozwiązanie**:
1. Cloudflare Dashboard > Pages > Settings > Environment Variables
2. Dodaj: `DEEPSEEK_API_KEY` = [klucz API]
3. Redeploy projektu

---

## 📞 **Kontakt i Wsparcie**

### Dla pytań technicznych:
1. **Sprawdź logi deployment**: Cloudflare Pages Dashboard
2. **Sprawdź build output**: GitHub Actions (zakładka Actions)
3. **Sprawdź worker logs**: Cloudflare Workers > Logs

### Jeśli strona nadal nie działa:
1. Potwierdźcie **dokładny URL** który testujecie
2. Sprawdźcie **kod błędu** (404, 500, DNS error?)
3. Sprawdźcie **Cloudflare Analytics** czy są requesty do /pumo-guide/
4. Sprawdźcie **czy build się powiódł** (GitHub Actions > latest workflow)

---

## ✅ **Checklist Weryfikacji**

- [ ] URL https://www.mybonzoaiblog.com/pumo-guide/ zwraca 200 OK
- [ ] Strona wyświetla listę 63 kategorii
- [ ] Kliknięcie w kategorię otwiera przewodnik
- [ ] Breadcrumbs linkują do www.meblepumo.pl
- [ ] CTA button "Odwiedź sklep Meble Pumo" działa
- [ ] Agent page (/agent) się ładuje
- [ ] Formularz czatu wyświetla się
- [ ] API /api/pumo-chat odpowiada (test przez agent page)

---

## 📝 **Notatki dla Zespołu Pro**

### Co to jest ten przewodnik?
To **Knowledge Base** dla Meble Pumo - 63 szczegółowe przewodniki zakupowe wygenerowane przez AI (system WHITECAT: GPT-4 + Claude) na podstawie katalogu produktów ze sklepu www.meblepumo.pl.

### Dlaczego to jest hostowane na mybonzoaiblog.com?
- Prezentacja możliwości AI content generation
- Demonstracja SEO + Schema.org dla e-commerce
- Baza wiedzy dla AI crawlerów (ChatGPT, Perplexity, Bing)
- Każda strona linkuje do oficjalnego sklepu www.meblepumo.pl

### Czy to konkurencja dla meblepumo.pl?
**NIE!** Każda strona:
- Ma canonical link do www.meblepumo.pl
- Zawiera CTA buttony do sklepu
- Wyraźnie wskazuje źródło: "Oficjalne Źródło: Meble Pumo"
- Zachęca do zakupu w www.meblepumo.pl

---

**Wersja dokumentu**: 1.0  
**Data**: 30 grudnia 2025  
**Status deployment**: ✅ Live Production  
**Build**: Astro 5.16.6, 0 vulnerabilities
