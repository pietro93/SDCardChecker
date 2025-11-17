# Calculator Widget — Quick Reference Card

## 📁 File Locations

```
src/
├── templates/components/
│   └── calculator-widget.html          ← Reusable widget (all pages use this)
├── templates/calculator/
│   ├── video-storage-calculator.html   ← LIVE (Phase 0)
│   └── photo-storage-calculator.html   ← LIVE (Phase 0)
└── js/
    ├── calculator.js                   ← Math engine (StorageCalculator class)
    └── calculator-ui.js                ← State manager (CalculatorUI class)

data/
└── calculator-devices.json             ← Device presets (Phase 1)
```

---

## 🎯 What Each File Does

| File | Purpose | Used By |
|------|---------|---------|
| **calculator-widget.html** | HTML form + result display | All 8 calculator pages |
| **calculator.js** | Forward/reverse calculations | Widget + UI manager |
| **calculator-ui.js** | Alpine.js state + form handling | Widget initialization |
| **calculator-devices.json** | Device presets (bitrates, specs) | Phase 1 pages only |

---

## 🚀 Using the Widget

### In Your HTML

```html
<script src="/assets/js/calculator.js"></script>
<script src="/assets/js/calculator-ui.js"></script>

<!-- Initialize Alpine.js state -->
<script>
  document.addEventListener('alpine:init', () => {
    Alpine.data('calculatorState', () => CalculatorUI.init({
      defaultScenario: 'video',  // or 'photo', 'continuous'
      deviceSelectorEnabled: true,  // Phase 1 only
      devices: DEVICE_DATA  // Load from data/calculator-devices.json
    }));
  });
</script>

<!-- Include the widget -->
{% include "components/calculator-widget.html" %}
```

---

## 🧮 Calculator API

### Forward Calculation

```javascript
const result = StorageCalculator.calculateForward({
  scenario: 'video|photo|continuous',
  // Video
  bitrateMbps: 150,
  durationHours: 2,
  durationMinutes: 30,
  // Photo
  photoCount: 1000,
  fileSizeMB: 2.5,
  // Continuous (optional)
  hoursPerDay: 24,
  daysNeeded: 7,
  // Advanced
  overheadPercent: 10
});

// Returns
{
  scenario: 'video',
  totalGB: 55,                    // Raw + overhead
  recommendedCapacity: 64,        // Rounded up
  rawGB: 50,
  overheadGB: 5,
  speedClass: 'V30',
  minWriteSpeed: 30,
  recordingTimeString: '02:30',
  recordingHours: 2.5,
  speedClassTable: [
    { speedClass: 'V6', bitrateMbps: '≤6', writeSpeed: '6 MB/s', useCase: '...' },
    // ... full table
  ]
}
```

### Reverse Calculation

```javascript
const result = StorageCalculator.calculateReverse({
  scenario: 'video',
  cardCapacityGB: 128,
  bitrateMbps: 150,
  fileSizeMB: 2.5,  // For photo scenario
  overheadPercent: 10
});

// Returns
{
  scenario: 'video',
  recordingTimeString: '09:24',
  recordingHours: 9.4,
  daysFor24h: 0.39,
  photoCount: 5120,  // For photo scenario
  speedClass: 'V30',
  minWriteSpeed: 30
}
```

---

## 🎛️ UI State Manager API

```javascript
// In Alpine.js component
Alpine.data('calculatorState', () => CalculatorUI.init(options))

// Key methods available
x-data="calculatorState" provides:

// Navigation
selectUseCase(scenario)   // Switch to details layer
toggleMode()              // Forward ↔ Reverse
reset()                   // Back to use case selection

// Calculations
calculate()               // Forward calculation
calculateReverse()        // Reverse calculation

// Form updates
toggleRaw()               // Photo: RAW/JPEG toggle
updatePhotoFileSize(preset)  // Photo: preset button
selectDevice(deviceId)    // Phase 1: device selection

// Validation
validateNumericInput(event, min, max)
isInputValid()            // Check form validity
isReverseInputValid()

// State variables
mode                      // 'forward' or 'reverse'
currentLayer              // 'usecase', 'details', 'results'
activeScenario            // 'video', 'photo', 'continuous'
result                    // Last calculation result
```

