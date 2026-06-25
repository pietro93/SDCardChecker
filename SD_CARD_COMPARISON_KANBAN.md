# SD Card Comparison Tool — Implementation Kanban

Companion checklist to [SD_CARD_COMPARISON_SERVICE_DESIGN.md](SD_CARD_COMPARISON_SERVICE_DESIGN.md). Three tracks — Implementation, SEO, UX — all must be checked off before this ships as "done."

**Status:** Not started
**Created:** 2026-06-24

---

## Track 1: Implementation

- [ ] Build the reusable Compare Component (data-driven from `data/sdcards.json`, up to 3 slots)
- [ ] Each slot has a dropdown/search-select to pick/swap a card
- [ ] Component renders: image, name, price symbol/tier, full `specs` block, available capacities, pros/cons, tier badge, Amazon affiliate button
- [ ] Build standalone `/compare/` page using the component, defaulted to 3 `recommended`-tier cards
- [ ] Wire up URL query param sync (`?cards=id1,id2,id3`) on the standalone page for shareable links
- [ ] Embed the component on the device page template, defaulted to that device's `recommendedBrands`
- [ ] Verify embedding works across all device categories (Cameras, Drones, Gaming Handhelds, etc.) — spot check a few per category
- [ ] Handle edge case: device with fewer than 3 recommended cards (don't render empty slots)
- [ ] Handle edge case: card removed/renamed in `sdcards.json` after a `/compare/` URL was shared (graceful fallback, not a broken page)
- [ ] Mobile layout: vertical stack, sticky "View on Amazon" button per card
- [ ] Desktop layout: 2–3 column side-by-side
- [ ] No new fields required in `data/sdcards.json` — confirm existing schema covers everything the component needs

## Track 2: SEO

- [ ] Confirm no new indexable URLs are submitted to Search Console for v1 (per design doc, this is not an SEO traffic play)
- [ ] `/compare/` page gets a basic, non-spammy `<title>`/meta description (utility page, not keyword-targeted)
- [ ] Do **not** build schema.org `Product`/`ComparisonChart` markup for v1 (explicitly descoped — revisit only if `/compare/` shows real organic traffic later)
- [ ] Do **not** pre-generate static per-pair comparison pages for v1 (explicitly descoped per Decision Log)
- [ ] Confirm the embedded widget doesn't duplicate/conflict with existing structured data already on device pages
- [ ] Add `/compare/` to internal linking only from device pages (via the widget's "see full compare tool" link, if included) — not from nav/sitemap promotion, since it's not meant to rank independently

## Track 3: UX

- [ ] Comparison is never blank on first load — defaults always pre-filled (recommended-tier on `/compare/`, device's own cards on device pages)
- [ ] Swapping a card updates in place without a full page reload
- [ ] Device-page widget is visually distinct from the existing "Recommended Cards" section above it — reads as a follow-up action, not a duplicate list
- [ ] Touch targets on mobile (Amazon buttons, dropdowns) meet 48px minimum
- [ ] Verify component renders correctly with cards that have missing/optional fields (e.g. no `appPerformance`)
- [ ] Accessibility: comparison table/columns navigable via keyboard, proper alt text on card images
- [ ] Manual QA pass: test widget on at least one device per category + the standalone `/compare/` page, on both desktop and mobile viewport
- [ ] Confirm time-on-page / interaction analytics event is fired when a user swaps a card (for measuring engagement impact post-launch)

---

## Definition of Done

All three tracks above fully checked, plus:
- [ ] Service design doc and this kanban both linked from [INDEX.md](INDEX.md)
- [ ] Stakeholder sign-off on a live preview (desktop + mobile) before merging
