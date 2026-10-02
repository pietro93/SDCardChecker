#!/usr/bin/env node
/**
 * Recommendation check: flags device pages that recommend a card the device
 * can't physically take (format) or that falls below the device's own stated
 * minimum (speed). Also checks data/promoted-cards.json placements.
 *
 * Usage: node scripts/check-recommendations.js   (npm run check:recs)
 * Exits 1 if any problem isn't in scripts/check-recommendations.allow.json.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

const devices = readJson('data/devices.json').devices;
const cards = readJson('data/sdcards.json').sdcards;
const promotions = readJson('data/promoted-cards.json').promotedCards || [];
const ALLOW_PATH = path.join(__dirname, 'check-recommendations.allow.json');
const allow = fs.existsSync(ALLOW_PATH) ? JSON.parse(fs.readFileSync(ALLOW_PATH, 'utf8')) : [];

const cardById = new Map(cards.map((c) => [c.id, c]));
const deviceById = new Map(devices.map((d) => [d.id, d]));

// ---------- Format ----------

/** Accepted formats for a device, from its free-text sdCard.type. Empty set = unknown. */
function deviceFormats(typeText) {
  let t = String(typeText || '').toLowerCase();
  // "Full-size SD only (no microSD+adapter)": the negated mention is not a format.
  t = t.replace(/\(no micro\s*sd[^)]*\)/g, '');
  const formats = new Set();
  if (/cfexpress type a/.test(t)) formats.add('cfexpress-a');
  if (/cfexpress type b/.test(t)) formats.add('cfexpress-b');
  if (/\bxqd\b/.test(t)) formats.add('xqd');
  if (/\bcfast\b/.test(t)) formats.add('cfast');
  if (/micro\s*sd|\btf\d?\b/.test(t)) formats.add('microsd');
  if (/micro\s*sd express|microsd express/.test(t)) formats.add('microsd-express');
  // Strip every microSD mention before testing for full-size SD.
  const noMicro = t.replace(/micro\s*sd\w*/g, '');
  if (/\bsd(hc|xc)?\b/.test(noMicro)) formats.add('sd');
  // No slot, card goes in an external reader: any reader-compatible card fits.
  if (formats.size === 0 && /external via .*reader/.test(t)) {
    formats.add('sd');
    formats.add('microsd');
  }
  return formats;
}

/** Format of a card, from its type field (or name for CF/XQD cards). */
function cardFormat(card) {
  const t = `${card.type || ''} ${card.name || ''}`.toLowerCase();
  if (/cfexpress type a/.test(t)) return 'cfexpress-a';
  if (/cfexpress type b|cfexpress/.test(t)) return 'cfexpress-b';
  if (/\bxqd\b/.test(t)) return 'xqd';
  if (/\bcfast\b/.test(t)) return 'cfast';
  if (/^microsd/i.test(card.type || '')) return 'microsd';
  if (/^sd$/i.test(card.type || '')) return 'sd';
  return null;
}

const isExpressCard = (card) => /express/i.test(card.type || '');

// ---------- Speed ----------

const SPEED_RANK = { 'C2-6': 0, C10: 1, U1: 1, V10: 1, U3: 2, V30: 2, V60: 3, V90: 4 };
const SPEED_RE = /\b(V90|V60|V30|V10|U3|U1|C10|Class\s*10|Class\s*[246])\b/i;

function normalizeSpeed(token) {
  const t = token.toUpperCase().replace(/\s+/g, '');
  if (t === 'CLASS10') return 'C10';
  if (/^CLASS[246]$/.test(t)) return 'C2-6';
  return t;
}

/**
 * Device minimum: first speed token before any parenthesis or "recommended".
 * A leading "Class 10" followed by a UHS/video class ("Class 10 / U3 / A1")
 * means the later class: U3 refines Class 10, it isn't an alternative to it.
 */
function deviceMinSpeed(minSpeed) {
  const head = String(minSpeed || '').split('(')[0].split(/recommended/i)[0];
  const tokens = (head.match(new RegExp(SPEED_RE.source, 'gi')) || []).map(normalizeSpeed);
  if (tokens.length === 0) return null;
  if (/^C/.test(tokens[0]) && tokens[1] && !/^C/.test(tokens[1])) return tokens[1];
  return tokens[0];
}

