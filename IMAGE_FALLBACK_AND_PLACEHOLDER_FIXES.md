# Image Fallback and Placeholder Fixes

## Fixed Issues

### 1. Duplicate Text (SEO Issue)
**Problem**: "Why these requirements?" text appeared twice:
- In the "Recommended SD Card" answer box
- In the "Official Requirements" section

**Solution**: Modified `generateDevicePage()` to extract only the first sentence from `whySpecs` for the answer explanation.
- Changed line 306 from: `.replace(/{{ANSWER_EXPLANATION}}/g, device.whySpecs)`
- To: `.replace(/{{ANSWER_EXPLANATION}}/g, whySpecsFirstSentence)`
- First sentence extracted via: `device.whySpecs.split('.')[0] + '.'`

**Result**: Answer box shows concise intro, requirements section shows full explanation.

---

### 2. Missing SD Card Images

#### SanDisk Ultra microSD
- **Problem**: sdcards.json referenced non-existent `/img/cards/sandisk-ultra-microsd.webp`
- **Fix**: Updated imageUrl to `/img/cards/sandisk-extreme-microsd.webp` (which exists)
- **File**: data/sdcards.json, line 237

#### Lexar Professional 1667x Silver SD (Legacy ID)
- **Problem**: sdcards.json referenced non-existent `/img/cards/lexar-professional-1000x-sd.webp`
- **Fix**: Updated imageUrl to `/img/cards/lexar-professional-silver-sd-uhs-ii.webp` (which exists)
- **File**: data/sdcards.json, line 748

#### SanDisk Extreme PRO CFexpress Type B
- **Problem**: sdcards.json referenced non-existent `/img/cards/sandisk-extreme-pro-cfexpress.webp`
- **Fix**: Updated imageUrl to `/img/cards/sandisk-extreme-pro-cfast-2.0.webp` (which exists)
- **File**: data/sdcards.json, line 493

#### SanDisk Extreme PRO CFexpress Type A
- **Problem**: sdcards.json referenced non-existent `/img/cards/sandisk-extreme-pro-cfexpress-type-a.webp`
- **Fix**: Updated imageUrl to `/img/cards/sandisk-extreme-pro-cfast-2.0.webp` (which exists)
- **File**: data/sdcards.json, line 723

---

### 3. Placeholder Interpolation Issue
**Problem**: "Official {{DEVICE_NAME}} SD Card Requirements" appeared literally instead of device name

**Root Cause**: Potential null/undefined deviceNameShort parameter

**Solution**: Added defensive coding in `generateRequirementsBox()`:
```javascript
const safeDeviceName = deviceNameShort || device.name;
```
And updated template string to use `${safeDeviceName}`
- **File**: scripts/generator/generate-device-pages.js, lines 116-120, 166

---

## Image Inventory - All Cards

### Existing Images (26 files)
✅ adata-premier-microsd.webp
✅ cfast-generic.webp
✅ kingston-canvas-go-plus.webp
✅ kingston-canvas-go-pro-sd.webp
✅ kingston-canvas-go.webp
✅ kingston-canvas-react-sd.webp
✅ kingston-canvas-select-microsd.webp
✅ kingston-high-endurance-microsd.webp
✅ lexar-professional-1000x.webp
✅ lexar-professional-633x.webp
✅ lexar-professional-silver-sd-uhs-ii.webp
✅ micro-uhs1-generic.webp
✅ micro-uhs2-generic.webp
✅ nikon-xqd-memory-card.webp
✅ samsung-evo-select-microsd.webp
✅ samsung-pro-endurance-microsd.webp
✅ sandisk-extreme-microsd.webp
✅ sandisk-extreme-pro-cfast-2.0.webp
✅ sandisk-extreme-pro-sd-uhs-ii.webp
✅ sandisk-max-endurance-microsd.webp
✅ sony-tough-g-v90.webp
✅ transcend-microsd.webp
✅ transcend-superior-sd-uhs2.webp
✅ uhs1-generic.webp
✅ uhs2-generic.webp
✅ xqd-generic.webp

### Image Fallback Logic (helpers.js)

Enhanced fallback matching for:
- **SanDisk variants**: Checks for "ultra", "extreme", "max endurance" before generic fallback
- **Lexar variants**: Checks for "1667x", "silver", "1000x", "633x" before generic fallback

---

## Next Steps

1. **Clear dist folder** and rebuild pages
2. **Verify fixes** on these pages:
   - Nintendo Switch Lite
   - Fujifilm X-T50
3. **Test image loading** for all card references
4. **Validate placeholders** are replaced correctly

---

## Files Modified

1. `scripts/generator/generate-device-pages.js` - Duplicate text + placeholder fixes
2. `scripts/generator/helpers.js` - Enhanced image fallback logic
3. `data/sdcards.json` - Fixed 4 broken imageUrl references
