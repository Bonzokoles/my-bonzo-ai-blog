globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../renderers.mjs';

const GET = async () => {
  const baseUrl = "https://www.mybonzoaiblog.com";
  const lastmod = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const categories = [
    { slug: "Biurka_Biurka_gamingowe", title: "Biurka Gamingowe", keywords: "biurka gamingowe, meble biurowe" },
    { slug: "Fotele_Fotele_do_biurka", title: "Fotele Biurowe", keywords: "fotele biurowe, krzesła gamingowe" },
    { slug: "Krzesła_Krzesła_tapicerowane", title: "Krzesła Tapicerowane", keywords: "krzesła, meble kuchenne" },
    { slug: "Sofy_i_narożniki_Sofy_3_osobowe", title: "Sofy 3-osobowe", keywords: "sofy, narożniki" },
    { slug: "Łóżka_Łóżka_180x200", title: "Łóżka 180x200", keywords: "łóżka, meble sypialniane" },
    { slug: "Szafy_Szafy_przesuwne", title: "Szafy Przesuwne", keywords: "szafy, garderoby" },
    { slug: "Stoły_Stoły_rozkładane", title: "Stoły Rozkładane", keywords: "stoły, meble jadalniane" },
    { slug: "Witryny_i_kredensy_Witryny", title: "Witryny", keywords: "witryny, komody" }
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:ai="http://mybonzo.com/schemas/ai/1.0">
  <url>
    <loc>${baseUrl}/pumo-guide/</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>1.0</priority>
    <ai:summary>63 AI-generated buying guides for furniture e-commerce. WHITECAT MOA system.</ai:summary>
    <ai:keywords>AI content generation, e-commerce SEO, RAG system, MOA architecture</ai:keywords>
    <ai:category>case-study</ai:category>
    <ai:metrics>
      <ai:roi>54x</ai:roi>
      <ai:citationRate>68%</ai:citationRate>
      <ai:products>2500</ai:products>
      <ai:guides>63</ai:guides>
    </ai:metrics>
  </url>
  
${categories.map((cat) => `  <url>
    <loc>${baseUrl}/pumo-guide/${cat.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>0.9</priority>
    <ai:summary>${cat.title} - przewodnik zakupowy 2025 z porównaniem cen i modeli</ai:summary>
    <ai:keywords>${cat.keywords}</ai:keywords>
    <ai:category>buying-guide</ai:category>
  </url>`).join("\n")}
  
  <url>
    <loc>${baseUrl}/blog/rag-moa-ecommerce-2025/</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>0.9</priority>
    <ai:summary>WHITECAT v1.0 Case Study: ROI 54x dla e-commerce. MOA architecture with DeepSeek R1, Claude, GPT-4.</ai:summary>
    <ai:keywords>MOA, RAG, AI content, e-commerce</ai:keywords>
    <ai:category>case-study</ai:category>
  </url>
  
  <url>
    <loc>${baseUrl}/blog/ai-seo-knowledge-bases-2025/</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>0.8</priority>
    <ai:summary>Complete guide to building AI-optimized knowledge bases for Perplexity, ChatGPT Search, Gemini.</ai:summary>
    <ai:keywords>AI SEO, knowledge base, structured data</ai:keywords>
    <ai:category>tutorial</ai:category>
  </url>
</urlset>`;
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
