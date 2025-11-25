# Amazon PAAPI Build-Time Integration Guide
**SDCardChecker - Generate Product Data During Cloudflare Pages Build**

**Last Updated:** November 25, 2025

---

## Overview

This guide explains how to integrate Amazon's Product Advertising API into SDCardChecker's **build process** (not at runtime). API calls happen once during Cloudflare Pages build, data is cached as JSON, and product badges are embedded in static HTML.

**Architecture:**
```
Trigger Build → Node.js Script → Call Amazon PAAPI → Cache JSON Data → Embed in HTML → Deploy
```

**Benefits:**
- ✅ All content rendered at build time (perfect for SEO)
- ✅ No runtime API calls (fast page loads)
- ✅ No layout shifts or loading spinners
- ✅ Graceful fallback if API fails (uses cached data)
- ✅ Complete HTML for search engines

---

## Prerequisites: Amazon API Credentials

**Follow the credential setup guide first:** Your original `Amazon Product Advertising API (PAAPI) Integration Guide` covers:
- Amazon Associates account registration
- Getting API Access Key & Secret Key
- Getting Affiliate Tag
- Storing credentials in Cloudflare Pages environment variables

**Once you have these 3 credentials**, proceed to Phase 2 below.

---

## Phase 2: Install Dependencies (Day 1)

### Step 2.1: Add amazon-paapi Package

```bash
npm install amazon-paapi
npm install dotenv  # for local testing
```

Verify:
```bash
npm list amazon-paapi
```

**Checklist:**
- ✅ `amazon-paapi` installed
- ✅ `dotenv` installed

---

## Phase 3: Create Build-Time API Script (Day 2)

### Step 3.1: Create Amazon API Utility

Create file: `src/utils/amazon-api.js`

```javascript
// src/utils/amazon-api.js
const common = require('amazon-paapi');

/**
 * Amazon PAAPI configuration and rate-limited search
 * Called during build process ONLY (not at runtime)
 */

const commonParameters = {
  AccessKey: process.env.AMAZON_ACCESS_KEY,
  SecretKey: process.env.AMAZON_SECRET_KEY,
  PartnerTag: process.env.AMAZON_TAG,
  PartnerType: 'Associates',
  Marketplace: 'www.amazon.com'
};

// Rate limiting: Amazon allows ~1 request/second for new associates
let lastRequestTime = 0;
const REQUEST_DELAY_MS = 2500; // 2.5 seconds between requests

/**
 * Enforce rate limiting between API calls
 */
async function delayIfNeeded() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < REQUEST_DELAY_MS) {
    await new Promise(resolve => 
      setTimeout(resolve, REQUEST_DELAY_MS - timeSinceLastRequest)
    );
  }
  lastRequestTime = Date.now();
}

/**
 * Search for SD card products on Amazon
 * @param {string} keywords - What to search for
 * @returns {Promise<Array>} Array of product objects or empty array on error
 */
async function searchSDCards(keywords) {
  // Validate credentials exist
  if (!commonParameters.AccessKey || !commonParameters.SecretKey || !commonParameters.PartnerTag) {
    console.warn('⚠️  Amazon API credentials missing (check .env or Cloudflare env vars)');
    return [];
  }

  if (!keywords) {
    console.error('❌ Keywords required for search');
    return [];
  }

  try {
    // Enforce rate limiting before API call
    await delayIfNeeded();

    console.log(`  Searching Amazon for: "${keywords}"`);

    // Call Amazon PAAPI
    const response = await common.SearchItems(commonParameters, {
      Keywords: keywords,
      SearchIndex: 'Electronics',  // SD cards fall under Electronics
      ItemCount: 5,
      Resources: [
        'Images.Primary.Medium',
        'ItemInfo.Title',
        'Offers.Listings.Price',
        'CustomerReviews.Count',
        'CustomerReviews.StarRating'
      ]
    });

    // Extract and transform results
    const products = (response?.SearchResult?.Items || []).map(item => {
      try {
        return {
          asin: item.ASIN,
          title: item.ItemInfo?.Title?.DisplayValue,
          image: item.Images?.Primary?.Medium?.URL,
          price: item.Offers?.Listings?.[0]?.Price?.DisplayAmount || 'Check Price',
          rating: item.CustomerReviews?.StarRating?.Value || 0,
          reviewCount: item.CustomerReviews?.Count?.Value || 0,
          url: item.DetailPageURL
        };
      } catch (e) {
        return null;
      }
    }).filter(p => p !== null);

    console.log(`  ✓ Found ${products.length} products`);
    return products;

  } catch (error) {
    // Handle errors gracefully (don't break build)
    if (error.code === 'TooManyRequests' || error.statusCode === 429) {
      console.warn(`  ⚠️  Rate limited (429). Increase REQUEST_DELAY_MS to 3500+`);
    } else if (error.statusCode === 400) {
      console.warn(`  ⚠️  Bad Request (400). Check keywords and SearchIndex.`);
    } else if (error.statusCode === 401 || error.statusCode === 403) {
      console.warn(`  ⚠️  Auth failed (401/403). Check AWS credentials in env vars.`);
    } else {
      console.warn(`  ⚠️  API Error: ${error.message}`);
    }
    
    // Return empty array so build doesn't fail
    return [];
  }
}

module.exports = {
  searchSDCards,
  delayIfNeeded
};
```

