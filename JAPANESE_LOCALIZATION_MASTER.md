# Japanese Localization - Master Document

**Date:** December 25, 2025  
**Status:** 45% Complete → 95% in 2-3 Hours  
**Single Source of Truth:** All localization info consolidated here

---

## 🎯 Executive Summary

Your Japanese localization is **45% complete**. All infrastructure is ready. By spending **2-3 hours translating 182 FAQ items**, you can reach **95% completion and launch**. Everything is documented, no blockers, ready to implement today.

---

## 📊 LOCALIZATION STATUS KANBAN

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    JAPANESE LOCALIZATION KANBAN BOARD                     │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  🟢 DONE (100%)                  🟡 IN PROGRESS (1%)                     │
│  ═════════════════════════════    ══════════════════════════════════     │
│                                                                           │
│  ✅ UI & Navigation              ⏳ Device FAQs (182 items)              │
│  ✅ Device Pages (140)              Status: 1/183 translated             │
│  ✅ Category Pages (9)              Effort: 2-3 hours                    │
│  ✅ SD Card Database                Tools: ChatGPT (free)                │
│  ✅ Guides (3)                      Priority: CRITICAL                   │
│  ✅ Calculators (2)                 Assigned: [Your team]                │
│  ✅ Build System                    Due: TODAY                           │
│  ✅ Components/Navigation                                                │
│  ✅ Data Structures (140 devices)  ⏳ whySpecs (139 items)               │
│  ✅ FAQ Generator                    Status: 1/140 translated             │
│                                       Effort: 30 minutes                  │
│  Total: 16 items                      Tools: ChatGPT                      │
│  Time: Done ✅                        Priority: OPTIONAL                 │
│                                       Assigned: [After FAQs]              │
│                                       Due: Later today                    │
│                                                                           │
│  🔴 BLOCKED (0%)                                                         │
│  ═════════════════════════════════════════════════════════════           │
│                                                                           │
│  ⏳ Amazon JP Integration                                                │
│     Blocker: Japanese Amazon Associates account not approved             │
│     Effort: 8-10 hours dev + 3-7 days account wait                       │
│     Revenue Impact: +$1,000-$2,500/year                                  │
│     Status: Full spec complete, ready to implement                       │
│     Timeline: After account approved                                     │
│                                                                           │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                   SPRINT COMPLETION TARGETS                       │  │
│  ├────────────────────────────────────────────────────────────────────┤  │
│  │ Target 1 (95% - TODAY):   Translate 182 FAQs → Deploy             │  │
│  │ Target 2 (98% - TODAY):   + Translate 139 whySpecs → Deploy       │  │
│  │ Target 3 (100% - FUTURE): + Amazon JP Integration → Deploy        │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 COMPONENT STATUS BREAKDOWN

| Component | Status | Items | Effort | Timeline |
|-----------|--------|-------|--------|----------|
| **UI & Navigation** | ✅ Done | All labels | Complete | N/A |
| **Device Pages** | ✅ Done | 140 | Complete | N/A |
| **Category Pages** | ✅ Done | 9 | Complete | N/A |
| **SD Card Database** | ✅ Done | 25+ products | Complete | N/A |
| **Guides** | ✅ Done | 3 guides | Complete | N/A |
| **Calculators** | ✅ Done | 2 tools | Complete | N/A |
| **Build System** | ✅ Done | Scripts ready | Complete | N/A |
| **Components** | ✅ Done | Navbar, footer, etc | Complete | N/A |
| **Data Structures** | ✅ Done | 140 devices configured | Complete | N/A |
| **FAQ Generator** | ✅ Done | Working & tested | Complete | N/A |
| **Device FAQs** | 🟡 1% | 182 items | 2-3 hours | Today |
| **Device whySpecs** | 🟡 5% | 139 items | 30 min | Today (opt) |
| **Amazon Integration** | ⏳ 0% | Code ready | 8-10 hrs + wait | Future |

---

## 📈 CURRENT PROGRESS

```
OVERALL LOCALIZATION PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Now:      ███████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  45%
Target:   ████████████████████████████░░░░░░░░░░░░░░░░  95%
Ultimate: ██████████████████████████████████████████████  100%

EFFORT NEEDED TO REACH TARGET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

To 95%:    Work 2-3 hours TODAY → Deploy today/tonight
To 100%:   Wait 3-7 days for JP account + work 8-10 hours → Deploy
```

