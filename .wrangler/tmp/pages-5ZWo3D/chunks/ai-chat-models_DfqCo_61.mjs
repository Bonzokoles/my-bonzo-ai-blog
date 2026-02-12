globalThis.process ??= {}; globalThis.process.env ??= {};
const CHAT_MODELS = [
  // Cloudflare Workers AI Models
  {
    id: "@cf/google/gemma-3-12b-it",
    label: "Gemma 3 12B IT",
    description: "Domyslny model Google. Bardzo dobra jakosc odpowiedzi po polsku, stabilny balans miedzy cena a moca.",
    usageHint: "Polecany do wiekszosci rozmow i porad eksperckich.",
    provider: "cloudflare"
  },
  {
    id: "@cf/qwen/qwq-32b",
    label: "Qwen QWQ 32B",
    description: "Model reasoning od Alibaba. Silny w wnioskowaniu i zadaniach zlozonych, zachowuje plynny jezyk polski.",
    usageHint: "Uzyj, gdy potrzebujesz dlugiej analizy lub odpowiedzi krok po kroku.",
    provider: "cloudflare"
  },
  {
    id: "@cf/microsoft/phi-2",
    label: "Phi-2",
    description: "Lekki model Microsoftu. Szybkie odpowiedzi, nizszy koszt, dobrze radzi sobie z krotkimi zapytaniami.",
    usageHint: "Dobry wybor do szybkich Q&A i prostych podpowiedzi.",
    provider: "cloudflare"
  },
  {
    id: "@cf/openchat/openchat-3.5-0106",
    label: "OpenChat 3.5",
    description: "Model rozmow OpenChat. Naturalny styl dialogu, przyjemny ton i wsparcie polskiego.",
    usageHint: "Idealny, gdy zalezy Ci na swobodniejszej konwersacji.",
    provider: "cloudflare"
  },
  // OpenRouter Models (OpenAI)
  {
    id: "openai/gpt-4o",
    label: "GPT-4o (OpenRouter)",
    description: "Najnowszy multimodalny model OpenAI. Doskonala jakosc rozumowania, native polski, szybki i ekonomiczny.",
    usageHint: "Najlepszy wybor do zlozonych zadan analitycznych i tworzenia tresci.",
    provider: "openrouter"
  },
  {
    id: "openai/gpt-4o-mini",
    label: "GPT-4o Mini (OpenRouter)",
    description: "Lekka wersja GPT-4o. Bardzo szybki, tanszy, swietny do codziennych rozmow i Q&A.",
    usageHint: "Optymalna wydajnosc dla typowych pytan i krotkich odpowiedzi.",
    provider: "openrouter"
  },
  {
    id: "openai/o1-mini",
    label: "o1-mini (OpenRouter)",
    description: "Model rozumowania OpenAI. Specjalizuje sie w matematyce, logice i analizie krok po kroku.",
    usageHint: "Idealny do problemow matematycznych i programowania.",
    provider: "openrouter"
  },
  // OpenRouter Models (Anthropic)
  {
    id: "anthropic/claude-3.5-sonnet",
    label: "Claude 3.5 Sonnet (OpenRouter)",
    description: "Flagship model Anthropic. Wyjatkowa jakosc pisania, analiza dokumentow, doskonaly polski.",
    usageHint: "Najlepszy do tworzenia content, edycji tekstow i analizy.",
    provider: "openrouter"
  },
  {
    id: "anthropic/claude-3-haiku",
    label: "Claude 3 Haiku (OpenRouter)",
    description: "Najszybszy model Anthropic. Niski koszt, swietna responsywnosc, dobry balans jakosc/cena.",
    usageHint: "Swietny do szybkich odpowiedzi i prostych zadan.",
    provider: "openrouter"
  },
  // OpenRouter Models (Google)
  {
    id: "google/gemini-pro-1.5",
    label: "Gemini Pro 1.5 (OpenRouter)",
    description: "Flagship model Google. Duzy kontekst (1M tokens), multimodalnosc, swietna analiza danych.",
    usageHint: "Idealny do pracy z duzymi dokumentami i analiz wielowatkowych.",
    provider: "openrouter"
  }
];
const DEFAULT_CHAT_MODEL = CHAT_MODELS[0].id;

export { CHAT_MODELS as C, DEFAULT_CHAT_MODEL as D };
