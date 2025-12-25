# Japanese FAQ Translation Workflow

## 🎯 Goal
Translate 182 FAQ items in `data/devices-ja.json` from English to Japanese in 2-3 hours using ChatGPT.

---

## ⚡ Quick Start (5 minutes)

### Step 1: Check Current Status
```bash
node scripts/translator-batch.js --status
```

Output will show:
- ✅ Translated: 1 (1%)
- ❌ Need translation: 182 (99%)

### Step 2: Open the FAQ List
Open this file: `FAQLIST_FOR_TRANSLATION.txt`

It contains example FAQs from top devices ready for translation.

---

## 🔄 Translation Workflow (Repeat for each FAQ)

### For Each FAQ Item:

#### 1️⃣ COPY (From FAQLIST_FOR_TRANSLATION.txt)
```
Q: Can I use a full-size SD card with an adapter?
A: <b>No, the GoPro Hero 13 Black only accepts microSD cards.</b> Full-size SD cards will not work even with an adapter. The camera's card slot is specifically designed for microSD format only.
```

#### 2️⃣ PASTE INTO CHATGPT with this Prompt:
```
Translate these FAQ Q&A pairs to Japanese.

RULES:
- Keep HTML tags like <b>, <li>, <ul> exactly as-is
- Keep technical terms in English: V30, V60, V90, UHS-II, MB/s, microSD, GB, 4K
- Keep brand names in English: SanDisk, Canon, Nikon, Sony, Kingston, Lexar
- Keep device names in English
- Use polite Japanese (です/ます form)
- Use Japanese punctuation: 、 (comma) and 。 (period)
- Be concise, match the length of the English version

Translate:

Q: Can I use a full-size SD card with an adapter?
A: <b>No, the GoPro Hero 13 Black only accepts microSD cards.</b> Full-size SD cards will not work even with an adapter. The camera's card slot is specifically designed for microSD format only.
```

#### 3️⃣ COPY ChatGPT Output:
```
Q: フルサイズSDカードをアダプターで使用できますか？
A: <b>いいえ、GoPro Hero 13 BlackはmicroSDカードのみに対応しています。</b>フルサイズSDカードはアダプターを使用しても機能しません。カメラのカードスロットはmicroSD形式専用に設計されています。
```

#### 4️⃣ FIND IN data/devices-ja.json
Search for: `"Can I use a full-size SD card with an adapter?"`

Replace with:
```json
{
  "q": "フルサイズSDカードをアダプターで使用できますか？",
  "a": "<b>いいえ、GoPro Hero 13 BlackはmicroSDカードのみに対応しています。</b>フルサイズSDカードはアダプターを使用しても機能しません。カメラのカードスロットはmicroSD形式専用に設計されています。"
}
```

#### 5️⃣ MOVE TO NEXT FAQ
Repeat for the next 181 FAQs

---

## 📋 Batching Strategy (FASTEST)

Instead of translating one at a time, batch 3-5 FAQs per ChatGPT prompt:

### Batch Prompt Template:
```
Translate these 3 FAQ pairs to Japanese. Follow these rules:
- Keep HTML tags (<b>, <li>, <ul>) exactly as-is
- Keep technical terms in English: V30, V60, V90, UHS-II, MB/s, microSD
- Keep brand and device names in English
- Use polite Japanese (です/ます form)
- Use Japanese punctuation: 、 (comma) and 。 (period)

ITEM 1:
Q: Can I use a full-size SD card with an adapter?
A: <b>No, the GoPro Hero 13 Black only accepts microSD cards.</b> Full-size SD cards will not work even with an adapter.

ITEM 2:
Q: What's the fastest microSD card for the Hero 13?
A: <b>The fastest cards available are rated for up to 300 MB/s read speeds.</b> However, the Hero 13 has limited internal write speeds, so you won't see the full speed of ultra-premium cards.

ITEM 3:
Q: Can I use cards older than 5 years?
A: <b>Older microSD cards may work, but we don't recommend them.</b> Cards manufactured 5+ years ago may have degraded performance.
```

