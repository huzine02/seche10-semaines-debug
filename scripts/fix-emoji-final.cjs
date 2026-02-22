const fs = require('fs');
let t = fs.readFileSync('src/data/healthArticles.ts', 'utf8');

// Fix broken variation selector: ⚠ï¸ → ⚠️
const before = t;
t = t.replace(/\u26a0\u00ef\u00b8\u008f/g, '\u26a0\ufe0f');
t = t.replace(/\u26a0ï¸/g, '\u26a0\ufe0f');

// Fix broken œ (Å + smart quote)
t = t.replace(/\u0152/g, '\u0153'); // Œ that should be œ in lowercase context - skip this
// Actually find the exact broken sequence
const oeMatches = [...t.matchAll(/Å./g)];
console.log('Å sequences found:', oeMatches.length, oeMatches.map(m => JSON.stringify(m[0]) + ' → ' + [...m[0]].map(c => 'U+' + c.codePointAt(0).toString(16).toUpperCase()).join(' ')));

// Å" (U+00C5 U+201C) or Å" (U+00C5 U+0153) → œ  
t = t.replace(/\u00c5\u201c/g, '\u0153');
t = t.replace(/\u00c5\u0153/g, '\u0153');

fs.writeFileSync('src/data/healthArticles.ts', t, 'utf8');

// Verify
const t2 = fs.readFileSync('src/data/healthArticles.ts', 'utf8');
const warnings = [...t2.matchAll(/\u26a0[^\ufe0f]/g)];
console.log('Broken ⚠ remaining:', warnings.length);
const goodWarnings = [...t2.matchAll(/\u26a0\ufe0f/g)];
console.log('Good ⚠️:', goodWarnings.length);

// Check for any remaining non-standard chars
const suspicious = [...t2.matchAll(/[\u00c0-\u00c5][\u0080-\u00bf\u0152\u0153\u2018-\u201d]/g)];
console.log('Suspicious sequences:', suspicious.length);
if (suspicious.length > 0) {
  suspicious.slice(0, 10).forEach(m => {
    const hex = [...m[0]].map(c => 'U+' + c.codePointAt(0).toString(16).toUpperCase()).join(' ');
    const pos = m.index;
    const ctx = t2.substring(Math.max(0, pos - 15), pos + 15);
    console.log(`  ${hex} in: ${JSON.stringify(ctx)}`);
  });
}

console.log('Done!');
