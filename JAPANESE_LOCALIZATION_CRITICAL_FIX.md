# Japanese Localization Critical Fix - Related Devices Data Integrity

## Issue Summary

Critical UX and data integrity issues were discovered on the Japanese (ja) locale pages:

### Issue 1: Related Device Links Point to English URLs
**Problem**: On Japanese pages (e.g., `/ja/categories/gaming-handhelds/nintendo-switch-2/`), the "Related" device links at the bottom link to English versions instead of Japanese versions.

**Example**: 
- **Current**: `https://sdcardchecker.com/categories/...`  ❌
- **Expected**: `https://sdcardchecker.com/ja/categories/...` ✅

**Root Cause**: The `generateRelatedDevices()` function in `scripts/generator/helpers.js` was hardcoded to always generate `/devices/` URLs without locale prefix.

**Fix Applied**:
- Modified `generateRelatedDevices()` to accept `isJapanese` parameter
- When `isJapanese=true`, URLs now include `/ja/` prefix
- Updated section heading to Japanese: "関連機器" (Related Devices)
- Updated call site in `generate-device-pages.js` to pass the `isJapanese` flag

### Issue 2: Broken Related Device References in devices-ja.json
**Problem**: The "relatedDevices" field in devices-ja.json was simply copied from devices.json without validation. Since the two datasets have different device lists, many references point to devices that don't exist in the Japanese dataset.

**Impact**: 
- 33 broken references across 27 devices
- Devices would be silently omitted from the "Related" section
- Users would see incomplete/no related device suggestions

**Examples of broken references**:
- Canon EOS R5 → `canon-eos-r3` (doesn't exist in JA)
- Nikon D850 → `nikon-d780`, `canon-eos-5d-mark-iv` (don't exist in JA)
- GoPro Hero 11 Black → `dji-pocket-3` (doesn't exist in JA)
- Eufy Security SoloCam S340 → `wyze-cam-v3`, `viofo-a229-duo`, `nextbase-622gw` (exist in EN but not in JA)

**Dataset Comparison**:
- English (devices.json): **156 devices**
- Japanese (devices-ja.json): **146 devices**
- Devices in EN but not JA: **16** (mostly dashcams)
- Devices in JA but not EN: **6** (including Japanese-specific dashcams)

**Fix Applied**:
- Created validation script `check-related-devices.js` to identify all broken references
- Generated report: `broken-related-devices.json`
- Fixed all 33 broken references in devices-ja.json by removing invalid device IDs
- Script: `fix-related-devices-ja.js`

## Files Modified

1. **scripts/generator/helpers.js** (Line 621)
   - Updated `generateRelatedDevices()` function signature
   - Added `isJapanese` parameter (default: false)
   - Conditionally add `/ja` prefix to device URLs
   - Localize heading: "Related" vs "関連機器"

2. **scripts/generator/generate-device-pages.js** (Line 427)
   - Updated call to `generateRelatedDevices()` to pass `isJapanese` flag

3. **data/devices-ja.json**
   - Removed all 33 broken relatedDevices references
   - Affected 27 devices across multiple categories

## Scripts Created

- **check-related-devices.js**: Validates and reports all broken references
- **fix-related-devices-ja.js**: Automatically removes broken references from devices-ja.json
- **broken-related-devices.json**: Detailed report of issues found

## Next Steps

### Immediate
1. Rebuild the project to apply the fixes:
   ```bash
   npm run build
   ```

2. Test Japanese pages to verify:
   - Related device links now include `/ja/` prefix
   - Related device sections display correctly (will be shorter for some devices)

### Short Term
3. **Add appropriate related devices to devices-ja.json** where removed:
   - Find similar devices that actually exist in the Japanese dataset
   - Use devices from the same category when possible
   - Current categories in JA dataset:
     - アクションカメラ: 13 devices
     - 携帯ゲーム機: 24 devices
     - ドローン: 22 devices
     - カメラ: 57 devices
     - コンピュータ・タブレット: 26 devices
     - セキュリティカメラ: 2 devices
     - ドライブレコーダー: 5 devices
     - その他: 17 devices

4. **Document which devices** are missing in the Japanese dataset:
   - Missing dashcams (16 EN-only devices)
   - Evaluate if these should be added to the Japanese dataset

### Long Term
5. **Establish a process** to keep datasets in sync:
   - When adding devices to devices.json, consider adding to devices-ja.json
   - When modifying relatedDevices, validate against actual dataset
   - Consider a CI/CD check to prevent broken references

## Verification

Run these commands to verify the fixes:

```bash
# Check for any remaining broken references
node check-related-devices.js

# Should show: 0 broken references
```

## Related Issues Fixed

- ✅ Japanese pages now link to other Japanese pages
- ✅ Related device sections no longer have broken references
- ✅ Data integrity validated across both datasets
