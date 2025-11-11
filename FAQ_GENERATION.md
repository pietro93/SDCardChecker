# FAQ Generation System

## Overview

FAQs are now **generated programmatically** based on device specifications. Each device gets unique, contextual answers that reference its actual specs (speed class, capacity, type, etc.).

## How It Works

### Automatic FAQ Generation (`generateFAQs.js`)

The system generates device-specific answers for these common questions:

1. **Speed Class Requirements** (if applicable)
   - Example: "Is V30 required for GoPro Hero 13?"
   - Uses: `minSpeed`, `minWriteSpeed`, device name

2. **Storage Capacity**
   - Example: "What storage capacity should I get for GoPro Hero 13?"
   - Uses: `recommendedCapacity`, `maxCapacity`

3. **Older/Slower Cards Compatibility**
   - Varies based on whether `minSpeed` has requirements
   - For demanding devices: "Not recommended. Cards slower than V30 may cause..."
   - For flexible devices: "Yes, any microSD card works..."

4. **Card Type Compatibility** (if multiple types supported)
   - Example: "Does the card type matter for Nintendo Switch?"
   - Uses: `type` field, lists all accepted types

5. **UHS Cards Question** (if applicable)
   - Example: "Do I need a UHS card for GoPro Hero 13?"
   - Uses: UHS version from `type` field

6. **Professional/Dual Cards** (for demanding/multi-card devices)
   - Explains redundancy benefits for professional use

7. **Brand Reliability**
   - Generic advice on trusted brands

8. **Wrong Card Consequences** (if speed requirements exist)
   - Lists specific risks (dropped frames, corrupted files, etc.)

9. **Card Lifespan**
   - Maintenance and replacement advice

## Custom FAQ Override

You can still provide custom FAQs in `devices.json`. Custom FAQs take priority:

```json
{
  "id": "gopro-hero-13",
  "name": "GoPro Hero 13",
  "sdCard": { ... },
  "faq": [
    {
      "q": "Is V30 required for GoPro Hero 13?",
      "a": "Your custom answer here - overrides generated one"
    }
  ]
}
```

**How merging works:**
- Custom FAQs are included as-is
- Generated FAQs that match a custom question (by comparing text) are skipped
- All non-matching generated FAQs are added
- Result: custom FAQs + unique generated FAQs

## Data Requirements

For FAQ generation to work properly, each device should have:

```json
{
  "name": "Device Name",
  "sdCard": {
    "type": "microSD UHS-II" or "SD, microSD" (comma-separated),
    "minSpeed": "V30" or "No minimum required",
    "minWriteSpeed": "30 MB/s",
    "recommendedCapacity": ["128GB", "256GB"],
    "maxCapacity": "512GB"
  },
  "recommendedBrands": [
    { "id": "brand-id" }
  ]
}
```

## Examples

### Device with Speed Requirements (GoPro Hero 13)
- **Input**: V30, microSD UHS-II, 128GB-256GB, 512GB max
- **Generated**: 8+ FAQs addressing speed, capacity, compatibility, risks
- **Output**: Specific, actionable answers using actual specs

### Device with No Speed Requirements (Nintendo Switch)
- **Input**: No minimum, microSD/microSDHC/microSDXC, 64GB-256GB, 2TB max
- **Generated**: 5+ FAQs focused on flexibility and capacity
- **Output**: Different tone (permissive) vs demanding devices

## Integration

In `generate-device-pages.js`:

```javascript
// Generate FAQs: use custom FAQs from data, or generate programmatically
const generatedFAQs = generateFAQs(device, sdcardsMap);
const finalFAQs = device.faq ? mergeFAQs(device.faq, generatedFAQs) : generatedFAQs;
const faqHTML = generateFAQHTML(finalFAQs);
```

## Customization

To modify generated FAQ templates, edit `scripts/generator/generateFAQs.js` and update the question/answer strings in the `generateFAQs()` function.

Each FAQ is an object: `{ q: "Question?", a: "Answer text" }`

Use these variables:
- `device.name` - Device name
- `device.sdCard.type` - Card type (e.g., "microSD UHS-II")
- `device.sdCard.minSpeed` - Speed class (e.g., "V30")
- `device.sdCard.minWriteSpeed` - Write speed (e.g., "30 MB/s")
- `device.sdCard.recommendedCapacity` - Array of sizes
- `device.sdCard.maxCapacity` - Maximum size
- `device.category` - Device category
- `isDemandingDevice` - Boolean (true if V60/V90/U3)
- `isNoSpeedRequired` - Boolean
