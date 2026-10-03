# Handoff: Sprint 1, stop the revenue leaks and start measuring

**Written:** October 2, 2026
**For:** the engineer (human or agent) picking up the first sprint of `ACTION_PLAN_Q4_2026.md`
**Target finish:** October 16, 2026
**Ask Pietro about:** anything in "Blocked on Pietro" below, and any change to which card is recommended where.

---

## The problem in five lines

1. The site earns from Mediavine ads and Amazon affiliate links.
2. Only US visitors can earn affiliate money. DE/FR/IT pages send everyone to amazon.com with the US tag, and the Japanese tag `sd-cc-22` is **not live**, so the 1,088 amazon.co.jp links on `/ja/` pay nothing.
3. About 54 pages (cards, cars, compare) don't load the Mediavine script at all. There is no analytics. The code calls `gtag()` in two places but GA is never loaded, so nobody knows which pages or slots get clicks.
4. Affiliate tags are hardcoded in about 150 places, so fixing (2) means touching all of them unless we centralize first.
5. Two smaller but visible problems: "(Mapped)" in product names on 246 pages, and Product schema with invented prices.

This sprint fixes all five so later work can be measured.

## Read first (15 minutes)

- `ACTION_PLAN_Q4_2026.md`, sections 1 and 3 (findings F1 to F7 have the file and line references).
- `ADD_A_DEVICE.md` and `DATA_WORKFLOW.md`: how data flows into the build.
- `BRANDING_UX_UI_GUIDE.md`: voice rules for any visible copy. No em dashes.

**Hard rule:** never edit `data/devices.json` or `data/devices-*.json`. They are generated. Device data lives in `data/categories/*.json`. Card data (`data/sdcards.json`, `data/sdcards-ja.json`) *is* source and may be edited.

## Build and check

```bash
npm install
npm run build:all        # clean + tailwind + generate into dist/
npm run lint:copy        # copy rules
npm run validate:cards   # card data sanity
npx http-server dist     # look at it on http://localhost:8080
```

Useful greps against the output (Git Bash):

```bash
# Amazon store + tag per locale
for l in de fr it ja; do echo "$l:"; grep -rhoE 'https://(www\.)?amazon\.[a-z.]+/[^"]*tag=[a-z0-9-]+' dist/$l \
  | sed -E 's#https://(www\.)?(amazon\.[a-z.]+)/.*tag=([a-z0-9-]+)#\2 \3#' | sort | uniq -c; done
grep -rl "(Mapped)" dist | wc -l                       # should become 0
grep -rl "googletagmanager.com/gtag" dist | wc -l      # should become ~all pages
```

---

## Blocked on Pietro (don't wait, build so these drop in as config)

| Item | What you get | Until then |
|---|---|---|
| Why `sd-cc-22` is dead, and a working JP tag | JP tag | Keep JA links to amazon.co.jp as they are. Mark the tag `"live": false` in config |
| Amazon UK/CA/DE/FR/IT tags | One tag per marketplace | DE/FR/IT keep amazon.com + US tag (same as today, nothing gets worse) |
| US per-section tracking IDs | e.g. `sdcc-device-20`, `sdcc-calc-20` | Every section falls back to `sd-cc-20` |
| GA4 measurement ID | `G-XXXXXXX` | Use a placeholder in config. The analytics snippet must not render if the ID is empty |
| OneLink on/off | Account setting, no code | Nothing to do in code. OneLink works off the US tag on amazon.com links |

---

## Tasks, in order

### Task 1: Remove "(Mapped)" from product names (15 min)

- `data/sdcards.json` lines 140 and 662, `data/sdcards-ja.json` lines 89 and 460, ids `kingston-canvas-go-plus-ultra` and `kingston-canvas-go-pro-sd`.
- These are alias entries for the real `kingston-canvas-go-plus` (line 113). Rename them to real product names: check the specs block of each to see which Kingston product they describe. Don't delete the ids; 3 category files reference them.
- Also fix the cached copy in `scripts/.sdcard-enrichment-cache.json:57`, or the enrichment script may write it back.
- **Done when:** `grep -rl "(Mapped)" dist data scripts` returns nothing after a build.

### Task 2: Analytics (half a day)

