# SD Card Checker - Deployment Guide

## Pre-Deployment Checklist

- [ ] Replace all `AFFILIATETAG` with your Amazon Associate tag
- [ ] Update domain name in templates (currently: https://sdcardchecker.com)
- [ ] Test site locally with `npm start`
- [ ] Verify all device pages load correctly
- [ ] Check Amazon affiliate links work
- [ ] Review SEO metadata on a few pages

## Replace Affiliate Tag

Your Amazon affiliate tag must be added to the Amazon URLs. The placeholder is `AFFILIATETAG`.

### Quick Find & Replace

Search for `AFFILIATETAG` in all files:

```bash
# View all instances
grep -r "AFFILIATETAG" dist/

# Count occurrences
grep -r "AFFILIATETAG" dist/ | wc -l
```

### Manual Replacement

1. Get your Amazon Associates tag from: https://affiliate-program.amazon.com
2. In `data/devices.json`, find all Amazon URLs and replace:
   ```
   ?tag=AFFILIATETAG
   ```
   with:
   ```
   ?tag=YOUR_ASSOCIATE_TAG
   ```

3. Regenerate the site:
   ```bash
   npm run build
   ```

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

Best for: Easy deploys, automatic HTTPS, global CDN

**Steps:**

1. Create Vercel account: https://vercel.com
2. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Deploy:
   ```bash
   cd c:\Users\Pietro\Desktop\SDCardChecker
   vercel
   ```
4. Follow the prompts:
   - Create new project
   - Select `dist` as output directory
   - Production deployment

**Advantages:**
- Free tier available
- Automatic HTTPS
- Global edge network
- Fast deployment
- Automatic builds on push

**Cost:** Free for hobby projects, ~$20/month for production

### Option 2: Netlify

Best for: Alternative to Vercel, free tier generous

**Steps:**

1. Create Netlify account: https://netlify.com
2. Install CLI:
   ```bash
   npm install -g netlify-cli
   ```
3. Deploy:
   ```bash
   netlify deploy --prod --dir dist
   ```

**Advantages:**
- Very generous free tier
- Easy GitHub integration
- Built-in form handling
- Analytics included

**Cost:** Free tier adequate for most sites

### Option 3: GitHub Pages (Free)

Best for: Free hosting with GitHub

**Steps:**

1. Create GitHub account: https://github.com
2. Create new repository: `sdcardchecker`
3. Clone locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/sdcardchecker.git
   cd sdcardchecker
   ```
4. Copy `dist/*` files to repo root
5. Commit and push:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```
6. Enable GitHub Pages:
   - Go to repository Settings
   - Scroll to "GitHub Pages"
   - Select `main` branch as source
   - Save

7. Visit: `https://YOUR_USERNAME.github.io/sdcardchecker`

**Advantages:**
- Completely free
- Uses GitHub as version control
- Automatic HTTPS
- Built on GitHub

**Limitations:**
- Custom domain requires paid email (not needed for functionality)
- URL includes username/repo name

### Option 4: Traditional Hosting (cPanel, etc.)

Best for: Existing hosting account

**Steps:**

1. Log into your hosting control panel (cPanel, Plesk, etc.)
2. Create FTP account if needed
3. Upload `dist/` folder contents to `public_html` or `www` folder
4. Ensure `index.html` is in root directory
5. Visit your domain

**Important:**
- Ensure `.htaccess` includes:
  ```apache
  <IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^devices/(.*)/?$ /devices/$1/index.html [L]
  </IfModule>
  ```

**Cost:** Varies by provider ($5-20/month typical)

### Option 5: AWS S3 + CloudFront

Best for: Scaling, performance-critical

**Steps:**

1. Create AWS account: https://aws.amazon.com
2. Create S3 bucket for static files
3. Upload `dist/` contents
4. Create CloudFront distribution
5. Point domain to CloudFront

**Cost:** ~$0.50-5/month depending on traffic

## Custom Domain Setup

### Using Vercel

1. Go to Project Settings → Domains
2. Add your domain
3. Update your domain registrar DNS:
   - CNAME to `cname.vercel-dns.com`
   - Or use Vercel nameservers

### Using Netlify

1. Go to Site Settings → Domain Management
2. Add custom domain
3. Follow DNS setup instructions
4. Netlify provides free SSL

### Using GitHub Pages

1. Go to Repository Settings → Pages
2. Add custom domain
3. Update DNS A records to GitHub IP:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
4. Create CNAME file with domain name

## DNS Configuration

If registrar is separate from host:

**For CNAME Records (Vercel/Netlify):**
```
Host: @
Type: CNAME
Value: your-provider.example.com
```

**For A Records (GitHub/AWS):**
```
Host: @
Type: A
Value: XXX.XXX.XXX.XXX
```

## Post-Deployment

### 1. SSL/HTTPS Certificate

All recommended hosts provide free SSL. Ensure:
- ✅ HTTPS is enabled
- ✅ HTTP redirects to HTTPS
- ✅ Certificate auto-renews

### 2. Google Search Console Setup

1. Go to: https://search.google.com/search-console
2. Add property: `https://yourdomain.com`
3. Verify ownership (add DNS record or HTML file)
4. Submit sitemap: `/sitemap.xml`
5. Monitor search performance

**Initial Setup:**
```
Property Type: Domain
Property: https://yourdomain.com
Verification Method: DNS TXT Record
```

### 3. Google Analytics Setup

1. Go to: https://analytics.google.com
2. Create new property
3. Get tracking code
4. Add to `dist/index.html` before closing `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Then regenerate:
```bash
npm run build
```

### 4. Amazon Associates Linking

1. Dashboard: https://affiliate-program.amazon.com
2. Review your Amazon affiliate tag
3. Verify all product links include tag:
   ```
   https://amazon.com/s?k=PRODUCT&tag=YOUR-TAG-20
   ```
4. Monitor clicks and earnings

### 5. Monitor Site Health

**Weekly:**
- Check Google Search Console for errors
- Monitor Analytics traffic
- Verify affiliate links work

**Monthly:**
- Review keyword rankings
- Check page load speeds
- Monitor error rates
- Review affiliate earnings

## Monitoring & Maintenance

### Local Development

After updating `data/devices.json`:

```bash
# Regenerate static files
npm run build

# Test locally
npm start

# Visit http://localhost:8080
```

### Adding New Devices

1. Edit `data/devices.json`
2. Add device object with all required fields
3. Run `npm run build`
4. Deploy updated `dist/` folder

### Updating Device Specs

1. Edit device in `data/devices.json`
2. Run `npm run build`
3. Deploy

### Checking Build Output

```bash
# Generate site
npm run build

# Verify output
ls -la dist/
ls -la dist/devices/
cat dist/sitemap.xml
cat dist/robots.txt
```

## Troubleshooting

### Site Not Showing Device Pages

**Issue:** Clicking device links shows 404

**Solution:**
- Ensure `.htaccess` rewrites are configured
- Verify all device pages exist in `dist/devices/[slug]/index.html`
- Check web server logs for errors

### Affiliate Links Not Working

**Issue:** Amazon links broken or not earning

**Solution:**
- Verify affiliate tag is correct
- Test link manually
- Check Amazon Associates dashboard for approval
- Ensure tag format: `?tag=XXXXX-20`

### Search Not Working

**Issue:** Device dropdown search not filtering

**Solution:**
- Check browser console for JavaScript errors
- Verify `dist/assets/js/search.js` exists
- Ensure `dist/data/devices.json` loaded
- Check that device names match searchTerms

### Pages Loading Slowly

**Solution:**
- Enable gzip compression on server
- Use CDN (Vercel/Netlify provide this)
- Minify CSS/JS (already done)
- Ensure images optimized (no images currently)

### SSL Certificate Issues

**Solution:**
- Most hosts auto-provision SSL
- Wait 24 hours for propagation
- Check domain nameservers
- Force HTTPS redirects

## Rollback Procedure

If deployment has issues:

```bash
# Check backup
ls dist-backup-*/

# Restore
rm -rf dist/
cp -r dist-backup-YYYYMMDD/* dist/

# Redeploy
vercel --prod
# or
netlify deploy --prod --dir dist
```

## Performance Targets

After deployment, verify:

- **Page Load:** < 2 seconds
- **Core Web Vitals:** All green
- **Mobile Score:** 85+
- **Lighthouse:** 85+

Test with:
- https://pagespeedinsights.web.dev
- https://gtmetrix.com
- https://tools.pingdom.com

## Success Criteria

Deployment is successful when:

✅ Site loads at custom domain  
✅ All device pages accessible  
✅ Search functionality works  
✅ Amazon affiliate links have correct tag  
✅ Google Search Console shows impressions  
✅ Google Analytics tracking working  
✅ HTTPS enabled  
✅ Sitemap submitted to Google  
✅ Core Web Vitals green  

## Getting Help

- **Vercel Docs:** https://vercel.com/docs
- **Netlify Docs:** https://docs.netlify.com
- **GitHub Pages:** https://pages.github.com
- **Google Search Console Help:** https://support.google.com/webmasters

---

**Next Step:** Follow one of the deployment options above and get your site live!
