const fs = require('fs');
const path = require('path');

const files = [
  'src/data/blogArticles.ts',
  'src/data/seoArticles25.ts',
  'src/data/seoArticlesRewrite.ts'
];

const mojibakeRe = /Ã©|Ã¨|Ã¹|Ã®|Ã´|Ã§|Ãª|Ã»|Ã |Ã‰|Ã€|Ãˆ|Ã"|DÃ©|PrÃ©|sÃ¨|brÃ»|dÃ©|Ã¢|â€™|â€"|â€œ|â€/g;

let totalBroken = 0;

for (const f of files) {
  const fullPath = path.join(__dirname, '..', f);
  const content = fs.readFileSync(fullPath, 'utf-8');
  const matches = content.match(mojibakeRe) || [];
  console.log(`${f}: ${matches.length} mojibake found`);
  if (matches.length > 0) {
    totalBroken += matches.length;
    const unique = [...new Set(matches)];
    console.log(`  Patterns: ${unique.slice(0, 15).join(', ')}`);
    // Find line numbers
    const lines = content.split('\n');
    let shown = 0;
    for (let i = 0; i < lines.length && shown < 5; i++) {
      if (mojibakeRe.test(lines[i])) {
        console.log(`  Line ${i+1}: ${lines[i].substring(0, 100)}`);
        shown++;
        mojibakeRe.lastIndex = 0;
      }
    }
  }
}

// Also check generated HTML files
const blogDir = path.join(__dirname, '..', 'public', 'blog');
if (fs.existsSync(blogDir)) {
  const slugs = fs.readdirSync(blogDir).filter(d => fs.statSync(path.join(blogDir, d)).isDirectory());
  let htmlBroken = 0;
  for (const slug of slugs) {
    const htmlPath = path.join(blogDir, slug, 'index.html');
    if (fs.existsSync(htmlPath)) {
      const html = fs.readFileSync(htmlPath, 'utf-8');
      const m = html.match(mojibakeRe) || [];
      if (m.length > 0) {
        htmlBroken += m.length;
        console.log(`HTML ${slug}: ${m.length} mojibake`);
      }
    }
  }
  console.log(`\nHTML files: ${slugs.length} checked, ${htmlBroken} total mojibake`);
}

console.log(`\nTOTAL: ${totalBroken} mojibake in TS files`);
if (totalBroken > 0) process.exit(1);
