# Image Implementation Guide - Complete Requirements

**Last Updated:** November 11, 2025  
**Status:** Comprehensive image strategy across all pages  
**Total Images Needed:** 150+ images across 7 categories

---

## 1. IMAGE REQUIREMENTS & SEO STANDARDS

### Format & Technical Specs
- **Format:** WebP (preferred for SEO + performance) or JPEG (fallback)
- **Storage Location:** 
  - Device images: `/img/devices/`
  - Card images: `/img/cards/`
  - Category/Hero: `/img/hero/`
  - Logos/Branding: `/img/branding/`
  - Icons: `/img/icons/`
- **Compression:** WebP ~25% smaller than JPEG without quality loss
- **Lazy Loading:** All images use `loading="lazy"` for performance
- **Alt Text:** All images have descriptive alt text for accessibility and SEO

### SEO Optimization Requirements
1. **Filename:** Full, descriptive names (e.g., `canon-eos-r5.webp` not `cam-1.webp`)
2. **Alt Text:** Include context for each image type (device names, categories, etc.)
3. **Image Size:** Optimized dimensions per category (see specs below)
4. **Structured Data:** Images included in Schema.org markup (Article, Product schemas)
5. **Open Graph Tags:** Hero images for social sharing on all pages
6. **Twitter Cards:** Images for card sharing previews
7. **Google Images:** Proper alt text and structured data enable Google Images discovery

---

## 2. COMPLETE IMAGE INVENTORY

### 🔴 CRITICAL PRIORITY - Branding & Navigation

#### A. Logo Image
**Count:** 1 file
- ✅ **Logo.webp** - Main site logo, square (200×200px)
  - Used in header on ALL pages
  - Used in footer
  - Used in social share previews
  - Used as favicon
  - Alt: "SD Card Checker"

**Specs:**
- Size: 200×200px
- Format: PNG (crisp) or WebP
- Background: Transparent
- Handle light/dark via CSS (filter/opacity) if needed
- Status: Created

---

### 🔴 CRITICAL PRIORITY - Hero Images for All Pages

#### B. Homepage Hero (1 image)
- **home-hero.webp** - Homepage banner (1200×630px)
  - Above-the-fold content
  - Eye-catching design that communicates "check SD card compatibility"
  - Alt: "SD Card Checker - Find compatible SD cards for your device"
  - Used in og:image meta tag for social sharing
  - SEO optimized for social previews

#### C. Category Page Heroes (5 images)
Each major category needs a hero image:
1. **action-cameras-hero.webp** (1200×630px)
   - Alt: "Action Cameras - SD card compatibility guide"
   
2. **drones-hero.webp** (1200×630px)
   - Alt: "Drones - SD card requirements and recommendations"
   
3. **mirrorless-cameras-hero.webp** (1200×630px)
   - Alt: "Mirrorless Cameras - Professional SD card guide"
   
4. **gaming-hero.webp** (1200×630px)
   - Alt: "Gaming Handhelds & Consoles - SD card compatibility"
   
5. **computing-hero.webp** (1200×630px)
   - Alt: "Tablets & Computing - SD card specifications"

**Specs:**
- Size: 1200×630px (og:image standard)
- Format: WebP or JPEG
- File Size: ~80-120KB each
- Content: Category-relevant imagery with text overlay capability

#### D. Resource/Guide Page Heroes (4+ images)
1. **buying-guide-hero.webp** (1200×630px)
   - Alt: "SD Card Buying Guide - Performance tiers and specifications"
   
2. **faq-hero.webp** (1200×630px)
   - Alt: "SD Card FAQs - Common questions answered"
   
3. **comparison-hero.webp** (1200×630px)
   - Alt: "SD Card Types and Speed Classes - Comparison guide"
   
4. **setup-hero.webp** (1200×630px)
   - Alt: "Setting Up Your SD Card - Installation and formatting"

**Total Category/Resource Heroes:** 10 images

---

### 🟠 HIGH PRIORITY - Device Page Heroes

#### E. Individual Device Images (34 devices)
All device pages need hero images for SEO trust signals

**Current Status:** 6 real images, 28 using fallback placeholders

**Devices with Real Images (6/34):**
- ✅ gopro-hero-13.webp (1200×800px)
- ✅ nintendo-switch.webp (1200×800px)
- ✅ nintendo-switch-oled.webp (1200×800px)
- ✅ steam-deck.webp (1200×800px)
- ✅ dji-mavic-3.webp (1200×800px)
- ✅ dji-mini-4-pro.webp (1200×800px)

**Devices Needing Images (28/34):**
[Full device list as in original guide - cameras, drones, gaming, computing, security cameras]

**Specs:**
- Size: 1200×800px (landscape)
- Format: WebP or JPEG
- File Size: ~100KB each
- Content: Product photo on white/neutral background

---

### 🟡 MEDIUM PRIORITY - Icons & Visual Elements

