# Device Data Workflow

## Overview
Yes, you modify individual category files and `npm run build:site` (or `npm run build:all`) automatically merges them into `devices.json`.

## File Structure

```
data/
├── categories/               ← EDIT THESE
│   ├── action-cameras.json
│   ├── audio-and-hi-fi.json
│   ├── cameras.json
│   ├── computing-and-tablets.json
│   ├── dash-cams.json
│   ├── drones.json
│   ├── gaming-handhelds.json
│   ├── security-cameras.json
│   └── smartphones.json
├── categories-ja/           ← Japanese versions
│   ├── action-cameras-ja.json
│   ├── drones-ja.json
│   └── ...
├── devices.json             ← AUTO-GENERATED (don't edit manually)
└── devices-ja.json          ← AUTO-GENERATED (don't edit manually)
```

## Workflow

### 1. Edit Category Files
Modify individual files in `data/categories/`:
```bash
# Example: Add/edit a drone
data/categories/drones.json
```

Each category file format:
```json
[
  {
    "id": "device-slug",
    "name": "Device Name",
    "category": "Drones",
    "sdCard": { ... },
    "recommendedBrands": [ ... ],
    "faq": [ ... ],
    "relatedDevices": [ ... ]
  }
]
```

### 2. Build Site
Run the build command:
```bash
npm run build:site      # Merges categories → devices.json, generates HTML pages
```

Or for full build with CSS:
```bash
npm run build:all       # CSS + site build for both EN and JA
```

### 3. Merge Process (Automatic)
The `scripts/generator/build.js` automatically:
1. **Reads all `.json` files** from `data/categories/`
2. **Merges them** into a single array
3. **Writes to** `data/devices.json` with metadata
4. **Generates all pages** from the merged data

```javascript
// From build.js (lines 35-80)
function mergeDeviceCategories() {
  const categoryFiles = fs.readdirSync(categoriesPath)
    .filter(f => f.endsWith('.json'))
    .sort();
  
  for (const file of categoryFiles) {
    const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    const devices = Array.isArray(data) ? data : (data.devices || []);
    allDevices = allDevices.concat(devices);
  }
  
  fs.writeFileSync(dataPath, JSON.stringify(output, null, 2));
}
```

## Key Points

- ✅ **Edit category files** in `data/categories/`
- ❌ **Never manually edit** `devices.json` or 'devices-ja.json' (it will be overwritten)
- ✅ **Run `npm run build:site`** after changes
- ✅ Each category file is an **array of device objects** (not wrapped)
- ✅ The build process validates and adds metadata

## Japanese Workflow

Same process for Japanese:
1. Edit `data/categories-ja/drones-ja.json`, etc.
2. Run `npm run build:ja`
3. Merges to `data/devices-ja.json`

## Commands Summary

| Command | Purpose |
|---------|---------|
| `npm run build:site` | Merge EN categories → devices.json, generate HTML |
| `npm run build:ja` | Merge JA categories → devices-ja.json, generate JA pages |
| `npm run build:all` | Full build: CSS + EN + JA |
| `npm run dev` | Watch mode: rebuild on file changes |

## Validation

If you see build errors:
1. Check JSON syntax in category file
2. Ensure `category` field matches expected value
3. Run `npm run build:site` to see detailed errors

## Device Tracker Update

After building, regenerate the tracker:
```bash
node generate-tracker.js
```

This updates `DEVICE_TRACKER.md` with current device counts.