---

## ✅ WHAT'S 100% COMPLETE

### 1. Core Infrastructure (16 files)
- ✅ **Data Files:**
  - `data/devices-ja.json` (140 devices, fully structured)
  - `data/sdcards-ja.json` (SD cards, fully translated)

- ✅ **Main Templates (7 files):**
  - `home-ja.html` - Japanese homepage
  - `device-ja.html` - Device page template
  - `category-ja.html` - Category page template
  - `about-ja.html` - About page
  - `privacy-ja.html` - Privacy policy (APPI-compliant)
  - `faq-ja.html` - FAQ index page
  - `terms-ja.html` - Legal terms page

- ✅ **High-Value Guides (3 files):**
  - `guides/sd-card-speed-classes-ja.html` - Keywords: V30, A1, A2
  - `guides/is-my-sd-card-fake-ja.html` - Keywords: 偽物, 見分け方
  - `guides/nintendo-switch-sd-card-guide-ja.html` - Keywords: Switch 移行

- ✅ **Calculators (2 files):**
  - `tools/recording-time-calculator-ja.html` - Camera/GoPro/Drone/Dashcam
  - `tools/dashcam-storage-calculator-ja.html` - ドラレコ focused

- ✅ **Components & Navigation (1 file):**
  - `components-ja.js` - Navbar, footer, sidebar, language switcher

- ✅ **Generator Scripts (3 files):**
  - `build-ja.js` - Japanese build orchestrator
  - `generate-device-pages-ja.js` - Device page generator
  - `generate-category-pages-ja.js` - Category page generator
  - `generateFAQs-ja.js` - FAQ generator with custom merge

### 2. Build System
- ✅ `package.json` - Commands: `build:ja` and `build:all`
- ✅ Build tested and verified
- ✅ **153 pages successfully generated:**
  - 140 device pages ✅
  - 9 category pages ✅
  - 3 guide pages ✅
  - 1 home page ✅

---

## 🟡 WHAT'S PENDING (2-3 HOURS OF WORK)

### 1. FAQ Translations (CRITICAL - 2-3 Hours)

**What:** Translate 182 FAQ items from English to Japanese  
**Where:** `data/devices-ja.json` → `devices[].faq[].q` and `devices[].faq[].a`  
**Status:** 1/183 translated (0.5%)  
**Effort:** 2-3 hours with ChatGPT  
**Tools:** Free (ChatGPT) or Google Translate  

**Top 10 Devices Needing FAQ Translation:**
1. GoPro Hero 13 Black (3 FAQs)
2. Nintendo Switch (3 FAQs)
3. DJI Mini 4 Pro (3 FAQs)
4. Canon EOS R5 (3 FAQs)
5. Nikon D850 (3 FAQs)
6. Orange Pi 5 (3 FAQs)
7. Lenovo Legion Go S (3 FAQs)
8. GoPro Max 2 (3 FAQs)
9. Nikon D500 (3 FAQs)
10. Sony A7R (3 FAQs)

**Translation Process:**

```
Step 1: Copy FAQ List (2 min)
  → File: FAQLIST_FOR_TRANSLATION.txt

Step 2: Use ChatGPT (90-120 min)
  → Go to: https://chat.openai.com/
  → Prompt:
     "Translate these FAQ Q&A pairs from English to Japanese.
      Keep HTML tags <b>, <li>, <ul> intact.
      Keep terms like V30, V60, V90, MB/s in English.
      Keep brand names (SanDisk, Kingston) in English.
      Use polite Japanese (です/ます form).
      Use Japanese punctuation (、。 not ,.)
      
      Q: [QUESTION]
      A: [ANSWER]
      
      Provide ONLY the translated Q and A."

Step 3: Update JSON (30 min)
  → File: data/devices-ja.json
  → Find device section
  → Replace English Q&A with Japanese

Step 4: Rebuild (5 min)
  → npm run build:ja

Step 5: Test (5 min)
  → Open: http://localhost:3000/ja/categories/action-cameras/gopro-hero-13/

Step 6: Deploy (5 min)
  → npm run build:all

TOTAL: 2.5-3.5 hours
```

**Translation Example:**

**BEFORE:**
```json
{
  "q": "Can I use a full-size SD card with an adapter?",
  "a": "<b>No, the GoPro Hero 13 Black only accepts microSD cards.</b> Full-size SD cards will not work even with an adapter."
}
```

