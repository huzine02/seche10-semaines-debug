const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const files = [
  'src/data/blogArticles.ts',
  'src/data/seoArticles25.ts',
  'src/data/seoArticlesRewrite.ts'
];

// Mojibake patterns (double-encoded UTF-8)
const MOJIBAKE = [
  'Ã©', 'Ã¨', 'Ãª', 'Ã«', 'Ã ', 'Ã¢', 'Ã¹', 'Ã»', 'Ã¼',
  'Ã®', 'Ã¯', 'Ã´', 'Ã§', 'Å"', 'Ã‰', 'Ãˆ', 'Ã€', 'Ã"',
  'â€™', 'â€"', 'â€"', 'â€œ', 'â€\x9D', 'â€¦', 'â€˜',
  'Â«', 'Â»', 'Â°', 'Â²', 'Â³', 'â‰¥', 'â‰¤',
  'DÃ©', 'PrÃ©', 'sÃ¨', 'brÃ»', 'dÃ©', 'Ã\x89', 'entraÃ®'
];

let totalBroken = 0;
const fixes = {};

for (const f of files) {
  const fullPath = path.join(root, f);
  const content = fs.readFileSync(fullPath, 'utf-8');
  let brokenCount = 0;
  
  for (const pat of MOJIBAKE) {
    const count = content.split(pat).length - 1;
    if (count > 0) {
      brokenCount += count;
      console.log(`  ${f}: "${pat}" found ${count} times`);
    }
  }
  
  if (brokenCount > 0) {
    totalBroken += brokenCount;
    console.log(`\n❌ ${f}: ${brokenCount} TOTAL MOJIBAKE\n`);
    
    // Try to fix by re-encoding
    const buf = fs.readFileSync(fullPath);
    // Attempt: interpret bytes as latin1 then re-encode as utf8
    const latin1Str = buf.toString('latin1');
    const reEncoded = Buffer.from(latin1Str, 'utf-8').toString('utf-8');
    
    let fixedCount = 0;
    for (const pat of MOJIBAKE) {
      fixedCount += (reEncoded.split(pat).length - 1);
    }
    
    if (fixedCount < brokenCount) {
      console.log(`  -> latin1 re-encode would fix: ${brokenCount - fixedCount} of ${brokenCount}`);
      fixes[f] = { method: 'latin1', fixedCount: brokenCount - fixedCount };
    }
  } else {
    console.log(`✅ ${f}: CLEAN`);
  }
}

// Check HTML files too
const blogDir = path.join(root, 'public', 'blog');
if (fs.existsSync(blogDir)) {
  const slugs = fs.readdirSync(blogDir).filter(d => {
    try { return fs.statSync(path.join(blogDir, d)).isDirectory(); } catch { return false; }
  });
  
  let htmlBroken = 0;
  const brokenSlugs = [];
  
  for (const slug of slugs) {
    const htmlPath = path.join(blogDir, slug, 'index.html');
    if (!fs.existsSync(htmlPath)) continue;
    const html = fs.readFileSync(htmlPath, 'utf-8');
    let count = 0;
    for (const pat of MOJIBAKE) {
      count += (html.split(pat).length - 1);
    }
    if (count > 0) {
      htmlBroken += count;
      brokenSlugs.push(slug);
    }
  }
  
  console.log(`\nHTML static files: ${slugs.length} checked`);
  if (htmlBroken > 0) {
    console.log(`❌ ${htmlBroken} mojibake in ${brokenSlugs.length} HTML files`);
    console.log(`  Broken: ${brokenSlugs.join(', ')}`);
  } else {
    console.log(`✅ All HTML files CLEAN`);
  }
}

console.log(`\n=== TOTAL: ${totalBroken} mojibake across all TS files ===`);
if (totalBroken > 0) {
  console.log('ACTION NEEDED: Files need re-encoding fix');
  process.exit(1);
} else {
  console.log('ALL CLEAN ✅');
}
