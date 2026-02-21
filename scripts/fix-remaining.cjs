const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const files = [
  path.join(root, 'src', 'data', 'seoArticles25.ts'),
  path.join(root, 'src', 'data', 'seoArticlesRewrite.ts')
];

for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  const before = c.length;
  
  // Fix broken emoji/special char sequences
  c = c.replace(/\ufffd\u0152/g, '\u274C'); // ❌
  c = c.replace(/\ufffd\u00B0/g, '\u{1F4A1}'); // 💡  
  c = c.replace(/\ufffd/g, '\u2705'); // remaining ✅
  
  // Fix remaining double-encoded typography
  c = c.replace(/\u00E2\u20AC\u201C/g, '\u2014'); // em dash —
  c = c.replace(/\u00E2\u20AC\u2122/g, '\u2019'); // right single quote '
  c = c.replace(/\u00E2\u20AC\u0153/g, '\u201C'); // left double quote "
  c = c.replace(/\u00E2\u20AC\u009D/g, '\u201D'); // right double quote "
  c = c.replace(/\u00E2\u20AC\u00A6/g, '\u2026'); // ellipsis …
  c = c.replace(/\u00E2\u20AC\u02DC/g, '\u2018'); // left single quote '
  c = c.replace(/\u00E2\u201A\u00AC/g, '\u20AC'); // euro €
  c = c.replace(/\u00C2\u00A0/g, '\u00A0'); // non-breaking space
  c = c.replace(/\u00C2\u00AB/g, '\u00AB'); // «
  c = c.replace(/\u00C2\u00BB/g, '\u00BB'); // »
  c = c.replace(/\u00C2\u00B0/g, '\u00B0'); // °
  c = c.replace(/\u00C2\u00B2/g, '\u00B2'); // ²
  
  // Fix remaining â€" â€™ etc patterns (as literal text, not code points)
  const replacements = [
    ['\u00e2\u0080\u0093', '\u2013'], // en dash –
    ['\u00e2\u0080\u0094', '\u2014'], // em dash —
    ['\u00e2\u0080\u0099', '\u2019'], // right quote '
    ['\u00e2\u0080\u009c', '\u201c'], // left quote "  
    ['\u00e2\u0080\u009d', '\u201d'], // right quote "
    ['\u00e2\u0080\u00a6', '\u2026'], // ellipsis …
    ['\u00e2\u0089\u00a5', '\u2265'], // ≥
    ['\u00e2\u0089\u00a4', '\u2264'], // ≤
    ['\u00e2\u009c\u0085', '\u2705'], // ✅
    ['\u00e2\u009c\u0093', '\u2713'], // ✓
    ['\u00e2\u009d\u008c', '\u274c'], // ❌
  ];
  
  for (const [from, to] of replacements) {
    c = c.split(from).join(to);
  }
  
  fs.writeFileSync(f, c, 'utf8');
  
  // Audit
  const rep = (c.match(/\ufffd/g) || []).length;
  const mojPatterns = /\u00c3[\u0080-\u00bf]\u00c2[\u0080-\u00bf]/g;
  const moj2 = (c.match(mojPatterns) || []).length;
  const accents = (c.match(/[\u00e9\u00e8\u00ea\u00eb\u00e0\u00e2\u00f9\u00fb\u00ee\u00ef\u00f4\u00e7\u0153]/g) || []).length;
  const emojis = (c.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length;
  const dashes = (c.match(/[\u2013\u2014]/g) || []).length;
  
  console.log(`${path.basename(f)}:`);
  console.log(`  Replacement chars: ${rep}`);
  console.log(`  Double-encoded seqs: ${moj2}`);
  console.log(`  French accents: ${accents}`);
  console.log(`  Emojis: ${emojis}`);
  console.log(`  Dashes: ${dashes}`);
  console.log(`  Size: ${before} -> ${c.length}\n`);
}
