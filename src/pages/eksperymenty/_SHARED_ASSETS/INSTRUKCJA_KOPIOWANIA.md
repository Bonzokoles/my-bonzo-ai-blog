# 📖 INSTRUKCJA KOPIOWANIA - Layout i Style do AIBLOG

**Cel**: Przeniesienie wyglądu bloga MyBonzo do projektów w AIBLOG  
**Czas**: 5-10 minut

---

## 🚀 SZYBKI START - 3 Kroki

### Krok 1: Skopiuj pliki

```powershell
# Przejdź do swojego projektu w AIBLOG
cd Q:\mybonzo\AIBLOG\twoj-projekt

# Utwórz foldery jeśli nie istnieją
mkdir src\layouts -Force
mkdir src\styles -Force
mkdir public\fonts -Force

# Skopiuj layout
Copy-Item -Path "Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty\_SHARED_ASSETS\layouts\SimpleLayout.astro" `
          -Destination "src\layouts\" -Force

# Skopiuj style
Copy-Item -Path "Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty\_SHARED_ASSETS\styles\blog-theme.css" `
          -Destination "src\styles\" -Force

# Skopiuj font Throlacon
Copy-Item -Path "Q:\mybonzo\mybonzoAIblog\public\fonts\Throlacon Trial.ttf" `
          -Destination "public\fonts\" -Force

# Opcjonalnie: favicon
Copy-Item -Path "Q:\mybonzo\mybonzoAIblog\public\favicon.svg" `
          -Destination "public\" -Force
```

### Krok 2: Dodaj do astro.config.mjs

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  // ... reszta konfiguracji
  
  // Dodaj alias dla łatwiejszego importu
  vite: {
    resolve: {
      alias: {
        '@layouts': '/src/layouts',
        '@styles': '/src/styles',
        '@components': '/src/components',
      }
    }
  }
});
```

### Krok 3: Użyj w stronie

```astro
---
// src/pages/index.astro
import SimpleLayout from "@layouts/SimpleLayout.astro";
import "@styles/blog-theme.css";
---

<SimpleLayout 
    title="Moja Funkcja AI"
    description="Opis funkcji"
>
    <div class="container mx-auto px-4 py-16">
        <!-- Graffiti header z Throlacon font -->
        <h1>🚀 Tytuł</h1>
        
        <!-- Styled content -->
        <div class="card">
            <h2 class="card-title">Sekcja</h2>
            <p class="card-content">Treść...</p>
        </div>
        
        <!-- Button z stylem bloga -->
        <a href="#" class="btn btn-primary">
            Akcja
        </a>
    </div>
