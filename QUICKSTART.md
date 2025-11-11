# SD Card Checker - Quick Start Guide

Get your SD Card Checker website running in 5 minutes.

## 1. Install & Build (2 minutes)

```bash
# Navigate to project
cd c:\Users\Pietro\Desktop\SDCardChecker

# Install dependencies
npm install

# Generate static site
npm run build
```

Done! Your site is in the `dist/` folder.

## 2. View Locally (30 seconds)

```bash
npm start
```

Visit: **http://localhost:8080**

## 3. Test Device Pages (1 minute)

Click any device in the dropdown:
- ✅ GoPro Hero 13
- ✅ Nintendo Switch
- ✅ DJI Mini 4 Pro
- ✅ Sony A6700

Each device page should show:
- SD card specs
- Recommended brands table
- Amazon affiliate links
- FAQ section

## 4. Add Your Affiliate Tag (1 minute)

Replace `AFFILIATETAG` with your Amazon Associates tag:

**In `data/devices.json`, update URLs from:**
```
?tag=AFFILIATETAG
```

**To:**
```
?tag=YOUR-ASSOCIATE-TAG-20
```

Then regenerate:
```bash
npm run build
```

## 5. Deploy to Web (1 minute)

### Option A: Vercel (Easiest - Free)

```bash
npm install -g vercel
vercel
```

Follow prompts, select `dist` folder. Done!

### Option B: Netlify (Also Easy - Free)

```bash
npm install -g netlify-cli
netlify deploy --prod --dir dist
```

### Option C: Your Own Domain

Use CNAME record pointing to your deployment URL.

## What You Get

✅ **14 Pre-loaded Devices:**
- 3 Action Cameras (GoPro Hero 13/12/Max)
- 4 Drones (DJI Mini/Air/Mavic)
- 3 Gaming Consoles (Switch, Switch OLED, Steam Deck)
- 4 Cameras (Canon, Sony, Fujifilm, Nikon)

✅ **Fully Functional:**
- Device search/filtering
- Mobile responsive
- Amazon affiliate links
- SEO optimized
- FAQ accordions
- Related devices

✅ **Ready for Growth:**
- Add more devices to `data/devices.json`
- Regenerate with `npm run build`
- Deploy updated site

## File Structure

```
dist/                           # Generated static site
├── index.html                  # Homepage
├── devices/
│   ├── gopro-hero-13/index.html
│   ├── nintendo-switch/index.html
│   └── ... (14 device pages)
├── assets/
│   ├── css/style.css          # Responsive styling
│   └── js/search.js           # Client-side search
├── data/devices.json          # Device database
├── sitemap.xml                # SEO sitemap
└── robots.txt                 # Search engine instructions
```

## Key Files to Edit

| File | Purpose | When |
|------|---------|------|
| `data/devices.json` | Device database | Add/update devices |
| `src/css/style.css` | Styling | Change colors/layout |
| `src/templates/home.html` | Homepage | Modify structure |
| `src/templates/device.html` | Device pages | Change layout |

## Common Tasks

### Add a Device

Edit `data/devices.json`:

```json
{
  "id": "gopro-hero-11",
  "name": "GoPro Hero 11 Black",
  "category": "Action Cameras",
  "slug": "gopro-hero-11",
  "searchTerms": ["gopro hero 11", "hero 11"],
  "sdCard": {
    "type": "microSD UHS-II",
    "minSpeed": "V30",
    "minWriteSpeed": "30 MB/s",
    "recommendedCapacity": ["128GB", "256GB"]
  },
  "whySpecs": "Shoots 5.3K video at high frame rates...",
  "recommendedBrands": [
    {
      "name": "SanDisk Extreme",
      "speed": "V30",
      "writeSpeed": "90 MB/s",
      "priceEstimate": 35,
      "amazonSearchUrl": "https://amazon.com/s?k=...",
      "pros": "Fast, reliable",
      "cons": "Mid-price",
      "tier": "recommended"
    }
  ],
  "faq": [
    {
      "q": "Is V30 required?",
      "a": "Yes, for 5.3K recording..."
    }
  ]
}
```