function cardSpeed(card) {
  const m = String((card.specs && card.specs.speedClass) || '').match(SPEED_RE);
  return m ? normalizeSpeed(m[1]) : null;
}

// ---------- Checks ----------

const problems = [];

function checkPair(device, cardId, source) {
  const card = cardById.get(cardId);
  if (!card) {
    problems.push({ kind: 'missing-card', device: device.id, card: cardId, source, detail: 'card id not in sdcards.json' });
    return;
  }
  const typeText = device.sdCard && device.sdCard.type;
  const minSpeed = device.sdCard && device.sdCard.minSpeed;
  if (String(minSpeed).trim() === 'N/A') return; // no slot
  const fmt = cardFormat(card);
  if (fmt === null) return; // Navigation SD and other specialty cards

  const accepted = deviceFormats(typeText);
  if (accepted.size === 0) {
    problems.push({ kind: 'unparsed-format', device: device.id, card: cardId, source, detail: `can't read format from "${typeText}"` });
    return;
  }
  if (!accepted.has(fmt)) {
    problems.push({ kind: 'format', device: device.id, card: cardId, source, detail: `${fmt} card in "${typeText}" device` });
    return;
  }
  if (/express only/i.test(typeText) && !isExpressCard(card)) {
    problems.push({ kind: 'format', device: device.id, card: cardId, source, detail: `non-Express microSD in "${typeText}" device` });
    return;
  }

  if (fmt !== 'sd' && fmt !== 'microsd') return; // VPG-rated formats: speed check skipped
  const devMin = deviceMinSpeed(minSpeed);
  const cSpeed = cardSpeed(card);
  if (!devMin || !cSpeed) return;
  if (SPEED_RANK[cSpeed] < SPEED_RANK[devMin]) {
    problems.push({ kind: 'speed', device: device.id, card: cardId, source, detail: `${cSpeed} card, device minimum ${devMin} ("${minSpeed}")` });
  }
}

for (const device of devices) {
  for (const rec of device.recommendedBrands || []) {
    checkPair(device, rec.id, 'recommendedBrands');
  }
}

for (const promo of promotions) {
  for (const deviceId of promo.appliesTo || []) {
    const device = deviceById.get(deviceId);
    if (!device) {
      problems.push({ kind: 'dead-id', device: deviceId, card: promo.id, source: 'promoted-cards', detail: 'appliesTo id not in devices.json' });
      continue;
    }
    checkPair(device, promo.id, 'promoted-cards');
  }
}

// ---------- Report ----------

const isAllowed = (p) => allow.some((a) => a.device === p.device && a.card === p.card);
const open = problems.filter((p) => !isAllowed(p));
const allowed = problems.length - open.length;

const byCard = new Map();
for (const p of open) {
  if (!byCard.has(p.card)) byCard.set(p.card, []);
  byCard.get(p.card).push(p);
}

for (const [cardId, list] of [...byCard.entries()].sort()) {
  const card = cardById.get(cardId);
  console.log(`\n${cardId}${card ? ` (${card.type}, ${card.specs && card.specs.speedClass}, ${card.priceTier})` : ''}`);
  for (const p of list) {
    const via = p.source === 'promoted-cards' ? ' [promotion]' : '';
    console.log(`  ${p.kind.padEnd(15)} ${p.device}${via}: ${p.detail}`);
  }
}

const count = (k) => open.filter((p) => p.kind === k).length;
console.log('\nSummary');
console.log(`  format problems:   ${count('format')}`);
console.log(`  speed problems:    ${count('speed')}`);
console.log(`  dead ids:          ${count('dead-id')}`);
console.log(`  missing cards:     ${count('missing-card')}`);
console.log(`  unparsed formats:  ${count('unparsed-format')}`);
console.log(`  allowlisted:       ${allowed}`);

process.exit(open.length > 0 ? 1 : 0);
