const fs = require('fs');
const c = fs.readFileSync('src/data/seoArticlesRewrite.ts', 'utf8');
const re = /ð[\s\S]{1,5}(?=\s|<)/g;
const patterns = new Map();
let m;
while ((m = re.exec(c)) !== null) {
  const text = m[0].substring(0, 5);
  const codes = [];
  for (let i = 0; i < Math.min(text.length, 5); i++) {
    codes.push('U+' + text.codePointAt(i).toString(16).padStart(4, '0'));
  }
  const key = codes.slice(0, 4).join(' ');
  if (!patterns.has(key)) {
    patterns.set(key, { text: JSON.stringify(text.substring(0, 4)), count: 0 });
  }
  patterns.get(key).count++;
}
for (const [key, val] of patterns) {
  console.log(`  ${key} => ${val.text} (${val.count}x)`);
}
