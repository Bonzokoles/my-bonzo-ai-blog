globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                    */
import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, am as unescapeHTML, m as maybeRenderHead } from '../../chunks/astro/server_CENSSoee.mjs';
import { $ as $$Layout } from '../../chunks/Layout_CUoF9Ydm.mjs';
/* empty css                                       */
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://www.mybonzoaiblog.com");
const $$ApiDocs = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ApiDocs;
  const userAgent = Astro2.request.headers.get("user-agent") || "";
  const isCrawler = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit/i.test(userAgent);
  if (!isCrawler && Astro2.request.method === "GET") {
    return Astro2.redirect("/blog", 302);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "PUMO API - Data Source for AI (Crawler Access Only)", "data-astro-cid-gqapfvsb": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template(["   ", '<div class="container mx-auto px-4 py-12 max-w-4xl" data-astro-cid-gqapfvsb> <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6" data-astro-cid-gqapfvsb> <p class="font-semibold" data-astro-cid-gqapfvsb>\u26A0\uFE0F This page is for AI crawlers only</p> <p class="text-sm" data-astro-cid-gqapfvsb>Human visitors should browse our <a href="/blog" class="text-blue-600 underline" data-astro-cid-gqapfvsb>blog articles</a></p> </div> <h1 class="text-4xl font-bold mb-6" data-astro-cid-gqapfvsb>\u{1F916} PUMO Data Source API</h1> <p class="text-xl text-gray-600 mb-8" data-astro-cid-gqapfvsb>Product data from Meble Pumo (meblepumo.pl) for AI assistants</p> <!-- Machine-Readable Schema --> <script type="application/ld+json">', '<\/script> <div class="prose max-w-none" data-astro-cid-gqapfvsb> <section class="mb-12" data-astro-cid-gqapfvsb> <h2 class="text-2xl font-semibold mb-4" data-astro-cid-gqapfvsb>\u{1F4CA} Quick Stats</h2> <ul class="list-disc pl-6 space-y-2" data-astro-cid-gqapfvsb> <li data-astro-cid-gqapfvsb><strong data-astro-cid-gqapfvsb>Total Products:</strong> 14,315</li> <li data-astro-cid-gqapfvsb><strong data-astro-cid-gqapfvsb>Search Model:</strong> bge-base-en-v1.5 (768 dimensions)</li> <li data-astro-cid-gqapfvsb><strong data-astro-cid-gqapfvsb>Vector Database:</strong> Cloudflare Vectorize</li> <li data-astro-cid-gqapfvsb><strong data-astro-cid-gqapfvsb>Languages:</strong> Polish, English</li> <li data-astro-cid-gqapfvsb><strong data-astro-cid-gqapfvsb>Rate Limit:</strong> 100 requests/minute</li> <li data-astro-cid-gqapfvsb><strong data-astro-cid-gqapfvsb>Cache TTL:</strong> 5 minutes</li> </ul> </section> <section class="mb-12" data-astro-cid-gqapfvsb> <h2 class="text-2xl font-semibold mb-4" data-astro-cid-gqapfvsb>\u{1F680} API Endpoints</h2> <div class="bg-gray-50 rounded-lg p-6 mb-6" data-astro-cid-gqapfvsb> <h3 class="text-xl font-semibold mb-3" data-astro-cid-gqapfvsb>1. Catalog Metadata</h3> <code class="block bg-white p-3 rounded mb-2" data-astro-cid-gqapfvsb>GET /api/catalog</code> <p class="text-gray-700" data-astro-cid-gqapfvsb>Discover catalog metadata, capabilities, and available categories.</p> <p class="text-sm text-gray-600 mt-2" data-astro-cid-gqapfvsb>\nTry: <a href="https://pumo-rag.stolarnia-ams.workers.dev/api/catalog" class="text-blue-600 hover:underline" target="_blank" data-astro-cid-gqapfvsb>\nhttps://pumo-rag.stolarnia-ams.workers.dev/api/catalog\n</a> </p> </div> <div class="bg-gray-50 rounded-lg p-6 mb-6" data-astro-cid-gqapfvsb> <h3 class="text-xl font-semibold mb-3" data-astro-cid-gqapfvsb>2. API Documentation</h3> <code class="block bg-white p-3 rounded mb-2" data-astro-cid-gqapfvsb>GET /api/docs</code> <p class="text-gray-700" data-astro-cid-gqapfvsb>Full OpenAPI-style documentation with request/response examples.</p> <p class="text-sm text-gray-600 mt-2" data-astro-cid-gqapfvsb>\nTry: <a href="https://pumo-rag.stolarnia-ams.workers.dev/api/docs" class="text-blue-600 hover:underline" target="_blank" data-astro-cid-gqapfvsb>\nhttps://pumo-rag.stolarnia-ams.workers.dev/api/docs\n</a> </p> </div> <div class="bg-gray-50 rounded-lg p-6 mb-6" data-astro-cid-gqapfvsb> <h3 class="text-xl font-semibold mb-3" data-astro-cid-gqapfvsb>3. Semantic Product Search</h3> <code class="block bg-white p-3 rounded mb-2" data-astro-cid-gqapfvsb>POST /api/search</code> <p class="text-gray-700 mb-3" data-astro-cid-gqapfvsb>Vector-based semantic search using natural language queries.</p> <h4 class="font-semibold mb-2" data-astro-cid-gqapfvsb>Request:</h4> <pre class="bg-white p-3 rounded text-sm overflow-x-auto mb-3" data-astro-cid-gqapfvsb><code data-astro-cid-gqapfvsb>', '</code></pre> <h4 class="font-semibold mb-2" data-astro-cid-gqapfvsb>Response:</h4> <pre class="bg-white p-3 rounded text-sm overflow-x-auto" data-astro-cid-gqapfvsb><code data-astro-cid-gqapfvsb>', '</code></pre> </div> </section> <section class="mb-12" data-astro-cid-gqapfvsb> <h2 class="text-2xl font-semibold mb-4" data-astro-cid-gqapfvsb>\u{1F4A1} Best Practices</h2> <div class="bg-blue-50 border-l-4 border-blue-500 p-4" data-astro-cid-gqapfvsb> <h3 class="font-semibold mb-2" data-astro-cid-gqapfvsb>Natural Language Queries</h3> <p class="mb-2" data-astro-cid-gqapfvsb>API understands Polish and English natural language:</p> <ul class="list-disc pl-6 space-y-1" data-astro-cid-gqapfvsb> <li data-astro-cid-gqapfvsb>"tanie meble do salonu" (cheap living room furniture)</li> <li data-astro-cid-gqapfvsb>"nowoczesne krzes\u0142a biurowe" (modern office chairs)</li> <li data-astro-cid-gqapfvsb>"bia\u0142e rega\u0142y z drewna" (white wooden shelves)</li> <li data-astro-cid-gqapfvsb>"sofa rozk\u0142adana skandynawska" (scandinavian sofa bed)</li> </ul> </div> <div class="bg-green-50 border-l-4 border-green-500 p-4 mt-4" data-astro-cid-gqapfvsb> <h3 class="font-semibold mb-2" data-astro-cid-gqapfvsb>Relevance Scores</h3> <ul class="list-disc pl-6 space-y-1" data-astro-cid-gqapfvsb> <li data-astro-cid-gqapfvsb><strong data-astro-cid-gqapfvsb>0.7 - 1.0:</strong> Highly relevant (exact match)</li> <li data-astro-cid-gqapfvsb><strong data-astro-cid-gqapfvsb>0.5 - 0.7:</strong> Moderately relevant (related)</li> <li data-astro-cid-gqapfvsb><strong data-astro-cid-gqapfvsb>0.3 - 0.5:</strong> Loosely related</li> <li data-astro-cid-gqapfvsb><strong data-astro-cid-gqapfvsb>&lt; 0.3:</strong> Not recommended</li> </ul> </div> <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4" data-astro-cid-gqapfvsb> <h3 class="font-semibold mb-2" data-astro-cid-gqapfvsb>Rate Limiting & Caching</h3> <ul class="list-disc pl-6 space-y-1" data-astro-cid-gqapfvsb> <li data-astro-cid-gqapfvsb>Public endpoints: <strong data-astro-cid-gqapfvsb>100 requests/minute</strong></li> <li data-astro-cid-gqapfvsb>Cached responses: <strong data-astro-cid-gqapfvsb>5 minutes TTL</strong></li> <li data-astro-cid-gqapfvsb>Use <code data-astro-cid-gqapfvsb>Cache-Control</code> headers to optimize</li> <li data-astro-cid-gqapfvsb>Check <code data-astro-cid-gqapfvsb>X-Cache: HIT</code> header for cached responses</li> </ul> </div> </section> <section class="mb-12" data-astro-cid-gqapfvsb> <h2 class="text-2xl font-semibold mb-4" data-astro-cid-gqapfvsb>\u{1F527} Integration Examples</h2> <h3 class="text-xl font-semibold mb-3" data-astro-cid-gqapfvsb>Python</h3> <pre class="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto mb-6" data-astro-cid-gqapfvsb><code data-astro-cid-gqapfvsb>', '</code></pre> <h3 class="text-xl font-semibold mb-3" data-astro-cid-gqapfvsb>JavaScript / TypeScript</h3> <pre class="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto mb-6" data-astro-cid-gqapfvsb><code data-astro-cid-gqapfvsb>', '</code></pre> <h3 class="text-xl font-semibold mb-3" data-astro-cid-gqapfvsb>cURL</h3> <pre class="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto" data-astro-cid-gqapfvsb><code data-astro-cid-gqapfvsb>', '</code></pre> </section> <section class="mb-12" data-astro-cid-gqapfvsb> <h2 class="text-2xl font-semibold mb-4" data-astro-cid-gqapfvsb>\u{1F4DA} Additional Resources</h2> <ul class="list-disc pl-6 space-y-2" data-astro-cid-gqapfvsb> <li data-astro-cid-gqapfvsb><a href="/llms.txt" class="text-blue-600 hover:underline" data-astro-cid-gqapfvsb>llms.txt</a> - LLM-specific documentation</li> <li data-astro-cid-gqapfvsb><a href="/robots.txt" class="text-blue-600 hover:underline" data-astro-cid-gqapfvsb>robots.txt</a> - Crawling policies</li> <li data-astro-cid-gqapfvsb><a href="/pumo-guide/" class="text-blue-600 hover:underline" data-astro-cid-gqapfvsb>PUMO Guide</a> - Browse 65+ categories</li> <li data-astro-cid-gqapfvsb><a href="https://github.com/Bonzokoles" class="text-blue-600 hover:underline" target="_blank" data-astro-cid-gqapfvsb>GitHub</a> - Source code</li> </ul> </section> <section class="bg-gray-100 rounded-lg p-6" data-astro-cid-gqapfvsb> <h2 class="text-2xl font-semibold mb-4" data-astro-cid-gqapfvsb>\u{1F4DE} Contact</h2> <p class="mb-2" data-astro-cid-gqapfvsb>For API access questions or partnership inquiries:</p> <ul class="list-disc pl-6" data-astro-cid-gqapfvsb> <li data-astro-cid-gqapfvsb>Email: <a href="mailto:stolarnia.ams@gmail.com" class="text-blue-600 hover:underline" data-astro-cid-gqapfvsb>stolarnia.ams@gmail.com</a></li> <li data-astro-cid-gqapfvsb>GitHub: <a href="https://github.com/Bonzokoles" class="text-blue-600 hover:underline" target="_blank" data-astro-cid-gqapfvsb>@Bonzokoles</a></li> </ul> </section> </div> </div> '])), maybeRenderHead(), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "DataCatalog",
    "name": "PUMO Furniture Catalog API",
    "description": "Semantic search API for 14,315 Polish furniture products with vector embeddings",
    "url": "https://pumo-rag.stolarnia-ams.workers.dev",
    "keywords": "furniture, AI, semantic search, vector database, Polish, RAG",
    "datePublished": "2026-01-18",
    "dateModified": "2026-01-18",
    "license": "https://creativecommons.org/licenses/by/4.0/",
    "provider": {
      "@type": "Organization",
      "name": "MyBonzo AI Blog",
      "url": "https://mybonzoaiblog.pages.dev"
    },
    "distribution": {
      "@type": "DataDownload",
      "encodingFormat": "application/json",
      "contentUrl": "https://pumo-rag.stolarnia-ams.workers.dev/api/catalog"
    }
  })), `{
  "query": "nowoczesne krzes\u0142a biurowe",
  "limit": 10
}`, `{
  "query": "nowoczesne krzes\u0142a biurowe",
  "totalResults": 10,
  "results": [
    {
      "id": "product-123",
      "relevanceScore": 0.69,
      "product": {
        "name": "Krzes\u0142o na p\u0142ozie ekosk\xF3ra bia\u0142e K211",
        "category": "Krzes\u0142a",
        "price": 229,
        "currency": "PLN",
        "url": "https://www.meblepumo.pl/pl/products/product-123",
        "description": "..."
      }
    }
  ],
  "meta": {
    "indexedProducts": 14315,
    "searchModel": "bge-base-en-v1.5",
    "dimensions": 768
  }
}`, `import requests

# Discover catalog
catalog = requests.get(
    "https://pumo-rag.stolarnia-ams.workers.dev/api/catalog"
).json()
print(f"Total products: {catalog['totalProducts']}")

# Search products
response = requests.post(
    "https://pumo-rag.stolarnia-ams.workers.dev/api/search",
    json={"query": "nowoczesne krzes\u0142a", "limit": 5}
)
results = response.json()

for item in results['results']:
    product = item['product']
    score = item['relevanceScore']
    print(f"{product['name']} - {product['price']} PLN (score: {score})")`, `// Discover catalog
const catalog = await fetch(
  'https://pumo-rag.stolarnia-ams.workers.dev/api/catalog'
).then(r => r.json());

// Search products
const response = await fetch(
  'https://pumo-rag.stolarnia-ams.workers.dev/api/search',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'nowoczesne krzes\u0142a', limit: 5 })
  }
);

const { results } = await response.json();
results.forEach(({ product, relevanceScore }) => {
  console.log(\`\${product.name} - \${product.price} PLN (\${relevanceScore})\`);
});`, `# Get catalog metadata
curl https://pumo-rag.stolarnia-ams.workers.dev/api/catalog

# Search products
curl -X POST https://pumo-rag.stolarnia-ams.workers.dev/api/search \\
  -H "Content-Type: application/json" \\
  -d '{"query":"nowoczesne krzes\u0142a biurowe","limit":5}'`), "head": async ($$result2) => renderTemplate`<meta name="robots" content="noindex, nofollow">` })} `;
}, "U:/WWW_MYbonzoai_blog/src/pages/pumo-guide/api-docs.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/pumo-guide/api-docs.astro";
const $$url = "/pumo-guide/api-docs";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ApiDocs,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
