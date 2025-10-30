# 🚀 Enhanced AI Chat - Dokumentacja

## Przegląd

Ulepszona wersja komponentu AI Chat z zaawansowanymi funkcjami:

### ✨ Nowe funkcje

#### 1. **Persistence & History Management**
- ✅ Automatyczne zapisywanie konwersacji w localStorage
- ✅ Historia wszystkich konwersacji z wyszukiwaniem
- ✅ Przywracanie poprzednich rozmów
- ✅ Zarządzanie wieloma konwersacjami jednocześnie

#### 2. **Conversation Export**
- ✅ Export do JSON (pełne dane strukturalne)
- ✅ Export do TXT (czytelny format tekstowy)
- ✅ Export do Markdown (z formatowaniem)
- ✅ Export do HTML (gotowy do udostępnienia)
- ✅ Masowy export wszystkich konwersacji

#### 3. **Streaming Responses**
- ✅ Real-time streaming odpowiedzi AI
- ✅ Progressive rendering (słowo po słowie)
- ✅ Server-Sent Events (SSE) endpoint
- ✅ Opcjonalne włączanie/wyłączanie streamingu

#### 4. **UI Enhancements**
- ✅ Sidebar z historią konwersacji
- ✅ Wyszukiwanie w konwersacjach
- ✅ Bookmarking ulubionych konwersacji
- ✅ Responsive design (mobile-first)
- ✅ Moderne animacje i transitions

#### 5. **Developer Experience**
- ✅ TypeScript support z pełnymi typami
- ✅ Modular architecture
- ✅ Clean separation of concerns
- ✅ Extensible configuration

---

## 📦 Instalacja

### Plik komponentu
```
src/components/Astro/AIChat.Enhanced.astro
```

### API Endpoint (Streaming)
```
src/pages/api/ai/chat-stream.ts
```

---

## 🎯 Użycie

### Podstawowe użycie

```astro
---
import AIChat from '@components/Astro/AIChat.Enhanced.astro';
---

<AIChat />
```

### Z custom opcjami

```astro
<AIChat
  placeholder="Zadaj pytanie..."
  maxLength={1000}
  defaultModel="@cf/google/gemma-3-12b-it"
  enablePersistence={true}
  enableHistorySidebar={true}
  enableStreaming={true}
/>
```

### Parametry Props

| Prop | Type | Default | Opis |
|------|------|---------|------|
| `placeholder` | `string` | "Zadaj pytanie..." | Placeholder w textarea |
| `maxLength` | `number` | `800` | Maksymalna długość wiadomości |
| `defaultModel` | `string` | `@cf/google/gemma-3-12b-it` | Domyślny model AI |
| `enablePersistence` | `boolean` | `true` | Zapisywanie konwersacji |
| `enableHistorySidebar` | `boolean` | `true` | Sidebar z historią |
| `enableStreaming` | `boolean` | `true` | Streaming odpowiedzi |

---

## 🔧 Konfiguracja

### localStorage Keys

Komponent używa następujących kluczy localStorage:

```typescript
{
  'mybonzo-ai-conversations': Conversation[], // Wszystkie konwersacje
  'mybonzo-ai-current-conversation': string,  // ID aktywnej konwersacji
  'mybonzo-ai-sidebar-state': 'open' | 'closed' // Stan sidebaru
}
```

### Struktura Conversation

```typescript
interface Conversation {
  id: string;                  // Unikalny ID (conv-${timestamp})
  title: string;               // Tytuł (pierwsze 50 znaków pierwszej wiadomości)
  messages: ChatMessage[];     // Wszystkie wiadomości
  model: string;               // Używany model AI
  createdAt: number;           // Timestamp utworzenia
  updatedAt: number;           // Timestamp ostatniej aktualizacji
  bookmarked: boolean;         // Czy oznaczone jako ulubione
}
```

### Struktura ChatMessage

```typescript
interface ChatMessage {
  role: 'user' | 'ai';         // Rola nadawcy
  content: string;             // Treść wiadomości
  cached?: boolean;            // Czy z cache
  error?: boolean;             // Czy błąd
  timestamp?: number;          // Timestamp wiadomości
  bookmarked?: boolean;        // Czy bookmarked (future)
}
```

---

## 📡 API Endpoints

### 1. POST `/api/ai/chat` (Standard)

**Request:**
```json
{
  "prompt": "Jakie są trendy w AI?",
  "history": [
    { "role": "user", "content": "Cześć" },
    { "role": "assistant", "content": "Witaj!" }
  ],
  "model": "@cf/google/gemma-3-12b-it",
  "temperature": 0.6,
  "max_tokens": 1200
}
```

