# GSC Analysis & Insights

**Last Updated:** November 16, 2025
**Data Period:** Nov 11 - Nov 16, 2025 (5 days since launch)
**Link:** Referenced in KANBAN_BOARD.md

---

## 📊 Latest Update (Nov 16 - All Time Since Launch)

**Total Search Performance (Cumulative):**
- **Total Impressions:** 1,693 total across all pages
- **Total Clicks:** 12 total
- **Overall CTR:** 0.71%

### Pages with Clicks (Winning Pages)
| Page | Clicks | Impressions | CTR | Status |
|------|--------|-------------|-----|--------|
| Canon EOS R6 Mark II | **2** | 95 | 2.1% | 🟢 BEST CTR |
| DJI Osmo Pocket 3 | 1 | 332 | 0.3% | 🔴 Most traffic, lowest CTR |
| Raspberry Pi 5 | 1 | 82 | 1.22% | 🟡 Consistent |
| Nikon Z8 | 1 | 74 | 1.35% | 🟡 Consistent |
| Sony FX3 | 1 | 44 | 2.27% | 🟢 Good CTR |
| Fujifilm X100VI | 1 | 13 | 7.69% | 🟢 Excellent CTR |
| Miyoo Mini Plus | 1 | 5 | 20% | 🟢 Excellent CTR |
| Leica Q3-43 | 1 | 4 | 25% | 🟢 Excellent CTR |
| /about | 1 | 1 | 100% | Referral traffic |

### Pages with HIGH Traffic but 0 Clicks (Problem Areas)
| Page | Impressions | CTR | Issue |
|------|-------------|-----|-------|
| DJI Mini 4 Pro | 171 | 0% | 🔴 2nd highest traffic, zero conversion |
| Steam Deck | 167 | 0% | 🔴 3rd highest traffic, zero conversion |
| DJI Osmo Action 4 | 102 | 0% | 🔴 High volume, no CTR |
| Sony A6700 | 75 | 0% | 🔴 High volume, no CTR |

---

## 🎯 Critical Insights from Page-Level Data

### Pattern #1: Smaller Audience = Better CTR
**Fujifilm X100VI, Miyoo Mini Plus, Leica Q3-43 show 7-25% CTR**
- These pages have lower impression volume (4-13 impressions)
- But they convert at 5-10x the rate of high-volume pages
- **Hypothesis:** Niche queries are more intent-driven; generic "requirements" queries are less

### Pattern #2: High Volume, Zero Conversion (RED FLAG)
**DJI Mini 4 Pro (171 impressions, 0%) and Steam Deck (167 impressions, 0%)**
- These are #2 and #3 highest traffic pages
- Getting massive organic visibility but ZERO clicks
- **Root cause likely:** Page content doesn't match search intent well enough
- These pages need immediate optimization

### Pattern #3: Canon R6 Mark II Success
**Only page with 2+ clicks (2 clicks from 95 impressions = 2.1%)**
- This is the highest converting high-volume page
- What's working on this page that DJI Mini 4 Pro isn't?
- **Action:** Study Canon R6 Mark II page structure for replication

### Pattern #4: Category Pages Getting Traffic But No Conversions
- /categories/mirrorless-cameras/ → 0 clicks from 2 impressions
- /categories/security-cameras/ → 0 clicks from 1 impression
- /categories/computing-and-tablets/ → 0 clicks from 2 impressions
- **Note:** These shouldn't be getting traffic since we unified to /categories/cameras/
- Check if old category pages still being indexed

---

## 🔥 Highest Demand Devices (All Time)

| Device | Primary Query | Impressions | Status |
|--------|---------------|-------------|--------|
| DJI Osmo Pocket 3 | "sd card requirements" | 12+ | 🔴 0% CTR, CRITICAL |
| DJI Mini 4K | "microsd requirements" | 9 | 🟡 Needs attention |
| DJI Mini 4 Pro | "microsd requirements" | 7-10 | 🔴 0% CTR |
| DJI Osmo Action 4 | "memory card requirements" | 5 | New focus area |
| Steam Deck | "microsd specs" | 5-10 | 🔴 0% CTR |
| Canon R8 | "memory card requirements" | 4 | Emerging |
| GoPro 13 | "sd card requirements" | 3 | Emerging |