**Checklist:**
- ✅ File created at `src/utils/amazon-api.js`
- ✅ searchSDCards function defined
- ✅ Error handling included

---

### Step 3.2: Create Build Script

Create file: `scripts/build-amazon-data.js`

This script runs during the build process and generates JSON cache files.

```javascript
// scripts/build-amazon-data.js
/**
 * Build-time script: Fetch Amazon product data and cache it
 * Run ONCE during build, data is then embedded in static HTML
 * 
 * Usage:
 *   node scripts/build-amazon-data.js
 * 
 * Or automatically called by:
 *   npm run build (if wired into build pipeline)
 */

const fs = require('fs');
const path = require('path');
const { searchSDCards } = require('../src/utils/amazon-api');
require('dotenv').config();

const CACHE_DIR = path.join(__dirname, '../data/amazon-cache');

/**
 * Ensure cache directory exists
 */
function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    console.log(`✓ Created cache directory: ${CACHE_DIR}`);
  }
}

/**
 * Save products to cache JSON file
 */
function saveToCache(filename, products) {
  const filepath = path.join(CACHE_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(products, null, 2));
  console.log(`  ✓ Cached to: ${filename}`);
}

/**
 * Load existing cache (for fallback if API fails)
 */
function loadCache(filename) {
  const filepath = path.join(CACHE_DIR, filename);
  if (fs.existsSync(filepath)) {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
  }
  return [];
}

/**
 * Main build function
 */
async function buildAmazonData() {
  console.log('\n📦 Building Amazon product data...\n');
  
  ensureCacheDir();

  // Define products to search for
  const searches = [
    { filename: 'kingston-canvas-go.json', keyword: 'Kingston Canvas Go Plus 128GB microSD' },
    { filename: 'sandisk-extreme.json', keyword: 'SanDisk Extreme 128GB microSD' },
    { filename: 'samsung-evo-plus.json', keyword: 'Samsung EVO Plus 128GB microSD' },
    { filename: 'prograde-digital.json', keyword: 'ProGrade Digital UHS-II 128GB' },
    { filename: 'sabrent-rocket.json', keyword: 'Sabrent Rocket microSD V90' }
  ];

  console.log(`Searching for ${searches.length} products...\n`);

  for (const search of searches) {
    try {
      console.log(`📌 ${search.keyword}`);
      const products = await searchSDCards(search.keyword);
      
      if (products.length > 0) {
        saveToCache(search.filename, products);
      } else {
        console.log(`  ⚠️  No products found, using cached data if available`);
        // Keep existing cache
      }
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
    }
    
    console.log();
  }

  console.log('✅ Amazon data build complete!\n');
}

// Run the build
if (require.main === module) {
  buildAmazonData().catch(console.error);
}

module.exports = { buildAmazonData };
```

**Checklist:**
- ✅ File created at `scripts/build-amazon-data.js`
- ✅ ensureCacheDir function defined
- ✅ saveToCache function defined
- ✅ buildAmazonData function defined

---

### Step 3.3: Test Script Locally

Before integrating with Cloudflare, test locally:

```bash
# Create .env file locally
cat > .env << EOF
AMAZON_ACCESS_KEY=your_access_key
AMAZON_SECRET_KEY=your_secret_key
AMAZON_TAG=yourname-20
EOF

# Run the build script
node scripts/build-amazon-data.js
```

**Expected Output:**
```
📦 Building Amazon product data...

Searching for 5 products...

📌 Kingston Canvas Go Plus 128GB microSD
  Searching Amazon for: "Kingston Canvas Go Plus 128GB microSD"
  ✓ Found 3 products
  ✓ Cached to: kingston-canvas-go.json

[... more products ...]

✅ Amazon data build complete!
```

**Checklist:**
- ✅ Script runs without errors
- ✅ Cache files created in `data/amazon-cache/`
- ✅ JSON files contain product data

