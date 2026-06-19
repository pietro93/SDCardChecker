/**
 * Fetches a CC-licensed/public-domain product photo for a device from
 * Wikimedia Commons, composites it onto img/devices/background.webp, and
 * stages the result for review (does NOT publish or touch device JSON).
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

  console.log(`Search query: "${metadata.searchQuery}"`);
  console.log(`Selected: ${metadata.sourceTitle}`);
  console.log(`\nStaged: img/devices/_review/${slug}.webp`);
  console.log(`Source: ${metadata.sourcePageUrl} (${metadata.license}, ${metadata.artist})`);
  console.log(`\nReview the image, then run:\n  node scripts/images/promote-device-image.js ${slug}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
