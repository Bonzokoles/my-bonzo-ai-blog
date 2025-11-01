# 🎨 Przykłady Implementacji - Real-World Use Cases

**Data**: 1 listopada 2025  
**Dla**: Konkretne przykłady gotowych funkcji do wdrożenia

---

## 📋 Spis Treści

1. [Generator Obrazów AI](#1-generator-obrazów-ai)
2. [AI Content Writer](#2-ai-content-writer)
3. [Voice Clone Studio](#3-voice-clone-studio)
4. [AI Chatbot Widget](#4-ai-chatbot-widget)
5. [SEO Article Generator](#5-seo-article-generator)
6. [Image Background Remover](#6-image-background-remover)
7. [Video Summarizer](#7-video-summarizer)
8. [Code Snippet Explainer](#8-code-snippet-explainer)

---

## 1. Generator Obrazów AI

### 🎯 Co to robi?
Generator obrazów oparty na DALL-E 3 lub Stable Diffusion. User wpisuje prompt, dostaje unikalny obraz.

### 📂 Struktura Projektu

```
eksperymenty/generator-obrazow/
├── main-app/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index.astro              ← Główna strona generatora
│   │   │   └── galeria.astro            ← Galeria wygenerowanych
│   │   ├── components/
│   │   │   ├── ImageGenerator.tsx       ← Formularz + logika
│   │   │   ├── ImagePreview.tsx         ← Podgląd obrazu
│   │   │   ├── PromptExamples.tsx       ← Przykładowe prompty
│   │   │   └── ImageHistory.tsx         ← Historia użytkownika
│   │   └── api/
│   │       ├── generate.ts              ← Generowanie obrazu
│   │       ├── save.ts                  ← Zapis do R2
│   │       └── gallery.ts               ← Lista obrazów
│   ├── astro.config.mjs
│   ├── package.json
│   └── wrangler.jsonc                   ← Bindings: AI + R2
└── README.md
```

### 🔧 Konfiguracja

```jsonc
// wrangler.jsonc
{
    "name": "mybonzo-generator-obrazow",
    "compatibility_date": "2025-10-31",
    "ai": {
        "binding": "AI"
    },
    "r2_buckets": [
        {
            "binding": "R2_IMAGES",
            "bucket_name": "mybonzo-generated-images"
        }
    ],
    "kv_namespaces": [
        {
            "binding": "KV",
            "id": "YOUR_KV_ID"
        }
    ]
}
```

### 💻 Kod Implementacji

#### API Endpoint - Cloudflare AI (Darmowy!)

```typescript
// src/pages/api/generate.ts
import { Ai } from '@cloudflare/ai';

export async function POST({ request, env }) {
    const { prompt, style = 'realistic' } = await request.json();
    
    if (!prompt || prompt.length < 5) {
        return new Response(JSON.stringify({
            error: 'Prompt musi mieć min. 5 znaków'
        }), { status: 400 });
    }
    
    // Enhance prompt based on style
    const stylePrompts = {
        realistic: 'photorealistic, high detail, 8k',
        artistic: 'oil painting, artistic, vibrant colors',
        anime: 'anime style, manga, detailed',
        cartoon: 'cartoon style, colorful, playful'
    };
    
    const enhancedPrompt = `${prompt}, ${stylePrompts[style]}`;
    
    try {
        const ai = new Ai(env.AI);
        
        // Generate image using Stable Diffusion XL
        const response = await ai.run(
            '@cf/stabilityai/stable-diffusion-xl-base-1.0',
            {
                prompt: enhancedPrompt,
                num_steps: 20,
                guidance: 7.5
            }
        );
        
        // Generate unique ID
        const imageId = crypto.randomUUID();
        const timestamp = Date.now();
        
        // Save to R2
        await env.R2_IMAGES.put(
            `images/${imageId}.png`,
            response,
            {
                httpMetadata: {
                    contentType: 'image/png'
                },
                customMetadata: {
                    prompt: prompt,
                    style: style,
                    timestamp: timestamp.toString()
                }
            }
        );
        
        // Save metadata to KV
        await env.KV.put(
            `image:${imageId}`,
            JSON.stringify({
                id: imageId,
                prompt,
                style,
                timestamp,
                url: `/api/image/${imageId}`
            }),
            { expirationTtl: 86400 * 30 } // 30 days
        );
        
        return new Response(JSON.stringify({
            success: true,
            imageId,
            url: `/api/image/${imageId}`,
            prompt,
            style
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Image generation error:', error);
        return new Response(JSON.stringify({
            error: 'Błąd generowania obrazu',
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
```

#### Endpoint - Pobieranie Obrazu

```typescript
// src/pages/api/image/[id].ts
export async function GET({ params, env }) {
    const { id } = params;
    
    try {
        const object = await env.R2_IMAGES.get(`images/${id}.png`);
        
        if (!object) {
            return new Response('Image not found', { status: 404 });
        }
        
        return new Response(object.body, {
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=86400',
                'ETag': object.etag
            }
        });
        
    } catch (error) {
        return new Response('Error loading image', { status: 500 });
    }
}
```

#### Komponent React - Generator UI

```tsx
// src/components/ImageGenerator.tsx
import { useState } from 'react';

export default function ImageGenerator() {
    const [prompt, setPrompt] = useState('');
    const [style, setStyle] = useState('realistic');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const styles = [
        { value: 'realistic', label: '📷 Realistyczny', emoji: '📷' },
        { value: 'artistic', label: '🎨 Artystyczny', emoji: '🎨' },
        { value: 'anime', label: '🎌 Anime', emoji: '🎌' },
        { value: 'cartoon', label: '🎭 Kreskówka', emoji: '🎭' }
    ];
    
    const examplePrompts = [
        "Futuristic city at sunset with flying cars",
        "Magical forest with glowing mushrooms",
        "Cyberpunk street with neon lights",
        "Fantasy castle on floating island"
    ];
    
    const generateImage = async () => {
        if (prompt.length < 5) {
            setError('Prompt musi mieć min. 5 znaków');
            return;
        }
        
        setLoading(true);
        setError('');
        setImageUrl('');
        
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, style })
            });
            
            const data = await response.json();
            
            if (data.error) {
                setError(data.error);
            } else {
                setImageUrl(data.url);
            }
        } catch (err) {
            setError('Błąd połączenia. Spróbuj ponownie.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="generator-container max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-2">🎨 AI Image Generator</h1>
                <p className="text-gray-600">Wygeneruj unikalny obraz za pomocą AI</p>
            </div>
            
            {/* Style Selection */}
            <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Wybierz styl:</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {styles.map((s) => (
                        <button
                            key={s.value}
                            onClick={() => setStyle(s.value)}
                            className={`p-3 rounded-lg border-2 transition ${
                                style === s.value
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <div className="text-2xl mb-1">{s.emoji}</div>
                            <div className="text-sm font-medium">{s.label}</div>
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Prompt Input */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                    Opisz obraz (po angielsku):
                </label>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="A beautiful sunset over mountains with a lake..."
                    rows={4}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-sm text-gray-500 mt-1">
                    {prompt.length}/500 znaków
                </div>
            </div>
            
            {/* Example Prompts */}
            <div className="mb-6">
                <p className="text-sm font-medium mb-2">💡 Przykładowe prompty:</p>
                <div className="flex flex-wrap gap-2">
                    {examplePrompts.map((example, i) => (
                        <button
                            key={i}
                            onClick={() => setPrompt(example)}
                            className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition"
                        >
                            {example}
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Generate Button */}
            <button
                onClick={generateImage}
                disabled={loading || prompt.length < 5}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition ${
                    loading || prompt.length < 5
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
                {loading ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <circle 
                                className="opacity-25" 
                                cx="12" 
                                cy="12" 
                                r="10" 
                                stroke="currentColor" 
                                strokeWidth="4"
                                fill="none"
                            />
                            <path 
                                className="opacity-75" 
                                fill="currentColor" 
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                        </svg>
                        Generuję obraz...
                    </span>
                ) : (
                    '✨ Wygeneruj Obraz'
                )}
            </button>
            
            {/* Error Display */}
            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700">❌ {error}</p>
                </div>
            )}
            
            {/* Image Display */}
            {imageUrl && (
                <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                    <img
                        src={imageUrl}
                        alt="Generated"
                        className="w-full rounded-lg mb-4"
                    />
                    <div className="flex gap-3">
                        <a
                            href={imageUrl}
                            download
                            className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg text-center hover:bg-green-700 transition"
                        >
                            💾 Pobierz
                        </a>
                        <button
                            onClick={() => {
                                setImageUrl('');
                                setPrompt('');
                            }}
                            className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                        >
                            🔄 Generuj Nowy
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
```

### 🚀 Deployment

```powershell
# 1. Utwórz R2 bucket
wrangler r2 bucket create mybonzo-generated-images

# 2. Utwórz KV namespace
wrangler kv:namespace create "KV"

# 3. Deploy
cd eksperymenty/generator-obrazow/main-app
npm install
npm run build
npm run deploy
```

### 💰 Koszty

- **Cloudflare Workers AI**: 10,000 zapytań/dzień (FREE)
- **R2 Storage**: 10 GB (FREE)
- **KV**: 100,000 odczytów/dzień (FREE)

**Wystarczy dla ~300 obrazów dziennie za darmo!**

---

## 2. AI Content Writer

### 🎯 Co to robi?
Generator artykułów blogowych, postów na social media, meta descriptions, itp.

### 📂 Struktura

```
eksperymenty/ai-writer/
└── main-app/
    ├── src/
    │   ├── pages/
    │   │   ├── index.astro              ← Dashboard
    │   │   ├── blog-post.astro          ← Generator postów
    │   │   ├── social-media.astro       ← Posty social
    │   │   └── seo-content.astro        ← SEO descriptions
    │   ├── components/
    │   │   ├── WriterForm.tsx
    │   │   ├── ContentPreview.tsx
    │   │   └── ExportOptions.tsx
    │   └── api/
    │       ├── generate-post.ts
    │       ├── generate-social.ts
    │       └── generate-seo.ts
```

### 💻 API Endpoint - Blog Post Generator

```typescript
// src/pages/api/generate-post.ts
import OpenAI from 'openai';

export async function POST({ request }) {
    const { topic, keywords, tone, length } = await request.json();
    
    const openai = new OpenAI({
        apiKey: import.meta.env.OPENAI_API_KEY
    });
    
    const systemPrompt = `Jesteś profesjonalnym copywriterem specjalizującym się w content marketingu. 
Tworzysz wartościowe, SEO-friendly artykuły blogowe.`;
    
    const userPrompt = `Napisz artykuł blogowy na temat: "${topic}"

Wymagania:
- Długość: ${length} słów
- Ton: ${tone}
- Słowa kluczowe: ${keywords.join(', ')}
- Format: Markdown
- Struktura: Nagłówek H1, wprowadzenie, 3-5 sekcji z H2, podsumowanie
- Każda sekcja min. 2 akapity
- Dodaj praktyczne przykłady
- Zakończ CTA (Call to Action)`;
    
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.7,
            max_tokens: length * 2 // aproksymacja
        });
        
        const content = completion.choices[0].message.content;
        
        // Generate SEO meta
        const metaCompletion = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                {
                    role: "system",
                    content: "Generujesz SEO meta descriptions (max 160 znaków)"
                },
                {
                    role: "user",
                    content: `Meta description dla artykułu: "${topic}"`
                }
            ],
            max_tokens: 100
        });
        
        const metaDescription = metaCompletion.choices[0].message.content;
        
        return new Response(JSON.stringify({
            success: true,
            content,
            metaDescription,
            usage: completion.usage,
            wordCount: content.split(/\s+/).length
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

## 3. Voice Clone Studio

### 🎯 Co to robi?
Klonowanie głosu z próbki audio + generowanie mowy z tekstu.

### 🔧 Integracja z ElevenLabs

```typescript
// src/pages/api/voice/clone.ts

export async function POST({ request }) {
    const formData = await request.formData();
    const audioFile = formData.get('audio');
    const voiceName = formData.get('name');
    const description = formData.get('description');
    
    // Upload do ElevenLabs
    const cloneFormData = new FormData();
    cloneFormData.append('name', voiceName);
    cloneFormData.append('files', audioFile);
    cloneFormData.append('description', description);
    
    try {
        const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
            method: 'POST',
            headers: {
                'xi-api-key': import.meta.env.ELEVENLABS_API_KEY
            },
            body: cloneFormData
        });
        
        const { voice_id } = await response.json();
        
        return new Response(JSON.stringify({
            success: true,
            voice_id,
            message: 'Głos sklonowany pomyślnie'
        }));
        
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500
        });
    }
}

// src/pages/api/voice/generate.ts
export async function POST({ request }) {
    const { text, voice_id, stability = 0.5, similarity = 0.75 } = await request.json();
    
    try {
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
                    model_id: 'eleven_multilingual_v2',
                    voice_settings: {
                        stability,
                        similarity_boost: similarity
                    }
                })
            }
        );
        
        return new Response(response.body, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': `attachment; filename="speech-${Date.now()}.mp3"`
            }
        });
        
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500
        });
    }
}
```

---

Dokument jest zbyt długi, tworzę dodatkowe pliki dla pozostałych przykładów...

---

**Status**: Część 1/2 (Generator Obrazów, AI Writer, Voice Clone)  
**Następna część**: Chatbot, SEO Generator, Video Summarizer, Code Explainer
