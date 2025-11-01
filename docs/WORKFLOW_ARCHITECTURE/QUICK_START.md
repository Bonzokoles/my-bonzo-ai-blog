# 🎯 Quick Start Guide - Tworzenie Nowych Funkcji

**Dla**: Szybkie wdrożenie nowej funkcji AI/generatora  
**Czas**: 15-30 minut od pomysłu do działającej strony  
**Poziom**: Podstawowy

---

## 🚀 5-Minutowy Start

### Opcja A: Prosty Eksperyment (Jedna Strona)

```powershell
# 1. Kopiuj szablon
cd Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty
Copy-Item -Recurse "_SZABLON" "moja-funkcja"

# 2. Edytuj główną stronę
cd moja-funkcja/main-app
notepad src/pages/index.example.astro
# Zmień nazwę na index.astro i dodaj swój kod

# 3. Zainstaluj i uruchom
npm install
npm run dev

# 4. Otwórz w przeglądarce
# http://localhost:4321
```

✅ **Gotowe!** Masz działającą stronę lokalnie.

---

### Opcja B: Produkcyjne Wdrożenie (z Cloudflare)

```powershell
# 1-3. Jak wyżej (kopiuj, edytuj, testuj lokalnie)

# 4. Zmień nazwę projektu
notepad wrangler.jsonc
# Zmień: name = "mybonzo-moja-funkcja"

# 5. Build i deploy
npm run build
npm run deploy

# 6. Gotowe!
# URL: https://mybonzo-moja-funkcja.pages.dev
```

⚡ **W 5 minut masz stronę online!**

---

## 📋 Checklisty dla Różnych Scenariuszy

### ✅ Checklist: Generator Zdjęć AI

- [ ] Skopiuj szablon do `eksperymenty/generator-zdjec`
- [ ] Zainstaluj dodatkowe pakiety:
  ```powershell
  npm install openai
  # lub
  npm install @cloudflare/ai
  ```
- [ ] Utwórz API endpoint: `src/pages/api/generate-image.ts`
- [ ] Dodaj komponent UI: `src/components/ImageGenerator.tsx`
- [ ] Dodaj secrets:
  ```powershell
  # Lokalnie: .dev.vars
  OPENAI_API_KEY=sk-...
  
  # Produkcja
  wrangler pages secret put OPENAI_API_KEY
  ```
- [ ] Test lokalnie: `npm run dev`
- [ ] Deploy: `npm run deploy`

**Czas**: ~20 minut

---

### ✅ Checklist: Generator Tekstu (Content Writer)

- [ ] Skopiuj szablon do `eksperymenty/ai-writer`
- [ ] Zainstaluj OpenAI/Gemini:
  ```powershell
  npm install openai
  # lub
  npm install @google/generative-ai
  ```
- [ ] Utwórz endpoint: `src/pages/api/generate-text.ts`
  ```typescript
  import OpenAI from 'openai';
  
  export async function POST({ request }) {
      const { prompt } = await request.json();
      
      const openai = new OpenAI({
          apiKey: import.meta.env.OPENAI_API_KEY
      });
      
      const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }]
      });
      
      return new Response(JSON.stringify({
          text: completion.choices[0].message.content
      }));
  }
  ```
- [ ] Dodaj UI z formularzem
- [ ] Test i deploy

**Czas**: ~15 minut

---

### ✅ Checklist: Projekt z GitHub

- [ ] Clone projektu:
  ```powershell
  cd Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty
  git clone https://github.com/user/projekt.git
  ```
- [ ] Dodaj Astro config (jeśli brak):
  ```javascript
  // astro.config.mjs
  import { defineConfig } from 'astro/config';
  import cloudflare from '@astrojs/cloudflare';
  
  export default defineConfig({
      output: 'server',
      adapter: cloudflare(),
      base: '/projekt/'  // ← WAŻNE!
  });
  ```
- [ ] Dodaj wrangler.jsonc (kopiuj z _SZABLON)
- [ ] Zainstaluj deps: `npm install`
- [ ] Test: `npm run dev`
- [ ] Deploy: `npm run deploy`

**Czas**: ~10 minut

---

## 🎨 Gotowe Snippety Kodu

### 1. API Endpoint - Generator Obrazu (OpenAI DALL-E)

```typescript
// src/pages/api/generate-image.ts
import OpenAI from 'openai';

export async function POST({ request }) {
    const { prompt } = await request.json();
    
    const openai = new OpenAI({
        apiKey: import.meta.env.OPENAI_API_KEY
    });
    
    try {
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            quality: "standard"
        });
        
        return new Response(JSON.stringify({
            success: true,
            imageUrl: response.data[0].url
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        return new Response(JSON.stringify({
            error: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
```

---

### 2. API Endpoint - Generator Obrazu (Cloudflare AI - DARMOWY!)

