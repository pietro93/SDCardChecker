/**
 * SD Card Checker - Page Freshness
 *
 * Records the date each built page's content last changed, so the sitemap <lastmod>, the
 * Article schema dateModified/datePublished and the visible "Updated" line all carry the
 * same true date instead of the build date.
 *
 * How it works:
 *  1. Generators write placeholder tokens (DATE_TOKENS below) wherever a date belongs.
 *  2. After every page is built, applyFreshness() hashes each page's <main> (tokens and
 *     build-time noise stripped), compares it with data/page-freshness.json, and moves
 *     lastChanged to today only when the hash changed.
 *  3. The tokens are then replaced with the recorded dates and the file is written back.
 *
 * data/page-freshness.json is the history: commit it after every build that changes it.
 * When it doesn't exist yet, dates are seeded from git history (see seedDates), never from
 * the build date.
 *
 * Only <main> is hashed, so sitewide header/sidebar/footer edits and <head> changes
 * (schema, titles, hreflang) don't count as a content update.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");
const { t, getCategorySlug } = require("./helpers");
const locales = require("../../data/locales.json");

const ROOT = path.join(__dirname, "../..");
const FRESHNESS_PATH = path.join(ROOT, "data/page-freshness.json");

// Every English device was fact-checked on this date (see BRANDING_UX_UI_GUIDE.md Writing
// Rules). Used as the floor when seeding English device pages.
const EN_DEVICE_FACT_CHECK = "2026-09-26";

const DATE_TOKENS = {
  modified: "@@DATE_MODIFIED@@",
  modifiedText: "@@DATE_MODIFIED_TEXT@@",
  modifiedYear: "@@DATE_MODIFIED_YEAR@@",
  published: "@@DATE_PUBLISHED@@",
};
const TOKEN_RE = /@@DATE_[A-Z_]+@@/g;

const SKIP_DIRS = new Set(["img", "assets", "data"]);
const LOCALE_DIRS = Object.entries(locales)
  .filter(([, cfg]) => cfg.dir)
  .map(([code, cfg]) => ({ code, dir: cfg.dir }));

/**
 * Visible "Updated <date>" line. The date is filled in by applyFreshness(), so it always
 * matches the page's dateModified.
 */
function lastUpdatedHTML(locale = "en", className = "text-sm text-slate-500") {
  const text = t("freshness.updated", locale).replace("{date}", DATE_TOKENS.modifiedText);
  return `<p class="page-updated ${className}"><i class="far fa-calendar-check mr-1" aria-hidden="true"></i><time datetime="${DATE_TOKENS.modified}">${text}</time></p>`;
}

function today() {
  return new Date().toISOString().split("T")[0];
}

function formatDate(isoDate, locale = "en") {
  const intlLocale = locale === "en" ? "en-US" : locale;
  return new Intl.DateTimeFormat(intlLocale, { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })
    .format(new Date(`${isoDate}T00:00:00Z`));
}

/**
 * Hash of a page's main content with build-time noise removed: date tokens, ISO
 * timestamps, "generated" fields and cache-busting query strings.
 */
function contentHash(html) {
  const main = (html.match(/<main\b[\s\S]*<\/main>/) || html.match(/<body\b[\s\S]*<\/body>/) || [html])[0];
  const normalized = main
    // The "Updated" line itself, whether its date is still a token or already filled in
    .replace(/<p class="page-updated[^"]*">[\s\S]*?<\/p>/g, "")
    .replace(TOKEN_RE, "")
    .replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z/g, "")
    .replace(/"generated"\s*:\s*"[^"]*"/g, "")
    .replace(/([?&])(v|ver|version|t|cb)=[\w.-]+/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  return crypto.createHash("sha1").update(normalized).digest("hex").slice(0, 16);
}

function walkHtml(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walkHtml(p, out);
    } else if (entry.name.endsWith(".html")) {
      out.push(p);
    }
  }
  return out;
}

const urlOf = (distPath, file) =>
  "/" + path.relative(distPath, file).split(path.sep).join("/").replace(/(^|\/)index\.html$/, "$1");

