# VIOFO A229 Duo - Category Correction

**Status:** ✅ Fixed  
**Date:** December 29, 2025  
**Issue:** VIOFO A229 Duo was in "Action Cameras" category instead of "Dash Cams"

---

## What Was Wrong

**File:** `data/devices.json`  
**Entry ID:** `viofo-a229-duo`  
**Line:** 1084  

**Before:**
```json
{
  "id": "viofo-a229-duo",
  "name": "VIOFO A229 Duo",
  "category": "Action Cameras",  ❌ WRONG
  "slug": "viofo-a229-duo",
```

**After:**
```json
{
  "id": "viofo-a229-duo",
  "name": "VIOFO A229 Duo",
  "category": "Dash Cams",  ✅ CORRECT
  "slug": "viofo-a229-duo",
```

---

## Why This Was Wrong

- VIOFO A229 Duo is a **dash cam**, not an action camera
- It records vehicle footage in continuous loop mode
- It requires High Endurance cards (like other dash cams), not standard speed class cards
- Should be listed in the Dash Cams category with other dash cams (Garmin, BlackVue, etc.)

---

## VIOFO A229 Entries

There are actually **TWO** VIOFO A229 entries in devices.json:

| ID | Name | Category | Status |
|---|---|---|---|
| `viofo-a229-duo` | VIOFO A229 Duo | Dash Cams | ✅ Fixed |
| `viofo-a229-plus` | Viofo A229 Plus Duo | Dash Cams | ✅ Already correct |

Both are now correctly categorized as Dash Cams.

---

## Japanese Version

**Status:** devices-ja.json is in Phase 1 translation (45/140 devices completed)

The viofo-a229-duo entry is referenced in relatedDevices sections but doesn't have a full device entry yet in the Japanese version. This is expected as the Japanese translation is still in progress and focuses on the most important devices first.

**Plan:** Once the Japanese translation is expanded to include more devices, viofo-a229-duo will be added with the correct "ドライブレコーダー" (Dash Cam) category.

---

## Impact

After rebuild:
- ✅ VIOFO A229 Duo appears on `/categories/dash-cams/` page
- ✅ Removed from `/categories/action-cameras/` page
- ✅ Device page at `/devices/viofo-a229-duo/` shows correct category
- ✅ Related device links work correctly

---

## Files Modified

- ✅ `data/devices.json` - Line 1086: Changed category from "Action Cameras" to "Dash Cams"

No code changes needed—category is used by the generator to organize pages.

---

## How to Verify

```bash
npm run build

# Check category pages
grep -l "viofo-a229-duo" dist/categories/dash-cams/index.html  # Should find it
grep -l "viofo-a229-duo" dist/categories/action-cameras/index.html  # Should NOT find it

# Check device page
cat dist/devices/viofo-a229-duo/index.html | grep "category"  # Should show Dash Cams
```
