# Kingston Canvas React Plus SD - Promotion Deployment

**Date:** December 25, 2025  
**Status:** ✅ IMPLEMENTATION COMPLETE - Ready to Build & Deploy

---

## What Was Implemented

### 1. ✅ Configuration File Updated
**File:** `data/promoted-cards.json`

Set to Option B (Balanced) strategy targeting 16 professional/hybrid device pages:
- Cinema Cameras: BMPCC 4K, BMPCC 6K Pro
- Professional Mirrorless: Canon EOS R5, Nikon D850/Z8/Z9, Sony A1/A7R V
- Pro Hybrid: Panasonic S1H/S5 IIx, Fujifilm X-T5
- Professional Video: DJI Phantom 4 Pro V2, DJI Air 3S
- Hybrid Mirrorless: Canon EOS R6 Mark II, Sony A6700

### 2. ✅ Promotion Generator Created
**File:** `scripts/generator/promotion-generator.js`

Generates beautiful promotional sections with:
- Product image
- Name + custom badge
- Speed class & specs
- Product description (pros)
- Amazon link with affiliate tag
- UTM tracking for analytics

### 3. ✅ Device Page Generator Updated
**File:** `scripts/generator/generate-device-pages.js`

- Imported promotion generator
- Generate promotion section for each device
- Replace {{PROMOTED_CARDS_SECTION}} placeholder

### 4. ✅ Templates Updated
**Files:** 
- `src/templates/device.html`
- `src/templates/device-ja.html`

Added placeholder:
```html
<!-- Promoted Cards Section -->
{{PROMOTED_CARDS_SECTION}}
```

---

## Build & Deploy Steps

### Step 1: Rebuild Site

```bash
npm run build:all
```

Expected output:
```
✓ Building US English site...
✓ Building Japanese site...
✓ Generated X device pages with promoted cards
```

### Step 2: Test Locally

```bash
# Start local server
npm start

# Or if using a different dev server:
npx http-server dist
```

### Step 3: Verify on Test Pages

Visit these 3 test pages to verify promotion appears:

**Test Page 1: Cinema Camera (MUST HAVE PROMOTION)**
```
http://localhost:3000/categories/cinema-cameras/blackmagic-pocket-cinema-4k/
```
Should show:
- Kingston Canvas React Plus SD promotion
- Between recommendations table and FAQ
- "Best Value V90" badge
- Amazon link with affiliate tag

**Test Page 2: Professional Mirrorless (MUST HAVE PROMOTION)**
```
http://localhost:3000/categories/cameras/canon-eos-r5/
```
Should show:
- Kingston Canvas React Plus SD promotion
- Same styling as Test Page 1

**Test Page 3: Gaming Device (SHOULD NOT HAVE PROMOTION)**
```
http://localhost:3000/categories/gaming-handhelds/nintendo-switch/
```
Should NOT show Kingston promotion (not in appliesTo list)

### Step 4: Check Desktop & Mobile

- [ ] Desktop: Chrome, Firefox, Safari
- [ ] Mobile: iOS Safari, Android Chrome
- [ ] Check styling not broken
- [ ] Check Amazon link works
- [ ] Check badge displays correctly

### Step 5: Deploy to Production

Deploy your dist/ folder to your hosting:

**If using Vercel:**
```bash
vercel deploy --prod
```

**If using Cloudflare Pages:**
```bash
# Push to git, Cloudflare auto-deploys
git add .
git commit -m "Enable Kingston Canvas React Plus SD promotion on 16 device pages"
git push
```

**Other hosting:**
```bash
# Upload dist/ folder to your server
sftp/ftp upload dist/
```

---

## Monitoring & Optimization

### Week 1: Monitor Performance

Check Amazon affiliate dashboard for:
- **UTM Medium:** `promotion`
- **Traffic:** Clicks from promoted card links
- **Conversions:** Sales of Kingston Canvas React Plus SD

### Metrics to Track

```
Kingston Canvas React Plus SD Performance:
├─ Impressions (device page views)
├─ Clicks (promotion section clicks)
├─ Click-through rate (clicks ÷ impressions)
├─ Conversions (purchases)
└─ Commission earnings
```

### Expected Results (Option B)

- **Views/month:** 1,000-1,500
- **Click-through rate:** 10-15%
- **Clicks/month:** 100-225
- **Average commission:** $0.50-1.50/click
- **Monthly revenue:** $50-337

### If Performance Is Good (CTR > 10%)

Expand to Option C (all devices) in Week 2:

**File:** `data/promoted-cards.json`

Change from:
```json
"displayOn": "list",
"appliesTo": [... 16 devices ...]
```

To:
```json
"displayOn": "all",
"excludeFrom": ["nintendo-switch", "nintendo-switch-oled", "steam-deck"]
```

Then rebuild and redeploy.

### If Performance Is Low (CTR < 5%)

Adjust strategy:
1. Try different badge text
2. Adjust badge color
3. Try different promoted card (Option C: promote SanDisk instead)
4. Or exclude low-performing device categories

---

## Rollback Plan

If something breaks:

### Disable Promotion Instantly

**File:** `data/promoted-cards.json`

Change:
```json
"enabled": false
```

Rebuild:
```bash
npm run build:all
```

No promotions will appear. This takes ~2 minutes without code changes.

### Full Rollback

If you need to undo code changes:

```bash
git checkout -- scripts/generator/generate-device-pages.js
git checkout -- src/templates/device.html
git checkout -- src/templates/device-ja.html
npm run build:all
```

---

## Files Changed Summary

| File | Changes | Type |
|------|---------|------|
| `data/promoted-cards.json` | Configuration (Option B) | Config |
| `scripts/generator/promotion-generator.js` | NEW FILE | Code |
| `scripts/generator/generate-device-pages.js` | Import + generation call + replacement | Code |
| `src/templates/device.html` | Added placeholder | Template |
| `src/templates/device-ja.html` | Added placeholder | Template |
| `src/templates/components-ja.js` | REMOVED: SD card reader notice | Code |
| `data/sdcards.json` | Added amazonDirectUrl field | Data |

---

## Checklist

- [ ] Run `npm run build:all` without errors
- [ ] Test on 3 sample pages (cinema, professional, gaming)
- [ ] Verify promotion appears on cinema & professional pages
- [ ] Verify promotion does NOT appear on gaming pages
- [ ] Check desktop styling
- [ ] Check mobile styling
- [ ] Test Amazon links work
- [ ] Deploy to production
- [ ] Verify live site shows promotions
- [ ] Monitor affiliate dashboard for clicks
- [ ] Set reminder to review performance in 1 week

---

## Next Steps After Deployment

### Day 1-2: Monitor
- Check console for any errors
- Verify metrics are recording
- Test on various browsers/devices

### Week 1: Analyze
- Check UTM data in affiliate dashboard
- Calculate CTR (clicks ÷ impressions)
- Note which device pages get most clicks

### Week 2: Optimize
- If CTR > 10%: Expand to more devices (Option C)
- If CTR < 5%: Adjust badge text, color, or try different card
- If CTR 5-10%: Keep current, monitor next week

### Month 1: Assess
- Calculate total revenue from promotion
- Compare to non-promoted card links
- Plan next promotion (SanDisk? Sony?)

---

**Status:** ✅ Ready to Build & Deploy  
**Time to Build:** ~2 minutes  
**Time to Deploy:** 5-30 minutes (depending on hosting)  
**Expected Revenue Impact:** +$50-337/month
