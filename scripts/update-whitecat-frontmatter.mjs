import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const PUMO_GUIDE_DIR = 'src/pages/pumo-guide';

async function updateFrontmatter() {
    const files = await readdir(PUMO_GUIDE_DIR);
    const mdFiles = files.filter(f => f.endsWith('.md'));

    console.log(`📁 Znaleziono ${mdFiles.length} plików MD`);

    for (const file of mdFiles) {
        const filePath = join(PUMO_GUIDE_DIR, file);
        const content = await readFile(filePath, 'utf-8');

        // Znajdź frontmatter (z \r\n lub \n)
        const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

        if (!frontmatterMatch) {
            console.log(`⚠️  Brak frontmatter: ${file}`);
            continue;
        }

        const frontmatter = frontmatterMatch[1];
        const restContent = content.slice(frontmatterMatch[0].length);

        // Sprawdź czy ma layout i prerender
        if (frontmatter.includes('layout:') && frontmatter.includes('prerender:')) {
            console.log(`✅ OK: ${file}`);
            continue;
        }

        // Wyciągnij category/subcategory z title lub filename
        const titleMatch = frontmatter.match(/title:\s*["']?([^"'\n]+)["']?/);
        const title = titleMatch ? titleMatch[1] : file.replace('.md', '');

        // Parse filename: Category_Subcategory.md
        const parts = file.replace('.md', '').split('_');
        const category = parts[0] || 'Meble';
        const subcategory = parts.slice(1).join(' ') || 'Wszystkie';

        // Dodaj brakujące pola
        const updatedFrontmatter = `---
layout: ../../layouts/PumoGuideLayout.astro
prerender: true
${frontmatter}
category: "${category}"
subcategory: "${subcategory}"
---`;

        const updatedContent = updatedFrontmatter + restContent;

        await writeFile(filePath, updatedContent, 'utf-8');
        console.log(`✏️  Zaktualizowano: ${file}`);
    }

    console.log(`\n✅ Zakończono aktualizację ${mdFiles.length} plików`);
}

updateFrontmatter().catch(console.error);
