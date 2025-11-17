# Storage Calculator Implementation — Phase 0 Complete

**Status:** ✅ Core infrastructure ready for testing  
**Date:** November 17, 2025  
**Phase:** Phase 0 (Video + Photo calculators)

---

## What's Built

### Core Modules
- ✅ **calculator.js** — Math engine for all scenarios (video, photo, continuous, reverse)
- ✅ **calculator-ui.js** — Alpine.js state management, form handling, GA4 tracking
- ✅ **card-recommendations.js** — Card filtering by speed class, endurance rating, price
- ✅ **calculator-widget.html** — Reusable template (3-layer UX: use case → details → results)
- ✅ **generate-calculator-pages.js** — Build script integration

### Pages Generated
- ✅ `/tools/video-storage-calculator/` — 4K/1080p/bitrate inputs → storage needed + card recommendations
- ✅ `/tools/photo-storage-calculator/` — Photo count/file size → total storage + speed class

### Brand Integration
- ✅ Color scheme: Primary blue (#0066cc), accent orange (#ff9900), emerald green reverse results
- ✅ Button heights: 44px minimum (mobile-friendly tap targets)
- ✅ Card layouts: Gradient backgrounds, responsive grid (1 → 2 → 3 columns)
- ✅ Typography: Matches BRAND_GUIDELINES.md (700 weight headings, #555 body text)

---

## How It Works

### User Flow

**Forward Mode (Default):**
1. User selects use case: Video, Photo, or Continuous
2. Form auto-fills with sensible defaults
3. User inputs: duration/photos + bitrate/file size + overhead
4. Click "Calculate Storage Needed"
5. Results show:
   - Recommended capacity (rounded up to standard sizes: 32/64/128/256/512GB)
   - Speed class requirement (V6, V30, V60, V90)
   - Minimum write speed (MB/s)
   - Storage breakdown (raw + overhead)
6. Card recommendations load below (top 5 cards by speed class + price)

**Reverse Mode:**
1. User toggles "↔️ Reverse" button
2. Inputs: Card capacity (dropdown) + bitrate/file size
3. Click "Calculate Duration"
4. Results show:
   - Recording time (HH:MM) or photo count
   - Continuous 24/7 equivalent
   - Speed class recommendation

### Math Logic

**Video/Continuous:**
- Formula: `(bitrate_Mbps × duration_seconds) × 1.25 ÷ 1024^3 = GB`
- Overhead: Default 10% (adjustable 5-25%)
- Speed class: Auto-determined from bitrate (≤6 → V6, ≤90 → V30, ≤200 → V60, >200 → V90)

**Photo:**
- Formula: `(photo_count × file_size_MB) ÷ 1024 = GB`
- RAW toggle: Switches file size presets (5MP JPEG 2.5MB → 45MP RAW 65MB)
- Speed class: Fixed V30 (photos don't need high speed)

**Reverse:**
- Formula: `(card_capacity_GB × (1 - overhead%) × 8,000,000,000 bits) ÷ (bitrate_Mbps × 1,000,000) = seconds`
- Converts to HH:MM format
- 24/7 equivalent: `total_hours ÷ 24`

### Card Filtering

1. Loads all cards from `/data/sdcards.json`
2. Filters by speed class (excludes slower cards)
3. Filters by minimum capacity (if calculated)
4. Sorts by: speed class first, then price
5. Returns top 5 + displays with Amazon affiliate links

---

## Files Created/Modified

### New Files
- `/src/js/card-recommendations.js` — Card filtering + display logic
- `/scripts/generator/generate-calculator-pages.js` — Build script for calculators
- `/CALCULATOR_IMPLEMENTATION.md` — This document

### Modified Files
- `/src/templates/components/calculator-widget.html` — Updated colors (orange buttons, gradient results)
- `/src/templates/calculator/video-storage-calculator.html` — Added card-recommendations.js script
- `/src/templates/calculator/photo-storage-calculator.html` — Added card-recommendations.js script
- `/src/js/calculator-ui.js` — Added `_loadAndDisplayCardRecommendations()` method
- `/scripts/generator/build.js` — Added calculator page generation step

### Existing (No Changes Needed)
- `/src/js/calculator.js` — Already complete, no changes
- `/src/templates/calculator/` — Templates already existed, just needed script integration

---

## Testing Checklist (Next Steps)

### Functional Testing
- [ ] Video scenario: Input 4K 60fps, 2 hours → verify ~450GB required
- [ ] Photo scenario: 1000 photos × 2.5MB (JPEG) → verify ~2.4GB
- [ ] Continuous scenario: 5Mbps, 24/7 for 7 days → verify ~3.78TB
- [ ] Reverse video: 128GB card, 150Mbps → verify ~9h 24m
- [ ] Reverse photo: 128GB, 2.5MB per photo → verify ~52,224 photos
- [ ] Overhead slider: Adjust 5% → 25% → verify storage increases proportionally
- [ ] Speed class table: Renders correctly in expandable details element
- [ ] Card recommendations: Shows 3-5 cards matching required speed class + capacity

### Mobile Testing (iOS/Android)
- [ ] All form inputs have 44px+ tap targets
- [ ] Inputs don't zoom on focus (viewport meta tag)
- [ ] Result card text readable without pinch-zoom
- [ ] Advanced options accordion collapses on mobile
- [ ] Card recommendations grid stacks to 1 column
- [ ] Buttons full-width, accessible via keyboard

### Accessibility (WCAG 2.2 AA)
- [ ] All form labels have `aria-label` or visible labels
- [ ] Calculate button keyboard accessible (Tab + Enter)
- [ ] Advanced options: `aria-expanded` toggles correctly
- [ ] Color contrast: Text on backgrounds ≥ 4.5:1
- [ ] Screen reader announces results correctly
- [ ] FAQ accordion: Single item open, smooth transitions

### Performance (Core Web Vitals)
- [ ] LCP (Largest Contentful Paint): < 2.5s
- [ ] CLS (Cumulative Layout Shift): < 0.1
- [ ] INP (Interaction to Next Paint): < 200ms
- [ ] No console errors (desktop or mobile)
- [ ] Bundle size: calculator.js + calculator-ui.js + card-recommendations.js < 40kB gzipped

### SEO & Schema
- [ ] Meta description present (150–160 chars)
- [ ] Open Graph tags (og:title, description, image, url)
- [ ] Twitter Card tags
- [ ] JSON-LD WebPage + FAQPage + BreadcrumbList validates in Search Console
- [ ] Canonical URL set correctly

### GA4 Events
- [ ] `calculator_calculate` fires on "Calculate" button
- [ ] `calculator_calculate` includes scenario + mode
- [ ] `calculator_recommendations_shown` fires after result
- [ ] `calculator_recommendations_shown` includes speed class + card count

---

## Known Limitations

1. **Device presets not yet integrated** — Phase 1 pages will have device dropdowns that auto-fill bitrates from `data/calculator-devices.json`
2. **No multi-format comparison** — Checkbox for "Compare H.264 vs H.265 vs ProRes" exists but feature not built yet
3. **No PDF export** — Users can't save/export results yet
4. **Card data static** — Recommendations pull from `/data/sdcards.json` (updated monthly)
5. **No browser storage** — Calculator inputs not persisted between sessions

---

## Next Steps (Post-Testing)

1. **Run full test suite** (functional, mobile, accessibility, performance)
2. **Fix any bugs** found during testing
3. **Deploy to production** (Phase 0 launch)
4. **Monitor GA4 traffic** for 1 week (Week 1)
5. **Begin Phase 1 development** (bitrate data collection + 6 device-specific pages)
6. **Deploy Phase 1** (Weeks 2–4)

---

## Architecture Notes

### Why This Design?

**Reusable Engine:**
- Single `calculator.js` works for all scenarios (video, photo, continuous, reverse)
- No code duplication across 8 pages (Phase 0 + Phase 1)
- Easy to extend with new scenarios (streaming, RAW burst, etc.)

**Alpine.js State:**
- Lightweight (~15kB), no build step required
- Layer-based UX (use case → details → results) simple to manage
- Form validation + result display in same component

**Separate Card Module:**
- Card logic decoupled from calculator logic
- Easy to swap card sources (local JSON → API endpoint)
- Filtering strategy extensible (price tier, endurance rating, etc.)

**Build Script Integration:**
- Calculator pages generated like device pages
- Ensures consistency across site
- Easy to add Phase 1 pages (just add to generator)

---

## Resources

- **Spec:** STORAGE_CALCULATOR_PRODUCT_SPEC.md
- **Kanban:** STORAGE_CALCULATOR_KANBAN.md
- **Brand Guidelines:** BRAND_GUIDELINES.md
- **Device Data:** data/sdcards.json, data/calculator-devices.json

---

**Ready for testing. Merge to main branch after QA passes.**