**Response:**
```json
{
  "success": true,
  "response": "W 2025 roku główne trendy w AI to...",
  "model": "@cf/google/gemma-3-12b-it",
  "cached": false
}
```

### 2. POST `/api/ai/chat-stream` (Streaming)

**Request:** (identyczny jak wyżej)

**Response:** Server-Sent Events (SSE)
```
data: {"chunk": "W ", "accumulated": "W "}

data: {"chunk": "2025 ", "accumulated": "W 2025 "}

data: {"chunk": "roku ", "accumulated": "W 2025 roku "}

...

data: {"done": true, "fullText": "W 2025 roku główne trendy..."}
```

### Rate Limiting

Oba endpointy stosują rate limiting:

- **Standard endpoint:** 10 zapytań / 60 sekund
- **Streaming endpoint:** 15 zapytań / 60 sekund

Kod odpowiedzi przy przekroczeniu limitu:
```json
{
  "success": false,
  "error": "Przekroczono limit zapytań. Spróbuj ponownie za chwilę."
}
```
Status: `429 Too Many Requests`
Header: `Retry-After: 60`

---

## 🎨 Styling & Theming

### CSS Variables

Komponent używa następujących zmiennych CSS:

```css
--color-accent       /* Kolor akcentu (niebieski) */
--color-accent-alt   /* Alternatywny kolor akcentu */
--color-background   /* Tło kontenerów */
--color-text         /* Kolor tekstu */
```

### Customizacja stylów

Aby dostosować wygląd, zmodyfikuj zmienne w `<style>`:

```astro
<style>
  .ai-chat-shell {
    --color-accent: #3b82f6;
    --color-accent-alt: #8b5cf6;
    --color-background: #1e1e2e;
    --color-text: #f5f5f5;
  }
</style>
```

---

## 📱 Responsive Design

### Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Mobile | < 768px | Sidebar jako overlay |
| Tablet | 768px - 1024px | Sidebar collapsible |
| Desktop | > 1024px | Sidebar zawsze widoczny |

### Mobile optimizations

- Touch-friendly buttons (min 44x44px)
- Swipe gestures dla sidebaru
- Auto-hide keyboard po wysłaniu wiadomości
- Optimized scroll behavior

---

## 🔐 Security & Privacy

### Data Storage

- **Lokalne przechowywanie:** Wszystkie dane są zapisywane tylko w localStorage przeglądarki użytkownika
- **Brak cloud sync:** Konwersacje nie są wysyłane na serwer (poza API call do AI)
- **User control:** Użytkownik może w każdej chwili wyczyścić dane

### Export Safety

- Wszystkie formaty exportu są bezpieczne (sanitized HTML)
- Brak wykonania JavaScript w eksportowanych plikach
- Escape HTML entities w treści wiadomości

### Rate Limiting

- IP-based rate limiting zapobiega abuse
- Graceful degradation przy błędach
- Clear error messages dla użytkownika

---

## 🚀 Performance

### Optimizations

1. **localStorage caching:** Instant load poprzednich konwersacji
2. **Lazy rendering:** Wiadomości renderowane on-demand
3. **Virtual scrolling:** (future) dla bardzo długich konwersacji
4. **Debounced search:** Wyszukiwanie z 300ms debounce
5. **Progressive enhancement:** Działa bez JavaScript (basic form)

### Bundle Size

- **Component:** ~25KB (minified)
- **Streaming endpoint:** ~8KB (minified)
- **Total impact:** ~33KB dodatkowego kodu

### Network

- **Standard mode:** 1 request per message
- **Streaming mode:** 1 long-lived connection per message
- **Cache hit:** 0 API calls (localStorage only)

---

## 🧪 Testing

### Manual Testing Checklist

#### Podstawowa funkcjonalność
- [ ] Wysyłanie wiadomości
- [ ] Otrzymywanie odpowiedzi AI
- [ ] Zmiana modelu mid-conversation
- [ ] Czyszczenie konwersacji
- [ ] Tworzenie nowej konwersacji

#### Persistence
- [ ] Zapisywanie konwersacji przy refresh
- [ ] Przywracanie ostatniej konwersacji
- [ ] Wyszukiwanie w historii
- [ ] Usuwanie konwersacji

#### Export
- [ ] Export do JSON
- [ ] Export do TXT
- [ ] Export do Markdown
- [ ] Export do HTML
- [ ] Masowy export wszystkich

#### Streaming
- [ ] Toggle streaming on/off
- [ ] Progressive rendering
- [ ] Error handling podczas streamingu
- [ ] Fallback do standard mode

