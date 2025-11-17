# SD Card Checker - Data-Driven Kanban Board

**Last Updated:** November 15, 2025  
**Project Status:** LIVE - Analysis & Gradual Expansion Phase  
**Site:** https://sdcardchecker.com  
**Primary Goal:** 1000 sessions/month → Mediavine application eligibility

---

## 📊 BOARD OVERVIEW

| Column | Status | Focus |
|--------|--------|-------|
| **MONITORING** | 👀 Active | Daily GSC tracking |
| **ANALYSIS** | 🔍 Insights | High-potential keywords & gaps |
| **OPPORTUNITIES** | 💡 Identified | Next devices/content to add |
| **IN PROGRESS** | 🛠️ Building | Active implementation |
| **DONE** | ✅ Complete | Shipped items |

---

## 👀 MONITORING

### GSC Daily Tracking
- **Owner:** You
- **Cadence:** Daily (you provide updates)
- **What we're watching:**
  - Total impressions (target: steady growth toward 1000 sessions/month)
  - Top search queries (identify high-volume, low-CTR queries)
  - Device pages with impressions (which devices resonate?)
  - CTR patterns (which queries are converting?)
- **Data collection:**
  - You share daily snapshots or weekly summaries
  - I maintain detailed analysis in **[GSC_ANALYSIS.md](GSC_ANALYSIS.md)**
  - Goal: By end of Nov, identify 3-5 clear expansion opportunities

**📌 Current Status (Nov 15):** 705 impressions, 1 click. Analysis complete - see GSC_ANALYSIS.md

---

## 🔍 ANALYSIS

### High-Potential Keywords (From GSC Data)
- **Status:** PENDING - Waiting for data patterns
- **What we're tracking:**
  - Queries with high impressions but 0% CTR (content gap = easy fix)
  - Device categories appearing in GSC that we don't have pages for
  - Variations of existing device queries (e.g., "requirements" vs "recommendations")
- **Example:** If GSC shows "GoPro Hero 14" queries but we don't have that device → add to opportunities
- **Next step:** Once you share GSC data, we'll identify these patterns together

---

### Content Gap Analysis (Existing Devices)
- **Status:** PENDING - Waiting for GSC insights
- **What we're tracking:**
  - FAQ opportunities (queries that should have FAQ answers)
  - Standalone article opportunities (if many searches are around "guides", "comparisons", "specs")
  - Meta description improvements for existing pages
- **Example:** If many searches are "DJI Mini 4 Pro comparison vs [other model]" → add FAQ or comparison article
- **Next step:** Once GSC patterns emerge, we'll add specific tasks here

---

## 💡 OPPORTUNITIES

*(Devices & content to add, identified from GSC data)*

### Template for New Device Addition
When GSC shows demand for a device:
- [ ] Device name + search volume from GSC
- [ ] Research official specs (capacity, speed class, card type)
- [ ] Add device to devices.json
- [ ] Test page renders correctly
- [ ] Deploy
- Effort: 20-30 min per device

---

## 🛠️ IN PROGRESS

### Phase 0: Storage Calculator (Video + Photo)
- **Owner:** Amp
- **Timeline:** Week 1 (Nov 17-24)
- **Status:** 🟡 Templates Complete
- **Progress:**
  - ✅ calculator.js (math engine, all formulas, speed class mapping)
  - ✅ calculator-ui.js (Alpine.js state, form management, results)
  - ✅ calculator-widget.html (reusable component, all 3 layers + reverse)
  - ✅ Video Storage Calculator page (Hero, FAQ, schema, copy)
  - ✅ Photo Storage Calculator page (Hero, FAQ, schema, copy)
  - 🔄 Testing (form inputs, reverse toggle, mobile UX, GA4)
  - 🔄 Deployment routing setup
  - ⏳ Integration with existing card recommendation data
  - ⏳ Mobile responsiveness check (44px tap targets)
  - ⏳ Core Web Vitals optimization (LCP, CLS, INP)
- **Blockers:** None
- **Next step:** Test full flow, integrate card recommendations, verify GA4 tracking

---

## ✅ DONE

### Pre-Launch (Complete)
- ✅ Site live at sdcardchecker.com (Nov 11)
- ✅ 97 device pages live as of 15.11.25
- ✅ SEO title optimization (KANBAN-11 complete)
- ✅ Schema markup implemented
- ✅ GSC & Bing Search Console configured
- ✅ GA4 installed
- ✅ Affiliate links verified & working

---

## 📈 LIVE METRICS

### Current State (Nov 15)
- **Pages Live:** 97+ (devices + categories + resources)
- **Domain:** sdcardchecker.com (LIVE)
- **Traffic:** Coming from Day 1 (positive signal)
- **Affiliate Clicks:** Working & tracking
- **GSC Data:** Collecting daily

### Mediavine Eligibility Checklist
| Requirement | Status | Notes |
|-------------|--------|-------|
| 1000 sessions/month | 🟡 In progress | On track for ~90 days |
| Quality content | ✅ Complete | 97 optimized device pages |
| 90 days of traffic data | ⏳ Collecting | Started Nov 11 |
| Niche focus | ✅ Complete | SD cards for devices |
| No policy violations | ✅ Verified | Clean affiliate disclosures |
| Optional: Long-form content | 🟡 Maybe | Only if GSC shows demand |

---

## 🎯 THE PROCESS (Next 90 Days)

```
WEEK 1-4 (Nov 15 - Dec 13): Data Collection & Analysis
├─ Monitor GSC daily
├─ Identify high-potential keywords weekly
└─ Prepare expansion list based on demand

WEEK 5-12 (Dec 13 - Jan 31): Gradual Expansion
├─ Add new devices (quality-first, GSC-informed)
├─ Add content (FAQs, articles) based on query gaps
├─ Monitor traffic toward 1000 sessions/month milestone
└─ Adjust strategy based on emerging patterns

WEEK 13+: Mediavine Application
├─ Apply when close to 1000 sessions/month
├─ Add long-form content if needed
└─ Continue gradual expansion post-approval
```

---

## 💭 SUCCESS DEFINITION

**90-Day Goal:** Demonstrate clear organic SEO traction toward 1000 sessions/month
- Clear query patterns in GSC
- Device pages converting visitors
- Affiliate revenue tracking upward
- Ready for Mediavine application

**What We're NOT Doing:**
- Big content pushes without data
- Adding devices randomly
- Chasing vanity metrics
- Overthinking the process

---

## 🟡 BACKLOG (Future Opportunities - Monitor Before Acting)

### Brand Category Pages (e.g., "Best SD Cards for GoPro", "Best SD Cards for Nikon")
- **Status:** Idea phase - monitoring GSC
- **Trigger to act:** If GSC shows brand-level queries (e.g., "best sd card for gopro", "dji sd card requirements")
- **Why:** Easy content win if users search by brand instead of device model. Reuses existing dataset.
- **Current signal:** No brand-level queries in GSC data yet (all queries are device-specific)
- **Next review:** Nov 22 - check if any brand-level patterns emerging

---

## 📝 DOCUMENTATION PROTOCOL

**You provide:**
- Daily GSC snapshots (when available)
- Weekly summary: top queries, top device pages, trends

**I maintain:**
- Running analysis of GSC patterns
- Opportunities list (new devices, content gaps)
- Progress toward 1000 sessions/month milestone

**Together we decide:**
- Which devices to add next (based on search demand)
- Which existing pages need content updates
- When to add long-form content (if at all)
- When to apply to Mediavine

---

**Ready to start.** Share your first GSC snapshot whenever you're ready.
