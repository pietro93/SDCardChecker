# Nintendo Branded Cards Grid - Integration Complete ✅

## Component Integration Status

### Files Updated ✅

1. **src/templates/device.html**
   - Added `{{NINTENDO_BRANDED_CARDS_GRID}}` after brands table
   - Will display on ALL device pages where the grid is populated
   - Location: After "Top SD Card Recommendations" section

2. **src/templates/device-ja.html**
   - Added `{{NINTENDO_BRANDED_CARDS_GRID}}` after brands table
   - Japanese version of device pages
   - Location: After "Top SD Card Recommendations" section

3. **src/templates/guides/nintendo-switch-sd-card-guide.html**
   - Added `{{NINTENDO_BRANDED_CARDS_GRID}}` after "Brands Guide" section
   - Location: Before "Frequently Asked Questions" section

4. **src/templates/guides/nintendo-switch-sd-card-guide-ja.html**
   - Added `{{NINTENDO_BRANDED_CARDS_GRID}}` after "Brands Guide" section
   - Location: Before "よくある質問 (FAQ)" section

### Component File ✅

- **src/templates/components/nintendo-branded-cards-grid.html**
  - Complete responsive grid with 10 Nintendo-branded cards
  - Mobile: 2 columns
  - Tablet: 3 columns
  - Desktop: 5 columns
  - Affiliate links using `{{AMAZON_URL_*}}` variables

---

## Next Steps: Build Script Integration

Your build script needs to:

### 1. Check Device ID & Conditionally Populate Grid

```javascript
// Only show the grid on Nintendo Switch device pages (NOT Switch 2)
const nintendoDevicesWithGrid = [
  'nintendo-switch',
  'nintendo-switch-oled',
  'nintendo-switch-lite'
];

const shouldShowNintendoGrid = nintendoDevicesWithGrid.includes(deviceId);

if (shouldShowNintendoGrid) {
  html = html.replace('{{NINTENDO_BRANDED_CARDS_GRID}}', nintendoGridComponent);
} else {
  // Remove the placeholder entirely for other devices
  html = html.replace('{{NINTENDO_BRANDED_CARDS_GRID}}', '');
}
```

### 2. Replace Amazon Affiliate URL Variables

```javascript
const nintendoGridComponent = fs.readFileSync(
  './src/templates/components/nintendo-branded-cards-grid.html',
  'utf-8'
);

const nintendoAffiliateUrls = {
  'ZELDA': 'https://amazon.com/s?k=SanDisk+Nintendo+Zelda+microSD+Switch&tag=sd-cc-20',
  'GENGAR': 'https://amazon.com/s?k=SanDisk+Nintendo+Pokemon+Gengar+microSD+Switch&tag=sd-cc-20',
  'SNORLAX': 'https://amazon.com/s?k=SanDisk+Nintendo+Pokemon+Snorlax+microSD+Switch&tag=sd-cc-20',
  'PIKACHU': 'https://amazon.com/s?k=SanDisk+Nintendo+Pokemon+Pikachu+microSD+Switch&tag=sd-cc-20',
  'YOSHI': 'https://amazon.com/s?k=SanDisk+Nintendo+Yoshi+microSD+Switch&tag=sd-cc-20',
  'ANIMAL_CROSSING': 'https://amazon.com/s?k=SanDisk+Nintendo+Animal+Crossing+Leaf+microSD+Switch&tag=sd-cc-20',
  'MARIO_MUSHROOM': 'https://amazon.com/s?k=SanDisk+Nintendo+Super+Mario+Mushroom+microSD+Switch&tag=sd-cc-20',
  'MARIO_STAR': 'https://amazon.com/s?k=SanDisk+Nintendo+Super+Mario+Super+Star+microSD+Switch&tag=sd-cc-20',
  'FORTNITE_CUDDLE': 'https://amazon.com/s?k=SanDisk+Nintendo+Fortnite+Cuddle+Team+Leader+microSD+Switch&tag=sd-cc-20',
  'FORTNITE_SKULL': 'https://amazon.com/s?k=SanDisk+Nintendo+Fortnite+Skull+Trooper+microSD+Switch&tag=sd-cc-20'
};

let grid = nintendoGridComponent;
Object.entries(nintendoAffiliateUrls).forEach(([key, url]) => {
  grid = grid.replace(`{{AMAZON_URL_${key}}}`, url);
});
```

### 3. Handle Non-Nintendo Switch Pages

