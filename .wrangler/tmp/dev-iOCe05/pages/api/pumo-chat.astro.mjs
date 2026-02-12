globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

class ProductExtractorService {
  constructor(env) {
    this.env = env;
  }
  /**
   * Extract product mentions from query using Gemini Flash via OpenRouter
   */
  async extractProductsWithGemini(query) {
    const rawApiKey = this.env.OPENROUTER_API_KEY;
    if (!rawApiKey) {
      console.warn("[ProductExtractor] OPENROUTER_API_KEY not configured");
      return [];
    }
    const apiKey = rawApiKey.trim().replace(/\s/g, "");
    if (!apiKey) {
      console.warn("[ProductExtractor] OPENROUTER_API_KEY is empty after sanitization");
      return [];
    }
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://mybonzoaiblog.pages.dev",
            "X-Title": "MyBonzo AI Blog"
          },
          body: JSON.stringify({
            model: "google/gemini-2.0-flash-exp:free",
            messages: [{
              role: "user",
              content: `Extract furniture product mentions from this query. Return JSON array of products.

Query: "${query}"

Extract:
- Product type (fotel, krzesło, biurko, etc.)
- Product name if mentioned
- Category if mentioned
- Price range if mentioned (min/max in PLN)

Return JSON format:
[
  {
    "name": "fotel bujany",
    "category": "fotele",
    "priceRange": {"min": 0, "max": 500}
  }
]

If no products mentioned, return empty array [].`
            }],
            temperature: 0.1,
            max_tokens: 500
          })
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.error("[ProductExtractor] OpenRouter API error:", response.status, errorText);
        return [];
      }
      const data = await response.json();
      const textResponse = data.choices?.[0]?.message?.content || "[]";
      const jsonMatch = textResponse.match(/\[[\s\S]*\]/);
      if (!jsonMatch) return [];
      const extracted = JSON.parse(jsonMatch[0]);
      console.log(`[ProductExtractor] OpenRouter/Gemini extracted ${extracted.length} products`);
      return extracted;
    } catch (error) {
      console.error("[ProductExtractor] Extraction failed:", error);
      return [];
    }
  }
  /**
   * Query D1 for products matching extracted criteria
   */
  async findProductsInDB(extracted) {
    if (!this.env.DB || extracted.length === 0) {
      return [];
    }
    const enriched = [];
    for (const item of extracted) {
      try {
        let sql = `SELECT id, name, price, category, real_url FROM products WHERE 1=1`;
        const params = [];
        if (item.name) {
          sql += ` AND LOWER(name) LIKE ?`;
          params.push(`%${item.name.toLowerCase()}%`);
        }
        if (item.category) {
          sql += ` AND LOWER(category) LIKE ?`;
          params.push(`%${item.category.toLowerCase()}%`);
        }
        if (item.priceRange) {
          if (item.priceRange.min !== void 0) {
            sql += ` AND price >= ?`;
            params.push(item.priceRange.min);
          }
          if (item.priceRange.max !== void 0) {
            sql += ` AND price <= ?`;
            params.push(item.priceRange.max);
          }
        }
        sql += ` ORDER BY price ASC LIMIT 5`;
        const { results } = await this.env.DB.prepare(sql).bind(...params).all();
        for (const row of results) {
          if (row.real_url) {
            const trackedUrl = this.generateTrackedUrl(
              row.real_url,
              row.category,
              row.id
            );
            enriched.push({
              id: row.id,
              name: row.name,
              price: row.price,
              category: row.category,
              tracked_url: trackedUrl
            });
          }
        }
      } catch (error) {
        console.error("[ProductExtractor] DB query failed:", error);
      }
    }
    console.log(`[ProductExtractor] Found ${enriched.length} matching products in DB`);
    return enriched;
  }
  /**
   * Generate tracked URL with UTM parameters
   */
  generateTrackedUrl(baseUrl, category, productId) {
    if (!baseUrl) return "";
    if (baseUrl.includes("utm_source")) return baseUrl;
    const categorySlug = (category || "general").toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "_");
    const utmParams = new URLSearchParams({
      utm_source: "mybonzo",
      utm_medium: "rag_chat",
      utm_campaign: `chat_${categorySlug}`,
      utm_content: `product_${productId}`
    });
    return `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}${utmParams.toString()}`;
  }
  /**
   * Main method: Extract products from query and enrich with URLs
   */
  async extractAndEnrich(query) {
    console.log("[ProductExtractor] Processing query:", query);
    const extracted = await this.extractProductsWithGemini(query);
    if (extracted.length === 0) {
      return [];
    }
    const enriched = await this.findProductsInDB(extracted);
    return enriched;
  }
  /**
   * Format enriched products as context for DeepSeek
   */
  formatAsContext(products) {
    if (products.length === 0) return "";
    return `ZNALEZIONE PRODUKTY W BAZIE SKLEPU (z linkami już gotowymi):
` + products.map(
      (p) => `- ${p.name} (Cena: ${p.price} zł, Kategoria: ${p.category})
  Link z tracking: ${p.tracked_url}`
    ).join("\n\n") + "\n\nWAŻNE: Użyj tych dokładnych linków w odpowiedzi. Nie modyfikuj URLi.";
  }
}
function getProductExtractor(env) {
  return new ProductExtractorService(env);
}

const prerender = false;
const POST = async ({ request, locals }) => {
  try {
    const { query, context } = await request.json();
    const env = locals.runtime?.env;
    const apiKey = env?.DEEPSEEK_API_KEY || env?.DEEP_SEEK_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "API key not configured",
          reply: "Przepraszam, system AI jest obecnie niedostępny. Sprawdź ofertę bezpośrednio na www.meblepumo.pl"
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    let productContext = "";
    try {
      const extractor = getProductExtractor(env);
      const enrichedProducts = await extractor.extractAndEnrich(query);
      if (enrichedProducts.length > 0) {
        productContext = extractor.formatAsContext(enrichedProducts);
        console.log(`[Gemini Extractor] Found ${enrichedProducts.length} products with tracked URLs`);
      } else {
        console.log("[Gemini Extractor] No products extracted from query");
      }
    } catch (err) {
      console.error("[Gemini Extractor] Extraction error:", err);
    }
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-reasoner",
        messages: [
          {
            role: "system",
            content: `Jesteś Inteligentnym Asystentem Sklepu Meble Pumo (www.meblepumo.pl). 
            
ZASADY:
1. Opieraj się na dostarczonym KONTEKŚCIE PRODUKTOWYM. Jeśli produkt jest na liście, poleć go.
2. Bądź uprzejmy i profesjonalny.
3. Jeśli polecasz produkt, ZAWSZE podawaj jego cenę i link z kontekstu.
4. Jeśli nie ma produktu w kontekście, zaproś ogólnie na stronę główną lub do kategorii.
5. Nie zmyślaj produktów, których nie ma w bazie.

KONTEKST PRODUKTOWY Z BAZY DANYCH:
${productContext}

Kontekst strony: ${context || "Strona główna przewodnika"}`
          },
          {
            role: "user",
            content: query
          }
        ],
        stream: false
      })
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepSeek API error:", errorText);
      return new Response(
        JSON.stringify({
          error: "API request failed",
          reply: "Wystąpił problem z połączeniem. Odwiedź www.meblepumo.pl lub zobacz nasze przewodniki."
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Brak odpowiedzi";
    return new Response(
      JSON.stringify({ reply }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        reply: "Przepraszam za problem. Sprawdź ofertę na www.meblepumo.pl"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
const OPTIONS = async () => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  OPTIONS,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
