globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getProductManager } from './product-manager-d1_C97ggFJZ.mjs';

function buildProductUrl(baseUrl, utmParams) {
  if (!baseUrl) return "";
  try {
    const url = new URL(baseUrl);
    Object.entries(utmParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    return url.toString();
  } catch (error) {
    console.error("Error building URL:", error);
    return baseUrl;
  }
}
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "_").replace(/-+/g, "_").trim();
}
class WhitecatGuideGenerator {
  constructor(env) {
    this.env = env;
    this.productManager = getProductManager(env);
  }
  /**
   * Generuje przewodnik dla kategorii produktów
   */
  async generateCategoryGuide(category) {
    console.log(`📝 Generating guide for category: ${category}`);
    const originalProducts = await this.productManager.getTopProductsInCategory(category, 10);
    if (originalProducts.length === 0) {
      throw new Error(`No products found for category: ${category}`);
    }
    const products = originalProducts.map((product) => ({
      ...product,
      tracked_url: buildProductUrl(product.real_url || product.url, {
        utm_source: "mybonzo",
        utm_medium: "guide",
        utm_campaign: slugify(category),
        utm_content: product.id?.toString() || "unknown"
      }),
      originalUrl: product.real_url || product.url
    }));
    console.log(`🔗 Enriched ${products.length} products with UTM tracking for category: ${category}`);
    const slug = slugify(category);
    const metadata = {
      title: `${category} - Przewodnik Zakupowy 2025`,
      description: `Kompletny przewodnik zakupowy ${category.toLowerCase()}. Porównanie najlepszych produktów, ceny, opinie i rekomendacje z UTM tracking.`,
      category,
      slug,
      products,
      generated_at: (/* @__PURE__ */ new Date()).toISOString(),
      seo: {
        keywords: [
          category.toLowerCase(),
          "przewodnik zakupowy",
          "najlepsze produkty",
          "porównanie cen",
          "meble pumo"
        ],
        schema: this.generateSchema(category, products)
      }
    };
    const frontmatter = this.generateFrontmatter(metadata);
    const content = await this.generateContent(metadata);
    return { metadata, content, frontmatter };
  }
  /**
   * Generuje treść przewodnika
   */
  async generateContent(metadata) {
    const { category, products } = metadata;
    const topProducts = products.slice(0, 5);
    let content = `# ${metadata.title}

*Ostatnia aktualizacja: ${(/* @__PURE__ */ new Date()).toLocaleDateString("pl-PL")}*

## Najlepsze produkty w kategorii ${category}

**Szybka odpowiedź:** Na podstawie analizy ${products.length} produktów, najlepszymi wyborami w kategorii ${category.toLowerCase()} są:
`;
    topProducts.forEach((product, index) => {
      content += `
${index + 1}. **[${product.name}](${product.tracked_url})** - ${product.price} PLN`;
    });
    content += `

## Tabela porównawcza - Top 5 ${category}

| Pozycja | Produkt | Cena | Producent | Link |
|---------|---------|------|-----------|------|
`;
    topProducts.forEach((product, index) => {
      content += `| ${index + 1} | **${product.name}** | **${product.price} PLN** | ${product.manufacturer} | [Zobacz produkt →](${product.tracked_url}) |
`;
    });
    content += `
## Szczegółowe porównanie produktów
`;
    topProducts.forEach((product, index) => {
      content += `
### ${index + 1}. ${product.name}

**Cena:** ${product.price} PLN  
**Producent:** ${product.manufacturer}  
**Kategoria:** ${product.category}

**[👉 Zobacz szczegóły produktu](${product.tracked_url})**

---
`;
    });
    content += `
## Podsumowanie

W tej kategorii znaleźliśmy ${products.length} produktów od ${new Set(products.map((p) => p.manufacturer)).size} różnych producentów. 

**Najlepszy wybór:** [${topProducts[0].name}](${topProducts[0].tracked_url}) za ${topProducts[0].price} PLN

**Najbardziej ekonomiczny:** [${products.sort((a, b) => a.price - b.price)[0].name}](${products.sort((a, b) => a.price - b.price)[0].tracked_url}) za ${products.sort((a, b) => a.price - b.price)[0].price} PLN

## Dodatkowe informacje

- Wszystkie ceny aktualne na dzień ${(/* @__PURE__ */ new Date()).toLocaleDateString("pl-PL")}
- Produkty dostępne w sklepie [Meble Pumo](https://www.meblepumo.pl/?utm_source=mybonzo&utm_medium=ai_guide&utm_campaign=category_guide)
- Możliwość porównania produktów w [interaktywnym chatbocie AI](/rag)

*Ten przewodnik został wygenerowany przez AI na podstawie aktualnych danych produktowych.*
`;
    return content;
  }
  /**
   * Generuje frontmatter dla pliku Astro
   */
  generateFrontmatter(metadata) {
    const frontmatter = `---
title: "${metadata.title}"
description: "${metadata.description}"
pubDate: "${metadata.generated_at}"
category: "${metadata.category}"
slug: "${metadata.slug}"
author: "MyBonzo AI"
tags: ${JSON.stringify(metadata.seo.keywords)}
type: "buying-guide"
products: ${metadata.products.length}
generated: true
utm_source: "mybonzo"
utm_medium: "ai_guide"
utm_campaign: "buying_guide_${slugify(metadata.category)}"
schema: ${JSON.stringify(metadata.seo.schema, null, 2)}
qualityScore: 95
dataIntegrity: "high"
contentType: "buying-guide"
---
`;
    return frontmatter;
  }
  /**
   * Generuje Schema.org markup
   */
  generateSchema(category, products) {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": `${category} - Przewodnik Zakupowy 2025`,
      "author": {
        "@type": "Organization",
        "name": "MyBonzo AI Blog"
      },
      "publisher": {
        "@type": "Organization",
        "name": "MyBonzo AI Blog",
        "url": "https://mybonzoaiblog.com"
      },
      "datePublished": (/* @__PURE__ */ new Date()).toISOString(),
      "dateModified": (/* @__PURE__ */ new Date()).toISOString(),
      "articleSection": "Przewodniki Zakupowe",
      "keywords": [category, "przewodnik zakupowy", "meble", "porównanie"],
      "about": {
        "@type": "Thing",
        "name": category
      },
      "mentions": products.slice(0, 5).map((product) => ({
        "@type": "Product",
        "name": product.name,
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": "PLN",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": product.manufacturer
          }
        }
      }))
    };
  }
  /**
   * Slugify tekstu
   */
  slugify(text) {
    return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "_").replace(/^-+|-+$/g, "");
  }
  /**
   * Generuje wszystkie przewodniki
   */
  async generateAllGuides() {
    console.log("🚀 Generating all category guides...");
    const guides = /* @__PURE__ */ new Map();
    const categories = await this.productManager.getCategories();
    console.log(`Found ${categories.length} categories to process`);
    for (const category of categories) {
      try {
        const guide = await this.generateCategoryGuide(category);
        const path = `/guides/${guide.metadata.slug}`;
        guides.set(path, {
          content: guide.frontmatter + "\n" + guide.content,
          metadata: guide.metadata
        });
        console.log(`✅ Generated guide: ${path}`);
      } catch (error) {
        console.error(`❌ Failed to generate guide for ${category}:`, error);
      }
    }
    console.log(`🎉 Generated ${guides.size} buying guides`);
    return guides;
  }
  /**
   * Pobiera statystyki generatora
   */
  async getStats() {
    const productStats = await this.productManager.getStats();
    const categories = await this.productManager.getCategories();
    return {
      totalCategories: categories.length,
      totalProducts: productStats.totalProducts,
      avgProductsPerCategory: Math.round(productStats.totalProducts / categories.length)
    };
  }
}
let generatorInstance = null;
function getGuideGenerator(env) {
  if (!generatorInstance) {
    generatorInstance = new WhitecatGuideGenerator(env);
  }
  return generatorInstance;
}

export { getGuideGenerator as g };
