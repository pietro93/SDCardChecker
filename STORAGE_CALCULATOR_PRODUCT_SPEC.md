# Storage Calculator — Product Specification
**Version 2.0 | Phase 0 + Phase 1 Launch Strategy**

---

## Executive Summary: Two-Phase Launch Strategy

**The Approach:** Build once, launch in stages. No bitrate data bottleneck delays Phase 0.

- **Phase 0 (Week 1):** Launch Video + Photo calculators immediately. No device data required. Start collecting organic traffic and measuring engagement.
- **Phase 1 (Weeks 2–4):** Build 6 device-specific calculators (Drone, GoPro, Dashcam, Action Camera, Surveillance, Timelapse) with placeholder bitrate data while Phase 0 is live. Deploy all Phase 1 pages simultaneously once real device bitrate data is collected.

**Why This Works:**
- Reusable calculator engine (single `calculator.js` module, zero duplication)
- Phase 0 launches fast, captures SEO baseline, and funds the data research for Phase 1
- Phase 1 pages built and tested in parallel, no wait-blocking
- Bitrate data collected asynchronously via checklist (see Section 5A)
- All Phase 1 pages share same data structure—easy swap of placeholder → real data

**Result:** 8 calculator pages across 2 deployment waves, all targeting different SEO keywords, all funneling to card recommendations.

---

## 1. Overview

**Product:** Universal Storage Calculator for SD cards—a single, reusable calculation engine that determines storage capacity requirements across video, photo, and continuous recording scenarios.

**Core Value:** Answer the two questions users actually ask:
1. "Do I have enough storage for [scenario]?"
2. "How long can I record/shoot with [capacity]?"

**Primary Goal:** Capture organic SEO traffic across multiple keyword variations (photo storage, video bitrate, drone recording time, surveillance, etc.).

**Secondary Goal:** Funnel users to SD card recommendations with pre-filtered results based on their calculated requirements.

---

## 2. User Personas & Scenarios

### Persona A: The Pre-Trip Validator
- **Scenario:** "I'm going to Iceland for a week. I have a GoPro and a mirrorless camera. Do my 256GB cards cover both?"
- **Intent:** Avoid buying a second card mid-trip; validate current gear
- **Entry Point:** Broad search like "how much video can I record on 256GB"
- **Success:** Gets answer + peace of mind + optional card upgrade if needed

### Persona B: The Equipment Checker
- **Scenario:** "I have a DJI drone with a 128GB card. Can I shoot 24 hours of continuous footage for a timelapse?"
- **Intent:** Validate device/card pairing for a specific project
- **Entry Point:** Technical search like "drone recording time calculator" or "24-hour timelapse storage"
- **Success:** Confirms feasibility + links to better card if needed

### Persona C: The Buyer
- **Scenario:** "I need to record 4K 60fps. What speed class do I need, and what card should I buy?"
- **Intent:** Buy the right card + understand why
- **Entry Point:** SEO search like "4K video storage calculator"
- **Success:** Gets technical answer + card recommendations + affiliate link

---

## 3. Core Calculator Engine (Single, Reusable)

### Input Layers

#### Layer 1: Use Case Selection (Preset Profiles)
User picks one primary use case first—this auto-fills Layer 2 with sensible defaults:

1. **Video Recording** (4K, 1080p, bitrate)
   - Defaults: 4K 60fps H.264 (150Mbps), typical action cam/mirrorless
   - Fields unlocked: Resolution, frame rate, codec, bitrate

2. **Photo Burst/Timelapse** (RAW, JPEG, frame rate)
   - Defaults: 5MP JPEG, 10fps burst
   - Fields unlocked: Resolution, file size, frames per second, RAW toggle

3. **Continuous Recording** (Surveillance, dash cam, 24/7)
   - Defaults: 1080p H.264 (5Mbps), 24/7 mode
   - Fields unlocked: Resolution, bitrate, continuous hours per day

4. **Reverse Calculation** (I have a card, how long?)
   - Reverses the flow: card capacity → duration output
   - Fields: Card size (GB), scenario type, bitrate/specs

#### Layer 2: Scenario Details (User Can Override Defaults)

**Video Scenario:**
- Resolution (dropdown): 1080p, 2K, 4K, 6K
- Frame rate (dropdown): 24fps, 30fps, 60fps, 120fps
- Codec (dropdown): H.264 (standard), H.265 (efficient), ProRes (professional)
- Bitrate (text input, read-only default or editable): e.g., "150 Mbps"

