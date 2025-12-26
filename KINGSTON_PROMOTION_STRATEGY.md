# Kingston Canvas React Plus SD - Promotion Strategy

**Goal:** Maximize commission from this high-margin V90 card  
**Status:** Strategic placement recommendations

---

## Where to Promote (Recommended)

### TIER 1: HIGHEST VALUE (Professional Cinema/Video)

These devices NEED V90 and have high purchase intent:

**Cinema Cameras (MUST RECOMMEND V90):**
- ✅ `bmpcc-4k` - Blackmagic Pocket Cinema Camera 4K
- ✅ `bmpcc-6k-pro` - Blackmagic Pocket Cinema Camera 6K Pro
- ✅ `bmpcc-ursa` - Blackmagic URSA (if exists)

**Professional Mirrorless (8K/4K High Bitrate):**
- ✅ `canon-eos-r5` - Canon EOS R5 (8K RAW video)
- ✅ `nikon-d850` - Nikon D850 (4K UHD)
- ✅ `nikon-z8` - Nikon Z8 (8K video)
- ✅ `nikon-z9` - Nikon Z9 (8K video)
- ✅ `sony-a1` - Sony A1 (8K video)
- ✅ `sony-a7r-v` - Sony A7R V (8K video)
- ✅ `panasonic-lumix-s1h` - Panasonic Lumix S1H (requires V90)
- ✅ `panasonic-lumix-s5-iix` - Panasonic Lumix S5 IIx (requires V90)
- ✅ `fujifilm-x-t5` - Fujifilm X-T5 (6.2K ProRes)

**Recommendation:** Show Kingston on ALL these pages

---

### TIER 2: HIGH VALUE (Professional Video/Hybrid)

These devices benefit from V90 for high-bitrate recording:

**Professional Video Drones:**
- ✅ `dji-phantom-4-pro-v2` - DJI Phantom 4 Pro V2
- ✅ `dji-air-3s` - DJI Air 3S (V90 recommended for 4K 60fps)
- ✅ `dji-mini-4-pro` - DJI Mini 4 Pro (can use V60, but V90 better)

**Hybrid Mirrorless (Photo + 4K/8K Video):**
- ✅ `canon-eos-r6-mark-ii` - Canon EOS R6 Mark II
- ✅ `sony-a6700` - Sony A6700
- ✅ `sony-a6400` - Sony A6400

**Recommendation:** Show Kingston on SOME of these

---

### TIER 3: MODERATE VALUE (Enthusiast Video)

These devices support V90 but work fine with V60:

**Professional Action Cameras (4K):**
- ✅ `gopro-hero-13-black` - GoPro Hero 13 Black
- ✅ `gopro-hero-12-black` - GoPro Hero 12 Black
- ✅ `gopro-max-2` - GoPro MAX 2

**Bridge Cameras:**
- ✅ Various Panasonic Lumix cameras
- ✅ Various Canon G/XG series

**Recommendation:** Optional to show Kingston (nice-to-have, not essential)

---

### TIER 4: LOWER PRIORITY (Budget/Gaming/Leisure)

These devices rarely need V90:

- Nintendo Switch (uses microSD, not SD)
- Nintendo Switch OLED (uses microSD)
- Steam Deck (uses microSD)
- Orange Pi (uses microSD)
- iPad (uses microSD via adapter, low market)

**Recommendation:** DON'T promote Kingston (wrong card type)

---

## Recommended Configuration

### Option A: Premium Tier Only (MOST AGGRESSIVE)
**Target:** Professional users with high commission potential

```json
{
  "id": "kingston-canvas-react-sd",
  "enabled": true,
  "displayOn": "list",
  "appliesTo": [
    "bmpcc-4k",
    "bmpcc-6k-pro",
    "canon-eos-r5",
    "nikon-d850",
    "nikon-z8",
    "nikon-z9",
    "sony-a1",
    "sony-a7r-v",
    "panasonic-lumix-s1h",
    "panasonic-lumix-s5-iix",
    "fujifilm-x-t5"
  ],
  "badgeText": "Best Value V90",
  "badgeColor": "bg-blue-600"
}
```

