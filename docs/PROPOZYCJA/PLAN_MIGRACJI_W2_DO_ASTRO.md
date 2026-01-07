# Plan Migracji w2.HTML do Astro

**Data**: 7 stycznia 2026  
**Cel**: Integracja ultra-scifi theme z w2.HTML do istniejącego systemu Astro  
**Podejście**: Inkrementalne, bez rewolucji, z zachowaniem SSR/SSG  
**Status**: Plan strategiczny

---

## 📋 Spis Treści

0. [Zasada Przewodnia: SSR/SSG vs CSR](#0-zasada-przewodnia-ssrssg-vs-csr)
1. [Docelowa Struktura Plików](#1-docelowa-struktura-plików)
2. [Migracja w2.HTML do Astro](#2-migracja-w2html-do-astro)
3. [Prawa Kolumna: Sticky Scroll](#3-prawa-kolumna-sticky-scroll)
4. [Subtelne 3D "Strony"](#4-subtelne-3d-strony)
5. [Wpięcie pod Istniejący System](#5-wpięcie-pod-istniejący-system)
6. [Fazy Wdrożenia](#6-fazy-wdrożenia)
7. [Co Biorę z w2.HTML jako "Kanon"](#7-co-biorę-z-w2html-jako-kanon)

---

## 0) Zasada Przewodnia: SSR/SSG vs CSR

### ✅ SSG/SSR (Astro build) ZOSTAJE dla:

**Layout i nawigacja:**
- Layouty (`src/layouts/`)
- Strony: `/`, `/blog`, `/blog/[slug]`, `/blog/tags/[tag]`
- Komponenty strukturalne (Topbar, Footer, Sidebar)

*Źródło: OBECNY_STAN_SYSTEMU - "Static Site Generation (SSG)"*

**Content:**
- Posty z `src/content/blog/*.mdx` 
- Content Collections jako prawda źródłowa

*Źródło: OBECNY_STAN_SYSTEMU - "Content Management"*

### ⚡ CSR (Client-Side Rendering) DOKŁADAMY tylko tam, gdzie ma sens:

**Interaktywność:**
- Wyszukiwarka w topbarze (już istnieje)
- Ewentualne "live" boxy w sidebarze (projekty/metryki)
- Pobieranie z API routes (kontrolowane feature flagami)

*Źródło: OBECNY_STAN_SYSTEMU - "API Endpoints", "Feature Control System"*

### 🎯 Filozofia: NIE robimy SPA, tylko "cywilizowane wyspy interaktywności"

---

## 1) Docelowa Struktura Plików

### Minimalna, ale czysta struktura:

```
src/
├── styles/
│   ├── ultra-scifi.css              # Całe <style> z w2.HTML (tokenowy CSS na :root)
│   └── ultra-scifi-3d.css           # (opcjonalnie) 3D + sticky-scroll sidebar
│
├── layouts/
│   ├── Layout.astro                 # Istniejący (nie ruszamy)
│   └── UltraScifiLayout.astro       # NOWY - owija strony, ładuje CSS, ClientRouter
│
├── components/
│   ├── Topbar.astro                 # Brand + nav + search + theme button
│   ├── Sidebar.astro                # PROJEKTY/LAB/PRO (z w2.HTML)
│   ├── PostCard.astro               # Karta posta
│   └── client/
│       └── SearchFilter.ts          # (opcjonalnie) JS z inline
│
├── pages/
│   ├── index.astro                  # Landing (featured + trends + grid)
│   ├── blog/
│   │   ├── index.astro              # Listing, paginacja
│   │   ├── [slug].astro             # Pojedynczy post
│   │   └── tags/
│   │       └── [tag].astro          # Listing po tagu
│   └── api/
│       └── blog/
│           └── posts.ts             # GET /api/blog/posts (już istnieje!)
│
└── content/
    └── blog/
        └── *.mdx                     # Prawda źródłowa (nie zmieniamy)
```

*Źródło: OBECNY_STAN_SYSTEMU - "Struktura Projektu"*

### Komentarz do API:

**Masz już:**
```
GET /api/blog/posts
- Paginacja: ?page=1&limit=10
- Filtr: ?tag=ai
- Feature flags: 'blog-api' (enabled, public)
```

*Źródło: OBECNY_STAN_SYSTEMU - "API Endpoints" → "Blog Posts API"*

To jest **idealny backend pod CSR** listy, jeśli zechcesz (ale nie musisz). A dodatkowo **spięte z feature flags**.

---

## 2) Migracja w2.HTML do Astro

### Krok 1 — CSS: Wyciągnij z HTML do `ultra-scifi.css`

**W w2.HTML masz:**
- Kompletny zestaw zmiennych CSS (`--bg`, `--ai-cyan`, `--ai-magenta`, itd.)
- Komponentowe klasy: `.topbar`, `.panel`, `.grid`, `.post`, `.tag`
- Zero `border-radius` - konsekwentny "konsolowy" styl

*Źródło: w2.HTML - `:root {}` i klasy komponentowe*

**Decyzja:**
- Nie mapuj na Tailwind na siłę
- W2.HTML jest **tokenowy i czytelny**
- Tailwind został (dla typography, utilities), ale theme = CSS custom properties

### Krok 2 — Layout: Przenieś stałe elementy

**Z w2.HTML do komponentów Astro:**

```
<header class="topbar">...</header>     → Topbar.astro
<main class="wrap">                     → Layout w index.astro, blog/index.astro
  <section class="panel">...</section>  → Komponenty
<footer>...</footer>                    → Layout / komponent
```

*Źródło: w2.HTML - struktura HTML*

### Krok 3 — JS: Zostaw minimalny, ale "Astro-friendly"

**W w2.HTML masz:**
- Ustawianie daty (JS)
- Theme persistence (localStorage)
- Search filter (client-side)

*Źródło: w2.HTML - `<script>` tags*

**W Astro:**

```astro
---
// Datę i rok SSR/SSG:
const currentYear = new Date().getFullYear();
---

<footer>
  <p>&copy; {currentYear} MyBonzo AI Blog</p>
</footer>

<script is:inline>
  // Theme + search zostają jako JS (CSR)
  // Ale odporne na brak elementów (żeby nie wybuchło na innych stronach)
</script>
```

---

## 3) Prawa Kolumna: Sticky Scroll

### Założenia:

- **Sticky tylko na desktop**
- **Na mobile**: normalny flow
- **max-height**: liczone od wysokości topbara (topbar jest sticky)

*Źródło: w2.HTML - `.topbar` sticky, `.side` layout*

### Implementacja CSS:

```css
/* ultra-scifi.css (lub ultra-scifi-3d.css) */

.side {
  /* Desktop */
  @media (min-width: 1024px) {
    position: sticky;
    top: 60px;                    /* Wysokość topbara */
    max-height: calc(100vh - 60px);
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--ai-cyan) var(--bg-secondary);
  }
  
  /* Mobile - normalny flow */
  @media (max-width: 1023px) {
    position: static;
  }
}

.side::-webkit-scrollbar {
  width: 6px;
}

.side::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

.side::-webkit-scrollbar-thumb {
  background: var(--ai-cyan);
  border-radius: 0; /* Konsekwentnie zero rounded */
}
```

**Efekt:** Prawa kolumna jest jak **"HUD"** - niezależny scroll, a content bloga płynie swoją drogą.

---

## 4) Subtelne 3D "Strony"

### ⚠️ Ważne założenia:

- **NIE psuj czytelności** (bardzo małe kąty)
- **Respektuj `prefers-reduced-motion`** (żeby nie męczyć ludzi)
- **NIE dodawaj ciężkich bibliotek** (Three.js itd. - na razie nie)

*Źródło: OBECNY_STAN_SYSTEMU - "Znane Ograniczenia" (brak heavy frameworks)*

### Plan 3D w 2 poziomach:

#### Poziom A (zero JS): "Głębia paneli"

```css
/* ultra-scifi-3d.css */

body {
  perspective: 1500px;
}

.panel {
  transition: transform 0.3s ease;
  transform-style: preserve-3d;
}

.panel:hover {
  transform: translateZ(10px) rotateY(1deg);
}

/* Respektuj prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .panel {
    transition: none;
  }
  
  .panel:hover {
    transform: none;
  }
}
```

#### Poziom B (mały JS, opcjonalny): Mikro-tilt całego `.wrap`

```javascript
// components/client/PageTilt.ts

export function initPageTilt() {
  // OFF dla mobile
  if (window.innerWidth < 1024) return;
  
  // OFF dla prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
  const wrap = document.querySelector('.wrap');
  if (!wrap) return;
  
  document.addEventListener('mousemove', (e) => {
    requestAnimationFrame(() => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;  // -1 do 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 do 1
      
      // Bardzo subtelne kąty
      wrap.style.transform = `rotateY(${x * 1}deg) rotateX(${-y * 1}deg)`;
    });
  });
}
```

**Efekt:** To jest dokładnie ten **"efekt 3D strony"**, ale w wersji **"engineer-approved"**, nie "PowerPoint 2007".

---

## 5) Wpięcie pod Istniejący System

### Feature Flags + API Middleware

**Masz już centralny wzorzec:**
```typescript
withFeatureMiddleware(...)
- Permission levels: public | user | admin | system
- Rate limiting automatyczny
```

*Źródło: OBECNY_STAN_SYSTEMU - "System Kontroli Funkcji", "API Middleware Layer"*

### Plan integracji:

**UI (sidebar "Live metryki"):**
- Może wołać `/api/health` (public) lub inne endpointy
- Każdy endpoint idzie przez feature middleware
- Kontrolowane feature flagami

**Blog posts API:**
- Endpoint już istnieje: `GET /api/blog/posts`
- Paginacja + filtry gotowe
- Możesz nim zasilić CSR search/listę (jeśli zechcesz)

*Źródło: OBECNY_STAN_SYSTEMU - "API Endpoints" → `/api/blog/posts`*

### View Transitions

**Już masz:**
```astro
import { ClientRouter } from "astro:transitions";
```

*Źródło: OBECNY_STAN_SYSTEMU - "View Transitions (ClientRouter)"*

**Dopasowanie do sci-fi:**
```css
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.25s;  /* Krótko */
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Efekt:** Żadnych fikołków, tylko płynne, szybkie przejścia.

---

## 6) Fazy Wdrożenia

### 📍 Cel: Dowieźć projekt, nie porzucić na 70%

### Faza 1 — "Zamiana skóry" bez zmian funkcjonalnych (NAJBEZPIECZNIEJ)

**Co robisz:**
1. Dodajesz `src/styles/ultra-scifi.css`
2. Tworzysz `src/layouts/UltraScifiLayout.astro`
3. Podmieniasz **tylko** `index.astro` i `/blog/index.astro` na nowe komponenty
4. Post pages (`/blog/[slug]`) **zostawiasz na starym layoucie** dopóki nie zrobisz typografii

**Efekt:**
- ✅ Szybko widzisz nowy vibe
- ✅ Ryzyko minimalne
- ✅ Rollback w 1 commit

**Checkpoint Git:**
```bash
git tag checkpoint-faza-1-css
```

---

### Faza 2 — Sidebar sticky-scroll + 3D

**Co robisz:**
1. Włączasz sticky-scroll `.side` (CSS)
2. Włączasz **3D level A** (bez JS - tylko hover)
3. Testujesz na desktop + mobile
4. Jak jest dobrze: opcjonalnie **JS tilt (level B)**

**Efekt:**
- ✅ "Premium" feeling bez nadwagi
- ✅ Responsive (mobile safe)

**Checkpoint Git:**
```bash
git tag checkpoint-faza-2-3d
```

---

### Faza 3 — Typografia postów i MDX

**Masz Tailwind Typography plugin:**
```json
"@tailwindcss/typography": "0.5.16"
```

*Źródło: OBECNY_STAN_SYSTEMU - "Stack Technologiczny"*

**Plan:**
1. `.prose` pod nowy theme:
   - Kolory linków (--ai-cyan)
   - Code blocks (--bg-code, monospace)
   - Cytaty (border-left: --ai-magenta)

2. Dopasowanie fontów:
   - **Sans**: Roboto (100-900)
   - **Serif**: SUSE (100-800)
   - **Mono**: Fira Code (400, 500, 700)
   - **Headers** (opcjonalnie): ThrolaconTrial (graffiti)

*Źródło: OBECNY_STAN_SYSTEMU - "Typography", "Google Fonts"*

**Przykład `.prose` customization:**
```css
.prose {
  --tw-prose-body: var(--text);
  --tw-prose-headings: var(--text);
  --tw-prose-links: var(--ai-cyan);
  --tw-prose-code: var(--ai-neon-green);
  --tw-prose-pre-bg: var(--bg-secondary);
  --tw-prose-quotes: var(--ai-magenta);
}

.prose code {
  font-family: 'Fira Code', monospace;
  background: var(--bg-code);
  padding: 2px 6px;
  border-radius: 0; /* Zero rounded */
}

.prose pre {
  background: var(--bg-secondary);
  border-left: 3px solid var(--ai-cyan);
}
```

**Checkpoint Git:**
```bash
git tag checkpoint-faza-3-typography
```

---

### Faza 4 — Search "na serio"

**W dokumencie masz wprost:**
> "Brak full-text search (do dodania Algolia/Pagefind)"

*Źródło: OBECNY_STAN_SYSTEMU - "Znane Ograniczenia"*

**Plan:**
1. **Najpierw Pagefind** (bo statyczny, pasuje do SSG)
   - Instalacja: `npm install -D pagefind`
   - Build index: `npx pagefind --source dist`
   - Integracja w topbar search

2. **Potem ewentualnie Algolia** (jeśli chcesz "enterprise")

**Pagefind - Quick Setup:**
```bash
# package.json
"scripts": {
  "build": "astro build && npx pagefind --source dist"
}
```

```astro
---
// components/Topbar.astro
---
<div id="search-container"></div>

<script>
  import * as pagefind from 'pagefind';
  
  async function initSearch() {
    const search = await pagefind.search('query');
    // Render results...
  }
</script>
```

**Checkpoint Git:**
```bash
git tag checkpoint-faza-4-search
```

---

## 7) Co Biorę z w2.HTML jako "Kanon"

### ✅ Rzeczy, które MUSZĄ przejść:

#### 1. Tokeny kolorów i styl "zero rounding"

```css
:root {
  /* Tła */
  --bg: #07090f;
  --bg-secondary: #0f1419;
  --bg-tertiary: #1a1f29;
  
  /* Kolory neonowe */
  --ai-cyan: #00f0ff;
  --ai-magenta: #ff00ff;
  --ai-electric-blue: #0066ff;
  --ai-neon-green: #7cffb2;
  
  /* Tekst */
  --text: #e0e6ed;
  --text-dim: #8892a6;
  
  /* Akcenty */
  --accent: var(--ai-cyan);
}

/* ZERO rounded corners konsekwentnie */
* {
  border-radius: 0 !important;
}
```

*Źródło: w2.HTML - `:root` variables*

**To jest konsekwentne i daje "ultra-computer" vibe.**

---

#### 2. Topbar sticky + blur

```css
.topbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(7, 9, 15, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--ai-cyan);
}
```

*Źródło: w2.HTML - `.topbar` klasa*

**Działa i wygląda technicznie.**

---

#### 3. Układ grid 1.25/0.75

```css
.wrap {
  display: grid;
  grid-template-columns: 1.25fr 0.75fr;
  gap: 1.5rem;
}

@media (max-width: 1023px) {
  .wrap {
    grid-template-columns: 1fr;
  }
}
```

*Źródło: w2.HTML - `.wrap` grid*

**Czytelny pod blog + sidebar.**

---

#### 4. Sidebar sekcje: PROJEKTY/LAB/PRO + kontakt panel

```html
<aside class="side" id="projekty">
  <section class="panel">
    <h3>🚀 PROJEKTY</h3>
    <!-- ... -->
  </section>
  
  <section class="panel">
    <h3>🧪 LAB</h3>
    <!-- ... -->
  </section>
  
  <section class="panel">
    <h3>⭐ PRO</h3>
    <!-- ... -->
  </section>
  
  <section class="panel contact-panel">
    <h3>📧 KONTAKT</h3>
    <!-- ... -->
  </section>
</aside>
```

*Źródło: w2.HTML - sidebar struktura*

**Do przerobienia na komponenty Astro:**
- `<Sidebar.astro>`
- `<SidebarPanel.astro title="🚀 PROJEKTY">`

---

#### 5. Minimalny JS (theme + search)

**Theme Toggle:**
```javascript
// Persist w localStorage
localStorage.setItem('theme', 'dark');

// Apply
document.body.classList.toggle('light-mode');
```

**Search Filter:**
```javascript
// Client-side filtering postów
const query = input.value.toLowerCase();
posts.filter(post => 
  post.title.toLowerCase().includes(query) ||
  post.tags.some(tag => tag.includes(query))
);
```

*Źródło: w2.HTML - `<script>` tags*

**W wersji Astro:**
- Odporne na brak elementów (nie wybuchnie na innych stronach)
- Guard clauses: `if (!element) return;`
- `try-catch` dla localStorage (może być blocked)

---

## 📊 Podsumowanie: Od Planu do Działania

### ✅ Co mamy jako fundament:

**Z OBECNY_STAN_SYSTEMU:**
- Astro 5.15.1 SSG/SSR
- Tailwind CSS 3.4.18
- ClientRouter (View Transitions)
- MDX Content Collections
- API endpoints z feature flags
- Cloudflare bindings (AI, KV, R2)

**Z w2.HTML:**
- Ultra-scifi CSS theme (kompletny)
- Topbar + sidebar layout
- Zero rounded corners philosophy
- Neonowe kolory + glassmorphism
- Minimalny, responsywny JS

### 🎯 Kolejność działania:

1. **Faza 1** (tydzień 1): CSS + Layout → Zobacz nowy vibe
2. **Faza 2** (tydzień 2): Sticky sidebar + 3D level A → Premium feel
3. **Faza 3** (tydzień 3): Typography postów → Kompletny UX
4. **Faza 4** (tydzień 4): Pagefind search → Production ready

### 🛡️ Bezpieczeństwo:

- **Git checkpoint** po każdej fazie
- **Rollback** w 1 commit
- **Testowanie** mobile + desktop
- **prefers-reduced-motion** respected
- **Feature flags** kontrolują API

### 🚀 Wynik finalny:

**Blog SSG/SSR** z **ultra-scifi theme**, bez utraty:
- SEO (statyczne strony)
- Performance (CDN cache)
- Kontroli (feature flags)
- Bezpieczeństwa (rate limiting)

**Plus nowe:**
- Premium 3D effects
- Sticky HUD sidebar
- Neonowy "computer console" vibe
- Full-text search (Pagefind)

---

**Status**: ✅ Plan zatwierdzony, gotowy do implementacji  
**Następny krok**: Faza 1 - Migracja CSS  
**Data**: 7 stycznia 2026
