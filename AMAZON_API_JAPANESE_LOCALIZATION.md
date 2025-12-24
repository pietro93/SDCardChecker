# Amazon API Japanese Localization

**Status:** Analysis Complete & Ready for Implementation  
**Effort:** 8-10 hours development + 3-7 days for JP account setup  
**Risk:** LOW (graceful fallback if JP API fails)  
**ROI:** +$1,000-$2,500/year additional affiliate revenue

---

## Problem

Japanese device pages currently show **US Amazon links** (amazon.com) with **USD prices** when they should show **Japanese marketplace links** (amazon.co.jp) with **JPY prices**.

---

## Current Architecture

### How It Works Now
```
npm run build
    ↓
scripts/build-amazon-data.js
    ├─ Calls Amazon PAAPI (US marketplace only)
    ├─ Uses AMAZON_TAG_US = sdcc-20
    └─ Caches to: data/amazon-cache/
    ↓
scripts/generator/generate-device-pages.js
    ├─ Loads cache (US products)
    ├─ Calls generateAmazonBadgesSection()
    └─ Injects into both /dist/ (US) and /dist/ja/ (JP) pages
    ↓
Result: JP pages show US affiliate links ❌
```

### Files Involved
- `src/utils/amazon-api.js` - API calls (hard-coded to amazon.com)
- `scripts/build-amazon-data.js` - Prebuild script, 12 search groups
- `scripts/generator/amazon-badges-generator.js` - Generates HTML
- `scripts/generator/generate-device-pages.js` - Injects badges
- `src/templates/device.html` - Has {{AMAZON_BADGES_SECTION}} placeholder

---

## Solution: Dual-Marketplace Support

### Proposed Architecture
```
npm run build       → amazon.com API → cache-us/ → /dist/ (English)
npm run build:ja    → amazon.co.jp API → cache-ja/ → /dist/ja/ (Japanese)
```

