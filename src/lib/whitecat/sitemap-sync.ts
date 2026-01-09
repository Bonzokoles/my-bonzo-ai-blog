import { Env } from './whitecat-types';

export class SitemapSync {
  private env: Env;
  private baseUrl = 'https://meblepumo.pl';

  constructor(env: Env) {
    this.env = env;
  }

  async syncProductUrls(): Promise<{ updated: number, total: number }> {
    console.log('🗺️ Starting Sitemap Sync...');
    
    // 1. Fetch sitemap index
    const sitemapIndexUrl = `${this.baseUrl}/sitemap.xml.gz`;
    const sitemapIndex = await this.fetchXml(sitemapIndexUrl);
    
    // 2. Find product sitemaps (usually sitemap-products-*.xml)
    const productSitemaps = this.parseSitemapIndex(sitemapIndex);
    console.log(`📑 Found ${productSitemaps.length} product sitemaps`);

    let totalUpdated = 0;
    let totalProcessed = 0;

    // 3. Process each sitemap
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

  async generateTrackedUrl(productId: string, campaign: string = 'rag_ai', medium: string = 'ai_guide'): Promise<string> {
    // Get real URL from DB
    const result = await this.env.DB.prepare(
      'SELECT real_url FROM products WHERE id = ?'
    ).bind(productId).first<{ real_url: string }>();

    let baseUrl = result?.real_url;

    // Fallback if not synced yet
    if (!baseUrl) {
       // Try to construct standard Pumo URL format: /pl/p/Name-Slug/ID if possible, 
       // but without slug we can only guess or use search. 
       // For now, fallback to search page or main page
       baseUrl = `${this.baseUrl}/pl/n/search?q=${productId}`; 
    }

    const utmParams = new URLSearchParams({
      utm_source: 'mybonzo',
      utm_medium: medium,
      utm_campaign: campaign
    });

    return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${utmParams.toString()}`;
  }

  private async updateBatch(urls: string[]) {
    const stmt = this.env.DB.prepare(`
      UPDATE products 
      SET real_url = ?1, url_slug = ?2
      WHERE id = ?3
    `);

    const batch = urls.map(url => {
      const match = url.match(/-(\d+)(\.html)?$/); // Extract ID at end
      const id = match ? match[1] : null;
      const slug = url.split('/').pop() || '';
      
      if (!id) return null;
      
      return stmt.bind(url, slug, id);
    }).filter(Boolean);

    if (batch.length > 0) {
      // @ts-ignore - D1 Types issue
      await this.env.DB.batch(batch);
    }
  }

  private async fetchXml(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
    
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    
    // Check for GZIP magic bytes (1F 8B)
    if (bytes[0] === 0x1f && bytes[1] === 0x8b) {
        console.log(`📦 Detected GZIP content for ${url}, decompressing...`);
        const stream = new Response(buffer).body?.pipeThrough(new DecompressionStream('gzip'));
        if (stream) {
            return await new Response(stream).text();
        }
    }
    
    return new TextDecoder().decode(buffer);
  }

  private parseSitemapIndex(xml: string): string[] {
    console.log(`🔍 Parsing Sitemap Index (len: ${xml.length})`);
    console.log(`📄 Preview: ${xml.substring(0, 200)}...`);
    
    // Simplest regex for <loc>...</loc>
    const regex = /<loc>(.+?)<\/loc>/g;
    const matches = [...xml.matchAll(regex)];
    const urls = matches.map(m => m[1].trim());
    
    console.log(`found ${urls.length} potential sitemaps`);
    
    // Filter for sitemaps if needed, but usually index only has sitemaps
    const sitemaps = urls.filter(u => u.includes('sitemap'));
    console.log(`✅ Valid sitemaps: ${sitemaps.length}`);
    return sitemaps;
  }

  private parseUrlSet(xml: string): string[] {
    console.log(`🔍 Parsing URL Set (len: ${xml.length})`);
    
    const regex = /<loc>(.+?)<\/loc>/g;
    const matches = [...xml.matchAll(regex)];
    const urls = matches.map(m => m[1].trim());
    
    // Filter for product URLs
    const products = urls.filter(u => u.includes('/pl/p/') || u.includes('/pl/products/'));
    
    console.log(`Found ${urls.length} URLs, ${products.length} are products`);
    if (products.length > 0) {
        console.log(`Example product: ${products[0]}`);
    }
    
    return products;
  }
}
