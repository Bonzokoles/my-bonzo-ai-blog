/**
 * Product Manager - Integracja mapowania produktów z systemem MyBonzo
 * Wykorzystuje dane z WHITECAT operation dla UTM tracking i revenue attribution
 */

interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    manufacturer: string;
    url: string;
    tracked_url: string;
}

interface ProductData {
    [key: string]: Product;
}

export class ProductManager {
    private products: ProductData | null = null;

    constructor(private env?: any) { }

    /**
     * Inicjalizacja danych produktów z JSON mapping
     */
    async initialize(): Promise<void> {
        if (this.products) return;

        try {
            // Ładuj produkty z JSON mapping (WHITECAT operation)
            const response = await fetch('https://raw.githubusercontent.com/Bonzokoles/whitecat-products/main/products.json');

            if (!response.ok) {
                // Fallback - lokalne dane z cache
                if (this.env?.CACHE) {
                    const cached = await this.env.CACHE.get('products:mapping');
                    if (cached) {
                        this.products = JSON.parse(cached);
                        return;
                    }
                }
                throw new Error('Products data not available');
            }

            this.products = await response.json();

            // Cache produktów
            if (this.env?.CACHE) {
                await this.env.CACHE.put('products:mapping', JSON.stringify(this.products), {
                    expirationTtl: 86400 // 24 hours
                });
            }

            console.log(`✅ Loaded ${Object.keys(this.products).length} products`);
        } catch (error) {
            console.error('❌ Failed to load products:', error);
            this.products = {};
        }
    }

    /**
     * Pobiera produkty według kategorii
     */
    async getProductsByCategory(category: string): Promise<Product[]> {
        await this.initialize();

        if (!this.env?.DB) return [];

        try {
            const { results } = await this.env.DB.prepare(`
        SELECT 
          id,
          name,
          category,
          price,
          url,
          url as tracked_url,
          COALESCE(description, '') as manufacturer
        FROM products 
        WHERE category LIKE ? 
        ORDER BY price DESC 
        LIMIT 50
      `).bind(`%${category}%`).all();

            return results.map((row: any) => ({
                id: row.id,
                name: row.name,
                category: row.category || '',
                price: row.price || 0,
                manufacturer: row.manufacturer || '',
                url: row.url,
                tracked_url: this.generateTrackedUrl(row.url, row.category)
            }));
        } catch (error) {
            console.error('❌ Failed to get products by category:', error);
            return [];
        }
        await this.initialize();

        if (!this.env?.DB) return null;

        try {
            const { results } = await this.env.DB.prepare(`
        SELECT 
          id,
          name,
          category,
          price,
          url,
          COALESCE(description, '') as manufacturer
        FROM products 
        WHERE id = ?
      `).bind(id).all();

            if (results.length === 0) return null;

            const row = results[0] as any;
            return {
                id: row.id,
                name: row.name,
                category: row.category || '',
                price: row.price || 0,
                manufacturer: row.manufacturer || '',
                url: row.url,
                tracked_url: this.generateTrackedUrl(row.url, row.category)
            };
        } catch (error) {
            console.error('❌ Failed to get product:', error);
            return null;
        }
        if (!this.products || !this.products[productId]) return null;

        const product = this.products[productId];
        return product.tracked_url;
    }

    /**
     * Pobiera wszystkie kategorie
     */
    async getCategories(): Promise<string[]> {
        await this.initialize();

        if (!this.env?.DB) return [];

        try {
            const { results } = await this.env.DB.prepare(`
        SELECT DISTINCT category 
        FROM products 
        WHERE category IS NOT NULL AND category != ''
        ORDER BY category
      `).all();

            return results.map((row: any) => row.category).filter(Boolean);
        } catch (error) {
            console.error('❌ Failed to get categories:', error);
            return [];
        }
        await this.initialize();

        if (!this.env?.DB) return [];

        try {
            const searchTerm = `%${query.toLowerCase()}%`;
            const { results } = await this.env.DB.prepare(`
        SELECT 
          id,
          name,
          category,
          price,
          url,
          COALESCE(description, '') as manufacturer
        FROM products 
        WHERE (
          LOWER(name) LIKE ? OR 
          LOWER(category) LIKE ? OR 
          LOWER(description) LIKE ?
        )
        ORDER BY price DESC
        LIMIT ?
      `).bind(searchTerm, searchTerm, searchTerm, limit).all();

            return results.map((row: any) => ({
                id: row.id,
                name: row.name,
                category: row.category || '',
                price: row.price || 0,
                manufacturer: row.manufacturer || '',
                url: row.url,
                tracked_url: this.generateTrackedUrl(row.url, row.category)
            }));
        } catch (error) {
            console.error('❌ Failed to search products:', error);
            return [];
        }
        const products = await this.getProductsByCategory(category);

        return products
            .sort((a, b) => b.price - a.price) // Sortuj od najdroższych (premium first)
            .slice(0, limit);
    }

    /**
     * Statystyki produktów
     */
    async getStats(): Promise<{
        totalProducts: number;
        categories: number;
        avgPrice: number;
        priceRange: { min: number; max: number };
    }> {
        await this.initialize();

        if (!this.products) return {
            totalProducts: 0,
            categories: 0,
            avgPrice: 0,
            priceRange: { min: 0, max: 0 }
        };

        const productArray = Object.values(this.products);
        const prices = productArray.map(p => p.price);
        const categories = new Set(productArray.map(p => p.category));

        return {
            totalProducts: productArray.length,
            categories: categories.size,
            avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length,
            priceRange: {
                min: Math.min(...prices),
                max: Math.max(...prices)
            }
        };
    }
}

// Export singleton instance
let productManagerInstance: ProductManager | null = null;

export function getProductManager(env?: any): ProductManager {
    if (!productManagerInstance) {
        productManagerInstance = new ProductManager(env);
    }
    return productManagerInstance;
}