**AFTER:**
```json
{
  "q": "フルサイズSDカードをアダプターで使用できますか？",
  "a": "<b>いいえ、GoPro Hero 13 BlackはmicroSDカードのみに対応しています。</b>フルサイズSDカードはアダプターを使用しても機能しません。"
}
```

**Translation Rules:**
- ✅ Keep HTML tags: `<b>`, `<li>`, `<ul>`
- ✅ Keep technical terms: V30, V60, V90, MB/s, UHS-II
- ✅ Keep brand names: SanDisk, Kingston, Canon, Nikon
- ✅ Keep device names in English
- ✅ Use polite Japanese (です/ます form)
- ✅ Use Japanese punctuation (、。)

### 2. Device whySpecs Translations (OPTIONAL - 30 Minutes)

**What:** Translate 139 short explanations (1-2 sentences each)  
**Where:** `data/devices-ja.json` → `devices[].whySpecs`  
**Status:** 1/140 translated (0.7%)  
**Effort:** 30 minutes with ChatGPT batch  
**Priority:** Optional (less visible than FAQs)  

**Example:**
```json
{
  "whySpecs": "This camera is optimized for 8K recording, requiring V90 for sustained 200+ MB/s writes. V60 cards may fail during high frame rate recording."
}
```

Becomes:
```json
{
  "whySpecs": "このカメラは8K録画に最適化されており、200 MB/s以上の持続書き込みのためにV90が必要です。高フレームレート録画中にV60カードが失敗する可能性があります。"
}
```

---

## ⏳ WHAT'S BLOCKED (Future - Amazon Integration)

### Amazon JP Marketplace Integration (8-10 Hours + 3-7 Day Wait)

**Problem:** Japanese pages show US Amazon links (amazon.com, USD) instead of JP links (amazon.co.jp, ¥JPY)

**Solution:**
```
npm run build       → amazon.com API → cache-us/ → /dist/
npm run build:ja    → amazon.co.jp API → cache-ja/ → /dist/ja/
```

**Blocker:** Need Japanese Amazon Associates account (not yet setup)
- Account approval: 3-7 days
- Implementation: 8-10 hours
- Revenue benefit: +$1,000-$2,500/year

**Implementation Phases:**

1. **Phase 1:** Update `src/utils/amazon-api.js` (30 min)
   - Add region parameter support (US vs JP)
   - Create client config for both regions
   
2. **Phase 2:** Update `scripts/build-amazon-data.js` (1 hour)
   - Add Japanese keyword search groups
   - Create separate cache directories
   
3. **Phase 3:** Update `scripts/generator/build.js` (10 min)
   - Call US Amazon API before building
   
4. **Phase 4:** Update `scripts/generator/build-ja.js` (10 min)
   - Call JP Amazon API before building
   
5. **Phase 5:** Update generators (1 hour)
   - Pass cache directory dynamically
   - Update amazon-badges-generator.js
   - Update generate-device-pages.js

**Environment Variables Needed:**
```bash
AMAZON_ACCESS_KEY_JA=your_jp_key
AMAZON_SECRET_KEY_JA=your_jp_secret
AMAZON_TAG_JA=sdcc-22
```

**Files Involved:**
- `src/utils/amazon-api.js`
- `scripts/build-amazon-data.js`
- `scripts/generator/build.js`
- `scripts/generator/build-ja.js`
- `scripts/generator/amazon-badges-generator.js`
- `scripts/generator/generate-device-pages.js`

---

## 🚀 IMMEDIATE ACTION PLAN

### TO REACH 95% LOCALIZATION (TODAY - 2-3 HOURS)

```
⏰ TIMELINE

00:00 - Open FAQLIST_FOR_TRANSLATION.txt
00:02 - Open ChatGPT (https://chat.openai.com/)
00:05 - Copy ChatGPT prompt (from Translation Process section above)
00:15 - Start first batch of 10 FAQs
01:00 - Finish 10 FAQs + update data/devices-ja.json
01:30 - Repeat for batches 2-10 (90 more FAQs)
02:30 - Repeat for batches 11-18 (remaining 82 FAQs)
03:30 - npm run build:ja (rebuild)
03:35 - Test on localhost
03:40 - npm run build:all (deploy)
03:45 - ✅ DONE! 95% Localization Complete
```

