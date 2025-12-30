import type { APIRoute } from "astro";

export const prerender = false;

/**
 * Ping wyszukiwarek o nowych treściach - Bing, Google, ChatGPT/SearchGPT
 * Uruchamiać po każdym deploymencie lub aktualizacji treści
 */

export const POST: APIRoute = async () => {
    const sitemapUrl = "https://mybonzoaiblog.pages.dev/sitemap-pumo.xml";
    const results = {
        bing: { status: "pending", message: "" },
        google: { status: "pending", message: "" },
        chatgpt: { status: "pending", message: "" }
    };

    try {
        // 1. Ping Bing Webmaster Tools
        const bingPing = await fetch(
            `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
            { method: "GET" }
        );
        results.bing.status = bingPing.ok ? "success" : "failed";
        results.bing.message = bingPing.ok
            ? "Sitemap submitted to Bing"
            : `HTTP ${bingPing.status}`;

        // 2. Ping Google Search Console (wymaga weryfikacji domeny)
        try {
            const googlePing = await fetch(
                `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
                { method: "GET" }
            );
            results.google.status = googlePing.ok ? "success" : "failed";
            results.google.message = googlePing.ok
                ? "Sitemap submitted to Google"
                : `HTTP ${googlePing.status}`;
        } catch (e) {
            results.google.status = "error";
            results.google.message = "Może wymagać weryfikacji domeny w GSC";
        }

        // 3. Informacja dla ChatGPT/SearchGPT (przez strukturę danych)
        // ChatGPT używa sitemap.xml + structured data automatycznie
        results.chatgpt.status = "ready";
        results.chatgpt.message = "Sitemap i JSON-LD dostępne dla crawlerów AI";

        // 4. Wywołaj IndexNow dla wszystkich stron pumo-guide
        try {
            const indexNowResponse = await fetch(
                "https://mybonzoaiblog.pages.dev/api/index-now",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        urls: [
                            "/pumo-guide/",
                            "/pumo-guide/agent",
                            // Wszystkie kategorie z sitemap
                        ]
                    })
                }
            );

            if (indexNowResponse.ok) {
                results.bing.message += " + IndexNow submitted";
            }
        } catch (e) {
            // IndexNow jest opcjonalny
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

// GET endpoint - zwraca instrukcje
export const GET: APIRoute = async () => {
    return new Response(
        JSON.stringify({
            info: "POST to this endpoint to ping search engines",
            sitemap: "https://mybonzoaiblog.pages.dev/sitemap-pumo.xml",
            endpoints: {
                bing: "https://www.bing.com/webmasters",
                google: "https://search.google.com/search-console",
                indexnow: "https://www.indexnow.org/",
            },
            usage: "curl -X POST https://mybonzoaiblog.pages.dev/api/ping-search-engines"
        }),
        { headers: { "Content-Type": "application/json" } }
    );
};