**Photo Scenario:**
- Total photos (text input): "How many photos do you plan to shoot?"
- File size per photo (auto-calculated or input):
  - JPEG 5MP: ~2.5MB
  - JPEG 20MP: ~8MB
  - RAW 20MP: ~30MB
  - RAW 45MP: ~65MB
  - (or user inputs custom)
- RAW toggle: Switches file sizes

**Continuous Recording Scenario:**
- Hours per day (text input): "How many hours of continuous recording daily?"
- Days needed (text input): "For how many days?"
- Bitrate (pre-filled, editable)

**Reverse Scenario:**
- Card capacity (dropdown): 32GB, 64GB, 128GB, 256GB, 512GB
- Use case type (dropdown): Video, Photo, Continuous
- Bitrate/specs (pre-filled from use case)

#### Layer 3: Advanced Options (Collapsible, Optional)

**Buffer & Overhead**
- Toggle: "Add 10–15% overhead for metadata/camera overhead files?"
- Default: ON (checked)
- Adjustable slider: 5% to 25%

**Multi-Format Comparison**
- Checkbox: "Compare file sizes across H.264, H.265, and ProRes?"
- Outputs side-by-side comparison table if enabled

---

### Output

#### Standard (Forward) Calculation
Display in a **Result Card** (blue gradient, like existing recommendation cards):

```
You Need: 256GB Minimum

Scenario: 4K 60fps (H.264, 150Mbps)
Planned Use: 12 hours of recording
Overhead: 10% (metadata, buffer)

Result:
• Storage Required: 243GB
• Recommended Card Capacity: 256GB ✓
• Speed Class Required: V30 (minimum)
• Write Speed: 30MB/s (minimum)

Raw Footage: 216GB
Overhead: 27GB (metadata, system)
```

#### Reverse Calculation
Display in same card format:

```
Your Card Duration

Card Capacity: 128GB
Scenario: 4K 60fps (H.264, 150Mbps)

Result:
• Recording Time: 9 hours 24 minutes
• Continuous 24/7: ~0.4 days
• For Your 24-Hour Timelapse: ✗ Not Enough
  (You need 14+ hours; get a 256GB card)

Speed Class: V30 recommended for 4K 60fps
```

#### Speed Class Output
Always include in results:

| Bitrate | Min Speed Class | Min Write Speed | Use Case |
|---------|-----------------|-----------------|----------|
| ≤ 6Mbps | V6 | 6MB/s | Full HD, time-lapse |
| 6–90Mbps | V30 | 30MB/s | 4K, high-bitrate video |
| 90–200Mbps | V60 | 60MB/s | 4K 60fps, professional |
| 200+Mbps | V90 | 90MB/s | 8K, RAW video, streaming |

---

## 4. Card Recommendations (Post-Calculation)

After the user sees their result, display:

### "Recommended SD Cards for Your Needs"
Show 3–5 card options that meet their requirements:
- Filter by: Speed class (min), capacity (min), price tier (optional user selection)
- Display: Card name, speed class, write speed, price tier badge, "Check Price on Amazon" button
- Sorting: By speed class (minimum sufficient first), then by price

**Example:**
```
User calculated: V30 minimum, 256GB needed

Results:
1. SanDisk Extreme Pro 256GB — V30, 90MB/s — Budget ✓ Check Price
2. Samsung Pro Plus 256GB — V30, 90MB/s — Mid-Range ✓ Check Price
3. ProGrade Digital V30 256GB — V30, 260MB/s — Premium ✓ Check Price
```

### Secondary CTA: Device-Specific Recommendations
If user mentions a device during input (e.g., "DJI Mavic" or "GoPro"), show:

```
Best SD Cards for DJI Mavic 3
View all compatible cards →
```

Link to the device page on SDCardChecker.

---

## 5. SEO Page Templates (Multiple Entry Points, Single Engine)

Each page is a unique SEO target, but all load the same calculator with different presets and contextual copy.

### Launch Strategy: Build All, Deploy in Stages

**Phase 0 (LAUNCH IMMEDIATELY):** Generic calculators, no device data required
- Video Storage Calculator
- Photo Storage Calculator

**Phase 1 (READY TO LAUNCH):** Device-specific calculators, awaiting real bitrate data (use placeholders)
- Drone Recording Time Calculator
- GoPro Storage Calculator
- Dashcam Storage Calculator
- Action Camera Storage Calculator
- Surveillance Recording Calculator
- Timelapse Storage Calculator

All Phase 1 pages are built, tested, and published simultaneously once bitrate data is collected.

---

## PHASE 0: LAUNCH IMMEDIATELY (No Device Data Required)
- make sure to refer to STORAGE_CALCULATOR_PRODUCT_SPEC.md

