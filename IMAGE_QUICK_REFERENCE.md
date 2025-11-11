# Image Implementation - Quick Reference Card

## 🎯 TL;DR - What You Need

### Critical (For Launch)
**28 Device Images** (1200×800px, WebP)
- Action cameras: 3 images
- Drones: 4 images  
- Mirrorless cameras: 10 images
- Gaming handhelds: 3 images
- Tablets & computing: 6 images
- Security cameras: 3 images

Save to: `/img/devices/` with exact filenames

### Important (Post-Launch)
**50+ Card Images** (96×96px, WebP)
- All SD/microSD card products
- Currently using generic fallbacks (works fine)
- Lower priority, can wait

---

## 📋 All 28 Missing Device Images

### Action Cameras (3)
```
gopro-hero-12.webp
gopro-hero-max.webp
dji-osmo-action-5-pro.webp
```

### Drones (4)
```
dji-mini-3-pro.webp
dji-air-3s.webp
dji-air-3.webp
dji-pocket-3.webp
```

### Mirrorless Cameras (10)
```
canon-eos-r5.webp
canon-r6-mk2.webp
sony-a6700.webp
sony-a7iv.webp
nikon-z9.webp
nikon-z8.webp
fujifilm-x-s20.webp
panasonic-s1h.webp
blackmagic-pocket-cinema-camera-4k.webp
blackmagic-pocket-cinema-camera-6k-pro.webp
```

### Gaming Handhelds (3)
```
nintendo-switch-lite.webp
rog-ally.webp
anbernic-win600.webp
```

### Tablets & Computing (6)
```
ipad-pro-12-9.webp
samsung-tab-s9.webp
fire-hd-10.webp
fire-max-11.webp
hp-chromebook-14.webp
raspberry-pi-5.webp
```

### Security Cameras (3)
```
wyze-cam-v3.webp
reolink-poe-4k.webp
ubiquiti-dream-machine.webp
```

---

## 📏 Specifications

| Property | Value |
|----------|-------|
| **Device Image Size** | 1200 × 800px |
| **Card Image Size** | 96 × 96px |
| **Format** | WebP (preferred) or JPEG |
| **Device File Size** | ~100KB (WebP) / ~150KB (JPEG) |
| **Card File Size** | ~20KB (WebP) / ~30KB (JPEG) |
| **Directory** | `/img/devices/` or `/img/cards/` |
| **Content** | Product photo on white background |

---

## ✅ Implementation Steps

1. **Collect 28 device images** (sources: manufacturer websites, Amazon, stock photos)
2. **Resize to 1200×800px** (use any image editor)
3. **Convert to WebP** (optional but recommended - better compression)
4. **Save with exact filenames** to `/img/devices/`
5. **Run:** `npm run build`
6. **Test:** Open dist/devices/*/index.html in browser

---

## 🔍 Verification

After adding images, check:
```bash
# Verify images load on device pages
npm run build

# Check specific device
open dist/devices/canon-eos-r5/index.html

# Should see hero image at top of page
```

---

## 🚀 Priority Order (If Adding Gradually)

1. **First:** Cameras (10 images) - highest search volume
2. **Second:** Drones (4 images) - popular category
3. **Third:** Handhelds (3 images) - gaming audience
4. **Fourth:** Everything else (11 images)

---

## 📞 Current Status

- ✅ 6 device images already in place (GoPro Hero 13, Nintendo Switch, etc.)
- ⏳ 28 device images still needed for complete launch
- ✅ 2 card images in place (SanDisk, Lexar)
- ℹ️ 50+ card images have working generic fallbacks (not critical)
- ✅ All fallback images configured (site works without real images)

---

## 💡 Pro Tips

- **WebP conversion:** Use online tools like TinyWebP or Cloudinary
- **Bulk resize:** Use ImageMagick: `convert input.jpg -resize 1200x800 output.webp`
- **Quality balance:** WebP at quality 75-80 looks great and is small
- **License check:** Verify you can use manufacturer images (usually allowed for product reviews)

---

**Full Details:** See `IMAGE_IMPLEMENTATION_GUIDE.md`