For pages that don't need the grid:
```javascript
// In device.html and device-ja.html templates
if (!nintendoDevicesWithGrid.includes(deviceId)) {
  html = html.replace('{{NINTENDO_BRANDED_CARDS_GRID}}', '');
}

// For Nintendo Switch guides - always show
if (isNintendoSwitchGuide) {
  html = html.replace('{{NINTENDO_BRANDED_CARDS_GRID}}', nintendoGridComponent);
}
```

---

## Pages Where Grid Will Appear

### Device Pages (after brands table) ✅
- `/devices/nintendo-switch/`
- `/devices/nintendo-switch-oled/`
- `/devices/nintendo-switch-lite/`
- `/ja/devices/nintendo-switch/` (Japanese)
- `/ja/devices/nintendo-switch-oled/` (Japanese)
- `/ja/devices/nintendo-switch-lite/` (Japanese)

### Guide Pages (before FAQ) ✅
- `/guides/nintendo-switch-sd-card-guide/`
- `/ja/guides/nintendo-switch-sd-card-guide/` (Japanese)

### Pages Where Grid Will NOT Appear ✅
- `/devices/nintendo-switch-2/` (Switch 2 - UHS-I cards are not optimal)
- All other device pages (not Nintendo Switch)

---

## Amazon URL Format

All URLs use the search format (as specified in your data):
```
https://amazon.com/s?k=SanDisk+Nintendo+[Name]+microSD+Switch&tag=sd-cc-20
```

The `&tag=sd-cc-20` is your affiliate tracking code. Replace with your actual affiliate tag if different.

---

## Images Required

Ensure all 10 images exist in `/img/cards/nintendo-switch/`:

```
✓ sandisk-zelda.webp
✓ sandisk-pokemon-gengar.webp
✓ sandisk-pokemon-snorlax.webp
✓ sandisk-pokemon-pikachu.webp
✓ sandisk-yoshi.webp
✓ sandisk-animal-crossing.webp
✓ sandisk-mario-mushroom.webp
✓ sandisk-mario-star.webp
✓ sandisk-fortnite-cuddle.webp
✓ sandisk-fortnite-skull.webp
```

All images use `loading="lazy"` so they won't slow down page loads.

---

## Responsive Behavior

**Mobile (< 1024px):** 2 columns (card width: 50%)
**Tablet (≥ 1024px, < 2000px):** 3 columns (card width: 33%)
**Desktop (≥ 2000px):** 5 columns (card width: 20%)

Cards stack naturally on mobile without any CSS changes needed.

---

## Styling Notes

The component uses:
- **Tailwind CSS** - All styling via Tailwind classes
- **Font Awesome 6.4** - Icons
- **Hover Effects:**
  - Image zoom on hover
  - Card shadow increase
  - Border color change (red accent)
  - Button color transition

No additional CSS or JavaScript required.

---

## Testing Checklist

- [ ] Device pages display grid correctly
- [ ] Guide pages display grid correctly
- [ ] Switch 2 page does NOT display grid
- [ ] Other device pages do NOT display grid
- [ ] Images load correctly (check `/img/cards/nintendo-switch/`)
- [ ] Amazon affiliate links work
- [ ] Mobile responsiveness (2 columns)
- [ ] Tablet responsiveness (3 columns)
- [ ] Desktop responsiveness (5 columns)
- [ ] Japanese pages display grid without issues
- [ ] Info box displays correctly

---

## Future Enhancements

Optional:
1. Add a **Japanese version** of the component (`nintendo-branded-cards-grid-ja.html`)
   - Replace English text with Japanese equivalents
   - Keep images and structure the same

2. Add **price comparison feature** if you want to:
   - Include current Amazon prices
   - Show price tier ($$/$$$) 
   - Display "Best Value" badge

3. Add **"Add to Cart" buttons** linking directly to Amazon product pages (if you have specific product URLs)

---

## Files Summary

**Created:**
- `src/templates/components/nintendo-branded-cards-grid.html` (260 lines)
- `NINTENDO_BRANDED_CARDS_GRID_COMPONENT.md` (component documentation)
- `NINTENDO_BRANDED_CARDS_GRID_INTEGRATION.md` (this file)

**Modified:**
- `src/templates/device.html` (+2 lines)
- `src/templates/device-ja.html` (+2 lines)
- `src/templates/guides/nintendo-switch-sd-card-guide.html` (+2 lines)
- `src/templates/guides/nintendo-switch-sd-card-guide-ja.html` (+2 lines)

**Total Impact:** 8 lines added across 4 template files + 1 new component file
