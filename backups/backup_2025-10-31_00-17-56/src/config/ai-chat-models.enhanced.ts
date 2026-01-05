/**
 * Enhanced AI Chat Models Configuration
 *
 * Rozszerzona konfiguracja modeli AI z:
 * - Większą liczbą modeli Cloudflare AI
 * - Szczególnym uwzględnieniem modeli dobrze rozumiejących polski
 * - Kategoriami i tagami dla łatwego filtrowania
 * - Parametrami wydajności i kosztów
 */

export type ModelCategory = 'general' | 'reasoning' | 'creative' | 'coding' | 'fast' | 'multilingual';

export type ModelCapability = 'polish' | 'reasoning' | 'code' | 'creative' | 'fast' | 'large-context';

export interface ChatModelOption {
  id: string;
  label: string;
  description: string;
  usageHint?: string;
  category: ModelCategory;
  capabilities: ModelCapability[];
  polishQuality: 1 | 2 | 3 | 4 | 5; // 5 = excellent
  speed: 'fast' | 'medium' | 'slow';
  contextWindow: number; // tokens
  maxTokens: number;
  defaultTemperature: number;
  cost: 'low' | 'medium' | 'high';
  recommended?: boolean;
  beta?: boolean;
}

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  icon: string;
  systemPrompt: string;
  defaultModel?: string;
  enabled: boolean;
}

export interface CustomPromptTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  category: string;
  icon: string;
  userCreated?: boolean;
}

// ========== ENHANCED MODEL CATALOG ==========

