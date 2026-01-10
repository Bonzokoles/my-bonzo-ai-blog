# JIMBO PUMO API - CRON + R2 ARCHIWIZACJA

---

## 🤖 PROMPT DLA VSCODE AI (CURSOR/CLINE/COPILOT)

**SKOPIUJ I WKLEJ TO DO AI W VSCODE:**

```
Witaj! Potrzebuję Twojej pomocy w modyfikacji Cloudflare Worker.

PROJEKT: jimbo-like-pumo-api (Cloudflare Worker w TypeScript)

CELE:
1. Dodać automatyczną synchronizację przez CRON (co 6 godzin)
2. Zapisywać surowe dane produktów do R2 bucket jako backup/archiwum
3. Zachować istniejącą funkcjonalność (D1 + Vectorize)

WYMAGANE ZMIANY:

1. **wrangler.toml** - dodaj:
   - R2 bucket binding (PUMO_RAW_BUCKET → pumo-raw-data)
   - CRON trigger (co 6h: "0 */6 * * *")

2. **src/services/product-sync.ts** - dodaj:
   - Metodę `saveToR2(products, syncType)` która zapisuje JSON do R2
   - Wywołania `saveToR2()` w metodach `fullSync()` i `incrementalSync()`

3. **src/index.ts** - opcjonalnie dodaj:
   - Endpoint `/api/cleanup-r2` do usuwania starych backupów (>30 dni)

STRUKTURA ZAPISU W R2:
- Filename: `sync-{type}-{timestamp}.json`
- Format: { sync_type, timestamp, product_count, products: [...] }
- Metadata: sync_type, product_count

WAŻNE:
- Nie usuwaj istniejącej funkcjonalności
- R2 save nie może blokować synca (try-catch)
- Timestamp w formacie ISO bez dwukropków/kropek
- contentType: "application/json"

Wykonaj te zmiany krok po kroku, pokazując mi każdą modyfikację przed zapisem.
Pytaj jeśli coś jest niejasne!
```

**JAK UŻYĆ:**
1. Otwórz projekt w VSCode/Cursor
2. Otwórz panel AI (Ctrl+L w Cursor, Ctrl+I w Copilot)
3. Wklej powyższy prompt
4. Wklej całą treść tego pliku MD jako kontekst
5. AI zrobi zmiany automatycznie

---

## 🎯 CEL
Automatyczna synchronizacja produktów Pumo co 6h + zapis surowych danych do R2.

---

## 📋 KROK 1: Dodaj R2 Bucket Binding

### A) Utwórz bucket (jeśli nie istnieje):
```bash
wrangler r2 bucket create pumo-raw-data
```

### B) Dodaj binding w `wrangler.toml`:
```toml
[[r2_buckets]]
binding = "PUMO_RAW_BUCKET"
bucket_name = "pumo-raw-data"
```

---

## ⏰ KROK 2: Dodaj CRON Trigger

W `wrangler.toml` dodaj:
```toml
[triggers]
crons = ["0 */6 * * *"]  # Co 6 godzin
```

**Alternatywne opcje:**
```toml
# Codziennie o 2:00
crons = ["0 2 * * *"]

# Co 12h (o 00:00 i 12:00)
crons = ["0 0,12 * * *"]

# Co godzinę
crons = ["0 * * * *"]
```

---

## 💾 KROK 3: Dodaj metodę zapisu do R2

Edytuj `src/services/product-sync.ts` i dodaj:

```typescript
async saveToR2(products: any[], syncType: 'full' | 'incremental') {
  console.log(`📦 Saving ${products.length} products to R2...`);
  
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `sync-${syncType}-${timestamp}.json`;
    
    const data = {
      sync_type: syncType,
      timestamp: new Date().toISOString(),
      product_count: products.length,
      products: products
    };
    
    await this.env.PUMO_RAW_BUCKET.put(
      filename,
      JSON.stringify(data, null, 2),
      {
        httpMetadata: {
          contentType: 'application/json'
        },
        customMetadata: {
          sync_type: syncType,
          product_count: String(products.length)
        }
      }
    );
    
    console.log(`✅ Saved to R2: ${filename}`);
  } catch (error) {
    console.error('❌ R2 save failed:', error);
    // Nie przerwamy synca jeśli R2 fail
  }
}
```

---

## 🔧 KROK 4: Zmodyfikuj metodę fullSync

W `src/services/product-sync.ts`, w metodzie `fullSync()` dodaj wywołanie:

```typescript
async fullSync() {
  console.log("🔄 Starting FULL product sync...");
  const startTime = Date.now();
  
  try {
    // Pobierz produkty z API
    const apiProducts = await this.apiClient.getAllProducts();
    
    if (apiProducts.length === 0) {
      throw new Error("No products fetched from API");
    }
    
    // ⬇️ DODAJ TO: Zapisz surowe dane do R2
    await this.saveToR2(apiProducts, 'full');
    
    // ... reszta kodu bez zmian ...
    const existingProducts = await this.getExistingProducts();
    const changes = await this.detectChanges(apiProducts, existingProducts);
    
    // ... itd ...
```

