# Calculator Card Recommendations Implementation

**Status:** ✅ Complete (Awaiting Build & Testing)

## What Changed

Replaced the broken "Find Matching Cards ↗" external link with **inline card recommendations** displayed directly in calculator results, using affiliate links and card images (with fallback).

## Architecture

### 1. New Module: `calculator-card-recommendations.js`
**Location:** `/src/js/calculator-card-recommendations.js`

**Purpose:** Generates inline card recommendation cards for calculator results

**Key Methods:**
- `loadCards()` — Fetch `/data/sdcards.json`
- `filterBySpeedClass(allCards, speedClass, limit=5)` — Filter cards by required speed class
- `formatCard(card)` — Format single card with price tier, image, affiliate link
- `buildRecommendationHTML(cards, speedClass)` — Generate grid HTML
- `displayRecommendations(speedClass, containerId)` — Load, filter, and render async

**Output:** Mobile-responsive card grid (1 col mobile, 2-3 col desktop) with:
- Card image (with fallback to `/img/fallback/sd-card-placeholder.webp`)
- Brand name
- Speed class badge
- Write speed badge
- Price tier indicator ($, $$, $$$)
- "Check Price" Amazon affiliate button
- "View all {speedClass} cards" link below grid

### 2. Updated Component: `calculator-widget.html`
**Changes:**
- Removed "Find Matching Cards ↗" button (was linking to `/cards/?speedClass={V30|V60|V90}`)
- Added `<div id="calculator-recommendations">` placeholder below Speed Class Reference table
- Placeholder shows loading state: "Loading recommendations..."
- Container has orange/amber gradient background to highlight recommendations

### 3. Updated UI Manager: `calculator-ui.js`
**Changes:**
- Updated `_loadAndDisplayCardRecommendations()` method:
  - Now uses `CalculatorCardRecommendations` instead of `CardRecommendations`
  - Calls `displayRecommendations(speedClass, 'calculator-recommendations')`
  - Async/await pattern for cleaner error handling
- Added `_loadAndDisplayCardRecommendations()` call to `calculateReverse()` (was missing)
- GA4 event now tracks `scenario` instead of `minCapacity` (more useful data)

### 4. Updated Calculator Pages
**Files Modified:**
- `/src/templates/calculators/video-storage-calculator.html`
- `/src/templates/calculators/photo-storage-calculator.html`
- `/src/templates/calculator/video-storage-calculator.html`
- `/src/templates/calculator/photo-storage-calculator.html`

**Change:** Added script reference:
```html
<script src="/assets/js/calculator-card-recommendations.js"></script>
```

## User Experience Flow

1. **User fills calculator form** → Video resolution, bitrate, duration, etc.
2. **User clicks "Calculate Storage Needed"** → Results layer displays
3. **Results show:**
   - Storage required (blue gradient card)
   - Speed class & write speed requirements
   - Collapsible speed class reference table
   - **NEW: 5 recommended cards in grid layout** ← Inline, no page navigation
4. **User can:**
   - Click any "Check Price" button → Opens Amazon affiliate link (new window)
   - Click "View all {speedClass} cards" → Goes to `/cards/?speedClass=...` (optional deeper dive)
   - Or click "Calculate Another" → Resets form
5. **Recommendations auto-load** after calculation (no extra user action)

## Data & Images

### Card Images
- **Primary:** Uses `card.imageUrl` from `/data/sdcards.json`
- **Fallback:** `/img/fallback/sd-card-placeholder.webp` (must exist)
- **CSS:** 180x180px aspect ratio maintained

### Affiliate Links
- All "Check Price" buttons link to `card.amazonSearchUrl` from sdcards.json
- Target="_blank" + rel="noopener noreferrer" for security
- GA4 event: `calculator_card_recommendation_click` (add if needed)

### Speed Classes Supported
- V6, V30, V60, V90 (standard video cards)
- U3, Class 10 (legacy support)

## Benefits vs. Old Approach

| Aspect | Old "Find Matching Cards" Link | New Inline Recommendations |
|--------|------|------|
| **Context Loss** | User leaves calculator | User stays in results |
| **Affiliate Revenue** | Low (external page) | Higher (direct CTA) |
| **Load Time** | User navigates away | Loads async, no friction |
| **Mobile UX** | Link navigation poor | Optimized grid layout |
| **Conversion** | Low (extra step) | Higher (immediate action) |
| **Images** | May or may not exist | Fallback placeholder |
| **A/B Testing** | Easier (one metric) | More granular (recommendation_shown, click) |

## Testing Checklist

Before launch:
- [ ] Run `npm run build` (copies files to `/dist/assets/js/`)
- [ ] Load `/tools/video-storage-calculator/` and `/tools/photo-storage-calculator/`
- [ ] Fill form and click "Calculate Storage Needed"
- [ ] Verify recommendations load (no console errors)
- [ ] Verify card images display (or fallback shows)
- [ ] Click "Check Price" → Opens Amazon in new tab
- [ ] Click "View all V30 cards" → Navigates to `/cards/?speedClass=V30`
- [ ] Test reverse mode: fill card capacity, click "Calculate Duration"
- [ ] Verify recommendations also load in reverse mode
- [ ] Mobile: Check 1-2 card grid layout (not 3 columns)
- [ ] Check GA4 events firing (if GA4 is configured)

## Files Impacted

```
src/
├── js/
│   ├── calculator-card-recommendations.js          [NEW]
│   ├── calculator-ui.js                            [MODIFIED]
│   └── (existing files unchanged)
└── templates/
    ├── components/
    │   └── calculator-widget.html                  [MODIFIED]
    ├── calculator/
    │   ├── video-storage-calculator.html            [MODIFIED - script tag]
    │   └── photo-storage-calculator.html            [MODIFIED - script tag]
    └── calculators/
        ├── video-storage-calculator.html            [MODIFIED - script tag]
        └── photo-storage-calculator.html            [MODIFIED - script tag]

data/
└── sdcards.json                                    [NO CHANGES - existing data used]

img/
└── fallback/
    └── sd-card-placeholder.webp                   [MUST EXIST - placeholder image]
```

## Next Steps (Future Enhancements)

1. **Add GA4 event for card clicks:** `calculator_card_recommendation_click`
2. **Test with real card images** from sdcards.json
3. **A/B test:** 3 cards vs 5 cards in grid (conversion impact)
4. **Monitor:** Which speed classes get most clicks (data-driven)
5. **Expand:** Phase 1 (Drone, GoPro, Dashcam) calculators with same pattern

---

**Created:** Nov 17, 2025
**Status:** Implementation Complete, Awaiting Build & QA
**Priority:** High (replaces broken feature)
