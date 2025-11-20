# devices.json Refactoring - Execution Plan

## Critical Changes Needed (5 devices with "No minimum required")

### 1. Nintendo Switch (Line 121)
**Current:**
```json
"minSpeed": "No minimum required",
"minWriteSpeed": "Not specified",
```
**Change to:**
```json
"minSpeed": "Class 10 / U1",
"minWriteSpeed": "Not specified",
```
**Rationale:** Nintendo officially recommends UHS-I cards. Class 10 is the practical minimum.

---

### 2. Nintendo Switch OLED (Line 176)
**Current:**
```json
"minSpeed": "No minimum required",
"minWriteSpeed": "Not specified",
```
**Change to:**
```json
"minSpeed": "Class 10 / U1",
"minWriteSpeed": "Not specified",
```
**Rationale:** Identical to original Switch.

---

### 3. Nintendo Switch Lite (Line 741)
**Current:**
```json
"minSpeed": "No minimum required",
"minWriteSpeed": "Not specified",
```
**Change to:**
```json
"minSpeed": "Class 10 / U1",
"minWriteSpeed": "Not specified",
```
**Rationale:** Identical to original Switch.

---

### 4. Samsung Galaxy Tab S9 (Line 957)
**Current:**
```json
"minSpeed": "No minimum required",
"minWriteSpeed": "Not specified",
"whySpecs": "...While there is no minimum speed requirement, a U3/V30 card is recommended for smooth 4K video playback..."
```
**Change to:**
```json
"minSpeed": "U3 / V30",
"minWriteSpeed": "30 MB/s",
"minAppPerformance": "A2",
"whySpecs": "The Galaxy Tab S9 records 4K video, which requires V30 sustained write speed and A2 app performance rating for reliable file transfers and OS performance..."
```
**Rationale:** Device records 4K video → V30 is required, not optional. Tablet needs app performance. Contradiction between minSpeed and whySpecs is resolved.

---

### 5. HP Chromebook 14 (Line 1581)
**Current:**
```json
"minSpeed": "No minimum required (Class 10 / V10 recommended)",
"minWriteSpeed": "10 MB/s",
```
**Change to:**
```json
"minSpeed": "Class 10 / U1",
"minWriteSpeed": "Not specified",
"minAppPerformance": "A1",
```
**Rationale:** Move "recommended" out of minSpeed field. Chromebook uses cloud storage primarily, so U1 is sufficient. A1 handles basic app performance.

---

## Additional Changes to Implement

### Add minAppPerformance to existing devices:

**Tablets/High-Performance Devices:**

1. **iPad Pro 12.9** (if in dataset)
   - Add: `"minAppPerformance": "A2"`

2. **iPad Air** (if in dataset)
   - Add: `"minAppPerformance": "A1"`

3. **Amazon Fire Max 11** (if in dataset)
   - Add: `"minAppPerformance": "A2"`

4. **Amazon Fire HD 10** (if in dataset)
   - Add: `"minAppPerformance": "A1"`

5. **Steam Deck** (if in dataset)
   - Verify: `"minSpeed": "V30"`
   - Add: `"minAppPerformance": "A1"`

6. **ROG Ally** (if in dataset)
   - Verify: `"minSpeed": "V30"`
   - Add: `"minAppPerformance": "A1"`

7. **Raspberry Pi 5** (if in dataset)
   - Current: `"minSpeed": "A1 or A2 rated"`
   - Change to: `"minSpeed": "Class 10"` and `"minAppPerformance": "A2"`

8. **Raspberry Pi 4** (if in dataset)
   - Add: `"minAppPerformance": "A1"`

9. **Anbernic RG353V** (if in dataset)
   - Verify: `"minSpeed": "Class 10 / U1"`
   - Add: `"minAppPerformance": "A1"`

---

## Type Field Cleanups

### 1. Wyze Cam v3
**Current:** `"type": "microSD (FAT32 or exFAT)"`
**Change to:** `"type": "microSD"`
**Action:** Move file system info to notes/whySpecs

### 2. Steam Deck (if present)
**Current:** `"type": "microSD UHS-I (not UHS-II)"`
**Change to:** `"type": "microSD UHS-I"`
**Action:** Update notes to clarify UHS-II compatibility

### 3. Anbernic RG353V (if present)
**Current:** `"type": "Dual microSD (separate slots for OS and games)"`
**Change to:** `"type": "Dual microSD"`
**Action:** Move slot explanation to whySpecs

---

## Implementation Strategy

### Option A: Manual (Safe, Slower)
Edit devices.json directly using VS Code find/replace with these patterns:

1. Find: `"minSpeed": "No minimum required",`
   Replace with device-specific values per the 5 devices above

2. Add minAppPerformance field after minWriteSpeed for each applicable device

3. Clean up 3 type field entries

### Option B: Script-Based (Fast, Requires Testing)
Create a Node.js script to:
- Parse devices.json
- Apply the 5 specific replacements
- Add minAppPerformance to the list of devices
- Clean up type fields
- Write back to devices.json

**Recommendation:** Start with Option A (manual) to validate logic, then automate if more devices need similar changes in the future.

---

## Verification Steps

After changes:
1. `npm run build` to generate pages
2. Check one device from each category in dist/ to verify Requirements Box renders correctly
3. Verify minAppPerformance displays only when present
4. Check that no "No minimum required" entries remain
5. Validate JSON syntax (no trailing commas, proper quotes)

---

## Ready to Execute?

✓ All 5 critical devices identified
✓ All minAppPerformance additions mapped
✓ All type field cleanups identified
✓ HTML generator already updated to handle minAppPerformance

**Next step:** Approve this plan, and I'll execute the changes.