---

## 📊 Summary (Nov 11-15)

| Metric | GSC | GA4 | Status |
|--------|-----|-----|--------|
| Total Impressions (Search Results) | 705 | — | ✅ Strong start |
| Organic Traffic (Active Users) | — | 23 | ✅ Converting from search |
| CTR | 0.12% (1 click / 838 clicks?) | — | ⚠️ Low but improving |
| Top Device (Impressions) | DJI Osmo Pocket 3 (20 queries) | DJI Osmo Pocket 3 (168 impressions) | 🔴 0% CTR |
| Winning Page | "best sd card for raspberry pi 5" | Raspberry Pi 5 (1 click, 2.04% CTR) | 🟢 Only converter |

---

## 🕐 24-Hour Update (Nov 15, 9PM - Past 24 Hours)

**Discrepancy Note:** GSC reports only 1 click on queries, but **8 total clicks observed** across pages in past 24 hours. Due to low traffic volume, GSC cannot attribute which specific queries drove these clicks.

### Pages Receiving Clicks (8 total)

| Page | Clicks | Impressions | CTR |
|------|--------|-------------|-----|
| DJI Osmo Pocket 3 | 1 | 43 | 2.33% |
| Sony FX3 | 1 | 18 | 5.56% |
| Nikon Z8 | 1 | 16 | 6.25% |
| Canon EOS R6 Mark II | 1 | 10 | 10% |
| Fujifilm X100VI | 1 | 5 | 20% |
| Leica Q3-43 | 1 | 4 | 25% |
| Miyoo Mini Plus | 1 | 3 | 33.33% |
| /about | 1 | 1 | 100% |

**Key Insight:** Different devices are now converting clicks - not just Raspberry Pi 5. The Osmo Pocket 3 got its first click (43 impressions → 1 click). Camera devices (Sony, Canon, Leica, Nikon, Fujifilm) showing better CTR patterns than gaming devices.

### 📸 Hero Image Status & Action Items

All devices currently use fallback placeholders (no custom imageUrl in devices.json). Devices with HIGH and MEDIUM priority should get custom hero images.

| Device Page | Clicks | Impressions | Image Status | Priority | Action |
|---|---|---|---|---|---|
| **DJI Osmo Pocket 3** | 1 | 43 | 🔴 Placeholder | **CRITICAL** | CREATE - Most impressions, no custom image |
| **Sony FX3** | 1 | 18 | 🔴 Sony placeholder | **HIGH** | CREATE - Premium camera, important for CTR |
| **Nikon Z8** | 1 | 16 | ✅ Custom image | DONE | Monitoring |
| Canon EOS R6 Mark II | 1 | 10 | 🔴 Canon placeholder | MEDIUM | CREATE when possible |
| Fujifilm X100VI | 1 | 5 | 🔴 Fujifilm placeholder | MEDIUM | CREATE when possible |
| Leica Q3-43 | 1 | 4 | 🔴 Sony placeholder | LOW | CREATE when possible |
| Miyoo Mini Plus | 1 | 3 | 🔴 Gaming placeholder | LOW | CREATE when possible |
| **DJI Mini 4 Pro** | 0 | 98 | ✅ Custom image | DONE | Most impressions - has image |
| **Steam Deck** | 0 | 96 | ✅ Custom image | DONE | Gaming, has image |
| **Sony A6700** | 0 | 46 | ✅ Custom image | DONE | Cameras, has image |
| Nintendo Switch Lite | 0 | 36 | 🔴 Gaming placeholder | MEDIUM | CREATE when possible |
| ASUS ROG Ally | 0 | 33 | ✅ Custom image | DONE | Gaming, has image |
| GoPro Hero 13 | 0 | 30 | ✅ Custom image | DONE | Action cam, has image |

