# Handoff: Q4 SEO refresh, show Google the site is alive

**Written:** October 12, 2026
**For:** Claude Opus 5.5 in a fresh Claude Code session on this repo (the steps are spelled out, so Fable isn't needed)
**Goal:** before the holiday search peak, give Google true signals that SDCardChecker is maintained and fresh, fix structured data that breaks Google's rules, and pass more link equity to pages that can rank. One session, about 3 to 5 hours.
**Don't:** commit, push or deploy without asking Pietro. Don't edit `data/devices.json` (it's generated; edit `data/categories/*.json`). Follow `BRANDING_UX_UI_GUIDE.md` for any visible copy: no em dashes, no hedgy AI phrasing.

---

## Why these tasks

All numbers are from a clean build on October 12, 2026.

1. **The sitemap gives Google no useful freshness signal.** `scripts/generator/generate-core-files.js:101` stamps every URL with the build date, so all 292 URLs say `<lastmod>2026-10-12</lastmod>`. Google uses `lastmod` only when it's consistently accurate, so it ignores this one. Real updates (the September 26 fact-check, the October content fixes) are invisible to it.
2. **No page says when it was updated.** `dateModified` appears on 1 of 1,133 built pages. The device-page Article schema (`src/templates/device*.html`, line 30) has no `datePublished` or `dateModified`, and pages show no visible date either.
3. **Product schema invents prices.** 924 pages have `offers` with made-up prices (`"45"`, `"100"`, `"20"`) and `InStock`. The site sells nothing. That breaks Google's structured-data policy and can bring Search Console errors or a manual action. The code is in `scripts/generator/helpers.js:674` (`generateProductSchema`), `generate-car-pages.js:152` and `generate-reader-pages.js:208`. This is also Sprint 1 Task "Remove or fix the fake offers" in `ACTION_PLAN_Q4_2026.md`; tick it there when done.
4. **Strong guides get almost no internal links.** `/guides/nintendo-switch-sd-card-guide/` (1,800 words) gets 0 links from the 4 Switch device pages. Card pages list just 1 device under "Recommended For", though ~78 device pages link to `/cards/sandisk-extreme-microsd/`. See C13 and C14 in `CONTENT_SEO_PLAN_Q4_2026.md`.

## Tasks, in order

### 1. Honest `lastmod` (the main "we're alive" signal)

- Record the date each page's content last really changed. Suggested approach: after the build, hash each page's `<main>` content, with build-time noise stripped out (timestamps, the `"generated"` field, cache-busting query strings). Keep `data/page-freshness.json` as `{ url: { hash, lastChanged } }`. When the hash changes, set `lastChanged` to today; otherwise keep the old date. Commit this file, because it's the history.
- First run: no history exists yet. Seed device pages with `2026-09-26` (the date of the real English fact-check) and every other page with its source file's last git commit date (`git log -1 --format=%cs -- <file>`). Don't just put today's date on everything.
- Have `generate-core-files.js` read `lastChanged` for each URL's `<lastmod>`. Remove `changefreq` and `priority`, which Google ignores.
- Use the same approach for the locale sitemaps listed in `sitemap-index.xml` (including `scripts/generate-ja-sitemap.js`). For the index itself, use the newest `lastmod` in each child sitemap.
- Check: build twice in a row without editing anything. The sitemap must not change between the two builds. Then edit one device's data and rebuild; only that URL's date should move.

### 2. `dateModified` and a visible "Last updated" date

- In `src/templates/device*.html`, add `"datePublished"` and `"dateModified"` to the Article schema. `dateModified` comes from task 1's `lastChanged`. For `datePublished`, use the source file's first git commit date.
- Add a short visible line near the top of device, card and guide pages, e.g. "Updated October 12, 2026", using the same date. Translate it for DE/FR/IT/JA through `data/strings/*.json`; don't hard-code it.
- The visible date and the schema date must always match, and both must come from real changes. Fake freshness (bumping dates with no change) does more harm than having no date.

### 3. Remove the invented offers

- Remove the `offers` block from all three generators. Keep `Product` with `name`, `image`, `description` and `brand`, which are true. If Google then reports "missing offers", it's only a warning on a page that doesn't sell anything, which is fine. The alternative is an `ItemList` of plain products with no offers.
- Check: `grep -rl '"offers"' dist --include=*.html` returns nothing. Run 3 pages (one device, one car, one reader) through Google's Rich Results Test and paste the results in your report.

### 4. Internal links to pages that can rank

- **Device page to guide:** add a "Related guide" link block to device pages, driven by a small map in `data/` (category or device id to guide slug). At minimum: Switch devices to `nintendo-switch-sd-card-guide`; cameras to `raw-vs-jpeg` and `video-bitrate-comparison`; action cams and drones to `video-bitrate-comparison` and `sd-card-speed-classes`; every device to `is-my-sd-card-fake`. Each block should hold 1 to 2 links, with anchor text describing the target page, not "click here".
- **Card page to devices:** build a reverse index (card id to the devices that recommend it) and list up to 12 linked devices under "Recommended For". Order them by category, then name.
- Check: `node scripts/seo-crawl.js` before and after, and report inbound-link counts for the Switch guide and for `/cards/sandisk-extreme-microsd/`.

### 5. Optional: put the year in "Best SD card for X" titles

- For device pages only, and only where the title stays at or under 60 characters, end the title with the year (for example "Best SD Card for Steam Deck (2026) | microSD UHS-I"). Compute the year at build time, never hard-code it.
- Skip this if Pietro has fresh Search Console data showing the current titles already earn a good click-through rate.

## Before you hand back

- `npm run build:all` (clean build), then `node scripts/seo-crawl.js`, `npm run lint:copy`, `npm run lint:copy-ja`, `npm run check:recs`, `npm run check:locale-drift`. All must pass, or have the same warnings as before your changes.
- Spot-check in `dist/`: one EN and one JA device page, one card page, one guide, `sitemap.xml`.
- Report to Pietro: what changed, before and after numbers (pages with `dateModified`, distinct `lastmod` dates, pages with `offers`, the two inbound-link counts), and the steps below.

## Pietro's steps after deploy (about 15 minutes in Search Console)

1. Sitemaps: resubmit `https://sdcardchecker.com/sitemap-index.xml`.
2. URL Inspection: request indexing for the top 10 pages by impressions, plus the Switch guide.
3. Check Enhancements and Rich Results a week later for structured-data errors.
4. Export the last 3 months of data (pages and queries) so the next round of title rewrites can target pages ranking 5 to 15 with low click-through.

## Not in this session

The biggest Q4 content opportunity is the `/deals/` hub in `ACTION_PLAN_Q4_2026.md` section 4 (hard deadline November 5). Google needs a few weeks to index it before Black Friday (November 27). Plan it as its own session, right after this one.
