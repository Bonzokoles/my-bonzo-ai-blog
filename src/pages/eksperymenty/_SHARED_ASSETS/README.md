# 🎨 SHARED ASSETS - Layout i Style dla Funkcji

**Cel**: Gotowe pliki layout i CSS do kopiowania do projektów w AIBLOG  
**Lokalizacja**: `eksperymenty/_SHARED_ASSETS/`

---

## 📁 Struktura

```
_SHARED_ASSETS/
├── README.md                   ← Ten plik
├── layouts/
│   └── SimpleLayout.astro      ← Uproszczony layout z wyglądem bloga
├── styles/
│   ├── blog-theme.css          ← Kolorystyka i fonty bloga
│   └── tailwind-base.css       ← Minimalna konfiguracja Tailwind
└── INSTRUKCJA_KOPIOWANIA.md    ← Jak skopiować do projektu
```

---

## 🚀 Jak Używać?

### Opcja 1: Kopiuj pliki do projektu

```powershell
# 1. Skopiuj layout
Copy-Item -Path "Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty\_SHARED_ASSETS\layouts\SimpleLayout.astro" `
          -Destination "Q:\mybonzo\AIBLOG\twoj-projekt\src\layouts\"

# 2. Skopiuj style
Copy-Item -Path "Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty\_SHARED_ASSETS\styles\blog-theme.css" `
          -Destination "Q:\mybonzo\AIBLOG\twoj-projekt\src\styles\"

# 3. Użyj w stronie
```

### Opcja 2: Import bezpośredni (jeśli ścieżki się zgadzają)

```astro
---
import SimpleLayout from "@layouts/SimpleLayout.astro";
import "@styles/blog-theme.css";
---

<SimpleLayout title="Moja Funkcja">
    <h1>🚀 Zawartość</h1>
    <p>Treść strony...</p>
</SimpleLayout>
```

---

## 🎨 Co Zawiera?

### SimpleLayout.astro
- Podstawowy HTML
- Meta tagi (SEO)
- Throlacon font (graffiti headers)
- Dark mode support
- Tailwind CSS
- Minimalistyczny navbar
- Footer z powrotem do bloga

### blog-theme.css
- Kolory bloga (theme-primary, theme-accent)
- Typografia (Throlacon dla h1-h5)
- Animacje
- Dark mode
- Gradient backgrounds
- Responsive design

### tailwind-base.css
- Minimalna konfiguracja Tailwind
- Utility classes
- Custom colors z bloga

---

## 📋 Ścieżki do Ważnych Plików w Głównym Blogu

### Layout:
```
Q:\mybonzo\mybonzoAIblog\src\layouts\Layout.astro
```

### Style:
```
Q:\mybonzo\mybonzoAIblog\src\styles\global.css
Q:\mybonzo\mybonzoAIblog\src\styles\themes.css
Q:\mybonzo\mybonzoAIblog\src\styles\animations.css
```

### Komponenty:
```
Q:\mybonzo\mybonzoAIblog\src\components\Astro\Nav.astro
Q:\mybonzo\mybonzoAIblog\src\components\Astro\Footer.astro
Q:\mybonzo\mybonzoAIblog\src\components\Astro\Title.astro
```

### Konfiguracja:
```
Q:\mybonzo\mybonzoAIblog\src\alkaline.config.ts
Q:\mybonzo\mybonzoAIblog\tailwind.config.mjs
```

### Fonty:
```
Q:\mybonzo\mybonzoAIblog\public\fonts\Throlacon Trial.ttf
```

### Assets:
```
Q:\mybonzo\mybonzoAIblog\src\assets\logo.png
Q:\mybonzo\mybonzoAIblog\public\favicon.svg
```

---

## 🎯 Przykład Użycia w Projekcie AIBLOG

### Struktura projektu:
```
Q:\mybonzo\AIBLOG\bonzo-ai-chat\
├── src/
│   ├── layouts/
│   │   └── SimpleLayout.astro     ← Skopiowany z _SHARED_ASSETS
│   ├── styles/
│   │   └── blog-theme.css         ← Skopiowany z _SHARED_ASSETS
│   └── pages/
│       └── index.astro
└── public/
    └── fonts/
        └── Throlacon Trial.ttf    ← Skopiowany z głównego bloga
```

### Użycie w index.astro:
```astro
---
import SimpleLayout from "../layouts/SimpleLayout.astro";
import "../styles/blog-theme.css";
---

<SimpleLayout 
    title="Bonzo AI Chat"
    description="Inteligentny asystent AI"
>
    <div class="container mx-auto px-4 py-16">
        <h1 class="text-theme-accent">🤖 AI Chat</h1>
        <p class="text-theme-primary">Witaj w asystencie AI...</p>
        
        <!-- Twoja zawartość -->
    </div>
</SimpleLayout>
```

---

## 🔄 Aktualizacja

Gdy zmienisz style w głównym blogu i chcesz zaktualizować funkcje:

```powershell
# Przegeneruj SimpleLayout.astro i blog-theme.css
# Skopiuj do wszystkich projektów w AIBLOG

$projects = @("bonzo-ai-chat", "image-generator", "voice-clone")

foreach ($project in $projects) {
    Copy-Item -Path "_SHARED_ASSETS\layouts\SimpleLayout.astro" `
              -Destination "Q:\mybonzo\AIBLOG\$project\src\layouts\" -Force
    
    Copy-Item -Path "_SHARED_ASSETS\styles\blog-theme.css" `
              -Destination "Q:\mybonzo\AIBLOG\$project\src\styles\" -Force
    
    Write-Host "✅ Zaktualizowano: $project" -ForegroundColor Green
}
```

---

## 📚 Dokumentacja

### Tailwind CSS:
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Customization](https://tailwindcss.com/docs/configuration)

### Astro Layouts:
- [Layouts Guide](https://docs.astro.build/en/guides/layouts/)
- [Props](https://docs.astro.build/en/basics/astro-components/#component-props)

---

**Status**: ✅ Gotowe do użycia  
**Data**: 1 listopada 2025
