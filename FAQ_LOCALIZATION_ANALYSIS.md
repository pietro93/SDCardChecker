# FAQ Localization Analysis - Device Pages

## Current Status
**FAQ processing is NOT YET LOCALIZED for Japanese device pages**

The English version has a fully automated FAQ system. The Japanese version reuses the English logic without any Japanese translations.

---

## How English FAQ Processing Works

### 1. **FAQ Generation Pipeline**

```
generateFAQs(device, sdcardsMap)  
    ↓ (generateFAQs.js:9-109)
    ├─ Speed Class Question
    ├─ Storage Capacity Question  
    ├─ Budget Card Compatibility
    ├─ Card Type Question
    ├─ Professional Use Question
    ├─ Brand Reliability
    ├─ Data Loss Risk
    └─ Card Lifespan
    ↓
mergeFAQs(customFAQs, generatedFAQs)
    ├─ Custom FAQs override generated ones (by matching Q)
    └─ Returns merged array
    ↓
Manual First Question Added: "What SD Card Do I Need for {device.name}?"
    ↓
generateFAQHTML(faqItems)
    ↓ (helpers.js:566-581)
    └─ Converts to HTML accordion markup
    ↓
generateFAQSchema(faqItems)
    ↓ (helpers.js:114-129)
    └─ Generates FAQPage JSON-LD for SEO
    ↓
Template Injection
    ├─ {{FAQ_HTML}} → Accordion HTML
    └─ {{FAQ_SCHEMA}} → JSON-LD script tag
```

### 2. **Key Files Involved**

| File | Role |
|------|------|
| `scripts/generator/generateFAQs.js` | Core FAQ generation logic (English only) |
| `scripts/generator/generate-device-pages.js` | Device page builder - calls FAQ generation |
| `scripts/generator/generate-device-pages-ja.js` | Japanese device builder - reuses English with isJapanese flag |
| `scripts/generator/helpers.js` | FAQ HTML & Schema generation |
| `src/templates/device.html` | Device page template with `{{FAQ_HTML}}` & `{{FAQ_SCHEMA}}` placeholders |

### 3. **The FAQ Questions (English)**

Generated automatically based on device specs:

1. **Speed Class Question** (if not "No minimum required")
   - `"Is {V30/V60/V90} required for {device.name}?"`
   - Explains minimum write speed requirement

2. **Storage Capacity Question**  
   - `"What storage capacity should I get for {device.name}?"`
   - Recommends sizes based on `device.sdCard.recommendedCapacity`

3. **Budget Card Compatibility**
   - `"Can I use older or slower cards with {device.name}?"`
   - Varies based on speed requirements

4. **Card Type Question** (if multiple types or UHS)
   - `"Does the card type matter for {device.name}?"`
   - Explains type compatibility

5. **Professional/Dual Cards** (if high-end brands exist)
   - `"Should I use more than one card with {device.name}?"`
   - For professionals and extended sessions

6. **Brand Reliability**
   - `"Does the brand matter for {device.name}?"`
   - Lists trusted brands (SanDisk, Lexar, Kingston)

7. **Data Loss Risk** (if demanding device)
   - `"What happens if I use the wrong card with {device.name}?"`
   - Warns about dropped frames, corruption

8. **Card Lifespan**
   - `"How long will an SD card last with {device.name}?"`
   - 3-5 years typical lifespan

9. **First Question (Manual)**
   - `"What SD Card Do I Need for {device.name}?"`
   - Comprehensive answer about type, speed, capacity

### 4. **Custom FAQ Override System**

Devices can define custom FAQs in `devices.json`:

```json
{
  "id": "nintendo-switch",
  "faq": [
    {
      "q": "Can I use a regular SD card instead of microSD?",
      "a": "No, Nintendo Switch requires microSD cards specifically..."
    }
  ]
}
```

**How it works:**
- `mergeFAQs(device.faq, generatedFAQs)` compares question strings
- Custom FAQs take priority (matched by Q lowercase)
- Non-matching generated FAQs are appended

---

## Current Japanese Implementation

### ✅ What Works
- Device pages ARE generated in Japanese (`generate-device-pages-ja.js`)
- Reuses device builder with `isJapanese = true` flag
- Components (navbar, footer, sidebar) are localized
- Breadcrumbs and URLs use Japanese paths (`/ja/categories/...`)

### ❌ What Doesn't Work
- **FAQ Questions** remain entirely in English
- **FAQ Answers** use English device logic without translation
- Generated FAQs reference English device names in questions
- No Japanese FAQ templates or custom FAQ data in `devices-ja.json`

### Current Behavior
When Japanese device page is built:
1. Device data from `devices-ja.json` is loaded (Japanese device names)
2. `generateDevicePages(..., isJapanese=true)` is called
3. Inside, `generateFAQs(device, sdcardsMap)` creates English FAQs
4. Questions like "Is V30 required for Canon EOS R6?" (in English)
5. FAQs are injected unchanged into Japanese page

**Result:** Japanese device pages have English FAQ sections 😞

---

## What Needs to be Done

### Phase 1: Extract & Translate FAQ Templates

**File to create:** `scripts/generator/generateFAQs-ja.js`

