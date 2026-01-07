# Kroki Implementacji - Ultra Scifi Theme

**Data rozpoczęcia**: 7 stycznia 2026  
**Status**: Plan w budowie  
**Cel**: Konkretne kroki do wykonania podczas migracji w2.HTML → Astro

---

## 1) Najpierw: Wywal "rounded-theme" jako domyślne

### Problem:

W `src/layouts/Layout.astro` masz:

```typescript
const options = {
  "rounded-theme": true,
};
```

```astro
<body class:list={[options, className]}>
```

**To zawsze wrzuca klasę `rounded-theme` na `<body>`**, więc nawet jak gdzieś próbujesz "no rounding", to i tak przegrywasz.

*Źródło: Layout.astro*

### Rozwiązanie:

**Zmień w `src/layouts/Layout.astro`:**

1. **Usuń `options` w całości**
2. **Ustaw `body` tak:**

```astro
<body class:list={[className]}>
```

### Efekt:

✅ Rounding przestaje być "magiczną stałą"  
✅ Staje się świadomą decyzją tematu/stylu  
✅ Ultra-scifi może mieć `border-radius: 0` bez walki z domyślnymi klasami

### Plik do edycji:
- `src/layouts/Layout.astro`

### Checkpoint Git:
```bash
git add src/layouts/Layout.astro
git commit -m "Remove forced rounded-theme from Layout"
```

---

## 2) Dodaj nowy theme: ULTRA (ciemny, konsola, radius=0)

### Problem:

W `src/styles/themes.css` masz sporo tematów, ale **większość ma `--border-radius > 0`**. 

Najczyściej będzie **dodać nowy theme**, który ustawi:
- Paletę pod "ultra computer"
- `--border-radius: 0rem;`

*Źródło: themes.css*

### Rozwiązanie:

**Dopisz na końcu `src/styles/themes.css`:**

```css
.theme-ultra {
  --color-background: #07090f;
  --color-gradient: #05070c;
  --color-text: #e7ecff;
  --color-accent: #6aa6ff;      /* zimny neon */
  --color-accent-alt: #7cffb2;  /* zielony neon */
  --color-shadow: rgba(0,0,0,.65);
  --border-radius: 0rem;
}
```

### Efekt:

✅ Masz theme jako klasę na `html`/`body`  
✅ Bez kombinowania po komponentach  
✅ `border-radius: 0` konsekwentnie wszędzie  
✅ Neonowa paleta "ultra computer"

### Plik do edycji:
- `src/styles/themes.css`

### Użycie:
```astro
<html class="theme-ultra">
  <!-- Cały theme się aplikuje automatycznie -->
</html>
```

### Checkpoint Git:
```bash
git add src/styles/themes.css
git commit -m "Add theme-ultra: dark console with border-radius=0"
```

---

## 3) "Zero rounding" globalnie (twardo, bez negocjacji)

### Problem:

W `src/styles/global.css` jest dużo bazowych stylów i `.prose`. Nie chcemy tego niszczyć, więc dopinamy **"no rounding"** jako **1 warstwa na końcu**.

*Źródło: global.css*

### Rozwiązanie:

**Dopisz na końcu `src/styles/global.css`:**

```css
/* ULTRA: 0 rounding everywhere (hard rule) */
.theme-ultra * {
  border-radius: 0 !important;
}
```

### Efekt:

✅ **Brutalne**, ale zgodne z ultra-scifi theme  
✅ **Nigdzie nie pojawi się "półokrągły Tailwind"**  
✅ Działa **tylko** gdy `theme-ultra` jest aktywny  
✅ Nie psuje innych tematów

### Plik do edycji:
- `src/styles/global.css`

### Checkpoint Git:
```bash
git add src/styles/global.css
git commit -m "Add zero border-radius rule for theme-ultra"
```

---

## 4) Sidebar: niezależne przewijanie prawej kolumny (sticky + scroll)

### Kontekst:

Twoja "wersja 2" HTML miała `.side` jako prawy panel – w Astro to będzie analogicznie w komponentach/sekcjach. 

Ponieważ dziś używasz layoutu opartego o flex + sekcje, zrobimy to jako **klasę do użycia w sidebarze**.

*Źródło: index.astro - layout struktura*

### Rozwiązanie:

**Dodaj do `src/styles/global.css` (na końcu):**

