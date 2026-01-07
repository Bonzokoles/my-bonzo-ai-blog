# Przygotowanie do Implementacji - Status

**Data**: 7 stycznia 2026  
**Status**: ✅ Gotowe do patchowania  
**GPT**: Przygotowuje konkretne patche i kody

---

## 📋 Pliki Gotowe do Modyfikacji

### 1. Layout.astro ✅
**Ścieżka**: `src/layouts/Layout.astro` (131 linii)

**Obecny stan:**
```typescript
const options = {
  "rounded-theme": true,
};
```
```astro
<body class:list={[options, className]}>
```

**Co zmienić:**
- [ ] Usuń `options` całkowicie
- [ ] Zmień na: `<body class:list={[className]}>`

**Impact:** Usuwa wymuszone rounded-theme, pozwala theme-ultra mieć pełną kontrolę

---

### 2. themes.css ✅
**Ścieżka**: `src/styles/themes.css` (214 linii)

**Obecny stan:** 14 tematów (light, dark, choco-mint, deep-sea, invisible, leet, neon-bliss, old-couch, peppermint, pop-punk, refresher, slime, syntax, vanilla)

**Co dodać (na końcu pliku, po linii 214):**
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

**Impact:** Nowy theme ultra-computer z paletą neonową i zero rounded

---

### 3. global.css ✅
**Ścieżka**: `src/styles/global.css` (344 linii)

**Obecny stan:** 
- Bazowe style
- Typography (h1-h6 z ThrolaconTrial graffiti)
- Prose styles
- Helper classes

**Co dodać (na końcu, po linii 344):**

**A) Zero rounding rule:**
```css
/* ULTRA: 0 rounding everywhere (hard rule) */
.theme-ultra * {
  border-radius: 0 !important;
}
```

**B) Sticky scrollable sidebar:**
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

**C) Readable headings (no graffiti):**
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

**Impact:** Zero rounded, sticky sidebar, czytelne nagłówki w ultra-theme

---

### 4. animations.css ✅
**Ścieżka**: `src/styles/animations.css` (254 linii)

**Obecny stan:**
- Neon animations
- Donut animations
- Build-in, fade-in, spin-grow, text-build
- `prefers-reduced-motion` support (linia 233-254)

**Co dodać (przed `@media (prefers-reduced-motion)` block, ~linia 232):**
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

**Impact:** Subtelny 3D effect na panelach, respektuje accessibility

---

### 5. blog/index.astro 🔄
**Ścieżka**: `src/pages/blog/index.astro` (100 linii)

**Obecny stan:**
- Layout bez klasy theme
- Grid z kartami postów (md:grid-cols-2 lg:grid-cols-3)
- Border + rounded corners
- BackgroundPattern

**Co zmienić:**

**A) Layout (linia 19):**
```diff
- <Layout
+ <Layout
+   class="theme-ultra"
    title="Blog"
    description="..."
>
```

**B) Wrapper główny (po `<section class="py-16">`):**
```diff
- <div class="max-w-6xl mx-auto px-4">
+ <div class="max-w-6xl mx-auto px-4 ultra-stage">
```

**C) Karty artykułów (linia 33):**
```diff
- <article class="border border-gray-500 bg-transparent rounded-none ...">
+ <article class="ultra-panel border border-gray-500 bg-transparent rounded-none ...">
```

**D) (Opcjonalnie) Dodać sidebar z prawej strony:**
Zmienić strukturę na grid z sidebar:
```astro
<div class="grid lg:grid-cols-[1.25fr_0.75fr] gap-6">
  <main class="ultra-stage">
    <!-- Blog grid -->
  </main>
  
  <aside class="ultra-side">
    <!-- PROJEKTY, LAB, PRO panels -->
  </aside>
</div>
```

---

### 6. blog/[slug].astro + Post.astro 🔄
**Ścieżka 1**: `src/pages/blog/[slug].astro` (22 linie)
**Ścieżka 2**: `src/layouts/Post.astro` (150 linii)

**Obecny stan [slug].astro:**
- Przekazuje props do `Post.astro` layout

**Obecny stan Post.astro:**
- Używa `Layout.astro` BEZ klasy theme
- `const options = { "rounded-theme": true };` (linia 24)
- Render entry content z prose class

**Co zmienić:**

**A) Post.astro - Layout (linia 46):**
```diff
  <Layout
+   class="theme-ultra"
    title={entry.data.title}
-   class="capitalize"
  >
```

**B) Post.astro - Article wrapper (linia 48):**
```diff
- <article class:list={["prose", className]}>
+ <article class:list={["prose ultra-panel", className]}>
```

**C) Post.astro - Usuń options (linia 24):**
```diff
- const options = { "rounded-theme": true };
```

**D) Post.astro - Image class (linia 55):**
```diff
  class:list={[
    "w-full h-auto max-h-[25rem] object-cover my-4",
-   options,
  ]}
```

