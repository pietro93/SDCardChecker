# UTM Parameter Setup Guide for Amazon Associates

## What Are UTM Parameters?

UTM (Urchin Tracking Module) parameters are tags added to URLs that tell Google Analytics where the traffic came from. They look like this:

```
https://amazon.com/s?k=SanDisk+Extreme+microSD&tag=sd-cc-20
&utm_source=sdcardchecker
&utm_medium=device-page
&utm_campaign=sandisk-extreme-microsd
&utm_content=recommended-card
```

**Why this matters:** Right now you know people bought, but you DON'T know which device pages drove the sales. UTM parameters solve this.

---

## UTM Parameter Structure

### Required Parameters
| Parameter | Purpose | Example |
|-----------|---------|---------|
| `utm_source` | Where the traffic comes from | `sdcardchecker` |
| `utm_medium` | The type of link | `device-page`, `tool-page`, `guide`, `calculator` |
| `utm_campaign` | The specific campaign/device | `canon-r6-mark-ii`, `dji-mini-4-pro` |

### Optional Parameters
| Parameter | Purpose | Example |
|-----------|---------|---------|
| `utm_content` | What product is being promoted | `recommended-card`, `budget-option`, `professional-option` |
| `utm_term` | Keyword (usually for paid ads, can use for organic) | `best-sd-card` |

---

## How to Structure Your UTM Parameters

### Device Page Example
For a device page recommending multiple cards, use this structure:

```
BASE AMAZON URL
https://amazon.com/s?k=SanDisk+Extreme+microSD&tag=sd-cc-20

WITH UTM PARAMETERS
https://amazon.com/s?k=SanDisk+Extreme+microSD&tag=sd-cc-20&utm_source=sdcardchecker&utm_medium=device-page&utm_campaign=canon-r6-mark-ii&utm_content=recommended-card
```

### Breaking It Down
- `utm_source=sdcardchecker` → All traffic is from your site
- `utm_medium=device-page` → It's from a device page (vs tool, guide, calculator)
- `utm_campaign=canon-r6-mark-ii` → Specifically the Canon R6 Mark II page
- `utm_content=recommended-card` → The "Recommended" tier card (vs Budget or Professional)

---

## Implementation in Your Code

### Option 1: Update generateBrandsTable() (Quick Fix)

In `scripts/generator/generate-device-pages.js`, modify the table generation:

**Before:**
```javascript
<a href="${brand.amazonSearchUrl}" target="_blank" class="table-card-link-wrapper">
```

**After:**
```javascript
const utmParams = `?utm_source=sdcardchecker&utm_medium=device-page&utm_campaign=${device.slug}&utm_content=${brand.tier || 'featured'}`;
const amazonUrl = brand.amazonSearchUrl.includes('?') 
  ? brand.amazonSearchUrl + '&' + utmParams.substring(1)
  : brand.amazonSearchUrl + utmParams;

<a href="${amazonUrl}" target="_blank" class="table-card-link-wrapper">
```

**What this does:**
- `device.slug` = uses the device name (canon-r6-mark-ii, dji-mini-4-pro, etc.)
- `brand.tier` = uses the card tier (recommended, budget, professional)
- Automatically handles whether URL already has query parameters

---

### Option 2: Create a Helper Function (Better Practice)

Add this to `scripts/generator/helpers.js`:

```javascript
/**
 * Add UTM parameters to Amazon affiliate URL
 */
function addUTMtoAmazonUrl(amazonUrl, deviceSlug, cardTier = 'featured') {
  const utmParams = new URLSearchParams();
  utmParams.append('utm_source', 'sdcardchecker');
  utmParams.append('utm_medium', 'device-page');
  utmParams.append('utm_campaign', deviceSlug);
  utmParams.append('utm_content', cardTier);
  
  // Check if URL already has query parameters
  const separator = amazonUrl.includes('?') ? '&' : '?';
  return `${amazonUrl}${separator}${utmParams.toString()}`;
}

module.exports = { ..., addUTMtoAmazonUrl };
```

Then use it in `generateBrandsTable()`:

```javascript
const amazonUrlWithUTM = addUTMtoAmazonUrl(
  brand.amazonSearchUrl, 
  device.slug, 
  brand.tier
);

<a href="${amazonUrlWithUTM}" target="_blank" class="table-card-link-wrapper">
```

