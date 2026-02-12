globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { query, domain } = body;
    const url = new URL(request.url);
    const origin = url.origin;
    const searchResponse = await fetch(`${origin}/api/ai/vector-search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, limit: 5, domain })
    });
    const searchResult = await searchResponse.json();
    const products = searchResult.data?.results || [];
    const productContext = products.map((p) => {
      const prod = p.product;
      if (!prod) return "";
      return `Product: ${prod.name}
Price: ${prod.price} PLN
Category: ${prod.category}
Availability: ${prod.availability || "Unknown"}
Link: ${prod.url}`;
    }).join("\n---\n");
    const businessContext = `Shop: Meble Pumo
Domain: ${domain || "meblepumo.pl"}
Special offers: Free shipping over 2000 PLN.
Return policy: 30 days.`;
    return new Response(JSON.stringify({
      context: `
[BUSINESS INFO]
${businessContext}

[RELEVANT PRODUCTS]
${productContext}
            `,
      sourceDocs: products
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("RAG Data Error:", error);
    return new Response(JSON.stringify({
      error: "Failed to generate RAG context",
      context: "System unavailable."
    }), { status: 500 });
  }
};
const GET = async () => {
  return new Response(JSON.stringify({
    message: "Use POST with { query } to get RAG context."
  }), { status: 405 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
