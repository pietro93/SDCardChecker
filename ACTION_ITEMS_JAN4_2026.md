# Action Items - January 4, 2026

## Single Priority: Fix Mobile Layout on Gaming Pages

### The Problem
- **Anbernic RG35XX:** 291 impressions, 0 clicks (should be 1%+ CTR)
- **Steam Deck:** 124 impressions, 0 clicks (should be 0.5%+ CTR)
- **Comparison:** Miyoo Mini Plus has 267 impr, 7 clicks (2.62% CTR) with same gaming audience

### Why It's Happening
Mobile CTR is 1.41% (5.6× desktop). This means the mobile experience is critical.
**Likely issue:** Hero image is too tall on mobile, pushing recommendation below the fold.

### What to Check
1. Open Anbernic RG35XX page on mobile device / responsive view
2. How many pixels/scrolls before the **actual recommendation** is visible?
3. If hero image is >300px, it's burying the answer
4. Compare with Miyoo Mini Plus (high-CTR) page layout

### Fix (If Needed)
In `device.html`:
- Reduce hero image height on mobile (target: 250-300px max)
- Move recommendation box ABOVE hero image on mobile
- Ensure first 200px of viewport shows the answer, not intro text

### Expected Result
- Anbernic: +1-2 clicks/week
- Steam Deck: +1-2 clicks/week
- **Total impact: +4 clicks/week** (208/year)

---

## Secondary: Monitor Japan Pages

**Status:** ✅ Live and ranking (210 impr/week)
- Nintendo Switch guide: 8 impr, 0 clicks
- Monitor for CTR improvement
- No action needed yet (already localized)

---

## Do NOT Do
- ❌ Create speed classes guide (no demand)
- ❌ Fix DJI/Steam Deck titles (answer boxes block them)
- ❌ Create more hero images (7 already exist and are mapped)
- ❌ Full site redesign (too much effort, low ROI)

---

## Timeline
- **Today:** Audit Anbernic & Steam Deck mobile layout (30 mins)
- **This week:** Deploy fix if needed (1-2 hours)
- **Next week:** Check GSC for CTR improvement

---

## Success = +4 clicks/week on 2 pages
Track these in GSC weekly:
- Anbernic RG35XX CTR should go from 0% → 1%+
- Steam Deck CTR should go from 0% → 0.5%+