---

### Option 3: Update All Links (Comprehensive)

You have 3 places where Amazon links appear:

**1. Brands Table** (generateBrandsTable function)
**2. Alternatives Section** (generateAlternatives function)
**3. FAQ Answers** (if any contain Amazon links)

Apply the UTM helper to all three.

---

## UTM Parameter Naming Convention

### For `utm_campaign` (Device Slug)
Use the device slug directly from your JSON:
- `canon-r6-mark-ii`
- `dji-mini-4-pro`
- `fujifilm-xt5`
- `nintendo-switch-lite`

**Why:** It's already unique per device, matches your URL structure.

### For `utm_content` (Card Tier)
Use the card's tier from sdcards.json:
- `recommended` (best choice, premium card)
- `budget` (affordable option)
- `professional` (high-end option)

**Why:** This tells you which price tier converts best per device.

### For `utm_medium`
- `device-page` = Device-specific pages
- `tool-page` = Tools/calculators
- `guide` = Guide pages
- `category-page` = Category pages
- `home` = Homepage

---

## Testing Your UTM Parameters

### Step 1: Generate a Test URL
```
https://amazon.com/s?k=SanDisk+Extreme+microSD&tag=sd-cc-20&utm_source=sdcardchecker&utm_medium=device-page&utm_campaign=test-device&utm_content=recommended
```

### Step 2: Verify URL is Valid
1. Copy the full URL into your browser
2. It should take you to Amazon search results
3. The URL should NOT have encoding issues

### Step 3: Check Google Analytics
1. Go to Google Analytics 4 → Reports → Acquisition
2. Look for "User acquisition" or "Traffic source"
3. Filter by `utm_source = sdcardchecker`
4. You should see breakdowns by utm_medium, utm_campaign, utm_content

---

## Google Analytics 4 Setup (Required)

### Enable UTM Tracking
**Google Analytics 4 automatically tracks UTM parameters**, but you should set up a custom report:

**Steps:**
1. Log into Google Analytics 4
2. Go to **Reports** → **Exploration**
3. Create new custom report
4. **Dimensions:**
   - Traffic Source (utm_source)
   - Medium (utm_medium)
   - Campaign (utm_campaign)
   - Content (utm_content)
5. **Metrics:**
   - Sessions
   - Conversions (if you set up conversion tracking)
   - Engagement rate

### Enable Conversion Tracking for Purchases
If you want to track affiliate purchases (optional but powerful):

