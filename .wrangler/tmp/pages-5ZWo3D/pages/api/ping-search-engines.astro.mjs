globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const prerender = false;
const POST = async () => {
  const sitemapUrl = "https://mybonzoaiblog.pages.dev/sitemap-pumo.xml";
  const results = {
    bing: { status: "pending", message: "" },
    google: { status: "pending", message: "" },
    chatgpt: { status: "pending", message: "" }
  };
  try {
    const bingPing = await fetch(
      `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
      { method: "GET" }
    );
    results.bing.status = bingPing.ok ? "success" : "failed";
    results.bing.message = bingPing.ok ? "Sitemap submitted to Bing" : `HTTP ${bingPing.status}`;
    try {
      const googlePing = await fetch(
        `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
        { method: "GET" }
      );
      results.google.status = googlePing.ok ? "success" : "failed";
      results.google.message = googlePing.ok ? "Sitemap submitted to Google" : `HTTP ${googlePing.status}`;
    } catch (e) {
      results.google.status = "error";
      results.google.message = "Może wymagać weryfikacji domeny w GSC";
    }
    results.chatgpt.status = "ready";
    results.chatgpt.message = "Sitemap i JSON-LD dostępne dla crawlerów AI";
    try {
      const indexNowResponse = await fetch(
        "https://mybonzoaiblog.pages.dev/api/index-now",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            urls: [
              "/pumo-guide/",
              "/pumo-guide/agent"
              // Wszystkie kategorie z sitemap
            ]
          })
        }
      );
      if (indexNowResponse.ok) {
        results.bing.message += " + IndexNow submitted";
      }
    } catch (e) {
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
        results
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
  return new Response(JSON.stringify(results), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
const GET = async () => {
  return new Response(
    JSON.stringify({
      info: "POST to this endpoint to ping search engines",
      sitemap: "https://mybonzoaiblog.pages.dev/sitemap-pumo.xml",
      endpoints: {
        bing: "https://www.bing.com/webmasters",
        google: "https://search.google.com/search-console",
        indexnow: "https://www.indexnow.org/"
      },
      usage: "curl -X POST https://mybonzoaiblog.pages.dev/api/ping-search-engines"
    }),
    { headers: { "Content-Type": "application/json" } }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    POST,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
