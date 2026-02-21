const fs = require('fs');
const path = require('path');

const EXTRA_EMOJI = [
  ['\u00f0\u0178\u201c\u2030', '\u{1F4C9}'],   // 📉 chart down
  ['\u00f0\u0178\u00a5\u2014', '\u{1F957}'],   // 🥗 salad
  ['\u00f0\u0178\u201d\u00a5', '\u{1F525}'],   // 🔥 fire  
  ['\u00f0\u0178\u00a5\u00a4', '\u{1F964}'],   // 🥤 cup with straw
  ['\u00f0\u0178\u201c\u2039', '\u{1F4CB}'],   // 📋 clipboard
  ['\u00f0\u0178\u0152\u2026', '\u{1F305}'],   // 🌅 sunrise
  ['\u00f0\u0178\u2019\u00a7', '\u{1F4A7}'],   // 💧 droplet
  ['\u00f0\u0178\u008f\u00a0', '\u{1F3E0}'],   // 🏠 house
];

const files = [
  path.join(__dirname, '..', 'src', 'data', 'seoArticlesRewrite.ts'),
  path.join(__dirname, '..', 'src', 'data', 'seoArticles25.ts'),
];

for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  let fixes = 0;
  for (const [from, to] of EXTRA_EMOJI) {
    const count = c.split(from).length - 1;
    if (count > 0) { c = c.split(from).join(to); fixes += count; }
  }
  fs.writeFileSync(f, c, 'utf8');
  const broken = (c.match(/ð[\u0100-\uFFFF]/g) || []).length;
  console.log(`${path.basename(f)}: ${fixes} fixes, ${broken} remaining broken`);
}