</SimpleLayout>
```

---

## 🎨 CO DOSTANIESZ?

### SimpleLayout.astro zawiera:
- ✅ HTML5 boilerplate
- ✅ Meta tagi (SEO, Open Graph, Twitter)
- ✅ Throlacon font (graffiti headers)
- ✅ Prosty navbar z linkiem do bloga
- ✅ Footer
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Smooth scroll

### blog-theme.css zawiera:
- ✅ Kolory bloga (theme-primary, accent, itp.)
- ✅ Typografia (Throlacon dla h1-h5)
- ✅ Utility classes (bg-theme-*, text-theme-*)
- ✅ Animacje (fadeIn, slideUp, pulse)
- ✅ Button styles (btn-primary, btn-secondary)
- ✅ Card components
- ✅ Custom scrollbar
- ✅ Focus styles (accessibility)

---

## 📋 CHECKLIST

### Przed uruchomieniem:
- [ ] Skopiowano SimpleLayout.astro → `src/layouts/`
- [ ] Skopiowano blog-theme.css → `src/styles/`
- [ ] Skopiowano Throlacon Trial.ttf → `public/fonts/`
- [ ] Dodano alias w astro.config.mjs
- [ ] Zainstalowano Tailwind CSS (`npm install -D tailwindcss`)

### Test lokalny:
- [ ] `npm run dev`
- [ ] Sprawdź http://localhost:4321
- [ ] Font Throlacon działa? (h1-h5 graffiti style)
- [ ] Kolory bloga widoczne?
- [ ] Navbar i footer działają?

### Dostosowanie:
- [ ] Zmień `title` w SimpleLayout
- [ ] Zmień `description`
- [ ] Zmień URL do bloga (blogUrl w SimpleLayout)
- [ ] Dodaj własne komponenty

---

## 🔧 KONFIGURACJA TAILWIND (opcjonalnie)

Jeśli używasz Tailwind CSS, dodaj konfigurację:

```javascript
// tailwind.config.mjs
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'theme-primary': 'var(--theme-primary)',
        'theme-secondary': 'var(--theme-secondary)',
        'theme-accent': 'var(--theme-accent)',
        'theme-accent-hover': 'var(--theme-accent-hover)',
      },
      fontFamily: {
        'graffiti': ['ThrolaconTrial', 'Impact', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
```

---

## 📚 PRZYKŁADY UŻYCIA

### Przykład 1: Prosta strona z headerem

```astro
---
import SimpleLayout from "@layouts/SimpleLayout.astro";
import "@styles/blog-theme.css";
---

<SimpleLayout title="AI Chat">
    <div class="container mx-auto px-4 py-16 text-center">
        <h1 class="animate-slide-up">🤖 AI Chat Assistant</h1>
        <p class="text-theme-primary text-xl mt-4">
            Twój inteligentny asystent gotowy do pomocy
        </p>
        
        <div class="mt-8">
            <button class="btn btn-primary">
                Rozpocznij Chat
            </button>
        </div>
    </div>
</SimpleLayout>
```

### Przykład 2: Strona z kartami

```astro
---
import SimpleLayout from "@layouts/SimpleLayout.astro";
import "@styles/blog-theme.css";
---

<SimpleLayout title="Funkcje AI">
    <div class="container mx-auto px-4 py-16">
        <h1>🚀 Nasze Funkcje</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div class="card hover-lift">
                <h3 class="card-title">Chat</h3>
                <p class="card-content">AI asystent dostępny 24/7</p>
            </div>
            
            <div class="card hover-lift">
                <h3 class="card-title">Obrazy</h3>
                <p class="card-content">Generator obrazów DALL-E</p>
            </div>
            
            <div class="card hover-lift">
                <h3 class="card-title">Głos</h3>
                <p class="card-content">Klonowanie głosu TTS</p>
            </div>
        </div>
    </div>
</SimpleLayout>
```

### Przykład 3: Formularz z przyciskami

```astro
---
import SimpleLayout from "@layouts/SimpleLayout.astro";
import "@styles/blog-theme.css";
---

<SimpleLayout title="Generator">
    <div class="container mx-auto px-4 py-16 max-w-2xl">
        <h1>✨ Generator Tekstu</h1>
        
        <div class="card mt-8">
            <form class="space-y-4">
                <div>
                    <label class="block text-theme-primary mb-2">
                        Wpisz prompt:
                    </label>
                    <textarea 
                        class="w-full p-4 bg-theme-primary border-2 border-theme-accent rounded-theme-md text-theme-primary"
                        rows="4"
                        placeholder="Opisz co chcesz wygenerować..."
                    ></textarea>
                </div>
                
                <div class="flex gap-4">
                    <button type="submit" class="btn btn-primary">
                        Generuj
                    </button>
                    <button type="reset" class="btn btn-secondary">
                        Wyczyść
                    </button>
                </div>
            </form>
        </div>
    </div>
</SimpleLayout>
```

---

## 🎨 DOSTOSOWANIE KOLORÓW

Jeśli chcesz zmienić kolory, edytuj `blog-theme.css`:

```css
:root {
  /* Twoje kolory */
  --theme-primary: #twój-kolor;
  --theme-accent: #twój-kolor;
  /* itd. */
}
```

Albo nadpisz w swojej stronie:

```astro
<style>
  :root {
    --theme-accent: #ff6b6b; /* Czerwony akcent */
  }
</style>
```

---

## 🔄 AKTUALIZACJA

Gdy zmienią się style w głównym blogu:

```powershell
# Skopiuj ponownie z _SHARED_ASSETS
cd Q:\mybonzo\AIBLOG\twoj-projekt

Copy-Item -Path "Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty\_SHARED_ASSETS\layouts\SimpleLayout.astro" `
          -Destination "src\layouts\" -Force

Copy-Item -Path "Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty\_SHARED_ASSETS\styles\blog-theme.css" `
          -Destination "src\styles\" -Force

Write-Host "✅ Zaktualizowano layout i style" -ForegroundColor Green
```

---

## 🆘 TROUBLESHOOTING

### Problem: Font się nie ładuje
**Rozwiązanie**: Sprawdź czy `Throlacon Trial.ttf` jest w `public/fonts/`

### Problem: Kolory nie działają
**Rozwiązanie**: Upewnij się że importujesz `blog-theme.css`:
```astro
import "@styles/blog-theme.css";
```

### Problem: Utility classes nie działają
**Rozwiązanie**: `blog-theme.css` musi być załadowany PRZED użyciem klas

### Problem: Navbar link nie działa
**Rozwiązanie**: Zmień `blogUrl` w SimpleLayout.astro:
```astro
const blogUrl = "https://twoja-domena.com";
```

---

## ✅ GOTOWE!

Teraz Twój projekt w AIBLOG wygląda jak główny blog MyBonzo! 🎉

### Następne kroki:
1. Dodaj własne komponenty
2. Customizuj kolory (jeśli chcesz)
3. Testuj lokalnie (`npm run dev`)
4. Deploy na Cloudflare Pages
5. Dodaj link w głównym blogu

---

**Status**: ✅ Gotowe do użycia  
**Data**: 1 listopada 2025  
**Źródło**: Q:\mybonzo\mybonzoAIblog\src\pages\eksperymenty\_SHARED_ASSETS\
