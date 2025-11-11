# Image Management Strategy

## Current Images Available

### Device Images (`/img/devices/`)
```
gopro-hero-13.webp          # Specific GoPro Hero 13
gopro-placeholder.webp      # Fallback for ALL GoPro devices
dji-mini.webp               # Fallback for DJI Mini 3 Pro, Mini 4 Pro
dji-mavic.webp              # Fallback for DJI Mavic 3
drone-placeholder.webp      # Generic drone fallback
camera-placeholder.webp     # Generic camera fallback
nintendo-switch.webp        # Specific Nintendo Switch
nintendo-switch-oled.webp   # Specific Nintendo Switch OLED
valve-steam-deck.webp       # Specific Steam Deck
placeholder.webp            # Generic fallback (gaming consoles, etc)
```

### Card Images (`/img/cards/`)
```
sandisk-extreme-microsd.webp    # Specific SanDisk card
lexar-professional-633x.webp    # Specific Lexar card
uhs2-generic.webp               # Fallback for UHS-II cards
uhs1-generic.webp               # Fallback for UHS-I V30/V60 cards
placeholder.webp                # Generic SD card fallback
```

## Fallback Logic

### Device Images

**Priority order when specific image missing:**

1. **Brand-specific fallbacks** (exact name match first):
   - GoPro devices → `gopro-placeholder.webp`
   - DJI Mavic models → `dji-mavic.webp`
   - DJI Mini models → `dji-mini.webp`
   - Other DJI → `drone-placeholder.webp`

2. **Category-based fallbacks**:
   - Action Cameras/Mirrorless → `camera-placeholder.webp`
   - Drones → `drone-placeholder.webp`
   - Nintendo → `placeholder.webp`
   - Steam Deck → `valve-steam-deck.webp` (specific image)

3. **Default fallback**: `placeholder.webp`

### Card Images

**Priority order when specific image missing:**

1. **Interface-based fallbacks**:
   - UHS-II cards (contains "UHS-II" or "UHS II") → `uhs2-generic.webp`
   - UHS-I V30/V60 cards → `uhs1-generic.webp`

2. **Default fallback**: `placeholder.webp`

## How to Add New Images

### For Devices:
1. Add specific image: `/img/devices/[device-slug].webp`
   - File name should match `device.slug` from `devices.json`
   - Size: **1200×800px** (WebP)
   
2. Or rely on brand/category fallbacks (no new file needed)

### For Cards:
1. Add specific image: `/img/cards/[card-id].webp`
   - File name should match `card.id` from `sdcards.json`
   - Size: **400×400px** (WebP)

2. Or rely on UHS interface fallbacks (no new file needed)

## Implementation

The generator automatically:
- Checks if `device.imageUrl` exists in devices.json
- Falls back to brand-specific image (GoPro, DJI, etc)
- Falls back to category-based image
- Falls back to generic placeholder

Same logic for cards with UHS interface matching.

**No code changes needed** when adding new images—just add the file with correct naming.

## Missing Images Status

Still needed:
- Canon EOS R5, R6, R3
- Sony A6700, A6400, A7R5
- Fujifilm X-S20, X-S10, X-T5
- Nikon Z9, Z8
- More DJI models (Air 3S, etc)
- Most SD card brands beyond SanDisk/Lexar
