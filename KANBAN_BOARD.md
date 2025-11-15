# SD Card Checker - Agile Kanban Board

**Last Updated:** November 14, 2025  
**Project Status:** LIVE - Growth & Monitoring Phase  
**Site:** https://sdcardchecker.com  
**Audience:** Device owners searching for the right SD card

---

## 📊 BOARD OVERVIEW

| Column | Count | Health |
|--------|-------|--------|
| **MONITORING** | 1 | 👀 Passive tracking |
| **ACTIVE WORK** | 3 | 🔧 In progress |
| **BACKLOG** | 2 | 🟡 Defer 60+ days |
| **DONE** | 27 | ✅ Complete |

---

## 👀 MONITORING (Passive - Check Weekly)

### KANBAN-2 | SEO Performance Tracking
- **Status:** LIVE - Baseline data collection
- **Owner:** You
- **What's done:**
  - ✅ Google Search Console configured + sitemap submitted
  - ✅ Bing Search Console configured + sitemap submitted
  - ✅ GA4 installed
  - ✅ Amazon Associates dashboard tracking clicks
- **What's pending:**
  - [ ] GSC needs 1-2 weeks to show meaningful impressions/clicks data
  - [ ] Weekly tracking: Check GSC impressions & affiliate clicks from Amazon Associates
- **Current data:**
  - Traffic: Low but present (first 3 days)
  - Affiliate clicks: Confirmed active on Amazon Associates
  - Next review: Nov 21 (1 week)
- **Success Criteria:** 
  - By Dec 1: Can see which device pages are getting impressions
  - By Dec 15: Can see patterns in what's working
- **Weekly checklist:**
  - [ ] Note GSC total impressions (from "Performance" tab)
  - [ ] Note affiliate clicks from Amazon Associates dashboard
  - [ ] Update tracking spreadsheet

---

## 🔧 ACTIVE WORK (Do This Week)

### KANBAN-9 | Affiliate Link Audit & Testing
- **Status:** PENDING - High priority, quick win
- **Owner:** You
- **Deadline:** This week (Nov 14-21)
- **Effort:** ~1-2 hours (spread over a few days)
- **Why:** You're already getting affiliate clicks. Making sure all 200+ links work = protecting revenue.
- **What to do:**
  - [ ] Test the 3 untested affiliate links (click each one, verify Amazon redirect works)
  - [ ] Spot-check 10 random affiliate links from your site (are they going to the right product?)
  - [ ] If any are broken: note them and fix
  - [ ] Document the testing (simple text log: "Tested 13 links Nov 14, all working")
- **Success Criteria:** All tested links redirect correctly; zero dead links found

---

### KANBAN-11 | SEO Keyword Optimization Based on GSC Data (NEW)
- **Status:** PENDING - Medium priority, high impact
- **Owner:** You
- **Deadline:** Next 2 weeks (Nov 21 - Dec 5)
- **Effort:** ~3-4 hours (implementation + testing)
- **Why:** GSC shows specific search patterns. Fixing content gaps = easy clicks. Already showing impressions = proven demand.
- **Key findings from first day of GSC data:**
  - ✅ You have impressions (2-1 per query) - proven demand exists
  - ❌ 0 clicks on all queries - search intent not matching content
  - Pattern: Users searching "X requirements" or "X recommendations" or "X compatible cards"
  
- **QUICK FIXES (Easy wins - 2 hrs):**
  1. Add keyword variations to title tags
     - Current: `Best SD Card for {{DEVICE_NAME}} | {{TYPE}} {{SPEED}}`
     - Add: Include "requirements" or "recommendations" in meta description
     - Devices to prioritize: DJI Mini 4 Pro, Sony A6700, GoPro Hero 13, Steam Deck
  
  2. Enhance FAQ section with exact search queries
     - Current FAQs: Generic questions
     - Add FAQ entries that exactly match search queries (e.g., "What are the SD card requirements for DJI Mini 4 Pro?")
     - This targets featured snippet opportunities
  
  3. Improve answer box clarity
     - Ensure first FAQ answer explicitly states "requirements"
     - Example: "The DJI Mini 4 Pro **requires** microSD UHS-I V30..."
  
- **CRITICAL DEVICES (Showing impressions):**
  - **DJI Mini 4 Pro** (2 impressions for "memory card requirements")
    - Add alt text: "DJI Mini 4 Pro memory card requirements specification"
    - Add FAQ: "What are the DJI Mini 4 Pro SD card requirements?"
    - Enhance title: Include "requirements" variant
  
  - **DJI Osmo Pocket 3** (1 impression)
    - Add FAQ: "What SD card does DJI Osmo Pocket 3 require?"
    - Add searchable text: "DJI Osmo Pocket 3 microSD requirements"
  
  - **Sony A6700** (3 impressions total)
    - Add FAQ: "What are Sony A6700 SD card requirements?"
    - Clarify dual card slots in title meta description
  
  - **GoPro Hero 13** (1 impression)
    - Add "microSD recommendations" to FAQ
  
  - **Canon EOS R6 Mark II** (1 impression)
    - Add "memory card requirements" to all sections
  
  - **Steam Deck** (3 impressions)
    - Add FAQ: "What are Steam Deck microSD card requirements?"
  
  - **Nintendo Switch Lite** (1 impression)
    - Add alt text referencing "SD card requirements"

- **CONTENT ADDITIONS (1.5 hrs):**
  - Add "Requirements" section before FAQs in template
  - List: Card type, speed class, capacity, dual-slot info
  - Make it scannable for featured snippets

- **Technical SEO:**
  - Add H3s for keyword variations (e.g., "Requirements", "Specifications", "Compatibility")
  - Update searchTerms in devices.json to include "requirements" variants

