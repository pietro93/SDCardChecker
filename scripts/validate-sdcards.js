/**
 * Validate data/sdcards.json for structural issues that won't surface as a
 * JS error but break the rendered site or comparison logic.
 *
 * Usage: node scripts/validate-sdcards.js
 */
const fs = require("fs");
const path = require("path");

const SDCARDS_PATH = path.join(__dirname, "../data/sdcards.json");

const VALID_TIERS = new Set(["budget", "recommended", "professional", "specialty"]);
const VALID_PRICE_TIERS = new Set(["Budget", "Mid-Range", "Premium", "Specialty"]);

function checkCard(card, errors) {
  const label = card.id || card.name || "<unknown card>";

  if (!card.id) errors.push(`${label}: missing id`);
  if (card.tier && !VALID_TIERS.has(card.tier)) {
    errors.push(`${card.id}: invalid tier "${card.tier}" (expected one of ${[...VALID_TIERS].join(", ")})`);
  }
  if (card.priceTier && !VALID_PRICE_TIERS.has(card.priceTier)) {
    errors.push(`${card.id}: invalid priceTier "${card.priceTier}" (expected one of ${[...VALID_PRICE_TIERS].join(", ")})`);
  }

  if (card.imageUrl) {
    const relPath = card.imageUrl.replace(/^\//, "");
    const fullPath = path.join(__dirname, "..", relPath);
    if (!fs.existsSync(fullPath)) {
      errors.push(`${card.id}: imageUrl "${card.imageUrl}" does not resolve to an existing file`);
    }
  }

  if (!card.amazonSearchUrl && !card.affiliateUrl) {
    errors.push(`${card.id}: needs at least one of amazonSearchUrl / affiliateUrl`);
  }

  if (card.navCardProduct) {
    if (!card.vehicleBrand) errors.push(`${card.id}: nav card missing vehicleBrand`);
    if (!card.partNumber) errors.push(`${card.id}: nav card missing partNumber`);
    if (!card.specs || !card.specs.cardFormat) errors.push(`${card.id}: nav card missing specs.cardFormat`);
  } else {
    if (!card.type) errors.push(`${card.id}: missing type`);
    if (!card.specs || !card.specs.speedClass) errors.push(`${card.id}: missing specs.speedClass`);
    if (!card.availableCapacities) errors.push(`${card.id}: missing availableCapacities`);
  }
}

function main() {
  const raw = JSON.parse(fs.readFileSync(SDCARDS_PATH, "utf8"));
  const cards = Array.isArray(raw) ? raw : raw.sdcards;

  const errors = [];
  const seenIds = new Map();

  for (const card of cards) {
    checkCard(card, errors);
    if (card.id) {
      if (seenIds.has(card.id)) {
        errors.push(`Duplicate id "${card.id}" (also at index ${seenIds.get(card.id)})`);
      } else {
        seenIds.set(card.id, cards.indexOf(card));
      }
    }
  }

  if (errors.length === 0) {
    console.log(`✓ ${cards.length} cards validated, no issues found.`);
    return;
  }

  console.error(`✗ ${errors.length} issue(s) found across ${cards.length} cards:\n`);
  errors.forEach(e => console.error(`  - ${e}`));
  process.exitCode = 1;
}

main();