```css
/* Sticky, scrollable right column (desktop) */
.ultra-side {
  position: sticky;
  top: 104px; /* dopasuj do realnej wysokości Title+Nav */
  align-self: start;
  max-height: calc(100vh - 120px);
  overflow: auto;
  padding-right: 6px;
}

/* scrollbar */
.ultra-side::-webkit-scrollbar { width: 10px; }
.ultra-side::-webkit-scrollbar-track { background: rgba(27,37,66,.25); }
.ultra-side::-webkit-scrollbar-thumb {
  background: rgba(106,166,255,.25);
  border: 1px solid rgba(27,37,66,.55);
}
.ultra-side::-webkit-scrollbar-thumb:hover { background: rgba(124,255,178,.22); }

/* mobile: disable sticky */
@media (max-width: 980px){
  .ultra-side{
    position: static;
    max-height: none;
    overflow: visible;
    padding-right: 0;
  }
}
```

### Użycie:

W miejscu gdzie renderujesz **prawą kolumnę** (aside / div) dodaj klasę `.ultra-side`:

```astro
<aside class="ultra-side">
  <!-- Sidebar content: PROJEKTY, LAB, PRO -->
</aside>
```

### Efekt:

✅ Prawa kolumna **sticky** na desktop  
✅ **Niezależny scroll** od głównej treści  
✅ Custom scrollbar w kolorach ultra-theme  
✅ **Mobile**: normalny flow (bez sticky)  
✅ **HUD-like** experience

### Plik do edycji:
- `src/styles/global.css`

### Dostosowanie:
- `top: 104px` - zmień według faktycznej wysokości Topbar/Title
- `max-height: calc(100vh - 120px)` - dopasuj do marginesów

### Checkpoint Git:
```bash
git add src/styles/global.css
git commit -m "Add ultra-side: sticky scrollable sidebar for desktop"
```

---

## 5) Efekt 3D "strony" + paneli (subtelny, czytelny)

### Kontekst:

Masz już `src/styles/animations.css` z podejściem **"prefers-reduced-motion"** – super, więc dopinamy 3D tak, żeby **też się dało wyłączyć**.

*Źródło: animations.css*

### Rozwiązanie:

**Dopisz do `src/styles/animations.css` (na końcu, przed reduced-motion block albo nad nim):**

```css
/* ULTRA 3D: subtle depth */
.theme-ultra body {
  perspective: 1200px;
  perspective-origin: 50% 12%;
}

.theme-ultra .ultra-stage {
  transform-style: preserve-3d;
}

/* Panels gain depth on hover */
@media (hover:hover) and (pointer:fine){
  .theme-ultra .ultra-panel {
    transform: translateZ(0);
    will-change: transform;
    transition: transform .18s ease, border-color .18s ease;
  }
  .theme-ultra .ultra-panel:hover{
    transform: translateZ(14px) rotateX(.8deg) rotateY(-.8deg);
  }
}

/* Reduced motion: kill the effect */
@media (prefers-reduced-motion: reduce){
  .theme-ultra body { perspective: none; }
  .theme-ultra .ultra-panel,
  .theme-ultra .ultra-panel:hover { transform: none !important; }
}
```

### Użycie:

**1. Na wrapper główny strony (container):**
```astro
<main class="ultra-stage">
  <!-- Content -->
</main>
```

**2. Na "karty/panele":**
```astro
<article class="ultra-panel">
  <!-- Panel content -->
</article>
```

### Efekt:

✅ **Subtelne** 3D - tylko 14px translateZ + małe kąty  
✅ **Tylko na hover** (desktop z myszką)  
✅ **Respektuje prefers-reduced-motion**  
✅ Nie musisz przerabiać całego Tailwinda  
✅ Tylko te miejsca, które mają wyglądać jak **"panele systemu"**

### Nie dla mobile:
- `@media (hover:hover) and (pointer:fine)` - tylko prawdziwe myszy
- Mobile = zero 3D (czytelność zachowana)

### Plik do edycji:
- `src/styles/animations.css`

### Checkpoint Git:
```bash
git add src/styles/animations.css
git commit -m "Add subtle 3D effect for ultra-panel with reduced-motion support"
```

---

## 6) Włączenie tematu tylko na wybranych stronach (bez przepisywania wszystkiego)

### Kontekst:

Masz `Layout.astro`, który przyjmuje `class`.

*Źródło: Layout.astro*

### Rozwiązanie:

**Na stronie, którą chcesz "ultra"** (np. blog listing `src/pages/blog/index.astro`):

**Zamiast:**
```astro
<Layout title="Blog" description="...">
```

**Daj:**
```astro
<Layout class="theme-ultra" title="Blog" description="...">
```

### To odpali:

✅ Paletę kolorów z `themes.css`  
✅ Globalnie `0 rounding`  
✅ 3D (tam gdzie dodasz klasy)  
✅ Sticky sidebar (tam gdzie dodasz `ultra-side`)

### Przykład:

```astro
---
// src/pages/blog/index.astro
import Layout from '@layouts/Layout.astro';
---

<Layout class="theme-ultra" title="Blog AI" description="Najnowsze artykuły">
  <main class="ultra-stage">
    <!-- Blog content -->
  </main>
</Layout>
```

### Plik do edycji:
- `src/pages/blog/index.astro`
- `src/pages/blog/[slug].astro`
- (opcjonalnie) `src/pages/index.astro`

---

## 7) Co z Twoją homepage (index.astro)?

### Kontekst:

Twoje `src/pages/index.astro` jest **potężne** i stoi na Tailwind sekcjach + komponentach:
- `HeroSection`
- `FeaturesSection`
- `BlogSection`
- Import: `@/styles/pages/index.css`

*Źródło: index.astro, index.css*

### Tu są 2 sensowne drogi:

---

### ✅ Droga 1 (NAJBEZPIECZNIEJSZA): ULTRA tylko na /blog i postach

**Co:**
- **Home zostaje jak jest** (bo masz tam video, partner cards, dużo contentu)
- **Blog listing + post pages** dostają ULTRA

**Zysk:**
- Spójny **"czytelny terminal"** tam, gdzie to ma sens: **czytanie**
- Minimalne ryzyko
- Home = marketing, Blog = ultra-computer vibe

**Implementacja:**
```astro
<!-- src/pages/index.astro - BEZ ZMIAN -->
<Layout title="MyBonzo AI Blog">
  <!-- Istniejące sekcje -->
</Layout>

<!-- src/pages/blog/index.astro - ULTRA -->
<Layout class="theme-ultra" title="Blog">
  <main class="ultra-stage">
    <!-- Blog listing -->
  </main>
</Layout>

<!-- src/pages/blog/[slug].astro - ULTRA -->
<Layout class="theme-ultra" title={post.title}>
  <article class="ultra-panel">
    <!-- Post content -->
  </article>
</Layout>
```

**✨ Rekomendacja: Zacznij od tego!**

---

### 🚀 Droga 2 (PEŁNA KONWERSJA): Home też w ULTRA, ale etapami

**Faza 1: Wrapper**
```astro
<!-- src/pages/index.astro -->
<Layout class="theme-ultra" title="MyBonzo AI Blog">
  <!-- Istniejące sekcje - zobaczysz zmianę kolorów -->
</Layout>
```

**Faza 2: Panele na kluczowych sekcjach**
```astro
<section class="ultra-panel">
  <!-- Hero / Features / Blog section -->
</section>
```

**Faza 3: Typografia/kontrasty**
- Dociskasz kontrasty w komponentach
- Żeby nie było **"ciemny na ciemnym"**
- Możliwe wymiana tekstów, backdrop-filter

**⚠️ Uwaga:** Więcej pracy, ale **spójna identyfikacja wizualna** całej strony.

---

### 🎯 Wybór:

**Droga 1** - Najszybciej da efekt **"blog jest jak panel sterowania"**  
**Droga 2** - Pełna ultra-scifi experience, ale wymaga więcej testów

### Checkpoint Git (Droga 1):
```bash
git add src/pages/blog/index.astro src/pages/blog/[slug].astro
git commit -m "Apply theme-ultra to blog pages only"
```

---

## 8) Jedna rzecz, która wyjdzie od razu (uczciwie)

### Problem:

W `global.css` masz **nagłówki na graffiti font** `ThrolaconTrial` + uppercase + shadow:

```css
h1, h2, h3, h4, h5 {
  font-family: 'ThrolaconTrial', Impact, 'Arial Black', sans-serif !important;
  text-transform: uppercase;
  text-shadow: 0 1px 6px #12121232, 2px 2px 0 #3331;
}
```

*Źródło: global.css*

**To jest klimatyczne**, ale to **NIE jest "ultra computer czytelny"** w długim czytaniu.

### Kompromis:

- **Zostaw graffiti** na home/hero (marketing vibe)
- **Na ULTRA blog postach** ustaw nagłówki na **mono/sans** (czytelniej)

### Rozwiązanie:

**Minimalna poprawka (dopisz do `global.css` na końcu):**

```css
/* ULTRA: headings become readable (no graffiti) */
.theme-ultra h1, 
.theme-ultra h2, 
.theme-ultra h3, 
.theme-ultra h4, 
.theme-ultra h5, 
.theme-ultra h6 {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
  text-transform: none;
  letter-spacing: .02em;
  text-shadow: none;
}
```

### Efekt:

✅ To robi **"komputer"**, nie "plakat"  
✅ Graffiti może zostać gdzie indziej (home, hero)  
✅ **Blog posty = czytelne nagłówki**  
✅ Zachowujesz marketing vibe na landing page

### Plik do edycji:
- `src/styles/global.css`

