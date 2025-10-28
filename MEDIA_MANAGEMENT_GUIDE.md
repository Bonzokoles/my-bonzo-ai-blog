# MyBonzo AI Blog - Zarządzanie Materiałami i Mediami

## 📁 **Struktura Katalogów Media**

### 🎯 **Główne Katalogi**
```
public/
├── 📷 Obrazy główne (favicon, logos, artwork)
├── fonts/ - fonty systemowe
├── fonts-custom/ - fonty niestandardowe  
├── videos/ - pliki wideo
└── media/ - ⭐ GŁÓWNY KATALOG MATERIAŁÓW (do utworzenia)
```

---

## 📂 **Zalecana Struktura /public/media/**

### 🗂️ **Organizacja Folderów**
```
media/
├── blog/           - obrazy dla artykułów bloga
│   ├── 2025/       - podział na lata  
│   │   ├── 10/     - miesiące
│   │   └── 11/     
│   └── covers/     - okładki artykułów
├── ai-tools/       - zrzuty ekranu narzędzi AI
├── tutorials/      - materiały do poradników
├── experiments/    - obrazy z eksperymentów  
├── avatars/        - awatary użytkowników
├── logos/          - loga partnerów/narzędzi
├── screenshots/    - screenshoty aplikacji
├── icons/          - ikony systemowe
├── banners/        - banery reklamowe
├── temp/           - pliki tymczasowe
└── uploads/        - uploads użytkowników
```

---

## 📸 **Jak Dodawać Materiały**

### 🔥 **Najlepsze Praktyki Nazewnictwa**
```
✅ DOBRZE:
- blog-ai-tools-2025-01-15.jpg
- tutorial-chatgpt-step1.png
- experiment-dalle3-result.webp
- logo-openai-official.svg

❌ ŹLE:  
- IMG_1234.jpg
- zdjecie.png
- bez nazwy.jpeg
- DSCF0001.jpg
```

### 📋 **Konwencja Nazewnictwa**
```
[kategoria]-[opis]-[data/wersja].[format]

Przykłady:
- blog-wprowadzenie-ai-2025-10-28.jpg
- tool-chatgpt-interface.png
- avatar-mybonzo-v2.svg
- banner-homepage-main.webp
```

---

## 🎨 **Optymalizacja Obrazów**

### 📏 **Zalecane Wymiary**
```
Blog Articles:
- Featured Image: 1200x630px (og:image)
- Thumbnail: 400x225px  
- Inline Images: max 800px szerokość

UI Elements:
- Logo: 200x50px (SVG preferowane)
- Icons: 24x24, 32x32, 48x48px
- Avatar: 150x150px (okrągły)
- Banner: 1920x400px
```

### 🗜️ **Formaty i Kompresja**
```
✨ PREFEROWANE FORMATY:
- SVG - loga, ikony, grafika wektorowa
- WebP - zdjęcia (najlepsza kompresja)
- PNG - obrazy z przezroczystością  
- JPG - zdjęcia bez przezroczystości
- AVIF - przyszłościowy format (opcjonalnie)

📦 POZIOMY KOMPRESJI:
- Blog images: 80-85% quality
- Thumbnails: 70-75% quality  
- UI elements: lossless (PNG/SVG)
```

---

## 🔧 **Jak Używać w Komponenetach Astro**

### 📝 **Import i Użycie**
```astro
---
// src/components/BlogPost.astro
import { Image } from 'astro:assets';

// Import lokalnych obrazów
import heroImage from '../assets/blog/ai-revolution-2025.jpg';
---

<!-- Sposób 1: Lokalne obrazy (zalecane) -->
<Image 
  src={heroImage} 
  alt="AI Revolution 2025 - analiza trendów"
  width={800} 
  height={450}
  quality={85}
  format="webp"
/>

<!-- Sposób 2: Public assets -->
<img 
  src="/media/blog/2025/10/ai-trends-analysis.webp" 
  alt="Trendy AI w 2025 roku"
  width="800" 
  height="450"
  loading="lazy"
/>
```

### 🎯 **Responsive Images**
```astro
---
// Responsive image component
const imageSizes = {
  mobile: 400,
  tablet: 768,  
  desktop: 1200
};
---

<picture>
  <source 
    media="(max-width: 640px)" 
    srcset="/media/blog/hero-mobile.webp"
  />
  <source 
    media="(max-width: 1024px)" 
    srcset="/media/blog/hero-tablet.webp"
  />
  <img 
    src="/media/blog/hero-desktop.webp" 
    alt="Hero image"
    loading="lazy"
  />
</picture>
```

### 🖼️ **Image Gallery Component**
```astro
---
// src/components/ImageGallery.astro
export interface Props {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
}

const { images } = Astro.props;
---

<div class="image-gallery grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {images.map((img) => (
    <figure class="gallery-item">
      <img 
        src={`/media/${img.src}`}
        alt={img.alt}
        class="w-full h-48 object-cover rounded-lg"
        loading="lazy"
      />
      {img.caption && (
        <figcaption class="text-sm text-gray-600 mt-2">
          {img.caption}
        </figcaption>
      )}
    </figure>
  ))}
</div>
```

---

## 🔄 **Upload Workflow**

### 📤 **Proces Dodawania Nowych Materiałów**
```bash
# 1. Utwórz odpowiedni katalog
mkdir -p public/media/blog/2025/10

# 2. Skopiuj i zoptymalizuj obrazy  
# Użyj narzędzi jak ImageOptim, Squoosh, lub tinypng.com

# 3. Rename według konwencji
mv IMG_1234.jpg public/media/blog/2025/10/blog-ai-trends-2025-10-28.jpg

# 4. Commit do Git
git add public/media/
git commit -m "media: dodaj obrazy dla artykułu o trendach AI"
git push
```