**Benefits:**
- Japanese users see amazon.co.jp links
- Prices in JPY on JP pages, USD on US pages
- Separate affiliate earnings for each region
- Independent caches (JP failure won't affect US)

---

## Implementation (5 Phases)

### Phase 1: Update amazon-api.js (30 min)

**File:** `src/utils/amazon-api.js`

Replace entire file:

```javascript
const common = require('amazon-paapi');
require('dotenv').config();

/**
 * Create Amazon PAAPI config for a region
 * @param {string} region - 'US' or 'JP'
 */
function createAmazonClient(region = 'US') {
  const configs = {
    US: {
      AccessKey: process.env.AMAZON_ACCESS_KEY_US,
      SecretKey: process.env.AMAZON_SECRET_KEY_US,
      PartnerTag: process.env.AMAZON_TAG_US,
      Marketplace: 'www.amazon.com',
      PartnerType: 'Associates'
    },
    JP: {
      AccessKey: process.env.AMAZON_ACCESS_KEY_JA,
      SecretKey: process.env.AMAZON_SECRET_KEY_JA,
      PartnerTag: process.env.AMAZON_TAG_JA,
      Marketplace: 'www.amazon.co.jp',
      PartnerType: 'Associates'
    }
  };

  const config = configs[region];
  if (!config.AccessKey) {
    console.warn(`⚠️  Amazon API credentials missing for region: ${region}`);
  }
  return config;
}

let lastRequestTime = 0;
const REQUEST_DELAY_MS = 2500;

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
 * Search for SD card products (supports US & JP)
 * @param {string} keywords - Search term
 * @param {string} region - 'US' or 'JP'
 */
async function searchSDCards(keywords, region = 'US') {
  const config = createAmazonClient(region);

  if (!config.AccessKey || !config.SecretKey || !config.PartnerTag) {
    console.warn(`⚠️  Credentials missing for ${region}`);
    return [];
  }

  if (!keywords) {
    console.error('❌ Keywords required');
    return [];
  }

  try {
    await delayIfNeeded();
    console.log(`  Searching ${region === 'JP' ? '🇯🇵' : '🇺🇸'} for: "${keywords}"`);

    const response = await common.SearchItems(config, {
      Keywords: keywords,
      SearchIndex: 'Electronics',
      ItemCount: 5,
      Resources: [
        'Images.Primary.Medium',
        'ItemInfo.Title',
        'Offers.Listings.Price',
        'CustomerReviews.Count',
        'CustomerReviews.StarRating'
      ]
    });

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
    if (error.statusCode === 429) {
      console.warn(`  ⚠️  Rate limited (429). Increase REQUEST_DELAY_MS.`);
    } else if (error.statusCode === 401 || error.statusCode === 403) {
      console.warn(`  ⚠️  Auth failed (401/403). Check credentials for ${region}.`);
    } else {
      console.warn(`  ⚠️  API Error (${region}): ${error.message}`);
    }
    return [];
  }
}

module.exports = {
  searchSDCards,
  createAmazonClient,
  delayIfNeeded
};
```

---

### Phase 2: Update build-amazon-data.js (1 hour)

**File:** `scripts/build-amazon-data.js`

**Key changes:**
1. Add `japaneseSearchGroups` with Japanese keywords
2. Update `buildAmazonData(region)` to accept region parameter
3. Create separate cache directories

**Replace lines 66-262 with:**

```javascript
// English search groups
const englishSearchGroups = [
  {
    filename: 'featured-general.json',
    keywords: [
      'Kingston Canvas Go Plus 128GB microSD',
      'SanDisk Extreme 128GB microSD',
      'Samsung EVO Plus 128GB microSD'
    ]
  },
  {
    filename: 'guide-speed-classes.json',
    keywords: [
      'Kingston Canvas Go V10 microSD',
      'SanDisk Extreme V30 microSD',
      'Lexar Professional V60 SD card',
      'Sony TOUGH V90 SD card'
    ]
  },
  // ... keep remaining English groups
];

// Japanese search groups (with Japanese keywords)
const japaneseSearchGroups = [
  {
    filename: 'featured-general.json',
    keywords: [
      'Kingston Canvas Go Plus 128GB microSD カード',
      'SanDisk Extreme 128GB microSD 日本',
      'Samsung EVO Plus 128GB microSD'
    ]
  },
  {
    filename: 'guide-speed-classes.json',
    keywords: [
      'Kingston Canvas Go V10 microSD',
      'SanDisk Extreme V30 microSD カード',
      'Lexar Professional V60 SD',
      'Sony TOUGH V90 SD カード'
    ]
  },
  // ... repeat for remaining groups
];

function ensureCacheDir(region) {
  const dir = region === 'US' 
    ? path.join(__dirname, '../data/amazon-cache-us')
    : path.join(__dirname, '../data/amazon-cache-ja');
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ Created cache directory: ${dir}`);
  }
  return dir;
}

function saveToCache(region, filename, products) {
  const cacheDir = region === 'US'
    ? path.join(__dirname, '../data/amazon-cache-us')
    : path.join(__dirname, '../data/amazon-cache-ja');
  
  const filepath = path.join(cacheDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(products, null, 2));
  console.log(`  ✓ Cached: ${region}/${filename}`);
}

function loadCache(region, filename) {
  const cacheDir = region === 'US'
    ? path.join(__dirname, '../data/amazon-cache-us')
    : path.join(__dirname, '../data/amazon-cache-ja');
  
  const filepath = path.join(cacheDir, filename);
  if (fs.existsSync(filepath)) {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
  }
  return [];
}

