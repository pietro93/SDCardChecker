# DE / FR / IT Localization — Step-by-Step Checklist

Goal: minimize Claude Code quota burn. Each session should reference this file directly
("continue LOCALIZATION_TODO.md, DE next unchecked batch") instead of re-explaining scope.

Rules for low-quota sessions:
- One batch per message/session where possible. Don't ask for "keep going" open-ended.
- Point Claude at specific line ranges / category names, not "the whole file".
- **Workflow decision (2026-07-16): translate through Claude Code interactive turns, not a
  separate API script.** Owner wants to spend Claude Code subscription quota directly rather
  than set up separate Anthropic API billing. Given that, batch by **category, all three
  locales in the same turn** (DE+FR+IT for one category together) rather than doing a full
  language pass before starting the next — this amortizes the cost of reading/reasoning about
  the source category once across all three outputs instead of three separate times.
- Write output straight to `data/categories-{locale}/{category}.json` (array of device
  objects, same shape as `data/categories-ja/`) — `build.js`'s `mergeLocaleDeviceCategories()`
  auto-merges these into `devices-{locale}.json` on every build. Don't hand-edit
  `devices-de.json` etc. directly.
- Skip translating the `notes` field — confirmed it's never rendered (`grep -r "device.notes"
  src/` finds nothing device-related), it's internal-only content-team documentation. JA
  translated it anyway (wasted quota); don't repeat that. Leave `notes` in English.
- Check a box immediately after a batch is verified — that's what lets the next session skip re-deriving state.

---

## Market scope decision (already made — don't re-litigate without new info)

**Catalog dedup (2026-07-16):** `data/devices.json` had 3 duplicate `id` entries — same
device listed twice with a thin/stub second copy (0 FAQ entries, minimal search terms):
`canon-rebel-t7`, `nikon-d850`, `dji-mini-3`. This was a data bug affecting EN too (two
devices silently colliding on the same URL route), not a market-fit issue. Removed the
thin duplicate of each (kept the richer entry with FAQs/full search terms). Catalog is now
**191 devices** (was 194). Do this kind of dedup check before translating any new source
catalog — it's a straight quota win since duplicates get translated 2x for nothing.
`wyze-cam-v3` still appears twice (Action Cameras + Security Cameras) — that's an
intentional cross-listing, not a bug; left as-is, but worth translating once and referencing
from both category pages rather than duplicating the content when Tier 1B gets to it.

Source catalog: `data/devices.json`, 191 devices across 11 categories. Compared against
`data/devices-ja.json` (164 devices, 9 categories) which already validated dropping niche
categories for a non-EN market.

**Tier 1 scope for DE, FR, and IT — same 166-device / 8-category subset for all three.**
DE, FR, and IT are similar developed EU consumer markets (same major brands and retailers —
Amazon, MediaMarkt/Saturn, Fnac, MediaWorld — carry the same catalog), so there's no
market-specific device swap needed the way JA needed Japanese-domestic dash-cam brands
(Comtec, Yupiteru, Kenwood, Cellstar) instead of the Tesla/Viofo/Nextbase list.

**Included (166 devices, post-dedup counts):**
| Category | Count |
|---|---|
| Cameras | 57 |
| Gaming Handhelds | 33 |
| Drones | 26 |
| Computing & Tablets | 20 |
| Action Cameras | 15 |
| Smartphones | 7 |
| Dash Cams | 5 |
| Security Cameras | 3 |

**Excluded from Tier 1 (25 devices, 3 categories) — enthusiast-niche, low SD-card search
volume, mirrors the JA precedent of cutting the same three categories:**
- 3D Printers & Fabrication (7) — Bambu Lab, Creality
- Audio & Hi-Fi (11) — FiiO, Sony Walkman, HiBy, Astell&Kern, Zoom, Tascam
- Music Production (7) — Akai, Roland, Polyend, 1010music

If scope expands later (Tier 2), **Germany is the strongest candidate to add 3D Printers and
Music Production first** — strong maker/3D-printing hobbyist culture and a major electronic
music production scene (Ableton, Native Instruments are German companies). No similar
FR/IT-specific signal was found, so add there only on demand.

No devices within the 166 needed individual exclusion for country mismatch — `devices.json`
is already a Western/EU-generic catalog (e.g. "Canon EOS Rebel T7 (EOS 2000D)" already
carries the EU badge name alongside the NA name), unlike JA which needed a wholesale
dash-cam category swap.

- [x] Confirm this scope (or override) before starting Tier 1B batches
- [x] Confirm: keep `de.enabled`/`fr.enabled`/`it.enabled` in `data/locales.json` as `true`,
      or flip to `false` per-locale until content exists — **decision: `false` for now**
      (verified 2026-07-16: pages currently ship with `<html lang="en">` and an
      English-only `<title>` even when the body content is translated — see the
      title/lang finding under Tier 1A. Don't flip to `true` until that's fixed, otherwise
      live `/de/` `/fr/` `/it/` pages would mislabel themselves as English to search engines.)
      **Update 2026-07-17: the lang/title bug is now fixed (see Tier 1A) — flipped `enabled`
      to `true` for de/fr/it and verified with a full `npm run build:site` + local serve
      smoke test. Left `true` in the working tree; not yet committed/deployed.**

## Tier 1A — Unblock /de/, /fr/, /it/ existing at all (per locale)

**Finding (2026-07-16, verified by temporarily enabling all three locales and running
`npm run build:site`):** device pages for DE/FR/IT render correctly with translated
body/FAQ content, but **`<html lang>` and `<title>` are not locale-aware** —
`generate-device-pages.js:404` hardcodes the title string
(`Best SD Cards for ${device.name} | ...`) regardless of locale, and `<html lang="en">`
comes from `src/templates/device.html`, which every locale without its own
`device-{locale}.html` falls through to. JA avoids the `lang` half of this because
`device-ja.html` already exists with `lang="ja"` hardcoded — but even JA still ships the
English title, so this bug predates this session and affects JA too, not just the new
locales. **Bumping `device-{locale}.html` up in priority is worth it before flipping
`enabled: true`** — at minimum, fixing `lang` + the title string matters for basic SEO,
even before the rest of Tier 2's chrome work.

Also found: `generate-device-pages.js` already has partial DE UI-label dictionaries
(`BRANDS_TABLE_LABELS`, `REQUIREMENTS_BOX_LABELS`, `ENRICHED_CARD_LABELS` all have a `de:`
entry already — someone started this before). FR and IT have no entries yet and silently
fall back to English labels. So DE's Tier 2 chrome work is cheaper than FR/IT's.

- [x] `src/templates/home-de.html` — homepage template — **done 2026-07-17**: fully
      translated (hero, search, popular devices, categories, features sections), links use
      `/de/categories/{slug}/{device}/` matching actual generated URLs. Car Navigation
      section omitted (matches JA precedent — `de` doesn't carry the `cars` navSection).
- [x] `src/templates/home-fr.html` — **done 2026-07-17**, same approach as DE.
- [x] `src/templates/home-it.html` — **done 2026-07-17**, same approach as DE.
- [x] Pick and translate first validation batch manually per locale to confirm pipeline
      end-to-end — used Security Cameras (3 devices) for DE+FR+IT, see Tier 1B below
- [x] Clean build + local serve smoke test on the validation batch, each locale — build
      succeeded, `dist/{de,fr,it}/categories/security-cameras/*` all generated correctly;
      reverted `locales.json` back to `enabled: false` after testing (see title/lang finding)
- [x] Fix `<html lang>` + `<title>` locale-awareness — **done 2026-07-17**: created
      `src/templates/device-{de,fr,it}.html` (based on the full-featured `device.html`, not
      the older simplified `device-ja.html`) with correct `lang` attribute and translated
      static chrome (breadcrumb, hero heading, section headings, table headers, affiliate
      disclosure, FAQ heading, hero CTA). `generate-device-pages.js` now selects
      `device-{locale}.html` for ja/de/fr/it (previously only ja) and generates a fully
      locale-aware `<title>`/`og:title`/`twitter:title`/schema headline via a new
      `DEVICE_TITLE_STRINGS` dictionary (also fixes the same pre-existing bug for `ja`,
      which was shipping English titles too). Also added fr/it entries to
      `BRANDS_TABLE_LABELS`/`ENRICHED_CARD_LABELS`/`REQUIREMENTS_BOX_LABELS` (previously
      only en/ja/de had entries). **Bonus fix:** `data/strings/fr.json` and
      `data/strings/it.json` were empty stub files (nav/footer/sidebar silently fell back to
      English via `t()`) — populated both with the same key structure as `de.json`, so
      header/footer/sidebar chrome is now actually localized for fr/it too, not just DE.
      Verified via full `npm run build:site` (all 5 locales) + local serve + Playwright
      screenshot check on `/de/`, `/fr/categories/cameras/canon-eos-r5/` — correct `lang`,
      translated titles, translated chrome, all Popular Devices links on the new home pages
      resolve to real generated pages. Category names in the device-page sidebar
      (e.g. "Action Cameras") are still English — that's `category-slugs.json` label
      translation, separate Tier 2 item below, not touched here.
- [x] Delete `.baseline-dist/` — already gone, nothing to do.

## Tier 1B — Bulk device catalog translation (interactive turns, DE+FR+IT together per category)
166-device Tier-1 subset (see scope above) across 8 categories. One category = one batch,
translated to all three locales in the same turn, written to
`data/categories-{de,fr,it}/{category}.json`. Check the box once all three locale files for
that category exist and a build has been smoke-tested.

- [x] security-cameras (3) — DE/FR/IT done 2026-07-16
- [x] dash-cams (5) — **done 2026-07-16**: all 5 devices (tesla-model-3-sentry,
      generic-4k-dashcam, viofo-a229-pro, viofo-t130-pro, nextbase-iq-4k) translated to
      DE/FR/IT. Smoke-tested with `npm run build:site` (locales temporarily enabled, then
      reverted to `false`) — all 15 pages render correctly under
      `dist/{de,fr,it}/categories/dash-cams/`.
- [x] action-cameras (15) — **15/15 done 2026-07-16**: gopro-hero-13 (initial seed) +
      sub-batch 1A + sub-batch 1B all translated DE/FR/IT. Smoke-tested with
      `npm run build:site` (locales temporarily enabled, then reverted to `false`) — all 15
      devices render correctly under `dist/{de,fr,it}/categories/action-cameras/`.
  - [x] 1A — GoPro + Nextbase + Wyze (6): gopro-hero-12, gopro-hero-max,
        gopro-hero-11-black, gopro-max-2, nextbase-622gw, wyze-cam-v3 — done 2026-07-16
  - [x] 1B — Insta360 + DJI (8): insta360-x3, insta360-x4, insta360-go-3, insta360-ace-pro,
        insta360-one-x2, insta360-one-x3, dji-osmo-pocket-3, dji-osmo-action-4 — done 2026-07-16
- [x] smartphones (7) — **done 2026-07-16**: all 7 devices (iphone-15, iphone-14, iphone-13,
      iphone-14-pro-max, iphone-se, samsung-galaxy-s23, google-pixel-8) translated to
      DE/FR/IT. Smoke-tested with `npm run build:site` (locales currently enabled locally by
      another in-progress session, see html-lang/title fix work) — all 21 pages
      (7 devices × 3 locales) generated correctly under `dist/{de,fr,it}/categories/smartphones/`.
- [x] computing-and-tablets (20) — **20/20 done 2026-07-16**: raspberry-pi-5 seed + sub-batches
      2A/2B/2C all translated DE/FR/IT. Validated with `node -e "JSON.parse(...)"` on all three
      locale files — 20 devices each, identical id order. Still needs a smoke-test build
      alongside the other finished categories.
  - [x] 2A — SBCs (5): raspberry-pi-compute-module-5, raspberry-pi-4-model-b,
        raspberry-pi-3-model-b-plus, raspberry-pi-zero-2-w, orange-pi-5 — done 2026-07-16
  - [x] 2B — Tablets (7): samsung-galaxy-tab-s9, amazon-fire-hd-10, amazon-fire-max-11,
        lenovo-tab-m10-plus-gen3, samsung-galaxy-tab-s10-fe, samsung-galaxy-tab-s10-fe-plus,
        samsung-galaxy-tab-s10-ultra — done 2026-07-16
  - [x] 2C — Apple + Chromebook (7): macbook-air, macbook-pro, ipad-air, ipad-air-3, ipad-pro,
        ipad-9th-gen, hp-chromebook-14 — done 2026-07-16
- [x] drones (26, post-dedup — see dedup note below) — **26/26 done 2026-07-16**:
      dji-mini-4-pro seed + sub-batches 3A + 3B + 3C all translated DE/FR/IT. Validated with
      `node -e "JSON.parse(...)"` on all three locale files — 26 devices each, identical id
      order across DE/FR/IT. Still needs a smoke-test build alongside the other finished
      categories (see Tier 1B final checklist items).
  - [x] 3A — DJI consumer minis/airs (5): dji-mini-3-pro, dji-air-3s, dji-air-3, dji-mini-4k,
        dji-mini-3 — done 2026-07-16
  - [x] 3B — DJI pro/FPV + rest (6): dji-mavic-3, dji-mini-2-se, dji-avata-2, dji-mini-5-pro,
        dji-avata-360, dji-neo — done 2026-07-16
  - [x] 3C — Non-DJI brands (14): autel-evo-ii-pro-v3, autel-evo-nano-plus, autel-evo-lite-plus,
        holy-stone-hs175d, holy-stone-hs720, holy-stone-hs360s, potensic-atom, potensic-atom-se,
        skydio-2-plus, skydio-x10, hoverair-x1-pro, hoverair-x1-pro-max, fimi-mini-3,
        walksnail-moonlight — done 2026-07-16
- [x] gaming-handhelds (33) — **33/33 done 2026-07-16**: all sub-batches complete
      (nintendo-switch seed + 4A + 4B + 4C = 33 devices, DE/FR/IT). Validated with
      `node -e "JSON.parse(...)"` on all three locale files — 33 devices each, matching order.
      Still needs a smoke-test build alongside the other finished categories (see Tier 1B
      final checklist items).
  - [x] 4A — Nintendo family (4): nintendo-switch-oled, nintendo-switch-lite,
        nintendo-switch-2, nintendo-3ds-xl — **done 2026-07-16**: translated DE/FR/IT,
        appended after the existing 29 devices (seed + 4B + 4C).
  - [x] 4B — Retro/emulation handhelds (17): anbernic-rg353v, anbernic-rg35xx-plus,
        anbernic-rg556, anbernic-rg35xx-sp, anbernic-rg406v-rg406h, anbernic-rg-cube,
        retroid-pocket-4-pro, retroid-pocket-6, retroid-pocket-5, retroid-pocket-mini,
        miyoo-mini-plus, egret-ii-mini, analogue-pocket, sony-ps-vita-sd2vita, r36s,
        trimui-brick, ayn-odin-3-odin-2-portal — **done 2026-07-16**: all 17 translated
        DE/FR/IT, appended to the existing seeded files (nintendo-switch + any 4C
        additions present at write time), validated with `node -e "JSON.parse(...)"`.
  - [x] 4C — PC/Windows handhelds (11): steam-deck, asus-rog-ally, asus-rog-ally-x,
        rog-xbox-ally-x, lenovo-legion-go, lenovo-legion-go-s, lenovo-legion-go-gen-2,
        msi-claw, msi-claw-8-ex-ai-plus, gpd-win-mini, onexplayer-3 — **done 2026-07-16**:
        all 11 translated DE/FR/IT, appended to the existing seeded files (nintendo-switch +
        4B's 17 devices present at write time), validated with
        `node -e "JSON.parse(...)"` — all three files now have 29 devices in matching order.
- [x] cameras (57) — **57/57 done 2026-07-17**: canon-rebel-t7 seed + 5A/5B/5C all
      translated DE/FR/IT by a background agent. Note: the agent's task runner reported
      `status: failed` / stalled after a 600s watchdog timeout, but that happened during a
      *post-write validation* step, not during the actual writes — independently verified
      afterward: all three `data/categories-{de,fr,it}/cameras.json` files have 57 devices,
      valid JSON, no duplicate ids, `category` correctly set to `"cameras"`, identical id
      order across all three locales, and zero ids missing vs. the 57-device EN source. Did
      not re-run per-entry content spot-checks beyond one sample — worth a closer read before
      the smoke-test build if time allows.
  - [x] 5A — Canon + Panasonic + Blackmagic (17): remaining 11 canon-* ids, all 4
        panasonic-* ids, bmpcc-4k, bmpcc-6k-pro — done 2026-07-17
  - [x] 5B — Nikon + Leica (18): all 12 nikon-* ids, all 6 leica-* ids — done 2026-07-17
  - [x] 5C — Sony + Fujifilm (21): all 11 sony-* ids, all 10 fujifilm-* ids — done 2026-07-17

**Note on "[x/ ]" checkboxes above (2026-07-16):** these categories now have their first
device seeded in `data/categories-{de,fr,it}/{category}.json` (one representative device
translated per category, to unblock every category file at once rather than fully finishing
one category before starting the next). The box will flip to a plain `[x]` only once *all*
devices in that category are translated and smoke-tested, per the original rule at the top
of Tier 1B — don't treat "[x/ ]" as done, it's a partial/in-progress marker.

**Bug found while seeding dash-cams (2026-07-16), fixed same day:** `viofo-a229-pro` failed
to generate a page in **every** locale, including plain English — pre-existing, not
introduced by this session. Root cause was two-layered: (1) `loadSDCardData()` in
`scripts/generator/helpers.js` builds an "adapter card" from each `data/sdcards.json` entry
but only copied `series.amazonSearchUrl` — it silently dropped `amazonDirectUrl` and
`affiliateUrl`, so any card using the newer `affiliateUrl`-only format (7 of 65 cards,
including `speederlash-64gb-2pack`) ended up with `amazonSearchUrl: undefined` on the adapter
object regardless of what the source JSON actually had. (2) `generate-device-pages.js` then
called `.includes('?')` directly on that undefined value in two spots (lines ~106 and ~315)
without a fallback chain, unlike `generate-card-pages.js`/`generate-compare.js`/
`promotion-generator.js` which already did `card.affiliateUrl || card.amazonSearchUrl`
correctly. **Fixed:** `helpers.js` adapter now also copies `amazonDirectUrl`/`affiliateUrl`
through, and both `generate-device-pages.js` call sites now fall back through
`amazonDirectUrl || amazonSearchUrl || affiliateUrl`. Verified via full `npm run build:site`
with all locales temporarily enabled — `viofo-a229-pro` now builds cleanly in en/ja/de/fr/it;
`tesla-model-3-sentry` and `best-sd-card-4k-dash-cam` (the other two devices in the original
"3 devices failed" list) are fixed too since they hit the same root cause. `locales.json` was
reverted back to `de/fr/it: false` after the test build. Was seeded with `viofo-t130-pro`
instead as a workaround at the time; `viofo-a229-pro` itself is now also translatable and
should be picked up in the dash-cams full batch.

**Separate, still-open bug found during the fix verification:** `anker-powerexpand-2in1`
(a JA-only accessory device from `data/categories-ja/accessories.json`) fails with
`Cannot read properties of undefined (reading 'slice')` at
`generate-device-pages.js:392` (`device.recommendedBrands.slice(0, 3)`) — this device's JSON
entry is missing a `recommendedBrands` array entirely. Confirmed pre-existing (fails
identically on `main` before this session's changes) and unrelated to the DE/FR/IT
localization work, so left unfixed. Out of scope for Tier 1B; note here so it isn't
re-discovered from scratch later.

- [x] Fixed source-data duplicate bug found while scoping these batches (2026-07-16): the
      dedup done in the prior session only edited the generated `data/devices.json`, not the
      canonical `data/categories/{cameras,drones}.json` source files — so `dji-mini-3`
      (drones), `canon-rebel-t7` and `nikon-d850` (cameras) were still duplicated at the
      source and would have resurfaced on every rebuild. Removed the thin stub copy (0 FAQs)
      from the category source files directly; verified with `npm run build:site` — still
      191 EN device pages, no regressions. **Never hand-edit `devices.json` /
      `devices-{locale}.json` directly — they're generated by `mergeLocaleDeviceCategories()`
      on every build; fix `data/categories/*.json` (or `data/categories-{locale}/*.json`)
      instead.**
- [ ] Each device needs explicit `faq` array — but now only for *custom* device-specific
      questions (1-2 per device is typical, see security-cameras batch). The generic 6-8
      question boilerplate FAQ block is now auto-generated per locale, see finding below —
      don't hand-translate the generic questions, only the custom ones from the EN source.
- [ ] Spot-check a handful of translated entries per category before moving on
- [x] Full clean build + local serve test with complete devices-de.json / -fr.json / -it.json
      — **done 2026-07-17**: ran `npm run build:site` with all locales enabled — 191 EN
      device pages plus full DE/FR/IT/JA sets generated with no new failures (only the
      pre-existing, unrelated `anker-powerexpand-2in1` failure, documented above). Local
      `http-server dist` smoke test confirmed 200s and correct rendering on sampled DE/FR/IT
      pages.
- [ ] Closer content-quality read of the cameras batch (only 1 device was spot-checked
      when it was translated — see cameras entry above)
- [x] Sitemap index — **done 2026-07-17**: added `generateSitemapIndex()` to
      `generate-core-files.js`, writing `dist/sitemap-index.xml` (a `<sitemapindex>` listing
      every enabled locale's `sitemap.xml`). `robots.txt` now points crawlers at the index
      first (for Search Console/Webmaster Tools submission) while still listing each
      individual locale sitemap for crawlers that only read robots.txt directly.

## Auto-FAQ generator — now covers DE/FR/IT (2026-07-16)

**Finding:** `generate-device-pages.js` previously only ran the programmatic FAQ generator
(`generateFAQs.js`, 6-8 generic device-spec-driven Q&As) for `en`/`ja`; DE/FR/IT fell through
to `device.faq || []`, meaning translated pages were shipping with only the 1-2 hand-curated
custom FAQs and missing the generic block that gives EN/JA pages their FAQ depth/SEO
richness. This was a real content gap, not just a translation TODO.

**Fix:** added `scripts/generator/generateFAQs-de.js`, `-fr.js`, `-it.js` (same structure as
the existing `generateFAQs-ja.js`) and refactored `generateFAQs.js` to dispatch by locale via
a `LOCALE_GENERATORS`/`LOCALE_MERGERS` map instead of a single `isJapanese` boolean.
`generate-device-pages.js` now calls `generateFAQs(device, sdcardsMap, locale)` for every
locale uniformly. Verified via direct Node smoke test (security-cameras batch): DE/FR/IT
each now produce 6 generated + 2 custom = 8 merged FAQs, matching EN/JA parity. Full
`npm run build:site` (en/ja only, locales.json untouched) still passes with no regressions —
**did not flip `locales.json` `enabled` flags to test DE/FR/IT build output directly, per
standing decision to keep them `false` until the html-lang/title gap is fixed (see Tier 1A)**.

Practical effect: **going forward, translation batches only need the custom/curated
`faq` entries from the EN source data (typically 0-2 per device), not the full generic
question set** — the generator produces those automatically in-language now. This cuts the
FAQ-translation surface for the remaining ~150 devices significantly.

## Tier 2 — EN-parity chrome (optional, decide after Tier 1 validated, per locale)
- [ ] `src/templates/category-{de,fr,it}.html` (falls back to category.html otherwise — has some untranslated hardcoded strings)
- [ ] `src/templates/categories-index-{de,fr,it}.html` (page no-ops without it)
- [ ] `src/templates/device-{de,fr,it}.html` (optional, same fallback caveat)
- [ ] Verify `data/category-slugs.json` `label.de` / `label.fr` / `label.it` fields for all categories
- [ ] `CATEGORY_DESCRIPTIONS` (generate-categories-index.js) — add `de`/`fr`/`it` entries
- [ ] `CATEGORY_INTROS` (generate-category-pages.js) — add `de`/`fr`/`it` entries
- [ ] If legal pages wanted: add "legal" to nav sections, create about-/privacy-/terms- pages per locale
- [ ] If guides wanted: add "guides" to nav sections, populate GUIDES_BY_LOCALE + guide templates
- [ ] Consider adding 3D Printers & Fabrication + Music Production for DE specifically (see scope note above)

## Tier 3 — Full EN parity (separate design effort, not just data entry, per locale)
- [ ] `data/sdcards-{de,fr,it}.json` (currently falls back to English sdcards.json)
- [ ] Parameterize generateCalculatorPages by locale
- [ ] Parameterize generateComparePage by locale
- [ ] Parameterize generateReaderPages by locale
- [ ] Parameterize generateCarPages by locale

---

## Quota-saving reminders for future sessions
- Don't Read full devices.json/devices-de.json/etc (300KB+) — Grep for the category or use Read with offset/limit.
- Translate DE+FR+IT together per category batch in the same turn (see Tier 1B) — reading
  the source category once and producing all three outputs is cheaper than three separate
  passes per language.
- Switch to Haiku (`/model`) for straightforward translation-only turns; Sonnet for template/build logic.
- Spread batches across days — quota resets on a rolling window. No rush to finish all three
  languages at once — bit by bit is fine.
- Skip translating the `notes` field (internal-only, never rendered — see workflow rules above).
- Write to `data/categories-{locale}/{category}.json`, not the merged `devices-{locale}.json`
  directly — the build script regenerates the merged file every time.
