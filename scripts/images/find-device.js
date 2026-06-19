const fs = require("fs");
const path = require("path");

const CATEGORIES_DIR = path.join(__dirname, "../../data/categories");

/**
 * Finds a device by slug across all data/categories/*.json files.
 * Returns { device, file, index } or null.
 */
function findDeviceBySlug(slug) {
  const files = fs.readdirSync(CATEGORIES_DIR).filter((f) => f.endsWith(".json"));

  for (const file of files) {
    const fullPath = path.join(CATEGORIES_DIR, file);
    const devices = JSON.parse(fs.readFileSync(fullPath, "utf8"));
    const index = devices.findIndex((d) => d.slug === slug);
    if (index !== -1) {
      return { device: devices[index], file: fullPath, index, allDevices: devices };
    }
  }
  return null;
}

/** Returns every device across all data/categories/*.json files, flattened. */
function getAllDevices() {
  const files = fs.readdirSync(CATEGORIES_DIR).filter((f) => f.endsWith(".json"));
  let all = [];
  for (const file of files) {
    const devices = JSON.parse(fs.readFileSync(path.join(CATEGORIES_DIR, file), "utf8"));
    all = all.concat(devices);
  }
  return all;
}

module.exports = { findDeviceBySlug, getAllDevices, CATEGORIES_DIR };
