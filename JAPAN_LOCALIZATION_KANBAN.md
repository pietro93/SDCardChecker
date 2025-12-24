# Japan Localization Kanban

**Status:** 🚀 PRODUCTION READY — All 16 templates complete = 100%  
**Target Launch:** IMMEDIATELY READY  
**Market Opportunity:** 892 impressions, 0 clicks → Est. $400-500/year additional revenue

---

## 🎯 STRATEGIC TODO LIST (Priority Order)

### 📌 HIGH-IMPACT TASKS (Must Complete)

**[1] Utility Templates (2 pages) - Foundation**
- [x] **terms-ja.html** — Legal page (19-section APPI-compliant, affiliate disclosure, product liability) ✅
  - Status: COMPLETE - Full Japanese legal framework, links to privacy/contact
- [x] **guides-ja.html** — Index page linking all guides/tools ✅
  - Status: COMPLETE - Links 3 guides + 2 calculators, learning path, FAQ schema

**[2] High-ROI Guides (2 pages) - SEO Gold** ✅ COMPLETE
- [x] **sd-card-speed-classes-ja.html** — Title: "SDカードのスピードクラス・UHS・Vクラス 解説" ✅
  - Target keywords: "V30 とは", "A1 A2 違い", "速度クラス"
  - Content: V30/V60/V90, A1/A2 specs, UHS tiers explained
  - Includes: 4 use-case sections, FAQ schema, 5 FAQs
  - Status: COMPLETE - Ready for build
  
- [x] **is-my-sd-card-fake-ja.html** — Title: "偽物SDカードの見分け方と対策" ✅
  - Target keywords: "偽物 SDカード", "本物 見分け方", "Amazon 偽造"
  - Content: Interactive wizard (4-step diagnosis), full detection guide, software testing
  - Includes: HowTo schema, FAQ schema, complete step-by-step instructions
  - Status: COMPLETE - Ready for build

**[3] New Japanese Opportunity (1 page) - Massive Keywords**
- [x] **nintendo-switch-sd-card-guide-ja.html** — Title: "Switch用SDカードの選び方 2025 (容量・速度・移行方法)" ✅
  - Target keywords: "Switch SDカード 移行", "Switch 容量 足りない", "Switch 推奨 SDカード"
  - Content: Which cards work, capacity recommendations, migration steps, HowTo + FAQ schemas
  - Link to: Switch device page in calculator
  - High-value: Nintendo Switch is huge in Japan + high purchase intent
  - Status: COMPLETE - Ready for build

**[4] Consolidated Calculators (2 pages) - Smart Consolidation**
- [x] **recording-time-calculator-ja.html** — Title: "SDカード 録画時間 計算機" ✅
  - Strategy: ONE page with dropdown menu (Camera / GoPro / Drone / Dashcam)
  - Why: Japanese users prefer comprehensive tools, not fragmented pages
  - Target keywords: "SDカード 録画時間", "容量 計算", "ビデオ 何時間"
  - Status: COMPLETE - Video + Photo tabs, device presets, FAQ schema
  
- [x] **dashcam-storage-calculator-ja.html** — Title: "ドライブレコーダー 容量 計算機" ✅
  - Keep separate because: Japan has MASSIVE dashcam market (ドラレコ)
  - Almost every car in Japan has one
  - High search volume: "ドラレコ 容量 目安", "ドライブレコーダー SDカード 推奨"
  - Status: COMPLETE - Loop recording, High Endurance emphasis, device presets

**[5] Build & Deployment** — 🚀 COMPLETE
- [x] ✅ `build-ja.js` — Build script for Japanese site
- [x] ✅ `package.json` — `build:ja` and `build:all` commands already configured
- [x] ✅ Full build completed successfully
  - 140 Japanese device pages ✓
  - 9 Japanese category pages ✓
  - 3 Japanese guide pages ✓
  - 1 Japanese home page ✓
  - Japanese category index ✓
- [ ] **Next:** Deploy to Vercel + submit to Google Search Console

---

## ✅ ALREADY COMPLETED (9 files - Foundation)

- [x] **Data:** devices-ja.json (140 devices + metadata)
- [x] **Main:** home-ja.html
- [x] **Main:** device-ja.html
- [x] **Main:** category-ja.html
- [x] **Components:** components-ja.js (navbar, footer, sidebar, language switcher)
- [x] **Generator:** generate-category-pages-ja.js
- [x] **Utility:** about-ja.html
- [x] **Utility:** privacy-ja.html
- [x] **Utility:** faq-ja.html

---

## ❌ DROPPED (Won't Build - Low ROI)

**Calculators to Drop:**
- ~~video-storage-ja.html~~ → Merged into recording-time-calculator
- ~~photo-storage-ja.html~~ → People care less about photo space now
- ~~gopro-storage-ja.html~~ → Merged into recording-time-calculator
- ~~drone-storage-ja.html~~ → Merged into recording-time-calculator
- ~~action-camera-storage-ja.html~~ → Merged into recording-time-calculator
- ~~security-camera-storage-ja.html~~ → Security cams lower priority in Japan
- ~~timelapse-storage-ja.html~~ → Niche use case, skip

**Guides to Drop:**
- ~~sd-card-guide-ja.html~~ → Generic, low SEO impact
- ~~video-bitrate-comparison-ja.html~~ → Too technical, merge key info into Speed Classes guide
- ~~raw-vs-jpeg-ja.html~~ → Canon/Nikon/Sony own this space, can't compete

---

## 📊 Final Project Scope

| Category | Count | Files |
|----------|-------|-------|
| ✅ Completed | 9 | Core infrastructure |
| 📝 Pending (High-ROI) | 7 | 2 utilities + 2 guides + 1 new guide + 2 calculators |
| ❌ Dropped | 6 | Low ROI/generic content |
| **Total Effort** | **16** | Down from 22 pages |

---

## 💡 SEO Strategy Summary

| Page | Target Market | Search Volume | Keywords |
|------|----------------|---------------|----------|
| Speed Classes Guide | Spec enthusiasts | High | V30, A1, UHS |
| Fake Cards Guide | Safety-conscious buyers | High | 偽物, 見分け方 |
| **Switch Guide (NEW)** | **Nintendo fans** | **Very High** | **Switch 移行, 容量** |
| Recording Time Calc | All video users | High | 録画時間, 計算 |
| Dashcam Calc | Car owners | Very High | ドラレコ, 容量 目安 |

---

## 📋 Translation Reference

| English | Japanese | Notes |
|---------|----------|-------|
| SD Card | SDカード | — |
| Speed Class | 速度クラス | A1, A2, V30, V60, V90 |
| Recording Time | 録画時間 | — |
| Fake Card | 偽物カード | — |
| Dashcam | ドライブレコーダー / ドラレコ | Japan-specific |
| Capacity | 容量 | — |
| Transfer | 移行 / 転送 | For Switch guide |

**Style:** Polite Japanese (です/ます), keep technical specs as-is

---

**Last Updated:** Dec 24, 2025  
**Completion:** 100% (16/16 templates) | **Build:** ✅ COMPLETE | **Pages:** 153 generated ✅ | **Guides:** 3/3 ✅ | **Legal:** 1/1 ✅  
**Status:** 🚀 **PRODUCTION READY FOR LAUNCH** — All 153 pages built & deployed to /dist/
