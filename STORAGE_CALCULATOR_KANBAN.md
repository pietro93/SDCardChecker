# Storage Calculator — Kanban Board
**Product:** Universal SD Card Storage Calculator  
**Phase Strategy:** Phase 0 (Week 1) → Phase 1 (Weeks 2–4)  
**Last Updated:** Nov 14, 2025

---

## 🎯 PHASE 0: LAUNCH IMMEDIATELY (Video + Photo)

### 📋 BACKLOG (Pre-Dev Planning)

- ✅ **Research & Design** (COMPLETE)
  - ✅ Define calculator UX flow (wireframe: input → calculate → result)
  - ✅ Design result card (matches brand guidelines blue gradient)
  - ✅ Design form inputs (resolution, bitrate, overhead toggles)
  - ✅ Verify card recommendation filtering logic
  - ✅ Create responsive mockup (desktop, tablet, mobile)

- ✅ **Technical Spike** (COMPLETE)
  - ✅ Audit existing form/component styles in `modern.css`
  - ✅ Plan calculator.js module API (inputs, outputs, math logic)
  - ✅ Plan calculator-ui.js module (form handling, state management)
  - ✅ Verify Tailwind classes available for calculator layout
  - ✅ Check existing card recommendation data structure
  - ✅ Data prep complete: 10 new devices added to calculator-devices.json & calculator-content.json

---

### 🚀 IN PROGRESS (Core Engine Development)

- ✅ **Build Reusable Calculator Engine** (COMPLETE)
   - ✅ Created `src/js/calculator.js`
   - ✅ All input/output scenarios implemented
   - ✅ Speed class mapping: V6, V30, V60, V90
   - ✅ Photo burst rate logic integrated (casual, normal, highspeed)
   - ✅ Reverse calculations for video and photo
   - ✅ Overhead buffer support (5-25%, default 10%)

- ✅ **Build Calculator UI Component** (COMPLETE)
   - ✅ Created `src/js/calculator-ui.js`
   - ✅ Form state management with Alpine.js
   - ✅ Three-layer flow: Use Case → Details → Results
   - ✅ Forward/reverse mode toggle
   - ✅ Shooting style (burst rate) passed to calculator
   - ✅ Advanced options accordion (collapsible)
   - ✅ Input validation

- ✅ **Build Calculator Widget Template** (COMPLETE)
   - ✅ Created `src/templates/components/calculator-widget.html`
   - ✅ Reusable component (video, photo, continuous modes)
   - ✅ Mobile responsive (44px tap targets)
   - ✅ Advanced options accordion (collapsed by default)
   - ✅ Improved bitrate helper text (quality vs file size framing)
   - ✅ HIGH_ENDURANCE warning for continuous mode
   - ✅ Burst rate selector with clear labels

- ✅ **Build Card Recommendation Filter** (COMPLETE)
   - ✅ Created `src/js/card-recommender.js`
   - ✅ Loads sdcards.json on-demand (cached)
   - ✅ Filters by speed class
   - ✅ Sorts by: tier (recommended first), price, write speed
   - ✅ Added "Find Matching Cards" button to results
   - ✅ Links to `/cards/?speedClass=V30` (etc.)

---

### ✅ DONE (Design & Architecture)

- ✅ Product spec finalized (STORAGE_CALCULATOR_PRODUCT_SPEC.md)
- ✅ Brand guidelines confirm style inheritance (BRAND_GUIDELINES.md)
- ✅ Page templates planned (Section 5)
- ✅ SEO keyword targets identified (8 pages total)
- ✅ User personas documented (Section 2)

---

### 📄 PAGE 1: VIDEO STORAGE CALCULATOR

**URL:** `/tools/video-storage-calculator/`

#### Content & Copy

- ✅ **Hero Section** (COMPLETE)
  - ✅ Title: "How Much 4K Video Fits On Your SD Card?" (benefit-focused)
  - ✅ Subtitle: "Calculate Recording Time, Compare Codecs & Get Speed Recommendations"
  - ✅ Expanded intro: ~250 words covering pain points (dropped frames, buffer overflow, bitrate confusion)
  - [ ] Background image (video camera or filming scene)
  - [ ] Dark overlay gradient (matches brand)

- ✅ **Intro Copy** (COMPLETE)
  - ✅ ~250 words (videographer angle, real-world consequences)
  - ✅ Value prop: "Remove guesswork, film with confidence"

- ✅ **Why This Matters Section** (COMPLETE)
  - ✅ "The High Cost of Video Recording Failures" (3 paragraphs)
  - ✅ Addresses dropped frames, corrupted footage, buffer overflow, bitrate miscalculation

- ✅ **FAQ Section** (COMPLETE - Expanded)
  - ✅ Q1: H.264 vs H.265 vs ProRes (expanded, ~150 words)
  - ✅ Q2: Speed class for 4K video (expanded, ~120 words)
  - ✅ Q3: How to calculate bitrate (expanded, ~150 words, 3 methods)
  - ✅ Q4: MicroSD support (expanded, ~100 words)
  - ✅ Q5: UHS-II vs UHS-III (expanded, ~120 words)
  - ✅ Q6: Overprovision recommendations (expanded, ~150 words)
  - Schema: FAQPage (JSON-LD) ✅

  - [ ] **Card Recommendations in Results** (REPLACING broken "Find Matching Cards" link)
   - [ ] Display 3-5 matching cards directly in results (no page navigation)
   - [ ] Each card shows: brand, model, capacity, speed class, write speed, affiliate links
   - [ ] Include card images (with fallback placeholder if missing)
   - [ ] Show Amazon, B&H, other affiliate links (similar to device HTML pages)
   - [ ] "See all matching cards" link below recommendations (filters by speed class)
   - [ ] Mobile-responsive grid layout (1-2 cards per row on mobile)
   - [ ] Use existing CardRecommendations utility but render inline instead of linking away

