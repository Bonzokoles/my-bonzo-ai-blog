import type { SiteConfig } from "../types";

export const SITE: SiteConfig = {
  website: "https://mybonzoaiblog.com",
  author: "Jimbo77 & Community",
  desc: "Polski Social AI Club - Wymiana wiedzy, schematów i doświadczeń dla entuzjastów AI. Zero bullshit, sama praktyka.",
  title: "Jimbo77 AI Social Club",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerPage: 5,
};

export const BLOG_CONFIG = {
  recentPostsCount: 3,
  featuredPostSlug: "naprawa-pumo-rag",
  archiveLimit: 30
};

export const PRO_CONFIG = {
  active: true,
  tier: "Elite",
  mcpEnabled: true,
  automationLevel: "MAX"
};