function splitLocale(url) {
  for (const { code, dir } of LOCALE_DIRS) {
    if (url === `/${dir}/` || url.startsWith(`/${dir}/`)) return { locale: code, rest: url.slice(dir.length + 1) };
  }
  return { locale: "en", rest: url };
}

// ---------------------------------------------------------------------------
// Seeding from git history (first run only)
// ---------------------------------------------------------------------------

function git(args) {
  try {
    return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", maxBuffer: 1024 * 1024 * 512 });
  } catch {
    return "";
  }
}

const devicesFileFor = (locale) => (locale === "en" ? "data/devices.json" : `data/devices-${locale}.json`);
const categoriesDirFor = (locale) => (locale === "en" ? "data/categories" : `data/categories-${locale}`);

function devicesIn(json) {
  try {
    const data = JSON.parse(json);
    return Array.isArray(data) ? data : data.devices || [];
  } catch {
    return [];
  }
}

/**
 * Replay every commit that touched `pathspecs` and record, per record key, the first and
 * last commit dates where that record's JSON changed. `extract(json)` returns [key, record]
 * pairs for one file's contents. Uncommitted edits in the working tree count as today.
 */
function recordHistory(pathspecs, extract) {
  const firstSeen = {};
  const lastChanged = {};
  const state = {};
  const record = (file, key, value, when) => {
    const json = JSON.stringify(value);
    if (state[`${file}|${key}`] === json) return;
    state[`${file}|${key}`] = json;
    if (!firstSeen[key]) firstSeen[key] = when;
    if (!lastChanged[key] || when > lastChanged[key]) lastChanged[key] = when;
  };
  const replay = (file, contents, when) => {
    let data;
    try {
      data = JSON.parse(contents);
    } catch {
      return;
    }
    extract(data).forEach(([key, value]) => key && record(file, key, value, when));
  };

  const commits = git(["log", "--reverse", "--format=@@%H %cs", "--name-only", "--", ...pathspecs]).split("@@").filter(Boolean);
  for (const block of commits) {
    const [header, ...files] = block.trim().split("\n").filter(Boolean);
    const [sha, when] = header.split(" ");
    files.filter((f) => f.endsWith(".json")).forEach((file) => replay(file, git(["show", `${sha}:${file}`]), when));
  }
  const tracked = git(["ls-files", "--", ...pathspecs]).split("\n").filter((f) => f.endsWith(".json"));
  tracked.forEach((file) => {
    const abs = path.join(ROOT, file);
    if (fs.existsSync(abs)) replay(file, fs.readFileSync(abs, "utf8"), today());
  });
  return { firstSeen, lastChanged };
}

/**
 * Per-device dates for one locale, keyed by device slug:
 *  - published: first commit that added the slug to the locale's device data
 *  - lastChanged: last commit that changed the device's record in the category files
 */
function deviceHistory(locale) {
  const dir = categoriesDirFor(locale);
  const published = {};
  const { lastChanged } = recordHistory([dir], (data) =>
    (Array.isArray(data) ? data : data.devices || []).map((d) => [d.slug, d])
  );

  // First appearance: one pass over the patches, oldest first. Covers the devices.json
  // era before the per-category files existed.
  let date = null;
  const log = git(["log", "--reverse", "--format=@@%cs", "-p", "-U0", "--", devicesFileFor(locale), dir]);
  for (const line of log.split("\n")) {
    if (line.startsWith("@@") && /^@@\d{4}-/.test(line)) {
      date = line.slice(2, 12);
    } else if (line.startsWith("+")) {
      const m = line.match(/^\+\s*"slug":\s*"([^"]+)"/);
      if (m && !published[m[1]]) published[m[1]] = date;
    }
  }
  return { published, lastChanged };
}

/**
 * Per-card dates keyed by card id, from the two files a card page is built from: the
 * card's record in sdcards.json and its entry in sdcard-enrichment.json.
 */
