# Image Structure Refactoring - Complete

## Folder Organization

The `img/devices/` folder has been reorganized into logical categories:

```
img/devices/
├── placeholder.webp (root fallback for unknown devices)
├── action-cameras/
│   ├── gopro-hero-12.webp
│   ├── gopro-hero-13.webp
│   ├── gopro-placeholder.webp
│   ├── insta-360-ace-pro.webp
│   ├── insta-360-go3.webp
│   ├── insta-360-one-x2.webp
│   └── insta360-x3.webp
├── cameras/
│   ├── blackmagic-pocket-cinema-camera-4k.webp
│   ├── blackmagic-pocket-cinema-camera-6k-pro.webp
│   ├── canon-eos-r5.webp
│   ├── canon-placeholder.webp
│   ├── fujifilm-placeholder.webp
│   ├── fujifilm-x-s20.webp
│   ├── nikon-placeholder.webp
│   ├── nikon-z8.webp
│   ├── sony-a6700.webp
│   └── sony-placeholder.webp
├── computing/
│   ├── amazon-fire-hd-10.webp
│   ├── amazon-fire-max-11.webp
│   ├── raspberry-pi-5.webp
│   └── tablet-placeholder.webp
├── drones/
│   ├── dji-mavic-3.webp
│   ├── dji-mini-4-pro.webp
│   └── drone-placeholder.webp
├── gaming-consoles/
│   ├── asus-rog-ally.webp
│   ├── gaming-handheld-console-placeholder.webp
│   ├── nintendo-3ds.webp
│   ├── nintendo-switch-oled.webp
│   ├── nintendo-switch.webp
│   └── steam-deck.webp
└── security-cameras/
    ├── eufy-solocam-s340.webp
    └── wyze-cam-v3.webp
```

## Updates Made

### 1. Image Files Moved
All device images organized by category:
- **7 files** → action-cameras/
- **10 files** → cameras/
- **4 files** → computing/
- **3 files** → drones/
- **6 files** → gaming-consoles/
- **2 files** → security-cameras/
- **1 file** remaining at root (placeholder.webp)

### 2. Code Updates

#### helpers.js
Updated `getDeviceImageFallback()` function with correct category paths:
- Optimized fallback logic (insta360 now before dji, asus rog before amazon fire)
- All paths use category subdirectories
- Removed references to non-existent images (e.g., dji-osmo-pocket-3.webp)

#### devices.json
Updated all `imageUrl` fields to include category subdirectories:
- `/img/devices/gopro-*` → `/img/devices/action-cameras/gopro-*`
- `/img/devices/dji-*` → `/img/devices/drones/dji-*`
- `/img/devices/steam-*` → `/img/devices/gaming-consoles/steam-*`
- And so on for all categories

## Fallback Strategy

The new structure supports intelligent fallbacks:

```javascript
// Brand-specific (highest priority)
gopro → gopro-hero-13.webp
insta360 → insta360-x3.webp
dji mavic → dji-mavic-3.webp
etc.

// Category-based (when brand not recognized)
Action Camera → gopro-placeholder.webp
Security Camera → wyze-cam-v3.webp
Gaming → gaming-handheld-console-placeholder.webp
etc.

// Default fallback (lowest priority)
Any unrecognized → placeholder.webp
```

## Benefits

1. **Better organization** - Images grouped by use case
2. **Easier maintenance** - Add new images to appropriate folders
3. **Scalability** - Can easily add new brands within categories
4. **Fallback resilience** - Multiple layers of fallback logic
5. **Consistent paths** - All code updated to use new structure

## Required Placeholders (All Present)

- `placeholder.webp` - Generic fallback
- `action-cameras/gopro-placeholder.webp` - Action camera category
- `cameras/canon-placeholder.webp` - DSLR category
- `cameras/nikon-placeholder.webp` - Alternative DSLR
- `cameras/sony-placeholder.webp` - Mirrorless category
- `cameras/fujifilm-placeholder.webp` - Alternative mirrorless
- `drones/drone-placeholder.webp` - Drone category
- `gaming-consoles/gaming-handheld-console-placeholder.webp` - Gaming category
- `computing/tablet-placeholder.webp` - Computing/tablet category
- `security-cameras/wyze-cam-v3.webp` - Security camera with actual image

## Verification

All updates are backward compatible:
- Image paths updated in both code and data files
- Fallback logic handles missing images gracefully
- Build system will copy files from new folder structure
