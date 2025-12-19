# Reader Brand-Level Image Fallback System

## How It Works

The reader image system now implements a **3-tier fallback hierarchy**:

1. **Specific Reader Image** (highest priority)
   - Example: `/img/readers/sony-mrw-g2-sd-reader.webp`
   - Used if `heroImage` is defined in `sdCardReaders.json`

2. **Brand-Level Image** (secondary fallback)
   - Example: `/img/readers/sony.webp`
   - Used if a specific reader image doesn't exist
   - Automatically applied to all readers from that brand

3. **Generic Placeholder** (lowest priority)
   - `/img/readers/sd-card-reader-placeholder.webp`
   - Used if no brand image exists

## Using Brand-Level Fallbacks

### To Create a Brand Fallback Image

1. Add a brand image to `/img/readers/` with the brand name in lowercase
   - Format: `{brand-lowercase}.webp`
   - Example: `sony.webp`, `kingston.webp`, `sandisk.webp`, `ugreen.webp`

2. The system will automatically use it for all readers from that brand that don't have a specific image

### Example

If you have:
- `img/readers/sony.webp` (brand-level fallback)
- `img/readers/sony-mrw-g2-sd-reader.webp` (specific reader image)

Then:
- Sony MRW-G2 → uses `sony-mrw-g2-sd-reader.webp` (specific)
- Sony MRW-E30 → uses `sony.webp` (brand fallback)
- Other readers → uses `sd-card-reader-placeholder.webp` (generic)

## Current Setup

### Specific Reader Images
- `sony-mrw-g2-sd-reader.webp` → Sony MRW-G2
- `kingston-workflow-station.webp` → Kingston Workflow Station
- `sandisk-professional-pro-reader-multi-card.webp` → SanDisk Professional

### Where to Add Brand Fallbacks

To improve coverage, consider adding brand images for:
- `sony.webp` (for other Sony readers)
- `kingston.webp` (for other Kingston readers)
- `sandisk.webp` (for other SanDisk readers)
- `ugreen.webp` (for UGREEN readers)
- `lexar.webp` (for Lexar readers)
- `crucial.webp` (for Crucial readers)

## Implementation Details

### Function: `getReaderImageFallback()`

Located in `/scripts/generator/helpers.js`

```javascript
function getReaderImageFallback(reader, imgDirectory = './img/readers') {
  // 1. Check specific reader image
  if (reader.heroImage) {
    return reader.heroImage;
  }

  // 2. Check brand-level fallback
  const brandImagePath = `/img/readers/${reader.brand.toLowerCase()}.webp`;
  const brandImageFullPath = path.join(imgDirectory, `${reader.brand.toLowerCase()}.webp`);
  
  if (fs.existsSync(brandImageFullPath)) {
    return brandImagePath;
  }

  // 3. Use generic placeholder
  return '/img/readers/sd-card-reader-placeholder.webp';
}
```

### Files Updated

1. **`/scripts/generator/helpers.js`**
   - Added `getReaderImageFallback()` function
   - Added export to module.exports

2. **`/scripts/generator/generate-reader-pages.js`**
   - Imports `getReaderImageFallback`
   - Uses it for `HERO_IMAGE` template variable

3. **`/scripts/generator/generate-readers-index.js`**
   - Imports `getReaderImageFallback`
   - Uses it in `generateReaderCard()`
   - Uses it in `generateReaderSchemaList()` for schema markup

## Testing

After adding brand images, rebuild with:
```bash
npm run build
```

The system will automatically detect and use brand images for readers without specific images.
