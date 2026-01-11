// Script to add layout frontmatter to all MD files in pumo-guide
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const guidesDir = path.join(__dirname, 'src', 'pages', 'pumo-guide');

async function addLayoutToMdFiles() {
    try {
        const files = await fs.readdir(guidesDir);
        const mdFiles = files.filter(f => f.endsWith('.md') && f !== 'index.md');

        console.log(`Found ${mdFiles.length} MD files`);

        for (const file of mdFiles) {
            const filePath = path.join(guidesDir, file);
            const content = await fs.readFile(filePath, 'utf-8');

            // Check if already has frontmatter with layout
            if (content.startsWith('---') && content.includes('layout:')) {
                console.log(`⏭️  Skipping ${file} (already has layout)`);
                continue;
            }

            // Extract category and subcategory from filename
            const parts = file.replace('.md', '').split('_');
            const category = parts[0] || 'Meble';
            const subcategory = parts.slice(1).join(' ') || '';

            // Add frontmatter at the beginning
            const frontmatter = `---
layout: ../../layouts/PumoGuideLayout.astro
category: "${category}"
subcategory: "${subcategory}"
---

`;

            const newContent = frontmatter + content;
            await fs.writeFile(filePath, newContent, 'utf-8');
            console.log(`✅ Updated ${file}`);
        }

        console.log('\n🎉 Done! All files updated.');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

addLayoutToMdFiles();
