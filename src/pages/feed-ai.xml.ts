import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = async () => {
  const baseUrl = 'https://www.mybonzoaiblog.com';
  const now = new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:ai="http://mybonzo.com/ai/1.0"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MyBonzo AI Blog</title>
    <link>${baseUrl}</link>
    <description>WHITECAT v1.0 MOA System Case Studies and AI Content Generation Guides</description>
    <language>pl-PL</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${baseUrl}/feed-ai.xml" rel="self" type="application/rss+xml"/>
    
    <!-- AI System Metadata -->
    <ai:system>WHITECAT v1.0</ai:system>
    <ai:stack>DeepSeek R1, Claude Sonnet 4, GPT-4o, Cloudflare Workers AI</ai:stack>
    <ai:architecture>3-layer MOA (Mixture of Agents)</ai:architecture>
    
    <!-- Case Study: WHITECAT ROI 54x -->
    <item>
      <title>WHITECAT v1.0 Case Study: ROI 54x dla Meble Pumo</title>
      <link>${baseUrl}/blog/rag-moa-ecommerce-2025/</link>
      <guid isPermaLink="true">${baseUrl}/blog/rag-moa-ecommerce-2025/</guid>
      <description>Jak wygenerowaliśmy 63 przewodniki zakupowe w 24h używając architektury MOA (Mixture of Agents). DeepSeek R1 + Claude Sonnet 4 + GPT-4o.</description>
      <pubDate>${now}</pubDate>
      <category>Case Study</category>
      <category>AI Content Generation</category>
      <category>E-commerce</category>
      
      <ai:keywords>MOA, RAG, e-commerce AI, content generation, DeepSeek R1, Claude, GPT-4</ai:keywords>
      <ai:metrics>
        <ai:roi>54x</ai:roi>
        <ai:citationRate>68%</ai:citationRate>
        <ai:products>2500</ai:products>
        <ai:guides>63</ai:guides>
        <ai:generationTime>24h</ai:generationTime>
        <ai:qualityScore>85</ai:qualityScore>
      </ai:metrics>
      <ai:technology>
        <ai:model>DeepSeek R1 Reasoner</ai:model>
        <ai:model>Claude 3.5 Sonnet</ai:model>
        <ai:model>GPT-4o-mini</ai:model>
        <ai:platform>Cloudflare Workers</ai:platform>
        <ai:database>D1</ai:database>
        <ai:vectorDB>Vectorize</ai:vectorDB>
      </ai:technology>
    </item>

    <!-- AI SEO Guide -->
    <item>
      <title>AI SEO Knowledge Bases 2025: Przewodnik Optymalizacji</title>
      <link>${baseUrl}/blog/ai-seo-knowledge-bases-2025/</link>
      <guid isPermaLink="true">${baseUrl}/blog/ai-seo-knowledge-bases-2025/</guid>
      <description>Kompleksowy przewodnik po optymalizacji content dla AI search engines: Perplexity, ChatGPT Search, Claude. Schema.org, structured data, FAQ optimization.</description>
      <pubDate>${now}</pubDate>
      <category>Guide</category>
      <category>AI SEO</category>
      <category>Structured Data</category>
      
      <ai:keywords>AI SEO, Perplexity, ChatGPT Search, structured data, schema.org, knowledge bases</ai:keywords>
      <ai:metrics>
        <ai:citationRate>68%</ai:citationRate>
        <ai:indexingTime>7 days</ai:indexingTime>
      </ai:metrics>
    </item>

    <!-- Pumo Guide Collection -->
    <item>
      <title>Pumo Guide: 63 Przewodniki Zakupowe AI</title>
      <link>${baseUrl}/pumo-guide/</link>
      <guid isPermaLink="true">${baseUrl}/pumo-guide/</guid>
      <description>Kompleksowa baza wiedzy o 2500+ produktach Meble Pumo. 63 przewodniki zakupowe wygenerowane przez WHITECAT v1.0 w 24h.</description>
      <pubDate>${now}</pubDate>
      <category>Product Guides</category>
      <category>Furniture</category>
      <category>E-commerce</category>
      
      <ai:keywords>meble pumo, przewodniki zakupowe, porównanie cen, AI asystent, furniture guides</ai:keywords>
      <ai:metrics>
        <ai:products>2500</ai:products>
        <ai:guides>63</ai:guides>
        <ai:categories>48</ai:categories>
        <ai:avgWordCount>2000</ai:avgWordCount>
      </ai:metrics>
    </item>
  </channel>
</rss>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