### Page 1: "Video Storage Calculator"
- **URL:** `/tools/video-storage-calculator/`
- **Primary Keyword:** "video storage calculator," "4K video storage," "how much video fits on [capacity]"
- **Copy Focus:** For content creators, vloggers, videographers
- **Default Presets:** Video use case (4K 60fps, H.264, 150Mbps)
- **Meta Description:** "Calculate how much 4K video fits on your SD card. Instant bitrate-to-storage conversion. Compare speeds, codecs, and get card recommendations."
- **Hero Title:** "Video Storage Calculator — How Much Can You Record?"
- **Device Selector:** None (generic video bitrate inputs)
- **Status:** ✅ Launch Week 1

### Page 2: "Photo Storage Calculator"
- **URL:** `/tools/photo-storage-calculator/`
- **Primary Keyword:** "photo storage calculator," "how many photos fit on," "RAW file size calculator"
- **Copy Focus:** Photographers, burst shooters, RAW enthusiasts
- **Default Presets:** Photo use case (5MP JPEG, 10fps burst)
- **Meta Description:** "Calculate how many photos fit on your SD card. Compare JPEG vs RAW file sizes. Get recommendations based on burst rates and shooting style."
- **Hero Title:** "Photo Storage Calculator — Burst Capacity & RAW Comparison"
- **Device Selector:** None (file size inputs only)
- **Status:** ✅ Launch Week 1

---

## PHASE 1: READY TO LAUNCH (Awaiting Bitrate Data Collection)

Each Phase 1 page includes a device dropdown selector. Pages are built and tested with **placeholder bitrate data**. When real bitrate data is collected (see Section 5A), swap placeholder → real data and publish simultaneously.

### Page 3: "Drone Recording Time Calculator"
- **URL:** `/tools/drone-recording-calculator/`
- **Primary Keyword:** "drone recording time calculator," "DJI Mavic storage," "how long can DJI record"
- **Copy Focus:** Drone pilots, aerial videographers
- **Default Presets:** Video use case (4K 60fps, optimized for drone bitrates)
- **Device Selector:** Dropdown with device presets (DJI Mavic 3, Air 3S, Mini 4 Pro, Phantom 4 Pro) — auto-fills bitrate + resolution
- **Meta Description:** "Calculate recording time for DJI drones. Find how long you can shoot on your SD card with bitrate recommendations for each drone model."
- **Hero Title:** "Drone Recording Time Calculator — Plan Your Flights"
- **Status:** 🟡 Built, awaiting DJI bitrate data

### Page 4: "GoPro Storage Calculator"
- **URL:** `/tools/gopro-storage-calculator/`
- **Primary Keyword:** "GoPro storage calculator," "how much video on GoPro," "GoPro Hero 12 storage"
- **Copy Focus:** Action sports, content creators, vloggers
- **Default Presets:** GoPro 4K 60fps (~150Mbps)
- **Device Selector:** Dropdown with GoPro models (Hero 12, Hero 11, Hero 10, Max) — auto-fills bitrate + resolution options
- **Meta Description:** "Calculate how much video your GoPro can record. Find storage needs for different recording modes and quality levels."
- **Hero Title:** "GoPro Storage Calculator — How Much Video Fits?"
- **Status:** 🟡 Built, awaiting GoPro bitrate data

### Page 5: "Dashcam Storage Calculator"
- **URL:** `/tools/dashcam-storage-calculator/`
- **Primary Keyword:** "dashcam storage calculator," "how long can dashcam record," "continuous dashcam recording"
- **Copy Focus:** Vehicle owners, insurance-conscious drivers
- **Default Presets:** 1080p continuous recording (~5Mbps), with loop recording mode toggle
- **Device Selector:** Dropdown with popular dashcams (Viofo A119 Mini, Thinkware, BlackVue, generic 1080p/4K) — auto-fills bitrate + continuous mode
- **Special Feature:** Loop recording toggle (card fills, then overwrites oldest footage) + heat endurance notes
- **Meta Description:** "Calculate dashcam recording time and storage needs. Includes loop recording mode and endurance ratings for continuous 24/7 use."
- **Hero Title:** "Dashcam Storage Calculator — Plan Continuous Recording"
- **Status:** 🟡 Built, awaiting dashcam bitrate data

