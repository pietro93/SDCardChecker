/**
 * Fetch a real product photo for one SD card (any card, not just nav cards)
 * and save it to img/cards/<id>.webp, updating imageUrl/imageSourceUrl in
 * data/sdcards.json. Resolves the source image via:
 *   1. affiliateUrl -> ASIN -> PAAPI GetItems (exact match)
 *   2. keyword search on the card's name -> top result that plausibly
 *      matches the card's brand/model
 * Reports "needs a manual image" rather than guessing if neither resolves.
 *
 * Usage: node scripts/images/fetch-card-image.js <card-id>
 */
const fs = require("fs");
const { getItemsByAsin, searchSDCards } = require("../../src/utils/amazon-api");
const {
  SDCARDS_PATH,
  loadCards,
  extractAsin,
  downloadImage,
  saveThumbnail,
  setImageFields,
  isRelevantMatch,
} = require("./card-image-lib");

async function resolveSourceImage(card) {
  const asin = extractAsin(card.affiliateUrl);
  if (asin) {
    const items = await getItemsByAsin([asin]);
    const item = items[asin];
    if (item && item.image) {
      return { image: item.image };
    }
    console.warn(`  No image returned from PAAPI for ASIN ${asin}`);
  }

  const results = await searchSDCards(card.name);
  const match = results.find(r => r.image && isRelevantMatch(r.title, card.name));
  if (match) {
    return { image: match.image };
  }

  return null;
}

async function fetchCardImage(cardId) {
  const { fileText, cards } = loadCards();
  const card = cards.find(c => c.id === cardId);
  if (!card) {
    throw new Error(`No card with id "${cardId}" found in data/sdcards.json`);
  }

  console.log(`Resolving image for ${card.id}...`);
  const source = await resolveSourceImage(card);
  if (!source) {
    console.warn(`✗ ${card.id}: no matching Amazon listing found — needs a manual image`);
    return false;
  }

  const buffer = await downloadImage(source.image);
  const outPath = await saveThumbnail(buffer, card.id);

  const imageUrl = `/img/cards/${card.id}.webp`;
  const updatedText = setImageFields(fileText, card.id, imageUrl, source.image);
  fs.writeFileSync(SDCARDS_PATH, updatedText);

  console.log(`✓ ${card.id} -> ${outPath}`);
  return true;
}

async function main() {
  const cardId = process.argv[2];
  if (!cardId) {
    console.error("Usage: node scripts/images/fetch-card-image.js <card-id>");
    process.exit(1);
  }

  const ok = await fetchCardImage(cardId);
  process.exitCode = ok ? 0 : 1;
}

if (require.main === module) {
  main().catch(e => { console.error(e); process.exit(1); });
}

module.exports = { fetchCardImage };
