# FIRST 25 DEVICES - LOCALIZATION AUDIT

## Summary
Most devices in the first 25 are properly localized. However, technical terms (brand names, model numbers, acronyms) in Japanese are acceptable and expected. The following devices need attention due to significant untranslated content:

---

## Devices with Untranslated Content

### [8] `asus-rog-ally-x` - NEEDS REVIEW
**Status:** Mostly localized, but `notes` field contains untranslated sentence
```
notes: "2024年中頃にリリースされた初代ROG Allyのアップグレード版で、バッテリー寿命の向上、冷却の改善、そしてより堅牢なUHS-II microSDカードリーダーが特徴です。公式のSanDisk ROG Ally microSDカードはこのデバイスに最適化されています。"
```
- **Issue:** Contains English brand names (ROG, Ally, SanDisk) which are acceptable as brand names

**Verdict:** ✓ ACCEPTABLE - Brand names and product names can remain in English in Japanese text

---

### [9] `lenovo-legion-go` - NEEDS TRANSLATION
**Status:** Contains significant English in `notes` and `whySpecs`

```
notes: "2023年後半にリリースされたLenovo Legion Goは、独自の着脱式コントローラーと現在のWindowsハンドヘルド機の中で最大の画面で知られています。microSDスロットはUHS-I規格です（UHS-IIを搭載する新しいROG Ally Xとは異なります）。"
```
- **Issue:** "Windows" should be "ウィンドウズ" or "Windows"（カタカナ不要）

```
whySpecs: "8.8インチの大型ディスプレイと着脱式コントローラーを備えたWindows携帯ゲーム機です。..."
```
- **Issue:** "Windows" is brand name - ACCEPTABLE

```
faq[0].a: "...ASUS ROG Ally XはUHS-IIカードリーダーを搭載していますが、Lenovo Legion GoはUHS-Iスロットを採用しています。..."
```
- **Issue:** Product names - ACCEPTABLE

```
faq[1].a: "...512GBが良い最低ラインですが、最新のPCゲームを多数保存するには1TBを強く推奨します。多くのAAAタイトルは1本で容易に100GBを超えます。Legion GoのWindows..."
```
- **Issue:** "PC" = コンピュータ or パソコン; "AAA" = 大作 or AAA（ゲーム業界用語は英語で可）
  
**Verdict:** ⚠️ NEEDS MINOR FIXES

**Required Changes:**
- `notes`: Keep as is (brand names acceptable)
- `faq[1].a`: "PCゲーム" → Consider keeping as is (common term) or change to "パソコンゲーム"

---

### [12] `retroid-pocket-4-pro` - NEEDS TRANSLATION
**Status:** `faq[0].q` contains English

```
faq[0].q: "Retroid Pocket 4 Proにはどれくらいの大きさのmicroSDカードが必要ですか？"
```
- **Issue:** This is the device name - ACCEPTABLE (product names stay in English)

**Verdict:** ✓ ACCEPTABLE - Product names are allowed

---

### [13] `lenovo-legion-go-s` - NEEDS TRANSLATION
**Status:** Contains significant untranslated content in multiple fields

```
notes: "UHS-I microSDスロットを搭載したSteamOSベースのWindowsハンドヘルドバリエーションです。..."
```
- **Issue:** "SteamOS" is a product name - ACCEPTABLE; "Windows" is brand name - ACCEPTABLE

```
whySpecs: "Legion Go SはUHS-I microSDリーダーを使用しているため、UHS-IIカードを挿入してもピーク転送速度は90〜100 MB/s程度で頭打ちになります。A2アプリケーション定格を持つU3 / V30カードであれば、WindowsやSteamOSのゲームをカードから直接実行するのに十分なシーケンシャルおよびランダム性能が得られ、ロード時間が苦痛になることはありません。最近のPCタイトルは非常にサイズが大きいため、512GB〜1TBが実用的なラインです。..."
```
- **Issue:** Contains multiple English words that need localization:
  - "peak" → "ピーク" (already acceptable technical term)
  - "sequential" → "シーケンシャル" (already acceptable technical term)
  - "PC titles" → "PCゲーム" or "パソコンゲーム"

```
faq[0].q: "UHS-II microSDカードを使えば、Legion Go Sでのゲームロードは速くなりますか？"
```
- Status: ACCEPTABLE

```
faq[0].a: "...UHS-IIカードはこのスロットではUHS-Iモードで動作するため..."
```
- Status: ACCEPTABLE

```
faq[1].a: "...優れたA2定格のV30カードであれば多くのAAAゲームをまともに扱えますが、ヘビーなストリーミング（巨大なテクスチャや広..."
```
- **Issue:** "AAA" games → "大作ゲーム" or keep "AAAゲーム"

```
faq[2].a: "...512GBが良い最低ラインで、ほとんどのプレイヤーには1TBが理想的です。最近のPCゲームには1本で100GBを超えるものも少なくありません。パッチやDLCを含めると..."
```
- **Issue:** "DLC" → "ダウンロードコンテンツ" or keep "DLC"

**Verdict:** ⚠️ NEEDS MINOR FIXES

**Required Changes:**
- whySpecs: "PCタイトル" → "パソコンゲーム" or keep as is
- faq[1].a: "AAAゲーム" → Consider "大作ゲーム" or keep as industry standard
- faq[2].a: "DLC" → "ダウンロードコンテンツ" or keep as gaming term

---

### [17] `steam-deck` - NEEDS TRANSLATION
**Status:** Contains English in `faq[0].a`

```
faq[0].a: "<b>はい、V60以上のmicroSDカードもSteam Deckで問題なく動作します。</b> しかし、<b>デバイスのUHS-Iインターフェースが速度を制限するため</b>、Steam Deckで..."
```
- **Issue:** Incomplete sentence with English abbreviations
- **Note:** The sentence seems cut off; needs to see full content

**Verdict:** ⚠️ NEEDS REVIEW OF FULL CONTENT

---

## Acceptable Technical Terms (No Translation Needed)
- Brand names: SanDisk, Kingston, Lexar, Samsung, Sony, Canon, Nikon, GoPro, DJI, etc.
- Product model names: ROG Ally X, Legion Go, Steam Deck, etc.
- Technical specs: V30, V60, V90, U1, U3, A1, A2, UHS-I, UHS-II, CFexpress, etc.
- Acronyms: MB, GB, TB, GB/s, fps, RAW, MP, BMPCC, etc.

---

## Translation Priority

**HIGH Priority (Real Untranslated Content):**
1. `lenovo-legion-go` - Minor fixes needed in faq content
2. `lenovo-legion-go-s` - Several minor fixes needed

**MEDIUM Priority (Review):**
3. `steam-deck` - Need to see full FAQ answer

**LOW Priority (Mostly Acceptable):**
4. `asus-rog-ally-x` - Brand names acceptable
5. `retroid-pocket-4-pro` - Product names acceptable

---

## Notes for Translation

When translating PC/gaming device content:
- Keep brand and product names in English
- Keep technical specifications (V30, UHS-II, etc.) in English with English notation
- Translate descriptive text fully
- For gaming terms like "AAA titles" you can either keep as "AAAゲーム" or translate to "大作ゲーム"
- Keep "PC" as common abbreviation used in Japanese tech context (パソコン is too formal)
- Keep "DLC" as "DLC" (widely understood) or translate to "ダウンロードコンテンツ"
