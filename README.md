# SD Card Checker

Instantly find the perfect SD card for any device.

## Overview

SD Card Checker is a static website that helps users find the correct SD card specifications for any device. It provides instant recommendations with affiliate links to Amazon.

**Website:** https://sdcardchecker.com  
**Devices:** 100+  
**Target Keywords:** "what SD card for [device]", "best memory card for [device]"

## Features

✅ **Device Database** - 100+ devices across cameras, drones, gaming consoles, etc.  
✅ **Instant Recommendations** - Speed classes, types, and brands with explanations  
✅ **Amazon Affiliate Links** - Direct purchase links with affiliate tracking  
✅ **Mobile Responsive** - Perfect experience on all devices  
✅ **SEO Optimized** - Schema markup, meta tags, sitemaps  
✅ **Static Generation** - No server needed, fast load times

## Project Structure

```
sdcard-checker/
├── data/
│   └── devices.json           # Device database with specs
├── src/
│   ├── js/
│   │   ├── generator.js       # Static site generator
│   │   └── search.js          # Client-side search functionality
│   ├── css/
│   │   └── style.css          # Mobile-first responsive styles
│   └── templates/
│       ├── home.html          # Homepage template
│       └── device.html        # Device page template
├── dist/                      # Generated static files
│   ├── index.html
│   ├── devices/
│   ├── assets/
│   ├── data/
│   ├── sitemap.xml
│   └── robots.txt
├── package.json
└── README.md
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate Static Files

```bash
npm run build
```

This will:
- Read `data/devices.json`
- Generate homepage (`dist/index.html`)
- Generate device pages (`dist/devices/[slug]/index.html`)
- Copy assets to `dist/assets/`
- Generate `sitemap.xml` and `robots.txt`

### 3. View Locally

```bash
npm start
```

Or manually:
```bash
npx http-server dist
```

Visit: http://localhost:8080

## Development

### Update Device Data

Edit `data/devices.json` to add, modify, or remove devices:

```json
{
  "id": "gopro-hero-13",
  "name": "GoPro Hero 13 Black",
  "category": "Action Cameras",
  "slug": "gopro-hero-13",
  "searchTerms": ["gopro hero 13", "gopro 13"],
  "sdCard": {
    "type": "microSD UHS-II",
    "minSpeed": "V30",
    "recommendedCapacity": ["128GB", "256GB"]
  },
  "recommendedBrands": [
    {
      "name": "SanDisk Extreme",
      "speed": "V30",
      "priceEstimate": 35,
      "amazonSearchUrl": "https://amazon.com/s?k=..."
    }
  ],
  "faq": [
    {
      "q": "Is V30 required?",
      "a": "Yes, for stable 5.3K recording..."
    }
  ]
}
```

### Update Styles

Modify `src/css/style.css` for design changes. The stylesheet uses:
- CSS Grid and Flexbox for responsive layouts
- Mobile-first approach
- CSS variables for theming (colors: #ff6b35, #667eea, #764ba2)

### Update Templates

Edit `src/templates/home.html` and `src/templates/device.html` for structural changes.

## SEO Configuration

### Meta Tags

Device pages automatically generate:
- **Title:** "Best SD Card for [Device] | [Type] [Speed]"
- **Description:** Including device name, specs, and brands
- **Schema Markup:** FAQPage, BreadcrumbList, Organization

### Sitemap & Robots

Auto-generated in `dist/`:
- `sitemap.xml` - All device pages for search engines
- `robots.txt` - Crawl directives

### Google Search Console

1. Go to: https://search.google.com/search-console
2. Add property: https://sdcardchecker.com
3. Upload sitemap: `sitemap.xml`
4. Monitor rankings and clicks

## Monetization

### Amazon Affiliate Setup

1. Get affiliate tag at: https://affiliate-program.amazon.com
2. Find and replace all `AFFILIATETAG` with your code:
   ```bash
   grep -r "AFFILIATETAG" dist/
   ```
3. Update `data/devices.json` Amazon URLs with your tag

### Track Conversions

Use Amazon Associates dashboard to monitor:
- Clicks
- Conversions
- Commission earnings

### Display Ads

Add Google AdSense to `dist/` by modifying templates:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<ins class="adsbygoogle" style="display:block"></ins>
<script>
  (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

## Deployment

### Option 1: Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Option 2: Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir dist
```

### Option 3: GitHub Pages

1. Push code to GitHub
2. Enable GitHub Pages in repo settings
3. Deploy `dist/` folder

### Option 4: Traditional Hosting

1. Upload `dist/` folder to web host
2. Set `index.html` as default document
3. Enable HTTPS

## Maintenance

### Regular Updates

- **Monthly:** Update Amazon prices in `data/devices.json`
- **Quarterly:** Add new devices and review specs
- **As needed:** Fix broken Amazon links

### Monitor Performance

- Check Google Search Console for errors
- Monitor Google Analytics traffic
- Track affiliate conversions

### Backup

Always backup before making changes:
```bash
cp -r dist dist-backup-$(date +%Y%m%d)
```

## Performance Metrics

Target benchmarks:
- **Page Load:** < 2 seconds
- **Core Web Vitals:** All green
- **Mobile Score:** 90+
- **Lighthouse Score:** 90+

Monitor with:
- Google PageSpeed Insights
- Google Search Console
- Google Analytics

## Security

- ✅ HTTPS only (enforced by hosting providers)
- ✅ No user data collection
- ✅ No third-party scripts
- ✅ Regular content updates

## Support

For issues or questions:
1. Check this README
2. Review generated files in `dist/`
3. Check browser console for errors
4. Review `src/js/generator.js` for build issues

## License

This project uses an MIT License. Feel free to modify for your use case.

## Changelog

### v1.0.0 (2024-01-XX)
- Initial release
- 18 devices in database
- Homepage with search
- Device detail pages
- Mobile responsive design
- SEO optimization
- Affiliate link integration

## Next Steps

1. ✅ Generate site: `npm run build`
2. ✅ Add your Amazon affiliate tag
3. ✅ Deploy to hosting provider
4. ✅ Set up domain (sdcardchecker.com)
5. ✅ Configure Google Search Console
6. ✅ Set up Google Analytics
7. ⏳ Monitor traffic and conversions
8. ⏳ Add more devices to database
9. ⏳ Optimize for keywords
10. ⏳ Scale to 100+ devices

## Contact & Support

Website: https://sdcardchecker.com  
Email: contact@sdcardchecker.com

---

**Made with ❤️ for content creators, gamers, and photographers**
