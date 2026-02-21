const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
process.chdir(root);

// Restore originals from enriched commit  
execSync('git checkout 362bdb1 -- src/data/seoArticles25.ts src/data/seoArticlesRewrite.ts');
console.log('Restored from 362bdb1\n');

// Complete mapping of double-encoded UTF-8 sequences to correct chars
// When UTF-8 bytes are misinterpreted as Windows-1252 then re-encoded as UTF-8
const REPLACEMENTS = [
  // Lowercase accents
  ['Ã©', 'é'], ['Ã¨', 'è'], ['Ãª', 'ê'], ['Ã«', 'ë'],
  ['Ã ', 'à'], ['Ã¢', 'â'], ['Ã¤', 'ä'],
  ['Ã¹', 'ù'], ['Ã»', 'û'], ['Ã¼', 'ü'],
  ['Ã®', 'î'], ['Ã¯', 'ï'],
  ['Ã´', 'ô'], ['Ã¶', 'ö'],
  ['Ã§', 'ç'], ['Ã±', 'ñ'],
  ['Ã½', 'ý'], ['Ã¿', 'ÿ'],
  
  // Uppercase accents  
  ['Ã\u0089', 'É'], ['Ã\u0088', 'È'], ['Ã\u008A', 'Ê'], ['Ã\u008B', 'Ë'],
  ['Ã\u0080', 'À'], ['Ã\u0082', 'Â'], ['Ã\u0084', 'Ä'],
  ['Ã\u0099', 'Ù'], ['Ã\u009B', 'Û'], ['Ã\u009C', 'Ü'],
  ['Ã\u008E', 'Î'], ['Ã\u008F', 'Ï'],
  ['Ã\u0094', 'Ô'], ['Ã\u0096', 'Ö'],
  ['Ã\u0087', 'Ç'], ['Ã\u0091', 'Ñ'],
  
  // Special chars - windows-1252 double encoding
  ['Ã\u0097', '×'],  // multiplication sign
  ['Ã\u009F', 'ß'],  // eszett
  
  // Em/en dash, quotes, ellipsis (3-byte chars double-encoded via windows-1252)
  ['â\u0080\u0093', '–'],  // en dash
  ['â\u0080\u0094', '—'],  // em dash  
  ['â\u0080\u0099', '\u2019'],  // right single quote '
  ['â\u0080\u009C', '\u201C'],  // left double quote "
  ['â\u0080\u009D', '\u201D'],  // right double quote "
  ['â\u0080\u009E', '\u201E'],  // double low quote „
  ['â\u0080\u0098', '\u2018'],  // left single quote '
  ['â\u0080\u00A6', '…'],  // ellipsis
  ['â\u0080\u00A2', '•'],  // bullet
  ['â\u0080\u00B2', '′'],  // prime
  ['â\u0089\u00A5', '≥'],  // greater equal
  ['â\u0089\u00A4', '≤'],  // less equal
  ['â\u0089\u0088', '≈'],  // approximately
  
  // Euro, other
  ['â\u0082\u00AC', '€'],  // euro sign
  
  // Non-breaking space and other Â-prefixed
  ['Â\u00A0', '\u00A0'],  // NBSP
  ['Â«', '«'], ['Â»', '»'],
  ['Â°', '°'], ['Â²', '²'], ['Â³', '³'],
  ['Â©', '©'], ['Â®', '®'],
  ['Â±', '±'], ['Â¹', '¹'],
  ['Âµ', 'µ'],
  
  // Emojis (4-byte UTF-8 double-encoded via windows-1252)
  // ð = 0xF0 in win-1252 = Ã°, Ÿ = 0x9F = Å¸ or \u0178, etc.
  // 🔬 = F0 9F 94 AC -> double: C3 B0 C5 B8 ... complex
  // Instead, find patterns like ðŸ"¬ and ðŸ'¬ etc
  ['ðŸ"¬', '🔬'],  // microscope
  ['ðŸ\'¬', '💬'],  // speech bubble
  ['ðŸ\'¡', '💡'],  // lightbulb
  ['ðŸ\u008F\u008B', '🏋'],  // weightlifter
  ['ðŸ"Š', '📊'],  // bar chart
  ['ðŸ"‹', '📋'],  // clipboard
  ['ðŸ½', '🍽'],   // fork and knife
  ['ðŸ"¥', '🔥'],  // fire
  ['ðŸ\u008F†', '🏆'],  // trophy
  ['ðŸ\u0092ª', '💪'],  // muscle
  ['ðŸŽ¯', '🎯'],  // target
  ['ðŸ\u0091¤', '👤'],  // person
  ['ðŸ"', '📝'],   // memo
  ['ðŸš¨', '🚨'],  // siren
  ['ðŸ\u0092¡', '💡'],  // alt lightbulb
  ['â\u009C\u0085', '✅'],  // check mark
  ['â\u009D\u008C', '❌'],  // cross mark
  ['â\u009C\u0093', '✓'],   // check
  ['â\u009A\u00A0', '⚠'],   // warning
  ['â\u0086\u0092', '→'],   // arrow right
  ['â\u0086\u0090', '←'],   // arrow left
  
  // Œ/œ ligature
  ['Å\u0093', 'œ'],
  ['Å\u0092', 'Œ'],
];

const files = [
  path.join(root, 'src', 'data', 'seoArticles25.ts'),
  path.join(root, 'src', 'data', 'seoArticlesRewrite.ts')
];

for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  const name = path.basename(f);
  let totalFixes = 0;
  
  for (const [from, to] of REPLACEMENTS) {
    const count = c.split(from).length - 1;
    if (count > 0) {
      c = c.split(from).join(to);
      totalFixes += count;
    }
  }
  
  fs.writeFileSync(f, c, 'utf8');
  
  // Audit
  const rep = (c.match(/\ufffd/g) || []).length;
  const mojibake = (c.match(/Ã[©¨ª«àâ®´¹»§±]/g) || []).length;
  const brokenEmoji = (c.match(/ðŸ/g) || []).length;
  const accents = (c.match(/[éèêëàâùûîïôçœÉÈÀÔÇ]/g) || []).length;
  const realEmoji = (c.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length;
  const multiply = (c.match(/×/g) || []).length;
  const dashes = (c.match(/[—–]/g) || []).length;
  const smartQuotes = (c.match(/[\u2018\u2019\u201C\u201D]/g) || []).length;
  
  console.log(`${name}: ${totalFixes} replacements`);
  console.log(`  rep=${rep} moj=${mojibake} brokenEmoji=${brokenEmoji}`);
  console.log(`  accents=${accents} emoji=${realEmoji} ×=${multiply} dashes=${dashes} quotes=${smartQuotes}`);
  
  if (rep === 0 && mojibake === 0 && brokenEmoji === 0) {
    console.log(`  ✅ CLEAN\n`);
  } else {
    console.log(`  ❌ ISSUES REMAIN\n`);
    // Show remaining issues
    const lines = c.split('\n');
    let shown = 0;
    for (let i = 0; i < lines.length && shown < 10; i++) {
      if (/\ufffd|Ã[©¨ª«àâ®´¹»§±]|ðŸ/.test(lines[i])) {
        console.log(`  L${i+1}: ${lines[i].substring(0, 120)}`);
        shown++;
      }
    }
  }
}
