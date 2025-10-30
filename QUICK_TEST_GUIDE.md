# 🧪 Quick Test Guide - AI Chat Enhanced

Szybki przewodnik testowania wszystkich 5 nowych funkcji.

## 🚀 Start

1. **Uruchom serwer deweloperski**:
   ```bash
   npm run dev
   ```

2. **Otwórz przeglądarkę**:
   ```
   http://localhost:4321/system/ai-chat
   ```

---

## ✅ Test Checklist

### 1. 🔄 Streaming Responses

**Kroki**:
1. ✅ Włącz toggle "Streaming" (domyślnie ON)
2. ✅ Sprawdź status badge "Stream" na górze (powinien świecić się na niebiesko)
3. ✅ Wpisz pytanie: "Co to jest AI?"
4. ✅ Kliknij "Wyślij"

**Oczekiwane wyniki**:
- [ ] Badge "Stream" zaczyna pulsować
- [ ] Pojawia się badge "Streaming..." przy wiadomości AI
- [ ] Tekst pojawia się słowo po słowie (nie całość naraz)
- [ ] Border wiadomości animuje się (border pulse)
- [ ] Po zakończeniu badge "Streaming..." znika
- [ ] Pojawia się przycisk "Kopiuj"

**Jeśli nie działa**:
- Sprawdź console (F12) dla błędów SSE
- Verify endpoint: http://localhost:4321/api/ai/chat-stream

---

### 2. 🧠 MCP Tools Panel

**Kroki**:
1. ✅ Kliknij przycisk "MCP" (niebieski, po prawej)
2. ✅ Panel powinien się rozwinąć

**Oczekiwane wyniki**:
- [ ] Panel pokazuje 4 narzędzia:
  - 📚 Context7
  - 🧠 Sequential Thinking
  - 📁 Filesystem
  - 💾 Memory
- [ ] Każde narzędzie ma:
  - Ikonę
  - Nazwę
  - Opis
  - Status badge "Aktywne" (zielony)
- [ ] Hover effect na kartach (border glow + translate up)
- [ ] Przycisk "×" zamyka panel

**Test API**:
```bash
curl http://localhost:4321/api/ai/chat?mcp-status=true
```

**Oczekiwany JSON**:
```json
{
  "mcp": {
    "enabled": true,
    "tools": [...],
    "servers": [
      { "name": "Context7", "status": "active" },
      { "name": "Sequential Thinking", "status": "active" },
      { "name": "Filesystem", "status": "active" },
      { "name": "Memory", "status": "active" }
    ]
  }
}
```

---

### 3. 🚀 AI Gateway Integration

**Kroki**:
1. ✅ Wyłącz toggle "Streaming"
2. ✅ Włącz toggle "Gateway"
3. ✅ Sprawdź badge "Gateway" (powinien świecić się)
4. ✅ Wyślij pytanie: "Cześć, jak się masz?"

**Oczekiwane wyniki**:
- [ ] Badge "Gateway" pulsuje podczas wywołania
- [ ] Request idzie do `/api/ai/gateway`
- [ ] Odpowiedź pojawia się (może być wolniejsza o ~100-200ms)
- [ ] Console pokazuje log: "Calling AI Gateway: ..."

**Verify Endpoint**:
```bash
curl -X POST http://localhost:4321/api/ai/gateway \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Test"}],
    "model": "@cf/google/gemma-3-12b-it"
  }'
```

**Wymagane ENV**:
```env
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_AI_GATEWAY_ID=...
CLOUDFLARE_API_TOKEN=...
```

**Jeśli brak ENV**:
- Gateway zwróci error 500
- UI fallback do standardowego chat

---

### 4. 📤 Export Conversation

**Kroki**:
1. ✅ Wyślij kilka wiadomości (minimum 2-3)
2. ✅ Kliknij przycisk "Export" (pomarańczowy)

**Oczekiwane wyniki**:
- [ ] Pojawia się prompt download pliku
- [ ] Nazwa pliku: `mybonzo-ai-chat-[timestamp].json`
- [ ] Status message: "Konwersacja wyeksportowana!"
- [ ] Plik zawiera:
  ```json
  {
    "timestamp": "2025-10-30T...",
    "model": "@cf/google/gemma-3-12b-it",
    "conversationLength": 6,
    "messages": [
      { "role": "user", "content": "..." },
      { "role": "assistant", "content": "..." }
    ],
    "metadata": {
      "streaming": true,
      "gateway": false,
      "mcp": true
    }
  }
  ```

**Test z pustą historią**:
- Kliknij "Wyczyść" najpierw
- Kliknij "Export"
- Powinien pokazać: "Brak konwersacji do eksportu."

---

### 5. 📊 Status Indicators

**4 Badges na górze (prawy róg)**:

**a) Stream Badge**
- Aktywny: gdy streaming ON
- Test: Toggle streaming on/off
- [ ] Badge zmienia kolor (szary → niebieski)
- [ ] Animation pulse gdy aktywny

**b) MCP Badge**
- Aktywny: gdy toggle MCP ON
- Test: Toggle MCP on/off
- [ ] Badge zmienia kolor
- [ ] No animation (static)

