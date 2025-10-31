# Bonzo AI Avatar - Sprzedawca Drzwi

Interaktywny awatar AI sprzedający drzwi, wykorzystujący:
- **HeyGen** - wideo awatara z napisami SRT
- **OpenAI GPT-4o-mini** - chatbot z osobowością Bonzo
- **OpenAI TTS** - synteza mowy
- **Cloudflare AI Gateway** - caching i analytics

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

## 🚀 Instrukcja Uruchomienia

### 1. Przygotowanie Plików Wideo

**WAŻNE**: Musisz dodać pliki wideo do folderu `public/avatar/`:
- `Untitled Videoja334+mybonz.mp4` - wideo intro awatara (z HeyGen)
- `Untitled Videoja334+mybonz-caption.srt` - napisy do wideo

### 2. Instalacja Zależności

```bash
cd experiments/bonzo-ai-door-avatar
npm install
```

### 3. Konfiguracja Zmiennych Środowiskowych

Ustaw zmienne środowiskowe:

```bash
# Windows PowerShell
$env:CLOUDFLARE_ACCOUNT_ID="your-account-id"
$env:OPENAI_API_KEY="your-openai-api-key"

# Linux/Mac
export CLOUDFLARE_ACCOUNT_ID="your-account-id"
export OPENAI_API_KEY="your-openai-api-key"
```

Lub utwórz plik `.dev.vars`:

```bash
CLOUDFLARE_ACCOUNT_ID=your-account-id
OPENAI_API_KEY=your-openai-api-key
```

### 4. Uruchomienie Lokalnie

```bash
npm run dev
```

Aplikacja będzie dostępna na: `http://localhost:8787`

### 5. Wdrożenie na Cloudflare

```bash
wrangler deploy
```

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