Then regenerate:
```bash
npm run build
```

### Change Colors

Edit `src/css/style.css`:

```css
/* Primary brand color */
.btn-primary {
  background: #ff6b35; /* ← Change this */
}

.answer-box {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); /* ← Or this */
}
```

### Modify Homepage

Edit `src/templates/home.html` to change:
- Hero section text
- Hero section colors
- Popular devices list
- FAQ questions

## Performance Checklist

After launching, verify:

- [ ] Site loads in < 2 seconds
- [ ] All device pages accessible
- [ ] Search functionality works
- [ ] Amazon links have affiliate tag
- [ ] Mobile looks good
- [ ] HTTPS enabled

## SEO Checklist

- [ ] Sitemap submitted to Google Search Console
- [ ] Google Analytics tracking installed
- [ ] Meta tags look good on device pages
- [ ] Page titles under 60 characters
- [ ] Descriptions under 160 characters

## Next Steps

1. **Customize:** Update colors, text, domain in files
2. **Add Devices:** Expand `data/devices.json` with more devices
3. **Deploy:** Push to production with Vercel/Netlify
4. **Monitor:** Set up Google Analytics and Search Console
5. **Grow:** Build backlinks from tech blogs, Reddit, YouTube

## Support Resources

| Resource | Link |
|----------|------|
| Full README | `README.md` |
| Deployment Guide | `DEPLOYMENT.md` |
| Generator Docs | `src/js/generator.js` (commented) |
| PRD | Original requirements document |

## Example Device Entry (Complete)

```json
{
  "id": "fujifilm-x-s20",
  "name": "Fujifilm X-S20",
  "category": "Mirrorless Cameras",
  "slug": "fujifilm-x-s20",
  "searchTerms": ["fujifilm x-s20", "x-s20", "xs20 sd card"],
  "imageUrl": "/assets/images/devices/fujifilm-x-s20.jpg",
  "sdCard": {
    "type": "SD UHS-II",
    "minSpeed": "V30",
    "minWriteSpeed": "30 MB/s",
    "recommendedCapacity": ["128GB", "256GB"],
    "maxCapacity": "512GB"
  },
  "whySpecs": "Great for travel and video. V30 handles 4K recording reliably. Single card slot, so reliability is key.",
  "recommendedBrands": [
    {
      "name": "SanDisk Extreme Pro SD UHS-II",
      "speed": "V30",
      "writeSpeed": "70 MB/s",
      "priceEstimate": 45,
      "amazonSearchUrl": "https://amazon.com/s?k=SanDisk+Extreme+PRO+SD+UHS-II&tag=AFFILIATETAG",
      "pros": "Fast, reliable, professional grade",
      "cons": "Premium price",
      "tier": "recommended"
    },
    {
      "name": "Kingston Canvas Go!",
      "speed": "V30",
      "writeSpeed": "60 MB/s",
      "priceEstimate": 35,
      "amazonSearchUrl": "https://amazon.com/s?k=Kingston+Canvas+Go+SD&tag=AFFILIATETAG",
      "pros": "Good value, reliable",
      "cons": "Less common for Fujifilm",
      "tier": "budget"
    }
  ],
  "faq": [
    {
      "q": "Does X-S20 really need V30?",
      "a": "Yes for 4K video. Still photos work with slower cards but V30 recommended."
    },
    {
      "q": "Is there a backup card slot?",
      "a": "No, single SD card slot. Make backup copies regularly."
    }
  ],
  "relatedDevices": ["fujifilm-x-s10"],
  "notes": "Popular travel camera. Single card slot makes reliable card choice important."
}
```

## That's It!

You now have a fully functional SD Card Checker website. 

**Next:** Deploy to Vercel/Netlify with one command!

---

**Questions?** Check `README.md` for full documentation.
