# 🚀 Advanced Features Guide - Enhanced AI Chat

## Przegląd nowych funkcji

### ✨ Co nowego w wersji 1.1.0:

1. **12 modeli AI** (zamiast 4) - szczególnie zoptymalizowane pod polski język
2. **Bazy wiedzy** - 8 specjalizowanych kontekstów (programowanie, biznes, edukacja...)
3. **Custom prompty** - 8 gotowych templates + możliwość dodawania własnych
4. **Profile użytkowników** - zapisywanie ustawień, ulubionych modeli, custom promptów
5. **Smart model switching** - rekomendacje modeli według zadania
6. **Favorite models** - szybki dostęp do ulubionych modeli

---

## 📚 1. Rozszerzona lista modeli AI

### Kategorie modeli

#### 🌟 **Recommended (Polecane)**

##### Llama 3.1 70B Instruct ⭐ TOP CHOICE
- **Model:** `@cf/meta/llama-3.1-70b-instruct`
- **Polski:** ⭐⭐⭐⭐⭐ (Doskonały)
- **Prędkość:** Medium
- **Context:** 128K tokens
- **Najlepszy do:** Wszystko - rozmowy, analiza, kod, kreatywność
- **Dlaczego warto:** Najbardziej uniwersalny, najwyższa jakość odpowiedzi

##### Llama 3.1 8B Instruct ⚡ FAST
- **Model:** `@cf/meta/llama-3.1-8b-instruct`
- **Polski:** ⭐⭐⭐⭐ (Bardzo dobry)
- **Prędkość:** Fast
- **Context:** 128K tokens
- **Najlepszy do:** Szybkie odpowiedzi przy wysokiej jakości
- **Dlaczego warto:** Świetny balans szybkość/jakość

---

#### 🧠 **Reasoning (Rozumowanie)**

##### Qwen QWQ 32B - Deep Thinking
- **Model:** `@cf/qwen/qwq-32b`
- **Polski:** ⭐⭐⭐⭐ (Bardzo dobry)
- **Prędkość:** Slow
- **Context:** 32K tokens
- **Najlepszy do:** Długa analiza, krok po kroku reasoning
- **Przykłady użycia:**
  - Złożone problemy matematyczne
  - Analiza biznesowa
  - Debugging skomplikowanego kodu
  - Planowanie strategiczne

##### Mistral 7B Instruct
- **Model:** `@cf/mistral/mistral-7b-instruct-v0.2`
- **Polski:** ⭐⭐⭐⭐ (Bardzo dobry)
- **Prędkość:** Medium
- **Context:** 32K tokens
- **Najlepszy do:** Analityczne zadania, problem solving
- **Specjalność:** Logiczne rozumowanie, wzorce

---

#### 💻 **Coding (Programowanie)**

##### DeepSeek Coder 6.7B - Code Specialist
- **Model:** `@cf/deepseek-ai/deepseek-coder-6.7b-instruct-awq`
- **Polski:** ⭐⭐⭐ (Dobry w kontekście kodu)
- **Prędkość:** Fast
- **Context:** 16K tokens
- **Najlepszy do:** Generowanie kodu, debugging, code review
- **Języki:** Python, JavaScript, TypeScript, Java, C++, Go, Rust...
- **Przykłady użycia:**
  - Pisanie funkcji od zera
  - Refactoring kodu
  - Wyjaśnianie algorytmów
  - Code review

##### Llama 3 8B Instruct
- **Model:** `@cf/meta/llama-3-8b-instruct`
- **Polski:** ⭐⭐⭐⭐ (Bardzo dobry)
- **Prędkość:** Fast
- **Specjalność:** Full-stack development

---

#### ⚡ **Fast (Szybkie odpowiedzi)**

##### Phi-2 - Lightning Fast
- **Model:** `@cf/microsoft/phi-2`
- **Polski:** ⭐⭐⭐ (Dobry)
- **Prędkość:** Very Fast
- **Context:** 2K tokens
- **Najlepszy do:** Quick Q&A, proste podpowiedzi
- **Use case:** Gdy liczy się szybkość, nie głębia

