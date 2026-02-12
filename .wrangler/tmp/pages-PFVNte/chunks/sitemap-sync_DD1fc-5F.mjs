globalThis.process ??= {}; globalThis.process.env ??= {};
class SitemapSync {
  constructor(env) {
    this.baseUrl = "https://meblepumo.pl";
    this.env = env;
  }
  async syncProductUrls() {
    console.log("🗺️ Starting Sitemap Sync...");
    if (!await this.checkRateLimit("meblepumo")) {
      console.warn("🚦 Rate limit exceeded for today. Skipping sync.");
      return { updated: 0, total: 0 };
    }
    const sitemapIndexUrl = `${this.baseUrl}/sitemap.xml.gz`;
    const sitemapIndex = await this.fetchXml(sitemapIndexUrl);
    const productSitemaps = this.parseSitemapIndex(sitemapIndex);
    console.log(`📑 Found ${productSitemaps.length} product sitemaps`);
    let totalUpdated = 0;
    let totalProcessed = 0;
    for (const url of productSitemaps) {
      console.log(`Processing sitemap: ${url}`);
      const sitemapContent = await this.fetchXml(url);
      const urls = this.parseUrlSet(sitemapContent);
      const batchSize = 50;
      for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        await this.updateBatch(batch);
        totalUpdated += batch.length;
      }
      totalProcessed += urls.length;
    }
    return { updated: totalUpdated, total: totalProcessed };
  }
  async generateTrackedUrl(productId, campaign = "rag_ai", medium = "ai_guide") {
    const result = await this.env.DB.prepare(
      "SELECT real_url FROM products WHERE id = ?"
    ).bind(productId).first();
    let baseUrl = result?.real_url;
    if (!baseUrl) {
      baseUrl = `${this.baseUrl}/pl/n/search?q=${productId}`;
    }
    const utmParams = new URLSearchParams({
      utm_source: "mybonzo",
      utm_medium: medium,
      utm_campaign: campaign
    });
    return `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}${utmParams.toString()}`;
  }
  async updateBatch(urls) {
    const stmt = this.env.DB.prepare(`
      UPDATE products 
      SET real_url = ?1, url_slug = ?2
      WHERE id = ?3
    `);
    const batch = urls.map((url) => {
      const match = url.match(/-(\d+)(\.html)?$/);
      const id = match ? match[1] : null;
      const slug = url.split("/").pop() || "";
      if (!id) return null;
      return stmt.bind(url, slug, id);
    }).filter(Boolean);
    if (batch.length > 0) {
      await this.env.DB.batch(batch);
    }
  }
  async fetchXml(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    if (bytes[0] === 31 && bytes[1] === 139) {
      console.log(`📦 Detected GZIP content for ${url}, decompressing...`);
      const stream = new Response(buffer).body?.pipeThrough(new DecompressionStream("gzip"));
      if (stream) {
        return await new Response(stream).text();
      }
    }
    return new TextDecoder().decode(buffer);
  }
  parseSitemapIndex(xml) {
    console.log(`🔍 Parsing Sitemap Index (len: ${xml.length})`);
    console.log(`📄 Preview: ${xml.substring(0, 200)}...`);
    const regex = /<loc>(.+?)<\/loc>/g;
    const matches = [...xml.matchAll(regex)];
    const urls = matches.map((m) => m[1].trim());
    console.log(`found ${urls.length} potential sitemaps`);
    const sitemaps = urls.filter((u) => u.includes("sitemap"));
    console.log(`✅ Valid sitemaps: ${sitemaps.length}`);
    return sitemaps;
  }
  parseUrlSet(xml) {
    console.log(`🔍 Parsing URL Set (len: ${xml.length})`);
    const regex = /<loc>(.+?)<\/loc>/g;
    const matches = [...xml.matchAll(regex)];
    const urls = matches.map((m) => m[1].trim());
    const products = urls.filter((u) => u.includes("/pl/p/") || u.includes("/pl/products/"));
    console.log(`Found ${urls.length} URLs, ${products.length} are products`);
    if (products.length > 0) {
      console.log(`Example product: ${products[0]}`);
    }
    return products;
  }
  async checkRateLimit(store) {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const { results } = await this.env.DB.prepare(`
      SELECT COUNT(*) as calls 
      FROM rate_limits 
      WHERE store = ? AND date = ?
    `).bind(store, today).all();
    const count = results[0].calls;
    if (count >= 10) {
      console.warn(`⏳ Rate limit reached: ${count}/10 for ${store} today`);
      return false;
    }
    await this.env.DB.prepare(`
      INSERT INTO rate_limits (store, date) VALUES (?, ?)
    `).bind(store, today).run();
    console.log(`✅ Rate limit check pass: ${count + 1}/10 for ${store}`);
    return true;
  }
}

export { SitemapSync as S };
