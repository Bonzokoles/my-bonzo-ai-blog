export type ChatModelOption = {
  id: string;
  label: string;
  description: string;
  usageHint?: string;
};

export const CHAT_MODELS: ChatModelOption[] = [
  {
    id: '@cf/google/gemma-3-12b-it',
    label: 'Gemma 3 12B IT',
    description:
      'Domyslny model Google. Bardzo dobra jakosc odpowiedzi po polsku, stabilny balans miedzy cena a moca.',
    usageHint: 'Polecany do wiekszosci rozmow i porad eksperckich.'
  },
  {
    id: '@cf/qwen/qwq-32b',
    label: 'Qwen QWQ 32B',
    description:
      'Model reasoning od Alibaba. Silny w wnioskowaniu i zadaniach zlozonych, zachowuje plynny jezyk polski.',
    usageHint: 'Uzyj, gdy potrzebujesz dlugiej analizy lub odpowiedzi krok po kroku.'
  },
  {
    id: '@cf/microsoft/phi-2',
    label: 'Phi-2',
    description:
      'Lekki model Microsoftu. Szybkie odpowiedzi, nizszy koszt, dobrze radzi sobie z krotkimi zapytaniami.',
    usageHint: 'Dobry wybor do szybkich Q&A i prostych podpowiedzi.'
  },
  {
    id: '@cf/openchat/openchat-3.5-0106',
    label: 'OpenChat 3.5',
    description:
      'Model rozmow OpenChat. Naturalny styl dialogu, przyjemny ton i wsparcie polskiego.',
    usageHint: 'Idealny, gdy zalezy Ci na swobodniejszej konwersacji.'
  }
];

export const DEFAULT_CHAT_MODEL = CHAT_MODELS[0].id;
