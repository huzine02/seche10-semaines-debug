const fs = require('fs');
const path = require('path');
const t = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'healthArticles.ts'), 'utf-8');

// Check for remaining mojibake patterns
const patterns = [
  [/\u00C3[\u0080-\u00BF]/g, 'C3+xx (accented)'],
  [/\u00C2[\u0080-\u00BF]/g, 'C2+xx'],
  [/\u00E2\u0080[\u0080-\u00BF]/g, 'E2 80 xx (em dash/quotes)'],
  [/\u00E2[\u0081-\u00BF][\u0080-\u00BF]/g, 'E2 xx xx (symbols)'],
  [/\u00F0\u009F[\u0080-\u00BF][\u0080-\u00BF]/g, 'F0 9F xx xx (emoji)'],
];

let total = 0;
for (const [re, label] of patterns) {
  const matches = t.match(re);
  if (matches) {
    console.log(label + ': ' + matches.length + ' occurrences');
    const unique = [...new Set(matches)];
    unique.forEach(m => console.log('  ' + JSON.stringify(m)));
    total += matches.length;
  }
}
console.log('\nTotal remaining: ' + total);