- Add a `generateAnalyticsScript()` in `src/templates/components.js` next to `generateGrowScript()` (line 46). The simplest wiring is to have `generateGrowScript()` include it, since most page templates already have `{{GROW_SCRIPT}}`.
- **These 5 templates lack `{{GROW_SCRIPT}}`**, so their pages currently run no ads either: `src/templates/card-page.html`, `cards-index.html`, `car-nav.html`, `cars-index.html`, `compare.html` (about 54 pages). Add the placeholder in `<head>` like the device templates (`device.html:61`), and make sure their generators (`generate-card-pages.js`, `generate-cards-index.js`, `generate-car-pages.js`, `generate-cars-index.js`, `generate-compare.js`) replace it. Ask Pietro before turning ads on for the compare tool, in case ad layout breaks it.
- Read the measurement ID from config (Task 3's `data/affiliate-config.json` or a separate `data/site-config.json`). Render nothing if empty.
- Existing calls that will start working once gtag loads: `src/js/compare.js:150` (`compare_card_swap`) and `src/js/calculator-ui.js:364`. Leave them as they are.
- Add one small client script (e.g. `src/js/affiliate-tracking.js`, copied by `scripts/generator/copy-assets.js`) with a single delegated `click` listener on `document` that catches links to `amazon.*` (and later B&H, etc.) and sends:
  `gtag('event', 'affiliate_click', { store, tag, page_type, device, card, slot, locale })`
  Put the context on the links as `data-*` attributes (Task 3 can add them), so the listener only reads them.
- Consent: Mediavine runs a consent tool for EU visitors. Check with Pietro that GA is covered before going live on `/de/`, `/fr/`, `/it/`. If unsure, enable GA4 Consent Mode defaults to `denied` for EU.
- **Done when:** GA4 DebugView shows `page_view` and `affiliate_click` from a local build (use the real ID locally, or GA4's debug mode).

### Task 3: Central affiliate link builder (1 to 2 days, the core of the sprint)

**Why:** tags are hardcoded in `data/sdcards.json` (75), `data/sdcards-ja.json` (37), and 10 each in `generate-device-pages.js` (line ~587), `generate-guides.js` (~61), `generate-resource-pages.js` (~118), plus 3 in `amazon-badges-generator.js` (~84). URLs are also built in `generate-device-pages.js:181` and `:427`, `generate-card-pages.js:129`, `generate-compare.js:82`, `promotion-generator.js:61`, `generate-reader-pages.js:212,297`, `helpers.js:676`, and client-side in `src/js/compare.js:70` and `src/js/calculator-card-recommendations.js:237`.

**Build:**

1. `data/affiliate-config.json`, roughly:
   ```json
   {
     "ga4MeasurementId": "",
     "marketplaces": {
       "us": { "host": "www.amazon.com",   "tag": "sd-cc-20", "live": true },
       "jp": { "host": "www.amazon.co.jp", "tag": "sd-cc-22", "live": false },
       "de": { "host": "www.amazon.de",    "tag": "", "live": false },
       "fr": { "host": "www.amazon.fr",    "tag": "", "live": false },
       "it": { "host": "www.amazon.it",    "tag": "", "live": false }
     },
     "localeMarketplace": { "en": "us", "ja": "jp", "de": "de", "fr": "fr", "it": "it" },
     "sectionTags": { "us": { "device": "", "card": "", "calc": "", "guide": "", "compare": "", "reader": "", "car": "" } },
     "fallbackMarketplace": "us"
   }
   ```
   A locale whose marketplace is not `live` (or has an empty tag) falls back to `fallbackMarketplace`. **Exception: JA.** It should keep pointing to amazon.co.jp even with a dead tag, because sending Japanese readers to amazon.com is worse for them. Make this a per-marketplace `"fallback": "keep"` option rather than a hardcoded special case.

2. `scripts/lib/affiliate.js` exporting `affiliateUrl(rawUrl, { locale, section, sponsoredTag })`:
   - Parse the URL. Remove any existing `tag` and all `utm_*` params (Amazon doesn't report UTMs).
   - Pick the marketplace from locale + config. Rewrite the host.
   - **Search URLs (`/s?k=...`) can be moved between stores safely. Product URLs (`/dp/ASIN`) can't**, because the same product often has a different ASIN in another store. When moving a `/dp/` URL to a non-US store, swap in the card's search URL instead.
   - Tag priority: `sponsoredTag` (Creator Connections `uproot01-20`, **US only**: drop it for other marketplaces) > section tag > marketplace tag.
   - Also export `affiliateAttrs({ store, tag, pageType, device, card, slot, locale })` that returns the `data-*` attribute string for Task 2.

3. Route every place listed above through `affiliateUrl()`. Keep the raw URLs in the data files for now. Stripping the tags out of the data files is optional cleanup; the builder overrides them anyway.

4. Client-side JS (`compare.js`, `calculator-card-recommendations.js`) fetches `/data/sdcards.json` or `/data/sdcards-ja.json`, copied as-is by `scripts/generator/copy-assets.js:46`. Two options, pick the simpler one once you're in the code:
   - (a) have `copy-assets.js` write processed JSON with already-resolved URLs, one file per locale, or
   - (b) inject a small `window.SDCC_AFFILIATE` config into the page and add a matching tiny `affiliateUrl()` in the browser.

5. Add `scripts/check-affiliate-links.js` (and an npm script `check:affiliate`) that scans `dist/` and fails if:
   - an Amazon link has no `tag`,
   - an Amazon link has `utm_` params,
   - a locale's links go to a store other than the one config says (allowing the configured fallback),
   - `uproot01-20` appears on a non-amazon.com link.

**Done when:**
- `npm run check:affiliate` passes.
- Changing a tag in `data/affiliate-config.json` and rebuilding changes every link for that marketplace.
- With fake tags filled in for DE/FR/IT (`"live": true`), the greps above show `/de/` → amazon.de, etc. Revert to the real config before committing.
- English pages look and click the same as before (spot-check Steam Deck, Sony A6700, DJI Mini 4K, a card page, compare, one calculator).

### Task 4: Fix Product schema (1 to 2 hours)

- `generateProductSchema()` in `scripts/generator/helpers.js:661` invents a USD price and `InStock` for an Amazon search URL. Same pattern in `generate-reader-pages.js:~210` and `generate-car-pages.js:~155`.
- Decision already made (see plan, section 10): **remove the Product `ItemList` schema** from device, reader and car pages. Keep Article, FAQPage, BreadcrumbList. Product markup comes back when we have real prices from Amazon's product API.
- **Done when:** `grep -rl '"priceCurrency"' dist | wc -l` is 0 and the Rich Results Test on a device page shows no errors.

### Task 5 (only if time is left): CI

- GitHub Actions workflow running `npm ci`, `npm run build:all`, `npm run lint:copy`, `npm run validate:cards`, `npm run check:affiliate` on push to `main`.

---

## Gotchas

- `npm run build` (without `:all`) also starts a web server and runs `prebuild` (`scripts/build-amazon-data.js`). Use `npm run build:all` for a plain build.
- Each locale has its own device template (`src/templates/device.html`, `device-ja.html`, `device-de.html`, `device-fr.html`, `device-it.html`). A template change usually has to go into all five.
- The Nintendo-branded card URL maps (ZELDA, GENGAR, ...) are copied in three generators. Use one shared constant while you're in there.
- `scripts/enrichment-generator.js` (Groq) can rewrite card and device copy. Don't run it as part of this sprint.
- Don't change *which* cards are recommended or promoted (`data/promoted-cards.json`). That's a business decision for Pietro.
- Root has many old status files. Ignore them; `ACTION_PLAN_Q4_2026.md` is current.

## Out of scope for this sprint

Deals pages, new content, locale pruning, new retailers, product API. All are in the plan for later sprints.

## When you're done

1. Tick the Sprint 1 items in `ACTION_PLAN_Q4_2026.md` section 3 and note anything still blocked.
2. Write commit messages that say what changed (not `-` or `.`).
3. Tell Pietro: what's live, which config values are still placeholders, and the first day GA4 had clean data (that's the baseline date for the KPIs in section 8).
4. Next up after this sprint: Sprint 2 (Black Friday deals pages), **hard deadline November 5**.
