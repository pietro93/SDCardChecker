# Amazon Product Card Styling Reference

## UI Component Architecture

All Amazon product cards use centralized CSS classes defined in `src/css/modern.css` for 100% consistency across device pages, guide pages, and future calculator pages.

---

## HTML Structure

```html
<section id="amazon-products-{type}" class="mb-16 scroll-mt-20">
  <!-- Section Header -->
  <h3 class="text-2xl font-bold text-slate-900 mb-6">
    Featured Products on Amazon
  </h3>
  
  <!-- Affiliate Disclosure -->
  <p class="text-xs text-slate-500 mb-6">
    This website contains affiliate links. We may earn a small commission when 
    you purchase through our links at no extra cost to you.
  </p>
  
  <!-- Grid Container -->
  <div class="amazon-badges-grid">
    
    <!-- Product Card -->
    <div class="amazon-product-badge">
      
      <!-- Image Container -->
      <div class="badge-image">
        <img src="..." alt="..." loading="lazy" width="120" height="120" />
      </div>
      
      <!-- Content Container -->
      <div class="badge-content">
        <h4 class="badge-title">Kingston Canvas Go Plus 256GB</h4>
        
        <!-- Rating (optional) -->
        <div class="badge-rating">⭐ 4.5 (1,234)</div>
        
        <!-- Price -->
        <div class="badge-price">$29.99</div>
        
        <!-- Amazon Link -->
        <a href="..." target="_blank" rel="nofollow noopener" class="badge-link">
          View on Amazon
        </a>
      </div>
      
    </div>
    
    <!-- Repeat for each product... -->
    
  </div>
</section>
```

---

## CSS Classes

### Container Classes

#### `.amazon-badges-grid`
```css
Grid container for all product cards

Display: CSS Grid
Columns: repeat(auto-fit, minmax(280px, 1fr))
Gap: 1.5rem
Margin-bottom: 2rem

Responsive:
- Desktop (768px+): 3 columns
- Tablet (480-768px): 2 columns
- Mobile (<480px): 1 column

/* CSS */
.amazon-badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}
```

---

### Card Classes

#### `.amazon-product-badge`
```css
Individual product card container

Background: White (#ffffff)
Border: 1px solid #e5e7eb (light gray)
Border-radius: 8px
Box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1)
Display: Flex column
Height: Full (stretches to content)
Overflow: Hidden
Transition: 0.3s ease (shadow), 0.2s ease (transform)

Hover State:
- Box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) (darker shadow)
- Transform: translateY(-2px) (subtle lift)

/* CSS */
.amazon-product-badge {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  transition: box-shadow 0.3s ease, transform 0.2s ease;
}

.amazon-product-badge:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}
```

---

### Image Classes

#### `.badge-image`
```css
Product image container

Display: Flex (centered content)
Height: 180px (desktop), 150px (mobile)
Background: #f9f9f9 (light gray background)
Overflow: Hidden
Padding: 1rem
Border-bottom: 1px solid #f0f0f0
Flex-shrink: 0 (doesn't compress)

/* CSS */
.badge-image {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 180px;
  background: #f9f9f9;
  overflow: hidden;
  padding: 1rem;
  flex-shrink: 0;
  border-bottom: 1px solid #f0f0f0;
}

@media (max-width: 768px) {
  .badge-image {
    height: 150px;
  }
}
```

#### `.badge-image img`
```css
Product image element

Max-width: 100%
Max-height: 100%
Object-fit: contain (maintains aspect ratio, no crop)

/* CSS */
.badge-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
```

---

### Content Classes

#### `.badge-content`
```css
Container for title, rating, price, and button

Display: Flex column
Padding: 1.25rem
Flex: 1 (grows to fill space)
Gap: 0.75rem (space between items)

/* CSS */
.badge-content {
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  flex: 1;
  gap: 0.75rem;
}
```

#### `.badge-title`
```css
Product title text

Font-size: 0.95rem
Font-weight: 600 (semibold)
Color: #1a1a1a (almost black)
Margin: 0
Line-height: 1.4
Display: -webkit-box (for text clamp)
-webkit-line-clamp: 2 (max 2 lines)
-webkit-box-orient: vertical
Overflow: hidden (truncates with ellipsis)

/* CSS */
.badge-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

#### `.badge-rating`
```css
Star rating and review count

