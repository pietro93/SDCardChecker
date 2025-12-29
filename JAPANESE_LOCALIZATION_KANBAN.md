# Japanese Localization - Project Kanban

**Status:** Not Started  
**Target Launch:** Q1 2026  
**Owner:** Pietro  

---

## 🚀 KANBAN BOARD

### 📋 TODO (Backlog)

#### Data Layer
- [ ] Create `data/devices-ja.json` - Translate 98+ devices, add Katakana searchTerms
- [ ] Create `data/brands-ja.json` - Reorder brands (Nextorage first), translate names
- [ ] Create `data/categories-ja.json` - Translate all category names
- [ ] Validate data structure (schema compliance, encoding UTF-8)

#### CSS & Typography
- [ ] Create `src/css/modern-ja.css` - Font stack, line-height, no italics, darker text
- [ ] Update `tailwind.config.js` - Add Japanese language selector if needed
- [ ] Test font rendering on macOS, Windows, iOS
- [ ] Verify all colors meet WCAG AA contrast for Japanese text

#### Templates (Core Pages)
- [ ] Create `src/templates/device-ja.html` - Copy device.html, adapt for higher density
- [ ] Create `src/templates/home-ja.html` - Homepage with Japanese search bar
- [ ] Create `src/templates/category-ja.html` - Category listing with trust badges
- [ ] Create `src/templates/about-ja.html` - About page
- [ ] Create `src/templates/privacy-ja.html` - Privacy policy (legal)
- [ ] Create `src/templates/terms-ja.html` - Terms of service (legal)
- [ ] Create `src/templates/affiliate-disclosure-ja.html` - Affiliate/PR disclosure page
- [ ] Create `src/templates/faq-ja.html` - FAQ page

#### Search & JavaScript
- [ ] Create `src/js/search-ja.js` - Fuzzy Katakana/Romaji matching
- [ ] Review `src/js/components.js` - Ensure Japanese punctuation (「」) compatibility
- [ ] Test search with multiple input methods (IME)
- [ ] Test FAQ accordion with Japanese text

#### Build Infrastructure
- [ ] Update `scripts/generator/build.js` - Add Japanese build pipeline
- [ ] Update `scripts/generator/generate-device-pages.js` - Support `devices-ja.json`
- [ ] Update `scripts/generator/generate-category-pages.js` - Support Japanese categories
- [ ] Update `scripts/generator/generate-core-files.js` - Generate `sitemap-ja.xml`, robots-ja.txt
- [ ] Update `scripts/generator/helpers.js` - Add Japanese formatting helpers
- [ ] Update `package.json` - Add `npm run build:ja` command

#### Configuration & Deployment
- [ ] Update `vercel.json` - Add Japanese path routing (`/ja/` or domain)
- [ ] Create `.env` or config for JP-specific settings (if needed)
- [ ] Set up Google Search Console for Japanese site
- [ ] Configure analytics to track JP traffic separately

#### Content Translation (Strings)
- [ ] Translate meta descriptions (all pages)
- [ ] Translate OG tags (all pages)
- [ ] Translate button labels ("詳しく見る", "Amazon で確認", etc.)
- [ ] Translate footer content
- [ ] Translate navigation labels
- [ ] Add PR disclosure text (法的要件)

#### Trust & Visual Elements
- [ ] Design "動作確認済み" (Operation Confirmed) badge graphics
- [ ] Create manufacturer certification logo assets
- [ ] Design PR disclosure component styling
- [ ] Create "信頼アイコン" (trust indicator) graphics

#### Testing & QA
- [ ] Test homepage responsiveness (mobile, tablet, desktop)
- [ ] Test device pages on all screen sizes
- [ ] Test search functionality (English, Katakana, abbreviated terms)
- [ ] Test forms with Japanese input
- [ ] Verify no italics render anywhere
- [ ] Test keyboard navigation
- [ ] Screen reader testing (VoiceOver, NVDA)
- [ ] Core Web Vitals check (LCP, CLS, INP)
- [ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)

#### Documentation
- [ ] Create Japanese style guide (brand voice examples)
- [ ] Document searchTerms format (Katakana/Romaji rules)
- [ ] Create translation glossary (English → Japanese terms)
- [ ] Document build process for JP site
- [ ] Create deployment guide

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

- [x] Created JAPANESE_LOCALIZATION_GUIDE.md (strategic guide)
- [x] Created BRANDING_UX_UI_GUIDE.md (design system)
- [x] Identified all files requiring changes

---

## 📊 PROGRESS SUMMARY

| Phase | Status | Tasks | % Complete |
|-------|--------|-------|------------|
| **Phase 1: Planning** | ✅ Done | 3/3 | 100% |
| **Phase 2: Data** | ⏳ Todo | 4/4 | 0% |
| **Phase 3: Styling** | ⏳ Todo | 4/4 | 0% |
| **Phase 4: Templates** | ⏳ Todo | 8/8 | 0% |
| **Phase 5: Search/JS** | ⏳ Todo | 3/3 | 0% |
| **Phase 6: Build** | ⏳ Todo | 6/6 | 0% |
| **Phase 7: Config** | ⏳ Todo | 4/4 | 0% |
| **Phase 8: Content** | ⏳ Todo | 6/6 | 0% |
| **Phase 9: Trust/Design** | ⏳ Todo | 4/4 | 0% |
| **Phase 10: Testing** | ⏳ Todo | 8/8 | 0% |
| **Phase 11: Docs** | ⏳ Todo | 4/4 | 0% |
| **TOTAL** | **3% Complete** | **54 Tasks** | **2/54** |