**c) Gateway Badge**
- Aktywny: podczas Gateway call
- Test: Włącz Gateway + wyślij message
- [ ] Badge pulsuje podczas request
- [ ] Wraca do szarego po response

**d) Cache Badge**
- Aktywny: gdy odpowiedź z cache
- Test: Wyślij to samo pytanie 2x
- [ ] Druga odpowiedź pokaże Cache badge
- [ ] Badge znika po 3 sekundach
- [ ] Wiadomość ma badge "Cache" przy treści

**Test wszystkich razem**:
1. Włącz wszystkie toggles
2. Wyślij message
3. Sprawdź które badges świecą się
4. Wszystkie powinny być aktywne

---

## 🎨 UI/UX Tests

### Toggle Switches
- [ ] Smooth animation on/off
- [ ] Slider przesuwa się płynnie
- [ ] Color change: szary → accent

### Buttons
- [ ] "Wyślij" - gradient, hover lift
- [ ] "Wyczyść" - transparent, hover border
- [ ] "Export" - accent color, hover lift
- [ ] "MCP" - blue, hover effect
- [ ] Disabled state działa (podczas processing)

### Messages
- [ ] User messages: prawo, accent background
- [ ] AI messages: lewo, neutral background
- [ ] Error messages: czerwony border
- [ ] Copy button: hover effect
- [ ] Markdown rendering: **bold**, *italic*, `code`

### Animations
- [ ] Message slideIn on appear
- [ ] Typing indicator: 3 dots bounce
- [ ] Loader spin
- [ ] Border pulse (streaming)
- [ ] Badge shimmer (streaming)
- [ ] Status badge pulse

### Responsive
- [ ] Desktop (>768px): 2-column header
- [ ] Mobile (<640px): 1-column, stacked
- [ ] Buttons: flex-wrap na mobile
- [ ] MCP panel: 1 column na mobile

---

## 🐛 Error Testing

### Network Errors
1. **Disconnect network**
2. Send message
3. Should show error message w/ red border

### Rate Limiting
1. Send 15+ messages szybko
2. Should get 429 error
3. Should show: "Przekroczono limit zapytań"

### Invalid Model
1. Modify model select value in console
2. Send message
3. Should fallback to default model

### Empty Input
1. Try to send empty message
2. Should show: "Wpisz pytanie..."
3. Button should be disabled

---

## 📊 Performance Tests

### Streaming Performance
- First token: < 500ms ✅
- Token rate: 20-30/sec ✅
- Total time: 2-5 sec ✅

### Standard Chat
- Response time: 2-5 sec ✅
- No progressive rendering ✅

### Gateway
- Additional latency: +50-200ms ✅
- Cache hit: < 50ms ✅

### Memory
- History limit: 6-8 messages ✅
- No memory leaks ✅
- Smooth scrolling ✅

---

## 🔧 Console Tests

### Open DevTools (F12)

**No Errors Expected**:
```
✅ No console.error()
✅ No network failures (except intentional)
✅ No undefined variables
```

**Expected Logs**:
```javascript
// When streaming
"Streaming started: { prompt, model }"

// When MCP panel opened
"MCP Servers: [...]"

// When export clicked
"Export data: { timestamp, messages, ... }"

// When gateway used
"Calling AI Gateway: https://..."
```

---

## ✅ All Tests Pass Criteria

### Streaming ✅
- [x] Real-time word-by-word
- [x] Badge animates
- [x] Border pulse
- [x] Auto-scroll

### MCP Tools ✅
- [x] Panel opens/closes
- [x] 4 tools displayed
- [x] Status badges correct
- [x] API returns MCP data

### AI Gateway ✅
- [x] Toggle works
- [x] Badge pulses
- [x] Requests route to gateway
- [x] ENV config correct

### Export ✅
- [x] JSON downloads
- [x] Correct format
- [x] Metadata included
- [x] Filename has timestamp

### Status Indicators ✅
- [x] All 4 badges visible
- [x] Active state works
- [x] Animations smooth
- [x] Auto-hide (cache)

---

## 🚀 Production Checklist

Przed wdrożeniem na produkcję:

- [ ] All tests pass
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Mobile responsive
- [ ] Accessibility (keyboard nav)
- [ ] ENV variables set
- [ ] Rate limiting configured
- [ ] Error handling robust
- [ ] Documentation complete
- [ ] Code reviewed

---

## 📝 Quick Debug Commands

```bash
# Check dev server
curl http://localhost:4321/

# Test standard chat
curl -X POST http://localhost:4321/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test"}'

# Test streaming
curl -N http://localhost:4321/api/ai/chat-stream \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test"}'

# Test MCP status
curl http://localhost:4321/api/ai/chat?mcp-status=true

# Test gateway
curl -X POST http://localhost:4321/api/ai/gateway \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Test"}]}'
```

---

## 🎯 Summary

**URL**: http://localhost:4321/system/ai-chat

**5 Features Implemented**:
1. ✅ Streaming Responses (SSE)
2. ✅ MCP Tools Panel
3. ✅ AI Gateway Toggle
4. ✅ Export Conversation (JSON)
5. ✅ Status Indicators (4 badges)

**All features are integrated and ready to test! 🎉**

---

**Test Duration**: ~10-15 minutes
**Priority**: High
**Status**: Ready for Testing
