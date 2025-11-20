# Adapter Pattern Implementation - SDCardChecker Migration

## Overview
The site has been migrated to use an **Adapter Pattern** that allows the new Series-based JSON format to work seamlessly with all existing templates and code that expects the old flat card format. This eliminates breaking changes while supporting both old and new data structures.

## What Changed

### 1. New Adapter in `scripts/generator/helpers.js`
Added `loadSDCardData()` function that:
- Reads sdcards.json (either old flat format or new Series format)
- Detects the format automatically by checking for `specs` object
- Creates adapter cards that expose both:
  - **Top-level properties** for backward compatibility (e.g., `card.speed`, `card.writeSpeed`)
  - **Nested specs** for new code (e.g., `card.specs.speedClass`)
- Maps capacity ranges to both `capacityGB` (single value) and `capacityString` (display format)
- Converts price symbols ($$, $$$) to numeric estimates for legacy code

### 2. Updated `scripts/generator/generate-device-pages.js`
- Removed local `loadSDCardData()` function (now imported from helpers)
- Updated price display to use `priceSymbol` when available
- Price badge now shows: `$$ (Mid-Range)` instead of `$45`

### 3. Updated `src/js/calculator-card-recommendations.js`
- `formatCard()` now reads from nested `specs` object with fallback to flat format
- `filterBySpeedClass()` handles both `card.specs.speedClass` and `card.speed`
- Capacity display shows range: "64GB - 512GB" when `availableCapacities` is present
- Price tier symbol uses `priceSymbol` from JSON directly

### 4. Updated `check-card-images.js`
- Added comment noting it supports both formats
- No functional changes needed; already works with both

## Data Format Support

### Old Flat Format (Still Works)
```json
{
  "id": "sandisk-extreme-microsd",
  "name": "SanDisk Extreme microSD",
  "speed": "V30",
  "writeSpeed": "90MB/s",
  "uhs": "UHS-I",
  "capacity": "256GB"
}
```

### New Series Format (Now Works)
```json
{
  "id": "sandisk-extreme-microsd",
  "name": "SanDisk Extreme microSD",
  "type": "microSD",
  "specs": {
    "speedClass": "V30",
    "writeSpeed": "90MB/s",
    "uhs": "UHS-I"
  },
  "availableCapacities": [64, 128, 256, 512],
  "priceSymbol": "$$",
  "priceTier": "Mid-Range"
}
```

## How It Works

When `loadSDCardData()` runs:

1. Reads new Series-format JSON
2. Checks if `series.specs` exists
3. If new format: maps `specs.speedClass` → `speed`, `specs.writeSpeed` → `writeSpeed`, etc.
4. If old format: uses properties directly
5. Returns a `cardMap` where each entry is an adapter card with both properties available

This means **all existing template code continues to work without changes**:
- `card.speed` ✓ Works (either from specs.speedClass or flat property)
- `card.writeSpeed` ✓ Works (either from specs.writeSpeed or flat property)
- `card.amazonSearchUrl` ✓ Works (top-level in both formats)

## Backward Compatibility Matrix

| Code | Old Format | New Format |
|------|-----------|-----------|
| `card.speed` | Direct ✓ | Mapped from `specs.speedClass` ✓ |
| `card.writeSpeed` | Direct ✓ | Mapped from `specs.writeSpeed` ✓ |
| `card.uhs` | Direct ✓ | Mapped from `specs.uhs` ✓ |
| `card.priceEstimate` | Direct ✓ | Generated from `priceSymbol` ✓ |
| `card.priceSymbol` | N/A | Direct ✓ |
| `card.availableCapacities` | N/A | Direct ✓ |
| `card.capacity` | Direct ✓ | Generated from `availableCapacities` ✓ |
| `card.specs` | Undefined | Direct ✓ |

## devices.json - No Changes Needed

The file continues to reference cards by ID exactly as before:
```json
{
  "recommendedBrands": [
    { "id": "sandisk-extreme-microsd" },
    { "id": "lexar-professional-1000x" }
  ]
}
```

The adapter pattern ensures these IDs work whether the card is in old or new format.

## Testing the Migration

1. **Generate device pages**: `node scripts/generator/generate-pages.js`
   - Should work with both old and new JSON formats
   - Should display prices as symbols ($$, $$$) instead of numeric values

2. **Check calculator**: Open any device page and trigger calculator
   - Should recommend cards with correct speed classes
   - Should display capacity ranges ("64GB - 512GB")

3. **Verify image fallbacks**: Check that cards show proper images or fallback placeholders

## Benefits

✓ **Zero breaking changes** - All existing code works unchanged
✓ **Gradual migration** - Can convert cards one at a time
✓ **Cleaner data** - New format is more organized and maintainable
✓ **Better UX** - Can display capacity ranges and more detailed specs
✓ **Future-proof** - Code can check `card.specs` for advanced features

## Next Steps

1. **Convert sdcards.json** to new Series format gradually
2. **Update templates** to use new properties as desired (e.g., show all `availableCapacities`)
3. **Enhance device pages** with additional spec details from the new format
4. **Retire old properties** once all cards are converted (optional - adapter continues to work)
