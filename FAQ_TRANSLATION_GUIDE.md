# Japanese FAQ Translation Guide

## Current Status
- **Total FAQs:** 183
- **Translated:** 1 (0.5%)
- **Need Translation:** 182 (99.5%)
- **Top devices:** GoPro Hero 13, Nintendo Switch, DJI Mini 4 Pro, Canon EOS R5, Nikon D850

---

## Quick Translation Reference

### Most Common Questions (translate these patterns first)

| English Pattern | Japanese Translation | Example |
|---|---|---|
| What SD Card Do I Need for {device}? | {device}にはどのSDカードが必要ですか？ | Nintendo SwitchにはどのSDカードが必要ですか？ |
| Can I use {card_type}? | {card_type}を使用できますか？ | 古いmicroSDカードを使用できますか？ |
| Do I need V90? | V90が必要ですか？ | V90が必要ですか？ |
| Is V60 enough? | V60で十分ですか？ | V60で十分ですか？ |
| Is the {device} good for {use}? | {device}は{use}に適していますか？ | Canon EOS R5はビデオに適していますか？ |
| How much storage do I need? | どのくらいのストレージが必要ですか？ | どのくらいのストレージが必要ですか？ |
| How long do SD cards last? | SDカードはどのくらい持ちますか？ | SDカードはどのくらい持ちますか？ |

### Most Common Answers (translate these patterns first)

| English Pattern | Japanese Translation |
|---|---|
| Yes, the {device} requires | はい、{device}には...が必要です |
| Yes, {device} is specifically designed for | はい、{device}は...専門に設計されています |
| The {device} supports | {device}は...に対応しています |
| We recommend {capacity} | {capacity}をお勧めします |
| V{speed} or faster | V{speed}以上 |
| For reliable performance | 信頼性の高いパフォーマンスのため |
| Not recommended | 推奨されません |
| This will cause | これは...につながります |
| To ensure | ...を確保するために |

---

## Top 10 Devices to Start With

These 10 devices represent 25+ FAQ items and will have high impact:

1. **GoPro Hero 13 Black** (3 FAQs)
2. **Nintendo Switch** (3 FAQs)
3. **DJI Mini 4 Pro** (3 FAQs)
4. **Canon EOS R5** (3 FAQs)
5. **Nikon D850** (3 FAQs)
6. **Orange Pi 5** (3 FAQs)
7. **Lenovo Legion Go S** (3 FAQs)
8. **GoPro Max 2** (3 FAQs)
9. **Nikon D500** (3 FAQs)
10. **Sony A7R** (3 FAQs)

---

## Translation Process

### Option 1: Use CSV Batch Translator (FASTEST)
1. CSV file already generated: `faq-to-translate.csv`
2. Upload to Google Translate or DeepL bulk translator
3. Download translated CSV
4. Re-import into devices-ja.json

### Option 2: Use ChatGPT/Claude (HIGH QUALITY)
1. Copy each FAQ from devices-ja.json
2. Paste into ChatGPT with prompt:
```
Translate this FAQ question and answer from English to Japanese.
Keep all HTML tags <b>, <li>, etc. intact.
Keep technical terms like V60, V90, MB/s, SD UHS-II as-is.
Maintain polite Japanese (です/ます form).

Q: [QUESTION]
A: [ANSWER]
```
3. Copy translated Q & A
4. Paste back into devices-ja.json

### Option 3: Use DeepL API (GOOD BALANCE)
```javascript
// DeepL API translation
const DeepL = require('deepl');
const translator = new DeepL.Translator(process.env.DEEPL_API_KEY);

const result = await translator.translateText(englishText, null, 'JA');
console.log(result.text); // Japanese output
```

### Option 4: Mix of Automated + Manual (RECOMMENDED)
1. Use Google Translate for bulk initial translation
2. Manually review and fix top 50 FAQs
3. Deploy and test

---

## File Structure

The FAQs are stored in `data/devices-ja.json`:

```json
{
  "devices": [
    {
      "id": "gopro-hero-13-black",
      "name": "GoPro Hero 13 Black",
      "faq": [
        {
          "q": "Can I use full-size SD cards with an adapter?",  // ← TRANSLATE THIS
          "a": "<b>No, the GoPro Hero 13 Black only accepts microSD cards.</b> ..."  // ← TRANSLATE THIS
        }
      ]
    }
  ]
}
```

### Rules for Translation:
- ✅ Keep `<b>`, `<li>`, `<ul>` HTML tags
- ✅ Keep technical specs (V60, V90, UHS-II, MB/s) in English
- ✅ Keep brand names (SanDisk, Canon, Nikon) in English
- ✅ Keep device names in English
- ✅ Use polite Japanese (です/ます ending)
- ✅ Use Japanese punctuation (、。 instead of ,.)
- ❌ Don't translate product names
- ❌ Don't translate URLs or email addresses

---

## Examples with HTML Tags

**BEFORE:**
```json
{
  "q": "Do I need V90 for the <b>Panasonic Lumix S9</b>?",
  "a": "<b>Yes, V90 is recommended</b> for the highest quality recording modes and high frame rates. <li>Standard 4K: V60 sufficient</li> <li>High frame rate: V90 recommended</li>"
}
```

**AFTER:**
```json
{
  "q": "<b>Panasonic Lumix S9</b>にはV90が必要ですか？",
  "a": "<b>はい、V90が推奨されます</b>最高品質の録画モードと高フレームレートのため。<li>標準4K：V60で十分</li><li>高フレームレート：V90推奨</li>"
}
```

---

## Translation Tool Commands

### Check current status:
```bash
node scripts/translator-batch.js --status
```

### Export untranslated FAQs to CSV:
```bash
node scripts/translator-batch.js --csv
```

### View example FAQ:
```bash
node scripts/translator-batch.js --example
```

---

## Recommended Tools by Language Proficiency

### If you speak Japanese:
- Manual translation in text editor
- Takes ~2-4 hours for 182 FAQs
- Highest quality

### If you don't speak Japanese:
- **Option A:** ChatGPT (free, good quality, takes ~2 hours)
- **Option B:** Google Translate (free, 80% accurate, takes ~30 minutes)
- **Option C:** DeepL (paid, excellent quality, takes ~1 hour)

### Mixed approach (RECOMMENDED):
1. Google Translate all 182 FAQs (30 min)
2. Manually review top 50 FAQs with ChatGPT (1-2 hours)
3. Test on live site
4. Deploy

---

## After Translation

Once translated, rebuild the site:

```bash
npm run build:ja
```

Test on: https://sdcardchecker.com/ja/categories/cameras/panasonic-lumix-s9/

Check:
- ✅ All FAQ answers display fully
- ✅ No English text visible
- ✅ HTML tags rendered correctly
- ✅ Japanese punctuation displays properly
- ✅ Mobile layout not broken

---

## Files Created

- ✅ `faq-to-translate.csv` - Export of 164 untranslated FAQs
- ✅ `scripts/translator-batch.js` - Translation status tool
- ✅ `FAQ_TRANSLATION_GUIDE.md` - This guide

## Next Steps

1. Choose a translation method above
2. Translate 182 FAQ items
3. Update `data/devices-ja.json` with translations
4. Run `npm run build:ja`
5. Test on Japanese site
6. Deploy to production

---

## Translation Effort Estimate

| Method | Time | Quality | Cost |
|--------|------|---------|------|
| Manual (native speaker) | 2-4 hrs | 95% | Free |
| ChatGPT (batch) | 1-2 hrs | 85% | Free |
| Google Translate + manual review | 1-2 hrs | 80% | Free |
| DeepL API | 1 hr | 90% | $5-10 |
| Professional translator | 4-8 hrs | 100% | $200-500 |

**Recommended:** Google Translate (automated) + ChatGPT (manual review of top 50)
**Estimated total time:** 2-3 hours
