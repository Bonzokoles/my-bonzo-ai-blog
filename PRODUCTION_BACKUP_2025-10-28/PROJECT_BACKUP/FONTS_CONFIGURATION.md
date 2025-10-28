# Konfiguracja fontów - MyBonzo AI Blog

## 🎨 Aktualne fonty

Projekt używa Google Fonts skonfigurowanych w `src/alkaline.config.ts`:

```typescript
fonts: [
  {
    typeface: "serif",
    fontFamily: "SUSE",
    fontWeights: ["100..800"],
  },
  {
    typeface: "sans",
    fontFamily: "Roboto",
    fontWeights: ["100..900"],
    includeItalic: true,
  },
  {
    typeface: "mono",
    fontFamily: "Fira Code",
    fontWeights: [400, 500, 700],
  },
]
```

## 📝 Zmiana fontów na inne z Google Fonts

### Krok 1: Edytuj `src/alkaline.config.ts`

Otwórz plik i znajdź sekcję `fonts` (około linii 81-98).

### Krok 2: Zmień fontFamily

Przykłady popularnych fontów:

**Sans-serif (bezszeryfowe):**
```typescript
{
  typeface: "sans",
  fontFamily: "Inter",        // lub: "Open Sans", "Lato", "Montserrat", "Poppins"
  fontWeights: ["100..900"],
  includeItalic: true,
}
```

**Serif (szeryfowe):**
```typescript
{
  typeface: "serif",
  fontFamily: "Merriweather", // lub: "Playfair Display", "Lora", "Crimson Text"
  fontWeights: ["300", "400", "700"],
}
```

**Monospace (kod):**
```typescript
{
  typeface: "mono",
  fontFamily: "JetBrains Mono", // lub: "Source Code Pro", "Inconsolata"
  fontWeights: [400, 500, 700],
}
```

### Krok 3: Zapisz i zrestartuj dev server

```bash
npm run dev
```

## ⚠️ WAŻNE: Weryfikacja wag fontów

Przed zmianą sprawdź dostępne wagi na [Google Fonts](https://fonts.google.com):

❌ **ŹLE** - Fira Code nie wspiera zakresu:
```typescript
fontWeights: ["400...700"]  // Spowoduje błąd!
```

✅ **DOBRZE** - Tylko dostępne wagi:
```typescript
fontWeights: [400, 500, 700]
```

## 🎨 Fonty lokalne z `public/fonts-custom/`

Masz lokalne fonty w folderze `public/fonts-custom/`:
- NEUROPOL.ttf
- whoa!.ttf
- nasalization rg.ttf
- ethnocentric rg.ttf
- Kenyan Coffee Rg It.otf
- Steelfish (3 warianty)
- Throlacon Trial.ttf

### Użycie lokalnych fontów

1. **Stwórz plik CSS** `src/styles/custom-fonts.css`:

```css
@font-face {
  font-family: 'Neuropol';
  src: url('/fonts-custom/NEUROPOL.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Steelfish';
  src: url('/fonts-custom/Steelfish Rg.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Steelfish';
  src: url('/fonts-custom/Steelfish Bd It.otf') format('opentype');
  font-weight: bold;
  font-style: italic;
  font-display: swap;
}
```

2. **Importuj w Layout**:

Edytuj `src/layouts/Layout.astro`, dodaj przed `@styles/global.css`:

```typescript
import "@styles/custom-fonts.css";
import "@styles/global.css";
```

3. **Użyj w Tailwind**:

Edytuj `tailwind.config.mjs`:

```javascript
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        neuropol: ['Neuropol', 'sans-serif'],
        steelfish: ['Steelfish', 'sans-serif'],
        ethnocentric: ['Ethnocentric', 'sans-serif'],
      }
    },
  },
}
```

4. **Zastosuj w klasach**:

```html
<h1 class="font-neuropol">Futurystyczny nagłówek</h1>
<p class="font-steelfish">Tekst w Steelfish</p>
```

## 🔧 Zmiana domyślnych fontów w global.css

Edytuj `src/styles/global.css`:

```css
:root {
  --font-body: 'Roboto', sans-serif;      /* Zmień na wybrany font */
  --font-heading: 'SUSE', serif;          /* Zmień na wybrany font */
  --font-mono: 'Fira Code', monospace;    /* Zmień na wybrany font */
}

body {
  font-family: var(--font-body);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
}

code, pre {
  font-family: var(--font-mono);
}
```

## 📚 Przykładowe kombinacje fontów

### Nowoczesny i minimalistyczny
```typescript
fonts: [
  { typeface: "sans", fontFamily: "Inter", fontWeights: ["300", "400", "600", "700"] },
  { typeface: "mono", fontFamily: "JetBrains Mono", fontWeights: [400, 500] },
]
```

### Elegancki i czytelny
```typescript
fonts: [
  { typeface: "serif", fontFamily: "Merriweather", fontWeights: ["300", "400", "700"] },
  { typeface: "sans", fontFamily: "Open Sans", fontWeights: ["400", "600", "700"] },
]
```

### Tech i futurystyczny (lokalne fonty)
```css
/* W custom-fonts.css */
:root {
  --font-heading: 'Neuropol', sans-serif;
  --font-body: 'Steelfish', sans-serif;
}
```

## 🚀 Optymalizacja wydajności

1. **Użyj tylko potrzebnych wag**:
   - Zamiast: `["100..900"]` (wszystkie wagi)
   - Lepiej: `["400", "600", "700"]` (tylko używane)

2. **font-display: swap**:
   - Już skonfigurowane w Google Fonts
   - Dla lokalnych fontów dodaj w @font-face

3. **Preload krytycznych fontów**:

W `src/layouts/Layout.astro`, dodaj w `<head>`:

```html
<link rel="preload" href="/fonts-custom/NEUROPOL.ttf" as="font" type="font/ttf" crossorigin />
```

## 📖 Więcej informacji

- **Google Fonts**: https://fonts.google.com
- **Font Squirrel** (konwersja fontów): https://www.fontsquirrel.com/tools/webfont-generator
- **Tailwind Typography**: https://tailwindcss.com/docs/font-family

---

**Status**: ✅ Fonty skonfigurowane
**Ostatnia aktualizacja**: 2025-10-27
