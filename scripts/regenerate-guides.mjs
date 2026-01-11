import { getGuideGenerator } from './src/lib/whitecat/guide-generator.ts';
import { getProductManager } from './src/lib/whitecat/product-manager-d1.ts';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Mock env for local execution - will use local DB
const env = {
    DB: null, // Will use mock data
    AI: null,
    VECTORIZE_INDEX: null
};

async function regenerateAllGuides() {
    console.log('🚀 Starting guide regeneration with UTM tracking...\n');
    
    const productManager = getProductManager(env);
    const generator = getGuideGenerator(env);
    
    // Get all categories
    const categories = await productManager.getCategories();
    console.log(`📋 Found ${categories.length} categories to process\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const category of categories) {
        try {
            console.log(`⏳ Generating guide for: ${category}`);
            
            // Generate guide
            const guide = await generator.generateCategoryGuide(category);
            
            // Create filename
            const filename = `${guide.metadata.slug}.md`;
            const filepath = join(__dirname, 'src', 'pages', 'pumo-guide', filename);
            
            // Write file
            const fullContent = guide.frontmatter + '\n' + guide.content;
            writeFileSync(filepath, fullContent, 'utf-8');
            
            console.log guide has ${guide.metadata.products.length} products with tracking ✅\n`);
            successCount++;
            
        } catch (error) {
            console.error(`❌ Failed for ${category}:`, error.message);
            errorCount++;
        }
    }
    
    console.log(`\n🎉 Regeneration complete!`);
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
}

regenerateAllGuides().catch(console.error);
