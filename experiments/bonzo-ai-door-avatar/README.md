# Bonzo AI Door Avatar 🚪🤖

Interaktywny awatar AI sprzedający drzwi PORTA, zbudowany z HeyGen Streaming Avatar API.

## 🌟 Funkcje

- **Żywy Awatar Video**: Prawdziwy awatar 3D, który się rusza i mówi
- **Rozmowa Głosowa**: Awatar odpowiada głosem po polsku
- **Baza Wiedzy PORTA**: Pełna wiedza o 5 modelach drzwi, cenach, parametrach
- **Inteligentne Odpowiedzi**: AI rozumie pytania o modele, ceny, porady

## 📂 Struktura Projektu

```
bonzo-ai-door-avatar/
├── public/
│   ├── avatar/
│   │   ├── Untitled Videoja334+mybonz.mp4      # Wideo intro awatara
│   │   └── Untitled Videoja334+mybonz-caption.srt  # Napisy
│   └── catalog.json                             # Katalog drzwi
├── src/
│   ├── components/
│   │   └── AvatarChat.tsx                       # Komponent React
│   ├── utils/
│   │   └── avatar-player.js                     # Odtwarzacz wideo z napisami
│   └── workers/
│       └── ai-avatar.ts                         # Cloudflare Worker
├── wrangler.toml                                # Konfiguracja Cloudflare
├── package.json
└── README.md
```

## 🚀 Szybki Start

### 1. Otwórz w przeglądarce

Aplikacja działa jako standalone HTML. Wystarczy otworzyć:

```bash
open experiments/bonzo-ai-door-avatar/public/index.html
```

Lub uruchom prosty serwer HTTP:

```bash
cd experiments/bonzo-ai-door-avatar/public
python -m http.server 8000
# Lub: npx http-server -p 8000
```

Następnie otwórz: **http://localhost:8000**

### 2. Konfiguracja

Edytuj `public/avatar.js`:

- `HEYGEN_API_KEY`: Twój klucz API HeyGen
- `AVATAR_ID`: ID awatara (domyślnie: `Wayne_20240711`)
- `VOICE_ID`: ID głosu (domyślnie: polski męski głos)

### 3. Integracja OpenAI (Opcjonalnie)

Zastąp prostą logikę w `getAIResponse()` prawdziwym API call do Cloudflare Workers lub bezpośrednio do OpenAI.

## 🎯 Jak Działa?

### Faza 1: Intro (Video)
- Odtwarza wideo HeyGen z napisami SRT
- Synchronizuje napisy z timecodem wideo
- Po zakończeniu wideo → przejście do Fazy 2

### Faza 2: Live Chat
- Użytkownik zadaje pytania o drzwi
- **OpenAI GPT-4o-mini** generuje odpowiedź (przez Cloudflare AI Gateway)
- **OpenAI TTS** generuje audio z odpowiedzią
- Audio odtwarzane automatycznie
- Tekst odpowiedzi wyświetlany na ekranie

## 🤖 Osobowość Bonzo

Bonzo to sprzedawca drzwi z charakterem:
- ✅ Odpowiada po polsku
- ✅ Rzeczowo i konkretnie
- ✅ Z lekkim sarkazmem i humorem
- ✅ Zna katalog drzwi i ceny

## 📋 Katalog Drzwi

Dostępne drzwi (w `public/catalog.json`):

| ID | Nazwa | Cena |
|----|-------|------|
| 1 | Drzwi 1 | 1300 PLN |
| 2 | Drzwi 2 | 1500 PLN |
| 3 | Drzwi 3 | 1700 PLN |
| 4 | Drzwi 4 | 2000 PLN |
| 5 | Drzwi 5 | 2400 PLN |

## 🔧 Technologie

- **React** - komponent UI
- **TypeScript** - type safety
- **Cloudflare Workers** - backend
- **Cloudflare AI Gateway** - proxy dla OpenAI API
- **OpenAI GPT-4o-mini** - chatbot
- **OpenAI TTS** - synteza mowy
- **HeyGen** - wideo awatara
- **SRT** - napisy

## 📝 Notatki

- Model TTS OpenAI: `gpt-4o-mini-tts` (głos: `oak`)
- Wideo odtwarzane automatycznie po załadowaniu
- Audio generowane on-demand dla każdej odpowiedzi
- Caching przez Cloudflare AI Gateway (oszczędność kosztów)

## 🎥 Następne Kroki

1. ✅ Dodaj pliki wideo i napisy do `public/avatar/`
2. ✅ Skonfiguruj zmienne środowiskowe
3. ✅ Uruchom `npm run dev`
4. ✅ Testuj interakcję z Bonzo
5. ⏳ Wdroż na Cloudflare Workers

---

**Autor**: MyBonzo AI Blog Team
**Data**: 2024-10-31
