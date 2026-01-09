/**
 * Product Manager - D1 Database Integration
 * Bezpośrednia integracja z bazą D1 dla lepszej wydajności
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

export class ProductManager {
    private initialized = false;

    constructor(private env?: any) { }

    /**
     * Inicjalizacja - sprawdzenie czy tabela products istnieje
     */
    async initialize(): Promise<void> {
        if (this.initialized || !this.env?.DB) return;

        try {
            // Sprawdź czy tabela products istnieje w jimbo-rag-db
            const { results } = await this.env.DB.prepare(`
        SELECT COUNT(*) as count FROM products LIMIT 1
      `).all();

            console.log(`✅ D1 Database connected - products table ready`);
            this.initialized = true;
        } catch (error) {
            console.error('❌ D1 Database initialization failed:', error);
            throw new Error('D1 Database not available');
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
    }

    /**
     * Pobiera produkt po ID
     */
    async getProduct(id: string): Promise<Product | null> {
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
    }

    /**
     * Generuje tracked URL z UTM parameters
     */
    generateTrackedUrl(url: string, category: string, source: string = 'mybonzo'): string {
        if (!url) return '';

        const categorySlug = category
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '_')
            .replace(/^-+|-+$/g, '');

        const utmParams = new URLSearchParams({
            utm_source: source,
            utm_medium: 'ai_guide',
            utm_campaign: `buying_guide_${categorySlug}`
        });

        return `${url}${url.includes('?') ? '&' : '?'}${utmParams.toString()}`;
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
    }

    /**
     * Wyszukiwanie produktów
     */
    async searchProducts(query: string, limit: number = 10): Promise<Product[]> {
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
    }

    /**
     * Pobiera najlepsze produkty z kategorii (sortowane po cenie)
     */
    async getTopProductsInCategory(category: string, limit: number = 5): Promise<Product[]> {
        const products = await this.getProductsByCategory(category);

        return products
            .sort((a, b) => b.price - a.price) // Sortuj od najdroższych (premium first)
            .slice(0, limit);
    }

    /**
     * Statystyki produktów - zoptymalizowane dla dużych zbiorów danych
     */
    async getStats(): Promise<{
        totalProducts: number;
        categories: number;
        avgPrice: number;
        priceRange: { min: number; max: number };
    }> {
        await this.initialize();

        if (!this.env?.DB) return {
            totalProducts: 0,
            categories: 0,
            avgPrice: 0,
            priceRange: { min: 0, max: 0 }
        };

        try {
            // Szybsze zapytanie - tylko count bez agregacji
            const countResult = await this.env.DB.prepare(`
                SELECT COUNT(*) as total FROM products
            `).first();

            const categoriesResult = await this.env.DB.prepare(`
                SELECT COUNT(DISTINCT category) as categories FROM products
            `).first();

            // Uproszczone cenowe statystyki (sample z pierwszych 100 produktów)
            const priceResult = await this.env.DB.prepare(`
                SELECT 
                    AVG(price) as avg_price,
                    MIN(price) as min_price,
                    MAX(price) as max_price
                FROM products
                WHERE price > 0
                LIMIT 500
            `).first();

            return {
                totalProducts: (countResult as any)?.total || 0,
                categories: (categoriesResult as any)?.categories || 0,
                avgPrice: (priceResult as any)?.avg_price || 0,
                priceRange: {
                    min: (priceResult as any)?.min_price || 0,
                    max: (priceResult as any)?.max_price || 0
                }
            };
        } catch (error) {
            console.error('❌ Failed to get stats:', error);
            return {
                totalProducts: 0,
                categories: 0,
                avgPrice: 0,
                priceRange: { min: 0, max: 0 }
            };
        }
    }

    /**
     * Import produktów z JSON do D1 database
     */
    async importProductsFromJson(jsonData: any): Promise<number> {
        await this.initialize();

        if (!this.env?.DB) throw new Error('D1 Database not available');

        const products = Object.values(jsonData) as Product[];
        let imported = 0;

        try {
            // Batch insert products
            const batchSize = 100;
            for (let i = 0; i < products.length; i += batchSize) {
                const batch = products.slice(i, i + batchSize);

                const stmt = this.env.DB.prepare(`
          INSERT OR REPLACE INTO products (id, name, category, price, url, description)
          VALUES (?, ?, ?, ?, ?, ?)
        `);

                const batchStmts = batch.map(product =>
                    stmt.bind(
                        product.id,
                        product.name,
                        product.category,
                        product.price,
                        product.url,
                        product.manufacturer
                    )
                );

                await this.env.DB.batch(batchStmts);
                imported += batch.length;

                console.log(`📦 Imported ${imported}/${products.length} products`);
            }

            console.log(`✅ Successfully imported ${imported} products to D1`);
            return imported;
        } catch (error) {
            console.error('❌ Failed to import products:', error);
            throw error;
        }
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
