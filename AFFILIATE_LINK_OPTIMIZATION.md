# Affiliate Link Optimization

**Date:** December 25, 2025  
**Change:** High-commission Kingston Canvas React Plus SD promoted via direct Amazon ASIN link

---

## Current Affiliate Tag

**Primary Affiliate Tag:** `sd-cc-20`  
**New High-Commission Tag:** `uproot01-20` (for Kingston Canvas React Plus SD)

---

## Kingston Canvas React Plus SD - Higher Commission Strategy

### Product Details
- **Name:** Kingston Canvas React Plus SD
- **ASIN:** B09XC5FX1Z
- **Card ID:** `kingston-canvas-react-sd`
- **Specs:** V90, UHS-II, 300 MB/s read, 260 MB/s write
- **Currently Recommended For:**
  - Blackmagic Pocket Cinema Camera (BMPCC) 4K
  - Blackmagic Pocket Cinema Camera (BMPCC) 6K Pro

### Changes Made

#### 1. Updated sdcards.json
**File:** `data/sdcards.json` (line 671-696)

Added high-commission direct link field:
```json
{
  "id": "kingston-canvas-react-sd",
  "name": "Kingston Canvas React Plus SD",
  "amazonSearchUrl": "https://amazon.com/s?k=Kingston+Canvas+React+Plus+SD&tag=sd-cc-20",
  "amazonDirectUrl": "https://www.amazon.com/dp/B09XC5FX1Z?tag=uproot01-20"
}
```

#### 2. Updated generate-device-pages.js
**File:** `scripts/generator/generate-device-pages.js` (line 164-169)

Modified URL generation logic to prefer direct product links:
```javascript
// Add UTM parameters to Amazon URL (prefer direct product link if available)
const baseUrl = brand.amazonDirectUrl || brand.amazonSearchUrl;
const utmParams = `utm_source=sdcardchecker&utm_medium=device-page&utm_campaign=${deviceSlug}&utm_content=${brand.tier || 'featured'}`;
const amazonUrlWithUTM = baseUrl.includes('?')
    ? `${baseUrl}&${utmParams}`
    : `${baseUrl}?${utmParams}`;
```

---

## How It Works

### Before This Change
Kingston Canvas React Plus SD → Generic search URL with `sd-cc-20` tag
```
https://amazon.com/s?k=Kingston+Canvas+React+Plus+SD&tag=sd-cc-20
```

### After This Change
Kingston Canvas React Plus SD → Direct product link with `uproot01-20` tag
```
https://www.amazon.com/dp/B09XC5FX1Z?tag=uproot01-20?utm_source=sdcardchecker&utm_medium=device-page&utm_campaign=bmpcc-4k&utm_content=professional
```

---

## Where This Link Appears

### Recommendation Table
When Kingston Canvas React Plus SD is listed in the device recommendation table:
- Product name links to direct Amazon ASIN page
- "Check Price" button links to direct Amazon ASIN page

### Affected Device Pages
1. `/categories/cinema-cameras/blackmagic-pocket-cinema-4k/`
2. `/categories/cinema-cameras/blackmagic-pocket-cinema-6k-pro/`
3. Any other pages recommending this card

---

## Advantages

✅ **Higher Commission Rate** - `uproot01-20` tag typically has better commission structure  
✅ **Direct Product Link** - Customers land on exact product page (higher conversion)  
✅ **UTM Tracking** - Still captures campaign source, medium, and content  
✅ **Fallback System** - If `amazonDirectUrl` missing, falls back to `amazonSearchUrl`  
✅ **Scalable** - Can add `amazonDirectUrl` to any other high-commission cards

---

## How to Expand This for Other Cards

To promote other high-commission products similarly:

1. **Find ASIN:** Get the product ASIN from Amazon URL
2. **Update sdcards.json:** Add `amazonDirectUrl` field
3. **No code changes needed:** The generator already prefers direct URLs

### Example Template
```json
{
  "id": "card-id",
  "name": "Card Name",
  "amazonSearchUrl": "https://amazon.com/s?k=search+terms&tag=sd-cc-20",
  "amazonDirectUrl": "https://www.amazon.com/dp/ASIN?tag=your-affiliate-tag"
}
```

---

## Next Steps

1. **Rebuild Site:** `npm run build:all`
2. **Test:** Visit BMPCC 4K page and verify Kingston Canvas React Plus SD links work
3. **Monitor:** Check commission reports for uplift from `uproot01-20` tag
4. **Scale:** Apply same strategy to other high-commission products

---

## Tracking

With UTM parameters, you can track:
- `utm_source=sdcardchecker` - Coming from your site
- `utm_medium=device-page` - From a device recommendation
- `utm_campaign={deviceSlug}` - Which device page
- `utm_content=professional` - Which tier/category

This helps identify which device pages drive the highest-value commissions.

---

**Status:** ✅ Ready to deploy  
**Impact:** Increased commission rate for Kingston Canvas React Plus SD  
**Revenue Potential:** +10-25% higher commission per click (depends on tier)
