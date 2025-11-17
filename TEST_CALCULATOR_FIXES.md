# Test Plan for Calculator Fixes

## Test 1: Card Dropdown in Reverse Mode
**Steps:**
1. Go to calculator page (e.g., `/tools/video-storage-calculator/`)
2. Click "↔️ Reverse" button to switch to reverse mode
3. Click on "Or select a card from our database:" search field

**Expected Result:**
- Dropdown opens showing cards loading OR populated with card list
- If it fails, should see console error with:
  - `[CardSelector] ✗ Failed to load cards:`
  - URL attempted: `/data/sdcards.json`
  - Exact error message

**Current Behavior Fix:**
- ✓ Better error logging if fetch fails
- ✓ Prevents infinite "Loading cards..." state

---

## Test 2: Recommendations After Calculation
**Steps:**
1. Go to calculator page
2. Fill in values (e.g., 4K 30fps, 2 hours, 150 Mbps)
3. Click "Calculate Storage Needed"
4. Scroll down to see recommendations section

**Expected Result:**
- Shows recommended cards grid OR helpful fallback message
- No hardcoded "Loading recommendations..." text
- If it fails, console shows:
  - `[CalculatorCardRecommendations] Loading recommendations for [speedClass]...`
  - Error message with helpful link to SD Card Guide

**Current Behavior Fix:**
- ✓ Removed stuck "Loading..." state
- ✓ Shows helpful fallback messages with links
- ✓ Full error logging to console

---

## Test 3: "Learn More About Cards" Button
**Steps:**
1. Do a calculation in reverse mode
2. Click the green "Learn More About Cards ↗" button

**Expected Result:**
- Opens `/sd-card-guide/` in new tab (not 404)
- Shows SD Card Guide page

**Current Behavior Fix:**
- ✓ Changed from `/cards/?speedClass=...` → `/sd-card-guide/`
- ✓ No more 404 errors

---

## Test 4: Error Handling
**Steps (if you want to test error states):**
1. Open DevTools Network tab
2. Block `/data/sdcards.json` requests
3. Try to open reverse mode or calculate
4. Check what error messages appear

**Expected Result:**
- Red error messages instead of stuck loading
- Console shows full error details for debugging
- User-friendly fallback with link to guide

**Current Behavior Fix:**
- ✓ All error paths have helpful messages
- ✓ No infinite loading states
- ✓ Comprehensive console logging

---

## Console Log Expectations

### Success Path (cards load):
```
[CardSelector] Fetching cards from /data/sdcards.json
[CardSelector] ✓ Loaded 50 cards from JSON
[CalculatorUI] Starting card load...
[CalculatorUI] ✓ Successfully loaded 50 cards
[CalculatorCardRecommendations] Loading recommendations for V30...
[CalculatorCardRecommendations] ✓ Displayed 5 recommendations
```

### Failure Path (cards fail to load):
```
[CardSelector] Fetching cards from /data/sdcards.json
[CardSelector] ✗ Failed to load cards: TypeError: fetch failed
[CardSelector] URL attempted: /data/sdcards.json
[CalculatorUI] Starting card load...
[CalculatorUI] ⚠️ No cards returned from CardSelector.loadCards()
[CalculatorCardRecommendations] Loading recommendations for V30...
[CalculatorCardRecommendations] No cards loaded
```

---

## Files Changed Summary
- `src/js/card-selector.js` - Better error logging
- `src/js/calculator-card-recommendations.js` - Error handling + fallback UI
- `src/js/calculator-ui.js` - Improved logging
- `src/templates/components/calculator-widget.html` - Fixed link, better loading indicator

---

## If Tests Still Fail

**Check these things:**
1. Is `/data/sdcards.json` file actually being served?
   - Try accessing it directly in browser: `http://localhost/data/sdcards.json`
   
2. Is the JSON file valid?
   - Check it has `{ "sdcards": [...] }` structure
   
3. Are all scripts loading?
   - Check DevTools Scripts tab for all 4 JS files:
     - calculator.js
     - calculator-ui.js
     - calculator-card-recommendations.js
     - card-selector.js

4. CORS issues?
   - Check DevTools Network tab for CORS errors on `/data/sdcards.json`

5. Build process issue?
   - Make sure `/data/sdcards.json` is copied to your build output directory