function cardHistory() {
  return recordHistory(["data/sdcards.json", "data/sdcard-enrichment.json"], (data) =>
    Array.isArray(data.sdcards) ? data.sdcards.map((c) => [c.id, c]) : Object.entries(data)
  );
}

/** Category slug -> category data file(s) for a locale */
function categoryFiles(locale) {
  const dir = categoriesDirFor(locale);
  const map = {};
  const absDir = path.join(ROOT, dir);
  if (!fs.existsSync(absDir)) return map;
  fs.readdirSync(absDir)
    .filter((f) => f.endsWith(".json"))
    .forEach((f) => {
      devicesIn(fs.readFileSync(path.join(absDir, f), "utf8")).forEach((d) => {
        const slug = getCategorySlug(d.category);
        (map[slug] = map[slug] || new Set()).add(`${dir}/${f}`);
      });
    });
  return map;
}

/** Source files that a non-device page is built from, used to seed its dates */
function sourceFilesFor(locale, rest, ctx) {
  const sfx = locale === "en" ? "" : `-${locale}`;
  const tpl = (name) => {
    const localized = `src/templates/${name}${sfx}.html`;
    return fs.existsSync(path.join(ROOT, localized)) ? localized : `src/templates/${name}.html`;
  };
  const catFiles = (slug) => [...(ctx.categoryFiles[locale][slug] || [])];
  let m;

  if (rest === "/") return [tpl("home")];
  if ((m = rest.match(/^\/(about|privacy|terms|contact|affiliate-disclosure|sitemap|faq)\.html$/))) return [tpl(m[1])];
  if (rest === "/404.html") return ["scripts/generator/generate-core-files.js"];
  if (rest === "/guides/") return [locale === "en" ? "src/templates/guides/index.html" : `src/templates/guides${sfx}.html`];
  if (rest === "/guides/readers/") return ["src/templates/guides/readers-index.html"];
  if ((m = rest.match(/^\/guides\/readers\/([^/]+)\/$/))) return [`src/templates/guides/readers-${m[1]}.html`];
  if (rest === "/guides/is-my-sd-card-fake/" && locale === "en") return ["src/templates/guides/fake-sd-card-checker.html"];
  if ((m = rest.match(/^\/guides\/([^/]+)\/$/))) return [`src/templates/guides/${m[1]}${sfx}.html`];
  if (rest === "/categories/") return [tpl("categories-index"), categoriesDirFor(locale)];
  if ((m = rest.match(/^\/categories\/([^/]+)\/(?:[^/]+\/)?$/))) return catFiles(m[1]);
  if (rest.startsWith("/cards/")) return ["data/sdcards.json", "data/sdcard-enrichment.json"];
  if (rest.startsWith("/cars/")) return ["data/cars-navigation.json"];
  if (rest.startsWith("/readers/")) return ["data/sdCardReaders.json"];
  if (rest === "/compare/") return ["src/templates/compare.html", "data/sdcards.json"];
  if (rest.startsWith("/tools/")) {
    return locale === "en"
      ? ["src/templates/tools", "src/templates/tools.html", "src/templates/calculators", "data/calculator-content.json"]
      : [`public/${locales[locale].dir}${rest}`];
  }
  return [];
}

function seedDates(url, ctx) {
  const { locale, rest } = splitLocale(url);
  const device = rest.match(/^\/categories\/[^/]+\/([^/]+)\/$/);
  const history = ctx.deviceHistory[locale];
  if (device && history.lastChanged[device[1]]) {
    const slug = device[1];
    let lastChanged = history.lastChanged[slug];
    if (locale === "en" && lastChanged < EN_DEVICE_FACT_CHECK) lastChanged = EN_DEVICE_FACT_CHECK;
    return { published: history.published[slug] || lastChanged, lastChanged };
  }
  const card = rest.match(/^\/cards\/([^/]+)\/$/);
  if (card && ctx.cardHistory.lastChanged[card[1]]) {
    return { published: ctx.cardHistory.firstSeen[card[1]], lastChanged: ctx.cardHistory.lastChanged[card[1]] };
  }

  const files = sourceFilesFor(locale, rest, ctx).filter((f) => fs.existsSync(path.join(ROOT, f)));
  if (files.length === 0) {
    console.warn(`  ! freshness: no source file mapped for ${url}, seeding with today`);
    return { published: today(), lastChanged: today() };
  }
  const lastChanged = git(["log", "-1", "--format=%cs", "--", ...files]).trim() || today();
  const published = git(["log", "--reverse", "--format=%cs", "--", ...files]).split("\n")[0].trim() || lastChanged;
  return { published, lastChanged };
}

