# Meble Pumo API - Integracja

## 🔑 Konfiguracja API Key

### Krok 1: Uzyskaj klucz API
1. Przejdź na stronę Meble Pumo
2. Zaloguj się do panelu developerskiego
3. Wygeneruj klucz API

### Krok 2: Dodaj klucz do projektu
1. Skopiuj plik `.env.example` → `.env`:
```bash
cp .env.example .env
```

2. Otwórz `.env` i zamień placeholder na prawdziwy klucz:
```bash
MEBLE_PUMO_API_KEY=YourActualAPIKeyHere
# MEBLE_PUMO_API_URL=https://api.meblepumo.pl  # Opcjonalnie: zmień URL API jeśli inny
```

⚠️ **WAŻNE**: Plik `.env` jest w `.gitignore` - NIE commituj go do repo!

### Krok 3: Użycie w kodzie
```typescript
import { MEBLE_PUMO_CONFIG, validateMeblePumoConfig } from '@/config/meble-pumo';

if (validateMeblePumoConfig()) {
  // Użyj API
  const response = await fetch(`${MEBLE_PUMO_CONFIG.baseUrl}/products`, {
    headers: {
      'Authorization': `Bearer ${MEBLE_PUMO_CONFIG.apiKey}`
    }
  });
}
```

## 📚 Dokumentacja API
- Endpoint: `https://api.meblepumo.pl` (domyślny, można zmienić przez `MEBLE_PUMO_API_URL`)
- Format autoryzacji: Bearer token
- Rate limit: (do uzupełnienia)

## 🛡️ Bezpieczeństwo
- ✅ Klucz API przechowywany w `.env` (nie w repo)
- ✅ Walidacja przed użyciem
- ✅ Komunikaty ostrzeżeń w konsoli

## 🔄 Integracja z projektem

### Struktura konfiguracji
Konfiguracja Meble Pumo API jest spójna z innymi integracjami w projekcie:
- OpenRouter (`OPENROUTER_API_KEY`)
- Gemini (`GEMINI_API_KEY`)
- OpenAI (`OPENAI_API_KEY`)
- HeyGen (`HEYGEN_API_KEY`)

### Przykładowe użycie w API endpoint
```typescript
// src/pages/api/meble-pumo/products.ts
import type { APIRoute } from 'astro';
import { MEBLE_PUMO_CONFIG, validateMeblePumoConfig } from '@/config/meble-pumo';

export const GET: APIRoute = async ({ request }) => {
  if (!validateMeblePumoConfig()) {
    return new Response(
      JSON.stringify({ error: 'Meble Pumo API not configured' }),
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${MEBLE_PUMO_CONFIG.baseUrl}/products`, {
      headers: {
        'Authorization': `Bearer ${MEBLE_PUMO_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch products' }),
      { status: 500 }
    );
  }
};
```

## 📋 Checklist wdrożenia
- [x] Dodano zmienną `MEBLE_PUMO_API_KEY` do `.env.example`
- [x] Utworzono helper config w `src/config/meble-pumo.ts`
- [x] Dodano dokumentację integracji
- [ ] Utworzono przykładowy API endpoint (opcjonalne)
- [ ] Przetestowano walidację konfiguracji
- [ ] Zaktualizowano główny README (opcjonalne)
