# Obecny Stan Systemu - MyBonzo AI Blog

**Data**: 7 stycznia 2026  
**Wersja Astro**: 5.15.1  
**Framework**: Astro SSG/SSR z Static Output  
**Hosting**: Cloudflare Pages  
**Status**: ✅ Produkcja działająca na https://www.mybonzoaiblog.com

---

## 📋 Spis Treści

1. [Stack Technologiczny](#stack-technologiczny)
2. [Architektura Systemu](#architektura-systemu)
3. [Struktura Projektu](#struktura-projektu)
4. [Konfiguracja Cloudflare](#konfiguracja-cloudflare)
5. [System Routingu](#system-routingu)
6. [Content Management](#content-management)
7. [API Endpoints](#api-endpoints)
8. [System Kontroli Funkcji](#system-kontroli-funkcji)
9. [Styling i Design](#styling-i-design)
10. [Deployment](#deployment)

---

## Stack Technologiczny

### Core Framework
```json
{
  "astro": "^5.15.1",
  "output": "static",
  "adapter": "@astrojs/cloudflare@12.6.10"
}
```

### Integracje i Pluginy
| Nazwa | Wersja | Cel |
|-------|--------|-----|
| **@astrojs/mdx** | 4.3.8 | Wsparcie dla MDX (Markdown + JSX) |
| **@astrojs/tailwind** | 6.0.2 | Tailwind CSS integration |
| **@astrojs/sitemap** | 3.6.0 | Automatyczne generowanie sitemap |
| **@astrojs/rss** | 4.0.13 | RSS feed |
| **astro-icon** | 1.1.5 | System ikon (Iconify) |
| **astro-robots-txt** | 1.0.0 | Generowanie robots.txt |
| **tailwindcss** | 3.4.18 | Utility-first CSS framework |

### DevDependencies
```json
{
  "@tailwindcss/typography": "0.5.16",  // Styling dla prose content
  "wrangler": "4.45.0",                 // Cloudflare CLI
  "miniflare": "3.20250718.2",          // Local Cloudflare Workers dev
  "prettier": "3.6.2",                  // Code formatting
  "@iconify-json/ri": "1.2.5"           // Remix Icon pack
}
```

---

## Architektura Systemu

### Diagram Architektury

```
┌─────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE PAGES                          │
│                 (www.mybonzoaiblog.com)                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  ASTRO 5.15.1 (SSG)                          │
│  Output: Static HTML/CSS/JS                                  │
│  Adapter: @astrojs/cloudflare                                │
│  Transitions: ClientRouter (View Transitions API)            │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│  Static Pages    │    │  API Routes      │
│  (.astro files)  │    │  (Edge Functions)│
└──────────────────┘    └──────────────────┘
         │                       │
         ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│  Content         │    │  Cloudflare      │
│  Collections     │    │  Bindings        │
│  (MDX)           │    │  - AI            │
│                  │    │  - KV (SESSION)  │
│                  │    │  - KV (CACHE)    │
│                  │    │  - R2 (MEDIA)    │
│                  │    │  - Queues        │
│                  │    │  - Vectorize     │
└──────────────────┘    └──────────────────┘
```

### Tryb Renderowania

**Static Site Generation (SSG)**
- `output: "static"` w astro.config.mjs
- Wszystkie strony pre-renderowane podczas build
- Szybkie ładowanie, optymalne dla SEO
- Hosting na Cloudflare Pages CDN

**Edge Functions (API Routes)**
- Dynamiczne endpointy w `/src/pages/api/`
- Wykonywane na Cloudflare Workers
- Dostęp do AI, KV, R2, Queues

---

## Struktura Projektu

```
mybonzoAIblog/
├── src/
│   ├── alkaline.config.ts          # Główna konfiguracja (SITE, NAVIGATION, AUTHORS)
│   │
│   ├── pages/                      # Routing pages
│   │   ├── index.astro             # Homepage
│   │   ├── blog/                   # Blog posts
│   │   ├── r2-blog/                # Blog z R2 storage
│   │   ├── ai-tools/               # AI Tools showcase
│   │   ├── eksperymenty/           # Experimental projects
│   │   └── api/                    # API endpoints (Edge Functions)
│   │       ├── ai/                 # AI endpoints (chat, image gen)
│   │       ├── blog/               # Blog CRUD API
│   │       ├── features/           # Feature control endpoints
│   │       ├── media/              # Media upload/management
│   │       └── health.ts           # Health check
│   │
│   ├── layouts/                    # Page layouts
│   │   ├── Layout.astro            # Base layout (wszystkie strony)
│   │   ├── Post.astro              # Single blog post layout
│   │   └── Posts.astro             # Blog list layout
│   │
│   ├── components/                 # UI Components
│   │   ├── Astro/                  # Native Astro components
│   │   │   ├── Nav.astro           # Navigation bar
│   │   │   ├── Footer.astro        # Footer
│   │   │   ├── Card.astro          # Reusable card component
│   │   │   └── head/               # <head> meta tags
│   │   └── React/                  # React components (jeśli dodane)
│   │
│   ├── content/                    # Content Collections
│   │   └── blog/                   # Blog posts (MDX files)
│   │       ├── *.mdx               # Individual posts
│   │       └── _schemas.ts         # Content validation schema
│   │
│   ├── config/                     # Configuration files
│   │   └── features.ts             # Feature flags & permissions
│   │
│   ├── middleware/                 # Middleware layer
│   │   └── api-middleware.ts       # Feature control, rate limiting
│   │
│   ├── lib/                        # Core libraries
│   │   ├── features/               # Feature flags manager
│   │   ├── registry/               # Function registry
│   │   └── plugins/                # Plugin system
│   │
│   ├── styles/                     # Global styles
│   │   ├── global.css              # Main CSS file
│   │   ├── themes.css              # Color themes (dark/light)
│   │   └── animations.css          # Keyframe animations
│   │
│   ├── types/                      # TypeScript types
│   │   ├── types.ts                # Global types
│   │   └── features.ts             # Feature system types
│   │
│   ├── utils/                      # Utility functions
│   │   └── robots-txt.config.ts    # Robots.txt configuration
│   │
│   └── assets/                     # Static assets
│       ├── logo.png                # Site logo
│       └── images/                 # Image assets
│
├── public/                         # Public static files
│   ├── fonts/                      # Custom fonts (ThrolaconTrial)
│   ├── og-image.webp               # Open Graph image
│   ├── apple-touch-icon.png        # iOS icon
│   └── _headers                    # Cloudflare headers config
│
├── workers/                        # Cloudflare Workers
│   └── queue-consumer.js           # Image queue processor
│
├── astro.config.mjs                # Astro configuration
├── tailwind.config.mjs             # Tailwind configuration
├── wrangler.toml                   # Cloudflare bindings config
├── package.json                    # Dependencies
└── tsconfig.json                   # TypeScript config
```

---

## Konfiguracja Cloudflare

### wrangler.toml - Bindings

```toml
name = "mybonzoaiblog"
compatibility_date = "2024-10-28"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = "dist"
```

#### 1. KV Namespaces (Key-Value Storage)

**SESSION** - Sesje użytkowników
```toml
[[kv_namespaces]]
binding = "SESSION"
id = "77d84c01758a4064be011acc35b2c344"
preview_id = "183215eb52fa4ef8a7fc312a76e6b688"
```

**CACHE** - Cache dla API responses
```toml
[[kv_namespaces]]
binding = "CACHE"
id = "cce469bb54d142ebbbce4287e450daec"
preview_id = "139be3a08d7940eea1de297b0ac22e59"
```

**Użycie w kodzie:**
```typescript
// Zapisywanie do cache
await env.CACHE.put('key', value, { expirationTtl: 3600 });

// Odczyt z cache
const cached = await env.CACHE.get('key');
```

#### 2. Workers AI

```toml
[ai]
binding = "AI"
```

**Dostępne modele:**
- `@cf/meta/llama-3.3-70b-instruct-fp8-fast` - Chat
- `@cf/stabilityai/stable-diffusion-xl-base-1.0` - Image generation
- `gemma-3-12b-it`, `qwq-32b`, `phi-2`, `openchat-3.5` - Różne chat modele

**Użycie:**
```typescript
const response = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
  messages: [{ role: 'user', content: prompt }]
});
```

#### 3. Vectorize (Vector Database)

```toml
[[vectorize]]
binding = "VECTORIZE_INDEX"
index_name = "mybonzo-index"
```

**Użycie dla RAG:**
```typescript
// Wyszukiwanie podobnych dokumentów
const results = await env.VECTORIZE_INDEX.query(embedding, {
  topK: 5,
  returnMetadata: true
});
```

#### 4. R2 Storage (Object Storage)

```toml
[[r2_buckets]]
binding = "MEDIA_BUCKET"
bucket_name = "mybonzo-media"
preview_bucket_name = "mybonzo-media-preview"
```

**Użycie:**
```typescript
// Upload pliku
await env.MEDIA_BUCKET.put(fileName, file, {
  httpMetadata: { contentType: 'image/png' }
});

// Pobieranie pliku
const object = await env.MEDIA_BUCKET.get(fileName);
```

#### 5. Queues (Background Jobs)

```toml
[[queues.producers]]
binding = "IMAGE_QUEUE"
queue = "image-generation-queue"
```

**Użycie:**
```typescript
// Dodaj job do kolejki
await env.IMAGE_QUEUE.send({
  prompt: "A beautiful landscape",
  userId: "user123"
});
```

### Environment Variables

**Ustawiane przez CI/CD (GitHub Secrets):**
- `CLOUDFLARE_ACCOUNT_ID` - ID konta Cloudflare
- `CLOUDFLARE_API_TOKEN` - API token dla deployment
- `OPENAI_API_KEY` - OpenAI API key (opcjonalne)
- `DEEPSEEK_API_KEY` - DeepSeek API key (opcjonalne)

**Lokalne (.dev.vars - NIE w repo!):**
```
CF_ACCOUNT_ID=your-account-id
OPENAI_API_KEY=sk-...
DEEPSEEK_API_KEY=sk-...
```

---

## System Routingu

### Routing File-Based (Astro)

```
src/pages/
│
├── index.astro                → /
├── o-nas.astro                → /o-nas
├── faq.astro                  → /faq
│
├── blog/
│   ├── index.astro            → /blog
│   ├── [slug].astro           → /blog/post-slug (dynamic)
│   └── tags/
│       └── [tag].astro        → /blog/tags/ai (dynamic)
│
├── api/
│   ├── health.ts              → /api/health (GET)
│   ├── ai/
│   │   ├── chat.ts            → /api/ai/chat (POST)
│   │   └── image.ts           → /api/ai/image (POST)
│   └── blog/
│       ├── posts.ts           → /api/blog/posts (GET/POST)
│       └── [id].ts            → /api/blog/123 (GET/PUT/DELETE)
│
└── eksperymenty/
    └── projekt-1/
        └── index.astro        → /eksperymenty/projekt-1
```

### Navigation (alkaline.config.ts)

```typescript
export const NAVIGATION: NavEntry[] = [
  { href: "/", text: "Strona główna" },
  { href: "/blog", text: "Blog" },
  { href: "/r2-blog", text: "Artykuły" },
  { href: "/ai-tools", text: "AI Tools" },
  { href: "/eksperymenty", text: "Eksperymenty" }
];
```

---

## Content Management

### Content Collections (MDX)

**Lokalizacja:** `src/content/blog/*.mdx`

**Przykładowy post:**
```mdx
---
title: "Jak używać AI w 2026"
author: "Redakcja MyBonzo"
publishedAt: 2026-01-07
description: "Przewodnik po narzędziach AI"
tags: ["ai", "tutorial", "2026"]
image: "/images/ai-guide.webp"
---

# Treść posta

Paragraph z **boldem** i *kursywą*.

## Podtytuł

Lista:
- Punkt 1
- Punkt 2

```typescript
// Code block
const hello = "world";
```
```

**Schema Validation:** `src/content.config.ts`
```typescript
import { z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    author: z.string(),
    publishedAt: z.date(),
    description: z.string(),
    tags: z.array(z.string()),
    image: z.string().optional()
  })
});
```

### Pobieranie Content

```typescript
import { getCollection, getEntry } from 'astro:content';

// Wszystkie posty
const allPosts = await getCollection('blog');

// Jeden post
const post = await getEntry('blog', 'slug');
```

---

## API Endpoints

### System Feature Control

**Każdy endpoint używa middleware:**
```typescript
import { withFeatureMiddleware } from '@/middleware/api-middleware';

export const POST: APIRoute = async (context) => {
  return withFeatureMiddleware(
    'feature-id',      // ID z features.ts
    context,
    'public',          // Permission: public | user | admin | system
    async (ctx, requestContext) => {
      // Business logic
      return new Response(JSON.stringify({ success: true }));
    }
  );
};
```

### Dostępne Endpointy

#### 1. Health Check
**GET** `/api/health`
```typescript
// Public - bez autoryzacji
// Zwraca status systemu
{
  "status": "ok",
  "timestamp": 1704623400000,
  "version": "1.0.0"
}
```

#### 2. AI Chat
**POST** `/api/ai/chat`
```typescript
// Public - rate limit: 10 req/min
// Body:
{
  "model": "gemma-3-12b-it",
  "messages": [
    { "role": "user", "content": "Hello!" }
  ]
}
// Response:
{
  "response": "Hi! How can I help?",
  "model": "gemma-3-12b-it"
}
```

#### 3. Image Generation
**POST** `/api/ai/image`
```typescript
// User permission - rate limit: 5 req/5min
// Body:
{
  "prompt": "A beautiful landscape",
  "model": "stable-diffusion-xl"
}
// Response:
{
  "url": "https://mybonzo-media.r2.dev/image-123.png",
  "id": "img-123"
}
```

#### 4. RAG Chat
**POST** `/api/rag-chat`
```typescript
// Public - rate limit: 10 req/min
// Uses Vectorize for knowledge base
// Body:
{
  "query": "What is AI?",
  "context": "technology"
}
```

#### 5. Media Upload
**POST** `/api/media/upload`
```typescript
// User permission - rate limit: 20 req/min
// FormData with file
// Max size: 10MB
// Allowed types: image/jpeg, image/png, image/webp, image/gif
```

#### 6. Blog Posts API
**GET** `/api/blog/posts`
```typescript
// Public - pagination support
// Query params: ?page=1&limit=10&tag=ai
```

---

## System Kontroli Funkcji

### Feature Flags (features.ts)

**Struktura Feature:**
```typescript
{
  id: 'ai-chat',
  name: 'AI Chat',
  description: 'AI-powered chat functionality',
  status: 'enabled',              // enabled | disabled | beta | deprecated
  permissions: ['public', 'user', 'admin'],
  rateLimit: {
    requests: 10,
    window: 60000,                // 1 minute
    identifier: 'ip'              // ip | user | api-key
  },
  environments: ['development', 'staging', 'production'],
  dependencies: [],               // Inne feature IDs
  metadata: {
    category: 'ai',
    models: ['gemma-3-12b-it'],
    mcpEnabled: true
  }
}
```

### Kategorie Funkcji

**AI Features:**
- `ai-chat` - Chat z AI modelami
- `ai-image-generation` - Generowanie obrazów
- `ai-chat-openai` - OpenAI gateway
- `ai-gemini-chat` - Google Gemini
- `ai-rag-chat` - RAG z Vectorize
- `ai-bonzo-avatar` - Avatar generation (beta)
- `ai-bonzo-voice` - TTS (beta)

**Media Features:**
- `media-upload` - Upload do R2
- `media-list` - Lista plików
- `media-delete` - Usuwanie (admin only)
- `image-gallery` - Galeria obrazów

**Blog Features:**
- `blog-api` - CRUD dla postów

**System Features:**
- `health-check` - Status monitoring
- `api-gateway` - Unified gateway

### Permission Levels

```typescript
type Permission = 'public' | 'user' | 'admin' | 'system';
```

- **public** - Dostępne dla wszystkich
- **user** - Wymaga uwierzytelnienia
- **admin** - Tylko administratorzy
- **system** - Tylko internal calls

### Rate Limiting

**Automatyczne przez middleware:**
- `checkRateLimit(identifier, config)`
- Storage: In-memory Map (per Worker instance)
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

**Przykład:**
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1704623460000
```

---

## Styling i Design

### Tailwind CSS Configuration

**tailwind.config.mjs:**
```javascript
theme: {
  extend: {
    colors: {
      theme: {
        primary: 'var(--theme-primary)',
        secondary: 'var(--theme-secondary)',
        accent: 'var(--theme-accent)'
      }
    },
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
      serif: ['SUSE', 'serif'],
      mono: ['Fira Code', 'monospace'],
      graffiti: ['ThrolaconTrial', 'Impact', 'sans-serif']
    }
  }
}
```

### CSS Custom Properties (themes.css)

**Dark Theme (domyślny):**
```css
:root {
  --theme-primary: #1a1a1a;      /* Tło */
  --theme-secondary: #2a2a2a;    /* Secondary bg */
  --theme-accent: #00f0ff;       /* Akcent (cyjan) */
  --theme-text: #ffffff;         /* Tekst */
}
```

**Light Theme:**
```css
.light-mode {
  --theme-primary: #ffffff;
  --theme-secondary: #f5f5f5;
  --theme-accent: #0066ff;
  --theme-text: #1a1a1a;
}
```

### Typography

**Custom Font: ThrolaconTrial (Graffiti)**
```css
@font-face {
  font-family: 'ThrolaconTrial';
  src: url('/fonts/Throlacon Trial.ttf') format('truetype');
}

h1, h2, h3, h4, h5 {
  font-family: 'ThrolaconTrial', Impact, 'Arial Black', sans-serif !important;
  text-transform: uppercase;
  letter-spacing: 0.01em;
  text-shadow: 0 1px 6px #12121232, 2px 2px 0 #3331;
}
```

**Google Fonts (alkaline.config.ts):**
- **Sans**: Roboto (100-900, italic)
- **Serif**: SUSE (100-800)
- **Mono**: Fira Code (400, 500, 700)

### Animacje (animations.css)

**Fade In:**
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}
```

**Sweep (dla kart):**
```css
@keyframes sweep {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.card::before {
  animation: sweep 2s infinite;
}
```

### View Transitions (ClientRouter)

**Layout.astro:**
```astro
---
import { ClientRouter } from "astro:transitions";
---
<html>
  <head>
    <ClientRouter />
  </head>
  <!-- Smooth page transitions -->
</html>
```

**Kontrola transitions:**
```css
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.3s;
}
```

---

## Deployment

### GitHub Actions Workflow

**Lokalizacja:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - run: npm install
      
      - run: npm run build
      
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist --project-name=mybonzoaiblog
```

### Keep-Alive System

**3 workflow-y:**

1. **keep-alive.yml** (główny)
   - Co 10 minut (6:00-22:00 UTC)
   - Co 30 minut (22:00-6:00 UTC)
   - Ping głównych URL-i

2. **advanced-monitoring.yml**
   - Co godzinę w dzień
   - Health checks z retry logic
   - Cache warming

3. **emergency-keep-alive.yml** (awaryjny)
   - Co 5 minut 24/7
   - Używać tylko w kryzysie!

### Deployment Commands

**Lokalny build:**
```bash
npm run build
```

**Preview lokalnie:**
```bash
npm run preview
```

**Deploy manualnie:**
```bash
npx wrangler pages deploy ./dist --project-name=mybonzoaiblog
```

**Deploy Worker (queue consumer):**
```bash
cd workers
npx wrangler deploy
```

---

## Optymalizacje

### Build Optimizations (astro.config.mjs)

```javascript
build: {
  inlineStylesheets: "auto",     // Inline CSS <4kb
  assets: "_assets",             // Custom assets folder
},
compressHTML: true,              // HTML minification
```

### Image Optimization

```javascript
image: {
  service: { 
    entrypoint: "astro/assets/services/sharp",
    config: {
      limitInputPixels: false    // Allow larger images
    }
  },
  domains: ["images.unsplash.com"],
  remotePatterns: [
    {
      protocol: "https",
      hostname: "**.cdnjs.cloudflare.com"
    }
  ]
}
```

### Vite Optimizations

```javascript
vite: {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['astro/client'],
          'components': ['@components/Astro/Card.astro']
        }
      }
    },
    assetsInlineLimit: 8192      // 8kb inline limit
  }
}
```

### MDX Optimization

```javascript
mdx({
  optimize: true,                // Fast MDX rendering
  ignoreElementNames: ['custom-component']
})
```

---

## Bezpieczeństwo

### Secrets Management

**❌ NIGDY w repo:**
- API keys
- Account IDs
- Tokens

**✅ Gdzie przechowywać:**
- **GitHub Secrets** - dla CI/CD
- **Cloudflare Env Vars** - dla production
- **.dev.vars** (local, gitignored) - dla development

**Ustawianie secrets:**
```bash
# Cloudflare
npx wrangler secret put OPENAI_API_KEY

# GitHub
Settings → Secrets → Actions → New repository secret
```

### Headers Security (public/_headers)

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### Rate Limiting

**Automatyczne przez middleware:**
- IP-based tracking
- Per-endpoint limits
- Headers z pozostałymi requestami

---

## SEO i Metadata

### Site Config (alkaline.config.ts)

```typescript
export const SITE: Site = {
  title: "MyBonzo AI Blog",
  url: "https://www.mybonzoaiblog.com",
  ogImage: "/og-image.webp",
  author: "Redakcja MyBonzo",
  description: "Blog o sztucznej inteligencji...",
  keywords: ["AI", "sztuczna inteligencja", "blog"],
  locale: "pl_PL",
  postsPerPage: 5
};
```

### Meta Tags (Layout.astro)

```astro
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="generator" content="Astro" />
<meta name="robots" content="index, follow" />
<meta name="geo.region" content="PL" />
<meta name="geo.position" content="52.237049;21.017532" />
```

### Sitemap & RSS

- **Sitemap**: Auto-generowany przez `@astrojs/sitemap`
- **RSS**: `/rss.xml` z `@astrojs/rss`
- **Robots.txt**: Dynamicznie generowany przez `astro-robots-txt`

---

## Monitoring

### Health Check Endpoint

**GET** `/api/health`
```json
{
  "status": "ok",
  "timestamp": 1704623400000,
  "version": "1.0.0",
  "environment": "production"
}
```

### GitHub Actions Monitoring

**Tabs w GitHub:**
- **Actions** - Historia deploymentów
- **Environment** - Production status
- **Deployments** - Live URL i preview URLs

### Cloudflare Analytics

**Dashboard → Pages → mybonzoaiblog:**
- Requests per minute
- Bandwidth usage
- Error rates
- Geographic distribution

---

## Środowiska

### Development (localhost)

```bash
npm run dev
# http://localhost:4321
```

**Bindings przez Miniflare:**
- KV, AI, R2, Queues - symulowane lokalnie
- `.dev.vars` dla secrets

### Production (Cloudflare Pages)

**URL-e:**
- **Primary**: https://www.mybonzoaiblog.com
- **Alt**: https://mybonzoaiblog.com
- **Pages**: https://mybonzoaiblog.pages.dev

**Deploy:**
- Auto: Push do `main` → GitHub Actions → Cloudflare
- Manual: `npx wrangler pages deploy dist`

---

## Znane Ograniczenia

1. **Content Collections** - Tylko `src/content/blog/`, brak innych kolekcji
2. **UI Framework** - Brak Vue/React/Svelte (pure Astro components)
3. **Database** - Brak SQL/NoSQL, używamy KV i R2
4. **Authentication** - Brak systemu logowania (tylko API keys)
5. **Search** - Brak full-text search (do dodania Algolia/Pagefind)

---

## Kolejne Kroki (Potencjalne Ulepszenia)

### 1. **Modernizacja Wizualna** (w toku)
- [ ] Dodanie Vue.js dla interaktywnych komponentów
- [ ] Sci-Fi/AI theme z neonowymi kolorami
- [ ] Glassmorphism effects
- [ ] Particle background (Three.js/Particles.js)

### 2. **Funkcjonalność**
- [ ] Full-text search (Pagefind)
- [ ] Newsletter subscription
- [ ] Comments system (Giscus/Utterances)
- [ ] User authentication

### 3. **Performance**
- [ ] Image optimization pipeline
- [ ] Service Worker dla offline support
- [ ] Progressive Web App (PWA)

### 4. **Content**
- [ ] Multiple content collections (guides, tutorials)
- [ ] Multi-language support (i18n)
- [ ] Author profiles system

---

## Podsumowanie

### ✅ Strengths

- **Astro 5.15.1** - Najnowsza wersja, szybkie buildy
- **Static Output** - SEO-friendly, CDN-cached
- **Cloudflare Integration** - AI, KV, R2, Queues dostępne
- **Feature Control System** - Modularny, extensible
- **Tailwind CSS** - Utility-first styling
- **MDX Support** - Rich content capabilities
- **GitHub Actions** - Automated deployment
- **Keep-Alive System** - Prevents sleeping

### ⚠️ Areas for Improvement

- Brak UI framework (Vue/React) dla interaktywności
- Design może być bardziej nowoczesny (obecnie klasyczny blog)
- Brak search functionality
- Brak authentication system
- Limited content collections (tylko blog)

### 🎯 Priorytet

**MODERNIZACJA WIZUALNA** zgodnie z:
- `PLAN_MODERNIZACJI_WIZUALNEJ.md` (AI/Sci-Fi theme)
- `PROPOZYCJA/propozycja.md` (Ultra-computer dark theme)
- Incremental approach z git checkpoints

---

**Data utworzenia**: 7 stycznia 2026  
**Autor**: MyBonzo Development Team  
**Status**: ✅ Aktualny stan systemu  
**Następny krok**: Wybór design approach (A/B/C) i Faza 1 implementacji
