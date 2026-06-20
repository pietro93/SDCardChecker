/**
 * Shared 3-layer hero compositing for device images.
 *
 *   img/devices/background.webp          (light blue gradient + circuit art)
 *   -> soft white glow + device cutout   (studio-white background removed)
 *   -> img/devices/background-overlay.webp (ambient glow + circuit overlay)
 *
 * The device photo is chroma-keyed off its white studio background via a border
 * flood-fill (so an interior light/silver body survives, only edge-connected
 * white is removed) and floated on a blurred white glow.
 */
const path = require("path");
const sharp = require("sharp");

const IMG_DIR = path.join(__dirname, "../../img/devices");
const BACKGROUND_PATH = path.join(IMG_DIR, "background.webp");
const OVERLAY_PATH = path.join(IMG_DIR, "background-overlay.webp");

/**
 * Removes the studio-white background by flood-filling inward from the border,
 * so only white that is connected to the edge becomes transparent. Returns a
 * tightly-cropped RGBA PNG buffer plus the fraction of the image that was
 * removed (callers can use this as a sanity signal — see isCutoutSane).
 */
async function cutoutWhiteBackground(buffer, { threshold = 236 } = {}) {
  const { data, info } = await sharp(buffer)
    .flatten({ background: "#ffffff" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const isWhite = (i) => data[i] >= threshold && data[i + 1] >= threshold && data[i + 2] >= threshold;
  const visited = new Uint8Array(width * height);
  const stack = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const p = y * width + x;
    if (!visited[p]) { visited[p] = 1; stack.push(p); }
  };
  for (let x = 0; x < width; x++) { push(x, 0); push(x, height - 1); }
  for (let y = 0; y < height; y++) { push(0, y); push(width - 1, y); }

  let removed = 0;
  while (stack.length) {
    const p = stack.pop();
    if (!isWhite(p * channels)) continue;
    data[p * channels + 3] = 0;
    removed++;
    const x = p % width, y = (p / width) | 0;
    push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
  }

  // Tight bounding box around the surviving (opaque) pixels.
  let minX = width, minY = height, maxX = 0, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * channels + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < minX || maxY < minY) {
    throw new Error("cutout removed the entire image (no opaque pixels left)");
  }

  const full = await sharp(data, { raw: { width, height, channels } }).png().toBuffer();
  const cropped = await sharp(full)
    .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
    .png()
    .toBuffer();

  return { buffer: cropped, removedFraction: removed / (width * height) };
}

/**
 * Cheap sanity check that the cutout kept a plausible device rather than eating
 * a near-white body. If almost nothing or almost everything was removed, the
 * source probably wasn't a clean studio shot — callers should flag for review.
 */
function isCutoutSane(removedFraction) {
  return removedFraction > 0.08 && removedFraction < 0.92;
}

async function compositeHero(deviceBuffer, outPath, { scale = 0.6, widthScale = 0.6, threshold = 236 } = {}) {
  const { width: BW, height: BH } = await sharp(BACKGROUND_PATH).metadata();

  const { buffer: cut, removedFraction } = await cutoutWhiteBackground(deviceBuffer, { threshold });

  const device = await sharp(cut)
    .resize({ width: Math.round(BW * widthScale), height: Math.round(BH * scale), fit: "inside", withoutEnlargement: false })
    .toBuffer();
  const { width: w, height: h } = await sharp(device).metadata();
  const left = Math.round((BW - w) / 2);
  const top = Math.round((BH - h) / 2);

  // Soft white glow, larger than the device, behind it.
  const gw = Math.round(w * 1.5);
  const gh = Math.round(h * 1.6);
  const glow = await sharp(
    Buffer.from(
      `<svg width="${gw}" height="${gh}"><ellipse cx="${gw / 2}" cy="${gh / 2}" rx="${gw * 0.4}" ry="${gh * 0.4}" fill="#ffffff"/></svg>`
    )
  )
    .blur(Math.round(Math.min(gw, gh) * 0.13))
    .ensureAlpha(0.5)
    .png()
    .toBuffer();

  const overlay = await sharp(OVERLAY_PATH).resize(BW, BH, { fit: "fill" }).toBuffer();

  await sharp(BACKGROUND_PATH)
    .composite([
      { input: glow, left: Math.round((BW - gw) / 2), top: Math.round((BH - gh) / 2) },
      { input: device, left, top },
      { input: overlay, left: 0, top: 0 },
    ])
    .webp({ quality: 90 })
    .toFile(outPath);

  return { removedFraction, cutoutSane: isCutoutSane(removedFraction) };
}

module.exports = { compositeHero, cutoutWhiteBackground, isCutoutSane, BACKGROUND_PATH, OVERLAY_PATH };
