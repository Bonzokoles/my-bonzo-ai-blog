# Automatyczny Sync Produktów z API Meble Pumo 🚀

## Przegląd Systemu

Zastąpiliśmy scraping zewnętrznym API sync system który automatycznie pobiera dane z Meble Pumo API i aktualizuje naszą lokalną bazę danych PUMO_DB.

## 🏗️ Architektura

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Meble Pumo    │    │    MyBonzo       │    │   Cloudflare    │
│      API        │───▶│   API Sync       │───▶│     PUMO_DB     │
│ (External API)  │    │   /pumo-api-sync │    │  (D1 Database)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         │              ┌─────────────────┐                 │
         │              │ Cron Worker     │                 │
         └──────────────│ Daily 3AM UTC   │─────────────────┘
                        │ Auto Sync       │
                        └─────────────────┘
```

## 📂 Pliki Systemu

### API Endpoints
- **`/api/pumo-api-sync`** - Główny endpoint synchronizacji
  - `GET` - Status i statystyki
  - `POST` - Manualne uruchomienie sync
- **`/api/setup-sync-table`** - Setup tabeli sync_history
  - `GET` - Sprawdzenie stanu tabeli
  - `POST` - Utworzenie tabeli

### Workers
- **`workers/pumo-sync-cron.ts`** - Cloudflare Worker z cron job
- **`workers/wrangler-cron.toml`** - Konfiguracja Worker

## 🚀 Deployment

### Krok 1: Setup Database Table

```bash
# Utwórz tabelę sync_history w PUMO_DB
curl -X POST https://mybonzoaiblog.pages.dev/api/setup-sync-table
```

### Krok 2: Testuj API Sync

```bash
# Status systemu
curl https://mybonzoaiblog.pages.dev/api/pumo-api-sync

# Manual sync test
curl -X POST https://mybonzoaiblog.pages.dev/api/pumo-api-sync
```

### Krok 3: Deploy Cron Worker (opcjonalnie)

```bash
# Deploy cron worker
cd u:\JIMBO_UNIFIELD_WEBSIDES_hub\my-bonzo-ai-blog\workers
wrangler deploy --config wrangler-cron.toml

# Set API key secret
wrangler secret put PUMO_API_KEY --config wrangler-cron.toml
```

## ⚙️ Konfiguracja

### Environment Variables

W Cloudflare Pages Dashboard → Settings → Environment Variables:

```env
PUMO_API_KEY=your-meble-pumo-api-key
PUMO_API_BASE_URL=https://api.meblepumo.pl/v1
```

### PUMO_DB Bindings

Już skonfigurowane w `wrangler.toml`:
```toml
[[d1_databases]]
binding = "PUMO_DB"
database_name = "pumo_products"  
database_id = "9534ef30-4ccd-4e90-9efc-7ddd2f9935cc"
```

## 🔄 Jak Działa Sync

### 1. API Client
```typescript
class PumoAPIClient {
  async getAllProducts(): Promise<PumoAPIProduct[]>
  async fetchProductsPage(page: number): Promise<PumoAPIResponse>
}
```

### 2. Data Flow
```
Meble Pumo API → Fetch Products → Transform Data → Update PUMO_DB → Log to sync_history
```

### 3. Rate Limiting
- 100ms delay między API calls
- 100 produktów per request
- 30s timeout per request

## 📊 Tracking & Analytics

### Sync History Table
```sql
CREATE TABLE sync_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sync_type TEXT NOT NULL DEFAULT 'api_sync',
  started_at TEXT NOT NULL,
  completed_at TEXT,
  status TEXT NOT NULL DEFAULT 'running',
  products_synced INTEGER DEFAULT 0,
  created_count INTEGER DEFAULT 0,
  updated_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  duration_ms INTEGER,
  error_message TEXT,
  metadata TEXT -- JSON for additional info
);
```

### Statystyki
```bash
# Check sync history
curl https://mybonzoaiblog.pages.dev/api/setup-sync-table

# Check product stats  
curl https://mybonzoaiblog.pages.dev/api/direct-pumo
```

## 🕒 Schedule

### Automatic Sync
- **Cron**: Codziennie o 3:00 AM UTC (5:00 AM PL zimą, 6:00 AM latem)
- **Trigger**: `0 3 * * *`
- **Worker**: `pumo-sync-cron`

### Manual Sync
- API endpoint: `POST /api/pumo-api-sync`
- Worker endpoint: `POST /trigger-sync`

## 🛠️ Testing

### Test API Connection
```bash
# 1. Check API status
curl https://mybonzoaiblog.pages.dev/api/pumo-api-sync