##### TinyLlama 1.1B - Ultra Fast
- **Model:** `@cf/tinyllama/tinyllama-1.1b-chat-v1.0`
- **Polski:** ⭐⭐ (Podstawowy)
- **Prędkość:** Ultra Fast
- **Context:** 2K tokens
- **Najlepszy do:** Najprostsze zapytania
- **Uwaga:** Ograniczona znajomość polskiego

---

#### 🌍 **Multilingual (Wielojęzyczne)**

##### OpenChat 3.5 - Natural Dialogue
- **Model:** `@cf/openchat/openchat-3.5-0106`
- **Polski:** ⭐⭐⭐⭐ (Bardzo dobry)
- **Prędkość:** Medium
- **Najlepszy do:** Swobodna konwersacja
- **Specjalność:** Naturalny, przyjemny styl

##### Llama 2 7B Chat
- **Model:** `@cf/meta/llama-2-7b-chat-fp16`
- **Polski:** ⭐⭐⭐ (Dobry)
- **Prędkość:** Fast
- **Najlepszy do:** Ogólne rozmowy

---

#### ✍️ **Creative (Kreatywność)**

##### Mistral 7B v0.1 - Creative Writing
- **Model:** `@cf/mistral/mistral-7b-instruct-v0.1`
- **Polski:** ⭐⭐⭐⭐ (Bardzo dobry)
- **Prędkość:** Medium
- **Najlepszy do:** Pisanie creative content
- **Przykłady:**
  - Posty blogowe
  - Storytelling
  - Copywriting
  - Content marketing

---

## 🎯 2. Bazy wiedzy (Knowledge Bases)

### Czym są bazy wiedzy?

Bazy wiedzy to **specjalizowane system prompty**, które zmieniają sposób w jaki AI odpowiada. Każda baza wiedzy:
- Dostosowuje styl odpowiedzi
- Dodaje ekspercką wiedzę w danej dziedzinie
- Używa specjalistycznego języka
- Może sugerować najlepszy model dla zadania

### Dostępne bazy wiedzy

#### 🌐 **Ogólna Wiedza** (Default)
- **Dla kogo:** Wszyscy
- **Styl:** Uniwersalny, profesjonalny
- **Model:** Dowolny
- **Przykłady pytań:**
  - Ogólne pytania o świat
  - Ciekawostki
  - Porady życiowe

---

#### 💻 **Programowanie**
- **Dla kogo:** Developerzy, programiści
- **Styl:** Techniczny, z przykładami kodu
- **Sugerowany model:** DeepSeek Coder 6.7B
- **Specjalizacja:**
  - Pisanie kodu (wszystkie języki)
  - Debugging i optymalizacja
  - Architektura oprogramowania
  - Best practices
  - Code reviews

**Przykładowa interakcja:**
```
User: Jak zoptymalizować tę funkcję React?
AI: Widzę kilka możliwości optymalizacji:

1. **React.memo()** - zapobiegnie niepotrzebnym re-renderom
2. **useMemo()** dla expensive calculations
3. **useCallback()** dla event handlerów

Oto zoptymalizowany kod:
```javascript
const OptimizedComponent = React.memo(({ data }) => {
  const expensiveValue = useMemo(() => {
    return data.reduce((acc, item) => acc + item.value, 0);
  }, [data]);

  const handleClick = useCallback(() => {
    console.log(expensiveValue);
  }, [expensiveValue]);

  return <div onClick={handleClick}>{expensiveValue}</div>;
});
```
```

---

#### 💼 **Business & Marketing**
- **Dla kogo:** Przedsiębiorcy, marketerzy, PM
- **Styl:** Biznesowy, strategiczny
- **Sugerowany model:** Llama 3.1 70B
- **Specjalizacja:**
  - Strategia biznesowa
  - Marketing cyfrowy
  - Analiza rynku
  - ROI i metryki
  - Brand building

