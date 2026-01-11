import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

// Force static generation for robots.txt
export const prerender = true;

export const GET: APIRoute = () => {
  // Read from public/robots.txt
  const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
  
  let robotsTxt: string;
  
  try {
    robotsTxt = fs.readFileSync(robotsPath, 'utf-8');
  } catch (error) {
    // Fallback content if public/robots.txt doesn't exist
    robotsTxt = `# Robots.txt for MyBonzo AI Blog
User-agent: *
Allow: /

# Pumo Guide - High Priority
Allow: /pumo-guide/

# AI Bots
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-Web
Allow: /

Sitemap: https://www.mybonzoaiblog.com/sitemap-index.xml
`;
  }

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