1. Go to **Admin** → **Conversion** events
2. Create custom event: `affiliate_purchase`
3. This requires JavaScript tracking on the destination page (Amazon won't send this back)

**Note:** You likely won't get purchase data back from Amazon, but you CAN track clicks/engagement.

---

## Alternative: Google Analytics 4 Custom Definitions

Set up custom definitions so your UTM parameters appear in nicer reports:

**Steps:**
1. Admin → Custom definitions
2. Create custom dimension: `Campaign Device` (maps to utm_campaign)
3. Create custom metric: `Affiliate Clicks` (count of outbound clicks)

---

## Example Implementation

Here's what the complete code would look like:

**In `generate-device-pages.js`:**

```javascript
function generateBrandsTable(brandReferences, sdcardsMap, deviceSlug) {  // Add deviceSlug parameter
    return brandReferences
        .map((ref) => {
            const brand = sdcardsMap[ref.id];
            if (!brand) {
                console.warn(`Warning: SD card not found: ${ref.id}`);
                return "";
            }
            
            // ADD THIS: Create UTM URL
            const amazonUrl = brand.amazonSearchUrl;
            const utmParams = `?utm_source=sdcardchecker&utm_medium=device-page&utm_campaign=${deviceSlug}&utm_content=${brand.tier || 'featured'}`;
            const amazonUrlWithUTM = amazonUrl.includes('?') 
                ? amazonUrl + '&' + utmParams.substring(1) 
                : amazonUrl + utmParams;
            
            const cardImage = brand.imageUrl || getCardImageFallback(brand);
            const priceTierClass = brand.priceTier ? `price-${brand.priceTier.toLowerCase().replace(/\s+/g, '-')}` : 'price-mid-range';
            
            // Convert pros string to bullet list
            const prosList = brand.pros
                .split(',')
                .map(pro => `<li>${pro.trim()}</li>`)
                .join('');
            const prosHtml = `<ul style="margin:0; padding-left:1.25rem; font-size:0.95rem;">${prosList}</ul>`;
            
            return `
            <tr>
            <td class="table-card-cell">
            <a href="${amazonUrlWithUTM}" target="_blank" class="table-card-link-wrapper">
            <div class="table-card-image">
            <img src="${cardImage}" alt="${brand.name} ${brand.speed} SD card" width="115" height="115" loading="lazy" />
            </div>
            <div class="table-card-name">${brand.name}</div>
            </a>
            </td>
            ...rest of code
            <a href="${amazonUrlWithUTM}" target="_blank" class="btn-check-price">
              <i class="fas fa-shopping-cart"></i> Check Price
            </a>
            </td>
            </tr>
`;
        })
        .join("");
}

// In generateDevicePage(), update the call:
const brandsTableRows = generateBrandsTable(device.recommendedBrands, sdcardsMap, device.slug);
```

---

## What You'll See in Analytics

### Sample Report Output
**Traffic Source Report (with UTM):**

```
Source      | Medium      | Campaign              | Sessions | Conversions
------------|-------------|----------------------|----------|------------
sdcardchecker | device-page | canon-r6-mark-ii     | 45       | 2
sdcardchecker | device-page | fujifilm-xt5         | 38       | 3
sdcardchecker | device-page | dji-mini-4-pro       | 52       | 0
sdcardchecker | tool-page   | storage-calculator   | 23       | 1
```

**Content Report (utm_content):**

```
Campaign              | Content          | Sessions | Avg. Session Duration
---------------------|------------------|----------|---------------------
canon-r6-mark-ii     | recommended      | 30       | 2:45
canon-r6-mark-ii     | budget           | 15       | 1:30
canon-r6-mark-ii     | professional     | 0        | 0:00
```

This tells you:
- Canon R6 Mark II page gets 45 sessions
- 2 conversions came from that page
- Recommended tier cards convert best
- Professional tier cards aren't clicking (yet)

---

## Recommended UTM Rollout

### Phase 1: Device Pages Only (Week 1)
- Add UTM to `generateBrandsTable()` function
- Rebuild all device pages
- Test on 2-3 pages manually
- **Deliverable:** All 98 device pages with working UTM tracking

### Phase 2: Tool Pages (Week 2)
- Add UTM to calculator pages
- Update `utm_medium` to `tool-page`
- Update `utm_campaign` to tool name (e.g., `storage-calculator`, `speed-class-guide`)

### Phase 3: Analytics Review (Week 3)
- Check Google Analytics for data
- Identify which devices drive conversions
- Which tiers convert best
- Optimize based on data

---

## Common Mistakes to Avoid

❌ **Don't:** Use spaces in UTM values
```
utm_campaign=canon r6 mark ii  ❌ WRONG
utm_campaign=canon-r6-mark-ii  ✅ CORRECT
```

❌ **Don't:** Use special characters
```
utm_content=💰+Budget  ❌ WRONG
utm_content=budget     ✅ CORRECT
```

❌ **Don't:** Use inconsistent naming
```
One page: utm_campaign=DJI-Mini-4-Pro
Another: utm_campaign=dji_mini_4_pro
Another: utm_campaign=dji mini 4 pro
✅ USE CONSISTENT NAMING (device.slug)
```

❌ **Don't:** Forget Amazon's tag parameter
```
https://amazon.com/s?k=card&utm_source=  ❌ MISSING TAG
https://amazon.com/s?k=card&tag=sd-cc-20&utm_source=  ✅ CORRECT
```

---

## Quick Implementation Checklist

- [ ] Decide between Option 1 (quick) vs Option 2 (helper function)
- [ ] Update `generateBrandsTable()` with UTM logic
- [ ] Update `generateAlternatives()` with UTM logic (if needed)
- [ ] Pass `device.slug` to both functions
- [ ] Test 2-3 device pages manually
- [ ] Rebuild site with `npm run build`
- [ ] Verify URLs in browser (should work normally)
- [ ] Wait 24 hours for Google Analytics to populate
- [ ] Check Analytics for utm_source=sdcardchecker data
- [ ] Create custom GA4 report for monitoring

---

**Status:** Ready to implement. Start with Option 1 for speed, migrate to Option 2 later if needed.
