# devices.json Refactoring Mapping

## Overview
This document maps all required changes to devices.json:
1. Replace "No minimum required" with practical minimums
2. Add `minAppPerformance` field to devices that need it
3. Clean up type field formatting

---

## Action Items by Category

### ACTION CAMERAS
| Device | Current minSpeed | New minSpeed | minAppPerformance | Notes |
|--------|-----------------|-------------|-------------------|-------|
| GoPro Hero 13 | V30 | V30 | ❌ None | ✓ No change |
| GoPro Hero 12 | V30 | V30 | ❌ None | ✓ No change |
| GoPro Hero Max | V30 | V30 | ❌ None | ✓ No change |
| GoPro Hero 11 Black | V30 | V30 | ❌ None | ✓ No change |
| Insta360 X3 | V30 | V30 | ❌ None | ✓ No change |
| DJI Osmo Action 4 | V30 | V30 | ❌ None | ✓ No change |

### DRONES
| Device | Current minSpeed | New minSpeed | minAppPerformance | Notes |
|--------|-----------------|-------------|-------------------|-------|
| DJI Mini 4 Pro | V30 | V30 | ❌ None | ✓ No change |
| DJI Mini 3 Pro | V30 | V30 | ❌ None | ✓ No change |
| DJI Air 3S | V30 | V30 | ❌ None | ✓ No change |

### GAMING HANDHELDS (Low Demand)
| Device | Current minSpeed | New minSpeed | minAppPerformance | Notes |
|--------|-----------------|-------------|-------------------|-------|
| Nintendo Switch | No minimum required | **Class 10 / U1** | ❌ None | U1 is Nintendo's official recommendation |
| Nintendo Switch OLED | No minimum required | **Class 10 / U1** | ❌ None | Same as original |
| Nintendo Switch Lite | No minimum required | **Class 10 / U1** | ❌ None | Same as original |
| Nintendo 3DS | Class 4 | **Class 10** | ❌ None | Class 4 is obsolete; Class 10 is practical minimum |
| New Nintendo 3DS XL | Class 4 | **Class 10** | ❌ None | Class 4 is obsolete; Class 10 is practical minimum |

### GAMING HANDHELDS (High Demand for Apps)
| Device | Current minSpeed | New minSpeed | minAppPerformance | Notes |
|--------|-----------------|-------------|-------------------|-------|
| Steam Deck | V30 | V30 | **A1** | Apps/OS performance matters more than video speed |
| ROG Ally | V30 (likely) | V30 | **A1** | Gaming + Windows app performance |
| ROG Ally X | V30 (likely) | V30 | **A1** | Same as ROG Ally |
| Anbernic RG353V | No minimum required | **Class 10 / U1** | **A1** | Retro emulation (low speed) + OS (needs A1) |
| Miyoo Mini Plus | No minimum required | **Class 10 / U1** | **A1** | Same profile as RG353V |
| Retroid Pocket 3+ | No minimum required | **Class 10 / U1** | **A1** | Same profile as RG353V |

### CAMERAS
| Device | Current minSpeed | New minSpeed | minAppPerformance | Notes |
|--------|-----------------|-------------|-------------------|-------|
| Canon EOS R5 | V60 | V60 | ❌ None | ✓ No change |
| Canon EOS R6 Mark II | V60 | V60 | ❌ None | ✓ No change |
| Canon EOS R3 | V90 | V90 | ❌ None | ✓ No change |
| Sony A6700 | V30 | V30 | ❌ None | ✓ No change |
| Sony A7 IV | V60 | V60 | ❌ None | ✓ No change |
| Fujifilm X-S20 | V30 | V30 | ❌ None | ✓ No change |
| Nikon Z9 | V90 | V90 | ❌ None | ✓ No change |

### TABLETS / COMPUTING
| Device | Current minSpeed | New minSpeed | minAppPerformance | Notes |
|--------|-----------------|-------------|-------------------|-------|
| iPad Pro 12.9 | No minimum required | **Class 10 / U1** | **A2** | App performance critical for premium tablet |
| iPad Air | No minimum required | **Class 10 / U1** | **A1** | Standard app performance sufficient |
| Samsung Galaxy Tab S9 | No minimum required | **U3 / V30** | **A2** | Records 4K video; requires V30 |
| Amazon Fire Max 11 | No minimum required | **U3 / V30** | **A2** | Records 4K video; requires V30 |
| Amazon Fire HD 10 | No minimum required | **Class 10 / U1** | **A1** | Video playback only; basic app performance |
| HP Chromebook 14 | Class 10 / V10 recommended | **Class 10 / U1** | **A1** | Move recommendation out of minSpeed field |
| Raspberry Pi 4 | No minimum required | **Class 10 / U1** | **A1** | OS boot/app performance is critical |
| Raspberry Pi 5 | A1 or A2 rated | **Class 10 / U1** | **A2** | Split: speed class separate from app class |
| Surface Go 3 | No minimum required | **Class 10 / U1** | **A2** | Windows tablet needs app performance |

### SECURITY CAMERAS
| Device | Current minSpeed | New minSpeed | minAppPerformance | Notes |
|--------|-----------------|-------------|-------------------|-------|
| Wyze Cam v3 | No minimum required | **Class 10 / U1** | ❌ None | Continuous recording (low bitrate) |
| Reolink RLC-810A | Class 10 | Class 10 | ❌ None | ✓ No change |

---

## Type Field Cleanup

### Devices requiring type field adjustment:
| Device | Current type | Issue | Action |
|--------|-------------|-------|--------|
| Wyze Cam v3 | "microSD (FAT32 or exFAT)" | File system in type | Remove "(FAT32 or exFAT)" → move to notes |
| Steam Deck | "microSD UHS-I (not UHS-II)" | Confusing phrasing | Change to "microSD UHS-I" → add to notes |
| Anbernic RG353V | "Dual microSD (separate slots for OS and games)" | Too long | Change to "Dual microSD" → move explanation to whySpecs |

---

## Summary of Changes

### Counts by Action:
- **minSpeed replacements:** 13 devices (Nintendo/retro + tablets)
- **minAppPerformance additions:** 15 devices (tablets + gaming handhelds)
- **Type field cleanups:** 3 devices
- **No changes needed:** 28 devices

### Total devices affected: ~31

### Data integrity check:
- All minSpeed values will use consistent format: `Class X`, `U1`, `U3`, `V30`, `V60`, `V90`
- All minAppPerformance values will use: `A1` or `A2`
- No "No minimum required" entries will remain

---

## Implementation Order

1. **Phase 1:** Replace all "No minimum required" entries (13 replacements)
2. **Phase 2:** Add minAppPerformance field to applicable devices (15 additions)
3. **Phase 3:** Clean up type field formatting (3 fixes)
4. **Phase 4:** Test build and verify HTML output

---

## Next Steps

1. Review this mapping
2. Confirm any device categorization disagreements
3. Approve for execution
4. Run data refactor script OR manual edits