export const ENHANCED_CHAT_MODELS: ChatModelOption[] = [
  // === RECOMMENDED MODELS ===
  {
    id: '@cf/meta/llama-3.1-70b-instruct',
    label: 'Llama 3.1 70B Instruct',
    description: 'Najnowszy model Meta. Doskonała jakość po polsku, rozumowanie i wiedza ogólna. Najbardziej uniwersalny wybór.',
    usageHint: 'Najlepszy wybór dla większości zadań - rozmowy, analiza, kod, kreatywność.',
    category: 'general',
    capabilities: ['polish', 'reasoning', 'code', 'creative', 'large-context'],
    polishQuality: 5,
    speed: 'medium',
    contextWindow: 128000,
    maxTokens: 4096,
    defaultTemperature: 0.7,
    cost: 'medium',
    recommended: true
  },
  {
    id: '@cf/meta/llama-3.1-8b-instruct',
    label: 'Llama 3.1 8B Instruct',
    description: 'Szybka wersja Llama 3.1. Bardzo dobry polski, świetna jakość przy niskim koszcie.',
    usageHint: 'Szybkie odpowiedzi przy zachowaniu wysokiej jakości.',
    category: 'fast',
    capabilities: ['polish', 'fast', 'code'],
    polishQuality: 4,
    speed: 'fast',
    contextWindow: 128000,
    maxTokens: 2048,
    defaultTemperature: 0.7,
    cost: 'low',
    recommended: true
  },
  {
    id: '@cf/google/gemma-3-12b-it',
    label: 'Gemma 3 12B IT',
    description: 'Model Google. Bardzo dobra jakość odpowiedzi po polsku, stabilny balans między ceną a mocą.',
    usageHint: 'Polecany do większości rozmów i porad eksperckich.',
    category: 'general',
    capabilities: ['polish', 'reasoning'],
    polishQuality: 4,
    speed: 'medium',
    contextWindow: 8192,
    maxTokens: 2048,
    defaultTemperature: 0.7,
    cost: 'medium'
  },

  // === REASONING MODELS ===
  {
    id: '@cf/qwen/qwq-32b',
    label: 'Qwen QWQ 32B',
    description: 'Model reasoning od Alibaba. Silny w wnioskowaniu i zadaniach złożonych, zachowuje płynny język polski.',
    usageHint: 'Użyj, gdy potrzebujesz długiej analizy lub odpowiedzi krok po kroku.',
    category: 'reasoning',
    capabilities: ['polish', 'reasoning', 'large-context'],
    polishQuality: 4,
    speed: 'slow',
    contextWindow: 32768,
    maxTokens: 4096,
    defaultTemperature: 0.6,
    cost: 'high'
  },
  {
    id: '@cf/mistral/mistral-7b-instruct-v0.2',
    label: 'Mistral 7B Instruct',
    description: 'Mistral AI. Doskonały w rozumowaniu logicznym, dobra znajomość polskiego.',
    usageHint: 'Świetny do analitycznych zadań i rozwiązywania problemów.',
    category: 'reasoning',
    capabilities: ['polish', 'reasoning', 'code'],
    polishQuality: 4,
    speed: 'medium',
    contextWindow: 32768,
    maxTokens: 2048,
    defaultTemperature: 0.6,
    cost: 'low'
  },

  // === CODING MODELS ===
  {
    id: '@cf/deepseek-ai/deepseek-coder-6.7b-instruct-awq',
    label: 'DeepSeek Coder 6.7B',
    description: 'Specjalizowany model do kodowania. Rozumie polski w kontekście programowania.',
    usageHint: 'Najlepszy wybór do generowania kodu, debugowania i wyjaśniania kodu.',
    category: 'coding',
    capabilities: ['code', 'polish', 'reasoning'],
    polishQuality: 3,
    speed: 'fast',
    contextWindow: 16384,
    maxTokens: 2048,
    defaultTemperature: 0.4,
    cost: 'low'
  },
  {
    id: '@cf/meta/llama-3-8b-instruct',
    label: 'Llama 3 8B Instruct',
    description: 'Poprzednia generacja Llama. Nadal świetny w kodowaniu i polskim.',
    usageHint: 'Alternatywa dla Llama 3.1 gdy potrzebujesz szybszej odpowiedzi.',
    category: 'coding',
    capabilities: ['code', 'polish', 'fast'],
    polishQuality: 4,
    speed: 'fast',
    contextWindow: 8192,
    maxTokens: 2048,
    defaultTemperature: 0.5,
    cost: 'low'
  },

  // === FAST MODELS ===
  {
    id: '@cf/microsoft/phi-2',
    label: 'Phi-2',
    description: 'Lekki model Microsoftu. Szybkie odpowiedzi, niższy koszt, dobrze radzi sobie z krótkimi zapytaniami.',
    usageHint: 'Dobry wybór do szybkich Q&A i prostych podpowiedzi.',
    category: 'fast',
    capabilities: ['fast', 'polish'],
    polishQuality: 3,
    speed: 'fast',
    contextWindow: 2048,
    maxTokens: 1024,
    defaultTemperature: 0.7,
    cost: 'low'
  },
  {
    id: '@cf/tinyllama/tinyllama-1.1b-chat-v1.0',
    label: 'TinyLlama 1.1B',
    description: 'Najmniejszy model. Bardzo szybki, podstawowa znajomość polskiego.',
    usageHint: 'Ultra szybkie odpowiedzi dla prostych pytań.',
    category: 'fast',
    capabilities: ['fast'],
    polishQuality: 2,
    speed: 'fast',
    contextWindow: 2048,
    maxTokens: 512,
    defaultTemperature: 0.8,
    cost: 'low'
  },

  // === MULTILINGUAL MODELS ===
  {
    id: '@cf/openchat/openchat-3.5-0106',
    label: 'OpenChat 3.5',
    description: 'Model rozmów OpenChat. Naturalny styl dialogu, przyjemny ton i wsparcie polskiego.',
    usageHint: 'Idealny, gdy zależy Ci na swobodniejszej konwersacji.',
    category: 'multilingual',
    capabilities: ['polish', 'creative'],
    polishQuality: 4,
    speed: 'medium',
    contextWindow: 8192,
    maxTokens: 2048,
    defaultTemperature: 0.8,
    cost: 'medium'
  },
  {
    id: '@cf/meta/llama-2-7b-chat-fp16',
    label: 'Llama 2 7B Chat',
    description: 'Klasyczny Llama 2. Dobry w wielu językach, w tym polskim.',
    usageHint: 'Sprawdzony model do ogólnych rozmów.',
    category: 'multilingual',
    capabilities: ['polish', 'creative'],
    polishQuality: 3,
    speed: 'fast',
    contextWindow: 4096,
    maxTokens: 1024,
    defaultTemperature: 0.7,
    cost: 'low'
  },

  // === CREATIVE MODELS ===
  {
    id: '@cf/mistral/mistral-7b-instruct-v0.1',
    label: 'Mistral 7B v0.1',
    description: 'Pierwsza wersja Mistral. Kreatywny i ekspresyjny, dobra polszczyzna.',
    usageHint: 'Świetny do pisania creative content po polsku.',
    category: 'creative',
    capabilities: ['creative', 'polish'],
    polishQuality: 4,
    speed: 'medium',
    contextWindow: 8192,
    maxTokens: 2048,
    defaultTemperature: 0.9,
    cost: 'low'
  }
];

