# Device Hero Image Pipeline (scripts/images/)

**Status:** current — this is the authoritative doc for the automated device
hero-image sourcing pipeline introduced 2026-06. Older image docs
([IMAGE_STRATEGY_MASTER.md](IMAGE_STRATEGY_MASTER.md) and friends, see
[INDEX.md](INDEX.md#images)) predate this pipeline and describe the
hand-curated/manual state of device images; treat this doc as the source of
truth for anything under `scripts/images/`.

## What it does

For any device in `data/categories/*.json` still rendering the generic
placeholder image, this pipeline:

1. Finds a real product photo from the manufacturer's storefront (preferred)
   or the Grover rental marketplace (fallback).
2. Cuts the device out of its studio-white background, composites it onto
   the shared `img/devices/background.webp` with a soft glow + circuit-art
   overlay, and stages the result.
3. Leaves the staged image for **manual visual review** — nothing is
   published automatically.
4. On promotion, moves the image into the right category folder, sets
   `imageUrl` on the device record, and logs provenance in
   `img/devices/_attributions.json`.

## Licensing — read before using

Sourced images are **copyrighted product photography**, not freely licensed
(not CC, not public domain). This is a deliberate, accepted risk for this
project, not an oversight. Every staged/promoted image records `sourceSite`,
`sourceType`, `productUrl`, and `licenseNote` in its sidecar JSON /
`_attributions.json` — never strip these fields or reframe them as
CC-licensed.

Earlier candidate sources were rejected:
- **Wikimedia Commons** — no coverage of niche devices, and EXIF-based
  matching produced false positives.
- **Grover-only** (no manufacturer fallback) — same coverage gap, cleanly
  covering only ~20 of 92 placeholder devices.

## Files

| File | Role |
|---|---|
| `image-sources.js` | Resolves a product photo: manufacturer storefront first (`BRAND_REGISTRY`, Shopify via `shopifySource` or WooCommerce via `wooCommerceSource`), Grover marketplace fallback. Contains the relevance matcher (`relevanceScore`) that decides whether a candidate product is actually the right device. |
| `composite.js` | Chroma-keys the white studio background off the product photo (border flood-fill, so a light/silver device body survives), then layers it onto `background.webp` + `background-overlay.webp` with a soft glow. |
| `fetch-core.js` | Glues sourcing + compositing together for one device; writes the staged `.webp` + metadata `.json` into `img/devices/_review/`. Per-category `CATEGORY_SCALE` controls how large the device renders. |
| `fetch-device-image.js` | CLI: fetch + stage one device by slug. |
| `fetch-missing-images.js` | CLI: batch-runs every device still on a placeholder image. |
| `promote-device-image.js` | CLI: moves a reviewed staged image live, sets `imageUrl`, logs attribution. |
| `category-folders.js` | Maps the `category` field to the `img/devices/<folder>/` it lives in. New categories must be added here or fetching throws. |
| `find-device.js` | Looks up devices by slug / lists all devices across `data/categories/*.json`. |

## Usage

```bash
# See what's still on placeholders, without fetching anything
node scripts/images/fetch-missing-images.js --dry-run

# Batch-fetch (stages into img/devices/_review/, does not publish)
node scripts/images/fetch-missing-images.js [--limit N]

# Fetch a single device, optionally overriding the search query
node scripts/images/fetch-device-image.js <slug> [--query "custom search terms"]

# After visually reviewing img/devices/_review/<slug>.webp:
node scripts/images/promote-device-image.js <slug>
```

**Always visually inspect the staged `.webp` before promoting.** The
compositor flags a `cutoutSane` warning when it removed an implausibly small
or large fraction of the source image (likely not a clean studio shot), but
this is a heuristic, not a guarantee — a wrong-product match or a bad cutout
can still look superficially fine.

## The relevance matcher (`relevanceScore` in `image-sources.js`)

This is the part most likely to need future tuning, and the part that has
already produced several rounds of false positives. It now enforces, in
order:

1. **Exact model/version-number matching** — model tokens (`x100v`, `hero11`,
   a bare digit like `3`) must match as a whole token, not a substring of a
   different model (`x100v` must not match `x100vi`).
2. **Symmetric roman-numeral matching** — `ii`/`iii`/`iv`/etc. are tracked
   separately from generic filler; `Mark II` must not match `Mark III` and
   vice versa.
3. **Symmetric `+`/Plus-variant matching** — `Tab S10 FE+` and `Tab S10 FE`
   are treated as different SKUs.
4. **Accessory rejection** — a candidate that mentions lens/case/kit/etc. but
   the device name doesn't is treated as the wrong product (an accessory,
   not the device body).
5. **All salient tokens required** — every non-generic token in the device
   name (brand, product line, category word) must appear in the candidate;
   a partial overlap is rejected outright (no fuzzy "60% of tokens" scoring).

`GENERIC_TOKENS` deliberately excludes product-line words like
`mini`/`pro`/`max`/`se`/`plus` — those discriminate real SKUs (DJI Mini vs.
Air vs. Mavic) and treating them as filler caused cross-product matches.

If you touch this function, re-run it against known good/bad pairs covering
each rule above before trusting a batch fetch — there is no committed test
file yet (see Known gaps below).

## Adding a manufacturer storefront

Manufacturer storefronts are tried before Grover. Most run Shopify, checked
via the public `/products.json` endpoint; append to `BRAND_REGISTRY` in
`image-sources.js`:

```js
{ brand: "potensic", source: shopifySource, config: { domain: "https://store.potensic.com", productTypes: ["Drones"] } },
```

`brand` is matched case-insensitively against the start of (or as a whole
word within) the device name. Not every manufacturer runs Shopify — check
`<domain>/products.json` in a browser first; if it 404s or isn't JSON, check
for a WooCommerce store instead (`<domain>/wp-json/wc/store/v1/products?search=...`
— no auth needed if it's open) and use `wooCommerceSource` (see the `gpd`
entry in `BRAND_REGISTRY` for the pattern). If neither API is open, the
manufacturer needs a bespoke adapter or is unreachable like OneXPlayer's
bot-protected store, which needs a headless-browser fetch instead.

Some storefronts mix the real product listing in with warranty plans,
bundles, or year variants that share every salient token and have a shorter
title, so they'd otherwise win the relevance tie-break. Both `shopifySource`
and `wooCommerceSource` accept a `preferTokens: [...]` config — words (e.g.
"drone", "camera", a model year) that the genuine listing's title contains
but the others don't — to break the tie correctly. Always verify empirically
against the live catalog before relying on it (see the `hoverair` and `gpd`
entries for examples).

## Known gaps / next steps

- **OneXPlayer** store is bot-protected (JS challenge) — needs a Playwright-driven
  fetch, not the plain `fetch()` adapters here.
- Skydio's store (Shopify) sells accessories only, no drone body listing.
- AYN's only catalog device is a combo name ("Odin 3 / Odin 2 Portal") that
  can't satisfy the all-salient-tokens rule against a single product — add an
  adapter only if a single-model AYN device is added.
- High-end/older cameras (Nikon DSLRs, Sony Alpha, Panasonic Lumix), Raspberry
  Pi boards, and most other drones aren't stocked by Grover and have no
  manufacturer adapter — likely to stay on placeholders without dedicated
  adapters.
- The matcher's regression cases (covering the 5 false-positive classes
  above) are committed at `scripts/images/__tests__/relevanceScore.test.js`
  (`npm run test:images`) — run before/after touching `relevanceScore()`.
- **Vantrue** (vantrue.com, Shopify, registered 2026-07) correctly matches
  the "N4 Pro" device to its "Nexus 4 Pro" listing (handle `n4-pro` — see
  the `shopifySource` note about matching against vendor+title+handle), but
  every image in that product's catalog entry is a lifestyle/marketing
  collage (in-car shots, phone-app screenshots, feature callouts) — none are
  a clean studio cutout the compositor can chroma-key. Left on placeholder;
  re-check if Vantrue ever adds a plain product shot.
- **Thinkware** has no reachable open storefront: `thinkware.com` redirects
  geographically to country marketing sites (e.g. `thinkwaredashcam.it`)
  that are WordPress + Jetpack, not WooCommerce (no `wc/store` REST
  namespace) — no products.json, no open commerce API found.
- Marine electronics (**Lowrance**, **Garmin**, **Humminbird**) and legacy
  point-and-shoot cameras (**Canon**, **Sony**, **Nikon**) are large/enterprise
  storefronts with no public Shopify/WooCommerce API (`/products.json` and
  `/wp-json/wc/store/v1/products` both blocked or absent) — same class of gap
  as the big-brand sites already noted above; would need a bespoke/headless
  adapter to source, out of scope here.
