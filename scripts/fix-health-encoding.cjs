const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'src', 'data', 'healthArticles.ts');
let text = fs.readFileSync(file, 'utf-8');

// Common double-encoded UTF-8 patterns
const replacements = [
  ['\u00C3\u00A9', '\u00E9'],  // Ã© → é
  ['\u00C3\u00A8', '\u00E8'],  // Ã¨ → è
  ['\u00C3\u00A0', '\u00E0'],  // Ã  → à
  ['\u00C3\u00A2', '\u00E2'],  // Ã¢ → â
  ['\u00C3\u00AE', '\u00EE'],  // Ã® → î
  ['\u00C3\u00B4', '\u00F4'],  // Ã´ → ô
  ['\u00C3\u00BB', '\u00FB'],  // Ã» → û
  ['\u00C3\u00B9', '\u00F9'],  // Ã¹ → ù
  ['\u00C3\u00AA', '\u00EA'],  // Ãª → ê
  ['\u00C3\u00A7', '\u00E7'],  // Ã§ → ç
  ['\u00C3\u00AF', '\u00EF'],  // Ã¯ → ï
  ['\u00C3\u00BC', '\u00FC'],  // Ã¼ → ü
  ['\u00C3\u0089', '\u00C9'],  // Ã‰ → É
  ['\u00C3\u0080', '\u00C0'],  // Ã€ → À
  ['\u00C3\u0097', '\u00D7'],  // Ã— → ×
  ['\u00C3\u00B1', '\u00F1'],  // Ã± → ñ
  ['\u00C2\u00AB', '\u00AB'],  // Â« → «
  ['\u00C2\u00BB', '\u00BB'],  // Â» → »
  ['\u00C2\u00B0', '\u00B0'],  // Â° → °
  ['\u00C2\u00B5', '\u00B5'],  // Âµ → µ
];

// Em dash, smart quotes
const textReplacements = [
  ['\u00E2\u0080\u0094', '\u2014'],  // â€" → —
  ['\u00E2\u0080\u0099', '\u2019'],  // â€™ → '
  ['\u00E2\u0080\u0098', '\u2018'],  // â€˜ → '
  ['\u00E2\u0080\u009C', '\u201C'],  // â€œ → "
  ['\u00E2\u0080\u009D', '\u201D'],  // â€ → "
  ['\u00E2\u0089\u00A5', '\u2265'],  // â‰¥ → ≥
  ['\u00E2\u0089\u00A4', '\u2264'],  // â‰¤ → ≤
  ['\u00E2\u0086\u0092', '\u2192'],  // â†' → →
  ['\u00E2\u009C\u0085', '\u2705'],  // âœ… → ✅
];

// Emoji 4-byte sequences (UTF-8 bytes as Latin-1)
const emojiReplacements = [
  ['\u00F0\u009F\u0094\u00AC', '\uD83D\uDD2C'],  // 🔬
  ['\u00F0\u009F\u0092\u00AC', '\uD83D\uDCAC'],  // 💬
  ['\u00F0\u009F\u0094\u00A5', '\uD83D\uDD25'],  // 🔥
  ['\u00F0\u009F\u008E\u00AF', '\uD83C\uDFAF'],  // 🎯
  ['\u00F0\u009F\u0092\u00AA', '\uD83D\uDCAA'],  // 💪
  ['\u00F0\u009F\u00A7\u00A0', '\uD83E\uDDE0'],  // 🧠
  ['\u00F0\u009F\u00A5\u0097', '\uD83E\uDD57'],  // 🥗
  ['\u00F0\u009F\u0093\u008A', '\uD83D\uDCCA'],  // 📊
  ['\u00F0\u009F\u0092\u00A1', '\uD83D\uDCA1'],  // 💡
  ['\u00F0\u009F\u008C\u00BF', '\uD83C\uDF3F'],  // 🌿
  ['\u00F0\u009F\u0093\u008B', '\uD83D\uDCCB'],  // 📋
  ['\u00F0\u009F\u0093\u0088', '\uD83D\uDCC8'],  // 📈
  ['\u00F0\u009F\u00A7\u00AC', '\uD83E\uDDEC'],  // 🧬
  ['\u00F0\u009F\u00A9\u00BA', '\uD83E\uDE7A'],  // 🩺
  ['\u00F0\u009F\u00A9\u00B8', '\uD83E\uDE78'],  // 🩸
  ['\u00F0\u009F\u00A7\u00AA', '\uD83E\uDDEA'],  // 🧪
];

let fixCount = 0;
const allReplacements = [...replacements, ...textReplacements, ...emojiReplacements];

for (const [bad, good] of allReplacements) {
  if (text.includes(bad)) {
    const count = text.split(bad).length - 1;
    text = text.split(bad).join(good);
    console.log('Fixed ' + count + 'x: ' + JSON.stringify(bad) + ' -> ' + good);
    fixCount++;
  }
}

fs.writeFileSync(file, text, 'utf-8');
console.log('\nDone. ' + fixCount + ' pattern types fixed.');
