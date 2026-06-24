/**
 * Sources a product photo for a device from its manufacturer storefront (or the
 * Grover marketplace as a fallback), composites it onto the shared device
 * background, and stages the result for review (does NOT publish or touch
 * device JSON). Sourced images are copyrighted product photography, NOT freely
 * licensed — see image-sources.js.
 *
 * Usage:
 *   node scripts/images/fetch-device-image.js <slug> [--query "custom search terms"]
 *
 * After reviewing img/devices/_review/<slug>.webp, run:
 *   node scripts/images/promote-device-image.js <slug>
 */
const { fetchDeviceImage } = require("./fetch-core");

async function main() {
  const args = process.argv.slice(2);
  const slug = args[0];
  if (!slug) {
    console.error('Usage: node scripts/images/fetch-device-image.js <slug> [--query "terms"]');
    process.exit(1);
  }

  const queryFlagIndex = args.indexOf("--query");
  const customQuery = queryFlagIndex !== -1 ? args[queryFlagIndex + 1] : null;

  console.log(`Fetching hero image for "${slug}"...`);
  const { metadata } = await fetchDeviceImage(slug, { query: customQuery });

  console.log(`Source: ${metadata.sourceSite} (${metadata.sourceType})`);
  console.log(`Matched: ${metadata.productTitle}`);
  console.log(`\nStaged: img/devices/_review/${slug}.webp`);
  if (!metadata.cutoutSane) {
    console.log(`\nCutout sanity check failed (removed ${(metadata.cutoutRemovedFraction * 100).toFixed(0)}% of the image).`);
    console.log(`The source may not be a clean studio shot — review carefully before promoting.`);
  }
  console.log(`\n${metadata.licenseNote}`);
  console.log(`\nReview the image, then run:\n  node scripts/images/promote-device-image.js ${slug}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
