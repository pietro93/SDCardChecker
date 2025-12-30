# Devices by Category

Split device definitions for easier management and editing.

## Structure

Each category gets its own JSON file:
- `cameras.json` - DSLRs, mirrorless, cinema cameras
- `action-cameras.json` - GoPro, DJI Action, etc.
- `drones.json` - DJI, Autel, Parrot, etc.
- `gaming-handhelds.json` - Nintendo Switch, Steam Deck, Retro Handhelds, etc.
- `dash-cams.json` - Dash camera recorders
- `computing-tablets.json` - Tablets, Chromebooks
- `security-cameras.json` - Security surveillance
- `audio-hi-fi.json` - Digital Audio Players, portable recorders

## Format

Each file contains an array of device objects (no wrapper object):

```json
[
  {
    "id": "device-slug",
    "name": "Device Name",
    "category": "Category Name",
    ...rest of device properties
  }
]
```

## Build Process

Run `npm run build:devices` to:
1. Load all category files from `data/categories/`
2. Merge into single `data/devices.json` 
3. Validate structure
4. Generate pages

The merged devices.json is auto-generated and should not be manually edited.
