import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '..', 'dist');

const criticalFiles = [
  'robots.txt',
  'sitemap-index.xml',
  'sitemap-0.xml',
  '_headers'
];

console.log('🔍 Verifying build output...\n');

let allPresent = true;
let details = [];

criticalFiles.forEach(file => {
  const filePath = path.join(distPath, file);
  const exists = fs.existsSync(filePath);
  
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${file}`);
  
  if (!exists) {
    allPresent = false;
    details.push(file);
  } else {
    // Show file size for verification
    const stats = fs.statSync(filePath);
    console.log(`   Size: ${stats.size} bytes`);
  }
});

console.log('');

if (!allPresent) {
  console.error('❌ Build verification FAILED - missing critical files:');
  details.forEach(file => console.error(`   - ${file}`));
  process.exit(1);
}

console.log('✅ Build verification PASSED');
console.log('\n📋 Summary:');
console.log(`   - All ${criticalFiles.length} critical files present`);
console.log('   - Site is ready for AI crawler indexing');
