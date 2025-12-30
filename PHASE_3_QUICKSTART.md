# Phase 3 Quickstart - HTML Template Updates

**Status:** Ready to Start  
**Tasks:** 8 (split across 2 HTML files)  
**Estimated Duration:** 2-3 hours  
**Prerequisite:** ✅ Phase 8 Extended complete

---

## Quick Overview

Update Japanese HTML templates to display trust messaging and manufacturer compliance language that we just embedded in the JSON category files.

---

## File 1: `home-ja.html` (4 tasks)

### Task 1: Hero Section Update
**Location:** Hero/banner section at top of page

**What to Add:**
```
Japanese trust messaging about "動作確認済み" (operation confirmed)
Manufacturer spec compliance callout
Search prompt with Katakana example (ゴープロ, ドローン, etc.)
```

**Key Changes:**
- Add subtitle emphasizing trust: 「すべてのカードは動作確認済みです」
- Add small badge/icon showing "メーカー仕様準拠"
- Update CTA button text to include trust language

---

### Task 2: Device Showcase Section
**Location:** Main device grid/carousel

**What to Update:**
- Device card template should display trust indicators
- Add ✓ or badge showing "動作確認済み"
- Show recommended specs summary (V30, microSD, etc.)
- Link text should say 「詳しく見る」 not 「View」

---

### Task 3: Trust Language Integration
**Add to page copy:**
- Intro text: 「本ページに掲載されているSDカードはすべて、デバイスメーカー仕様に基づいて厳選されています。」
- Sub-heading: 「メーカー推奨 × 動作確認済み」
- Trust badges in device cards

---

### Task 4: Search Optimization
**Update search bar:**
```html
<input 
  placeholder="デバイス名を入力（例：GoPro、ゴープロ、ドローン）"
  aria-label="デバイスを検索"
/>
```

**Verify:**
- Katakana examples in placeholder
- Search works with: English (GoPro), Katakana (ゴープロ), Abbreviated (ゴープロ)

---

## File 2: `category-ja.html` (4 tasks)

### Task 5: Category-Level Trust Badge
**Location:** Top of category page (above device list)

**Add:**
```html
<div class="category-trust-badge">
  <span class="badge-icon">✓</span>
  <span>すべて動作確認済み</span>
  <span class="subtext">メーカー仕様準拠</span>
</div>
```

**Styling:** Blue/orange accent, subtle background

---

### Task 6: Category Description
**Location:** Category intro text (below title)

**Update with:**
- Category name + Japanese description
- Trust statement: 「以下のすべてのカードは、[カテゴリ名]メーカーの公式仕様に基づいて選定されています。」
- Compliance note specific to category
  - Drones: 「V30以上推奨」
  - Dash-cams: 「高耐久推奨」
  - Tablets: 「A2定格推奨」

---

### Task 7: Device Card Trust Indicators
**Location:** Individual device cards in category grid

**Add to each card:**
- ✓ Badge with 「動作確認済み」
- Spec summary (Speed Class, Endurance rating, etc.)
- Recommendation flag: 「メーカー推奨」

**Card should show (without clicking):**
```
[Image]
✓ 動作確認済み
Device Name
microSD UHS-I
V30 (推奨)
詳しく → 
```

---

### Task 8: Category Filtering with Katakana
**Location:** Search/filter area on category page

**Test:**
- Search "ドローン" → finds "Drones" category
- Search "ゴープロ" → finds GoPro devices
- Search "gopro" → still finds GoPro (case-insensitive)
- Search "タブレット" → finds computing-and-tablets

**Files to check:**
- `src/js/search-ja.js` (if it exists)
- Alpine.js filtering logic in category-ja.html

---

## Before You Start

### Files to Open:
```
1. src/templates/home-ja.html      (or src/pages/home-ja.html)
2. src/templates/category-ja.html  (or src/pages/category-ja.html)
3. JAPANESE_LOCALIZATION_GUIDE.md  (reference for tone/language)
4. data/categories-ja/*.json       (reference for updated copy)
```

### Key Reference Phrases:
- 「動作確認済み」= Operation Confirmed ✓
- 「メーカー仕様準拠」= Manufacturer Spec Compliant
- 「推奨」= Recommended
- 「詳しく見る」= See Details (not "View")
- 「選定」= Carefully Selected/Curated

---

## Checklist Before Moving to Phase 4

- [ ] home-ja.html displays trust messaging
- [ ] Category pages show trust badges
- [ ] Device cards show ✓ 動作確認済み 
- [ ] Hero section includes Katakana search example
- [ ] All links use Japanese text (詳しく, など)
- [ ] No English text remains in Japanese templates
- [ ] JSON-to-HTML data flow verified (category data displays correctly)
- [ ] Responsive design maintained (test on mobile)

---

## Estimated Time Per Task
- Task 1 (Hero): 20 min
- Task 2 (Device cards): 30 min
- Task 3 (Trust text): 15 min
- Task 4 (Search): 15 min
- Task 5 (Category badge): 15 min
- Task 6 (Category description): 20 min
- Task 7 (Device indicators): 25 min
- Task 8 (Search test): 20 min

**Total: ~2-2.5 hours**

---

## Success Criteria

✅ All Japanese HTML templates display trust messaging  
✅ No English text visible to user (except brand names, technical specs)  
✅ Device cards consistently show 「動作確認済み」  
✅ Search works with Katakana, English, abbreviated forms  
✅ Mobile responsive maintained  
✅ Links between templates functional  

---

## Next Phase After This
**Phase 4:** Update about-ja.html & faq-ja.html (3 tasks)
- About page: Company trustworthiness, testing methodology
- FAQ: Address Japanese-specific concerns (temperature, humidity, compatibility)

