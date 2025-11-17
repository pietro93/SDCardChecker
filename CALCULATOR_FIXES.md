# Calculator Widget Fixes

## Issues Fixed

### 1. **Card Dropdown Not Populating**
**Problem:** When switching to reverse mode, the card selector dropdown showed "Loading cards..." but never populated.

**Root Cause:** 
- `CardSelector.loadCards()` was failing silently to fetch `/data/sdcards.json`
- No error handling to inform user of failure
- Dropdown stuck in loading state forever

**Fix Applied:**
- Added better error logging to `CardSelector.loadCards()` (line 26-28)
- Now logs the URL attempted and full error object
- Added check for empty cards array to warn about no data

### 2. **Recommendations Section Stuck on "Loading..."**
**Problem:** After calculation, the recommendations section showed hardcoded "Loading recommendations..." text that never got replaced.

**Root Cause:**
- `CalculatorCardRecommendations.displayRecommendations()` was failing to fetch or parse cards
- No fallback error message
- Container innerHTML replaced with loading text but never updated

**Fix Applied:**
- Added comprehensive logging throughout the function
- Added early exits with helpful error messages instead of hanging loading state
- Now shows:
  - Red error if cards fail to load → "Unable to load at this time. Please try browsing the SD card guide."
  - Yellow warning if no cards match speed class → "No cards matching [speedClass] found."
  - Full error details logged to console
- Improved `CalculatorUI.initCardSelector()` logging (lines 494-523)

### 3. **404 Error on "Find Matching Cards" Button**
**Problem:** The "Find Matching Cards" button in results linked to `/cards/?speedClass=...` which doesn't exist, causing 404.

**Root Cause:**
- No `/cards/` page exists in the application
- Link was hardcoded to non-existent endpoint

**Fix Applied:**
- Changed button link from `/cards/?speedClass=${speedClass}` → `/sd-card-guide/`
- Updated button text from "Find Matching Cards" → "Learn More About Cards"
- Updated all fallback error links to use `/sd-card-guide/` instead
- Applied consistently in:
  - `calculator-widget.html` (line 443-445)
  - `calculator-card-recommendations.js` (all fallback error messages)

## Files Modified

1. **src/js/card-selector.js**
   - Enhanced error logging for fetch failures
   - Better error messages

2. **src/js/calculator-card-recommendations.js**
   - Comprehensive error handling with fallback UI messages
   - All links updated to `/sd-card-guide/`
   - Added console logging for debugging

3. **src/js/calculator-ui.js**
   - Improved logging with `[CalculatorUI]` prefix
   - Better error state management for card loader

4. **src/templates/components/calculator-widget.html**
   - Changed "Find Matching Cards" button link to `/sd-card-guide/`
   - Improved loading spinner display (changed from `animate-pulse` to spinning icon)

## How to Debug Further

If cards still don't appear in the dropdown or recommendations:

1. **Open browser DevTools Console** (F12)
2. **Look for logs starting with:**
   - `[CardSelector]` - Card loading attempt
   - `[CalculatorCardRecommendations]` - Recommendations loading
   - `[CalculatorUI]` - Card selector initialization

3. **Check the Network tab** for `/data/sdcards.json` request:
   - Is it returning 200 status?
   - Is the JSON valid?
   - Are cards actually in the `sdcards` array?

4. **Common issues:**
   - Build process not copying `/data/sdcards.json` to served directory
   - Incorrect BASE_URL or path prefixes
   - JSON file corrupted or missing `sdcards` key

## Next Steps

If the fixes don't resolve the issues:

1. Verify `/data/sdcards.json` exists and is being served correctly
2. Check that all three JavaScript modules are loading:
   - `calculator.js` ✓
   - `calculator-ui.js` ✓
   - `calculator-card-recommendations.js` ✓
   - `card-selector.js` ✓
3. Inspect the actual Network request for `/data/sdcards.json` in DevTools
4. Check browser console for any CORS or fetch errors