**Result:** Appears on 11 high-value pages  
**Expected Revenue Impact:** +$20-50/month from professional users  
**Conversion Rate:** Likely 15-25% (they're already researching V90)

---

### Option B: Balanced Approach (RECOMMENDED)
**Target:** Tier 1 + selective Tier 2

```json
{
  "id": "kingston-canvas-react-sd",
  "enabled": true,
  "displayOn": "list",
  "appliesTo": [
    "bmpcc-4k",
    "bmpcc-6k-pro",
    "canon-eos-r5",
    "nikon-d850",
    "nikon-z8",
    "nikon-z9",
    "sony-a1",
    "sony-a7r-v",
    "panasonic-lumix-s1h",
    "panasonic-lumix-s5-iix",
    "fujifilm-x-t5",
    "dji-phantom-4-pro-v2",
    "dji-air-3s",
    "canon-eos-r6-mark-ii",
    "sony-a6700"
  ],
  "badgeText": "Best Value V90",
  "badgeColor": "bg-blue-600"
}
```

**Result:** Appears on 16 professional/hybrid pages  
**Expected Revenue Impact:** +$30-75/month  
**Conversion Rate:** 10-20%

---

### Option C: Maximize Reach (AGGRESSIVE)
**Target:** All V90-capable devices (Tier 1 + 2 + 3)

```json
{
  "id": "kingston-canvas-react-sd",
  "enabled": true,
  "displayOn": "all",
  "excludeFrom": [
    "nintendo-switch",
    "nintendo-switch-oled",
    "steam-deck",
    "orange-pi-5",
    "raspberry-pi-5"
  ],
  "badgeText": "Best Value V90",
  "badgeColor": "bg-blue-600"
}
```

**Result:** Appears on 25-30+ pages (all except gaming/SBC)  
**Expected Revenue Impact:** +$50-150/month  
**Conversion Rate:** 3-8% (more casual browsers, lower purchase intent)

---

## My Recommendation: Option B (Balanced)

**Why:**
- ✅ Focuses on users actually researching V90 cards
- ✅ Professional users = higher commission intent
- ✅ Avoids "noise" on lower-tier devices
- ✅ Balances revenue with relevance
- ✅ Can easily expand if conversion rates are good

### Quick Implementation:

```json
{
  "enabled": true,
  "displayPosition": "above-faq",
  "promotedCards": [
    {
      "id": "kingston-canvas-react-sd",
      "enabled": true,
      "displayOn": "list",
      "appliesTo": [
        "bmpcc-4k",
        "bmpcc-6k-pro",
        "canon-eos-r5",
        "nikon-d850",
        "nikon-z8",
        "nikon-z9",
        "sony-a1",
        "sony-a7r-v",
        "panasonic-lumix-s1h",
        "panasonic-lumix-s5-iix",
        "fujifilm-x-t5",
        "dji-phantom-4-pro-v2",
        "dji-air-3s",
        "canon-eos-r6-mark-ii",
        "sony-a6700"
      ],
      "reason": "Higher commission rate + V90 recommendation",
      "badgeText": "Best Value V90",
      "badgeColor": "bg-blue-600"
    }
  ]
}
```

Then rebuild:
```bash
npm run build:all
```

---

## Expected Performance

### Option A (Premium Tier - 11 pages)
- Views/month: 500-800
- Click-through rate: 15-20%
- Clicks/month: 75-160
- Average commission per click: $0.50-1.50
- **Monthly revenue: $40-240**

### Option B (Balanced - 16 pages) ← RECOMMENDED
- Views/month: 1,000-1,500
- Click-through rate: 10-15%
- Clicks/month: 100-225
- Average commission per click: $0.50-1.50
- **Monthly revenue: $50-337**

### Option C (Aggressive - 25-30 pages)
- Views/month: 2,000-3,000
- Click-through rate: 5-10%
- Clicks/month: 100-300
- Average commission per click: $0.50-1.50
- **Monthly revenue: $50-450**

---

## A/B Testing Strategy

### Phase 1: Test with Option B (2 weeks)
Monitor which pages get the most clicks to the Kingston card.

### Phase 2: Expand to Phase C if Good (2 weeks)
If CTR > 10%, expand to more pages.

### Phase 3: Optimize (Ongoing)
- Track conversion rates per device type
- Double down on high performers
- Remove from low performers

---

## Checklist

- [ ] Decide on Option A, B, or C
- [ ] Update `data/promoted-cards.json`
- [ ] Run `npm run build:all`
- [ ] Test Kingston appears on correct pages
- [ ] Monitor Amazon affiliate dashboard for clicks
- [ ] Track sales/commission for 2 weeks
- [ ] Adjust based on results

---

**Final Recommendation:** Go with **Option B (Balanced)** - 16 professional/hybrid device pages. Best balance between relevance and reach.

**Next Step:** Update `promoted-cards.json` with the appliesTo list and rebuild.
