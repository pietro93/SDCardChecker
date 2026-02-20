# SD Card Checker - Complete Architecture & Implementation Guide

**Version:** 2.0  
**Last Updated:** Feb 20, 2026  
**Purpose:** Comprehensive technical documentation for developers, localization teams, and maintainers

---

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Data Structure](#data-structure)
4. [Modular Dataset Architecture](#modular-dataset-architecture)
5. [Build Pipeline](#build-pipeline)
6. [Template System](#template-system)
7. [File Reference](#file-reference)
8. [Adding/Modifying Content](#adding-modifying-content)
9. [Expanding Device Types](#expanding-device-types)
10. [Localization Guide](#localization-guide)

---

## Overview

### What is SD Card Checker?

A **static site generator** that builds a searchable, SEO-optimized website recommending SD cards for 100+ devices. The site generates ~150+ HTML pages from a single JSON database + HTML templates.

**Key Properties:**
- **Static Generation:** No server/database needed. Pure HTML output.
- **Data-Driven:** All device info lives in `data/devices.json`. Change that file, rebuild, done.
- **Template-Based:** Reusable HTML templates with variable substitution.
- **Build-Time:** All pages generated at build time (no runtime magic).
- **Fast:** Static files = instant load times, CDN-friendly.

### Tech Stack

```
Frontend (Generated Output)
├─ HTML5 (static pages)
├─ CSS (Tailwind + custom styles)
└─ JavaScript (Alpine.js for interactivity)

Build System (Runs During npm run build)
├─ Node.js scripts
├─ File system operations (reading JSON, writing HTML)
└─ String templating (replacing {{VARIABLES}})

Data Source
├─ data/devices.json (device specs, FAQs, brands)
└─ src/templates/*.html (page templates)

Output (What Gets Deployed)
└─ dist/ (entire folder → CDN/hosting)
```

---

## System Architecture

### High-Level Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│                     npm run build                             │
│                   (Build Process)                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
   ┌─────────────────────┐  ┌──────────────┐
   │   Merge Category    │  │Load Templates│
   │      Datasets       │  │              │
   │                     │  │device.html   │
   │ data/categories/    │  │category.html │
   │ ├─ cameras.json     │  │etc...        │
   │ ├─ drones.json      │  └────────┬─────┘
   │ ├─ action-cams.json │           │
   │ └─ ...json          │           │
   └──────┬──────────────┘           │
          │                          │
          ▼                          │
   ┌─────────────────────┐           │
   │  devices.json       │           │
   │  (merged single file)           │
   └──────┬──────────────┘           │
          │  ┌──────────────────────┘
          │  │
          ▼  ▼
     ┌──────────────────────┐
     │  For Each Device     │
     │                      │
     │ 1. Read device       │
     │ 2. Build vars        │
     │ 3. Replace {{}}      │
     │ 4. Write HTML page   │
     └──────────┬───────────┘
                │
                ▼
     ┌──────────────────────────┐
     │   dist/devices/          │
     │   [slug]/index.html      │
     │                          │
     │ + dist/categories/       │
     │ + dist/tools/            │
     │ + dist/readers/          │
     └──────────────────────────┘
```

### Component Breakdown

#### 1. **Data Layer** (Modular Category Datasets)

**Source:** `data/categories/*.json` + `data/sdcards.json` + other datasets

The site now uses a **modular, category-based approach** instead of a monolithic file:

**File Structure:**
```
data/
├─ categories/
│  ├─ action-cameras.json      (GoPro, DJI Action, etc.)
│  ├─ cameras.json              (Canon, Sony, Nikon, etc.)
│  ├─ drones.json               (DJI, Skydio, etc.)
│  ├─ dash-cams.json            (Viofo, Thinkware, etc.)
│  ├─ computing-and-tablets.json (iPad, Surface, etc.)
│  ├─ smartphones.json
│  ├─ gaming-handhelds.json
│  ├─ security-cameras.json
│  └─ audio-and-hi-fi.json
│
├─ sdcards.json                 (All SD card products)
├─ devices.json                 (AUTO-GENERATED on build, don't edit)
├─ promoted-cards.json          (Marketing: featured products)
└─ sdcard-enrichment.json       (Extra content for cards)
```

**Why this approach?**
- ✅ **Scalability:** Each device type is a separate file → easier to manage
- ✅ **Merge on Build:** All categories auto-merge into `devices.json` during build
- ✅ **Team Collaboration:** Multiple people can edit different categories without conflicts
- ✅ **Version Control:** Smaller diffs, easier to review changes

**Example: action-cameras.json**
```json
[
  {
    "id": "gopro-hero-13",
    "name": "GoPro Hero 13 Black",
    "category": "Action Cameras",
    "slug": "gopro-hero-13",
    "searchTerms": [
      "gopro hero 13",
      "gopro 13 memory card"
    ],
    "sdCard": {
      "type": "microSD UHS-I (UHS-II Compatible)",
      "minSpeed": "V30",
      "minWriteSpeed": "30 MB/s",
      "recommendedCapacity": ["128GB", "256GB", "512GB"],
      "maxCapacity": "512GB"
    },
    "whySpecs": "Shoots 5.3K at high frame rates. V30 ensures 30MB/s sustained write speed needed to prevent dropped frames or corrupted files.",
    "recommendedBrands": [
      { "id": "sandisk-extreme-microsd" },
      { "id": "lexar-professional-633x" },
      { "id": "kingston-canvas-select" }
    ],
    "faq": [
      {
        "q": "Can I use a regular SD card with adapter?",
        "a": "<b>No, the GoPro Hero 13 Black only accepts microSD cards</b>. Full-size SD cards will not work even with an adapter."
      }
    ],
    "relatedDevices": ["gopro-hero-12"],
    "notes": "Internal notes"
  }
]
```

**Example: sdcards.json (Product Database)**
```json
{
  "sdcards": [
    {
      "id": "sandisk-extreme-microsd",
      "name": "SanDisk Extreme microSD",
      "type": "microSD",
      "specs": {
        "uhs": "UHS-I",
        "speedClass": "V30",
        "appPerformance": "A2",
        "readSpeed": "Up to 190 MB/s",
        "writeSpeed": "Up to 130 MB/s"
      },
      "availableCapacities": [32, 64, 128, 256, 512],
      "priceSymbol": "$$",
      "priceTier": "Mid-Range",
      "imageUrl": "/img/cards/sandisk-extreme-microsd.webp",
      "amazonSearchUrl": "https://amazon.com/s?k=SanDisk+Extreme+microSD&tag=sd-cc-20",
      "pros": "The gold standard. Fast, reliable, A2 rated.",
      "cons": "Write speeds are slower on 32GB/64GB capacities.",
      "tier": "recommended"
    }
  ]
}
```

#### 2. **Template Layer** (Reusable HTML Structure)

File: `src/templates/device.html`

Template with variable placeholders that get replaced with actual data.

```html
<!DOCTYPE html>
<html>
<head>
    <title>{{DEVICE_TITLE}}</title>
    <meta name="description" content="{{DEVICE_DESCRIPTION}}">
    <link rel="canonical" href="{{DEVICE_URL}}">
</head>
<body>
    <h1>Best SD Card for {{DEVICE_NAME}}</h1>
    
    {{REQUIREMENTS_SECTION}}
    
    {{BRANDS_TABLE}}
    
    {{FAQ_SECTION}}
    
    {{SCHEMA_MARKUP}}
</body>
</html>
```

During build, each `{{VARIABLE}}` gets replaced with actual content.

#### 3. **Generator Layer** (Build Scripts)

File: `scripts/generator/generate-device-pages.js`

Orchestrates the build process:

```javascript
// Pseudocode of what happens
async function generateDevicePages(devices, distPath) {
  for (const device of devices) {
    // 1. Read template
    const template = fs.readFileSync('src/templates/device.html', 'utf8');
    
    // 2. Build variables
    const vars = {
      DEVICE_TITLE: `Best SD Card for ${device.name}`,
      DEVICE_DESCRIPTION: `${device.name} SD card requirements...`,
      DEVICE_URL: `https://sdcardchecker.com/devices/${device.slug}/`,
      // ... 50+ more variables
    };
    
    // 3. Replace variables
    let html = template;
    for (const [key, value] of Object.entries(vars)) {
      html = html.replace(`{{${key}}}`, value);
    }
    
    // 4. Write file
    const outputPath = `dist/devices/${device.slug}/index.html`;
    fs.writeFileSync(outputPath, html);
  }
}
```

#### 4. **Build Orchestrator**

File: `scripts/generator/build.js`

Coordinates the entire build process:

```javascript
async function build() {
  console.log("🚀 Starting site generation...");

  const devices = readJSON('data/devices.json').devices;
  
  await generateDevicePages(devices, distPath);      // 100+ device pages
  await generateCategoryPages(devices, distPath);    // 10 category pages
  await generateResourcePages(distPath);             // FAQ, About, etc.
  await generateCalculatorPages(distPath);           // Tool pages
  await generateCoreFiles(devices, distPath);        // Sitemap, robots.txt
  await copyAssets(distPath);                        // CSS, JS, images
  
  console.log("✅ Generation complete!");
}
```

---

## Modular Dataset Architecture

### Overview: From Monolithic to Modular

**Old Approach:**
- Single `data/devices.json` with 150+ devices
- Hard to manage, large diffs, merge conflicts

**New Approach (Current):**
- Devices split into `data/categories/*.json` (one per category)
- Automatically merged into `devices.json` during build
- Products live in `data/sdcards.json`
- Enrichment data in separate files

### The Build-Time Merge Process

When you run `npm run build`:

**Step 1: Merge Category Files**
```javascript
// From scripts/generator/build.js

mergeDeviceCategories() {
  const categoryFiles = fs.readdirSync('data/categories')
    .filter(f => f.endsWith('.json'))
    .sort();
  
  let allDevices = [];
  
  for (const file of categoryFiles) {
    const devices = JSON.parse(fs.readFileSync(file, 'utf8'));
    allDevices = allDevices.concat(devices);
  }
  
  // Write merged file
  fs.writeFileSync('data/devices.json', {
    devices: allDevices,
    metadata: { ... }
  });
}
```

**Step 2: Generate Pages from Merged File**
- All generators then read the merged `devices.json`
- Each device gets a page, category gets aggregated pages
- All links, search indexes, sitemaps built from merged data

### Datasets at a Glance

| File | Purpose | Format | Examples |
|------|---------|--------|----------|
| `data/categories/*.json` | Individual device categories | Array of devices | `action-cameras.json`, `drones.json` |
| `data/sdcards.json` | All SD card products | `{ sdcards: [...] }` | SanDisk, Samsung, Kingston cards |
| `data/devices.json` | **GENERATED** - Merged all categories | `{ devices: [...], metadata }` | (Auto-created, don't edit) |
| `data/sdcard-enrichment.json` | Extra content for cards | Object map | richDescription, useCase, bestFor |
| `data/promoted-cards.json` | Marketing: featured products | Array | Cards highlighted in calculators |
| `data/calculator-content.json` | Content for calculator page | Object | Guides, tips, FAQ |
| `data/device-enrichment.json` | Extra device content | Object map | Additional device details |

### Example: Complete Category File

**File: `data/categories/cameras.json`**
```json
[
  {
    "id": "canon-eos-r5",
    "name": "Canon EOS R5",
    "category": "Cameras",
    "slug": "canon-eos-r5",
    "searchTerms": [
      "canon eos r5",
      "canon r5 memory card",
      "canon mirrorless sd card"
    ],
    "imageUrl": "/img/devices/canon-eos-r5.jpg",
    "sdCard": {
      "type": "SD UHS-II",
      "minSpeed": "V60",
      "minWriteSpeed": "60 MB/s",
      "recommendedCapacity": ["128GB", "256GB"],
      "maxCapacity": "2TB"
    },
    "whySpecs": "8K RAW video at 120fps requires extreme sustained write speeds. V60 maintains 60MB/s minimum, necessary for RAW formats. Dual slot: one CFast card, one SD card.",
    "recommendedBrands": [
      { "id": "sandisk-extreme-pro-sd" },
      { "id": "lexar-professional-1000x-sd" },
      { "id": "prograde-digital-cobalt" }
    ],
    "faq": [
      {
        "q": "Can I use UHS-I cards in the EOS R5?",
        "a": "<b>Yes, UHS-I cards work</b>, but you'll get slower write speeds (~104 MB/s max). For 8K RAW, V60 <b>UHS-II cards are strongly recommended</b>."
      },
      {
        "q": "Is dual-slot recommended?",
        "a": "<b>Yes. The first slot is CFast, the second is SD</b>. Professional workflows use the CFast for primary recording and SD for redundancy backup."
      }
    ],
    "relatedDevices": ["canon-eos-r6", "canon-eos-r3"],
    "notes": "Professional cinema camera. Raw specs required."
  },
  {
    "id": "canon-eos-r6",
    "name": "Canon EOS R6",
    "category": "Cameras",
    "slug": "canon-eos-r6",
    // ... more fields
  }
]
```

**File: `data/categories/drones.json`**
```json
[
  {
    "id": "dji-air-3s",
    "name": "DJI Air 3S",
    "category": "Drones",
    "slug": "dji-air-3s",
    "searchTerms": ["dji air 3s", "dji air 3s sd card", "dji drone memory"],
    "sdCard": {
      "type": "microSD UHS-II",
      "minSpeed": "V30",
      "minWriteSpeed": "30 MB/s",
      "recommendedCapacity": ["256GB", "512GB"],
      "maxCapacity": "2TB"
    },
    "whySpecs": "4K 60fps video bitrate ~150 Mbps. V30 ensures stable recording. Prefers fast UHS-II for best performance, but V30 UHS-I works.",
    "recommendedBrands": [
      { "id": "sandisk-extreme-microsd" },
      { "id": "samsung-evo-plus-microsd" }
    ],
    "faq": [
      {
        "q": "What's the difference between V30 and V60 for DJI Air 3S?",
        "a": "V30 (30MB/s) is the minimum requirement and works well. V60 (60MB/s) provides extra headroom for future firmware updates and multi-format recording but is not necessary for current models."
      }
    ],
    "relatedDevices": ["dji-mini-4-pro", "dji-mavic-3"]
  }
]
```

### Key Rules for Category Files

1. **File Naming:** Match device type exactly
   - `action-cameras.json` ✅
   - `action_cameras.json` ❌ (use hyphens)

2. **Array Format:** Categories are arrays (not wrapped in `{ devices: [...] }`)
   ```json
   [
     { "id": "...", "name": "...", ... },
     { "id": "...", "name": "...", ... }
   ]
   ```

3. **Required Fields per Device:**
   - `id` - Unique, URL-safe identifier
   - `name` - Display name
   - `category` - Must match one of the defined categories
   - `slug` - URL slug (usually matches id)
   - `sdCard` - Object with type, minSpeed, minWriteSpeed, etc.
   - `recommendedBrands` - Array of brand references

4. **Auto-Generated Fields (Don't Manually Add):**
   - `imageUrl` - Optional, falls back to placeholder if missing
   - `relatedDevices` - Can be auto-generated from similar devices

---

## Data Structure

### Device Schema (Complete)

```json
{
  "id": "unique-device-id",                          // REQUIRED - Unique identifier
  "name": "Device Display Name",                     // REQUIRED - Full name
  "category": "Category Name",                       // REQUIRED - Must match a defined category
  "slug": "url-slug",                                // REQUIRED - URL path (no spaces/special chars)
  "searchTerms": [                                   // RECOMMENDED - SEO keywords
    "search term 1",
    "search term 2"
  ],
  "imageUrl": "/path/to/image.jpg",                 // OPTIONAL - Hero image (defaults to placeholder)
  
  "sdCard": {                                        // REQUIRED - SD card specifications
    "type": "microSD UHS-II",                        // Type of card
    "minSpeed": "V30",                               // Minimum speed class
    "minWriteSpeed": "30 MB/s",                      // Write speed
    "recommendedCapacity": [                         // Suggested sizes
      "128GB",
      "256GB"
    ],
    "maxCapacity": "512GB"                           // Maximum supported
  },
  
  "whySpecs": "Explanation of why these specs...",   // REQUIRED - Context for specs
  
  "recommendedBrands": [                             // REQUIRED - Brand recommendations
    {
      "id": "brand-identifier"                       // Reference to brand entry in data
    }
  ],
  
  "faq": [                                           // OPTIONAL - Device-specific FAQs
    {
      "q": "Question?",
      "a": "Answer with <b>HTML</b> support"
    }
  ],
  
  "relatedDevices": [                                // OPTIONAL - Similar devices
    "related-device-slug"
  ],
  
  "notes": "Internal notes (not displayed)"          // OPTIONAL - Dev notes
}
```

### Categories

Pages are grouped by category. All unique categories in `devices.json` get their own category page.

```
Categories (auto-generated from devices.json):
├─ Action Cameras
├─ Drones
├─ Gaming Handhelds
├─ Mirrorless Cameras
├─ Smartphones & Tablets
├─ Computing Devices
├─ DSLR Cameras
├─ Film Cameras
├─ Security Cameras
├─ Cinema Cameras
└─ ... (any new category auto-included)
```

---

## Build Pipeline

### When You Run `npm run build`

```bash
npm run build
```

Executes `scripts/generator/build.js` which performs:

1. **Load Device Data**
   - Reads `data/devices.json` (98+ devices)
   - Validates structure
   - Groups by category

2. **Copy Static Assets**
   - Copies `src/css/` → `dist/assets/css/`
   - Copies `src/js/` → `dist/assets/js/`
   - Copies `img/` → `dist/img/`

3. **Generate Device Pages**
   - For each device in JSON
   - Load `src/templates/device.html`
   - Replace 50+ template variables
   - Write `dist/devices/{slug}/index.html`
   - Result: 100+ device pages

4. **Generate Category Pages**
   - For each unique category
   - Load `src/templates/category.html`
   - List all devices in that category
   - Result: 10-15 category pages

5. **Generate Resource Pages**
   - About, Privacy, Terms, FAQ
   - Load templates from `src/templates/`
   - Write to `dist/`

6. **Generate Utility Pages**
   - Calculator tools
   - Guide pages
   - Comparison pages

7. **Generate SEO Files**
   - `sitemap.xml` - All pages for search engines
   - `robots.txt` - Crawl instructions
   - Redirects for URL migrations

8. **Result**
   - 150+ ready-to-deploy HTML files
   - All static, no server needed
   - Optimized file structure

### Output Structure

```
dist/                                    # Deploy this entire folder
├── index.html                           # Homepage
├── devices/
│   ├── gopro-hero-13/index.html
│   ├── nintendo-switch/index.html
│   ├── dji-mini-4-pro/index.html
│   └── ... (100+ device pages)
├── categories/
│   ├── action-cameras/index.html
│   ├── drones/index.html
│   ├── gaming-handhelds/index.html
│   └── ... (10+ category pages)
├── guides/
│   ├── about/index.html
│   ├── privacy/index.html
│   └── terms/index.html
├── tools/
│   ├── calculator/index.html
│   └── comparisons/index.html
├── assets/
│   ├── css/
│   │   ├── tailwind.css
│   │   ├── modern.css
│   │   └── ... (all compiled CSS)
│   ├── js/
│   │   ├── search.js
│   │   └── ... (client-side JS)
│   └── images/
│       ├── devices/
│       ├── brands/
│       └── ... (all images)
├── sitemap.xml                         # Google Search Console
├── robots.txt                          # Search engine crawl rules
└── data/
    └── devices.json                    # Public device data (for search)
```

---

## Template System

### How Template Variables Work

Templates use `{{VARIABLE}}` syntax that gets replaced during build.

#### Device Page Template Variables

File: `src/templates/device.html`

```html
<!-- Meta Tags -->
<title>{{DEVICE_TITLE}}</title>
<meta name="description" content="{{DEVICE_DESCRIPTION}}">

<!-- Content -->
<h1>{{DEVICE_NAME}}</h1>

<!-- Dynamic Sections -->
{{REQUIREMENTS_SECTION}}      <!-- SD card specs table -->
{{BRANDS_TABLE}}              <!-- Recommended brands -->
{{FAQ_SECTION}}               <!-- Device FAQs -->
{{RELATED_DEVICES}}           <!-- Similar products -->

<!-- SEO -->
{{SCHEMA_MARKUP}}             <!-- JSON-LD structured data -->
{{BREADCRUMB_SCHEMA}}         <!-- Breadcrumb for Google -->
```

#### Variable Generation Example

Here's how a generator builds variables for a device:

```javascript
function buildDeviceVariables(device, baseUrl) {
  const title = `Best SD Card for ${device.name} | Specs & Recommendations`;
  
  return {
    // Meta
    DEVICE_TITLE: title.substring(0, 60),              // Google limit
    DEVICE_DESCRIPTION: `Get the best SD card for ${device.name}. ${device.sdCard.type} ${device.sdCard.minSpeed} recommended...`,
    DEVICE_URL: `${baseUrl}/devices/${device.slug}/`,
    
    // Content
    DEVICE_NAME: device.name,
    DEVICE_NAME_SHORT: device.name.split(' ')[0],     // e.g., "GoPro"
    CATEGORY_NAME: device.category,
    CATEGORY_SLUG: slugify(device.category),          // URL-safe version
    
    // Specs
    SD_CARD_TYPE: device.sdCard.type,
    MIN_SPEED: device.sdCard.minSpeed,
    MIN_WRITE_SPEED: device.sdCard.minWriteSpeed,
    RECOMMENDED_CAPACITY: device.sdCard.recommendedCapacity.join(', '),
    MAX_CAPACITY: device.sdCard.maxCapacity,
    
    // Sections
    REQUIREMENTS_SECTION: generateRequirementsHTML(device),
    BRANDS_TABLE: generateBrandsTableHTML(device),
    FAQ_SECTION: generateFAQHTML(device),
    RELATED_DEVICES: generateRelatedDevicesHTML(device),
    
    // SEO
    SCHEMA_MARKUP: generateSchemaMarkup(device),
    BREADCRUMB_SCHEMA: generateBreadcrumbSchema(device),
    OG_TITLE: title,
    TWITTER_TITLE: title.substring(0, 70),
  };
}
```

### Template Example: Device Requirements Section

How the generator builds a section:

```javascript
function generateRequirementsHTML(device) {
  const { sdCard } = device;
  
  return `
    <section class="requirements">
      <h2>SD Card Requirements</h2>
      <div class="specs-grid">
        <div class="spec">
          <strong>Type:</strong> ${sdCard.type}
        </div>
        <div class="spec">
          <strong>Speed:</strong> ${sdCard.minSpeed} (${sdCard.minWriteSpeed} write)
        </div>
        <div class="spec">
          <strong>Capacity:</strong> ${sdCard.recommendedCapacity.join(', ')}
        </div>
        <div class="spec">
          <strong>Maximum:</strong> ${sdCard.maxCapacity}
        </div>
      </div>
      <p>${device.whySpecs}</p>
    </section>
  `;
}
```

---

## File Reference

### Core Files & Their Purpose

#### Data Files

| File | Purpose | Editable |
|------|---------|----------|
| `data/devices.json` | Device database (98+ devices, FAQs, specs) | ✅ YES |
| `data/brands.json` (if exists) | Brand reference data | ✅ YES |

#### Template Files

| File | Purpose | Editable |
|------|---------|----------|
| `src/templates/device.html` | Device page template | ✅ YES |
| `src/templates/category.html` | Category listing template | ✅ YES |
| `src/templates/home.html` | Homepage | ✅ YES |
| `src/templates/components.js` | Reusable HTML components | ✅ YES |
| `src/templates/about.html` | About page | ✅ YES |

#### Build Scripts

| File | Purpose | When Run |
|------|---------|----------|
| `scripts/generator/build.js` | Main orchestrator | `npm run build` |
| `scripts/generator/generate-device-pages.js` | Creates device pages | `npm run build` |
| `scripts/generator/generate-category-pages.js` | Creates category pages | `npm run build` |
| `scripts/generator/generate-core-files.js` | Sitemap, robots.txt | `npm run build` |
| `scripts/generator/helpers.js` | Utility functions | Used by generators |

#### Styling

| File | Purpose |
|------|---------|
| `src/css/tailwind.css` | Tailwind CSS input |
| `src/css/modern.css` | Custom CSS override |
| `tailwind.config.js` | Tailwind configuration |

#### Frontend Assets

| File | Purpose |
|------|---------|
| `src/js/search.js` | Client-side search (Alpine.js) |
| `img/` | All images (devices, brands, icons) |

#### Configuration

| File | Purpose |
|------|---------|
| `package.json` | NPM dependencies & scripts |
| `vercel.json` | Vercel deployment config |

---

## Adding/Modifying Content

### Adding a New Device

**Step 1:** Open `data/devices.json`

**Step 2:** Add entry to the `devices` array:

```json
{
  "id": "fujifilm-x-t5",
  "name": "Fujifilm X-T5",
  "category": "Mirrorless Cameras",
  "slug": "fujifilm-x-t5",
  "searchTerms": [
    "fujifilm x-t5",
    "x-t5 sd card",
    "xt5 memory card"
  ],
  "sdCard": {
    "type": "SD UHS-II",
    "minSpeed": "V30",
    "minWriteSpeed": "30 MB/s",
    "recommendedCapacity": ["128GB", "256GB"],
    "maxCapacity": "512GB"
  },
  "whySpecs": "Great for both stills and 4K video. V30 handles continuous 4K recording without dropped frames.",
  "recommendedBrands": [
    { "id": "sandisk-extreme-pro-sd-uhs-ii" },
    { "id": "lexar-professional-1000x-sd" }
  ],
  "faq": [
    {
      "q": "Can I use a single UHS-I card for video?",
      "a": "Yes, but UHS-II cards are recommended for better sustained write performance during 4K recording."
    },
    {
      "q": "What's the difference between the two card slots?",
      "a": "Both slots accept SD UHS-II. You can use them for backup or overflow storage."
    }
  ],
  "relatedDevices": ["fujifilm-x-s20", "fujifilm-xt4"],
  "notes": "Popular enthusiast camera. Very reliable with V30+ cards."
}
```

**Step 3:** Rebuild site

```bash
npm run build
```

Result: New page at `dist/devices/fujifilm-x-t5/index.html` automatically created.

### Modifying Existing Device

1. Find device in `data/devices.json`
2. Edit any field (name, specs, FAQs, etc.)
3. Run `npm run build`
4. Changes propagate to generated page

### Updating Device Category

Change the `category` field:

```json
{
  "id": "gopro-hero-13",
  "name": "GoPro Hero 13",
  "category": "Action Cameras",  // ← Change this
}
```

When you rebuild, it automatically:
- Removes from old category page
- Adds to new category page
- Updates breadcrumbs
- Updates related devices

### Adding FAQ to Device

Edit the `faq` array in device entry:

```json
"faq": [
  {
    "q": "Can I use V20 cards?",
    "a": "Not recommended. V30 is the minimum for reliable 4K recording."
  },
  {
    "q": "How long do cards last?",
    "a": "Quality V30 cards last 3-5 years with regular use."
  }
]
```

HTML is supported in answers:

```json
{
  "q": "What's UHS-II?",
  "a": "UHS-II is a faster bus standard. <b>Backward compatible</b> with UHS-I cards."
}
```

---

## Localization Guide

### How Localization Works

The system is designed for localization. Each language becomes a separate site:

```
dist-en/                    # English site (current)
├── index.html
├── devices/gopro-hero-13/
└── ...

dist-ja/                    # Japanese site (future)
├── index.html
├── devices/gopro-hero-13/
└── ...

dist-de/                    # German site (future)
├── index.html
├── devices/gopro-hero-13/
└── ...
```

### Localization Steps

#### Phase 1: Prepare Data

**Step 1:** Create language-specific device file

```bash
cp data/devices.json data/devices-ja.json
```

**Step 2:** Translate `devices-ja.json`:

```json
{
  "devices": [
    {
      "id": "gopro-hero-13",
      "name": "GoPro Hero 13 Black",        // ← Translate
      "category": "アクションカメラ",       // ← Translate to Japanese
      "slug": "gopro-hero-13",              // Keep same (URL-safe)
      "searchTerms": [
        "ゴープロ ヒーロー 13",             // ← Translate
        "gopro 13 メモリカード"
      ],
      "sdCard": {
        "type": "microSD UHS-I",            // Keep technical terms
        "minSpeed": "V30",                  // Keep speed class
        "minWriteSpeed": "30 MB/s",         // Keep specs
        "recommendedCapacity": ["128GB", "256GB"],
        "maxCapacity": "512GB"
      },
      "whySpecs": "5.3Kで高フレームレート...", // ← Translate explanation
      "recommendedBrands": [
        { "id": "sandisk-extreme-microsd" }  // Keep same ID
      ],
      "faq": [
        {
          "q": "通常のSD カードを使用できますか?",          // ← Translate Q
          "a": "<b>いいえ、GoPro Hero 13 BlackはmicroSDカードのみを受け入れます</b>。" // ← Translate A
        }
      ],
      "notes": "..."
    }
  ]
}
```

#### Phase 2: Translate Templates

Create Japanese templates:

```bash
cp src/templates/device.html src/templates/device-ja.html
cp src/templates/home.html src/templates/home-ja.html
cp src/templates/category.html src/templates/category-ja.html
```

Edit `device-ja.html`:

```html
<!-- Keep structure, translate content only -->
<h1>{{DEVICE_NAME}}の最適なSDカード</h1>  <!-- Translated, variables same -->

<!-- Keep template variables same ({{DEVICE_NAME}} etc) -->
<!-- Only translate literal text, not placeholders -->

<h2>SDカード要件</h2>  <!-- Translated -->
<p>{{DEVICE_DESCRIPTION}}</p>  <!-- Variable stays same -->
```

**Key Rule:** Keep all `{{VARIABLES}}` exactly the same. Only translate visible text.

#### Phase 3: Create Build Script for Japanese

Create `scripts/generator/build-ja.js`:

```javascript
const path = require("path");

async function buildJapanese() {
  console.log("🚀 Building Japanese site...");
  
  // Use Japanese data and templates
  const devicesData = readJSON('data/devices-ja.json');      // ← Japanese data
  const templatePath = 'src/templates/device-ja.html';       // ← Japanese template
  
  await generateDevicePages(
    devicesData.devices,
    'dist-ja',                 // ← Separate output folder
    templatePath
  );
  
  console.log("✅ Japanese site build complete!");
}

buildJapanese();
```

Update `package.json`:

```json
{
  "scripts": {
    "build": "node scripts/generator/build.js",
    "build:ja": "node scripts/generator/build-ja.js",
    "build:all": "npm run build && npm run build:ja"
  }
}
```

#### Phase 4: Run Build

```bash
npm run build:ja
```

Result:
- `dist-ja/devices/gopro-hero-13/index.html` (Japanese version)
- All slugs kept same (for cross-linking)
- Completely separate from English site

#### Phase 5: Deploy Both

Deploy English to: `sdcardchecker.com/`  
Deploy Japanese to: `sdcardchecker.com/ja/`

Or:
Deploy English to: `en.sdcardchecker.com/`  
Deploy Japanese to: `ja.sdcardchecker.com/`

### Localization Checklist

- [ ] Translate device specs (name, category, search terms)
- [ ] Translate device FAQs
- [ ] Translate template text (keep variables same)
- [ ] Translate category names
- [ ] Translate page headers/footers
- [ ] Translate search placeholder text
- [ ] Test all device pages render correctly
- [ ] Verify all links work (slugs are language-agnostic)
- [ ] Test cross-language links (if needed)
- [ ] Deploy to language subdomain/path

### Things to NOT Translate

```
❌ Device slugs (gopro-hero-13)      → Keep same for URLs
❌ Template variables ({{DEVICE_NAME}}) → Keep same syntax
❌ Speed classes (V30, V60, UHS-II)  → Technical standards
❌ Capacity numbers (128GB, 256GB)   → Universal
❌ Brand names (SanDisk, Kingston)   → Proper nouns
❌ IDs (device IDs, brand IDs)       → Internal references
```

---

## Expanding Device Types

### How to Add a New Device Category

The modular architecture makes it easy to add new device types without touching core code.

### Step 1: Plan the New Category

**Example: Adding "Instant Cameras" (Fujifilm Instax, etc.)**

Decide:
- Category name: `Instant Cameras`
- File name: `data/categories/instant-cameras.json`
- Which devices to include

### Step 2: Create the Category File

```bash
# Create new category file
touch data/categories/instant-cameras.json
```

**File: `data/categories/instant-cameras.json`**
```json
[
  {
    "id": "fujifilm-instax-evo",
    "name": "Fujifilm Instax Evo",
    "category": "Instant Cameras",
    "slug": "fujifilm-instax-evo",
    "searchTerms": [
      "instax evo",
      "fujifilm instax evo memory card",
      "instax evo sd card",
      "instant camera storage"
    ],
    "imageUrl": "/img/devices/fujifilm-instax-evo.jpg",
    "sdCard": {
      "type": "SD UHS-I",
      "minSpeed": "Class 10",
      "minWriteSpeed": "10 MB/s",
      "recommendedCapacity": ["32GB", "64GB"],
      "maxCapacity": "128GB"
    },
    "whySpecs": "The Instax Evo saves digital copies alongside instant prints. 10MB/s write speed is sufficient for the camera's 1280x960 image format. UHS-I cards are plenty fast; UHS-II is overkill.",
    "recommendedBrands": [
      { "id": "sandisk-ultra-sd" },
      { "id": "kingston-canvas-select" }
    ],
    "faq": [
      {
        "q": "Do I need a fast SD card for Instax Evo?",
        "a": "<b>No, Class 10 is more than sufficient</b>. The Instax Evo records at low bitrates (1280x960). A standard Class 10 card easily handles the ~5 MB/s write speed needed."
      },
      {
        "q": "What size should I get?",
        "a": "64GB is ideal. The Instax Evo stores approximately 2000-3000 image files per 64GB depending on quality settings. 32GB works but fills quickly."
      }
    ],
    "relatedDevices": ["fujifilm-instax-wide-300"],
    "notes": "Consumer instant camera with digital backup"
  }
]
```

### Step 3: Add Missing Brand Recommendations

If the brand ID doesn't exist in `data/sdcards.json`, add it:

**Check existing brands:**
```bash
grep -o '"id": "[^"]*"' data/sdcards.json | sort | uniq
```

**Add new card if needed:**
```json
{
  "id": "sandisk-ultra-sd",
  "name": "SanDisk Ultra SD",
  "type": "SD",
  "specs": {
    "uhs": "UHS-I",
    "speedClass": "U3",
    "readSpeed": "Up to 120 MB/s",
    "writeSpeed": "Up to 90 MB/s"
  },
  "availableCapacities": [32, 64, 128],
  "priceSymbol": "$",
  "priceTier": "Budget",
  "imageUrl": "/img/cards/sandisk-ultra-sd.webp",
  "tier": "budget"
}
```

### Step 4: Build & Test

```bash
# Run build - automatically merges your new category
npm run build

# Check that devices were merged
node -e "console.log(require('./data/devices.json').metadata)"

# Output:
# {
#   "totalDevices": 155,
#   "categories": [ ..., "Instant Cameras", ... ],
#   "categoryCount": 11
# }

# Check local site
npm start

# Visit: http://localhost:8080/devices/fujifilm-instax-evo/
```

### Step 5: Add Category Template (Optional, If New Layout Needed)

If the category needs special UI beyond the default device page:

**File: `src/templates/category-instant-cameras.html`** (optional)
```html
<!-- Use default category template, or customize this -->
<div class="category-instant-cameras">
  <h1>Best SD Cards for {{CATEGORY_NAME}}</h1>
  <p>Instant cameras need stable, reliable cards for both prints and digital backup...</p>
  <!-- ... custom content ... -->
</div>
```

Update `generate-category-pages.js` to use this template if it exists.

### Step 6: Test Localization (If Adding Japanese)

If the site supports Japanese, also add:

**File: `data/categories-ja/instant-cameras.json`**
```json
[
  {
    "id": "fujifilm-instax-evo",
    "name": "富士フイルム Instax Evo",
    "category": "インスタントカメラ",
    "slug": "fujifilm-instax-evo",
    "searchTerms": ["instax evo", "富士フイルム instax evo"],
    // ... rest translated ...
  }
]
```

### Step 7: Verify Checklist

Before committing:

- [ ] New category file created: `data/categories/[name].json`
- [ ] All devices have required fields (id, name, category, slug, sdCard, recommendedBrands)
- [ ] All recommended brand IDs exist in `data/sdcards.json`
- [ ] Device slugs are URL-safe (lowercase, hyphens, no spaces)
- [ ] JSON is valid (no syntax errors)
- [ ] Build runs without errors: `npm run build`
- [ ] New devices appear in `dist/devices/[slug]/`
- [ ] Category page works: `/categories/[category-slug]/`
- [ ] Search finds new devices

### Complete Example: New Device Type Workflow

**Scenario:** Add "Film Cameras" category with 5 devices

```bash
# 1. Create file
cat > data/categories/film-cameras.json << 'EOF'
[
  {
    "id": "leica-m-film",
    "name": "Leica M Film Camera",
    "category": "Film Cameras",
    "slug": "leica-m-film",
    "searchTerms": ["leica m film camera"],
    "sdCard": {
      "type": "Not Applicable",
      "minSpeed": "N/A",
      "minWriteSpeed": "N/A",
      "recommendedCapacity": ["N/A"],
      "maxCapacity": "N/A"
    },
    "whySpecs": "Film cameras don't use SD cards. They use film. This is informational only.",
    "recommendedBrands": [],
    "faq": [
      {
        "q": "Do film cameras use SD cards?",
        "a": "No. Film cameras use physical 35mm or medium format film. The Leica M is a legendary rangefinder camera that uses film only."
      }
    ],
    "relatedDevices": []
  }
]
EOF

# 2. Build
npm run build

# 3. Test
npm start
# Visit: http://localhost:8080/devices/leica-m-film/

# 4. Commit
git add data/categories/film-cameras.json
git commit -m "Add: Film Cameras category"
```

### Adding Multiple Devices to an Existing Category

No rebuild needed beyond the initial `npm run build`:

**File: `data/categories/drones.json`** (add to existing)
```json
[
  { /* existing DJI Air 3S */ },
  {
    "id": "dji-mini-4-pro",
    "name": "DJI Mini 4 Pro",
    "category": "Drones",
    // ... rest of fields
  }
]
```

Run `npm run build` and both devices will be in `dist/devices/`.

---

## Developer Workflow

### Local Development

```bash
# Install dependencies
npm install

# Build site (generates dist/)
npm run build

# View locally
npm start

# Or manually
npx http-server dist
```

Visit `http://localhost:8080`

### Making Changes

1. **Change device specs?**
   - Edit `data/devices.json`
   - Run `npm run build`

2. **Change page layout?**
   - Edit `src/templates/device.html`
   - Run `npm run build`

3. **Change styles?**
   - Edit `src/css/modern.css` or `tailwind.config.js`
   - Run `npm run build`

4. **Add new device?**
   - Add entry to `data/devices.json`
   - Run `npm run build`

5. **Test before deploying?**
   - `npm run build`
   - `npm start`
   - Check `http://localhost:8080/devices/[slug]/`

### Common Build Issues

| Issue | Solution |
|-------|----------|
| Device page not generating | Check `slug` field in JSON (must be unique) |
| Missing image | Check `imageUrl` path in device entry |
| FAQ not showing | Check JSON syntax in `faq` array |
| Search not working | Ensure `/data/devices.json` is in `dist/` after build |
| Styling broken | Run `npm run build` again to rebuild CSS |

---

## Production Checklist

Before deploying to production:

- [ ] Run `npm run build` without errors
- [ ] Verify all 98+ device pages exist in `dist/devices/`
- [ ] Check 10+ category pages in `dist/categories/`
- [ ] Verify `dist/sitemap.xml` exists and has all URLs
- [ ] Test on mobile device
- [ ] Check images load correctly
- [ ] Verify affiliate links have correct tag
- [ ] Test search functionality
- [ ] Check meta tags with site preview tools
- [ ] Validate schema.org markup
- [ ] Run Lighthouse audit (target 90+)

---

## Summary

**To modify the site:**

1. Edit `data/devices.json` (change device info)
2. Edit `src/templates/*.html` (change page layout)
3. Run `npm run build` (regenerate all pages)
4. Deploy `dist/` folder

**That's it.** No database, no server, no runtime complexity.

**For localization:**

1. Create `data/devices-[lang].json` (translated data)
2. Create `src/templates/*-[lang].html` (translated templates)
3. Create `scripts/generator/build-[lang].js` (language-specific build)
4. Run `npm run build:[lang]`
5. Deploy `dist-[lang]/` to language-specific URL

---

**Questions?** Check individual generator files in `scripts/generator/` for detailed comments.
