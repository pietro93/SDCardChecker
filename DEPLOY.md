# 🚀 Deployment Guide - Japan Localization

**Status:** Ready to Deploy  
**Build Date:** December 24, 2025

---

## Quick Deploy (3 Steps)

### 1️⃣ Build the Site
```bash
npm run build:all
```

✅ This will:
- Build Tailwind CSS
- Generate English site (139 pages)
- Generate Japanese site (/ja/ - 140+ pages)
- Create all guides, calculators, readers pages
- Generate sitemaps & robots.txt

**Expected Output:**
```
✅ English site ready at dist/
🇯🇵 Japanese site ready at dist/ja/
📁 Total pages: 400+
```

---

### 2️⃣ Push to GitHub
```bash
git add .
git commit -m "feat: Japan localization complete - production ready"
git push origin main
```

---

### 3️⃣ Deploy to Vercel
**Option A: Auto-deploy (Recommended)**
- Push to GitHub → Vercel auto-deploys based on your settings

**Option B: Manual Deploy**
```bash
vercel --prod
```

**Expected Result:**
- English site: `https://sdcardchecker.com/`
- Japanese site: `https://sdcardchecker.com/ja/`

---

## Verify Deployment

### Check English Site
- [ ] Homepage loads: https://sdcardchecker.com/
- [ ] Guides page: https://sdcardchecker.com/guides/
- [ ] Nintendo Switch guide: https://sdcardchecker.com/guides/nintendo-switch-sd-card-guide/

### Check Japanese Site
- [ ] Homepage loads: https://sdcardchecker.com/ja/
- [ ] Speed Classes guide: https://sdcardchecker.com/ja/guides/sd-card-speed-classes/
- [ ] Fake Card guide: https://sdcardchecker.com/ja/guides/is-my-sd-card-fake/
- [ ] Nintendo Switch guide: https://sdcardchecker.com/ja/guides/nintendo-switch-sd-card-guide/

### Check Legal Pages
- [ ] Terms: https://sdcardchecker.com/terms.html
- [ ] Japanese Terms: https://sdcardchecker.com/ja/terms.html
- [ ] Privacy: https://sdcardchecker.com/privacy.html
- [ ] About: https://sdcardchecker.com/about.html

---

## Post-Deployment: Google Search Console

### Add Japanese Property
1. Go to https://search.google.com/search-console/
2. Add property: `https://sdcardchecker.com/ja/`
3. Verify ownership (use DNS/HTML file method)
4. Set target country to **Japan**
5. Set preferred language to **Japanese**

### Submit Sitemaps
1. **English sitemap:** https://sdcardchecker.com/sitemap.xml
2. **Japanese sitemap:** https://sdcardchecker.com/ja/sitemap.xml

### Monitor Performance
- Check "Coverage" tab for any crawl errors
- Watch "Performance" for Japanese keyword rankings
- Monitor "Core Web Vitals"

---

## Build Output Summary

```
✅ English Site
  • Device Pages: 139
  • Category Pages: 8
  • Guide Pages: 11
  • Calculator Pages: 8
  • Reader Pages: 21 + 4 guides
  • Core Files: 10

✅ Japanese Site
  • Device Pages: 140
  • Category Pages: 9
  • Guide Pages: 3
  • Home Page: 1
  • Category Index: 1
  • Core Files: Generated

📊 Total Pages Built: 400+
⏱️ Build Time: ~2 minutes
📁 Output Size: 50-60MB
```

---

## Troubleshooting

### Issue: Japanese pages not showing
**Solution:** Check that vercel.json has output directory set to `dist/`

### Issue: Language switcher not working
**Solution:** Ensure components-ja.js is properly imported in build

### Issue: Images not loading on /ja/ pages
**Solution:** Images are referenced as `/img/...` - ensure assets were copied

### Issue: Sitemap errors
**Solution:** Check that sitemap includes both `/` and `/ja/` URLs

---

## Performance Checklist

Before going live, verify:

- [ ] All pages load in <2 seconds
- [ ] Images are properly compressed
- [ ] CSS is minified
- [ ] JavaScript is optimized
- [ ] Meta tags are correct
- [ ] Canonical URLs are set
- [ ] Hreflang tags point to correct language versions
- [ ] Mobile responsive on all pages
- [ ] Forms work correctly
- [ ] Analytics tracking is active

---

## Local Testing

To test before deploying:

```bash
# Build everything
npm run build:all

# Start local server
npm start

# Then visit:
# English: http://localhost:8080/
# Japanese: http://localhost:8080/ja/
```

---

## Rollback Plan

If something goes wrong:

```bash
# Revert last commit
git revert HEAD
git push origin main

# Vercel will automatically redeploy previous version
```

---

## Success Indicators

After 24 hours, check:

1. **Google Search Console**
   - Japanese pages indexed
   - No crawl errors
   - Sitemap accepted

2. **Analytics**
   - /ja/ traffic visible
   - Users viewing Japanese pages
   - Language-specific metrics

3. **Search Rankings**
   - Japanese keywords appearing in SERP
   - Position #1-5 for target keywords

---

## Contact & Support

If you need help:
- Check JAPAN_DEPLOYMENT_READY.md for detailed info
- Review JAPAN_LOCALIZATION_KANBAN.md for progress
- Check GitHub issues for any problems

---

**Status:** ✅ Ready to Deploy  
**Last Updated:** Dec 24, 2025  
**Estimated Time to Launch:** <15 minutes
