/**
 * Homepage Configuration
 * Central configuration for homepage sections, features, and content
 */

export interface FeatureCard {
  title: string;
  description: string;
  shadowSize: 'sm' | 'md' | 'lg';
  iconName: string;
}

export const MAIN_FEATURE_CARDS: FeatureCard[] = [
  {
    title: 'AI Tools',
    description: 'Odkryj najnowsze narzędzia sztucznej inteligencji. Od generatorów treści po zaawansowane systemy analityczne - wszystko w jednym miejscu.',
    shadowSize: 'lg',
    iconName: 'ri:robot-line'
  },
  {
    title: 'Poradniki',
    description: 'Praktyczne przewodniki krok po kroku. Naucz się wykorzystywać AI w codziennym życiu i biznesie z naszymi szczegółowymi instrukcjami.',
    shadowSize: 'lg',
    iconName: 'ri:book-open-line'
  },
  {
    title: 'Eksperymenty',
    description: 'Laboratoria technologiczne i testy przyszłości. Bądź pierwszym, który pozna nadchodzące trendy w sztucznej inteligencji.',
    shadowSize: 'lg',
    iconName: 'ri:flask-line'
  }
];

export const SPEED_FEATURE_CARDS: FeatureCard[] = [
  {
    title: 'Szybko',
    description: 'Natychmiastowy dostęp do najnowszych informacji o AI. Nasze artykuły i narzędzia są aktualizowane w czasie rzeczywistym.',
    shadowSize: 'lg',
    iconName: 'ri:rocket-2-line'
  },
  {
    title: 'Praktycznie',
    description: 'Nie tylko teoria - konkretne rozwiązania które możesz zastosować już dziś. Od domowych projektów po zaawansowane systemy biznesowe.',
    shadowSize: 'lg',
    iconName: 'ri:code-s-slash-line'
  },
  {
    title: 'Bezpłatnie',
    description: 'Cała wiedza dostępna za darmo. Wierzymy że AI powinno być dostępne dla wszystkich, nie tylko dla wielkich korporacji.',
    shadowSize: 'lg',
    iconName: 'ri:open-source-line'
  }
];

export const HOMEPAGE_METADATA = {
  title: 'MyBonzo AI Blog - Sztuczna Inteligencja dla Wszystkich',
  description: 'MyBonzo AI Blog - Twoje centrum wiedzy o sztucznej inteligencji. Odkryj najnowsze narzędzia AI, przeczytaj przewodniki i eksperymentuj z technologiami przyszłości. Od podstaw do zaawansowanych zastosowań biznesowych.',
  heading: 'MyBonzo AI Blog - Przyszłość w Twoich Rękach',
  videoUrl: 'https://pub-25059caf15274ebd844548094bfb4dc1.r2.dev/DD1.mp4',
  videoPoster: 'https://pub-25059caf15274ebd844548094bfb4dc1.r2.dev/alk4.png'
};
