globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const GET = async ({ request, locals }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");
  if (!query) {
    return new Response(JSON.stringify({ error: "Missing 'q' parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const WORKER_URL = "https://pumo-rag.stolarnia-ams.workers.dev/api/search";
  const API_KEY = undefined                                ;
  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...API_KEY ? { "Authorization": `Bearer ${API_KEY}` } : {}
      },
      body: JSON.stringify({ query, limit: 5 })
    });
    if (!response.ok) {
      throw new Error(`Worker responded with ${response.status}`);
    }
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60"
        // Cache search results briefly
      }
    });
  } catch (error) {
    console.error("PUMO Search API Error:", error);
    return new Response(JSON.stringify({
      error: "Search unavailable",
      message: error instanceof Error ? error.message : String(error)
    }), {
      status: 502,
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