#### UI/UX
- [ ] Sidebar toggle
- [ ] Bookmark conversation
- [ ] Search conversations
- [ ] Responsive na mobile
- [ ] Accessibility (keyboard navigation)

---

## 📊 Analytics & Monitoring

### Metrics to track

1. **Usage Metrics**
   - Liczba utworzonych konwersacji
   - Średnia długość konwersacji (messages)
   - Najczęściej używane modele
   - Streaming vs standard mode ratio

2. **Performance Metrics**
   - Response time (API)
   - Streaming latency
   - localStorage size
   - Cache hit rate

3. **Error Metrics**
   - Rate limit hits
   - API failures
   - Streaming disconnections
   - Export failures

### Implementacja

```typescript
// Example: Track conversation created
function trackEvent(event: string, data: Record<string, any>) {
  if (typeof gtag !== 'undefined') {
    gtag('event', event, data);
  }
}

// Usage
trackEvent('conversation_created', {
  model: currentConversation.model,
  hasHistory: currentConversation.messages.length > 0
});
```

---

## 🔮 Future Enhancements

### Planned Features

1. **Advanced Search**
   - Full-text search w treści wiadomości
   - Filtry (date range, model, bookmarks)
   - Search highlighting

2. **Conversation Sharing**
   - Generowanie unique URL dla konwersacji
   - Public/private mode
   - Embedding w innych stronach

3. **AI Enhancements**
   - Multi-modal support (images, documents)
   - Voice input/output
   - Real-time collaboration

4. **Cloud Sync**
   - Optional account system
   - Cross-device sync
   - Backup & restore

5. **Advanced Export**
   - PDF generation z formatowaniem
   - DOCX export
   - Email integration

6. **Analytics Dashboard**
   - Usage statistics
   - Model performance comparison
   - Cost tracking (Cloudflare AI units)

---

## 🐛 Troubleshooting

### Problem: Konwersacje nie zapisują się

**Rozwiązanie:**
1. Sprawdź czy localStorage jest dostępny:
   ```javascript
   if (typeof localStorage === 'undefined') {
     console.error('localStorage nie jest dostępny');
   }
   ```
2. Sprawdź limit localStorage (usually 5-10MB)
3. Wyczyść localStorage i spróbuj ponownie

### Problem: Streaming nie działa

**Rozwiązanie:**
1. Sprawdź czy przeglądarka wspiera Server-Sent Events:
   ```javascript
   if (typeof EventSource === 'undefined') {
     // Fallback do standard mode
   }
   ```
2. Sprawdź czy endpoint `/api/ai/chat-stream` jest dostępny
3. Wyłącz ad-blockery które mogą blokować SSE

### Problem: Sidebar nie pokazuje się na mobile

**Rozwiązanie:**
1. Sprawdź CSS media queries
2. Toggle sidebar używając przycisku hamburgera
3. Sprawdź z-index conflicts

---

## 📝 Changelog

### Version 1.0.0 (2025-01-30)

**Added:**
- ✨ Conversation persistence with localStorage
- ✨ History sidebar with search
- ✨ Multi-format export (JSON, TXT, MD, HTML)
- ✨ Streaming responses via SSE
- ✨ Bookmark functionality
- ✨ Responsive mobile design
- ✨ TypeScript support
- ✨ Rate limiting protection

**Enhanced:**
- 🎨 Improved UI with glassmorphism
- 🎨 Better animations and transitions
- 🎨 Mobile-optimized layout
- ⚡ Performance optimizations
- ⚡ Progressive enhancement

**Technical:**
- 🔧 Modular architecture
- 🔧 Clean separation of concerns
- 🔧 Comprehensive error handling
- 🔧 Accessibility improvements

---

## 📄 License

MIT License - Feel free to use in your projects!

---

## 🤝 Contributing

### Guidelines

1. Zachowaj TypeScript strict mode
2. Dodaj testy dla nowych funkcji
3. Aktualizuj dokumentację
4. Przestrzegaj konwencji nazewnictwa
5. Używaj semantic commit messages

### Development Setup

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Type check
npx astro check
```

---

## 📞 Support

**Issues:** [GitHub Issues](https://github.com/yourusername/mybonzoaiblog/issues)
**Email:** support@mybonzoaiblog.com
**Documentation:** https://docs.mybonzoaiblog.com

---

## 🙏 Acknowledgments

- **Cloudflare Workers AI** - AI model infrastructure
- **Astro Framework** - Static site generation
- **Google Fonts** - Typography
- **Tailwind CSS** - Utility-first CSS

---

**Last Updated:** 2025-01-30
**Version:** 1.0.0
**Author:** MyBonzo AI Team