### Page 6: "Action Camera Storage Calculator"
- **URL:** `/tools/action-camera-storage-calculator/`
- **Primary Keyword:** "action camera storage calculator," "Insta360 storage," "DJI Osmo Action storage"
- **Copy Focus:** Adventure/sports videographers, creative professionals
- **Default Presets:** 4K 60fps (~150Mbps), with note on 360° recording mode
- **Device Selector:** Dropdown with action camera brands (GoPro, Insta360, DJI Osmo Action, generic action cam) — auto-fills bitrate for each
- **Special Feature:** 360° recording toggle (doubles bitrate for Insta360 models)
- **Meta Description:** "Calculate storage for action cameras including GoPro, Insta360, and DJI Osmo. Compare bitrates and recording modes."
- **Hero Title:** "Action Camera Storage Calculator — 4K, 360°, & Beyond"
- **Status:** 🟡 Built, awaiting action camera bitrate data

### Page 7: "Surveillance Recording Calculator"
- **URL:** `/tools/surveillance-storage-calculator/`
- **Primary Keyword:** "surveillance storage calculator," "security camera storage," "24/7 recording hours"
- **Copy Focus:** Security-conscious homeowners, business owners
- **Default Presets:** 1080p continuous 24/7 recording (~5Mbps), with endurance card recommendations
- **Device Selector:** Dropdown with surveillance camera types (1080p, 4K, IP camera, analog, etc.) — auto-fills bitrate + continuous recording mode
- **Special Feature:** 24/7 uptime toggle + endurance card recommendations (MAX endurance, not speed)
- **Meta Description:** "Calculate storage for security cameras and surveillance systems. Plan 24/7 recording with endurance card recommendations."
- **Hero Title:** "Surveillance Recording Calculator — 24/7 Coverage Planning"
- **Status:** 🟡 Built, awaiting surveillance camera bitrate data

### Page 8: "Timelapse Storage Calculator"
- **URL:** `/tools/timelapse-calculator/`
- **Primary Keyword:** "timelapse storage calculator," "24-hour timelapse," "construction timelapse storage"
- **Copy Focus:** Photographers, architects, nature documentarians
- **Default Presets:** 1 photo per 2 seconds, 5MP JPEG (~2.5MB per photo)
- **Device Selector:** Dropdown with camera brands (Canon, Sony, Nikon, etc.) — auto-fills typical RAW/JPEG file sizes
- **Special Feature:** Interval input (seconds between photos) + playback duration calculator (24fps = 1 hour of footage)
- **Meta Description:** "Calculate storage and photos needed for timelapse projects. Plan construction, nature, and event timelapse sequences."
- **Hero Title:** "Timelapse Storage Calculator — Long-Duration Project Planning"
- **Status:** 🟡 Built, awaiting camera sensor data

---

## 5A. Bitrate Data Schema (For Phase 1 Pages)

This section defines the exact data structure needed to populate device dropdowns in Phase 1 calculators. Create `data/calculator-presets.json` with the following schema:

```json
{
  "devices": {
    "drone": [
      {
        "id": "dji-mavic-3",
        "brand": "DJI",
        "model": "Mavic 3",
        "category": "drone",
        "presets": [
          {
            "name": "4K 120fps (H.265)",
            "resolution": "4K",
            "fps": 120,
            "codec": "H.265",
            "bitrate_mbps": 250,
            "file_format": "MP4"
          },
          {
            "name": "4K 60fps (H.264)",
            "resolution": "4K",
            "fps": 60,
            "codec": "H.264",
            "bitrate_mbps": 150,
            "file_format": "MP4"
          },
          {
            "name": "1080p 240fps",
            "resolution": "1080p",
            "fps": 240,
            "codec": "H.264",
            "bitrate_mbps": 100,
            "file_format": "MP4"
          }
        ],
        "speed_class_recommended": "V60",
        "notes": "Requires U3 minimum, V60+ recommended for 4K 120fps"
      }
    ],
    "gopro": [
      {
        "id": "gopro-hero-12",
        "brand": "GoPro",
        "model": "Hero 12",
        "category": "action_camera",
        "presets": [
          {
            "name": "5.3K 60fps",
            "resolution": "5.3K",
            "fps": 60,
            "codec": "H.265",
            "bitrate_mbps": 180,
            "file_format": "MP4"
          },
          {
            "name": "4K 120fps",
            "resolution": "4K",
            "fps": 120,
            "codec": "H.265",
            "bitrate_mbps": 150,
            "file_format": "MP4"
          }
        ],
        "speed_class_recommended": "V60",
        "notes": "High bitrate; use V60+ cards"
      }
    ],
    "dashcam": [
      {
        "id": "viofo-a119-mini",
        "brand": "Viofo",
        "model": "A119 Mini",
        "category": "dashcam",
        "presets": [
          {
            "name": "1600p 30fps",
            "resolution": "1600p",
            "fps": 30,
            "codec": "H.264",
            "bitrate_mbps": 12,
            "file_format": "MP4",
            "continuous_mode": true
          }
        ],
        "speed_class_recommended": "V30",
        "endurance_rating": "HIGH_ENDURANCE",
        "notes": "Choose HIGH_ENDURANCE card for continuous 24/7 operation"
      }
    ],
    "camera": [
      {
        "id": "canon-r5",
        "brand": "Canon",
        "model": "EOS R5",
        "category": "mirrorless",
        "raw_file_size_mb": 36.2,
        "jpeg_file_size_mb": 12.5,
        "burst_fps": 20,
        "notes": "Check canon.com for exact specs per firmware"
      }
    ]
  }
}
```