#### F. Category Icons (5 icons)
Replace emoji with custom SVG icons
1. **action-camera-icon.svg** (128×128px)
2. **drone-icon.svg** (128×128px)
3. **mirrorless-camera-icon.svg** (128×128px)
4. **gaming-console-icon.svg** (128×128px)
5. **computing-device-icon.svg** (128×128px)

**Specs:**
- Format: SVG (scalable, no file size cost)
- Size: 128×128px design, scales infinitely
- Consistent visual style
- Can be inlined or external

#### G. Feature Icons (8-10 icons)
For feature boxes, badges, indicators:
- Speed class icons (UHS-I, UHS-II, UHS-III)
- Performance tier icons
- Compatibility checkmark
- Warning/alert icons
- Info icons

**Specs:**
- Format: SVG or 64×64px PNG
- Consistent design system

#### H. Trust/Security Badges (3-5 icons)
- Verified badge
- Safe/secure indicator
- Award/recommendation badge

**Specs:**
- Format: SVG or 128×128px PNG
- Professional appearance for credibility

---

### 🟡 MEDIUM PRIORITY - SD Card Product Images

#### I. Individual Card Images (50+ cards)
Product photos for recommended cards

**Current Status:** 2 real images, 50+ using generic fallbacks

**Specs:**
- Size: 96×96px (small) or 400×400px (high-DPI)
- Format: WebP or JPEG
- File Size: ~20KB each
- Content: Product photo of SD/microSD card

---

### 🟢 LOW PRIORITY - Additional Visual Assets

#### J. Illustrative Graphics (5-10 images)
For education/explanation sections:
- SD card types comparison chart
- Speed class visualization
- Compatibility matrix graphic
- Storage capacity visualization

**Specs:**
- Size: 800×600px (or custom per section)
- Format: WebP or JPEG
- Can be custom illustrations or infographics

---

## 3. DIRECTORY STRUCTURE

```
/img/
├── branding/
│   ├── logo.webp (200×200px) ✅
│   └── favicon.ico (32×32px) ✅
│
├──(root)
│   ├── home-hero.webp (1200×630px)
│   ├── action-cameras-hero.webp (1200×630px)
│   ├── drones-hero.webp (1200×630px)
│   ├── mirrorless-cameras-hero.webp (1200×630px)
│   ├── gaming-hero.webp (1200×630px)
│   ├── computing-hero.webp (1200×630px)
│   ├── buying-guide-hero.webp (1200×630px)
│   ├── faq-hero.webp (1200×630px)
│   ├── comparison-hero.webp (1200×630px)
│   └── setup-hero.webp (1200×630px)
│
├── devices/
│   ├── placeholder.webp (fallback)
│   ├── gopro-hero-13.webp ✅
│   ├── [27 more device images needed]
│   └── fallback-*.webp (brand/category specific)
│
├── cards/
│   ├── placeholder.webp (fallback)
│   ├── sandisk-extreme-microsd.webp ✅
│   ├── lexar-professional-633x.webp ✅
│   ├── uhs1-generic.webp
│   ├── uhs2-generic.webp
│   └── [50+ card images]
│
├── icons/
│   ├── category/
│   │   ├── action-camera-icon.svg
│   │   ├── drone-icon.svg
│   │   ├── mirrorless-camera-icon.svg
│   │   ├── gaming-console-icon.svg
│   │   └── computing-device-icon.svg
│   ├── features/
│   │   ├── uhs-i-icon.svg
│   │   ├── uhs-ii-icon.svg
│   │   ├── uhs-iii-icon.svg
│   │   ├── checkmark-icon.svg
│   │   └── warning-icon.svg
│   └── badges/
│       ├── verified-badge.svg
│       ├── safe-badge.svg
│       └── award-badge.svg
│
└── graphics/
    ├── card-types-comparison.webp
    ├── speed-class-guide.webp
    ├── compatibility-matrix.webp
    └── storage-visualization.webp
```

---

## 4. IMPLEMENTATION PHASES

### Phase 1: CRITICAL (Pre-Launch) - 17 images
**Timeline:** Immediate
**Why:** Required for full SEO optimization and professionalism

1. **Branding (3):**
   - Logo.webp, Logo-square.webp, Logo-light.webp

2. **Homepage Hero (1):**
   - home-hero.webp

3. **Category Heroes (5):**
   - action-cameras-hero.webp, drones-hero.webp, mirrorless-cameras-hero.webp, gaming-hero.webp, computing-hero.webp

4. **Resource Heroes (4):**
   - buying-guide-hero.webp, faq-hero.webp, comparison-hero.webp, setup-hero.webp

5. **Category Icons (5):**
   - SVG icons for 5 main categories

### Phase 2: HIGH (Launch/Post-Launch) - 28 device images
**Timeline:** Week 1-2 after launch
**Why:** Improves SEO trust signals, reduces placeholder fallbacks

- Remaining 28 device images
- Priority: Cameras (10), Drones (4), then other categories

### Phase 3: MEDIUM (Post-Launch Optimization) - 50+ card images
**Timeline:** 2-4 weeks after launch
**Why:** Enhances user experience, helps product research

