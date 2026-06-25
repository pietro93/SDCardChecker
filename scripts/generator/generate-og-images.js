const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..", "..");
const BG = path.join(ROOT, "img", "home-hero.webp");
const LOGO = path.join(ROOT, "img", "brand", "logo.webp");

const WIDTH = 1200;
const HEIGHT = 630;

// Each entry becomes img/<output>.webp, with a title and an optional brand icon.
const TARGETS = [
  { output: "og-category.webp", title: "Find the Right SD Card", icon: "icon-sdcard.webp" },
  { output: "og-guides.webp", title: "SD Card Guides", icon: "icon-score.webp" },
  { output: "og-readers.webp", title: "Card Reader Reviews", icon: "icon-card-reader.webp" },
  { output: "og-reader.webp", title: "Card Reader Review", icon: "icon-card-reader.webp" },
  { output: "og-tools.webp", title: "SD Card Calculators", icon: "icon-speed.webp" },
];

function escapeXml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildOverlaySvg(title) {
  return `
  <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fade" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#0a1f44" stop-opacity="0.55"/>
        <stop offset="45%" stop-color="#0a1f44" stop-opacity="0.0"/>
      </linearGradient>
    </defs>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#fade)"/>
    <text x="600" y="345" font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="700"
      fill="#ffffff" text-anchor="middle">${escapeXml(title)}</text>
    <text x="600" y="395" font-family="Arial, Helvetica, sans-serif" font-size="26"
      fill="#bcd6ff" text-anchor="middle">sdcardchecker.com</text>
  </svg>`;
}

async function generateOne({ output, title, icon }) {
  const bg = sharp(BG).resize(WIDTH, HEIGHT, { fit: "cover" });
  const overlay = Buffer.from(buildOverlaySvg(title));

  const composites = [{ input: overlay, top: 0, left: 0 }];

  if (icon) {
    const iconPath = path.join(ROOT, "img", "brand", icon);
    if (fs.existsSync(iconPath)) {
      const iconBuf = await sharp(iconPath).resize(72, 72).toBuffer();
      composites.push({ input: iconBuf, top: 245, left: 564 });
    }
  }

  const outPath = path.join(ROOT, "img", output);
  await bg.composite(composites).webp({ quality: 88 }).toFile(outPath);
  console.log("generated", outPath);
}

async function main() {
  for (const target of TARGETS) {
    await generateOne(target);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