### Data Collection Checklist

Before launching Phase 1 pages, collect:

**Drones (DJI Focus):**
- [ ] Mavic 3 (all recording modes + bitrates)
- [ ] Air 3S (all recording modes + bitrates)
- [ ] Mini 4 Pro (all recording modes + bitrates)
- [ ] Phantom 4 Pro (all recording modes + bitrates)
- [ ] Avata (FPV drone bitrates)

**Action Cameras:**
- [ ] GoPro Hero 12 (all video modes)
- [ ] GoPro Hero 11 (all video modes)
- [ ] GoPro Max (360° bitrate = double standard)
- [ ] Insta360 X4 (360° bitrate)
- [ ] DJI Osmo Action 4 (bitrates by mode)

**Dashcams:**
- [ ] Viofo A119 Mini (bitrate, endurance rating)
- [ ] Thinkware Q800 Pro (bitrate, continuous mode)
- [ ] BlackVue DR900X (bitrate, 24/7 mode)
- [ ] Generic 1080p dashcam (standard bitrate)
- [ ] Generic 4K dashcam (4K bitrate)

**Surveillance:**
- [ ] Standard IP camera 1080p (bitrate)
- [ ] Standard IP camera 4K (bitrate)
- [ ] PoE camera specs (if applicable)

**Timelapse/Cameras:**
- [ ] Canon R5 (RAW size, JPEG size, burst rate)
- [ ] Sony A7R V (RAW size, JPEG size, burst rate)
- [ ] Nikon Z9 (RAW size, JPEG size, burst rate)

### Data Source Guidelines

- **Official specs:** Manufacturer websites (DJI.com, GoPro.com, Canon.com)
- **Verification:** YouTube review channels (FunBro Tech for DJI, etc.)
- **Technical forums:** Reddit (r/drones, r/gopro), manufacturer support sites
- **Real-world testing:** If official specs unavailable, use published test results with link attribution

---

## 6. User Flow

```
User searches: "How much 4K video on 256GB"
           ↓
Lands on Video Storage Calculator page
           ↓
Selects "Video Recording" (default preset loads)
           ↓
Sees defaults: 4K 60fps, H.264, 150Mbps (can edit)
           ↓
Inputs capacity: 256GB
           ↓
Clicks "Calculate"
           ↓
Sees Result Card: "✓ You have enough. V30 minimum."
           ↓
Optionally selects device (GoPro, DJI, etc.)
           ↓
Sees card recommendations
           ↓
Clicks "Check Price on Amazon" (affiliate link)
           ↓
OR clicks "View Best Cards for [Device]" → device page
```

---

## 7. Technical Architecture

### Calculator Core (Reusable)
Single JavaScript module (`calculator.js`) that performs math:

```
Input: {
  scenario: "video" | "photo" | "continuous" | "reverse",
  capacity: number (GB),
  bitrate: number (Mbps) OR fileSize: number (MB),
  duration: number (hours/minutes/photos),
  overhead: number (percent),
  codec: "h264" | "h265" | "prores"
}

Output: {
  storageRequired: number (GB),
  recommendedCapacity: number (GB),
  speedClass: "V6" | "V30" | "V60" | "V90",
  minWriteSpeed: number (MB/s),
  recordingTime: string (hours:minutes),
  isEnough: boolean,
  breakdown: {
    rawFootage: number (GB),
    overhead: number (GB)
  }
}
```

### Page Template Structure
Each calculator page:
1. Inherits base layout from `BRAND_GUIDELINES.md`
2. Loads `calculator.js` module
3. Defines presets in front-matter (bitrates, defaults, metadata)
4. Renders same UI component with different configurations
5. Fetches card recommendations from `data/cards.json` based on speed class

### Data Files (Existing + New)
- **`data/cards.json`** — Already exists, add speed class + min bitrate metadata
- **`data/calculator-presets.json`** (new) — Default bitrates, codecs, file sizes by device
- **`data/calculator-faq.json`** (new) — FAQ entries specific to each calculator page

---