---

## Phase 4: Integration with Static Generator (Day 2-3)

### Step 4.1: Update Build Process

Update your `package.json` build script to call the Amazon build first:

```json
{
  "scripts": {
    "prebuild": "node scripts/build-amazon-data.js",
    "build": "node src/js/generator.js",
    "dev": "npm run prebuild && npm run build && npm start"
  }
}
```

**How it works:**
1. `npm run build` → runs `prebuild` first
2. `prebuild` → fetches Amazon data and caches to JSON
3. `build` → generates static HTML with cached data
4. Result: Static HTML with product badges embedded

**Checklist:**
- ✅ `package.json` updated
- ✅ `prebuild` script added
- ✅ `build` script runs both steps

---

### Step 4.2: Create Device Page Helper

Create or update: `src/utils/amazon-helpers.js`

This reads the cached JSON and generates HTML badges.

```javascript
// src/utils/amazon-helpers.js
const fs = require('fs');
const path = require('path');

/**
 * Load cached Amazon product data
 */
function loadAmazonCache(filename) {
  const filepath = path.join(__dirname, '../data/amazon-cache', filename);
  
  try {
    if (fs.existsSync(filepath)) {
      return JSON.parse(fs.readFileSync(filepath, 'utf8'));
    }
  } catch (error) {
    console.warn(`Could not load cache: ${filename}`);
  }
  
  return [];
}

/**
 * Generate HTML badge for a product
 * 
 * @param {Object} product - Product object from cache
 * @returns {string} HTML badge markup
 */
function generateProductBadge(product) {
  if (!product) return '';
  
  const stars = Math.round(product.rating);
  const starHtml = Array(stars).fill('<i class="fas fa-star"></i>').join('') +
                   Array(5 - stars).fill('<i class="far fa-star"></i>').join('');
  
  return `
    <div class="amazon-badge">
      <span class="rating">⭐ ${product.rating} (${product.reviewCount})</span>
      <span class="price">Live: ${product.price}</span>
      <span class="availability">In Stock</span>
    </div>
  `;
}

/**
 * Generate HTML for product card
 */
function generateProductCard(product) {
  if (!product) return '';
  
  const stars = Math.round(product.rating);
  const starHtml = Array(stars).fill('⭐').join('');
  
  return `
    <div class="product-card">
      <img src="${product.image}" alt="${product.title}" class="product-image">
      <h4>${product.title}</h4>
      <div class="rating">${starHtml} (${product.reviewCount})</div>
      <div class="price">${product.price}</div>
      <a href="${product.url}" target="_blank" rel="nofollow">Check Price on Amazon</a>
    </div>
  `;
}

/**
 * Get specific product from cache by index
 */
function getProductFromCache(filename, index = 0) {
  const products = loadAmazonCache(filename);
  return products[index] || null;
}

module.exports = {
  loadAmazonCache,
  generateProductBadge,
  generateProductCard,
  getProductFromCache
};
```

**Checklist:**
- ✅ File created at `src/utils/amazon-helpers.js`
- ✅ loadAmazonCache function defined
- ✅ generateProductBadge function defined

---

### Step 4.3: Update Device Template Generator

Update your `src/js/generator.js` to include product badges in device pages.

**Find this section** (in your current generator):
```javascript
// Generate brands table
let brandsTableHTML = '';
for (const brand of device.recommendedBrands) {
  brandsTableHTML += `<tr><td>${brand.name}</td>...</tr>`;
}
```

**Replace with**:
```javascript
const { loadAmazonCache, generateProductBadge } = require('../utils/amazon-helpers');

// Generate brands table
let brandsTableHTML = '';
for (const brand of device.recommendedBrands) {
  brandsTableHTML += `<tr><td>${brand.name}</td>...`;
  
  // ADD BADGE FROM CACHE
  const cacheFile = getAmazonCacheForBrand(brand.name); // Map brand to cache file
  const product = loadAmazonCache(cacheFile)?.[0];
  if (product) {
    brandsTableHTML += generateProductBadge(product);
  }
  
  brandsTableHTML += `</tr>`;
}

/**
 * Map product brand names to cache filenames
 */
function getAmazonCacheForBrand(brandName) {
  const mapping = {
    'Kingston Canvas Go': 'kingston-canvas-go.json',
    'SanDisk Extreme': 'sandisk-extreme.json',
    'Samsung EVO Plus': 'samsung-evo-plus.json',
    'ProGrade Digital': 'prograde-digital.json',
    'Sabrent Rocket': 'sabrent-rocket.json'
  };
  return mapping[brandName] || null;
}
```

