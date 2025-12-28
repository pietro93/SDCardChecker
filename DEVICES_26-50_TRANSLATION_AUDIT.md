# DEVICES 26-50 - LOCALIZATION AUDIT

## Summary
**CRITICAL ISSUE:** 16 out of 25 devices in this block (64%) contain **ENTIRELY ENGLISH** content in faq, notes, and whySpecs fields.

This is a significant problem - these devices appear to have been added with English content and not yet localized to Japanese.

---

## Critical: Fully English Content (Require Complete Rewrite)

### [35] `fujifilm-x-s20`
**Status:** ENGLISH - NOT LOCALIZED
```
faq[0].q: "Is there a backup card slot?"
faq[0].a: "<b>No, the Fujifilm X-S20 has only a single SD UHS-II card slot</b>..."
notes: "Popular travel camera. Single card slot makes reliable card choice important."
```
**Action:** FULLY TRANSLATE TO JAPANESE

---

### [36] `gopro-hero-max`
**Status:** ENGLISH - NOT LOCALIZED
```
whySpecs: "Shoots 360-degree video and standard 4K. V30 ensures stable recording for both modes."
faq[0].q: "Is V30 needed for 360 video?"
faq[0].a: "Yes, V30 speed class is required..."
faq[1].q: "How much storage for 360 content?"
faq[1].a: "<b>In 360 mode, a 128GB microSD card provides approximately 1.5 hours of recording time</b>..."
notes: "360-degree camera. V30 important for both 360 and standard recording modes."
```
**Action:** FULLY TRANSLATE TO JAPANESE

---

### [37] `dji-mini-3-pro`
**Status:** ENGLISH - NOT LOCALIZED
```
whySpecs: "4K video recording requires V30 minimum. DJI officially recommends high-speed cards."
faq[0].q: "Can V20 cards work?"
faq[0].a: "<b>V20 cards are not safe for DJI Mini 3 Pro's 4K recording</b>..."
notes: "Previous generation Mini series. Same V30 requirements as Mini 4 Pro."
```
**Action:** FULLY TRANSLATE TO JAPANESE

---

### [38] `dji-air-3s`
**Status:** ENGLISH - NOT LOCALIZED
```
whySpecs: "Professional 4K 60fps drone. Higher bitrate than Mini series. V30 minimum, V60 recommended for professional use."
faq[0].q: "Is V60 required for Air 3S?"
faq[0].a: "<b>V30 speed class cards will function for basic 4K recording on the DJI Air 3S</b>..."
notes: "Professional prosumer drone. V60 preferred for stable 4K 60fps recording."
```
**Action:** FULLY TRANSLATE TO JAPANESE

---

### [39] `dji-mavic-3`
**Status:** PARTIALLY ENGLISH
```
whySpecs: JAPANESE ✓
faq[0].q: "Can I use V30 cards?" (ENGLISH)
faq[0].a: "<b>V30 cards are sufficient for 4K recording on the DJI Mavic 3</b>..." (ENGLISH)
notes: PARTIALLY ENGLISH
```
**Action:** TRANSLATE faq[0] TO JAPANESE

---

### [40] `nikon-z9`
**Status:** ENGLISH - NOT LOCALIZED
```
whySpecs: "Professional flagship 8K camera. Requires CFexpress Type B for maximum performance or XQD as a legacy option..."
faq[0].q: "Do I need two cards?"
faq[0].a: "<b>Yes, the Nikon Z9 has dual card slots and using two cards is strongly recommended</b>..."
faq[1].q: "Are CFexpress and XQD compatible?"
faq[1].a: "<b>No, CFexpress Type B and XQD cards are not compatible</b>..."
notes: "Professional flagship. CFexpress Type B recommended for future-proofing."
```
**Action:** FULLY TRANSLATE TO JAPANESE

---

### [41] `nintendo-switch-lite`
**Status:** ENGLISH - NOT LOCALIZED
```
whySpecs: "The Switch Lite has identical storage requirements to the original Switch. While it doesn't need high-speed cards..."
faq[0].q: "Is the SD card slot different on the Switch Lite?"
faq[0].a: "<b>No, the SD card slot and its speed capabilities are identical</b>..."
notes: "Completes the Switch family lineup. Same requirements as other models."
```
**Action:** FULLY TRANSLATE TO JAPANESE
**NOTE:** This is weird - we already have a translated nintendo-switch-lite at position 5 that was localized. This appears to be a duplicate/different entry.

---

### [42] `samsung-galaxy-tab-s9`
**Status:** PARTIALLY LOCALIZED
```
whySpecs: JAPANESE ✓
faq[0].q: JAPANESE ✓
faq[0].a: JAPANESE ✓
notes: ENGLISH (11 words) ⚠️
```
**Action:** TRANSLATE notes field

---

### [43] `canon-eos-r6-mark-ii`
**Status:** PARTIALLY LOCALIZED
```
whySpecs: JAPANESE ✓
faq[0].q: JAPANESE ✓
faq[0].a: JAPANESE ✓
notes: ENGLISH (13 words) ⚠️
```
**Action:** TRANSLATE notes field

---

