# SD Card Readers Feature - Kanban Board

**Epic:** Launch SD Card Reader Product Review Pages & Cross-linking  
**Status:** PHASE 1 IN PROGRESS  
**Target Completion:** Mid-January 2026  
**Team:** Solo (Pietro)

---

## 📋 Board Overview

| Status | Count | Target |
|--------|-------|--------|
| 🟢 Done | 4 | - |
| 🔵 In Progress | 0 | - |
| 🟡 To Do | 8 | - |
| 🔴 Blocked | 0 | - |

---

## 🟢 DONE

### ✅ Dataset Creation (Dec 15, 2025)
- **Task:** Create `data/sdcardreaders.json` with 10 initial readers
- **Readers Included:** UGREEN, Muddy, Stealth Cam, Lexar Lightning, ProGrade, Sony MRW-G1, SanDisk, Apple, Satechi, Anker
- **Status:** ✅ Complete
- **PR/Commit:** Manual file creation
- **Notes:** Dataset includes full specs, FAQs, pros/cons, price tiers, compatibility matrix

---

## 🔵 IN PROGRESS

### Task 1.3: Create Reader Page Generator Script ✅ COMPLETE
- **Priority:** 🔴 P1
- **Effort:** 3 hours
- **Status:** DONE
- **File:** `scripts/generator/generate-reader-pages.js`
- **Features:**
  - Loads `data/sdCardReaders.json` with 14 readers
  - Builds all template variables (title, specs, FAQ, pros/cons)
  - Generates HTML pages in `dist/readers/[slug]/index.html`
  - Schema markup support (FAQPage, Breadcrumb, Product)
  - UTM parameter handling for affiliate tracking
  - Error handling for missing data
  - Integration with build.js orchestrator

---

## 🟡 TO DO

### PHASE 1: Dataset & Infrastructure ✅ COMPLETE

#### Task 1.1: Load Dataset in Generator Scripts ✅ COMPLETE
- **Priority:** 🔴 P1 (Blocking other tasks)
- **Effort:** 2 hours
- **Status:** DONE - Dec 15, 2025
- **Description:** 
  - Modified `scripts/generator/build.js` to call `generateReaderPages()`
  - Reader data loads from `data/sdCardReaders.json`
  - Integration point added in build orchestrator

#### Task 1.2: Create Reader Product Review Template ✅ COMPLETE
- **Priority:** 🔴 P1
- **Effort:** 3 hours
- **Status:** DONE - Dec 15, 2025
- **Description:**
  - Created `src/templates/reader-product-review.html`
  - Includes: Hero, Specs Table, Pros/Cons, Compatibility, FAQ, Amazon CTA
  - Related readers section and device recommendations
  - Full schema markup (Product, FAQPage, Breadcrumb)

#### Task 1.3: Create Reader Page Generator Script ✅ COMPLETE
- **Priority:** 🔴 P1
- **Effort:** 3 hours
- **Status:** DONE - Dec 15, 2025
- **Description:**
  - Created `scripts/generator/generate-reader-pages.js`
  - Generates individual pages for all 14 readers
  - Builds all template variables dynamically
  - Writes to `dist/readers/[reader-slug]/index.html`
  - Added FAQ rendering from `reader.faq` array
  - Added device recommendations section from `reader.relatedDevices`

#### Task 1.4: Create Breadcrumb Index Pages ✅ COMPLETE
- **Priority:** 🔴 P1
- **Effort:** 2 hours
- **Status:** DONE - Dec 15, 2025
- **Description:**
  - Created `src/templates/readers-index.html` - Main readers hub
  - Created `src/templates/readers-type-index.html` - Type category pages
  - Generated `scripts/generator/generate-readers-index.js`
  - Generated `scripts/generator/generate-readers-type-index.js`
  - Creates 7 type category pages: Dongle, Viewer, Mobile, Professional, Hub, Stick, Dock
  - Creates 1 main index page with all 14 readers
  - Full breadcrumb navigation and schema markup

---

### PHASE 2: Product Review Pages

#### Task 2.1: Generate & Test 5 Priority Reader Pages
- **Priority:** 🔴 P1
- **Effort:** 2 hours
- **Description:**
  - Run `npm run build` to generate all 14 reader pages
  - Test 5 priority pages for: Layout, placeholder images, FAQ rendering, affiliate links
  - Verify schema markup with Google Structured Data Tool
  - Check UTM parameter tracking
  - Test responsive design (mobile, tablet, desktop)
