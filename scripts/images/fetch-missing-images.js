/**
 * Finds every device that's currently using a placeholder/fallback image
 * (no dedicated imageUrl set) and tries to fetch+composite a real hero
 * image for each from its manufacturer storefront (Grover marketplace
 * fallback). Results are staged in img/devices/_review/ for manual review —
 * nothing is published or written to device JSON here. Run
 * promote-device-image.js per slug afterward.
 *
 * Sourced images are copyrighted product photography, NOT freely licensed.
 *
 * Usage:
 *   node scripts/images/fetch-missing-images.js [--limit N] [--dry-run]
 */
const { getAllDevices } = require("./find-device");
const { getDeviceImageFallback } = require("../generator/helpers");
const { fetchDeviceImage, NoCandidatesError, NoSuitableCandidateError } = require("./fetch-core");
const { CATEGORY_FOLDERS } = require("./category-folders");

function needsImage(device) {
  const effective = device.imageUrl || getDeviceImageFallback(device);
  return effective.includes("placeholder");
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const args = process.argv.slice(2);
  const limitFlagIndex = args.indexOf("--limit");
  const limit = limitFlagIndex !== -1 ? parseInt(args[limitFlagIndex + 1], 10) : Infinity;
  const dryRun = args.includes("--dry-run");

  const allDevices = getAllDevices();
  const targets = allDevices
    .filter((d) => CATEGORY_FOLDERS[d.category]) // skip categories with no img/devices folder mapped yet
    .filter(needsImage)
    .slice(0, limit);

  console.log(`${targets.length} device(s) currently using a placeholder image.`);
  if (dryRun) {
    targets.forEach((d) => console.log(`  - ${d.slug} (${d.category})`));
    return;
  }

  const results = { staged: [], review: [], noCandidates: [], failed: [] };

  for (const device of targets) {
    process.stdout.write(`Fetching "${device.slug}"... `);
    try {
      const { metadata } = await fetchDeviceImage(device.slug);
      const flag = metadata.cutoutSane ? "OK" : "OK (check cutout)";
      console.log(`${flag} -> ${metadata.productTitle} [${metadata.sourceSite}]`);
      results.staged.push(device.slug);
      if (!metadata.cutoutSane) results.review.push(device.slug);
    } catch (err) {
      if (err instanceof NoCandidatesError || err instanceof NoSuitableCandidateError) {
        console.log("no usable photo found");
        results.noCandidates.push(device.slug);
      } else {
        console.log(`ERROR: ${err.message}`);
        results.failed.push({ slug: device.slug, error: err.message });
      }
    }
    await delay(500); // be polite to the source sites
  }

  console.log("\n--- Summary ---");
  console.log(`Staged for review (${results.staged.length}): ${results.staged.join(", ") || "none"}`);
  if (results.review.length) {
    console.log(`  cutout sanity check failed (review extra carefully): ${results.review.join(", ")}`);
  }
  console.log(`No photo found (${results.noCandidates.length}): ${results.noCandidates.join(", ") || "none"}`);
  if (results.failed.length) {
    console.log(`Errored (${results.failed.length}):`);
    results.failed.forEach((f) => console.log(`  - ${f.slug}: ${f.error}`));
  }
  if (results.staged.length) {
    console.log(`\nReview staged images in img/devices/_review/, then promote each with:`);
    console.log(`  node scripts/images/promote-device-image.js <slug>`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
