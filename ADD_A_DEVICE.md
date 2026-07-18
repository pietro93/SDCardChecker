# Adding a Device — Content Checklist & Workflow

**Status: current, authoritative.** This is the single doc to hand an AI agent (or
follow yourself) when adding a new device to the dataset. It consolidates the
workflow steps scattered across `DEVICES_MANAGEMENT_GUIDE.md`,
`CATEGORY_FILES_WORKFLOW.md`, `DATA_WORKFLOW.md`, `.devices-setup-helper.md`
(same "edit category files, run build" workflow repeated four times — those are
kept for history but this file supersedes them for actual use) plus the
image-sourcing and localization steps those docs don't cover at all.

## 0. Where devices live

- **Source of truth:** `data/categories/<category-file>.json` — one JSON array
  of device objects per category, e.g. `cameras.json`, `drones.json`,
  `gaming-handhelds.json`.
- **Never hand-edit** `data/devices.json` (or `data/devices-<locale>.json`) —
  it's regenerated from the category files by `npm run build:site` every time.
  See [[Never edit devices.json]] — this has caused real data loss before.
- `category` on the device object must match one of the `matchValues` in
  `data/category-slugs.json` (Title Case English is safest, e.g.
  `"Gaming Handhelds"`). Adding a genuinely new category also requires an entry
  in `data/category-slugs.json` (slug, icon, per-locale label) and in
  `scripts/images/category-folders.js` if you'll fetch a hero image for it.

## 1. Required fields (build-time validation)

`scripts/merge-devices.js` only hard-requires these four — anything else
missing is a silent content gap, not a build error:

| Field | Notes |
|---|---|
| `id` | kebab-case, must be globally unique across **all** category files (dupes have shipped before — search first: `grep -r '"id": "your-id"' data/categories/`) |
| `name` | Display name, e.g. `"Canon EOS R6 Mark II"` |
| `category` | Must match `category-slugs.json` `matchValues` |
| `slug` | Usually same as `id`; used in the URL path |

## 2. Content fields (not build-enforced, but expected for a real page)

| Field | Shape | Convention |
|---|---|---|
| `searchTerms` | `string[]` | 4-6 realistic search queries a user would type, e.g. `"gopro hero 13 sd card"`, `"best microsd for hero13 4k video"` — feeds on-page SEO, not just decoration |
| `sdCard.type` | string | e.g. `"microSD (UHS-I)"`, `"SD (UHS-II)"` |
| `sdCard.minSpeed` | string | e.g. `"V30"`, `"Class 10 / U1"` |
| `sdCard.minWriteSpeed` | string | e.g. `"30 MB/s"` |
| `sdCard.recommendedCapacity` | `string[]` | e.g. `["128GB", "256GB"]` |
| `sdCard.maxCapacity` | string | e.g. `"1TB (exFAT)"` |
| `whySpecs` | string, HTML allowed (`<b>`/`<i>`) | 3-6 sentences explaining *why* this device needs this spec — the real bottleneck (speed vs. reliability vs. capacity), not a specs recap. This is the field enrichment/`explanation` is deliberately written to *not* repeat, so write it with genuine device-specific reasoning, not generic boilerplate. |
| `recommendedBrands` | `[{ "id": "<sdcard-id>" }]` | 2-4 entries; each `id` **must exist** in `data/sdcards.json` (`grep '"id": "the-id"' data/sdcards.json` to confirm) — a typo here silently drops the card from the page, no build error |
| `faq` | `[{ "q": ..., "a": ... }]` | **Only 1-2 device-specific custom questions.** The generic 6-8 question boilerplate block (capacity, speed class, formatting, etc.) is auto-generated per locale by `generateFAQs.js` — don't hand-write those, you'd create duplicate/conflicting content. `a` can use `<b>`/`<i>`. |
| `relatedDevices` | `string[]` of other device `id`s | Optional; silently no-ops if empty/missing or an id doesn't resolve. 2-4 genuinely related devices (same brand/lineup or same use-case) reads better than none — consider adding this device's id to *their* `relatedDevices` too for a two-way link, since nothing does that automatically |
| `imageUrl` | path string | Leave unset to use the placeholder/fallback; see the image pipeline (§4) to source a real photo instead |
| `notes` | string | **Internal-only, never rendered on the site** (`grep -r "device.notes" src/` confirms this) and **never translated** — freely write content-team scratch notes here (framing decisions, what to emphasize, why a spec was chosen) |

## 3. Add the device

1. Open the right `data/categories/<file>.json`.
2. Append a device object using the shape above (copy a sibling device in the
   same file as a starting template — cheapest way to match category
   conventions).
3. Confirm the `id` is unique and every `recommendedBrands[].id` exists in
   `data/sdcards.json`.
4. Run `npm run build:site` — merges category files → `data/devices.json`,
   regenerates `dist/`. Watch the console for validation warnings (missing
   required fields, duplicate ids).
5. Spot-check the generated page: `dist/devices/<slug>/index.html` (or
   `dist/categories/<category-slug>/<slug>/index.html` depending on current
   routing — check whichever the build log printed).

## 4. Hero image (optional but recommended)

Full detail: [DEVICE_IMAGE_PIPELINE.md](DEVICE_IMAGE_PIPELINE.md) — see
[[Device image pipeline]]. Short version:

```bash
node scripts/images/fetch-device-image.js <slug>          # stages a candidate
# visually inspect img/devices/_review/<slug>.webp before trusting it
node scripts/images/promote-device-image.js <slug>         # publishes + sets imageUrl
```

Sourced photos are copyrighted product photography (accepted risk for this
project) — never strip the `sourceSite`/`sourceType`/`productUrl`/`licenseNote`
provenance fields the pipeline writes. Coverage gaps exist (see that doc's
"Known gaps" section) — some devices will stay on the placeholder.

## 5. Localization (only if the device is in scope for a live locale)

- **JA:** `data/categories-ja/<category>.json` — has its own market-fit device
  list (see `JAPANESE_LOCALIZATION_MASTER.md`), not a 1:1 mirror of EN.
- **DE/FR/IT:** `data/categories-de|fr|it/<category>.json` — see
  `LOCALIZATION_TODO.md` for current Tier-1 scope (166-device / 8-category
  subset shared across all three; 3D Printers, Audio & Hi-Fi, and Music
  Production are currently excluded as low-search-volume niches). If you're
  adding a device in one of the in-scope categories, translate it to DE+FR+IT
  in the same pass to avoid three separate re-reads of the source entry.
  - Only translate the custom `faq` entries (1-2), never the generic block —
    it's auto-generated per locale.
  - Never translate `notes` — it's internal-only and not rendered anywhere.
  - Write to `data/categories-<locale>/<category>.json`, never hand-edit the
    merged `devices-<locale>.json`.
- Run `npm run build:all` (not just `build:site`) to regenerate every enabled
  locale in one pass.

## 6. Before committing

- `git status` — commit `data/categories/**` (and `data/categories-<locale>/**`
  if localized). **Never commit `data/devices.json` or
  `data/devices-<locale>.json`** — generated, gitignored.
- Re-run `npm run build:site` one more time clean to confirm no warnings.
- If you added a new category, confirm `category-slugs.json` and (if fetching
  images) `scripts/images/category-folders.js` were updated too.
