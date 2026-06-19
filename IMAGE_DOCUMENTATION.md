# Image Documentation - Consolidated

## ⚠ Sourcing real device photos? Read this first

[`DEVICE_IMAGE_PIPELINE.md`](DEVICE_IMAGE_PIPELINE.md) is the current,
authoritative doc for the automated `scripts/images/` pipeline that fetches
real manufacturer/Grover product photos and composites them as device hero
images. It supersedes the "fallback placeholder" guidance below for any
device the pipeline has already covered. See [INDEX.md](INDEX.md#images)
for how all the image docs relate.

## ✅ Pre-pipeline image guidance is in one document

**Primary Reference:** [`IMAGE_STRATEGY_MASTER.md`](IMAGE_STRATEGY_MASTER.md)

This predates the automated pipeline above and is the single source of truth
for the manual/placeholder-era state:
- Image specifications (dimensions, formats, file sizes)
- Device image fallback architecture
- Card product image handling
- SD card reader images
- Complete implementation guide
- Testing procedures

---

## What Was Consolidated

The following documents have been consolidated into `IMAGE_STRATEGY_MASTER.md`:

| Document | Content | Status |
|----------|---------|--------|
| IMAGE_QUICK_REFERENCE.md | Quick TL;DR of critical images | ✅ Integrated |
| IMAGE_IMPLEMENTATION_GUIDE.md | Requirements & inventory | ✅ Integrated |
| IMAGE_FALLBACK_STRATEGY.md | Fallback logic for cards | ✅ Integrated |
| READER_IMAGES_STRATEGY.md | SD card reader images | ✅ Integrated |
| IMAGE_STRATEGY_MASTER.md | Core strategy (now complete) | ✅ Primary |
| IMAGE_UPDATE_SUMMARY.md | Recent updates (archived) | 📌 Reference only |
| IMAGE_AUDIT_REPORT.md | Verification results | 📌 Reference only |

---

## Quick Navigation

**New to images?**
- Start with [Overview](IMAGE_STRATEGY_MASTER.md#overview)
- See [Current Coverage](IMAGE_STRATEGY_MASTER.md#current-image-coverage)

**Need to add an image?**
- Follow [Implementation Guide](IMAGE_STRATEGY_MASTER.md#implementation-guide)
- Check [Technical Specifications](IMAGE_STRATEGY_MASTER.md#technical-specifications)

**Want device mapping details?**
- See [Device Image Mapping](IMAGE_STRATEGY_MASTER.md#device-image-mapping)
- View [SD Card Reader Images](IMAGE_STRATEGY_MASTER.md#sd-card-reader-images)
- Learn about [Card Product Images](IMAGE_STRATEGY_MASTER.md#card-product-images)

**Testing & verification?**
- See [Testing](IMAGE_STRATEGY_MASTER.md#testing) section

---

## Key Facts

- **163 devices** with smart image fallbacks
- **50+ SD cards** with category-based fallbacks
- **14 SD card readers** using generic placeholder
- **42 real images** (26% coverage)
- **121 devices** using smart placeholders (74% coverage)
- **Zero broken images** - 3-tier fallback system ensures always shows something

---

## Questions?

Check `IMAGE_STRATEGY_MASTER.md` for complete guidance on:
- ✅ How the fallback system works
- ✅ What images exist and where
- ✅ How to add new images
- ✅ File specifications and testing