- **Next steps:**
  1. Update device.html template with "Requirements" section
  2. Add new searchTerms to devices.json for matching devices
  3. Update FAQ generator to create "requirements" questions
  4. Test pages for featured snippet eligibility
  5. Submit updated pages to GSC

---

### KANBAN-8 | Device Database Expansion (Phase 2) - UPDATED
- **Status:** PENDING - High priority, longer timeline
- **Owner:** You
- **Deadline:** Ongoing (target: 10-15 new devices/week)
- **Priority:** After KANBAN-11 quick wins (content optimization should complete first)
- **Why:** Current 34 devices are showing up in GSC. Expanding 50%+ should increase impressions 2-3x.// we expand making informed decisions based on GSC results
- **Strategy:**
  - Complete KANBAN-11 optimization first (2-3 days)
  - Then start adding devices **next week** once you've tested affiliate links
  - Prioritize based on current GSC keywords missing from your site
  - Aim for 50+ new pages by Dec 15
- **Target devices based on GSC patterns:**
  - **Drones (High priority):** DJI Osmo Pocket 3, DJI Mini 4K, other DJI models
  - **Cameras (High priority):** Canon R6 Mark II, Sony A6700 variants
  - **Gaming (Medium priority):** Nintendo Switch Lite alternatives
  - **Raspberry Pi:** New emerging search (1 impression in first day)
- **Process per device:**
  - Research official specs (max capacity, speed class, card type)
  - Create device page (reuse existing template + schema)
  - Test page renders correctly
  - Deploy
  - Estimate: 20-30 min per device once you dial in the process
- **Next step:** After KANBAN-11, pick DJI/Canon/Sony category to expand.

---

## 🟡 DEFERRED (60+ Days - Revisit in January)

### KANBAN-1 | Phase 2 UX Features (Filtering/Sorting)
- **Status:** Deferred
- **Reason:** Low ROI pre-revenue. Only build if Analytics shows users bouncing because they can't find things.
- **Revisit condition:** When you have 4+ weeks of traffic data showing a clear pattern.

---

### KANBAN-5 | Device Comparison Feature
- **Status:** Deferred
- **Reason:** SEO-driven users don't need comparison tools. They want one answer: "What SD card should I buy for my device?"
- **Revisit condition:** If Analytics shows 10%+ of users visiting 2+ device pages in one session (indicates they're comparing).

---

### KANBAN-10 | Code Quality & Performance Audit
- **Status:** Deferred
- **Reason:** Lighthouse already at 90+. Not a bottleneck.
- **Revisit condition:** If Google Core Web Vitals report shows issues, or users complain about speed.

---

## ✅ RECENTLY COMPLETED

- ✅ **KANBAN-3 | Production Deployment** (Nov 11) - LIVE at sdcardchecker.com
- ✅ 34 Device Pages Generated & Published
- ✅ Schema Markup (FAQ, Product, Article) Implemented
- ✅ Google Search Console Configured + Sitemap Submitted
- ✅ Bing Search Console Configured + Sitemap Submitted
- ✅ GA4 Installed
- ✅ Amazon Associates Integration Verified
- ✅ First Affiliate Clicks Confirmed (Nov 11-14)

---

## 📈 LIVE METRICS (Updated Nov 14)

### Current State
- **Pages Live:** 53 (34 devices + 10 categories + 9 utilities)
- **Devices Tracked:** 34
- **Domain:** sdcardchecker.com (LIVE)
- **Sitemap Submitted:** Yes (Google + Bing)
- **Affiliate Clicks (First 3 days):** Confirmed active
- **GSC Impressions:** Pending (usually takes 1-2 weeks)
- **Traffic Volume:** Low (expected for first 3 days)

### Phase 2 Goals (Next 90 Days)
| Goal | Target | Timeline |
|------|--------|----------|
| Total Device Pages | 100+ | Dec 15 |
| Weekly Affiliate Clicks | 10+ | Dec 15 |
| Clear traffic patterns | Observable | Dec 1 |

---

## 🎯 YOUR ACTUAL ROADMAP (Nov 14 - Jan 15)

```
NOW (Week 1-2: Nov 14-28)
├─ Test 3 untested affiliate links (1-2 hours)
└─ Identify 10 new target devices (research, don't build yet)

WEEK 3-6 (Nov 28 - Dec 15)
├─ Start adding new devices (10-15/week)
├─ Check GSC weekly (impressions by page)
├─ Check Amazon Associates weekly (affiliate clicks)
└─ Adjust device targets based on what's getting impressions

WEEK 7-12 (Dec 15 - Jan 30)
├─ Continue device expansion based on data
├─ Analyze: Which categories are winning?
├─ Review: Should we pivot or go deeper?
└─ Plan Phase 3 (only if data supports it)
```

---

## 🔥 WEEKLY ROUTINE (Starting Nov 21)

**Every Friday morning (10 min):**
1. Open GSC → click "Performance" → note total impressions
2. Open Amazon Associates dashboard → note total affiliate clicks
3. Update tracking spreadsheet: Date | Impressions | Clicks | Notes
4. Look for patterns (which device pages are getting impressions?)

**That's it.** Not overthinking it yet.

---

## 💭 REALITY CHECK

You shipped. You got users. You got affiliate clicks in 72 hours.

Your job now:
1. **Don't break it.** (Test those 3 links, make sure all links work)
2. **Watch it.** (Weekly GSC + Amazon check)
3. **Feed it.** (Add more devices based on what gets impressions)

Everything else is noise.

---

**Next Steps:** 
1. Test those 3 affiliate links this week
2. Spend 30 min researching one device category you want to target
3. Report back when you're ready to start adding devices

**Last edited:** Nov 14, 2025