---

## 📊 Speed Class Reference

| Bitrate | Class | Write Speed | Use Case |
|---------|-------|-------------|----------|
| ≤ 6 Mbps | V6 | 6 MB/s | Full HD, timelapse |
| 6–90 Mbps | V30 | 30 MB/s | 4K 30fps |
| 90–200 Mbps | V60 | 60 MB/s | 4K 60fps |
| 200+ Mbps | V90 | 90 MB/s | 8K, RAW |

---

## 🔢 Calculation Formulas

### Video Storage (Forward)

```
Duration Seconds = Duration Hours × 3600
Megabits Total = Bitrate Mbps × Duration Seconds
Bytes Total = Megabits Total × 125,000
Raw GB = Bytes Total / (1024^3)
Total GB = Raw GB × (1 + Overhead% / 100)
```

### Photo Storage (Forward)

```
Total MB = Photo Count × File Size MB
Raw GB = Total MB / 1024
Total GB = Raw GB × (1 + Overhead% / 100)
```

### Recording Duration (Reverse)

```
Usable GB = Card Capacity × (1 - Overhead% / 100)
Total Bits = Usable GB × 1024^3 × 8
Total Seconds = Total Bits / (Bitrate Mbps × 1,000,000)
Hours = Total Seconds / 3600
```

---

## 🎨 CSS Classes Used

**From Tailwind:**
```html
<!-- Layout -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<div class="flex items-center justify-between">

<!-- Colors -->
<div class="bg-blue-50 border border-blue-200">
<button class="bg-orange-500 text-white hover:bg-orange-600">

<!-- Utilities -->
<input class="w-full px-3 py-2 border border-gray-300 rounded-lg">
<label class="block text-sm font-bold mb-2">
```

**Custom Classes:**
```css
.faq-item            { border, rounded, shadow }
.faq-question        { button style, 48px min-height }
.faq-answer          { hidden/show with .open }
.faq-toggle          { rotate on .open }
.animate-fade        { 0.3s fade-in animation }
```

---

## ✅ Validation Rules

**Video Inputs**
- Bitrate: 1-500 Mbps
- Duration: 0-999 hours
- FPS: 24, 30, 60, 120 only
- Resolution: 1080p, 2K, 4K, 6K

**Photo Inputs**
- Count: 1-1,000,000
- File size: 0.1-500 MB
- Overhead: 5-25%

**Continuous Inputs**
- Bitrate: 1-500 Mbps
- Hours/day: 0-24
- Days: 1-365

**Reverse Inputs**
- Capacity: 32, 64, 128, 256, 512 GB
- Bitrate/file size: same as above

---

## 🔗 Device Data Schema

```json
{
  "id": "device-unique-id",
  "brand": "Brand Name",
  "model": "Model Name",
  "category": "drone|action_camera|dashcam|camera",
  "recordingModes": [
    {
      "name": "4K 60fps (H.264)",
      "resolution": "4K",
      "fps": 60,
      "codec": "H.264",
      "bitrateMbps": 150,
      "isDefault": true
    }
  ],
  "speedClassRequired": "V30|V60",
  "enduranceRating": "HIGH_ENDURANCE",  // Optional, for dashcam/surveillance
  "continuousMode": true,  // Optional
  "notes": "Additional info"
}
```

---

## 🧪 Test Cases

### Unit Tests (Calculator.js)

```javascript
// Video: 4K 60fps H.264 × 2 hours
StorageCalculator.calculateForward({
  scenario: 'video',
  bitrateMbps: 150,
  durationHours: 2,
  overheadPercent: 10
})
// Expected: ~55GB total, V30 required

// Reverse: 128GB @ 150 Mbps
StorageCalculator.calculateReverse({
  scenario: 'video',
  cardCapacityGB: 128,
  bitrateMbps: 150,
  overheadPercent: 10
})
// Expected: 9:24 recording time

// Photo: 1000 photos × 2.5MB JPEG
StorageCalculator.calculateForward({
  scenario: 'photo',
  photoCount: 1000,
  fileSizeMB: 2.5,
  overheadPercent: 10
})
// Expected: ~2.74GB total
```

