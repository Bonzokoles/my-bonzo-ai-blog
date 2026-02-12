globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getProductManager } from '../../../chunks/product-manager-d1_C97ggFJZ.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, locals }) => {
  const startTime = performance.now();
  const runtime = locals?.runtime;
  const env = runtime?.env;
  if (!env?.VECTORIZE_INDEX || !env?.AI || !env?.DB) {
    return new Response(JSON.stringify({
      success: false,
      error: {
        code: "CONFIG_ERROR",
        message: "Server misconfiguration: AI, DB or Vectorize binding missing."
      }
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
  try {
    const body = await request.json();
    if (!body.query || typeof body.query !== "string") {
      return new Response(JSON.stringify({
        success: false,
        error: {
          code: "INVALID_REQUEST",
          message: "Missing or invalid 'query' parameter."
        }
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const limit = body.limit || 5;
    const threshold = body.threshold || 0.6;
    const embeddingModel = "@cf/baai/bge-base-en-v1.5";
    const embeddingResponse = await env.AI.run(embeddingModel, {
      text: [body.query]
    });
    if (!embeddingResponse || !embeddingResponse.data || !embeddingResponse.data[0]) {
      throw new Error("Failed to generate embeddings from AI service.");
    }
    const queryVector = embeddingResponse.data[0];
    const vectorResults = await env.VECTORIZE_INDEX.query(queryVector, {
      topK: limit,
      returnMetadata: true
    });
    const results = [];
    if (vectorResults && vectorResults.matches && vectorResults.matches.length > 0) {
      const productManager = getProductManager(env);
      for (const match of vectorResults.matches) {
        if (match.score < threshold) continue;
        let productData = null;
        try {
          productData = await productManager.getProductById(match.id);
        } catch (e) {
          console.warn(`Failed to hydrate product ${match.id}`, e);
        }
        if (productData) {
          results.push({
            id: match.id,
            score: match.score,
            metadata: match.metadata,
            product: productData
          });
        }
      }
    }
    const endTime = performance.now();
    return new Response(JSON.stringify({
      success: true,
      data: {
        results,
        count: results.length,
        processingTimeMs: Math.round(endTime - startTime)
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("[Vector Search Error]:", error);
    return new Response(JSON.stringify({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred during vector search.",
        details: error.message
      }
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
