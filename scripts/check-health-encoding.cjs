const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'src', 'data', 'healthArticles.ts');
const content = fs.readFileSync(file, 'utf-8');

const bad = /Ã©|Ã¨|Ã |Ã¢|Ã®|Ã´|Ã»|Ã§|Ã‰|Ã€|ðŸ|â€"|â€™|Ã—|Ãª|Ã¹/;

const lines = content.split('\n');
let currentSlug = null;
let hasBad = false;
const results = {};

for (let i = 0; i < lines.length; i++) {
  const slugMatch = lines[i].match(/slug:\s*"([^"]+)"/);
  if (slugMatch) {
    if (currentSlug) results[currentSlug] = hasBad ? 'MOJIBAKE' : 'CLEAN';
    currentSlug = slugMatch[1];
    hasBad = false;
  }
  if (currentSlug && bad.test(lines[i])) {
    hasBad = true;
  }
}
if (currentSlug) results[currentSlug] = hasBad ? 'MOJIBAKE' : 'CLEAN';

const mojibakeCount = Object.values(results).filter(v => v === 'MOJIBAKE').length;
const cleanCount = Object.values(results).filter(v => v === 'CLEAN').length;

console.log(`\n${cleanCount} CLEAN, ${mojibakeCount} MOJIBAKE\n`);
Object.entries(results).forEach(([slug, status]) => {
  console.log(`${status === 'MOJIBAKE' ? '❌' : '✅'} ${slug}: ${status}`);
});
