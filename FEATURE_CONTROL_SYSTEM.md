# System Kontroli Funkcji - Feature Control System

## 📋 Spis Treści

1. [Przegląd](#przegląd)
2. [Architektura](#architektura)
3. [Komponenty](#komponenty)
4. [Użycie](#użycie)
5. [Konfiguracja](#konfiguracja)
6. [Przykłady](#przykłady)
7. [API Reference](#api-reference)
8. [Migracja](#migracja)

---

## Przegląd

System Kontroli Funkcji to kompleksowe rozwiązanie do zarządzania funkcjami aplikacji, zapewniające:

- ✅ **Feature Flags** - Centralne włączanie/wyłączanie funkcji
- 🔐 **Kontrola dostępu** - System uprawnień i autoryzacji
- ⚡ **Rate Limiting** - Automatyczne ograniczanie liczby zapytań
- 🔌 **Plugin Architecture** - Modularne dodawanie funkcji
- 📊 **Function Registry** - Centralny rejestr wszystkich funkcji
- 🛡️ **Middleware** - Ujednolicona warstwa przetwarzania requestów

### Zalety nowego systemu

**Przed:**
```typescript
// Każdy endpoint ma własną logikę
export const POST: APIRoute = async ({ request, clientAddress }) => {
  // Manual rate limiting
  if (!checkRateLimit(clientAddress)) {
    return new Response('Too many requests', { status: 429 });
  }

  // Manual feature check
  if (!isFeatureEnabled('ai-chat')) {
    return new Response('Feature disabled', { status: 403 });
  }

  // Business logic
  // ...
}
```

**Po:**
```typescript
// Jeden wrapper - wszystko zautomatyzowane
export const POST: APIRoute = async (context) => {
  return withFeatureMiddleware('ai-chat', context, 'public',
    async (ctx, requestContext) => {
      // Tylko business logic
      // Rate limiting, feature flags, permissions - automatic!
    }
  );
};
```

---

## Architektura

```
┌─────────────────────────────────────────────────────────────┐
│                      API Request                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              API Middleware Layer                            │
│  • Feature Flag Check                                        │
│  • Permission Validation                                     │
│  • Rate Limiting                                             │
│  • Request Context Creation                                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
┌──────────────────┐      ┌──────────────────┐
│ Feature Flags    │      │ Function         │
│ Manager          │      │ Registry         │
│                  │      │                  │
│ • Status Check   │      │ • Endpoint Info  │
│ • Dependencies   │      │ • Metadata       │
│ • Permissions    │      │ • Statistics     │
└──────────────────┘      └──────────────────┘
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
         ┌─────────────────────────┐
         │   Plugin Manager        │
         │  (Optional Extensions)  │
         └─────────────────────────┘
                       │
                       ▼
         ┌─────────────────────────┐
         │   Business Logic        │
         │   Handler               │
         └─────────────────────────┘
```

---

## Komponenty

### 1. Feature Flags System

**Lokalizacja:** `src/lib/features/feature-flags.ts`

Centralne zarządzanie włączaniem/wyłączaniem funkcji.

```typescript
import { getFeatureFlagsManager } from '@/lib/features/feature-flags';

const manager = getFeatureFlagsManager('production');

// Sprawdzenie czy funkcja jest włączona
if (manager.isEnabled('ai-chat', 'public')) {
  // Funkcja dostępna
}

// Włączenie/wyłączenie funkcji
manager.enable('ai-chat');
manager.disable('containers-management');

// Status beta
manager.setBeta('ai-bonzo-avatar');
```

**Funkcje:**
- ✅ Sprawdzanie statusu funkcji
- ✅ Zarządzanie zależnościami między funkcjami
- ✅ Walidacja konfiguracji
- ✅ Export/import konfiguracji
- ✅ Statystyki

### 2. Configuration Management

**Lokalizacja:** `src/config/features.ts`

Centralna konfiguracja wszystkich funkcji aplikacji.

```typescript
import { FEATURES, getFeatureById } from '@/config/features';

// Pobierz funkcję po ID
const aiChat = getFeatureById('ai-chat');

// Funkcje według kategorii
const aiFeatures = getFeaturesByCategory('ai');

// Sprawdź czy funkcja włączona w środowisku
if (isFeatureEnabledInEnvironment('ai-chat')) {
  // ...
}
```

**Przykład definicji funkcji:**
```typescript
{
  id: 'ai-chat',
  name: 'AI Chat',
  description: 'AI-powered chat functionality',
  status: 'enabled',
  permissions: ['public', 'user', 'admin'],
  rateLimit: {
    requests: 10,
    window: 60000,
    identifier: 'ip'
  },
  environments: ['development', 'staging', 'production'],
  dependencies: [],
  metadata: {
    category: 'ai',
    models: ['gemma-3-12b-it', 'qwq-32b']
  }
}
```

### 3. API Middleware Layer

**Lokalizacja:** `src/middleware/api-middleware.ts`

Centralna warstwa middleware dla wszystkich endpointów API.

```typescript
import { withFeatureMiddleware } from '@/middleware/api-middleware';

export const POST: APIRoute = async (context) => {
  return withFeatureMiddleware(
    'feature-id',      // ID funkcji
    context,           // Astro API context
    'public',          // Wymagane uprawnienie
    async (ctx, requestContext) => {
      // Twoja logika biznesowa
    }
  );
};
```

**Automatycznie zapewnia:**
- ✅ Sprawdzanie feature flags
- ✅ Walidację uprawnień
- ✅ Rate limiting
- ✅ Logowanie requestów
- ✅ Obsługę błędów
- ✅ Headers z limitem zapytań

### 4. Function Registry

**Lokalizacja:** `src/lib/registry/function-registry.ts`

Centralny rejestr wszystkich funkcji API.

```typescript
import { getFunctionRegistry } from '@/lib/registry/function-registry';

const registry = getFunctionRegistry();

// Lista wszystkich funkcji
const allFunctions = registry.getAllFunctions();

// Funkcje według kategorii
const aiFunctions = registry.getFunctionsByCategory('ai');

// Statystyki
const stats = registry.getStats();

// Generowanie dokumentacji
const docs = registry.generateDocs();
```

### 5. Plugin Architecture

**Lokalizacja:** `src/lib/plugins/plugin-manager.ts`

System pluginów do modularnego rozszerzania funkcjonalności.

```typescript
import { getPluginManager } from '@/lib/plugins/plugin-manager';
import { CachePlugin } from '@/lib/plugins/example-plugin';

const manager = getPluginManager({
  env: locals.runtime.env,
  config: {},
  logger: console.log
});

// Rejestracja pluginu
await manager.register(CachePlugin);

// Wykonanie akcji pluginu
const result = await manager.execute('cache-plugin', {
  action: 'get',
  params: { key: 'my-key' },
  context: requestContext
});
```

---

## Użycie

### Podstawowe użycie - Nowy endpoint API

```typescript
// src/pages/api/my-feature.ts
import type { APIRoute } from 'astro';
import { withFeatureMiddleware } from '@/middleware/api-middleware';

export const POST: APIRoute = async (context) => {
  return withFeatureMiddleware(
    'my-feature',  // ID z config/features.ts
    context,
    'user',        // Wymagane uprawnienie: public | user | admin | system
    async (ctx, requestContext) => {
      // Twoja logika biznesowa
      const body = await ctx.request.json();

      return new Response(
        JSON.stringify({
          success: true,
          data: { message: 'Success!' }
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  );
};
```

### Dodawanie nowej funkcji

**Krok 1:** Dodaj konfigurację w `src/config/features.ts`

```typescript
export const FEATURES: FeatureFlag[] = [
  // ... existing features
  {
    id: 'my-new-feature',
    name: 'My New Feature',
    description: 'Description of the feature',
    status: 'enabled',
    permissions: ['user', 'admin'],
    rateLimit: {
      requests: 20,
      window: 60000,
      identifier: 'ip'
    },
    environments: ['development', 'staging', 'production'],
    metadata: {
      category: 'custom',
      version: '1.0.0'
    }
  }
];
```

**Krok 2:** Dodaj do rejestru funkcji w `src/lib/registry/function-registry.ts`

```typescript
export const DEFAULT_FUNCTIONS: FunctionRegistryEntry[] = [
  // ... existing functions
  {
    id: 'my-new-feature',
    name: 'My New Feature',
    category: 'custom',
    endpoint: '/api/my-new-feature',
    method: 'POST',
    enabled: true,
    permissions: ['user', 'admin'],
    rateLimit: {
      requests: 20,
      window: 60000,
      identifier: 'ip'
    },
    metadata: {
      description: 'My new feature endpoint',
      version: '1.0.0',
      tags: ['custom', 'new']
    }
  }
];
```

**Krok 3:** Utwórz endpoint API

```typescript
// src/pages/api/my-new-feature.ts
import type { APIRoute } from 'astro';
import { withFeatureMiddleware } from '@/middleware/api-middleware';

export const POST: APIRoute = async (context) => {
  return withFeatureMiddleware(
    'my-new-feature',
    context,
    'user',
    async (ctx, requestContext) => {
      // Implementation
    }
  );
};
```

### Tworzenie własnego pluginu

```typescript
// src/lib/plugins/my-plugin.ts
import type { FeaturePlugin } from '@/Types/features';

export const MyPlugin: FeaturePlugin = {
  id: 'my-plugin',
  name: 'My Plugin',
  version: '1.0.0',
  enabled: true,

  metadata: {
    author: 'Your Name',
    description: 'Plugin description',
    dependencies: []
  },

  async initialize(context) {
    console.log('[MyPlugin] Initializing...');
    // Setup code
  },

  async execute(request) {
    const { action, params } = request;

    switch (action) {
      case 'my-action':
        return {
          success: true,
          data: { result: 'Success!' }
        };

      default:
        return {
          success: false,
          error: `Unknown action: ${action}`
        };
    }
  },

  async cleanup() {
    console.log('[MyPlugin] Cleaning up...');
  }
};
```

---

## Konfiguracja

### Poziomy uprawnień

```typescript
type Permission = 'public' | 'user' | 'admin' | 'system';
```

- **public** - Dostępne dla wszystkich (bez autoryzacji)
- **user** - Wymaga uwierzytelnienia użytkownika
- **admin** - Tylko dla administratorów
- **system** - Tylko dla wewnętrznych wywołań systemowych

### Statusy funkcji

```typescript
type FeatureStatus = 'enabled' | 'disabled' | 'beta' | 'deprecated';
```

- **enabled** - Funkcja w pełni dostępna
- **disabled** - Funkcja wyłączona
- **beta** - Funkcja w fazie testów
- **deprecated** - Funkcja przestarzała (do usunięcia)

### Rate Limiting

```typescript
interface RateLimitConfig {
  requests: number;     // Liczba zapytań
  window: number;       // Okno czasowe w ms
  identifier?: 'ip' | 'user' | 'api-key';
}
```

Przykład:
```typescript
rateLimit: {
  requests: 10,      // 10 zapytań
  window: 60000,     // na minutę (60000ms)
  identifier: 'ip'   // per IP address
}
```

---

## Przykłady

### Przykład 1: Prosty endpoint z middleware

```typescript
import type { APIRoute } from 'astro';
import { withFeatureMiddleware } from '@/middleware/api-middleware';

export const GET: APIRoute = async (context) => {
  return withFeatureMiddleware(
    'health-check',
    context,
    'public',
    async () => {
      return new Response(
        JSON.stringify({ status: 'ok', timestamp: Date.now() }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }
  );
};
```

### Przykład 2: Endpoint z cachowaniem

```typescript
export const POST: APIRoute = async (context) => {
  return withFeatureMiddleware(
    'ai-chat',
    context,
    'public',
    async (ctx, requestContext) => {
      const runtime = (ctx.locals as any)?.runtime;
      const env = runtime?.env;

      // Sprawdź cache
      const cacheKey = `chat:${requestContext.clientAddress}`;
      if (env?.CACHE) {
        const cached = await env.CACHE.get(cacheKey);
        if (cached) {
          return new Response(cached, {
            headers: {
              'Content-Type': 'application/json',
              'X-Cache': 'HIT'
            }
          });
        }
      }

      // Generuj odpowiedź
      const response = await generateResponse();

      // Zapisz do cache
      if (env?.CACHE) {
        await env.CACHE.put(cacheKey, JSON.stringify(response), {
          expirationTtl: 3600
        });
      }

      return new Response(JSON.stringify(response), {
        headers: {
          'Content-Type': 'application/json',
          'X-Cache': 'MISS'
        }
      });
    }
  );
};
```

### Przykład 3: Warunkowe włączanie funkcji

```typescript
import { getFeatureFlagsManager } from '@/lib/features/feature-flags';

const manager = getFeatureFlagsManager();

// Włącz funkcję tylko w development
if (process.env.NODE_ENV === 'development') {
  manager.enable('debug-mode');
} else {
  manager.disable('debug-mode');
}

// Feature flag z zależnościami
manager.register({
  id: 'advanced-ai',
  name: 'Advanced AI Features',
  status: 'enabled',
  permissions: ['admin'],
  dependencies: ['ai-chat', 'ai-image-gen'], // Wymaga obu funkcji
  // ...
});
```

---

## API Reference

### Feature Flags Manager

```typescript
class FeatureFlagsManager {
  register(feature: FeatureFlag): void
  registerBatch(features: FeatureFlag[]): void
  isEnabled(featureId: string, permission?: Permission): boolean
  getFeature(featureId: string): FeatureFlag | undefined
  getAllFeatures(): FeatureFlag[]
  enable(featureId: string): void
  disable(featureId: string): void
  setBeta(featureId: string): void
  deprecate(featureId: string): void
  exportConfig(): string
  importConfig(json: string): void
  getStats(): FeatureStats
}
```

### Function Registry

```typescript
class FunctionRegistry {
  register(entry: FunctionRegistryEntry): void
  registerBatch(entries: FunctionRegistryEntry[]): void
  getFunction(id: string): FunctionRegistryEntry | undefined
  getAllFunctions(): FunctionRegistryEntry[]
  getFunctionsByCategory(category: string): FunctionRegistryEntry[]
  getEnabledFunctions(): FunctionRegistryEntry[]
  enable(id: string): void
  disable(id: string): void
  getStats(): RegistryStats
  generateDocs(): string
}
```

### Plugin Manager

```typescript
class PluginManager {
  register(plugin: FeaturePlugin): Promise<void>
  registerBatch(plugins: FeaturePlugin[]): Promise<void>
  getPlugin(id: string): FeaturePlugin | undefined
  getAllPlugins(): FeaturePlugin[]
  execute(pluginId: string, request: PluginRequest): Promise<PluginResponse>
  enable(pluginId: string): void
  disable(pluginId: string): void
  unregister(pluginId: string): Promise<void>
  getStats(): PluginStats
}
```

### Middleware

```typescript
function withFeatureMiddleware(
  featureId: string,
  context: APIContext,
  permission: Permission,
  handler: (ctx: APIContext, requestContext: RequestContext) => Promise<Response>
): Promise<Response>

function validateFeatureAccess(
  featureId: string,
  permission: Permission,
  context: RequestContext
): MiddlewareResult

function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number }
```

---

## Migracja

### Aktualizacja istniejących endpointów

**Przed:**
```typescript
export const POST: APIRoute = async ({ request, clientAddress }) => {
  // Manual checks
  if (!checkRateLimit(clientAddress)) {
    return new Response('Rate limit exceeded', { status: 429 });
  }

  // Business logic
  const data = await processRequest(request);
  return new Response(JSON.stringify(data));
};
```

**Po:**
```typescript
export const POST: APIRoute = async (context) => {
  return withFeatureMiddleware(
    'my-feature',
    context,
    'public',
    async (ctx) => {
      // Only business logic - rate limiting automatic!
      const data = await processRequest(ctx.request);
      return new Response(JSON.stringify(data));
    }
  );
};
```

### Checklist migracji

- [ ] Dodaj funkcję do `config/features.ts`
- [ ] Dodaj funkcję do `lib/registry/function-registry.ts`
- [ ] Zastąp ręczne sprawdzanie przez `withFeatureMiddleware()`
- [ ] Usuń duplikującą się logikę rate limiting
- [ ] Usuń ręczne sprawdzanie feature flags
- [ ] Przetestuj endpoint
- [ ] Zaktualizuj dokumentację API

---

## Endpointy systemowe

### Registry API

**GET** `/api/features/registry`

Query params:
- `action=list` - Lista wszystkich funkcji
- `action=enabled` - Lista włączonych funkcji
- `action=features` - Lista feature flags
- `action=docs` - Generuj dokumentację (markdown)
- `action=stats` - Statystyki systemu
- `action=category&name=ai` - Funkcje według kategorii

Przykłady:
```bash
# Lista wszystkich funkcji
curl http://localhost:4321/api/features/registry?action=list

# Tylko włączone funkcje
curl http://localhost:4321/api/features/registry?action=enabled

# Statystyki
curl http://localhost:4321/api/features/registry?action=stats

# Dokumentacja
curl http://localhost:4321/api/features/registry?action=docs

# Funkcje AI
curl http://localhost:4321/api/features/registry?action=category&name=ai
```

---

## Best Practices

1. **Zawsze używaj middleware** dla nowych endpointów
2. **Definiuj funkcje centralnie** w `config/features.ts`
3. **Używaj odpowiednich poziomów uprawnień**
4. **Konfiguruj rate limiting** według potrzeb
5. **Dodawaj metadata** dla lepszej dokumentacji
6. **Testuj w różnych środowiskach** (dev, staging, production)
7. **Monitoruj statystyki** funkcji i rate limiting
8. **Dokumentuj zmiany** w feature flags

---

## Troubleshooting

### Problem: Feature flag nie działa

**Rozwiązanie:**
```typescript
import { getFeatureManager } from '@/middleware/api-middleware';

const manager = getFeatureManager();
const feature = manager.getFeature('my-feature-id');

console.log('Feature:', feature);
console.log('Enabled:', manager.isEnabled('my-feature-id'));
```

### Problem: Rate limiting nie działa

**Rozwiązanie:** Sprawdź konfigurację rate limit w feature definition:
```typescript
{
  id: 'my-feature',
  // ...
  rateLimit: {
    requests: 10,
    window: 60000,
    identifier: 'ip'  // 'ip' | 'user' | 'api-key'
  }
}
```

### Problem: Plugin nie ładuje się

**Rozwiązanie:** Sprawdź dependencies i initialize:
```typescript
const plugin: FeaturePlugin = {
  // ...
  metadata: {
    dependencies: ['dependency-plugin-id']  // Check if registered first
  },

  async initialize(context) {
    // Check initialization logs
    console.log('Initializing plugin...');
  }
};
```

---

## Licencja

MIT License - MyBonzo AI Blog

---

## Kontakt

Pytania? Issues? Feature requests?
- GitHub: [your-repo]
- Email: kontakt@mybonzo.com