- [ ] **Related Resources Section** (TODO)
  - [ ] Link to "SD Card Speed Class Guide" (need to create page)
  - [ ] Link to "Video Bitrate Comparison Guide" (need to create page)
  - [ ] Link to related calculators (Photo, Drone, GoPro)

- [ ] **Images & Icons** (TODO)
  - [ ] Hero section background image (video camera/filming)
  - [ ] Icon for codec comparison (H.264, H.265, ProRes)
  - [ ] Icon for speed classes (V30, V60, V90)
  - [ ] Icon for UHS interface types
  - [ ] Card recommendation images (with descriptive alt text)

#### Technical & Testing

- ✅ **Page Template** (COMPLETE)
   - ✅ Created `src/templates/calculators/video-storage-calculator.html`
   - ✅ Hero section with benefit-focused copy
   - ✅ Calculator widget embedded
   - ✅ "Why This Matters" section (3 paragraphs on failure scenarios)
   - ✅ 6 expanded FAQ answers with examples
   - ✅ Related Resources links
   - ✅ All Schema markup (WebPage, FAQPage, Breadcrumb)

- [ ] **SEO & Schema**
  - [ ] Meta description (150–160 chars, "video storage calculator" keyword)
  - [ ] Canonical URL: `/tools/video-storage-calculator/`
  - [ ] Open Graph tags (og:title, description, image, url)
  - [ ] Twitter Card tags (twitter:card, title, description, image)
  - [ ] JSON-LD:
    - [ ] WebPage schema
    - [ ] FAQPage schema (from FAQ section)
    - [ ] BreadcrumbList schema (Home > Calculator > Video Storage)
    - [ ] Table schema (speed class table output)

- [ ] **Functional Testing**
  - [ ] Input validation:
    - [ ] Resolution dropdown (1080p, 2K, 4K, 6K)
    - [ ] Frame rate dropdown (24, 30, 60, 120 fps)
    - [ ] Codec dropdown (H.264, H.265, ProRes)
    - [ ] Bitrate input (editable, default 150Mbps)
    - [ ] Capacity input (any number)
    - [ ] Overhead toggle + slider (5–25%)
  - [ ] Result card display:
    - [ ] Storage required (GB) calculation correct
    - [ ] Recommended capacity matches requirement
    - [ ] Speed class table renders
    - [ ] Breakdown shows raw + overhead
  - [ ] Reverse mode:
    - [ ] Toggle works (same page, data flow reverses)
    - [ ] Card capacity input appears
    - [ ] Duration output displays (HH:MM)
  - [ ] Advanced options:
    - [ ] Accordion expands/collapses smoothly
    - [ ] Multi-format comparison works (if enabled)
  - [ ] Card recommendations:
    - [ ] Populate based on speed class
    - [ ] Sort correctly (min speed first, then price)
    - [ ] Amazon buttons link with affiliate tracking

- [ ] **Mobile Testing**
  - [ ] All inputs have 44px tap targets
  - [ ] Form labels visible, not hidden
  - [ ] Result card displays in single column
  - [ ] Advanced options collapsed on mobile (tap to expand)
  - [ ] FAQ accordion: one item open at a time

- [ ] **Performance Testing**
  - [ ] LCP < 2.5s (Largest Contentful Paint)
  - [ ] CLS < 0.1 (Cumulative Layout Shift)
  - [ ] INP < 200ms (Interaction to Next Paint)
  - [ ] No console errors (desktop or mobile)
  - [ ] Calculator.js bundled efficiently (< 40kB gzipped total with UI)

- [ ] **Accessibility Testing**
  - [ ] WCAG 2.2 AA contrast (all text readable)
  - [ ] All form fields have `aria-label` or visible labels
  - [ ] Calculate button accessible via keyboard (Tab + Enter)
  - [ ] FAQ accordion: `aria-expanded` on toggle buttons
  - [ ] Screen reader announces results correctly

---

### 📄 PAGE 2: PHOTO STORAGE CALCULATOR

**URL:** `/tools/photo-storage-calculator/`

#### Content & Copy

- ✅ **Hero Section** (COMPLETE)
  - ✅ Title: "How Many Photos Fit On Your SD Card?" (benefit-focused)
  - ✅ Subtitle: "Instantly Compare RAW vs. JPEG and Plan Your Shoot"
  - ✅ Expanded intro: ~250 words covering pain points (running out mid-burst, wrong card choice)
  - [ ] Background image (camera, burst shooting)
  - [ ] Dark overlay gradient

- ✅ **Intro Copy** (COMPLETE)
  - ✅ ~250 words (photographer angle, real-world scenarios)
  - ✅ Value prop: "Confidence on location, no surprises"

- ✅ **Why This Matters Section** (COMPLETE)
  - ✅ "The Hidden Cost of Wrong Card Choices" (3 paragraphs)
  - ✅ Addresses buffer slowdown, missed moments, RAW vs JPEG storage differences

- ✅ **FAQ Section** (COMPLETE - Expanded)
  - ✅ Q1: JPEG vs RAW differences (expanded, ~150 words, includes JPEG+RAW mode)
  - ✅ Q2: How to find camera file size (expanded, ~120 words, 3 methods)
  - ✅ Q3: Speed class for burst shooting (expanded, ~130 words, includes real specs)
  - ✅ Q4: Mix JPEG + RAW on same card (expanded, ~110 words)
  - ✅ Q5: Is 256GB overkill? (expanded, ~110 words, includes overprovision advice)
  - ✅ Q6: Should I shoot RAW or JPEG? (expanded, ~150 words, includes professional workflow)
  - Schema: FAQPage (JSON-LD) ✅