To samo dla `incrementalSync()`:

```typescript
async incrementalSync() {
  // ...
  const updatedProducts = apiProducts.filter(/* ... */);
  
  // ⬇️ DODAJ TO
  if (updatedProducts.length > 0) {
    await this.saveToR2(updatedProducts, 'incremental');
  }
  
  // ... reszta bez zmian ...
}
```

---

## 📁 STRUKTURA PLIKÓW W R2

Po uruchomieniu będziesz miał w `pumo-raw-data`:

```
pumo-raw-data/
├── sync-full-2026-01-10T18-30-00-000Z.json
├── sync-full-2026-01-11T00-30-00-000Z.json
├── sync-incremental-2026-01-11T06-30-00-000Z.json
├── sync-incremental-2026-01-11T12-30-00-000Z.json
└── ...
```

Każdy plik zawiera:
```json
{
  "sync_type": "full",
  "timestamp": "2026-01-10T18:30:00.000Z",
  "product_count": 2547,
  "products": [
    {
      "id": "123",
      "name": "Szafa MALM",
      "price": 599.00,
      ...
    },
    ...
  ]
}
```

---

## 🚀 KROK 5: Deploy

```bash
cd /ścieżka/do/jimbo-like-pumo-api
wrangler deploy
```

---

## ✅ WERYFIKACJA

### 1. Sprawdź czy CRON działa:
```bash
wrangler tail --format=pretty
```

### 2. Sprawdź R2:
```bash
wrangler r2 object list pumo-raw-data
```

### 3. Pobierz przykładowy plik:
```bash
wrangler r2 object get pumo-raw-data/sync-full-2026-01-10T18-30-00-000Z.json --file=test.json
cat test.json | jq '.product_count'
```

### 4. Manual test (bez czekania na CRON):
```bash
curl -X POST "https://jimbo-like-pumo-api.bonzo1977.workers.dev/api/sync/full"
```

---

## 🔍 MONITORING

Dashboard pokazuje:
- **Sync status** - ostatnie uruchomienia
- **R2 bucket size** - ile miejsca zajmują backupy
- **Product count** - ile produktów w D1

Logi CRON w:
```bash
wrangler tail
```

---

## 📊 OPCJONALNE: Cleanup starych backupów

Dodaj endpoint do czyszczenia starych plików (np. >30 dni):

```typescript
// W src/index.ts
if (path === '/api/cleanup-r2' && request.method === 'POST') {
  return await handleR2Cleanup(env, corsHeaders);
}

async function handleR2Cleanup(env: Env, corsHeaders: any) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const list = await env.PUMO_RAW_BUCKET.list();
  let deleted = 0;
  
  for (const obj of list.objects) {
    if (obj.uploaded < thirtyDaysAgo) {
      await env.PUMO_RAW_BUCKET.delete(obj.key);
      deleted++;
    }
  }
  
  return jsonResponse({
    success: true,
    deleted,
    message: `Deleted ${deleted} old backup files`
  }, 200, corsHeaders);
}
```

Ustaw CRON dla cleanup (raz w tygodniu):
```toml
# W wrangler.toml
[triggers]
crons = [
  "0 */6 * * *",      # Sync co 6h
  "0 3 * * 0"         # Cleanup w niedzielę o 3:00
]
```

---

## 🎉 GOTOWE!

Po wdrożeniu:
- ✅ Sync działa automatycznie co 6h
- ✅ Surowe dane lądują w R2 (backup)
- ✅ D1 + Vectorize aktualizowane normalnie
- ✅ Możesz analizować historyczne dane z R2

**Czas wdrożenia:** ~10 minut

---

## 🆘 TROUBLESHOOTING

**CRON nie działa?**
```bash
wrangler tail
# Sprawdź czy widzisz "⏰ Cron triggered at:"
```

**R2 binding error?**
```
Error: R2 bucket binding "PUMO_RAW_BUCKET" not found
```
→ Upewnij się że dodałeś `[[r2_buckets]]` w `wrangler.toml` i zrobiłeś `wrangler deploy`

**Sync timeout?**
Zwiększ timeout w `wrangler.toml`:
```toml
[build]
command = ""

[env.production]
compatibility_date = "2024-01-01"
cpu_ms = 50000  # 50s zamiast domyślnych 10s
```

**Za dużo miejsca w R2?**
Włącz lifecycle rules w Cloudflare Dashboard:
- R2 > pumo-raw-data > Settings > Lifecycle rules
- Delete objects older than 30 days

---

**Pytania? Problemy?** Daj znać, pomogę!
