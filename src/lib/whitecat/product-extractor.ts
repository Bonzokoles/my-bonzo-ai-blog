import type { Env } from './whitecat-types';

/**
 * Product Extractor Service using Gemini Flash
 * Extracts product mentions from user queries and enriches with URLs
 */

interface ExtractedProduct {
    name: string;
    category?: string;
    priceRange?: { min?: number; max?: number };
}

interface EnrichedProduct {
    id: string;
    name: string;
    price: number;
    category: string;
    tracked_url: string;
}

export class ProductExtractorService {
    constructor(private env: Env) { }

    /**
     * Extract product mentions from query using Gemini Flash via OpenRouter
     */
    private async extractProductsWithGemini(query: string): Promise<ExtractedProduct[]> {
        const rawApiKey = this.env.OPENROUTER_API_KEY;
        if (!rawApiKey) {
            console.warn('[ProductExtractor] OPENROUTER_API_KEY not configured');
            return [];
        }

        // Sanitize API key - remove spaces and trim
        const apiKey = rawApiKey.trim().replace(/\s/g, '');
        if (!apiKey) {
            console.warn('[ProductExtractor] OPENROUTER_API_KEY is empty after sanitization');
            return [];
        }

        try {
            const response = await fetch(
                'https://openrouter.ai/api/v1/chat/completions',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'https://mybonzoaiblog.pages.dev',
                        'X-Title': 'MyBonzo AI Blog'
                    },
                    body: JSON.stringify({
                        model: 'google/gemini-2.0-flash-exp:free',
                        messages: [{
                            role: 'user',
                            content: `Extract furniture product mentions from this query. Return JSON array of products.

Query: "${query}"

Extract:
- Product type (fotel, krzesło, biurko, etc.)
- Product name if mentioned
- Category if mentioned
- Price range if mentioned (min/max in PLN)

Return JSON format:
[
  {
    "name": "fotel bujany",
    "category": "fotele",
    "priceRange": {"min": 0, "max": 500}
  }
]

If no products mentioned, return empty array [].`
                        }],
                        temperature: 0.1,
                        max_tokens: 500
                    })
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error('[ProductExtractor] OpenRouter API error:', response.status, errorText);
                return [];
            }

            const data = await response.json();
            const textResponse = data.choices?.[0]?.message?.content || '[]';

            // Parse JSON from response (Gemini sometimes adds markdown)
            const jsonMatch = textResponse.match(/\[[\s\S]*\]/);
            if (!jsonMatch) return [];

            const extracted = JSON.parse(jsonMatch[0]) as ExtractedProduct[];
            console.log(`[ProductExtractor] OpenRouter/Gemini extracted ${extracted.length} products`);

            return extracted;

        } catch (error) {
            console.error('[ProductExtractor] Extraction failed:', error);
            return [];
        }
    }

    /**
     * Query D1 for products matching extracted criteria
     */
    private async findProductsInDB(extracted: ExtractedProduct[]): Promise<EnrichedProduct[]> {
        if (!this.env.DB || extracted.length === 0) {
            return [];
        }

        const enriched: EnrichedProduct[] = [];

        for (const item of extracted) {
            try {
                // Build SQL query based on extracted criteria
                let sql = `SELECT id, name, price, category, real_url FROM products WHERE 1=1`;
                const params: any[] = [];

                // Match name
                if (item.name) {
                    sql += ` AND LOWER(name) LIKE ?`;
                    params.push(`%${item.name.toLowerCase()}%`);
                }

                // Match category
                if (item.category) {
                    sql += ` AND LOWER(category) LIKE ?`;
                    params.push(`%${item.category.toLowerCase()}%`);
                }

                // Match price range
                if (item.priceRange) {
                    if (item.priceRange.min !== undefined) {
                        sql += ` AND price >= ?`;
                        params.push(item.priceRange.min);
                    }
                    if (item.priceRange.max !== undefined) {
                        sql += ` AND price <= ?`;
                        params.push(item.priceRange.max);
                    }
                }

                sql += ` ORDER BY price ASC LIMIT 5`;

                const { results } = await this.env.DB.prepare(sql).bind(...params).all();

                for (const row of results as any[]) {
                    if (row.real_url) {
                        const trackedUrl = this.generateTrackedUrl(
                            row.real_url,
                            row.category,
                            row.id
                        );

                        enriched.push({
                            id: row.id,
                            name: row.name,
                            price: row.price,
                            category: row.category,
                            tracked_url: trackedUrl
                        });
                    }
                }

            } catch (error) {
                console.error('[ProductExtractor] DB query failed:', error);
            }
        }

        console.log(`[ProductExtractor] Found ${enriched.length} matching products in DB`);
        return enriched;
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
     * Main method: Extract products from query and enrich with URLs
     */
    async extractAndEnrich(query: string): Promise<EnrichedProduct[]> {
        console.log('[ProductExtractor] Processing query:', query);

        // Step 1: Extract with Gemini Flash
        const extracted = await this.extractProductsWithGemini(query);
        if (extracted.length === 0) {
            return [];
        }

        // Step 2: Find in D1 and add tracked URLs
        const enriched = await this.findProductsInDB(extracted);

        return enriched;
    }

    /**
     * Format enriched products as context for DeepSeek
     */
    formatAsContext(products: EnrichedProduct[]): string {
        if (products.length === 0) return '';

        return `ZNALEZIONE PRODUKTY W BAZIE SKLEPU (z linkami już gotowymi):\n` +
            products.map(p =>
                `- ${p.name} (Cena: ${p.price} zł, Kategoria: ${p.category})\n` +
                `  Link z tracking: ${p.tracked_url}`
            ).join('\n\n') + '\n\n' +
            'WAŻNE: Użyj tych dokładnych linków w odpowiedzi. Nie modyfikuj URLi.';
    }
}

/**
 * Factory function
 */
export function getProductExtractor(env: Env): ProductExtractorService {
    return new ProductExtractorService(env);
}
