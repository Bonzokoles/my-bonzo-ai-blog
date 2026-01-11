# RAG Deployment Guide dla mybonzoaiblog.com

> **⚠️ STATUS**: Dokument planistyczny z 2026-01-05  
> **📍 LOKALIZACJA**: `docs/planning/` (przeniesiony z `public/`)  
> **🔄 AKTUALIZACJA**: Zaktualizowany pod obecną architekturę (Astro 5 + Cloudflare)  
> **🛡️ BEZPIECZEŃSTWO**: Poprawione błędy składniowe i secrets management

---

## Architektura RAG zintegrowana z mybonzoAIblog

**Cel**: Dodać RAG chatbot jako eksperyment w istniejącej aplikacji  
**Zgodność**: Feature Control System + ZLOTE_ZASADY_ROZWOJU  
**Czas**: ~2h (integracja z istniejącym projektem)

---

## PHASE 1: Vectorize Index Setup (10 min)

### 1.1 Cloudflare Dashboard → AI → Vectorize

```bash
# Dashboard steps:
1. AI → Vectorize → "Create index"
2. Name: blog-rag-index
3. Dimensions: 1536
4. Metric: cosine
5. Create → Skopiuj INDEX_ID
```

### 1.2 Aktualizuj wrangler.toml

**Lokalizacja**: `q:\mybonzo\mybonzoAIblog\wrangler.toml`

```toml
# Dodaj do istniejącego wrangler.toml
[[vectorize]]
binding = "VECTOR_INDEX"
index_name = "blog-rag-index"
```

**Nie commituj!** Index ID jest automatycznie powiązany przez binding.

---

## PHASE 2: Feature Flag dla RAG (5 min)

### 2.1 Dodaj do src/config/features.ts

```typescript
// src/config/features.ts
{
  id: 'ai-rag-chat',
  name: 'AI RAG Chat',
  description: 'RAG-powered chatbot with blog context',
  status: 'beta',  // Start jako beta
  permissions: ['public', 'user', 'admin'],
  rateLimit: {
    requests: 10,
    window: 60000, // 1 minute
    identifier: 'ip'
  },
  environments: ['development', 'staging', 'production'],
  dependencies: ['ai-chat'],  // Wymaga podstawowego AI chat
  metadata: {
    category: 'ai',
    experimental: true,
    vectorStore: 'cloudflare-vectorize'
  }
}
```

---

## PHASE 3: API Endpoint z Middleware (20 min)

### 3.1 Utwórz src/pages/api/ai/rag-chat.ts

**⚠️ POPRAWIONA WERSJA** (bez błędów składniowych):

```typescript
import type { APIRoute } from 'astro';
import { withFeatureMiddleware } from '@/middleware/api-middleware';

export const POST: APIRoute = async (context) => {
  return withFeatureMiddleware(
    'ai-rag-chat',
    context,
    'public',
    async (ctx, requestContext) => {
      const runtime = (ctx.locals as any)?.runtime;
      const env = runtime?.env;

      if (!env?.AI || !env?.VECTOR_INDEX) {
        return new Response(
          JSON.stringify({ error: 'RAG services not configured' }),
          { status: 503 }
        );
      }

      const { question } = await ctx.request.json();

      try {
        // 1. Embed query (Cloudflare Workers AI)
        const embedding = await env.AI.run('@cf/baai/bge-small-en-v1.5', {
          text: [question]
        });

        // POPRAWIONE: [0] zamiast [^0]
        const queryVector = embedding.data[0];

        // 2. Vectorize search
        const matches = await env.VECTOR_INDEX.query(queryVector, {
          topK: 5,
          returnMetadata: true
        });

        // 3. Przygotuj kontekst
        const context = matches.matches
          .map(m => m.metadata?.content || '')
          .join('\n\n')
          .slice(0, 4000); // Limit tokeny

        // 4. AI response (Workers AI - Gemma)
        const aiResponse = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
          messages: [
            {
              role: 'system',
              content: 'Jesteś AI ekspertem MyBonzo Blog. Odpowiadaj po polsku na podstawie kontekstu z bloga.'
            },
            {
              role: 'user',
              content: `Pytanie: ${question}\n\nKontekst z bloga:\n${context}`
            }
          ],
          temperature: 0.2
        });

        // POPRAWIONE: .response zamiast .choices[0]
        const answer = aiResponse.response;

        return new Response(
          JSON.stringify({
            success: true,
            answer,
            sources: matches.matches.map((m, i) => ({
              title: m.metadata?.title || `Źródło ${i + 1}`,
              url: m.metadata?.url || 'https://www.mybonzoaiblog.com',
              score: m.score
            }))
          }),
          {
            headers: {
              'Content-Type': 'application/json',
              'X-RAG-Sources': matches.matches.length.toString()
            }
          }
        );

      } catch (error) {
        console.error('[RAG Error]:', error);
        return new Response(
          JSON.stringify({ 
            error: 'RAG query failed',
            details: error instanceof Error ? error.message : 'Unknown error'
          }),
          { status: 500 }
        );
      }
    }
  );
};

// CORS support
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};
```

