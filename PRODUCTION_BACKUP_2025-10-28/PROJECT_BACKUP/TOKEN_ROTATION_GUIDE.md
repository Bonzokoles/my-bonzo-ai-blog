# 🔄 Przewodnik Rotacji Tokenów Cloudflare

**Data**: 2025-10-27
**Powód**: Token ujawniony w rozmowie
**Status**: 🔴 Wymaga wykonania

---

## KROK 1: Wygeneruj Nowy Token Cloudflare (Dashboard)

### Opcja A: Przez przeglądarkę (ZALECANE - 5 minut)

1. **Otwórz Cloudflare Dashboard:**
   ```
   https://dash.cloudflare.com/profile/api-tokens
   ```

2. **Znajdź stary token i kliknij "Roll"** (regenerate):
   - Szukaj tokenu który zaczyna się na: `[USUNIĘTO_ZE_WZGLĘDÓW_BEZPIECZEŃSTWA]`
   - Kliknij "Roll" aby wygenerować nowy
   - LUB kliknij "Delete" i stwórz nowy poniżej

3. **Jeśli tworzysz nowy token:**
   - Kliknij "Create Token"
   - Wybierz template: **"Edit Cloudflare Workers"**
   - Lub stwórz Custom Token z permissions:
     ```
     Account Permissions:
     ✅ Cloudflare Pages - Edit
     ✅ Workers R2 Storage - Edit
     ✅ Workers Scripts - Edit

     Zone Permissions:
     ✅ Workers Routes - Edit
     ✅ DNS - Edit (jeśli używasz custom domain)
     ```

4. **ZAPISZ NOWY TOKEN** (pojawi się tylko RAZ!):
   ```
   NOWY_TOKEN_TUTAJ - skopiuj i zapisz bezpiecznie
   ```

### Opcja B: Sprawdź przez CLI co masz

```bash
# Sprawdź aktualną konfigurację
wrangler whoami

# Pokaże:
# Account Name: Twoje konto
# Account ID: [USUNIĘTO_ZE_WZGLĘDÓW_BEZPIECZEŃSTWA]
```

**UWAGA**: CLI nie może usuwać/regenerować tokenów - tylko Dashboard!

---

## KROK 2: Zaktualizuj GitHub Secrets (3 minuty)

```bash
# Metoda 1: Przez przeglądarkę
# 1. Idź do: https://github.com/YOUR_USERNAME/mybonzoAIblog/settings/secrets/actions
# 2. Kliknij na "CLOUDFLARE_API_TOKEN"
# 3. Kliknij "Update"
# 4. Wklej NOWY token
# 5. Kliknij "Update secret"

# Metoda 2: Przez GitHub CLI (jeśli masz zainstalowane)
gh secret set CLOUDFLARE_API_TOKEN
# [Wprowadź nowy token gdy zostaniesz poproszony]
# [Naciśnij Ctrl+D aby zakończyć]
```

**Co zaktualizować:**
- ✅ `CLOUDFLARE_API_TOKEN` = [NOWY_TOKEN]
- ⚠️ `CLOUDFLARE_ACCOUNT_ID` = `[USUNIĘTO_ZE_WZGLĘDÓW_BEZPIECZEŃSTWA]` (może pozostać ten sam)

---

## KROK 3: Zaktualizuj Worker Secrets (5 minut)

```bash
# Przejdź do folderu workers
cd workers

# Ustaw token dla blog API
wrangler secret put BLOG_API_TOKEN
# [System zapyta: Enter a secret value:]
# [Wklej NOWY token Cloudflare]
# [Naciśnij Enter]

# Opcjonalnie: Jeśli używasz Cloudflare Images
wrangler secret put CF_IMAGES_API_TOKEN
# [System zapyta: Enter a secret value:]
# [Wklej NOWY token lub ten sam co BLOG_API_TOKEN]
# [Naciśnij Enter]

# Powrót do głównego folderu
cd ..
```

**Wynik:**
```
✅ Creating the secret for the Worker "mybonzo-blog-worker"
✅ Success! Uploaded secret BLOG_API_TOKEN
```

---

## KROK 4: Zaktualizuj Lokalny .env (2 minuty)

```bash
# Jeśli nie masz .env, skopiuj szablon
cp .env.example .env

# Edytuj .env
nano .env
# LUB
code .env
# LUB otwórz w notatniku
```