```typescript
// src/pages/api/generate-image.ts
import { Ai } from '@cloudflare/ai';

export async function POST({ request, env }) {
    const { prompt } = await request.json();
    
    const ai = new Ai(env.AI);
    
    try {
        const response = await ai.run(
            '@cf/stabilityai/stable-diffusion-xl-base-1.0',
            {
                prompt: prompt,
                num_steps: 20
            }
        );
        
        // response jest Buffer z obrazem
        return new Response(response, {
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=86400'
            }
        });
        
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500
        });
    }
}
```

**Setup dla Cloudflare AI**:
```jsonc
// wrangler.jsonc
{
    "name": "mybonzo-generator-zdjec",
    "ai": {
        "binding": "AI"
    }
}
```

---

### 3. Komponent React - Formularz Generatora

```tsx
// src/components/ImageGenerator.tsx
import { useState } from 'react';

export default function ImageGenerator() {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const generateImage = async () => {
        if (!prompt.trim()) {
            setError('Wpisz opis obrazu');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });
            
            const data = await response.json();
            
            if (data.error) {
                setError(data.error);
            } else {
                setImageUrl(data.imageUrl);
            }
        } catch (err) {
            setError('Błąd generowania. Spróbuj ponownie.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="generator-container">
            <h2>🎨 Generator Zdjęć AI</h2>
            
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Opisz obraz, który chcesz wygenerować..."
                rows={4}
                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
            />
            
            <button 
                onClick={generateImage}
                disabled={loading}
                style={{ 
                    marginTop: '10px', 
                    padding: '12px 24px',
                    fontSize: '16px',
                    cursor: loading ? 'not-allowed' : 'pointer'
                }}
            >
                {loading ? '⏳ Generuję...' : '✨ Wygeneruj Obraz'}
            </button>
            
            {error && (
                <div style={{ color: 'red', marginTop: '10px' }}>
                    ❌ {error}
                </div>
            )}
            
            {imageUrl && (
                <div style={{ marginTop: '20px' }}>
                    <img 
                        src={imageUrl} 
                        alt="Generated" 
                        style={{ maxWidth: '100%', borderRadius: '8px' }}
                    />
                    <a 
                        href={imageUrl} 
                        download 
                        style={{ 
                            display: 'block', 
                            marginTop: '10px',
                            textAlign: 'center'
                        }}
                    >
                        💾 Pobierz obraz
                    </a>
                </div>
            )}
        </div>
    );
}
```

---

### 4. Strona Astro z Komponentem React

```astro
---
// src/pages/index.astro
import Layout from '@/layouts/Layout.astro';
import ImageGenerator from '@/components/ImageGenerator';
---

<Layout title="Generator Zdjęć AI">
    <main>
        <h1>🎨 MyBonzo AI Image Generator</h1>
        <p>Wygeneruj unikalny obraz za pomocą sztucznej inteligencji</p>
        
        <!-- Komponent React z hydracją -->
        <ImageGenerator client:load />
    </main>
</Layout>

<style>
    main {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
    }
    
    h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
    }
    
    p {
        font-size: 1.2rem;
        color: #666;
        margin-bottom: 2rem;
    }
</style>
```

---

### 5. Generator Tekstu (OpenAI GPT-4)

```typescript
// src/pages/api/generate-text.ts
import OpenAI from 'openai';

export async function POST({ request }) {
    const { prompt, maxTokens = 500, temperature = 0.7 } = await request.json();
    
    const openai = new OpenAI({
        apiKey: import.meta.env.OPENAI_API_KEY
    });
    
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "Jesteś profesjonalnym copywriterem. Twórz wartościowe, angażujące treści."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: maxTokens,
            temperature: temperature
        });
        
        return new Response(JSON.stringify({
            text: completion.choices[0].message.content,
            usage: completion.usage
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        return new Response(JSON.stringify({
            error: error.message
        }), { status: 500 });
    }
}
```

---

### 6. Text-to-Speech (ElevenLabs)

```typescript
// src/pages/api/text-to-speech.ts

export async function POST({ request }) {
    const { text, voice_id = "21m00Tcm4TlvDq8ikWAM" } = await request.json();
    
    const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`,
        {
            method: 'POST',
            headers: {
                'xi-api-key': import.meta.env.ELEVENLABS_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text,
                model_id: "eleven_monolingual_v1",
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75
                }
            })
        }
    );
    
    // Zwróć audio stream
    return new Response(response.body, {
        headers: {
            'Content-Type': 'audio/mpeg',
            'Content-Disposition': `attachment; filename="speech.mp3"`,
            'Cache-Control': 'public, max-age=3600'
        }
    });
}
```

---

## 🔗 Gotowe Integracje

### OpenAI

```powershell
npm install openai
```

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: import.meta.env.OPENAI_API_KEY
});

// Chat
const chat = await openai.chat.completions.create({ ... });

// Images
const image = await openai.images.generate({ ... });

// Speech (TTS)
const audio = await openai.audio.speech.create({ ... });

// Transcription (STT)
const transcript = await openai.audio.transcriptions.create({ ... });
```

