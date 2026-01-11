# 🚀 Cloudflare Deployment Setup - Instrukcja krok po kroku

## 📋 Wymagania wstępne

1. ✅ Płatny plan Cloudflare (masz na: stolarnia.ams@gmail.com)
2. ✅ Cloudflare API Token z uprawnieniami:
   - Account → Cloudflare Pages → Edit
   - Account → Workers KV Storage → Edit
   - Account → R2 Storage → Edit
   - Account → Queues → Edit
   - Account → Workers Scripts → Edit

---

## 🔑 Krok 1: Uzyskaj Cloudflare API Token

1. Przejdź do: https://dash.cloudflare.com/profile/api-tokens
2. Kliknij **"Create Token"**
3. Wybierz **"Create Custom Token"**
4. Skonfiguruj uprawnienia:
   ```
   Permissions:
   - Account → Cloudflare Pages → Edit
   - Account → Workers KV Storage → Edit
   - Account → R2 Storage → Edit
   - Account → Queues → Edit
   - Account → Workers Scripts → Edit
   - Account → Durable Objects → Edit
   - Zone → Zone → Read (opcjonalne, dla domain)
   ```
5. Kliknij **"Continue to summary"** → **"Create Token"**
6. **SKOPIUJ TOKEN** (nie będzie ponownie widoczny!)

---

## 🛠️ Krok 2: Ustaw zmienne środowiskowe

### Windows CMD:
```cmd
set CLOUDFLARE_API_TOKEN=<TWÓJ_TOKEN_TUTAJ>
set CLOUDFLARE_ACCOUNT_ID=<TWÓJ_ACCOUNT_ID>
```

### Windows PowerShell:
```powershell
$env:CLOUDFLARE_API_TOKEN="<TWÓJ_TOKEN_TUTAJ>"
$env:CLOUDFLARE_ACCOUNT_ID="<TWÓJ_ACCOUNT_ID>"
```

### Git Bash / Linux / macOS:
```bash
export CLOUDFLARE_API_TOKEN="<TWÓJ_TOKEN_TUTAJ>"
export CLOUDFLARE_ACCOUNT_ID="<TWÓJ_ACCOUNT_ID>"
```

> **💡 Znajdź swój Account ID:** Cloudflare Dashboard → prawy panel → API → Account ID

---

## 📦 Krok 3: Utwórz zasoby Cloudflare i zapisz ID

### 3.1 KV Namespaces (4 komendy)

```bash
npx wrangler kv:namespace create "SESSION"
```
**Wynik będzie wyglądał tak:**
```
✅ Success! Created KV namespace SESSION
 ID: abc123xyz456def789ghi012  ← SKOPIUJ TO!
```

➡️ **SKOPIUJ ID** i wklej w `wrangler.toml` sekcja SESSION: `id = "abc123xyz456def789ghi012"`

---

```bash
npx wrangler kv:namespace create "SESSION" --preview
```
➡️ **SKOPIUJ ID** i wklej w `wrangler.toml` sekcja SESSION: `preview_id = "..."`

---

```bash
npx wrangler kv:namespace create "CACHE"
```
➡️ **SKOPIUJ ID** i wklej w `wrangler.toml` sekcja CACHE: `id = "..."`

---

```bash
npx wrangler kv:namespace create "CACHE" --preview
```
➡️ **SKOPIUJ ID** i wklej w `wrangler.toml` sekcja CACHE: `preview_id = "..."`

---

### 3.2 R2 Bucket

```bash
npx wrangler r2 bucket create mybonzo-media
```
**Wynik:**
```
✅ Created bucket 'mybonzo-media'
```
✅ **Nic nie kopiuj** - nazwa bucketa już jest w `wrangler.toml`

---

```bash
npx wrangler r2 bucket create mybonzo-media-preview
```
✅ **Nic nie kopiuj** - nazwa bucketa już jest w `wrangler.toml`

---

## ✏️ Krok 4: Edytuj wrangler.toml

Otwórz `wrangler.toml` i **ZAMIEŃ 4 placeholdery**:

```toml
[[kv_namespaces]]
binding = "SESSION"
id = "<WKLEJ_SESSION_ID>"           # 👈 TUTAJ wklej pierwsze ID
preview_id = "<WKLEJ_SESSION_PREVIEW_ID>"  # 👈 TUTAJ wklej drugie ID

[[kv_namespaces]]
binding = "CACHE"
id = "<WKLEJ_CACHE_ID>"             # 👈 TUTAJ wklej trzecie ID
preview_id = "<WKLEJ_CACHE_PREVIEW_ID>"    # 👈 TUTAJ wklej czwarte ID
```

