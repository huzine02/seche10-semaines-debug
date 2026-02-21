const fs = require('fs');
const path = require('path');
const t = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'healthArticles.ts'), 'utf-8');
const lines = t.split('\n');
for (let i = 0; i < lines.length; i++) {
  const idx = lines[i].indexOf('\u00C2');
  if (idx !== -1) {
    const ctx = lines[i].substring(Math.max(0, idx - 30), Math.min(lines[i].length, idx + 30));
    const next = lines[i].charCodeAt(idx + 1);
    console.log('Line ' + (i+1) + ': ...' + ctx + '... (next: U+' + next.toString(16).padStart(4, '0') + ')');
  }
}