### Checkpoint Git:
```bash
git add src/styles/global.css
git commit -m "Override graffiti headings with monospace for theme-ultra readability"
```

---

## 9) Wskazówki od Perplexity: Architektura Homepage i Blog

### Źródło: Analiza Perplexity - 7 stycznia 2026

---

### 🏗️ Struktura i Layout

**Hero Section:**
- Układ typu product+blog
- Hero z jasnym **value proposition** i **CTA**
- Pełnoekranowy, czysty hero (duży nagłówek, krótki subheading, jedno główne CTA + jedno sekundarne)
- Podobnie jak Cohere, ale w Twojej estetyce

**Sekcje poniżej hero:**
1. **Projekty** (Whitecat, Meble Pumo, Zen Browsers)
2. **Artykuły** (blog grid)
3. **Lab/Experymenty**
4. **Oferta/Pro**

**Optymalizacja:**
- Ogranicz liczbę sekcji w hero
- Przenieś „AI 2025 Highlights" niżej jako osobny **„Trend Radar / AI 2025"** blok

**Blogowy grid:**
- Dodaj klasyczny grid: **2–3 kolumny** kart artykułów
- Z **thumbnalem, tagami i krótkim leadem**
- Zamiast jednego bloku „Najnowsze Artykuły" bez listy

---

### 🎨 Styl Wizualny

**Ikonografia:**
- Ujednolić emotikony: **albo** pełen minimalistyczny styl (bez emoji), **albo** konsekwentnie „friendly"
- Jeśli emoji - spójne emoji i sekcje

**Paleta:**
- **Option 1**: Ciemne tło + neonowe akcenty (AI/future mood)
- **Option 2**: Jasna, „dashboardowa"
- Projekty (Whitecat, Meble Pumo) mają swoje **kolorowe akcenty** jako „product cards"

---

### 📝 Content i Messaging

**Ścieżki użytkownika:**
- Wyraźnie oddziel content edukacyjny **„AI dla wszystkich"** od contentu dla **devów/firm**
- Dwie ścieżki na starcie:
  - **„Ucz się AI"** (dla ogółu)
  - **„Zbuduj z AI w biznesie"** (dla biznesu/devów)

**Skróć sekcje tekstowe:**
- „AI DLA WSZYSTKICH" → 3–4 krótkie **benefit bullets**
- Z bardziej **konkretnymi przykładami**
- Co dokładnie zrobi user **po 5 minutach** na stronie

**„AI 2025 Highlights":**
- Zrób stały format **mikro-artów**
- 6 kafelków: Reasoning, Multimodal, Agents, Medycyna, Video, Ekonomia
- Z **linkami do dłuższych wpisów**

---

### 💼 Sekcja Projektów / Portfolio

**Wyeksponuj Whitecat demo:**
- Jako **główny element** strony
- Kafel z **mini-video**
- Stack: DeepSeek + Claude + GPT-4, 3-layer MOA
- Link: **„Zobacz jak to działa w sklepie Meble Pumo"**

**Inne projekty (MyBonzo.com, Zen Browsers):**
- Spójne karty:
  - Krótki opis
  - Dla kogo
  - 1–2 key features
  - CTA: **„Case study"**, **„Live demo"**, **„Dokumentacja"**

**Client/Use cases:**
- Dodaj sekcję np. **Meble Pumo jako case**
- 2–3 konkretne liczby:
  - Czas odpowiedzi
  - Liczba produktów
  - Wpływ na sprzedaż

---

### 🧭 UX / Nawigacja

**Topowe menu:**
- **Blog**, **Projekty**, **Narzędzia**, **Lab**, **O mnie/Kontakt**, **Pro**
- Dzięki temu blog **nie „ginie"** w głównej stronie

**Filtrowanie artykułów:**
- Po **poziomie**: Początkujący / Średniozaawansowany / Pro / Biznes
- Po **tematach**: RAG, Agenci, E‑commerce, Wideo

**„See all" buttons:**
- Na dole każdej sekcji
- Prowadzące do dedykowanej podstrony
- Np. **„Zobacz wszystkie eksperymenty z agentami"**

---

### 🎯 Podsumowanie Perplexity

**Priorytety:**
1. ✅ Czysty, pełnoekranowy hero z jasnym CTA
2. ✅ Grid blogowy (2–3 kolumny z thumbami)
3. ✅ Wyeksponuj Whitecat jako flagowy projekt
4. ✅ Dwie ścieżki: edukacyjna vs biznesowa
5. ✅ Topowa nawigacja z filtrami
6. ✅ Konkretne liczby w case studies

**Dalsze kroki:**
- Wireframe w tekście (sekcja po sekcji)
- Propozycja treści i komponentów
- Przepisanie do Astro/React

---

