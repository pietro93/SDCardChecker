# Custom Icons Implementation - Nov 18, 2025

## ✅ Changes Made

### 1. Homepage Template (`src/templates/home.html`)
- **Replaced:** 6 emoji icons (📷 📹 🚁 🎮 💻 🎥) with custom .webp images
- **Icon Files:**
  - `/img/brand/icon-camera.webp` → Cameras category
  - `/img/brand/icon-action-camera.webp` → Action Cameras category
  - `/img/brand/icon-drone.webp` → Drones category
  - `/img/brand/icon-gaming.webp` → Gaming Handhelds category
  - `/img/brand/icon-computing.webp` → Computing & Tablets category
  - `/img/brand/icon-security-camera.webp` → Security Cameras category

### 2. Image Attributes (SEO & Performance)
Each icon includes:
- **`loading="lazy"`** - Lazy-loads images below fold (improves LCP)
- **`decoding="async"`** - Async decode prevents rendering blockage
- **`width="64"` & `height="64"`** - Explicit dimensions prevent layout shift (helps CLS)
- **`alt` text** - Descriptive for accessibility & SEO (e.g., "Camera icon - Cameras category")

### 3. CSS Updates (`src/css/modern.css`)
Updated `.feature-icon` class for image support:
```css
.feature-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;  /* Centered vertical alignment */
}

.feature-icon img {
  width: 64px;
  height: 64px;
  object-fit: contain;  /* Preserves aspect ratio */
  display: block;
}
```

---

## 🎯 SEO Benefits

1. **Alt Text** - Each icon has semantic alt text describing the category + icon purpose
2. **Image Format** - .webp is modern, compressed, supported by 95%+ of users
3. **Lazy-Loading** - Defers non-critical images, improves Core Web Vitals (LCP, CLS)
4. **Explicit Dimensions** - Prevents layout shift (CLS < 0.1)
5. **Async Decoding** - Prevents main thread blocking during image decode

---

## 🚀 Performance Impact

- **Before:** Emoji = 0KB, instant render
- **After:** 6 icons × ~0.5-1KB each = ~4-6KB total
- **Impact:** Negligible (lazy-loaded, cached, .webp compression)
- **Benefit:** Consistent branding, professional look, better CTR on category cards

---

## 📋 Next Steps

1. **Build Site:** Close any open dist files, run `npm run build`
2. **Test:** Verify icons display on homepage categories section
3. **Verify:** Check Core Web Vitals (LCP, CLS, INP) in PageSpeed Insights
4. **Deploy:** Push to staging/production

---

## 🔍 How to Verify Implementation

### Check Alt Text (SEO)
```bash
# In browser DevTools, inspect a category card:
<img alt="Camera icon - Cameras category" src="/img/brand/icon-camera.webp" width="64" height="64" loading="lazy" decoding="async">
```

### Check Lazy-Loading Works
In DevTools Network tab:
- Load page
- Scroll down to categories section
- Watch images load when visible

### Check Core Web Vitals
1. Google PageSpeed Insights: https://pagespeed.web.dev
2. Check "Avoid layout shift" (CLS metric)
3. Verify images don't contribute to CLS

---

## 📐 Icon Specifications (For Future Reference)

| Attribute | Value | Reason |
|-----------|-------|--------|
| Format | .webp | Compressed, modern, 95%+ browser support |
| Display Size | 64×64px | Clear at high DPI, not too large |
| Source Size | Original .webp | Already optimized |
| Alt Text | `{Icon Name} icon - {Category}` | Semantic, descriptive |
| Loading | lazy | Defers non-critical images |
| Decoding | async | Prevents blocking render |
| Container | 80px height | Centered with padding |

---

## ⚠️ File Lock Issue

If you see "EPERM: operation not permitted" during build:
1. Close all dist files in explorer/editor
2. Kill any running http-server: `npx kill-port 8080`
3. Retry: `npm run build`

If still locked, restart your terminal/VS Code.
