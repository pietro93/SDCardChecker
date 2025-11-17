# Image Strategy - Master Document

**Last Updated:** November 17, 2025 (Updated with new device images)  
**Status:** Expanded coverage with brand-specific real images + fallbacks  
**Coverage:** 163 devices + 50+ SD cards with intelligent image fallback system

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
"dash cam"        → /img/devices/action-cameras/dash-cam-placeholder.webp
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
│   ├── dash-cam-placeholder.webp ✓ (NEW - covers Garmin, VIOFO, Nextbase)
│   └── gopro-placeholder.webp (used for GoPro Max, Hero 11, etc.)
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
- Dash Cam Placeholder ✨ NEW (covers Garmin, VIOFO, Nextbase)
- Reolink E1 Pro ✨ NEW
- Wyze Cam V3, Eufy Solocam S340

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
- VIOFO, Nextbase, DJI Osmo Action → category placeholder

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

4. ✅ **Dash Cams** (4 devices)
   - Garmin 66S, VIOFO A229 Duo, Nextbase 622GW now use `dash-cam-placeholder.webp`
   - Moved from security-camera category (more appropriate)

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

## Implementation for New Images

### Step 1: Create image
- Size: 300×300px (square) or 500×500px (preferred)
- Format: WebP (.webp)
- File size: <100KB
- Example: `dji-air-generic.webp`

### Step 2: Add to correct folder
```
img/devices/drones/dji-air-generic.webp
```

### Step 3: Update helpers.js

Add mapping in `getDeviceImageFallback()`:

```javascript
// Around line 135-138, add:
"dji-air-3s": "/img/devices/drones/dji-air-generic.webp",
"dji-air-3": "/img/devices/drones/dji-air-generic.webp",

// Or add brand detection (runs automatically):
if (name.includes("dji air")) return "/img/devices/drones/dji-air-generic.webp";
```

### Step 4: Done
No changes needed to devices.json or other files. The fallback system picks it up automatically.

---

## File Specifications

### Device Images
- **Dimensions:** 300×300px minimum, 500×500px preferred
- **Format:** WebP (.webp)
- **File size:** <100KB
- **Content:** Product photo on white/neutral background
- **Location:** `/img/devices/{category}/{filename}.webp`

### Category Folders
- `action-cameras/` - GoPro, Insta360, action cameras
- `cameras/` - DSLR, mirrorless, compact cameras
- `drones/` - DJI, other drones
- `gaming-consoles/` - Nintendo, Steam Deck, handhelds
- `computing/` - Raspberry Pi, tablets, Chromebooks
- `security-cameras/` - Wyze, Eufy, Reolink

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

---

## Summary

✅ **Extended coverage:** 42 real device images (26%) + smart fallbacks for 121 devices (74%)
✅ **Brand-specific detection:** 20+ brands now have dedicated images or smart brand detection
✅ **Category-based fallbacks:** Camera → sony-placeholder, Drone → drone-placeholder, etc.
✅ **New image mappings in helpers.js:** Lenovo, Anbernic, Retroid, Miyoo, Leica, Lumix, Reolink, DJI Air 3, Dash Cams

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
