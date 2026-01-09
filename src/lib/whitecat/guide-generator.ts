import { getProductManager, type Product } from './product-manager-d1';
import { SitemapSync } from './sitemap-sync';

interface GuideMetadata {
    title: string;
    description: string;
    category: string;
    slug: string;
    products: Product[];
    generated_at: string;
    seo: {
        keywords: string[];
        schema: any;
    };
}

export class WhitecatGuideGenerator {
    private productManager: any;

    constructor(private env?: any) {
        this.productManager = getProductManager(env);
    }

    /**
     * Generuje przewodnik dla kategorii produktów
     */
    async generateCategoryGuide(category: string): Promise<{
        metadata: GuideMetadata;
        content: string;
        frontmatter: string;
    }> {
        console.log(`📝 Generating guide for category: ${category}`);

        // Pobierz produkty z kategorii
        const originalProducts = await this.productManager.getTopProductsInCategory(category, 10);
        
        if (originalProducts.length === 0) {
            throw new Error(`No products found for category: ${category}`);
        }

        // Add Tracking
        let products = originalProducts;
        if (this.env && this.env.DB) {
             const sitemapSync = new SitemapSync(this.env);
             console.log(`🔗 Injecting tracked URLs for category: ${category}`);
             
             products = await Promise.all(originalProducts.map(async (p: Product) => {
                 const trackedUrl = await sitemapSync.generateTrackedUrl(
                     p.id, 
                     `guide_${this.slugify(category)}`,
                     'ai_guide'
                 );
                 return { ...p, tracked_url: trackedUrl };
             }));
        } else {
             console.warn('⚠️ No environment/DB for tracking injection');
        }

        // Metadata przewodnika
        const slug = this.slugify(category);
        const metadata: GuideMetadata = {
            title: `${category} - Przewodnik Zakupowy 2025`,
            description: `Kompletny przewodnik zakupowy ${category.toLowerCase()}. Porównanie najlepszych produktów, ceny, opinie i rekomendacje.`,
            category,
            slug,
            products,
            generated_at: new Date().toISOString(),
            seo: {
                keywords: [
                    category.toLowerCase(),
                    'przewodnik zakupowy',
                    'najlepsze produkty',
                    'porównanie cen',
                    'meble pumo'
                ],
                schema: this.generateSchema(category, products)
            }
        };

        // Frontmatter dla Astro
        const frontmatter = this.generateFrontmatter(metadata);

        // Treść przewodnika
        const content = await this.generateContent(metadata);

        return { metadata, content, frontmatter };
    }

    /**
     * Generuje treść przewodnika
     */
    private async generateContent(metadata: GuideMetadata): Promise<string> {
        const { category, products } = metadata;

        // Top 5 produktów
        const topProducts = products.slice(0, 5);

        let content = `# ${metadata.title}

*Ostatnia aktualizacja: ${new Date().toLocaleDateString('pl-PL')}*

## Najlepsze produkty w kategorii ${category}

**Szybka odpowiedź:** Na podstawie analizy ${products.length} produktów, najlepszymi wyborami w kategorii ${category.toLowerCase()} są:
`;

        // Lista najlepszych produktów z tracked URLs
        topProducts.forEach((product, index) => {
            content += `\n${index + 1}. **[${product.name}](${product.tracked_url})** - ${product.price} PLN`;
        });

        content += `\n\n## Tabela porównawcza - Top 5 ${category}

| Pozycja | Produkt | Cena | Producent | Link |
|---------|---------|------|-----------|------|
`;

        // Tabela z tracked URLs
        topProducts.forEach((product, index) => {
            content += `| ${index + 1} | **${product.name}** | **${product.price} PLN** | ${product.manufacturer} | [Zobacz produkt →](${product.tracked_url}) |\n`;
        });

        content += `\n## Szczegółowe porównanie produktów\n`;

        // Szczegóły każdego produktu
        topProducts.forEach((product, index) => {
            content += `\n### ${index + 1}. ${product.name}

**Cena:** ${product.price} PLN  
**Producent:** ${product.manufacturer}  
**Kategoria:** ${product.category}

**[👉 Zobacz szczegóły produktu](${product.tracked_url})**

---
`;
        });

        content += `\n## Podsumowanie

W tej kategorii znaleźliśmy ${products.length} produktów od ${new Set(products.map(p => p.manufacturer)).size} różnych producentów. 

**Najlepszy wybór:** [${topProducts[0].name}](${topProducts[0].tracked_url}) za ${topProducts[0].price} PLN

**Najbardziej ekonomiczny:** [${products.sort((a, b) => a.price - b.price)[0].name}](${products.sort((a, b) => a.price - b.price)[0].tracked_url}) za ${products.sort((a, b) => a.price - b.price)[0].price} PLN

## Dodatkowe informacje

- Wszystkie ceny aktualne na dzień ${new Date().toLocaleDateString('pl-PL')}
- Produkty dostępne w sklepie [Meble Pumo](https://www.meblepumo.pl/?utm_source=mybonzo&utm_medium=ai_guide&utm_campaign=category_guide)
- Możliwość porównania produktów w [interaktywnym chatbocie AI](/rag)

*Ten przewodnik został wygenerowany przez AI na podstawie aktualnych danych produktowych.*
`;

        return content;
    }

    /**
     * Generuje frontmatter dla pliku Astro
     */
    private generateFrontmatter(metadata: GuideMetadata): string {
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
utm_campaign: "buying_guide_${this.slugify(metadata.category)}"
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
    private generateSchema(category: string, products: Product[]): any {
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
            "datePublished": new Date().toISOString(),
            "dateModified": new Date().toISOString(),
            "articleSection": "Przewodniki Zakupowe",
            "keywords": [category, "przewodnik zakupowy", "meble", "porównanie"],
            "about": {
                "@type": "Thing",
                "name": category
            },
            "mentions": products.slice(0, 5).map(product => ({
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
    private slugify(text: string): string {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '_')
            .replace(/^-+|-+$/g, '');
    }

    /**
     * Generuje wszystkie przewodniki
     */
    async generateAllGuides(): Promise<Map<string, { content: string; metadata: GuideMetadata }>> {
        console.log('🚀 Generating all category guides...');

        const guides = new Map();
        const categories = await this.productManager.getCategories();

        console.log(`Found ${categories.length} categories to process`);

        for (const category of categories) {
            try {
                const guide = await this.generateCategoryGuide(category);
                const path = `/guides/${guide.metadata.slug}`;

                guides.set(path, {
                    content: guide.frontmatter + '\n' + guide.content,
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
    async getStats(): Promise<{
        totalCategories: number;
        totalProducts: number;
        avgProductsPerCategory: number;
    }> {
        const productStats = await this.productManager.getStats();
        const categories = await this.productManager.getCategories();

        return {
            totalCategories: categories.length,
            totalProducts: productStats.totalProducts,
            avgProductsPerCategory: Math.round(productStats.totalProducts / categories.length)
        };
    }
}

// Export singleton
let generatorInstance: WhitecatGuideGenerator | null = null;

export function getGuideGenerator(env?: any): WhitecatGuideGenerator {
    if (!generatorInstance) {
        generatorInstance = new WhitecatGuideGenerator(env);
    }
    return generatorInstance;
}