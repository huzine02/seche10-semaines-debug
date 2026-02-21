const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'src', 'data', 'healthArticles.ts');
let text = fs.readFileSync(file, 'utf-8');

const fixes = [
  ['\u00C3\u00B3', '\u00F3'],  // Ã³ → ó
  ['\u00C3\u00B7', '\u00F7'],  // Ã· → ÷
  ['\u00C2\u00B1', '\u00B1'],  // Â± → ±
  ['\u00C2\u00B2', '\u00B2'],  // Â² → ²
];

for (const [bad, good] of fixes) {
  if (text.includes(bad)) {
    const count = text.split(bad).length - 1;
    text = text.split(bad).join(good);
    console.log('Fixed ' + count + 'x: ' + JSON.stringify(bad) + ' -> ' + good);
  }
}

// Fix remaining â sequences (3-byte UTF-8 decoded as Latin-1)  
// â + 2 bytes pattern - need to identify what they are
const re = /\u00E2([\u0080-\u00BF])([\u0080-\u00BF])/g;
let match;
const seen = new Set();
let tempText = text;
while ((match = re.exec(tempText)) !== null) {
  const seq = match[0];
  if (!seen.has(seq)) {
    seen.add(seq);
    // Reconstruct the original UTF-8 bytes
    const b1 = 0xE2;
    const b2 = match[1].charCodeAt(0);
    const b3 = match[2].charCodeAt(0);
    const buf = Buffer.from([b1, b2, b3]);
    const decoded = buf.toString('utf-8');
    const count = text.split(seq).length - 1;
    console.log('Fixed ' + count + 'x: E2 ' + b2.toString(16) + ' ' + b3.toString(16) + ' -> ' + decoded);
    text = text.split(seq).join(decoded);
  }
}

fs.writeFileSync(file, text, 'utf-8');
console.log('Done.');
