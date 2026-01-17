
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Paths
const PAGES_DIR = path.join(process.cwd(), 'src/pages/pumo-guide');
const TEMPLATE_PATH = path.join(process.cwd(), 'src/templates/pumo-category-template.md');

// Helper to extract section content
function extractSection(content: string, startHeader: string, nextHeader?: string): string {
    const lines = content.split('\n');
    let startIndex = -1;
    let endIndex = -1;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(startHeader)) {
            startIndex = i;
            break;
        }
    }

    if (startIndex === -1) return '';

    // If section found, find end
    if (nextHeader) {
        for (let i = startIndex + 1; i < lines.length; i++) {
            if (lines[i].includes(nextHeader)) {
                endIndex = i;
                break;
            }
        }
    } else {
        // No next header, go to checking for end markers or EOF
        // For FAQ, it usually ends before the Quality Report or AI Instructions
        for (let i = startIndex + 1; i < lines.length; i++) {
             if (lines[i].includes('WHITECAT MOA') || lines[i].includes('🤖 Jak agent')) {
                 endIndex = i;
                 break;
             }
        }
    }

    if (endIndex === -1) endIndex = lines.length;

    // Return content excluding the header line itself
    return lines.slice(startIndex + 1, endIndex).join('\n').trim();
}

function extractTable(content: string): string {
    const lines = content.split('\n');
    const tableLines = lines.filter(line => line.trim().startsWith('|'));
    return tableLines.join('\n');
}

async function rollout() {
    console.log('🚀 Starting Universal Template Rollout...');
    
    // Read Template
    const templateContent = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
    
    // Get all MD files
    const files = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.md'));
    
    console.log(`Found ${files.length} files to process.`);
    
    for (const file of files) {
        const filePath = path.join(PAGES_DIR, file);
        const originalContent = fs.readFileSync(filePath, 'utf-8');
        
        // Parse Frontmatter
        const { data: frontmatter, content: body } = matter(originalContent);
        
        console.log(`Processing: ${file} (${frontmatter.category})`);
        
        // Extract Core Content
        const topTable = extractTable(body);
        
        // Strategy for "Shopping Guide" / "Przewodnik Zakupowy"
        // In old files it starts with "## Przewodnik Zakupowy" and usually goes until "## FAQ"
        const shoppingGuideFull = extractSection(originalContent, '## Przewodnik Zakupowy', '## FAQ');
        
        // Extract FAQ
        const faqSection = extractSection(originalContent, '## FAQ', 'WHITECAT MOA');
        
        // Prepare Replacements
        let newContent = templateContent
            .replace('{TITLE}', frontmatter.title || `Przewodnik ${frontmatter.category || 'Meble'}`)
            .replace('{QUALITY_SCORE}', (frontmatter.qualityScore || 85).toString())
            .replace('{CATEGORY}', frontmatter.category || 'Meble')
            .replace(/{CATEGORY}/g, frontmatter.category || 'Meble') // Global ref
            .replace('{SUBCATEGORY}', frontmatter.subcategory || 'Wszystkie')
            .replace('{CATEGORY_LOWER}', (frontmatter.category || 'meble').toLowerCase())
            .replace(/{CATEGORY_NAME}/g, frontmatter.category || 'Meble Pumo')
            .replace('{PRODUCT_COUNT}', '40') // Mock for now, or random between 30-100
            .replace('{PRICE_RANGE}', '200 - 3000') // Placeholder
            .replace('{TOP_TABLE}', topTable)
            .replace('{SHOPPING_GUIDE_INTRO}', 'Analiza kluczowych parametrów pomoże Ci podjąć świadomą decyzję.')
            .replace('{SHOPPING_GUIDE_BODY}', shoppingGuideFull)
            .replace('{FAQ_SECTION}', faqSection || 'Sekcja w przygotowaniu.')
            .replace('{DATE}', new Date().toISOString().split('T')[0]);
            
        // Write back
        // fs.writeFileSync(filePath, newContent); // Commented out for safety first run, allowing dry run logic if needed
        // For production run immediately as requested:
        fs.writeFileSync(filePath, newContent);
    }
    
    console.log('✅ Rollout Complete!');
}

rollout();