### STEP-BY-STEP INSTRUCTIONS

**Step 1: Gather Materials (5 min)**
```
Files needed:
  ✅ FAQLIST_FOR_TRANSLATION.txt - Pre-formatted FAQ list
  ✅ data/devices-ja.json - Main file to edit
  ✅ ChatGPT open - Translation tool
  ✅ Terminal ready - For npm commands
```

**Step 2: Translate FAQs (90-120 min)**
```
Process:
  1. Copy 10 FAQ items from FAQLIST_FOR_TRANSLATION.txt
  2. Paste into ChatGPT with prompt
  3. Get Japanese translations
  4. Copy results
  5. Find matching device in data/devices-ja.json
  6. Update Q and A fields
  7. Save file
  8. Repeat for remaining 18 batches
```

**Step 3: Rebuild Japanese Site (5 min)**
```bash
npm run build:ja
```

**Step 4: Test Locally (5 min)**
```
1. Open browser: http://localhost:3000/ja/
2. Check a device page: /ja/categories/action-cameras/gopro-hero-13/
3. Verify FAQs are in Japanese
4. Verify HTML formatting works
5. Check mobile layout
```

**Step 5: Deploy (5 min)**
```bash
npm run build:all
```

**Step 6: Verify on Live Site**
```
Once deployed, test on:
  https://sdcardchecker.com/ja/categories/action-cameras/gopro-hero-13/
```

---

## 📋 TRANSLATION QUALITY CHECKLIST

Before deploying, verify:
- [ ] No English text visible in FAQ section
- [ ] FAQ answers display fully (no truncation)
- [ ] HTML tags `<b>`, `<li>` render correctly
- [ ] Japanese punctuation displays (、。)
- [ ] Brand names stay in English (SanDisk, Kingston)
- [ ] Technical specs stay in English (V60, V90, MB/s)
- [ ] Mobile layout not broken by longer Japanese text
- [ ] Amazon links still work
- [ ] Build completed without errors

---

## 🔧 QUICK REFERENCE COMMANDS

```bash
# Check FAQ translation status
node scripts/translator-batch.js --status

# Export untranslated FAQs to CSV
node scripts/translator-batch.js --csv

# Rebuild Japanese site after translation
npm run build:ja

# Rebuild both English and Japanese
npm run build:all

# Test locally
open http://localhost:3000/ja/

# View specific device page
open http://localhost:3000/ja/categories/action-cameras/gopro-hero-13/
```

---

## 📊 KEY METRICS

| Metric | Value |
|--------|-------|
| **Current Completion** | 45% |
| **Target Completion** | 95% |
| **Ultimate Completion** | 100% |
| **Devices Configured** | 140 |
| **FAQs Needing Translation** | 182 |
| **whySpecs Needing Translation** | 139 |
| **Pages Generated** | 153 |
| **Build Time** | ~30 seconds |
| **FAQ Translation Time** | 2-3 hours |
| **whySpecs Translation Time** | 30 minutes |
| **Amazon Setup Wait** | 3-7 days |
| **Amazon Dev Time** | 8-10 hours |
| **Additional Annual Revenue (Amazon)** | $1,000-$2,500 |

---

## 📁 FILES INVOLVED

### Data Files to Edit
| File | Purpose | Status |
|------|---------|--------|
| `data/devices-ja.json` | Main file with FAQs to translate | Ready |
| `data/sdcards-ja.json` | SD card data | Already translated ✅ |

### Reference/Resource Files
| File | Purpose | Status |
|------|---------|--------|
| `FAQLIST_FOR_TRANSLATION.txt` | Pre-formatted FAQ list for ChatGPT | Ready |
| `faq-to-translate.csv` | CSV export for bulk services | Ready |
| `FAQ_TRANSLATION_GUIDE.md` | Translation patterns & rules | Available |

### Build & Deploy Commands
| Command | Purpose |
|---------|---------|
| `npm run build:ja` | Rebuild Japanese site only |
| `npm run build:all` | Rebuild English + Japanese |

### Build Scripts
| File | Purpose | Status |
|------|---------|--------|
| `scripts/generator/build-ja.js` | Japanese build orchestrator | Ready |
| `scripts/generator/generate-device-pages-ja.js` | Device page generator | Ready |
| `scripts/generator/generate-category-pages-ja.js` | Category page generator | Ready |
| `scripts/generator/generateFAQs-ja.js` | FAQ generator | Ready |