// ========== KNOWLEDGE BASES ==========

export const KNOWLEDGE_BASES: KnowledgeBase[] = [
  {
    id: 'general',
    name: 'Ogólna Wiedza',
    description: 'Standard - bez specjalizacji, uniwersalne odpowiedzi',
    icon: '🌐',
    systemPrompt: 'Jesteś pomocnym asystentem AI. Odpowiadasz po polsku w sposób profesjonalny i rzeczowy.',
    enabled: true
  },
  {
    id: 'programming',
    name: 'Programowanie',
    description: 'Specjalizacja: kod, debugging, architecture, best practices',
    icon: '💻',
    systemPrompt: `Jesteś ekspertem programistycznym. Specjalizujesz się w:
- Pisaniu czystego, wydajnego kodu
- Debugowaniu i rozwiązywaniu problemów
- Architekturze oprogramowania
- Best practices i wzorcach projektowych
- Code reviews i optymalizacji

Odpowiadasz po polsku. Używaj bloków kodu markdown. Wyjaśniaj szczegółowo.`,
    defaultModel: '@cf/deepseek-ai/deepseek-coder-6.7b-instruct-awq',
    enabled: true
  },
  {
    id: 'business',
    name: 'Business & Marketing',
    description: 'Specjalizacja: strategia, marketing, analiza biznesowa',
    icon: '💼',
    systemPrompt: `Jesteś konsultantem biznesowym i marketingowym. Specjalizujesz się w:
- Strategii biznesowej i rozwoju
- Marketingu cyfrowego i content marketingu
- Analizie rynku i konkurencji
- Budowaniu marki
- ROI i metrykach biznesowych

Odpowiadasz po polsku. Podajesz konkretne, praktyczne porady z przykładami.`,
    defaultModel: '@cf/meta/llama-3.1-70b-instruct',
    enabled: true
  },
  {
    id: 'education',
    name: 'Edukacja',
    description: 'Specjalizacja: nauka, wyjaśnianie konceptów, tutoring',
    icon: '📚',
    systemPrompt: `Jesteś nauczycielem i edukatorem. Specjalizujesz się w:
- Wyjaśnianiu skomplikowanych konceptów w prosty sposób
- Dostosowywaniu wyjaśnień do poziomu słuchacza
- Używaniu analogii i przykładów
- Krok po kroku instrukcjach
- Zachęcaniu do krytycznego myślenia

Odpowiadasz po polsku. Używaj prostego języka i przykładów z życia.`,
    defaultModel: '@cf/meta/llama-3.1-70b-instruct',
    enabled: true
  },
  {
    id: 'creative',
    name: 'Kreatywność',
    description: 'Specjalizacja: pisanie, storytelling, content creation',
    icon: '✍️',
    systemPrompt: `Jesteś creative writerem i storytellerem. Specjalizujesz się w:
- Tworzeniu angażującego contentu
- Storytellingu i narracji
- Copywritingu i content marketingu
- Kreatywnym pisaniu (artykuły, posty, scenariusze)
- SEO i content optimization

Odpowiadasz po polsku. Piszesz kreatywnie, angażująco i z pazurem.`,
    defaultModel: '@cf/mistral/mistral-7b-instruct-v0.1',
    enabled: true
  },
  {
    id: 'data-science',
    name: 'Data Science & AI',
    description: 'Specjalizacja: ML, AI, analiza danych, statistyka',
    icon: '📊',
    systemPrompt: `Jesteś ekspertem Data Science i AI. Specjalizujesz się w:
- Machine Learning i Deep Learning
- Analizie danych i statystyce
- Python (pandas, numpy, sklearn, pytorch)
- Wizualizacji danych
- Model deployment i MLOps

Odpowiadasz po polsku. Dostarczasz kod Python, wykresy, wyjaśnienia techniczne.`,
    defaultModel: '@cf/meta/llama-3.1-70b-instruct',
    enabled: true
  },
  {
    id: 'health',
    name: 'Zdrowie & Wellness',
    description: 'Specjalizacja: zdrowie, fitness, wellness, odżywianie',
    icon: '🏥',
    systemPrompt: `Jesteś doradcą zdrowotnym i wellness. Specjalizujesz się w:
- Ogólnych informacjach o zdrowiu
- Fitness i treningach
- Odżywianiu i dietach
- Wellness i mindfulness
- Zdrowym stylu życia

WAŻNE: Nie diagnozujesz chorób, nie przepisujesz leków. Zawsze sugerujesz konsultację z lekarzem w poważnych sprawach.
Odpowiadasz po polsku. Dostarczasz praktyczne, bezpieczne porady.`,
    defaultModel: '@cf/meta/llama-3.1-70b-instruct',
    enabled: true
  },
  {
    id: 'legal',
    name: 'Prawo & Regulacje',
    description: 'Specjalizacja: prawo (ogólne informacje), RODO, compliance',
    icon: '⚖️',
    systemPrompt: `Jesteś doradcą prawnym (ogólne informacje). Specjalizujesz się w:
- Ogólnych informacjach prawnych
- RODO i privacy
- Compliance i regulacjach
- Prawach konsumenta
- IP i copyright

WAŻNE: Nie zastępujesz profesjonalnej porady prawnej. Zawsze sugerujesz konsultację z prawnikiem w konkretnych sprawach.
Odpowiadasz po polsku. Wyjaśniasz przepisy w przystępny sposób.`,
    defaultModel: '@cf/qwen/qwq-32b',
    enabled: true
  }
];

