const fs = require('fs');
const path = require('path');
const t = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'healthArticles.ts'), 'utf-8');

// Find all Ã (U+00C3) occurrences and show context
const lines = t.split('\n');
let count = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  let idx = -1;
  while ((idx = line.indexOf('\u00C3', idx + 1)) !== -1) {
    const ctx = line.substring(Math.max(0, idx - 20), Math.min(line.length, idx + 20));
    const nextChar = line.charCodeAt(idx + 1);
    console.log('Line ' + (i+1) + ' pos ' + idx + ': ...' + ctx + '... (next: U+' + nextChar.toString(16).padStart(4, '0') + ')');
    count++;
    if (count >= 10) break;
  }
  if (count >= 10) break;
}
console.log('\nTotal \\u00C3: ' + (t.match(/\u00C3/g) || []).length);
