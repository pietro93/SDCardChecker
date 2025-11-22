# SD Card Checker - Complete Architecture & Implementation Guide

**Version:** 1.0  
**Last Updated:** Nov 22, 2025  
**Purpose:** Comprehensive technical documentation for developers, localization teams, and maintainers

---

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Data Structure](#data-structure)
4. [Build Pipeline](#build-pipeline)
5. [Template System](#template-system)
6. [File Reference](#file-reference)
7. [Adding/Modifying Content](#adding-modifying-content)
8. [Localization Guide](#localization-guide)

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
┌─────────────────────────────────────────────────────────────┐
│                  npm run build                               │
│                 (Build Process)                              │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
   ┌─────────────┐          ┌──────────────┐
   │ Load Data   │          │ Load Template│
   │             │          │              │
   │devices.json │          │device.html   │
   └──────┬──────┘          └────────┬─────┘
          │                          │
          │  ┌──────────────────────┘
          │  │
          ▼  ▼
    ┌─────────────────┐
    │  For Each Device│
    │                 │
    │ 1. Read device  │
    │ 2. Build vars   │
    │ 3. Replace {{}} │
    │ 4. Write HTML   │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────────┐
    │   dist/devices/     │
    │   [slug]/index.html │
    └─────────────────────┘
```

### Component Breakdown

#### 1. **Data Layer** (Single Source of Truth)

File: `data/devices.json`

Contains all device information. Changes here automatically propagate to all generated pages.

```json
{
  "devices": [
    {
      "id": "gopro-hero-13",                    // Unique identifier
      "name": "GoPro Hero 13 Black",            // Display name
      "category": "Action Cameras",             // Category (groups related devices)
      "slug": "gopro-hero-13",                  // URL slug
      "searchTerms": [                          // SEO keywords
        "gopro hero 13",
        "gopro 13 memory card"
      ],
      "sdCard": {                               // SD card specs
        "type": "microSD UHS-I",
        "minSpeed": "V30",
        "minWriteSpeed": "30 MB/s",
        "recommendedCapacity": ["128GB", "256GB"],
        "maxCapacity": "512GB"
      },
      "whySpecs": "Explains why these specs matter for this device",
      "recommendedBrands": [                    // Links to brands (ref by ID)
        { "id": "sandisk-extreme-microsd" }
      ],
      "faq": [                                  // Device-specific FAQs
        {
          "q": "Can I use regular SD card?",
          "a": "No, only microSD..."
        }
      ],
      "relatedDevices": [                       // Links to similar devices
        "gopro-hero-12"
      ],
      "notes": "Internal notes"
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
