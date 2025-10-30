/**
 * Homepage TypeScript Type Definitions
 * Type-safe interfaces for homepage components and data
 */

export interface NavigationSection {
  href: string;
  label: string;
  description?: string;
}

export interface FeatureCard {
  title: string;
  description: string;
  shadowSize: 'sm' | 'md' | 'lg';
  iconName: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string;
  url?: string;
}

export interface BlogApiResponse {
  posts: BlogPost[];
  total: number;
  page?: number;
  perPage?: number;
}

export interface HeroSectionProps {
  videoUrl: string;
  videoPoster: string;
  title: string;
  sections: NavigationSection[];
}

export interface FeaturesSectionProps {
  title?: string;
  description?: string;
  cards: FeatureCard[];
  className?: string;
}

export interface BlogSectionProps {
  posts: BlogPost[];
  title?: string;
  description?: string;
  showFeatured?: boolean;
  maxPosts?: number;
}
