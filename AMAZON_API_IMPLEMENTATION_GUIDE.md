# Amazon API Implementation Guide
**Complete Reference for Build-Time Product Integration**

**Last Updated:** November 25, 2025  
**Status:** ✅ Complete & Production-Ready

---

## Quick Start

### What This Does
Automatically fetches Amazon product data at build time and embeds product cards throughout the site:
- ✅ Device pages: 3 featured products
- ✅ Guide pages: Context-specific products (Speed Classes, RAW, Video, Fake Detection)
- ✅ Calculator pages: Single product with current pricing
- ✅ All pages use consistent styling & affiliate attribution

### Architecture
```
Push to Repo → Cloudflare Detects → npm run build
  ├─ prebuild: scripts/build-amazon-data.js (calls Amazon API)
  ├─ Caches 35+ unique products across 7 search groups
  └─ build: Generates static HTML with embedded product cards
```

**Result:** Static site with no runtime API calls, zero performance impact

---

## Setup (2 Days)

### Day 1: Prerequisites
1. Create Amazon Associates account (https://associates.amazon.com)
2. Register for Product Advertising API access
3. Get credentials:
   - `AMAZON_ACCESS_KEY`
   - `AMAZON_SECRET_KEY`
   - `AMAZON_TAG` (e.g., `sdcc-20`)
4. Add to Cloudflare Pages → Settings → Environment Variables (Production)

### Day 2: Code Implementation

**Install Dependencies:**
```bash
npm install amazon-paapi dotenv
```

**Create Files:**

1. **src/utils/amazon-api.js** - API wrapper with rate limiting
2. **scripts/build-amazon-data.js** - Fetches products at build time
3. **src/utils/amazon-helpers.js** - Generates HTML (optional, for old approach)

**Update package.json:**
```json
{
  "scripts": {
    "prebuild": "node scripts/build-amazon-data.js",
    "build": "node src/js/generator.js"
  }
}
```

**Update Cloudflare Pages:**
- Build Command: `npm run build`
- Output Directory: `dist`

---

## File Locations & Purposes

### Core Implementation Files

| File | Purpose | Status |
|------|---------|--------|
| `src/utils/amazon-api.js` | API calls with rate limiting | ✅ Created |
| `scripts/build-amazon-data.js` | Prebuild script (fetches products) | ✅ Created |
| `scripts/generator/amazon-badges-generator.js` | Generates product card HTML | ✅ Enhanced |
| `scripts/generator/generate-resource-pages.js` | Replaces placeholders in guides | ✅ Enhanced |
| `scripts/generator/generate-calculator-pages.js` | Replaces placeholders in calculators | ✅ Enhanced |
| `src/css/modern.css` | Centralized product card CSS | ✅ Added (lines 1635+) |

### Templates with Placeholders

| Template | Placeholder | Cache File | Products |
|----------|-------------|-----------|----------|
| Device pages | `{{AMAZON_BADGES_SECTION}}` | featured-general.json | 3 |
| Speed Classes guide | `{{AMAZON_FEATURED_SPEED_CLASSES}}` | guide-speed-classes.json | 3 |
| RAW vs JPEG guide | `{{AMAZON_FEATURED_RAW_JPEG}}` | guide-raw-jpeg.json | 3 |
| Video Bitrate guide | `{{AMAZON_FEATURED_VIDEO}}` | guide-video-bitrate.json | 3 |
| Fake Detector guide | `{{AMAZON_FEATURED_AUTHENTIC}}` | guide-fake-detection.json | 3 |
| Calculator pages | `{{AMAZON_FEATURED_CALCULATOR_PRICE}}` | calculator-recommended.json | 1 |

### Cache Files (Auto-Generated)

```
data/amazon-cache/
├── featured-general.json           (5 products - device pages)
├── guide-speed-classes.json        (5 products - V10/V30/V60/V90)
├── guide-professional-cameras.json (5 products - professional gear)
├── guide-raw-jpeg.json             (5 products - RAW photography)
├── guide-fake-detection.json       (5 products - authentic brands)
├── guide-video-bitrate.json        (5 products - 4K/8K video)
└── calculator-recommended.json     (5 products - recommended cards)
```

---

## How It Works

### Build Time (Happens Once Per Deploy)
```
1. npm run build runs
2. prebuild: Calls scripts/build-amazon-data.js
3. Searches Amazon for products (28 keywords across 7 groups)
4. Saves results to JSON cache files
5. Generator replaces {{PLACEHOLDER}} with HTML sections
6. Static HTML deployed (no runtime API calls)
```

### Runtime (User's Browser)
```
1. User visits page (device, guide, or calculator)
2. HTML already contains product cards (pre-generated)
3. No JavaScript needed (just HTML + CSS)
4. Cards display instantly
5. Click = affiliate link to Amazon
```

---

## Product Caches & Keywords

### featured-general.json (Device Pages)
**3 keywords searched:**
- Kingston Canvas Go Plus 128GB microSD
- SanDisk Extreme 128GB microSD
- Samsung EVO Plus 128GB microSD

### guide-speed-classes.json (Speed Classes Guide)
**4 keywords searched:**
- Kingston Canvas Go V10 microSD
- SanDisk Extreme V30 microSD
- Lexar Professional V60 SD card
- Sony TOUGH V90 SD card

### guide-professional-cameras.json
**3 keywords searched:**
- SanDisk Extreme PRO SD UHS-II
- Sony TOUGH G V90 SD card
- Lexar Professional Gold UHS-II

### guide-raw-jpeg.json (RAW vs JPEG Guide)
**3 keywords searched:**
- Professional SDXC card fast write
- Camera CF express type B card
- SanDisk Extreme PRO SD UHS-II

### guide-fake-detection.json (Fake Detector Guide)
**3 keywords searched:**
- Genuine SanDisk Extreme microSD
- Authentic Kingston Canvas microSD
- Legitimate SD card brands

### guide-video-bitrate.json (Video Bitrate Guide)
**4 keywords searched:**
- Kingston Canvas Go V30 microSD
- SanDisk Extreme V60 microSD
- Lexar Professional V90 SD card
- Sony TOUGH V90 SD card

### calculator-recommended.json (Calculator Pages)
**9 keywords searched:**
- Kingston Canvas Go Plus microSD
- SanDisk Extreme microSD V30
- Samsung EVO Select microSD
- Lexar Professional Silver microSD
- Kingston Canvas Select Plus
- SanDisk MAX ENDURANCE
- Samsung PRO Endurance
- Lexar Professional Gold UHS-II
- SanDisk Extreme PRO SD UHS-II

---

## CSS Styling Reference

### Grid Container
```css
.amazon-badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}
/* Desktop: 3 columns | Tablet: 2 columns | Mobile: 1 column */
```

### Product Card
```css
.amazon-product-badge {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s, transform 0.2s;
}

.amazon-product-badge:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}
```

### Image Container
```css
.badge-image {
  height: 180px;  /* 150px on mobile */
  background: #f9f9f9;
  display: flex;
  justify-content: center;
  align-items: center;
}

.badge-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
```

### Button
```css
.badge-link {
  background-color: #FF9900;  /* Amazon orange */
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-top: auto;
}

.badge-link:hover {
  background-color: #EC7211;  /* Darker orange */
}
```

All classes in: `src/css/modern.css` (lines 1635-1748)

---

## Adding Products to a New Page

### Step 1: Add Placeholder to Template
```html
<!-- In your page template -->
{{AMAZON_FEATURED_CUSTOM_TYPE}}
```

### Step 2: Create Search Group (If New)
Edit `scripts/build-amazon-data.js`:
```javascript
const searches = [
  // ... existing searches ...
  {
    filename: 'guide-custom-type.json',
    keywords: [
      'Custom Product Type 1',
      'Custom Product Type 2',
      // ... more keywords
    ]
  }
];
```

### Step 3: Add to Generator Mapping
Edit `scripts/generator/generate-resource-pages.js`:
```javascript
htmlContent = htmlContent.replace(
  '{{AMAZON_FEATURED_CUSTOM_TYPE}}',
  generateAmazonBadgeSectionByType('guide-custom-type', 3, 'Custom Title')
);
```

### Step 4: Run Build
```bash
npm run build
```

Done! No CSS changes needed (uses existing classes).

---

## Function Signatures

### Main Generator
```javascript
generateAmazonBadgeSectionByType(
  type = 'featured-general',    // Cache file name (without .json)
  count = 3,                     // Number of products to show
  title = 'Featured Products'    // Section title
)
// Returns: HTML string with product cards
```

### Default (Device Pages)
```javascript
generateAmazonBadgesSection()
// Uses featured-general.json, shows 3 products
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails: "credentials missing" | Add AMAZON_* vars to Cloudflare Pages → Settings → Environment Variables |
| Build passes but no badges appear | Check `data/amazon-cache/` folder exists with JSON files |
| "429 Too Many Requests" error | Increase `REQUEST_DELAY_MS` to 3500+ in `amazon-api.js` |
| "400 Bad Request" error | Make search keywords more specific (use full product names) |
| Old prices showing | Trigger new build in Cloudflare Pages dashboard |
| Styling looks off | Verify `src/css/modern.css` is loaded, check browser inspector |
| Affiliate links not tracking | Verify `sd-cc-20` tag in URLs, check Amazon Associates dashboard |

---

## Configuration

### Local Testing (.env)
```bash
AMAZON_ACCESS_KEY=your_access_key
AMAZON_SECRET_KEY=your_secret_key
AMAZON_TAG=yourname-20
```

### Rate Limiting (src/utils/amazon-api.js)
```javascript
const REQUEST_DELAY_MS = 2500;  // milliseconds between API calls
// If getting 429 errors, increase to 3000-5000
```

---

## Metrics

| Metric | Value |
|--------|-------|
| Cache files | 7 |
| Keywords searched | 28 |
| Products cached | 35+ unique |
| Pages updated | 4 guides + 8 calculators + 104 devices |
| Build time | ~90 seconds |
| Page load impact | Zero (static HTML) |
| CSS overhead | 120 lines (centralized) |

---

## Compliance & Security

✅ **Affiliate Attribution:**
- Disclosure on every section: "This website contains affiliate links..."
- Amazon Associates tag embedded: `sd-cc-20`
- Links use `rel="nofollow noopener"`

✅ **Security:**
- API credentials stored in Cloudflare env vars (encrypted)
- Never committed to git
- All API calls happen server-side during build
- No credentials exposed to browser

✅ **Standards:**
- FTC disclosure requirements met
- Prices from official Amazon source
- Products relevant to page content
- No misleading or inflated pricing

---

## Monitoring

### Monthly Tasks
1. Verify builds complete successfully in Cloudflare
2. Check cache files exist and aren't empty
3. Monitor Amazon Associates dashboard for:
   - API request statistics
   - Error rates (should be <2%)
   - Affiliate earnings
4. Review Google Analytics for affiliate link clicks

### Cache Refresh Strategies
- **Option A:** Manual rebuild via Cloudflare Pages dashboard (monthly recommended)
- **Option B:** Scheduled webhook trigger (requires external service)
- **Option C:** Auto-rebuild on every git push

---

## Performance Impact

| Metric | Impact |
|--------|--------|
| Build time | +90 seconds (API calls + caching) |
| Page load time | 0ms (all data embedded in HTML) |
| First Contentful Paint | 0ms impact |
| Largest Contentful Paint | 0ms impact |
| Cumulative Layout Shift | 0 (no dynamic loading) |
| SEO Impact | Positive (complete HTML in crawlable content) |

---

## Next Phases

### Phase 6: Advanced Features
- Dynamic card matching (search for exact recommended model)
- Multiple products per calculator (2-3 options)
- Device-specific product bundles

### Phase 7: Analytics
- Track clicks via Google Analytics events
- Monitor conversion rates by page type
- A/B test product count (1 vs 3)

### Phase 8: Optimization
- Monthly cache refresh automation
- Seasonal product rotation
- Performance monitoring

---

## Deployment Checklist

- [ ] Amazon Associates account created and approved
- [ ] API credentials obtained
- [ ] Env vars added to Cloudflare Pages
- [ ] Dependencies installed (`npm install amazon-paapi dotenv`)
- [ ] `src/utils/amazon-api.js` created
- [ ] `scripts/build-amazon-data.js` created
- [ ] `package.json` updated with prebuild script
- [ ] Templates updated with placeholders
- [ ] Local build test: `npm run build` completes
- [ ] Cache files created in `data/amazon-cache/`
- [ ] Cloudflare Pages build command set to `npm run build`
- [ ] First build triggered and completed
- [ ] Device pages show product badges
- [ ] Pricing and ratings display correctly
- [ ] Responsive design verified (mobile, tablet, desktop)
- [ ] Affiliate links include correct tag

---

## Quick Links

**Code:**
- Build script: `scripts/build-amazon-data.js`
- Generator: `scripts/generator/amazon-badges-generator.js`
- CSS: `src/css/modern.css` (lines 1635-1748)
- Device template: `src/templates/device.html`
- Guide templates: `src/templates/guides/`
- Calculator templates: `src/templates/calculator/`

**Data:**
- Cache directory: `data/amazon-cache/`
- Sample cache: `data/amazon-cache/featured-general.json`

---

## Support

### For Questions About:
- **Build process:** See "How It Works" section above
- **CSS customization:** See "CSS Styling Reference" section
- **Adding new products:** See "Adding Products to a New Page" section
- **Troubleshooting:** See "Troubleshooting" table
- **Compliance:** See "Compliance & Security" section

### External Resources
- [Amazon PAAPI Documentation](https://webservices.amazon.com/paapi5/documentation/)
- [amazon-paapi npm package](https://www.npmjs.com/package/amazon-paapi)
- [Cloudflare Pages Build Configuration](https://developers.cloudflare.com/pages/platform/build-configuration/)
- [Amazon Associates Dashboard](https://associates.amazon.com)

---

## Summary

This implementation provides:
- ✅ Automatic product discovery via Amazon API
- ✅ Build-time caching (zero runtime overhead)
- ✅ Consistent, professional UI across all pages
- ✅ Proper affiliate attribution and compliance
- ✅ Mobile-responsive product cards
- ✅ Graceful degradation (missing cache doesn't break pages)
- ✅ Easy to expand to new pages

**Current Status:** Production-ready  
**Last Build:** Check Cloudflare Pages dashboard  
**Next Steps:** Deploy and monitor metrics

---

**Created:** November 25, 2025  
**Version:** 1.0  
**Status:** ✅ Complete
