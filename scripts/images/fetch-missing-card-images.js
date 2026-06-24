/**
 * Batch-runs fetch-card-image.js over every SD card whose imageUrl is
 * missing, or (with --backfill) whose imageUrl points at a shared/fallback
 * image rather than its own product photo. Calls are sequential — PAAPI rate
 * limiting is already enforced inside amazon-api.js via delayIfNeeded().
 *
 * Usage:
 *   node scripts/images/fetch-missing-card-images.js
 *   node scripts/images/fetch-missing-card-images.js --backfill
 */
const { loadCards } = require("./card-image-lib");
const { fetchCardImage } = require("./fetch-card-image");

function findCardsToFetch(backfill) {
  const { cards } = loadCards();

  if (!backfill) {
    return cards.filter(c => !c.imageUrl).map(c => c.id);
  }

  const imageUrlCounts = {};
  cards.forEach(c => {
    if (c.imageUrl) imageUrlCounts[c.imageUrl] = (imageUrlCounts[c.imageUrl] || 0) + 1;
  });

  return cards
    .filter(c => !c.imageUrl || imageUrlCounts[c.imageUrl] > 1)
    .map(c => c.id);
}

async function main() {
  const backfill = process.argv.includes("--backfill");
  const ids = findCardsToFetch(backfill);

  if (ids.length === 0) {
    console.log(backfill ? "No shared/missing images found." : "No cards are missing images.");
    return;
  }

  console.log(`${ids.length} card(s) to fetch images for${backfill ? " (backfill mode)" : ""}.\n`);

  const results = { fetched: [], failed: [] };
  for (const id of ids) {
    try {
      const ok = await fetchCardImage(id);
      (ok ? results.fetched : results.failed).push(id);
    } catch (e) {
      console.error(`✗ ${id}: ${e.message}`);
      results.failed.push(id);
    }
  }

  console.log(`\n✓ Fetched ${results.fetched.length} image(s).`);
  if (results.failed.length > 0) {
    console.log(`✗ ${results.failed.length} card(s) need a manual image: ${results.failed.join(", ")}`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
