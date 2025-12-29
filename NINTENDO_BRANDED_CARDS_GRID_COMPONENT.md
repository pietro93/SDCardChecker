# Nintendo Branded microSD Cards Grid Component

## Overview

A reusable, plug-and-pull grid component displaying all 10 official Nintendo-licensed SanDisk microSD cards. The component is fully responsive (2-5 columns based on screen size) with hover effects and affiliate links.

## File Location

```
src/templates/components/nintendo-branded-cards-grid.html
```

## Features

✅ **Responsive Grid Layout**
- Mobile: 2 columns
- Tablet (md): 3 columns  
- Desktop (lg): 5 columns

✅ **Each Card Contains**
- Product image with hover zoom effect
- Product name
- Available capacities
- "View on Amazon" button with affiliate link
- Hover shadow effect and border color change

✅ **Info Box**
- Explains official Nintendo licensing
- Notes about performance specs (V30, UHS-I)
- Important Switch 2 compatibility notice

✅ **Accessibility**
- Proper alt text on images
- Semantic HTML structure
- ARIA-friendly

## Usage

### In HTML Templates

Add this single line to any template where you want the grid to appear:

```html
{{NINTENDO_BRANDED_CARDS_GRID}}
```

### Recommended Placement

1. **Nintendo Switch Device Pages** (switch, switch-oled, switch-lite)
   - After the "Recommended Brands" section
   - Before the FAQ section

2. **Nintendo Switch SD Card Guide** (guides/nintendo-switch-sd-card-guide.html)
   - After the "Brands Guide" section
   - Before the FAQ section

3. **NOT Recommended**
   - Nintendo Switch 2 device page (since they're UHS-I only and not optimal for Switch 2)

## Template Variables Required

The component uses these template variables for Amazon affiliate links:

```
{{AMAZON_URL_ZELDA}}
{{AMAZON_URL_GENGAR}}
{{AMAZON_URL_SNORLAX}}
{{AMAZON_URL_PIKACHU}}
{{AMAZON_URL_YOSHI}}
{{AMAZON_URL_ANIMAL_CROSSING}}
{{AMAZON_URL_MARIO_MUSHROOM}}
{{AMAZON_URL_MARIO_STAR}}
{{AMAZON_URL_FORTNITE_CUDDLE}}
{{AMAZON_URL_FORTNITE_SKULL}}
```

## Build Integration

To enable this component, you'll need to:

1. **In your build script** (likely in `build.js` or similar):
   - Read the `nintendo-branded-cards-grid.html` file
   - Replace `{{NINTENDO_BRANDED_CARDS_GRID}}` in templates with the component HTML
   - Replace each `{{AMAZON_URL_*}}` with the actual affiliate URLs

2. **Example Build Integration:**
```javascript
const nintendoGridComponent = fs.readFileSync('./src/templates/components/nintendo-branded-cards-grid.html', 'utf-8');

// In your template processing loop:
let html = template
  .replace('{{NINTENDO_BRANDED_CARDS_GRID}}', nintendoGridComponent)
  .replace('{{AMAZON_URL_ZELDA}}', 'https://amazon.com/dp/...')
  .replace('{{AMAZON_URL_GENGAR}}', 'https://amazon.com/dp/...')
  // ... etc for all 10 cards
```

## Image Assets Required

Ensure these images exist in `/img/cards/nintendo-switch/`:
- `sandisk-zelda.webp`
- `sandisk-pokemon-gengar.webp`
- `sandisk-pokemon-snorlax.webp`
- `sandisk-pokemon-pikachu.webp`
- `sandisk-yoshi.webp`
- `sandisk-animal-crossing.webp`
- `sandisk-mario-mushroom.webp`
- `sandisk-mario-star.webp`
- `sandisk-fortnite-cuddle.webp`
- `sandisk-fortnite-skull.webp`

## Styling

The component uses:
- **Tailwind CSS** classes for all styling
- **Font Awesome 6.4** icons
- No external dependencies beyond what's already in the project

### Color Scheme
- Primary: Blue buttons (#0066CC / #0052A3)
- Accent: Red hover state (#DC2626)
- Background: Slate grays for contrast

## Mobile Responsiveness

```
Screen Size     Columns     Card Width
≥ 2000px        5           1/5 width
≥ 1024px        3           1/3 width
< 1024px        2           1/2 width
```

## Affiliate Link Format

Each card should use Amazon search URLs (as specified in the data, search URLs are used):

```
https://amazon.com/s?k=SanDisk+Nintendo+[Name]+microSD+Switch&tag=sd-cc-20
```

Example: `https://amazon.com/s?k=SanDisk+Nintendo+Zelda+microSD+Switch&tag=sd-cc-20`

## Performance Considerations

- Images use `loading="lazy"` for deferred loading
- `width` and `height` attributes prevent layout shift
- Minimal CSS for fast rendering
- No JavaScript required

## Customization Options

If needed, you can:
1. Change grid column breakpoints in Tailwind classes
2. Adjust card border and shadow on hover
3. Modify button styling
4. Change info box colors
5. Add additional details to each card

## Files to Update (Integration Checklist)

- [ ] `src/templates/device.html` - Add grid after recommendedBrands section
- [ ] `src/templates/device-ja.html` - Japanese version (if needed)
- [ ] `src/templates/guides/nintendo-switch-sd-card-guide.html` - Add after brands section
- [ ] `src/templates/guides/nintendo-switch-sd-card-guide-ja.html` - Japanese version (if needed)
- [ ] Build script - Add variable replacement logic for Amazon URLs
- [ ] Image assets - Ensure all 10 images are in `/img/cards/nintendo-switch/`

## Support for Multiple Languages

If you have a Japanese version of these pages, create a separate component:
- `src/templates/components/nintendo-branded-cards-grid-ja.html`

Use variable: `{{NINTENDO_BRANDED_CARDS_GRID_JA}}`