---

## PHASE 4: Frontend UI (30 min)

### 4.1 Utwórz src/pages/eksperymenty/rag-chat/index.astro

```astro
---
import Layout from '@layouts/Layout.astro';

const title = 'RAG Chat - MyBonzo AI Blog';
const description = 'Pytaj AI o treści z bloga - RAG-powered chatbot';
---

<Layout title={title} description={description}>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <header class="mb-12 text-center">
      <h1 class="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        🤖 RAG Chatbot
      </h1>
      <p class="text-xl text-gray-400">Pytaj o treści z MyBonzo AI Blog</p>
      <div class="mt-4 inline-block px-4 py-2 bg-yellow-900/30 border border-yellow-600 rounded-lg">
        <span class="text-yellow-400">⚡ Status: BETA</span>
      </div>
    </header>

    <main>
      <!-- Chat Interface -->
      <div id="chat-container" class="space-y-4 mb-8 min-h-[400px]">
        <!-- Messages będą tutaj dynamicznie dodawane -->
      </div>

      <!-- Input Form -->
      <form id="chat-form" class="flex gap-4">
        <input 
          type="text"
          id="question"
          placeholder="Np. Jak AI SEO pomoże w pozycjonowaniu?"
          class="flex-1 p-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
          required
        />
        <button 
          type="submit"
          class="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50"
          id="submit-btn"
        >
          Pytaj
        </button>
      </form>

      <!-- Sources -->
      <div id="sources-container" class="mt-8 hidden">
        <details class="bg-gray-900/30 p-6 rounded-xl border border-gray-700">
          <summary class="text-xl font-bold cursor-pointer">📚 Źródła z bloga</summary>
          <div id="sources-list" class="mt-4 space-y-2"></div>
        </details>
      </div>
    </main>
  </div>

  <script>
    const form = document.getElementById('chat-form') as HTMLFormElement;
    const input = document.getElementById('question') as HTMLInputElement;
    const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
    const chatContainer = document.getElementById('chat-container') as HTMLDivElement;
    const sourcesContainer = document.getElementById('sources-container') as HTMLDivElement;
    const sourcesList = document.getElementById('sources-list') as HTMLDivElement;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const question = input.value.trim();
      if (!question) return;

      // Add user message
      addMessage(question, 'user');
      input.value = '';
      submitBtn.disabled = true;

      try {
        const response = await fetch('/api/ai/rag-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question })
        });

        const data = await response.json();

        if (data.success) {
          addMessage(data.answer, 'assistant');
          
          // Show sources
          if (data.sources && data.sources.length > 0) {
            displaySources(data.sources);
          }
        } else {
          addMessage(`❌ Błąd: ${data.error}`, 'error');
        }

      } catch (error) {
        addMessage(`❌ Błąd połączenia: ${error.message}`, 'error');
      } finally {
        submitBtn.disabled = false;
      }
    });

    function addMessage(text: string, type: 'user' | 'assistant' | 'error') {
      const div = document.createElement('div');
      div.className = `p-4 rounded-xl ${
        type === 'user' 
          ? 'bg-purple-900/50 ml-auto max-w-[80%]'
          : type === 'error'
          ? 'bg-red-900/50'
          : 'bg-gray-900/50 mr-auto max-w-[80%]'
      }`;
      
      const label = document.createElement('div');
      label.className = 'text-sm font-bold mb-2 opacity-75';
      label.textContent = type === 'user' ? '👤 Ty' : type === 'error' ? '⚠️ Błąd' : '🤖 AI';
      
      const content = document.createElement('div');
      content.className = 'prose prose-invert max-w-none';
      content.textContent = text;
      
      div.appendChild(label);
      div.appendChild(content);
      chatContainer.appendChild(div);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function displaySources(sources: any[]) {
      sourcesContainer.classList.remove('hidden');
      sourcesList.innerHTML = sources.map((source, i) => `
        <div class="flex gap-4 p-3 bg-gray-800 rounded-lg">
          <div class="text-sm opacity-75">${source.score.toFixed(3)}</div>
          <a href="${source.url}" class="font-semibold hover:text-blue-400 transition">
            ${source.title}
          </a>
        </div>
      `).join('');
    }
  </script>
</Layout>
```

---

## PHASE 5: Content Indexing Script (30 min)

### 5.1 workers/scripts/index-blog-content.ts

**POPRAWIONA WERSJA** (bez Puppeteer, używa Astro build):

```typescript
// workers/scripts/index-blog-content.ts
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!;
const VECTOR_INDEX_ID = 'blog-rag-index';

interface BlogPost {
  title: string;
  content: string;
  url: string;
  slug: string;
}

async function embedText(text: string): Promise<number[]> {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/baai/bge-small-en-v1.5`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: [text] })
    }
  );

  const data = await response.json();
  return data.result.data[0]; // POPRAWIONE: prawidłowa ścieżka
}

