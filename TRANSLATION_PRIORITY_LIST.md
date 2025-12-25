# Japanese Localization - Translation Priority List

## Summary
The device page UI (headers, labels, buttons) is now fully localized. However, the following **content files** still contain English text that appears on the Japanese site.

---

## PRIORITY 1: SD Card Data (Critical - High Visibility)

### File: `data/sdcards.json`
**Impact:** Appears in product recommendation tables on every device page  
**Fields to Translate:**
- `pros` - Product benefits/features (e.g., "Professional standard for weddings and cinema")
- `title` - Product name (keep as-is, brand names stay English)
- `description` - Product description

**Examples:**
```json
{
  "id": "sandisk-extreme-pro-sd-uhs2",
  "name": "SanDisk Extreme PRO SD UHS-II",
  "pros": "Professional standard for weddings and cinema.",  // TRANSLATE THIS
  "description": "Industry-standard choice..."  // TRANSLATE IF EXISTS
}
```

**Scope:** ~50-100 SD cards with 1-3 sentences each
**Est. Work:** 2-4 hours with Google Translate verification

---

## PRIORITY 2: Device FAQ Answers (High Visibility)

### File: `data/devices-ja.json` 
**Location:** Individual device entries under `faq` array  
**Impact:** Appears in "よくある質問" (FAQ) section on each device page

**Fields to Translate:**
- `q` - Question (check for English questions)
- `a` - Answer/explanation (almost all are English)

**Example:**
```json
"faq": [
  {
    "q": "Is the Lumix S9 a good camera for vlogging and content creation?",
    "a": "Yes, the Lumix S9 is specifically designed as Panasonic's most compact full-frame camera for content creators..."
    // BOTH NEED TRANSLATION
  }
]
```

**Scope:** ~140 devices × 1-5 FAQs each = 700-1000 FAQ items
**Est. Work:** 4-8 hours

---

## PRIORITY 3: Device Notes/Meta (Medium Visibility)

### File: `data/devices-ja.json`
**Location:** `notes` field in each device entry  
**Impact:** Not directly displayed but useful for context

**Example:**
```json
"notes": "Released in 2024, the Lumix S9 is a significant new entry..."
```

**Scope:** ~140 devices
**Est. Work:** 1-2 hours

---

## PRIORITY 4: Amazon Product Content (Medium - Variable)

### Files:
- `data/amazon-cache/featured-general.json`
- `data/amazon-cache/guide-professional-cameras.json`
- `data/amazon-cache/calculator-recommended.json`

**Impact:** Appears in Amazon badge sections (if enabled for Japan)  
**Fields:** Product titles, descriptions, prices

**Current Status:** Amazon API returns English titles for all regions  
**Workaround:** Create Japanese translation mapping or filter for Japanese market products

**Est. Work:** 1-3 hours (API integration work)

---

## PRIORITY 5: Calculator Content (Low-Medium)

### File: `data/calculator-content.json`
**Impact:** Calculator guides and help text  

**Fields:**
- Slider labels
- Input field descriptions
- Result explanations

**Est. Work:** 1-2 hours

---

## PRIORITY 6: SD Card Reader Content (Low)

### File: `data/sdCardReaders.json`
**Impact:** Only visible if SD Card Readers category enabled for Japan  

**Fields:**
- Device descriptions
- FAQ answers
- Compatibility notes

**Est. Work:** 1 hour

---

## Summary Table

| Priority | File | Field | Count | Est. Hours |
|----------|------|-------|-------|-----------|
| 1 | sdcards.json | `pros` | 50-100 | 2-4 |
| 2 | devices-ja.json | `faq` (q+a) | 700-1000 | 4-8 |
| 3 | devices-ja.json | `notes` | 140 | 1-2 |
| 4 | amazon-cache/*.json | titles, descriptions | Variable | 1-3 |
| 5 | calculator-content.json | all | ~50 | 1-2 |
| 6 | sdCardReaders.json | all | ~30 | 1 |
| | | **TOTAL** | | **10-20 hours** |

---

## Implementation Strategy

### Recommended Approach:
1. **Phase 1** (2-4 hrs): Translate `sdcards.json` `pros` field
   - Use Google Translate API with manual verification
   - Test on 3-5 device pages
   - Deploy

2. **Phase 2** (4-8 hrs): Translate device FAQ answers
   - Prioritize top 20 devices by traffic
   - Use same translation + verification workflow
   - Deploy incrementally

3. **Phase 3** (1-2 hrs): Translate device notes
   - Lower priority, can be done incrementally

4. **Phase 4** (1-3 hrs): Amazon content (if needed for Japan)
   - Requires API work or manual mapping

5. **Phase 5** (1-2 hrs): Calculator content (if Japan expansion plans)

---

## Translation Tools Options

- **Google Translate API** - Bulk translate with context
- **DeepL API** - Higher quality (costs ~$5/month)
- **Manual spreadsheet translation** - Time-intensive but highest quality

**Recommendation:** Google Translate API for bulk, then manual spot-check top 50 entries

---

## Testing Checklist After Translation

- [ ] Device page displays without English text
- [ ] FAQ answers are fully visible (no truncation)
- [ ] Special characters render correctly (Japanese punctuation, formatting)
- [ ] Product names stay English (as intended)
- [ ] Amazon affiliate links still work with translated text
- [ ] Mobile layout not broken by longer Japanese text
- [ ] Search still works with translated content

---

## Files NOT Requiring Translation

✅ Template/UI elements - Already localized in code  
✅ Brand names - Should stay in English (SanDisk, Canon, etc.)  
✅ Technical specs - SD, UHS-II, V60, etc. (standard terminology)  
✅ Metadata (URLs, IDs, slugs) - Keep as-is  
✅ Header/footer/navigation - Already localized in components-ja.js