Need to translate FAQ question/answer templates:

```javascript
// English
"Is {{speedClass}} required for {{deviceName}}?"

// Japanese
"{{speedClass}}は{{deviceName}}に必要ですか?"
```

**Questions to translate (9 total):**
1. Speed class requirement
2. Storage capacity recommendation
3. Budget card compatibility
4. Card type compatibility
5. Professional use guidance
6. Brand importance
7. Wrong card consequences
8. Card lifespan
9. "What card do I need?" (first Q)

### Phase 2: Create Japanese Device FAQ Data

**File to update:** `data/devices-ja.json`

Add `faq` field to Japanese devices where custom FAQs needed:

```json
{
  "id": "nintendo-switch-ja",
  "name": "ニンテンドースイッチ",
  "faq": [
    {
      "q": "通常のSDカードの代わりにmicroSDカードを使用できますか?",
      "a": "いいえ、ニンテンドースイッチはmicroSDカードのみが必要です..."
    }
  ]
}
```

### Phase 3: Create Japanese FAQ Generator

Modify `scripts/generator/generateFAQs.js` to:
- Accept `isJapanese` parameter
- Use Japanese question/answer templates
- Handle Japanese device names properly

### Phase 4: Update Device Page Builder

Modify `scripts/generator/generate-device-pages.js` to:
- Pass `isJapanese` flag to `generateFAQs()`
- Use `generateFAQsJa()` when building Japanese pages

### Phase 5: Testing & Validation

- ✅ Verify FAQ questions are in Japanese
- ✅ Verify FAQ answers reference Japanese device names
- ✅ Verify FAQ schema is valid (JSON-LD)
- ✅ Test custom FAQ overrides work with Japanese data

---

## FAQ Question Templates for Translation

### 1. Speed Class
**EN:** `Is {{speedClass}} required for {{deviceName}}?`
**JA:** `{{speedClass}}は{{deviceName}}に必要ですか?`

### 2. Capacity
**EN:** `What storage capacity should I get for {{deviceName}}?`
**JA:** `{{deviceName}}にはどのくらいのストレージ容量が必要ですか?`

### 3. Budget Cards
**EN:** `Can I use older or slower cards with {{deviceName}}?`
**JA:** `{{deviceName}}で古いまたは低速のカードを使用できますか?`

### 4. Card Type
**EN:** `Does the card type matter for {{deviceName}}?`
**JA:** `{{deviceName}}ではカードのタイプは重要ですか?`

### 5. Dual Cards
**EN:** `Should I use more than one card with {{deviceName}}?`
**JA:** `{{deviceName}}で複数のカードを使用すべきですか?`

### 6. Brand Reliability
**EN:** `Does the brand matter for {{deviceName}}?`
**JA:** `{{deviceName}}ではブランドは重要ですか?`

### 7. Wrong Card
**EN:** `What happens if I use the wrong card with {{deviceName}}?`
**JA:** `{{deviceName}}で間違ったカードを使用するとどうなりますか?`

### 8. Lifespan
**EN:** `How long will an SD card last with {{deviceName}}?`
**JA:** `{{deviceName}}でSDカードはどのくらい持ちますか?`

### 9. First Question (Manual)
**EN:** `What SD Card Do I Need for {{deviceName}}?`
**JA:** `{{deviceName}}にはどのSDカードが必要ですか?`

---

## Implementation Priority

| Phase | Effort | Impact | Order |
|-------|--------|--------|-------|
| Extract FAQ templates | 30 min | High | **1st** |
| Japanese FAQ generator | 1 hour | High | **2nd** |
| Device JSON updates | 30 min | Medium | **3rd** |
| Device page builder modifications | 30 min | Medium | **4th** |
| Testing & QA | 1 hour | High | **5th** |

**Total Estimated Time:** 3.5 hours

---

## Files That Will Need Changes

```
scripts/generator/
├─ generateFAQs.js          (→ modify to support isJapanese)
├─ generateFAQs-ja.js       (→ CREATE new)
├─ generate-device-pages.js (→ modify FAQ call to pass isJapanese)
└─ generate-device-pages-ja.js (→ may need small update)

data/
└─ devices-ja.json          (→ add "faq" fields where needed)

src/templates/
└─ device.html              (→ no changes needed, already uses {{FAQ_HTML}})
```

---

## Testing Checklist

- [ ] Japanese device page loads successfully
- [ ] FAQ section is visible on Japanese page
- [ ] All FAQ questions are in Japanese
- [ ] FAQ answers reference Japanese device names
- [ ] FAQ schema in `<script type="application/ld+json">` is valid
- [ ] Custom FAQ overrides work (from devices-ja.json)
- [ ] HTML accordion functionality works (expand/collapse)
- [ ] Related devices links work in FAQ context
- [ ] Build completes without errors
- [ ] No broken links in generated pages

---

## Notes

- FAQ answers strip HTML tags for schema (`.replace(/<[^>]*>/g, '')`)
- FAQs are device-specific based on speed requirements and features
- Schema generation is reused for both English & Japanese (no translation needed for schema structure)
- Custom FAQs allow device-specific edge cases (like Switch needing microSD specifically)

**Last Updated:** Dec 24, 2025
