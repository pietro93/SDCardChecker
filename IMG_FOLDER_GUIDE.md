# Image Folder Structure - Quick Reference

## Directory Structure

```
img/devices/
├── action-cameras/        (GoPro, Insta360, etc.)
├── cameras/               (Canon, Nikon, Sony, Fujifilm, Blackmagic)
├── computing/             (Raspberry Pi, tablets, Chromebooks)
├── drones/                (DJI Mini, Mavic, Air, etc.)
├── gaming-consoles/       (Nintendo, Steam Deck, ASUS ROG, etc.)
├── security-cameras/      (Wyze, Eufy, etc.)
└── placeholder.webp       (Generic fallback at root)
```

## Adding New Device Images

### Step 1: Place image in correct folder
- **GoPro/Insta360** → `action-cameras/`
- **Drone** → `drones/`
- **Camera (Canon/Nikon/Sony/etc.)** → `cameras/`
- **Gaming device** → `gaming-consoles/`
- **Tablet/Pi/Chromebook** → `computing/`
- **Security camera** → `security-cameras/`

### Step 2: Update devices.json
Add `imageUrl` field:
```json
{
  "id": "device-slug",
  "name": "Device Name",
  "imageUrl": "/img/devices/category/image-filename.webp"
}
```

### Step 3: Update helpers.js (if adding brand)
Add brand detection to `getDeviceImageFallback()`:
```javascript
if (name.includes("brand-name")) 
  return "/img/devices/category/specific-image.webp";
```

## Category-to-Folder Mapping

| Device Category | Folder | Placeholder | Real Images |
|---|---|---|---|
| Action Cameras | `action-cameras/` | `gopro-placeholder.webp` | gopro-hero-*, insta360-* |
| Drones | `drones/` | `drone-placeholder.webp` | dji-mini-*, dji-mavic-* |
| Cameras | `cameras/` | canon-, nikon-, sony-, fujifilm-placeholder | canon-eos-*, nikon-z*, sony-a* |
| Gaming | `gaming-consoles/` | `gaming-handheld-console-placeholder.webp` | nintendo-*, steam-deck, asus-rog-* |
| Computing | `computing/` | `tablet-placeholder.webp` | raspberry-pi-*, amazon-fire-* |
| Security | `security-cameras/` | (uses wyze-cam-v3) | wyze-cam-*, eufy-* |

## Image Naming Convention

Use kebab-case (lowercase, hyphens):
- ✓ `gopro-hero-13.webp`
- ✓ `dji-mini-4-pro.webp`
- ✗ `GoproHero13.webp`
- ✗ `gopro_hero_13.webp`

## Fallback Chain

When a device image is missing, fallback order is:

1. **Specific image** (e.g., `gopro-hero-13.webp`)
2. **Brand placeholder** (e.g., `gopro-placeholder.webp`)
3. **Category placeholder** (e.g., `drone-placeholder.webp` for drones)
4. **Root placeholder** (`placeholder.webp`)

## File Format

All device images should be:
- **Format**: WebP (`.webp`)
- **Size**: ~30-80KB (compressed)
- **Dimensions**: 300x300px to 500x500px (square preferred)
- **Optimization**: Run through `imagemin` before adding

## Maintenance Checklist

When adding new devices:
- [ ] Image placed in correct category folder
- [ ] Image filename in kebab-case
- [ ] `imageUrl` updated in `devices.json`
- [ ] Brand fallback added to `helpers.js` if new brand
- [ ] WebP format, <100KB file size
- [ ] Category placeholder exists if using new category

## Related Files

- `data/devices.json` - Device list with image URLs
- `scripts/generator/helpers.js` - Fallback logic (`getDeviceImageFallback`)
- `scripts/generator/copy-assets.js` - Copies images during build
