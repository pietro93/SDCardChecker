# Translation Quick Reference - What Needs Translating

## TL;DR - The 3 Critical Files

These files are displayed on every Japanese device page and need translation NOW:

### 1. **`data/sdcards.json`** - SD CARD PRODUCT INFO
**Why:** Appears in recommendation table on every device page  
**Field:** `"pros"` - Product benefits/features  
**Size:** 50-100 entries  
**Example:**
```json
"pros": "Professional standard for weddings and cinema."
```
Should be:
```json
"pros": "ウェディングとシネマ撮影の業界標準。"
```

---

### 2. **`data/devices-ja.json`** - DEVICE FAQ ANSWERS
**Why:** "よくある質問" section appears on every device page  
**Fields:** `"faq"` array → `"q"` (question) and `"a"` (answer)  
**Size:** 700-1000 FAQ items  
**Example:**
```json
"q": "Is the Lumix S9 a good camera for vlogging?",
"a": "Yes, the Lumix S9 is specifically designed..."
```
Should be:
```json
"q": "Lumix S9はブログに適したカメラですか？",
"a": "はい、Lumix S9はパナソニックの最もコンパクトなフルフレームカメラとして..."
```

---

### 3. **`data/devices-ja.json`** - DEVICE NOTES
**Why:** Provides device context (lower priority but visible)  
**Field:** `"notes"` and potentially `"whySpecs"`  
**Size:** 140 entries  
**Example:**
```json
"notes": "Released in 2024, the Lumix S9 is a significant new entry..."
```
Should be:
```json
"notes": "2024年にリリースされたLumix S9は、コンテンツクリエイター向けの重要な新製品です..."
```

---

## The Next 3 Files (Lower Priority)

### 4. **`data/amazon-cache/*.json`** - AMAZON PRODUCT DATA
**Why:** Optional - only if Amazon badges enabled for Japan  
**Problem:** Amazon API returns English, would need custom integration  
**Recommendation:** Skip for now OR create Japanese product filter

### 5. **`data/calculator-content.json`** - CALCULATOR TEXT
**Why:** Only visible if calculators used on Japanese site  
**Recommendation:** Translate if calculators are primary feature for Japan

### 6. **`data/sdCardReaders.json`** - SD CARD READERS
**Why:** Only if SD Card Readers category enabled for Japan  
**Recommendation:** Translate later if category is enabled

---

## Files That Are ALREADY TRANSLATED ✅

These files already have proper Japanese localization:
- ✅ `src/templates/device-ja.html` - Device page template
- ✅ `src/templates/components-ja.js` - Navigation, headers, footers
- ✅ `scripts/generator/generate-device-pages.js` - UI labels (requirements box, specs grid, table headers)
- ✅ `scripts/generator/helpers.js` - Spec labels, table labels
- ✅ Individual device files like `src/templates/guides/*-ja.html`

---

## Translation Checklist

For each of the 3 critical files:

### Translating `sdcards.json`:
- [ ] Search for all `"pros":` entries
- [ ] Translate to Japanese (maintain concise phrasing)
- [ ] Verify special characters work
- [ ] Test on 3 device pages
- [ ] Deploy and verify on production

### Translating `devices-ja.json` FAQ:
- [ ] Identify which devices have English FAQ (most do)
- [ ] Translate `"q"` (question) to Japanese
- [ ] Translate `"a"` (answer) to Japanese
- [ ] Preserve HTML tags like `<b>`, `<li>`, etc.
- [ ] Test on multiple device pages
- [ ] Verify FAQ accordion works with longer Japanese text

### Translating `devices-ja.json` notes:
- [ ] Find all `"notes":` entries
- [ ] Translate to Japanese
- [ ] Update any `"whySpecs":` still in English
- [ ] Verify no URLs or code snippets are broken

---

## How to Find These Sections in the Files

### In `data/sdcards.json`:
```bash
Search for: "pros":
Replace pattern: "pros": "English text here"
```

### In `data/devices-ja.json`:
```bash
Search for: "faq": [
Then look for: "q": "English question"
              "a": "English answer"
```

### In `data/devices-ja.json`:
```bash
Search for: "notes": "English text
Or:        "whySpecs": "English text
```

---

## Translation Examples

### SD Card `pros` field:
| English | Japanese |
|---------|----------|
| Professional standard for weddings and cinema. | ウェディングとシネマ撮影の業界標準。 |
| Cheapest entry into UHS-II. | UHS-IIへの最も安い入門。 |
| Indestructible one-piece mold. Fastest write speeds. | 壊れない一体成型。最速の書き込み速度。 |
| Great for action sports and 4K video. | アクションスポーツと4Kビデオに最適。 |

### Device FAQ examples:
| English | Japanese |
|---------|----------|
| What SD Card Do I Need for Canon EOS R5? | Canon EOS R5にはどのSDカードが必要ですか？ |
| Is the Sony A7 IV good for video? | Sony A7 IVはビデオに適していますか？ |
| The device supports up to 2TB cards. | デバイスは最大2TBのカードに対応しています。 |

### Device notes examples:
| English | Japanese |
|---------|----------|
| Flagship professional camera released in 2020. | 2020年にリリースされたプロフェッショナルカメラのフラッグシップ。 |
| Entry-level DSLR perfect for beginners. | 初心者向けのエントリーレベルDSLR。 |
| Compact mirrorless with excellent stabilization. | 優れた安定化機能を備えたコンパクトミラーレス。 |

---

## Important Notes When Translating

1. **Keep brand names in English:** SanDisk, Canon, Nikon, Sony - these should NOT be translated
2. **Keep technical specs as-is:** V60, V90, UHS-II, MB/s - standard terminology
3. **Preserve HTML tags:** `<b>`, `<li>`, `<ul>` must stay intact
4. **Check character encoding:** Use UTF-8, test Japanese punctuation (、。)
5. **Verify length:** Japanese text is often longer - check mobile layout doesn't break
6. **Test on actual page:** View on https://sdcardchecker.com/ja/ after deployment

---

## Status Summary

| File | Priority | Status | Est. Time |
|------|----------|--------|-----------|
| sdcards.json `pros` | **HIGH** | ❌ Not started | 2-4 hrs |
| devices-ja.json `faq` | **HIGH** | ❌ 20% done | 4-8 hrs |
| devices-ja.json `notes` | MEDIUM | ❌ Not started | 1-2 hrs |
| amazon-cache/*.json | LOW | ⏸ Blocked on API | 1-3 hrs |
| calculator-content.json | LOW | ⏸ Depends on usage | 1-2 hrs |
| sdCardReaders.json | LOW | ⏸ Depends on category | 1 hr |

---

## Next Steps

1. ✅ [DONE] Localize UI elements and template labels
2. ⏭️ [NEXT] Translate `sdcards.json` `pros` field (quick win, high impact)
3. ⏭️ [NEXT] Translate `devices-ja.json` FAQ questions and answers (bulk work)
4. ⏭️ [NEXT] Translate `devices-ja.json` notes (can batch in spare time)
5. ⏭️ [OPTIONAL] Set up Amazon product filtering or translation
6. ⏭️ [OPTIONAL] Translate calculator content (if needed)
