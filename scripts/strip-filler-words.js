#!/usr/bin/env node
// One-off mechanical pass: removes sincerity/hedge filler words from English device copy.
// Usage: node scripts/strip-filler-words.js [--dry]
const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, '../data/categories');
const dry = process.argv.includes('--dry');
const RULES = [
  [/\b(do|does|is|are|can) (I|you|it|they) really\b/gi, '$1 $2'],
  [/ (actually|truly|really|simply|essentially|basically)(?= [a-z])/g, ''],
  [/\b(Actually|Truly|Simply|Essentially|Basically), ([a-z])/g, (m, w, c) => c.toUpperCase()],
];
const SKIP = new Set(['id', 'slug', 'searchTerms', 'imageUrl', 'notes']);
let total = 0;
function fix(node, key) {
  if (typeof node === 'string') {
    if (SKIP.has(key)) return node;
    let s = node;
    for (const [re, rep] of RULES) s = s.replace(re, rep);
    if (s !== node) { total++; if (dry) console.log(`- ${node.slice(0, 140)}\n+ ${s.slice(0, 140)}`); }
    return s;
  }
  if (Array.isArray(node)) return node.map((v) => fix(v, key));
  if (node && typeof node === 'object') {
    for (const k of Object.keys(node)) node[k] = fix(node[k], k);
  }
  return node;
}
for (const f of fs.readdirSync(DIR).filter((f) => f.endsWith('.json'))) {
  const p = path.join(DIR, f);
  const data = fix(JSON.parse(fs.readFileSync(p, 'utf8')));
  if (!dry) fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n');
}
console.log(`${total} strings changed${dry ? ' (dry run)' : ''}`);
