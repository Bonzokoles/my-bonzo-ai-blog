# CLAUDE.md – My Bonzo AI Blog

## 🎯 Project Overview

**Name:** My Bonzo AI Blog  
**Owner:** JIMBO DevZ Inc. / Bonzokoles  
**Stack:** Astro 5.16.6, TypeScript, Cloudflare Pages  
**Status:** PRODUCTION + ACTIVE DEVELOPMENT  
**URL:** https://mybonzoaiblog.com

---

## 🧠 Context (Agent Must Read First)

### Architecture Principles

- **Static-first** - Astro SSG with Islands architecture
- **AI-accessible** - llms.txt, structured data, dla-agentow pages
- **SEO-optimized** - Semantic HTML, schema.org markup
- **Content-driven** - PUMO Guide (65+ categories, 2847 products)
- **Edge-deployed** - Cloudflare Pages

### Key Constraints

- **Astro 5.16+ only** - Use latest features (view transitions, content collections)
- **NO client-side routing** - Use Astro's file-based routing
- **TypeScript strict mode** - All files must pass type-checking
- **Schema.org required** - Product, Article, Organization markup
- **Cloudflare Pages** - Build via GitHub integration

### Tech Decisions

- **Astro over Next.js** - Better SSG performance, smaller bundles
- **Cloudflare Pages over Vercel** - Edge deployment, R2 integration
- **Content Collections** - Type-safe markdown content
- **View Transitions** - Native Astro API (not React Router)

---

## 📁 Project Structure

```
my-bonzo-ai-blog/
├── .workspace_meta/          # THIS - Project context
├── src/
│   ├── pages/
│   │   ├── pumo-guide/      # PUMO product catalog
│   │   │   ├── dla-agentow.astro  # Week 2 TODO
│   │   │   └── chat.astro         # Week 2 TODO
│   │   └── index.astro
│   ├── components/
│   │   └── PumoChatWidget.astro   # Week 2 TODO
│   ├── content/              # Content collections
│   └── layouts/
├── public/
│   └── llms.txt              # Week 2 TODO - AI index
├── docs/
│   ├── PUMO_GUIDE_UPGRADE_PLAN.md  # Blog upgrade tasks
│   └── planning/
│       └── definition_of_done.html  # Progress tracking
└── astro.config.mjs
```

---

## 🎯 Current Project: PUMO Guide Upgrade (Week 2)

### Status: Week 1 Backend COMPLETE ✅

**Backend:** `JIMBO_devz_inc_HUB/workers/pumo-rag`  
**Deployed:** https://pumo-rag.stolarnia-ams.workers.dev

### Week 2 Tasks (Frontend Integration)

**Day 1-2: llms.txt & dla-agentow**

- [ ] Create `public/llms.txt`
  - List all 65+ PUMO categories
  - Include API endpoint
  - Schema: `Product API: https://pumo-rag.stolarnia-ams.workers.dev/api/search`

- [ ] Create `src/pages/pumo-guide/dla-agentow.astro`
  - Document POST /api/chat endpoint
  - Example queries
  - Response format
  - Rate limits

**Day 3-5: Chat Widget**

- [ ] Create `src/components/PumoChatWidget.astro`

  ```astro
  <script>
    const response = await fetch("https://pumo-rag.stolarnia-ams.workers.dev/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: userMessage })
    });
  </script>
  ```

- [ ] Add to `/pumo-guide/chat` page
- [ ] Styling: Tailwind + neon theme
- [ ] Features:
  - Message history
  - Typing indicator
  - Source citations
  - Copy answer button

---

## 📋 Definition of Done

1. ✅ `npm run build` succeeds (Astro build)
2. ✅ TypeScript passes (`npm run typecheck`)
3. ✅ No console errors in dev (`npm run dev`)
4. ✅ Schema.org markup validated
5. ✅ Updated this CLAUDE.md
6. ✅ Created snapshot in `.workspace_meta/notes/snapshots/`
7. ✅ Deployed to Cloudflare Pages (auto via GitHub push)

---

## 🚨 Agent Red Lines

- ❌ Don't use React Router - use Astro file-based routing
- ❌ Don't add client-side state management (Zustand, Redux) - use Astro islands
- ❌ Don't skip TypeScript types - all components must be typed
- ❌ Don't hardcode API URLs - use import.meta.env
- ❌ Don't forget schema.org markup on product pages
- ❌ Don't use `<a>` without `rel` attribute for external links

---

## 🔧 Development Workflow

### Local Development

```bash
npm run dev          # Start Astro dev server (port 4321)
npm run build        # Build for production
npm run preview      # Preview production build
npm run typecheck    # TypeScript validation
```

### Deployment

1. Commit to `main` branch
2. GitHub Actions triggers
3. Cloudflare Pages builds automatically
4. Deployed to mybonzoaiblog.com

---

## 🔗 API Integration

### PUMO RAG API

**Base URL:** https://pumo-rag.stolarnia-ams.workers.dev

**Endpoints:**

```typescript
// Chat endpoint
POST /api/chat
{
  "query": "Szukam sofy do salonu",
  "context": ["poprzednie", "wiadomości"]  // optional
}

// Search endpoint
POST /api/search
{
  "query": "krzesła biurowe",
  "limit": 10  // optional
}

// Response format
{
  "answer": "string",
  "sources": [
    {
      "id": "string",
      "title": "string",
      "category": "string",
      "price": "string",
      "url": "string",
      "score": number
    }
  ],
  "confidence": number,
  "metadata": {
    "llm": "openrouter" | "workers-ai",
    "processingTime": number
  }
}
```

---

## 🔗 Related Documents

- `.workspace_meta/notes/architecture.md` - Site architecture
- `docs/PUMO_GUIDE_UPGRADE_PLAN.md` - Full upgrade plan
- `docs/planning/definition_of_done.html` - Progress tracker
- Parent workspace: `U:/The_yellow_hub/.workspace_meta/CLAUDE.md`
- Backend spec: `U:/The_yellow_hub/JIMBO_devz_inc_HUB/PUMO_RAG_INTEGRATION_ARCHITECTURE.md`