Then copy all 3 translations at once and paste into the file.

---

## 📊 Estimated Progress

### Batch 1 (GoPro Hero 13 + Nintendo Switch): 6 FAQs
- Time: 20 minutes
- Progress: 3%

### Batch 2 (DJI Mini 4 Pro + Canon EOS R5 + Nikon D850): 9 FAQs  
- Time: 30 minutes
- Progress: 8%

### Batch 3 (Orange Pi 5 + Lenovo Legion Go + GoPro Max 2): 9 FAQs
- Time: 30 minutes
- Progress: 13%

### Batch 4-8 (Remaining 159 FAQs)
- Time: 90 minutes
- Progress: 100%

**Total Time: ~3 hours**

---

## 🛠️ Edit data/devices-ja.json Efficiently

### Method 1: Use Find & Replace (FASTEST)

In VS Code:
1. Press `Ctrl+H` (Find & Replace)
2. Find: `"q": "Can I use a full-size SD card with an adapter?"`
3. Replace with: `"q": "フルサイズSDカードをアダプターで使用できますか？"`
4. Click "Replace All"

Repeat for each FAQ.

### Method 2: Manual Edit (SLOWER but more accurate)

1. Open `data/devices-ja.json`
2. Search for the English question (Ctrl+F)
3. Replace the `"q"` and `"a"` values with Japanese
4. Save (Ctrl+S)

### Method 3: Scripted Import (IF using CSV)

```bash
# Export untranslated to CSV
node scripts/translator-batch.js --csv

# Open faq-to-translate.csv
# Translate in Google Sheets or Excel
# Save as CSV

# Import back (script needed)
# npm run import-translations -- faq-translated.csv
```

---

## ✅ Verification Checklist

After translating each batch:

1. **Visual Check:**
   - [ ] No `<b>` or `<li>` tags are broken
   - [ ] Japanese characters display correctly
   - [ ] No garbled text

2. **Content Check:**
   - [ ] Question in Japanese makes sense
   - [ ] Answer in Japanese makes sense
   - [ ] Technical terms are still in English (V60, V90, MB/s)
   - [ ] Brand names still in English (SanDisk, Canon)

3. **Build Check:**
   ```bash
   npm run build:ja
   ```
   - [ ] No build errors
   - [ ] All 140 device pages generated successfully

4. **Live Check:**
   - [ ] Open https://sdcardchecker.com/ja/categories/action-cameras/gopro-hero-13/
   - [ ] FAQ section shows translated questions
   - [ ] FAQ answers are fully visible
   - [ ] No English text visible

---

## 🚀 Deploy After Translation

Once all FAQs are translated:

```bash
# 1. Build the site
npm run build:ja

# 2. Test locally
npm run dev
# Visit http://localhost:3000/ja/

# 3. Test a few device pages
# - https://localhost:3000/ja/categories/action-cameras/gopro-hero-13/
# - https://localhost:3000/ja/categories/gaming-handhelds/nintendo-switch/
# - https://localhost:3000/ja/categories/cameras/canon-eos-r5/

# 4. Check for errors in console

# 5. Deploy to production
git add data/devices-ja.json
git commit -m "chore: translate 182 FAQ items to Japanese"
git push

# 6. Trigger production build on Vercel
# (automatic on push or manual trigger)
```

---

## 📈 Progress Tracking

### Track your progress:

| Batch | Device | FAQs | Est. Time | ✅ Done |
|-------|--------|------|-----------|---------|
| 1 | GoPro Hero 13 | 3 | 10 min | ❌ |
| 1 | Nintendo Switch | 3 | 10 min | ❌ |
| 2 | DJI Mini 4 Pro | 3 | 10 min | ❌ |
| 2 | Canon EOS R5 | 3 | 10 min | ❌ |
| 2 | Nikon D850 | 3 | 10 min | ❌ |
| 3 | Orange Pi 5 | 3 | 10 min | ❌ |
| 3 | Lenovo Legion Go | 3 | 10 min | ❌ |
| 3 | GoPro Max 2 | 3 | 10 min | ❌ |
| 4-8 | Remaining | 146 | 90 min | ❌ |
| | **TOTAL** | **182** | **~3 hrs** | |

