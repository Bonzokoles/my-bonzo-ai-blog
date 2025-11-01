# 🔗 Integracje i API - Przewodnik po External Services

**Data**: 1 listopada 2025  
**Dla**: Integracja z popularnymi serwisami AI i nie tylko

---

## 📋 Spis Treści

1. [OpenAI](#openai)
2. [Google Gemini](#google-gemini)
3. [Cloudflare AI](#cloudflare-ai)
4. [ElevenLabs](#elevenlabs)
5. [Replicate](#replicate)
6. [Hugging Face](#hugging-face)
7. [Stability AI](#stability-ai)
8. [Storage Solutions](#storage-solutions)

---

## OpenAI

### 🔑 Setup

```powershell
npm install openai
```

**.dev.vars** (local):
```bash
OPENAI_API_KEY=sk-proj-...
```

**Production** (Cloudflare):
```powershell
wrangler pages secret put OPENAI_API_KEY
```

### 💰 Pricing (Styczeń 2025)

| Model | Input | Output | Use Case |
|-------|-------|--------|----------|
| GPT-4 Turbo | $10 / 1M tokens | $30 / 1M tokens | Złożone zadania |
| GPT-4 | $30 / 1M | $60 / 1M | Najwyższa jakość |
| GPT-3.5 Turbo | $0.50 / 1M | $1.50 / 1M | Szybkie, proste |
| DALL-E 3 | $0.040 / image (1024x1024) | - | Generowanie obrazów |
| Whisper | $0.006 / min | - | Speech-to-Text |
| TTS | $15 / 1M chars | - | Text-to-Speech |

### 📝 Użycie

#### Chat Completion (GPT-4)

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: import.meta.env.OPENAI_API_KEY
});

// Prosty chat
const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
        {
            role: "system",
            content: "Jesteś pomocnym asystentem."
        },
        {
            role: "user",
            content: "Napisz krótki wiersz o AI"
        }
    ],
    temperature: 0.7,
    max_tokens: 500
});

console.log(completion.choices[0].message.content);
```

#### Streaming Response

```typescript
const stream = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [{ role: "user", content: "Opowiedz historię..." }],
    stream: true
});

for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    process.stdout.write(content);
}
```

#### Image Generation (DALL-E 3)

```typescript
const image = await openai.images.generate({
    model: "dall-e-3",
    prompt: "A futuristic city at sunset",
    n: 1,
    size: "1024x1024",
    quality: "standard", // lub "hd"
    style: "vivid" // lub "natural"
});

const imageUrl = image.data[0].url;
```

#### Speech-to-Text (Whisper)

```typescript
const transcription = await openai.audio.transcriptions.create({
    file: audioFile, // File object
    model: "whisper-1",
    language: "pl" // opcjonalne
});

console.log(transcription.text);
```

#### Text-to-Speech

```typescript
const mp3 = await openai.audio.speech.create({
    model: "tts-1", // lub "tts-1-hd"
    voice: "alloy", // alloy, echo, fable, onyx, nova, shimmer
    input: "Witaj! Jestem AI."
});

// Zapisz lub streamuj audio
const buffer = Buffer.from(await mp3.arrayBuffer());
```

---

## Google Gemini

### 🔑 Setup

```powershell
npm install @google/generative-ai
```

**.dev.vars**:
```bash
GEMINI_API_KEY=AIza...
```

### 💰 Pricing

| Model | Free Tier | Paid |
|-------|-----------|------|
| Gemini 1.5 Flash | 15 RPM, 1M TPM | $0.075 / 1M tokens (input) |
| Gemini 1.5 Pro | 2 RPM, 32K TPM | $1.25 / 1M (input), $5 / 1M (output) |

### 📝 Użycie

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.GEMINI_API_KEY);

// Text generation
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const result = await model.generateContent("Napisz wiersz o morzu");
const text = result.response.text();

// Vision (image + text)
const visionModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const image = {
    inlineData: {
        data: imageBase64,
        mimeType: "image/jpeg"
    }
};

const result = await visionModel.generateContent([
    "Co jest na tym obrazie?",
    image
]);
```

---

## Cloudflare AI

### 🔑 Setup

**wrangler.jsonc**:
```jsonc
{
    "ai": {
        "binding": "AI"
    }
}
```

### 💰 Pricing

**FREE TIER**: 10,000 neurons/day (bardzo hojne!)  
**Paid**: $0.011 / 1000 neurons

### 📝 Dostępne Modele

