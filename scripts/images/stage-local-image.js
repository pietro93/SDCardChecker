/**
 * Stage a hero image from a LOCAL source photo (not auto-sourced).
 *
 * Same compositing + review/metadata flow as fetch-core.js, but for devices the
 * automated sourcing pipeline can't reach (no Grover stock, no Shopify storefront
 * — e.g. Sony Alpha bodies, DJI store, raspberrypi.com). You supply a manually
 * obtained, white-studio-background product photo; this composites it onto the
 * shared device background and stages it in img/devices/_review/ for the same
 * manual review + promote-device-image.js step.
 *
 * The source photo is still copyrighted product photography — pass --source-url
 * and --source-site so the staged sidecar JSON keeps provenance, exactly like
 * the auto pipeline does.
 *
 * Usage:
 *   node scripts/images/stage-local-image.js <slug> <localImagePath> \
 *     --source-url <url> --source-site <site> [--source-title "..."]
 */
const fs = require("fs");
const path = require("path");
const { findDeviceBySlug } = require("./find-device");
const { getCategoryFolder } = require("./category-folders");
const { compositeHero } = require("./composite");

const REVIEW_DIR = path.join(__dirname, "../../img/devices/_review");
const CATEGORY_SCALE = {
  "Gaming Handhelds": 0.6,
  "Action Cameras": 0.5,
  "Cameras": 0.62,
  "Drones": 0.6,
  "Dash Cams": 0.5,
  "Computing & Tablets": 0.62,
  "Audio & Hi-Fi": 0.5,
  "Smartphones": 0.66,
  "Security Cameras": 0.5,
};

function getFlag(name, fallback = null) {
  const i = process.argv.indexOf(name);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

async function main() {
  const slug = process.argv[2];
  const localPath = process.argv[3];
  if (!slug || !localPath || localPath.startsWith("--")) {
    console.error("Usage: node scripts/images/stage-local-image.js <slug> <localImagePath> --source-url <url> --source-site <site> [--source-title \"...\"]");
    process.exit(1);
  }
  if (!fs.existsSync(localPath)) throw new Error(`Local image not found: ${localPath}`);

  const found = findDeviceBySlug(slug);
  if (!found) throw new Error(`No device with slug "${slug}" found in data/categories/*.json`);
  const { device } = found;
  getCategoryFolder(device.category);

  const sourceUrl = getFlag("--source-url", "");
  const sourceSite = getFlag("--source-site", "manual");
  const sourceTitle = getFlag("--source-title", device.name);

  fs.mkdirSync(REVIEW_DIR, { recursive: true });
  const outImagePath = path.join(REVIEW_DIR, `${slug}.webp`);
  const scale = CATEGORY_SCALE[device.category] || 0.6;

  const buffer = fs.readFileSync(localPath);
  const composed = await compositeHero(buffer, outImagePath, { scale });

  const metadata = {
    slug,
    deviceName: device.name,
    category: device.category,
    sourceSite,
    sourceType: "manufacturer/manual",
    productTitle: sourceTitle,
    productUrl: sourceUrl,
    sourceImageUrl: sourceUrl,
    licenseNote: "Copyrighted product photography, NOT freely licensed (manually sourced).",
    cutoutRemovedFraction: Number(composed.removedFraction.toFixed(3)),
    cutoutSane: composed.cutoutSane,
    fetchedAt: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(REVIEW_DIR, `${slug}.json`), JSON.stringify(metadata, null, 2));

  console.log(`Staged: img/devices/_review/${slug}.webp`);
  console.log(`  removedFraction=${metadata.cutoutRemovedFraction} cutoutSane=${composed.cutoutSane}`);
  if (!composed.cutoutSane) console.log("  cutout sanity check FAILED — inspect carefully (source may not be a clean studio shot).");
  console.log(`\nReview img/devices/_review/${slug}.webp, then:\n  node scripts/images/promote-device-image.js ${slug}`);
}

main().catch((e) => { console.error(e.message || e); process.exit(1); });
