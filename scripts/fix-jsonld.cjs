const fs = require('fs');
const path = require('path');

const blogDir = 'public/blog';
const dirs = fs.readdirSync(blogDir).filter(d => fs.statSync(path.join(blogDir, d)).isDirectory());
let fixed = 0;

dirs.forEach(slug => {
  const filePath = path.join(blogDir, slug, 'index.html');
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  const matches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
  matches.forEach(m => {
    let json = m.replace(/<script type="application\/ld\+json">/, '').replace(/<\/script>/, '');
    try {
      JSON.parse(json);
    } catch(e) {
      // Fix control characters in JSON strings
      let cleanJson = json.replace(/[\x00-\x1F\x7F]/g, (c) => {
        if (c === '\n') return '\\n';
        if (c === '\r') return '\\r';
        if (c === '\t') return '\\t';
        return '';
      });
      try {
        JSON.parse(cleanJson);
        html = html.replace(m, `<script type="application/ld+json">${cleanJson}</script>`);
        changed = true;
        console.log(`  ✅ Fixed: ${slug}`);
      } catch(e2) {
        console.log(`  ❌ Could not fix: ${slug} — ${e2.message}`);
      }
    }
  });
  
  if (changed) {
    fs.writeFileSync(filePath, html, 'utf8');
    fixed++;
  }
});

console.log(`\nFixed ${fixed} files`);
