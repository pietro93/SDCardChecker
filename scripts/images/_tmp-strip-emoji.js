const fs = require('fs');

const files = process.argv.slice(2);

// Matches emoji pictographs, variation selectors, ZWJ, and skin-tone modifiers,
// plus a trailing space if the emoji was followed by one (to avoid double spaces).
const emojiRun = /[\p{Extended_Pictographic}\u{FE0F}\u{200D}\u{1F3FB}-\u{1F3FF}]+ ?/gu;

let changedFiles = [];
for (const file of files) {
  const original = fs.readFileSync(file, 'utf8');
  const stripped = original.replace(emojiRun, '');
  if (stripped !== original) {
    fs.writeFileSync(file, stripped, 'utf8');
    changedFiles.push(file);
  }
}
console.log(JSON.stringify(changedFiles, null, 2));