```typescript
import { Ai } from '@cloudflare/ai';

const ai = new Ai(env.AI);

// Text Generation (LLama 2)
const response = await ai.run('@cf/meta/llama-2-7b-chat-int8', {
    prompt: "Napisz opowiadanie"
});

// Image Generation (Stable Diffusion XL)
const image = await ai.run(
    '@cf/stabilityai/stable-diffusion-xl-base-1.0',
    {
        prompt: "A beautiful landscape",
        num_steps: 20
    }
);

// Text Embeddings
const embeddings = await ai.run('@cf/baai/bge-base-en-v1.5', {
    text: ["Hello world", "Goodbye world"]
});

// Translation
const translation = await ai.run('@cf/meta/m2m100-1.2b', {
    text: "Hello, how are you?",
    source_lang: "english",
    target_lang: "polish"
});

// Automatic Speech Recognition
const transcription = await ai.run('@cf/openai/whisper', {
    audio: audioArrayBuffer
});

// Image Classification
const classification = await ai.run('@cf/microsoft/resnet-50', {
    image: imageArrayBuffer
});
```

### 🎯 Pełna Lista Modeli

**Text Generation**:
- `@cf/meta/llama-2-7b-chat-int8`
- `@cf/mistral/mistral-7b-instruct-v0.1`
- `@cf/openchat/openchat-3.5-0106`

**Image Generation**:
- `@cf/stabilityai/stable-diffusion-xl-base-1.0`
- `@cf/lykon/dreamshaper-8-lcm`

**Embeddings**:
- `@cf/baai/bge-base-en-v1.5`
- `@cf/baai/bge-large-en-v1.5`

---

## ElevenLabs

### 🔑 Setup

**.dev.vars**:
```bash
ELEVENLABS_API_KEY=sk_...
```

### 💰 Pricing

| Plan | Price | Characters/mo |
|------|-------|---------------|
| Free | $0 | 10,000 |
| Starter | $5 | 30,000 |
| Creator | $22 | 100,000 |
| Pro | $99 | 500,000 |

### 📝 Text-to-Speech

```typescript
const voiceId = "21m00Tcm4TlvDq8ikWAM"; // Rachel

const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
        method: 'POST',
        headers: {
            'xi-api-key': env.ELEVENLABS_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: "Witaj! To jest test głosu AI.",
            model_id: "eleven_multilingual_v2",
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
                style: 0.5,
                use_speaker_boost: true
            }
        })
    }
);

// Zwróć audio stream
return new Response(response.body, {
    headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment; filename="speech.mp3"'
    }
});
```

### 🎙️ Voice Cloning

```typescript
// 1. Upload voice sample
const formData = new FormData();
formData.append('name', 'My Voice Clone');
formData.append('files', audioFile);
formData.append('description', 'Clone of my voice');

const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
    method: 'POST',
    headers: {
        'xi-api-key': env.ELEVENLABS_API_KEY
    },
    body: formData
});

const { voice_id } = await response.json();

// 2. Use cloned voice
// (użyj voice_id w TTS jak wyżej)
```

### 📋 Lista Głosów

```typescript
const response = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: {
        'xi-api-key': env.ELEVENLABS_API_KEY
    }
});

const { voices } = await response.json();

voices.forEach(voice => {
    console.log(`${voice.name}: ${voice.voice_id}`);
});
```

---

## Replicate

### 🔑 Setup

```powershell
npm install replicate
```

**.dev.vars**:
```bash
REPLICATE_API_TOKEN=r8_...
```

### 💰 Pricing

Pay-per-use, różnie w zależności od modelu. Przykłady:
- Stable Diffusion: ~$0.0023 / image
- Llama 2: ~$0.0001 / token

### 📝 Użycie

```typescript
import Replicate from 'replicate';

const replicate = new Replicate({
    auth: env.REPLICATE_API_TOKEN
});

// Image Generation (Stable Diffusion)
const output = await replicate.run(
    "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
    {
        input: {
            prompt: "A futuristic cityscape at night",
            negative_prompt: "blurry, low quality",
            width: 1024,
            height: 1024,
            num_inference_steps: 25
        }
    }
);

// output jest URL do wygenerowanego obrazu
console.log(output[0]); // https://replicate.delivery/...
```

### 🎨 Popularne Modele

**Image Generation**:
```typescript
// Stable Diffusion XL
"stability-ai/sdxl:..."

// Midjourney-style
"prompthero/openjourney:..."
```

**Image Editing**:
```typescript
// Background removal
"cjwbw/rembg:..."

// Image upscaling
"nightmareai/real-esrgan:..."
```

**Video**:
```typescript
// Text-to-video
"anotherjesse/zeroscope-v2-xl:..."
```

---

## Hugging Face

### 🔑 Setup

```powershell
npm install @huggingface/inference
```

**.dev.vars**:
```bash
HF_API_TOKEN=hf_...
```

### 💰 Pricing

**FREE**: Rate limited  
**Pro**: $9/mo, 10x więcej requestów  
**Enterprise**: Custom

### 📝 Użycie

