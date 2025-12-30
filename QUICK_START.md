# Quick Start: New Device Management System

## What Changed?

✅ Your devices are now **organized by category** in `data/categories/` instead of one giant file
✅ The build process **automatically merges** them before generating pages
✅ You just edit files and run `npm run build` - that's it!

---

## Setup (One Time Only)

### Step 1: Extract Categories

Run this command once to split devices.json into category files:

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

This creates:
```
data/categories/
├── audio-and-hi-fi.json
├── cameras.json
├── action-cameras.json
├── drones.json
├── gaming-handhelds.json
├── dash-cams.json
├── computing-and-tablets.json
└── security-cameras.json
```

### Step 2: Rebuild the Site

```bash
npm run build:all
```

This:
1. 🔄 Auto-merges all category files
2. ✅ Validates devices
3. 📄 Generates all pages
4. 🌍 Creates both EN and JA versions

**Done!** Your site is now using the organized category system.

---

## Daily Workflow

### To Edit a Device

1. Find it in `data/categories/[category].json`
2. Edit the device object
3. Save the file
4. Run:
   ```bash
   npm run build
   ```

That's it! The build automatically:
- ✅ Merges all categories
- ✅ Generates pages
- ✅ Creates dist/ folder

### To Add a New Device

1. Open the category file (e.g., `data/categories/audio-and-hi-fi.json`)
2. Add a new device object to the array (copy an existing one and modify)
3. Save
4. Run `npm run build`

### To View Locally

```bash
npm run build
npx http-server dist
```

Then open http://localhost:8080

---

## File Structure

```
data/
├── devices.json                    ← AUTO-GENERATED (don't edit)
└── categories/                     ← EDIT THESE
    ├── audio-and-hi-fi.json       (10 devices)
    ├── cameras.json                (20 devices)
    ├── action-cameras.json         (15 devices)
    ├── drones.json                 (10 devices)
    ├── gaming-handhelds.json       (25 devices)
    ├── dash-cams.json              (8 devices)
    ├── computing-and-tablets.json  (12 devices)
    └── security-cameras.json       (5 devices)
```

---

## NPM Scripts

```bash
npm run build          # Build site (auto-merges categories)
npm run build:all      # Build EN + JA versions
npm run build:css      # Just rebuild CSS
npm run dev            # Development mode with auto-reload
npm run extract-category "Name"  # Extract devices from a category
```

---

## Fixes Included

✅ Audio & Hi-Fi URL slug fixed (`/audio-hi-fi/` not `/audio-and-hi-fi/`)
✅ Navbar updated with correct links
✅ Sitemap updated
✅ Japanese components updated

---

## Before You Build

Make sure you've:
1. ✅ Extracted all categories (see Step 1 above)
2. ✅ Edited files in `data/categories/` as needed
3. ✅ Committed your changes to git

Then just run:
```bash
npm run build:all
```

**Everything else happens automatically!**