- [ ] **Related Resources Section** (TODO)
  - [ ] Link to "SD Card Speed Class Guide" (need to create page)
  - [ ] Link to "RAW vs JPEG Comparison Guide" (need to create page)
  - [ ] Link to related calculators (Video, Timelapse)

- [ ] **Images & Icons** (TODO)
  - [ ] Hero section background image (camera, burst shooting)
  - [ ] Icon for JPEG vs RAW file sizes
  - [ ] Icon for burst rates/fps
  - [ ] Icon for speed classes (V30, V60)
  - [ ] Card recommendation images (with descriptive alt text)

#### Technical & Testing

- ✅ **Page Template** (COMPLETE)
   - ✅ Created `src/templates/calculators/photo-storage-calculator.html`
   - ✅ Hero section with photographer angle
   - ✅ Calculator widget embedded
   - ✅ "Why This Matters" section (3 paragraphs on photography scenarios)
   - ✅ 6 expanded FAQ answers (JPEG vs RAW, file sizes, burst rates, etc.)
   - ✅ Related Resources links
   - ✅ All Schema markup (WebPage, FAQPage, Breadcrumb)

- [ ] **Functional Testing**
  - [ ] Input validation:
    - [ ] Total photos input (text, any number)
    - [ ] File size per photo (auto-calculated or custom input)
    - [ ] RAW toggle (switches file sizes: JPEG ↔ RAW)
    - [ ] Burst rate slider (fps)
  - [ ] File size auto-calculations:
    - [ ] JPEG 5MP: ~2.5MB
    - [ ] JPEG 20MP: ~8MB
    - [ ] RAW 20MP: ~30MB
    - [ ] RAW 45MP: ~65MB
  - [ ] Result card:
    - [ ] Total storage required (GB)
    - [ ] Recommended capacity
    - [ ] Speed class needed
    - [ ] Breakdown: raw footage + overhead
  - [ ] Reverse mode:
    - [ ] Card capacity → max photos output
  - [ ] Comparison feature (advanced options):
    - [ ] Side-by-side JPEG vs RAW storage

- [ ] **Mobile Testing**
  - [ ] Same 44px tap target requirement
  - [ ] RAW toggle clearly visible
  - [ ] Burst rate slider mobile-friendly

- [ ] **SEO & Schema**
  - [ ] Meta description: "photo storage calculator," "RAW file size," keyword focus
  - [ ] FAQPage schema, WebPage schema, BreadcrumbList

---

### 📊 DEPLOYMENT: PHASE 0

- [ ] **Sitemap & Routing**
  - [ ] Create `/tools/video-storage-calculator/` route
  - [ ] Create `/tools/photo-storage-calculator/` route
  - [ ] Update `sitemap.xml` with both URLs
  - [ ] Verify canonical URLs in HTML head

- [ ] **Analytics Setup**
  - [ ] GA4 events:
    - [ ] `calculator_calculate_click` (track when user clicks Calculate)
    - [ ] `calculator_result_view` (track when result card renders)
    - [ ] `calculator_card_recommendation_click` (track Amazon button clicks)
    - [ ] `calculator_device_selected` (if device dropdown used)
    - [ ] `calculator_advanced_options_toggle` (if expanded)

- [ ] **Cross-Page Testing**
  - [ ] Video page links to Photo page ("Also calculate...")
  - [ ] Photo page links to Video page
  - [ ] Both link to device pages (if device mentioned in result)
  - [ ] No broken links

- [ ] **Deploy to Production**
  - [ ] Merge to main branch
  - [ ] Deploy to live environment
  - [ ] Verify pages load (no 404s)
  - [ ] Verify GA4 events firing
  - [ ] Monitor error logs (24 hours)

- [ ] **Post-Launch Monitoring (Week 1)**
  - [ ] GA4: Track organic traffic by page
  - [ ] GA4: Track which inputs get most use (resolution, fps, bitrate custom edits)
  - [ ] Search Console: Monitor indexing
  - [ ] UX: Check for form errors or abandoned calculations
  - [ ] Performance: Monitor Core Web Vitals continuously

---

### 🎯 PHASE 0 ACCEPTANCE CRITERIA

**Content (SEO & Copy):**
- ✅ Video calculator: H1/H2 benefit-focused, ~250-word hero, "Why This Matters" section
- ✅ Photo calculator: H1/H2 benefit-focused, ~250-word hero, "Why This Matters" section
- ✅ Both: 6 expanded FAQ answers (100-150+ words each, contextual details, real examples)
- ✅ Related Resources sections planned (guide pages to create)

**Functional:**
- [ ] Calculator engine handles video/photo scenarios + reverse toggle (no errors)
- [ ] Both pages load with correct presets and unique SEO copy
- [ ] Result cards display storage required + speed class + card recommendations
- [ ] Forward/reverse toggle works seamlessly
- [ ] All forms are mobile-responsive (44px tap targets)

**Visual & UX:**
- [ ] Hero background images added (video/photo)
- [ ] Icons for speed classes, codecs, formats (SVG or inline)
- [ ] Card recommendation images with alt text
- [ ] Layout responsive on desktop, tablet, mobile

**Technical & Performance:**
- [ ] Core Web Vitals meet targets (LCP < 2.5s, CLS < 0.1, INP < 200ms)
- [ ] Schema markup validates (Google Search Console, FAQPage + WebPage + Breadcrumb)
- [ ] Affiliate links work and track in GA4
- [ ] No console errors (desktop or mobile)
- [ ] FAQ accordion works (single-open, smooth collapse)

