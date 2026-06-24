/**
 * One-off verification helper: samples corner/edge pixels of a PNG/WEBP to
 * confirm the background is actually transparent (alpha ~0) or near-white
 * (avg RGB > 245), rather than trusting visual judgment.
 *
 * Usage: node scripts/images/verify-bg.js <imagePath>
 */
const sharp = require("sharp");

async function main() {
  const imagePath = process.argv[2];
  if (!imagePath) {
    console.error("Usage: node scripts/images/verify-bg.js <imagePath>");
    process.exit(1);
  }

  const img = sharp(imagePath);
  const meta = await img.metadata();
  console.log(`Image: ${imagePath}`);
  console.log(`Size: ${meta.width}x${meta.height}, channels=${meta.channels}, hasAlpha=${meta.hasAlpha}`);

  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  function pixelAt(x, y) {
    const idx = (y * width + x) * channels;
    return {
      r: data[idx],
      g: data[idx + 1],
      b: data[idx + 2],
      a: channels >= 4 ? data[idx + 3] : 255,
    };
  }

  const margin = 5;
  const points = [
    ["top-left", margin, margin],
    ["top-right", width - 1 - margin, margin],
    ["bottom-left", margin, height - 1 - margin],
    ["bottom-right", width - 1 - margin, height - 1 - margin],
    ["top-mid", Math.floor(width / 2), margin],
    ["bottom-mid", Math.floor(width / 2), height - 1 - margin],
    ["left-mid", margin, Math.floor(height / 2)],
    ["right-mid", width - 1 - margin, Math.floor(height / 2)],
  ];

  let allTransparent = true;
  let allWhite = true;
  for (const [label, x, y] of points) {
    const p = pixelAt(x, y);
    const avgRgb = (p.r + p.g + p.b) / 3;
    const isTransparent = p.a < 10;
    const isWhite = avgRgb > 245 && p.a > 245;
    if (!isTransparent) allTransparent = false;
    if (!isWhite) allWhite = false;
    console.log(`${label.padEnd(12)} (${x},${y}): rgba(${p.r},${p.g},${p.b},${p.a}) avgRGB=${avgRgb.toFixed(1)} transparent=${isTransparent} white=${isWhite}`);
  }

  console.log("");
  console.log(`Result: allCornersTransparent=${allTransparent}  allCornersNearWhite=${allWhite}`);
  if (allTransparent || allWhite) {
    console.log("PASS: background looks clean (transparent or near-white).");
    process.exit(0);
  } else {
    console.log("FAIL: background is NOT clearly transparent or near-white. Do not use this image.");
    process.exit(2);
  }
}

main().catch((e) => { console.error(e.message || e); process.exit(1); });
