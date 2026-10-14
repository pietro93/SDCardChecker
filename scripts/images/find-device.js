const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../../data");
const CATEGORIES_DIR = path.join(DATA_DIR, "categories");
// Locale-only devices (e.g. data/categories-ja/) are searched after the English
// files so the image pipeline can stage/promote hero images for them too.
const LOCALE_CATEGORY_DIRS = ["categories-ja", "categories-de", "categories-fr", "categories-it"]
  .map((d) => path.join(DATA_DIR, d))
  .filter((d) => fs.existsSync(d));

let slugRegistry = null;
/** Maps any raw category value (EN label, slug, or translated label) to its English label. */
function toEnglishCategoryLabel(rawCategory) {
  if (!slugRegistry) {
    slugRegistry = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "category-slugs.json"), "utf8"));
  }
  for (const [key, entry] of Object.entries(slugRegistry)) {
    if (key.startsWith("_") || !entry || !Array.isArray(entry.matchValues)) continue;
    if (entry.matchValues.includes(rawCategory)) return entry.label.en;
  }
  return rawCategory;
}

function searchDir(dir, slug) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const devices = JSON.parse(fs.readFileSync(fullPath, "utf8"));
    if (!Array.isArray(devices)) continue;
    const index = devices.findIndex((d) => d.slug === slug);
    if (index !== -1) {
      const device = devices[index];
      return {
        device,
        file: fullPath,
        index,
        allDevices: devices,
        // English category label for CATEGORY_FOLDERS / CATEGORY_SCALE lookups.
        // The device's own `category` is left untouched so promote writes it back verbatim.
        imageCategory: toEnglishCategoryLabel(device.category),
      };
    }
  }
  return null;
}

/**
 * Finds a device by slug across data/categories/*.json, then the locale
 * category dirs. Returns { device, file, index, allDevices, imageCategory } or null.
 */
function findDeviceBySlug(slug) {
  for (const dir of [CATEGORIES_DIR, ...LOCALE_CATEGORY_DIRS]) {
    const found = searchDir(dir, slug);
    if (found) return found;
  }
  return null;
}

/** Returns every device across all data/categories/*.json files, flattened (English only). */
function getAllDevices() {
  const files = fs.readdirSync(CATEGORIES_DIR).filter((f) => f.endsWith(".json"));
  let all = [];
  for (const file of files) {
    const devices = JSON.parse(fs.readFileSync(path.join(CATEGORIES_DIR, file), "utf8"));
    all = all.concat(devices);
  }
  return all;
}

module.exports = { findDeviceBySlug, getAllDevices, toEnglishCategoryLabel, CATEGORIES_DIR };
