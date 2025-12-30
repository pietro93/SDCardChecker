# Category Files Workflow - FIXED

## Problem Fixed
Previously, `data/devices.json` was being edited directly, which broke during category reorganization. Now:

✅ **Source of truth**: Individual category files in `data/categories/`  
✅ **Generated artifact**: `data/devices.json` (never edit directly)  
✅ **All category pages**: Working with devices displaying correctly  

---

## File Structure

```
data/categories/
├── action-cameras.json (15 devices)
├── audio-and-hi-fi.json (9 devices)
├── cameras.json (57 devices)
├── computing-and-tablets.json (26 devices)
├── dash-cams.json (18 devices)
├── drones.json (22 devices)
├── gaming-handhelds.json (16 devices)
├── retro-arcade.json (1 device)
├── retro-handhelds.json (3 devices)
└── security-cameras.json (3 devices)
```

Each file is a JSON array of devices:

```json
[
  {
    "id": "device-id",
    "name": "Device Name",
    "category": "Category Name",
    "slug": "device-slug",
    "searchTerms": [...],
    "sdCard": {...},
    "recommendedBrands": [...],
    "faq": [...],
    "relatedDevices": [...]
  },
  ...
]
```

---

## Workflow: How to Edit Data

### 1. **Edit Device Data**
Open the appropriate category file and make changes:

```bash
# Edit camera specs
data/categories/cameras.json

# Add new gaming device
data/categories/gaming-handhelds.json

# Update phone SD card requirements
data/categories/computing-and-tablets.json
```

### 2. **Build Site**
```bash
npm run build:site
```

This will:
- ✅ Merge all category files → `data/devices.json`
- ✅ Generate all 10 category pages
- ✅ Generate all 170+ device pages
- ✅ Generate Japanese pages
- ✅ Output everything to `dist/`

### 3. **Verify Changes**
Check the appropriate category page:
```
dist/categories/cameras/index.html
dist/categories/drones/index.html
dist/categories/gaming-handhelds/index.html
```

All devices should be displaying with working links.

### 4. **Commit**
```bash
git add data/categories/
git commit -m "Update camera specs and add new device"
```

**DO NOT commit `data/devices.json`** — it's in `.gitignore` and auto-generated.

---

## Why This Architecture?

| Before | After |
|--------|-------|
| ❌ Direct edits to devices.json | ✅ Edit individual category files |
| ❌ Risk of full data loss | ✅ Safe, localized changes |
| ❌ Hard to track what changed | ✅ Git shows category file diffs |
| ❌ Merge conflicts on large file | ✅ Smaller, focused files |
| ❌ Manual merging after extraction | ✅ Automatic merge during build |

---

## Common Tasks

### Add a New Device
1. Open the category file (e.g., `data/categories/cameras.json`)
2. Add a new object to the array:
```json
{
  "id": "canon-eos-r6",
  "name": "Canon EOS R6",
  "category": "Cameras",
  "slug": "canon-eos-r6",
  "searchTerms": [...],
  "sdCard": {...},
  "recommendedBrands": [...],
  "faq": [...],
  "relatedDevices": [...]
}
```
3. Run: `npm run build:site`
4. Commit: `git add data/categories/ && git commit -m "Add Canon EOS R6"`

### Move Device to Different Category
1. Copy the device object from source category file
2. Paste it into destination category file
3. Delete it from source category file
4. Run: `npm run build:site`
5. Commit

### Update Device Specs
1. Open the category file
2. Find the device by `id` or `name`
3. Edit `sdCard`, `recommendedBrands`, or `faq`
4. Run: `npm run build:site`
5. Commit

### Add FAQ to Device
1. Open the category file
2. Find the device
3. Add to the `faq` array:
```json
{
  "q": "Question text?",
  "a": "Answer text with <b>bold</b> and <i>italic</i> formatting"
}
```
4. Run: `npm run build:site`
5. Commit

---

## Troubleshooting

**Q: I see outdated data in the category page**  
A: Run `npm run build:site` to rebuild from updated category files.

**Q: devices.json appeared in git diff**  
A: It's in `.gitignore` now. Just ignore it — don't commit it.

**Q: Build is taking a long time**  
A: The `npm run build` script hits Amazon APIs. Use `npm run build:site` for local changes without API calls.

**Q: I accidentally deleted a device**  
A: Check git history: `git log -p data/categories/[category].json` and restore the file.

**Q: Multiple people editing the same category file**  
A: Same as any git workflow — pull latest, merge conflicts if needed, push. Smaller files = fewer conflicts.

---

## Key Rules

🔴 **NEVER** directly edit `data/devices.json`  
✅ **ALWAYS** edit category files in `data/categories/`  
✅ **RUN** `npm run build:site` after changes  
✅ **COMMIT** only category files  

---

## Build Script Details

The build process (`scripts/generator/build.js`) automatically:

1. **Reads all category files** from `data/categories/*.json`
2. **Merges into devices.json** with metadata (timestamp, counts)
3. **Groups by category** for category page generation
4. **Generates HTML**:
   - 10 category pages (one per category)
   - 170+ device pages
   - 170+ Japanese device pages
   - Related device sections
   - All responsive layouts

No manual intervention needed — it's all automatic!
