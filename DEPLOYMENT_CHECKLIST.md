# Deployment Checklist

## Phase 1: Code Review ✓ COMPLETE

- [x] Updated `scripts/generator/generate-device-pages.js`
  - [x] Removed FAQ toggle arrows
  - [x] Made FAQ answers always visible
  - [x] Added device image support
  - [x] Updated table generation with card images
  - [x] Updated alternative cards with images
  - [x] Updated button text to "Check on Amazon"

- [x] Updated `src/css/style.css`
  - [x] Removed interactive FAQ styles
  - [x] Added featured device image styles
  - [x] Added table card cell styles
  - [x] Added alternative card image styles
  - [x] Verified mobile responsiveness

## Phase 2: Data Preparation

- [ ] **Update devices.json**
  - [ ] Add `imageUrl` field to each device
  - [ ] Format: `/assets/images/devices/{device-slug}.jpg`
  - [ ] Verify all devices have valid entries
  - [ ] Example:
    ```json
    {
      "id": "gopro-hero-13",
      "imageUrl": "/assets/images/devices/gopro-hero-13.jpg",
      ...
    }
    ```

- [ ] **Update sdcards.json**
  - [ ] Add `imageUrl` field to each SD card
  - [ ] Format: `/assets/images/sdcards/{card-id}.jpg`
  - [ ] Verify all cards have valid entries
  - [ ] Example:
    ```json
    {
      "id": "sandisk-extreme-microsd",
      "imageUrl": "/assets/images/sdcards/sandisk-extreme-microsd.jpg",
      ...
    }
    ```

## Phase 3: Image Preparation

- [ ] **Create Image Directories**
  ```
  mkdir -p dist/assets/images/devices/
  mkdir -p dist/assets/images/sdcards/
  ```

- [ ] **Create Placeholder Images**
  - [ ] `/dist/assets/images/devices/placeholder.jpg`
    - Size: 500x400px
    - Color: Light gray background with SD card icon
  - [ ] `/dist/assets/images/sdcards/placeholder.jpg`
    - Size: 200x140px
    - Color: Light gray background with microSD icon

- [ ] **Collect Device Images**
  - [ ] GoPro Hero 13 Black
  - [ ] GoPro Hero 12 Black
  - [ ] GoPro Hero Max
  - [ ] Nintendo Switch
  - [ ] Nintendo Switch OLED
  - [ ] Nintendo Switch Lite
  - [ ] DJI Mini 4 Pro
  - [ ] DJI Mini 3 Pro
  - [ ] DJI Air 3S
  - [ ] Canon EOS R5
  - [ ] Canon EOS R6
  - [ ] Sony A6700
  - [ ] Sony A6400
  - [ ] Fujifilm X-S20
  - [ ] (Add all other devices)

- [ ] **Collect SD Card Images**
  - [ ] SanDisk Extreme microSD
  - [ ] SanDisk Extreme Pro SD UHS-II
  - [ ] Lexar Professional 633x
  - [ ] Lexar Professional 1000x
  - [ ] Lexar Professional Silver SD
  - [ ] Kingston Canvas Select
  - [ ] Kingston Canvas Go
  - [ ] Kingston Canvas Go Plus
  - [ ] Crucial MX500 microSD
  - [ ] (Add all other brands)

- [ ] **Optimize Images**
  - [ ] Device images: 500x400px, <200KB each
  - [ ] SD card images: 200x140px, <100KB each
  - [ ] Format: JPEG at 80-85% quality
  - [ ] Use tool: ImageOptim, TinyPNG, or similar

- [ ] **Place Images in Directories**
  - [ ] Device images → `dist/assets/images/devices/`
  - [ ] SD card images → `dist/assets/images/sdcards/`
  - [ ] Verify file names match dataset entries

## Phase 4: Testing

- [ ] **Build Test**
  ```bash
  npm run build
  ```
  - [ ] No errors or warnings
  - [ ] All pages generate successfully
  - [ ] Check console for any issues

- [ ] **Visual Testing**
  - [ ] Open device page in browser
  - [ ] Featured device image displays correctly
  - [ ] Alternative cards show product images
  - [ ] Comparison table shows card images and "Check on Amazon" links
  - [ ] FAQ section visible without toggles
  - [ ] All images load without 404 errors