---

## 🎯 Kolejność Implementacji (Checkpoint-based)

### Step 1: CSS Foundation
```bash
# 1. themes.css - dodaj theme-ultra
# 2. global.css - dodaj zero rounding + sidebar + typography
# 3. animations.css - dodaj 3D effects
git add src/styles/*.css
git commit -m "Add theme-ultra CSS foundation: colors, zero rounding, sticky sidebar, 3D"
git tag checkpoint-1-css-ultra
```

### Step 2: Layout Changes
```bash
# 4. Layout.astro - usuń forced rounded-theme
git add src/layouts/Layout.astro
git commit -m "Remove forced rounded-theme from Layout.astro"
git tag checkpoint-2-layout-clean
```

### Step 3: Blog Pages Ultra Theme
```bash
# 5. blog/index.astro - apply theme-ultra + ultra-stage + ultra-panel
# 6. blog/Post.astro - apply theme-ultra + ultra-panel
git add src/pages/blog/*.astro src/layouts/Post.astro
git commit -m "Apply theme-ultra to blog listing and post pages"
git tag checkpoint-3-blog-ultra
```

### Step 4: Test & Refine
```bash
npm run dev
# Test:
# - /blog (listing)
# - /blog/[any-post] (single post)
# - Responsive (mobile vs desktop)
# - Sidebar scroll (if added)
# - 3D hover effects
# - Typography readability
```

---

## 📊 Stan Plików

| Plik | Odczytany | Linie | Status |
|------|-----------|-------|--------|
| `Layout.astro` | ✅ | 131 | Gotowy do patch |
| `themes.css` | ✅ | 214 | Gotowy - dodać na końcu |
| `global.css` | ✅ | 344 | Gotowy - dodać na końcu |
| `animations.css` | ✅ | 254 | Gotowy - dodać przed reduced-motion |
| `blog/index.astro` | ✅ | 100 | Gotowy do modyfikacji |
| `blog/[slug].astro` | ✅ | 22 | Prosty pass-through |
| `Post.astro` | ✅ | 150 | Gotowy do modyfikacji |

---

## 🚨 Uwagi Techniczne

### 1. Top offset dla sticky sidebar
```css
top: 104px; /* dopasuj do realnej wysokości Title+Nav */
```
**TODO:** Zmierz faktyczną wysokość Title + Nav w przeglądarce i dostosuj

### 2. Grid columns dla sidebar
Jeśli dodajesz sidebar do blog/index.astro:
```astro
<div class="grid lg:grid-cols-[1.25fr_0.75fr] gap-6">
```
To odpowiada grid z w2.HTML (1.25 / 0.75 ratio)

### 3. Prose typography w ultra-theme
Override graffiti headings jest w global.css, ale sprawdź czy:
- Code blocks są czytelne (monospace font)
- Links mają dobry kontrast (--color-accent: #6aa6ff)
- Listy, cytaty, bold/italic działają

### 4. 3D perspective origin
```css
perspective-origin: 50% 12%;
```
12% od góry = efekt "patrzenia z góry w dół" na konsolę

### 5. Reduced motion
Wszystkie 3D efekty wyłączają się automatycznie dla `prefers-reduced-motion: reduce`

---

## 🎨 Paleta Ultra Theme

```css
--color-background: #07090f    /* Prawie czarny */
--color-gradient: #05070c      /* Jeszcze ciemniejszy */
--color-text: #e7ecff          /* Jasny niebieskobiały */
--color-accent: #6aa6ff        /* Zimny neon niebieski */
--color-accent-alt: #7cffb2    /* Zielony neon */
--color-shadow: rgba(0,0,0,.65)
--border-radius: 0rem          /* ZERO */
```

**Dodatkowo z w2.HTML (do rozważenia):**
- `--ai-cyan: #00f0ff` (bardziej cyjan)
- `--ai-magenta: #ff00ff` (magenta accent)
- `--ai-electric-blue: #0066ff`

---

## ✅ Checklist Przed Implementacją

- [x] Layout.astro - odczytany, wiem gdzie `options` i `className`
- [x] themes.css - odczytany, wiem gdzie dodać nowy theme
- [x] global.css - odczytany, wiem gdzie dopisać reguły
- [x] animations.css - odczytany, wiem gdzie dodać 3D
- [x] blog/index.astro - odczytany, struktura jasna
- [x] blog/[slug].astro - odczytany, prosty wrapper
- [x] Post.astro - odczytany, wiem co zmienić
- [ ] **Czekam na patche od GPT**
- [ ] Git branch: `git checkout -b feature/ultra-theme`
- [ ] Backup: `git tag backup-before-ultra`

---

**Status**: ✅ **READY FOR PATCHES**  
**Następny krok**: Aplikuj patche z GPT → Test → Commit → Deploy  
**Data**: 7 stycznia 2026