- SD card product images
- Prioritize top 20 most recommended cards first

### Phase 4: LOW (Ongoing Enhancement) - 15+ additional images
**Timeline:** 1-2 months after launch
**Why:** Educational content, deeper engagement

- Feature icons (8-10)
- Trust badges (3-5)
- Illustrative graphics (5-10)

---

## 5. SEO CHECKLIST BY IMAGE TYPE

### Hero Images
- [ ] Filename descriptive (e.g., `action-cameras-hero.webp`)
- [ ] Size is 1920×600px
- [ ] Format is WebP or JPEG (~150KB)
- [ ] Alt text clearly describes page content
- [ ] Includes Open Graph meta tags (`og:image`)
- [ ] Uploaded to `/img/hero/` directory

### Device Images
- [ ] Filename matches device slug exactly
- [ ] Size is 1200×800px
- [ ] Format is WebP (~100KB) or JPEG
- [ ] Alt text: "{Device Name} SD card requirements"
- [ ] Used in Schema.org Product/Article markup
- [ ] Uploaded to `/img/devices/` directory

### Card Images
- [ ] Filename matches card slug
- [ ] Size is 96×96px or 400×400px
- [ ] Format is WebP (~20KB) or JPEG
- [ ] Alt text includes brand, speed, tier
- [ ] Uploaded to `/img/cards/` directory

### Logo Images
- [ ] Logo in 2 formats (horizontal, square)
- [ ] Clear on light and dark backgrounds
- [ ] Transparent background preferred
- [ ] Used in `<header>` and schema markup

### Icons
- [ ] Consistent visual style across set
- [ ] SVG format for scalability
- [ ] Clear at multiple sizes (16px, 32px, 64px, 128px)
- [ ] Proper alt text if used as standalone images

---

## 6. IMAGE SOURCES & LICENSING

### Logos & Branding
- **Design Tools:** Figma, Canva, Adobe Creative Suite
- **Professional:** Hire designer for custom branding
- **Free Resources:** Font Awesome (for design inspiration)

### Hero Images
- **Unsplash** - High-quality, free license, search for category topics
- **Pexels** - Free stock photos
- **Pixabay** - Free images with good search
- **Tailored Brands:** Use category-relevant stock imagery

### Device Images
- **Manufacturer Websites** - Official product photography
- **Amazon Product Images** - High quality with permission
- **B&H Photo** - Professional product shots
- **Best Buy** - Product images
- **Direct photography** - If in-house equipment available

### Card Images
- **Manufacturer Product Pages** - SanDisk, Kingston, Lexar official sites
- **Amazon** - Clear product photos
- **B&H Photo** - Professional angles

### Icons
- **Font Awesome** - Free SVG icons
- **Feather Icons** - Minimal SVG icon set
- **Custom SVG** - Design in Figma/Illustrator

### License Considerations
- Device manufacturer product photos typically free for use
- Stock photo licenses: Check usage rights (commercial allowed?)
- Add image credits in footer if required
- Consider Creative Commons licensing for your own images

---

## 7. TOTAL IMAGE COUNT SUMMARY

| Category | Count | Priority | Status |
|----------|-------|----------|--------|
| **Branding** | 1 | CRITICAL | 1/1 ✅ |
| **Hero Images** | 10 | CRITICAL | 0/10 |
| **Device Pages** | 34 | HIGH | 6/34 |
| **Icons** | 13 | MEDIUM | 0/13 |
| **SD Card Products** | 50+ | MEDIUM | 2/50 |
| **Graphics** | 5-10 | LOW | 0/5 |
| **TOTAL** | **112-117** | - | **8/117 (7%)** |

---

## 8. PERFORMANCE IMPACT

### Estimated File Sizes (WebP format)
- 10 hero images × 150KB = 1.5 MB (with lazy loading: ~150KB on page load)
- 34 device images × 100KB = 3.4 MB (loaded only when device page visited)
- 50+ card images × 20KB = 1 MB (lazy loaded in tables)
- 13 icons × 5KB = 65KB (lightweight, mostly SVG)
- **Total:** ~6 MB (but <500KB initial page load with lazy loading)

### Loading Strategy
1. **Critical (render-blocking):** Logo + hero image (on above-fold)
2. **High priority:** Device image (visible on page load)
3. **Lazy-load:** Card images, secondary graphics (loaded on demand)
4. **Deferred:** Lower priority decorative images

---

## 9. NEXT STEPS

1. **Week 1:**
   - [ ] Design/source logo (1 file)
   - [ ] Create hero images (10 files)
   - [ ] Design category icons (5 SVG files)

2. **Week 2:**
   - [ ] Gather remaining device images (28 files)
   - [ ] Update templates to use new hero images
   - [ ] Update metadata/OG tags for all pages

3. **Week 3+:**
   - [ ] Source SD card product images (prioritize top 20)
   - [ ] Create feature icons
   - [ ] Design educational graphics

---

**Status:** Comprehensive image strategy defined  
**Next Step:** Source branding and hero images for launch window
