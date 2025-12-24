# Japanese Device Page Generator - Blockers & Translation Map

**Date:** December 23, 2025  
**Status:** Analysis complete - Ready for implementation

---

## Executive Summary

The English device generator works perfectly (139/139 pages). Creating a Japanese version requires:
1. **Reusing the English generator infrastructure** (don't reinvent)
2. **Adding Japanese template support** (simple flag)
3. **Translating static strings** (UI labels, section headers)
4. **Handling data structure alignment** (device.faq vs Array handling)

**Approach:** Modify existing `generate-device-pages.js` to accept a language flag rather than creating a separate Japanese generator.

---

## What's Blocking Japanese Device Pages

### Issue #1: Generator Architecture
**Problem:** Created separate `generate-device-pages-ja.js` with duplicated logic

**Solution:** Modify the shared `generate-device-pages.js` to:
- Accept `isJapanese` flag parameter
- Load Japanese template when flag is true
- Reuse all helper functions (they're language-agnostic)
- Switch between English/Japanese component helpers

**Benefit:** 
- No code duplication
- Easier maintenance
- Single source of truth for device page logic

---

### Issue #2: Template Switching
**Current:** Hard-coded template path in generator

**Fix Required:**
```javascript
// Before (English only)
let deviceTemplate = readTemplate(
  path.join(srcPath, "templates/device.html")
);

// After (Language-aware)
const templateFile = isJapanese ? "device-ja.html" : "device.html";
let deviceTemplate = readTemplate(
  path.join(srcPath, "templates", templateFile)
);
```

---

### Issue #3: Component Helpers
**Current:** English components imported directly

**Fix Required:**
```javascript
// Conditional imports
const {
  generateHeader,
  generateFooter,
  generateAffiliateDisclosure,
  generateSidebar,
  generateGrowScript
} = isJapanese 
  ? require("../../src/templates/components-ja")
  : require("../../src/templates/components");
```

---

### Issue #4: Category Slug Generation
**Problem:** English uses slugified paths (`/categories/cameras/`)  
Japanese uses actual Japanese names (`/ja/categories/カメラ/`)

**Fix Required:**
```javascript
// Map English categories to Japanese
function getCategoryPath(categoryEn, isJapanese) {
  if (!isJapanese) {
    return categoryEn.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
  }
  
  const categoryMap = {
    "Cameras": "カメラ",
    "Action Cameras": "アクションカメラ",
    "Drones": "ドローン",
    "Gaming Handhelds": "携帯ゲーム機",
    "Computing & Tablets": "コンピュータ・タブレット",
    "Dash Cams": "ドライブレコーダー",
    "Security Cameras": "セキュリティカメラ",
    "Trail Cameras": "トレイルカメラ",
    "Accessories": "アクセサリー"
  };
  
  return categoryMap[categoryEn] || categoryEn;
}
```

---

### Issue #5: Placeholder Text Localization
**Current:** Placeholders like `{{REQUIREMENTS_BOX}}` generate English text

**Fix Required:** Add language-aware placeholder content

```javascript
function generateRequirementsBox(device, isJapanese) {
  const labels = isJapanese ? {
    title: "必要な仕様",
    cardType: "カードタイプ",
    minSpeed: "最小速度クラス",
    capacity: "推奨容量",
    maxCapacity: "最大容量"
  } : {
    title: "Requirements",
    cardType: "Card Type",
    minSpeed: "Min Speed Class",
    capacity: "Recommended Capacity",
    maxCapacity: "Max Capacity"
  };
  
  return `
    <div class="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6 mb-12">
      <h2 class="text-xl font-bold text-amber-900 mb-4">${labels.title}</h2>
      <div class="grid md:grid-cols-2 gap-4 text-amber-900">
        <div>
          <p class="text-sm font-semibold text-amber-700">${labels.cardType}</p>
          <p class="text-lg font-bold">${device.sdCard.type}</p>
        </div>
        <!-- ... etc ... -->
      </div>
    </div>
  `;
}
```

---

### Issue #6: FAQ HTML Generation
**Problem:** Code assumed `device.faq` would always be an array, but data structure inconsistency

**Fix Required:**
```javascript
// Defensive array handling
const faqItems = Array.isArray(device.faq) ? device.faq : [];
const faqHTML = faqItems.length > 0 ? faqItems.map(item => `
  <div class="faq-item bg-white rounded-lg p-6 border border-slate-200 mb-4">
    <button class="w-full text-left font-semibold text-slate-900 hover:text-blue-600 transition-colors flex items-center justify-between">
      <span>${item.q}</span>
      <i class="fas fa-chevron-down text-sm"></i>
    </button>
    <div class="mt-4 text-slate-700 leading-relaxed hidden">
      ${item.a}
    </div>
  </div>
`).join("") : "";
```

---

## Translation Mapping

### Static UI Labels (Used in Template)

| English | Japanese | Context |
|---------|----------|---------|
| "Home" | "ホーム" | Breadcrumb |
| "Categories" | "カテゴリー" | Breadcrumb |
| "Requirements" | "必要な仕様" | Section header |
| "Card Type" | "カードタイプ" | Spec label |
| "Min Speed Class" | "最小速度クラス" | Spec label |
| "Recommended Capacity" | "推奨容量" | Spec label |
| "Max Capacity" | "最大容量" | Spec label |
| "Top SD Card Recommendations" | "トップSDカード推奨情報" | Section header |
| "Brand" | "ブランド" | Table header |
| "Speed Class" | "速度クラス" | Table header |
| "Write Speed" | "書き込み速度" | Table header |
| "Pros" | "利点" | Table header |
| "Buy on Amazon" | "Amazonで購入" | Link text |
| "Frequently Asked Questions" | "よくある質問" | Section header |
| "Related Devices" | "関連デバイス" | Section header |
| "View Category" | "詳細を見る" | Link text |
| "Buy Now" | "今すぐ購入" | Button text |
| "Why These Specs?" | "なぜこの仕様が必要？" | Section header |

---

### Data-Driven Content (From device.faq, device.whySpecs, etc.)

These are **already translated** in `devices-ja.json`:
- ✅ `device.name` - Device name (Japanese)
- ✅ `device.category` - Category (Japanese) - e.g., "アクションカメラ"
- ✅ `device.whySpecs` - Why specs explanation (Japanese)
- ✅ `device.faq[].q` - FAQ questions (Japanese)
- ✅ `device.faq[].a` - FAQ answers (Japanese)
- ✅ `device.sdCard` - Specs (language-neutral)
- ✅ `device.recommendedBrands` - References to sdcards.json (language-neutral)

---

## Implementation Plan

### Step 1: Modify `generate-device-pages.js`
Make it language-agnostic with optional parameter:

```javascript
async function generateDevicePages(allDevices, distPath, isJapanese = false) {
  // Load appropriate template
  const templateFile = isJapanese ? "device-ja.html" : "device.html";
  const componentModule = isJapanese 
    ? require("../../src/templates/components-ja")
    : require("../../src/templates/components");
  
  // Rest of logic (mostly unchanged)
  // ...
}
```

---

### Step 2: Create Wrapper Function
In `scripts/generator/generate-device-pages-ja.js`:

```javascript
/**
 * Generate Japanese device pages
 * Reuses English generator with Japanese data + template
 */
async function generateDevicePagesJa(allDevices, distPath) {
  console.log("📄 Generating Japanese device pages...");
  
  // Load Japanese device data
  const jaDataPath = path.join(__dirname, "../../data/devices-ja.json");
  const jaData = readJSON(jaDataPath);
  const jaDevices = jaData.devices || [];
  
  // Call shared generator with Japanese flag
  const { generateDevicePages } = require("./generate-device-pages");
  await generateDevicePages(jaDevices, distPath, true);
  
  console.log(`  ✓ Generated ${jaDevices.length} Japanese device pages`);
}

module.exports = { generateDevicePagesJa };
```

---

### Step 3: Update build-ja.js
```javascript
const { generateDevicePagesJa } = require("./generate-device-pages-ja");

// In the main function:
console.log("📄 Generating Japanese device pages...");
await generateDevicePagesJa(allDevices, distPath);
console.log();
```

---

### Step 4: Path Handling in Helper Function
Create utility function for category paths:

```javascript
function getCategoryPath(device, isJapanese) {
  const categoryEn = device.category;
  
  if (!isJapanese) {
    // English: lowercase slugified
    return categoryEn.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
  }
  
  // Japanese: use Japanese category name from device data
  // The device.category in devices-ja.json already has Japanese names
  return categoryEn; // e.g., "カメラ", "ドローン"
}
```

---

### Step 5: Output Path Generation
```javascript
function generateDevicePath(device, distPath, isJapanese) {
  const baseDir = isJapanese ? "ja" : "";
  const categoryPath = getCategoryPath(device, isJapanese);
  
  return path.join(
    distPath,
    baseDir,
    "categories",
    categoryPath,
    device.slug,
    "index.html"
  );
}
```

---

## What Needs Translation

### ✅ Already Done (in devices-ja.json)
- Device names
- Category names
- Why specs explanations
- FAQ questions and answers
- Search terms

### ⏳ Needs Translation (in component/template)
- Button labels ("Buy on Amazon" → "Amazonで購入")
- Section headers ("Requirements" → "必要な仕様")
- Table headers ("Brand" → "ブランド")
- Breadcrumb text (handled by components-ja.js)

### ✅ No Translation Needed
- Specs values (V30, MB/s, etc. - universal)
- Brand names (SanDisk, Lexar, etc. - same)
- Device IDs and slugs

---

## Files to Modify/Create

| File | Action | Status |
|------|--------|--------|
| `scripts/generator/generate-device-pages.js` | Modify - add `isJapanese` parameter | 🟡 Required |
| `scripts/generator/generate-device-pages-ja.js` | Rewrite - use wrapper pattern | 🟡 Required |
| `scripts/generator/build-ja.js` | Update import/call | 🟡 Required |
| `src/templates/device-ja.html` | Review - placeholders should match English | ✅ Ready |
| `data/devices-ja.json` | Review - 45/140 translated, rest English fallback | 🟡 Partial |

---

## Data Coverage

### Current Translation Status (devices-ja.json)

**45 devices fully translated** (Japanese content complete):
- gopro-hero-13, gopro-hero-12
- nintendo-switch, nintendo-switch-oled
- dji-mini-4-pro, dji-osmo-pocket-3
- steam-deck, viofo-a229-duo
- raspberry-pi-5, insta360-x4
- asus-rog-ally, sony-a7-iv
- [+33 more]

**95 devices untranslated** (English fallback used):
- Would still generate pages
- Device names appear in English
- FAQ content in English
- But category/nav/UI labels in Japanese

**Solution:** Generate with partial translation - untranslated devices get English content but proper Japanese navigation/structure.

---

## Testing Checklist

Once implemented:

- [ ] Build runs without errors
- [ ] Japanese device pages generate (45+)
- [ ] URLs use correct `/ja/categories/カメラ/` structure
- [ ] Breadcrumbs show Japanese text
- [ ] FAQ sections render correctly
- [ ] Schema markup validates (lang="ja")
- [ ] Related devices link to correct Japanese pages
- [ ] Affiliate links intact and tracked
- [ ] No 404s on category pages
- [ ] Mobile responsive

---

## Estimated Effort

| Task | Time | Difficulty |
|------|------|------------|
| Modify generate-device-pages.js | 30 min | Low |
| Rewrite generate-device-pages-ja.js | 15 min | Low |
| Update build-ja.js | 10 min | Low |
| Test & debug | 30 min | Medium |
| **Total** | **~90 min** | **Medium** |

---

## Success Criteria

✅ **Phase 2 Complete when:**
1. 45+ Japanese device pages generate without errors
2. All pages follow `/ja/categories/{japanese-category}/{device-slug}/` pattern
3. Japanese UI elements (nav, breadcrumbs, labels) display correctly
4. Affiliate links work and track properly
5. Schema markup validates for Japanese pages
6. Zero 404 errors on internal links

---

**Next Action:** Implement Step 1 (modify generate-device-pages.js) to add language parameter support.

Ready to proceed?
