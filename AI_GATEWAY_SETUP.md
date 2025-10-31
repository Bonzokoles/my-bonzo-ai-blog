# 🚀 AI Gateway Integration Guide

## Przegląd

AI Gateway to usługa Cloudflare, która umożliwia zarządzanie i monitorowanie żądań do modeli AI z różnych dostawców przez jeden zunifikowany endpoint.

## 🔧 Konfiguracja

### 1. Utwórz AI Gateway w Cloudflare Dashboard

1. Przejdź do: https://dash.cloudflare.com/{account_id}/ai/ai-gateway
2. Kliknij **"Create Gateway"**
3. Podaj nazwę (np. `mybonzo-ai-gateway`)
4. Skopiuj **Gateway ID** - będzie potrzebny w konfiguracji

### 2. Dodaj zmienne środowiskowe

Edytuj plik `.env`:

```env
# Cloudflare AI Gateway Configuration
CLOUDFLARE_ACCOUNT_ID=[USUNIĘTO_ZE_WZGLĘDÓW_BEZPIECZEŃSTWA]
CLOUDFLARE_AI_GATEWAY_ID=your-gateway-id-here
CLOUDFLARE_API_TOKEN=your-api-token
```

### 3. Endpoint URL

AI Gateway będzie dostępny pod adresem:
```
https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/compat/chat/completions
```

## 🧪 Testowanie

### Opcja 1: Test HTML
Otwórz plik `ai-gateway-test.html` w przeglądarce i wypełnij formularz.

### Opcja 2: Test cURL
```bash
curl -X POST http://localhost:4321/api/ai/gateway \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Cześć! Odpowiedz krótko po polsku."}
    ],
    "model": "@cf/google/gemma-3-12b-it",
    "temperature": 0.7,
    "max_tokens": 512
  }'
```

### Opcja 3: Test JavaScript
```javascript
const response = await fetch('/api/ai/gateway', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'Test AI Gateway' }
    ],
    model: '@cf/google/gemma-3-12b-it'
  })
});

const result = await response.json();
console.log(result);
```

## 🎯 Korzyści AI Gateway

### 1. Zunifikowany Interface
- Jeden endpoint dla wszystkich modeli AI
- Kompatybilność z OpenAI SDK
- Łatwe przełączanie między dostawcami

### 2. Monitorowanie i Analytics
- Śledzenie użycia i kosztów
- Metryki wydajności
- Logi zapytań

### 3. Rate Limiting i Cache
- Kontrola częstotliwości zapytań
- Cache odpowiedzi dla optymalizacji
- Fallback mechanizmy

### 4. Security
- Centralne zarządzanie API keys
- Request filtering
- Audit logs

## 📊 Dostępne Modele

### Cloudflare Workers AI
- `@cf/google/gemma-3-12b-it` - Gemma 3 12B Instruct
- `@cf/meta/llama-2-7b-chat-int8` - Llama 2 7B Chat
- `@cf/microsoft/phi-2` - Microsoft Phi-2

### Zewnętrzni dostawcy (po konfiguracji)
- `gpt-3.5-turbo` - OpenAI GPT-3.5
- `gpt-4` - OpenAI GPT-4
- `claude-3-haiku` - Anthropic Claude

## 🔗 Integracja z aplikacją

Endpoint `/api/ai/gateway` automatycznie:
1. Pobiera konfigurację z zmiennych środowiskowych
2. Przekazuje zapytania do AI Gateway
3. Zwraca odpowiedzi w standardowym formacie
4. Obsługuje błędy i rate limiting

## 📝 Przykład odpowiedzi

```json
{
  "success": true,
  "id": "chatcmpl-xyz123",
  "object": "chat.completion",
  "created": 1699999999,
  "model": "@cf/google/gemma-3-12b-it",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Cześć! Jak mogę Ci pomóc?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 8,
    "total_tokens": 18
  }
}
```

## 🚨 Troubleshooting

### 1. Błąd 401 (Unauthorized)
- Sprawdź `CLOUDFLARE_API_TOKEN`
- Upewnij się, że token ma uprawnienia do AI Gateway

### 2. Błąd 404 (Gateway not found)
- Zweryfikuj `CLOUDFLARE_AI_GATEWAY_ID`
- Sprawdź czy Gateway został utworzony w dashboard

### 3. Błąd 500 (Missing configuration)
- Sprawdź wszystkie zmienne środowiskowe w `.env`
- Upewnij się, że `CLOUDFLARE_ACCOUNT_ID` jest poprawny

## 🔄 Następne kroki

1. **Produkcja**: Dodaj zmienne do Cloudflare Pages Environment Variables
2. **Monitoring**: Skonfiguruj alerty w Cloudflare Dashboard
3. **Optimization**: Ustaw cache policies dla często używanych zapytań
4. **Security**: Skonfiguruj rate limiting i request filtering

---

**Gotowe!** 🎉 AI Gateway jest teraz zintegrowany z MyBonzo AI Blog.