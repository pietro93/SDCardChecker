# SD Card Reader Images - Strategy & Implementation

**Status:** Placeholder phase (Phase 1)  
**Target Phase:** Phase 2 - Product launch  
**Created:** December 15, 2025

---

## Current Implementation

### Image Directory Structure

```
img/
├── readers/
│   └── sd-card-reader-placeholder.webp  (Generic catch-all placeholder)
```

### Placeholder Strategy

The generator uses **one generic placeholder** for all reader types:

```javascript
READER_IMAGE: `sd-card-reader-placeholder.webp`
```

This keeps it simple: all 14 readers share the same generic SD card reader icon/image. Clean, professional, and minimal overhead.

---

## Phase 2: Replace with Actual Product Images

### Step 1: Create Directory

```bash
mkdir -p img/readers
```

### Step 2: Naming Convention for Actual Images

Once you have actual product photos, name them by **reader ID** (from `data/sdCardReaders.json`):

```
img/readers/
├── ugreen-2in1-usbc-usb3.webp
├── muddy-crv43-viewer.webp
├── stealth-cam-sd-card-viewer.webp
├── lexar-lightning-microsd.webp
├── prograde-digital-cfexpress-sd-workflow.webp
├── sony-mrw-g1.webp
├── sandisk-extreme-pro-uhs2-usbc.webp
├── apple-usbc-sd-reader.webp
├── satechi-aluminum-type-c-stand.webp
├── anker-powerexpand-2in1.webp
├── unitek-usbc-3slot-reader.webp
├── transcend-rdf9-uhs2.webp
├── kingston-workflow-station.webp
└── sony-mrw-g2.webp
```

### Step 3: Update Generator (Optional)

If using actual product photos, update the generator to use reader ID as primary:

```javascript
// Option 1: Use reader ID (if you have actual product photos)
READER_IMAGE: `${reader.id}.webp`,

// Option 2: Use type-based fallback (if some photos missing)
READER_IMAGE: getReaderImageFallback(reader),
```

Helper function:
```javascript
function getReaderImageFallback(reader) {
    const imagePath = `/img/readers/${reader.id}.webp`;
    // In a real scenario, check if file exists
    // Otherwise fall back to type-based placeholder
    return imagePath; // or type-based fallback
}
```

---

## Image Specifications

### Technical Requirements

- **Format:** WebP (modern, optimized)
- **Size:** 400x400px minimum (product images)
- **Aspect Ratio:** Square (1:1) for consistency
- **Quality:** 80-85% compression for web
- **File Size:** < 100KB per image

### Template Usage

```html
<img 
    src="/img/readers/{{READER_IMAGE}}" 
    alt="{{READER_NAME}}" 
    class="w-full h-auto object-contain rounded-lg"
    width="400" 
    height="400" 
    loading="eager"
    decoding="async"
/>
```

---

## Image Sources

### Where to Get Product Photos

1. **Amazon Product Pages** (for reference)
   - Search each reader on Amazon
   - Screenshot or save product image
   - Optimize for web

2. **Official Brand Websites**
   - UGREEN: ugreen.com
   - Transcend: transcend-info.com
   - Kingston: kingston.com
   - ProGrade Digital: prograde.com
   - Sony: sony.com

3. **Retailer Product Images**
   - Best Buy
   - Adorama (for professional readers)
   - B&H Photo

4. **Press Kits**
   - Many brands offer press/product photography
   - Higher quality than retail photos

---

## Optimization Workflow

### 1. Download/Screenshot Images

```bash
# For each reader, save original image
# Example: ugreen-2in1-original.jpg (from Amazon)
```

### 2. Crop to Square

Use ImageMagick or Photoshop:

```bash
# Crop to center 400x400px square
convert input.jpg -gravity Center -crop 400x400+0+0 +repage output.jpg
```

### 3. Convert to WebP

```bash
# Install cwebp (Google's WebP encoder)
# macOS: brew install webp
# Windows: Download from google.github.io/wasm-av1

cwebp -q 85 input.jpg -o output.webp
```

### 4. Verify File Size

```bash
# Target: < 100KB per image
ls -lh img/readers/*.webp
```

---

## Current Readers Needing Images

| Reader | Brand | Status | Priority |
|--------|-------|--------|----------|
| UGREEN 2-in-1 | UGREEN | 🟡 Placeholder | P1 |
| Muddy CRV43 | Muddy | 🟡 Placeholder | P1 |
| Stealth Cam Viewer | Stealth Cam | 🟡 Placeholder | P1 |
| Lexar Lightning | Lexar | 🟡 Placeholder | P1 |
| ProGrade CFexpress | ProGrade Digital | 🟡 Placeholder | P1 |
| Sony MRW-G1 | Sony | 🟡 Placeholder | P2 |
| SanDisk Extreme PRO | SanDisk | 🟡 Placeholder | P2 |
| Apple USB-C | Apple | 🟡 Placeholder | P2 |
| Satechi Hub | Satechi | 🟡 Placeholder | P3 |
| Anker PowerExpand | Anker | 🟡 Placeholder | P3 |
| Unitek 3-Slot | Unitek | 🟡 Placeholder | P3 |
| Transcend RDF9 | Transcend | 🟡 Placeholder | P3 |
| Kingston Workflow | Kingston | 🟡 Placeholder | P3 |
| Sony MRW-G2 | Sony | 🟡 Placeholder | P3 |

---

## Fallback Strategy

If actual product images unavailable:

1. **Keep using type-based placeholders** (current approach)
   - Readers still functional and display-ready
   - Clean, professional look with generic category images
   - Consistent branding

2. **Add overlay text to placeholders**
   - "UGREEN 2-in-1 USB-C Reader"
   - Brand name + model overlaid on generic image

3. **Use Amazon affiliate image API** (if available)
   - Direct embed from Amazon product pages
   - Pros: Always up-to-date
   - Cons: Depends on Amazon availability

---

## Next Steps

### Phase 2 Task: Add Actual Reader Images
- [ ] Collect product images for 14 readers
- [ ] Crop and optimize to 400x400px WebP
- [ ] Save to `img/readers/[reader-id].webp`
- [ ] Update generator to use reader ID (optional)
- [ ] Test page rendering with new images
- [ ] Verify file sizes < 100KB each

**Estimated Time:** 2-3 hours  
**Priority:** Medium (pages functional with placeholders, but aesthetics improve with real images)

---

## Testing Placeholder Images

All reader pages use the same generic placeholder:

```
/img/readers/sd-card-reader-placeholder.webp
```

To verify pages render correctly with placeholder:

```bash
npm run build
npx http-server dist

# Visit: http://localhost:8080/readers/ugreen-2in1-usbc-usb3/
# Visit: http://localhost:8080/readers/prograde-digital-cfexpress-sd-workflow/
# All pages should display the same generic placeholder
```

---

**Last Updated:** December 15, 2025  
**Status:** Ready for Phase 2 image integration