---

## 🎯 RECOMMENDED PRIORITY ORDER

### Sprint 1: Foundation (Week 1-2)
1. ✅ Create `data/devices-ja.json` (enables all downstream work)
2. ✅ Create `src/css/modern-ja.css` (ensures Japanese renders correctly)
3. ✅ Create `src/templates/device-ja.html` (main money page)
4. **Blocker for:** Everything else

### Sprint 2: Build & Search (Week 3)
1. ✅ Update build scripts (generator files)
2. ✅ Create `src/js/search-ja.js` (search functionality)
3. ✅ Update `package.json` for build command
4. **Blocker for:** Testing, deployment

### Sprint 3: Pages & Translation (Week 4)
1. ✅ Create remaining templates (home, category, about, etc.)
2. ✅ Translate all meta/OG tags
3. ✅ Create PR disclosure component
4. **Blocker for:** Visual polish

### Sprint 4: Testing & Launch Prep (Week 5)
1. ✅ Comprehensive testing (all devices, browsers)
2. ✅ Search Console setup
3. ✅ Analytics configuration
4. **Blocker for:** Launch

### Sprint 5: Polish & Launch (Week 6)
1. ✅ Final QA
2. ✅ Deploy to production
3. ✅ Monitor organic traffic
4. ✅ Gather community feedback

---

## 📁 FILES CHECKLIST

### Data Files (Create 3)
- [ ] `data/devices-ja.json` - 98+ devices translated
- [ ] `data/brands-ja.json` - Brands reordered for Japan
- [ ] `data/categories-ja.json` - Category translations

### CSS Files (Create 1, Update 1)
- [ ] `src/css/modern-ja.css` - NEW
- [ ] `tailwind.config.js` - UPDATE

### Template Files (Create 8)
- [ ] `src/templates/device-ja.html` - Device page
- [ ] `src/templates/home-ja.html` - Homepage
- [ ] `src/templates/category-ja.html` - Category listing
- [ ] `src/templates/about-ja.html` - About page
- [ ] `src/templates/privacy-ja.html` - Privacy policy
- [ ] `src/templates/terms-ja.html` - Terms
- [ ] `src/templates/affiliate-disclosure-ja.html` - PR disclosure
- [ ] `src/templates/faq-ja.html` - FAQ

### JavaScript Files (Create 1, Review 1)
- [ ] `src/js/search-ja.js` - NEW
- [ ] `src/js/components.js` - REVIEW

### Build Scripts (Update 6)
- [ ] `scripts/generator/build.js` - UPDATE
- [ ] `scripts/generator/generate-device-pages.js` - UPDATE
- [ ] `scripts/generator/generate-category-pages.js` - UPDATE
- [ ] `scripts/generator/generate-core-files.js` - UPDATE
- [ ] `scripts/generator/helpers.js` - UPDATE
- [ ] `package.json` - UPDATE

### Config Files (Update 2)
- [ ] `vercel.json` - UPDATE
- [ ] `.env` or config file - CREATE if needed

### Documentation (Create 1)
- [ ] `JAPANESE_TRANSLATION_GLOSSARY.md` - Translation reference

---

## 🔗 CRITICAL DEPENDENCIES

```
Data Files
    ↓
CSS/Typography
    ↓
Device Template + Build Scripts
    ↓
Search Functionality + Other Templates
    ↓
Testing & QA
    ↓
Launch
```

**Blocking Issues:**
- Cannot build templates until `devices-ja.json` exists
- Cannot test search until `search-ja.js` is implemented
- Cannot deploy until build scripts support Japanese pipeline

---

## 📝 NOTES

### Key Files to Review First
1. `JAPANESE_LOCALIZATION_GUIDE.md` - Strategic decisions
2. `BRAND_GUIDELINES.md` - Existing brand (English)
3. `ARCHITECTURE.md` - Current build system

### Translation Strategy
- Use `です・ます` form (polite, professional)
- Include Katakana variants in `searchTerms`
- Keep technical terms in English (V30, UHS-II, etc.)
- Use Japanese punctuation (、。「」)
- Japanese comma (、) not English comma (,)

### Testing Checklist
- [ ] Font rendering on macOS, Windows, iOS, Android
- [ ] Search: English, Katakana, abbreviated, mixed case
- [ ] Forms: Japanese IME input
- [ ] No italics rendering
- [ ] Line breaks don't occur mid-word
- [ ] Core Web Vitals > 90
- [ ] WCAG AA contrast ratios met
- [ ] 4+ browsers tested

### Launch Readiness
- [ ] All pages translated
- [ ] Search tested thoroughly
- [ ] Legal disclosures in place
- [ ] Google Search Console set up
- [ ] Analytics tracking configured
- [ ] Backup & rollback plan ready

---

## 🎬 NEXT STEPS

**Immediate Actions:**
1. Review `JAPANESE_LOCALIZATION_GUIDE.md` for strategic decisions
2. Decide on URL structure: `/ja/` subdirectory vs `ja.sdcardchecker.com`
3. Prioritize which device pages to translate first (Walkman, Nintendo Switch, GoPro)
4. Start Sprint 1: Data & CSS

**Questions to Answer:**
- Who will handle translation? (in-house, contractor, native speaker review?)
- URL structure preference?
- Launch date target?
- Phased rollout or all-at-once?

---

## 📞 CONTACT & APPROVAL

**Project Lead:** Pietro  
**Status Updates:** Weekly  
**Next Review:** [TBD]

---

**Last Updated:** Dec 29, 2025  
**Version:** 1.0
