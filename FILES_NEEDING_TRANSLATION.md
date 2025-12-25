# Files Requiring Translation - Detailed Breakdown

## 1. SD CARDS DATA
**File:** `data/sdcards.json`  
**Type:** JSON - Product catalog  
**Status:** 100% English, 0% translated

### What to translate:
- **`pros`** field in each card object
- **`description`** field (if present)

### Examples from file:
```json
{
  "id": "sandisk-extreme-pro-sd-uhs2",
  "name": "SanDisk Extreme PRO SD UHS-II",
  "speed": "V90",
  "writeSpeed": "Up to 260 MB/s",
  "pros": "Professional standard for weddings and cinema.",  // ← TRANSLATE
  "priceEstimate": 100,
  "tier": "professional"
}

{
  "id": "lexar-professional-1000x-sd",
  "pros": "Cheapest entry into UHS-II.",  // ← TRANSLATE
  ...
}

{
  "id": "sony-tough-g-v90",
  "pros": "Indestructible one-piece mold. Fastest write speeds.",  // ← TRANSLATE
  ...
}
```

### Approximate count: **50-100 entries**
### Sample to translate:
1. "Professional standard for weddings and cinema." → "ウェディングとシネマ撮影の業界標準。"
2. "Cheapest entry into UHS-II." → "UHS-IIへの最も安い入門。"
3. "Indestructible one-piece mold. Fastest write speeds." → "壊れない一体成型。最速の書き込み速度。"

---

## 2. DEVICE FAQ ANSWERS
**File:** `data/devices-ja.json`  
**Type:** JSON - Device specifications with FAQs  
**Status:** ~20% translated, 80% English

### What to translate:
- **`faq.q`** - Question (many still in English)
- **`faq.a`** - Answer (95% in English)

### Example device with untranslated FAQ:
```json
{
  "id": "panasonic-lumix-s9",
  "name": "Panasonic Lumix S9",
  "faq": [
    {
      "q": "Is the Lumix S9 a good camera for vlogging and content creation?",  // ← TRANSLATE TO JAPANESE
      "a": "<b>Yes, the Lumix S9 is specifically designed as Panasonic's most compact full-frame camera for content creators.</b> It features excellent in-body image stabilization..."  // ← TRANSLATE TO JAPANESE
    }
  ]
}
```

### What's been translated:
- Panasonic Lumix S9 - `whySpecs` and FAQ question/answer (recently done)

### What still needs translation:
- ~139 other devices' FAQ sections
- Questions and answers in English

### Approximate count: **700-1000 FAQ items** (avg 5-7 per device × 140 devices)

### Sample entries needing translation:

**Device: Canon EOS R5**
```
Q: "What SD Card Do I Need for Canon EOS R5?"
A: "The Canon EOS R5 requires a CompactFlash Type II or CFast card..."

↓ TRANSLATE TO ↓

Q: "Canon EOS R5にはどのSDカードが必要ですか？"
A: "Canon EOS R5にはCompactFlash Type IIまたはCFastカードが必要です..."
```

**Device: Sony A7 IV**
```
Q: "Is the Sony A7 IV good for video recording?"
A: "Yes, the Sony A7 IV has excellent 4K video capabilities..."

↓ TRANSLATE TO ↓

Q: "Sony A7 IVはビデオ録画に適していますか？"
A: "はい、Sony A7 IVは優れた4K ビデオ機能を備えています..."
```

---

## 3. DEVICE NOTES/DESCRIPTIONS
**File:** `data/devices-ja.json`  
**Type:** JSON - Meta information  
**Status:** 100% English

### What to translate:
- **`notes`** field - Device background/context
- **`whySpecs`** field - Explanation of specs (partially done for some devices)

### Example:
```json
{
  "id": "canon-eos-r5",
  "notes": "Flagship professional camera from Canon. Released in 2020..."  // ← TRANSLATE
}

{
  "id": "nikon-z9",
  "whySpecs": "Nikon's top-tier mirrorless for professionals..."  // ← TRANSLATE
}
```

### Approximate count: **140 devices × 1-2 fields = 140-280 entries**

---

## 4. AMAZON PRODUCT DATA
**Files:**
- `data/amazon-cache/featured-general.json`
- `data/amazon-cache/guide-professional-cameras.json`
- `data/amazon-cache/calculator-recommended.json`
- (other category-specific files)

**Type:** JSON - Cached Amazon product information  
**Status:** 100% English (from Amazon API)

### What to translate:
- **`title`** - Product names (may want to filter for Japanese market products instead)
- **`description`** - Product description
- **`category`** - Category label

### Example:
```json
{
  "id": "sandisk-extreme-pro-sd-uhs2",
  "title": "SanDisk Extreme PRO SD UHS-II",  // Keep English (brand)
  "description": "Professional grade SD card with 260 MB/s write speeds...",  // ← TRANSLATE OR FILTER
  "category": "Professional SD Cards",  // ← TRANSLATE
  "url": "https://amazon.com/..."
}
```

### Issue:
Amazon API returns English titles for all regions. Options:
1. Translate titles with API (add cost)
2. Filter to show Japanese market products only (manual setup)
3. Keep English (current approach)

### Approximate count: **50-200 products** (varies by category)

---

## 5. CALCULATOR CONTENT
**File:** `data/calculator-content.json`  
**Type:** JSON - UI content for calculators  
**Status:** Unknown (need to verify)

### What to translate (estimated):
- Input field labels
- Slider descriptions
- Result explanations
- Help tooltips

### Approximate count: **50-100 entries**

---

## 6. SD CARD READERS DATA
**File:** `data/sdCardReaders.json`  
**Type:** JSON - Reader device specs  
**Status:** 100% English

### What to translate (if needed):
- Device descriptions
- FAQ answers
- Compatibility notes

### Note: This category may not be enabled for Japanese site yet

### Approximate count: **30-50 entries**

---

## Translation Dependency Graph

```
Website UI (✅ DONE)
    ↓
Device Pages
    ├── Requirements Box (✅ DONE)
    ├── Specs Grid (✅ DONE)
    ├── Brands Table (✅ DONE)
    │   └── sdcards.json `pros` (❌ NEEDS TRANSLATION)
    └── FAQ Section (❌ PARTIAL - need devices-ja.json faq fields)
        └── devices-ja.json faq.q + faq.a
```

---

## Quick Summary for User

**Identify these 6 content files that need Japanese translation:**

1. ✅ **Template/UI** - DONE (requirements box, specs, table labels, etc.)
2. ❌ **sdcards.json** - Product pros/descriptions (High priority - every page)
3. ❌ **devices-ja.json FAQ** - Question and answer fields (High priority - visible on every page)
4. ❌ **devices-ja.json notes** - Device background info (Medium priority - less visible)
5. ❌ **amazon-cache/*.json** - Product titles/descriptions (Medium - only if enabled)
6. ❌ **calculator-content.json** - Calculator UI text (Low - depends on calculator usage)

**Estimated effort:** 10-20 hours total translation work
**Recommended start:** sdcards.json + devices-ja.json FAQ (covers 95% of user-visible English)