## 8. Content & Copywriting

### Page Structure (Each Calculator Page)
1. **Hero Section:** Title + value proposition
2. **Calculator Widget:** Full input flow (presets → calculate button)
3. **Result Card:** Storage outcome + speed class
4. **Card Recommendations:** Filtered list with affiliate links
5. **FAQ Accordion:** 5–7 questions (specific to use case)
6. **Related Content:** Links to device pages or guides

### Tone
- **Friendly, dumb-proof language:** Avoid "bitrate," say "quality level"
- **Reassuring:** "You're good to go!" or "You'll need a bigger card"
- **Actionable:** Every result has a next step (buy, upgrade, check device page)

### Example Copywriting (Video Page)
```
Hero Title: "Video Storage Calculator — How Much Can You Record?"

Subtitle: "Find out if your SD card has enough space for your next shoot. 
Just pick your recording quality, card size, and we'll tell you how long you can film."

Input Helper Text: "Not sure about bitrate? We've filled it in for 4K 60fps recording. 
You can change it if your camera uses different settings."

Result (if sufficient): "✓ Your 256GB card is perfect for 12 hours of 4K filming. 
Download our guide to learn about speed classes and why they matter."

Result (if insufficient): "✗ You'll run out after 6 hours. Upgrade to a 512GB card, 
or bring two 256GB cards as backup. See our top cards below →"
```

---

## 9. SEO & Schema Markup

### On-Page Requirements
- **Canonical URL:** One per page (no duplicate calculators)
- **Meta Description:** 150–160 chars, include primary keyword
- **H1:** Use primary keyword naturally (not keyword-stuffed)
- **Schema Markup:**
  - `WebPage` schema (all calculator pages)
  - `FAQPage` schema (FAQ section)
  - `BreadcrumbList` (navigation context)
  - `Article` schema (if guide content included)
  - `Table` schema (for speed class table output)

### Internal Linking Strategy
- Link between calculator pages: "Also calculate [photo/video/reverse]"
- Link to device pages: Post-calc result includes device-specific recommendations
- Link to guides: FAQ answers link to detailed SD card guides

---

## 10. Scalability & Future Expansion

### Adding New Calculator Pages (Framework for Reuse)

To add a new calculator page for a future keyword:

1. **Research SEO keyword** (search volume, difficulty, traffic potential)
2. **Create page in `/tools/[keyword]/`**
3. **Define presets** in `calculator-presets.json` (bitrates, defaults)
4. **Write contextual copy** (150–300 words, specific use case)
5. **Reuse calculator.js engine** — no new code needed
6. **Add FAQ** specific to the use case
7. **Test Core Web Vitals** before publish

### Example Future Targets (Roadmap)
- "Streaming storage calculator" (for live broadcasters)
- "Security camera storage calculator" (surveillance, continuous 24/7)
- "Dash cam storage calculator" (loop recording, bitrate)
- "RAW burst calculator" (professional photography)

Each is a new page URL, same calculator engine, unique SEO target.

---

## 11. Success Metrics

### Traffic
- Monthly organic visits to calculator pages
- Entry keywords that drive traffic (SEMrush, Ahrefs)
- Bounce rate (should be low; users get immediate value)

### Engagement
- % of users who click "Calculate"
- % of users who see card recommendations
- Avg time on page (should be 2–4 minutes)

### Conversions
- Clicks to Amazon affiliate links (post-calculator)
- Clicks to device pages
- Repeat visitor rate (users trust the tool, come back)

### Content Performance
- Which calculator page gets most traffic first
- Which speed class/capacity combo is most searched
- FAQ click-through rate

---

## 12. Build & Deployment Checklist

### PHASE 0: LAUNCH WEEK 1 (Video + Photo Calculators)

**Core Engine:**
- [ ] Create `calculator.js` module (reusable logic, support video/photo/continuous/reverse modes)
- [ ] Create `calculator-ui.js` (form handling, toggle between forward/reverse modes)
- [ ] Create HTML template component (`calculator-widget.html`)
- [ ] Design Result Card UI (matches brand guidelines)
- [ ] Build card recommendation filter/display logic

**Page 1: Video Storage Calculator**
- [ ] Write intro copy (200 words, benefit-focused)
- [ ] Write FAQ (5–7 questions specific to video recording)
- [ ] Add schema markup (WebPage, FAQ, Breadcrumb, Table)
- [ ] Test all input combinations (resolution, fps, codec)
- [ ] Test reverse toggle ("How long can I record?")
- [ ] Verify card recommendations populate correctly
- [ ] Test mobile responsiveness (44px tap targets, form usability)
- [ ] Test Core Web Vitals (LCP, CLS, INP)
- [ ] Add internal links to device pages

