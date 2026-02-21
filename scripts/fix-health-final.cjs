const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'src', 'data', 'healthArticles.ts');
let text = fs.readFileSync(file, 'utf-8');

// Windows-1252 to byte mapping for chars 0x80-0x9F
// These codepoints in Windows-1252 map to different Unicode codepoints
const win1252 = {
  0x20AC: 0x80, // € → byte 0x80
  0x201A: 0x82, // ‚ → byte 0x82
  0x0192: 0x83, // ƒ → byte 0x83
  0x201E: 0x84, // „ → byte 0x84
  0x2026: 0x85, // … → byte 0x85
  0x2020: 0x86, // † → byte 0x86
  0x2021: 0x87, // ‡ → byte 0x87
  0x02C6: 0x88, // ˆ → byte 0x88
  0x2030: 0x89, // ‰ → byte 0x89
  0x0160: 0x8A, // Š → byte 0x8A
  0x2039: 0x8B, // ‹ → byte 0x8B
  0x0152: 0x8C, // Œ → byte 0x8C
  0x017D: 0x8E, // Ž → byte 0x8E
  0x2018: 0x91, // ' → byte 0x91
  0x2019: 0x92, // ' → byte 0x92
  0x201C: 0x93, // " → byte 0x93
  0x201D: 0x94, // " → byte 0x94
  0x2022: 0x95, // • → byte 0x95
  0x2013: 0x96, // – → byte 0x96
  0x2014: 0x97, // — → byte 0x97
  0x02DC: 0x98, // ˜ → byte 0x98
  0x2122: 0x99, // ™ → byte 0x99
  0x0161: 0x9A, // š → byte 0x9A
  0x203A: 0x9B, // › → byte 0x9B
  0x0153: 0x9C, // œ → byte 0x9C
  0x017E: 0x9E, // ž → byte 0x9E
  0x0178: 0x9F, // Ÿ → byte 0x9F
};

function charToByte(ch) {
  const cp = ch.charCodeAt(0);
  // Direct Latin-1 range
  if (cp >= 0x80 && cp <= 0xFF) return cp;
  // Windows-1252 special range
  if (win1252[cp] !== undefined) return win1252[cp];
  return null;
}

// Fix all 2-byte UTF-8 sequences that were decoded as win-1252
// Pattern: \u00C2 or \u00C3 followed by a char whose byte value is 0x80-0xBF
let fixCount = 0;
const result = [];
for (let i = 0; i < text.length; i++) {
  const cp = text.charCodeAt(i);
  if (cp === 0xC2 || cp === 0xC3) {
    // Check next char
    if (i + 1 < text.length) {
      const nextByte = charToByte(text[i + 1]);
      if (nextByte !== null && nextByte >= 0x80 && nextByte <= 0xBF) {
        // Reconstruct UTF-8
        const b1 = cp;
        const b2 = nextByte;
        const decoded = Buffer.from([b1, b2]).toString('utf-8');
        result.push(decoded);
        i++; // skip next char
        fixCount++;
        continue;
      }
    }
  }
  
  // Fix 3-byte sequences (E2 xx xx) - em dash, smart quotes, etc.
  if (cp === 0xE2 && i + 2 < text.length) {
    const b2 = charToByte(text[i + 1]);
    const b3 = charToByte(text[i + 2]);
    if (b2 !== null && b2 >= 0x80 && b2 <= 0xBF && b3 !== null && b3 >= 0x80 && b3 <= 0xBF) {
      const decoded = Buffer.from([0xE2, b2, b3]).toString('utf-8');
      result.push(decoded);
      i += 2;
      fixCount++;
      continue;
    }
  }
  
  // Fix 4-byte sequences (F0 9F xx xx) - emojis
  if (cp === 0xF0 && i + 3 < text.length) {
    const b2 = charToByte(text[i + 1]);
    const b3 = charToByte(text[i + 2]);
    const b4 = charToByte(text[i + 3]);
    if (b2 !== null && b3 !== null && b4 !== null) {
      const decoded = Buffer.from([0xF0, b2, b3, b4]).toString('utf-8');
      if (!decoded.includes('\uFFFD')) {
        result.push(decoded);
        i += 3;
        fixCount++;
        continue;
      }
    }
  }
  
  result.push(text[i]);
}

const newText = result.join('');
fs.writeFileSync(file, newText, 'utf-8');
console.log('Fixed ' + fixCount + ' sequences.');

// Verify
const verify = fs.readFileSync(file, 'utf-8');
const remaining = (verify.match(/\u00C3/g) || []).length;
const remainingC2 = (verify.match(/\u00C2/g) || []).length;
console.log('Remaining U+00C3: ' + remaining);
console.log('Remaining U+00C2: ' + remainingC2);
