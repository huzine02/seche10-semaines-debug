const fs = require('fs');
const path = require('path');
const t = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'healthArticles.ts'), 'utf-8');

// Find first mojibake article and show the offending chars
const lines = t.split('\n');
for (let i = 0; i < lines.length; i++) {
  // Check for common mojibake byte sequences
  const line = lines[i];
  if (/[\u00C0-\u00C3][\u0080-\u00BF]/.test(line) || /\u00E2[\u0080-\u00BF][\u0080-\u00BF]/.test(line) || /\u00F0[\u0090-\u009F]/.test(line)) {
    console.log('Line ' + (i+1) + ': ' + line.substring(0, 200));
    // Show the bad chars
    const m = line.match(/([\u00C0-\u00F4][\u0080-\u00BF]{1,3})/g);
    if (m) console.log('  Bad sequences: ' + m.map(x => JSON.stringify(x)).join(', '));
    break;
  }
}

// Also check: are there any Ã characters left?
const aCount = (t.match(/\u00C3/g) || []).length;
const cCount = (t.match(/\u00C2/g) || []).length;
console.log('\nRemaining \\u00C3: ' + aCount);
console.log('Remaining \\u00C2: ' + cCount);

// Check if the checker script itself has the right regex
const checker = fs.readFileSync(path.join(__dirname, 'check-health-encoding.cjs'), 'utf-8');
const badRegex = checker.match(/bad = (.+)/);
if (badRegex) console.log('\nChecker regex source: ' + badRegex[1]);
