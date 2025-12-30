# Category Files Workflow

**⚠️ IMPORTANT: Never edit `data/devices.json` directly**

The new architecture uses **individual category files** as the source of truth:

```
data/categories/
├── action-cameras.json
├── cameras.json
├── computing-and-tablets.json
├── dash-cams.json
├── drones.json
├── gaming-handhelds.json
├── retro-arcade.json
├── retro-handhelds.json
└── security-cameras.json
```

## Workflow

### 1. **Edit Device Data**
- Open the appropriate category file: e.g., `data/categories/cameras.json`
- Make changes (add devices, update specs, add FAQs, etc.)
- Save the file

### 2. **Build Site**
```bash
npm run build
```

This will:
1. Merge all category files → generates `data/devices.json`
2. Generate all category pages from the merged data
3. Generate all device pages
4. Output to `dist/`

### 3. **Commit Changes**
```bash
git add data/categories/
git commit -m "Update camera specs and add new device"
```

**DO NOT commit `data/devices.json`** - it's in `.gitignore` and will be regenerated during build.

---

## File Structure

Each category file is a simple JSON array:

```json
[
  {
    "id": "camera-id",
    "name": "Camera Name",
    "category": "Cameras",
    "slug": "camera-slug",
    "searchTerms": [...],
    "sdCard": {...},
    "recommendedBrands": [...],
    "faq": [...],
    "relatedDevices": [...]
  }
]
```

---

## Why This Architecture?

✅ **Safety**: Never accidentally overwrite devices.json  
✅ **Organization**: Each category is a separate, manageable file  
✅ **Version Control**: Only category files are tracked in git  
✅ **Clarity**: devices.json is clearly marked as generated  

---

## Troubleshooting

**Q: I edited devices.json but changes disappeared after build**  
A: devices.json is regenerated from category files during build. Edit the category files instead.

**Q: How do I add a new device?**  
A: Edit the appropriate category file (e.g., `data/categories/cameras.json`) and add a new object to the array.

**Q: How do I change a device's category?**  
A: Move the device object to the appropriate category file (e.g., from `cameras.json` to `drones.json`).

**Q: I see devices.json in my working directory but it's not in git**  
A: That's correct - it's a generated file. Delete it or ignore it; it will be recreated on next build.

---

## Build Script Details

The build script (`scripts/generator/build.js`) automatically:

1. **Merges category files**: Reads all `data/categories/*.json` files
2. **Creates devices.json**: Writes merged data with metadata
3. **Groups by category**: For category page generation
4. **Generates pages**: Uses merged data for all templates

This happens automatically - no manual steps needed!
