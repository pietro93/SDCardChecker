# Expansion Guide: Car Navigation & Dash Cams Architecture

## Overview

Two distinct expansion strategies have been implemented:

1. **Car Navigation (1-to-Many):** One SD card product → Multiple vehicle pages
2. **Dash Cams (1-to-1):** Standard device type → One category with multiple devices

---

## Strategy 1: Car Navigation (1-to-Many Generation Engine)

### When to Use
- One product variant compatible with many models
- Need to generate pages for each compatible device
- Product specs are mostly the same, only vehicle changes
- Perfect for: Navigation updates, firmware cards, region-specific products

### Architecture

```
data/cars-navigation.json
    ↓
scripts/generator/generate-car-pages.js
    ↓
dist/cars/[vehicle-slug]/index.html × N
```

### Implementation Steps

#### Step 1: Add Data to `data/cars-navigation.json`

```json
{
  "cards": [
    {
      "id": "unique-card-id",
      "title": "Product Name",
      "affiliateLink": "https://...",
      "price": "$X-$Y",
      "commissionNote": "X% Commission",
      "features": ["Feature 1", "Feature 2"],
      "compatibleModels": [
        "Brand Model (2020-2024)",
        "Brand Model (2019-2023)"
      ],
      "installGuide": "Step-by-step instructions...",
      "warning": "Important compatibility notes..."
    }
  ]
}
```

#### Step 2: Adjust Generator (if custom needs)

Edit `scripts/generator/generate-car-pages.js`:
- Modify slug generation logic if needed
- Adjust HTML variable replacements
- Add custom validation

#### Step 3: Verify Output

```bash
node -e "const {generateCarPages} = require('./scripts/generator/generate-car-pages'); generateCarPages('./dist');"
```

### Key Features

✅ **Smart slug generation** - "Toyota Prius (2016-2022)" → "toyota-prius-2016-2022"  
✅ **Year parsing** - Automatically extracts years from model string  
✅ **Feature rendering** - Lists features with checkmarks  
✅ **Template variables** - All substitutions happen at build time  
✅ **Scalable** - 1 entry → 11 pages automatically  

### Example

**Input:**
```json
{
  "compatibleModels": [
    "Toyota Prius (2016-2022)",
    "Toyota Camry (2018-2021)"
  ]
}
```

**Output:**
```
dist/cars/toyota-prius-2016-2022/index.html
dist/cars/toyota-camry-2018-2021/index.html
```

### Expansion Example: Add Honda Navigation Card

```json
{
  "id": "honda-nav-update-2025",
  "title": "Honda Navigation SD Card Update 2025",
  "affiliateLink": "YOUR_HONDA_LINK_HERE",
  "price": "$45-$65",
  "commissionNote": "18% Commission",
  "features": ["2025 Maps", "Honda Certified", "USA/CAN"],
  "compatibleModels": [
    "Honda CR-V (2017-2024)",
    "Honda Pilot (2016-2023)",
    "Honda Accord (2018-2022)",
    "Honda Civic (2019-2024)"
  ],
  "installGuide": "1. Turn off engine. 2. Locate SD slot in navigation unit. 3. Remove old card. 4. Insert new card. 5. Start engine and initialize.",
  "warning": "Compatible with Honda factory navigation systems only. Verify with dealer if unsure."
}
```

**Result:** 4 new pages automatically generated

---

## Strategy 2: Dash Cams (1-to-1 Standard Architecture)

### When to Use
- Standard device category with multiple related devices
- Each device needs its own detailed page
- Use existing device template system
- Perfect for: Cameras, drones, devices with variation

### Architecture

```
data/categories/dash-cams.json
    ↓
[Merged into data/devices.json at build time]
    ↓
scripts/generator/generate-device-pages.js
    ↓
dist/devices/[device-slug]/index.html × N
```

### Implementation Steps

#### Step 1: Create Category File

Create `data/categories/[category-name].json`:

```json
[
  {
    "id": "unique-device-id",
    "name": "Device Name",
    "category": "Dash Cams",
    "slug": "device-slug",
    "searchTerms": ["search term 1", "search term 2"],
    "imageUrl": "/img/devices/device.jpg",
    "sdCard": {
      "type": "microSD",
      "minSpeed": "V30",
      "minWriteSpeed": "30 MB/s",
      "recommendedCapacity": ["64GB", "128GB"],
      "maxCapacity": "256GB"
    },
    "whySpecs": "Explanation of why these specs matter for this device...",
    "recommendedBrands": [
      { "id": "brand-id-1" },
      { "id": "brand-id-2" }
    ],
    "faq": [
      {
        "q": "Question?",
        "a": "<b>Answer with HTML formatting</b>"
      }
    ],
    "relatedDevices": ["other-device-id"],
    "notes": "Internal notes (not displayed)"
  }
]
```

#### Step 2: Add/Update SD Card Products

Edit `data/sdcards.json` if new products needed:

```json
{
  "id": "unique-card-id",
  "name": "Card Brand & Model",
  "type": "microSD",
  "specs": {
    "uhs": "UHS-I",
    "speedClass": "V30",
    "appPerformance": "A2",
    "readSpeed": "Up to X MB/s",
    "writeSpeed": "Up to Y MB/s",
    "endurance": "High Endurance"
  },
  "availableCapacities": [64, 128, 256],
  "priceSymbol": "$",
  "priceTier": "Budget",
  "imageUrl": "/img/cards/card.webp",
  "amazonSearchUrl": "https://amazon.com/s?k=...",
  "pros": "Positive aspects...",
  "cons": "Limitations...",
  "tier": "recommended",
  "notes": "Commission: X%"
}
```

#### Step 3: Run Build

```bash
npm run build
```

The build process automatically:
1. Merges all category files
2. Generates device pages
3. Creates category aggregation pages
4. Updates search indexes

### Key Features

✅ **Auto-merge** - Category files merged into devices.json at build time  
✅ **Standard templating** - Reuses existing device.html template  
✅ **SEO optimization** - Slugs, search terms, meta tags handled  
✅ **Cross-linking** - Related devices automatically linked  
✅ **FAQ generation** - Auto-generated + custom FAQs merged  
✅ **Category aggregation** - /categories/dash-cams/ page auto-created  

### Example: Tesla Model 3 (Sentry Mode)

```json
{
  "id": "tesla-model-3-sentry",
  "name": "Tesla Model 3 (Sentry Mode)",
  "category": "Dash Cams",
  "slug": "tesla-model-3-sentry",
  "searchTerms": ["tesla sentry mode", "tesla dashcam", "tesla model 3 memory card"],
  "sdCard": {
    "type": "microSD (requires USB reader)",
    "minSpeed": "V30",
    "minWriteSpeed": "40 MB/s",
    "recommendedCapacity": ["128GB", "256GB"],
    "maxCapacity": "2TB"
  },
  "whySpecs": "Sentry mode continuously overwrites old footage. You need High Endurance cards rated for 10,000+ write/erase cycles.",
  "recommendedBrands": [
    { "id": "topesel-high-endurance" },
    { "id": "sandisk-max-endurance" }
  ]
}
```

**Result:** Single page at `/devices/tesla-model-3-sentry/` with SEO optimization

### Expansion Example: Add 360° Dash Cam Device

```json
{
  "id": "360-cam-viofo-x",
  "name": "Viofo 360 Degree Dash Cam",
  "category": "Dash Cams",
  "slug": "viofo-360-dashcam",
  "searchTerms": ["360 degree dashcam", "viofo 360", "full view dashcam"],
  "sdCard": {
    "type": "microSD",
    "minSpeed": "V60",
    "minWriteSpeed": "60 MB/s",
    "recommendedCapacity": ["256GB"],
    "maxCapacity": "1TB"
  },
  "whySpecs": "360° recording at 4K+ bitrates requires V60 cards for sustained writes. 256GB minimum for practical coverage.",
  "recommendedBrands": [
    { "id": "sandisk-extreme-pro-microsd" }
  ]
}
```

**Result:** Automatically generates `/devices/viofo-360-dashcam/` page

---

## Comparison Matrix

