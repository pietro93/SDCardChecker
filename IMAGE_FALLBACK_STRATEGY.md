# Image Fallback Strategy - SD Card Recommendations

## Problem Statement
Current fallback images are generic and don't communicate card specs effectively. Users see a blank/generic image when card image is missing, losing valuable information.

## Current System
- Generic placeholders based on type and UHS level
- No speed class indication
- No visual hierarchy
- Doesn't help user understand why we recommend THIS card

## Proposed: Smart Visual Fallbacks

### Design Principles
1. **Speed class prominent** - Color coding immediately shows card capability
2. **Form factor clear** - Shape/icon shows type (microSD vs SD)
3. **Consistency** - Same speed class = same color across all cards
4. **Information dense** - Communicates tier without needing text

---

## Fallback Image Naming Convention

```
/img/cards/fallback-[TYPE]-[SPEED]-[TIER].webp
```

### Dimensions
- 180x180px (matches product images)
- 1.5x density for retina (270x270px)

### Variants

#### By Speed Class (Primary Color)
```
V6   → Green   (#10B981)   - Entry level
V30  → Blue    (#3B82F6)   - General use
V60  → Purple  (#A855F7)   - Professional
V90  → Red     (#EF4444)   - Premium/Cinema
```

#### By Type (Icon/Badge)
```
microSD        → Small card icon, rounded
SD             → Standard card icon, rectangular  
CFast          → Compact flash shape
CFexpress      → Modern rectangular
XQD            → Sony professional format
```

#### By Tier (Optional Badge)
```
Budget         → Dollar sign ($)
Mid-Range      → Double dollar ($$)
Premium        → Triple dollar ($$$)
Specialty      → Star or specialty icon
```

---

## Implementation Details

### Option A: Simple Color-Based (Easiest)
**Files needed:** 8 base images
- fallback-microsd-v6.webp
- fallback-microsd-v30.webp
- fallback-microsd-v60.webp
- fallback-microsd-v90.webp
- fallback-sd-v6.webp
- fallback-sd-v30.webp
- fallback-sd-v60.webp
- fallback-sd-v90.webp

**Design:** 
- Solid color background (speed class)
- White card silhouette (centered)
- Speed class label (V30, V60, V90)
- Form factor label (microSD, SD)

---

### Option B: Icon + Color (Recommended)
**Files needed:** 16+ images
- Each type × each speed class
- Add badge area for specialty types

**Design:**
- Color background (speed class)
- Detailed card icon (form factor)
- Speed class badge (corner)
- UHS level indicator (bottom)

Example: `fallback-microsd-uhs2-v90.webp`
- Purple background (V90)
- microSD icon (small rounded shape)
- V90 badge (top right)
- UHS-II label (bottom)

---

### Option C: Brand-Aware (Advanced)
**Files needed:** 47 custom designs
- One for each card model
- Extract brand color from official branding
- Incorporate brand logo outline

**Design:**
- Brand color + accent color
- Brand logo (watermark style)
- Speed class indicator
- Form factor

---

## Recommended Approach: Option B (Hybrid)

### Fallback Structure
```
/img/cards/
├── fallback-base/
│   ├── microsd-v6.webp       (Green microSD)
│   ├── microsd-v30.webp      (Blue microSD)
│   ├── microsd-v60.webp      (Purple microSD)
│   ├── microsd-v90.webp      (Red microSD)
│   ├── sd-v6.webp            (Green SD)
│   ├── sd-v30.webp           (Blue SD)
│   ├── sd-v60.webp           (Purple SD)
│   ├── sd-v90.webp           (Red SD)
│   ├── cfast-v60.webp
│   ├── cfast-v90.webp
│   ├── cfexpress-v90.webp
│   └── xqd-v90.webp
└── placeholder.webp           (Global default)
```

### Updated Fallback Logic
```javascript
static getSmartFallback(card) {
    const typeMap = {
        'microSD': 'microsd',
        'SD': 'sd',
        'CFast': 'cfast',
        'CFexpress': 'cfexpress',
        'XQD': 'xqd'
    };

    // Extract base speed class
    const speedMatch = card.speed.match(/V\d+/);
    const speed = speedMatch ? speedMatch[0] : 'v30'; // Default to V30
    
    const type = typeMap[card.type] || 'generic';
    const filename = `${type}-${speed.toLowerCase()}`;
    
    return `/img/cards/fallback-base/${filename}.webp`;
}
```

---

## Visual Mockups

### Current (Generic)
```
┌─────────────────┐
│                 │
│   [Generic]     │  ← User doesn't know: What speed? What type?
│                 │
└─────────────────┘
```

### Proposed (Option B)
```
┌──────────────────┐
│  [V90 Badge]     │
│  ┌────────────┐  │
│  │   🔴       │  │  ← Red background = V90
│  │  microSD   │  │  ← Icon shows type
│  │ [UHS-II]   │  │  ← Shows UHS standard
│  └────────────┘  │
└──────────────────┘
```

---

## Color Palette

### Speed Class Colors (Accessible)
```css
--v6:  #10B981  /* Green  - Safe, basic */
--v30: #3B82F6  /* Blue   - Standard, reliable */
--v60: #A855F7  /* Purple - Advanced, professional */
--v90: #EF4444  /* Red    - High performance, premium */
```

**Accessibility:** All colors pass WCAG AA with white text

---

## Migration Path

### Phase 1: Quick Win (Week 1)
- Create 8 basic microSD + SD fallbacks (V6, V30, V60, V90)
- Update fallback logic for these two form factors
- Rest fall back to generic placeholder

### Phase 2: Full Coverage (Week 2)
- Add CFast, CFexpress, XQD variants
- Test with all speed classes
- Monitor actual image load failures to validate

### Phase 3: Polish (Optional)
- Add UHS level badges
- Add tier indicator (Budget/Premium)
- Create brand-specific variants for top 10 cards

---

## Estimated Effort

**Option A (Simple):** 1-2 hours
- 8 basic color swatches
- Design text + speed badges
- Implement new fallback logic

**Option B (Recommended):** 4-6 hours
- Design icons for each type
- Color coding system
- Create 12-16 images
- Test fallback logic

**Option C (Advanced):** 16+ hours
- Research brand colors
- Design 47 card-specific images
- Integrate brand logos
- A/B test for UX impact

---

## Success Metrics

- [ ] Card recommendations load with proper fallback images
- [ ] No more generic/placeholder images visible in calculator results
- [ ] Speed class visible at glance from fallback color
- [ ] Form factor clear from image (microSD ≠ SD visually)
- [ ] Mobile users see same quality as desktop
- [ ] Image load time < 100ms

---

## Tools Recommendation

**For quick creation:**
- Figma (design mockups)
- Batch image generation script
- ImageMagick or Python PIL for automation

**Template approach:**
1. Create Figma component
2. Export 12-16 variants
3. Optimize with WebP compression
4. Deploy to `/img/cards/fallback-base/`