Font-size: 0.8rem
Color: #666 (medium gray)
Display: Flex
Align-items: center
Gap: 0.5rem
Height: 1.25rem (fixed to prevent layout shift)

/* CSS */
.badge-rating {
  font-size: 0.8rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 1.25rem;
}

/* Example HTML: ⭐ 4.5 (1,234) */
```

#### `.badge-price`
```css
Product price

Font-size: 1.25rem
Font-weight: 700 (bold)
Color: #1a1a1a (almost black)
Margin-top: 0.25rem (small gap from rating)

/* CSS */
.badge-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-top: 0.25rem;
}

/* Example: $29.99 */
```

---

### Button Classes

#### `.badge-link`
```css
Amazon affiliate button

Width: 100% (fills container)
Padding: 0.75rem 1rem
Background: #FF9900 (Amazon orange)
Color: white
Font-weight: 600
Font-size: 0.95rem
Text-decoration: none
Border-radius: 6px
Text-align: center
Border: none
Cursor: pointer
Margin-top: auto (pushed to bottom)
Transition: background-color 0.2s ease

Hover State:
Background: #EC7211 (darker orange)
Text-decoration: none (stays removed)

/* CSS */
.badge-link {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #FF9900;
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  border-radius: 6px;
  text-align: center;
  border: none;
  cursor: pointer;
  margin-top: auto;
  transition: background-color 0.2s ease;
}

.badge-link:hover {
  background-color: #EC7211;
  text-decoration: none;
}
```

---

## Color Palette

| Element | Color | Hex |
|---------|-------|-----|
| Card Background | White | `#ffffff` |
| Card Border | Light Gray | `#e5e7eb` |
| Image Background | Very Light Gray | `#f9f9f9` |
| Image Border | Light Gray | `#f0f0f0` |
| Card Shadow (Normal) | Black 10% | `rgba(0, 0, 0, 0.1)` |
| Card Shadow (Hover) | Black 15% | `rgba(0, 0, 0, 0.15)` |
| Text (Title, Price) | Almost Black | `#1a1a1a` |
| Text (Rating) | Medium Gray | `#666` |
| Button (Normal) | Amazon Orange | `#FF9900` |
| Button (Hover) | Dark Orange | `#EC7211` |

---

## Responsive Breakpoints

### Desktop (768px and up)
```css
.amazon-badges-grid {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.badge-image {
  height: 180px;
}
```

**Result:** 3 columns on typical desktop

### Tablet (480px to 767px)
```css
/* No special rules - uses auto-fit to fit available space */
/* Usually 2 columns or responsive based on viewport */
```

### Mobile (up to 479px)
```css
@media (max-width: 768px) {
  .amazon-badges-grid {
    grid-template-columns: 1fr;  /* Single column */
  }
  
  .badge-image {
    height: 150px;  /* Slightly smaller on mobile */
  }
}
```

**Result:** 1 column, stacked vertically

---

## Spacing & Sizing

| Element | Size |
|---------|------|
| Grid gap | 1.5rem (24px) |
| Grid margin-bottom | 2rem (32px) |
| Card border-radius | 8px |
| Image height (desktop) | 180px |
| Image height (mobile) | 150px |
| Image padding | 1rem (16px) |
| Content padding | 1.25rem (20px) |
| Content gap (between items) | 0.75rem (12px) |
| Button padding | 0.75rem 1rem |
| Button border-radius | 6px |

---

## Animation & Transitions

### Card Hover
```css
.amazon-product-badge {
  transition: box-shadow 0.3s ease, transform 0.2s ease;
}

.amazon-product-badge:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);  /* Lifts up 2px */
}
```

**Effect:** Subtle lift with enhanced shadow on hover

### Button Hover
```css
.badge-link {
  transition: background-color 0.2s ease;
}

.badge-link:hover {
  background-color: #EC7211;
}
```

**Effect:** Color change from #FF9900 to #EC7211

---

## Accessibility Features

