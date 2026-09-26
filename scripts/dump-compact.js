#!/usr/bin/env node
// Compact audit dump for one category file: specs, whySpecs, FAQ (truncated), meta.
// Usage: node scripts/dump-compact.js drones.json [--skip slug,slug]
const path = require('path');
const ROOT = path.join(__dirname, '..');
const en = require(path.join(ROOT, 'data/device-enrichment.json'));
const [file, flag, skipList] = process.argv.slice(2);
const skip = flag === '--skip' ? skipList.split(',') : [];
for (const d of require(path.join(ROOT, 'data/categories', file))) {
  if (skip.includes(d.slug)) continue;
  const s = d.sdCard;
  const e = en[`${d.category}:${d.slug}`];
  console.log(`\n## ${d.slug} | ${d.name} | ${[s.type, s.minSpeed, s.maxCapacity, (s.recommendedCapacity || []).join('/')].join(' | ')}${e ? (e.reviewedAt ? ' | REVIEWED' : '') : ' | NO-EXPL'}`);
  console.log('W: ' + d.whySpecs);
  (d.faq || []).forEach((f) => console.log('Q: ' + f.q + ' => ' + f.a.replace(/<\/?b>/g, '').slice(0, 240)));
  if (d.metaDescription) console.log('M: ' + d.metaDescription);
}