// ========== CUSTOM PROMPT TEMPLATES ==========

export const DEFAULT_PROMPT_TEMPLATES: CustomPromptTemplate[] = [
  {
    id: 'code-review',
    name: 'Code Review',
    description: 'Przegląd kodu z sugestiami ulepszeń',
    prompt: `Przeanalizuj poniższy kod i dokonaj code review. Zwróć uwagę na:
1. Bezpieczeństwo i potencjalne vulnerabilities
2. Wydajność i optymalizacje
3. Czytelność i maintainability
4. Best practices i wzorce
5. Testy i edge cases

Podaj konkretne sugestie ulepszeń.`,
    category: 'coding',
    icon: '🔍'
  },
  {
    id: 'explain-eli5',
    name: 'Wyjaśnij jak dla 5-latka',
    description: 'Proste wyjaśnienie złożonych konceptów',
    prompt: `Wyjaśnij poniższy koncept w sposób bardzo prosty, używając:
- Analogii z życia codziennego
- Prostego języka bez żargonu
- Przykładów, które zrozumie każdy
- Storytellingu jeśli to pomoże

Cel: osoba bez wiedzy technicznej powinna zrozumieć.`,
    category: 'education',
    icon: '🎈'
  },
  {
    id: 'blog-post',
    name: 'Napisz post blogowy',
    description: 'SEO-friendly artykuł blogowy',
    prompt: `Napisz post blogowy na temat poniżej. Powinien zawierać:
1. Chwytliwy tytuł (H1)
2. Wprowadzenie (hook + wartość dla czytelnika)
3. 3-5 sekcji z nagłówkami H2
4. Bullet points i listy dla czytelności
5. Zakończenie z CTA
6. Optymalizacja SEO (keywords, meta description)

Długość: 800-1200 słów. Ton: profesjonalny ale przystępny.`,
    category: 'creative',
    icon: '📝'
  },
  {
    id: 'debug-help',
    name: 'Pomoc z debugowaniem',
    description: 'Analiza błędu i sugestie rozwiązań',
    prompt: `Pomóż mi zdebugować poniższy problem:

1. Przeanalizuj błąd/problem
2. Wyjaśnij możliwe przyczyny
3. Zaproponuj kroki debugowania
4. Podaj możliwe rozwiązania (od najprostszego)
5. Wskaż jak zapobiec temu w przyszłości

Bądź konkretny i podaj przykłady kodu jeśli to możliwe.`,
    category: 'coding',
    icon: '🐛'
  },
  {
    id: 'business-plan',
    name: 'Business Plan',
    description: 'Szkic planu biznesowego',
    prompt: `Pomóż mi stworzyć szkic business planu dla poniższego pomysłu:

Uwzględnij:
1. Executive Summary
2. Analiza rynku i konkurencji
3. Propozycja wartości (value proposition)
4. Model biznesowy
5. Strategia marketingowa
6. Projekcje finansowe (high-level)
7. Kluczowe ryzyka i mitigation

Format: profesjonalny, gotowy do prezentacji.`,
    category: 'business',
    icon: '💼'
  },
  {
    id: 'summary',
    name: 'Streszczenie',
    description: 'Krótkie podsumowanie długiego tekstu',
    prompt: `Stwórz zwięzłe streszczenie poniższego tekstu:

1. Kluczowe punkty (3-5 bullet points)
2. Główna teza/wniosek
3. Ważne szczegóły
4. Akcje do wykonania (jeśli dotyczy)

Długość streszczenia: max 200 słów. Zachowaj istotę oryginału.`,
    category: 'general',
    icon: '📄'
  },
  {
    id: 'translate-improve',
    name: 'Tłumacz i popraw',
    description: 'Tłumaczenie z poprawą stylu',
    prompt: `Przetłumacz poniższy tekst na polski i popraw styl:

1. Dokładne tłumaczenie (zachowaj znaczenie)
2. Naturalna polszczyzna (unikaj anglicyzmów)
3. Popraw gramatykę i interpunkcję
4. Dostosuj styl do kontekstu
5. Wskaż ewentualne nieścisłości tłumaczenia

Jeśli tekst jest już po polsku - tylko popraw styl i gramatykę.`,
    category: 'general',
    icon: '🌍'
  },
  {
    id: 'comparison',
    name: 'Porównanie opcji',
    description: 'Analiza i porównanie alternatyw',
    prompt: `Porównaj poniższe opcje i pomóż mi wybrać:

Analiza powinna zawierać:
1. Pros & Cons dla każdej opcji
2. Tabela porównawcza (kluczowe cechy)
3. Use cases - kiedy która opcja jest lepsza
4. Rekomendacja (z uzasadnieniem)
5. Inne opcje do rozważenia (jeśli są)

Bądź obiektywny i weź pod uwagę różne perspektywy.`,
    category: 'general',
    icon: '⚖️'
  }
];

