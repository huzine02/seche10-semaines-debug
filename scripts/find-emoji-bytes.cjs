const fs = require('fs');
const c = fs.readFileSync('src/data/seoArticles25.ts', 'utf8');

// Find all unique broken emoji patterns (starting with ð = U+00F0)
const patterns = new Set();
const re = /ð[\s\S]{1,5}(?=\s|<)/g;
let m;
while ((m = re.exec(c)) !== null) {
  const text = m[0];
  const codes = [];
  for (let i = 0; i < Math.min(text.length, 4); i++) {
    codes.push('U+' + text.codePointAt(i).toString(16).padStart(4, '0'));
  }
  patterns.add(codes.join(' ') + ' => ' + JSON.stringify(text.substring(0, 4)));
}

console.log('Unique broken emoji patterns:');
for (const p of patterns) {
  console.log('  ' + p);
}

// Also find any remaining â sequences (3-byte double-encoded)
const re2 = /â[\s\S]{1,3}/g;
const aPatterns = new Set();
while ((m = re2.exec(c)) !== null) {
  if (m[0].length >= 2 && m[0].codePointAt(1) > 0x7F) {
    const text = m[0];
    const codes = [];
    for (let i = 0; i < Math.min(text.length, 3); i++) {
      codes.push('U+' + text.codePointAt(i).toString(16).padStart(4, '0'));
    }
    aPatterns.add(codes.join(' ') + ' => ' + JSON.stringify(text.substring(0, 3)));
  }
}
if (aPatterns.size > 0) {
  console.log('\nRemaining â patterns:');
  for (const p of aPatterns) console.log('  ' + p);
}