- [ ] **Mobile Testing**
  - [ ] Test on iPhone/Android simulator
  - [ ] Featured image scales properly
  - [ ] Table doesn't overflow
  - [ ] Alternative cards stack vertically
  - [ ] Images still visible on small screens

- [ ] **Responsive Testing**
  - [ ] Desktop (1920px): Full layout
  - [ ] Tablet (768px): Responsive grid
  - [ ] Mobile (480px): Single column
  - [ ] Use DevTools to test different breakpoints

- [ ] **Link Testing**
  - [ ] All "Check on Amazon" links work
  - [ ] Links open in new tab
  - [ ] Affiliate parameters intact
  - [ ] No broken links in FAQ or elsewhere

- [ ] **Performance Testing**
  - [ ] Images load with lazy loading
  - [ ] Page load time acceptable
  - [ ] No missing resource warnings
  - [ ] Lighthouse score acceptable

- [ ] **Cross-Browser Testing**
  - [ ] Chrome/Chromium
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge

## Phase 5: Quality Assurance

- [ ] **Data Validation**
  - [ ] All devices have imageUrl (or accept fallback)
  - [ ] All SD cards have imageUrl (or accept fallback)
  - [ ] No typos in file paths
  - [ ] All image files exist

- [ ] **Visual QA**
  - [ ] Check consistency across all device pages
  - [ ] Verify styling matches mockups
  - [ ] Check spacing and alignment
  - [ ] Verify brand colors (Amazon orange for CTA)

- [ ] **Content QA**
  - [ ] FAQ answers are readable and helpful
  - [ ] All device specs correct
  - [ ] Product names correct
  - [ ] Prices reasonable/updated

## Phase 6: Pre-Production

- [ ] **Staging Deployment**
  - [ ] Deploy to staging environment
  - [ ] Run full test suite
  - [ ] Test all device pages
  - [ ] Verify images on staging server

- [ ] **Performance Optimization**
  - [ ] Check image compression
  - [ ] Enable gzip compression
  - [ ] Verify lazy loading working
  - [ ] Check cache headers

- [ ] **SEO Verification**
  - [ ] Meta tags correct
  - [ ] Open Graph images set
  - [ ] Schema.org FAQ markup valid
  - [ ] All links crawlable

## Phase 7: Production Deployment

- [ ] **Final Checks**
  - [ ] Database/data files backed up
  - [ ] Code reviewed by team
  - [ ] All tests passing
  - [ ] Documentation complete

- [ ] **Deploy**
  ```bash
  npm run build
  # Deploy dist/ folder to production
  ```

- [ ] **Post-Deploy**
  - [ ] Test live site
  - [ ] Monitor error logs
  - [ ] Check image delivery CDN
  - [ ] Verify Google indexing

## Phase 8: Monitoring

- [ ] **Week 1**
  - [ ] Monitor error rates
  - [ ] Check page load times
  - [ ] Verify image loads
  - [ ] Check user feedback

- [ ] **Week 2-4**
  - [ ] Analyze user behavior
  - [ ] Check click-through rates on CTAs
  - [ ] Monitor bounce rates
  - [ ] Adjust based on analytics

## Phase 9: Documentation

- [ ] **Update Docs**
  - [ ] Update README with new features
  - [ ] Document image file structure
  - [ ] Create maintenance guide
  - [ ] Update deployment docs

- [ ] **Team Training**
  - [ ] Brief team on changes
  - [ ] Document how to add images
  - [ ] Create image guidelines
  - [ ] Set up image approval process

## Rollback Plan

If issues arise:

```bash
# Revert code changes
git checkout scripts/generator/generate-device-pages.js
git checkout src/css/style.css

# Rebuild with old code
npm run build

# Redeploy
# Deploy dist/ folder
```

The changes are backward compatible - pages will still work with placeholder images.

## Success Criteria

✓ All device pages display correctly  
✓ Featured images show on device pages  
✓ FAQ answers visible without toggle  
✓ Comparison table shows card images  
✓ Alternative cards show product images  
✓ All "Check on Amazon" links work  
✓ Mobile responsive and functional  
✓ No console errors  
✓ Images load efficiently  
✓ User engagement metrics positive  

---

**Start Date:** ___________  
**Completion Date:** ___________  
**Deployed By:** ___________  
**Reviewed By:** ___________