```typescript
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(env.HF_API_TOKEN);

// Text Generation
const result = await hf.textGeneration({
    model: 'mistralai/Mistral-7B-Instruct-v0.1',
    inputs: 'Napisz wiersz o AI',
    parameters: {
        max_new_tokens: 250,
        temperature: 0.7
    }
});

// Text-to-Image
const image = await hf.textToImage({
    model: 'stabilityai/stable-diffusion-2-1',
    inputs: 'A beautiful sunset',
    parameters: {
        negative_prompt: 'blurry',
        num_inference_steps: 25
    }
});

// Blob z obrazem
const blob = await image.blob();

// Translation
const translation = await hf.translation({
    model: 'Helsinki-NLP/opus-mt-en-pl',
    inputs: 'Hello, how are you?'
});
```

---

## Stability AI

### 🔑 Setup

**.dev.vars**:
```bash
STABILITY_API_KEY=sk-...
```

### 💰 Pricing

| Plan | Credits | Price |
|------|---------|-------|
| Free | 25 credits | $0 |
| Starter | 3,000 credits/mo | $10 |
| Professional | Unlimited | Custom |

**1 image (512x512) = ~1 credit**

### 📝 Użycie

```typescript
// Text-to-Image
const response = await fetch(
    'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
    {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${env.STABILITY_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text_prompts: [
                {
                    text: "A beautiful landscape",
                    weight: 1
                },
                {
                    text: "blurry, bad quality",
                    weight: -1
                }
            ],
            cfg_scale: 7,
            height: 1024,
            width: 1024,
            steps: 30,
            samples: 1
        })
    }
);

const { artifacts } = await response.json();
const imageBase64 = artifacts[0].base64;
```

---

## Storage Solutions

### Cloudflare R2 (Object Storage)

**Setup** (`wrangler.jsonc`):
```jsonc
{
    "r2_buckets": [
        {
            "binding": "R2_BUCKET",
            "bucket_name": "my-bucket"
        }
    ]
}
```

**Użycie**:
```typescript
// Upload
await env.R2_BUCKET.put('images/photo.jpg', imageBuffer, {
    httpMetadata: {
        contentType: 'image/jpeg'
    },
    customMetadata: {
        uploadedBy: 'user123'
    }
});

// Download
const object = await env.R2_BUCKET.get('images/photo.jpg');
const blob = await object.blob();

// List
const list = await env.R2_BUCKET.list({ prefix: 'images/' });

// Delete
await env.R2_BUCKET.delete('images/photo.jpg');
```

**Pricing**: 10 GB free, $0.015/GB beyond

---

### Cloudflare KV (Key-Value)

**Setup**:
```jsonc
{
    "kv_namespaces": [
        {
            "binding": "KV",
            "id": "YOUR_KV_ID"
        }
    ]
}
```

**Użycie**:
```typescript
// Write
await env.KV.put('user:123', JSON.stringify({ name: 'John' }), {
    expirationTtl: 3600 // 1 hour
});

// Read
const userData = await env.KV.get('user:123', 'json');

// Delete
await env.KV.delete('user:123');

// List keys
const list = await env.KV.list({ prefix: 'user:' });
```

**Pricing**: 100,000 reads/day free

---

### Cloudflare D1 (SQL Database)

**Setup**:
```jsonc
{
    "d1_databases": [
        {
            "binding": "DB",
            "database_name": "my-db",
            "database_id": "YOUR_DB_ID"
        }
    ]
}
```

**Użycie**:
```typescript
// Query
const results = await env.DB.prepare(
    'SELECT * FROM users WHERE age > ?'
).bind(18).all();

// Insert
await env.DB.prepare(
    'INSERT INTO users (name, age) VALUES (?, ?)'
).bind('John', 25).run();

// Transaction
await env.DB.batch([
    env.DB.prepare('INSERT INTO ...').bind(...),
    env.DB.prepare('UPDATE ...').bind(...)
]);
```

**Pricing**: 100,000 rows free

---

## 🎯 Podsumowanie Kosztów (Free Tier)

| Serwis | Free Tier | Wystarczy na |
|--------|-----------|--------------|
| **OpenAI** | $5 credit (new users) | ~50 requests GPT-4 |
| **Gemini** | 15 RPM | ~21,600 req/day |
| **Cloudflare AI** | 10,000 neurons/day | ~300 images/day |
| **ElevenLabs** | 10,000 chars/mo | ~20 min audio |
| **Cloudflare R2** | 10 GB | ~10,000 images |
| **Cloudflare KV** | 100,000 reads/day | Wystarczające |

**Rekomendacja dla eksperymentów**:
- Start z **Cloudflare AI** (największy free tier)
- Dodaj **Gemini** dla text generation
- **R2 + KV** dla storage (za darmo)
- **ElevenLabs free** dla TTS testów

---

**Status**: Kompletny przewodnik integracji  
**Ostatnia aktualizacja**: 1 listopada 2025
