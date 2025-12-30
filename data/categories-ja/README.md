# Japanese Devices by Category

Split device definitions for easier management and editing.

## Structure

Each category gets its own JSON file (with Japanese category names):
- `アクションカメラ.json` - Action Cameras (アクションカメラ)
- `カメラ.json` - Cameras (カメラ)
- `ドローン.json` - Drones (ドローン)
- `携帯ゲーム機.json` - Gaming Handhelds (携帯ゲーム機)
- `ドライブレコーダー.json` - Dash Cams (ドライブレコーダー)
- `コンピュータ・タブレット.json` - Computing & Tablets (コンピュータ・タブレット)
- `セキュリティカメラ.json` - Security Cameras (セキュリティカメラ)

## Format

Each file contains an array of device objects (no wrapper object):

```json
[
  {
    "id": "device-slug",
    "name": "Device Name",
    "category": "Japanese Category Name (日本語)",
    ...rest of device properties
  }
]
```

## Build Process

Run `npm run build:ja` to:
1. Load all category files from `data/categories-ja/`
2. Merge into `data/devices-ja.json`
3. Generate Japanese pages

The merged devices-ja.json is auto-generated and should not be manually edited.