**Page 2: Photo Storage Calculator**
- [ ] Write intro copy (200 words, photographer-focused)
- [ ] Write FAQ (5–7 questions on RAW vs JPEG, burst rates)
- [ ] Add schema markup (WebPage, FAQ, Breadcrumb)
- [ ] Test JPEG/RAW toggle and file size calculations
- [ ] Test reverse toggle ("How many photos can I shoot?")
- [ ] Verify card recommendations populate correctly
- [ ] Test mobile responsiveness
- [ ] Test Core Web Vitals
- [ ] Add internal links to device pages

**Deployment:**
- [ ] Create `/tools/video-storage-calculator/` route
- [ ] Create `/tools/photo-storage-calculator/` route
- [ ] Set up GA4 events (calculate click, recommendation click, affiliate click)
- [ ] Deploy to production
- [ ] Submit sitemap update to Google Search Console
- [ ] Monitor indexing (1–2 weeks)

---

### PHASE 1: BUILD WHILE PHASE 0 IS LIVE (All Device-Specific Calculators)

**Data Collection:**
- [ ] Research and collect bitrate data (see Section 5A checklist)
- [ ] Populate `data/calculator-presets.json` with real device specs
- [ ] Verify all bitrates with 2+ sources (official specs + reviews)

**Page 3: Drone Recording Time Calculator**
- [ ] Create device dropdown (DJI Mavic 3, Air 3S, Mini 4 Pro, Phantom 4 Pro)
- [ ] Write intro copy (200 words, drone pilot-focused)
- [ ] Write FAQ (5–7 questions: battery life, storage, speed class needs)
- [ ] Add schema markup + device-specific breadcrumbs
- [ ] Test all device presets (bitrates auto-fill correctly)
- [ ] Test reverse mode with devices
- [ ] Test Core Web Vitals
- [ ] Internal links to DJI device pages (if exist)

**Page 4: GoPro Storage Calculator**
- [ ] Create device dropdown (Hero 12, Hero 11, Hero 10, Max)
- [ ] Write intro copy (200 words, action sports angle)
- [ ] Write FAQ (5–7 questions: GoPro modes, video quality, time limits)
- [ ] Add schema markup
- [ ] Test all GoPro presets
- [ ] Test reverse mode
- [ ] Test Core Web Vitals
- [ ] Internal links to GoPro device pages

**Page 5: Dashcam Storage Calculator**
- [ ] Create device dropdown (Viofo, Thinkware, BlackVue, generic)
- [ ] Add "Loop Recording" toggle (special feature for dashcams)
- [ ] Add endurance card recommendations (HIGH_ENDURANCE vs SPEED)
- [ ] Write intro copy (200 words, safety/insurance angle)
- [ ] Write FAQ (5–7 questions: loop mode, heat, 24/7 recording)
- [ ] Add schema markup
- [ ] Test loop recording toggle and endurance recommendations
- [ ] Test Core Web Vitals

**Page 6: Action Camera Storage Calculator**
- [ ] Create device dropdown (GoPro, Insta360, DJI Osmo, generic)
- [ ] Add "360° Recording" toggle (doubles bitrate for 360 cameras)
- [ ] Write intro copy (200 words, adventure/sports angle)
- [ ] Write FAQ (5–7 questions: 360 recording, high fps, battery life)
- [ ] Add schema markup
- [ ] Test all device presets and 360° toggle
- [ ] Test Core Web Vitals

**Page 7: Surveillance Recording Calculator**
- [ ] Create device dropdown (1080p IP, 4K IP, generic)
- [ ] Add "24/7 Continuous" toggle + endurance card recommendations
- [ ] Write intro copy (200 words, security/peace-of-mind angle)
- [ ] Write FAQ (5–7 questions: 24/7 durability, overwrite, storage life)
- [ ] Add schema markup
- [ ] Test continuous mode and endurance recommendations
- [ ] Test Core Web Vitals

**Page 8: Timelapse Storage Calculator**
- [ ] Create device dropdown (Canon, Sony, Nikon)
- [ ] Add "Interval" input (seconds between photos) + playback calculator
- [ ] Write intro copy (200 words, creative/architectural angle)
- [ ] Write FAQ (5–7 questions: intervals, playback math, RAW vs JPEG)
- [ ] Add schema markup
- [ ] Test interval calculations and playback duration
- [ ] Test Core Web Vitals

