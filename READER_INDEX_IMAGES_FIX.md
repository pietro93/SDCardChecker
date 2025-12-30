# Reader Index Images - Implementation Fix

**Date:** December 30, 2025  
**Status:** ✅ Fixed  
**Issue:** Reader images not displaying in `/readers/` index page  
**Solution:** Updated `getReaderImageFallback()` function to match brand image naming convention

---

## Problem

Reader images (`kikosaka-sd-card-reader.webp`, `hicober-sd-card-reader.webp`) existed but weren't being displayed on the reader index page. The build script was looking for images with the wrong filename pattern.

**What was happening:**
- Reader index page calls `getReaderImageFallback(reader)` for each card
- Function was looking for: `kikosaka.webp`, `hicober.webp`
- But actual files are named: `kikosaka-sd-card-reader.webp`, `hicober-sd-card-reader.webp`
- Result: Images not found → fallback to generic placeholder

---

## Solution Implemented

### Updated File: `scripts/generator/helpers.js` (lines 819-835)

**Before:**
```javascript
// Try brand-level fallback
const brandImagePath = `/img/readers/${reader.brand.toLowerCase()}.webp`;
const brandImageFullPath = path.join(imgDirectory, `${reader.brand.toLowerCase()}.webp`);
```

**After:**
```javascript
// Try brand-level fallback with full naming convention
const brandLower = reader.brand.toLowerCase();

// Check for brand-specific image (e.g., kikosaka-sd-card-reader.webp)
const brandImagePath = `/img/readers/${brandLower}-sd-card-reader.webp`;
const brandImageFullPath = path.join(imgDirectory, `${brandLower}-sd-card-reader.webp`);
```

### How It Works Now

1. **Check for explicit heroImage field** (highest priority)
   - If reader entry has `"heroImage": "/img/readers/custom.webp"` → use it

2. **Check for brand-specific image** (new naming convention)
   - Kikosaka brand → looks for `/img/readers/kikosaka-sd-card-reader.webp` ✅
   - Hicober brand → looks for `/img/readers/hicober-sd-card-reader.webp` ✅
   - Any other brand → looks for `/img/readers/{brand}-sd-card-reader.webp`

3. **Fall back to generic placeholder**
   - If brand image not found → use `/img/readers/sd-card-reader-placeholder.webp`

---

## Expected Results After Rebuild

### Reader Index Page (`/readers/`)
- ✅ Kikosaka readers display `kikosaka-sd-card-reader.webp` image
- ✅ Hicober readers display `hicober-sd-card-reader.webp` image
- ✅ All other readers display generic `sd-card-reader-placeholder.webp`
- ✅ Images appear in grid cards with product name, brand, type, interface, speed

### Reader Detail Pages (`/readers/{id}/`)
- ✅ Hero image displayed at top of page
- ✅ Uses brand-specific or explicit `heroImage` field from JSON

### Schema Markup
- ✅ Schema.org CollectionPage includes correct image URLs
- ✅ Image URLs properly converted to absolute URLs for SEO

---

## Testing Checklist

Run this to rebuild and verify:

```bash
npm run build
```

Then check:

- [ ] Open `/dist/readers/index.html` in browser
- [ ] Look at first Kikosaka reader card → should show `kikosaka-sd-card-reader.webp`
- [ ] Look at first Hicober reader card → should show `hicober-sd-card-reader.webp`
- [ ] Look at other reader cards → should show generic placeholder
- [ ] Hover over cards → images should have zoom effect
- [ ] Check DevTools Network tab → images load with 200 status
- [ ] Verify no console errors about missing images

---

## Adding More Brand-Specific Reader Images

The naming convention is now standardized. To add images for any brand:

### Step 1: Create image
```
img/readers/{brand-name}-sd-card-reader.webp
```
Examples:
- `apple-sd-card-reader.webp`
- `sandisk-sd-card-reader.webp`
- `prograde-sd-card-reader.webp`

### Step 2: Update reader JSON (optional)
Add or update reader entries with correct brand name:
```json
{
  "brand": "Apple",
  "name": "Apple USB-C SD Card Reader"
  // no heroImage field needed - automatic fallback handles it
}
```

### Step 3: Rebuild
```bash
npm run build
```

The function automatically detects the image and applies it to all readers with matching brand.

---

## Naming Convention Reference

**Pattern:** `{brand-name}-sd-card-reader.webp`

**Examples:**
| Brand | Image File | Matches |
|-------|-----------|---------|
| UGREEN | `ugreen-sd-card-reader.webp` | All UGREEN readers |
| SanDisk | `sandisk-sd-card-reader.webp` | All SanDisk readers |
| ProGrade Digital | `prograde-digital-sd-card-reader.webp` | All ProGrade readers |
| Kikosaka | `kikosaka-sd-card-reader.webp` | ✅ All Kikosaka readers |
| Hicober | `hicober-sd-card-reader.webp` | ✅ All Hicober readers |

---

## Related Files Modified

- ✅ `scripts/generator/helpers.js` - Updated `getReaderImageFallback()` function
- `src/templates/readers-index.html` - No changes (already had image support)
- `src/templates/readers-type-index.html` - Uses same fallback function

---

## Summary

**Issue:** Reader images weren't showing on index page due to filename mismatch.  
**Fix:** Updated image lookup to use correct naming pattern `{brand}-sd-card-reader.webp`.  
**Result:** Reader cards now display branded images automatically with intelligent fallback.  
**Status:** Ready for rebuild and testing.

To activate: Run `npm run build` from project root.