async function buildAmazonData(region = 'US') {
  const regionName = region === 'US' ? '🇺🇸 English (US)' : '🇯🇵 Japanese (JP)';
  console.log(`\n📦 Building Amazon data for ${regionName}...\n`);
  
  ensureCacheDir(region);
  const searchGroups = region === 'US' ? englishSearchGroups : japaneseSearchGroups;
  
  let requestCount = 0;

  for (const { filename, keywords } of searchGroups) {
    console.log(`🔍 ${filename}:`);
    let allResults = [];
    
    for (const keyword of keywords) {
      try {
        requestCount++;
        if (requestCount > 1) {
          process.stdout.write(`   Waiting ${REQUEST_DELAY_MS}ms...\r`);
          await sleep(REQUEST_DELAY_MS);
        }
        
        process.stdout.write(`   Searching: "${keyword}"...\r`);
        const products = await searchSDCards(keyword, region);
        
        if (products.length > 0) {
          allResults = allResults.concat(products);
          process.stdout.write(`   ✓ Found ${products.length}\n`);
        } else {
          process.stdout.write(`   ⚠️  No results\n`);
        }
      } catch (error) {
        process.stdout.write(`   ❌ Error: ${error.message}\n`);
      }
    }
    
    // De-duplicate by ASIN, keep top 5
    const uniqueProducts = [];
    const seenAsins = new Set();
    
    for (const product of allResults) {
      if (product.asin && !seenAsins.has(product.asin)) {
        seenAsins.add(product.asin);
        uniqueProducts.push(product);
        if (uniqueProducts.length >= 5) break;
      }
    }
    
    if (uniqueProducts.length > 0) {
      saveToCache(region, filename, uniqueProducts);
      console.log(`  ✅ Saved ${uniqueProducts.length} products\n`);
    } else {
      const existing = loadCache(region, filename);
      if (existing.length > 0) {
        console.log(`  ⚠️  No results, keeping existing cache\n`);
      } else {
        console.log(`  ❌ No results found\n`);
        saveToCache(region, filename, []);
      }
    }
  }

  console.log(`✅ Amazon data build complete for ${regionName}!\n`);
}

// Export both regions
async function buildAmazonDataUS() {
  await buildAmazonData('US');
}

async function buildAmazonDataJA() {
  await buildAmazonData('JP');
}

if (require.main === module) {
  const region = process.argv[2] || 'US';
  buildAmazonData(region).catch(err => {
    console.error('Build failed:', err);
    process.exit(1);
  });
}

module.exports = {
  buildAmazonData,
  buildAmazonDataUS,
  buildAmazonDataJA
};
```

---

### Phase 3: Update build.js (10 min)

**File:** `scripts/generator/build.js`

Add at top:
```javascript
const { buildAmazonDataUS } = require('../build-amazon-data');
```

In main function, add before device pages generation:
```javascript
console.log('Building US Amazon product data...');
await buildAmazonDataUS();
```

---

### Phase 4: Update build-ja.js (10 min)

**File:** `scripts/generator/build-ja.js`

Add at top:
```javascript
const { buildAmazonDataJA } = require('../build-amazon-data');
```

Update function:
```javascript
async function generateDevicePagesJa(allDevices, distPath) {
    console.log('🇯🇵 Starting Japanese site generation...\n');
    
    // Build Japanese Amazon data FIRST
    console.log('Building JP Amazon product data...');
    await buildAmazonDataJA();
    
    try {
        const { generateDevicePages } = require('./generate-device-pages');
        await generateDevicePages(allDevices, distPath, true);
        console.log(`  ✓ Generated ${allDevices.length} Japanese device pages`);
    } catch (error) {
        console.error(`  ❌ Error: ${error.message}`);
        throw error;
    }
}
```

---

### Phase 5: Update Generators (1 hour)

**File:** `scripts/generator/amazon-badges-generator.js`

Update function signature:
```javascript
function generateAmazonBadgesSection(cacheDir = 'amazon-cache-us', type = 'featured-general', count = 3) {
  try {
    const products = loadCachedProducts(`data/${cacheDir}/${type}.json`);
    
    if (!products || products.length === 0) {
      return '';
    }
    
    // Rest of existing code...
  } catch (error) {
    console.warn(`  ⚠️  Error loading ${cacheDir}/${type}:`, error.message);
    return '';
  }
}
```

**File:** `scripts/generator/generate-device-pages.js`

Find the line that calls `generateAmazonBadgesSection()` (~line 384):

**Before:**
```javascript
const amazonBadgesSection = generateAmazonBadgesSection();
```

**After:**
```javascript
const cacheDir = isJapanese ? 'amazon-cache-ja' : 'amazon-cache-us';
const amazonBadgesSection = generateAmazonBadgesSection(cacheDir);
```

---

## Configuration

### .env (Local Testing)
```bash
# US
AMAZON_ACCESS_KEY_US=your_us_key
AMAZON_SECRET_KEY_US=your_us_secret
AMAZON_TAG_US=sdcc-20

