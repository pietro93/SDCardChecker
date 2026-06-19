/**
 * Core logic for sourcing a device hero image from Wikimedia Commons and
 * compositing it onto img/devices/background.webp. Used by both the
 * single-device CLI (fetch-device-image.js) and the batch runner
 * (fetch-missing-images.js).
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { findDeviceBySlug } = require("./find-device");
const { getCategoryFolder } = require("./category-folders");

const REVIEW_DIR = path.join(__dirname, "../../img/devices/_review");
const BACKGROUND_PATH = path.join(__dirname, "../../img/devices/background.webp");
const COMMONS_API = "https://commons.wikimedia.org/w/api.php";

// Extra search hints per category to bias results toward actual product photos.
const SEARCH_HINTS = {
  "Gaming Handhelds": "handheld console",
  "Action Cameras": "camera",
  "Cameras": "camera",
  "Drones": "drone quadcopter",
  "Dash Cams": "dash cam",
  "Computing & Tablets": "device",
  "Audio & Hi-Fi": "device",
  "Smartphones": "smartphone",
  "Security Cameras": "camera",
};

const BAD_TITLE_WORDS = ["logo", "icon", "diagram", "flag", "map", "screenshot", "chart", "comparison", "infographic", "advertisement"];
const GOOD_EXTENSIONS = [".jpg", ".jpeg", ".png"];

class NoCandidatesError extends Error {}
class NoSuitableCandidateError extends Error {}

async function commonsSearch(query) {
  const url = `${COMMONS_API}?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=15&format=json`;
  const res = await fetch(url, { headers: { "User-Agent": "SDCardChecker-ImageFetcher/1.0" } });
  if (!res.ok) throw new Error(`Commons search failed: ${res.status}`);
  const data = await res.json();
  return (data.query && data.query.search) || [];
}

async function commonsImageInfo(titles) {
  const url = `${COMMONS_API}?action=query&titles=${encodeURIComponent(titles.join("|"))}&prop=imageinfo&iiprop=url|size|mime|extmetadata&format=json`;
  const res = await fetch(url, { headers: { "User-Agent": "SDCardChecker-ImageFetcher/1.0" } });
  if (!res.ok) throw new Error(`Commons imageinfo failed: ${res.status}`);
  const data = await res.json();
  return Object.values((data.query && data.query.pages) || {});
}

function pickBestCandidate(pages) {
  for (const page of pages) {
    const info = page.imageinfo && page.imageinfo[0];
    if (!info) continue;
    if (!info.mime || !info.mime.startsWith("image/")) continue;
    if (info.mime === "image/svg+xml") continue;
    if ((info.width || 0) < 500 || (info.height || 0) < 400) continue;
    return { title: page.title, info };
  }
  return null;
}

/** Converts near-white pixels to transparent (basic chroma key for studio product shots). */
async function cutoutOnWhite(buffer) {
  const image = sharp(buffer).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const threshold = 235;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (r >= threshold && g >= threshold && b >= threshold) {
      data[i + 3] = 0;
    }
  }

  return sharp(data, { raw: { width, height, channels } })
    .png()
    .trim({ threshold: 10 })
    .toBuffer();
}

async function compositeOntoBackground(cutoutBuffer, outPath) {
  const bgMeta = await sharp(BACKGROUND_PATH).metadata();

  const targetHeight = Math.round(bgMeta.height * 0.72);
  const targetWidth = Math.round(bgMeta.width * 0.85);
  const resizedCutout = await sharp(cutoutBuffer)
    .resize({ width: targetWidth, height: targetHeight, fit: "inside", withoutEnlargement: false })
    .toBuffer();
  const cutoutMeta = await sharp(resizedCutout).metadata();

  const left = Math.round((bgMeta.width - cutoutMeta.width) / 2);
  const top = Math.round((bgMeta.height - cutoutMeta.height) / 2);

  await sharp(BACKGROUND_PATH)
    .composite([{ input: resizedCutout, left, top }])
    .webp({ quality: 90 })
    .toFile(outPath);
}

/**
 * Fetches + composites a hero image for the given device slug, staging the
 * result in img/devices/_review/. Throws NoCandidatesError / NoSuitableCandidateError
 * on recoverable "no photo found" outcomes so batch callers can distinguish
 * those from real errors (network, bad category mapping, etc).
 */
async function fetchDeviceImage(slug, { query: customQuery } = {}) {
  const found = findDeviceBySlug(slug);
  if (!found) throw new Error(`No device with slug "${slug}" found in data/categories/*.json`);
  const { device } = found;
  getCategoryFolder(device.category); // throws early if category isn't mapped yet

  const query = customQuery || `${device.name} ${SEARCH_HINTS[device.category] || ""}`.trim();

  const searchResults = await commonsSearch(query);
  const candidates = searchResults
    .map((r) => r.title)
    .filter((title) => GOOD_EXTENSIONS.some((ext) => title.toLowerCase().endsWith(ext)))
    .filter((title) => !BAD_TITLE_WORDS.some((word) => title.toLowerCase().includes(word)));

  if (candidates.length === 0) {
    throw new NoCandidatesError(`No usable image candidates found on Commons for query "${query}"`);
  }

  const pages = await commonsImageInfo(candidates.slice(0, 10));
  const best = pickBestCandidate(pages);
  if (!best) {
    throw new NoSuitableCandidateError(`Candidates found but none met size/mime requirements for query "${query}"`);
  }

  const imageRes = await fetch(best.info.url, { headers: { "User-Agent": "SDCardChecker-ImageFetcher/1.0" } });
  if (!imageRes.ok) throw new Error(`Failed to download image: ${imageRes.status}`);
  const sourceBuffer = Buffer.from(await imageRes.arrayBuffer());

  const cutout = await cutoutOnWhite(sourceBuffer);

  fs.mkdirSync(REVIEW_DIR, { recursive: true });
  const outImagePath = path.join(REVIEW_DIR, `${slug}.webp`);
  await compositeOntoBackground(cutout, outImagePath);

  const extmeta = best.info.extmetadata || {};
  const metadata = {
    slug,
    deviceName: device.name,
    category: device.category,
    searchQuery: query,
    sourceTitle: best.title,
    sourcePageUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(best.title.replace(/ /g, "_"))}`,
    sourceImageUrl: best.info.url,
    license: extmeta.LicenseShortName ? extmeta.LicenseShortName.value : "Unknown",
    artist: extmeta.Artist ? extmeta.Artist.value.replace(/<[^>]*>/g, "") : "Unknown",
    credit: extmeta.Credit ? extmeta.Credit.value.replace(/<[^>]*>/g, "") : null,
    fetchedAt: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(REVIEW_DIR, `${slug}.json`), JSON.stringify(metadata, null, 2));

  return { outImagePath, metadata, candidateInfo: best.info, title: best.title };
}

module.exports = { fetchDeviceImage, NoCandidatesError, NoSuitableCandidateError, REVIEW_DIR };