| Aspect | Car Navigation (1-to-Many) | Dash Cams (1-to-1) |
|--------|---------------------------|-------------------|
| **Data Source** | `data/cars-navigation.json` | `data/categories/[name].json` |
| **Generator** | Custom `generate-car-pages.js` | Standard `generate-device-pages.js` |
| **Output Path** | `/cars/[slug]/` | `/devices/[slug]/` |
| **Use Case** | Product variants → multiple vehicles | Device types → device pages |
| **Expansion Ratio** | N vehicles from 1 card | 1 page per device |
| **Template** | Custom `car-nav.html` | Standard `device.html` |
| **Build Integration** | Separate hook (step 7) | Automatic (step 3) |
| **Related Devices** | Manual linking | Auto-generated |
| **FAQ** | Static (in data) | Static + auto-generated |
| **Scalability** | High (each card → many pages) | High (many devices → many pages) |

---

## Decision Tree: Which Strategy to Use?

```
Are you adding a new device/product?
├─ Yes: Will you recommend the same SD card for multiple versions?
│  ├─ Yes: Use 1-to-1 (Dash Cam approach)
│  │        Create data/categories/[type].json
│  │
│  └─ No: Does it have many compatible models/variants?
│         ├─ Yes: Use 1-to-Many (Car Navigation approach)
│         │        Add to data/cars-navigation.json
│         │
│         └─ No: Use 1-to-1 anyway
│
└─ No: Are you updating product recommendations?
   ├─ Yes, for a device: Update data/categories/[type].json
   │
   └─ Yes, for multiple vehicles: Update data/cars-navigation.json
```

---

## File Reference

### Car Navigation Files
- **Data:** `data/cars-navigation.json`
- **Template:** `src/templates/car-nav.html`
- **Generator:** `scripts/generator/generate-car-pages.js`
- **Build hook:** `scripts/generator/build.js` (line 155-157)

### Dash Cam Files
- **Data:** `data/categories/dash-cams.json`
- **Template:** Standard `src/templates/device.html`
- **Generator:** Standard `scripts/generator/generate-device-pages.js`
- **Build hook:** Automatic category merge (line 93-94)
- **Products:** Referenced from `data/sdcards.json`

---

## Quick Commands

### Test car navigation:
```bash
node -e "const {generateCarPages} = require('./scripts/generator/generate-car-pages'); generateCarPages('./dist');"
```

### Test dash cams merged:
```bash
node -e "const d = require('./data/devices.json'); console.log(d.devices.filter(x => x.category === 'Dash Cams').length);"
```

### Add new car model:
```bash
# Edit data/cars-navigation.json
# Add to compatibleModels array
# Run build
npm run build
```

### Add new dash cam:
```bash
# Edit data/categories/dash-cams.json or create new category
# Add device object to array
# Run build
npm run build
```

### Check all car pages generated:
```bash
ls dist/cars/*/index.html | wc -l
```

### Check all dash cam pages generated:
```bash
node -e "const d = require('./data/devices.json'); const cams = d.devices.filter(x => x.category === 'Dash Cams'); cams.forEach(c => console.log('✓', c.name));"
```

---

## Production Checklist

Before deploying new expansions:

### Car Navigation
- [ ] All affiliate links replaced in `data/cars-navigation.json`
- [ ] Product images added to `/img/` 
- [ ] Installation guides verified for accuracy
- [ ] Warnings reviewed for completeness
- [ ] Car pages generated and tested locally
- [ ] Slugs are URL-safe and consistent

### Dash Cams
- [ ] All device IDs unique
- [ ] Brand IDs exist in `sdcards.json`
- [ ] Device images added to `/img/devices/`
- [ ] Card images added to `/img/cards/`
- [ ] SEO search terms populated
- [ ] FAQ content reviewed
- [ ] Related devices cross-linked
- [ ] Category page template exists

### Both
- [ ] `npm run build` completes without errors
- [ ] `npm start` serves pages correctly
- [ ] Page content renders properly
- [ ] Links work (internal + affiliate)
- [ ] Images load or show fallbacks
- [ ] Mobile responsive tested
- [ ] Ready for deployment

---

**Guide Complete**
