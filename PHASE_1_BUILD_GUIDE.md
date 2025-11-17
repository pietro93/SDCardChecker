# Phase 1 Build Guide — Device-Specific Calculators

**Timeline:** Build while Phase 0 is live (Weeks 2-4)  
**Status:** READY TO BUILD  
**Template:** All pages follow same pattern

---

## Quick Start: Creating a Phase 1 Page

### Step 1: Create HTML Page

**Template:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Device] Storage Calculator — [Benefit] | SD Card Checker</title>
  <meta name="description" content="[SEO keyword description, 150-160 chars]">
  <link rel="canonical" href="https://sdcardchecker.com/tools/[device]/">
  <link rel="stylesheet" href="/assets/css/tailwind.css">
  <link rel="stylesheet" href="/assets/css/modern.css">
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
  <script src="/assets/js/calculator.js"></script>
  <script src="/assets/js/calculator-ui.js"></script>
</head>
<body>
  {{HEADER}}

  <!-- Breadcrumb -->
  <div class="bg-white border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 py-3">
      <nav class="text-sm text-slate-600">
        <a href="/">Home</a> › <a href="/tools/">Tools</a> › <span>[Device] Storage Calculator</span>
      </nav>
    </div>
  </div>

  <div class="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
    <main class="flex-1">
      <!-- Hero Section (150-250 words, benefit-focused) -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-slate-900 mb-4">[Hero Title]</h1>
        <h2 class="text-2xl font-semibold text-slate-700 mb-4">[Subtitle]</h2>
        <p class="text-lg text-slate-600 mb-6">[Intro copy, ~250 words]</p>
      </div>

      <!-- Calculator Widget -->
      <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-8 mb-8">
        <script>
          document.addEventListener('alpine:init', () => {
            Alpine.data('calculatorState', () => CalculatorUI.init({
              defaultScenario: 'video',  // or 'photo', 'continuous'
              deviceSelectorEnabled: true,
              devices: DEVICE_DATA // From data/calculator-devices.json
            }));
          });
        </script>
        {% include "components/calculator-widget.html" %}
      </div>

      <!-- Why This Matters Section -->
      <div class="mb-8 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-8">
        <h2 class="text-2xl font-bold text-slate-900 mb-4">Why This Matters</h2>
        <p class="text-slate-700 mb-4">[Device-specific pain points, 3-4 paragraphs]</p>
      </div>

      <!-- FAQ Section (5-7 questions, 100-150+ words each) -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
        <div class="space-y-4">
          <!-- FAQ items (reuse from Phase 0 template) -->
        </div>
      </div>

      <!-- Schema Markup -->
      <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "[Title]",
          "breadcrumb": { "@type": "BreadcrumbList", "itemListElement": [...] },
          "mainEntity": { "@type": "FAQPage", "mainEntity": [...] }
        }
      </script>
    </main>

    {{SIDEBAR}}
  </div>

  {{FOOTER}}
</body>
</html>
```

---

## 6 Pages to Build

### Page 1: DRONE RECORDING CALCULATOR

**URL:** `/tools/calculators/drone-recording-time/`  
**Primary Keyword:** "drone recording time calculator," "DJI recording storage"

**Hero Title:** "Drone Recording Time Calculator — Plan Your Flights"

**Scenario:** `video` (with device dropdown)

**Devices:**
- DJI Mavic 3
- DJI Air 3S
- DJI Mini 4 Pro
- DJI Phantom 4 Pro

**FAQ Topics:**
1. How long can a DJI Mavic 3 record on 256GB?
2. What's the difference between H.264 and H.265 recording?
3. Do I need V60 cards for my drone?
4. Can I use the same card in multiple drones?
5. How do I check my drone's bitrate specs?
6. What speed class do I need for 4K 120fps recording?

**Special Feature:** Device dropdown auto-fills bitrate, resolution, fps

---

### Page 2: GOPRO STORAGE CALCULATOR

**URL:** `/tools/calculators/gopro-recording-time/`  
**Primary Keyword:** "GoPro storage calculator," "GoPro Hero 12 recording time"

**Hero Title:** "GoPro Storage Calculator — How Much Video Fits?"

**Scenario:** `video` (with device dropdown)

**Devices:**
- GoPro Hero 12
- GoPro Hero 11
- GoPro Hero 10
- GoPro Max

**FAQ Topics:**
1. How much 5.3K video fits on 128GB?
2. What's the difference between Hero 12 and Hero 11?
3. Do I need V60 for 4K 120fps on GoPro?
4. Can I use GoPro cards in my camera?
5. Why is GoPro bitrate different?
6. What's the fastest GoPro card I can use?

**Special Feature:** Max support (toggle 360° recording = 2x bitrate)

---

### Page 3: DASHCAM STORAGE CALCULATOR

**URL:** `/tools/calculators/dashcam-recording-time/`  
**Primary Keyword:** "dashcam storage calculator," "continuous dashcam recording"

**Hero Title:** "Dashcam Storage Calculator — Plan Continuous Recording"

**Scenario:** `continuous` (with device dropdown)

**Devices:**
- Viofo A119 Mini
- Thinkware Q800 Pro
- BlackVue DR900X
- Generic 1080p
- Generic 4K

**FAQ Topics:**
1. How long can a dashcam record on 256GB?
2. What is loop recording?
3. Do I need endurance cards?
4. What's the difference between speed and endurance?
5. Will my card overheat with 24/7 recording?
6. How do I protect against overwrite?

**Special Feature: LOOP RECORDING TOGGLE**
```html
<!-- In calculator-widget.html or custom variant -->
<label class="flex items-center">
  <input type="checkbox" x-model="forward.continuous.loopRecordingEnabled" />
  <span>Enable Loop Recording (oldest footage overwrites)</span>
