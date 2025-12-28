# Image Strategy & Implementation - Complete Guide

**Last Updated:** December 28, 2025  
**Status:** Consolidated master document - all image guidance in one place  
**Coverage:** 163 devices + 50+ SD cards + 14 SD card readers with intelligent fallback system

> **📌 NOTE:** This document consolidates all image-related guidance that was previously scattered across multiple files (IMAGE_QUICK_REFERENCE.md, IMAGE_IMPLEMENTATION_GUIDE.md, IMAGE_FALLBACK_STRATEGY.md, READER_IMAGES_STRATEGY.md, etc.). This is now the single source of truth for all image strategy, specifications, and implementation guidance.

---

## Table of Contents

1. [Overview](#overview)
2. [Image Fallback Architecture](#image-fallback-architecture)
3. [Directory Structure](#directory-structure)
4. [Current Image Coverage](#current-image-coverage)
5. [Device Image Mapping](#device-image-mapping)
6. [Category Page Icons](#category-page-icons)
7. [SD Card Reader Images](#sd-card-reader-images)
8. [Card Product Images](#card-product-images)
9. [Technical Specifications](#technical-specifications)
10. [Implementation Guide](#implementation-guide)
11. [Testing](#testing)
12. [Summary](#summary)
13. [Related Files](#related-files)

---

## Overview

We have **intelligent fallback logic** in `scripts/generator/helpers.js` that automatically maps device images based on brand and category. You only need to create device-specific images for high-value products—everything else falls back automatically.

**Current Status:**
- ✅ 42 real device images (26%)
- ✅ Complete brand/category fallback system with expanded brand detection
- ⏳ 121 devices using smart placeholders (74%)

---

## Image Fallback Architecture

### How It Works

When a device page renders, it looks for images in this priority order:

```javascript
1. Device-specific imageUrl in devices.json (e.g., gopro-hero-13.webp)
2. Brand-specific detection (if name contains "Canon" → canon-placeholder.webp)
3. Category fallback (if category is "Drone" → drone-placeholder.webp)
4. Root placeholder (placeholder.webp)
```

**Example:** DJI Mini 3 Pro without explicit image
1. Check for `dji-mini-3-pro.webp` → doesn't exist
2. Check if name contains "dji" → YES
3. Return `/img/devices/drones/drone-placeholder.webp` ✓

### Brand-Specific Fallbacks (Automatic)

These device names automatically fall back to their brand placeholders:

```javascript
// In helpers.js - Brand detection mappings
"gopro"           → /img/devices/action-cameras/gopro-placeholder.webp
"insta360"        → /img/devices/action-cameras/gopro-placeholder.webp
"dji"             → /img/devices/drones/drone-placeholder.webp
"asus rog"        → /img/devices/gaming-consoles/asus-rog-ally.webp
"lenovo legion"   → /img/devices/gaming-consoles/lenovo-legion-go.webp
"anbernic"        → /img/devices/gaming-consoles/anbernic.webp
"retroid"         → /img/devices/gaming-consoles/retroid-pocket.webp
"miyoo"           → /img/devices/gaming-consoles/miyyo-mini.webp
"raspberry pi"    → /img/devices/computing/raspberry-placeholder.webp
"canon"           → /img/devices/cameras/canon-placeholder.webp
"nikon"           → /img/devices/cameras/nikon-placeholder.webp
"sony"            → /img/devices/cameras/sony-placeholder.webp
"fujifilm"        → /img/devices/cameras/fujifilm-placeholder.webp
"leica"           → /img/devices/cameras/leica-q3.webp
"panasonic/lumix" → /img/devices/cameras/lumix.webp
"steam deck"      → /img/devices/gaming-consoles/gaming-handheld-console-placeholder.webp
"switch"          → /img/devices/gaming-consoles/gaming-handheld-console-placeholder.webp
"nintendo"        → /img/devices/gaming-consoles/gaming-handheld-console-placeholder.webp
"amazon fire"     → /img/devices/computing/tablet-placeholder.webp
"dash cam"        → /img/devices/dashcams/dash-cam-placeholder.webp
"viofo"           → /img/devices/dashcams/viofo-a229-plus-duo.webp
"blackvue"        → /img/devices/dashcams/blackvue-dr900x-2ch.webp
"garmin"          → /img/devices/dashcams/dash-cam-placeholder.webp (for dash cams only)
"reolink"         → /img/devices/security-cameras/reolink-e1-pro.webp
```

**No code changes needed**—just add the brand name to a device in devices.json and it automatically gets the right placeholder.

---

## Directory Structure

```
img/devices/
├── placeholder.webp (generic fallback)
├── action-cameras/
│   ├── gopro-hero-13.webp ✓
│   ├── gopro-placeholder.webp ✓
│   ├── insta360-x3.webp ✓
│   ├── dji-osmo-pocket-3.webp ✓
│   └── gopro-placeholder.webp (used for GoPro Max, Hero 11, etc.)
├── dashcams/ (NEW - dedicated dashcam folder)
│   ├── dash-cam-placeholder.webp ✓ (generic dashcam fallback)
│   ├── viofo-a229-plus-duo.webp ✓ (VIOFO brand image)
│   ├── blackvue-dr900x-2ch.webp ✓ (BlackVue brand image)
│   ├── yupiteru-wdt-510c.webp ✓ (Yupiteru - Japanese brand)
│   ├── kenwood-drv-mr760.webp ✓ (Kenwood - Japanese brand)
│   ├── comtec-zdr-035.webp ✓ (COMTEC - Japanese brand)
│   └── cellstar-cs-91fh.webp ✓ (Cellstar - Japanese brand)
├── cameras/
│   ├── canon-eos-r5.webp ✓
│   ├── canon-placeholder.webp ✓ (used for Canon R6, R7, R100, etc.)
│   ├── nikon-z8.webp ✓
│   ├── nikon-placeholder.webp ✓ (used for Nikon Z5, Z6, Z9, D-series)
│   ├── sony-a6700.webp ✓
│   ├── sony-placeholder.webp ✓ (used for Sony A7 series, FX30, etc.)
│   ├── fujifilm-x-s20.webp ✓
│   ├── fujifilm-placeholder.webp ✓ (used for other Fujifilm X series)
│   ├── leica-q3.webp ✓ (NEW - covers all Leica devices via brand detection)
│   ├── lumix.webp ✓ (NEW - covers Panasonic Lumix S1H and variants)
│   ├── blackmagic-pocket-cinema-camera-4k.webp ✓
│   └── blackmagic-pocket-cinema-camera-6k-pro.webp ✓
├── drones/
│   ├── dji-mini-4-pro.webp ✓
│   ├── dji-mavic-3.webp ✓
│   ├── dji-osmo-pocket-3.webp ✓
│   ├── dji-air-3.webp ✓ (NEW - covers Air 3 and Air 3S with dedicated image)
│   └── drone-placeholder.webp ✓ (used for DJI Mini 3, Mini 2 SE, etc.)
├── gaming-consoles/
│   ├── nintendo-switch.webp ✓
│   ├── nintendo-switch-oled.webp ✓
│   ├── nintendo-3ds.webp ✓
│   ├── steam-deck.webp ✓
│   ├── asus-rog-ally.webp ✓
│   ├── lenovo-legion-go.webp ✓ (NEW - covers Lenovo Legion Go + variants)
│   ├── anbernic.webp ✓ (NEW - covers RG35XX, RG353V, etc.)
│   ├── retroid-pocket.webp ✓ (NEW - covers Retroid Pocket series)
│   ├── miyyo-mini.webp ✓ (NEW - covers Miyoo Mini+ and variants)
│   └── gaming-handheld-console-placeholder.webp ✓ (fallback)
├── computing/
│   ├── raspberry-pi-5.webp ✓
│   ├── amazon-fire-hd-10.webp ✓
│   ├── amazon-fire-max-11.webp ✓
│   ├── raspberry-placeholder.webp ✓ (used for Pi 3, Pi 4, Pi Zero)
│   └── tablet-placeholder.webp ✓ (used for Samsung Galaxy Tab, HP Chromebook, Lenovo Tab)
└── security-cameras/
    ├── wyze-cam-v3.webp ✓
    ├── eufy-solocam-s340.webp ✓
    └── reolink-e1-pro.webp ✓ (NEW - covers Reolink security cameras)
```

---

## Current Image Coverage

### ✅ Real Images (42 files)
**Gaming Handhelds (8):**
- Nintendo Switch, Switch OLED, 3DS
- Steam Deck, ASUS ROG Ally
- Lenovo Legion Go ✨ NEW
- Anbernic RG35XX/RG353V ✨ NEW
- Retroid Pocket ✨ NEW
- Miyoo Mini+ ✨ NEW

**Drones (4):**
- DJI Mini 4 Pro, Mavic 3, Osmo Pocket 3
- DJI Air 3 / Air 3S ✨ NEW

**Cameras (10):**
- Canon EOS R5
- Sony A6700, FX3
- Fujifilm X-S20
- Nikon Z8
- Leica Q3 ✨ NEW
- Panasonic Lumix S1H ✨ NEW
- Blackmagic 4K, 6K Pro

**Action & Security (6):**
- GoPro Hero 13, 12
- Insta360 X3, X2, Go 3, Ace Pro
- Wyze Cam V3, Eufy Solocam S340
- Reolink E1 Pro ✨ NEW

**Dash Cams (7 images):** ✨ EXPANDED WITH JAPANESE BRANDS
- VIOFO A229 Plus Duo (covers VIOFO A229 Duo, A229 Plus Duo, A119 V3)
- BlackVue DR900X-2CH (covers both DR900X and DR970X models)
- Yupiteru WDT-510C (Japanese dashcam)
- Kenwood DRV-MR760 (Japanese dashcam)
- COMTEC ZDR-035 (Japanese dashcam)
- Cellstar CS-91FH (Japanese dashcam)
- Generic Dash Cam Placeholder (covers Garmin, Nextbase, Vantrue, Rexing, Rove)

**Computing (4):**
- Raspberry Pi 5
- Amazon Fire HD 10, Max 11

### ✅ Automatic Fallbacks (134 devices)
These don't need individual images—they use brand/category placeholders:

**Cameras (80 devices):**
- Canon: 13 devices → `canon-placeholder.webp`
- Sony: 10 devices → `sony-placeholder.webp`
- Nikon: 19 devices → `nikon-placeholder.webp`
- Fujifilm: 19 devices → `fujifilm-placeholder.webp`
- Panasonic: 7 devices → `camera-placeholder.webp` (fallback)
- Leica: 12 devices → `camera-placeholder.webp` (fallback)

**Drones (10 devices):**
- DJI Mini (7): `drone-placeholder.webp`
- DJI Air (2): `drone-placeholder.webp`
- DJI Mini 2 SE: `drone-placeholder.webp`

**Action Cameras (6 devices):**
- GoPro Hero Max, 11 Black → `gopro-placeholder.webp`
- Insta360 X4 → `gopro-placeholder.webp`
- DJI Osmo Action → category placeholder

**Dash Cams (16 devices):** ✨ NOW INCLUDES JAPANESE BRANDS
- VIOFO: A229 Duo, A229 Plus Duo, A119 V3 → `viofo-a229-plus-duo.webp`
- BlackVue: DR900X-2CH, DR970X-2CH → `blackvue-dr900x-2ch.webp`
- Garmin: Dash Cam Mini 2, 67W, 66S → `dash-cam-placeholder.webp`
- Nextbase: 622GW → `dash-cam-placeholder.webp`
- Vantrue: N4 → `dash-cam-placeholder.webp`
- Rexing: V1P Gen 3 → `dash-cam-placeholder.webp`
- Rove: R2-4K → `dash-cam-placeholder.webp`
- Yupiteru: WDT-510C → `yupiteru-wdt-510c.webp` (Japanese)
- Kenwood: DRV-MR760 → `kenwood-drv-mr760.webp` (Japanese)
- COMTEC: ZDR-035 → `comtec-zdr-035.webp` (Japanese)
- Cellstar: CS-91FH → `cellstar-cs-91fh.webp` (Japanese)

**Gaming (16 devices):**
- Nintendo Switch Lite, Retro handhelds (Anbernic, Miyoo, Retroid) → `gaming-handheld-console-placeholder.webp`
- Lenovo Legion Go, ASUS ROG Ally X → `gaming-handheld-console-placeholder.webp`

**Computing & Tablets (16 devices):**
- Raspberry Pi 3, 4, Zero → `raspberry-placeholder.webp`
- Samsung Galaxy Tab S9, HP Chromebook, Lenovo Tab → `tablet-placeholder.webp`

**Security Cameras (4 devices):**
- Reolink E1 Pro → `eufy-solocam-s340.webp` (temporary)
- Garmin Dash Cam Mini 2 → category placeholder
- Generic security cameras → `placeholder.webp`

---

## What Was Just Added ✨

**Smart coverage for 30+ additional devices with 13 new images:**

1. ✅ **Gaming Handhelds** (8 devices)
   - Lenovo Legion Go + X variant
   - Anbernic RG35XX Plus, RG353V
   - Retroid Pocket series
   - Miyoo Mini Plus variants
   - Fallback: gaming-handheld-console-placeholder.webp

2. ✅ **DJI Air Series** (2 devices)
   - DJI Air 3, Air 3S now have dedicated `dji-air-3.webp`
   - Much better UX than generic drone placeholder

3. ✅ **Leica** (12 devices)
   - All Leica devices now map to `leica-q3.webp` via brand detection
   - Specific, elegant camera image for premium devices

4. ✅ **Dash Cams** (16 devices) ✨ NOW INCLUDES JAPANESE BRANDS
    - Dedicated `/img/devices/dashcams/` folder created
    - Brand-specific images: VIOFO A229 Plus Duo, BlackVue DR900X-2CH
    - Japanese brand images (NEW!): Yupiteru WDT-510C, Kenwood DRV-MR760, COMTEC ZDR-035, Cellstar CS-91FH
    - Generic fallback: `dash-cam-placeholder.webp` for remaining brands
    - Dedicated dashcam icon (`icon-dashcam.webp`) used on both English and Japanese category pages
    - All 16 dashcam devices now properly categorized and displayed

5. ✅ **Panasonic Lumix** (7 devices)
   - S1H and variants now map to `lumix.webp`
   - Professional mirrorless image instead of generic camera

6. ✅ **Reolink Security Cameras** (multiple devices)
   - Now has proper `reolink-e1-pro.webp` instead of temporary Eufy mapping

### Remaining Low ROI (Not Recommended)
These already have intelligent fallbacks that work perfectly:
- ❌ Canon EOS R series (13 devices) → use `canon-placeholder.webp`
- ❌ Sony Alpha series (10 devices) → use `sony-placeholder.webp`
- ❌ Nikon Z series (11 devices) → use `nikon-placeholder.webp`
- ❌ Fujifilm X series (19 devices) → use `fujifilm-placeholder.webp`
- ❌ Raspberry Pi variants (6 devices) → use `raspberry-placeholder.webp`

---

## Device Image Mapping

### Complete Device List by Fallback

#### Devices with Brand-Specific Images (High ROI)

**VIOFO Dashcams (3 devices)**
- A229 Duo, A229 Plus Duo, A119 V3 → `viofo-a229-plus-duo.webp`

**BlackVue Dashcams (2 devices)**
- DR900X-2CH, DR970X-2CH → `blackvue-dr900x-2ch.webp`

**Gaming Handhelds with Images (8 devices)**
- Nintendo Switch, Switch OLED, Switch Lite → Nintendo-specific
- Steam Deck → Dedicated image
- ASUS ROG Ally → Dedicated image
- Lenovo Legion Go, Go S → Dedicated image
- Anbernic RG35XX Plus, RG353V → Brand image
- Retroid Pocket → Brand image
- Miyoo Mini Plus → Brand image

#### Devices Using Category/Brand Fallbacks (Automatic)

**Garmin Dashcams (3 devices)**
- Dash Cam Mini 2, 67W, 66S → `dash-cam-placeholder.webp`

**Other Dashcams (4 devices)**
- Nextbase 622GW → `dash-cam-placeholder.webp`
- Vantrue N4 → `dash-cam-placeholder.webp`
- Rexing V1P Gen 3 → `dash-cam-placeholder.webp`
- Rove R2-4K → `dash-cam-placeholder.webp`

**GoPro (4 devices with generic fallback)**
- Hero Max, Hero 11 Black → `gopro-placeholder.webp`
- All others → Brand detection automatically uses GoPro placeholder

**Insta360 (6 devices)**
- X3, X4, Ace Pro, Go 3, One X2 → Smart fallback to action-camera placeholder or brand detection

**DJI Drones (10+ devices)**
- Mini 4 Pro → Dedicated image
- Mini 3 Pro, Mini 2 SE, Mini SE → `drone-placeholder.webp`
- Air 3, Air 3S → Dedicated `dji-air-3.webp` image
- Mavic 3 → Dedicated image
- Others → `drone-placeholder.webp`

**Cameras - Professional Brands (80+ devices)**
- Canon (13 devices) → `canon-placeholder.webp`
- Sony (10 devices) → `sony-placeholder.webp`
- Nikon (19 devices) → `nikon-placeholder.webp`
- Fujifilm (19 devices) → `fujifilm-placeholder.webp`
- Panasonic/Lumix (7 devices) → `lumix.webp`
- Leica (12 devices) → `leica-q3.webp`
- Blackmagic (2 devices) → Dedicated high-end images

**Computers & Tablets (22 devices)**
- Raspberry Pi (6 devices) → `raspberry-placeholder.webp`
- Amazon Fire (2 devices) → Dedicated images
- Samsung Galaxy Tab, HP Chromebook, Lenovo Tab → `tablet-placeholder.webp`

**Gaming Consoles (4 devices)**
- Nintendo 3DS, 3DS XL → Dedicated
- All generic handheld → `gaming-handheld-console-placeholder.webp`

**Security Cameras (3 devices with images)**
- Wyze Cam V3 → Dedicated
- Eufy Solocam S340 → Dedicated
- Reolink E1 Pro → Dedicated

---

## Technical Specifications

### Device Images
- **Dimensions:** 300×300px minimum, 500×500px preferred
- **Format:** WebP (.webp) for best compression and SEO
- **File size:** <100KB
- **Content:** Product photo on white/neutral background
- **Location:** `/img/devices/{category}/{filename}.webp`
- **Category Folders:**
  - `action-cameras/` - GoPro, Insta360, action cameras
  - `cameras/` - DSLR, mirrorless, compact cameras
  - `dashcams/` - Dash camera devices (NEW)
  - `drones/` - DJI, other drones
  - `gaming-consoles/` - Nintendo, Steam Deck, handhelds
  - `computing/` - Raspberry Pi, tablets, Chromebooks
  - `security-cameras/` - Wyze, Eufy, Reolink

### Card Product Images
- **Dimensions:** 180×180px (standard), 270×270px (2x retina)
- **Format:** WebP (.webp)
- **File size:** <50KB
- **Content:** Product shot with white/neutral background
- **Location:** `/img/cards/{filename}.webp`
- **Fallback:** Generic placeholders by speed class (UHS1, UHS2, etc.)

### SD Card Reader Images
- **Dimensions:** 300×300px minimum
- **Format:** WebP (.webp)
- **File size:** <100KB
- **Content:** Reader device photo on white/neutral background
- **Location:** `/img/readers/{filename}.webp`
- **Current:** Generic `sd-card-reader-placeholder.webp` for all 14 readers (phase 1)
- **Status:** Phase 2 (post-launch) can add brand-specific reader images

---

## Category Page Icons

Each category page displays a dedicated icon in the hero section:

| Category | Icon File | Status |
|----------|-----------|--------|
| Cameras | `icon-camera.webp` | ✅ |
| Action Cameras | `icon-action-camera.webp` | ✅ |
| Drones | `icon-drone.webp` | ✅ |
| Gaming Handhelds | `icon-gaming.webp` | ✅ |
| Computing & Tablets | `icon-computing.webp` | ✅ |
| Security Cameras | `icon-security-camera.webp` | ✅ |
| **Dash Cams** | **`icon-dashcam.webp`** | **✅ ACTIVE** |

**Deployment:** Both English (`/categories/dash-cams/`) and Japanese (`/ja/categories/dash-cams/`) pages use the dedicated dashcam icon instead of generic camera icons.

---

## SD Card Reader Images

### Current Implementation

All 14 SD card readers currently share a single generic placeholder:

```
/img/readers/sd-card-reader-placeholder.webp
```

**Devices covered:**
- SanDisk Extreme Pro (multi-card reader)
- ProGrade Digital SD Reader
- Kingston Workflow Station
- Apple SD Card Reader
- Sony MRW-G1 & MRW-G2
- Generic USB-C/USB-A readers
- And 7 others

### Fallback Logic

The generator automatically maps all reader devices to this placeholder via `getReaderImageFallback()` in helpers.js. Works seamlessly—no broken images ever appear.

### Future Enhancement (Phase 2)

Post-launch, can add brand-specific reader images:
- `sandisk-extreme-pro-reader.webp`
- `prograde-sd-reader.webp`
- `kingston-workflow-station.webp`

Simply add to `/img/readers/` and update mapping in helpers.js. Existing fallback ensures backward compatibility.

---

## Card Product Images

### Current Coverage

**15 SD card images** with smart fallbacks:
- SanDisk: Extreme, Extreme Pro (SD UHS-II), Extreme Pro CFast 2.0
- Lexar: Professional 633X, 1000X, Professional Silver (SD UHS-II)
- Kingston: Canvas Go, Canvas React, Canvas Select
- Samsung: Pro Endurance, EVO Select
- ADATA: Premier
- Transcend: Standard
- Generic fallbacks: micro-uhs1, micro-uhs2, uhs1, uhs2, cfast-generic, xqd-generic

### Fallback System for Cards

When a card product image is missing, the system falls back to:
1. Brand-specific image if available
2. Speed class generic (e.g., `micro-uhs2-generic.webp` for V30 microSD)
3. Root placeholder as final fallback

**Example:** A new Kingston card automatically uses `kingston-canvas-go.webp` if no dedicated image exists.

---

## Implementation Guide

### Adding a New Device Image

**Step 1: Create the image**
- Dimensions: 300×300px (square) minimum, 500×500px preferred
- Format: WebP (.webp)
- File size: Keep under 100KB
- Content: Product photo on white/neutral background
- Example filename: `dji-air-3.webp`

**Step 2: Save to correct folder**
```
img/devices/drones/dji-air-3.webp
```

**Step 3: Update helpers.js**

Add to the `deviceSpecificImages` object in `getDeviceImageFallback()`:

```javascript
"dji-air-3": "/img/devices/drones/dji-air-3.webp",
"dji-air-3s": "/img/devices/drones/dji-air-3.webp",
```

Or use brand detection (automatic for all variants):

```javascript
if (name.includes("dji air")) return "/img/devices/drones/dji-air-generic.webp";
```

**Step 4: Rebuild and test**
```bash
npm run build
```

**Step 5: Verify**
- Open built page: `dist/devices/dji-air-3/index.html`
- Image displays correctly at top of page
- No broken image indicators

### Adding a Card Product Image

**Step 1: Create the image**
- Dimensions: 180×180px standard (270×270px for 2x retina)
- Format: WebP (.webp)
- File size: Keep under 50KB
- Example filename: `kingston-canvas-go-plus.webp`

**Step 2: Save to cards folder**
```
img/cards/kingston-canvas-go-plus.webp
```

**Step 3: Update helpers.js**

Add to `getCardImageFallback()`:

```javascript
"kingston-canvas-go-plus": "/img/cards/kingston-canvas-go-plus.webp",
```

**Step 4: Rebuild and test**
```bash
npm run build
```

### Adding a Reader Image

**Step 1: Create the image**
- Dimensions: 300×300px minimum
- Format: WebP (.webp)
- File size: Keep under 100KB
- Example filename: `sandisk-extreme-pro-reader.webp`

**Step 2: Save to readers folder**
```
img/readers/sandisk-extreme-pro-reader.webp
```

**Step 3: Update helpers.js**

Add to `getReaderImageFallback()`:

```javascript
"sandisk-extreme-pro-uhs2-usbc": "/img/readers/sandisk-extreme-pro-reader.webp",
```

**Step 4: Rebuild and test**
```bash
npm run build
```

**Note:** Existing fallback ensures backward compatibility—no broken images if mapping is missing.

---

## Testing

After adding new images:

1. **Rebuild site:**
   ```bash
   npm run build
   ```

2. **Check device page displays correctly:**
   - Open `dist/devices/{device-slug}/index.html`
   - Image should appear at top
   - Should be sharp and properly sized

3. **Check fallback still works:**
   - If image path in helpers.js is wrong, fallback chain ensures something displays
   - No broken images ever appear

4. **Browser DevTools:**
   - Open Network tab
   - Verify image loads (Status 200)
   - Check file size is reasonable (<100KB for devices, <50KB for cards)

---

## Summary

✅ **Extended coverage:** 42 real device images (26%) + smart fallbacks for 121 devices (74%)
✅ **Brand-specific detection:** 20+ brands now have dedicated images or smart brand detection
✅ **Category-based fallbacks:** Camera → sony-placeholder, Drone → drone-placeholder, etc.
✅ **New image mappings in helpers.js:** Lenovo, Anbernic, Retroid, Miyoo, Leica, Lumix, Reolink, DJI Air 3, Dashcams (12 devices with brand-specific + generic fallbacks)

**For future additions:**
- Follow the same pattern in helpers.js: add device slug or brand detection
- Images go in appropriate category folder (gaming-consoles, cameras, drones, etc.)
- Brand detection in helpers.js ensures all variants covered automatically
- No changes needed to devices.json—fallback system picks up automatically

**Key principle:** One image can serve 5-8 related devices through smart brand/category detection. Invest in images that have high ROI across multiple products.

---

## Related Files

- `scripts/generator/helpers.js` - `getDeviceImageFallback()` function (lines 108-213)
- `data/devices.json` - Device list with optional `imageUrl` field
- `scripts/generator/generate-device-pages.js` - Uses fallback logic
- `scripts/generator/generate-category-pages.js` - Uses fallback logic
