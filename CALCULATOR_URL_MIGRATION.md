# Calculator URL Migration Reference

**Migration Date:** November 17, 2025
**Reason:** SEO optimization + improved URL structure with `/tools/calculators/` base path

## Old → New URL Mappings

All calculator pages are moving from flat `/tools/` structure to organized `/tools/calculators/` structure.

### Phase 0 (Active Pages - Require Redirects)

| Old URL | New URL | Status |
|---------|---------|--------|
| `/tools/video-storage-calculator/` | `/tools/calculators/video-storage/` | ✅ Live, redirect needed |
| `/tools/photo-storage-calculator/` | `/tools/calculators/photo-storage/` | ✅ Live, redirect needed |

### Phase 1 (Planned Pages - No Migration)

| Page | New URL | Status |
|------|---------|--------|
| Drone Recording Time | `/tools/calculators/drone-recording-time/` | 🟡 Not yet built |
| GoPro Recording Time | `/tools/calculators/gopro-recording-time/` | 🟡 Not yet built |
| Dashcam Recording Time | `/tools/calculators/dashcam-recording-time/` | 🟡 Not yet built |
| Action Camera Recording Time | `/tools/calculators/action-camera-recording-time/` | 🟡 Not yet built |
| Security Camera Recording Time | `/tools/calculators/security-camera-recording-time/` | 🟡 Not yet built |
| Timelapse Storage | `/tools/calculators/timelapse-storage/` | 🟡 Not yet built |

---

## Redirect Implementation

### In `.htaccess` (Apache)

```apache
# Calculator URL Migration (2025-11-17)
# Permanent 301 redirects for SEO preservation

# Phase 0 - Video Storage
RedirectMatch 301 ^/tools/video-storage-calculator/?$ /tools/calculators/video-storage/

# Phase 0 - Photo Storage
RedirectMatch 301 ^/tools/photo-storage-calculator/?$ /tools/calculators/photo-storage/
```

### In `vercel.json` (Vercel)

```json
{
  "redirects": [
    {
      "source": "/tools/video-storage-calculator",
      "destination": "/tools/calculators/video-storage",
      "permanent": true
    },
    {
      "source": "/tools/photo-storage-calculator",
      "destination": "/tools/calculators/photo-storage",
      "permanent": true
    }
  ]
}
```

---

## Pages Updated

### Source Files (`src/templates/calculator/`)
- ✅ `video-storage-calculator.html` — URL updated to `/tools/calculators/video-storage/`
- ✅ `photo-storage-calculator.html` — URL updated to `/tools/calculators/photo-storage/`
- ✅ Internal links updated in both pages (cross-calculator references)
- ✅ Schema markup (JSON-LD) URLs updated
- ✅ Breadcrumb URLs updated

### Documentation Files
- ✅ `STORAGE_CALCULATOR_PRODUCT_SPEC.md` — All Phase 0 & Phase 1 URLs updated

---

## SEO Considerations

**301 Redirects:**
- All old URLs use permanent (301) redirects
- Preserves PageRank and indexing signals
- Google will consolidate authority to new URLs

**Internal Links:**
- Updated all cross-calculator links in existing pages
- Phase 1 pages will use new URLs natively (no migration needed)

**Google Search Console:**
- Monitor old URLs in GSC to confirm redirect indexing
- Update XML sitemap to reflect new URLs
- Resubmit sitemap to Google

---

## Deployment Checklist

- [ ] Update `.htaccess` or `vercel.json` with redirects
- [ ] Deploy code changes (updated HTML files)
- [ ] Test old URLs redirect correctly (manual verification)
- [ ] Update XML sitemap at `/sitemap.xml`
- [ ] Submit updated sitemap to Google Search Console
- [ ] Update GA4 tracking (if any hardcoded URLs in analytics)
- [ ] Verify in Google Search Console that old URLs are indexing properly (1–2 weeks)
- [ ] Monitor organic traffic for any drops during transition period

---

## Questions

**Q: Why not use a mass rewrite?**
A: 301 redirects preserve SEO value. Rewriting would confuse Google's crawlers.

**Q: When should we remove old redirects?**
A: Keep indefinitely. They cost nothing and prevent 404 errors if old URLs are shared or linked externally.

**Q: Will this affect our current rankings?**
A: No. Proper 301 redirects transfer ranking signals. Some fluctuation is normal (2–4 weeks), but rankings should stabilize.
