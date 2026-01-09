import { spawn } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = './src/pages/pumo-guide';

// Execute wrangler D1 query
function queryD1(sql) {
    return new Promise((resolve, reject) => {
        const proc = spawn('wrangler', [
            'd1', 'execute', 'jimbo-rag-db',
            '--command', sql,
            '--json'
        ]);
        
        let stdout = '';
        let stderr = '';
        
        proc.stdout.on('data', (data) => stdout += data);
        proc.stderr.on('data', (data) => stderr += data);
        
        proc.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`wrangler failed: ${stderr}`));
            } else {
                try {
                    // Parse JSON output from wrangler
                    const lines = stdout.split('\n').filter(l => l.trim());
                    const jsonLine = lines.find(l => l.startsWith('[') || l.startsWith('{'));
                    resolve(jsonLine ? JSON.parse(jsonLine) : []);
                } catch (e) {
                    reject(new Error(`Failed to parse: ${e.message}`));
                }
            }
        });
    });
}

// Get categories from D1
async function getCategories() {
    const result = await queryD1(`
        SELECT DISTINCT category 
        FROM products 
        WHERE category IS NOT NULL AND category != ''
        ORDER BY category 
        LIMIT 10
    `);
    return result[0]?.results?.map(r => r.category) || [];
}

// Get products for category
async function getProducts(category) {
    const result = await queryD1(`
        SELECT id, name, category, price, real_url, url, 
               COALESCE(description, '') as manufacturer
        FROM products 
        WHERE category LIKE '%${category.replace(/'/g, "''")}%'
        ORDER BY price DESC 
        LIMIT 10
    `);
    return result[0]?.results || [];
}

// Generate tracked URL
function generateTrackedUrl(baseUrl, category, productId) {
    if (!baseUrl) return '';
    
    const categorySlug = category
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '_');
    
    const params = new URLSearchParams({
        utm_source: 'mybonzo',
        utm_medium: 'ai_guide',
        utm_campaign: `guide_${categorySlug}`,
        utm_content: `product_${productId}`
    });
    
    return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${params}`;
}

// Generate guide content
function generateGuideContent(category, products) {
    const today = new Date().toLocaleDateString('pl-PL');
    const slug = category.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '_');
    
    // Add tracked URLs to products
    const trackedProducts = products.map(p => ({
        ...p,
        tracked_url: generateTrackedUrl(p.real_url || p.url, category, p.id)
    }));
    
    const frontmatter = `---
layout: ../../layouts/MarkdownLayout.astro
title: "${category} - Przewodnik Zakupowy 2026"
description: "Kompletny przewodnik zakupowy ${category.toLowerCase()}. Porównanie najlepszych produktów, ceny, opinie."
pubDate: ${new Date().toISOString()}
category: "${category}"
---
`;
    
    let content = `# ${category} - Przewodnik Zakupowy 2026\n\n`;
    content += `*Ostatnia aktualizacja: ${today}*\n\n`;
    content += `## Najlepsze produkty w kategorii ${category}\n\n`;
    content += `**Znaleźliśmy ${products.length} produktów w tej kategorii.**\n\n`;
    
    // Top products list with tracked URLs
    content += `### Top ${Math.min(5, products.length)} Produktów:\n\n`;
    trackedProducts.slice(0, 5).forEach((p, i) => {
        content += `${i + 1}. **[${p.name}](${p.tracked_url})** - ${p.price} PLN\n`;
    });
    
    // Comparison table
    content += `\n## Tabela porównawcza\n\n`;
    content += `| # | Produkt | Cena | Producent | Link |\n`;
    content += `|---|---------|------|-----------|------|\n`;
    trackedProducts.forEach((p, i) => {
        content += `| ${i + 1} | **${p.name}** | **${p.price} PLN** | ${p.manufacturer || 'N/A'} | [Zobacz →](${p.tracked_url}) |\n`;
    });
    
    // CTA section with tracked URLs
    content += `\n## 📦 Gdzie kupić?\n\n`;
    content += `Wszystkie produkty dostępne w oficjalnym sklepie:\n\n`;
    trackedProducts.slice(0, 3).forEach(p => {
        content += `🛒 **[${p.name}](${p.tracked_url})** - ${p.price} PLN\n\n`;
    });
    
    content += `\n---\n*Źródło danych: www.meblepumo.pl*\n`;
    
    return frontmatter + content;
}

async function regenerateGuides() {
    console.log('🚀 Generating guides from D1 database...\n');
    
    try {
        const categories = await getCategories();
        console.log(`📋 Found ${categories.length} categories (testing first 10)\n`);
        
        let success = 0;
        
        for (const category of categories) {
            try {
                console.log(`📝 ${category}...`);
                
                const products = await getProducts(category);
                if (products.length === 0) {
                    console.log(`  ⚠️ No products found, skipping`);
                    continue;
                }
                
                const guideContent = generateGuideContent(category, products);
                
                const slug = category.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '_');
                const filename = `${slug}.md`;
                const filepath = join(OUTPUT_DIR, filename);
                
                writeFileSync(filepath, guideContent, 'utf-8');
                
                // Count UTM links
                const utmCount = (guideContent.match(/utm_source/g) || []).length;
                console.log(`  ✅ Saved with ${products.length} products, ${utmCount} tracked links`);
                success++;
                
            } catch (error) {
                console.error(`  ❌ Error: ${error.message}`);
            }
        }
        
        console.log(`\n🎉 Generated ${success}/${categories.length} guides!`);
        console.log(`\nNext: git add src/pages/pumo-guide/*.md && git commit && git push`);
        
    } catch (error) {
        console.error('Fatal:', error);
        process.exit(1);
    }
}

regenerateGuides();