- **Acceptance Criteria:**
  - [ ] All 14 pages generated in `dist/readers/`
  - [ ] 5 pages tested (UGREEN, Muddy, Lexar, ProGrade, Anker)
  - [ ] Images load without 404s (using type-based placeholders)
  - [ ] FAQ displays properly formatted
  - [ ] Amazon affiliate URLs correct
  - [ ] Lighthouse score 90+
- **Notes:** Images are using type-based placeholders (see READER_IMAGES_STRATEGY.md). Actual product images added in Phase 2.
- **Assigned to:** Pietro
- **Due Date:** Dec 18, 2025

#### Task 2.2: Deploy Reader Pages & Monitor GSC
- **Priority:** 🟡 P2
- **Effort:** 1 hour
- **Description:**
  - Deploy `dist/readers/` to production
  - Submit sitemap update to Google Search Console
  - Create monitoring dashboard for reader page impressions
  - Set up GSC alerts for ranking tracking
- **Acceptance Criteria:**
  - [ ] Pages deployed to production
  - [ ] Google Search Console updated
  - [ ] Pages indexed within 7 days
  - [ ] Baseline impressions tracked
- **Assigned to:** Pietro
- **Due Date:** Dec 19, 2025

#### Task 2.3: Create Reader Comparison Sheet (Optional)
- **Priority:** 🟢 P3 (Optional)
- **Effort:** 2 hours
- **Description:**
  - Create downloadable PDF: "12 Best SD Card Readers Comparison Chart"
  - Include all 10 readers with side-by-side specs
  - Add positioning table (Budget vs Pro vs Niche)
- **Acceptance Criteria:**
  - [ ] PDF generated and hosted
  - [ ] CTA on all reader pages
  - [ ] Lead capture form (optional)
- **Assigned to:** Pietro
- **Due Date:** Jan 5, 2026 (Backlog)

---

### PHASE 3: Guide Pages

#### Task 3.1: Create Reader Buying Guide Pages
- **Priority:** 🟡 P2
- **Effort:** 4 hours
- **Description:**
  - Create template: `src/templates/reader-buying-guide.html`
  - Generate 4 guides:
    1. "Best SD Card Readers for MacBook Users"
    2. "Best SD Card Readers for Photographers"
    3. "Best SD Card Readers for iPhone (USB-C)"
    4. "Best SD Card Readers for Android Users"
  - Each guide recommends 3-4 readers from dataset with comparison table
- **Acceptance Criteria:**
  - [ ] 4 guides generated in `dist/guides/readers/`
  - [ ] Each guide links to 3-4 reader product pages
  - [ ] Comparison table displays correctly
  - [ ] SEO-optimized titles & descriptions
- **Assigned to:** Pietro
- **Due Date:** Dec 20, 2025

#### Task 3.2: Monitor Guide Page Performance
- **Priority:** 🟡 P2
- **Effort:** 0.5 hours
- **Description:**
  - Track impressions & CTR for guide pages
  - Monitor click-through to reader product pages
  - Set baseline metrics for 3-month goal
- **Acceptance Criteria:**
  - [ ] Analytics dashboard created
  - [ ] Baseline metrics recorded
- **Assigned to:** Pietro
- **Due Date:** Dec 22, 2025

---

### PHASE 4: Cross-linking & Device Integration

#### Task 4.1: Integrate Reader Recommendations into Device Pages
- **Priority:** 🔴 P1 (High impact)
- **Effort:** 4 hours
- **Description:**
  - Modify `scripts/generator/generateDevicePages.js` to include reader recommendations
  - Add new schema: "{{RECOMMENDED_READER_SECTION}}"
  - For 50+ priority devices, add "Best Reader for [Device]" section
  - Create mapping: Device → Compatible Reader(s)
- **Acceptance Criteria:**
  - [ ] Device pages regenerate without errors
  - [ ] 50+ device pages include reader recommendations
  - [ ] Reader sections link to product pages
  - [ ] No 404 links
- **Assigned to:** Pietro
- **Due Date:** Dec 21, 2025

#### Task 4.2: Rebuild All Device Pages with Reader Cross-links
- **Priority:** 🔴 P1
- **Effort:** 1 hour
- **Description:**
  - Run: `npm run build`
  - Verify all device pages regenerated
  - Spot-check 10 device pages for reader section rendering
  - Test internal links (device → reader, reader → device)
- **Acceptance Criteria:**
  - [ ] Build completes without errors
  - [ ] 100+ device pages have reader recommendations
  - [ ] Internal links working (no 404s)
  - [ ] Lighthouse score maintained 90+
