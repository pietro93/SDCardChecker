# SD Card Image Scraper + Fast-Add Workflow — Handoff

Status: **built**. Scripts below exist and are exercised; this doc now also serves as the how-to reference (see "How to use" sections). The plan below is left intact as implementation context.

Original ask — two things the user wanted:
1. An automated scraper that fetches a small square product photo for an SD card (for `img/cards/`), distinct from the device hero-image pipeline.
2. A "just tell Claude Code to add a card" workflow that writes the data entry, scrapes the image, and validates everything in one go.

## What already exists (don't rebuild this — generalize it)

`scripts/images/fetch-nav-card-images.js` is a working prototype, but scoped to navigation SD cards only (`navCardProduct: true`). It already does most of what's needed:

- Pulls the ASIN out of a card's `affiliateUrl` (`/dp/<ASIN>`)
- Calls `getItemsByAsin()` from `src/utils/amazon-api.js` (Amazon PAAPI `GetItems`) to get the listing's real product image
- Downloads it, uses `sharp` to pad/center it into a 600×600 square on a white background, saves as `img/cards/<id>.webp`
- Edits `data/sdcards.json` **in place as text** (not JSON.parse + stringify) so the rest of the file's formatting/ordering is untouched — `setImageFields()` finds the card by `"id": "<id>"`, strips any existing `imageUrl`/`imageSourceUrl`, and re-inserts them right after the `tier` field.

`src/utils/amazon-api.js` also already exports `searchSDCards(keywords)` (PAAPI `SearchItems`, keyword search, returns up to 5 candidates with image/title/price/rating) — this is unused by the nav-card script but is exactly what's needed to resolve an image for a card that *doesn't* have a direct Amazon product link yet.

So this isn't a from-scratch build: it's generalizing one script from "nav cards with a known ASIN" to "any card, with or without a known ASIN."

## Scope (confirmed with user)

- Square thumbnail only, ideally white or transparent background — **not** the device pipeline's hero-image compositing (no chroma-key, no background/glow layering, no manufacturer-storefront scraping fallback chain).
- White-background 600×600 webp, matching the existing nav-card convention, so new cards look consistent with the ones already scraped.
- Output path convention stays `img/cards/<id>.webp` (already used everywhere).

## What was built

### 1. `scripts/images/card-image-lib.js` — shared helpers

Factored out of `fetch-nav-card-images.js` so the new scripts don't duplicate logic: `loadCards()`, `extractAsin()`, `downloadImage()`, `saveThumbnail()` (the 600×600 white-background webp resize), `setImageFields()` (in-place text edit, works for any card — insertion happens right after the `"tier"` line regardless of what other fields follow it, so it's not actually nav-card-specific), and `isRelevantMatch(title, cardName)` — a lightweight brand+model-number token check used to filter keyword-search results.

### 2. `scripts/images/fetch-card-image.js` — single-card fetch

**How to use:** `node scripts/images/fetch-card-image.js <card-id>` (or `npm run fetch:card-image -- <card-id>`).

Given a card `id`:
1. Looks up the card in `data/sdcards.json`.
2. Resolves a source image, in order:
   - If `affiliateUrl` exists → extract ASIN → `getItemsByAsin([asin])` (exact match).
   - Else → `searchSDCards(card.name)` → take the first result whose title passes `isRelevantMatch()`.
   - Else → skip and print "needs a manual image" rather than guessing — the JSON is left untouched in this case.
3. Downloads → resizes to 600×600 on white → `img/cards/<id>.webp`.
4. Updates `imageUrl` + `imageSourceUrl` on the card via `setImageFields()`.

### 3. `scripts/images/fetch-missing-card-images.js` — batch runner

**How to use:**
- `node scripts/images/fetch-missing-card-images.js` — fetches every card with no `imageUrl`.
- `node scripts/images/fetch-missing-card-images.js --backfill` — also re-fetches every card whose `imageUrl` is shared by more than one card (the placeholder-sharing problem described below).

Calls are sequential (PAAPI rate limiting already enforced by `delayIfNeeded()` inside `amazon-api.js`).

### 4. `scripts/validate-sdcards.js` — data validation

**How to use:** `npm run validate:cards`. Checks against `data/sdcards.json`:
- No duplicate `id`.
- `tier` ∈ `{budget, recommended, professional, specialty}`.
- `priceTier` ∈ `{Budget, Mid-Range, Premium, Specialty}`.
- `imageUrl`, if set, resolves to a file that actually exists under `img/`.
- At least one of `amazonSearchUrl` / `affiliateUrl` is present.
- Required fields present per card shape (`navCardProduct: true` cards need `vehicleBrand`/`partNumber`/the nav `specs` shape; regular cards need `type`/`specs.speedClass`/`availableCapacities`).

First real run caught 12 issues: 10 were `nintendo-switch/sandisk-*.webp` paths that didn't match the actual filenames on disk (fixed — see git history on `data/sdcards.json`), and 2 (`topesel-high-endurance`, `speederlash-standard`) have no image file and no resolvable Amazon listing (PAAPI search returned 0 results for both) — these need a manually supplied image.

### 5. "Add SD card to dataset" workflow (the part Claude Code runs, not a script)

When the user says "add `<card>` to the dataset," do this:
1. Generate a kebab-case `id` from brand + model; check it doesn't already exist in `data/sdcards.json` or `data/sdcards-ja.json`.
2. Fill in the schema fields. If the user only gave a name, look up specs (speed class, UHS, A-rating, read/write speed, available capacities, typical price tier) via WebSearch/WebFetch on the manufacturer spec page before guessing — don't fabricate numbers.
3. Append the entry with `Edit` (not a script rewrite) so JSON formatting stays consistent with the rest of the file.
4. Run `node scripts/images/fetch-card-image.js <id>` to scrape the photo.
5. Run `npm run validate:cards` to confirm the new entry is clean and the image landed.
6. Report back what was added and flag anything the scraper couldn't resolve (e.g. no Amazon listing found) so a manual image can be supplied.

## Known follow-up once the scraper exists

A number of existing cards currently share a fallback image rather than having their own real photo (found during this session's audit):
`sandisk-ultra-microsd` / `sandisk-rog-ally-microsd` / `sandisk-extreme-sd-uhs1` / `sandisk-ultra-sd-uhs1` → all reuse `sandisk-extreme-microsd.webp`; similar sharing exists for the Lexar 633x, Lexar 1000x/Play, Lexar Silver, Samsung Pro Endurance/Plus, ADATA Premier/Premier Pro, and SanDisk Extreme Pro lines. Once `fetch-missing-card-images.js` exists, run it as a backfill pass over these IDs to replace the shared placeholders with real per-product photos — useful regardless of whether the comparison tool gets built, since right now several distinct products visually look identical on category/listing pages.

## Known issue intentionally not fixed in this session

`kingston-canvas-go-plus` and `kingston-canvas-go-plus-ultra` are duplicate entries in `data/sdcards.json` (identical specs/image/copy), but both IDs are actively referenced ~50+ times across `data/devices.json`, `data/devices-ja.json`, `data/categories/gaming-handhelds.json`, `data/categories-ja/gaming-handhelds.json`, and `data/sdcards-ja.json`. Merging them safely means rewriting every `recommendedBrands` reference to one canonical ID across all of those files — too large a change to bundle into a quick fix. Flagging as a separate cleanup task.