**SEO & Linking:**
- [ ] Contextual internal links added to FAQ answers (V30 → Speed Class Guide, etc.)
- [ ] Related Resources section with links to guide pages
- [ ] All links tested (no 404s)
- [ ] Internal links to device pages functional
- [ ] Sitemap updated and submitted

---

---

## 🔗 RELATED GUIDE PAGES (Required for Phase 0 Links)

These pages are referenced in calculator FAQ/Resources sections and need to be created or populated.

### 📄 GUIDE 1: SD CARD SPEED CLASS GUIDE

**URL:** `/guides/sd-card-speed-classes/`  
**Purpose:** Comprehensive guide on V30, V60, V90, U3, Class 10

**Content:**
- [ ] What is a speed class? (definition, why it matters)
- [ ] Speed class comparison table (V30 vs V60 vs V90, write speeds, use cases)
- [ ] Which speed class do I need? (flowchart or decision tree)
- [ ] FAQ: "Can I use V30 for 4K 60fps?" etc.
- [ ] Internal links to calculators (Video, Photo, Drone)
- [ ] Schema: Article + Table schema

**Estimated effort:** 2–3 hours (research + writing)

---

### 📄 GUIDE 2: VIDEO BITRATE COMPARISON GUIDE

**URL:** `/guides/video-bitrate-comparison/`  
**Purpose:** H.264 vs H.265 vs ProRes bitrate comparison

**Content:**
- [ ] What is bitrate? (definition, how it affects storage)
- [ ] Codec comparison table (H.264, H.265, ProRes, bitrate examples)
- [ ] Bitrate examples by resolution + codec (1080p 30fps, 4K 60fps, etc.)
- [ ] How to find your camera's bitrate
- [ ] FAQ: "Does higher bitrate = better quality?"
- [ ] Internal links to calculators
- [ ] Schema: Article + Table schema

**Estimated effort:** 2–3 hours

---

### 📄 GUIDE 3: RAW vs JPEG COMPARISON GUIDE

**URL:** `/guides/raw-vs-jpeg/`  
**Purpose:** Photography format comparison and storage implications

**Content:**
- [ ] What is JPEG? (definition, compression, use cases)
- [ ] What is RAW? (definition, editing flexibility, use cases)
- [ ] File size comparison (5MP, 20MP, 45MP examples)
- [ ] Which should I shoot? (beginner, professional, professional + JPEG)
- [ ] Storage and speed class implications
- [ ] FAQ: "Can I recover from overexposed JPEG?" etc.
- [ ] Internal links to Photo Calculator
- [ ] Schema: Article + Table schema

**Estimated effort:** 2–3 hours

---

## 📊 PHASE 1: BUILD WHILE PHASE 0 LIVE (Weeks 2–4)

### 📋 DATA COLLECTION

- [ ] **Bitrate Research (Parallel Task)**
  - [ ] **DJI Drones:**
    - [ ] Mavic 3 (all recording modes, bitrates, FPS)
    - [ ] Air 3S
    - [ ] Mini 4 Pro
    - [ ] Phantom 4 Pro
    - [ ] Avata (FPV bitrates)
    - Sources: DJI.com specs, YouTube reviews (FunBro Tech, etc.)

  - [ ] **Action Cameras:**
    - [ ] GoPro Hero 12 (all video modes, 5.3K, 4K, etc.)
    - [ ] GoPro Hero 11
    - [ ] GoPro Max (360° bitrate = 2x standard)
    - [ ] Insta360 X4 (360° bitrate)
    - [ ] DJI Osmo Action 4
    - Sources: GoPro.com, manufacturer sites, YouTube unboxings

  - [ ] **Dashcams:**
    - [ ] Viofo A119 Mini (bitrate, endurance rating)
    - [ ] Thinkware Q800 Pro
    - [ ] BlackVue DR900X
    - [ ] Generic 1080p dashcam specs
    - [ ] Generic 4K dashcam specs
    - Sources: Amazon specs, YouTube reviews, Reddit r/Dashcams

  - [ ] **Surveillance:**
    - [ ] Standard IP camera 1080p (bitrate)
    - [ ] Standard IP camera 4K (bitrate)
    - [ ] PoE camera specs (if applicable)

  - [ ] **Timelapse/Cameras:**
    - [ ] Canon R5 (RAW size, JPEG size, burst rate)
    - [ ] Sony A7R V
    - [ ] Nikon Z9
    - Sources: Canon.com, Sony.com, Nikon.com, manufacturer tech specs

- [ ] **Create Data File**
  - [ ] Populate `data/calculator-presets.json` (schema defined in Product Spec Section 5A)
  - [ ] Validate bitrate data against 2+ sources per device
  - [ ] Format: JSON (brand, model, category, presets, speed class, notes)

---

### 🚀 PAGE 3: DRONE RECORDING TIME CALCULATOR

**URL:** `/tools/drone-recording-calculator/`  
**Keyword:** "drone recording time calculator," "DJI recording storage"

#### Content & Copy

- [ ] **Hero Section**
  - [ ] Title: "Drone Recording Time Calculator — Plan Your Flights"
  - [ ] Subtitle (drone pilot, aerial videographer angle)
  - [ ] Hero image (drone in flight)

- [ ] **Intro Copy**
  - [ ] 150–200 words (flight planning, storage confidence)

- [ ] **FAQ Section (5–7 questions)**
  - [ ] How long can DJI Mavic 3 record on 256GB?
  - [ ] What's the difference between H.264 and H.265 recording?
  - [ ] Do I need V60 cards for my drone?
  - [ ] Can I use the same card in multiple drones?
  - [ ] How do I check my drone's bitrate specs?
  - [ ] What's the best card for 4K 120fps drone recording?
  - [ ] Does higher bitrate = better video quality?

