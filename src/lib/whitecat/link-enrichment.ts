import type { Env } from './whitecat-types';

/**
 * Link Enrichment Service
 * Enhances AI responses with clickable product links
 */
export class LinkEnrichmentService {
    constructor(private env: Env) {}

    /**
     * Extract product IDs and names from AI response
     */
    private extractProductMentions(text: string): Array<{ id?: string; name: string }> {
        const mentions: Array<{ id?: string; name: string }> = [];
        
        // Pattern 1: Product ID mentions (e.g., "produkt 12345", "ID: 12345")
        const idPattern = /(?:produkt|product|id:?)\s*(\d{3,})/gi;
        let match;
        while ((match = idPattern.exec(text)) !== null) {
            mentions.push({ id: match[1], name: '' });
        }
        
        // Pattern 2: Product name patterns in quotes or titles
        const namePattern = /(?:fotel|łóżko|krzesło|sofa|biurko|stół|szafa|komoda)\s+[\w\s-]+/gi;
        while ((match = namePattern.exec(text)) !== null) {
            mentions.push({ name: match[0], id: undefined });
        }
        
        return mentions;
    }

    /**
     * Fetch product URLs from D1 based on IDs or names
     */
    private async fetchProductUrls(
        mentions: Array<{ id?: string; name: string }>
    ): Promise<Map<string, { url: string; name: string; id: string }>> {
        const urlMap = new Map<string, { url: string; name: string; id: string }>();
        
        if (!this.env.DB) {
            console.warn('DB not available for link enrichment');
            return urlMap;
        }

        // Fetch by IDs
        const ids = mentions.filter(m => m.id).map(m => m.id!);
        if (ids.length > 0) {
            const placeholders = ids.map(() => '?').join(',');
            const { results } = await this.env.DB.prepare(
                `SELECT id, name, real_url, category FROM products WHERE id IN (${placeholders}) LIMIT 20`
            ).bind(...ids).all();
            
            for (const row of results as any[]) {
                if (row.real_url) {
                    const trackedUrl = this.generateTrackedUrl(row.real_url, row.category, row.id);
                    urlMap.set(row.id, {
                        id: row.id,
                        name: row.name,
                        url: trackedUrl
                    });
                }
            }
        }

        // Fetch by names (fuzzy match)
        const names = mentions.filter(m => m.name && !m.id).map(m => m.name);
        if (names.length > 0) {
            for (const name of names.slice(0, 10)) { // Limit to avoid overload
                const { results } = await this.env.DB.prepare(
                    `SELECT id, name, real_url, category FROM products 
                     WHERE LOWER(name) LIKE ? LIMIT 3`
                ).bind(`%${name.toLowerCase()}%`).all();
                
                for (const row of results as any[]) {
                    if (row.real_url && !urlMap.has(row.id)) {
                        const trackedUrl = this.generateTrackedUrl(row.real_url, row.category, row.id);
                        urlMap.set(row.id, {
                            id: row.id,
                            name: row.name,
                            url: trackedUrl
                        });
                    }
                }
            }
        }

        return urlMap;
    }

    /**
     * Generate tracked URL with UTM parameters
     */
    private generateTrackedUrl(baseUrl: string, category: string, productId: string): string {
        if (!baseUrl) return '';
        if (baseUrl.includes('utm_source')) return baseUrl;

        const categorySlug = (category || 'general')
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '_');

        const utmParams = new URLSearchParams({
            utm_source: 'mybonzo',
            utm_medium: 'rag_chat',
            utm_campaign: `chat_${categorySlug}`,
            utm_content: `product_${productId}`
        });

        return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${utmParams.toString()}`;
    }

    /**
     * Enrich AI response with product links
     */
    async enrichWithProductLinks(response: string): Promise<string> {
        console.log('[LinkEnrichment] Enriching response with product links...');
        
        // Extract product mentions
        const mentions = this.extractProductMentions(response);
        if (mentions.length === 0) {
            console.log('[LinkEnrichment] No product mentions found');
            return response;
        }

        console.log(`[LinkEnrichment] Found ${mentions.length} potential product mentions`);

        // Fetch URLs from D1
        const productUrls = await this.fetchProductUrls(mentions);
        console.log(`[LinkEnrichment] Retrieved ${productUrls.size} product URLs`);

        if (productUrls.size === 0) {
            return response;
        }

        // Replace product mentions with markdown links
        let enriched = response;
        
        for (const [productId, data] of productUrls.entries()) {
            // Replace ID mentions
            enriched = enriched.replace(
                new RegExp(`\\b(produkt|product|id:?)\\s*${productId}\\b`, 'gi'),
                `[${data.name}](${data.url})`
            );
            
            // Replace name mentions (case-insensitive, whole words)
            const namePattern = new RegExp(`\\b${this.escapeRegex(data.name)}\\b`, 'gi');
            let replaced = false;
            enriched = enriched.replace(namePattern, (match) => {
                if (!replaced) {
                    replaced = true;
                    return `[${match}](${data.url})`;
                }
                return match; // Only replace first occurrence to avoid over-linking
            });
        }

        console.log(`[LinkEnrichment] Enrichment complete`);
        return enriched;
    }

    /**
     * Escape special regex characters
     */
    private escapeRegex(text: string): string {
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

/**
 * Factory function to create LinkEnrichmentService
 */
export function getLinkEnrichmentService(env: Env): LinkEnrichmentService {
    return new LinkEnrichmentService(env);
}
