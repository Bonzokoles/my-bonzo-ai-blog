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

function parseFaqToYaml(faqText: string): string {
    if (!faqText) return '[]';
    
    // Remove any trailing separators like dates or generated comments if matched
    const cleanText = faqText.replace(/---[\s\S]*$/, '').trim();

    const qaRegex = /\*\*Q:\s*(.*?)\*\*\s*\n+A:\s*(.*?)(?=\n+\*\*Q:|$)/gs;
    const items = [];
    let match;
    
    while ((match = qaRegex.exec(cleanText)) !== null) {
        let answer = match[2].trim();
        // Remove trailing --- if somehow caught
        answer = answer.replace(/\n---.*/s, '').trim();
        
        items.push({
            name: match[1].trim().replace(/"/g, '\\"'),
            text: answer.replace(/"/g, '\\"').replace(/\n/g, '\\n')
        });
    }

    if (items.length === 0) return '[]';

    let yaml = '\n';
    items.forEach(item => {
        yaml += `  - name: "${item.name}"\n`;
        yaml += `    acceptedAnswer:\n`;
        yaml += `      text: "${item.text}"\n`;
    });
    return yaml;
}

async function rollout() {
    console.log('🚀 Starting Universal Template Rollout (v1.4 - Robust)...');
    
    // Read Template
    const templateContent = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
    
    // Get all MD files
    const files = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.md'));
    
    console.log(`Found ${files.length} files to process.`);
    
    for (const file of files) {
        try {
            const filePath = path.join(PAGES_DIR, file);
            let originalContent = fs.readFileSync(filePath, 'utf-8');
            
            // RECOVERY: Remove broken FAQ from frontmatter if present (from previous failed runs)
            if (originalContent.includes('faq:')) {
                const parts = originalContent.split('---');
                if (parts.length >= 3) {
                    if (parts[1].includes('faq:')) {
                        const aiReadyIndex = parts[1].indexOf('aiReady: true');
                        if (aiReadyIndex !== -1) {
                            parts[1] = parts[1].substring(0, aiReadyIndex + 'aiReady: true'.length) + '\n';
                        }
                        originalContent = parts.join('---');
                    }
                }
            }
            
            // Parse Frontmatter
            let frontmatter, body;
            try {
                const parsed = matter(originalContent);
                frontmatter = parsed.data;
                body = parsed.content;
            } catch (e) {
                console.warn(`Warning: Failed to parse ${file}, attempting forced recovery...`);
                frontmatter = {
                    category: originalContent.match(/category: "(.*?)"/)?.[1] || "Meble",
                    subcategory: originalContent.match(/subcategory: "(.*?)"/)?.[1] || "",
                    title: originalContent.match(/title: "(.*?)"/)?.[1] || "",
                    qualityScore: 85
                };
                body = originalContent.split('---').slice(2).join('---') || '';
            }
            
            console.log(`Processing: ${file}`);
            
            // Extract Core Content
            const topTable = extractTable(body);
            const shoppingGuideFull = extractSection(originalContent, '## 🛠️ Najważniejsze decyzje', '## ❓ Najczęściej Zadawane Pytania');
            const shoppingGuideFinal = shoppingGuideFull || extractSection(originalContent, '## Przewodnik Zakupowy', '## FAQ');
    
            // Extract FAQ
            let faqSection = extractSection(originalContent, '## ❓ Najczęściej Zadawane Pytania', '---');
            if (!faqSection) faqSection = extractSection(originalContent, '## FAQ', '---');
            if (!faqSection) faqSection = extractSection(originalContent, '## ❓ Najczęściej Zadawane Pytania', 'WHITECAT MOA');
    
            // Generate FAQ YAML
            const faqYaml = parseFaqToYaml(faqSection);
    
            // Prepare Replacements
            let newContent = templateContent
                .replace('{TITLE}', frontmatter.title || `Przewodnik ${frontmatter.category || 'Meble'}`)
                .replace('{QUALITY_SCORE}', (frontmatter.qualityScore || 85).toString())
                .replace('{CATEGORY}', frontmatter.category || 'Meble')
                .replace(/{CATEGORY}/g, frontmatter.category || 'Meble') 
                .replace('{SUBCATEGORY}', frontmatter.subcategory || 'Wszystkie')
                .replace('{CATEGORY_LOWER}', (frontmatter.category || 'meble').toLowerCase())
                .replace(/{CATEGORY_NAME}/g, frontmatter.category || 'Meble Pumo')
                .replace('{PRODUCT_COUNT}', '40') 
                .replace('{PRICE_RANGE}', '200 - 3000') 
                .replace('{TOP_TABLE}', topTable)
                .replace('{SHOPPING_GUIDE_INTRO}', 'Analiza kluczowych parametrów pomoże Ci podjąć świadomą decyzję.')
                .replace('{SHOPPING_GUIDE_BODY}', shoppingGuideFinal)
                .replace('{FAQ_SECTION}', faqSection || 'Sekcja w przygotowaniu.')
                .replace('{DATE}', new Date().toISOString().split('T')[0])
                .replace('aiReady: true', `aiReady: true\nfaq: ${faqYaml}`); 
                
            fs.writeFileSync(filePath, newContent);
        } catch (err) {
             console.error(`❌ FATAL Error processing ${file}:`, err);
        }
    }
    
    console.log('✅ Rollout Complete!');
}

rollout().catch(e => console.error("FATAL:", e));
