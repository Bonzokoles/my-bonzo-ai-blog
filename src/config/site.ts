/**
 * Site-wide Configuration
 * Global site settings, metadata, and constants
 */

export const SITE_CONFIG = {
  name: 'MyBonzo AI Blog',
  tagline: 'Sztuczna Inteligencja dla Wszystkich',
  url: 'https://www.mybonzoaiblog.com',
  author: {
    name: 'MyBonzo Team',
    email: 'kontakt@mybonzo.com'
  },
  social: {
    twitter: '@mybonzo',
    github: 'mybonzo',
    linkedin: 'mybonzo'
  },
  analytics: {
    googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID || '',
    cloudflareAnalytics: true
  },
  features: {
    blog: true,
    aiChat: true,
    imageGenerator: true,
    newsletter: true
  },
  theme: {
    defaultTheme: 'dark',
    roundedCorners: true
  }
} as const;

export const BLOG_CONFIG = {
  postsPerPage: 6,
  featuredPostsCount: 1,
  recentPostsCount: 6,
  defaultImage: '/images/default-blog-cover.jpg'
} as const;

export const PRO_CONFIG = {
  ctaText: 'Chcesz więcej mocy?',
  ctaLinkText: 'Zobacz MyBonzo Pro z zaawansowanymi narzędziami →',
  ctaUrl: '/pro'
} as const;
