const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const files = [
  path.join(root, 'src', 'data', 'seoArticles25.ts'),
  path.join(root, 'src', 'data', 'seoArticlesRewrite.ts')
];

// Emoji replacements: exact code point sequences found in files
const EMOJI_REPLACEMENTS = [
  // 4-byte emojis (ð + 3 chars)
  ['\u00f0\u0178\u2019\u00ac', '\u{1F4AC}'],   // 💬 speech bubble
  ['\u00f0\u0178\u201d\u00ac', '\u{1F52C}'],   // 🔬 microscope  
  ['\u00f0\u0178\u008d\u00b3', '\u{1F373}'],   // 🍳 cooking
  ['\u00f0\u0178\u2019\u00aa', '\u{1F4AA}'],   // 💪 muscle
  ['\u00f0\u0178\u201c\u0160', '\u{1F4CA}'],   // 📊 bar chart
  ['\u00f0\u0178\u00a5\u00a9', '\u{1F969}'],   // 🥩 steak
  ['\u00f0\u0178\u203a\u2019', '\u{1F6D1}'],   // 🛑 stop sign
  ['\u00f0\u0178\u2019\u0160', '\u{1F4CA}'],   // 📊 (alt)
  ['\u00f0\u0178\u2019\u00a1', '\u{1F4A1}'],   // 💡 lightbulb
  ['\u00f0\u0178\u201c\u201d', '\u{1F4CD}'],   // 📍 pin
  ['\u00f0\u0178\u201c\u008b', '\u{1F4CB}'],   // 📋 clipboard
  ['\u00f0\u0178\u201c\u00a5', '\u{1F525}'],   // 🔥 fire
  ['\u00f0\u0178\u008f\u2020', '\u{1F3C6}'],   // 🏆 trophy
  ['\u00f0\u0178\u008f\u2039', '\u{1F3CB}'],   // 🏋 weightlifter
  ['\u00f0\u0178\u0160\u00a8', '\u{1F4A8}'],   // 💨 wind
  ['\u00f0\u0178\u008e\u00af', '\u{1F3AF}'],   // 🎯 target
  ['\u00f0\u0178\u201c\u009d', '\u{1F4DD}'],   // 📝 memo
  ['\u00f0\u0178\u0161\u00a8', '\u{1F6A8}'],   // 🚨 siren
  ['\u00f0\u0178\u201c\u02c6', '\u{1F4C8}'],   // 📈 chart up
  ['\u00f0\u0178\u00a7\u00aa', '\u{1F9EA}'],   // 🧪 test tube
  ['\u00f0\u0178\u00a5\u0160', '\u{1F95A}'],   // 🥚 egg
  ['\u00f0\u0178\u00a5\u00a6', '\u{1F966}'],   // 🥦 broccoli
  ['\u00f0\u0178\u00a5\u0153', '\u{1F95C}'],   // 🥜 peanut
];

// 3-byte special chars (â + 2 chars)  
const SPECIAL_REPLACEMENTS = [
  ['\u00e2\u20ac\u201d', '\u2014'],    // — em dash (alt encoding)
  ['\u00e2\u201d\u20ac', '\u2500'],    // ─ box drawing
  ['\u00e2\u2030\u02c6', '\u2248'],    // ≈ approximately
  ['\u00e2\u2020\u2019', '\u2191'],    // ↑ arrow up
  ['\u00e2\u201a\u00ac', '\u20AC'],    // € euro
  ['\u00e2\u0153\u2026', '\u2705'],    // ✅ check mark
  ['\u00e2\u009d\u0152', '\u274C'],    // ❌ cross
  ['\u00e2\u008f\u00b0', '\u23F0'],    // ⏰ alarm clock
  ['\u00e2\u02dc\u2026', '\u2605'],    // ★ star
  ['\u00e2\u02dc\u2020', '\u2606'],    // ☆ star outline
  ['\u00e2\u0086\u2019', '\u2192'],    // → arrow right
  ['\u00e2\u0086\u2018', '\u2190'],    // ← arrow left  
  ['\u00e2\u0086\u201c', '\u2193'],    // ↓ arrow down
  ['\u00e2\u0080\u00b9', '\u2039'],    // ‹ 
  ['\u00e2\u0080\u00ba', '\u203A'],    // ›
  ['\u00e2\u0153\u0178', '\u2713'],    // ✓ checkmark
];

for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  const name = path.basename(f);
  let fixes = 0;
  
  for (const [from, to] of [...EMOJI_REPLACEMENTS, ...SPECIAL_REPLACEMENTS]) {
    const count = c.split(from).length - 1;
    if (count > 0) {
      c = c.split(from).join(to);
      fixes += count;
    }
  }
  
  // Also catch any remaining ð patterns we might have missed - replace with a generic emoji
  const remaining = (c.match(/ð[\u0100-\uFFFF]/g) || []).length;
  
  fs.writeFileSync(f, c, 'utf8');
  
  const brokenEmoji = (c.match(/ðŸ|ð\u0178/g) || []).length;
  const realEmoji = (c.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length;
  const rep = (c.match(/\ufffd/g) || []).length;
  
  console.log(`${name}: ${fixes} emoji/special fixes`);
  console.log(`  brokenEmoji=${brokenEmoji} realEmoji=${realEmoji} rep=${rep} remaining_ð=${remaining}`);
  console.log(brokenEmoji === 0 && rep === 0 ? '  ✅ CLEAN\n' : '  ❌ ISSUES\n');
}
