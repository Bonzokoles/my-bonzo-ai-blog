globalThis.process ??= {}; globalThis.process.env ??= {};
class SearchService {
  constructor(env) {
    this.env = env;
  }
  async search(query) {
    console.log(`🔍 Search: "${query.query}" (mode: ${query.mode || "hybrid"})`);
    const mode = query.mode || "hybrid";
    if (mode === "semantic") {
      return await this.semanticSearch(query);
    } else if (mode === "keyword") {
      return await this.keywordSearch(query);
    } else {
      return await this.hybridSearch(query);
    }
  }
  async semanticSearch(query) {
    if (!this.env.AI || !this.env.VECTORIZE_INDEX) {
      console.warn("⚠️ Semantic search not available (missing AI/VECTORIZE), returning empty results");
      return [];
    }
    const embedding = await this.env.AI.run("@cf/baai/bge-base-en-v1.5", {
      text: query.query
    });
    const matches = await this.env.VECTORIZE_INDEX.query(embedding.data[0], {
      topK: query.limit || 20,
      returnMetadata: true
    });
    const results = [];
    for (const match of matches.matches) {
      const productId = match.id;
      const product = await this.getProductById(productId);
      if (product && this.matchesFilters(product, query.filters)) {
        results.push({
          product,
          score: match.score,
          match_type: "semantic"
        });
      }
    }
    return results;
  }
  async keywordSearch(query) {
    const searchTerms = query.query.toLowerCase().split(" ");
    const conditions = searchTerms.map(
      () => "(LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(category) LIKE ?)"
    ).join(" AND ");
    const bindings = searchTerms.flatMap((term) => {
      const pattern = `%${term}%`;
      return [pattern, pattern, pattern];
    });
    let sql = `
      SELECT * FROM products 
      WHERE ${conditions}
    `;
    if (query.filters) {
      if (query.filters.category) {
        sql += ` AND category LIKE ?`;
        bindings.push(`%${query.filters.category}%`);
      }
      if (query.filters.min_price !== void 0) {
        sql += ` AND price >= ?`;
        bindings.push(query.filters.min_price);
      }
      if (query.filters.max_price !== void 0) {
        sql += ` AND price <= ?`;
        bindings.push(query.filters.max_price);
      }
      if (query.filters.in_stock) {
        sql += ` AND stock > 0`;
      }
    }
    sql += ` LIMIT ?`;
    bindings.push(query.limit || 20);
    const { results } = await this.env.DB.prepare(sql).bind(...bindings).all();
    return results.map((r) => {
      const product = this.mapRowToProduct(r);
      return {
        product,
        score: this.calculateKeywordScore(product, searchTerms),
        match_type: "keyword"
      };
    });
  }
  async hybridSearch(query) {
    const [semanticResults, keywordResults] = await Promise.all([
      this.semanticSearch(query),
      this.keywordSearch(query)
    ]);
    const combinedMap = /* @__PURE__ */ new Map();
    semanticResults.forEach((result) => {
      combinedMap.set(result.product.id, {
        ...result,
        score: result.score * 0.6,
        match_type: "hybrid"
      });
    });
    keywordResults.forEach((result) => {
      const existing = combinedMap.get(result.product.id);
      if (existing) {
        existing.score += result.score * 0.4;
      } else {
        combinedMap.set(result.product.id, {
          ...result,
          score: result.score * 0.4,
          match_type: "hybrid"
        });
      }
    });
    return Array.from(combinedMap.values()).sort((a, b) => b.score - a.score).slice(0, query.limit || 20);
  }
  async getProductById(id) {
    const { results } = await this.env.DB.prepare(
      "SELECT * FROM products WHERE id = ?"
    ).bind(id).all();
    if (results.length === 0) return null;
    const row = results[0];
    return this.mapRowToProduct(row);
  }
  mapRowToProduct(row) {
    const baseUrl = row.real_url || row.url;
    return {
      ...row,
      url: baseUrl,
      // Use real_url if available
      tracked_url: this.generateTrackedUrl(baseUrl, row.category)
    };
  }
  matchesFilters(product, filters) {
    if (!filters) return true;
    if (filters.category && !product.category?.toLowerCase().includes(filters.category.toLowerCase())) {
      return false;
    }
    if (filters.min_price !== void 0 && product.price < filters.min_price) {
      return false;
    }
    if (filters.max_price !== void 0 && product.price > filters.max_price) {
      return false;
    }
    if (filters.in_stock && product.stock <= 0) {
      return false;
    }
    return true;
  }
  calculateKeywordScore(product, searchTerms) {
    let score = 0;
    `${product.name} ${product.description || ""} ${product.category || ""}`.toLowerCase();
    searchTerms.forEach((term) => {
      if (product.name.toLowerCase().includes(term)) score += 3;
      if (product.category?.toLowerCase().includes(term)) score += 2;
      if (product.description?.toLowerCase().includes(term)) score += 1;
    });
    return score;
  }
  generateTrackedUrl(url, category) {
    if (!url) return "";
    if (url.includes("utm_source")) return url;
    const categorySlug = (category || "general").toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "_").replace(/^-+|-+$/g, "");
    const utmParams = new URLSearchParams({
      utm_source: "mybonzo",
      utm_medium: "rag_search",
      utm_campaign: `rag_context_${categorySlug}`
    });
    return `${url}${url.includes("?") ? "&" : "?"}${utmParams.toString()}`;
  }
}

export { SearchService as S };
