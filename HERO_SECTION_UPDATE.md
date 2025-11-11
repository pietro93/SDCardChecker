# Hero Section Redesign

## Changes Made

### 1. ✓ Hero Title Repositioned to Image Overlay
- **Before**: Title below image ("What SD Card Do I Need for GoPro Hero 13 Black?")
- **After**: Title overlaid on top of image ("Best SD Card for GoPro Hero 13")

**Visual improvements:**
- Title is centered on the image
- White text with text-shadow for readability
- Dark gradient overlay (transparent to semi-transparent) behind text
- Responsive sizing (text-4xl on mobile, text-5xl on desktop)

### 2. ✓ Hero Image Height Optimized
- **Before**: h-96 (384px) - large with empty space
- **After**: h-64 (256px) - cropped to focus on content
- Still maintains proper aspect ratio with `object-cover`

### 3. ✓ Title Text Simplified
- **Before**: "What SD Card Do I Need for GoPro Hero 13 Black?"
- **After**: "Best SD Card for GoPro Hero 13"

**Automatic name shortening:**
- Removes qualifiers: "Black", "OLED", "Pro", "Plus", "SE", "Max"
- Clean, SEO-friendly format

### 4. ✓ FAQ Enhancement
- Old title question moved to FAQ section as **first item**
- Question: "What SD Card Do I Need for [Device Name]?"
- Answer: Includes the recommended specs + full explanation
- Maintains SEO value while improving UX

**Example:**
```
Q: What SD Card Do I Need for GoPro Hero 13 Black?
A: microSD UHS-II (V30 or faster). Shoots 5.3K at high frame rates. 
   V30 ensures 30MB/s sustained write speed needed to prevent dropped 
   frames or corrupted files...
```

## CSS Implementation

### Hero Overlay Styling:
```css
.hero-image-container {
  position: relative;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 100%);
}

.hero-title {
  font-size: 2.25rem (mobile) / 3rem (desktop);
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
  filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.3));
  text-align: center;
  padding: 0 1rem;
}
```

## Template Variables

**New variable added:**
- `{{DEVICE_NAME_SHORT}}` - Device name without qualifiers

**Template example:**
```html
<h1 class="hero-title">
  <i class="{{DEVICE_ICON}} mr-2"></i>Best SD Card for {{DEVICE_NAME_SHORT}}
</h1>
```

## SEO Impact

**Positive:**
- H1 still visible in page (moved to overlay)
- FAQ question preserves original query ("What SD Card Do I Need...")
- Better for user intent matching
- Improved visual hierarchy with hero image

**Maintained:**
- Page title unchanged (still includes full device name)
- Meta description unchanged
- Schema.org structured data updated with full FAQ list
- All canonical links and OG tags intact

## Mobile Responsiveness

- Title scales responsively on image
- Gradient overlay ensures text readable on any image
- Image height reduced to 256px (still prominent on mobile)
- Text padding ensures no overflow on small screens

## Browser Compatibility

- Uses standard CSS (no fancy filters needed for fallback)
- Text-shadow and drop-shadow widely supported
- Absolute positioning works everywhere
- Flexbox for centering (IE11+)
