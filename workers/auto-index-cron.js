/**
 * CLOUDFLARE WORKER - Auto-indexing Cron Job
 * Automatycznie pinguje wyszukiwarki co 30 minut
 * Deploy: wrangler deploy workers/auto-index-cron.js
 */

export default {
    async fetch(request, env, ctx) {
        return new Response("Auto-indexing cron worker. Use scheduled trigger.", { status: 200 });
    },

    async scheduled(event, env, ctx) {
        console.log("🚀 Cron triggered:", new Date().toISOString());

        const baseUrl = "https://mybonzoaiblog.pages.dev";
        const results = {
            timestamp: new Date().toISOString(),
            indexnow: { status: "pending" },
            bing: { status: "pending" },
            google: { status: "pending" }
        };

        try {
            // 1. Ping własnego API endpoint
            const pingResponse = await fetch(`${baseUrl}/api/ping-search-engines`, {
                method: "POST",
                headers: { "X-Cron-Secret": env.CRON_SECRET || "auto-index-2025" }
            });

            if (pingResponse.ok) {
                const data = await pingResponse.json();
                results.bing = data.bing || { status: "success" };
                results.google = data.google || { status: "success" };
            }

            // 2. IndexNow - wyślij kluczowe strony
            const keyPages = [
                "/pumo-guide/",
                "/pumo-guide/agent",
                "/pumo-guide/Biurka_Biurka_gamingowe",
                "/pumo-guide/Fotele_Fotele_do_biurka",
                "/pumo-guide/Sofy_i_narożniki_Sofy_3_osobowe",
                "/pumo-guide/Łóżka_i_części_Łóżka"
            ];

            const indexNowResponse = await fetch(`${baseUrl}/api/index-now`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ urls: keyPages })
            });

            if (indexNowResponse.ok) {
                results.indexnow.status = "success";
                results.indexnow.urls = keyPages.length;
            }

            // 3. Bezpośredni ping do Bing
            const bingDirect = await fetch(
                `https://www.bing.com/ping?sitemap=${encodeURIComponent(baseUrl + "/sitemap-pumo.xml")}`
            );
            results.bing.direct = bingDirect.ok ? "pinged" : "failed";

            console.log("✅ Indexing completed:", results);

            // Zapisz w KV dla monitoringu (opcjonalne)
            if (env.INDEX_LOG) {
                await env.INDEX_LOG.put(
                    `log:${Date.now()}`,
                    JSON.stringify(results),
                    { expirationTtl: 86400 } // 24h
                );
            }

            return results;

        } catch (error) {
            console.error("❌ Cron error:", error);
            return { error: error.message, results };
        }
    }
};