**Key Finding:** DJI Osmo Pocket 3 (43 impressions, 1 click = 2.33% CTR) and Sony FX3 (18 impressions, 1 click = 5.56% CTR) are missing custom images despite high traffic. These should be top priority.

---

## 📈 GA4 Performance by Page (Nov 11-15)

| Page | Organic Impressions | Clicks | CTR | Active Users | Engagement |
|------|-------------------|--------|-----|--------------|------------|
| DJI Osmo Pocket 3 | 168 (20%) | 0 | 0% | 2 | 3m 39s |
| DJI Mini 4 Pro | 98 (11.69%) | 0 | 0% | 1 | 0s |
| Steam Deck | 96 (11.46%) | 0 | 0% | 1 | 2s |
| Canon EOS R6 Mark II | 57 (6.8%) | 0 | 0% | 1 | 23s |
| **Raspberry Pi 5** | 49 (5.85%) | **1** | **2.04%** | 0 | 0s |
| Sony A6700 | 46 (5.49%) | 0 | 0% | 0 | 0s |
| Nintendo Switch Lite | 36 (4.3%) | 0 | 0% | 0 | 0s |
| ASUS ROG Ally | 33 (3.94%) | 0 | 0% | 0 | 0s |
| GoPro Hero 13 | 30 (3.58%) | 0 | 0% | 0 | 0s |
| Nikon Z8 | 30 (3.58%) | 0 | 0% | 0 | 0s |

---

## 🔍 Key Findings

### Problem: High Impressions, No Clicks
- **705 impressions** = proven demand exists
- **1 click** = content/title not matching search intent
- **Likely cause:** New titles haven't been re-indexed yet by Google (or answer boxes need improvement)

### High-Demand Devices (by search volume)

**Tier 1 (20+ impressions):**
- **DJI Osmo Pocket 3** (20 query variations)
  - Top queries: "memory card requirements", "sd card requirements", "microsd requirements"
  - Current CTR: 0%
  - Status: We have page for this device
  - Action: Review page answer box clarity + wait for re-indexing

**Tier 2 (10+ impressions):**
- **DJI Mini 4 Pro** (10+ variations)
  - Status: We have page
  - Action: Review for answer box clarity

- **Steam Deck** (10+ variations)
  - Status: We have page
  - Action: Review for answer box clarity

- **Raspberry Pi 5** (8+ variations)
  - Status: We have page
  - **Note:** "best sd card for raspberry pi 5" got 1 click (our only winner)
  - Action: Study this page - what's working here?

- **Sony A6700** (8+ variations)
  - Status: We have page
  - Action: Monitor

**Tier 3 (4-7 impressions):**
- Nintendo Switch Lite
- DJI Mini 4K
- GoPro Hero 13
- Canon R6 Mark II
- Nikon Z8

### Keyword Pattern Analysis

| Term | Frequency | Notes |
|------|-----------|-------|
| "requirements" | 50%+ | Most common - matches our new titles |
| "recommended" | 20% | Secondary pattern |
| "specs" | 15% | Users want specifications |
| "memory card" | Common | Alternative to "SD card" |
| "microsd vs sd" | Rare | No comparative queries yet |

---

## 💡 Opportunities Identified

### Content Gaps (0 CTR Despite Impressions)

**Osmo Pocket 3 & Mini 4 Pro:**
- Getting 20+ impressions on requirements/specs queries
- 0% CTR suggests our answer box isn't matching intent
- **Possible fix:** 
  - Ensure first FAQ answer explicitly states "requirements"
  - Make answer scannable (bullet points for spec requirements)
  - Verify title/description match query intent

**Steam Deck:**
- Similar pattern: 10+ impressions, 0% CTR
- Users searching for "specs" and "recommended" variants
- Action: Review page structure for answer box optimization

### New Devices to Add (High Search Demand)

