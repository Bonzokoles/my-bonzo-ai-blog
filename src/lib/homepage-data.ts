/**
 * Homepage Data Module
 * Server-side data fetching for homepage
 * Replaces client-side fetch() with SSR/SSG
 */

import type { BlogPost, BlogApiResponse } from '@/types/homepage';
import { BLOG_CONFIG } from '@/config/site';

/**
 * Fetch blog posts for homepage
 * Uses SSR to pre-render blog posts at build time
 */
export async function getHomepageBlogPosts(): Promise<BlogPost[]> {
  try {
    // Use environment-aware base URL
    const baseUrl = import.meta.env.SITE || 'http://localhost:4321';
    const response = await fetch(`${baseUrl}/api/blog/index`);

    if (!response.ok) {
      console.error('Failed to fetch blog posts:', response.statusText);
      return [];
    }

    const data: BlogApiResponse = await response.json();

    // Return only the configured number of posts
    return data.posts.slice(0, BLOG_CONFIG.recentPostsCount);
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

/**
 * Get featured blog post (first post)
 */
export async function getFeaturedPost(): Promise<BlogPost | null> {
  const posts = await getHomepageBlogPosts();
  return posts.length > 0 ? posts[0] : null;
}

/**
 * Get recent blog posts (excluding featured)
 */
export async function getRecentPosts(limit: number = 3): Promise<BlogPost[]> {
  const posts = await getHomepageBlogPosts();
  return posts.slice(1, 1 + limit);
}

/**
 * Format date for display
 */
export function formatPostDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Parse tags from comma or space-separated string
 */
export function parseTags(tagsString: string, limit: number = 2): string[] {
  if (!tagsString) return [];
  return tagsString
    .split(/[\s,]+/)
    .filter(tag => tag.trim())
    .slice(0, limit);
}

/**
 * Generate post URL
 */
export function getPostUrl(postId: string): string {
  return `/blog/${postId}`;
}