**Przykład:**
```
User: Jak zwiększyć konwersję w e-commerce?
AI: Oto sprawdzone strategie zwiększania konwersji:

**1. Optymalizacja checkout** (największy impact)
- One-page checkout (↑35% konwersji)
- Guest checkout option
- Multiple payment methods
- Progress indicator

**2. Social Proof**
- Reviews i ratings (↑20-30%)
- "X osób kupiło w ciągu 24h"
- Trust badges
...
```

---

#### 📚 **Edukacja**
- **Dla kogo:** Studenci, nauczyciele, osoby uczące się
- **Styl:** Pedagogiczny, z przykładami
- **Sugerowany model:** Llama 3.1 70B
- **Specjalizacja:**
  - Wyjaśnianie konceptów ELI5
  - Krok po kroku tutorials
  - Analogie i przykłady
  - Quizy i testy

**Przykład:**
```
User: Wyjaśnij jak działa blockchain
AI: Świetnie! Wyobraź sobie blockchain jak **zeszyt, który wszyscy widzą**:

**Analogia:**
1. Masz klasę 30 osób
2. Każdy ma identyczny zeszyt
3. Gdy ktoś coś zapisze, wszyscy przepisują to samo
4. Nie można zmienić przeszłych stron (tylko dodawać nowe)

**Tak działa blockchain:**
- "Strony" = bloki
- "Zeszyt" = chain (łańcuch)
- "Uczniowie" = nodes (węzły)
...
```

---

#### ✍️ **Kreatywność**
- **Dla kogo:** Pisarze, content creatorzy
- **Styl:** Kreatywny, angażujący
- **Sugerowany model:** Mistral 7B v0.1
- **Specjalizacja:**
  - Storytelling
  - Copywriting
  - Content marketing
  - SEO writing

---

#### 📊 **Data Science & AI**
- **Dla kogo:** Data scientists, ML engineers
- **Styl:** Techniczny, z kodem Python
- **Sugerowany model:** Llama 3.1 70B
- **Specjalizacja:**
  - Machine Learning
  - Analiza danych
  - Python (pandas, numpy, sklearn)
  - Wizualizacje
  - MLOps

---

#### 🏥 **Zdrowie & Wellness**
- **Dla kogo:** Osoby dbające o zdrowie
- **Styl:** Troskliwy, bezpieczny
- **WAŻNE:** Nie diagnozuje, nie przepisuje leków
- **Specjalizacja:**
  - Ogólne info o zdrowiu
  - Fitness i treningi
  - Odżywianie
  - Wellness

---

#### ⚖️ **Prawo & Regulacje**
- **Dla kogo:** Osoby potrzebujące info prawnych
- **Styl:** Formalny, precyzyjny
- **WAŻNE:** Nie zastępuje prawnika
- **Specjalizacja:**
  - Ogólne info prawne
  - RODO
  - Prawa konsumenta
  - IP i copyright

---

## 🎨 3. Custom Prompty (Szablony)

### Gotowe templates

#### 🔍 **Code Review**
```
Przeanalizuj poniższy kod i dokonaj code review. Zwróć uwagę na:
1. Bezpieczeństwo i potencjalne vulnerabilities
2. Wydajność i optymalizacje
3. Czytelność i maintainability
4. Best practices i wzorce
5. Testy i edge cases
```

**Użycie:**
1. Wybierz "Code Review" z listy templates
2. Wklej swój kod
3. Otrzymaj szczegółową analizę

---

#### 🎈 **Explain Like I'm 5**
```
Wyjaśnij poniższy koncept w sposób bardzo prosty, używając:
- Analogii z życia codziennego
- Prostego języka bez żargonu
- Przykładów, które zrozumie każdy
```