- **Assigned to:** Pietro
- **Due Date:** Dec 21, 2025

#### Task 4.3: Monitor Cross-link Traffic
- **Priority:** 🟡 P2
- **Effort:** 1 hour
- **Description:**
  - Set up UTM tracking for device → reader clicks
  - Create dashboard tracking cross-link traffic
  - Set 1-month goal: 30-50 clicks/month from device pages
- **Acceptance Criteria:**
  - [ ] UTM parameters added to all cross-links
  - [ ] Analytics dashboard created
  - [ ] Baseline tracked
- **Assigned to:** Pietro
- **Due Date:** Dec 23, 2025

---

### PHASE 5: Review & Optimization

#### Task 5.1: QA & Launch Readiness
- **Priority:** 🔴 P1
- **Effort:** 3 hours
- **Description:**
  - Full regression test: All 10 reader pages + 4 guide pages + 50 device pages
  - Check for broken images, links, schema markup
  - Mobile responsive testing (phone, tablet, desktop)
  - Performance audit (Lighthouse, PageSpeed Insights)
- **Acceptance Criteria:**
  - [ ] All pages validated (W3C HTML/CSS)
  - [ ] All images load correctly
  - [ ] Schema markup passes Google tool
  - [ ] Lighthouse score 90+
  - [ ] Mobile score 85+
- **Assigned to:** Pietro
- **Due Date:** Dec 24, 2025

#### Task 5.2: Prepare Launch Announcement
- **Priority:** 🟡 P2
- **Effort:** 2 hours
- **Description:**
  - Document launch summary (10 readers, 4 guides, 50 cross-links added)
  - Create before/after metrics dashboard
  - Prepare social media announcement (if applicable)
- **Acceptance Criteria:**
  - [ ] Launch summary document written
  - [ ] Metrics dashboard created
  - [ ] Ready for post-launch monitoring
- **Assigned to:** Pietro
- **Due Date:** Dec 26, 2025

#### Task 5.3: Post-Launch Monitoring (First 30 Days)
- **Priority:** 🟡 P2
- **Effort:** 2 hours (ongoing, 0.5 hours/week)
- **Description:**
  - Monitor impressions, CTR, cross-link clicks daily (first week)
  - Track ranking changes for reader keywords in GSC
  - Adjust cross-link strategy based on early data
  - Identify underperforming readers for content updates
- **Acceptance Criteria:**
  - [ ] Daily monitoring log started
  - [ ] GSC tracking set up
  - [ ] Weekly summary reports created
- **Assigned to:** Pietro
- **Start Date:** Dec 27, 2025

---

## 🔴 BLOCKED

*(None currently)*

---

## 📊 Metrics & Success Criteria

### Phase 1 Completion (Dec 15-17)
- [x] `sdcardreaders.json` created with 10 readers
- [ ] Generator loads dataset
- [ ] Template created
- [ ] Generator script created

### Phase 2 Completion (Dec 18-19)
- [ ] 5 product pages live
- [ ] Deployed to production
- [ ] GSC configured
- [ ] Pages indexed

### Phase 3 Completion (Dec 20-22)
- [ ] 4 guide pages live
- [ ] Analytics dashboard created
- [ ] Click-through tracking active

### Phase 4 Completion (Dec 21-23)
- [ ] 50+ device pages updated with reader recommendations
- [ ] All builds successful
- [ ] Cross-link traffic tracking active

### Phase 5 Completion (Dec 24-26)
- [ ] Full QA passed
- [ ] Launch-ready
- [ ] Post-launch monitoring prepared

---

## 📈 Success Metrics (3-Month Goal)

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Reader page impressions | 2,000-3,000/month | - | 🟡 To Track |
| Reader page CTR | 3-5% | - | 🟡 To Track |
| Cross-link clicks | 30-50/month | - | 🟡 To Track |
| Total clicks from readers | 90-200/month | - | 🟡 To Track |
| Affiliate revenue | $65-100/month | - | 🟡 To Track |
| Lighthouse score | 90+ | - | 🟡 To Track |

---

## 📝 Notes

- **Dependencies:** Device pages must exist (✅ Already exist)
- **Risk:** Reader models become obsolete quickly → Mitigation: Annual review cycle
- **Opportunity:** Expand to 20+ readers if Phase 2 metrics strong
- **Next Phase:** Reader comparison pages (if 10+ readers justified)

---

**Last Updated:** December 15, 2025  
**Assigned to:** Pietro  
**Slack/Email:** [Add if applicable]
