# ⚡ Quick Reference Card

## 🚀 One-Time Setup (5 minutes)

### Extract English Categories
```bash
npm run extract-category "Audio & Hi-Fi"
npm run extract-category "Cameras"
npm run extract-category "Action Cameras"
npm run extract-category "Drones"
npm run extract-category "Gaming Handhelds"
npm run extract-category "Dash Cams"
npm run extract-category "Computing & Tablets"
npm run extract-category "Security Cameras"
```

### Extract Japanese Categories
```bash
npm run extract-category-ja "アクションカメラ"
npm run extract-category-ja "カメラ"
npm run extract-category-ja "ドローン"
npm run extract-category-ja "携帯ゲーム機"
npm run extract-category-ja "ドライブレコーダー"
npm run extract-category-ja "コンピュータ・タブレット"
npm run extract-category-ja "セキュリティカメラ"
```

### Build
```bash
npm run build:all
```

**Done!** ✨

---

## 📅 Daily Workflow

```bash
# 1. Edit files in:
#    - data/categories/*.json (English)
#    - data/categories-ja/*.json (Japanese)

# 2. Build
npm run build:all

# 3. View locally (optional)
npx http-server dist

# That's it!
```

---

## 📂 File Structure

### English
```
data/categories/
├── audio-and-hi-fi.json          10 devices
├── cameras.json                   20 devices
├── action-cameras.json            15 devices
├── drones.json                    12 devices
├── gaming-handhelds.json          25 devices
├── dash-cams.json                 10 devices
├── computing-and-tablets.json     15 devices
└── security-cameras.json          8 devices
```

### Japanese
```
data/categories-ja/
├── アクションカメラ.json           10 devices
├── カメラ.json                    15 devices
├── ドローン.json                  12 devices
├── 携帯ゲーム機.json              25 devices
├── ドライブレコーダー.json         10 devices
├── コンピュータ・タブレット.json    15 devices
└── セキュリティカメラ.json         8 devices
```

---

## 🔧 NPM Scripts

```bash
# Build EN + JA
npm run build:all

# Build EN only
npm run build:site

# Build JA only
npm run build:ja

# Development mode
npm run dev

# Extract categories (one-time)
npm run extract-category "Name"
npm run extract-category-ja "Name"

# View site locally
npx http-server dist
```

---

## ✅ What Was Fixed

| Issue | Fix |
|-------|-----|
| Computing & Tablets 404 | Slug: `computing-tablets` → `computing-and-tablets` |
| No Japanese split | Created `data/categories-ja/` with auto-merge |
| Manual merge needed | Auto-merge integrated into build process |

---

## 🎯 Test URLs

After building, these should work:

- ✅ `/categories/audio-and-hi-fi/`
- ✅ `/categories/cameras/`
- ✅ `/categories/action-cameras/`
- ✅ `/categories/drones/`
- ✅ `/categories/gaming-handhelds/`
- ✅ `/categories/dash-cams/`
- ✅ `/categories/computing-and-tablets/` (was 404, now fixed)
- ✅ `/categories/security-cameras/`
- ✅ `/ja/categories/` (Japanese pages)

---

## 📝 Device File Format

```json
[
  {
    "id": "device-id",
    "name": "Device Name",
    "category": "Category Name",
    "slug": "device-slug",
    "searchTerms": ["term1", "term2"],
    "sdCard": {
      "type": "microSD UHS-I",
      "minSpeed": "V30",
      "minWriteSpeed": "30 MB/s",
      "recommendedCapacity": ["128GB", "256GB"],
      "maxCapacity": "512GB"
    },
    "whySpecs": "Explanation...",
    "recommendedBrands": [
      { "id": "brand-id" }
    ],
    "faq": [
      {
        "q": "Question?",
        "a": "Answer"
      }
    ]
  }
]
```

---

## 🚨 Common Issues

### "Device not found after build"
- Did you run extract first? → Run `npm run extract-category`
- Is the file in correct directory? → Check `data/categories/`
- Did you run build after editing? → Run `npm run build:all`

### "404 on category page"
- Build hasn't run yet → Run `npm run build:all`
- Typo in URL slug? → Should be `computing-and-tablets` not `computing-tablets`

### "Japanese pages not generating"
- Did you extract Japanese categories? → Run `npm run extract-category-ja`
- Are files in `data/categories-ja/`? → Check directory exists

---

## 📚 Full Documentation

| Doc | Purpose |
|-----|---------|
| `.NEXT_STEPS.md` | **Read this first** - quick start |
| `QUICK_START.md` | Full reference guide |
| `JAPANESE_CATEGORIES_READY.md` | Japanese setup details |
| `DEVICES_MANAGEMENT_GUIDE.md` | Complete guide |
| `FINAL_SUMMARY.md` | Technical summary |

---

## 🎉 You're Ready!

```bash
# Copy these commands and run them:
npm run extract-category "Audio & Hi-Fi"
npm run extract-category "Cameras"
npm run extract-category "Action Cameras"
npm run extract-category "Drones"
npm run extract-category "Gaming Handhelds"
npm run extract-category "Dash Cams"
npm run extract-category "Computing & Tablets"
npm run extract-category "Security Cameras"
npm run extract-category-ja "アクションカメラ"
npm run extract-category-ja "カメラ"
npm run extract-category-ja "ドローン"
npm run extract-category-ja "携帯ゲーム機"
npm run extract-category-ja "ドライブレコーダー"
npm run extract-category-ja "コンピュータ・タブレット"
npm run extract-category-ja "セキュリティカメラ"
npm run build:all
```

Then test: http://localhost:8080/categories/computing-and-tablets/ ✨
