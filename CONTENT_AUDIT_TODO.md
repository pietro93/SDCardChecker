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
- [ ] raspberry-pi-4-model-b (computing-and-tablets.json)
- [ ] raspberry-pi-5 (computing-and-tablets.json)
- [ ] gopro-hero-12 (action-cameras.json)
- [ ] gopro-hero-13 (action-cameras.json)
- [ ] gopro-hero-max (action-cameras.json)
- [ ] dji-mini-4-pro (drones.json)
- [ ] dji-mini-4k (drones.json)
- [ ] dji-osmo-action-4 (action-cameras.json)
- [ ] dji-mini-3 (drones.json)

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

- [ ] cameras.json — remaining ~50 devices (not already covered above)
- [ ] gaming-handhelds.json — remaining ~28 devices
- [ ] drones.json — remaining ~20 devices
- [ ] computing-and-tablets.json — remaining ~18 devices
- [ ] action-cameras.json — remaining ~9 devices
- [ ] audio-and-hi-fi.json — all 11 devices
- [ ] smartphones.json — all 7 devices
- [ ] 3d-printers.json — all 7 devices
- [ ] music-production.json — all 7 devices
- [ ] dash-cams.json — all 5 devices
- [ ] security-cameras.json — all 3 devices

---

## Findings log

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
