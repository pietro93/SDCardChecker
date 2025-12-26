# Promotion System - Quick Reference

**TL;DR:** Edit `data/promoted-cards.json` to control which cards appear where. Changes take effect after rebuild.

---

## The 3 Files

| File | Purpose | Edit Frequency |
|------|---------|-----------------|
| `data/promoted-cards.json` | Config: Which cards promote where | Often (change promotions) |
| `scripts/generator/promotion-generator.js` | Code: Generates HTML | Rarely (only for features) |
| Device pages HTML | Placeholder: Where it shows | Once (add `{{PROMOTED_CARDS_SECTION}}`) |

---

## Quickest Way to Change Promotions

### To Turn Off ALL Promotions:
```json
"enabled": false
```

### To Show Kingston on ALL Pages:
```json
"enabled": true,
"displayOn": "all",
"excludeFrom": []
```

### To Show Kingston ONLY on Camera Pages:
```json
"displayOn": "list",
"appliesTo": ["canon-eos-r5", "nikon-d850", "sony-a1"]
```

### To Show Different Card:
Change `"id"` to different card ID from `sdcards.json`

---

## Common edits

**Promote Kingston everywhere (current default):**
```json
{
  "enabled": true,
  "promotedCards": [
    {
      "id": "kingston-canvas-react-sd",
      "enabled": true,
      "displayOn": "all",
      "badgeText": "Best Value V90"
    }
  ]
}
```

**Promote Kingston + SanDisk (different devices):**
```json
{
  "enabled": true,
  "promotedCards": [
    {
      "id": "kingston-canvas-react-sd",
      "enabled": true,
      "displayOn": "all"
    },
    {
      "id": "sandisk-extreme-pro-sd",
      "enabled": true,
      "displayOn": "list",
      "appliesTo": ["canon-eos-r5", "nikon-d850"]
    }
  ]
}
```

**Rotate: Kingston this month, SanDisk next month:**
```json
{
  "enabled": true,
  "promotedCards": [
    {
      "id": "kingston-canvas-react-sd",
      "enabled": true,  // ← Change true/false to rotate
      "displayOn": "all"
    },
    {
      "id": "sandisk-extreme-pro-sd",
      "enabled": false  // ← Change false/true to rotate
      "displayOn": "all"
    }
  ]
}
```

---

## Card IDs (Find in sdcards.json)

Common high-commission cards:
- `kingston-canvas-react-sd` - V90 budget V90 option
- `sandisk-extreme-pro-sd` - Premium V90
- `sony-tough-g-v90` - Durable V90
- `lexar-professional-1000x` - Professional speed
- `samsung-pro-plus` - Fast microSD

---

## After Editing `promoted-cards.json`

```bash
npm run build:all
```

That's it! Promotion appears on next page load.

---

## How It Looks

Beautiful amber banner with:
- 💡 Special Recommendation header
- Card image
- Name + badge (e.g., "Best Value V90")
- Specs (V90, speeds)
- Pros text
- "Check Price on Amazon" button
- Your affiliate link with higher commission tag

---

## Tracking

All promotion links include:
```
?utm_source=sdcardchecker&utm_medium=promotion&utm_campaign=featured
```

Check your Amazon affiliate dashboard for clicks from `utm_medium=promotion` to see how it's performing.

---

## Examples in One Minute

**Show Kingston on everything:**
```json
"displayOn": "all"
"excludeFrom": []
```

**Show Kingston only on cinema cameras:**
```json
"displayOn": "list",
"appliesTo": ["bmpcc-4k", "bmpcc-6k-pro", "canon-eos-r5"]
```

**Show Kingston on everything EXCEPT gaming devices:**
```json
"displayOn": "all",
"excludeFrom": ["nintendo-switch", "steam-deck", "orange-pi-5"]
```

**Multiple promotions (Kingston + SanDisk):**
```json
"promotedCards": [
  { "id": "kingston-...", "enabled": true, "displayOn": "all" },
  { "id": "sandisk-...", "enabled": true, "displayOn": "list", "appliesTo": [...] }
]
```

---

**Need more detail?** Read: `CARD_PROMOTION_SYSTEM.md`