#### Technical & Testing

- [ ] **Page Template**
  - [ ] Create `src/templates/calculator/drone-recording-calculator.html`
  - [ ] Add device dropdown (DJI Mavic 3, Air 3S, Mini 4 Pro, Phantom 4 Pro, Avata)
  - [ ] Device selector auto-fills bitrate + resolution from `calculator-presets.json`

- [ ] **Functional Testing**
  - [ ] Device dropdown:
    - [ ] Loads all DJI models from presets
    - [ ] Selecting device auto-fills bitrate, resolution, FPS, codec
  - [ ] Forward mode:
    - [ ] User selects "DJI Mavic 3"
    - [ ] Form auto-fills: 4K 120fps (H.265, 250Mbps) — or default selection
    - [ ] User inputs: 128GB card
    - [ ] Result: "Recording time: 9 hours 24 minutes"
  - [ ] Reverse mode:
    - [ ] Same device presets apply
    - [ ] Input: 128GB card, DJI Mavic 3
    - [ ] Output: Recording duration + speed class recommendation
  - [ ] Multiple recording modes per device:
    - [ ] Mavic 3: 4K 120fps, 4K 60fps, 1080p 240fps (all auto-fill bitrates)
    - [ ] User can toggle between modes

- [ ] **Result Card**
  - [ ] Show recording time (HH:MM)
  - [ ] Show speed class recommendation (e.g., "V60 recommended")
  - [ ] Show notes (e.g., "U3 minimum, V60+ for 4K 120fps")

- [ ] **SEO & Schema**
  - [ ] Meta description: "drone recording time calculator," "DJI recording storage," keyword focus
  - [ ] BreadcrumbList: Home > Tools > Drone Calculator
  - [ ] Device-specific breadcrumb (if device selected)

---

### 🚀 PAGE 4: GOPRO STORAGE CALCULATOR

**URL:** `/tools/gopro-storage-calculator/`  
**Keyword:** "GoPro storage calculator," "GoPro Hero 12 storage"

#### Content & Copy

- [ ] **Hero Section**
  - [ ] Title: "GoPro Storage Calculator — How Much Video Fits?"
  - [ ] Subtitle (action sports, vlogger angle)
  - [ ] Hero image (GoPro mounting scenarios)

- [ ] **Intro Copy**
  - [ ] 150–200 words (recording confidence for adventures)

- [ ] **FAQ Section (5–7 questions)**
  - [ ] How much 5.3K video fits on 128GB?
  - [ ] What's the difference between GoPro Hero 12 and Hero 11?
  - [ ] Do I need V60 for 4K 120fps on GoPro?
  - [ ] Can I use GoPro cards in my camera?
  - [ ] Why is bitrate different on GoPro?
  - [ ] What's the fastest GoPro card I can use?

#### Technical & Testing

- [ ] **Page Template**
  - [ ] Create `src/templates/calculator/gopro-storage-calculator.html`
  - [ ] Device dropdown (Hero 12, Hero 11, Hero 10, Max)
  - [ ] Device presets: GoPro Hero 12 default (5.3K 60fps H.265 180Mbps)

- [ ] **Functional Testing**
  - [ ] Device dropdown auto-fills GoPro recording modes
  - [ ] Hero 12: 5.3K 60fps, 4K 120fps, etc. (all modes available)
  - [ ] GoPro Max: 360° toggle (doubles bitrate for comparison)

---

### 🚀 PAGE 5: DASHCAM STORAGE CALCULATOR

**URL:** `/tools/dashcam-storage-calculator/`  
**Keyword:** "dashcam storage calculator," "continuous dashcam recording"

#### Content & Copy

- [ ] **Hero Section**
  - [ ] Title: "Dashcam Storage Calculator — Plan Continuous Recording"
  - [ ] Subtitle (vehicle owner, insurance angle)

- [ ] **Intro Copy**
  - [ ] 150–200 words (safety, continuous operation focus)

- [ ] **FAQ Section (5–7 questions)**
  - [ ] How long can a dashcam record on 256GB?
  - [ ] What is loop recording?
  - [ ] Do I need an endurance card?
  - [ ] What's the difference between speed and endurance?
  - [ ] Will my card overheat with 24/7 recording?
  - [ ] How do I protect against overwrite?

#### Technical & Testing

- [ ] **Page Template**
  - [ ] Create `src/templates/calculator/dashcam-storage-calculator.html`
  - [ ] Device dropdown (Viofo A119 Mini, Thinkware, BlackVue, generic 1080p/4K)

- [ ] **Special Features**
  - [ ] **Loop Recording Toggle:**
    - [ ] When ON: shows "card fills, oldest footage overwrites"
    - [ ] Calculation changes: "continuous days until oldest overwrite"
  - [ ] **Endurance Recommendations:**
    - [ ] Display: "Recommended: HIGH_ENDURANCE card (optimized for 24/7)"
    - [ ] Filter card recommendations to show endurance cards first

- [ ] **Functional Testing**
  - [ ] Loop recording enabled:
    - [ ] Input: 256GB card, Viofo A119 Mini, 24/7 mode
    - [ ] Output: "Loop recording: ~51 days before overwrite" (or similar)
  - [ ] Endurance card recommendations load (not speed-focused cards)

---

### 🚀 PAGE 6: ACTION CAMERA STORAGE CALCULATOR

**URL:** `/tools/action-camera-storage-calculator/`  
**Keyword:** "action camera storage calculator," "Insta360 storage"

#### Content & Copy

- [ ] **Hero Section**
  - [ ] Title: "Action Camera Storage Calculator — 4K, 360°, & Beyond"
  - [ ] Subtitle (adventure, creative angle)

