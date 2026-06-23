/**
 * Core logic for sourcing a device hero image from manufacturer storefronts
 * (with a Grover marketplace fallback) and compositing it onto the shared
 * device background. Used by both the single-device CLI (fetch-device-image.js)
 * and the batch runner (fetch-missing-images.js).
 *
 * NOTE: sourced images are copyrighted product photography, NOT freely licensed.
 * See image-sources.js for the accepted-risk context; the staged sidecar JSON
 * records sourceSite/licenseNote so this stays visible through promotion.
 */
const fs = require("fs");
const path = require("path");
const { findDeviceBySlug } = require("./find-device");
const { getCategoryFolder } = require("./category-folders");
const { resolveDeviceImage, NoCandidatesError, NoSuitableCandidateError } = require("./image-sources");
const { compositeHero } = require("./composite");

const REVIEW_DIR = path.join(__dirname, "../../img/devices/_review");

// Per-category scale tuning for how large the device sits on the background.
const CATEGORY_SCALE = {
  "3D Printers & Fabrication": 0.62,
  "Gaming Handhelds": 0.6,
  "Action Cameras": 0.5,
  "Cameras": 0.62,
  "Drones": 0.6,
  "Dash Cams": 0.5,
  "Computing & Tablets": 0.62,
  "Audio & Hi-Fi": 0.5,
  "Music Production": 0.55,
  "Smartphones": 0.66,
  "Security Cameras": 0.5,
};

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

  const resolved = await resolveDeviceImage(device, { query: customQuery });

  fs.mkdirSync(REVIEW_DIR, { recursive: true });
  const outImagePath = path.join(REVIEW_DIR, `${slug}.webp`);
  const scale = CATEGORY_SCALE[device.category] || 0.6;
  const composed = await compositeHero(resolved.buffer, outImagePath, { scale });

  const metadata = {
    slug,
    deviceName: device.name,
    category: device.category,
    sourceSite: resolved.meta.sourceSite,
    sourceType: resolved.meta.sourceType,
    productTitle: resolved.meta.productTitle,
    productUrl: resolved.meta.productUrl,
    sourceImageUrl: resolved.meta.sourceImageUrl,
    licenseNote: resolved.meta.licenseNote,
    cutoutRemovedFraction: Number(composed.removedFraction.toFixed(3)),
    cutoutSane: composed.cutoutSane,
    fetchedAt: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(REVIEW_DIR, `${slug}.json`), JSON.stringify(metadata, null, 2));

  return { outImagePath, metadata, cutoutSane: composed.cutoutSane };
}

module.exports = { fetchDeviceImage, NoCandidatesError, NoSuitableCandidateError, REVIEW_DIR };
