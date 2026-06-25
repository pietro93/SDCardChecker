# SD Card Comparison Tool — Service Design Document

**Status:** Design Phase (Approved) — ready to move to implementation
**Date:** 2026-06-24
**Supersedes:** [SD_CARD_COMPARISON_SPEC.md](SD_CARD_COMPARISON_SPEC.md) (Nov 13, 2025 draft — its "pre-generate vs-pages for SEO" strategy was reconsidered and rejected; see Decision Log below). That doc is kept for historical reference only.

---

## 1. Problem & Goal

Users land on a device page (e.g. GoPro Hero 13) via a high-intent, high-volume search like "best sd card for gopro hero 13." They see 3 recommended cards but have to manually compare specs/price/pros-cons across separate card blocks to decide. This is friction right before the affiliate click — the highest-value moment on the site.

**Goal:** Reduce that friction with a comparison UI, reused in two places, built once.

---

## 2. Decision Log (why this design, not the original spec)

| Question | Original spec (Nov 2025) | Final decision | Why |
|---|---|---|---|
| Pre-generate static `/compare/[a]-vs-[b]/` pages for SEO? | Yes — primary SEO strategy | **No** | "Brand A vs Brand B SD card" is low-volume search intent. Real traffic comes from "best sd card for [device]" queries, which device pages already capture. Building dozens of vs-pages would cost real effort for traffic that likely doesn't exist. |
| Where does comparison live? | Dedicated `/compare/` landing + device anchor | **One reusable component, two placements**: standalone `/compare/` page (generic utility) + embedded widget on every device page (pre-filled with that device's recommended cards) | Avoids building two separate UIs. Embedding on device pages puts the comparison where the buying decision actually happens. |
| Max cards compared | 2–3 | **Up to 3** | Confirmed with stakeholder. |
| Card selection UI | Dropdowns / search+filter / presets | **Dropdown or search-select per slot, defaults pre-filled** | Simplest to build; presets/filters are not needed for v1. |
| SEO role of this feature | Primary traffic driver (new organic queries) | **Secondary/indirect**: more on-page interaction & dwell time on already-ranking device pages; not a new-keyword play | Be honest about what this feature can and can't do for SEO. |

---

## 3. What We're Building

**One reusable Compare Component**, rendered in two contexts:

### 3a. Standalone page — `/compare/`
- Generic utility page, not built for SEO ranking.
- Defaults to 3 cards from the `recommended` tier in `data/sdcards.json` if no selection is made.
- Card picks are reflected in the URL as query params (`/compare/?cards=sandisk-extreme-microsd,lexar-professional-633x,samsung-evo-select-microsd`) so a comparison can be shared/bookmarked.
- Each of the (up to) 3 slots has its own dropdown/search-select to swap the card in that slot.

### 3b. Device page widget
- Same component, embedded under the existing "Recommended Cards" section on every device page.
- Defaults to that device's `recommendedBrands` cards (already defined per device in `data/devices.json`) instead of generic popular cards.
- Same swap-card interaction — user isn't locked into the 3 defaults.

### Fields shown per card (pulled from existing `data/sdcards.json` schema — no new data fields required for v1)
- Image, name
- Price symbol / price tier
- `specs`: uhs, speedClass, appPerformance, readSpeed, writeSpeed, endurance
- Available capacities
- Pros / cons
- Tier badge (recommended / budget / etc.)
- Amazon affiliate button (existing `amazonSearchUrl`)

### Layout
- Desktop: 2–3 columns side by side.
- Mobile: vertical stack (swiper considered but not required for v1 — stack is simpler and sufficient).
- Sticky "View on Amazon" button per card on mobile.

### Explicitly out of scope for v1
- Pre-generated static comparison pages per card-pair.
- Schema.org `Product`/`ComparisonChart` markup (revisit only if/once the standalone page shows organic traffic).
- Quick-compare presets (Budget/Mid/Pro sets).
- User reviews/ratings display.
- Capacity-specific price variation in the comparison table.

---

## 4. UX Notes

- Never show a blank comparison — always pre-filled with sensible defaults (recommended-tier cards on `/compare/`, device's own recommended cards on device pages).
- Swapping a card updates the table/columns in place, no page reload needed.
- The standalone page's URL updates with the current selection so it's shareable.
- Keep the device-page widget visually distinct from the existing "Recommended Cards" list it sits below — it should read as "now compare them," not as a duplicate list.

---

## 5. SEO Notes

- This feature is **not** expected to generate new organic search traffic on its own (see Decision Log).
- Its SEO value is indirect: increased on-page interaction/time-on-page on pages that already rank (device pages), which is a soft positive signal.
- No new indexable URLs need to be created or submitted to Search Console for v1.
- Revisit schema markup / static vs-pages only if analytics later show meaningful direct traffic to `/compare/` from search.

---

## 6. Data & Technical Notes

- No changes needed to `data/sdcards.json` schema — all required fields already exist.
- No changes needed to `data/devices.json` — `recommendedBrands` already provides the per-device default card set.
- Component should be data-driven off the existing JSON, not hardcoded card lists.

---

## 7. Open Items for Implementation

See [SD_CARD_COMPARISON_KANBAN.md](SD_CARD_COMPARISON_KANBAN.md) for the actionable checklist (Implementation / SEO / UX requirements).
