const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const files = [
  path.join(root, 'src', 'data', 'seoArticles25.ts'),
  path.join(root, 'src', 'data', 'seoArticlesRewrite.ts')
];

// These are uppercase accented chars that were missed by the byte-level fix
// They appear as multi-char sequences in the file
const textReplacements = [
  ['\u00c3\u2030', '\u00c9'],    // É (Ã‰ in mojibake display)
  ['\u00c3\u02c6', '\u00c8'],    // È (Ãˆ)
  ['\u00c3\u20ac', '\u00c0'],    // À (Ã€)
  ['\u00c3\u0152', '\u0152'],    // Œ (but could be Ô depending on context)
  ['\u00c3\u201c', '\u00d4'],    // Ô
  ['\u00c3\u2019', '\u00d9'],    // Ù
  ['\u00c3\u0178', '\u00db'],    // Û
  ['\u00c3\u2039', '\u00cb'],    // Ë
  ['\u00c3\u0192', '\u00cf'],    // Ï
  ['\u00c3\u2013', '\u00d2'],    // Ò
  ['\u00c3\u0160', '\u0160'],    // Š
];

for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  let fixes = 0;
  
  for (const [from, to] of textReplacements) {
    const count = c.split(from).length - 1;
    if (count > 0) {
      c = c.split(from).join(to);
      fixes += count;
      console.log(`  ${path.basename(f)}: replaced ${count}x ${from.split('').map(ch=>'U+'+ch.charCodeAt(0).toString(16).toUpperCase().padStart(4,'0')).join(' ')} -> ${to} (U+${to.charCodeAt(0).toString(16).toUpperCase().padStart(4,'0')})`);
    }
  }
  
  fs.writeFileSync(f, c, 'utf8');
  console.log(`${path.basename(f)}: ${fixes} fixes applied\n`);
}

// Verify
console.log('Running audit...');
for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  // Check for any remaining Ã followed by special chars
  const remaining = [];
  for (let i = 0; i < c.length - 1; i++) {
    if (c.charCodeAt(i) === 0xC3 && c.charCodeAt(i+1) >= 0x80) {
      // This is a normal UTF-8 accented char like é è ê etc - that's fine
      // But if charCodeAt(i+1) is in the range of "smart" chars (0x2000+), it's mojibake
    }
  }
  const rep = (c.match(/\ufffd/g) || []).length;
  const accents = (c.match(/[\u00e9\u00e8\u00ea\u00e0\u00e2\u00f9\u00fb\u00ee\u00f4\u00e7\u00c9\u00c8\u00c0]/g) || []).length;
  console.log(`${path.basename(f)}: rep=${rep} accents=${accents}`);
}
