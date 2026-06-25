/**
 * Generates composited hero images for SD card spec/review pages, reusing the
 * existing device hero pipeline (img/devices/background.webp +
 * background-overlay.webp) so card pages share the site's visual language
 * instead of new background art.
 *
 * Source photos are the existing 600x600 white-background product thumbnails
 * in img/cards/<id>.webp (see SD_CARD_IMAGE_SCRAPER_HANDOFF.md) — already
 * studio-white shots, so they feed directly into compositeHero()'s chroma-key
 * cutout without any new sourcing/scraping.
 *
 * Usage: node scripts/images/generate-card-heroes.js [cardId ...]
 * With no args, generates for every card with enrichment data (the same gate
 * used by generate-card-pages.js).
 */
const fs = require("fs");
const path = require("path");
const { compositeHero } = require("./composite");

const CARDS_PATH = path.join(__dirname, "../../data/sdcards.json");
const ENRICHMENT_PATH = path.join(__dirname, "../../data/sdcard-enrichment.json");
const CARDS_IMG_DIR = path.join(__dirname, "../../img/cards");
const HERO_DIR = path.join(CARDS_IMG_DIR, "_hero");

async function generateCardHeroes(cardIds) {
  const { sdcards } = JSON.parse(fs.readFileSync(CARDS_PATH, "utf8"));
  const cardMap = Object.fromEntries(sdcards.map((c) => [c.id, c]));

  fs.mkdirSync(HERO_DIR, { recursive: true });

  let generated = 0;
  let skipped = 0;

  for (const id of cardIds) {
    const card = cardMap[id];
    if (!card) {
      console.warn(`  Skipping ${id}: not found in sdcards.json`);
      skipped++;
      continue;
    }

    const sourcePath = path.join(__dirname, "../..", card.imageUrl || `/img/cards/${id}.webp`);
    if (!fs.existsSync(sourcePath)) {
      console.warn(`  Skipping ${id}: no source image at ${card.imageUrl || id + ".webp"}`);
      skipped++;
      continue;
    }

    const outPath = path.join(HERO_DIR, `${id}.webp`);
    const buffer = fs.readFileSync(sourcePath);
    try {
      const { cutoutSane, removedFraction } = await compositeHero(buffer, outPath, { scale: 0.35, widthScale: 0.35 });
      console.log(`  ✓ ${id}${cutoutSane ? "" : "  (cutoutSane warning, removedFraction=" + removedFraction.toFixed(2) + " — review manually)"}`);
      generated++;
    } catch (err) {
      console.warn(`  Failed ${id}: ${err.message}`);
      skipped++;
    }
  }

  console.log(`\nGenerated ${generated} card hero images, skipped ${skipped}.`);
}

if (require.main === module) {
  const argIds = process.argv.slice(2);
  const cardIds = argIds.length > 0
    ? argIds
    : Object.keys(JSON.parse(fs.readFileSync(ENRICHMENT_PATH, "utf8")));

  generateCardHeroes(cardIds).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { generateCardHeroes, HERO_DIR };
