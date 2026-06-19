/**
 * Promotes a staged hero image from img/devices/_review/<slug>.webp into
 * its real category folder, sets the device's imageUrl in its
 * data/categories/*.json entry, and logs the image source.
 *
 * Sourced images are copyrighted product photography, NOT freely licensed —
 * the source log records sourceSite/licenseNote so this stays visible.
 *
 * Usage: node scripts/images/promote-device-image.js <slug>
 */
const fs = require("fs");
const path = require("path");
const { findDeviceBySlug } = require("./find-device");
const { getCategoryFolder } = require("./category-folders");

const REVIEW_DIR = path.join(__dirname, "../../img/devices/_review");
const DEVICES_IMG_DIR = path.join(__dirname, "../../img/devices");
const ATTRIBUTIONS_PATH = path.join(__dirname, "../../img/devices/_attributions.json");

function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error("Usage: node scripts/images/promote-device-image.js <slug>");
    process.exit(1);
  }

  const stagedImage = path.join(REVIEW_DIR, `${slug}.webp`);
  const stagedMeta = path.join(REVIEW_DIR, `${slug}.json`);
  if (!fs.existsSync(stagedImage) || !fs.existsSync(stagedMeta)) {
    console.error(`No staged image/metadata found for "${slug}" in img/devices/_review/. Run fetch-device-image.js first.`);
    process.exit(1);
  }

  const found = findDeviceBySlug(slug);
  if (!found) {
    console.error(`No device with slug "${slug}" found in data/categories/*.json`);
    process.exit(1);
  }
  const { device, file, index, allDevices } = found;
  const folder = getCategoryFolder(device.category);

  const destDir = path.join(DEVICES_IMG_DIR, folder);
  fs.mkdirSync(destDir, { recursive: true });
  const destImage = path.join(destDir, `${slug}.webp`);
  fs.renameSync(stagedImage, destImage);

  const imageUrl = `/img/devices/${folder}/${slug}.webp`;
  allDevices[index] = { ...device, imageUrl };
  fs.writeFileSync(file, JSON.stringify(allDevices, null, 2) + "\n");

  const metadata = JSON.parse(fs.readFileSync(stagedMeta, "utf8"));
  const attributions = fs.existsSync(ATTRIBUTIONS_PATH)
    ? JSON.parse(fs.readFileSync(ATTRIBUTIONS_PATH, "utf8"))
    : {};
  attributions[slug] = {
    imageUrl,
    sourceSite: metadata.sourceSite,
    sourceType: metadata.sourceType,
    productTitle: metadata.productTitle,
    productUrl: metadata.productUrl,
    sourceImageUrl: metadata.sourceImageUrl,
    licenseNote: metadata.licenseNote,
    promotedAt: new Date().toISOString(),
  };
  fs.writeFileSync(ATTRIBUTIONS_PATH, JSON.stringify(attributions, null, 2) + "\n");
  fs.unlinkSync(stagedMeta);

  console.log(`Promoted ${slug} -> ${imageUrl}`);
  console.log(`Updated ${path.relative(process.cwd(), file)} (imageUrl field)`);
  console.log(`Logged source in img/devices/_attributions.json (${metadata.sourceSite}, NOT freely licensed)`);
}

main();
