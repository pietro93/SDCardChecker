# Device Management Guide

Split devices.json into separate category files for easier editing and management.

## Quick Start

### 1. Extract Category (One-time setup)

To extract all devices from a category into a separate file:

```bash
npm run extract-category "Category Name"
```

Examples:
```bash
npm run extract-category "Audio & Hi-Fi"
npm run extract-category "Cameras"
npm run extract-category "Gaming Handhelds"
```

This creates files like:
- `data/categories/audio-and-hi-fi.json`
- `data/categories/cameras.json`
- `data/categories/gaming-handhelds.json`

### 2. Edit Category Files

Edit devices directly in the category files:
- `data/categories/action-cameras.json`
- `data/categories/audio-and-hi-fi.json`
- `data/categories/cameras.json`
- `data/categories/computing-and-tablets.json`
- `data/categories/dash-cams.json`
- `data/categories/gaming-handhelds.json`
- `data/categories/security-cameras.json`

Each file is a JSON array of device objects:

```json
[
  {
    "id": "device-id",
    "name": "Device Name",
    "category": "Category Name",
    "slug": "device-slug",
    "searchTerms": ["term1", "term2"],
    "sdCard": {
      "type": "microSD",
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

### 3. Merge Changes Back

After editing category files, rebuild devices.json:

```bash
npm run build:devices
```

This:
- Reads all files from `data/categories/`
- Validates each device
- Merges into `data/devices.json`
- Adds metadata (counts, categories, timestamp)

### 4. Rebuild Site

Then rebuild the entire site:

```bash
npm run build:all
```

## Workflow Example

### Add a new device to Audio & Hi-Fi

1. Open `data/categories/audio-and-hi-fi.json`
2. Add your device object to the array:
   ```json
   {
     "id": "sony-nw-a300",
     "name": "Sony Walkman NW-A300",
     "category": "Audio & Hi-Fi",
     "slug": "sony-nw-a300",
     "searchTerms": ["sony walkman", "nw-a300", "portable player"],
     "sdCard": { ... },
     ...
   }
   ```
3. Save the file
4. Run `npm run build:devices` to merge
5. Run `npm run build:all` to regenerate site

### Edit an existing device

1. Find the device in its category file
2. Update fields as needed
3. Save the file
4. Run `npm run build:devices` and then `npm run build:all`

## Directory Structure

```
data/
├── devices.json                    (auto-generated - DO NOT EDIT)
└── categories/
    ├── README.md                   (this directory info)
    ├── action-cameras.json
    ├── audio-and-hi-fi.json
    ├── cameras.json
    ├── computing-and-tablets.json
    ├── dash-cams.json
    ├── gaming-handhelds.json
    └── security-cameras.json
```

## Scripts

### `npm run extract-category "Name"`
Extract all devices from a category into a separate file

### `npm run build:devices`
Merge all category files into `data/devices.json`

### `npm run build:all`
Full rebuild: CSS + site + Japanese + generate all pages

## Notes

- **Never manually edit `data/devices.json`** - it's auto-generated
- Each category file must be valid JSON
- Devices should have unique `id` values
- The `category` field in each device MUST match the actual category name (e.g., "Audio & Hi-Fi")
- After adding/editing devices, always run `npm run build:devices` before rebuilding the site
- The merge script validates all devices and warns about missing required fields

## Validation

The merge script validates:
- ✅ All required fields present (id, name, category, slug)
- ✅ No duplicate device IDs
- ✅ Valid JSON structure
- ✅ File encodings

If you see warnings, fix them in the category file and re-run `npm run build:devices`.
