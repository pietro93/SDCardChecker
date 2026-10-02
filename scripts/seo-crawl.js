/**
 * Crawl the built English site in dist/ and report content/SEO health:
 *  - word count and unique-word count per page (sentences shared with 3+ other device pages
 *    count as boilerplate)
 *  - contextual inbound links (links inside <main> only; the sitewide link block between
 *    </main> and <footer> and the header nav are ignored)
 *  - internal labels leaking into visible text ("(Mapped)", "(Legacy)", "(Legacy ID)")
 *  - missing meta descriptions, titles over 65 chars, duplicate titles
 *  - pages with Article schema but no dateModified
 *
 * Run after `npm run build:all` (a clean build, so deleted pages don't linger in dist/).
 * Usage: node scripts/seo-crawl.js [--json out.json]
 */
const fs = require("fs");
const path = require("path");

const DIST = path.join(__dirname, "../dist");
const LOCALE_DIRS = new Set(["ja", "de", "fr", "it", "es"]);
const SKIP_DIRS = new Set(["img", "assets", "data", ...LOCALE_DIRS]);
const LEAK_RE = /\((Mapped|Legacy[^)]*)\)/g;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(p, out);
    } else if (entry.name.endsWith(".html")) out.push(p);
  }
  return out;
}

const urlOf = (file) => "/" + path.relative(DIST, file).split(path.sep).join("/").replace(/index\.html$/, "");
const stripTags = (html) => html.replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/g, " ").replace(/\s+/g, " ").trim();
const isDevicePage = (u) => /^\/categories\/[^/]+\/[^/]+\/$/.test(u);
const sentencesOf = (text) => text.split(/(?<=[.?!])\s+/).map((s) => s.trim()).filter((s) => s.split(" ").length >= 5);

const pages = [];
const inbound = {};

if (!fs.existsSync(DIST)) {
  console.error("dist/ not found. Run `npm run build:all` first.");
  process.exit(1);
}

for (const file of walk(DIST)) {
  const html = fs.readFileSync(file, "utf8");
  const u = urlOf(file);
  const main = (html.match(/<main\b[\s\S]*?<\/main>/) || [html])[0]
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<select[\s\S]*?<\/select>/g, "");
  const text = stripTags(main);

  const links = new Set(
    [...main.matchAll(/href="([^"#?]+)/g)]
      .map((m) => m[1].replace(/^https?:\/\/(www\.)?sdcardchecker\.com/, ""))
      .filter((l) => l.startsWith("/"))
      .map((l) => (l.endsWith("/") || l.endsWith(".html") ? l : l + "/"))
  );
  for (const l of links) if (l !== u) (inbound[l] = inbound[l] || new Set()).add(u);

  const hasArticle = /"@type":\s*"Article"/.test(html);
  pages.push({
    url: u,
    title: (html.match(/<title>([^<]*)<\/title>/) || [])[1] || "",
    description: (html.match(/<meta\s+name="description"\s+content="([^"]*)"/) || [])[1] || "",
    words: text.split(" ").length,
    leaks: (text.match(LEAK_RE) || []).length,
    articleWithoutDate: hasArticle && !/"dateModified"/.test(html),
    text,
  });
}

// Boilerplate: sentences that appear on more than 3 device pages.
const freq = {};
for (const p of pages.filter((p) => isDevicePage(p.url))) {
  for (const s of new Set(sentencesOf(p.text))) freq[s] = (freq[s] || 0) + 1;
}
for (const p of pages) {
  p.inbound = (inbound[p.url] || new Set()).size;
  p.uniqueWords = sentencesOf(p.text)
    .filter((s) => (freq[s] || 0) <= 3)
    .reduce((n, s) => n + s.split(" ").length, 0);
  delete p.text;
}

const median = (arr) => {
  const s = [...arr].sort((a, b) => a - b);
  return s[s.length >> 1];
};
const groupOf = (u) =>
  isDevicePage(u) ? "device + brand hubs" : u.startsWith("/categories/") ? "category" : u.split("/")[1] || "home";

console.log(`=== ${pages.length} English pages ===\n`);
const groups = {};
for (const p of pages) (groups[groupOf(p.url)] = groups[groupOf(p.url)] || []).push(p);
for (const [g, arr] of Object.entries(groups).sort((a, b) => b[1].length - a[1].length)) {
  console.log(
    `${g.padEnd(28)} n=${String(arr.length).padEnd(4)} median words=${String(median(arr.map((p) => p.words))).padEnd(5)}` +
      ` median unique=${String(median(arr.map((p) => p.uniqueWords))).padEnd(5)} median inbound=${median(arr.map((p) => p.inbound))}`
  );
}

const report = (label, list, fmt) => {
  console.log(`\n=== ${label} (${list.length}) ===`);
  if (list.length === 0) console.log("none");
  list.slice(0, 25).forEach((p) => console.log(fmt(p)));
  if (list.length > 25) console.log(`... ${list.length - 25} more`);
};

report("Label leaks in visible text", pages.filter((p) => p.leaks), (p) => `${p.leaks}x ${p.url}`);
report("Missing meta description", pages.filter((p) => !p.description && p.url !== "/404.html"), (p) => p.url);
report("Titles over 65 chars", pages.filter((p) => p.title.length > 65), (p) => `${p.title.length} ${p.title}`);
const byTitle = {};
for (const p of pages) (byTitle[p.title] = byTitle[p.title] || []).push(p.url);
report("Duplicate titles", Object.entries(byTitle).filter(([, u]) => u.length > 1), ([t, u]) => `${t} => ${u.join(", ")}`);
report("Article schema without dateModified", pages.filter((p) => p.articleWithoutDate), (p) => p.url);
report(
  "Pages with no contextual inbound links (excl. legal/404)",
  pages.filter((p) => p.inbound === 0 && !/(404|privacy|terms|contact)/.test(p.url)),
  (p) => p.url
);
report(
  "Thinnest pages by unique words",
  [...pages].filter((p) => p.url !== "/404.html").sort((a, b) => a.uniqueWords - b.uniqueWords).slice(0, 15),
  (p) => `${String(p.uniqueWords).padStart(5)} unique / ${p.words} total  ${p.url}`
);

const jsonFlag = process.argv.indexOf("--json");
if (jsonFlag !== -1 && process.argv[jsonFlag + 1]) {
  fs.writeFileSync(process.argv[jsonFlag + 1], JSON.stringify(pages, null, 2));
  console.log(`\nWrote ${process.argv[jsonFlag + 1]}`);
}
