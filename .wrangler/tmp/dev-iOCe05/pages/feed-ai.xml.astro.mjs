globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../renderers.mjs';

const GET = async () => {
  const baseUrl = "https://www.mybonzoaiblog.com";
  const buildDate = (/* @__PURE__ */ new Date()).toUTCString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:ai="http://mybonzo.com/ai/1.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MyBonzo AI Blog</title>
    <link>${baseUrl}</link>
    <description>WHITECAT v1.0 MOA System Case Studies</description>
    <language>pl-PL</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/feed-ai.xml" rel="self" type="application/rss+xml"/>
    
    <ai:system>WHITECAT v1.0</ai:system>
    <ai:stack>DeepSeek R1, Claude Sonnet 4, GPT-4, Cloudflare Workers AI</ai:stack>
    
    <item>
      <title>WHITECAT Case Study: ROI 54x dla Meble Pumo</title>
      <link>${baseUrl}/blog/rag-moa-ecommerce-2025/</link>
      <description>Jak wygenerowaliśmy 63 przewodniki zakupowe w 24h używając MOA architecture. DeepSeek R1 + Claude + GPT-4.</description>
      <pubDate>Tue, 31 Dec 2025 12:00:00 GMT</pubDate>
      <guid>${baseUrl}/blog/rag-moa-ecommerce-2025/</guid>
      <ai:keywords>MOA, RAG, e-commerce AI, content generation</ai:keywords>
      <ai:metrics>
        <ai:roi>54x</ai:roi>
        <ai:citation-rate>68%</ai:citation-rate>
        <ai:products>2500</ai:products>
        <ai:guides>63</ai:guides>
      </ai:metrics>
    </item>
    
    <item>
      <title>AI-SEO Knowledge Bases 2025: Complete Guide</title>
      <link>${baseUrl}/blog/ai-seo-knowledge-bases-2025/</link>
      <description>Przewodnik po tworzeniu baz wiedzy zoptymalizowanych pod AI search engines: Perplexity, ChatGPT Search, Gemini.</description>
      <pubDate>Tue, 31 Dec 2025 12:00:00 GMT</pubDate>
      <guid>${baseUrl}/blog/ai-seo-knowledge-bases-2025/</guid>
      <ai:keywords>AI SEO, knowledge base, structured data, Perplexity</ai:keywords>
      <ai:metrics>
        <ai:roi>54x</ai:roi>
        <ai:citation-rate>68%</ai:citation-rate>
        <ai:products>2500</ai:products>
        <ai:guides>63</ai:guides>
      </ai:metrics>
    </item>
    
    <item>
      <title>Pumo Guide: 63 AI-Generated Buying Guides</title>
      <link>${baseUrl}/pumo-guide/</link>
      <description>Kompleksowy przewodnik zakupowy dla 63 kategorii mebli. Porównanie cen, modeli i funkcji z AI asystentem.</description>
      <pubDate>Sun, 29 Dec 2025 12:00:00 GMT</pubDate>
      <guid>${baseUrl}/pumo-guide/</guid>
      <ai:keywords>furniture guide, buying guide, AI content, meble pumo</ai:keywords>
      <ai:metrics>
        <ai:roi>54x</ai:roi>
        <ai:citation-rate>68%</ai:citation-rate>
        <ai:products>2500</ai:products>
        <ai:guides>63</ai:guides>
      </ai:metrics>
    </item>
  </channel>
</rss>`;
  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600"
    }
  });
};
const prerender = false;

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