**Simultaneous Deployment (All Phase 1):**
- [ ] Test cross-page linking (Video → Photo → Drone, etc.)
- [ ] Verify all 6 pages load with real device data
- [ ] Final QA on all forms and results
- [ ] Update sitemap with new routes
- [ ] Deploy all Phase 1 pages simultaneously (don't stagger)
- [ ] Monitor indexing (1–2 weeks)

---

### POST-LAUNCH (All Phases)

- [ ] Monitor Core Web Vitals continuously
- [ ] Track GA4 events (which calculator gets most traffic, which devices, etc.)
- [ ] Monitor search rankings (6–12 weeks for Phase 1)
- [ ] Iterate based on traffic data:
  - Which page gets most organic traffic?
  - Which device preset gets most clicks?
  - Which cards get most affiliate clicks?
- [ ] Update FAQ based on GA4 search queries
- [ ] Write blog posts linking to top-traffic calculator pages

---

## 13. Files & Structure

### New Directories/Files
```
src/
├── templates/
│   ├── calculator/
│   │   ├── video-storage-calculator.html
│   │   ├── photo-storage-calculator.html
│   │   ├── reverse-storage-calculator.html
│   │   ├── drone-recording-calculator.html
│   │   └── timelapse-calculator.html
│   └── components/
│       └── calculator-widget.html (reusable)
├── js/
│   ├── calculator.js (core logic)
│   └── calculator-ui.js (form handling, display)
data/
├── calculator-presets.json (NEW)
└── calculator-faq.json (NEW)
```

### No CSS Changes Required
- Reuse existing `.container`, `.card`, `.btn-check-price` classes from brand guidelines
- Result card inherits styling from existing recommendation boxes
- Form inputs use existing form styles

---

## 14. Success Criteria

### PHASE 0 Acceptance Criteria (Video + Photo)

1. ✓ Calculator engine handles video/photo scenarios + reverse toggle without errors
2. ✓ Both pages load with correct presets and unique SEO copy
3. ✓ Result cards display storage required + speed class + card recommendations
4. ✓ Forward/reverse toggle works seamlessly (same URL, toggle data flow)
5. ✓ All forms are mobile-responsive with 44px+ touch targets
6. ✓ Core Web Vitals meet targets (LCP < 2.5s, CLS < 0.1, INP < 200ms)
7. ✓ Schema markup validates (Google Search Console)
8. ✓ Affiliate links work and track in GA4
9. ✓ No console errors on desktop or mobile
10. ✓ FAQ accordion works (single-open, smooth collapse)
11. ✓ Internal links to device pages function
12. ✓ Sitemap updated and submitted

**Phase 0 Launch Timing:** Week 1 (Video + Photo live, measuring traffic)

---

### PHASE 1 Acceptance Criteria (All Device-Specific Pages)

1. ✓ `calculator-presets.json` populated with real bitrate data from 2+ sources per device
2. ✓ All 6 pages load with correct device dropdowns (DJI, GoPro, Dashcam, Action, Surveillance, Timelapse)
3. ✓ Device presets auto-fill bitrates correctly on dropdown selection
4. ✓ Reverse mode works with device presets ("I have X GB card, what devices can I record on?")
5. ✓ Special features work:
   - Dashcam: Loop recording toggle + endurance recommendations
   - Action camera: 360° recording toggle (bitrate doubling)
   - Surveillance: 24/7 continuous mode + endurance emphasis
   - Timelapse: Interval input + playback duration calculator
6. ✓ All 6 pages pass Core Web Vitals tests
7. ✓ Internal links between calculator pages work ("Also try: Drone Calculator")
8. ✓ All GA4 events track correctly (device selection, calculate click, affiliate click)
9. ✓ Cross-page QA: All device presets tested on all calculators
10. ✓ Sitemap updated with all 6 new URLs

**Phase 1 Launch Timing:** Weeks 2–4 (build while Phase 0 is live and collecting data, deploy all simultaneously)

---

## 15. FAQs & Notes

**Q: Should we add device auto-detection (e.g., "DJI Mavic")?"**
A: Phase 2. MVP focuses on bitrate/capacity math. Device presets can be added later.

**Q: What about comparing video codecs (H.264 vs H.265 vs ProRes)?"**
A: Yes, in advanced options. Make it collapsible so beginners don't see it, experts can use it.

**Q: Should the calculator save/export results?"**
A: Phase 2. MVP focuses on immediate answer + affiliate funnel.

**Q: How do we handle bitrate for cameras we don't know?"**
A: Users can input custom bitrate. Provide a helper text: "Check your camera manual or YouTube review for bitrate specs."

**Q: Do we compete with SanDisk's surveillance calculator?"**
A: No. Ours is unified and links to product recommendations. Theirs sells their own cards. Different positioning.

