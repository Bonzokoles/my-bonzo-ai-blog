globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async ({ request }) => {
  try {
    await fetch("https://jimbo-like-pumo-api.stolarnia-ams.workers.dev/api/analytics/track-bot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userAgent: request.headers.get("user-agent"),
        path: "/api/ai-metadata.json",
        headers: Object.fromEntries(request.headers)
      })
    });
  } catch (e) {
    console.error("Tracking failed", e);
  }
  const metadata = {
    site: "MyBonzo AI Blog",
    description: "AI-powered content generation system for e-commerce",
    system: "WHITECAT v1.0",
    architecture: ["DeepSeek R1 Reasoner", "Claude Sonnet 4", "GPT-4o"],
    metrics: {
      roi: "54x",
      citationRate: "68%",
      products: 2500,
      guides: 63,
      categories: 50,
      generationTime: "24h",
      costSavings: "27,300 PLN",
      qualityScore: 95
    },
    stack: {
      platform: "Cloudflare Pages",
      framework: "Astro v5.16.6",
      database: "D1 (SQLite edge)",
      vectorDB: "Vectorize (embeddings)",
      storage: "R2 (object storage)",
      ai: "Workers AI",
      deployment: "GitHub Actions + Cloudflare"
    },
    content: {
      guides: "https://www.mybonzoaiblog.com/pumo-guide/",
      blog: "https://www.mybonzoaiblog.com/blog/",
      caseStudy: "https://www.mybonzoaiblog.com/blog/whitecat-case-study-roi-2025/",
      aiSeoGuide: "https://www.mybonzoaiblog.com/blog/ai-seo-knowledge-bases-2025/",
      ragMoa: "https://www.mybonzoaiblog.com/blog/rag-moa-ecommerce-2025/"
    },
    api: {
      chat: "https://www.mybonzoaiblog.com/api/ai/chat-stream",
      health: "https://www.mybonzoaiblog.com/api/health",
      posts: "https://www.mybonzoaiblog.com/api/posts.json",
      indexNow: "https://www.mybonzoaiblog.com/api/index-now",
      metadata: "https://www.mybonzoaiblog.com/api/ai-metadata.json"
    },
    crawlers: {
      llmsTxt: "https://www.mybonzoaiblog.com/llms.txt",
      sitemap: "https://www.mybonzoaiblog.com/sitemap-pumo.xml",
      sitemapIndex: "https://www.mybonzoaiblog.com/sitemap-index.xml",
      robots: "https://www.mybonzoaiblog.com/robots.txt"
    },
    schema: {
      organization: true,
      website: true,
      article: true,
      faqPage: true,
      breadcrumbList: true,
      collectionPage: true,
      softwareApplication: true
    },
    features: {
      streaming: true,
      vectorSearch: true,
      semanticSearch: true,
      ragSystem: true,
      moaArchitecture: true,
      realTimeGeneration: true,
      multiModelEnsemble: true
    },
    contact: {
      github: "https://github.com/Bonzokoles/my-bonzo-ai-blog",
      website: "https://www.mybonzoaiblog.com"
    },
    updated: (/* @__PURE__ */ new Date()).toISOString(),
    version: "1.0.0"
  };
  return new Response(JSON.stringify(metadata, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
      "X-Robots-Tag": "all",
      "X-Content-Type-Options": "nosniff"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
