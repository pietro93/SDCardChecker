/**
 * Composite a hero image for a car/navigation page using the SAME 3-layer
 * pipeline as device heroes (composite.js): img/devices/background.webp +
 * cutout vehicle photo + img/devices/background-overlay.webp.
 *
 * Vehicles are a small, fixed set (14 entries in data/cars-navigation.json),
 * so unlike the device pipeline this writes directly to img/cars/<slug>.webp
 * instead of staging in _review/ for a separate promote step.
 *
 * Source photos should have a transparent or white/studio background and be
 * a 3/4 or side studio shot (matches manufacturer press-kit PNGs). The cutout
 * step works for both transparent-edge PNGs and white-background photos.
 *
 * Usage:
 *   node scripts/images/stage-local-car-image.js <slug> <localImagePath> \
 *     --source-url <url> --source-site <site> [--source-title "..."]
 */
const fs = require("fs");
const path = require("path");
const { compositeHero } = require("./composite");

const CARS_DATA_PATH = path.join(__dirname, "../../data/cars-navigation.json");
const CARS_IMG_DIR = path.join(__dirname, "../../img/cars");
const ATTRIBUTIONS_PATH = path.join(CARS_IMG_DIR, "_attributions.json");

function getFlag(name, fallback = null) {
  const i = process.argv.indexOf(name);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

function loadAttributions() {
  if (!fs.existsSync(ATTRIBUTIONS_PATH)) return {};
  return JSON.parse(fs.readFileSync(ATTRIBUTIONS_PATH, "utf8"));
}

async function main() {
  const slug = process.argv[2];
  const localPath = process.argv[3];
  if (!slug || !localPath || localPath.startsWith("--")) {
    console.error("Usage: node scripts/images/stage-local-car-image.js <slug> <localImagePath> --source-url <url> --source-site <site> [--source-title \"...\"]");
    process.exit(1);
  }
  if (!fs.existsSync(localPath)) throw new Error(`Local image not found: ${localPath}`);

  const vehicles = JSON.parse(fs.readFileSync(CARS_DATA_PATH, "utf8"));
  const vehicle = vehicles.find((v) => v.slug === slug);
  if (!vehicle) throw new Error(`No vehicle with slug "${slug}" found in data/cars-navigation.json`);

  const sourceUrl = getFlag("--source-url", "");
  const sourceSite = getFlag("--source-site", "manual");
  const sourceTitle = getFlag("--source-title", vehicle.carModel);

  fs.mkdirSync(CARS_IMG_DIR, { recursive: true });
  const outImagePath = path.join(CARS_IMG_DIR, `${slug}.webp`);

  // Vehicles are much wider than tall relative to devices, so use a wider
  // width budget (0.82 of background width) and a shorter height budget.
  const buffer = fs.readFileSync(localPath);
  const composed = await compositeHero(buffer, outImagePath, { scale: 0.45, widthScale: 0.82 });

  const attributions = loadAttributions();
  attributions[slug] = {
    imageUrl: `/img/cars/${slug}.webp`,
    sourceSite,
    sourceType: "manufacturer/manual",
    productTitle: sourceTitle,
    productUrl: sourceUrl,
    sourceImageUrl: sourceUrl,
    licenseNote: "Copyrighted manufacturer product photography — NOT freely licensed.",
    cutoutRemovedFraction: Number(composed.removedFraction.toFixed(3)),
    cutoutSane: composed.cutoutSane,
    promotedAt: new Date().toISOString(),
  };
  fs.writeFileSync(ATTRIBUTIONS_PATH, JSON.stringify(attributions, null, 2));

  console.log(`Wrote: img/cars/${slug}.webp`);
  console.log(`  removedFraction=${attributions[slug].cutoutRemovedFraction} cutoutSane=${composed.cutoutSane}`);
  if (!composed.cutoutSane) console.log("  ⚠ cutout sanity check FAILED — inspect carefully (source may not be a clean studio shot).");
}

main().catch((e) => { console.error(e.message || e); process.exit(1); });
