# MyBonzo AI Blog - Copilot Instructions

## Architektura projektu

**Stack**: Astro 5.0+ SSR + Cloudflare Pages + Workers  
**Język**: TypeScript (używaj `.astro` dla komponentów, `.ts` dla logiki)  
**Deployment**: Automatyczny przez GitHub Actions → Cloudflare Pages  
**Live URL**: https://www.mybonzoaiblog.com

### Kluczowa zasada rozwoju

🔒 **NIGDY nie edytuj bezpośrednio w `mybonzoAIblog` podczas rozwoju nowych funkcji!**

Nowe funkcje rozwijaj w `src/pages/eksperymenty/` jako izolowane projekty. Główna aplikacja to produkcja i musi działać zawsze. Zobacz [docs/ZLOTE_ZASADY_ROZWOJU.md](../docs/ZLOTE_ZASADY_ROZWOJU.md).

## Struktura katalogów

```
mybonzoAIblog/
├── src/
│   ├── alkaline.config.ts          # Główna konfiguracja (SITE, NAVIGATION, AUTHORS)
│   ├── config/
│   │   └── features.ts             # Feature flags i uprawnienia
│   ├── pages/
│   │   ├── api/                    # API endpoints (używaj APIRoute)
│   │   │   ├── ai/                 # AI funkcje (chat, image gen)
│   │   │   └── features/           # Feature control endpoints
│   │   └── eksperymenty/           # Eksperymentalne projekty (izolacja!)
│   │       ├── _SZABLON/           # Szablon dla nowych projektów
│   │       └── projekt-N/          # Każdy projekt = osobny folder
│   └── middleware/                 # Feature control middleware
├── workers/                        # Cloudflare Workers (cron, queue)
├── wrangler.toml                   # Cloudflare bindings (AI, KV, R2, Queues)
└── docs/                          # Dokumentacja architektury
```

## System kontroli funkcji (Feature Control)

**Zawsze używaj middleware** dla nowych API endpoints:

```typescript
import { withFeatureMiddleware } from '@/middleware/feature-control';

export const POST: APIRoute = async (context) => {
  return withFeatureMiddleware('feature-id', context, 'public',
    async (ctx, requestContext) => {
      // Twoja logika - rate limiting i permissions są automatyczne
    }
  );
};
```

Konfiguracja funkcji: [src/config/features.ts](../src/config/features.ts)  
Status: `enabled`, `beta`, `disabled`  
Permissions: `public`, `user`, `admin`

## Cloudflare bindings (wrangler.toml)

Dostępne w `locals.runtime.env`:
- **AI**: `env.AI` - Workers AI models
- **KV**: `env.SESSION`, `env.CACHE` - Key-Value storage
- **R2**: `env.MEDIA_BUCKET` - Object storage
- **Queues**: `env.IMAGE_QUEUE` - Background jobs

## Workflow developmentu

### Lokalnie
```bash
npm run dev      # localhost:4321 z Wrangler bindings
npm run build    # Test produkcyjnego builda
npm run preview  # Podgląd zbudowanej wersji
```

### Deployment
- **Auto**: Push do `main` → GitHub Actions → Cloudflare Pages
- **Manual**: `npx wrangler pages deploy ./dist --project-name=mybonzoaiblog`

### Dodawanie nowej funkcji eksperymentalnej

1. Kopiuj szablon: `src/pages/eksperymenty/_SZABLON/`
2. Rozwijaj lokalnie w izolacji
3. Test: `npm run dev`
4. Po sukcesie: commit i deploy

Instrukcja: [src/pages/eksperymenty/INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md](../src/pages/eksperymenty/INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md)

## Konwencje kodu

### API Routes
- Zawsze używaj `APIRoute` typu z Astro
- Obsługuj CORS przez `OPTIONS` method gdy potrzeba
- Waliduj input przed przetwarzaniem
- Zwracaj JSON z odpowiednimi statusami HTTP

### Komponenty Astro
- Logikę biznesową w `.ts`, UI w `.astro`
- Props z TypeScript types z `src/types/`
- Używaj Tailwind CSS (konfiguracja: `tailwind.config.mjs`)

### Konfiguracja
- Site metadata: `src/alkaline.config.ts` (title, url, author)
- Feature flags: `src/config/features.ts`
- Cloudflare bindings: `wrangler.toml`

## Bezpieczeństwo

⚠️ **NIGDY** nie commituj secrets do repo!
- API keys → Cloudflare env vars
- Tokens → `wrangler secret put`
- Zobacz: [⚠️_CRITICAL_SECURITY_WARNING.md](../⚠️_CRITICAL_SECURITY_WARNING.md)

## CI/CD

GitHub Actions workflows:
- **deploy.yml**: Auto-deployment na push do `main`
- **keep-alive.yml**: Ping strony co 10 min (zapobiega usypianiu)
- **advanced-monitoring.yml**: Health checks co godzinę

Monitoring: GitHub Actions → tabs "Actions"

## Częste patterns

### Użycie Workers AI
```typescript
const response = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
  messages: [{ role: 'user', content: prompt }]
});
```

### KV Cache
```typescript
const cached = await env.CACHE.get('key');
await env.CACHE.put('key', value, { expirationTtl: 3600 });
```

### R2 Upload
```typescript
await env.MEDIA_BUCKET.put(fileName, file, {
  httpMetadata: { contentType: 'image/png' }
});
```

## Dokumentacja szczegółowa

- [docs/ZLOTE_ZASADY_ROZWOJU.md](../docs/ZLOTE_ZASADY_ROZWOJU.md) - Workflow rozwoju
- [docs/WORKFLOW_ARCHITECTURE/](../docs/WORKFLOW_ARCHITECTURE/) - Architektura systemu
- [FEATURE_CONTROL_SYSTEM.md](../FEATURE_CONTROL_SYSTEM.md) - Feature flags guide
- [.github/workflows/README.md](../.github/workflows/README.md) - CI/CD setup

## Debugowanie

1. Check logs: `npx wrangler tail` (live logs z Cloudflare)
2. Local dev: Używaj `console.log` - wyświetli się w terminalu
3. Errors w produkcji: Cloudflare Dashboard → Pages → Logs
4. Feature issues: Sprawdź status w `src/config/features.ts`

---

**Pytania?** Sprawdź dokumentację w `docs/` lub konfigurację w `src/alkaline.config.ts` i `wrangler.toml`.
