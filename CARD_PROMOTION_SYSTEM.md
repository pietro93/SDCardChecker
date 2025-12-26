# SD Card Promotion System

**Purpose:** Easily promote high-commission SD cards across your site with flexible display controls  
**Status:** Ready to implement  
**Setup Time:** 5 minutes

---

## How It Works

### 1. **Configuration File** (`data/promoted-cards.json`)
Central control for which cards to promote and where they appear.

### 2. **Promotion Generator** (`scripts/generator/promotion-generator.js`)
Automatically generates beautiful promotional sections for device pages.

### 3. **Device Page Integration** 
Promotion sections appear on every relevant device page (can be toggled on/off instantly).

---

## Quick Start

### Step 1: Enable Promotion for Kingston Canvas React Plus SD

**File:** `data/promoted-cards.json`

Current config (already set up):
```json
{
  "enabled": true,
  "displayPosition": "above-faq",
  "promotedCards": [
    {
      "id": "kingston-canvas-react-sd",
      "name": "Kingston Canvas React Plus SD",
      "enabled": true,
      "displayOn": "all",
      "appliesTo": [],
      "excludeFrom": [],
      "reason": "Higher commission rate (uproot01-20 tag)",
      "badgeText": "Best Value V90",
      "badgeColor": "bg-blue-600"
    }
  ]
}
```

### Step 2: Integrate Into Device Pages

In `scripts/generator/generate-device-pages.js`:

```javascript
// At the top, add:
const { generatePromotedCardSection } = require('./promotion-generator');

// In device page generation, add promotion section before FAQ:
const promotionSection = generatePromotedCardSection(device, sdcards, false, getCardImageFallback);
const pageContent = pageTemplate.replace(
  '{{PROMOTED_CARDS_SECTION}}',
  promotionSection
);
```

In `src/templates/device.html`:

```html
<!-- Add this placeholder before FAQ section -->
{{PROMOTED_CARDS_SECTION}}

<!-- FAQ Section -->
<section id="faq" class="mb-16">
```

### Step 3: Rebuild & Deploy

```bash
npm run build:all
```

---

## Configuration Options

### Master Switch

```json
"enabled": true
```
- `true` = Promotions appear on all eligible pages
- `false` = No promotions displayed (fast toggle-off)

### Display Position

```json
"displayPosition": "above-faq"
```
Options:
- `"above-faq"` - Between recommendations and FAQ
- `"below-recommendations"` - Right after recommendation table
- `"sidebar"` - In sidebar (if available)
- `"bottom"` - Before related devices

### Per-Card Configuration

```json
{
  "id": "kingston-canvas-react-sd",
  "enabled": true,
  "displayOn": "all",
  "appliesTo": [],
  "excludeFrom": [],
  "badgeText": "Best Value V90",
  "badgeColor": "bg-blue-600"
}
```

#### Parameters

