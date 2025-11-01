# 📋 Scenariusze i Case Studies - Konkretne Workflow

**Data**: 1 listopada 2025  
**Dla**: Szczegółowe instrukcje dla popularnych scenariuszy

---

## 📋 Spis Treści

1. [Scenariusz 1: Blog z AI Generatorem](#scenariusz-1-blog-z-ai-generatorem)
2. [Scenariusz 2: Multi-Tool AI Dashboard](#scenariusz-2-multi-tool-ai-dashboard)
3. [Scenariusz 3: Import Projektu z GitHub](#scenariusz-3-import-projektu-z-github)
4. [Scenariusz 4: A/B Testing Funkcji](#scenariusz-4-ab-testing-funkcji)
5. [Scenariusz 5: Private API dla Mobile App](#scenariusz-5-private-api-dla-mobile-app)

---

## Scenariusz 1: Blog z AI Generatorem

### 🎯 Cel
Dodać do istniejącego bloga generator artykułów AI dostępny pod `/ai-writer`.

### 📝 Wymagania
- Blog już działa na `mybonzo.com`
- Chcemy dodać generator artykułów bez przebudowy bloga
- Generator ma być dostępny tylko dla zalogowanych użytkowników
- Wygenerowane artykuły zapisujemy do drafts

### 🚀 Krok po Kroku

#### 1. Przygotowanie Struktury (5 min)

```powershell
cd Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty
Copy-Item -Recurse "_SZABLON" "ai-writer"
cd ai-writer/main-app
```

#### 2. Konfiguracja (5 min)

**Zmień nazwę w `wrangler.jsonc`**:
```jsonc
{
    "name": "mybonzo-ai-writer",
    "compatibility_date": "2025-10-31",
    "kv_namespaces": [
        {
            "binding": "DRAFTS",
            "id": "YOUR_KV_ID"  // Utwórz: wrangler kv:namespace create "DRAFTS"
        }
    ]
}
```

**Ustaw secrets**:
```powershell
# Lokalnie - .dev.vars
echo "OPENAI_API_KEY=sk-..." > .dev.vars

# Produkcja
wrangler pages secret put OPENAI_API_KEY
```

#### 3. Implementacja API (15 min)

**Utwórz `src/pages/api/generate-article.ts`**:

```typescript
import OpenAI from 'openai';

export async function POST({ request, env, locals }) {
    // Sprawdź auth
    if (!locals.user) {
        return new Response('Unauthorized', { status: 401 });
    }
    
    const { topic, keywords, tone } = await request.json();
    
    const openai = new OpenAI({
        apiKey: env.OPENAI_API_KEY
    });
    
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "Jesteś ekspertem content marketingu. Tworzysz wartościowe artykuły blogowe w języku polskim."
                },
                {
                    role: "user",
                    content: `Napisz artykuł na temat: "${topic}". Słowa kluczowe: ${keywords.join(', ')}. Ton: ${tone}.`
                }
            ],
            temperature: 0.7,
            max_tokens: 2000
        });
        
        const content = completion.choices[0].message.content;
        const draftId = crypto.randomUUID();
        
        // Zapisz draft do KV
        await env.DRAFTS.put(
            `draft:${locals.user.id}:${draftId}`,
            JSON.stringify({
                id: draftId,
                topic,
                content,
                createdAt: Date.now(),
                status: 'draft'
            }),
            { expirationTtl: 86400 * 7 } // 7 dni
        );
        
        return new Response(JSON.stringify({
            success: true,
            draftId,
            content,
            preview: content.substring(0, 200) + '...'
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

#### 4. UI Component (20 min)

**Utwórz `src/components/ArticleGenerator.tsx`**:

```tsx
import { useState } from 'react';

export default function ArticleGenerator() {
    const [topic, setTopic] = useState('');
    const [keywords, setKeywords] = useState('');
    const [tone, setTone] = useState('professional');
    const [loading, setLoading] = useState(false);
    const [article, setArticle] = useState('');
    
    const tones = [
        { value: 'professional', label: '👔 Profesjonalny' },
        { value: 'casual', label: '😊 Swobodny' },
        { value: 'technical', label: '🔬 Techniczny' },
        { value: 'creative', label: '🎨 Kreatywny' }
    ];
    
    const generate = async () => {
        setLoading(true);
        setArticle('');
        
        try {
            const response = await fetch('/api/generate-article', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic,
                    keywords: keywords.split(',').map(k => k.trim()),
                    tone
                })
            });
            
            const data = await response.json();
            
            if (data.error) {
                alert('Błąd: ' + data.error);
            } else {
                setArticle(data.content);
            }
        } catch (err) {
            alert('Błąd połączenia');
        } finally {
            setLoading(false);
        }
    };
    
    const saveToWordPress = async () => {
        // Tutaj integracja z WordPress API
        alert('Funkcja w przygotowaniu');
    };
    
    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="grid md:grid-cols-2 gap-6">
                {/* Left Panel - Form */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold mb-4">✍️ Generator Artykułów</h2>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Temat artykułu:</label>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="np. Sztuczna inteligencja w marketingu"
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Słowa kluczowe (oddzielone przecinkami):
                        </label>
                        <input
                            type="text"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            placeholder="AI, marketing, automatyzacja"
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Ton artykułu:</label>
                        <div className="grid grid-cols-2 gap-2">
                            {tones.map((t) => (
                                <button
                                    key={t.value}
                                    onClick={() => setTone(t.value)}
                                    className={`p-2 rounded border-2 text-sm ${
                                        tone === t.value
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200'
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <button
                        onClick={generate}
                        disabled={loading || !topic}
                        className="w-full py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? '⏳ Generuję...' : '✨ Wygeneruj Artykuł'}
                    </button>
                </div>
                
                {/* Right Panel - Preview */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold mb-4">📄 Podgląd</h2>
                    
                    {article ? (
                        <>
                            <div className="prose max-w-none mb-4 max-h-96 overflow-y-auto">
                                {article.split('\n').map((para, i) => (
                                    <p key={i}>{para}</p>
                                ))}
                            </div>
                            
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigator.clipboard.writeText(article)}
                                    className="flex-1 py-2 px-4 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    📋 Kopiuj
                                </button>
                                <button
                                    onClick={saveToWordPress}
                                    className="flex-1 py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    💾 Zapisz do WP
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-gray-400 py-20">
                            <p className="text-4xl mb-2">📝</p>
                            <p>Artykuł pojawi się tutaj po wygenerowaniu</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
```

#### 5. Strona Główna (5 min)

**Edytuj `src/pages/index.astro`**:

```astro
---
import Layout from '@/layouts/Layout.astro';
import ArticleGenerator from '@/components/ArticleGenerator';

// Sprawdź auth
const user = Astro.locals.user;
if (!user) {
    return Astro.redirect('/login');
}
---

<Layout title="AI Writer - Generator Artykułów">
    <ArticleGenerator client:load />
</Layout>
```

#### 6. Deploy (5 min)

```powershell
# Zainstaluj deps
npm install openai

# Build
npm run build

# Deploy
npm run deploy

# Notuj URL (np. https://mybonzo-ai-writer.pages.dev)
```

#### 7. Routing przez Proxy (10 min)

**Edytuj główny Worker proxy** (`public/worker-proxy/index.js`):

```javascript
const ROUTES = [
    // Istniejące routes...
    
    // Nowy route dla AI Writer
    {
        prefix: '/ai-writer/',
        target: 'https://mybonzo-ai-writer.pages.dev',
        name: 'AI Writer',
        requireAuth: true  // Wymaga logowania
    }
];

async function handleRequest(request) {
    const url = new URL(request.url);
    
    // Znajdź matching route
    for (const route of ROUTES) {
        if (url.pathname.startsWith(route.prefix)) {
            // Sprawdź auth jeśli wymagane
            if (route.requireAuth) {
                const session = await checkSession(request);
                if (!session) {
                    return Response.redirect('/login', 302);
                }
            }
            
            // Proxy request
            const targetUrl = route.target + url.pathname.replace(route.prefix, '/');
            return fetch(targetUrl, request);
        }
    }
    
    // Default - główny blog
    return fetch(MAIN_SITE_URL + url.pathname, request);
}
```

**Deploy Worker**:
```powershell
cd public/worker-proxy
wrangler deploy
```

#### 8. Dodaj Custom Domain (5 min)

Dashboard Cloudflare → Workers & Pages → `mybonzo-proxy-worker` → Triggers → Add Custom Domain → `mybonzo.com`

### ✅ Rezultat

- ✅ Generator dostępny pod `https://mybonzo.com/ai-writer/`
- ✅ Wymaga logowania (route protected)
- ✅ Drafty zapisywane w KV
- ✅ Główny blog działa bez zmian
- ✅ Całkowity czas: **~1 godzina**

---

## Scenariusz 2: Multi-Tool AI Dashboard

### 🎯 Cel
Stwórz hub z kilkoma narzędziami AI (generator tekstu, obrazów, TTS) pod jednym dashboardem.

### 📂 Struktura

```
eksperymenty/ai-tools/
├── main-app/                      ← Dashboard (hub)
│   └── src/pages/
│       ├── index.astro            ← Lista narzędzi
│       └── [tool]/
│           └── index.astro        ← Dynamic routing
│
├── generator-tekstu/              ← Tool 1
├── generator-obrazow/             ← Tool 2
├── text-to-speech/                ← Tool 3
└── voice-clone/                   ← Tool 4
```

### 🚀 Implementacja (30 min)

#### 1. Dashboard z Dynamic Routing

```astro
---
// src/pages/[tool]/index.astro
import Layout from '@/layouts/Layout.astro';

const { tool } = Astro.params;

const tools = {
    'generator-tekstu': {
        title: '✍️ Generator Tekstu',
        component: 'TextGenerator',
        description: 'Generuj artykuły, posty, opisy'
    },
    'generator-obrazow': {
        title: '🎨 Generator Obrazów',
        component: 'ImageGenerator',
        description: 'Twórz obrazy za pomocą AI'
    },
    'text-to-speech': {
        title: '🗣️ Text-to-Speech',
        component: 'TTSGenerator',
        description: 'Zamieniaj tekst na mowę'
    }
};

const currentTool = tools[tool];

if (!currentTool) {
    return Astro.redirect('/404');
}
---

<Layout title={currentTool.title}>
    <div class="max-w-7xl mx-auto p-6">
        {/* Breadcrumb */}
        <nav class="mb-6">
            <a href="/ai-tools" class="text-blue-600 hover:underline">← Wszystkie narzędzia</a>
        </nav>
        
        {/* Tool Content */}
        <h1 class="text-4xl font-bold mb-2">{currentTool.title}</h1>
        <p class="text-gray-600 mb-8">{currentTool.description}</p>
        
        {/* Dynamic Component Loading */}
        {currentTool.component === 'TextGenerator' && (
            <TextGenerator client:load />
        )}
        {currentTool.component === 'ImageGenerator' && (
            <ImageGenerator client:load />
        )}
        {currentTool.component === 'TTSGenerator' && (
            <TTSGenerator client:load />
        )}
    </div>
</Layout>
```

#### 2. Dashboard Homepage

```astro
---
// src/pages/index.astro
import Layout from '@/layouts/Layout.astro';

const tools = [
    {
        id: 'generator-tekstu',
        icon: '✍️',
        title: 'Generator Tekstu',
        description: 'Artykuły, posty, opisy produktów',
        color: 'bg-blue-50 border-blue-200'
    },
    {
        id: 'generator-obrazow',
        icon: '🎨',
        title: 'Generator Obrazów',
        description: 'AI art, fotografie, ilustracje',
        color: 'bg-purple-50 border-purple-200'
    },
    {
        id: 'text-to-speech',
        icon: '🗣️',
        title: 'Text-to-Speech',
        description: 'Zamieniaj tekst na naturalną mowę',
        color: 'bg-green-50 border-green-200'
    },
    {
        id: 'voice-clone',
        icon: '🎙️',
        title: 'Voice Clone',
        description: 'Klonuj głos z próbki audio',
        color: 'bg-orange-50 border-orange-200'
    }
];
---

<Layout title="AI Tools Dashboard">
    <div class="max-w-7xl mx-auto p-6">
        <header class="text-center mb-12">
            <h1 class="text-5xl font-bold mb-4">🤖 AI Tools Hub</h1>
            <p class="text-xl text-gray-600">
                Zestaw narzędzi AI do tworzenia treści, obrazów i audio
            </p>
        </header>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
                <a 
                    href={`/ai-tools/${tool.id}`}
                    class={`${tool.color} border-2 rounded-lg p-6 hover:shadow-lg transition block`}
                >
                    <div class="text-5xl mb-4">{tool.icon}</div>
                    <h2 class="text-xl font-bold mb-2">{tool.title}</h2>
                    <p class="text-gray-600 text-sm">{tool.description}</p>
                </a>
            ))}
        </div>
    </div>
</Layout>
```

### ✅ Rezultat

- ✅ Jeden dashboard dla wszystkich narzędzi
- ✅ Dynamic routing (`/ai-tools/[tool]`)
- ✅ Łatwe dodawanie nowych narzędzi
- ✅ Spójny design

---

## Scenariusz 3: Import Projektu z GitHub

### 🎯 Cel
Masz gotowy projekt React na GitHub. Chcesz go uruchomić na `mybonzo.com/projekt`.

### 🚀 Workflow (20 min)

#### 1. Clone Repo

```powershell
cd Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty
git clone https://github.com/username/react-app.git my-project
cd my-project
```

#### 2. Dodaj Astro Wrapper (jeśli React bez Astro)

**Zainstaluj Astro + React adapter**:
```powershell
npm install astro @astrojs/react @astrojs/cloudflare
```

**Utwórz `astro.config.mjs`**:
```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
    integrations: [react()],
    output: 'server',
    adapter: cloudflare({ mode: 'advanced' }),
    base: '/my-project/',  // ← WAŻNE!
    trailingSlash: 'always'
});
```

**Przenieś komponenty React**:
```powershell
# Struktura:
src/
├── pages/
│   └── index.astro     ← Wrapper dla React App
└── components/
    └── App.tsx         ← Twoja React App
```

**`src/pages/index.astro`**:
```astro
---
import App from '@/components/App';
---

<!DOCTYPE html>
<html>
<head>
    <title>My Project</title>
</head>
<body>
    <App client:load />
</body>
</html>
```

#### 3. Dodaj Wrangler Config

**Skopiuj z szablonu**:
```powershell
Copy-Item Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty\_SZABLON\main-app\wrangler.jsonc .
```

**Edytuj nazwę**:
```jsonc
{
    "name": "mybonzo-my-project",
    "compatibility_date": "2025-10-31"
}
```

#### 4. Build i Deploy

```powershell
npm install
npm run build
wrangler pages deploy ./dist --project-name=mybonzo-my-project
```

#### 5. Dodaj Routing

**W głównym Worker** (`public/worker-proxy/index.js`):
```javascript
{
    prefix: '/my-project/',
    target: 'https://mybonzo-my-project.pages.dev',
    name: 'My Project'
}
```

Deploy Worker:
```powershell
cd Q:\mybonzo\mybonzoAIblog\public\worker-proxy
wrangler deploy
```

### ✅ Rezultat

- ✅ Projekt GitHub działa na `mybonzo.com/my-project`
- ✅ Zachowane wszystkie funkcje React
- ✅ Wrappowane w Astro dla SSR
- ✅ Czas: ~20 minut

---

## Scenariusz 4: A/B Testing Funkcji

### 🎯 Cel
Testuj dwie wersje tej samej funkcji (np. różne UI dla generatora) i kieruj 50% użytkowników do każdej.

### 🚀 Implementacja (15 min)

#### 1. Deploy Dwóch Wersji

```powershell
# Wersja A
cd eksperymenty/generator-v1
npm run deploy
# URL: https://mybonzo-generator-v1.pages.dev

# Wersja B
cd ../generator-v2
npm run deploy
# URL: https://mybonzo-generator-v2.pages.dev
```

#### 2. A/B Logic w Worker

```javascript
// worker-proxy/index.js

async function handleRequest(request) {
    const url = new URL(request.url);
    
    if (url.pathname.startsWith('/generator/')) {
        // A/B test: 50/50 split
        const variant = Math.random() < 0.5 ? 'A' : 'B';
        
        const targetUrl = variant === 'A'
            ? 'https://mybonzo-generator-v1.pages.dev'
            : 'https://mybonzo-generator-v2.pages.dev';
        
        const response = await fetch(
            targetUrl + url.pathname.replace('/generator/', '/'),
            request
        );
        
        // Dodaj header z wariantem (do analytics)
        const modifiedResponse = new Response(response.body, response);
        modifiedResponse.headers.set('X-Variant', variant);
        
        return modifiedResponse;
    }
    
    // ... reszta routingu
}
```

#### 3. Analytics (opcjonalnie)

```javascript
// Loguj do Analytics
await fetch('https://analytics.example.com/track', {
    method: 'POST',
    body: JSON.stringify({
        event: 'ab_test_view',
        variant: variant,
        path: url.pathname,
        timestamp: Date.now()
    })
});
```

### ✅ Rezultat

- ✅ 50% użytkowników widzi wersję A, 50% wersję B
- ✅ Tracking wariantu w headers
- ✅ Łatwa zmiana % split
- ✅ Możliwość logowania do analytics

---

## Scenariusz 5: Private API dla Mobile App

### 🎯 Cel
Stwórz prywatne API dla aplikacji mobilnej z auth tokenami.

### 🚀 Implementacja (30 min)

#### 1. API Endpoints z Auth

```typescript
// src/pages/api/v1/generate.ts

async function verifyToken(token: string, env: any): Promise<boolean> {
    const storedToken = await env.KV.get(`token:${token}`);
    return storedToken !== null;
}

export async function POST({ request, env }) {
    // Sprawdź auth header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({
            error: 'Missing or invalid Authorization header'
        }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const isValid = await verifyToken(token, env);
    
    if (!isValid) {
        return new Response(JSON.stringify({
            error: 'Invalid token'
        }), { status: 403 });
    }
    
    // Główna logika API
    const { prompt } = await request.json();
    
    // ... generowanie treści
    
    return new Response(JSON.stringify({
        success: true,
        data: result
    }));
}
```

#### 2. Token Management

```typescript
// src/pages/api/v1/auth/token.ts

export async function POST({ request, env }) {
    const { api_key, secret } = await request.json();
    
    // Sprawdź credentials
    if (api_key !== env.API_KEY || secret !== env.API_SECRET) {
        return new Response('Invalid credentials', { status: 401 });
    }
    
    // Generuj token
    const token = crypto.randomUUID();
    
    // Zapisz do KV (ważny 30 dni)
    await env.KV.put(
        `token:${token}`,
        JSON.stringify({
            created: Date.now(),
            apiKey: api_key
        }),
        { expirationTtl: 86400 * 30 }
    );
    
    return new Response(JSON.stringify({
        token,
        expiresIn: 2592000 // 30 dni w sekundach
    }));
}
```

#### 3. Rate Limiting

```typescript
// Middleware dla rate limiting
async function checkRateLimit(token: string, env: any): Promise<boolean> {
    const key = `ratelimit:${token}`;
    const count = await env.KV.get(key);
    
    if (count && parseInt(count) > 1000) {
        return false; // Przekroczono limit
    }
    
    await env.KV.put(
        key,
        (parseInt(count || '0') + 1).toString(),
        { expirationTtl: 3600 } // Reset co godzinę
    );
    
    return true;
}
```

#### 4. Mobile App Integration (React Native)

```typescript
// app/services/api.ts

const API_BASE = 'https://mybonzo.com/api/v1';
let authToken: string | null = null;

export async function authenticate(apiKey: string, secret: string) {
    const response = await fetch(`${API_BASE}/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: apiKey, secret })
    });
    
    const data = await response.json();
    authToken = data.token;
    
    // Zapisz token lokalnie
    await AsyncStorage.setItem('auth_token', authToken);
    
    return authToken;
}

export async function generateContent(prompt: string) {
    if (!authToken) {
        throw new Error('Not authenticated');
    }
    
    const response = await fetch(`${API_BASE}/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ prompt })
    });
    
    return await response.json();
}
```

### ✅ Rezultat

- ✅ Secure API z token auth
- ✅ Rate limiting (1000 req/h per token)
- ✅ Token expiration (30 dni)
- ✅ Ready dla mobile app integration

---

**Status**: Kompletny zestaw scenariuszy  
**Następne kroki**: Implementuj wybrany scenariusz i eksperymentuj!
