# 📋 QUICK CHECKLIST - MODERNIZACJA

## ✅ Pre-flight Check
- [x] Branch: `feature/modernization-step-by-step`
- [x] Backup: `backup-before-modernization`
- [ ] Dev server: `npm run dev` ✅
- [ ] Browser: `localhost:4321` ✅

## 🎨 Kroki do wykonania

### KROK 1: Kolory CSS (15 min)
- [ ] Backup: `cp src/styles/global.css src/styles/global.css.backup`
- [ ] Dodaj zmienne CSS do `src/styles/global.css`
- [ ] Test w przeglądarce: DevTools → sprawdź `--ai-cyan`
- [ ] Commit: `git commit -m "feat: dodaj paletę AI/Sci-Fi"`
- [ ] Tag: `git tag checkpoint-1`

### KROK 2: Tailwind Config (10 min) - OPCJONALNY
- [ ] Backup: `cp tailwind.config.mjs tailwind.config.mjs.backup`
- [ ] Dodaj kolory `ai` i `bg` do `theme.extend.colors`
- [ ] Restart dev server
- [ ] Test: Użyj `text-ai-cyan` w HTML
- [ ] Commit: `git commit -m "feat: dodaj AI colors do Tailwind"`
- [ ] Tag: `git tag checkpoint-2`

### KROK 3: Vue.js (5 min)
- [ ] Checkpoint: `git commit -m "checkpoint: przed Vue"`
- [ ] Instalacja: `npx astro add vue` (odpowiedz Y na wszystko)
- [ ] Test: Dev server działa bez błędów?
- [ ] Commit: `git commit -m "feat: dodaj integrację Vue.js"`
- [ ] Tag: `git tag checkpoint-3`

### KROK 4: Test Vue Component (15 min)
- [ ] Utwórz: `src/components/Vue/Test/HelloVue.vue`
- [ ] Dodaj do strony głównej: `import HelloVue`
- [ ] Test: Komponent widoczny? Przycisk działa?
- [ ] Commit: `git commit -m "test: dodaj Vue test component"`
- [ ] Tag: `git tag checkpoint-4`
- [ ] Cleanup: Usuń z index.astro (zostaw plik .vue)

### KROK 5: GlowButton Component (10 min)
- [ ] Utwórz: `src/components/Vue/Interactive/GlowButton.vue`
- [ ] Test na stronie: 3 przyciski (cyan, magenta, purple)
- [ ] Hover działa? Glow widoczny?
- [ ] Commit: `git commit -m "feat: dodaj GlowButton"`
- [ ] Tag: `git tag checkpoint-5`

## 🚨 Emergency Rollback Commands

```bash
# Cofnij ostatni krok
git reset --soft HEAD~1

# Cofnij do konkretnego checkpointu
git reset --hard checkpoint-X

# Przywróć z backupu (NUKE ALL)
git reset --hard backup-before-modernization
npm install
```

## 📊 Status

**Ukończone kroki:** 0/5  
**Ostatni checkpoint:** -  
**Czas pracy:** - min  

**Notatki:**
```
[Twoje notatki tutaj]
```
