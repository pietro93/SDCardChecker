/**
 * Post-build pass: adds hreflang tags to translated pages that were rendered without
 * them (about/privacy/terms and the guides). A page is only tagged when its English
 * counterpart exists, and only the locales that actually publish the same path are listed,
 * so a tag never points at a 404.
 */
const fs = require("fs");
const path = require("path");
const { generateHreflangTags } = require("./helpers");

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    e.isDirectory() ? walk(p, out) : e.name.endsWith(".html") && out.push(p);
  }
  return out;
}

function addHreflangToTranslatedPages(distPath, locales, locale = "ja") {
  const dir = locales[locale].dir;
  const base = path.join(distPath, dir);
  const others = Object.keys(locales).filter((l) => locales[l] && typeof locales[l] === "object" && locales[l].enabled && l !== locale && l !== "en");
  let tagged = 0;

  for (const file of walk(base)) {
    const rel = path.relative(base, file).split(path.sep).join("/");
    if (!fs.existsSync(path.join(distPath, rel))) continue;
    let html = fs.readFileSync(file, "utf8");
    if (html.includes('hreflang="')) continue;

    const present = ["en", locale, ...others.filter((l) => fs.existsSync(path.join(distPath, locales[l].dir, rel)))];
    const urlPath = "/" + rel.replace(/index\.html$/, "");
    const tags = generateHreflangTags(urlPath, present);
    if (!tags || !html.includes("</head>")) continue;

    fs.writeFileSync(file, html.replace("</head>", `${tags}\n</head>`));
    tagged++;
  }
  console.log(`  ✓ Added hreflang to ${tagged} ${locale} pages`);
}

module.exports = { addHreflangToTranslatedPages };