---

## 🎯 DECISION MATRIX

### Should We Deploy Now or Wait?

| Option | Pros | Cons | Timeline |
|--------|------|------|----------|
| **Deploy Now (60%)** | Fast launch | Mixed English/Japanese | Today |
| **After FAQs (95%)** | Professional | 2-3 hrs more work | Today +2-3hrs |
| **Full Amazon (100%)** | Complete | 3-7 day wait + 8-10 hrs | 1-2 weeks |

**RECOMMENDATION:** Complete FAQs today (95%), deploy tonight, add Amazon when account ready.

---

## ✅ COMPLETION CHECKLIST

### Phase 1: Foundation (COMPLETE ✅)
- [x] UI fully localized
- [x] Device pages structured
- [x] Category pages generated
- [x] Data files prepared
- [x] Build system ready
- [x] 153 pages generated

### Phase 2: Core Content (IN PROGRESS 🟡)
- [ ] 182 FAQ items translated
- [ ] 139 whySpecs translated (optional)
- [ ] Build verified
- [ ] Deployed to production

### Phase 3: Full Optimization (FUTURE ⏳)
- [ ] Amazon JP account approved
- [ ] Amazon API implemented
- [ ] Dual marketplace tested
- [ ] Deployed to production

---

## 📈 SUCCESS CRITERIA

### Level 1: Minimum Launch (60%)
```
✅ Can navigate site in Japanese
✅ View all device pages
✅ Access guides and calculators
❌ Some FAQs in English (acceptable)
```

### Level 2: Professional Launch (95%) ← TARGET
```
✅ Can navigate site in Japanese
✅ All pages in Japanese
✅ All FAQs in Japanese
✅ Professional appearance
❌ US Amazon prices (acceptable)
```

### Level 3: Full Optimization (100%)
```
✅ Can navigate site in Japanese
✅ All pages in Japanese
✅ All FAQs in Japanese
✅ JP Amazon prices (¥)
✅ Maximum revenue
```

---

## 💡 TIPS FOR SUCCESS

1. **Start with top 10 devices** - Gets 30 immediate FAQs done
2. **Batch in groups of 10** - Faster than translating one-by-one
3. **Save frequently** - JSON file is large
4. **Use ChatGPT** - Better quality than Google Translate
5. **Test early** - Verify one device page works before doing all
6. **Keep backups** - Save copy of devices-ja.json before starting

---

## 🚨 COMMON ISSUES & FIXES

| Issue | Solution |
|-------|----------|
| JSON won't save | File too large, save in chunks |
| Build fails | Check JSON syntax with validator |
| FAQ not appearing | Verify `q` and `a` fields exist |
| Page shows English | Clear browser cache, hard refresh |
| WhySpecs not showing | Check field name is exactly `whySpecs` |

---

## 📞 REFERENCE MATERIALS

### Original Documentation (For Reference)
- `JAPAN_LOCALIZATION_KANBAN.md` - Original kanban
- `TRANSLATION_STATUS_SUMMARY.md` - Status metrics
- `AMAZON_API_JAPANESE_LOCALIZATION.md` - Amazon detailed spec
- `FAQ_LOCALIZATION_VERIFICATION.md` - FAQ system verification
- `FAQ_TRANSLATION_GUIDE.md` - Translation patterns

### Available Tools
- `scripts/translator-batch.js` - Status checking
- `FAQLIST_FOR_TRANSLATION.txt` - Pre-formatted FAQ list
- `faq-to-translate.csv` - CSV for bulk translation

---

## 🎬 FINAL SUMMARY

**Current State:** 45% complete, all infrastructure ready  
**Next Action:** Translate 182 FAQs (2-3 hours)  
**Result:** 95% complete, launch-ready  
**Timeline:** Today  
**Effort:** 2-3 hours of work  
**Resources:** Free (ChatGPT)  
**Blockers:** None  

**Future (When Ready):**
- Setup Amazon JP account (3-7 day wait)
- Implement dual marketplace (8-10 hours)
- Reach 100% + gain $1k-2.5k/year revenue

---

**Master Document Created:** December 25, 2025  
**Single Source of Truth:** ✅ This document  
**Ready to Implement:** ✅ YES  
**Start Now:** ✅ Open ChatGPT and FAQLIST_FOR_TRANSLATION.txt
