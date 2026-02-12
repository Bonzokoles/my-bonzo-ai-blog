globalThis.process ??= {}; globalThis.process.env ??= {};
import { S as SearchService } from '../../chunks/search-service_BeaKuMhl.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async (context) => {
  console.log("🧪 [RAG-SEARCH] Start - NO MIDDLEWARE");
  try {
    const url = new URL(context.request.url);
    const query = url.searchParams.get("q") || "";
    const mode = url.searchParams.get("mode") || "hybrid";
    const limit = parseInt(url.searchParams.get("limit") || "10");
    if (!query.trim()) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Query parameter "q" is required'
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.log(`🔍 [RAG-SEARCH] Query: "${query}"`);
    const runtime = context.locals?.runtime;
    const env = runtime?.env;
    if (!env) {
      console.error("❌ [RAG-SEARCH] Missing runtime.env");
      throw new Error("Missing runtime environment");
    }
    if (!env.DB) {
      console.error("❌ [RAG-SEARCH] Check: DB binding missing");
      throw new Error("DB binding missing");
    } else {
      console.log("✅ [RAG-SEARCH] Check: DB binding OK");
    }
    if (!env.VECTORIZE_INDEX) {
      console.warn("⚠️ [RAG-SEARCH] Check: VECTORIZE_INDEX binding missing (Semantic search will fail)");
    } else {
      console.log("✅ [RAG-SEARCH] Check: VECTORIZE_INDEX binding OK");
    }
    if (!env.AI) {
      console.warn("⚠️ [RAG-SEARCH] Check: AI binding missing (Semantic search will fail)");
    } else {
      console.log("✅ [RAG-SEARCH] Check: AI binding OK");
    }
    console.log("🚀 [RAG-SEARCH] Initializing SearchService...");
    const searchService = new SearchService(env);
    console.log(`🚀 [RAG-SEARCH] Executing search (mode=${mode})...`);
    const results = await searchService.search({
      query: query.trim(),
      mode,
      limit,
      filters: {}
    });
    console.log(`✅ [RAG-SEARCH] Success. Found ${results.length} results.`);
    return new Response(JSON.stringify({
      success: true,
      data: {
        query,
        mode,
        results: results.map((r) => ({
          id: r.product.id,
          name: r.product.name,
          category: r.product.category,
          price: r.product.price,
          url: r.product.url,
          tracked_url: r.product.tracked_url,
          score: r.score,
          match_type: r.match_type
        })),
        total: results.length,
        vectorize_enabled: !!env?.VECTORIZE_INDEX,
        debug_source: "no-middleware-handler"
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("💥 [RAG-SEARCH] ERROR:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "RAG Search failed (Direct Handler)",
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : void 0,
      query: new URL(context.request.url).searchParams.get("q")
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
