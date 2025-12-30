# Icon Replacement Audit - English Version

## Available New Icons
Located in `img/brand/`:
- `icon-sdcard.webp` - Full-size SD card
- `icon-microsd.webp` - MicroSD card
- `icon-card-reader.webp` - Card reader device

---

## PRIORITY 1: Direct Icon Usage (Immediate Replacement)

### 1. Tools Page - Calculator Section Header
**File:** `src/templates/tools.html:76`
- **Current:** `<span class="text-2xl">🧮</span>`
- **Status:** Use existing device icon set instead (no direct replacement)
- **Note:** Consider using `icon-card-reader.webp` or keep emoji since it's specifically a calculator symbol

### 2. Tools Page - Calculator Cards
**File:** `src/data/calculators.json`
Lines to update:
- L6: `"title": "🎥 Video Storage & Recording Time"` → Keep emoji (no card/reader icon)
- L15: `"title": "📷 Photo Storage & Capacity"` → Keep emoji (no card/reader icon)
- L24: `"title": "🚁 Drone Recording Time & Storage"` → Keep emoji (no card/reader icon)
- L33: `"title": "📹 Security Camera Recording Time"` → Keep emoji (no card/reader icon)
- L42: `"title": "🚗 Dashcam Storage & Loop Time"` → Keep emoji (no card/reader icon)
- L51: `"title": "🎬 Action Camera Storage & Capacity"` → Keep emoji (no card/reader icon)
- L60: `"title": "📸 GoPro Recording Time & Storage"` → Keep emoji (no card/reader icon)
- L69: `"title": "⏱️ Timelapse Storage & Photo Count"` → Keep emoji (no card/reader icon)

**Recommendation:** These are device-specific emojis. Consider adding a wrapper icon or badge showing the SD card type needed.

---

## PRIORITY 2: SD Card/MicroSD Usage Opportunities

### Pages mentioning "SD Card" or "MicroSD"

#### a. Guides Index Page
**File:** `src/templates/guides/index.html`
- **L151-153 (SDHC Card Type):** Add icon next to "SDHC (4GB-32GB)"
  - Can show `icon-sdcard.webp` badge
- **L155-158 (SDXC Card Type):** Add icon next to "SDXC (32GB-2TB)"
  - Can show `icon-sdcard.webp` badge
- **L160-163 (microSD Card Type):** Add icon next to "microSD"
  - Should use `icon-microsd.webp` badge

#### b. Where Card Types Are Discussed
Search results show these files discuss SD card types:
- `src/templates/guides/sd-card-guide.html` - Full discussion of card types
- `src/templates/guides/nintendo-switch-sd-card-guide.html` - microSD focus
- Other guide pages

---

## PRIORITY 3: Card Reader Icon Usage Opportunities

### Files Discussing Card Readers:
- `src/templates/guides/readers-index.html` - Main readers guide
- `src/templates/guides/readers-photographers.html`
- `src/templates/guides/readers-android.html`
- `src/templates/guides/readers-iphone.html`
- `src/templates/guides/readers-macbook.html`

**Recommendation:** 
- Add `icon-card-reader.webp` to the header or hero section of reader guide pages
- Show it in product recommendation cards where readers are featured
- Use it as a visual indicator next to "reader" terminology

---

## SPECIFIC EMOJI REPLACEMENTS BY CATEGORY

### Storage-Related Emojis (Consider replacing with icon variants)
- 💾 (storage) → No direct replacement
- 📦 (package) → No direct replacement
- 🎯 (value/target) → No direct replacement
- 💰 (budget) → No direct replacement
- ⚡ (speed) → No direct replacement
- 📊 (analytics) → No direct replacement

### Device-Type Emojis (These should stay as emojis)
- 📱 (phone) - Used for mobile content
- 📷 (camera) - Photography context
- 🎥 (video) - Video recording
- 🎮 (gaming) - Nintendo Switch
- 🚁 (drone) - Drone content
- 🚗 (dashcam) - Vehicle recording
- 🔒 (security) - Security cameras

### Action Emojis (Consider replacing with branded icons)
- 🔍 (search) - Could use search icon from Font Awesome
- 🛒 (shopping) - Could use shopping bag icon
- 📖 (guide) - No direct replacement

---

## IMPLEMENTATION PLAN

### Phase 1: Quick Wins
1. **Add SD Card Icon to Card Types Section** (`guides/index.html`)
   - HTML structure: Add inline image badges for SDHC, SDXC, microSD descriptions

2. **Add Card Reader Icon to Reader Guides**
   - `readers-index.html` header/hero
   - Product cards in photographer/android/iPhone/macBook guides

### Phase 2: Enhanced Integration
3. **Create Icon Badge Component** 
   - Reusable component for display
   - Consistent sizing and styling (48x48px or 64x64px)
   - Light/dark mode consideration

4. **Update All Card Type References**
   - Search for "SDHC", "SDXC", "microSD" mentions
   - Add appropriate icon next to text

### Phase 3: Calculator Enhancement
5. **Add Card Requirement Indicators to Calculators**
   - Show which card type is recommended
   - Visual indicator using `icon-sdcard.webp` or `icon-microsd.webp`

---

## FILES TO MODIFY (Ordered by Priority)

### High Priority
1. `src/templates/guides/index.html` - Add icons to card types section (L150-170)
2. `src/templates/guides/readers-index.html` - Add reader icon to header
3. `src/templates/guides/sd-card-guide.html` - Add card icons throughout

### Medium Priority
4. `src/templates/guides/nintendo-switch-sd-card-guide.html` - microSD emphasis
5. `src/templates/guides/readers-photographers.html` - Reader context
6. `src/templates/guides/readers-android.html` - Reader context
7. `src/templates/guides/readers-iphone.html` - Reader context
8. `src/templates/guides/readers-macbook.html` - Reader context

### Lower Priority
9. Various calculator pages for context enhancement
10. Other guide pages as needed

---

## STYLING RECOMMENDATIONS

### Icon Display Size
- **Large (Hero/Headers):** 80-120px
- **Medium (Section headers):** 48-64px  
- **Small (Inline badges):** 24-32px

### CSS Classes (Suggested)
```css
.icon-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.icon-badge img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.icon-inline {
  display: inline;
  width: 24px;
  height: 24px;
  margin: 0 0.25rem;
  vertical-align: middle;
}
```

---

## Emoji Retention
The following emojis should be retained (no suitable icon replacement):
- 🎯, 💰, ⚡, 📊, 🎥, 📸, 🚁, 🚗, 📹, 🔒, 📱, 🎮, 🔍, 📖, 🧮, 🎬, ⏱️

These provide visual context that generic SD card/reader icons cannot replicate.

---

## Summary
- **3 new icons available:** SD card, MicroSD, Card Reader
- **Best opportunities:** Card type descriptions, reader guide headers, product recommendation cards
- **Estimated files to modify:** 8-12 primary files
- **Estimated total replacements:** 15-25 individual icon insertions
