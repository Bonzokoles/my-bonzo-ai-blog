import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, locals }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('q');

  if (!query) {
    return new Response(JSON.stringify({ error: "Missing 'q' parameter" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Determine Worker URL (Production vs Dev fallback)
  // In production, this should point to the deployed worker
  const WORKER_URL = import.meta.env.PUMO_RAG_WORKER_URL || "https://pumo-rag.stolarnia-ams.workers.dev/api/search";
  const API_KEY = import.meta.env.INTERNAL_API_KEY; // Optional: for secure internal access if configured

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(API_KEY ? { "Authorization": `Bearer ${API_KEY}` } : {})
      },
      body: JSON.stringify({ query: query, limit: 5 })
    });

    if (!response.ok) {
      throw new Error(`Worker responded with ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60' // Cache search results briefly
      }
    });

  } catch (error) {
    console.error("PUMO Search API Error:", error);
    return new Response(JSON.stringify({
      error: "Search unavailable",
      message: error instanceof Error ? error.message : String(error)
    }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