async function indexToVectorize(post: BlogPost) {
  // Embed content
  const embedding = await embedText(post.content.slice(0, 8000));

  // Insert to Vectorize
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/vectorize/indexes/${VECTOR_INDEX_ID}/insert`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        vectors: [
          {
            id: post.slug,
            values: embedding,
            metadata: {
              title: post.title,
              url: post.url,
              content: post.content.slice(0, 500) // Preview
            }
          }
        ]
      })
    }
  );

  const result = await response.json();
  console.log(`✅ Indexed: ${post.title}`);
  return result;
}

async function main() {
  // Read blog posts from src/content/blog
  const blogDir = join(process.cwd(), 'src/content/blog');
  const files = readdirSync(blogDir).filter(f => f.endsWith('.md'));

  console.log(`📚 Found ${files.length} blog posts`);

  for (const file of files) {
    const content = readFileSync(join(blogDir, file), 'utf-8');
    
    // Extract frontmatter (basic parsing)
    const titleMatch = content.match(/title:\s*["'](.+?)["']/);
    const title = titleMatch ? titleMatch[1] : file.replace('.md', '');
    const slug = file.replace('.md', '');

    const post: BlogPost = {
      title,
      slug,
      url: `https://www.mybonzoaiblog.com/blog/${slug}`,
      content: content.replace(/---[\s\S]*?---/, '').trim() // Remove frontmatter
    };

    await indexToVectorize(post);
    
    // Rate limit
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('✅ Indexing complete!');
}

main().catch(console.error);
```

### 5.2 Uruchomienie

```bash
# Z głównego katalogu projektu
cd q:\mybonzo\mybonzoAIblog

# Ustaw env vars (NIGDY nie commituj!)
$env:CLOUDFLARE_ACCOUNT_ID="your-account-id"
$env:CLOUDFLARE_API_TOKEN="your-api-token"

# Uruchom indexowanie
npx tsx workers/scripts/index-blog-content.ts
```

---

## PHASE 6: Deployment (10 min)

### 6.1 Git workflow

```powershell
# Test lokalny
npm run dev

# Test endpoint
curl -X POST http://localhost:4321/api/ai/rag-chat `
  -H "Content-Type: application/json" `
  -d '{\"question\": \"Co to jest AI SEO?\"}'

# Commit (TYLKO kod, bez secrets!)
git add src/pages/api/ai/rag-chat.ts
git add src/pages/eksperymenty/rag-chat/
git add src/config/features.ts
git add wrangler.toml  # Sprawdź że brak secrets!
git commit -m "feat: dodaj RAG chatbot (beta)"

# Push → Cloudflare auto-deploy
git push origin main
```

### 6.2 Secrets w Cloudflare Dashboard

```
Dashboard → Workers & Pages → mybonzoaiblog → Settings → Variables

# Jeśli używasz zewnętrznych API (opcjonalnie):
OPENROUTER_API_KEY=... (encrypted)
```

---

## 🔒 Bezpieczeństwo (KRYTYCZNE!)

### ✅ ZAWSZE:
- Secrets przez `wrangler secret put` lub Dashboard env vars
- NIGDY nie commituj API keys do git
- Używaj Feature Control middleware (rate limiting automatyczny)
- Test lokalny PRZED push do main

### ❌ NIGDY:
- Hardcoded secrets w `wrangler.toml` lub `.ts`
- Publiczne API keys w `public/`
- Commit plików `.env`

---

## 📊 Monitoring

### Cloudflare Dashboard
```
Workers & Pages → mybonzoaiblog → Analytics
- Request count
- Error rate
- P50/P99 latency
```

### Vectorize Stats
```
AI → Vectorize → blog-rag-index → Metrics
- Index size
- Query performance
```

---

## ✅ TODO Checklist

- [ ] Utwórz Vectorize index w Dashboard
- [ ] Dodaj binding do `wrangler.toml`
- [ ] Dodaj feature flag `ai-rag-chat`
- [ ] Utwórz API endpoint `/api/ai/rag-chat.ts`
- [ ] Utwórz UI w `eksperymenty/rag-chat/`
- [ ] Uruchom indexing script (workers/scripts/)
- [ ] Test lokalny: pytanie → odpowiedź + sources
- [ ] Deploy: `git push origin main`
- [ ] Sprawdź live: https://www.mybonzoaiblog.com/eksperymenty/rag-chat

---

## 🚀 Następne kroki

1. **Auto-indexing**: Cron Worker dla nowych postów
2. **Advanced RAG**: Reranking, hybrid search
3. **Analytics**: Track najpopularniejsze pytania
4. **Security**: Pangea AuthN (opcjonalnie)

---

**Dokumentacja powiązana**:
- [ZLOTE_ZASADY_ROZWOJU.md](../ZLOTE_ZASADY_ROZWOJU.md)
- [FEATURE_CONTROL_SYSTEM.md](../features/FEATURE_CONTROL_SYSTEM.md)
- [wrangler.toml](../../wrangler.toml)
- [Cloudflare Vectorize Docs](https://developers.cloudflare.com/vectorize/)
