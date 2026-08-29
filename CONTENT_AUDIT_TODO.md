# Content Audit TODO (English source data)

Goal: revise `data/categories/*.json` (191 devices) for accuracy, up-to-dateness, and
helpfulness — prioritized by traffic, not brute-forced top-to-bottom. English only;
localization is out of scope for this effort.

**Never edit `data/devices.json` directly** — it's a generated merge output
(`npm run build:site` / `scripts/generator/build.js`). Always edit the source file in
`data/categories/`.

## Quota-saving rules for future sessions
- Work one tier (or one sub-batch within a tier) per session. Don't try to clear a whole
  tier in one go.
- When editing a device, read only that device's JSON block (search for its `"id"`),
  not the whole category file.
- Check items off as you go — the checkbox state in this file is the only freshness
  record we have (there's no per-device `lastUpdated` field in the schema).
- Log anything notable in the Findings section below so it isn't rediscovered later.
- After a batch, run `npm run build:site` to confirm the merge/build still succeeds,
  and spot check `node scripts/audit-card-coverage.js` / `node verify-devices.js` if you
  touched `recommendedBrands` or `relatedDevices`.

## Per-device audit checklist
For each device, check:
1. **`whySpecs`** — still factually accurate, reads naturally, no outdated claims
   (old firmware assumptions, wrong resolution/bitrate, discontinued card lines).
2. **`faq`** (hand-authored entries only — a separate generic FAQ block is
   auto-generated at build time, don't duplicate it) — still relevant and non-redundant
   with the generated block.
3. **`sdCard`** (`type`, `minSpeed`, `minWriteSpeed`, `recommendedCapacity`,
   `maxCapacity`) — cross-check against current manufacturer specs or well-established
   real-world guidance; flag anything that looks stale or was clearly a guess.

## Progress log format
`- [ ] device-id (category-file.json) — audited YYYY-MM-DD, notes`

---

## Tier 1 — Top traffic (from GSC_INSIGHTS_AND_IMAGE_PRIORITY.md, Jan 2026 data)

- [x] steam-deck (gaming-handhelds.json) — audited 2026-07-17. Updated maxCapacity/testedMaxCapacity from "1TB tested" to 2TB (SanDisk Extreme, Lexar Play 2TB confirmed working per 2026 community reports); whySpecs updated to reflect 2TB support and note the 2026 NAND shortage price spike.
- [x] nintendo-switch (gaming-handhelds.json) — audited 2026-07-17, no changes needed. 2TB support, UHS-I-only guidance, Nintendo-branded card compatibility all still accurate.
- [x] nintendo-switch-lite (gaming-handhelds.json) — audited 2026-07-17, no changes needed.
- [x] nintendo-switch-oled (gaming-handhelds.json) — audited 2026-07-17, no changes needed.
- [x] nintendo-switch-2 (gaming-handhelds.json) — audited 2026-07-17. FAQ claim "microSD Express cards are still rare and expensive" was stale (was accurate near launch, not by mid-2026) — updated to reflect wide retail availability (Samsung/SanDisk/PNY licensed cards at Target/Walmart/Best Buy) while still flagging the 2026 NAND shortage price increases. Backward-compatibility and speed claims (800MB/s Express vs ~100MB/s UHS-I) confirmed still accurate.
- [x] raspberry-pi-5 (computing-and-tablets.json) — audited 2026-08-07. Added SDR104/A2 command-queuing
      details (Pi 5 is the first Pi where A2 actually matters — Pi 4's SD host never used command
      queuing); bumped maxCapacity from "No official limit" to the real 2TB SDXC ceiling; added 2 FAQs;
      fixed relatedDevices (was empty). Fixed a separate image-routing bug found while auditing: the
      `getDeviceImageFallback()` map in `scripts/generator/helpers.js` pointed real product photos
      (raspberry-pi-4-model-b.webp, -pi-3-model-b-plus.webp, -pi-zero-2-w.webp) at the generic
      raspberry-placeholder.webp instead — fixed the map, unrelated to any specific device audit.
- [x] raspberry-pi-4-model-b (computing-and-tablets.json) — audited 2026-08-07. whySpecs corrected: A2 is
      not worth the premium on the Pi 4 specifically (the SD host doesn't support command queuing, so A2
      performs like A1 here) — that nuance was missing and readers could easily overspend. Added FAQ on
      why a faster card doesn't help past ~50MB/s on this board. maxCapacity bumped to 2TB SDXC ceiling.
- [x] gopro-hero-12 (action-cameras.json) — audited 2026-08-07. maxCapacity was stale at 512GB; GoPro's
      current guidance (already documented on the newer gopro-max-2 entry in this same file) is A2/V30
      up to 1TB — updated sdCard, whySpecs, notes to match.
- [x] gopro-hero-13 (action-cameras.json) — audited 2026-08-07. Same 512GB→1TB / A2 fix as Hero 12, plus
      added a FAQ on UHS-I vs UHS-II slot behavior and a FAQ on the 1TB capacity change. Cross-linked
      gopro-hero-14-black into relatedDevices (didn't exist when this device was last touched).
- [x] gopro-hero-max (action-cameras.json) — audited 2026-08-07, found two factual errors: (1) whySpecs
      claimed "standard 4K" but the original GoPro MAX tops out at 1440p60 in HERO mode (5.6K30 is
      360-mode only) — corrected. (2) 360-mode recording-time FAQ understated capacity by more than half
      (claimed 1.5hrs/128GB; actual bitrate math is ~2.5hrs). Also fixed the product name throughout the
      site — it's "GoPro MAX", not "GoPro Hero Max" (the "Hero" prefix only applies to the mainline
      cameras) — updated data/categories*, calculator-content.json, calculator-presets.json,
      device-enrichment.json, and templates across all 5 locales.
- [x] dji-mini-4-pro (drones.json) — audited 2026-08-07. whySpecs previously described only generic
      "4K/60fps" but this drone's actual demanding modes are 4K/100 slow-mo and 10-bit D-Log M — rewrote
      to name them and explain why V30 still covers them (headroom, not peak-vs-sustained confusion).
      Added FAQ on high-frame-rate/D-Log M card needs. Fixed relatedDevices — was missing dji-mini-5-pro
      and dji-mini-4k entirely.
- [x] dji-mini-4k (drones.json) — audited 2026-08-07. maxCapacity was an outlier at 256GB vs 512GB on
      every sibling Mini in the dataset (Mini 3, Mini 3 Pro) with no source cited for the lower number —
      corrected to 512GB (DJI's actual published max) and reframed the FAQ around "you don't need that
      much, not because you can't have it."
- [x] dji-mini-3 (drones.json) — audited 2026-08-07, no changes needed (sdCard/whySpecs/FAQ already
      accurate).
- [x] dji-osmo-action-4 (action-cameras.json) — audited 2026-08-07, no content changes needed (already
      detailed and accurate — U3/V30/2TB is correctly sourced to DJI's own spec). Only fix: cross-linked
      the newer dji-osmo-action-6 into relatedDevices (didn't exist when this device was last touched).

## Tier 2 — Popular / homepage-featured + secondary GSC signal

- [x] canon-eos-r5 (cameras.json) — audited 2026-07-17, fixed 8K RAW/CFexpress vs SD accuracy
- [x] sony-a6700 (cameras.json) — audited 2026-07-17, fixed false dual-slot claim (single slot)
- [x] dji-mavic-3 (drones.json) — audited 2026-07-17, no changes needed
- [x] nikon-z9 (cameras.json) — audited 2026-07-17, no changes needed
- [x] lenovo-legion-go (gaming-handhelds.json) — audited 2026-07-17, no changes needed
- [x] lenovo-legion-go-s (gaming-handhelds.json) — audited 2026-07-17, no changes needed
- [x] potensic-atom (drones.json) — audited 2026-07-17, no changes needed
- [x] potensic-atom-se (drones.json) — audited 2026-07-17, no changes needed
- [x] canon-g7x-mark-iii (cameras.json) — audited 2026-07-17, no changes needed
- [x] dji-osmo-pocket-3 (action-cameras.json) — audited 2026-07-17, no changes needed (already well detailed)
- [x] fujifilm-xe5 (cameras.json) — audited 2026-07-17, no changes needed
- [x] leica-q3 (cameras.json) — audited 2026-07-17, fixed false dual-slot + false 8K video claims
- [x] insta360-x3 (action-cameras.json) — audited 2026-07-17, no changes needed
- [x] insta360-x4 (action-cameras.json) — audited 2026-07-17, no changes needed

Also fixed while in cameras.json (not on the original Tier 2 list but shares the Q3's
copy-pasted spec block): **leica-q3-43** — same dual-slot/8K errors as leica-q3, corrected.

## Tier 3 — Category sweep (everything else, largest files first)

Work through remaining devices category by category once Tiers 1–2 are done.
Sub-batch each file (e.g. by brand) rather than trying a whole file in one session.

- [ ] cameras.json — remaining ~40 devices (Canon sub-batch done, see below)
  - [x] canon-eos-r6-mark-ii — audited 2026-07-17, no changes needed
  - [x] canon-eos-r50 — audited 2026-07-17, no changes needed
  - [x] canon-eos-r7 — audited 2026-07-17, no changes needed
  - [x] canon-eos-r10 — audited 2026-07-17, no changes needed
  - [x] canon-eos-r8 — audited 2026-07-17, no changes needed
  - [x] canon-rebel-t7 — audited 2026-07-17, fixed stale "still good in 2024?" FAQ question
  - [x] canon-g7x-mark-ii — audited 2026-07-17, no changes needed
  - [x] canon-eos-r100 — audited 2026-07-17, no changes needed
  - [x] canon-eos-r6 — audited 2026-07-17, no changes needed
  - [x] canon-eos-r5-mark-ii — audited 2026-07-17, no changes needed (already detailed/accurate)
- [x] gaming-handhelds.json — 33/33 done. PC-handheld sub-batch 2026-07-17 (9 devices) +
      retro/emulation sub-batch 2026-07-18 (19 devices: anbernic-rg353v, -rg35xx-plus,
      -rg556, -rg35xx-sp, -rg406v-rg406h, -rg-cube, miyoo-mini-plus, retroid-pocket-4-pro,
      -5, -6, -mini, egret-ii-mini, analogue-pocket, sony-ps-vita-sd2vita, r36s,
      trimui-brick, ayn-odin-3-odin-2-portal, lenovo-legion-go, lenovo-legion-go-s — the
      latter two already covered in Tier 2). Only bugs found were in the PC-handheld batch
      (see findings log); the retro/emulation batch was already accurate.
  - [x] asus-rog-ally — audited 2026-07-17, no changes needed
  - [x] asus-rog-ally-x — audited 2026-07-17, no changes needed
  - [x] rog-xbox-ally-x — audited 2026-07-17, no changes needed
  - [x] lenovo-legion-go-gen-2 — audited 2026-07-17, no changes needed
  - [x] msi-claw — audited 2026-07-17, no changes needed
  - [x] msi-claw-8-ex-ai-plus — audited 2026-07-17, no changes needed
  - [x] gpd-win-mini — audited 2026-07-17, fixed recommendedBrands bug (full-size SD card id recommended for a microSD-only device)
  - [x] onexplayer-3 — audited 2026-07-17, fixed stale note claiming no product photo exists (one does)
  - [x] nintendo-3ds-xl — audited 2026-07-17, no changes needed
  - [x] anbernic-rg353v, anbernic-rg35xx-plus, anbernic-rg556, anbernic-rg35xx-sp,
        anbernic-rg406v-rg406h, anbernic-rg-cube, miyoo-mini-plus, retroid-pocket-4-pro,
        retroid-pocket-5, retroid-pocket-6, retroid-pocket-mini, egret-ii-mini,
        analogue-pocket, sony-ps-vita-sd2vita, r36s, trimui-brick,
        ayn-odin-3-odin-2-portal — audited 2026-07-18, no changes needed
- [x] drones.json — 26/26 done. DJI sub-batch 2026-07-17 (11 devices) + non-DJI sub-batch
      2026-07-18 (11 devices: autel-evo-ii-pro-v3, autel-evo-nano-plus,
      autel-evo-lite-plus, skydio-2-plus, skydio-x10, fimi-mini-3, holy-stone-hs175d,
      holy-stone-hs720, holy-stone-hs360s, hoverair-x1-pro, hoverair-x1-pro-max,
      walksnail-moonlight — plus potensic-atom/-se and dji-mavic-3 already covered in
      Tier 2). Only bug found was in the DJI batch (see findings log); non-DJI batch was
      already accurate.
  - [x] dji-mini-4-pro — audited 2026-07-17, no changes needed
  - [x] dji-mini-3-pro — audited 2026-07-17, no changes needed
  - [x] dji-air-3s — audited 2026-07-17, no changes needed
  - [x] dji-air-3 — audited 2026-07-17, fixed relatedDevices bug (self-referenced itself)
  - [x] dji-mini-4k — audited 2026-07-17, no changes needed
  - [x] dji-mini-3 — audited 2026-07-17, no changes needed
  - [x] dji-mini-2-se — audited 2026-07-17, no changes needed
  - [x] dji-avata-2 — audited 2026-07-17, no changes needed
  - [x] dji-mini-5-pro — audited 2026-07-17, no changes needed
  - [x] autel-evo-ii-pro-v3, autel-evo-nano-plus, autel-evo-lite-plus, skydio-2-plus,
        skydio-x10, fimi-mini-3, holy-stone-hs175d, holy-stone-hs720, holy-stone-hs360s,
        hoverair-x1-pro, hoverair-x1-pro-max, walksnail-moonlight — audited 2026-07-18, no
        changes needed
  - [x] dji-avata-360 — audited 2026-07-17, no changes needed
  - [x] dji-neo — audited 2026-07-17, no changes needed
- [ ] computing-and-tablets.json — remaining ~18 devices
- [ ] action-cameras.json — remaining ~9 devices
- [ ] audio-and-hi-fi.json — all 11 devices
- [x] smartphones.json — all 7 original no-slot devices audited/enriched 2026-07-18 (see
      findings log). Note: file now has 13 devices total; the other 6
      (sony-xperia-1-vi, samsung-galaxy-a55-5g, moto-g-stylus-5g-2025,
      samsung-galaxy-xcover-7, xiaomi-redmi-note-15, ulefone-armor-33) were added since
      this TODO was written and were already well-detailed — no changes needed.
- [ ] 3d-printers.json — all 7 devices
- [ ] music-production.json — all 7 devices
- [ ] dash-cams.json — all 5 devices
- [ ] security-cameras.json — all 3 devices

---

## Findings log

### 2026-08-29 — Meta description pass (English only)
193 of 222 English devices had no curated `metaDescription` (falling back to a
7-template rotation in `generateUniqueMetaDescription()` in
`scripts/generator/generate-device-pages.js`). Confirmed the rotation wasn't producing
literal duplicates across the built site, but the templates leaned on repetitive,
low-value CTA filler ("Shop now.", "Compare now.", "See top brands.") across ~150+
pages — thin/formulaic against the BRANDING_UX_UI_GUIDE voice rules. Rewrote all 7
fallback templates to be more specific and direct (still auto-generated, still varied
by device index, no template changes needed elsewhere).

Also found 12 *already-curated* metaDescriptions (dji-osmo-pocket-3, dji-osmo-action-4,
dji-osmo-action-6, asus-rog-ally-x, rog-xbox-ally-x, and the 7 smartphones.json
no-slot devices from the 2026-07-18 batch) running past Google's ~160-char SERP
truncation limit — the generator only truncates the template fallback, not curated
text. Trimmed all 12 to fit under 160 chars while keeping the factual claims intact.

Hand-wrote curated `metaDescription` entries for a first high-traffic batch of 27
devices previously missing one — the Tier 1/Tier 2 devices from this file's audit
list: gopro-hero-12/-13/-max, insta360-x3/-x4, canon-eos-r5, sony-a6700, nikon-z9,
canon-g7x-mark-iii, fujifilm-xe5, leica-q3/-q3-43, raspberry-pi-5/-4-model-b,
dji-mini-4-pro/-mavic-3/-mini-4k/-mini-3, potensic-atom/-se, nintendo-switch/-oled/
-lite/-2, steam-deck, lenovo-legion-go/-go-s. Each description was written from that
device's actual `sdCard`/`whySpecs` fields, not templated.

Separately fixed `validate-schemas.js` (was hardcoded to a single stale
`dist/devices/gopro-hero-max/index.html` path that no longer exists post-migration —
current English pages live at `dist/categories/{category}/{slug}/index.html`).
Rewrote it to scan every English device page and check FAQPage/ItemList/
AggregateRating structure, not just JSON parseability.

Rebuilt (`npm run build:site`) — 222 English device pages, unchanged count. Confirmed
0 pages over the 160-char meta description limit (was 12), 0 pages missing a meta
description, all 249 English pages pass `validate-schemas.js`, and
`audit-card-coverage.js`/`verify-devices.js` are still clean.

**Remaining**: 166 devices still lack a curated `metaDescription` (down from 193) and
use the improved template fallback. Next high-value batch: the rest of Tier 3
(computing-and-tablets.json, action-cameras.json, audio-and-hi-fi.json,
3d-printers.json, music-production.json, dash-cams.json, security-cameras.json).

### 2026-07-18 — Tier 3: smartphones.json, the 7 no-built-in-slot devices (iphone-15,
iphone-14, iphone-13, iphone-14-pro-max, iphone-se, samsung-galaxy-s23, google-pixel-8)
These were the thinnest entries in the dataset — most `whySpecs` were 1-2 generic
sentences, and only samsung-galaxy-s23 had an `faq`/`metaDescription`. Considered removing
them outright (they lack a hardware SD slot) but decided against it: the site already
models "no slot, external reader required" as a first-class case (`requiresReader`,
`recommendedReaders`), and these pages target real high-intent queries ("does iphone 15
have sd card slot"). Removing them would have thrown away legitimate search-matching
content to fix a thin-content problem that enrichment already solves. Rewrote each with
genuine device-specific reasoning instead of boilerplate:
- **iphone-15**: added the base-vs-Pro USB 2.0/USB 3 speed split (only the 15 Pro/Pro Max
  actually benefit from a fast UHS-II reader).
- **iphone-14 / iphone-13**: explained the Lightning-port USB 2.0 ceiling that makes a
  UHS-II card pointless on these Lightning-only models.
- **iphone-14-pro-max**: clarified ProRes video can't record to an SD card via a Lightning
  reader at all (needs an external SSD over USB 3) — a reader is import/offload only.
- **iphone-se**: reframed around the 64GB base tier making a reader more of a practical
  necessity than on higher-storage iPhones.
- **samsung-galaxy-s23**: kept the existing accurate content, added a second FAQ on buying
  a higher storage tier up front since there's no expansion path.
- **google-pixel-8**: added the fact that no Pixel has ever had a microSD slot (not a
  recent removal like Samsung) plus 8-vs-8-Pro storage-tier reasoning.
- Added `metaDescription` to the 5 entries missing it, added 1-2 device-specific `faq`
  entries to the 6 that had none, and diversified `searchTerms` (added direct-question
  variants like "does pixel 8 have sd card slot").
- Discovered mid-audit that `smartphones.json` now has **13 devices**, not the 7 this
  TODO was scoped for — 6 more (sony-xperia-1-vi, samsung-galaxy-a55-5g,
  moto-g-stylus-5g-2025, samsung-galaxy-xcover-7, xiaomi-redmi-note-15, ulefone-armor-33)
  were added in a separate session and were already well-detailed (rich whySpecs, FAQ) —
  left untouched.
- Rebuilt (`npm run build:site`) — 196 English device pages, unchanged count. Confirmed
  clean with `scripts/audit-card-coverage.js` and `verify-devices.js` (no broken card
  refs, no orphaned relatedDevices).

### 2026-07-18 — Tier 3 batch 4: gaming-handhelds.json retro/emulation family (19 devices) + drones.json non-DJI brands (11 devices)
Completed both files. Audited the retro/emulation handheld family (anbernic-rg353v,
-rg35xx-plus, -rg556, -rg35xx-sp, -rg406v-rg406h, -rg-cube, miyoo-mini-plus,
retroid-pocket-4-pro/-5/-6/-mini, egret-ii-mini, analogue-pocket, sony-ps-vita-sd2vita,
r36s, trimui-brick, ayn-odin-3-odin-2-portal, plus re-confirming lenovo-legion-go/-go-s
which were already Tier 2 done) and the non-DJI drone brands (autel-evo-ii-pro-v3,
autel-evo-nano-plus, autel-evo-lite-plus, skydio-2-plus, skydio-x10, fimi-mini-3,
holy-stone-hs175d/-hs720/-hs360s, hoverair-x1-pro/-pro-max, walksnail-moonlight).
No factual errors, broken references, or self-references found in either sub-batch — all
30 devices were already accurate and well-detailed (dual-slot OS/game-card handhelds,
capacity ceilings, speed-class guidance, and drone SD-card-error FAQs all checked out).
**gaming-handhelds.json and drones.json are now fully audited (33/33 and 26/26).**
- Rebuilt (`npm run build:site`) — 190 English device pages, unchanged. Confirmed clean
  with `scripts/audit-card-coverage.js` (no broken card references) and
  `verify-devices.js` (no orphaned relatedDevices).
- Next up for future sessions: cameras.json remaining ~40 devices (Fujifilm/Leica/
  Panasonic/Nikon/Sony brand blocks — see Tier 3 batch 1 note above), then
  computing-and-tablets.json (~18), action-cameras.json (~9), and the five untouched
  files (audio-and-hi-fi, smartphones, 3d-printers, music-production, dash-cams,
  security-cameras).

### 2026-07-17 — Tier 3 batch 2: gaming-handhelds.json (PC-handheld family, 9 devices)
### 2026-07-17 — Tier 3 batch 3: drones.json (DJI family, 11 devices)
Audited the PC/Windows handheld sub-batch (asus-rog-ally, asus-rog-ally-x, rog-xbox-ally-x,
lenovo-legion-go-gen-2, msi-claw, msi-claw-8-ex-ai-plus, gpd-win-mini, onexplayer-3,
nintendo-3ds-xl) and the DJI sub-batch of drones.json (dji-mini-4-pro, -mini-3-pro, -air-3s,
-air-3, -mini-4k, -mini-3, -mini-2-se, -avata-2, -mini-5-pro, -avata-360, -neo). Most were
already accurate and well-detailed; found two real data bugs (not content-accuracy issues):
- **gpd-win-mini**: `recommendedBrands` pointed at `sandisk-extreme-pro-sd-uhs2`, which is a
  **full-size SD card** (`type: "SD"` in `sdcards.json`) — but the GPD Win Mini only has a
  microSD slot. Replaced with `sandisk-extreme-pro-microsd-v60` and added
  `kingston-canvas-react-plus-microsd` (both actual UHS-II microSD cards) to match the
  device's V60/V90 recommendation.
- **dji-air-3**: `relatedDevices` included `"dji-air-3"` — the device referencing itself.
  Replaced the self-reference with `dji-mini-4k`, a device it doesn't already link to.
- **onexplayer-3**: `notes` field claimed "No dedicated product photo yet — uses the generic
  gaming-handheld placeholder image," but `img/devices/gaming-consoles/onexplayer-3.webp`
  now exists (a real image was added since the note was written). Removed the stale claim.
  `notes` isn't rendered on the site, so this was a documentation-accuracy fix only.
- Neither `audit-card-coverage.js` nor `verify-devices.js` had flagged the gpd-win-mini
  full-size-vs-microSD mismatch, since both cards exist in `sdcards.json` (it's a semantic
  bug, not a missing-reference bug) — worth keeping an eye out for this pattern (wrong card
  *type* recommended, not just a broken *id* reference) in future sweeps.
- Rebuilt (`npm run build:site`) — 190 English device pages, unchanged. Confirmed clean with
  `scripts/audit-card-coverage.js` (no broken card references) and `verify-devices.js` (no
  orphaned relatedDevices).
- Remaining for future sessions: gaming-handhelds.json retro/emulation family (~19 devices:
  anbernic-*, retroid-*, miyoo-mini-plus, r36s, trimui-brick, ayn-odin-3-odin-2-portal,
  egret-ii-mini, analogue-pocket, sony-ps-vita-sd2vita); drones.json non-DJI brands (~15
  devices: autel-*, skydio-*, fimi-mini-3, holy-stone-*, hoverair-*, walksnail-moonlight).

### 2026-07-17 — Tier 3 batch 1: cameras.json, Canon sub-batch (10 devices)
Audited the 10 remaining Canon entries in `cameras.json` (canon-eos-r6-mark-ii, -r50,
-r7, -r10, -r8, -rebel-t7, -g7x-mark-ii, -r100, -r6, -r5-mark-ii). Specs, slot counts,
and speed-class guidance all checked out against known hardware — only one issue found:
- **canon-rebel-t7**: FAQ question "Is this camera still good in 2024?" was a
  hardcoded-year phrasing that had gone stale (now 2026). Reworded to the evergreen
  "Is this camera still worth buying?" — answer content was still accurate, only the
  question needed fixing. Worth scanning other files for similar hardcoded-year FAQ
  questions in a future sweep.
- Rebuilt (`npm run build:site`) — 190 English device pages, unchanged. Confirmed clean
  with `scripts/audit-card-coverage.js` and `verify-devices.js`.
- Remaining cameras.json devices for a future session: fujifilm-x-s20, sony-a7-iv,
  bmpcc-4k, bmpcc-6k-pro, nikon-z8, panasonic-lumix-s1h, fujifilm-x100vi, and everything
  from fujifilm-xt5 onward (Fujifilm/Leica/Panasonic/Nikon/Sony brand blocks untouched).

### 2026-07-17 — Tier 2 batch: cameras, drones, gaming handhelds, action cams
Audited all 14 Tier 2 devices. Found and fixed three real factual errors, rest were
already accurate:
- **canon-eos-r5**: `whySpecs`/FAQ implied a plain V60 SD card could shoot 8K RAW.
  In reality 8K RAW (Cinema RAW Light) can only be recorded to the CFexpress Type B
  slot — the SD slot can't do it at all — and standard 8K on the SD slot needs V90,
  not V60 (V60 is only enough for 4K). Corrected `sdCard.minSpeed`/`minWriteSpeed`,
  `whySpecs`, and both FAQ entries to reflect the CFexpress-vs-SD split.
- **sony-a6700**: both `whySpecs` and a FAQ entry claimed the A6700 has dual SD card
  slots ("Sony A6700 provides dual SD UHS-II card slots"). The A6700 is a single-slot
  APS-C body — dual slots are reserved for Sony's higher-end full-frame bodies (e.g.
  A7 IV, which this same file correctly describes as dual-slot). Fixed copy and
  replaced the "do I need two cards" FAQ with a single-slot-appropriate question.
- **leica-q3** and **leica-q3-43** (copy-pasted spec block, same bug in both): claimed
  "Dual SD UHS-II" slots and an "8K video capability" requiring V90 cards. The Leica Q3
  is a single SD UHS-II slot camera with a 60MP stills-focused sensor; video tops out
  at 4K/30p — there is no 8K video mode. Corrected `sdCard.type`/`minSpeed`/
  `minWriteSpeed` to a plain single-slot V60 spec, rewrote `whySpecs`/notes, and
  replaced the "do I need V90 for 8K" FAQ with a "does it shoot 8K" FAQ on both entries.
- Remaining 10 devices (dji-mavic-3, nikon-z9, lenovo-legion-go, lenovo-legion-go-s,
  potensic-atom, potensic-atom-se, canon-g7x-mark-iii, dji-osmo-pocket-3, fujifilm-xe5,
  insta360-x3, insta360-x4) reviewed against current specs/guidance — no changes needed.
- Rebuilt (`npm run build:site`) after edits — 190 English device pages, unchanged.
  Confirmed clean with `scripts/audit-card-coverage.js` and `verify-devices.js`.

### 2026-07-17 — Tier 1 batch 1: Steam Deck + Nintendo Switch family
Web-verified current (mid-2026) facts against the existing copy:
- **Steam Deck 2TB cards**: previously marked "theoretical" max 2TB but only 1TB tested.
  Community reports (SanDisk Extreme 2TB, Lexar Play 2TB) now confirm full 2TB
  compatibility — updated `sdCard.maxCapacity`/`testedMaxCapacity` and `whySpecs`.
- **Switch 2 microSD Express availability**: FAQ said Express cards were "still rare and
  expensive" — true near the June 2025 launch but stale by mid-2026. Samsung, SanDisk,
  and PNY now sell officially licensed Express cards at mainstream retailers (Target,
  Walmart, Best Buy, GameStop). Updated the FAQ answer accordingly, while keeping an
  accurate note that a 2026 global NAND flash shortage has driven up prices across all
  microSD capacities (not just Express) — this is a genuine, verified 2026 market
  condition, not stale info.
- nintendo-switch / -lite / -oled: reviewed, already accurate, no changes needed.
- Rebuilt (`npm run build:site`) after edits — 190 English device pages, unchanged.

### 2026-07-17 — Structural cleanup pass (pre-audit)
Ran `scripts/audit-card-coverage.js` and `verify-devices.js` before starting content
review, per the standard practice from `LOCALIZATION_TODO.md`. Found and fixed:

- **Duplicate device id**: `wyze-cam-v3` existed in both `security-cameras.json` (full,
  well-developed entry with endurance-card guidance and FAQ) and `action-cameras.json`
  (miscategorized — Wyze Cam v3 is not an action camera — sparse, generic `whySpecs`,
  no FAQ, weaker card recommendation). Deleted the `action-cameras.json` duplicate.
- **30 broken `relatedDevices` references** across cameras/drones/gaming-handhelds/etc.
  Most were formatting-typo mismatches against a real device id (fixed, e.g.
  `dji-pocket-3` → `dji-osmo-pocket-3`, `fujifilm-xs20` → `fujifilm-x-s20`,
  `dji-mavic-3-enterprise` → `dji-mavic-3`); the rest referenced devices/models that
  aren't in the catalog at all (e.g. `canon-eos-r3`, `sony-a7s-iii`, `iphone-12`,
  `tesla-model-y`/`tesla-model-s`, `garmin-66s-dash-cam`, `viofo-a229-duo`) and were
  removed rather than guessed at.
- **10 broken `recommendedBrands` card references** (device pointed at a card id not in
  `data/sdcards.json`). Same pattern: fixed clear naming mismatches (e.g.
  `sandisk-extreme-pro-microsd` → `sandisk-extreme-pro-microsd-v60`, `samsung-evo-select`
  → `samsung-evo-select-microsd`), removed references with no real match (e.g.
  `sony-mrw-g2`, which is a card *reader* not a card).
- Confirmed clean via both scripts after regenerating `data/devices.json`
  (`npm run build:site` — never edit `devices.json` by hand, it's generated). Full
  build (`npm run build:site`) succeeds: 190 English device pages generated (was 191
  before dedup).
- Noted but out of scope: 25 "orphaned" cards in `sdcards.json` (never recommended by
  any device) — mostly novelty/niche cards (Nintendo-themed microSDs, vehicle nav
  cards). Not a correctness bug, just unused inventory; left alone.