</label>

<!-- Output changes when enabled:
  Instead of: "256GB card = 42 days continuous"
  Shows: "256GB card = continuous loop, overwrites oldest after 42 days" -->
```

**Recommendation Filter:** Show HIGH_ENDURANCE cards first (not speed cards)

---

### Page 4: ACTION CAMERA STORAGE CALCULATOR

**URL:** `/tools/calculators/action-camera-recording-time/`  
**Primary Keyword:** "action camera storage calculator," "Insta360 recording storage"

**Hero Title:** "Action Camera Storage Calculator — 4K, 360°, & Beyond"

**Scenario:** `video` (with device dropdown)

**Devices:**
- GoPro Hero 12
- Insta360 X4
- DJI Osmo Action 4
- Generic action camera

**FAQ Topics:**
1. What is 360° recording and how much space does it use?
2. How much does 360° increase bitrate?
3. Can I use the same card in different cameras?
4. What speed class for 360° video?
5. How do I compare Insta360 vs GoPro vs DJI?

**Special Feature: 360° RECORDING TOGGLE**
```html
<!-- Add to advanced options or main form -->
<label class="flex items-center">
  <input type="checkbox" x-model="forward.video.is360Recording" />
  <span>360° Recording Mode (2x bitrate)</span>
</label>

<!-- Formula: when toggled ON, bitrate doubles
  Standard: 90 Mbps → 180 Mbps
  Shows both side-by-side comparison
-->
```

---

### Page 5: SURVEILLANCE/SECURITY CAMERA CALCULATOR

**URL:** `/tools/calculators/security-camera-recording-time/`  
**Primary Keyword:** "security camera recording calculator," "24/7 surveillance storage"

**Hero Title:** "Security Camera Recording Calculator — 24/7 Coverage Planning"

**Scenario:** `continuous` (with device dropdown)

**Devices:**
- 1080p IP Camera
- 4K IP Camera
- PoE Camera

**FAQ Topics:**
1. How long will a 256GB card record 24/7?
2. What's an endurance card?
3. Can I use any SD card for surveillance?
4. How do I calculate for multiple cameras?
5. What about heat and outdoor surveillance?

**Special Feature: 24/7 CONTINUOUS TOGGLE + ENDURANCE EMPHASIS**
```html
<label class="flex items-center">
  <input type="checkbox" x-model="forward.continuous.is24x7" :checked="true" />
  <span>24/7 Continuous Recording</span>
</label>

<div class="bg-yellow-50 border border-yellow-300 rounded p-3 mt-2">
  <strong>💡 Important:</strong> For 24/7 surveillance, use HIGH_ENDURANCE cards 
  (rated for continuous operation). Regular speed cards will fail prematurely.
</div>
```

**Recommendation Filter:** HIGH_ENDURANCE only

---

### Page 6: TIMELAPSE STORAGE CALCULATOR

**URL:** `/tools/calculators/timelapse-storage/`  
**Primary Keyword:** "timelapse storage calculator," "24-hour timelapse"

**Hero Title:** "Timelapse Storage Calculator — Long-Duration Project Planning"

**Scenario:** `photo` (with device dropdown)

**Devices:**
- Canon EOS R5
- Sony A7R V
- Nikon Z9

**FAQ Topics:**
1. How many photos do I need for a 24-hour timelapse?
2. What's the difference between 1fps and 0.5fps intervals?
3. How do I calculate playback duration?
4. What's the bitrate for a timelapse sequence?
5. Can I use RAW files for timelapse?
6. How do I set up interval shooting?

**Special Features:**

```html
<!-- 1. Interval Input (seconds between photos) -->
<label>
  <span>Interval (seconds between photos)</span>
  <input x-model.number="forward.photo.intervalSeconds" type="number" 
         placeholder="2" min="0.5" step="0.5" />