**Checklist:**
- ✅ Generator updated to load Amazon cache
- ✅ Badges embedded in device page HTML
- ✅ Brand-to-cache mapping defined

---

## Phase 5: Cloudflare Pages Integration (Day 3)

### Step 5.1: Deploy to Cloudflare Pages

Assuming your repo is connected to Cloudflare Pages:

1. Go to **Cloudflare Pages** → Your Project
2. Settings → **Build & Deployment** → **Build Settings**
3. Set these values:
   ```
   Build command: npm run build
   Build output directory: dist
   ```
4. Go to **Settings** → **Environment Variables** → **Production**
5. Add the 3 Amazon variables (if not already added)

**Checklist:**
- ✅ Build command set to `npm run build`
- ✅ Output directory set to `dist`
- ✅ Environment variables added (AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, AMAZON_TAG)

---

### Step 5.2: Trigger Build

1. Push code to your repo (or trigger manual build in Cloudflare Pages)
2. Watch the build log:
   - Prebuild phase: Amazon API calls happen
   - Build phase: Static HTML generated with badges
   - Deploy phase: Files published

**Expected log output:**
```
📦 Building Amazon product data...

Searching for 5 products...
  ✓ Found 3 products
  ✓ Found 2 products
  ...
✅ Amazon data build complete!

Building static site...
  ✓ Generated 150+ device pages
  ✓ Embedded product badges
✅ Build complete!
```

**Checklist:**
- ✅ Build completes successfully
- ✅ No errors in Cloudflare build logs
- ✅ Site deploys

---

### Step 5.3: Verify Product Badges

1. Visit a device page on deployed site: https://sdcardchecker.com/devices/steam-deck/
2. Scroll to "Top SD Card Recommendations" section
3. Look for badges next to products:
   ```
   Kingston Canvas Go 128GB
   ⭐ 4.7 (12,450 reviews) | Live: $18.99 | In Stock
   ```

If badges show:
- ✅ API integration working
- ✅ Data cached successfully
- ✅ HTML includes product info

If badges missing:
- Check `data/amazon-cache/` directory exists
- Check Cloudflare build logs for errors
- Verify env variables are set in Cloudflare

**Checklist:**
- ✅ Visit device page
- ✅ Product badges visible
- ✅ Pricing/ratings accurate

---

## Phase 6: Ongoing Maintenance

### Step 6.1: Cache Expiration & Refresh

Products cache forever (until next build) by design. To refresh monthly:

1. **Option A:** Manual trigger in Cloudflare Pages
   - Go to project
   - Click **Deploy** → **Trigger Build**
   - Builds run, Amazon API called, new data cached

2. **Option B:** Scheduled builds (requires Cloudflare Pages Pro)
   - Settings → **Build Hooks**
   - Create webhook
   - Call webhook from external service (GitHub Actions, cron job, etc.)

3. **Option C:** Every push to repo
   - Every git push automatically triggers build + API refresh

**Recommendation:** Monthly manual rebuild or every 2 weeks.

**Checklist:**
- ✅ Decide refresh frequency
- ✅ Set calendar reminder for rebuilds
- ✅ Or configure webhook for automation

---

### Step 6.2: Monitor API Usage

In Amazon Associates dashboard:

1. Log in to https://associates.amazon.com
2. Go to **Account Settings** → **API Access**
3. Check **API Request Statistics**:
   - Requests per month
   - Rate limit status
   - Error rates

Watch for:
- ⚠️ Errors exceeding 1-2% → May indicate throttling
- ⚠️ Requests approaching limits → May need to contact Amazon

**Checklist:**
- ✅ Monitor API dashboard monthly
- ✅ Log errors if rate limiting increases

---

### Step 6.3: Handle Cache Misses

If a product isn't found:

1. Check `data/amazon-cache/` for JSON files
2. If file is empty or old data:
   - Try different search keywords in `scripts/build-amazon-data.js`
   - Rebuild: `node scripts/build-amazon-data.js`
3. If API is still failing:
   - Check credentials in Cloudflare env vars
   - Check Amazon API dashboard for rate limiting
   - Increase `REQUEST_DELAY_MS` in `amazon-api.js`

**Checklist:**
- ✅ Know where cache files stored
- ✅ Know how to trigger manual rebuild

---

## Complete Setup Checklist

### Prerequisites (Before Starting)
- [ ] Follow credential setup in your original PAAPI guide
- [ ] `AMAZON_ACCESS_KEY` set in Cloudflare env vars
- [ ] `AMAZON_SECRET_KEY` set in Cloudflare env vars
- [ ] `AMAZON_TAG` set in Cloudflare env vars