- [ ] **Intro Copy**
  - [ ] 150–200 words (creative freedom, high-bitrate recording)

- [ ] **FAQ Section (5–7 questions)**
  - [ ] What is 360° recording and how much space does it use?
  - [ ] How much does 360° increase bitrate?
  - [ ] Can I use the same card in different action cameras?
  - [ ] What speed class do I need for 360° video?
  - [ ] How do I compare Insta360 vs GoPro vs DJI Osmo?

#### Technical & Testing

- [ ] **Page Template**
  - [ ] Create `src/templates/calculator/action-camera-storage-calculator.html`
  - [ ] Device dropdown (GoPro, Insta360, DJI Osmo Action, generic)

- [ ] **Special Features**
  - [ ] **360° Recording Toggle:**
    - [ ] When ON: bitrate doubles (for Insta360 models)
    - [ ] Label: "360° recording uses 2x bitrate"
    - [ ] Shows side-by-side comparison (standard vs 360°)

- [ ] **Functional Testing**
  - [ ] 360° toggle enabled (Insta360 X4):
    - [ ] Bitrate: standard 90Mbps → with 360° ~180Mbps
    - [ ] Result recalculates storage accordingly

---

### 🚀 PAGE 7: SURVEILLANCE RECORDING CALCULATOR

**URL:** `/tools/surveillance-storage-calculator/`  
**Keyword:** "surveillance storage calculator," "24/7 recording hours"

#### Content & Copy

- [ ] **Hero Section**
  - [ ] Title: "Surveillance Recording Calculator — 24/7 Coverage Planning"
  - [ ] Subtitle (security, peace-of-mind angle)

- [ ] **Intro Copy**
  - [ ] 150–200 words (security, continuous uptime focus)

- [ ] **FAQ Section (5–7 questions)**
  - [ ] How long will a 256GB card record 24/7?
  - [ ] What's an endurance card and why do I need it?
  - [ ] Can I use any SD card for surveillance?
  - [ ] How do I calculate for multiple cameras?
  - [ ] What about heat and outdoor surveillance?

#### Technical & Testing

- [ ] **Page Template**
  - [ ] Create `src/templates/calculator/surveillance-storage-calculator.html`
  - [ ] Device dropdown (1080p IP, 4K IP, generic)

- [ ] **Special Features**
  - [ ] **24/7 Continuous Toggle:**
    - [ ] Default: ON (24 hours per day recording)
    - [ ] Can adjust: "recording hours per day" slider
  - [ ] **Endurance Card Recommendations:**
    - [ ] Result recommends HIGH_ENDURANCE cards (not speed-class cards)
    - [ ] Explanation: "Endurance cards rated for continuous 24/7 use"

- [ ] **Functional Testing**
  - [ ] 24/7 mode enabled (1080p IP camera, 5Mbps):
    - [ ] 256GB card → "~42 days continuous recording"
  - [ ] Recommendations show endurance cards (e.g., SanDisk Max Endurance)

---

### 🚀 PAGE 8: TIMELAPSE STORAGE CALCULATOR

**URL:** `/tools/timelapse-calculator/`  
**Keyword:** "timelapse storage calculator," "24-hour timelapse"

#### Content & Copy

- [ ] **Hero Section**
  - [ ] Title: "Timelapse Storage Calculator — Long-Duration Project Planning"
  - [ ] Subtitle (photographers, architects, documentarians)

- [ ] **Intro Copy**
  - [ ] 150–200 words (creative planning, confidence in project scope)

- [ ] **FAQ Section (5–7 questions)**
  - [ ] How many photos do I need for a 24-hour timelapse?
  - [ ] What's the difference between 1fps and 0.5fps intervals?
  - [ ] How do I calculate playback duration?
  - [ ] What's the bitrate for a timelapse sequence?
  - [ ] Can I use RAW files for timelapse?
  - [ ] How do I set up interval shooting on my camera?

#### Technical & Testing

- [ ] **Page Template**
  - [ ] Create `src/templates/calculator/timelapse-calculator.html`
  - [ ] Device dropdown (Canon, Sony, Nikon)

- [ ] **Special Features**
  - [ ] **Interval Input (seconds between photos):**
    - [ ] Default: 2 seconds
    - [ ] Slider or input field (0.5–60 seconds)
    - [ ] Live calculation: "For 24 hours, you need X photos"
  - [ ] **Playback Duration Calculator:**
    - [ ] Input: total photos + playback framerate (default 24fps)
    - [ ] Output: "Playback duration: 8 minutes 45 seconds"
  - [ ] **File Size Calculations:**
    - [ ] JPEG vs RAW toggle (auto-fills from device presets)
    - [ ] Canon R5: RAW 36.2MB, JPEG 12.5MB (examples)

- [ ] **Functional Testing**
  - [ ] Input: 24-hour timelapse, 2-second interval, Canon R5 RAW
    - [ ] Photos needed: 43,200 photos (24 × 3600 ÷ 2)
    - [ ] Storage: ~1.56TB (43,200 × 36.2MB)
    - [ ] Playback: ~30 minutes (24fps)
  - [ ] Switching to JPEG:
    - [ ] Storage: ~540GB (43,200 × 12.5MB)

---

### 🗂️ DATA FILE: CALCULATOR-PRESETS.JSON

- [ ] **Create `data/calculator-presets.json`**
  - [ ] Schema: devices > category > [ { id, brand, model, presets, speed_class, notes } ]
  - [ ] Populate all drone models (5 DJI drones)
  - [ ] Populate all action camera models (5 cameras)
  - [ ] Populate all dashcam models (5 dashcams)
  - [ ] Populate surveillance types (2–3)
  - [ ] Populate camera models (3 timelapse cameras)
  - [ ] Validate JSON syntax
  - [ ] Verify all bitrates match sources (2+ sources per device)