</label>

<!-- Auto-calculate: "For 24 hours, you need X photos" -->
<div x-show="forward.photo.intervalSeconds">
  <p>For 24 hours at <span x-text="forward.photo.intervalSeconds"></span>s intervals:</p>
  <p class="font-bold text-lg">
    You need <span x-text="(86400 / forward.photo.intervalSeconds).toLocaleString()"></span> photos
  </p>
</div>

<!-- 2. Playback Duration Calculator -->
<label>
  <span>Playback Framerate (fps)</span>
  <input x-model.number="forward.photo.playbackFps" type="number" 
         placeholder="24" min="1" step="1" />
</label>

<div x-show="forward.photo.photoCount && forward.photo.playbackFps">
  <p>Playback duration:</p>
  <p class="font-bold text-lg">
    <span x-text="formatPlaybackDuration(forward.photo.photoCount / forward.photo.playbackFps)"></span>
  </p>
</div>
```

---

## Device Data File: calculator-devices.json

**Location:** `data/calculator-devices.json`

**Schema:**

```json
{
  "devices": {
    "drone": [
      {
        "id": "dji-mavic-3",
        "brand": "DJI",
        "model": "Mavic 3",
        "category": "drone",
        "recordingModes": [
          {
            "name": "4K 120fps (H.265)",
            "resolution": "4K",
            "fps": 120,
            "codec": "H.265",
            "bitrateMbps": 250,
            "isDefault": true
          },
          {
            "name": "4K 60fps (H.264)",
            "resolution": "4K",
            "fps": 60,
            "codec": "H.264",
            "bitrateMbps": 150,
            "isDefault": false
          }
        ],
        "speedClassRequired": "V60",
        "notes": "Check DJI specs for exact bitrates per firmware"
      }
    ],
    "action_camera": [
      {
        "id": "gopro-hero-12",
        "brand": "GoPro",
        "model": "Hero 12",
        "category": "action_camera",
        "recordingModes": [
          {
            "name": "5.3K 60fps",
            "resolution": "5.3K",
            "fps": 60,
            "codec": "H.265",
            "bitrateMbps": 180,
            "isDefault": true
          },
          {
            "name": "4K 120fps",
            "resolution": "4K",
            "fps": 120,
            "codec": "H.265",
            "bitrateMbps": 150,
            "isDefault": false
          }
        ],
        "speedClassRequired": "V60",
        "notes": "GoPro Hero 12 requires V60 minimum for high bitrate modes"
      }
    ],
    "dashcam": [
      {
        "id": "viofo-a119-mini",
        "brand": "Viofo",
        "model": "A119 Mini",
        "category": "dashcam",
        "recordingModes": [
          {
            "name": "1600p 30fps",
            "resolution": "1600p",
            "fps": 30,
            "codec": "H.264",
            "bitrateMbps": 12,
            "isDefault": true
          }
        ],
        "speedClassRequired": "V30",
        "enduranceRating": "HIGH_ENDURANCE",
        "continuousMode": true,
        "notes": "Must use HIGH_ENDURANCE card for 24/7 operation"
      }
    ],
    "camera": [
      {
        "id": "canon-r5",
        "brand": "Canon",
        "model": "EOS R5",
        "category": "mirrorless",
        "recordingModes": [
          {
            "name": "4K 60fps (H.264)",
            "resolution": "4K",
            "fps": 60,
            "codec": "H.264",
            "bitrateMbps": 170,
            "isDefault": true
          }
        ],
        "photoModes": {
          "raw": {
            "fileSizeMB": 36.2,
            "resolution": "45MP"
          },
          "jpeg": {
            "fileSizeMB": 12.5,
            "resolution": "45MP"
          }
        },
        "burstFps": 20,
        "speedClassRequired": "V60",
        "notes": "Dual SD UHS-II slots; check firmware for exact bitrates"
      }
    ]
  }
}
```

---

## Integration Checklist

For each Phase 1 page, implement:

- [ ] Device dropdown loads from `calculator-devices.json`
- [ ] Device selection auto-fills:
  - Resolution
  - FPS
  - Codec
  - Bitrate
- [ ] Calculation works with device presets
- [ ] Reverse mode works with device presets
- [ ] Special feature works (loop recording, 360°, etc.)
- [ ] FAQ specific to device (5-7 questions)
- [ ] Hero copy specific to use case (150-250 words)
- [ ] "Why This Matters" section (3-4 paragraphs)
- [ ] Related Resources section links to relevant guides
- [ ] Schema markup includes device-specific breadcrumbs
- [ ] Card recommendations filtered by speed class + endurance (if needed)
- [ ] Mobile tested (44px tap targets)
- [ ] Accessibility tested (WCAG 2.1 AA)
- [ ] Core Web Vitals tested (LCP, CLS, INP)

---

## Timeline

**Week 2-3:**
- Research and collect bitrate data for all devices
- Create `data/calculator-devices.json`
- Build 6 HTML page templates
- Write device-specific FAQ + copy

**Week 3-4:**
- Integration testing (device dropdowns, calculations)
- Mobile responsiveness testing
- Cross-page linking verification
- Performance testing (Core Web Vitals)
- Accessibility audit (WCAG 2.1 AA)

**Week 4:**
- Final QA on all 6 pages
- Simultaneous deployment (don't stagger)
- Monitor GA4 events
- Track indexing in Google Search Console

---

## Key Files to Reference

- **Widget:** `src/templates/components/calculator-widget.html`
- **Calculator Engine:** `src/js/calculator.js` (StorageCalculator class)
- **UI Manager:** `src/js/calculator-ui.js` (CalculatorUI class)
- **Video Example:** `src/templates/calculator/video-storage-calculator.html`
- **Photo Example:** `src/templates/calculator/photo-storage-calculator.html`
- **Device Data Schema:** Follow structure in calculator-devices.json (above)

---

## Copy Guidelines

**Hero Title Pattern:** "[Device/Use Case] Storage Calculator — [Benefit]"

**Scenario Selector:** Most Phase 1 pages use `video` scenario, except:
- Timelapse uses `photo`
- Dashcam/Surveillance use `continuous`

**FAQ Depth:** 100-150+ words per answer, include:
- Real-world context
- Specific examples for device
- Technical specs
- Actionable advice

**Why This Matters:** 3-4 paragraphs on pain points specific to device/use case

---

## Example: Building the Drone Calculator (3-hour job)

1. **Data (30 mins):**
   - Add DJI devices to calculator-devices.json
   - 5 devices × 2-3 recording modes each
   - Verify bitrates from DJI.com + YouTube reviews

2. **Template (30 mins):**
   - Copy `video-storage-calculator.html`
   - Update title, breadcrumb, meta description
   - Change default scenario to 'video'
   - Enable device selector

3. **Content (90 mins):**
   - Hero title + subtitle (benefit-focused)
   - Hero copy (150-250 words on flight planning)
   - "Why This Matters" section (3 para on flight failures)
   - 6 FAQ answers (100-150 words each):
     1. How long can Mavic 3 record on 256GB?
     2. H.264 vs H.265 for drones
     3. V60 recommendation for 4K 120fps
     4. Can I use same card in different drones?
     5. How to check drone bitrate
     6. Speed class for 4K 120fps recording
   - Update schema breadcrumb

4. **Testing (30 mins):**
   - Device dropdown loads devices
   - Dropdown selection auto-fills bitrate
   - Calculate button works
   - Reverse mode works
   - Mobile responsive
   - No console errors

5. **Deploy:**
   - Push to main with other Phase 1 pages
   - All 6 pages deploy simultaneously

---

## Success Metrics (Phase 1)

**Organic Traffic:**
- Phase 1 pages capture 2-3x the Phase 0 traffic (baseline)
- New device-specific keywords rank in top 10

**Engagement:**
- 70%+ of users click Calculate
- 80%+ see card recommendations
- 30%+ click FAQ answers
- 20%+ navigate to related calculators

**Conversions:**
- Affiliate click-through rate 1.5-2x Phase 0
- Device page visits increase
- Repeat visitor rate > 10%

---

## Questions?

Refer to:
- **Math specs:** `STORAGE_CALCULATOR_PRODUCT_SPEC.md` (Section 3)
- **Widget details:** `CALCULATOR_WIDGET_COMPLETE.md`
- **Kanban board:** `STORAGE_CALCULATOR_KANBAN.md` (Phase 1 section)
- **Brand guidelines:** `BRAND_GUIDELINES.md` (for styling)
