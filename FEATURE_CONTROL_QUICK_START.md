# Feature Control System - Quick Start Guide

## 🚀 5-Minute Quick Start

### 1. Test the System

```bash
# Check system health
curl http://localhost:4321/api/features/health

# Validate configuration
curl http://localhost:4321/api/features/validate

# Get validation report (markdown)
curl http://localhost:4321/api/features/validate?format=markdown

# List all features
curl http://localhost:4321/api/features/registry?action=features
```

### 2. Use Middleware in Your API

```typescript
// src/pages/api/your-endpoint.ts
import type { APIRoute } from 'astro';
import { withFeatureMiddleware } from '@/middleware/api-middleware';

export const POST: APIRoute = async (context) => {
  return withFeatureMiddleware(
    'your-feature-id',  // Must exist in config/features.ts
    context,
    'user',             // Permission level: public | user | admin | system
    async (ctx, requestContext) => {
      // Your business logic here
      // Middleware already handled:
      // ✅ Feature flag check
      // ✅ Permission validation
      // ✅ Rate limiting
      // ✅ Request logging

      return new Response(
        JSON.stringify({ success: true, data: 'Hello!' }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }
  );
};
```

### 3. Add a New Feature

**Step 1:** Add to `src/config/features.ts`

```typescript
{
  id: 'my-new-feature',
  name: 'My New Feature',
  description: 'What this feature does',
  status: 'enabled',
  permissions: ['user', 'admin'],
  rateLimit: {
    requests: 10,
    window: 60000,  // 1 minute
    identifier: 'ip'
  },
  environments: ['development', 'staging', 'production'],
  metadata: {
    category: 'custom',
    version: '1.0.0'
  }
}
```

**Step 2:** Add to `src/lib/registry/function-registry.ts`

```typescript
{
  id: 'my-new-feature',  // MUST match config!
  name: 'My New Feature',
  category: 'custom',
  endpoint: '/api/my-new-feature',
  method: 'POST',
  enabled: true,
  permissions: ['user', 'admin'],
  rateLimit: {
    requests: 10,
    window: 60000,
    identifier: 'ip'
  },
  metadata: {
    description: 'Endpoint description',
    version: '1.0.0',
    tags: ['custom']
  }
}
```

**Step 3:** Create endpoint `src/pages/api/my-new-feature.ts`

```typescript
import type { APIRoute } from 'astro';
import { withFeatureMiddleware } from '@/middleware/api-middleware';

export const POST: APIRoute = async (context) => {
  return withFeatureMiddleware(
    'my-new-feature',
    context,
    'user',
    async (ctx) => {
      // Implementation
      return new Response(JSON.stringify({ success: true }));
    }
  );
};
```

**Step 4:** Validate

```bash
curl http://localhost:4321/api/features/validate?feature=my-new-feature
```

## 📋 Common Tasks

### Check System Status

```bash
# Full health check
curl http://localhost:4321/api/features/health | jq

# Quick validation
curl http://localhost:4321/api/features/validate
```

### List All Features

```bash
# All features
curl http://localhost:4321/api/features/registry?action=features | jq

# Only enabled
curl http://localhost:4321/api/features/registry?action=enabled | jq

# By category
curl http://localhost:4321/api/features/registry?action=category&name=ai | jq
```

### Enable/Disable Features

In `src/config/features.ts`:

```typescript
// Enable
status: 'enabled'

// Disable
status: 'disabled'

// Beta testing
status: 'beta'

// Deprecate
status: 'deprecated'
```

### Adjust Rate Limits

In feature configuration:

```typescript
rateLimit: {
  requests: 10,      // Number of requests
  window: 60000,     // Time window in ms (60000 = 1 minute)
  identifier: 'ip'   // 'ip' | 'user' | 'api-key'
}
```

## 🔧 Troubleshooting

### Feature not working?

```bash
# 1. Validate the feature
curl http://localhost:4321/api/features/validate?feature=your-feature-id

# 2. Check if enabled
curl http://localhost:4321/api/features/registry?action=list | jq '.data.functions[] | select(.id=="your-feature-id")'

# 3. Check system health
curl http://localhost:4321/api/features/health | jq '.healthy'
```

### Rate limit issues?

Check headers in response:
```bash
curl -I http://localhost:4321/api/your-endpoint

# Look for:
# X-RateLimit-Remaining: 5
# X-RateLimit-Reset: 1234567890
```

### ID mismatch errors?

```bash
# Run validation to find mismatches
curl http://localhost:4321/api/features/validate?format=markdown
```

## 📚 API Reference

### Health Check
**GET** `/api/features/health`

Returns comprehensive system health status.

### Validation
**GET** `/api/features/validate`

Query params:
- `format=json` (default) | `markdown` - Output format
- `feature=<id>` - Validate specific feature

### Registry
**GET** `/api/features/registry`

Query params:
- `action=list` - All functions
- `action=enabled` - Only enabled
- `action=features` - Feature flags
- `action=docs` - Documentation (markdown)
- `action=stats` - Statistics
- `action=category&name=<cat>` - By category

## 🎯 Best Practices

1. **Always validate after changes**
   ```bash
   curl http://localhost:4321/api/features/validate
   ```

2. **Keep IDs consistent**
   - Feature config ID = Function registry ID = Middleware ID

3. **Use appropriate permissions**
   - `public` - No auth required
   - `user` - Authenticated users
   - `admin` - Admin only
   - `system` - Internal only

4. **Set reasonable rate limits**
   - Chat/AI: 10-20 req/min
   - Image generation: 3-5 req/5min
   - Read operations: 50-100 req/min

5. **Test in development first**
   ```typescript
   environments: ['development']  // Test first
   // Then:
   environments: ['development', 'staging', 'production']
   ```

## 🐛 Debug Mode

Enable verbose logging:

```typescript
// In your endpoint
console.log('[DEBUG] Feature check:', featureId);
console.log('[DEBUG] Request context:', requestContext);
```

Check middleware logs:
```bash
# The middleware logs all requests
# Look for: [API] feature-id - IP - timestamp
```

## 📖 Full Documentation

See `FEATURE_CONTROL_SYSTEM.md` for complete documentation.

---

**Need help?** Check the full docs or run validation:
```bash
curl http://localhost:4321/api/features/validate?format=markdown
```
