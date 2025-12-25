# 🇯🇵 START HERE: Japanese FAQ Translation

## The Situation

Your Japanese site is **~45% localized**. Here's what's left:

| What | Status | Time to Fix |
|------|--------|------------|
| UI/Templates | ✅ DONE | — |
| SD Card Data | ✅ DONE | — |
| Device FAQ Questions & Answers | ❌ 99% ENGLISH | **2-3 hours** |
| Device Notes/whySpecs | ❌ 99% ENGLISH | 30 min (optional) |

---

## What You Need to Do

**Translate 182 FAQ items from English to Japanese using ChatGPT**

That's it. 2-3 hours of work = 95% complete Japanese website.

---

## 5-Minute Quick Start

### Step 1: Open ChatGPT
https://chat.openai.com

### Step 2: Copy/Paste This Prompt
```
Translate these FAQ Q&A pairs to Japanese. 

RULES:
- Keep HTML tags like <b>, <li>, <ul> exactly as-is
- Keep technical terms in English: V30, V60, V90, UHS-II, MB/s, microSD, GB, 4K
- Keep brand names in English: SanDisk, Canon, Nikon, Sony
- Keep device names in English  
- Use polite Japanese (です/ます form)
- Use Japanese punctuation: 、 (comma) and 。 (period)

Translate:

Q: Can I use a full-size SD card with an adapter?
A: <b>No, the GoPro Hero 13 Black only accepts microSD cards.</b> Full-size SD cards will not work even with an adapter. The camera's card slot is specifically designed for microSD format only.
```

### Step 3: Copy ChatGPT Output
```
Q: フルサイズSDカードをアダプターで使用できますか？
A: <b>いいえ、GoPro Hero 13 BlackはmicroSDカードのみに対応しています。</b>フルサイズSDカードはアダプターを使用しても機能しません。カメラのカードスロットはmicroSD形式専用に設計されています。
```

### Step 4: Find & Replace in VS Code
- Open `data/devices-ja.json`
- Press `Ctrl+H` (Find & Replace)
- Find: `Can I use a full-size SD card with an adapter?`
- Replace: `フルサイズSDカードをアダプターで使用できますか?`
- Do the same for the answer

### Step 5: Repeat 181 More Times
- One FAQ takes ~1 minute (copy, paste, replace)
- 182 FAQs = ~3 hours total
- Or batch 3-5 FAQs per ChatGPT prompt = ~2 hours

### Step 6: Test & Deploy
```bash
npm run build:ja
```

---

## Files to Help You

I've created these documents to guide you:

1. **`TRANSLATION_WORKFLOW.md`** ⭐ START HERE
   - Step-by-step instructions
   - Batching strategies
   - Efficiency tips

2. **`FAQLIST_FOR_TRANSLATION.txt`**
   - Ready-to-copy FAQ examples
   - Top 10 devices prioritized
   - Start with Batch 1 (6 items)

3. **`FAQ_TRANSLATION_GUIDE.md`**
   - Common translation patterns
   - Example translations
   - HTML tag preservation rules

4. **`TRANSLATION_STATUS_SUMMARY.md`**
   - Overall progress overview
   - What's done, what's left
   - Quality checklist

---

## The Easiest Workflow

### Batch 1 (20 minutes):
1. Open `FAQLIST_FOR_TRANSLATION.txt`
2. Copy the 6 FAQs from GoPro Hero 13 and Nintendo Switch
3. Paste all 6 into ChatGPT with batch prompt (see TRANSLATION_WORKFLOW.md)
4. Get 6 translated FAQs back
5. Use Find & Replace in VS Code to update data/devices-ja.json

### Repeat Batches 2-8:
Continue same process for remaining devices

### Total Time: ~2-3 hours

---

## Current Status by Device Category

### ✅ Complete (No translation needed):
- UI/Templates
- Navigation/Headers/Footers
- SD Card product data (sdcards-ja.json)
- Requirements box labels
- Specs grid labels
- Table headers

### ❌ Needs Translation:

**Top 10 Devices (Priority):**
1. GoPro Hero 13 Black (3 FAQs)
2. Nintendo Switch (3 FAQs)
3. DJI Mini 4 Pro (3 FAQs)
4. Canon EOS R5 (3 FAQs)
5. Nikon D850 (3 FAQs)
6. Orange Pi 5 (3 FAQs)
7. Lenovo Legion Go S (3 FAQs)
8. GoPro Max 2 (3 FAQs)
9. Nikon D500 (3 FAQs)
10. Sony A7R (3 FAQs)

**Plus 130 other devices** with 1-3 FAQs each = 182 total FAQs

---

## Example: Before & After

### BEFORE (English):
```
Device: Canon EOS R5
FAQ Section:
Q: What SD Card Do I Need for Canon EOS R5?
A: The Canon EOS R5 requires a CompactFlash Type II or CFast card for video recording...
```

### AFTER (Japanese):
```
Device: Canon EOS R5
よくある質問 (FAQ Section):
Q: Canon EOS R5にはどのSDカードが必要ですか？
A: Canon EOS R5はビデオ録画のためにCompactFlash Type IIまたはCFastカードが必要です...
```

---

## ✅ Checklist

- [ ] Read TRANSLATION_WORKFLOW.md
- [ ] Open ChatGPT
- [ ] Translate first batch (GoPro Hero 13 + Nintendo Switch) = 6 FAQs
- [ ] Update data/devices-ja.json
- [ ] Run `npm run build:ja`
- [ ] Test on https://sdcardchecker.com/ja/categories/action-cameras/gopro-hero-13/
- [ ] Continue with remaining batches
- [ ] Deploy to production

---

## FAQ About Translation

**Q: Do I need to speak Japanese?**
A: No. ChatGPT does 95% of the work. You just copy/paste.

**Q: Can I do this in batches?**
A: Yes! Translation 20 FAQs today, 20 more tomorrow. Just batch update data/devices-ja.json and rebuild.

**Q: What if ChatGPT translation is wrong?**
A: Manual review takes 5 seconds per FAQ. If suspicious, ask ChatGPT again.

**Q: How long will this take?**
A: 2-3 hours total. Could be done in one evening.

**Q: Do I need Google Translate or DeepL?**
A: No. ChatGPT is free and better quality.

---

## Commands to Remember

```bash
# Check current translation progress
node scripts/translator-batch.js --status

# After translating, rebuild the site
npm run build:ja

# Test locally
npm run dev
# Then visit http://localhost:3000/ja/categories/action-cameras/gopro-hero-13/

# When ready to deploy
git add data/devices-ja.json
git commit -m "chore: translate 182 FAQ items to Japanese"
git push
```

---

## Next Action

👉 **Open this file:** `TRANSLATION_WORKFLOW.md`

It has:
- Exact ChatGPT prompt to use
- How to batch FAQs efficiently
- How to update the file with Find & Replace
- How to verify your translations

**Start with Batch 1 (6 FAQs from GoPro Hero 13 + Nintendo Switch)**

Estimated time: 20 minutes

Then continue with remaining batches.

---

## Support

If you get stuck:

1. Check the error in `npm run build:ja` output
2. Verify JSON is valid (check for missing quotes or commas)
3. Make sure HTML tags `<b>`, `<li>` are preserved
4. Make sure technical terms stayed in English (V60, V90, MB/s)

Good luck! 🚀