---

### 🖼️ VISUAL ASSETS (Images & Icons)

#### Hero Section Images

- [ ] **Video Calculator Hero**
  - [ ] Image: Videographer filming, 4K recording icon, or cinema scene
  - [ ] Size: 1200x600px (hero banner), optimized for web
  - [ ] Alt text: "Videographer recording 4K footage on professional camera"
  - [ ] Location: `/img/calculators/video-hero.webp`

- [ ] **Photo Calculator Hero**
  - [ ] Image: Photographer with DSLR, burst shooting, or RAW icon
  - [ ] Size: 1200x600px
  - [ ] Alt text: "Professional photographer shooting RAW burst frames"
  - [ ] Location: `/img/calculators/photo-hero.webp`

#### Section Icons (SVG or inline)

- [ ] **Speed Class Icons**
  - [ ] V30 badge icon (30 MB/s)
  - [ ] V60 badge icon (60 MB/s)
  - [ ] V90 badge icon (90 MB/s)
  - [ ] Location: `/img/icons/speed-classes/`

- [ ] **Codec Icons**
  - [ ] H.264 icon or label
  - [ ] H.265/HEVC icon or label
  - [ ] ProRes icon or label
  - [ ] Location: `/img/icons/codecs/`

- [ ] **Format Icons**
  - [ ] JPEG file icon (for photo calculator)
  - [ ] RAW file icon (for photo calculator)
  - [ ] Video file icon (for video calculator)
  - [ ] Location: `/img/icons/formats/`

#### Card Recommendation Images

- [ ] **High-Performance Cards (Example models)**
  - [ ] SanDisk Extreme Pro 256GB V30 (image + alt text)
  - [ ] Kingston Canvas Go Plus 256GB V30 (image + alt text)
  - [ ] Lexar Professional 1000x 256GB V60 (image + alt text)
  - [ ] Size: 400x300px (thumbnail), optimized for web
  - [ ] Location: `/img/cards/`
  - [ ] Alt text format: "Brand Model Capacity SpeedClass SD Card" (e.g., "SanDisk Extreme Pro 256GB V30 SD Card")

#### Info Graphic Assets (Optional, Phase 2)

- [ ] Speed class vs bitrate comparison chart
- [ ] Storage calculation breakdown visual (raw + overhead)
- [ ] JPEG vs RAW file size comparison
- [ ] Codec efficiency comparison

---

### 🔗 CROSS-PAGE LINKING

- [ ] **Internal Navigation Between Calculators**
  - [ ] Each page footer/sidebar: "Also try..."
     - [ ] Video → Photo, Drone, GoPro
     - [ ] Photo → Video, Timelapse
     - [ ] Drone → Action Camera, Video
     - [ ] Etc.

- [ ] **Links from Results to Device Pages**
  - [ ] When result shows device (e.g., "DJI Mavic 3")
  - [ ] Display link: "Best SD Cards for DJI Mavic 3 →"
  - [ ] Link to existing device page (if exists)

- [ ] **Links to Guide Pages (New)**
  - [ ] Video calculator FAQ: Link "V30" to Speed Class Guide
  - [ ] Video calculator FAQ: Link "H.264" to Bitrate Comparison Guide
  - [ ] Photo calculator FAQ: Link "RAW" to RAW vs JPEG Guide
  - [ ] Photo calculator FAQ: Link "Speed Class" to Speed Class Guide

---

### 📊 PHASE 1 ACCEPTANCE CRITERIA

- ✓ `calculator-presets.json` populated with real bitrate data (2+ sources per device)
- ✓ All 6 device-specific pages load with correct device dropdowns
- ✓ Device presets auto-fill bitrates correctly on dropdown selection
- ✓ Reverse mode works with device presets
- ✓ Special features work:
  - ✓ Dashcam: Loop recording toggle + endurance recommendations
  - ✓ Action camera: 360° recording toggle (bitrate doubling)
  - ✓ Surveillance: 24/7 continuous mode + endurance emphasis
  - ✓ Timelapse: Interval input + playback duration calculator
- ✓ All 6 pages pass Core Web Vitals tests
- ✓ Internal links between calculator pages work
- ✓ All GA4 events track correctly
- ✓ Cross-page QA: All device presets tested on all calculators
- ✓ Sitemap updated with all 6 new URLs

---

### 🚀 PHASE 1: DEPLOYMENT (Simultaneous for All 6 Pages)

- [ ] **Final QA**
  - [ ] All 6 pages load (no 404s)
  - [ ] Calculator engine tested on each page (all scenarios)
  - [ ] Device dropdowns populate correctly
  - [ ] Card recommendations display (correct speed class, endurance toggle)
  - [ ] Cross-page linking works (Video → Drone → GoPro, etc.)
  - [ ] Mobile responsiveness verified (all 6 pages)
  - [ ] Core Web Vitals tested (all 6 pages)
  - [ ] No console errors (any page, desktop or mobile)

- [ ] **Deploy All 6 Simultaneously**
  - [ ] Merge to main
  - [ ] Deploy to production (do NOT stagger)
  - [ ] Verify pages accessible
  - [ ] Verify GA4 events firing
  - [ ] Monitor error logs (first 24 hours)

- [ ] **Sitemap & Indexing**
  - [ ] Update `sitemap.xml` with all 6 new URLs
  - [ ] Submit sitemap to Google Search Console
  - [ ] Monitor indexing (1–2 weeks for all pages)

---

## 📈 POST-LAUNCH: MONITORING & ITERATION

### Week 1–2 (After Phase 1 Deploy)