**Zapisz plik!**

---

## 🔐 Krok 5: Dodaj GitHub Secrets

1. Przejdź do: https://github.com/<TWÓJ_USERNAME>/mybonzoAIblog/settings/secrets/actions
2. Kliknij **"New repository secret"**
3. Dodaj dwa secrety:

**Secret 1:**
```
Name: CLOUDFLARE_API_TOKEN
Value: <WKLEJ_SWÓJ_TOKEN>
```

**Secret 2:**
```
Name: CLOUDFLARE_ACCOUNT_ID
Value: <TWÓJ_ACCOUNT_ID>
```

---

## 🧪 Krok 6: Test lokalny

```bash
# 1. Build projektu
npm run build

# 2. Test lokalny deployment
npx wrangler pages deploy ./dist --project-name=mybonzoaiblog
```

**Oczekiwany wynik:**
```
✨ Compiled Worker successfully
✨ Uploading...
✨ Deployment complete!
🌐 https://mybonzoaiblog.pages.dev
```

---

## 🚀 Krok 7: Deployment przez GitHub Actions

```bash
git add wrangler.toml CLOUDFLARE_SETUP.md
git commit -m "feat: Configure Cloudflare deployment with all resources"
git push origin main
```

Deployment automatycznie wystartuje przez GitHub Actions!

Monitor: `https://github.com/<TWÓJ_USERNAME>/mybonzoAIblog/actions`

---

## ✅ Post-Deploy Sanity Checks

Po udanym deployment wykonaj te testy:

### 1. Sprawdź autentykację
```bash
npx wrangler whoami
```
Powinno zwrócić Twoją nazwę użytkownika i account ID.

### 2. Test endpointów API
```bash
# Health check AI Chat
curl https://mybonzoaiblog.pages.dev/api/ai/chat

# Test prostego zapytania (GET)
curl "https://mybonzoaiblog.pages.dev/api/ai/chat?prompt=test"

# Health check blogu
curl https://mybonzoaiblog.pages.dev/api/blog/index
```

### 3. Test interfejsu
- **Strona główna**: `https://mybonzoaiblog.pages.dev`
- **AI Chat Enhanced**: `https://mybonzoaiblog.pages.dev/system/ai-chat-enhanced`
- **Cloudflare Dashboard**: `https://dash.cloudflare.com/<TWÓJ_ACCOUNT_ID>/pages`

### 4. Sprawdź logi
```bash
# Logi Workers
npx wrangler tail

# Logi Pages Functions
npx wrangler pages deployment tail
```

---

## 🆘 Troubleshooting

### Problem: "Error: Authentication error"
**Rozwiązanie**: Sprawdź czy `CLOUDFLARE_API_TOKEN` jest poprawnie ustawiony

```bash
# Test tokena:
npx wrangler whoami
```

---

### Problem: "Error: KV namespace not found"
**Rozwiązanie**: Sprawdź czy ID w `wrangler.jsonc` są dokładnie takie same jak zwrócone przez komendy

```bash
# Lista wszystkich KV namespaces:
npx wrangler kv:namespace list
```

---

### Problem: "Error: Durable Object migration required"
**Rozwiązanie**: Sekcja `migrations` już jest dodana w `wrangler.jsonc` - jeśli dalej błąd, uruchom:

```bash
npx wrangler deploy
```

---

### Problem: "Queue not found"
**Rozwiązanie**: Lista wszystkich queues:

```bash
npx wrangler queues list
```

---

## 📊 Koszty (płatny plan)

- **Durable Objects**: ~$0.15/million requests + $0.20/GB RAM
- **R2 Storage**: $0.015/GB storage + $0.36/million Class A ops
- **KV Storage**: $0.50/GB storage + $0.50/million reads
- **AI Workers**: Currently in beta - pricing TBD
- **Pages**: Included in Workers Paid plan ($5/month minimum)

**Szacowany koszt miesięczny dla małego/średniego ruchu: $5-15**

---

## 🎉 Gotowe!

Twoja aplikacja MyBonzo AI Blog będzie dostępna globalnie przez Cloudflare CDN z pełną integracją:

✅ Astro SSR
✅ AI Workers (Llama 2, Stable Diffusion)
✅ Real-time Chat (Durable Objects)
✅ Image Processing (R2 + Queue)
✅ Session Management (KV)
✅ Global CDN

**Enjoy! 🚀**