**Przykład:**
```
User: [ELI5] Jak działa internet?
AI: Internet to jak **gigantyczna poczta dla komputerów**!

Wyobraź sobie:
- Twój komputer to dom z adresem
- Wiadomości to listy
- Router to poczta w Twojej dzielnicy
...
```

---

#### 📝 **Blog Post Generator**
```
Napisz post blogowy. Powinien zawierać:
1. Chwytliwy tytuł (H1)
2. Wprowadzenie (hook + wartość)
3. 3-5 sekcji z nagłówkami
4. Zakończenie z CTA
5. SEO optimization
```

---

#### 🐛 **Debug Helper**
```
Pomóż mi zdebugować poniższy problem:
1. Przeanalizuj błąd
2. Wyjaśnij możliwe przyczyny
3. Zaproponuj kroki debugowania
4. Podaj rozwiązania
```

---

#### 💼 **Business Plan**
```
Pomóż stworzyć szkic business planu:
1. Executive Summary
2. Analiza rynku
3. Value proposition
4. Model biznesowy
5. Strategia marketingowa
```

---

#### 📄 **Summary**
```
Stwórz zwięzłe streszczenie:
1. Kluczowe punkty (3-5 bullet points)
2. Główna teza
3. Ważne szczegóły
4. Akcje do wykonania
```

---

#### 🌍 **Translate & Improve**
```
Przetłumacz i popraw styl:
1. Dokładne tłumaczenie
2. Naturalna polszczyzna
3. Popraw gramatykę
4. Dostosuj styl
```

---

#### ⚖️ **Compare Options**
```
Porównaj opcje i pomóż wybrać:
1. Pros & Cons każdej opcji
2. Tabela porównawcza
3. Use cases
4. Rekomendacja
```

---

### Tworzenie własnych promptów

**Dla użytkowników z profilem:**

1. Przejdź do ustawień profilu
2. "Custom Prompts" → "Add New"
3. Wypełnij formularz:
   - **Nazwa:** Krótka, opisowa
   - **Opis:** Co robi ten prompt
   - **Kategoria:** coding / business / creative / general
   - **Icon:** Emoji (opcjonalnie)
   - **Prompt:** Pełna instrukcja dla AI

4. Zapisz - prompt będzie dostępny tylko dla Ciebie

**Przykład custom promptu:**

```
Nazwa: "API Documentation Generator"
Kategoria: coding
Icon: 📚

Prompt:
Wygeneruj dokumentację API dla poniższego kodu:

1. Endpoint description
2. HTTP method i URL
3. Request parameters (query, body)
4. Response format (success & error)
5. Example request (curl)
6. Example response (JSON)
7. Possible errors

Format: Markdown, gotowy do skopiowania do README.
```

---

## 👤 4. Profile użytkowników

### Tryb gość vs Profil

| Feature | Tryb Gość | Profil Użytkownika |
|---------|-----------|-------------------|
| Podstawowy chat | ✅ | ✅ |
| Historia konwersacji | ✅ | ✅ |
| Zapisywanie ustawień | ❌ (session) | ✅ (permanent) |
| Custom prompty | ❌ | ✅ |
| Ulubione modele | ❌ | ✅ |
| Custom system prompt | ❌ | ✅ |
| Export/Import profilu | ❌ | ✅ |

### Tworzenie profilu

1. Kliknij "Create Profile" w ustawieniach
2. Podaj nazwę (np. "Mój profil pracy")
3. Profil zostanie utworzony z domyślnymi ustawieniami
4. Możesz teraz dostosować wszystkie opcje

### Zarządzanie profilami

#### Ustawienia profilu

