
# 🚀 Instrukcja Wdrożenia AI Agenta i Przewodnika Meble Pumo

Wygenerowaliśmy potężną bazę wiedzy (63 kategorie) i stworzyliśmy Agenta AI opartego o DeepSeek R1. Teraz musisz to zdeployować ze swojego VSCode.

## 1. Struktura Plików (Już gotowa)
Twoje repozytorium `mybonzoAIblog` zostało wzbogacone o:
- `src/pages/pumo-guide/*.md` - 63 pliki z contentem (SEO).
- `src/pages/pumo-guide/index.astro` - Strona główna przewodnika.
- `src/pages/pumo-guide/agent.astro` - Interfejs czatu z AI.
- `workers/pumo-ai-agent.js` - Backend workera AI.

## 2. Konfiguracja `wrangler.toml` (Cloudflare)
Otwórz plik `wrangler.toml` w swoim VSCode i upewnij się, że masz sekcję `workers` lub `routes` obsługującą API.

Dopisz/Zaktualizuj w `wrangler.toml`:
```toml
[[workers]]
name = "pumo-ai-handler"
script = "workers/pumo-ai-agent.js"
# Ustawienie routingu, aby adres /api/pumo-chat kierował do workera:
routes = [
  { pattern = "*mybonzoaiblog.pages.dev/api/pumo-chat", script = "pumo-ai-handler" },
  { pattern = "*mybonzoaiblog.com/api/pumo-chat", script = "pumo-ai-handler" }
]

[vars]
# Tu wpisz klucz (możesz też dodać go bezpiecznie przez 'wrangler secret put DEEPSEEK_API_KEY')
# DEEPSEEK_API_KEY = "sk-bfff..." (lepiej użyć secrets)
```

## 3. Dodawanie Sekretu (Klucz API)
W terminalu VSCode uruchom:
```bash
npx wrangler secret put DEEPSEEK_API_KEY
```
Gdy zapyta o wartość, wklej klucz DeepSeek:
`sk-bfff2d5518cf40b3a4924968bdce43c5`

## 4. Instalacja Zależności (jeśli potrzebne)
```bash
npm install
```

## 5. Deployment
Aby wrzucić całość (Strony + Worker) na produkcję:

```bash
# Zbuduj bloga (Astro)
npm run build

# Deploy Pages (może wymagać zalogowania: npx wrangler login)
npx wrangler pages deploy dist
```

## 6. Deployment Workera (Backend)
Jeśli worker jest osobny (zależnie od konfiguracji Astro adaptera):
```bash
npx wrangler deploy workers/pumo-ai-agent.js --name pumo-ai-handler
```

## Linki po wdrożeniu:
- **Przewodnik (SEO):** https://mybonzoaiblog.com/pumo-guide/
- **Agent AI:** https://mybonzoaiblog.com/pumo-guide/agent/
