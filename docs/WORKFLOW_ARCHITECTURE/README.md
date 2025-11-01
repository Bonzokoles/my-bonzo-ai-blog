# 🏗️ Architektura i Workflow - MyBonzo AI Blog

**Data utworzenia**: 1 listopada 2025  
**Status**: ✅ Production Ready  
**Typ**: Modularna architektura mikroserwisów

---

## 📋 Spis Treści

1. [Przegląd Architektury](#przegląd-architektury)
2. [Możliwości Systemu](#możliwości-systemu)
3. [Workflow Developmentu](#workflow-developmentu)
4. [Przykłady Implementacji](#przykłady-implementacji)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Przegląd Architektury

### Aktualna Struktura

```
mybonzoAIblog/
│
├── src/pages/                          ← Główne strony bloga (Astro)
│   ├── index.astro                    ← Homepage
│   ├── blog/                          ← Artykuły
│   ├── api/                           ← API endpoints
│   │   └── ai/                        ← AI funkcje (bonzo-chat.ts)
│   │
│   └── eksperymenty/                  ← EKSPERYMENTALNE PROJEKTY
│       ├── _SZABLON/                  ← Szablon dla nowych projektów
│       ├── projekt-1/
│       ├── projekt-2/
│       └── [nowe-projekty]/
│
├── public/
│   ├── KONFIG_PODPROJEKT/             ← Konfiguracje monorepo
│   └── [assety]/
│
├── docs/
│   └── WORKFLOW_ARCHITECTURE/         ← TA DOKUMENTACJA
│
└── [config files]
```

### Kluczowe Komponenty

1. **Astro SSR** - Główny framework (v5.0+)
2. **Cloudflare Pages** - Hosting dla stron
3. **Cloudflare Workers** - Serverless functions i proxy
4. **Folder `eksperymenty/`** - Miejsce na nowe funkcje
5. **Modularny routing** - Każda funkcja może mieć własną ścieżkę

---

## 🚀 Możliwości Systemu

### ✅ CO MOŻESZ ZROBIĆ?

#### 1. Generator Zdjęć (AI Image Generator)

**Możliwość**: TAK ✅  
**Gdzie**: `/generator-zdjec` lub `/ai-images`  
**Jak**:

```
eksperymenty/
└── generator-zdjec/
    ├── main-app/              ← UI generator (Astro/React)
    │   ├── src/pages/
    │   │   └── index.astro    ← Formularz + preview
    │   └── api/
    │       └── generate.ts    ← Wywołanie DALL-E/Stable Diffusion
    ├── subpage/               ← Galeria wygenerowanych
    └── worker-proxy/          ← Routing /generator-zdjec/*
```

**Integracje**:
- OpenAI DALL-E API
- Stability AI (Stable Diffusion)
- Cloudflare AI (Workers AI)
- R2 Storage dla zapisanych obrazów

---

#### 2. Generator Tekstu (AI Content Generator)

**Możliwość**: TAK ✅  
**Gdzie**: `/generator-tekst` lub `/ai-writer`  
**Jak**:

```
eksperymenty/
└── generator-tekst/
    ├── main-app/
    │   ├── src/
    │   │   ├── components/
    │   │   │   ├── TextEditor.tsx
    │   │   │   └── PromptBuilder.tsx
    │   │   └── pages/
    │   │       └── index.astro
    │   └── api/
    │       └── generate-text.ts  ← OpenAI/Gemini
    └── worker-proxy/
```

**Możliwości**:
- Blog post generator
- SEO content writer
- Rewriter/paraphraser
- Tłumacz z AI
- Podsumowania artykułów

---

#### 3. Niezależny Projekt z GitHub

**Możliwość**: TAK ✅  
**Scenariusz**: Masz gotowy projekt na GitHub, chcesz go wrzucić do bloga

**Workflow**:

```powershell
# 1. Sklonuj projekt
cd Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty
git clone https://github.com/user/moj-projekt.git

# 2. Dostosuj konfigurację
cd moj-projekt
# Edytuj astro.config.mjs, wrangler.jsonc (ustaw base path)

# 3. Deploy
npm install
npm run build
npm run deploy  # Cloudflare Pages

# 4. Skonfiguruj routing w głównym proxy
# Dodaj wpis w worker-proxy/index.js:
# { prefix: '/moj-projekt/', target: 'https://moj-projekt.pages.dev' }

# 5. Gotowe!
# https://mybonzo.com/moj-projekt/
```

---

#### 4. Eksperymenty Bez Globalnego Deployu

**Możliwość**: TAK ✅  
**Korzyść**: Pracujesz tylko nad jedną funkcją, reszta strony działa normalnie

**Workflow**:

```powershell
# Pracujesz nad nowym AI avatarem
cd eksperymenty/ai-avatar

# Lokalny development
npm run dev  # Test na localhost:4321

# Deploy TYLKO tego eksperymentu
npm run deploy  # Tylko ta funkcja idzie na Cloudflare

# Główna strona działa bez zmian!
# Nie musisz rebuildować całego bloga
```

**Zalety**:
- ⚡ Szybkie iteracje
- 🔒 Brak konfliktów z produkcją
- 🧪 Bezpieczne testowanie
- 📦 Izolacja projektu

---

#### 5. Multiple Generators na Jednej Stronie

**Możliwość**: TAK ✅  
**Przykład**: Mega-dashboard z kilkoma generatorami

```
/ai-tools/                        ← Główny hub
├── /generator-tekst              ← Generator 1
├── /generator-zdjec              ← Generator 2
├── /tts-generator                ← Generator 3 (text-to-speech)
├── /voice-clone                  ← Generator 4 (klonowanie głosu)
└── /avatar-generator             ← Generator 5 (AI avatar)
```

**Struktura**:

```
eksperymenty/
├── ai-tools-hub/              ← Dashboard (główna strona)
│   └── src/pages/
│       └── index.astro        ← Lista wszystkich narzędzi
│
├── generator-tekst/           ← Każdy generator osobno
├── generator-zdjec/
├── tts-generator/
├── voice-clone/
└── avatar-generator/
```

---

#### 6. A/B Testing i Feature Flags

**Możliwość**: TAK ✅  
**Jak**: Worker proxy może kierować użytkowników do różnych wersji

```javascript
// worker-proxy/index.js
const ROUTES = [
    {
        prefix: '/blog/',
        target: Math.random() > 0.5 
            ? 'https://blog-v1.pages.dev'  // 50% użytkowników
            : 'https://blog-v2.pages.dev', // 50% użytkowników
        name: 'Blog A/B Test'
    }
];
```

---

#### 7. Submodules i Multi-Repo

**Możliwość**: TAK ✅  
**Scenariusz**: Masz projekt w osobnym repo, chcesz go jako submodule

```powershell
# Dodaj jako submodule
git submodule add https://github.com/user/projekt.git src/pages/eksperymenty/projekt

# Update submodule
git submodule update --remote

# Deploy
cd src/pages/eksperymenty/projekt
npm run deploy
```

---

### 🔧 Możliwości Techniczne

#### Dostępne API i Serwisy

| Serwis | Użycie | Integracja |
|--------|--------|------------|
| **OpenAI API** | GPT-4, DALL-E, Whisper | ✅ Gotowe w `bonzo-chat.ts` |
| **Google Gemini** | Gemini Pro, Vision | ✅ Możliwe |
| **Cloudflare AI** | Workers AI (LLama, Stable Diffusion) | ✅ Natywne |
| **Anthropic Claude** | Claude 3 | ✅ Możliwe |
| **Stability AI** | Stable Diffusion | ✅ Możliwe |
| **ElevenLabs** | Text-to-Speech, Voice Clone | ✅ Możliwe |
| **Replicate** | Różne modele AI | ✅ Możliwe |

#### Storage i Bazy Danych

| Typ | Cloudflare Service | Użycie |
|-----|-------------------|--------|
| **Key-Value** | KV Namespace | Cache, sessions, user data |
| **Object Storage** | R2 | Obrazy, pliki, media |
| **SQL Database** | D1 | Relacyjne dane |
| **Vector DB** | Vectorize | Embeddings, semantic search |
| **Queue** | Queues | Background jobs |
| **Durable Objects** | Durable Objects | Real-time, websockets |

---

## 🎯 Workflow Developmentu

### Workflow 1: Nowa Funkcja od Zera

```powershell
# 1. KOPIUJ SZABLON
cd Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty
Copy-Item -Recurse "_SZABLON" "nazwa-funkcji"

# 2. KONFIGURUJ
cd nazwa-funkcji
# Zmień nazwy w wrangler.jsonc (3 pliki)
# Ustaw base path w subpage/astro.config.mjs

# 3. DEVELOP LOKALNIE
cd main-app
npm install
npm run dev  # localhost:4321

# 4. IMPLEMENTUJ FUNKCJĘ
# Dodaj kod w src/pages/
# Dodaj API w api/
# Dodaj komponenty w src/components/

# 5. TEST
npm run build
npm run preview

# 6. DEPLOY
npm run deploy  # → Cloudflare Pages

# 7. SKONFIGURUJ ROUTING
cd ../worker-proxy
# Edytuj index.js (dodaj routing)
npm run deploy  # → Cloudflare Worker

# 8. DODAJ CUSTOM DOMAIN
# Dashboard → Workers & Pages → Triggers → Add Domain

# 9. GOTOWE!
# https://mybonzo.com/nazwa-funkcji/
```

---

### Workflow 2: Przeniesienie Projektu z GitHub

```powershell
# 1. CLONE REPO
cd Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty
git clone https://github.com/user/projekt.git

# 2. DOSTOSUJ DO ASTRO (jeśli potrzeba)
cd projekt
# Jeśli to React/Vue/Svelte:
# - Dodaj astro.config.mjs
# - Użyj @astrojs/react (lub odpowiedni adapter)

# 3. USTAW BASE PATH
# astro.config.mjs → base: '/projekt/'

# 4. DODAJ WRANGLER CONFIG
# Skopiuj z _SZABLON/main-app/wrangler.jsonc

# 5. DEPLOY
npm install
npm run build
wrangler pages deploy ./dist --project-name=mybonzo-projekt

# 6. ROUTING
# Dodaj do głównego proxy worker

# 7. COMMIT DO GŁÓWNEGO REPO (opcjonalnie)
cd Q:\mybonzo\mybonzoAIblog
git add src/pages/eksperymenty/projekt
git commit -m "feat: Dodano projekt z GitHub"
git push
```

---

### Workflow 3: Szybki Eksperyment (Test w 5 minut)

```powershell
# 1. KOPIUJ SZABLON
cd Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty
Copy-Item -Recurse "_SZABLON" "quick-test"

# 2. EDYTUJ TYLKO MAIN-APP
cd quick-test/main-app/src/pages
# Edytuj index.example.astro → zmień na index.astro
# Dodaj swój kod

# 3. LOKALNY TEST
cd ../..
npm install
npm run dev

# 4. Działa? Deploy!
npm run deploy

# 5. DONE! Masz URL: https://mybonzo-exp-quick-test-main.pages.dev
```

---

### Workflow 4: Produkcyjne API Endpoint

```powershell
# Przykład: Generator zdjęć przez API

# 1. Utwórz endpoint
# src/pages/api/ai/generate-image.ts

export async function POST({ request }) {
    const { prompt, model } = await request.json();
    
    // Wywołaj OpenAI DALL-E
    const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${import.meta.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt,
            model: model || 'dall-e-3',
            n: 1,
            size: '1024x1024'
        })
    });
    
    const data = await response.json();
    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    });
}

# 2. Użyj w komponencie
# src/components/ImageGenerator.tsx

async function generateImage(prompt: string) {
    const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
    });
    return await response.json();
}
```

---

### Workflow 5: Integracja External Service

**Przykład**: Dodanie ElevenLabs (Text-to-Speech)

```typescript
// src/pages/api/ai/text-to-speech.ts

export async function POST({ request }) {
    const { text, voice_id } = await request.json();
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`, {
        method: 'POST',
        headers: {
            'xi-api-key': import.meta.env.ELEVENLABS_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75
            }
        })
    });
    
    // Zwróć audio jako stream
    return new Response(response.body, {
        headers: {
            'Content-Type': 'audio/mpeg',
            'Content-Disposition': 'attachment; filename="speech.mp3"'
        }
    });
}
```

---

## 💡 Przykłady Implementacji

### Przykład 1: Generator Zdjęć (Full Stack)

**Struktura**:

```
eksperymenty/generator-zdjec/
├── main-app/
│   ├── src/
│   │   ├── pages/
│   │   │   └── index.astro          ← UI Generator
│   │   ├── components/
│   │   │   ├── ImagePrompt.tsx      ← Formularz promptu
│   │   │   ├── ImagePreview.tsx     ← Podgląd obrazu
│   │   │   └── ImageHistory.tsx     ← Historia generacji
│   │   └── api/
│   │       ├── generate.ts          ← Generowanie obrazu
│   │       └── save.ts              ← Zapis do R2
│   ├── astro.config.mjs
│   ├── package.json
│   └── wrangler.jsonc
│
├── subpage/                          ← Galeria publiczna
│   └── src/pages/
│       ├── index.astro               ← Grid galerii
│       └── [id].astro                ← Szczegóły obrazu
│
└── worker-proxy/
    └── index.js                      ← Routing /generator-zdjec/*
```

**Kluczowy kod** (`src/api/generate.ts`):

```typescript
import { Ai } from '@cloudflare/ai';

export async function POST({ request, env }) {
    const { prompt } = await request.json();
    
    // Użyj Cloudflare Workers AI
    const ai = new Ai(env.AI);
    
    const response = await ai.run(
        '@cf/stabilityai/stable-diffusion-xl-base-1.0',
        {
            prompt: prompt,
            num_steps: 20
        }
    );
    
    // Zapisz do R2
    const imageId = crypto.randomUUID();
    await env.R2_BUCKET.put(`images/${imageId}.png`, response);
    
    return new Response(JSON.stringify({
        success: true,
        imageId,
        url: `/api/image/${imageId}`
    }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
```

---

### Przykład 2: AI Chat Widget (Osadzalny)

**Cel**: Widget AI chat do osadzenia na każdej stronie bloga

**Struktura**:

```
eksperymenty/ai-chat-widget/
└── main-app/
    ├── src/
    │   ├── components/
    │   │   └── ChatWidget.tsx        ← Główny komponent
    │   └── api/
    │       └── chat.ts               ← Proxy do OpenAI
    └── public/
        └── widget.js                 ← Standalone JS bundle
```

**Kod widgetu**:

```typescript
// src/components/ChatWidget.tsx
import { useState } from 'react';

export default function ChatWidget() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    
    const sendMessage = async () => {
        const response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [...messages, { role: 'user', content: input }]
            })
        });
        
        const data = await response.json();
        setMessages([...messages, 
            { role: 'user', content: input },
            { role: 'assistant', content: data.response }
        ]);
        setInput('');
    };
    
    return (
        <div className="chat-widget">
            <div className="messages">
                {messages.map((msg, i) => (
                    <div key={i} className={msg.role}>
                        {msg.content}
                    </div>
                ))}
            </div>
            <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
        </div>
    );
}
```

**Użycie na dowolnej stronie**:

```astro
---
// src/pages/blog/post.astro
import ChatWidget from '@/components/ChatWidget';
---

<article>
    <h1>Tytuł Posta</h1>
    <p>Treść...</p>
    
    <!-- AI Chat osadzony -->
    <ChatWidget client:load />
</article>
```

---

### Przykład 3: Voice Clone Generator

**Struktura**:

```
eksperymenty/voice-clone/
├── main-app/
│   ├── src/
│   │   ├── pages/
│   │   │   └── index.astro           ← Upload sample + generowanie
│   │   ├── components/
│   │   │   ├── VoiceUpload.tsx       ← Upload próbki głosu
│   │   │   ├── VoicePreview.tsx      ← Odtwarzacz
│   │   │   └── TextToSpeech.tsx      ← Generowanie z tekstu
│   │   └── api/
│   │       ├── upload-sample.ts      ← Upload do R2
│   │       ├── train-voice.ts        ← Trening modelu (ElevenLabs)
│   │       └── generate-speech.ts    ← TTS z klonowanym głosem
│   └── wrangler.jsonc                ← Bindings: R2 + secrets
```

**Integracja z ElevenLabs**:

```typescript
// src/api/train-voice.ts
export async function POST({ request, env }) {
    const formData = await request.formData();
    const audioFile = formData.get('audio');
    const name = formData.get('name');
    
    // Upload do ElevenLabs
    const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
        method: 'POST',
        headers: {
            'xi-api-key': env.ELEVENLABS_API_KEY
        },
        body: formData
    });
    
    const { voice_id } = await response.json();
    
    // Zapisz voice_id w KV
    await env.KV.put(`voice:${name}`, voice_id);
    
    return new Response(JSON.stringify({ voice_id }));
}
```

---

## 🎓 Best Practices

### 1. Struktura Projektu

**✅ DO**:
- Jeden folder = jedna funkcja
- Używaj szablonu `_SZABLON`
- Prefiks `mybonzo-EXP-` dla eksperymentów
- Base path zawsze ze slashami: `/sciezka/`

**❌ DON'T**:
- Nie mieszaj wielu funkcji w jednym folderze
- Nie commituj `node_modules/`, `dist/`, `.dev.vars`
- Nie hardcoduj secrets w kodzie
- Nie deployuj bez lokalnych testów

---

### 2. API Keys i Secrets

**Zarządzanie sekretami**:

```powershell
# Lokalne (development)
# .dev.vars (NIE commituj!)
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...

# Produkcja (Cloudflare)
wrangler secret put OPENAI_API_KEY
wrangler secret put ELEVENLABS_API_KEY
```

**Użycie w kodzie**:

```typescript
// Astro API route
export async function POST({ request }) {
    const apiKey = import.meta.env.OPENAI_API_KEY; // ✅ Prawidłowo
    // NIE: const apiKey = 'sk-...' ❌
}
```

---

### 3. Performance i Optymalizacja

**Cache Strategy**:

```typescript
// Worker proxy z cache
export default {
    async fetch(request, env, ctx) {
        const cache = caches.default;
        
        // Sprawdź cache
        let response = await cache.match(request);
        if (response) return response;
        
        // Proxy request
        response = await proxyRequest(request);
        
        // Cache na 1 godzinę
        const cacheResponse = response.clone();
        ctx.waitUntil(cache.put(request, cacheResponse));
        
        return response;
    }
};
```

**Image Optimization**:

```astro
---
// Użyj Astro Image dla optymalizacji
import { Image } from 'astro:assets';
import myImage from '@/assets/image.png';
---

<Image 
    src={myImage} 
    alt="Description"
    width={800}
    height={600}
    format="webp"
    quality={80}
/>
```

---

### 4. Error Handling

**API Error Response**:

```typescript
export async function POST({ request }) {
    try {
        const data = await request.json();
        
        // Walidacja
        if (!data.prompt) {
            return new Response(JSON.stringify({
                error: 'Missing prompt'
            }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Wykonaj operację
        const result = await generateImage(data.prompt);
        
        return new Response(JSON.stringify({ success: true, result }));
        
    } catch (error) {
        console.error('API Error:', error);
        return new Response(JSON.stringify({
            error: 'Internal server error',
            message: error.message
        }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
```

---

### 5. Monitoring i Logging

**Worker Logs**:

```powershell
# Real-time logs
wrangler tail mybonzo-EXP-projekt-proxy

# Lub w Dashboard:
# Workers & Pages → projekt → Logs → Real-time Logs
```

**Custom Logging**:

```typescript
// Structured logging
export async function POST({ request, env }) {
    const startTime = Date.now();
    
    try {
        const result = await processRequest(request);
        
        // Log sukcesu
        console.log(JSON.stringify({
            level: 'info',
            action: 'generate_image',
            duration: Date.now() - startTime,
            success: true
        }));
        
        return new Response(JSON.stringify(result));
    } catch (error) {
        // Log błędu
        console.error(JSON.stringify({
            level: 'error',
            action: 'generate_image',
            duration: Date.now() - startTime,
            error: error.message,
            stack: error.stack
        }));
        
        throw error;
    }
}
```

---

## 🔧 Troubleshooting

### Problem 1: "Module not found" po deploymencie

**Przyczyna**: Niepoprawna konfiguracja dependencies

**Fix**:
```json
// package.json - upewnij się że wszystkie deps są w "dependencies", nie "devDependencies"
{
    "dependencies": {
        "astro": "^5.0.0",
        "@astrojs/cloudflare": "^12.0.0",
        "openai": "^4.0.0"  // ✅ Tutaj, nie w devDependencies
    }
}
```

---

### Problem 2: API Keys nie działają na produkcji

**Przyczyna**: Sekrety nie są ustawione w Cloudflare

**Fix**:
```powershell
# Ustaw sekrety dla Pages
wrangler pages secret put OPENAI_API_KEY --project-name=mybonzo-projekt

# Lub dla Worker
wrangler secret put OPENAI_API_KEY
```

---

### Problem 3: CORS errors przy wywoływaniu API

**Przyczyna**: Brak CORS headers

**Fix**:
```typescript
// src/api/endpoint.ts
export async function OPTIONS() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}

export async function POST({ request }) {
    // Twój kod...
    
    return new Response(JSON.stringify(result), {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'  // ✅ Dodaj CORS
        }
    });
}
```

---

### Problem 4: Worker przekracza CPU limit (Error 1101)

**Przyczyna**: Za długie przetwarzanie w Workerze

**Fix**:
```typescript
// Użyj async/await i streams dla długich operacji
export default {
    async fetch(request, env, ctx) {
        // Dla długich operacji użyj ctx.waitUntil()
        const promise = longRunningOperation();
        ctx.waitUntil(promise);  // Nie blokuje response
        
        return new Response('Processing started', { status: 202 });
    }
};
```

---

## 📚 Dodatkowe Zasoby

### Dokumentacja Wewnętrzna

- **Szablon eksperymentów**: `src/pages/eksperymenty/_SZABLON/INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md`
- **Quick Reference**: `src/pages/eksperymenty/_SZABLON/QUICK_REFERENCE.md`
- **Troubleshooting**: `public/KONFIG_PODPROJEKT/TROUBLESHOOTING.md`
- **Komendy PowerShell**: `public/KONFIG_PODPROJEKT/TERMINAL_COMMANDS.md`

### Dokumentacja Zewnętrzna

- [Astro Documentation](https://docs.astro.build)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare AI Docs](https://developers.cloudflare.com/workers-ai/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [ElevenLabs API Docs](https://elevenlabs.io/docs/api-reference)

---

## 🎉 Podsumowanie

### Możesz robić WSZYSTKO co opisałeś:

✅ **Generator zdjęć** → Własna podstrona `/generator-zdjec`  
✅ **Generator tekstu** → Własna podstrona `/ai-writer`  
✅ **Eksperymenty** → Folder `eksperymenty/` bez globalnego deployu  
✅ **Projekt z GitHub** → Clone → dostosuj → deploy → routing  
✅ **Multiple funkcje** → Każda na osobnej ścieżce  
✅ **Przenoszenie między repo** → Submodules lub direct copy  

### Kluczowe Zalety Architektury:

🚀 **Modularność** - Każda funkcja niezależna  
⚡ **Szybki development** - Deploy tylko zmienionej części  
🔒 **Izolacja** - Eksperymenty nie wpływają na produkcję  
📦 **Reużywalność** - Projekty przenośne między repo  
🌐 **Skalowalność** - Dodawaj funkcje bez limitów  
💰 **Free tier friendly** - Cloudflare oferuje dużo za darmo  

---

**Data**: 1 listopada 2025  
**Wersja**: 1.0  
**Status**: Production Ready ✅