```typescript
{
  // Model preferences
  defaultModel: string,              // Domyślny model
  favoriteModels: string[],          // Lista ulubionych

  // Knowledge base
  defaultKnowledgeBase: string,      // Domyślna baza wiedzy

  // Custom system prompt
  customSystemPrompt?: string,       // Twój własny system prompt
  useCustomSystemPrompt: boolean,    // Czy używać custom

  // UI preferences
  theme: 'auto' | 'light' | 'dark',
  streamingEnabled: boolean,
  sidebarOpen: boolean,

  // Chat preferences
  defaultTemperature: number,        // 0.0 - 1.0
  defaultMaxTokens: number,          // max tokens w odpowiedzi
  autoSaveConversations: boolean
}
```

#### Ulubione modele

**Dodaj do ulubionych:**
1. Wybierz model z listy
2. Kliknij gwiazdkę ⭐
3. Model pojawi się na górze listy

**Szybki dostęp:**
- Ulubione modele zawsze na top
- Sortowanie alfabetyczne
- Highlight w dropdown

#### Custom System Prompt

**Co to jest?**
System prompt to instrukcje dla AI, które definiują jak ma się zachowywać.

**Przykład podstawowy:**
```
Jesteś pomocnym asystentem AI. Odpowiadasz po polsku.
```

**Przykład zaawansowany:**
```
Jesteś senior software architektem z 15-letnim doświadczeniem.

Specjalizacje:
- Microservices architecture
- Cloud-native applications (AWS, GCP, Azure)
- DDD (Domain-Driven Design)
- Event-driven systems

Twój styl odpowiedzi:
- Zawsze myśl o skalowalności i maintainability
- Proponuj rozwiązania z uzasadnieniem (tradeoffs)
- Używaj diagramów (mermaid) gdy to możliwe
- Przykłady kodu z komentarzami
- Zawsze uwzględniaj bezpieczeństwo

Odpowiadaj po polsku. Używaj markdown formatting.
```

**Jak używać:**
1. Idź do Profile Settings
2. "Custom System Prompt" → włącz
3. Wpisz swój prompt
4. Zapisz
5. Od teraz każda rozmowa używa Twojego promptu!

**Wskazówki:**
- Bądź specific - czym bardziej szczegółowy, tym lepiej
- Definiuj styl odpowiedzi
- Dodaj przykłady jeśli to pomaga
- Możesz łączyć z bazami wiedzy

---

## 🔄 5. Smart Model Switching

### Auto-sugestie modeli

System automatycznie sugeruje najlepszy model według:
- Wybranej bazy wiedzy
- Typu zapytania (detekcja keywords)
- Historii użycia
- Jakości polskiego (jeśli ważny)

**Przykłady:**

```
User: "Napisz funkcję Python do..."
→ Sugeruje: DeepSeek Coder 6.7B
```

```
User: "Przeanalizuj business case..."
→ Sugeruje: Llama 3.1 70B + Business KB
```

```
User: "Szybka odpowiedź - co to CORS?"
→ Sugeruje: Llama 3.1 8B (fast)
```

### Filtrowanie modeli

**Po kategorii:**
- General
- Reasoning
- Coding
- Fast
- Creative

**Po capabilities:**
- Polish (dobry polski)
- Code (programowanie)
- Fast (szybki)
- Large Context (duży context window)

**Po jakości polskiego:**
- ⭐⭐⭐⭐⭐ (5 stars) - Doskonały
- ⭐⭐⭐⭐ (4 stars) - Bardzo dobry
- ⭐⭐⭐ (3 stars) - Dobry
- ⭐⭐ (2 stars) - Podstawowy

---

## 🎯 6. Przykłady użycia

### Scenario 1: Developer piszący kod

**Setup:**
```
Profile: "Dev Work"
Default Model: DeepSeek Coder 6.7B
Knowledge Base: Programming
Custom Prompt: "Senior developer with focus on clean code..."
```

**Workflow:**
1. Zadaj pytanie o kod
2. AI używa Programming KB + DeepSeek
3. Dostaniesz kod + wyjaśnienia
4. Możesz użyć "Code Review" template do analizy

---

### Scenario 2: Content Creator

**Setup:**
```
Profile: "Content Creation"
Default Model: Mistral 7B v0.1
Knowledge Base: Creativity
Favorite Templates: Blog Post, Summary
```

