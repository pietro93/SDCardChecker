# FAQ System Improvements

## Overview
Refactored the FAQ system to generate common questions computationally while preserving device-specific FAQs. This reduces data duplication and makes the system more maintainable.

## Changes Made

### 1. FAQ Generator (`src/utils/faqGenerator.ts`)
Automatically generates 6 types of SEO-optimized FAQs:

#### Generated FAQ #1: "What SD card do I need?"
**Improvement**: Now context-aware and device-specific
- **Before**: Generic answer combining specs
- **After**: 
  - For cameras: "professional video capture"
  - For drones: "flight and 4K video recording"
  - For consoles: "game library storage"
  - Includes capacity recommendations
  - Emphasizes trusted brands

#### Generated FAQ #2: "What is the minimum speed rating needed?"
- Targets specific use cases (dropped frames, file corruption, etc.)
- Explains the sustained write speed requirement

#### Generated FAQ #3: "Can I use any [card type]?"
- Compatibility question with brand recommendations
- Conditional answer based on speed requirements

#### Generated FAQ #4: "How much storage should I get?"
- Context-aware (professional vs casual use)
- Includes max capacity and usage guidance

#### Generated FAQ #5: "What are the recommended brands?"
- Lists trusted brands (SanDisk, Lexar, Kingston, Crucial)
- Category-specific reliability messaging

#### Generated FAQ #6: "Do I need UHS-II?"
- Compares UHS-I vs UHS-II
- Device-specific answers

### 2. Data Structure (`data/devices.json`)
**File size reduction**: ~50% smaller
- Removed generic hardcoded FAQs
- Kept only device-specific FAQs (e.g., "Can I use my phone's card?", "Do I need two cards?")

### 3. React Hook (`src/hooks/useFAQ.ts`)
- `useFAQ(device)` merges device-specific + generated FAQs
- Device-specific FAQs appear first
- Memoized for performance

### 4. UI Components

#### FAQSection Component (`src/components/FAQSection.tsx`)
- Expandable FAQ accordion
- Sanitizes HTML from FAQ answers
- Shows complete merged FAQ list

#### Similar Devices Section Updates (`src/js/generator.js`)
**Improvements**:
- Heading: "Similar Devices You Might Also Need Cards For" → "Similar Devices"
- Added device images with proper cropping
- Images use `object-fit: cover` to crop centered content
- Responsive grid layout

### 5. CSS Updates (`src/css/modern.css`)
**Device Card Styling**:
```css
.device-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.device-card-image {
  width: 100%;
  height: 160px;
  overflow: hidden;
  /* Crops images without resizing */
  background: #f8f8f8;
}

.device-card-image img {
  object-fit: cover;
  width: 100%;
  height: 100%;
  object-position: center;
}
```

## Benefits

1. **SEO**: Better, context-aware answers optimized for search
2. **Maintainability**: Single source of truth for common FAQs
3. **Scalability**: Adding new devices auto-generates FAQs
4. **Data Reduction**: 50% smaller JSON file
5. **Consistency**: Same high-quality answers across all similar devices
6. **Performance**: Memoized FAQ generation

## Device-Specific FAQs Retained

Examples of FAQs that stay in `devices.json`:
- "Can I use a phone's microSD card?" (Switch only)
- "Does the card need to be formatted?" (Switch only)
- "Do I need two cards?" (Professional cameras)
- "Is there a speed difference between models?" (OLED vs Original)
- "Can I use V20 cards?" (Drones - device-specific bitrate)
- "What's the difference between CFast and SD?" (Canon R5 only)
- "Is V30 needed for 360 video?" (GoPro Max only)

## Implementation Notes

### FAQ Order
Device-specific FAQs appear first, followed by generated FAQs. This ensures unique, important questions take priority.

### Image Cropping
- Uses `object-fit: cover` instead of resizing
- `object-position: center` ensures centered crop
- 160px height provides good thumbnail visibility
- Graceful fallback to gray background if image missing

### Type Safety
- TypeScript interfaces for Device, SDCardSpecs, FAQ
- Null checks for all generator functions
- Optional FAQ array in Device type

## Testing

### To verify FAQ generation:
```typescript
import { generateFAQs } from '@/utils/faqGenerator';
import { Device } from '@/types/devices';

const device = devices[0];
const faqs = generateFAQs(device);
console.log(faqs); // Shows all 6 generated FAQs
```

### To verify merged FAQs:
```typescript
import { useFAQ } from '@/hooks/useFAQ';

const allFAQs = useFAQ(device);
// allFAQs[0] = device-specific FAQ
// allFAQs[n-5 to n] = generated FAQs
```

## Files Modified

1. `src/utils/faqGenerator.ts` - Created
2. `src/hooks/useFAQ.ts` - Created
3. `src/types/devices.ts` - Created
4. `src/components/FAQSection.tsx` - Created
5. `data/devices.json` - Refactored
6. `src/js/generator.js` - Updated similar devices section
7. `src/css/modern.css` - Added device card image styles

## Future Enhancements

1. Add more generated FAQ types for specific scenarios
2. Implement A/B testing on generated answers
3. Add structured data (schema.org FAQPage) generation
4. Generate comparison FAQs across related devices
5. Add localization support to generators
