/**
 * Navigation Configuration
 * Central configuration for site navigation sections
 */

export interface NavigationSection {
  href: string;
  label: string;
  description?: string;
}

export const NAVIGATION_SECTIONS: NavigationSection[] = [
  {
    href: '/BROWSERY',
    label: 'Browsery',
    description: 'Porównanie i recenzje przeglądarek internetowych'
  },
  {
    href: '/STRONY_INTERNETOWE',
    label: 'Strony Internetowe',
    description: 'Tworzenie i optymalizacja stron www'
  },
  {
    href: '/NARZEDZIA_AI',
    label: 'Narzędzia AI',
    description: 'Praktyczne narzędzia sztucznej inteligencji'
  },
  {
    href: '/WIADOMOSCI_AI',
    label: 'Wiadomości AI',
    description: 'Najnowsze informacje ze świata AI'
  },
  {
    href: '/HAPPY_NEWS',
    label: 'Happy News',
    description: 'Pozytywne wiadomości z technologii'
  },
  {
    href: '/TOTAL_COULTURE',
    label: 'Total Culture',
    description: 'Kultura i technologia razem'
  },
  {
    href: '/ASYSTENT_AI',
    label: 'Asystent AI',
    description: 'Twój osobisty asystent AI'
  },
  {
    href: '/GENERATOR_GRAFIKI',
    label: 'Generator Grafiki',
    description: 'Twórz grafiki za pomocą AI'
  }
];