| Parameter | Options | Example |
|-----------|---------|---------|
| `id` | Card ID | `"kingston-canvas-react-sd"` |
| `enabled` | `true` / `false` | Turn card on/off instantly |
| `displayOn` | `"all"` / `"list"` / `"exclude"` | Where to show |
| `appliesTo` | Array of device IDs | `["canon-eos-r5", "nikon-d850"]` |
| `excludeFrom` | Array of device IDs | `["gopro-hero-13"]` (don't show on these) |
| `badgeText` | String | `"Best Value V90"` |
| `badgeColor` | Tailwind class | `"bg-blue-600"` |

---

## Display Rules

### Show on ALL Devices (Except Specified)

```json
{
  "id": "kingston-canvas-react-sd",
  "displayOn": "all",
  "excludeFrom": ["gopro-hero-13", "nintendo-switch"]
}
```

### Show on Specific Devices Only

```json
{
  "id": "kingston-canvas-react-sd",
  "displayOn": "list",
  "appliesTo": ["canon-eos-r5", "nikon-d850", "bmpcc-4k"]
}
```

### Show Everywhere (Default)

```json
{
  "id": "kingston-canvas-react-sd",
  "displayOn": "all",
  "excludeFrom": []
}
```

---

## Examples

### Example 1: Promote Kingston on ALL Pages

```json
{
  "enabled": true,
  "promotedCards": [
    {
      "id": "kingston-canvas-react-sd",
      "enabled": true,
      "displayOn": "all",
      "badgeText": "Best Value V90",
      "badgeColor": "bg-blue-600"
    }
  ]
}
```

**Result:** Every device page shows Kingston Canvas React Plus SD promotion

### Example 2: Promote Kingston ONLY on Cinema Cameras

```json
{
  "id": "kingston-canvas-react-sd",
  "displayOn": "list",
  "appliesTo": [
    "bmpcc-4k",
    "bmpcc-6k-pro",
    "sony-a1",
    "canon-eos-r5"
  ]
}
```

**Result:** Kingston appears only on professional cinema camera pages

### Example 3: Multiple Promoted Cards

```json
{
  "enabled": true,
  "promotedCards": [
    {
      "id": "kingston-canvas-react-sd",
      "enabled": true,
      "displayOn": "all",
      "badgeText": "Best Value V90",
      "badgeColor": "bg-blue-600"
    },
    {
      "id": "sandisk-extreme-pro-sd",
      "enabled": true,
      "displayOn": "list",
      "appliesTo": ["canon-eos-r5", "nikon-d850"],
      "badgeText": "Professional Grade",
      "badgeColor": "bg-red-600"
    }
  ]
}
```

**Result:** Kingston on all pages, SanDisk only on Canon/Nikon pages

### Example 4: Temporary Disable

```json
{
  "enabled": false,
  "promotedCards": [...]
}
```

**Result:** No promotions shown (instant disable without code changes)

---

## Visual Appearance

The promotion section displays as:

```
┌─────────────────────────────────────────────────────────────┐
│ 💡 Special Recommendation                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Card Image]  Kingston Canvas React Plus SD [V90 Badge]   │
│                                                             │
│                V90 • Up to 300 MB/s read                   │
│                • Up to 260 MB/s write                      │
│                                                             │
│                Best value V90 card.                         │
│                                                             │
│                [🛒 Check Price on Amazon]                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Tracking Promotion Performance

### UTM Parameters Added Automatically

Every promoted card link includes:
```
utm_source=sdcardchecker
utm_medium=promotion
utm_campaign=featured
```

This lets you track:
- Which promoted cards get clicks
- Conversion rate from promotions
- Commission revenue from promotions vs regular links

### Check Commission Reports

Look for:
- Traffic from `utm_medium=promotion`
- Difference between `utm_medium=device-page` (regular) vs `utm_medium=promotion`
- Revenue per promoted vs non-promoted card

---

## Common Use Cases

### Use Case 1: Rotate Promotions by Month

**January:** Promote Kingston
```json
"enabled": true
```

**February:** Promote SanDisk
```json
"promotedCards": [
  {
    "id": "sandisk-extreme-pro-sd",
    "enabled": true,
    "displayOn": "all"
  }
]
```

### Use Case 2: A/B Test Different Cards

Run two versions of your site with different promoted cards, track which gets higher conversion.

### Use Case 3: Season-Specific Promotions

**Holiday Season:** Promote budget cards
```json
"appliesTo": ["budget-conscious-devices"]
```

**Professional Season:** Promote V90 cards
```json
"appliesTo": ["professional-devices"]
```

### Use Case 4: Gradual Rollout

Start with limited devices, then expand:

**Week 1:** Test on 5 devices
```json
"displayOn": "list",
"appliesTo": ["canon-eos-r5", "nikon-d850", "bmpcc-4k", "sony-a1", "panasonic-lumix-s9"]
```

**Week 2:** If good performance, expand to 20 devices
```json
"displayOn": "list",
"appliesTo": [... 20 device IDs ...]
```

**Week 3:** Go to all devices
```json
"displayOn": "all"
```

---

## Adding New Promoted Cards

To promote a different card:

1. **Edit:** `data/promoted-cards.json`
2. **Change:** `"id"` field to desired card ID (from sdcards.json)
3. **Update:** `"badgeText"` and `"badgeColor"` if desired
4. **Set:** `"enabled": true`
5. **Set:** `"displayOn"` and display rules
6. **Rebuild:** `npm run build:all`

### Finding Card IDs

```bash
# Search sdcards.json for card IDs
grep "\"id\":" data/sdcards.json | head -20
```

Examples:
- `"kingston-canvas-react-sd"`
- `"sandisk-extreme-pro-sd"`
- `"lexar-professional-1000x"`
- `"sony-tough-g-v90"`

---

## Troubleshooting

### Promotion Not Appearing?

1. Check `"enabled": true` in promoted-cards.json
2. Check device ID matches actual device ID
3. Check displayOn rule includes the device
4. Rebuild with `npm run build:all`
5. Clear browser cache

### Promotion Appearing Everywhere (Didn't Want It)?

1. Check `"displayOn"` setting
2. Check `"excludeFrom"` list
3. Clear browser cache after rebuild

### Link Goes to Wrong Amazon Page?

1. Verify card ID is correct
2. Check `amazonDirectUrl` is set in sdcards.json
3. Verify ASIN is correct

---

## Performance Notes

- ✅ Minimal performance impact (single config file load)
- ✅ Cached by CDN (config file rarely changes)
- ✅ No additional database queries
- ✅ Promotional HTML generated during build time

---

## Integration Checklist

- [ ] Review `data/promoted-cards.json` structure
- [ ] Create `scripts/generator/promotion-generator.js`
- [ ] Update `scripts/generator/generate-device-pages.js` to use promotion generator
- [ ] Add `{{PROMOTED_CARDS_SECTION}}` placeholder to device templates
- [ ] Rebuild with `npm run build:all`
- [ ] Test promotion appears on device pages
- [ ] Monitor UTM tracking in analytics
- [ ] Adjust config based on performance

---

## Next Steps

1. **Review:** This document
2. **Customize:** `data/promoted-cards.json` with your preferences
3. **Integrate:** Add promotion section to device page generation
4. **Test:** Rebuild and verify promotion appears
5. **Launch:** Deploy and monitor performance
6. **Optimize:** Adjust display rules based on conversion data

---

**Status:** Ready to implement  
**Complexity:** Low (mostly configuration)  
**Time to Deploy:** 30 minutes  
**Revenue Impact:** Can boost commission by 10-25% for featured cards
