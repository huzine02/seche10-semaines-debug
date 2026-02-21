const fs = require('fs');
const c = fs.readFileSync('C:/Users/huzine/projects/seche10-semaines-debug/src/data/healthArticles.ts', 'utf8');
const slugs = [...c.matchAll(/slug: "([^"]+)"/g)];
slugs.forEach((m, i) => console.log(i + 1, m[1]));
console.log('\nFile length:', c.length, 'chars');
console.log('Last 100 chars:', JSON.stringify(c.slice(-100)));
console.log('Ends with ];:', c.trimEnd().endsWith('];'));
