# Amazon PAAPI Integration - Quick Reference Card
**SDCardChecker Build-Time Implementation**

---

## 🎯 Architecture at a Glance

```
Your Repo Push
    ↓
Cloudflare Pages Detects Change
    ↓
npm run build (triggers)
    ↓
  prebuild: scripts/build-amazon-data.js
  ├─ Calls Amazon API (5 products)
  ├─ Caches JSON to data/amazon-cache/
  └─ Takes ~30 seconds
    ↓
  build: src/js/generator.js
  ├─ Reads cached JSON
  ├─ Embeds badges in HTML
  └─ Generates 150+ device pages
    ↓
Deploy to Cloudflare
    ↓
✅ Static site with product badges, no runtime API calls
```

---

## 📋 Setup Checklist (2 Days)

### Prerequisites: Credentials Already Set
- [ ] Follow your original PAAPI guide for credential setup
- [ ] Verify these 3 env vars are in Cloudflare Pages → Settings → Environment Variables (Production):
  ```
  AMAZON_ACCESS_KEY=...
  AMAZON_SECRET_KEY=...
  AMAZON_TAG=...
  ```

### Day 2: Code
- [ ] Create `src/utils/amazon-api.js` (API calls + rate limiting)
- [ ] Create `scripts/build-amazon-data.js` (build-time script)
- [ ] Create `src/utils/amazon-helpers.js` (HTML generation)
- [ ] Update `package.json` with prebuild script:
  ```json
  "prebuild": "node scripts/build-amazon-data.js"
  ```
- [ ] Update `src/js/generator.js` to embed badges

### Day 3: Deploy
- [ ] Cloudflare Pages settings: Build command = `npm run build`
- [ ] Trigger build in Cloudflare
- [ ] Verify badges appear on device pages
- [ ] Spot-check prices/ratings are correct

---

## 🔧 File Locations

```
SDCardChecker/
├── src/
│   ├── utils/
│   │   ├── amazon-api.js (NEW - API calls)
│   │   └── amazon-helpers.js (NEW - HTML generation)
│   └── js/
│       └── generator.js (MODIFIED - embed badges)
├── scripts/
│   └── build-amazon-data.js (NEW - build-time script)
├── data/
│   └── amazon-cache/ (NEW - created at build time)
│       ├── kingston-canvas-go.json
│       ├── sandisk-extreme.json
│       ├── samsung-evo-plus.json
│       ├── prograde-digital.json
│       └── sabrent-rocket.json
├── package.json (MODIFIED - add prebuild)
└── .env (LOCAL ONLY - for testing, in .gitignore)
```

---

## 🚀 How to Run

### Local Testing
```bash
# Create .env with credentials
AMAZON_ACCESS_KEY=your_key
AMAZON_SECRET_KEY=your_secret
AMAZON_TAG=yourname-20

# Run build
npm run build

# Check results
ls data/amazon-cache/
cat data/amazon-cache/kingston-canvas-go.json
```

### Cloudflare Pages
```
Just push to repo → Cloudflare auto-detects → builds with prebuild script
```

### Manual Rebuild
```
Cloudflare Pages → Project → Deploy button → Trigger Build
```

---

## 🎯 Expected Results

**Device Page Before:**
```
Kingston Canvas Go 128GB
V90 | 200 MB/s write speed
$28.99 [Check Price on Amazon]
```

**Device Page After:**
```
Kingston Canvas Go 128GB
V90 | 200 MB/s write speed
⭐ 4.7 (12,450 reviews) | Live: $18.99 | In Stock
$28.99 [Check Price on Amazon]
```

The badge (⭐ 4.7 | $18.99 | In Stock) comes from Amazon API, cached at build time.

---

## ⚙️ Customization

### Add More Products
Edit `scripts/build-amazon-data.js`:
```javascript
const searches = [
  { filename: 'kingston-canvas-go.json', keyword: 'Kingston Canvas Go Plus 128GB microSD' },
  { filename: 'new-product.json', keyword: 'New Product Name' },  // ← Add here
];
```

### Change Search Terms
```javascript
keyword: 'Kingston Canvas Go Plus 128GB microSD'
//                                    ↑
//                              Make more specific
```

### Adjust Rate Limiting
In `src/utils/amazon-api.js`:
```javascript
const REQUEST_DELAY_MS = 2500;  // milliseconds between API calls
// If getting "429 Too Many Requests" errors → increase to 3000-5000
```

---

## 🐛 Troubleshooting

| Issue | Quick Fix |
|-------|-----------|
| Build fails: "credentials missing" | Add env vars to Cloudflare Settings → Env Vars |
| Build passes but no badges | Check that `data/amazon-cache/` JSON files exist |
| "429 Too Many Requests" error | Increase REQUEST_DELAY_MS to 3500 |
| "400 Bad Request" error | Make search keywords more specific |
| Old prices showing | Trigger new build in Cloudflare |
| Badges don't appear on site | Verify generator.js updated to load cache |

---

## 📊 Monitoring

### Check API Usage (Monthly)
1. Log in to associates.amazon.com
2. Account Settings → API Access → Request Statistics
3. Watch for high error rates (>2%)

### Check Cache Files
1. Visit Cloudflare Pages → Your Project → Files
2. Navigate to `data/amazon-cache/`
3. JSON files should be present and non-empty

### Check Device Pages
1. Visit https://sdcardchecker.com/devices/steam-deck/
2. Scroll to product recommendations
3. Look for badges with ratings/prices

---

## 🔐 Security Notes

✅ Credentials stored in Cloudflare env vars (encrypted)  
✅ Never commit `.env` to git  
✅ All API calls happen server-side during build  
✅ No credentials exposed to client/browser  
✅ Affiliate links use `rel="nofollow"`  

---

## 📈 Performance Impact

- Build time: +30 seconds (one-time, during deployment)
- Page load time: 0ms overhead (all data embedded in HTML)
- SEO: Improved (all content in initial HTML for crawlers)
- Visitor experience: Instant badges (no loading spinners)

---

## 📞 Support Resources

- Amazon PAAPI Docs: https://webservices.amazon.com/paapi5/documentation/
- amazon-paapi npm: https://www.npmjs.com/package/amazon-paapi
- Cloudflare Pages Build: https://developers.cloudflare.com/pages/
- Your Full Guide: See `AMAZON_API_BUILD_TIME_INTEGRATION.md`

---

## ✅ Success Criteria

After full setup, you should see:
- ✅ Device pages load instantly (no API calls at runtime)
- ✅ Product badges show: ⭐ Rating | Price | Availability
- ✅ Prices update once per build (e.g., monthly)
- ✅ No JavaScript errors in browser console
- ✅ Pagespeed score unchanged or improved
- ✅ All content visible to search engines (SEO safe)

---

**Next Step:** Read `AMAZON_API_BUILD_TIME_INTEGRATION.md` for full implementation guide.