✅ **Images:** `loading="lazy"` for performance  
✅ **Images:** `alt` text for screen readers  
✅ **Links:** `target="_blank"` opens in new tab  
✅ **Links:** `rel="nofollow noopener"` for SEO and security  
✅ **Contrast:** Dark text on light background (WCAG AA)  
✅ **Button Size:** 48px minimum touch target (0.75rem padding = 44px+)  
✅ **Semantic HTML:** Uses `<h3>`, `<h4>`, `<p>` tags  

---

## Usage Examples

### Speed Classes Guide
```html
{{AMAZON_FEATURED_SPEED_CLASSES}}
<!-- Generates: section with 3 cards from guide-speed-classes.json -->
<!-- Title: "Speed Class Cards on Amazon" -->
```

### RAW vs JPEG Guide
```html
{{AMAZON_FEATURED_RAW_JPEG}}
<!-- Generates: section with 3 cards from guide-raw-jpeg.json -->
<!-- Title: "Professional-Grade Cards" -->
```

### Video Bitrate Guide
```html
{{AMAZON_FEATURED_VIDEO}}
<!-- Generates: section with 3 cards from guide-video-bitrate.json -->
<!-- Title: "High-Speed Cards for 4K/8K Video" -->
```

### Fake SD Card Detector Guide
```html
{{AMAZON_FEATURED_AUTHENTIC}}
<!-- Generates: section with 3 cards from guide-fake-detection.json -->
<!-- Title: "Buy Authentic Cards" -->
```

### Device Pages (Default)
```html
{{AMAZON_BADGES_SECTION}}
<!-- Generates: section with 3 cards from featured-general.json -->
<!-- Title: "Featured Products on Amazon" -->
```

### Future Calculator Pages
```html
{{AMAZON_FEATURED_CALCULATOR_PRICE}}
<!-- Will generate: section with 1 card from calculator-recommended.json -->
<!-- Title: "Check Current Pricing" -->
```

---

## Maintenance Notes

### If CSS Needs Updates
1. Edit `src/css/modern.css`
2. Locate "Amazon Badges Grid Styling" section
3. All classes are centralized for easy maintenance
4. No inline styles in templates (removed from device.html)

### If Design Needs Changes
- **Colors:** Update hex values in `.badge-link` and `.amazon-product-badge`
- **Sizing:** Adjust `height: 180px` in `.badge-image`
- **Spacing:** Modify `gap: 1.5rem` in `.amazon-badges-grid`
- **Hover Effects:** Update `transform: translateY(-2px)` in `.amazon-product-badge:hover`

### If New Card Types Needed
1. Add new function to `amazon-badges-generator.js`:
   ```javascript
   generateNewCardType(type, count, title)
   ```
2. Add placeholder to template:
   ```html
   {{AMAZON_FEATURED_NEW_TYPE}}
   ```
3. Update `generate-resource-pages.js` placeholder mapping
4. No CSS changes needed (uses same classes)

---

## Testing Checklist

- [ ] Desktop layout shows 3 columns
- [ ] Tablet layout adapts to screen width
- [ ] Mobile layout shows 1 column
- [ ] Hover effect lifts card and darkens shadow
- [ ] Button changes color on hover (#FF9900 → #EC7211)
- [ ] Title truncates at 2 lines with ellipsis
- [ ] Images display without distortion
- [ ] Responsive image heights (180px → 150px)
- [ ] Touch targets are 48px+ minimum
- [ ] Affiliate disclosure visible
- [ ] Links open in new tab
- [ ] All links have affiliate tag in URL
- [ ] Page loads without Flash of Unstyled Content (FOUC)
- [ ] CSS loads before images render
- [ ] Card styling consistent across all pages

---

## Browser Support

✅ Chrome/Chromium (latest)  
✅ Firefox (latest)  
✅ Safari (latest)  
✅ Edge (latest)  
✅ Mobile Safari (iOS 12+)  
✅ Chrome Mobile (Android 5+)  

**Notes:**
- Uses CSS Grid (modern browsers only, IE 11+ with fallback)
- Uses `-webkit-line-clamp` (widely supported)
- Uses `object-fit: contain` (IE 11+ with polyfill)