// ========== DEFAULT VALUES ==========

export const DEFAULT_CHAT_MODEL = ENHANCED_CHAT_MODELS.find(m => m.recommended)?.id || ENHANCED_CHAT_MODELS[0].id;

export const DEFAULT_KNOWLEDGE_BASE = KNOWLEDGE_BASES[0].id;

// ========== HELPER FUNCTIONS ==========

export function getModelById(id: string): ChatModelOption | undefined {
  return ENHANCED_CHAT_MODELS.find(model => model.id === id);
}

export function getModelsByCategory(category: ModelCategory): ChatModelOption[] {
  return ENHANCED_CHAT_MODELS.filter(model => model.category === category);
}

export function getModelsByCapability(capability: ModelCapability): ChatModelOption[] {
  return ENHANCED_CHAT_MODELS.filter(model => model.capabilities.includes(capability));
}

export function getRecommendedModels(): ChatModelOption[] {
  return ENHANCED_CHAT_MODELS.filter(model => model.recommended);
}

export function getPolishOptimizedModels(): ChatModelOption[] {
  return ENHANCED_CHAT_MODELS
    .filter(model => model.polishQuality >= 4)
    .sort((a, b) => b.polishQuality - a.polishQuality);
}

export function getKnowledgeBaseById(id: string): KnowledgeBase | undefined {
  return KNOWLEDGE_BASES.find(kb => kb.id === id);
}

export function getEnabledKnowledgeBases(): KnowledgeBase[] {
  return KNOWLEDGE_BASES.filter(kb => kb.enabled);
}

export function getPromptTemplateById(id: string): CustomPromptTemplate | undefined {
  return DEFAULT_PROMPT_TEMPLATES.find(template => template.id === id);
}

export function getPromptTemplatesByCategory(category: string): CustomPromptTemplate[] {
  return DEFAULT_PROMPT_TEMPLATES.filter(template => template.category === category);
}

// ========== EXPORT LEGACY COMPATIBILITY ==========

// For backward compatibility with existing code
export const CHAT_MODELS = ENHANCED_CHAT_MODELS.slice(0, 4).map(model => ({
  id: model.id,
  label: model.label,
  description: model.description,
  usageHint: model.usageHint
}));