# Expected response:
{
  "success": true,
  "data": {
    "database_stats": { "total": 3, "categories": 2 },
    "api_config": { "has_api_key": true }
  }
}
```

### Test Manual Sync
```bash
# 2. Trigger sync
curl -X POST https://mybonzoaiblog.pages.dev/api/pumo-api-sync

# Expected response:
{
  "success": true,
  "data": {
    "sync_id": 123,
    "statistics": {
      "total_products": 2500,
      "processed": 2500,
      "created": 2497,
      "updated": 3,
      "errors": 0
    }
  }
}
```

### Test Cron Worker
```bash
# 3. Manual worker trigger
curl -X POST https://pumo-sync-cron.stolarnia-ams.workers.dev/trigger-sync
```

## 🔧 Troubleshooting

### Common Issues

#### 1. API Key Missing
```json
{
  "success": false,
  "error": "PUMO_API_KEY not configured"
}
```
**Fix**: Set `PUMO_API_KEY` in Cloudflare env vars

#### 2. Database Not Found
```json
{
  "success": false,
  "error": "PUMO_DB not configured"
}
```
**Fix**: Check D1 binding in `wrangler.toml`

#### 3. API Timeout
```json
{
  "success": false,
  "error": "API Error: 408 Request Timeout"
}
```
**Fix**: API może być przeciążone, spróbuj ponownie

#### 4. Rate Limiting
```json
{
  "success": false,
  "error": "API Error: 429 Too Many Requests"
}
```
**Fix**: Zwiększ delay w `PumoAPIClient` (obecnie 100ms)

### Debug Commands

```bash
# Check database connection
curl https://mybonzoaiblog.pages.dev/api/direct-pumo

# Check sync table
curl https://mybonzoaiblog.pages.dev/api/setup-sync-table

# Check last sync
curl "https://mybonzoaiblog.pages.dev/api/pumo-api-sync" | jq '.data.last_sync'
```

## 📈 Performance

### Expected Numbers
- **Total Products**: ~2500+ (z Meble Pumo)
- **Sync Time**: ~5-10 minut (depends on API speed)
- **API Calls**: ~25 requests (100 products per page)
- **Database Operations**: ~2500 INSERTs/UPDATEs

### Optimizations
1. **Batch Processing**: 100 products per API call
2. **Rate Limiting**: 100ms delays
3. **Incremental Updates**: Only modified products
4. **Error Handling**: Continue on single product errors

## 🎯 Benefits over Scraping

### ✅ API Advantages
1. **Reliable Data**: Structured JSON from official API
2. **Real-time**: Fresh data directly from source
3. **No Breaking**: API stable, scraping breaks with site changes
4. **Rate Limits**: Official limits, no IP bans
5. **Authentication**: Secure API key access
6. **Metadata**: Rich product information
7. **Performance**: Faster than HTML parsing

### ❌ Scraping Disadvantages
1. **Fragile**: Breaks with HTML structure changes
2. **IP Blocks**: Can get blocked for too many requests
3. **Slow**: HTML parsing overhead
4. **Incomplete**: May miss dynamic content
5. **Legal**: Gray area vs official API

## 🔄 Monitoring

### Health Checks
```bash
# Daily check script
#!/bin/bash
echo "🔍 Checking Pumo API Sync Health..."

STATUS=$(curl -s https://mybonzoaiblog.pages.dev/api/pumo-api-sync | jq -r '.success')

if [ "$STATUS" = "true" ]; then
    echo "✅ API Sync healthy"
else
    echo "❌ API Sync issues detected"
fi
```

### Analytics Dashboard
Przyszłe rozszerzenie: Dashboard w `/eksperymenty/pumo-dashboard/` z:
- Real-time sync status
- Product statistics
- API performance metrics
- Error tracking
- Sync history graphs

---

## 🚀 Next Steps

1. **Test całego pipeline** ✅
2. **Deploy cron worker** 
3. **Monitor first automatic sync**
4. **Setup alerts** for failed syncs
5. **Create dashboard** dla monitoring
6. **Add incremental sync** (tylko zmienione produkty)

**Status**: Ready for production testing! 🎉
