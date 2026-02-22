const fs = require('fs');
const path = require('path');

const blogDir = 'public/blog';
const dirs = fs.readdirSync(blogDir).filter(d => fs.statSync(path.join(blogDir, d)).isDirectory());

let totalFaq = 0, totalBread = 0, totalArticle = 0, errors = 0;

// Test sample article in detail
const sample = 'prediabete-que-faire';
const sampleHtml = fs.readFileSync(path.join(blogDir, sample, 'index.html'), 'utf8');
const sampleMatches = sampleHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
console.log(`\n=== SAMPLE: ${sample} (${sampleMatches.length} JSON-LD blocks) ===`);
sampleMatches.forEach((m, i) => {
  const json = m.replace(/<script type="application\/ld\+json">/, '').replace(/<\/script>/, '');
  try {
    const obj = JSON.parse(json);
    console.log(`  Block ${i+1}: ✅ ${obj['@type']}`);
    if (obj['@type'] === 'FAQPage') {
      console.log(`    ${obj.mainEntity.length} questions`);
    }
  } catch(e) {
    console.log(`  Block ${i+1}: ❌ INVALID: ${e.message}`);
    errors++;
  }
});

// Validate all articles
console.log('\n=== VALIDATION 63 ARTICLES ===');
dirs.forEach(slug => {
  const html = fs.readFileSync(path.join(blogDir, slug, 'index.html'), 'utf8');
  const matches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
  matches.forEach(m => {
    const json = m.replace(/<script type="application\/ld\+json">/, '').replace(/<\/script>/, '');
    try {
      const obj = JSON.parse(json);
      if (obj['@type'] === 'FAQPage') totalFaq++;
      if (obj['@type'] === 'BreadcrumbList') totalBread++;
      if (obj['@type'] === 'Article') totalArticle++;
    } catch(e) {
      console.log(`  ❌ ${slug}: invalid JSON-LD — ${e.message}`);
      errors++;
    }
  });
});

console.log(`\nFAQPage Schema: ${totalFaq}/63`);
console.log(`BreadcrumbList: ${totalBread}/63`);
console.log(`Article Schema: ${totalArticle}/63`);
console.log(`JSON-LD errors: ${errors}`);
console.log(`\n${errors === 0 ? '✅ TOUT EST VALIDE' : '❌ DES ERREURS EXISTENT'}`);

// Validate homepage
const index = fs.readFileSync('index.html', 'utf8');
const indexMatches = index.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
console.log(`\n=== HOMEPAGE (${indexMatches.length} JSON-LD blocks) ===`);
indexMatches.forEach((m, i) => {
  const json = m.replace(/<script type="application\/ld\+json">/, '').replace(/<\/script>/, '');
  try {
    const obj = JSON.parse(json);
    console.log(`  Block ${i+1}: ✅ ${obj['@type']}`);
  } catch(e) {
    console.log(`  Block ${i+1}: ❌ ${e.message}`);
  }
});

// Check ssr-content
console.log('\nHomepage SSR content:', index.includes('Sèche 10 Semaines — Programme Nutrition') ? '✅ présent' : '❌ absent');
console.log('Homepage H1:', index.includes('<h1>') ? '✅' : '❌');
console.log('Homepage links blog:', (index.match(/\/blog\//g) || []).length, 'liens');
