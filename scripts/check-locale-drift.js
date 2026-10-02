#!/usr/bin/env node
/**
 * Locale drift check: compares language-neutral spec tokens in each locale
 * device's sdCard (type, minSpeed, maxCapacity) against the English device
 * with the same id. Values are partly translated, so only tokens such as
 * 512GB, V30, U3, A2, UHS-II, microSD and N/A are compared.
 *
 * Usage: node scripts/check-locale-drift.js [de|fr|it|ja]   (npm run check:locale-drift)
 * Exits 1 if any drift isn't in scripts/check-locale-drift.allow.json.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LOCALES = ['de', 'fr', 'it', 'ja'];
const FIELDS = ['type', 'minSpeed', 'maxCapacity'];

const readJson = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8').replace(/^﻿/, ''));
const ALLOW_PATH = path.join(__dirname, 'check-locale-drift.allow.json');
const allow = fs.existsSync(ALLOW_PATH) ? JSON.parse(fs.readFileSync(ALLOW_PATH, 'utf8')) : [];

function loadLocale(dir) {
  const devices = [];
  for (const file of fs.readdirSync(path.join(ROOT, 'data', dir)).filter((f) => f.endsWith('.json'))) {
    const data = readJson(`data/${dir}/${file}`);
    const list = Array.isArray(data) ? data : data.devices || [];
    list.forEach((d) => devices.push({ ...d, _file: `data/${dir}/${file}` }));
  }
  return devices;
}

/** Language-neutral tokens in a spec string, as a sorted, de-duplicated list. */
function tokens(value) {
  const s = String(value || '');
  const out = new Set();
  // Decimal commas ("1,5TB") and French units ("1 To", "512 Go") mean the same as "1.5TB", "1TB", "512GB".
  const UNIT = { GB: 'GB', TB: 'TB', GO: 'GB', TO: 'TB' };
  for (const m of s.matchAll(/(\d+(?:[.,]\d+)?)\s*(GB|TB|Go|To)\b/gi)) out.add(`${m[1].replace(',', '.')}${UNIT[m[2].toUpperCase()]}`);
  for (const m of s.matchAll(/\b(V(?:10|30|60|90)|U[13]|A[12]|VPG[\s-]?\d+)\b/gi)) out.add(m[1].toUpperCase().replace(/[\s-]/g, ''));
  for (const m of s.matchAll(/\bUHS-?(I{1,3})\b/gi)) out.add(`UHS-${m[1].toUpperCase()}`);
  if (/\bN\/A\b/i.test(s)) out.add('N/A');
  if (/micro\s*sd/i.test(s)) out.add('microSD');
  if (/\bsd(hc|xc)?\b/i.test(s.replace(/micro\s*sd\w*/gi, ''))) out.add('SD');
  if (/cfexpress/i.test(s)) out.add('CFexpress');
  if (/\bxqd\b/i.test(s)) out.add('XQD');
  if (/\bcfast\b/i.test(s)) out.add('CFast');
  if (/express/i.test(s) && /micro\s*sd\s*express/i.test(s)) out.add('microSD-Express');
  return [...out].sort();
}

const en = new Map(loadLocale('categories').map((d) => [d.id, d]));
const only = process.argv[2];
const problems = [];

for (const locale of LOCALES.filter((l) => !only || l === only)) {
  const seen = new Set();
  for (const device of loadLocale(`categories-${locale}`)) {
    // Two entries with one id build to the same URL; the later one silently wins.
    if (seen.has(device.id)) {
      problems.push({ locale, device: device.id, field: 'id', file: device._file, detail: 'duplicate id' });
      continue;
    }
    seen.add(device.id);
    const base = en.get(device.id);
    if (!base) {
      problems.push({ locale, device: device.id, field: 'id', file: device._file, detail: 'id not in English data' });
      continue;
    }
    for (const field of FIELDS) {
      const want = tokens(base.sdCard && base.sdCard[field]);
      const got = tokens(device.sdCard && device.sdCard[field]);
      if (want.join(',') !== got.join(',')) {
        problems.push({
          locale,
          device: device.id,
          field,
          file: device._file,
          detail: `EN "${base.sdCard[field]}" [${want.join(' ')}] vs "${device.sdCard[field]}" [${got.join(' ')}]`,
        });
      }
    }
  }
}

const isAllowed = (p) =>
  allow.some((a) => a.locale === p.locale && a.device === p.device && (!a.field || a.field === p.field));
const open = problems.filter((p) => !isAllowed(p));

for (const locale of LOCALES) {
  const list = open.filter((p) => p.locale === locale);
  if (list.length === 0) continue;
  const devicesFlagged = new Set(list.map((p) => p.device)).size;
  console.log(`\n== ${locale.toUpperCase()}: ${devicesFlagged} devices, ${list.length} fields`);
  for (const p of list) console.log(`  ${p.device.padEnd(32)} ${p.field.padEnd(12)} ${p.detail}`);
}

console.log('\nSummary');
for (const locale of LOCALES) {
  const list = open.filter((p) => p.locale === locale);
  console.log(`  ${locale}: ${new Set(list.map((p) => p.device)).size} devices flagged`);
}
console.log(`  allowlisted: ${problems.length - open.length} fields`);

process.exit(open.length > 0 ? 1 : 0);
