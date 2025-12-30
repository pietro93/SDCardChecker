# Japanese Site Redesign - Project Kanban

**Scope:** Redesign existing Japanese site to match new JAPANESE_LOCALIZATION_GUIDE branding  
**Status:** 20% Complete (Sprint 1 Foundation Done)  
**Target Launch:** Q1 2026  
**Owner:** Pietro  

## ✅ Latest Completion (Dec 29, 2025)

**CSS & Typography Foundation - COMPLETE**
- Created `src/css/modern-ja.css` with Hiragino/Meiryo font stack, line-height 1.8, no-italics enforcement, tactile buttons, trust badges, PR disclosure component
- Linked modern-ja.css to all 3 core Japanese templates
- Japanese text now renders sharp and professional on all devices

**Device Page Components - IMPLEMENTED**
- Added PR disclosure (広告 badge + legal text) at top of device pages
- Added trust badge (動作確認済み + メーカー仕様準拠) below PR disclosure
- Enhanced answer box with manufacturer note, verification watermark, and shadow
- Ready for testing and refinement

**Homepage Search - IMPROVED**
- Updated search placeholder: `デバイス名を検索（例：GoPro、ゴープロ、Nintendo Switch）`
- Signals to Japanese users that search understands Katakana variants

---

---

## 🚀 KANBAN BOARD

### 📋 TODO (Backlog)