**Workflow:**
1. "Blog Post" template
2. Opisz temat
3. AI generuje full article z SEO
4. Edit i publish

---

### Scenario 3: Student uczący się

**Setup:**
```
Profile: "Nauka"
Default Model: Llama 3.1 70B
Knowledge Base: Education
Streaming: ON (żeby widzieć reasoning)
```

**Workflow:**
1. "ELI5" template dla trudnych konceptów
2. AI wyjaśnia prosto z przykładami
3. Pytaj follow-up questions
4. Save conversation dla późniejszego review

---

### Scenario 4: Business Analyst

**Setup:**
```
Profile: "Business"
Default Models: Llama 3.1 70B, Qwen QWQ 32B (reasoning)
Knowledge Base: Business & Marketing
Custom Prompts: "Competitor Analysis", "Market Research"
```

**Workflow:**
1. Używaj "Compare Options" dla decyzji
2. Qwen QWQ dla deep analysis
3. "Business Plan" template dla strategii
4. Export do PDF dla prezentacji

---

## ⚙️ 7. Best Practices

### Wybór modelu

**Dla polskiego języka (priorytet):**
1. Llama 3.1 70B (najlepszy overall)
2. Llama 3.1 8B (szybki + jakość)
3. Gemma 3 12B (balans)
4. Mistral 7B (creative)

**Dla speed (priorytet):**
1. Llama 3.1 8B
2. Phi-2
3. TinyLlama (ultra fast, basic polish)

**Dla reasoning (priorytet):**
1. Qwen QWQ 32B (best)
2. Mistral 7B v0.2
3. Llama 3.1 70B

**Dla code (priorytet):**
1. DeepSeek Coder (specialized)
2. Llama 3.1 70B (general)
3. Llama 3 8B (fast coding)

### Optymalizacja kosztów

**Low cost setup:**
- Default: Llama 3.1 8B
- Coding: DeepSeek Coder
- Reasoning: Mistral 7B
- Fast: Phi-2

**Balanced setup:**
- Default: Llama 3.1 70B
- Fast: Llama 3.1 8B
- Reasoning: Qwen QWQ 32B

**Premium setup:**
- Everything: Llama 3.1 70B
- Deep reasoning: Qwen QWQ 32B

### Custom Prompt tips

✅ **DO:**
- Bądź specific o stylu odpowiedzi
- Definiuj format (markdown, bullet points...)
- Dodaj przykłady jeśli możliwe
- Używaj struktury (lists, sections)

❌ **DON'T:**
- Zbyt długie prompty (>500 słów)
- Sprzeczne instrukcje
- Zbyt ogólne ("bądź helpful")

---

## 🔧 8. Troubleshooting

### Model nie rozumie polskiego dobrze

**Rozwiązanie:**
1. Przełącz na model z ⭐⭐⭐⭐⭐ lub ⭐⭐⭐⭐
2. Użyj Llama 3.1 70B / 8B
3. Sprawdź czy wybrałeś właściwą bazę wiedzy

### Custom prompt nie działa

**Sprawdź:**
1. Czy "Use Custom System Prompt" jest włączony
2. Czy prompt nie jest za długi
3. Czy nie ma konfliktów z bazą wiedzy
4. Spróbuj prostszego promptu na test

### Profile nie zapisuje ustawień

**Rozwiązanie:**
1. Sprawdź localStorage (quota)
2. Wyeksportuj profil (backup)
3. Wyczyść stare profile
4. Zaimportuj backup

---

## 📞 Support

**Pytania?**
- 📖 Docs: ENHANCED_CHAT_DOCS.md
- 🐛 Issues: GitHub
- 📧 Email: support@mybonzoaiblog.com

---

**Version:** 1.1.0
**Last Updated:** 2025-01-30
**New Features:** 12 models, 8 knowledge bases, custom prompts, user profiles
