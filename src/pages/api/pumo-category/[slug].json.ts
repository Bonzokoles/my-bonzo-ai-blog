import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

export const prerender = true;

// Helper to extract frontmatter roughly
function parseFrontmatter(content: string) {
  const match = content.match(/^---\n([\s\S]+?)\n---/);
  if (!match) return {};
  const frontmatterRaw = match[1];
  const frontmatter: Record<string, any> = {};
  
  frontmatterRaw.split('\n').forEach(line => {
    const [key, ...values] = line.split(':');
    if (key && values.length) {
        let value = values.join(':').trim();
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        frontmatter[key.trim()] = value;
    }
  });
  return frontmatter;
}

export const getStaticPaths = async () => {
    // Read all markdown files in the pumo-guide directory
    const pagesDir = path.resolve('./src/pages/pumo-guide');
    const files = await fs.readdir(pagesDir);
    
    return files
        .filter(file => file.endsWith('.md'))
        .map(file => ({
            params: { slug: file.replace('.md', '') }
        }));
};

export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;

  if (!slug) {
    return new Response(JSON.stringify({ error: "Missing slug" }), { status: 400 });
  }

  // Construct path to markdown file
  const filePath = path.resolve(`./src/pages/pumo-guide/${slug}.md`);

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const frontmatter = parseFrontmatter(content);
    const body = content.replace(/^---\n[\s\S]+?\n---/, '').trim();

    // Try to find sections
    const faqMatch = body.match(/## .*FAQ[\s\S]*?(?=##|$)/i);
    const faqSection = faqMatch ? faqMatch[0] : null;

    const responseData = {
      slug: slug,
      title: frontmatter.title || slug,
      category: frontmatter.category,
      subcategory: frontmatter.subcategory,
      description: frontmatter.description,
      // Metadata for Agents
      type: "ProductCategory",
      source: "https://www.meblepumo.pl",
      contentSummary: body.substring(0, 500) + "...", 
      hasFAQ: !!faqSection,
      rawFrontmatter: frontmatter
    };

    return new Response(JSON.stringify(responseData), {
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error", details: String(error) }), {
      status: 500
    });
  }
};