### [44] `dji-air-3`
**Status:** ENGLISH - NOT LOCALIZED
```
whySpecs: "The Air 3 shoots 4K video at up to 100fps. DJI officially recommends V30 speed class cards..."
faq[0].q: "Is V30 truly the minimum for DJI Air 3?"
faq[0].a: "<b>Yes, V30 is the official minimum recommendation.</b>..."
notes: "A popular prosumer drone with dual cameras, requiring reliable V30 cards..."
```
**Action:** FULLY TRANSLATE TO JAPANESE

---

### [45] `bmpcc-6k-pro`
**Status:** ENGLISH - NOT LOCALIZED
```
whySpecs: "The BMPCC 6K Pro records professional 6K RAW and ProRes at extremely high bitrates..."
faq[0].q: "Do I need CFast for the BMPCC 6K Pro?"
faq[0].a: "<b>For full 6K RAW recording, yes.</b>..."
notes: "Professional-grade 6K cinema camera. Both CFast 2.0 and V90 SD card options..."
```
**Action:** FULLY TRANSLATE TO JAPANESE

---

### [46] `nikon-z8`
**Status:** PARTIALLY LOCALIZED
```
whySpecs: JAPANESE ✓
faq[0].q: JAPANESE ✓
faq[0].a: JAPANESE ✓
notes: ENGLISH (15 words) ⚠️
```
**Action:** TRANSLATE notes field

---

### [47] `panasonic-lumix-s1h`
**Status:** PARTIALLY LOCALIZED
```
whySpecs: JAPANESE ✓
notes: ENGLISH (16 words) ⚠️
```
**Action:** TRANSLATE notes field

---

### [48] `gopro-hero-11-black`
**Status:** ENGLISH - NOT LOCALIZED
```
whySpecs: "The Hero 11 Black shoots high-quality 5.3K video. GoPro officially endorses..."
faq[0].q: "Are Hero 11 and Hero 12 card requirements the same?"
faq[0].a: "<b>Yes, both require V30 microSD cards.</b>..."
notes: "The predecessor to the Hero 12, this model introduced the 8:7 sensor..."
```
**Action:** FULLY TRANSLATE TO JAPANESE

---

### [49] `amazon-fire-hd-10`
**Status:** ENGLISH - NOT LOCALIZED
```
whySpecs: "The Fire HD 10 supports microSD expansion up to 1TB for storing apps, videos, books, and photos..."
faq[0].q: "Can I move apps to the SD card on Fire HD 10?"
faq[0].a: "<b>Yes, you can move compatible apps to the microSD card</b>..."
faq[1].q: "What's the best capacity for a Fire HD 10?"
faq[1].a: "<b>128GB to 256GB is the sweet spot for most users.</b>..."
notes: "One of Amazon's best-selling tablets. Official Amazon specs confirm microSD expansion up to 1TB..."
```
**Action:** FULLY TRANSLATE TO JAPANESE

---

### [50] `amazon-fire-max-11`
**Status:** ENGLISH - NOT LOCALIZED
```
whySpecs: "The Fire Max 11 is Amazon's premium tablet with a large 11-inch display..."
faq[0].q: "Is the Fire Max 11 better for SD cards than Fire HD 10?"
faq[0].a: "<b>Both tablets have identical microSD support (up to 1TB)</b>..."
notes: "Amazon's premium tablet model. Same 1TB microSD support as Fire HD 10..."
```
**Action:** FULLY TRANSLATE TO JAPANESE

---

## Translation Priority

### HIGH (Fully English - Require Complete Translation)
1. [35] fujifilm-x-s20
2. [36] gopro-hero-max
3. [37] dji-mini-3-pro
4. [38] dji-air-3s
5. [40] nikon-z9
6. [41] nintendo-switch-lite
7. [44] dji-air-3
8. [45] bmpcc-6k-pro
9. [48] gopro-hero-11-black
10. [49] amazon-fire-hd-10
11. [50] amazon-fire-max-11

### MEDIUM (Partially English - Need notes translation)
12. [42] samsung-galaxy-tab-s9 (notes field)
13. [43] canon-eos-r6-mark-ii (notes field)
14. [46] nikon-z8 (notes field)
15. [47] panasonic-lumix-s1h (notes field)

### PARTIAL (Mostly Japanese but some fields need work)
16. [39] dji-mavic-3 (faq[0] needs translation)

---

## Pattern Analysis

**Observation:** These devices appear to have been added in batches without localization:
- Devices 26-34: Mostly cameras, all well-localized ✓
- Devices 35-50: Mix of cameras/drones/tablets with significant English content ⚠️

**Hypothesis:** These entries may have been imported from a source that wasn't fully processed through the Japanese localization pipeline.

---

## Recommended Approach

1. **Batch 1 (11 devices):** Fully translate whySpecs, all FAQ questions AND answers, notes
   - [35, 36, 37, 38, 40, 41, 44, 45, 48, 49, 50]

2. **Batch 2 (4 devices):** Translate notes field only (10-15 sentences each)
   - [42, 43, 46, 47]

3. **Batch 3 (1 device):** Translate faq[0] question and answer only
   - [39]

**Total content to translate:** ~150+ sentences across these 16 devices

Would you like to:
- A) Fix all 16 devices now (automated translation approach)?
- B) Focus on the HIGH priority 11 devices first?
- C) Review one specific device in detail before doing batch operations?
