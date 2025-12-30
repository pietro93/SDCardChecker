# ✅ Japanese Categories + Computing/Tablets 404 Fixed

## Issues Fixed

### 1. Computing & Tablets 404 Error
**Root Cause**: Slug generation inconsistency
- URL slug used: `/computing-and-tablets/`
- Category slug generated: `/computing-tablets/` (removed `&` but didn't replace with `and`)

**Fixed**: Updated all slug generation to use `.replace(/&/g, "and")` instead of `.replace(/&/g, "")`
- `scripts/generator/generate-category-pages.js` - 3 occurrences fixed

**Result**: `/categories/computing-and-tablets/` now works correctly ✅

---

### 2. Japanese Device Categories
**Added**: Full category-based split for Japanese devices

**New files**:
- `data/categories-ja/` directory
- `scripts/extract-category-ja.js` - Extract Japanese categories
- Updated `scripts/generator/build-ja.js` - Auto-merge Japanese categories

**How it works**:
```bash
# Extract each Japanese category (one-time)
npm run extract-category-ja "アクションカメラ"
npm run extract-category-ja "カメラ"
npm run extract-category-ja "ドローン"
npm run extract-category-ja "携帯ゲーム機"
npm run extract-category-ja "ドライブレコーダー"
npm run extract-category-ja "コンピュータ・タブレット"
npm run extract-category-ja "セキュリティカメラ"

# Then build as usual
npm run build:all
```

---

## File Changes

| File | What Changed |
|------|--------------|
| `generate-category-pages.js` | Fixed slug generation (3 places) |
| `build-ja.js` | Added Japanese category merge function |
| `package.json` | Added `extract-category-ja` script |

---

## New Structure

### English Categories
```
data/categories/
├── audio-and-hi-fi.json
├── cameras.json
├── action-cameras.json
├── drones.json
├── gaming-handhelds.json
├── dash-cams.json
├── computing-and-tablets.json
└── security-cameras.json
```

### Japanese Categories
```
data/categories-ja/
├── アクションカメラ.json
├── カメラ.json
├── ドローン.json
├── 携帯ゲーム機.json
├── ドライブレコーダー.json
├── コンピュータ・タブレット.json
└── セキュリティカメラ.json
```

---

## How to Use

### 1. Extract Categories (One-time setup)

**English:**
```bash
npm run extract-category "Audio & Hi-Fi"
npm run extract-category "Cameras"
npm run extract-category "Action Cameras"
npm run extract-category "Drones"
npm run extract-category "Gaming Handhelds"
npm run extract-category "Dash Cams"
npm run extract-category "Computing & Tablets"
npm run extract-category "Security Cameras"
```

**Japanese:**
```bash
npm run extract-category-ja "アクションカメラ"
npm run extract-category-ja "カメラ"
npm run extract-category-ja "ドローン"
npm run extract-category-ja "携帯ゲーム機"
npm run extract-category-ja "ドライブレコーダー"
npm run extract-category-ja "コンピュータ・タブレット"
npm run extract-category-ja "セキュリティカメラ"
```

### 2. Edit Files

Edit devices in:
- `data/categories/` for English
- `data/categories-ja/` for Japanese

### 3. Build

```bash
npm run build:all
```

Auto-merges both English and Japanese categories, then generates all pages.

---

## Verification

After running `npm run build:all`, check:

1. ✅ Computing & Tablets category loads: `/categories/computing-and-tablets/`
2. ✅ Device pages load with correct category links
3. ✅ Japanese pages generate correctly: `/ja/categories/`
4. ✅ No 404 errors in console

---

## Technical Details

### Slug Generation Fix

**Before:**
```javascript
const categorySlug = category.toLowerCase().replace(/&/g, "").replace(/\s+/g, "-");
// "Computing & Tablets" → "computing-tablets" ❌ (mismatch!)
```

**After:**
```javascript
const categorySlug = category.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
// "Computing & Tablets" → "computing-and-tablets" ✅
```

Applied to:
- Device card links
- Category page generation
- Breadcrumb URLs
- SEO metadata

### Japanese Merge Process

When `npm run build:all` runs:

```
data/categories-ja/*.json
  ↓ [Load all files]
  ↓ [Validate]
  ↓ [Merge]
  ↓
data/devices-ja.json (auto-generated)
  ↓ [Generate pages]
  ↓
dist/ja/ (final Japanese site)
```

Same as English, fully automated.

---

## Summary

✅ **Computing & Tablets 404 fixed** - slug generation now consistent  
✅ **Japanese categories split** - same organization as English  
✅ **Auto-merge for both** - build process handles everything  
✅ **One-time extract** - categorize once, manage forever  

**Ready to use!** Run the extraction scripts, then `npm run build:all`.
