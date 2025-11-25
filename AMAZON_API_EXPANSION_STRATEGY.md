# Amazon Featured Products Expansion Strategy

**Document Purpose:** Plan rollout of Amazon affiliate products to guide pages and potentially calculator pages

**Date:** November 25, 2025

---

## Executive Summary

You currently have Amazon featured products on **device pages only** (104 pages). This strategy outlines where to expand, what products to show, and why certain pages should/shouldn't get products.

**Key insight:** Calculator pages already show **tailored SD card recommendations** based on user input. Adding generic Amazon products there would be redundant and harm UX. Guides are the primary expansion opportunity.

---

## Current State Analysis

### What We Have
- ✅ Device pages: Show 3 featured products (top products from 5 cached searches)
- ✅ Amazon API script: Fetches & caches products at build time
- ✅ Card styling: Professional product cards with Amazon orange button
- ✅ Affiliate attribution: Proper disclaimer on each section

### What We Don't Have
- ❌ Category-specific searches (currently 5 generic products)
- ❌ Products on guide pages
- ❌ Products on calculator pages (but shouldn't add - see below)
- ❌ Context-aware product filtering (show "best 4K cards" on 4K-related pages)

---

## Page Analysis: Where to Add Products

### ✅ GUIDES - YES, Add Products

**Why:** Guides are educational/reference content with **no user interaction**. Products add value as concrete examples.

| Guide Page | Current Content | Product Opportunity |
|---|---|---|
| **SD Card Guide** | Explains SDHC vs SDXC, V30 vs V60, etc | Show example cards for each type/speed class |
| **Speed Classes Guide** | Explains V10, V30, V60, V90 | Show a V10 card, V30, V60, V90 example |
| **Video Bitrate Comparison** | Explains bitrate → speed class needs | Show cards for 1080p (V10), 4K (V30), 8K (V60/V90) |
| **RAW vs JPEG Guide** | Explains file sizes & buffer needs | Show professional cards (SanDisk Extreme PRO, Sony TOUGH) |
| **Fake SD Card Checker** | How to spot counterfeit cards | Show authentic cards from legitimate brands |

**Product Search Keywords Needed:**
```javascript
{ 
  filename: 'guide-speed-classes.json', 
  keywords: [
    'V10 SD card',
    'V30 SD card', 
    'V60 SD card',
    'V90 SD card'
  ]
},
{
  filename: 'guide-raw-jpeg.json',
  keywords: [
    'SanDisk Extreme PRO SD card',
    'Sony TOUGH SD card',
    'professional SDXC card'
  ]
}
```

### ✅ CALCULATORS - YES, Add API-Linked Recommendations

**Why:** Calculators **already show tailored recommendations**. Complement with live Amazon pricing for those exact cards.

**Current Flow:**
1. User selects: GoPro Hero 13 + 5.3K mode + 2TB needed
2. System calculates: Need 128GB+ V30 card
3. **Recommendation section shows:** "Kingston Canvas Go Plus" (tailored to their need)

**With API Enhancement:**
1. User sees tailored recommendation
2. Below recs: "Check Current Pricing" section
3. Shows the **exact same card** with live Amazon price & availability
4. Single button: "View on Amazon"

**Why this works:**
- No confusion (same card shown)
- Answers user's next question: "Where can I buy this? What's the price today?"
- Removes friction (direct link to product)
- Higher conversion (user is ready to buy after calculation)
- Better UX than generic products (contextual & relevant)

**Product Search Strategy:**
Search for the **exact recommended cards** from your sdcards.json:
```
Calculator page → Extract top recommendation → Search Amazon for that card → Show live price
```

**No need for generic searches** - only search for cards you actually recommend

### ❌ CATEGORY PAGES - Maybe Later

**Why skip for now:**
- Users on category pages (gaming-handhelds, cameras, drones) want to **explore devices**, not buy cards yet
- Better UX: Let them browse devices → view device page → see featured products
- Stage 2 opportunity: Add "Popular cards for [category]" section at bottom

---

## Proposed Implementation Phases

### Phase 1: Expand API Searches (Week 1)

**Goal:** Create guide-specific and calculator-specific product cache files

**Modify:** `scripts/build-amazon-data.js`

```javascript
const searches = [
  // Current (keep as-is for device pages)
  { filename: 'featured-general.json', keywords: ['Kingston Canvas Go Plus 128GB microSD'] },
  
  // GUIDES: Educational context
  {
    filename: 'guide-speed-classes.json',
    keywords: [
      'Kingston Canvas Go V10 microSD',
      'SanDisk Extreme V30 microSD', 
      'Lexar Professional V60 SD card',
      'Sony TOUGH V90 SD card'
    ]
  },
  {
    filename: 'guide-professional-cameras.json',
    keywords: [
      'SanDisk Extreme PRO SD UHS-II',
      'Sony TOUGH G V90 SD card',
      'Lexar Professional Gold UHS-II'
    ]
  },
  {
    filename: 'guide-raw-jpeg.json',
    keywords: [
      'professional SDXC card fast write',
      'camera CF express type B card'
    ]
  },
  {
    filename: 'guide-fake-detection.json',
    keywords: [
      'genuine SanDisk Extreme microSD',
      'authentic Kingston Canvas microSD'
    ]
  },
  
  // CALCULATORS: Recommended card searches
  // Search for the exact cards from calculator recommendation engine
  {
    filename: 'calculator-recommended.json',
    keywords: [
      'Kingston Canvas Go Plus microSD',
      'SanDisk Extreme microSD V30',
      'Samsung EVO Select microSD',
      'Lexar Professional Silver microSD',
      'Kingston Canvas Select Plus',
      'SanDisk MAX ENDURANCE',
      'Samsung PRO Endurance',
      'Lexar Professional Gold UHS-II',
      'SanDisk Extreme PRO SD UHS-II'
    ]
  }
];
```

**Output:** Creates 6 cache files (5 guide-specific + 1 calculator with recommended cards)

---

### Phase 2: Update Generator for Multiple Product Types (Week 1)

**Goal:** Allow badge generator to load different product sets by type

**Modify:** `scripts/generator/amazon-badges-generator.js`

```javascript
/**
 * Generate featured products section
 * @param {string} type - 'featured' (default), 'speed-classes', 'professional', etc
 * @param {number} count - how many products to show (default: 3)
 * @returns {string} HTML section or empty string
 */
function generateAmazonBadgesSection(type = 'featured-general', count = 3) {
  const cacheFile = `${type}.json`;
  const products = loadCachedProducts(cacheFile);
  
  if (!products || products.length === 0) return '';
  
  const topProducts = products.slice(0, count);
  // ... rest of implementation
}
```

**Export new function:** `generateAmazonBadgeSectionByType(type, count)`

---

### Phase 3: Add to Guide Pages (Week 2)

**Goal:** Integrate featured products into guide templates

**Files to Modify:**
- `src/templates/guides/sd-card-guide.html`
- `src/templates/guides/sd-card-speed-classes.html`
- `src/templates/guides/raw-vs-jpeg.html`
- etc.

**Example (sd-card-speed-classes.html):**

```html
<!-- Existing guide content -->
<section id="v30-explained">
  <h2>V30 Speed Class Explained</h2>
  <p>V30 means minimum 30 MB/s sustained write...</p>
</section>

<!-- NEW: Featured V30 cards -->
<section class="mt-12">
  {{AMAZON_FEATURED_V30}}
</section>
```

**Generator modification (generate-resource-pages.js):**

```javascript
let htmlContent = template;

// Replace placeholders with product sections
htmlContent = htmlContent.replace(
  '{{AMAZON_FEATURED_V30}}',
  generateAmazonBadgeSectionByType('guide-speed-classes', 3)
);

htmlContent = htmlContent.replace(
  '{{AMAZON_FEATURED_PROFESSIONAL}}',
  generateAmazonBadgeSectionByType('guide-professional-cameras', 3)
);
```

---

### Phase 4: Test & Monitor (Week 2)

**Checklist:**
- [ ] Run build locally
- [ ] Verify cache files created: `data/amazon-cache/guide-*.json`
- [ ] Check guide pages in `dist/guides/` render products correctly
- [ ] Verify affiliate links have correct tag (`sd-cc-20`)
- [ ] Test on mobile (cards should stack)
- [ ] Check page load time (should be 0 impact - static HTML)

**Monitoring:**
- Watch cache files for empty results
- Monitor affiliate link clicks (Google Analytics)
- Check for API rate limiting errors in Cloudflare build logs

---

## Technical Details

### API Script Changes Required

**File:** `scripts/build-amazon-data.js`

```javascript
// Change from single keyword to array of keywords per search
const searches = [
  {
    filename: 'guide-speed-classes.json',
    keywords: [
      'Kingston Canvas Go V10 microSD',
      'SanDisk Extreme V30 microSD',
      'Lexar Professional V60 SD card',
      'Sony TOUGH V90 SD card'
    ]
  }
];

// Loop through keywords and aggregate results
for (const { filename, keywords } of searches) {
  let allResults = [];
  
  for (const keyword of keywords) {
    const products = await searchSDCards(keyword);
    allResults = allResults.concat(products);
  }
  
  // De-duplicate and save top 5
  saveToCache(filename, allResults.slice(0, 5));
}
```

### Generator Changes Required

**File:** `scripts/generator/amazon-badges-generator.js`

```javascript
// Add new function alongside existing generateAmazonBadgesSection
function generateAmazonBadgeSectionByType(type = 'featured-general', count = 3, title = 'Featured Products on Amazon') {
  try {
    const cacheFile = `${type}.json`;
    const products = loadCachedProducts(cacheFile);
    
    if (!products || products.length === 0) return '';
    
    const topProducts = products.slice(0, count);
    const badgesHTML = topProducts
      .map((product, index) => generateProductBadgeHTML(product, index))
      .join('');
    
    return `
      <section id="amazon-products-${type}" class="mb-16 scroll-mt-20">
        <h3 class="text-2xl font-bold text-slate-900 mb-6">${title}</h3>
        <p class="text-xs text-slate-500 mb-6">This website contains affiliate links. We may earn a small commission when you purchase through our links at no extra cost to you.</p>
        <div class="amazon-badges-grid">
          ${badgesHTML}
        </div>
      </section>
    `;
  } catch (error) {
    console.warn(`  ⚠️  Error generating Amazon badges section (${type}):`, error.message);
    return '';
  }
}

module.exports = {
  generateAmazonBadgesSection,
  generateAmazonBadgeSectionByType,  // NEW
  loadCachedProducts,
  generateProductBadgeHTML
};
```

---

## Content Placement Strategy

### By Page Type

#### Guide Pages

| Page | Placement | Product Type | Count | UX Copy |
|---|---|---|---|---|
| **SD Card Guide** | Bottom of page | All types mixed | 3 | "Featured Cards by Type" |
| **Speed Classes** | After V30 section | V30 examples | 2 | "V30 Cards in Action" |
| | | After V60 section | V60 examples | 2 | "V60 Cards in Action" |
| | | After V90 section | V90 examples | 2 | "V90 Cards in Action" |
| **RAW vs JPEG** | Below comparison table | Professional cards | 3 | "Professional-Grade Cards" |
| **Video Bitrate** | After 8K section | V60/V90 cards | 3 | "Cards for 8K Recording" |
| **Fake SD Card** | After authenticity tips | Brands mentioned | 3 | "Buy Authentic Cards" |

#### Calculator Pages

| Page | Placement | Product Type | Count | UX Copy |
|---|---|---|---|---|
| **All Calculators** | Below recommendation section | Recommended cards only | 1 | "Check Current Pricing" |
| | | (same card as calculator suggests) | | Button: "View on Amazon" |

**Why single product on calculators:** User already has their specific recommendation. Showing that exact card with live Amazon pricing removes friction to purchase. Multiple options create decision paralysis when they've already got their answer.

---

## What NOT to Do

### ❌ Don't Add Generic Products to Calculators

**Why:**
- Users already have a specific recommendation
- Generic products (different brands/models) create confusion
- "Which Kingston card should I buy?" defeats the purpose

**Do Instead:**
- Show the **exact same card** the calculator recommended
- Use contextual header: "Check Current Pricing" (not "Featured Products")
- Single product card (not 3) to reduce decision fatigue

### ❌ Don't Show Irrelevant Products

**Why:**
- User on "GoPro Storage" page shouldn't see professional cinema cards
- Damages trust if recommendations seem random
- Wastes affiliate link potential

**Solution:** Always search for products relevant to the page topic

### ❌ Don't Spam Too Many Products

**Why:**
- 3 cards is standard e-commerce (easy to scan)
- 5+ creates analysis paralysis
- Pushes other content too far down

**Rule:** Max 3 products per section, max 2 sections per page

### ❌ Don't Forget API Rate Limiting

**Why:**
- Amazon allows ~1 req/sec for new associates
- Multiple keyword searches = multiple API calls
- Need proper delay between requests

**Solution:** Keep `REQUEST_DELAY_MS = 2500` or increase if getting 429 errors

---

## Success Metrics

After Phase 4, measure:

| Metric | Target | How to Check |
|---|---|---|
| Build completes | No errors | Cloudflare build log |
| Cache files created | 4+ new files | `data/amazon-cache/guide-*.json` |
| Products load | All pages show cards | Visual inspection |
| API success rate | >95% | Check build output |
| Ratings populated | >50% have ratings | Check cache JSON |
| Click-through rate | >2% | Google Analytics |
| No layout shift | CLS = 0 | PageSpeed Insights |

---

## Risk Mitigation

### Risk: API Fails, Guide Pages Show Nothing

**Mitigation:** Graceful degradation
- `generateAmazonBadgeSectionByType()` returns empty string if cache missing
- Guide pages are still readable without product cards
- No visual breakage

### Risk: Ratings Still Zero

**Root cause:** Amazon Associates account tier limits
- **Investigation needed:** Check account settings at associates.amazon.com
- **Workaround:** Remove rating display, show price only (users still get useful data)

### Risk: Build Times Increase

**Current:** ~30 seconds with 5 searches
**Projected:** ~60 seconds with 15+ searches

**Mitigation:** 
- Run API calls sequentially (already doing)
- Monitor in Cloudflare (set build timeout to 120 seconds)
- Consider caching strategy if needed later

---

## Timeline

| Phase | Scope | Duration | Owner |
|---|---|---|---|
| 1 | Expand API searches | 2-3 hours | Dev |
| 2 | Update generator code | 2-3 hours | Dev |
| 3 | Modify guide templates | 4-6 hours | Dev |
| 4 | Test & deploy | 1-2 hours | Dev |
| **Total** | **All phases** | **9-14 hours** | - |

---

## Next Steps

1. **Review & Approve:** Do you agree with guide pages being priority?
2. **Decide on Keywords:** What specific cards matter for each guide?
3. **Start Phase 1:** Expand `build-amazon-data.js` with guide-specific searches
4. **Test locally:** Verify cache files generate correctly
5. **Deploy to Cloudflare:** Trigger build, monitor logs

---

## Open Questions

1. **Ratings issue:** Should we investigate Amazon account tier, or proceed without ratings?
2. **Calculator integration:** How to dynamically match recommended card to Amazon product? Need product ID mapping in sdcards.json?
3. **Fallback behavior:** If calculator rec not found in Amazon cache, show nothing or fall back to general recommended cards?
4. **Category pages:** Defer to Phase 5, or address in Phase 4?
5. **SEO impact:** Any concern about adding affiliate sections to guides?
6. **Multiple recommendations:** Some calculators show 3+ cards. Show only top 1 on pricing section?
