# Pre-Launch Verification Checklist

Run through this checklist to ensure everything works before adding images and launching.

## Page Accessibility

- [ ] Homepage loads at `/`
- [ ] Device pages load (test: `/devices/gopro-hero-13/`)
- [ ] Category pages load (test: `/categories/drones/`)
- [ ] Legal pages load (Privacy, Terms, Affiliate, About, Contact)
- [ ] Footer links point to correct pages

## Search Functionality

- [ ] Search bar visible on homepage
- [ ] Search bar visible on device pages
- [ ] Search bar visible on category pages
- [ ] Search dropdown shows results when typing
- [ ] Clicking search result navigates to correct page

## Navigation

- [ ] Header logo on all pages
- [ ] Categories dropdown in header shows all 4 categories
- [ ] Category links navigate to correct pages
- [ ] Breadcrumbs visible and correct on device pages
- [ ] Home link in header works from all pages

## SEO Metadata (check page source)

### Homepage
- [ ] Title: "SD Card Checker - Find the Perfect SD Card for Any Device"
- [ ] Meta description: ~150 chars, includes keywords
- [ ] Canonical: `https://sdcardchecker.com/`
- [ ] og:type: "website"
- [ ] Schema.org markup present

### Device Pages (test: gopro-hero-13)
- [ ] Title includes device name and specs
- [ ] Meta description 120-160 chars
- [ ] Canonical URLs correct
- [ ] og:image points to device image
- [ ] FAQPage schema present
- [ ] Product schema for SD cards present

### Category Pages (test: drones)
- [ ] Title includes category name
- [ ] Meta description present
- [ ] Canonical URLs correct
- [ ] og:type: "website"

## Content Structure

- [ ] Single H1 per page (no duplicates)
- [ ] Page titles are keyword-rich
- [ ] Meta descriptions are compelling and under 160 chars
- [ ] Images have alt text (when images are added)

## Affiliate Disclosure

- [ ] Affiliate disclosure visible on each device page
- [ ] Affiliate Disclosure dedicated page works
- [ ] Affiliate links point to Amazon (or configured affiliate)

## Responsive Design

- [ ] Test on mobile (< 768px)
  - [ ] Header is responsive
  - [ ] Search bar works
  - [ ] Navigation dropdown works
  - [ ] Content stacks properly
- [ ] Test on tablet (768px - 1024px)
- [ ] Test on desktop (> 1024px)

## Footer

- [ ] All footer links present
- [ ] Footer links navigate correctly
- [ ] Company section: About Us, Contact
- [ ] Legal section: Privacy, Terms, Affiliate
- [ ] Site section: Home, Sitemap
- [ ] Categories section: All 4 categories

## Technical

- [ ] No console errors (F12 → Console)
- [ ] No 404 errors (F12 → Network)
- [ ] Images load without errors
- [ ] CSS/JS files load correctly
- [ ] Alpine.js is working (search functionality)

## After Adding Images

- [ ] Device images load correctly
- [ ] Image filenames match exactly as in IMAGE_MAPPING.md
- [ ] Images display in Open Graph tags
- [ ] Images display in Twitter cards

---

## Test URLs to Check

**Core Pages:**
- `/` (homepage)
- `/about.html` (About)
- `/contact.html` (Contact)
- `/privacy.html` (Privacy)
- `/terms.html` (Terms)
- `/affiliate-disclosure.html` (Affiliate)

**Device Pages (sample 2):**
- `/devices/gopro-hero-13/`
- `/devices/nikon-z9/`

**Category Pages (sample 2):**
- `/categories/action-cameras/`
- `/categories/mirrorless-cameras/`

**Technical Files:**
- `/sitemap.xml` (should return XML)
- `/sitemap.html` (should return HTML)
- `/robots.txt` (should return robots.txt)

---

## Image Verification (After Upload)

- [ ] 6 real images present:
  - gopro-hero-13.webp
  - nintendo-switch.webp
  - nintendo-switch-oled.webp
  - valve-steam-deck.webp
- [ ] 8 replaced placeholder images:
  - gopro-hero-12.webp
  - gopro-hero-max.webp
  - dji-mini-4-pro.webp
  - dji-mini-3-pro.webp
  - dji-air-3s.webp
  - dji-mavic-3.webp
  - canon-eos-r5.webp
  - sony-a6700.webp
  - fujifilm-x-s20.webp
  - nikon-z9.webp

---

**All checks passing?** ✅ Ready to deploy to production!
