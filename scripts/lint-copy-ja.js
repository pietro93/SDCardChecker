#!/usr/bin/env node
/**
 * lint-copy-ja.js
 * Checks the built Japanese pages in dist/ja for the problems found in the JA SEO audit.
 * Run after `npm run build:site`. Exits 1 if any page fails.
 *
 * Rules:
 *   placeholder   unreplaced {{TOKEN}} left in visible text
 *   dead-link     internal /ja/ link to a page that was not built
 *   meta-english  meta description with no Japanese characters
 *   meta-length   meta description over 120 characters
 *   title-width   title wider than 60 units (full-width counts as 2)
 *   banned-phrase "最高のSDカード" (literal "Best SD Card"; BRANDING guide says use おすすめ)
 *   english-prose a run of 4+ English function words in body text (untranslated sentence)
 *   canonical     canonical URL does not match the page's own path
 *   usd-text      USD price text on a page that links to amazon.co.jp
 *
 * Usage: node scripts/lint-copy-ja.js [--verbose]
 */
const fs = require("fs");
const path = require("path");

const DIST = path.join(__dirname, "..", "dist");
const JA = path.join(DIST, "ja");
const verbose = process.argv.includes("--verbose");

const walk = (dir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    e.isDirectory() ? walk(p, out) : e.name.endsWith(".html") && out.push(p);
  }
  return out;
};

const hasJa = (s) => /[぀-ヿ一-鿿]/.test(s);
const width = (s) => [...s].reduce((w, ch) => w + (/[　-鿿＀-￯]/.test(ch) ? 2 : 1), 0);
const pageExists = (url) => {
  const p = path.join(DIST, url.split("#")[0].split("?")[0]);
  return (fs.existsSync(p) && (fs.statSync(p).isFile() || fs.existsSync(path.join(p, "index.html")))) || fs.existsSync(p + ".html");
};
// Function words that only appear in English sentences, not in product names or spec tokens.
const ENGLISH_RUN = /\b(?:the|and|for|with|your|are|is|to|of|that|this|it)\s+(?:[A-Za-z']+\s+){0,2}(?:the|and|for|with|your|are|is|to|of|that|this|it)\b/i;

const hits = {};
const flag = (rule, rel, detail) => {
  (hits[rule] = hits[rule] || []).push(detail ? `${rel}: ${detail}` : rel);
};

for (const file of walk(JA)) {
  const rel = path.relative(JA, file).split(path.sep).join("/");
  const html = fs.readFileSync(file, "utf8");
  const text = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "");
  const body = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

  if (/\{\{[A-Z_]+\}\}/.test(body)) flag("placeholder", rel, body.match(/\{\{[A-Z_]+\}\}/)[0]);

  for (const m of text.matchAll(/<a [^>]*href="(\/ja\/[^"]*)"/g)) {
    if (!pageExists(m[1])) flag("dead-link", rel, m[1]);
  }

  const desc = (html.match(/<meta\s+name="description"\s+content="([^"]*)"/) || [])[1] || "";
  if (!hasJa(desc)) flag("meta-english", rel, desc.slice(0, 60));
  else if ([...desc].length > 120) flag("meta-length", rel, `${[...desc].length} chars`);

  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || "";
  if (width(title) > 60) flag("title-width", rel, `${width(title)} units: ${title.slice(0, 50)}`);

  if (body.includes("最高のSDカード")) flag("banned-phrase", rel);

  const run = body.match(ENGLISH_RUN);
  if (run) flag("english-prose", rel, run[0]);

  const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || "";
  const expected = "https://sdcardchecker.com/ja/" + rel.replace(/index\.html$/, "");
  if (canonical !== expected) flag("canonical", rel, canonical.replace("https://sdcardchecker.com", ""));

  if (/\d\s?USD/.test(body) || /\d\s?USD"/.test(text)) flag("usd-text", rel);
}

let total = 0;
for (const [rule, list] of Object.entries(hits)) {
  total += list.length;
  console.log(`${rule}: ${list.length}`);
  if (verbose) list.forEach((l) => console.log(`  ${l}`));
}
if (!total) console.log("lint-copy-ja: no issues");
process.exit(total ? 1 : 0);
