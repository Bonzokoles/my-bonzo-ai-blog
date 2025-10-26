# Astro Alkaline Code Generator Workflows

## Prompt 1: Kompletna Strona Główna z Wideo i Nawigacją

```
Generuj kompletny, zgodny z szablonem Alkaline kod Astro dla strony z importami: Layout, Heading, Link, BackgroundPattern (jako pierwsze dziecko Layout).

Twórz stronę główną zawierającą hero z wideo z Cloudflare R2, polskie napisy i opisy, cztery przyciski linkujące do osobnych podstron: AI Tools, Eksperymenty, Poradniki, System w osobnych folderach, oraz przycisk do strony MyBonzo Pro.

Używaj komponentów Link wszędzie zamiast zwykłych <a>.
Włącz BackgroundPattern dla tła, responsywność i ARIA dla dostępności.

Korzystaj z narzędzi MCP, w szczególności MCP Astro i MCP Docfork do analizy poprawności kodu, podpowiadania najnowszych rozwiązań i wspierania spójności z najlepszymi praktykami Astro.

Wykrywaj i raportuj błędy, proponuj poprawki lub optymalizacje, zwracaj uwagę na wydajność i bezpieczeństwo.

Kod powinien być zgodny z typami TypeScript i wykorzystaniem Tailwind CSS zgodnie z Alkaline.
Zachowuj logikę i strukturę Alkaline, nie dziel sekcji w niepotrzebny sposób, twórz funkcjonalny i estetyczny frontend.

Daj propozycję pliku alkaline.config.ts z polskim menu i favicon dopasowanym do projektu.
```

## Prompt 2: Uniwersalny Generator Komponentów i Stron

```
Proszę wygeneruj kompletny i poprawny kod strony lub komponentu Astro, przestrzegając najlepszych praktyk.

Importuj i używaj Layout, komponentów kontentowych (Heading, Link), a także BackgroundPattern dla tła jeśli jest dostępny.

Zadbaj o semantyczną strukturę HTML, dostępność (ARIA), responsywność i zgodność z TailwindCSS zgodnie z projektem.

Do linków i nawigacji używaj komponentu Link, a do nagłówków komponentu Heading z odpowiednim poziomem.

Odtwarzaj wideo lub grafiki z linków zewnętrznych (np. Cloudflare R2).

Podczas generowania kodu korzystaj z narzędzi MCP Astro i MCP Docfork do analizowania i walidacji kodu pod kątem standardów Astro:

- sprawdzaj poprawność składni i struktur
- proponuj wizualne/logiczne optymalizacje  
- podpowiadaj kompatybilność z ostatnimi wersjami Astro
- kontroluj czy jest spójność stylów z Tailwind CSS

Upewnij się, że tworzony projekt ma modularną strukturę, rozbicie na pojedyncze strony i podstrony w odrębnych folderach dla łatwej rozbudowy.

W razie błędów lub braków w kodzie, auto-generuj sugestie poprawek i możliwe rozwiązania bazując na MCP.

Zachowuj zgodność z TypeScript i projektową konfiguracją Astro.
```

---

## Konfiguracja Projektu MyBonzo AI Blog

### Struktura Folderów
```
src/
├── pages/
│   ├── index.astro              # Strona główna z hero video
│   ├── ai-tools/
│   │   └── index.astro          # Narzędzia AI
│   ├── eksperymenty/
│   │   └── index.astro          # Eksperymenty
│   ├── poradniki/
│   │   └── index.astro          # Poradniki
│   ├── system/
│   │   └── index.astro          # System
│   └── pro/
│       └── index.astro          # MyBonzo Pro
```

### Komponenty Alkaline do Wykorzystania
- `Layout` - główny layout strony
- `Heading` - nagłówki semantyczne (h1-h6)
- `Link` - linki z routing i stylami
- `BackgroundPattern` - animowane tło
- `Card` - karty z treścią
- `PageHeader` - nagłówek strony
- `Tags` - tagi i kategorie

### Cloudflare R2 Assets
- **Wideo pionowe**: `https://pub-816ebc2d89b24e968b5c31251d025897.r2.dev/mybonzo-avatar-welcome.mp4`
- **Wideo poziome**: `https://pub-816ebc2d89b24e968b5c31251d025897.r2.dev/mybonzo123.mp4`

### MCP Tools Integration
1. **MCP Astro** - walidacja składni i struktury Astro
2. **MCP Docfork** - sprawdzanie najlepszych praktyk i dokumentacji
3. **MCP Context7** - pobieranie aktualnej dokumentacji bibliotek

### TypeScript i Tailwind
- Użyj `alkaline.config.ts` dla konfiguracji
- Tailwind klasy zgodne z motywem Alkaline
- TypeScript strict mode włączony
- Props interfaces dla wszystkich komponentów

### Accessibility Guidelines
- Semantyczne HTML5 tagi
- ARIA labels dla interaktywnych elementów
- Alt teksty dla obrazów i wideo
- Keyboard navigation support
- Screen reader friendly

### Performance Optimizations
- Lazy loading dla wideo i obrazów
- Preload krytycznych zasobów
- Minimalizacja CSS/JS
- Image optimization (WebP, AVIF)
- CDN dla statycznych zasobów

---

## Użycie w VS Code

1. **Kopiuj odpowiedni prompt** z tego pliku
2. **Wklej w GitHub Copilot Chat** lub AI assistant
3. **Dodaj szczegóły** dotyczące konkretnej strony/komponentu
4. **Uruchom MCP tools** dla walidacji:
   - `mcp_astro-docs_search_astro_docs` 
   - `mcp_docfork_docfork_search_docs`
5. **Testuj i optymalizuj** wygenerowany kod

### Przykład Użycia
```
[Prompt 2] + "Utwórz stronę AI Tools z listą narzędzi AI, każde jako Card z opisem, linkiem i tagami. Użyj PageHeader z tytułem 'Narzędzia AI' i BackgroundPattern."
```