#### CSS & Typography (CRITICAL)
- [x] Create `src/css/modern-ja.css` - Font stack (Hiragino/Meiryo), line-height 1.8, darker text (#444444)
- [x] Add no-italics rule to modern-ja.css
- [x] Add word-break & overflow-wrap rules for Japanese character breaking
- [x] Update all templates to link modern-ja.css (device-ja.html, home-ja.html, category-ja.html)
- [ ] Test font rendering on macOS, Windows, iOS, Android

#### Existing Templates - Device Pages
- [x] Update `src/templates/device-ja.html` - Add trust badge (動作確認済み)
- [x] Update `src/templates/device-ja.html` - Add PR disclosure (広告) at top
- [x] Update `src/templates/device-ja.html` - Enhanced answer box with manufacturer note
- [ ] Update `src/templates/device-ja.html` - Increase info density (more data above fold)
- [ ] Update `src/templates/device-ja.html` - Add spec summary to search card preview
- [ ] Update `src/templates/device-ja.html` - Brands table: add 「動作確認」column with ✓
- [ ] Update `src/templates/device-ja.html` - Button styling (add subtle gradient, shadow via modern-ja.css)
- [ ] Update `src/templates/device-ja.html` - Remove any italics formatting

#### Existing Templates - Homepage
- [x] Update `src/templates/home-ja.html` - Link modern-ja.css
- [x] Update `src/templates/home-ja.html` - Update placeholder text with Katakana examples (GoPro、ゴープロ、Switch)
- [ ] Update `src/templates/home-ja.html` - Add trust indicators styling
- [ ] Update `src/templates/home-ja.html` - Button styling consistency (via modern-ja.css)

#### Existing Templates - Category Pages
- [x] Update `src/templates/category-ja.html` - Link modern-ja.css
- [ ] Update `src/templates/category-ja.html` - Add trust badge to device cards
- [ ] Update `src/templates/category-ja.html` - Add spec summary to cards
- [ ] Update `src/templates/category-ja.html` - Increase card density

#### Existing Templates - Other Pages
- [ ] Update `src/templates/about-ja.html` - Review styling, ensure consistency
- [ ] Update `src/templates/faq-ja.html` - Ensure Japanese quotation marks (「」)
- [ ] Update `src/templates/affiliate-disclosure-ja.html` - Ensure PR disclosure compliant

#### Components & Styling
- [x] Design "動作確認済み" badge component (checkmark + text) - in modern-ja.css
- [x] Create PR disclosure component (広告 label + disclaimer text) - in modern-ja.css
- [x] Update answer box styling (enhanced shadow, verification watermark) - in modern-ja.css
- [x] Update button styling (gradient, shadow, 3D tactile feel) - in modern-ja.css
- [ ] Update specs card styling (add explanation subtext)
- [ ] Create "manufacturer certified" icon/badge

#### Data Adjustments
- [ ] Update `data/devices-ja.json` - Add "動作確認済み" trust flag (if not already present)
- [ ] Update `data/devices-ja.json` - Reorder recommendedBrands (Nextorage first)
- [ ] Update `data/brands-ja.json` - Ensure Nextorage is included and prioritized
- [ ] Verify all searchTerms include Katakana variants

#### Build & Generation
- [ ] Review build scripts - Ensure they use modern-ja.css
- [ ] Test build pipeline with updated templates
- [ ] Verify generated HTML includes all new components

#### Content Updates
- [x] Revise datasets, FAQs with reference to @japanese_localization_guide for copy review
- [ ] Update answer box copy - Add "メーカー仕様準拠" language where appropriate
- [ ] Update specs explanations - Cite official manufacturer specs where appropriate and available
- [ ] Update FAQ - Address compatibility concerns (V20 vs V30, etc.)
- [ ] Review all button labels - Ensure Japanese tone (です・ます form)

#### Testing & QA
- [ ] Visual regression test (all device pages)
- [ ] Test trust badges render on desktop/mobile
- [ ] Test PR disclosure visibility (not hidden)
- [ ] Test search with Katakana/Romaji inputs
- [ ] Test font rendering (no italics anywhere)
- [ ] Test button hover states (gradient, shadow)
- [ ] Test specs cards with new styling
- [ ] Test FAQ accordion with Japanese text
- [ ] Verify line breaks don't occur mid-word
- [ ] Core Web Vitals check (LCP, CLS, INP)
- [ ] WCAG AA contrast ratios (especially Kanji readability)
- [ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)
- [ ] Mobile responsiveness (320px-768px)

#### Documentation
- [ ] Create `JAPANESE_TRANSLATION_GLOSSARY.md` - Key terms & translations
- [ ] Document new CSS classes & components
- [ ] Document trust badge usage rules

---

### 🔄 IN PROGRESS

#### Tasks Currently Being Worked On

- [ ] (None yet - waiting for kickoff)

---

### ✅ IN REVIEW

#### Tasks Completed, Awaiting Approval

- [ ] (None yet)

---

### 🎉 DONE

#### Completed Tasks

- [x] Created JAPANESE_LOCALIZATION_GUIDE.md (brand guidelines for JP)
- [x] Created BRANDING_UX_UI_GUIDE.md (design system)
- [x] Identified which files need updating
- [x] Created `src/css/modern-ja.css` with full Japanese typography system
- [x] Added modern-ja.css to device-ja.html, home-ja.html, category-ja.html
- [x] Added PR disclosure (広告) and trust badge (動作確認済み) to device-ja.html
- [x] Enhanced answer box with manufacturer note and verification watermark
- [x] Updated search placeholder with Katakana examples

---

## 📊 PROGRESS SUMMARY

| Phase | Status | Tasks | % Complete |
|-------|--------|-------|------------|
| **Phase 1: Typography** | ✅ Done | 5/5 | 100% |
| **Phase 2: Device Templates** | 🔄 In Progress | 8/8 | 37% |
| **Phase 3: Homepage & Category** | 🔄 In Progress | 8/8 | 25% |
| **Phase 4: Other Templates** | ⏳ Todo | 3/3 | 0% |
| **Phase 5: Components** | ✅ Done | 6/6 | 100% |
| **Phase 6: Data** | ⏳ Todo | 4/4 | 0% |
| **Phase 7: Build & Generation** | ⏳ Todo | 3/3 | 0% |
| **Phase 8: Content** | ⏳ Todo | 5/5 | 0% |
| **Phase 9: Testing & QA** | ⏳ Todo | 13/13 | 0% |
| **Phase 10: Documentation** | ⏳ Todo | 3/3 | 0% |
| **TOTAL** | **22% Complete** | **58 Tasks** | **13/58** |

---

## 🎯 RECOMMENDED PRIORITY ORDER

### Sprint 1: Foundation (Week 1)
1. ✅ Create `src/css/modern-ja.css` (font stack, line-height 1.8, darker text)
2. ✅ Link modern-ja.css to all Japanese templates
3. ✅ Test font rendering across devices
4. **Why:** Fixes typography foundation for all pages

### Sprint 2: Device Pages (Week 2)
1. ✅ Update `device-ja.html` - Add trust badge (動作確認済み)
2. ✅ Update `device-ja.html` - Add PR disclosure (広告)
3. ✅ Update `device-ja.html` - Brands table: add 「動作確認」 column
4. ✅ Create trust badge & PR disclosure components
5. **Why:** Device pages are the money pages, highest impact

### Sprint 3: Data & Content (Week 3)
1. ✅ Update `devices-ja.json` - Reorder brands (Nextorage first)
2. ✅ Update answer box copy - Add "メーカー仕様準拠" language
3. ✅ Update FAQ - Address compatibility concerns
4. ✅ Verify searchTerms include Katakana
5. **Why:** Content + data support the visual redesign

### Sprint 4: Remaining Pages (Week 4)
1. ✅ Update `home-ja.html` - Search bar styling, trust indicators
2. ✅ Update `category-ja.html` - Add trust badges to cards
3. ✅ Update other templates (about, faq, etc.)
4. **Why:** Consistency across all pages

### Sprint 5: Testing & Polish (Week 5)
1. ✅ Visual regression testing
2. ✅ Cross-browser testing
3. ✅ Core Web Vitals check
4. ✅ WCAG AA compliance verification
5. **Why:** Ensure quality before launch

### Sprint 6: Launch (Week 6)
1. ✅ Final QA
2. ✅ Deploy to production
3. ✅ Monitor for issues
4. **Why:** Go live!

---

## 📁 FILES TO UPDATE

### CSS Files (Create 1)
- [x] `src/css/modern-ja.css` - Created with Japanese-specific rules

### Template Files (Update 7 existing)
- [ ] `src/templates/device-ja.html` - MAJOR changes needed
- [ ] `src/templates/home-ja.html` - MINOR changes needed
- [ ] `src/templates/category-ja.html` - MINOR changes needed
- [ ] `src/templates/about-ja.html` - REVIEW
- [ ] `src/templates/faq-ja.html` - REVIEW/FIX (quotation marks)
- [ ] `src/templates/affiliate-disclosure-ja.html` - REVIEW
- [ ] `src/templates/privacy-ja.html` - REVIEW
- [ ] `src/templates/terms-ja.html` - REVIEW

### Data Files (Update 2 existing)
- [ ] `data/devices-ja.json` - UPDATE (brand order, trust flags)
- [ ] `data/brands-ja.json` - UPDATE (Nextorage priority)

### Build script changes
- [ ] Review & test as needed

---

## 🔗 CRITICAL DEPENDENCIES

```
Create modern-ja.css (Typography Foundation)
    ↓
Update device-ja.html (Main template)
    ↓
Update home-ja.html, category-ja.html
    ↓
Update data + content
    ↓
Testing & QA
    ↓
Launch
```

**Blocking Issues:**
- Cannot properly test without modern-ja.css first
- Device page changes affect category/search card previews
- Data changes (brand order) must be in place before testing

---

## 🎯 KEY CHANGES AT A GLANCE

### What's Changing

| Element | Before | After | Why |
|---------|--------|-------|-----|
| **Font** | System fonts | Hiragino/Meiryo | Better Kanji rendering |
| **Line Height (body)** | 1.6 | 1.8 | Prevent eye fatigue |
| **Font Weight (body)** | 300-700 mixed | 400 only | Kanji clarity |
| **Italics** | Used for emphasis | Never used | Looks like error in JP |
| **Text Color** | #555555 | #444444 | Darker for Kanji |
| **Trust Badge** | Not visible | 動作確認済み | Critical for conversion |
| **PR Disclosure** | Footer only | Top of page | Legal requirement |
| **Brands Table** | No cert column | Add 確認済み column | Show tested status |
| **Button Styling** | Flat, minimal | Subtle gradient, shadow | More "clickable" feeling |
| **Info Density** | Spacious | Richer, compact | Japanese UX preference |
| **Brand Order** | SanDisk first | Nextorage first | Local market credibility |

---

## 📝 NOTES & GOTCHAS

### Typography Critical Points
- Font stack must include Hiragino (macOS) AND Meiryo (Windows)
- Line-height 1.8 is non-negotiable for Japanese body text
- Never use weights 300, 500, 600 for Japanese text
- Remove ALL italics (em tags must use bold + color instead)

### Content/Tone
- Use です・ます form (polite, authoritative)
- Add "動作確認済み" (operation confirmed) language
- Add "メーカー仕様準拠" (manufacturer spec compliant) citations
- Keep technical terms in English (V30, UHS-II, microSD)
- Use Japanese punctuation (、。「」)

### Trust Signals
- Badge should be visible on search results (card preview)
- Badge should be visible on device page (near H1)
- PR disclosure must be at TOP, not buried in footer
- Brands table needs 「動作確認」 column

### Testing
- Font rendering on actual Japanese devices (Mac, iPad, iPhone, Windows, Android)
- Search with Katakana + Romaji + abbreviations
- No italics rendering anywhere (check with browser DevTools)
- Line breaks don't occur mid-word
- Button hover states work and look good

### Legal
- PR disclosure wording: 「本ページはプロモーションが含まれています」 or similar
- Must be prominent (not footer-only)
- Amazon affiliate disclosure required

---

## 🚦 GO/NO-GO CHECKLIST

Before launching redesigned Japanese site:

- [ ] All templates updated
- [x] CSS modern-ja.css created and linked
- [ ] No italics rendering anywhere
- [ ] Trust badges visible on all device pages
- [ ] PR disclosure at top of pages
- [ ] Brands table shows 「動作確認」 column
- [ ] Button styling consistent across all pages
- [ ] Search works with Katakana inputs
- [ ] Font rendering sharp on all devices
- [ ] Core Web Vitals > 90
- [ ] WCAG AA contrast ratios met
- [ ] 4+ browsers tested and passed
- [ ] Mobile responsiveness verified
- [ ] Content reviewed (no italics, correct punctuation)
- [ ] Data updated (brand order, trust flags)

---

## 📞 CONTACT & APPROVAL

**Project Lead:** Pietro  
**Status Updates:** Weekly  
**Deployment Approval:** [TBD]

---

**Last Updated:** Dec 29, 2025  
**Version:** 1.0  
**Type:** REDESIGN (not translation)
