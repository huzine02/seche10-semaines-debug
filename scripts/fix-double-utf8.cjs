const fs = require('fs');
const path = require('path');

// Double-encoded UTF-8 produces sequences like:
// é (U+00E9) -> C3 A9 in UTF-8 -> interpreted as Latin-1: Ã (C3) © (A9) -> re-encoded as UTF-8: C3 83 C2 A9
// So we look for C3 8x C2 xx patterns and replace them with the original single byte pair

function fixFile(filePath) {
  // First restore from git to get the double-encoded version
  const buf = fs.readFileSync(filePath);
  
  // Work at the byte level
  const result = [];
  let i = 0;
  let fixes = 0;
  
  while (i < buf.length) {
    // Pattern: C3 [80-BF] C2 [80-BF] = double-encoded 2-byte UTF-8 char (accents, etc.)
    if (i + 3 < buf.length && buf[i] === 0xC3 && buf[i+1] >= 0x80 && buf[i+1] <= 0xBF 
        && buf[i+2] === 0xC2 && buf[i+3] >= 0x80 && buf[i+3] <= 0xBF) {
      // This is Ã + next_char double-encoded. The original was: (buf[i+1]) (buf[i+3])
      // buf[i+1] is the high byte reinterpreted, buf[i+3] is the low byte
      // Original UTF-8 was: C0_range byte + continuation byte
      // Actually: the original char was encoded as 2 UTF-8 bytes: [C3 xx] 
      // which got interpreted as 2 Latin-1 chars: char(C3)=Ã char(xx)
      // then each was re-encoded: Ã->C3 83, char(xx)->C2 xx
      // Wait, let me think again...
      // 
      // é = U+00E9. UTF-8: C3 A9
      // Double-encoding: C3 is Latin-1 char Ã (U+00C3). UTF-8 for U+00C3: C3 83
      //                  A9 is Latin-1 char © (U+00A9). UTF-8 for U+00A9: C2 A9  
      // So double-encoded é = C3 83 C2 A9
      // To fix: take the second byte of each pair: 83 -> C3, A9 -> A9? No...
      // 
      // Actually simpler: the original bytes were C3 A9.
      // After double-encoding: C3->C3 83, A9->C2 A9 => C3 83 C2 A9
      // To reverse: C3 83 => original byte C3, C2 A9 => original byte A9
      // So original = 0xC3 0xA9 = C3 A9 = é ✓
      
      const origHigh = (buf[i] << 6 | (buf[i+1] & 0x3F)) & 0xFF; // decode C3 8x -> original byte
      const origLow = buf[i+3]; // C2 xx -> original byte is xx  
      // Actually the decoding is: C3 83 means the original byte was C3 (0xC0 | (0x83 & 0x3F) = 0xC0|0x03 = 0xC3)
      // C2 A9 means original byte was A9 (0x80 | (0xA9 & 0x3F) = 0x80|0x29 = 0xA9)
      // Hmm that's not right either. Let me just use the standard UTF-8 decode:
      // C3 83 decodes to U+00C3 -> Latin-1 byte 0xC3
      // C2 A9 decodes to U+00A9 -> Latin-1 byte 0xA9
      // Original bytes: 0xC3 0xA9 = UTF-8 for é ✓
      
      const byte1 = ((buf[i] & 0x1F) << 6) | (buf[i+1] & 0x3F); // decode first UTF-8 pair to codepoint
      const byte2 = ((buf[i+2] & 0x1F) << 6) | (buf[i+3] & 0x3F); // decode second UTF-8 pair
      result.push(byte1);
      result.push(byte2);
      fixes++;
      i += 4;
      continue;
    }
    
    // Pattern: C3 [80-BF] followed by single byte [20-7F] - this is a double-encoded char 
    // where the second original byte was ASCII (doesn't get C2 prefix)
    // Example: Â (C2 in original) gets double-encoded differently
    
    // Default: keep byte as-is
    result.push(buf[i]);
    i++;
  }
  
  const fixedBuf = Buffer.from(result);
  const fixedStr = fixedBuf.toString('utf8');
  
  const rep = (fixedStr.match(/\ufffd/g) || []).length;
  const moj = (fixedStr.match(/Ã©|Ã¨|Ã |Ã¢|Ã®|Ã´|Ã¹|Ã»|Ã§|Ãª/g) || []).length;
  const accents = (fixedStr.match(/[éèêëàâùûîïôçœ]/g) || []).length;
  const emojis = (fixedStr.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length;
  const dashes = (fixedStr.match(/[—–]/g) || []).length;
  
  const name = path.basename(filePath);
  console.log(`${name}: fixed ${fixes} sequences`);
  console.log(`  rep=${rep} moj=${moj} accents=${accents} emojis=${emojis} dashes=${dashes}`);
  
  if (rep === 0 && moj === 0 && accents > 50) {
    fs.writeFileSync(filePath, fixedStr, 'utf8');
    console.log(`  ✅ WRITTEN\n`);
  } else {
    console.log(`  ❌ ISSUES REMAIN\n`);
    // Write anyway for inspection
    fs.writeFileSync(filePath + '.fixed', fixedStr, 'utf8');
  }
}

// First restore originals from the enriched commit
const { execSync } = require('child_process');
const root = path.join(__dirname, '..');
process.chdir(root);
execSync('git checkout 362bdb1 -- src/data/seoArticles25.ts src/data/seoArticlesRewrite.ts');
console.log('Restored files from commit 362bdb1\n');

fixFile(path.join(root, 'src', 'data', 'seoArticles25.ts'));
fixFile(path.join(root, 'src', 'data', 'seoArticlesRewrite.ts'));