**Uzupełnij w .env:**
```env
# Blog API Configuration
PUBLIC_BLOG_API_URL=https://blog-api.mybonzo-ai-blog.pages.dev
BLOG_API_TOKEN=[NOWY_TOKEN_TUTAJ]

# Cloudflare Configuration
CLOUDFLARE_ACCOUNT_ID=[USUNIĘTO_ZE_WZGLĘDÓW_BEZPIECZEŃSTWA]
CLOUDFLARE_API_TOKEN=[NOWY_TOKEN_TUTAJ]

# Cloudflare Images (opcjonalnie)
CF_IMAGES_DELIVERY_URL=https://imagedelivery.net/YOUR_HASH
CF_IMAGES_API_TOKEN=[NOWY_TOKEN_TUTAJ]
```

**Zapisz i zamknij plik.**

---

## KROK 5: Weryfikacja (5 minut)

### Test 1: Sprawdź czy stary token NIE działa

```bash
# Powinien zwrócić błąd 401 lub 403
curl -H "Authorization: Bearer [USUNIĘTO_ZE_WZGLĘDÓW_BEZPIECZEŃSTWA]" \
  https://api.cloudflare.com/client/v4/user/tokens/verify
```

**Oczekiwany wynik (DOBRY):**
```json
{
  "success": false,
  "errors": [{"code": 6003, "message": "Invalid request headers"}]
}
```

### Test 2: Sprawdź czy nowy token DZIAŁA

```bash
# Zamień [NOWY_TOKEN] na twój nowy token
curl -H "Authorization: Bearer [NOWY_TOKEN]" \
  https://api.cloudflare.com/client/v4/user/tokens/verify
```

**Oczekiwany wynik (DOBRY):**
```json
{
  "success": true,
  "result": {
    "status": "active",
    ...
  }
}
```

### Test 3: Sprawdź Wrangler

```bash
cd workers

# Powinno pokazać twoje konto
wrangler whoami

# Oczekiwany wynik:
# Account Name: Stolarnia (lub twoja nazwa)
# Account ID: [USUNIĘTO_ZE_WZGLĘDÓW_BEZPIECZEŃSTWA]
```

### Test 4: Test Deployment

```bash
# Wróć do głównego folderu
cd ..

# Build projektu
npm run build

# Jeśli wszystko OK, możesz opcjonalnie przetestować deploy
# (NIE musisz, jeśli nie chcesz)
```

---

## KROK 6: Czyszczenie (2 minuty)

```bash
# Usuń pliki z wrażliwymi danymi
rm "⚠️_CRITICAL_SECURITY_WARNING.md"

# Pozostaw dokumentację
# - SECURITY_FIXES.md ✅ (historia zmian)
# - TOKEN_ROTATION_GUIDE.md ✅ (ten plik)
# - FONTS_CONFIGURATION.md ✅ (instrukcja fontów)
```

---

## ✅ CHECKLIST - CO WYKONAŁEŚ

Zaznacz po wykonaniu:

- [ ] 1. Wygenerowałem nowy token Cloudflare przez Dashboard
- [ ] 2. Zapisałem nowy token bezpiecznie
- [ ] 3. Zaktualizowałem GitHub Secret: CLOUDFLARE_API_TOKEN
- [ ] 4. Wykonałem `wrangler secret put BLOG_API_TOKEN` w folderze workers
- [ ] 5. Zaktualizowałem lokalny plik .env
- [ ] 6. Test 1: Stary token NIE działa ✅
- [ ] 7. Test 2: Nowy token DZIAŁA ✅
- [ ] 8. Test 3: `wrangler whoami` działa ✅
- [ ] 9. Test 4: `npm run build` działa ✅
- [ ] 10. Usunąłem plik CRITICAL_SECURITY_WARNING.md

---

## 🆘 Problemy?

### "wrangler: command not found"
```bash
npm install -g wrangler
```

### "Error 10000: Authentication error"
```bash
# Wyloguj i zaloguj ponownie
wrangler logout
wrangler login
```

### "Cannot find .env file"
```bash
# Nie ma problemu - .env jest opcjonalny dla development
# GitHub Secrets i wrangler secrets są ważniejsze
```

### Inne problemy
- Dokumentacja Cloudflare: https://developers.cloudflare.com/workers/wrangler/commands/
- Support: support@cloudflare.com

---

**CZAS WYKONANIA**: ~20 minut
**PRIORYTET**: 🔴 Krytyczny
**STATUS**: Oczekuje na wykonanie

---

## 📌 Po wykonaniu

Gdy skończysz, możesz usunąć ten plik lub zaznaczyć:

**✅ STATUS: WYKONANE - [DATA]**
