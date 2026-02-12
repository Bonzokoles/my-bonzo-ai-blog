globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getGuideGenerator } from '../../chunks/guide-generator_B8ZqTjA1.mjs';
import { g as getProductManager } from '../../chunks/product-manager-d1_C97ggFJZ.mjs';
export { renderers } from '../../renderers.mjs';

const PUMO_RAG_API = "https://pumo-rag.stolarnia-ams.workers.dev/api/search";
function buildProductUrl(baseUrl, utmParams) {
  if (!baseUrl) return "";
  try {
    const url = new URL(baseUrl);
    Object.entries(utmParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    return url.toString();
  } catch (error) {
    console.error("Error building URL:", error);
    return baseUrl;
  }
}
async function searchPumoRag(query, limit = 50) {
  try {
    const response = await fetch(PUMO_RAG_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, limit })
    });
    if (!response.ok) {
      throw new Error(`PUMO RAG API error: ${response.status}`);
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("PUMO RAG search error:", error);
    return [];
  }
}
const GET = async (context) => {
  try {
    const url = new URL(context.request.url);
    const action = url.searchParams.get("action") || "stats";
    const category = url.searchParams.get("category");
    const runtime = context.locals?.runtime;
    const env = runtime?.env;
    switch (action) {
      case "stats": {
        return new Response(JSON.stringify({
          success: true,
          data: {
            guides: {
              total: 0,
              byCategory: {}
            },
            products: {
              total: 14315,
              categories: 50,
              source: "pumo-rag",
              lastUpdated: "2026-01-24"
            },
            system: "WHITECAT Integration with PUMO RAG",
            version: "2.0.0"
          }
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
      case "categories": {
        const productManager = getProductManager(env);
        const categories = await productManager.getCategories();
        return new Response(JSON.stringify({
          success: true,
          data: {
            categories,
            total: categories.length
          }
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
      case "products": {
        const searchQuery = category || "meble";
        const limit = 50;
        const ragResults = await searchPumoRag(searchQuery, limit);
        const enrichedProducts = ragResults.map((item) => {
          const productUrl = item.product?.url || "";
          const trackedUrl = buildProductUrl(productUrl, {
            utm_source: "mybonzo",
            utm_medium: "whitecat",
            utm_campaign: "category_browse",
            utm_content: item.id
          });
          return {
            id: item.id,
            name: item.product?.name || "",
            category: item.product?.category || category || "ogólne",
            price: item.product?.price || 0,
            manufacturer: "",
            // PUMO RAG nie ma tego pola
            url: productUrl,
            tracked_url: trackedUrl,
            description: item.product?.description || "",
            images: item.product?.image ? [item.product.image] : [],
            availability: "available",
            // Domyślnie wszystko dostępne
            sku: item.id,
            // Używamy ID jako SKU
            // Dodatkowe pola z PUMO RAG
            currency: item.product?.currency || "PLN",
            relevance: item.relevanceScore
          };
        });
        return new Response(JSON.stringify({
          success: true,
          data: {
            category: category || "all",
            products: enrichedProducts,
            total: enrichedProducts.length,
            utm_tracking: true,
            source: "pumo-rag",
            totalInIndex: 14315
          }
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
      case "search": {
        const query = url.searchParams.get("query");
        if (!query) {
          return new Response(JSON.stringify({
            success: false,
            error: "Query parameter required for search"
          }), { status: 400 });
        }
        const ragResults = await searchPumoRag(query, 10);
        const enrichedProducts = ragResults.map((item) => {
          const productUrl = item.product?.url || "";
          const trackedUrl = buildProductUrl(productUrl, {
            utm_source: "mybonzo",
            utm_medium: "whitecat",
            utm_campaign: "search_results",
            utm_term: query,
            utm_content: item.id
          });
          return {
            id: item.id,
            name: item.product?.name || "",
            category: item.product?.category || "ogólne",
            price: item.product?.price || 0,
            manufacturer: "",
            url: productUrl,
            tracked_url: trackedUrl,
            description: item.product?.description || "",
            images: item.product?.image ? [item.product.image] : [],
            availability: "available",
            sku: item.id,
            currency: item.product?.currency || "PLN",
            relevance: item.relevanceScore
          };
        });
        return new Response(JSON.stringify({
          success: true,
          data: {
            query,
            products: enrichedProducts,
            total: enrichedProducts.length,
            utm_tracking: true,
            source: "pumo-rag"
          }
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
      default:
        return new Response(JSON.stringify({
          success: false,
          error: "Invalid action. Available: stats, categories, products, search"
        }), { status: 400 });
    }
  } catch (error) {
    console.error("[WHITECAT API] Error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const POST = async (context) => {
  try {
    const runtime = context.locals?.runtime;
    const env = runtime?.env;
    const body = await context.request.json();
    const { action, category, query, data } = body;
    switch (action) {
      case "search": {
        if (!query) {
          return new Response(JSON.stringify({
            success: false,
            error: "Query parameter required for search"
          }), { status: 400 });
        }
        const ragResults = await searchPumoRag(query, 20);
        const enrichedProducts = ragResults.map((item) => {
          const productUrl = item.product?.url || "";
          const trackedUrl = buildProductUrl(productUrl, {
            utm_source: "mybonzo",
            utm_medium: "whitecat",
            utm_campaign: "post_search",
            utm_term: query,
            utm_content: item.id
          });
          return {
            id: item.id,
            name: item.product?.name || "",
            category: item.product?.category || "ogólne",
            price: item.product?.price || 0,
            manufacturer: "",
            url: productUrl,
            tracked_url: trackedUrl,
            description: item.product?.description || "",
            images: item.product?.image ? [item.product.image] : [],
            availability: "available",
            sku: item.id,
            currency: item.product?.currency || "PLN",
            relevance: item.relevanceScore
          };
        });
        return new Response(JSON.stringify({
          success: true,
          data: {
            query,
            products: enrichedProducts,
            total: enrichedProducts.length,
            utm_tracking: true,
            source: "pumo-rag"
          }
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
      case "generate-guide": {
        const generator = getGuideGenerator(env);
        const guide = await generator.generateCategoryGuide(category);
        return new Response(JSON.stringify({
          success: true,
          data: {
            message: `Guide generated for category: ${category}`,
            path: `/guides/${guide.metadata.slug}`,
            metadata: guide.metadata
          }
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
      default:
        return new Response(JSON.stringify({
          success: false,
          error: "Invalid action for POST. Available: generate-guide"
        }), { status: 400 });
    }
  } catch (error) {
    console.error("[WHITECAT POST] Error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