### Code (Day 2)
- [ ] `src/utils/amazon-api.js` created
- [ ] `scripts/build-amazon-data.js` created
- [ ] `src/utils/amazon-helpers.js` created
- [ ] `package.json` updated with prebuild script
- [ ] Generator updated to load cache and embed badges

### Local Testing (Day 2)
- [ ] `.env` file created locally
- [ ] `node scripts/build-amazon-data.js` runs successfully
- [ ] `data/amazon-cache/` populated with JSON files
- [ ] Cache files contain valid product data

### Deployment (Day 3)
- [ ] Build command set in Cloudflare Pages
- [ ] Environment variables set in Cloudflare
- [ ] First build triggered and completed
- [ ] Device pages show product badges
- [ ] Pricing/ratings display correctly

### Verification (Day 3)
- [ ] Visit 3 device pages and verify badges present
- [ ] Check Cloudflare build logs for errors
- [ ] Verify no SEO changes (static HTML, no dynamic loading)
- [ ] Test on mobile to ensure badges render

---

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Build fails with "credentials missing" | Env vars not set in Cloudflare | Add AMAZON_* vars to Production env in Cloudflare |
| Build passes but no badges appear | Cache files not loading | Check `data/amazon-cache/` exists in generated files |
| "Bad Request" (400) errors | Invalid keywords or SearchIndex | Verify keywords in `build-amazon-data.js` (use specific product names) |
| "Too Many Requests" (429) | Rate limiting | Increase REQUEST_DELAY_MS to 3000-4000 in `amazon-api.js` |
| Badges show old prices | Cache not refreshed | Trigger new build in Cloudflare Pages dashboard |
| No products found in searches | Keywords too generic | Use full product names: "Kingston Canvas Go Plus 128GB" not "sd card" |

---

## Security Checklist

- ✅ API credentials stored in Cloudflare env vars (not in code)
- ✅ Credentials never committed to git
- ✅ `.env` file in `.gitignore` (for local dev)
- ✅ Affiliate links always use `rel="nofollow"` (required by FTC)
- ✅ All API calls happen server-side during build (not exposed to client)
- ✅ No sensitive data logged in build output

---

## Performance Impact

With build-time integration:
- ✅ **Page load speed:** 0ms overhead (data embedded in HTML)
- ✅ **First Contentful Paint:** No change (no API calls at runtime)
- ✅ **Largest Contentful Paint:** No change
- ✅ **CLS (Layout Shift):** 0 (no dynamic content loading)
- ✅ **SEO:** Improved (all content in initial HTML)

---

## Next Steps

1. **Immediate (Today):**
   - [ ] Create Amazon Associates account
   - [ ] Get API credentials
   - [ ] Add to Cloudflare env vars

2. **Short-term (This week):**
   - [ ] Create API utility script
   - [ ] Create build script
   - [ ] Test locally
   - [ ] Deploy to Cloudflare

3. **Long-term (This month):**
   - [ ] Monitor performance in Cloudflare Analytics
   - [ ] Set up monthly cache refresh
   - [ ] Analyze which products get clicked
   - [ ] Expand to more SD card models

---

## Questions? Debugging Steps

**If build fails:**
1. Check Cloudflare Pages build logs (scroll to see full error)
2. Verify env variables in Cloudflare (Settings → Env Vars)
3. Run `node scripts/build-amazon-data.js` locally to isolate issue
4. Check `.env` file has correct credentials (for local testing)

**If badges don't appear:**
1. Check `data/amazon-cache/` folder in deployed site (use Cloudflare Pages Files)
2. Verify JSON files aren't empty
3. Check browser console for JS errors
4. Verify brand names match mapping in generator

**If API calls fail:**
1. Verify `AMAZON_ACCESS_KEY` and `AMAZON_SECRET_KEY` are correct
2. Check Amazon API dashboard for rate limiting
3. Increase `REQUEST_DELAY_MS` to 3500ms
4. Try simpler keywords ("Kingston Canvas Go" instead of "Kingston Canvas Go Plus 128GB")

---

## Documentation References

- **Amazon PAAPI:** https://webservices.amazon.com/paapi5/documentation/
- **amazon-paapi npm:** https://www.npmjs.com/package/amazon-paapi
- **Cloudflare Pages Build:** https://developers.cloudflare.com/pages/platform/build-configuration/
- **Cloudflare Env Vars:** https://developers.cloudflare.com/pages/platform/build-configuration/#environment-variables
