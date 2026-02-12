globalThis.process ??= {}; globalThis.process.env ??= {};
class ProductManager {
  constructor(env) {
    this.env = env;
    this.initialized = false;
  }
  /**
   * Inicjalizacja - sprawdzenie czy tabela products istnieje
   */
  async initialize() {
    if (this.initialized) return;
    console.log("🔧 DEBUG: NODE_ENV =", process?.env?.NODE_ENV);
    console.log("🔧 DEBUG: Has DB =", !!this.env?.DB);
    if (!this.env?.DB) {
      console.log("⚠️ Running in local mode - no D1 Database access");
      this.initialized = true;
      return;
    }
    try {
      const { results } = await this.env.DB.prepare(`
        SELECT COUNT(*) as count FROM products LIMIT 1
      `).all();
      console.log(`✅ D1 Database connected - products table ready`);
      this.initialized = true;
    } catch (error) {
      console.error("❌ D1 Database initialization failed:", error);
      const errorMessage = error?.message || "";
      const isLocalDev = process?.env?.NODE_ENV === "development" || process?.env?.MODE === "development" || errorMessage.includes("no such table") || errorMessage.includes("SQLITE_ERROR");
      console.log("🔧 DEBUG: isLocalDev =", isLocalDev, "errorMessage =", errorMessage);
      this.initialized = true;
    }
  }
  /**
   * Pobiera produkty według kategorii
   */
  async getProductsByCategory(category) {
    await this.initialize();
    const isLocal = !this.env?.DB || process?.env?.NODE_ENV === "development";
    if (isLocal) {
      console.log(`🏠 Local mode - returning mock products for category: ${category}`);
      return [
        {
          id: "1",
          name: `Przykładowy ${category}`,
          category,
          price: 1e3,
          description: "Mock produkt dla trybu lokalnego",
          images: [],
          availability: "available",
          url: "https://example.com/mock-product",
          sku: "MOCK001",
          manufacturer: "Mock Manufacturer",
          tracked_url: ""
        }
      ];
    }
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
      return results.map((row) => ({
        id: row.id,
        name: row.name,
        category: row.category || "",
        price: row.price || 0,
        manufacturer: row.manufacturer || "",
        url: row.url,
        tracked_url: this.generateTrackedUrl(row.url, row.category)
      }));
    } catch (error) {
      console.error("❌ Failed to get products by category:", error);
      return [];
    }
  }
  /**
   * Pobiera produkt po ID
   */
  async getProduct(id) {
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
      const row = results[0];
      return {
        id: row.id,
        name: row.name,
        category: row.category || "",
        price: row.price || 0,
        manufacturer: row.manufacturer || "",
        url: row.url,
        tracked_url: this.generateTrackedUrl(row.url, row.category)
      };
    } catch (error) {
      console.error("❌ Failed to get product:", error);
      return null;
    }
  }
  /**
   * Generuje tracked URL z UTM parameters
   */
  generateTrackedUrl(url, category, source = "mybonzo") {
    if (!url) return "";
    const categorySlug = category.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "_").replace(/^-+|-+$/g, "");
    const utmParams = new URLSearchParams({
      utm_source: source,
      utm_medium: "ai_guide",
      utm_campaign: `buying_guide_${categorySlug}`
    });
    return `${url}${url.includes("?") ? "&" : "?"}${utmParams.toString()}`;
  }
  /**
   * Pobiera wszystkie kategorie
   */
  async getCategories() {
    await this.initialize();
    const isLocal = !this.env?.DB || process?.env?.NODE_ENV === "development";
    if (isLocal) {
      console.log("🏠 Local mode - returning mock categories");
      return [
        "Biurka",
        "Krzesła",
        "Szafy",
        "Stoły",
        "Łóżka",
        "Komody",
        "Regały",
        "Fotele",
        "Sofy",
        "Szafki"
      ];
    }
    try {
      const { results } = await this.env.DB.prepare(`
        SELECT DISTINCT category 
        FROM products 
        WHERE category IS NOT NULL AND category != ''
        ORDER BY category
      `).all();
      return results.map((row) => row.category).filter(Boolean);
    } catch (error) {
      console.error("❌ Failed to get categories:", error);
      return [];
    }
  }
  /**
   * Wyszukiwanie produktów
   */
  async searchProducts(query, limit = 10) {
    await this.initialize();
    const isLocal = !this.env?.DB || process?.env?.NODE_ENV === "development";
    if (isLocal) {
      console.log(`🏠 Local mode - returning mock search results for: ${query}`);
      return [
        {
          id: "1",
          name: `${query} - Mock Result 1`,
          category: "Meble",
          price: 800,
          description: `Mock wynik wyszukiwania dla "${query}"`,
          images: [],
          availability: "available",
          url: "https://example.com/mock-search-1",
          sku: "SEARCH001",
          manufacturer: "Mock Manufacturer",
          tracked_url: ""
        },
        {
          id: "2",
          name: `${query} - Mock Result 2`,
          category: "Akcesoria",
          price: 1200,
          description: `Drugi mock wynik dla "${query}"`,
          images: [],
          availability: "available",
          url: "https://example.com/mock-search-2",
          sku: "SEARCH002",
          manufacturer: "Mock Manufacturer",
          tracked_url: ""
        }
      ].slice(0, limit);
    }
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
      return results.map((row) => ({
        id: row.id,
        name: row.name,
        category: row.category || "",
        price: row.price || 0,
        manufacturer: row.manufacturer || "",
        url: row.url,
        tracked_url: this.generateTrackedUrl(row.url, row.category)
      }));
    } catch (error) {
      console.error("❌ Failed to search products:", error);
      return [];
    }
  }
  /**
   * Pobiera najlepsze produkty z kategorii (sortowane po cenie)
   */
  async getTopProductsInCategory(category, limit = 5) {
    const products = await this.getProductsByCategory(category);
    return products.sort((a, b) => b.price - a.price).slice(0, limit);
  }
  /**
   * Statystyki produktów - zoptymalizowane dla dużych zbiorów danych
   */
  async getStats() {
    await this.initialize();
    const isLocal = !this.env?.DB || process?.env?.NODE_ENV === "development";
    if (isLocal) {
      console.log("🏠 Local mode - returning mock stats");
      return {
        totalProducts: 2130,
        categories: 68,
        avgPrice: 1020,
        priceRange: { min: 50, max: 15e3 }
      };
    }
    try {
      const countResult = await this.env.DB.prepare(`
                SELECT COUNT(*) as total FROM products
            `).first();
      const categoriesResult = await this.env.DB.prepare(`
                SELECT COUNT(DISTINCT category) as categories FROM products
            `).first();
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
        totalProducts: countResult?.total || 0,
        categories: categoriesResult?.categories || 0,
        avgPrice: priceResult?.avg_price || 0,
        priceRange: {
          min: priceResult?.min_price || 0,
          max: priceResult?.max_price || 0
        }
      };
    } catch (error) {
      console.error("❌ Failed to get stats:", error);
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
  async importProductsFromJson(jsonData) {
    await this.initialize();
    if (!this.env?.DB) throw new Error("D1 Database not available");
    const products = Object.values(jsonData);
    let imported = 0;
    try {
      const batchSize = 100;
      for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);
        const stmt = this.env.DB.prepare(`
          INSERT OR REPLACE INTO products (id, name, category, price, url, description)
          VALUES (?, ?, ?, ?, ?, ?)
        `);
        const batchStmts = batch.map(
          (product) => stmt.bind(
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
      console.error("❌ Failed to import products:", error);
      throw error;
    }
  }
}
let productManagerInstance = null;
function getProductManager(env) {
  if (!productManagerInstance) {
    productManagerInstance = new ProductManager(env);
  }
  return productManagerInstance;
}

export { getProductManager as g };
