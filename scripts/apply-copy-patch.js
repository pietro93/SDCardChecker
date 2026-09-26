#!/usr/bin/env node
/**
 * apply-copy-patch.js
 * Applies a copy-audit patch file to the English source data.
 *
 * Usage: node scripts/apply-copy-patch.js path/to/patch.json
 *
 * Patch format (keyed by device slug):
 * {
 *   "steam-deck": {
 *     "explanation": "...",             // -> data/device-enrichment.json
 *     "whySpecs": "...",                // -> data/categories/*.json (any top-level field)
 *     "sdCard": { "maxCapacity": "..." },   // shallow-merged
 *     "faq": [ {q,a}, ... ]            // replaces the whole array
 *   }
 * }
 * A field set to null is deleted.
 * Never touches data/devices.json; rebuild that with the merge script.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CAT_DIR = path.join(ROOT, 'data/categories');
const ENRICH = path.join(ROOT, 'data/device-enrichment.json');

const patch = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const enrichment = JSON.parse(fs.readFileSync(ENRICH, 'utf8'));
const remaining = new Set(Object.keys(patch));
const today = new Date().toISOString().slice(0, 10);

for (const file of fs.readdirSync(CAT_DIR).filter((f) => f.endsWith('.json'))) {
  const p = path.join(CAT_DIR, file);
  const raw = fs.readFileSync(p, 'utf8');
  const devices = JSON.parse(raw);
  let changed = false;
  for (const d of devices) {
    const change = patch[d.slug];
    if (!change) continue;
    remaining.delete(d.slug);
    for (const [k, v] of Object.entries(change)) {
      if (k === 'explanation') {
        const key = `${d.category}:${d.slug}`;
        enrichment[key] = { ...(enrichment[key] || { deviceName: d.name, slug: d.slug, category: d.category }), explanation: v, reviewedAt: today };
        continue;
      }
      if (k === 'faq' && Array.isArray(v) && (d.faq || []).length > v.length) {
        console.warn(`${d.slug}: faq patch drops ${d.faq.length - v.length} existing question(s)`);
      }
      if (v === null) delete d[k];
      else if (k === 'sdCard') d.sdCard = { ...d.sdCard, ...v };
      else d[k] = v;
      changed = true;
    }
  }
  if (changed) {
    const eol = raw.includes('\r\n') ? '\r\n' : '\n';
    fs.writeFileSync(p, JSON.stringify(devices, null, 2).replace(/\n/g, eol) + eol);
    console.log(`updated ${file}`);
  }
}

fs.writeFileSync(ENRICH, JSON.stringify(enrichment, null, 2) + '\n');
if (remaining.size) console.warn(`No device found for: ${[...remaining].join(', ')}`);
