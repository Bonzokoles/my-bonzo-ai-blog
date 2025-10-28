# MyBonzo AI Blog - Copilot Instructions

## Project Context

- **Framework**: Astro 5.15.1 with Alkaline theme
- **Language**: Polish (pl) - wszystkie treści w języku polskim
- **Styling**: TailwindCSS with Alkaline design system
- **Deployment**: Cloudflare Pages with R2 storage
- **Type Safety**: TypeScript strict mode

## Core Architecture Rules

### 1. Component Usage (MANDATORY)

```typescript
// ZAWSZE importuj i używaj tych komponentów:
import Layout from '@/layouts/Layout.astro';
import Heading from '@/components/Astro/Heading.astro';
import Link from '@/components/Astro/Link.astro';
import BackgroundPattern from '@/components/elements/BackgroundPattern.astro';

// BackgroundPattern MUSI być pierwszym dzieckiem Layout
<Layout>
  <BackgroundPattern />
  <main>
    <!-- Twoja treść tutaj -->
  </main>
</Layout>
```

### 2. Link Component (NO <a> tags)

```astro
<!-- ❌ NIGDY nie używaj zwykłych <a> -->
<a href="/ai-tools">AI Tools</a>

<!-- ✅ ZAWSZE używaj komponentu Link -->
<Link href="/ai-tools">AI Tools</Link>
```

### 3. Heading Hierarchy

```astro
<Heading tag="h1" size="4xl">Główny Tytuł</Heading>
<Heading tag="h2" size="2xl">Podtytuł</Heading>
<Heading tag="h3" size="xl">Sekcja</Heading>
```

## Video Integration

### Cloudflare R2 URLs

```astro
<!-- Wideo pionowe (9:16) dla hero -->
<video
  src="https://pub-816ebc2d89b24e968b5c31251d025897.r2.dev/mybonzo-avatar-welcome.mp4"
  class="aspect-[9/16] w-full max-w-sm mx-auto"
  autoplay muted loop playsinline
  aria-label="Wideo powitalne MyBonzo"
>
</video>

<!-- Wideo poziome (16:9) dla prezentacji -->
<video
  src="https://pub-816ebc2d89b24e968b5c31251d025897.r2.dev/mybonzo123.mp4"
  class="aspect-video w-full"
  controls
  aria-label="Prezentacja MyBonzo Pro"
>
</video>
```

## Page Structure Template

```astro
---
// Import required components
import Layout from '@/layouts/Layout.astro';
import Heading from '@/components/Astro/Heading.astro';
import Link from '@/components/Astro/Link.astro';
import BackgroundPattern from '@/components/elements/BackgroundPattern.astro';
import PageHeader from '@/components/Astro/PageHeader.astro';
import Card from '@/components/Astro/Card.astro';

// Page metadata
const title = "Tytuł Strony";
const description = "Opis strony dla SEO";
---

<Layout
  title={title}
  description={description}
  lang="pl"
>
  <BackgroundPattern />

  <PageHeader
    title={title}
    description={description}
  />

  <main class="container mx-auto px-4 py-8">
    <!-- Twoja treść -->
  </main>
</Layout>
```

## Navigation Structure

### Main Menu (alkaline.config.ts)

```typescript
export const NAVIGATION = [
  { name: "Strona Główna", href: "/" },
  { name: "AI Tools", href: "/ai-tools" },
  { name: "Eksperymenty", href: "/eksperymenty" },
  { name: "Poradniki", href: "/poradniki" },
  { name: "System", href: "/system" },
  { name: "Blog", href: "/blog" },
  { name: "MyBonzo Pro", href: "/pro" },
];
```

### Page Directories

```
src/pages/
├── index.astro              # Hero z wideo pionowym
├── ai-tools/index.astro     # Narzędzia AI
├── eksperymenty/index.astro # Eksperymenty
├── poradniki/index.astro    # Poradniki i tutoriale
├── system/index.astro       # System i dokumentacja
├── pro/index.astro          # MyBonzo Pro (wideo poziome)
└── blog/                    # Blog posts
```

## Content Guidelines

### Language & Tone

- **Język**: Polski (formalne "Wy", nie "ty")
- **Ton**: Profesjonalny, przyjazny, ekspercki
- **Tematy**: AI, narzędzia, technologie, MyBonzo Pro

### SEO Requirements

```astro
---
const seoData = {
  title: "Konkretny tytuł strony - MyBonzo AI Blog",
  description: "Opis do 160 znaków z kluczowymi słowami AI, narzędzia, MyBonzo",
  keywords: "AI, sztuczna inteligencja, narzędzia, MyBonzo, automatyzacja",
  author: "MyBonzo Team"
};
---
```

## Accessibility Standards

### ARIA Labels (Required)

```astro
<video aria-label="Szczegółowy opis wideo dla czytników ekranu">
<button aria-label="Zamknij okno dialogowe">
<nav aria-label="Menu główne">
<main aria-label="Główna treść strony">
```

### Semantic HTML

```astro
<header><!-- Navigation --></header>
<main><!-- Primary content --></main>
<section><!-- Content sections --></section>
<aside><!-- Sidebar content --></aside>
<footer><!-- Site footer --></footer>
```

## Performance Optimization

### Image & Video

```astro
<!-- Lazy loading -->
<img loading="lazy" alt="Dokładny opis obrazu" />
<video preload="metadata" />

<!-- Responsive images -->
<picture>
  <source media="(min-width: 768px)" srcset="large.webp" type="image/webp">
  <img src="fallback.jpg" alt="Opis" />
</picture>
```

### Code Splitting

```astro
---
// Dynamic imports for non-critical components
const HeavyComponent = import('@/components/HeavyComponent.astro');
---
```

## MCP Integration Commands

### Before Code Generation

1. `mcp_astro-docs_search_astro_docs` - Check Astro best practices
2. `mcp_docfork_docfork_search_docs` - Verify latest documentation
3. `mcp_context7_resolve-library-id` - Get library-specific guidance

### Validation Checklist

- ✅ Layout > BackgroundPattern > Content structure
- ✅ Link component instead of <a> tags
- ✅ Proper Heading hierarchy with semantic tags
- ✅ ARIA labels for accessibility
- ✅ Polish language content
- ✅ Responsive Tailwind classes
- ✅ TypeScript type safety
- ✅ SEO meta tags

## Error Prevention

### Common Mistakes to Avoid

❌ Using `<a href="">` instead of `<Link href="">`  
❌ Missing BackgroundPattern in Layout  
❌ English content instead of Polish  
❌ Missing ARIA labels  
❌ Incorrect video aspect ratios  
❌ Non-semantic HTML structure

### Auto-Fix Patterns

```typescript
// If you see <a href=""> replace with:
<Link href="">

// If missing BackgroundPattern:
<Layout>
  <BackgroundPattern /> <!-- ADD THIS -->

// If missing ARIA:
<element aria-label="Polish description">
```

---

**Remember**: Always use MCP tools for validation and follow Alkaline design patterns. Priority: Functionality > Performance > Aesthetics.
