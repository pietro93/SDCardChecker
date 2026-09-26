#!/usr/bin/env node
// Prints the English copy for given device slugs, for audit work.
// Usage: node scripts/dump-device-copy.js <slug> [slug...]   (or --category drones.json)
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const en = require(path.join(ROOT, 'data/device-enrichment.json'));
const args = process.argv.slice(2);
const cat = args[0] === '--category' ? args[1] : null;
const SHOWN = ['id', 'name', 'category', 'slug', 'searchTerms', 'imageUrl', 'sdCard', 'whySpecs', 'recommendedBrands', 'faq', 'relatedDevices', 'notes'];
for (const f of fs.readdirSync(path.join(ROOT, 'data/categories')).filter((f) => f.endsWith('.json'))) {
  if (cat && f !== cat) continue;
  for (const d of require(path.join(ROOT, 'data/categories', f))) {
    if (!cat && !args.includes(d.slug)) continue;
    const e = en[`${d.category}:${d.slug}`];
    console.log(`\n### ${d.slug} | ${d.name}`);
    console.log('sdCard:', JSON.stringify(d.sdCard));
    console.log('EXPL:', e && e.explanation);
    console.log('WHY:', d.whySpecs);
    (d.faq || []).forEach((q) => console.log('Q:', q.q, '\nA:', q.a));
    Object.keys(d).filter((k) => !SHOWN.includes(k)).forEach((k) => console.log(`${k}:`, JSON.stringify(d[k]).slice(0, 500)));
  }
}