# Japan (ADD THESE)
AMAZON_ACCESS_KEY_JA=your_jp_key
AMAZON_SECRET_KEY_JA=your_jp_secret
AMAZON_TAG_JA=yourname-22
```

### Cloudflare Pages Environment Variables
Add same variables to Dashboard → Settings → Environment Variables (Production):
- `AMAZON_ACCESS_KEY_JA`
- `AMAZON_SECRET_KEY_JA`
- `AMAZON_TAG_JA`

---

## Directory Setup

```bash
# Create directories
mkdir -p data/amazon-cache-us
mkdir -p data/amazon-cache-ja

# Move existing cache (if any)
mv data/amazon-cache/* data/amazon-cache-us/
rmdir data/amazon-cache

# Update .gitignore
echo "data/amazon-cache-us/" >> .gitignore
echo "data/amazon-cache-ja/" >> .gitignore
```

---

## Testing

### Local Test
```bash
# Test US
npm run build
ls data/amazon-cache-us/
cat data/amazon-cache-us/featured-general.json  # Should show $ prices

# Test JP
npm run build:ja
ls data/amazon-cache-ja/
cat data/amazon-cache-ja/featured-general.json  # Should show ¥ prices
```

### Browser Test
1. `http://localhost/categories/device/` → Should show $ prices
2. `http://localhost/ja/categories/device/` → Should show ¥ prices

---

## Timeline & Effort

| Phase | Time | Effort |
|-------|------|--------|
| 0: JP Account Setup | 3-7 days | Blocked |
| 1: amazon-api.js | 30 min | Low |
| 2: build-amazon-data.js | 1 hour | Medium |
| 3: build.js | 10 min | Low |
| 4: build-ja.js | 10 min | Low |
| 5: Generators | 1 hour | Low |
| Testing | 2 hours | Medium |
| Deployment | 1 hour | Low |
| **Total** | **8-10 hours** | **Medium** |

---

## Expected Results

### Before
```
Japanese device pages:
├─ Show: amazon.com links
├─ Prices: $USD
└─ Affiliate Tag: sdcc-20 (US account)
```

### After
```
Japanese device pages:
├─ Show: amazon.co.jp links
├─ Prices: ¥JPY
└─ Affiliate Tag: name-22 (JP account)
```

---

## Success Criteria

- ✅ JP pages link to amazon.co.jp
- ✅ JP prices in ¥ (JPY)
- ✅ US prices in $ (USD)
- ✅ Both regions earning commissions
- ✅ Build < 3 minutes
- ✅ No regression in US pages

---

## ROI

**Current:** ~$5-10/day affiliate earnings (US only)  
**With JP:** ~$8-17/day (US + JP combined)  
**Additional:** +$1,000-$2,500/year  
**Break-Even:** 1-2 months

---

## Blockers

⏳ **Japanese Amazon Associates account** (3-7 days for approval)
- Required before implementation can start
- Must have API credentials for amazon.co.jp

---

## Next Steps

1. Register Japanese Amazon Associates account
2. Get API credentials
3. Add to Cloudflare env vars
4. Implement code changes (follow phases 1-5 above)
5. Test locally
6. Deploy to staging
7. Monitor metrics

---

**Status: Ready for Implementation** ✅