---

## 💡 Pro Tips

### 1. Batch Similar Devices
- Translate all camera FAQs together (similar terminology)
- Then all gaming handhelds together
- Then all drones together

### 2. Build After Every 50 FAQs
```bash
npm run build:ja
```
To catch JSON errors early

### 3. Use ChatGPT "Templates"
After first few translations, you'll have a pattern. Reuse phrases:
- "にはどのSDカードが必要ですか？" (What SD card is needed for X?)
- "は...に適していますか？" (Is X good for...?)
- "V{speed}で十分ですか？" (Is V{speed} enough?)

### 4. Review Common Mistakes
When ChatGPT mistranslates:
- Broken HTML tags
- Translated technical terms (V60 → ブイロクジュウ instead of V60)
- Translated brand names

### 5. Use Find/Replace in VS Code
After getting ChatGPT output, use Find & Replace to update all instances at once.

---

## 🎓 Example: Complete One FAQ

### START: English FAQ
```json
{
  "id": "gopro-hero-13-black",
  "name": "GoPro Hero 13 Black",
  "faq": [
    {
      "q": "Can I use a full-size SD card with an adapter?",
      "a": "<b>No, the GoPro Hero 13 Black only accepts microSD cards.</b> Full-size SD cards will not work even with an adapter. The camera's card slot is specifically designed for microSD format only."
    }
  ]
}
```

### TRANSLATE (ChatGPT):
Input:
```
Translate to Japanese, keep <b> tags:
Q: Can I use a full-size SD card with an adapter?
A: <b>No, the GoPro Hero 13 Black only accepts microSD cards.</b> Full-size SD cards will not work even with an adapter. The camera's card slot is specifically designed for microSD format only.
```

Output:
```
Q: フルサイズSDカードをアダプターで使用できますか？
A: <b>いいえ、GoPro Hero 13 BlackはmicroSDカードのみに対応しています。</b>フルサイズSDカードはアダプターを使用しても機能しません。カメラのカードスロットはmicroSD形式専用に設計されています。
```

### RESULT: Translated FAQ
```json
{
  "id": "gopro-hero-13-black",
  "name": "GoPro Hero 13 Black",
  "faq": [
    {
      "q": "フルサイズSDカードをアダプターで使用できますか？",
      "a": "<b>いいえ、GoPro Hero 13 BlackはmicroSDカードのみに対応しています。</b>フルサイズSDカードはアダプターを使用しても機能しません。カメラのカードスロットはmicroSD形式専用に設計されています。"
    }
  ]
}
```

---

## ⏱️ Time Estimate Breakdown

- **Batch prompting (6 FAQs at a time):** 30 batches × 5 min = 2.5 hours
- **Pasting into file:** 30 × 2 min = 1 hour  
- **Build + verification:** 30 min
- **Buffer:** 15 min
- **Total: ~4-5 hours** (conservative estimate)

**Optimized estimate: 2-3 hours** if you batch efficiently

---

## 🎉 When Complete

After translating all 182 FAQs:

✅ Japanese site will be **95% localized**
✅ Device pages will show fully translated content
✅ FAQ sections will be in Japanese
✅ Users won't see any English text

Remaining 5% (optional):
- Device "notes" fields (less visible)
- Device "whySpecs" (1-2 sentences, less critical)
- Amazon product titles (if enabled)

---

## 📞 Questions?

Refer to:
- `FAQ_TRANSLATION_GUIDE.md` - Translation patterns and rules
- `TRANSLATION_STATUS_SUMMARY.md` - Current status overview
- `FAQLIST_FOR_TRANSLATION.txt` - Ready-to-translate FAQ examples