- [ ] **GA4 Traffic Analysis**
  - [ ] Which calculator page gets most organic traffic?
  - [ ] Which devices get most clicks (device dropdown)?
  - [ ] Which speed classes are most searched?
  - [ ] Which card recommendations get most Amazon clicks?

- [ ] **Core Web Vitals Monitoring**
  - [ ] LCP, CLS, INP on all 8 pages (Phase 0 + Phase 1)
  - [ ] Identify any performance regressions
  - [ ] Fix if > target (LCP > 2.5s, CLS > 0.1, INP > 200ms)

- [ ] **UX & Engagement**
  - [ ] Track calculation completion rate (form submissions)
  - [ ] Identify abandoned form fields (where users drop off)
  - [ ] FAQ click-through rate (which questions get most clicks)
  - [ ] Bounce rate by page (should be < 60%)

---

### Weeks 2–4

- [ ] **FAQ Optimization**
  - [ ] Update FAQ based on GA4 search queries
  - [ ] Add new questions if users searching for them
  - [ ] Improve answers based on user intent

- [ ] **Device Data Accuracy**
  - [ ] Monitor user feedback (comments, support requests)
  - [ ] Verify bitrate data against real-world testing
  - [ ] Update `calculator-presets.json` if data errors found

- [ ] **Affiliate Link Optimization**
  - [ ] Which card recommendations get most clicks?
  - [ ] Are card filters working (speed class, price tier)?
  - [ ] Monitor conversion (clicks → Amazon purchases)

- [ ] **Search Ranking Monitoring**
  - [ ] Check where each calculator ranks (SEMrush, Ahrefs)
  - [ ] Track keyword rankings (6–12 weeks typical for Phase 1)

---

### Future Phases

- [ ] **Phase 2: Features**
  - [ ] Device auto-detection (detect GoPro Hero 12 from form context)
  - [ ] Save/export results (PDF, email)
  - [ ] Bitrate comparison table (H.264 vs H.265 vs ProRes side-by-side)

- [ ] **Expansion Targets**
  - [ ] Streaming storage calculator
  - [ ] RAW burst calculator
  - [ ] Security camera calculator (separate from surveillance)

---

## 📋 DEPENDENCY GRAPH

```
PHASE 0:
├─ Calculator Engine (calculator.js)
├─ Calculator UI (calculator-ui.js)
├─ Widget Template (calculator-widget.html)
├─ Page 1: Video Storage Calculator → depends on above
└─ Page 2: Photo Storage Calculator → depends on above

PHASE 1: (Can build in parallel with Phase 0 live)
├─ Data Collection (bitrate research, calculator-presets.json)
├─ Page 3: Drone → depends on presets, calculator engine
├─ Page 4: GoPro → depends on presets, calculator engine
├─ Page 5: Dashcam → depends on presets, calculator engine
├─ Page 6: Action Camera → depends on presets, calculator engine
├─ Page 7: Surveillance → depends on presets, calculator engine
└─ Page 8: Timelapse → depends on presets, calculator engine

Post-Launch:
├─ GA4 tracking (all phases)
├─ SEO monitoring (all pages)
└─ Iteration based on traffic/engagement data
```

---

## 🎯 SUCCESS METRICS

### Traffic (GA4)

- [ ] Phase 0 organic visits: baseline (Week 1)
- [ ] Phase 1 organic visits: target 2–3x Phase 0 (Weeks 2–4)
- [ ] Bounce rate: < 60% (immediate value perceived)
- [ ] Avg time on page: 2–4 minutes (calculator + result review)

### Engagement

- [ ] % users who click "Calculate": > 70%
- [ ] % users who see card recommendations: > 80%
- [ ] FAQ accordion open rate: > 30% (questions clicked)
- [ ] Cross-page navigation clicks: > 20% (linked calculators)

### Conversions

- [ ] Amazon affiliate clicks (Phase 0): baseline
- [ ] Amazon affiliate clicks (Phase 1): 1.5–2x increase
- [ ] Device page clicks (from results): track separately
- [ ] Repeat visitor rate: monitor for calculator trust

### Content Performance

- [ ] Which calculator gets most traffic (rank 1st–8th)
- [ ] Which device presets most popular (in GA4)
- [ ] Which speed class most recommended
- [ ] Which FAQ questions most clicked

---

## 📅 TIMELINE SUMMARY

| Phase | Duration | Tasks | Deliverable |
|-------|----------|-------|-------------|
| **Planning** | Day 1–2 | Design, architecture spike, research | This Kanban board |
| **Phase 0 Dev** | Day 3–7 (Week 1) | Build engine, UI, 2 pages, testing | Video + Photo calculators LIVE |
| **Phase 1 Dev** | Week 2–4 | Bitrate research, build 6 pages, QA | 6 device-specific calculators LIVE |
| **Post-Launch** | Week 5+ | Monitoring, iteration, optimization | Traffic insights, FAQ updates |

---

---

## 📝 UPDATE LOG

**Nov 17, 2025 - SEO Content & Visual Assets Planning**
- ✅ Updated both calculator HTML templates (photo, video)
  - Expanded hero sections with benefit-focused H1/H2 (~250 words)
  - Added "Why This Matters" sections (3–4 paragraphs each)
  - Expanded all 6 FAQ answers to 100-150+ words with examples, specs, and actionable advice
- 📋 Planned 3 related guide pages (Speed Class, Video Bitrate, RAW vs JPEG)
- 📋 Planned visual assets (hero images, icons, card recommendation images)
- 📋 Planned contextual internal links within FAQ answers

---

**Last Updated:** Nov 17, 2025  
**Next Review:** After Phase 0 launch (Week 1 completion)
