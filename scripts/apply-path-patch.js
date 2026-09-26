#!/usr/bin/env node
// Sets string values in any JSON file by dotted path (the paths lint-copy.js prints).
// Usage: node scripts/apply-path-patch.js data/cars-navigation.json patch.json
// patch.json: { "0.faqs.0.answer": "new text", "sdCardReaders.2.whyChooseThis": "..." }
const fs = require('fs');
const [file, patchFile] = process.argv.slice(2);
const raw = fs.readFileSync(file, 'utf8');
const data = JSON.parse(raw);
const patch = JSON.parse(fs.readFileSync(patchFile, 'utf8'));
for (const [p, value] of Object.entries(patch)) {
  const keys = p.split('.');
  let node = data;
  for (const k of keys.slice(0, -1)) {
    if (node[k] === undefined) throw new Error(`Path not found: ${p}`);
    node = node[k];
  }
  const last = keys[keys.length - 1];
  if (typeof node[last] !== 'string') throw new Error(`Not a string at ${p}`);
  node[last] = value;
}
const eol = raw.includes('\r\n') ? '\r\n' : '\n';
fs.writeFileSync(file, JSON.stringify(data, null, 2).replace(/\n/g, eol) + eol);
console.log(`${Object.keys(patch).length} values set in ${file}`);
