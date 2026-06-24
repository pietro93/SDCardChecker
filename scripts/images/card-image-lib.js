/**
 * Shared helpers for fetching/storing SD card thumbnail images, used by both
 * the nav-card prototype and the generalized single-card / batch scripts.
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SDCARDS_PATH = path.join(__dirname, "../../data/sdcards.json");
const CARDS_IMG_DIR = path.join(__dirname, "../../img/cards");
const THUMB_SIZE = 600;

function loadCards() {
  const fileText = fs.readFileSync(SDCARDS_PATH, "utf8");
  const raw = JSON.parse(fileText);
  const cards = Array.isArray(raw) ? raw : raw.sdcards;
  return { fileText, cards };
}

function extractAsin(affiliateUrl) {
  const match = affiliateUrl && affiliateUrl.match(/\/dp\/([A-Z0-9]{10})/);
  return match ? match[1] : null;
}

async function downloadImage(url) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function saveThumbnail(buffer, cardId) {
  fs.mkdirSync(CARDS_IMG_DIR, { recursive: true });
  const outPath = path.join(CARDS_IMG_DIR, `${cardId}.webp`);
  await sharp(buffer)
    .resize(THUMB_SIZE, THUMB_SIZE, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .webp({ quality: 90 })
    .toFile(outPath);
  return outPath;
}

/**
 * Insert/replace imageUrl + imageSourceUrl right after a card's "tier" field,
 * editing the raw text in place so the rest of the file's formatting is
 * untouched — a JSON.parse + stringify round-trip would reformat the whole
 * file's whitespace.
 */
function setImageFields(fileText, cardId, imageUrl, imageSourceUrl) {
  const idIndex = fileText.indexOf(`"id": "${cardId}"`);
  if (idIndex === -1) return fileText;

  const nextCardIndex = fileText.indexOf(`"id": "`, idIndex + 1);
  const cardEnd = nextCardIndex === -1 ? fileText.length : nextCardIndex;
  let cardText = fileText.slice(idIndex, cardEnd);

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

const STOPWORDS = new Set([
  "the", "a", "an", "for", "with", "and", "or", "card", "sd", "microsd",
  "micro", "memory", "uhs-i", "uhs-ii", "uhs", "series",
]);

/**
 * Lightweight relevance check for a keyword-search result: does the listing
 * title contain the card's brand plus at least one distinguishing model
 * token? SD card listings are far less ambiguous than device listings, so
 * this skips the full salient-token matcher used by the device pipeline.
 */
function isRelevantMatch(title, cardName) {
  if (!title) return false;
  const titleLower = title.toLowerCase();
  const tokens = cardName
    .toLowerCase()
    .split(/[\s,()/]+/)
    .filter(t => t.length > 1 && !STOPWORDS.has(t));

  if (tokens.length === 0) return false;

  const brandToken = tokens[0];
  const modelTokens = tokens.slice(1).filter(t => /\d/.test(t));

  if (!titleLower.includes(brandToken)) return false;
  if (modelTokens.length === 0) return true;
  return modelTokens.some(t => titleLower.includes(t));
}

module.exports = {
  SDCARDS_PATH,
  CARDS_IMG_DIR,
  THUMB_SIZE,
  loadCards,
  extractAsin,
  downloadImage,
  saveThumbnail,
  setImageFields,
  isRelevantMatch,
};
