import { readdirSync } from 'fs';
import { join } from 'path';

const API_BASE = 'https://mybonzoaiblog.pages.dev';
const OUTPUT_DIR = './src/pages/pumo-guide';

// Get categories from existing files
function getExistingCategories() {
    const files = readdirSync(OUTPUT_DIR);
    return files
        .filter(f => f.endsWith('.md') && !f.includes('index') && !f.includes('agent'))
        .map(f => f.replace('.md', '').replace(/_/g, ' '));
}

async function generateGuide(category) {
    console.log(`📝 Generating: ${category}`);
    
    const url = `${API_BASE}/api/generate-guides?category=${encodeURIComponent(category)}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Origin': API_BASE
        }
    });
    
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text.substring(0, 100)}`);
    }
    
    const text = await response.text();
    if (!text) {
        throw new Error('Empty response');
    }
    
    const data = JSON.parse(text);
    if (!data.success) {
        throw new Error(data.error || 'API returned success:false');
    }
    
    return data.data;
}

async function regenerateAll() {
    console.log('🚀 Starting guide regeneration...\n');
    
    const categories = getExistingCategories();
    console.log(`📋 Found ${categories.length} categories from existing files\n`);
    
    let success = 0;
    let failed = 0;
    const errors = [];
    
    for (const category of categories.slice(0, 5)) { // Test with first 5
        try {
            const guideData = await generateGuide(category);
            
            const slug = category
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '_');
            
            const filename = `${slug}.md`;
            const filepath = join(OUTPUT_DIR, filename);
            
            // API should return path property with guide details
            if (guideData.path && guideData.message) {
                console.log(`✅ ${category} (${guideData.tracked_products_count || 0} products tracked)`);
                success++;
            } else {
                console.warn(`⚠️ ${category} - Unexpected response format`);
                failed++;
                errors.push(`${category}: unexpected format`);
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
        } catch (error) {
            console.error(`❌ ${category}: ${error.message}`);
            failed++;
            errors.push(`${category}: ${error.message}`);
        }
    }
    
    console.log(`\n🎉 Regeneration test complete (5/${categories.length})`);
    console.log(`✅ Success: ${success}`);
    console.log(`❌ Failed: ${failed}`);
    
    if (errors.length > 0) {
        console.log(`\nErrors:`);
        errors.forEach(e => console.log(`  - ${e}`));
    }
}

regenerateAll().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