function seedContext() {
  const ctx = { deviceHistory: {}, categoryFiles: {}, cardHistory: cardHistory() };
  for (const locale of Object.keys(locales).filter((l) => !l.startsWith("_"))) {
    ctx.deviceHistory[locale] = deviceHistory(locale);
    ctx.categoryFiles[locale] = categoryFiles(locale);
  }
  return ctx;
}

// ---------------------------------------------------------------------------

function loadFreshness() {
  if (!fs.existsSync(FRESHNESS_PATH)) return null;
  return JSON.parse(fs.readFileSync(FRESHNESS_PATH, "utf8"));
}

/**
 * Hash every built page, update data/page-freshness.json and fill in the date tokens.
 * Returns the { url: { hash, lastChanged, published } } map for the sitemap generator.
 *
 * On CI (the Cloudflare Pages build that runs on every push), the file is read but not
 * written: the history only advances through a
 * local build whose updated page-freshness.json gets committed. Pages that changed without
 * that commit get today's date for this deploy, and the build log says so.
 */
function applyFreshness(distPath) {
  console.log("Applying page freshness dates...");
  const isCI = !!(process.env.CF_PAGES || process.env.CI);
  const existing = loadFreshness();
  const seeding = !existing;
  const ctx = seeding ? seedContext() : null;
  if (seeding) console.log("  No data/page-freshness.json yet: seeding dates from git history");

  const now = today();
  const pages = {};
  const changed = [];

  for (const file of walkHtml(distPath)) {
    const url = urlOf(distPath, file);
    let html = fs.readFileSync(file, "utf8");
    const hash = contentHash(html);
    const prev = existing && existing[url];
    let entry;
    if (prev) {
      entry = { ...prev, hash };
      if (prev.hash !== hash) {
        entry.lastChanged = now;
        changed.push(url);
      }
    } else if (seeding) {
      entry = { hash, ...seedDates(url, ctx) };
    } else {
      entry = { hash, lastChanged: now, published: now };
      changed.push(url);
    }
    if (entry.lastChanged < entry.published) entry.lastChanged = entry.published;
    pages[url] = { hash: entry.hash, lastChanged: entry.lastChanged, published: entry.published };

    if (html.includes("@@DATE_")) {
      const { locale } = splitLocale(url);
      html = html
        .replaceAll(DATE_TOKENS.modifiedText, formatDate(entry.lastChanged, locale))
        .replaceAll(DATE_TOKENS.modifiedYear, entry.lastChanged.slice(0, 4))
        .replaceAll(DATE_TOKENS.modified, entry.lastChanged)
        .replaceAll(DATE_TOKENS.published, entry.published);
      fs.writeFileSync(file, html);
    }
  }

  const sorted = Object.fromEntries(Object.keys(pages).sort().map((u) => [u, pages[u]]));
  if (isCI) {
    if (changed.length > 0) {
      console.warn(`  ! ${changed.length} page(s) changed since data/page-freshness.json was committed. Run the build locally and commit the file.`);
    }
  } else {
    const output = JSON.stringify(sorted, null, 2) + "\n";
    if (!existing || fs.readFileSync(FRESHNESS_PATH, "utf8") !== output) fs.writeFileSync(FRESHNESS_PATH, output);
  }
  console.log(`  ✓ ${Object.keys(sorted).length} pages tracked, ${seeding ? "seeded from git" : `${changed.length} changed`}`);
  return sorted;
}

module.exports = { DATE_TOKENS, lastUpdatedHTML, applyFreshness, contentHash, formatDate };
