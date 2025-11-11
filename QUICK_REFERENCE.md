# Quick Reference - UI Changes

## Files Changed

### Code Files
- `scripts/generator/generate-device-pages.js` - Generator logic updated
- `src/css/style.css` - New CSS classes added

### Documentation
- `DATASET_IMAGES.md` - Image configuration guide
- `UI_IMPROVEMENTS.md` - Detailed change summary
- `FAQ_GENERATION.md` - FAQ generation system

## Data Files to Update

### devices.json
Add `imageUrl` to each device:
```json
{
  "id": "gopro-hero-13",
  "name": "GoPro Hero 13 Black",
  "imageUrl": "/assets/images/devices/gopro-hero-13.jpg",
  ...
}
```

### sdcards.json
Add `imageUrl` to each card:
```json
{
  "id": "sandisk-extreme-microsd",
  "name": "SanDisk Extreme",
  "imageUrl": "/assets/images/sdcards/sandisk-extreme-microsd.jpg",
  ...
}
```

## Key CSS Classes

### Featured Device Image
```css
.featured-device-image {
  max-width: 400px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
}

.featured-device-image img {
  width: 100%;
  height: auto;
}
```

### Table Card Cell (Image + Link)
```css
.table-card-cell {
  text-align: center;
  vertical-align: middle;
}

.table-card-image {
  width: 60px;
  height: 60px;
  /* Centered, light background */
}

.table-card-link {
  color: var(--amazon-orange);
  font-weight: 600;
  font-size: 0.85rem;
}
```

### Alternative Card Image
```css
.alternative-image {
  height: 120px;
  background: var(--background-light);
  display: flex;
  align-items: center;
  justify-content: center;
}

.alternative-image img {
  object-fit: contain;
}
```

## Template Variables

In device page template (`src/templates/device.html`):

```html
<!-- Featured Device Image -->
<div class="featured-device-image">
  <img src="{{DEVICE_IMAGE}}" alt="{{DEVICE_NAME}}" loading="lazy" />
</div>

<!-- FAQ Section (now always expanded) -->
<div class="faq-section">
  {{FAQ_HTML}}
</div>

<!-- Brands Table (with card images) -->
<table class="brands-table">
  <tbody>
    {{BRANDS_TABLE_ROWS}}
  </tbody>
</table>

<!-- Alternatives (with images) -->
<div class="alternatives-section">
  {{ALTERNATIVES_HTML}}
</div>
```

## Generated HTML Examples

### FAQ Item
```html
<div class="faq-item">
  <div class="faq-question">
    <span>Is V30 required for GoPro Hero 13?</span>
  </div>
  <div class="faq-answer">
    Yes, V30 is recommended...
  </div>
</div>
```

### Table Row with Card Image
```html
<tr>
  <td class="table-card-cell">
    <div class="table-card-image">
      <img src="/assets/images/sdcards/sandisk-extreme-microsd.jpg" 
           alt="SanDisk Extreme" loading="lazy" />
    </div>
    <a href="https://amazon.com/..." target="_blank" class="table-card-link">
      Check on Amazon
    </a>
  </td>
  <td><strong>SanDisk Extreme microSD</strong></td>
  <td>V30</td>
  <td>30 MB/s</td>
  ...
</tr>
```

### Alternative Card with Image
```html
<div class="alternative-card card">
  <div class="alternative-label">✓ Best Choice</div>
  <div class="alternative-image">
    <img src="/assets/images/sdcards/sandisk-extreme-microsd.jpg" 
         alt="SanDisk Extreme" loading="lazy" />
  </div>
  <div class="alternative-content">
    <div class="alternative-title">SanDisk Extreme microSD</div>
    <div class="alternative-price">$25</div>
    <div class="pros">Fast, reliable, official GoPro choice</div>
    <a href="https://amazon.com/..." target="_blank" class="btn btn-amazon">
      Check on Amazon
    </a>
  </div>
</div>
```

## Image File Structure

```
dist/
├── assets/
│   └── images/
│       ├── devices/
│       │   ├── placeholder.jpg (fallback)
│       │   ├── gopro-hero-13.jpg
│       │   ├── gopro-hero-12.jpg
│       │   ├── canon-eos-r5.jpg
│       │   └── ...
│       └── sdcards/
│           ├── placeholder.jpg (fallback)
│           ├── sandisk-extreme-microsd.jpg
│           ├── lexar-professional-1000x.jpg
│           ├── kingston-canvas-go.jpg
│           └── ...
```

## Image Specifications

### Device Images
- Size: 500x400px (landscape)
- Format: JPEG
- Max size: 200KB
- Location: `/assets/images/devices/{device-slug}.jpg`

### SD Card Images
- Size: 200x140px (portrait/tall)
- Format: JPEG
- Max size: 100KB
- Location: `/assets/images/sdcards/{card-id}.jpg`

## Testing Checklist

- [ ] FAQ questions display without arrow
- [ ] FAQ answers are visible by default
- [ ] Featured device image shows on device page
- [ ] Table first column shows card image + "Check on Amazon"
- [ ] "Shop" column is removed from table
- [ ] Alternative cards show images
- [ ] "View on Amazon" → "Check on Amazon" updated everywhere
- [ ] Placeholder images used when URLs missing
- [ ] Mobile layout still responsive
- [ ] Images load with `loading="lazy"`

## Common Issues & Fixes

### Images not showing
- Check if `imageUrl` exists in dataset
- Verify path format: `/assets/images/devices/gopro-hero-13.jpg`
- Check that image file exists in `dist/` directory
- Check browser console for 404 errors

### Table layout broken
- Ensure `table-card-cell` CSS is applied
- Check that first column is properly scoped
- Verify responsive styles on mobile

### FAQ showing toggle
- Clear browser cache
- Rebuild with: `npm run build`
- Check that old `.faq-toggle` CSS is removed

### Images too large/small
- Adjust `.table-card-image` and `.alternative-image` dimensions in CSS
- Verify `object-fit: contain` is set
- Check image aspect ratio
