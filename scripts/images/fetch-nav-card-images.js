/**
 * Fetch the real product photo for each navigation SD card (cars feature) from
 * its own Amazon listing via PAAPI GetItems — these are flat product shots
 * (not composited onto the device hero background), saved straight to
 * img/cards/<id>.webp, sized to match the existing card-thumbnail set.
 *
 * Usage: node scripts/images/fetch-nav-card-images.js
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { getItemsByAsin } = require("../../src/utils/amazon-api");

const SDCARDS_PATH = path.join(__dirname, "../../data/sdcards.json");
const CARDS_IMG_DIR = path.join(__dirname, "../../img/cards");
const THUMB_SIZE = 600;

function extractAsin(affiliateUrl) {
  const match = affiliateUrl && affiliateUrl.match(/\/dp\/([A-Z0-9]{10})/);
  return match ? match[1] : null;
}

async function downloadImage(url) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

function setImageFields(fileText, cardId, imageUrl, imageSourceUrl) {
  // Insert/replace imageUrl + imageSourceUrl right after the card's "tier" field
  // (every nav card ends with "tier"), editing the raw text in place so the rest
  // of the file's formatting is untouched — a JSON.parse + stringify round-trip
  // would reformat the whole file's whitespace.
  const idIndex = fileText.indexOf(`"id": "${cardId}"`);
  if (idIndex === -1) return fileText;

  const nextCardIndex = fileText.indexOf(`"id": "`, idIndex + 1);
  const cardEnd = nextCardIndex === -1 ? fileText.length : nextCardIndex;
  let cardText = fileText.slice(idIndex, cardEnd);

  // Strip any previously-set fields for this card before re-inserting.
  cardText = cardText
    .replace(/\n\s*"imageUrl":\s*"[^"]*",?/, "")
    .replace(/\n\s*"imageSourceUrl":\s*"[^"]*",?/, "");

  const tierLineRe = /(\n(\s*)"tier":\s*"[^"]*")(,?)(\n)/;
  const m = cardText.match(tierLineRe);
  if (!m) return fileText;
  const indent = m[2];
  const replacement = `${m[1]},\n${indent}"imageUrl": "${imageUrl}",\n${indent}"imageSourceUrl": "${imageSourceUrl}"${m[4]}`;
  cardText = cardText.replace(tierLineRe, replacement);

  return fileText.slice(0, idIndex) + cardText + fileText.slice(cardEnd);
}

async function main() {
  const fileText = fs.readFileSync(SDCARDS_PATH, "utf8");
  const raw = JSON.parse(fileText);
  const allCards = Array.isArray(raw) ? raw : raw.sdcards;

  const navCards = allCards.filter(c => c.navCardProduct && c.affiliateUrl);
  const asinToCard = {};
  navCards.forEach(card => {
    const asin = extractAsin(card.affiliateUrl);
    if (asin) asinToCard[asin] = card;
    else console.warn(`  Could not extract ASIN for ${card.id}`);
  });

  const asins = Object.keys(asinToCard);
  if (asins.length === 0) {
    console.log("No navigation cards with a resolvable ASIN found.");
    return;
  }

  console.log(`Looking up ${asins.length} navigation SD card listings on Amazon...`);
  const items = await getItemsByAsin(asins);

  fs.mkdirSync(CARDS_IMG_DIR, { recursive: true });

  let updatedText = fileText;
  let updated = 0;
  for (const asin of asins) {
    const card = asinToCard[asin];
    const item = items[asin];
    if (!item || !item.image) {
      console.warn(`  No image returned for ${card.id} (ASIN ${asin}) — leaving existing fallback in place`);
      continue;
    }

    try {
      const buffer = await downloadImage(item.image);
      const outPath = path.join(CARDS_IMG_DIR, `${card.id}.webp`);
      await sharp(buffer)
        .resize(THUMB_SIZE, THUMB_SIZE, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .webp({ quality: 90 })
        .toFile(outPath);

      const imageUrl = `/img/cards/${card.id}.webp`;
      updatedText = setImageFields(updatedText, card.id, imageUrl, item.image);
      console.log(`  ✓ ${card.id} -> img/cards/${card.id}.webp`);
      updated++;
    } catch (e) {
      console.warn(`  Failed to fetch/convert image for ${card.id}: ${e.message}`);
    }
  }

  if (updated > 0) {
    fs.writeFileSync(SDCARDS_PATH, updatedText);
    console.log(`\n✓ Updated ${updated} card(s) with real product images in data/sdcards.json`);
  } else {
    console.log("\nNo images were fetched.");
  }
}

main().catch(e => { console.error(e); process.exit(1); });