### 🤖 **Automatyzacja (Opcjonalna)**
```javascript
// scripts/optimize-images.js
import sharp from 'sharp';
import { glob } from 'glob';

const optimizeImages = async () => {
  const images = await glob('public/media/**/*.{jpg,jpeg,png}');
  
  for (const img of images) {
    await sharp(img)
      .resize(1200, null, { withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(img.replace(/\.(jpg|jpeg|png)$/, '.webp'));
  }
};
```

---

## 📋 **Content Management**

### 🗃️ **Markdown Frontmatter dla Obrazów**
```yaml
---
title: "Najlepsze narzędzia AI 2025"
description: "Przegląd najważniejszych narzędzi sztucznej inteligencji"
featured_image: "/media/blog/2025/10/ai-tools-cover.webp"
gallery:
  - src: "blog/2025/10/chatgpt-interface.webp"
    alt: "Interface ChatGPT 4.0"
    caption: "Nowy interface ChatGPT"
  - src: "blog/2025/10/midjourney-v6.webp" 
    alt: "Midjourney v6 przykłady"
    caption: "Przykłady z Midjourney v6"
---

# Content artykułu

![Narzędzia AI](/media/blog/2025/10/ai-tools-comparison.webp)
```

### 🎨 **CSS dla Galerii**
```css
/* src/styles/components/gallery.css */
.image-gallery {
  @apply grid gap-4;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.gallery-item {
  @apply relative overflow-hidden rounded-lg shadow-lg;
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  @apply scale-105 shadow-xl;
}

.gallery-item img {
  @apply w-full h-48 object-cover;
}

.gallery-item figcaption {
  @apply absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-sm;
}
```

---

## 🔍 **SEO i Performance**

### 🎯 **Image SEO Best Practices**
```astro
<!-- Optymalne wykorzystanie alt text -->
<img 
  src="/media/blog/ai-tutorial-step1.webp"
  alt="Krok 1: Konfiguracja API OpenAI w panelu deweloperskim"
  title="Przewodnik konfiguracji OpenAI API"
  width="800"
  height="450"
  loading="lazy"
/>

<!-- Structured Data dla obrazów -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ImageObject",
  "url": "https://mybonzoaiblog.com/media/blog/ai-tutorial.webp",
  "description": "Tutorial konfiguracji OpenAI API",
  "author": "MyBonzo AI Blog"
}
</script>
```

### ⚡ **Performance Optimization**
```astro
---
// Lazy loading i preload krytycznych obrazów
---

<!-- Preload hero image -->
<link rel="preload" as="image" href="/media/blog/hero-main.webp" />

<!-- Lazy load pozostałych -->
<img 
  src="/media/blog/content-image.webp"
  alt="Opis obrazu"
  loading="lazy"
  decoding="async"
/>

<!-- Responsive images -->
<img 
  src="/media/blog/image-800.webp"
  srcset="
    /media/blog/image-400.webp 400w,
    /media/blog/image-800.webp 800w,
    /media/blog/image-1200.webp 1200w
  "
  sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
  alt="Responsive image"
/>
```

---

## 🛠️ **Narzędzia i Utilities**

### 📦 **Zalecane Narzędzia**
```bash
# Optymalizacja obrazów
npm install sharp          # Node.js image processing
npm install imagemin       # Image minification
npm install @squoosh/lib   # Google Squoosh

# Narzędzia online:
# - tinypng.com - kompresja PNG/JPG
# - squoosh.app - Google image optimizer
# - imageoptim.com - Mac app dla optymalizacji
```

### 🔧 **Helper Scripts**
```javascript
// utils/imageHelpers.js
export const getImagePath = (category, filename) => {
  return `/media/${category}/${filename}`;
};

export const generateSrcSet = (basePath, sizes = [400, 800, 1200]) => {
  return sizes.map(size => 
    `${basePath}-${size}.webp ${size}w`
  ).join(', ');
};

// Użycie:
// const srcset = generateSrcSet('/media/blog/article', [400, 800, 1200]);
```

---

## 📝 **Checklist dla Nowych Materiałów**

### ✅ **Przed Upload**
- [ ] Nazwa pliku zgodna z konwencją
- [ ] Optymalizacja rozmiaru i jakości
- [ ] Alt text przygotowany
- [ ] Responsive versions (jeśli potrzebne)
- [ ] Copyright i licencja sprawdzone

### ✅ **Po Upload**  
- [ ] Test ładowania na różnych urządzeniach
- [ ] Sprawdzenie SEO (alt text, structured data)
- [ ] Performance test (PageSpeed Insights)
- [ ] Commit do Git z opisowym komunikatem
- [ ] Update dokumentacji (jeśli nowy typ materiału)

---

## 🚀 **Quick Start**

### 💨 **Szybki Start - Dodanie Obrazu do Artykułu**
```bash
# 1. Utwórz strukture katalogów
mkdir -p public/media/blog/2025/10

# 2. Dodaj obraz
cp ~/Downloads/screenshot.png public/media/blog/2025/10/blog-ai-news-2025-10-28.webp

# 3. Użyj w Markdown
echo '![AI News](media/blog/2025/10/blog-ai-news-2025-10-28.webp)' >> content/blog/ai-news.md

# 4. Commit  
git add . && git commit -m "media: dodaj obraz dla artykułu AI News"
```

**GOTOWE!** 🎉 Obraz jest dostępny na stronie i zoptymalizowany dla performance.