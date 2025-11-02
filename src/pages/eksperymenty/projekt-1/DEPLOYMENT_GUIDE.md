# 🚀 Deployment Guide - Projekt-1 AI Chat

**Status**: ✅ Gotowy do wdrożenia  
**Data**: 2 listopada 2025  
**URL GitHub**: https://github.com/Bonzokoles/bonzo-ai-chat

---

## 📋 Co Mamy?

### Lokalnie (w projekcie):
- ✅ **main-app/** - Aplikacja Astro z ChatWidget
- ✅ **ChatWidget.jsx** - Komponent React z AI chat
- ✅ **functions/api/proxy.js** - Cloudflare Pages Function dla OpenAI API
- ✅ **wrangler.jsonc** - Konfiguracja Cloudflare

### Na GitHub:
- ✅ **Kod wypchniŋty**: https://github.com/Bonzokoles/bonzo-ai-chat
- ✅ **chatbot/** folder z kompletną aplikacją
- ✅ Dokumentacja i instrukcje

---

## 🎯 Opcje Deploymentu

### **OPCJA A: Deploy z tego folderu (main-app)** - REKOMENDOWANA

Ten folder jest już skonfigurowany i gotowy!

```cmd
cd Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty\projekt-1\main-app

# 1. Zainstaluj dependencies (jeśli nie ma)
npm install

# 2. Test lokalnie
npm run dev
```

Otwórz: http://localhost:4321

```cmd
# 3. Build
npm run build

# 4. Deploy do Cloudflare Pages
npm run deploy
```

**Rezultat**: https://mybonzo-exp-ai-chat-main.pages.dev

### **OPCJA B: Deploy z GitHub repo (chatbot)**

Cloudflare pobierze kod bezpośrednio z GitHub.

1. Dashboard: https://dash.cloudflare.com/
2. **Workers & Pages** → **Create** → **Pages**
3. **Connect to Git** → Wybierz **bonzo-ai-chat**
4. Konfiguracja:
   - **Root directory**: `chatbot`
   - **Framework**: Astro
   - **Build command**: `npm run build`
   - **Build output**: `dist`
5. **Environment variables**:
   - `OPENAI_API_KEY` = `sk-proj-...`
6. **Deploy!**

**Rezultat**: https://bonzo-ai-chat.pages.dev

---

## 🔑 Wymagane Zmienne Środowiskowe

### Na Cloudflare (WYMAGANE):

W **Settings** → **Environment variables** dodaj:

```
OPENAI_API_KEY=sk-proj-your-openai-key-here
```

### Opcjonalne (dla dodatkowych funkcji):

```
HUGGINGFACE_API_KEY=hf_your_key
LOCAL_MODEL_URL=http://your-local-model:8000
```

### Jak dodać klucz OpenAI:

1. Idź do: https://platform.openai.com/api-keys
2. **Create new secret key**
3. Skopiuj klucz (zaczyna się od `sk-proj-...`)
4. Dodaj w Cloudflare Dashboard

---

## ✅ Test Po Deploymencie

### 1. Sprawdź czy strona działa:
```cmd
curl https://YOUR-URL.pages.dev
```

### 2. Sprawdź API:
```cmd
curl -X POST https://YOUR-URL.pages.dev/api/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"messages\":[{\"role\":\"user\",\"text\":\"Hello\"}]}"
```

### 3. Test w przeglądarce:
1. Otwórz: https://YOUR-URL.pages.dev
2. Wybierz model (np. gpt-4o-mini)
3. Wyślij wiadomość
4. Sprawdź czy AI odpowiada

---

## 🔗 Integracja z Głównym Blogiem

### Po pomyślnym deploymencie, dodaj do bloga:

Plik: `Q:\mybonzo\mybonzoAIblog\src\pages\projekty\ai-chat.astro`

```astro
---
import Layout from '@layouts/Layout.astro';
const CHAT_URL = "https://mybonzo-exp-ai-chat-main.pages.dev"; // Twój URL!
---

<Layout title="MyBonzo AI Chat" description="Inteligentny asystent AI">
    <div class="container mx-auto px-4 py-8">
        <a href="/projekty" class="text-blue-600 hover:underline mb-4 inline-block">
            ← Powrót do Projektów
        </a>

        <h1 class="text-4xl font-bold mb-6">🤖 MyBonzo AI Chat</h1>
        
        <div class="prose dark:prose-invert max-w-none mb-8">
            <p>Inteligentny asystent AI z wieloma modelami OpenAI. Wspiera streaming, role presets i załączniki.</p>
        </div>

        <div class="w-full h-[800px] border-2 rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800">
            <iframe 
                src={CHAT_URL}
                class="w-full h-full"
                title="MyBonzo AI Chat"
                allow="clipboard-write"
                loading="lazy"
            />
        </div>

        <div class="mt-6 text-center">
            <a 
                href={CHAT_URL}
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 hover:underline"
            >
                Otwórz w nowym oknie →
            </a>
        </div>

        <div class="mt-8 prose dark:prose-invert max-w-none">
            <h2>🎯 Funkcje</h2>
            <ul>
                <li>💬 Chat z GPT-4 i GPT-3.5</li>
                <li>⚡ Tryb streamingowy (odpowiedzi na żywo)</li>
                <li>🎭 Role presets (Asystent, Programista, Krytyk, Tłumacz)</li>
                <li>📎 Załączniki plików tekstowych</li>
                <li>💾 Zapisywanie historii w localStorage</li>
                <li>🌓 Dark mode</li>
                <li>📱 Mobile responsive</li>
            </ul>

            <h2>🔗 Źródło</h2>
            <p>
                <a href="https://github.com/Bonzokoles/bonzo-ai-chat" target="_blank" class="text-blue-600 hover:underline">
                    Zobacz kod na GitHub →
                </a>
            </p>
        </div>
    </div>
</Layout>
```

Commit i push:
```cmd
cd Q:\mybonzo\mybonzoAIblog
git add src/pages/projekty/ai-chat.astro
git commit -m "Add AI chat project page"
git push
```

---

## 🐛 Troubleshooting

### "Build failed"
```cmd
# Sprawdź logi w Cloudflare Dashboard
# Najczęstszy problem: brak node_modules

# Rozwiązanie:
cd main-app
rm -rf node_modules package-lock.json
npm install
npm run build
```

### "OpenAI API error"
1. Sprawdź czy `OPENAI_API_KEY` jest ustawiony w Cloudflare
2. Sprawdź czy klucz jest poprawny (zaczyna się od `sk-proj-`)
3. Sprawdź saldo na OpenAI: https://platform.openai.com/usage

### "CORS error"
```javascript
// Edytuj functions/api/proxy.js linia 14-17
const ALLOWED_ORIGINS = [
    "https://mybonzo-exp-ai-chat-main.pages.dev",
    "https://YOUR-PRODUCTION-DOMAIN.com"
];
```

### "Chat nie odpowiada"
1. Otwórz DevTools (F12) → Console
2. Sprawdź błędy
3. Sprawdź Network tab → czy request do /api/chat przechodzi
4. Sprawdź Cloudflare Dashboard → Logs

---

## 📊 Monitoring

### Cloudflare Dashboard:
1. **Workers & Pages** → **mybonzo-EXP-ai-chat-main**
2. **Analytics** → Zobacz requesty, errory, CPU time
3. **Logs** → Real-time logs (kliknij "Begin log stream")

### Koszty:
- **Cloudflare Pages**: FREE (unlimited)
- **OpenAI API**: ~$0.002 za 1000 tokenów (gpt-4o-mini)
- **Średnio**: $5-15/miesiąc (zależy od użycia)

💡 **Tip**: Używaj `gpt-4o-mini` zamiast `gpt-4o` - 20x taniej!

---

## 🔄 Aktualizacje

### Lokalne zmiany:
```cmd
cd Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty\projekt-1\main-app

# 1. Edytuj pliki
# 2. Test
npm run dev

# 3. Deploy
npm run build
npm run deploy
```

### Z GitHub:
1. Push zmiany do repo
2. Cloudflare auto-deploy (jeśli skonfigurowane)
3. Lub w Dashboard: **Deployments** → **Retry deployment**

---

## 📞 Support

### Dokumentacja:
- **Główna**: `Q:\mybonzo\mybonzoAIBLOG_COMONENTS\01-ai-blog\README.md`
- **Quick Deploy**: `Q:\mybonzo\mybonzoAIBLOG_COMONENTS\01-ai-blog\QUICK_DEPLOY.md`

### Online:
- [Astro Docs](https://docs.astro.build)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [OpenAI API](https://platform.openai.com/docs)

---

## ✅ Deployment Checklist

- [ ] Dependencies zainstalowane (`npm install`)
- [ ] Build lokalny działa (`npm run build`)
- [ ] Test lokalny działa (`npm run dev`)
- [ ] GitHub repo istnieje (bonzo-ai-chat)
- [ ] Cloudflare Pages projekt utworzony
- [ ] Environment variable: `OPENAI_API_KEY` dodany
- [ ] Deployment successful
- [ ] Strona otwiera się (https://YOUR-URL.pages.dev)
- [ ] Chat odpowiada na wiadomości
- [ ] Integracja z blogiem dodana

---

**Status**: Gotowy do deployment!  
**Następny krok**: Wybierz Opcję A lub B powyżej i deploy! 🚀
