/**
 * Audit data/devices.json against data/sdcards.json to find coverage gaps:
 *  - card ids recommended by devices that don't exist in sdcards.json (broken links today)
 *  - duplicate device entries (same id/slug appearing more than once)
 *  - card ids that exist but are never recommended by any device (likely orphaned/legacy)
 *  - per-category recommendation density (how many distinct cards cover how many devices)
 *
 * Usage: node scripts/audit-card-coverage.js
 */
const fs = require("fs");
const path = require("path");

const DEVICES_PATH = path.join(__dirname, "../data/devices.json");
const SDCARDS_PATH = path.join(__dirname, "../data/sdcards.json");

function loadArray(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return Array.isArray(data) ? data : data.devices || data.cards || Object.values(data)[0];
}

const devices = loadArray(DEVICES_PATH);
const cards = loadArray(SDCARDS_PATH);
const cardIds = new Set(cards.map((c) => c.id));

// 1. Duplicate device ids/slugs
const seen = new Map();
for (const device of devices) {
  const key = device.id;
  seen.set(key, (seen.get(key) || 0) + 1);
}
const duplicateDeviceIds = [...seen.entries()].filter(([, count]) => count > 1);

// 2. Missing card references (broken recommendations)
const missingRefs = new Map(); // cardId -> [deviceIds]
for (const device of devices) {
  for (const rec of device.recommendedBrands || []) {
    if (!cardIds.has(rec.id)) {
      if (!missingRefs.has(rec.id)) missingRefs.set(rec.id, []);
      missingRefs.get(rec.id).push(device.id);
    }
  }
}

// 3. Orphaned cards (never recommended by any device)
const referencedCardIds = new Set();
for (const device of devices) {
  for (const rec of device.recommendedBrands || []) referencedCardIds.add(rec.id);
}
const orphanedCards = cards.filter((c) => !referencedCardIds.has(c.id));

// 4. Per-category recommendation density
const byCategory = new Map(); // category -> { deviceCount, cardIds: Set }
for (const device of devices) {
  const cat = device.category || "Uncategorized";
  if (!byCategory.has(cat)) byCategory.set(cat, { deviceCount: 0, cardIds: new Set() });
  const entry = byCategory.get(cat);
  entry.deviceCount += 1;
  for (const rec of device.recommendedBrands || []) entry.cardIds.add(rec.id);
}

console.log("=== Duplicate device ids ===");
if (duplicateDeviceIds.length === 0) console.log("none");
else duplicateDeviceIds.forEach(([id, count]) => console.log(`${id}: appears ${count} times`));

console.log("\n=== Broken card references (recommended by a device, missing from sdcards.json) ===");
if (missingRefs.size === 0) console.log("none");
else for (const [cardId, deviceIds] of missingRefs) console.log(`${cardId}: referenced by ${deviceIds.join(", ")}`);

console.log(`\n=== Orphaned cards (in sdcards.json, never recommended) — ${orphanedCards.length} ===`);
orphanedCards.forEach((c) => console.log(`${c.id} (${c.name})`));

console.log("\n=== Recommendation density by category (devices : distinct cards) ===");
const rows = [...byCategory.entries()]
  .map(([cat, { deviceCount, cardIds }]) => ({ cat, deviceCount, distinctCards: cardIds.size, ratio: deviceCount / cardIds.size }))
  .sort((a, b) => b.ratio - a.ratio);
for (const row of rows) {
  console.log(`${row.cat}: ${row.deviceCount} devices -> ${row.distinctCards} distinct cards (${row.ratio.toFixed(1)}x)`);
}