### Integration Tests (Widget)

- [ ] Page loads with default result pre-calculated
- [ ] Use case selection works
- [ ] Form validation prevents invalid inputs
- [ ] Calculate button calculates and shows results
- [ ] Reverse mode toggle works
- [ ] RAW/JPEG toggle updates file size
- [ ] Photo preset buttons update values
- [ ] Advanced options expand/collapse
- [ ] Speed class table renders
- [ ] Mobile: 44px+ tap targets

---

## 📈 GA4 Events Tracked

```javascript
// When user clicks Calculate
gtag('event', 'calculator_calculate', {
  scenario: 'video|photo|continuous',
  mode: 'forward|reverse'
});

// When result displays
gtag('event', 'calculator_result_view', {
  scenario: 'video',
  storageGB: 55,
  speedClass: 'V30'
});

// When card recommendation clicked
gtag('event', 'calculator_card_recommendation_click', {
  scenario: 'video',
  cardId: 'sandisk-extreme-pro',
  speedClass: 'V30'
});
```

---

## 🚨 Common Issues & Fixes

### Widget doesn't load
- [ ] Alpine.js loaded before calculator scripts
- [ ] `calculator.js` and `calculator-ui.js` in `<head>`
- [ ] `alpine:init` event listener present
- [ ] `x-data="calculatorState"` on widget div

### Calculations wrong
- [ ] Check bitrate Mbps (not MB/s)
- [ ] Check overhead % (should be 5-25, not 0.05-0.25)
- [ ] Duration in hours (not minutes)

### Device dropdown doesn't populate
- [ ] `deviceSelectorEnabled: true` in CalculatorUI.init()
- [ ] `devices` data passed to CalculatorUI.init()
- [ ] Device IDs match HTML `value` attributes
- [ ] Device data structure follows schema above

### Mobile not responsive
- [ ] Tailwind CSS loading
- [ ] Grid classes: `grid-cols-1 md:grid-cols-2`
- [ ] Input height: `h-12` on buttons, `py-2` on inputs
- [ ] Labels visible (not `hidden`)

---

## 📚 Documentation Files

| Document | Content |
|----------|---------|
| **CALCULATOR_WIDGET_COMPLETE.md** | Full implementation details, testing checklist |
| **PHASE_1_BUILD_GUIDE.md** | How to build 6 device-specific pages |
| **STORAGE_CALCULATOR_PRODUCT_SPEC.md** | Product requirements, all scenarios |
| **STORAGE_CALCULATOR_KANBAN.md** | Project timeline, acceptance criteria |
| **This file** | Quick reference (you are here) |

---

## 🎯 Next Steps

1. ✅ Phase 0: Video + Photo calculators LIVE
2. 📊 Collect Phase 1 bitrate data
3. 🏗️ Build 6 Phase 1 pages (use this quick ref)
4. 🚀 Deploy all 6 Phase 1 simultaneously
5. 📈 Monitor GA4 metrics
6. 🔄 Iterate based on user behavior

---

## 💡 Pro Tips

- **Default result on load:** Set `showDefaultResult: true` to demonstrate value immediately
- **Device presets:** Use isDefault: true on recording mode for auto-selection
- **Overhead:** Default 10%, adjustable 5-25%—users understand metadata
- **Mobile testing:** Always test with actual 44px+ tap targets
- **Accessibility:** All form fields need labels; accordions need aria-expanded
- **Performance:** Bundle calculator.js + calculator-ui.js = ~40KB gzipped
- **GA4:** Track calculate clicks to measure engagement
- **FAQ depth:** 100-150+ words per answer = better SEO + user trust

---

**Version:** 2.0 | **Last Updated:** November 17, 2025