**No new devices found yet in GSC queries.** All impressions are for devices we already have. This is good - means:
- Our dataset is relevant
- No obvious gaps yet
- Monitor for emerging device patterns

---

## 🟢 Success Case: Raspberry Pi 5

**Why it won the 1 click:**
- Query: "best sd card for raspberry pi 5"
- Our new title format includes "Best SD Cards for"
- This query exactly matches our title template
- Answer box likely clear and scannable

**Learning:** "Best SD Cards for [Device]" title format works for this query pattern.

---

## 🎯 Critical Insight: Osmo Pocket 3 Page Issue

**The Problem:**
- **168 GA4 impressions** (20% of all organic traffic to device pages)
- **20 GSC query variations** with 5 impressions each
- **0 clicks** from Osmo Pocket 3 queries
- **2 active users** actually engaged with the page

This is our #1 priority. The page is getting visibility but NOT converting searches into clicks.

**Why:** 
- Users are searching "dji osmo pocket 3 [memory/sd/microsd] [requirements/specs/recommendations]"
- Our page title/description or answer box isn't matching this intent
- Raspberry Pi 5 page works because query format matches title exactly

**Action:** Review DJI Osmo Pocket 3 page:
1. Check answer box clarity (first FAQ answer)
2. Verify title is being indexed with correct keywords
3. Make sure spec requirements are prominently displayed
4. Consider adding dedicated "Requirements" section before FAQs

---

## ⚠️ Immediate Action Items (Priority Order)

**CRITICAL (Fix within 24-48 hours):**
1. **DJI Mini 4 Pro page** (171 impressions, 0% CTR)
   - Compare structure with Canon R6 Mark II (which converts at 2.1%)
   - Check: Answer box clarity, spec layout, title matching
   
2. **Steam Deck page** (167 impressions, 0% CTR)
   - Same audit as Mini 4 Pro
   - Check if microSD-specific page is needed

3. **DJI Osmo Action 4 page** (102 impressions, 0% CTR)
   - Getting high traffic but zero conversions

**HIGH (This week):**
4. **Analyze Canon R6 Mark II success** (2.1% CTR, only high-volume converter)
   - Document page structure/layout that works
   - Apply learnings to Mini 4 Pro/Steam Deck

5. **Check old category pages** (mirrorless-cameras, security-cameras)
   - These should redirect or be removed
   - Currently getting 0% CTR impressions

**RESEARCH:**
6. **Understand niche page success pattern**
   - Why does Fujifilm X100VI (7.69% CTR) outperform DJI Mini 4 Pro (0%)?
   - Query type? Content clarity? Page design?

---

## 📅 Next Review Date

**Nov 22** (7 days of post-title-optimization data)

---

## 📝 Page Comparison Framework

To understand why Canon R6 Mark II converts and DJI Mini 4 Pro doesn't:

```html
Questions to investigate for each page:
1. Title format - does it match query intent?
2. First FAQ answer - is it scannable?
3. "Requirements" section - prominent and clear?
4. Hero image - does it exist and is it relevant?
5. Page structure - specs first or buried?
6. Call-to-action clarity - where to find SD cards?
```

---

## 📝 Daily Snapshot Template

When you share GSC updates:

```
Date: Nov [X]
Total Impressions: [X]
Total Clicks: [X]
Pages with 0% CTR but 100+ impressions: [list]
Best CTR performers: [list]
New/changed rankings: [any?]
Action taken: [what did we fix?]
```

---

## 🎓 Key Learnings So Far

1. **Page-level traffic ≠ clicks** - DJI Mini 4 Pro getting 10x more traffic than Canon R6 Mark II, but zero conversions vs 2 clicks
2. **Niche products convert better** - Fujifilm X100VI (7.69% CTR) vs DJI products (0%)
3. **Smaller audience, clearer intent** - 4-13 impression pages have 5-10x better CTR
4. **One page found the formula** - Canon R6 Mark II is our gold standard (2.1% CTR on high volume)
5. **Search traffic is real** - 1,693 impressions in 5 days validates product-market fit