---

### Google Gemini

```powershell
npm install @google/generative-ai
```

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const result = await model.generateContent(prompt);
const text = result.response.text();
```

---

### Cloudflare AI (Workers AI)

```typescript
import { Ai } from '@cloudflare/ai';

const ai = new Ai(env.AI);

// Text generation
const response = await ai.run('@cf/meta/llama-2-7b-chat-int8', {
    prompt: "Your prompt"
});

// Image generation
const image = await ai.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', {
    prompt: "Your prompt"
});

// Embeddings
const embeddings = await ai.run('@cf/baai/bge-base-en-v1.5', {
    text: ["Text to embed"]
});
```

---

## 📦 Przydatne Pakiety

### UI i Komponenty

```powershell
# React UI libraries
npm install @headlessui/react @heroicons/react

# Tailwind plugins
npm install @tailwindcss/forms @tailwindcss/typography

# Icons
npm install lucide-react
```

---

### AI i ML

```powershell
# OpenAI
npm install openai

# Google Gemini
npm install @google/generative-ai

# Anthropic Claude
npm install @anthropic-ai/sdk

# LangChain (orchestration)
npm install langchain

# Hugging Face
npm install @huggingface/inference
```

---

### Storage i Database

```powershell
# Cloudflare używa bindings (nie wymaga npm install):
# - KV (key-value)
# - R2 (object storage)
# - D1 (SQL database)
# - Vectorize (vector DB)

# Konfiguracja w wrangler.jsonc:
{
    "kv_namespaces": [
        { "binding": "KV", "id": "..." }
    ],
    "r2_buckets": [
        { "binding": "R2", "bucket_name": "..." }
    ]
}
```

---

## 🎓 Częste Pytania (FAQ)

### Q: Ile kosztuje hosting na Cloudflare?

**A**: Cloudflare ma **bardzo hojny darmowy plan**:
- Pages: Unlimited requests (free)
- Workers: 100,000 requests/day (free)
- R2: 10 GB storage (free)
- KV: 100,000 reads/day (free)
- D1: 100,000 rows (free)
- Workers AI: 10,000 neurons/day (free)

Dla większości eksperymentów wystarczy darmowy plan!

---

### Q: Jak zabezpieczyć API przed nadużyciem?

**A**: Rate limiting w Workerze:

```typescript
// Prosty rate limiter
const rateLimiter = {
    async check(ip: string, env: any) {
        const key = `rate:${ip}`;
        const count = await env.KV.get(key);
        
        if (count && parseInt(count) > 100) {
            return false; // Przekroczono limit
        }
        
        await env.KV.put(key, (parseInt(count || '0') + 1).toString(), {
            expirationTtl: 3600 // 1 godzina
        });
        
        return true;
    }
};

export async function POST({ request, env, clientAddress }) {
    const allowed = await rateLimiter.check(clientAddress, env);
    
    if (!allowed) {
        return new Response('Too many requests', { status: 429 });
    }
    
    // Przetwórz request...
}
```

---

### Q: Jak testować lokalnie z API keys?

**A**: Użyj `.dev.vars`:

```bash
# .dev.vars (NIE commituj!)
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
GEMINI_API_KEY=...
```

Wrangler automatycznie załaduje te zmienne podczas `npm run dev`.

---

### Q: Jak zaktualizować istniejący projekt?

**A**:
```powershell
cd Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty\moj-projekt

# Pobierz zmiany
git pull

# Zainstaluj nowe deps
npm install

# Rebuild
npm run build

# Redeploy
npm run deploy
```

---

### Q: Jak usunąć stary projekt?

**A**:
```powershell
# 1. Usuń z Cloudflare Dashboard
# Workers & Pages → projekt → Settings → Delete

# 2. Usuń lokalnie
cd Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty
Remove-Item -Recurse moj-projekt

# 3. Usuń z Git (jeśli commitowałeś)
git rm -r src/pages/eksperymenty/moj-projekt
git commit -m "Remove old project"
git push
```

---

## 🎯 Co Dalej?

### 1. Przeczytaj główną dokumentację
📖 [`README.md`](./README.md) - Pełna dokumentacja architektury

### 2. Zobacz przykłady
📂 `_SZABLON/` - Gotowe szablony i przykłady

### 3. Rozpocznij pierwszy projekt
🚀 Użyj checklist powyżej i stwórz swoją pierwszą funkcję!

### 4. Eksperymentuj
🧪 `eksperymenty/` - Testuj nowe pomysły bez obaw

---

**Powodzenia!** 🎉

Masz pytania? Zajrzyj do [`README.md`](./README.md) lub dokumentacji w `_SZABLON/`.
