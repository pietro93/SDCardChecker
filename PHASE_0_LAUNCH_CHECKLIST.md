# Phase 0 Launch Checklist — What's Actually Blocking?

**Target Launch:** ASAP (this week)

---

## ✅ ALREADY DONE (Content & Code)

- ✅ Calculator engine (calculator.js) — math complete
- ✅ UI state management (calculator-ui.js) — form flows working
- ✅ Calculator widget template (calculator-widget.html) — responsive, all modes
- ✅ Video calculator page + SEO copy (hero, FAQ, "Why This Matters")
- ✅ Photo calculator page + SEO copy (hero, FAQ, "Why This Matters")
- ✅ Card recommendations rewrite (calculator-card-recommendations.js) — inline, affiliate links ready
- ✅ All FAQs expanded (100-150 words each, schema ready)
- ✅ Schema markup (WebPage, FAQPage, BreadcrumbList all in templates)

---

## 🔴 CRITICAL BLOCKERS (Must Fix Before Launch)

### 1. **Build & Deploy** ⚠️
```
Status: Not yet run
Impact: Code changes won't reach production
Action: 
  - npm run build
  - Verify /dist/assets/js/calculator-card-recommendations.js exists
  - Check build.log for errors
```

### 2. **Card Images & Fallback** ⚠️
```
Status: Card recommendation images need verification
Impact: Cards display broken images or placeholder
Action:
  - Check if /data/sdcards.json has imageUrl field populated
  - Ensure /img/fallback/sd-card-placeholder.webp exists
  - If placeholder missing: create one (or use generic placeholder URL)
  - Test with 5 different speed classes (V30, V60, V90) for coverage
```

### 3. **Routing & URLs** ⚠️
```
Status: Routes likely not configured
Impact: Pages return 404
Action:
  - Add routes:
    - /tools/video-storage-calculator/ → /dist/calculators/video-storage-calculator/index.html
    - /tools/photo-storage-calculator/ → /dist/calculators/photo-storage-calculator/index.html
  - Verify canonical URLs in <head> match route
  - Test both URLs in browser (no 404)
```

### 4. **GA4 Events** ⚠️
```
Status: Partially implemented (calculate click done, recommendation tracking needs review)
Impact: Launch blind (no user behavior data)
Action:
  - Verify GA4 script tag exists in pages
  - Test GA4 event firing:
    - calculator_calculate (on Calculate button click)
    - calculator_recommendations_shown (after calculation)
    - Optional: calculator_card_recommendation_click (on "Check Price" click)
  - Check Google Analytics in real-time
```

---

## 🟡 IMPORTANT (Nice-to-Have, Not Blocking)

### 5. **Hero Images** (Video & Photo calculators)
```
Status: Placeholder images likely missing
Impact: Pages less visually appealing
Effort: 1 hour
Action:
  - Add video camera/filming image to /img/calculators/video-hero.webp
  - Add camera/burst shooting image to /img/calculators/photo-hero.webp
  - Both: 1200x600px, optimized for web
  - Update src/templates/calculators/{video,photo}-storage-calculator.html to reference
```

### 6. **Guide Pages** (Referenced in FAQ but don't exist)
```
Status: Missing (FAQ answers link to them but 404s)
Impact: Poor UX (broken links in FAQ)
Effort: 3-4 hours (low priority content)
Options:
  A. Remove links from FAQ (quick fix)
  B. Create placeholder stubs that redirect
  C. Skip for Phase 0, add in Phase 1
Recommendation: Option A (remove links) for Phase 0, plan Phase 1
```

### 7. **Sitemap & Indexing**
```
Status: Sitemap needs two new URLs
Impact: SEO discovery slower
Action:
  - Add to sitemap.xml:
    - /tools/video-storage-calculator/
    - /tools/photo-storage-calculator/
  - Submit sitemap to Google Search Console
  - Indexing will take 1-2 weeks (not blocking launch)
```

---

## 📋 QUICK TRIAGE: What to Fix NOW vs LATER

### Fix NOW (Before Go Live)
- [ ] **Build** (`npm run build`)
- [ ] **Routing** (add 2 routes)
- [ ] **Card image fallback** (ensure placeholder exists)
- [ ] **GA4 setup** (verify tracking fires)
- [ ] **Test URLs** (both pages load, no 404s)

### Fix SOON (Day 1-2 after launch)
- [ ] GA4 real-time monitoring
- [ ] Fix any console errors from real traffic
- [ ] Monitor Core Web Vitals
- [ ] Add hero images (improves perceived quality)

### Fix LATER (Phase 1)
- [ ] Guide pages (SD Card Speed Class, Video Bitrate, RAW vs JPEG)
- [ ] Link FAQ answers to guides
- [ ] Cross-promotion to Phase 1 calculators (Drone, GoPro, etc.)

---

## 🚀 LAUNCH WORKFLOW

1. **Prep (30 min)**
   ```
   npm run build
   Check /dist/ for calculator files
   ```

2. **Routing (15 min)**
   ```
   Add 2 routes
   Test both URLs
   ```

3. **Fallback Image (5 min)**
   ```
   Verify placeholder exists at /img/fallback/sd-card-placeholder.webp
   If missing: create or symlink
   ```

4. **GA4 Verification (10 min)**
   ```
   Open pages in Chrome DevTools Network
   Click Calculate → check console for gtag events
   Verify events in GA4 real-time
   ```

5. **Final QA (15 min)**
   ```
   Video calculator: test forward + reverse modes
   Photo calculator: test RAW/JPEG toggle
   Mobile: test on iPhone (responsive grid)
   Desktop: test all form fields
   ```

6. **Go Live**
   ```
   Merge to main
   Deploy
   Monitor error logs (first hour)
   ```

---

## 📊 Success Metrics (First Week)

- 0 console errors (desktop + mobile)
- GA4 events firing >90% of calculations
- Core Web Vitals: LCP < 2.5s, CLS < 0.1
- Organic traffic baseline established
- No broken links (internal navigation works)

---

## 🔗 Files to Check/Fix

```
src/
├── templates/
│   ├── calculators/
│   │   ├── video-storage-calculator.html    [Routes configured? Hero image?]
│   │   └── photo-storage-calculator.html    [Routes configured? Hero image?]
│   └── components/
│       └── calculator-widget.html           [Card recommendations section added? ✅]

dist/
├── assets/js/
│   ├── calculator.js                        [Built? ✅]
│   ├── calculator-ui.js                     [Built? ✅]
│   └── calculator-card-recommendations.js   [Built? Need to verify]
└── img/
    └── fallback/
        └── sd-card-placeholder.webp         [Exists? Need to verify]

Route Configuration (server/build config)
├── /tools/video-storage-calculator/        [Configured?]
└── /tools/photo-storage-calculator/        [Configured?]
```

---

## Questions to Answer

1. **Where is the build/deployment happening?** (Vercel? GitHub Pages? Custom server?)
2. **Does GA4 script tag exist in templates?**
3. **Where are the route mappings configured?**
4. **What's the current error status of calculator pages?** (if deployed at /tools/calculators/)
5. **Do card images exist for most cards in sdcards.json?**

---

**Updated:** Nov 17, 2025  
**Owner:** Ready for Final QA Sprint  
**Est. Time to Launch:** 1-2 hours if all blockers are simple
