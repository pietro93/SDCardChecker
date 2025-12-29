# SD Card Checker - Japanese Localization Guide

**Version:** 1.0  
**Last Updated:** Dec 2025  
**Purpose:** Detailed guidance for adapting SD Card Checker for the Japanese market while maintaining brand integrity

---

## Table of Contents

1. [Overview & Strategic Approach](#overview--strategic-approach)
2. [Typography & Font System](#typography--font-system)
3. [Tone & Voice (Japanese)](#tone--voice-japanese)
4. [Trust Signals & Messaging](#trust-signals--messaging)
5. [Information Architecture & Density](#information-architecture--density)
6. [Search & SEO (Japanese)](#search--seo-japanese)
7. [Formatting & Localization](#formatting--localization)
8. [Visual Adjustments](#visual-adjustments)
9. [Component Specifications (JP)](#component-specifications-jp)
10. [Legal Compliance & Disclosures](#legal-compliance--disclosures)
11. [Local Market Insights](#local-market-insights)
12. [Implementation Checklist](#implementation-checklist)

---

## Overview & Strategic Approach

### Why Japanese Localization Matters

Japan is the world's second-largest consumer market for digital devices and audio equipment. SD card compatibility matters deeply here, especially for:

- **DAP (Digital Audio Players)**: Walkman is a national product category
- **Cameras**: High penetration of mirrorless cameras (Sony α, Canon, Nikon)
- **Gaming**: Nintendo Switch, PS Vita, and retro gaming are huge
- **Action Cameras**: GoPro and DJI in the high-end market

### Cultural Differences in UX Expectations

| Aspect | Western (Current) | Japanese Market |
|--------|-------------------|-----------------|
| **Information Density** | Whitespace = clean/premium | Data above fold = trustworthy |
| **Authority** | Confidence & brevity | Meticulous detail & proof |
| **Trust Signal** | Brand logo, testimonials | Certification marks, "tested" stamps |
| **Typography** | Minimal, light weights | Heavy/bold, high contrast |
| **Search** | Exact matches | Fuzzy matching (多言語対応) |
| **Buttons** | Minimalist, flat | Textured, "clickable" appearance |
| **Affiliate Disclosure** | Lower profile | Prominent (legal requirement as of 2023) |

### Core Principle

**Keep the DNA (Fast, Expert, Trustworthy) but present it through Japanese cultural/UX preferences.**

Not a word-for-word translation. A thoughtful adaptation.

---

## Typography & Font System

### Font Stack (CRITICAL CHANGE)

Replace the English system font stack with a Japanese-optimized version:

```css
/* English (Current) */
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

/* Japanese (New) */
font-family: "Helvetica Neue", Arial, 
             "Hiragino Kaku Gothic ProN", 
             "Hiragino Sans", 
             Meiryo, 
             "MS PGothic", 
             sans-serif;
```

**Why This Stack:**
- **Hiragino Kaku Gothic ProN**: macOS-optimized Japanese sans-serif (preferred by Mac users in Japan)
- **Hiragino Sans**: iOS equivalent (high-end appearance)
- **Meiryo**: Windows standard, high-quality rendering of Kanji
- **MS PGothic**: Fallback for older Windows systems (still common in offices)

### Line Height & Spacing

Kanji/Kana are more complex than Latin characters. They need more breathing room.

```css
/* CRITICAL: Increase line-height for Japanese */

/* English */
body { line-height: 1.6; }
h1, h2, h3 { line-height: 1.3; }

/* Japanese */
body { line-height: 1.8; }              /* +0.2 compared to English */
h1, h2, h3 { line-height: 1.5; }        /* +0.2 compared to English */
.faq { line-height: 1.9; }              /* FAQ has dense text, needs extra space */
```

**Why:** Kanji density causes eye fatigue. Extra vertical spacing prevents the text from appearing as a solid block.

### Font Weight Strategy

```css
/* AVOID: Light weights (300) for Japanese */
/* Kanji rendering suffers on low-resolution screens */

h1, h2, h3, strong { font-weight: 700; }   /* Bold only */
body, p, span { font-weight: 400; }        /* Regular only */

/* Do NOT use: 300, 500, 600 weights for Japanese text */
```

**Why:** Unlike Latin characters, which look fine at 300-400 weight, Kanji strokes become muddy and unreadable at light weights on mobile screens.

### Character Spacing (Word-Break)

Japanese doesn't use spaces between words. Browsers sometimes break lines awkwardly.

```css
/* Add to src/css/modern-ja.css */

html[lang="ja"] {
  word-break: keep-all;                    /* Prevent mid-word breaks */
  overflow-wrap: break-word;               /* Allow wrapping at word boundaries */
  text-rendering: optimizeLegibility;      /* Better Kanji rendering */
}
```

### No Italics Rule

**CRITICAL:** Never use italics for Japanese text.

```css
/* DON'T */
em { font-style: italic; }  /* Looks like a rendering error in Japanese */

/* DO */
em { 
  font-weight: 700;                 /* Use bold instead */
  color: #0066cc;                   /* Or add color */
  background: rgba(255, 192, 0, 0.15);  /* Or subtle highlight */
}
```

---

## Tone & Voice (Japanese)

### The "Technician Expert" in Japanese

Your English voice: *"Like a technician who's solved this 1,000 times."*

In Japanese, this needs to be more thorough and methodical.

#### Formality Level

Use **Desu/Masu Form** (です・ます) throughout. This is:
- Professional and authoritative
- Polite without being servile
- Perfect for B2C tech sites

```
❌ Too casual:    これを買え。(Buy this. - rude/commanding)
❌ Too informal:  買っちゃえば？(Just buy it? - flip)
✓ Professional:  このSDカードの購入をおすすめします。(We recommend purchasing this SD card.)
```

#### Key Terminology

Never translate these marketing terms literally. Use established Japanese phrases:

| English | ❌ Literal Translation | ✓ Native Japanese |
|---------|----------------------|------------------|
| "Best SD Card" | 最高のSDカード | おすすめのSDカード / 最適なSDカード |
| "Recommended" | 勧められた | おすすめ |
| "Specs" | 仕様 | スペック |
| "Compatible" | 互換性がある | 対応 / 動作確認済み |

#### Headline Examples

```
English:
"Find the Perfect SD Card for Your Device in Seconds"

Japanese (Technical but Helpful):
「[デバイス名]に最適なSDカード：動作確認済みの推奨スペック」
(Optimal SD Card for [Device]: Operation-Confirmed Recommended Specs)

Alternative (More Concise):
「[デバイス名]に対応するSDカード選び」
(Choosing an SD Card Compatible with [Device])
```

#### Body Copy Tone

**Keep it Direct BUT Add Trust Language:**

```
English:
"This card works with GoPro Hero 13. V30 ensures smooth 4K recording."

Japanese:
「このカードはGoPro Hero 13に対応しています（メーカー仕様準拠）。V30は4K動画の安定した記録を実現します。」

English Breakdown: This card is compatible with [device] (manufacturer spec compliant). V30 ensures stable 4K video recording.
```

**The "Magic Phrase":**
- 「動作確認済み」 = Operation/Functionality Confirmed
- This is the single most trusted phrase in Japanese e-commerce
- Use it whenever you reference manufacturer compatibility

#### FAQ & Customer Concerns

Japanese FAQ should address risk/compatibility more explicitly:

```
Q (English): "Can I use a V20 card?"
A: "No. V30 is required."

Q (Japanese): 「V20のカードは使えますか？」
A: 「いいえ。このデバイスはV30以上が必須です。V20では動作確認されていません。」
  (Translation: No. This device requires V30 or higher. V20 has not been confirmed to work.)
```

---

## Trust Signals & Messaging

### The "Operation Confirmed" Badge

This is not just flavor text—it's critical for conversion.

#### Where to Add:

1. **Device Page Title Area**
   ```html
   <div class="trust-badge">
     <span class="badge-icon">✓</span>
     <span class="badge-text">動作確認済み</span>
     <span class="badge-subtext">（メーカー仕様準拠）</span>
   </div>
   ```

2. **Specs Card** (add "Confirmed" label)
   ```
   [Spec Card]
   カード種別: microSD UHS-I ← Add checkmark
   速度クラス: V30 ← Mark as "確認済み"
   ```

3. **Answer Box** (the recommendation section)
   ```html
   <div class="answer-box-ja">
     <span class="certified-badge">動作確認済み</span>
     <h2>おすすめ: SanDisk Extreme microSD</h2>
     <p>このSDカードはGoPro Hero 13に確認済みで対応しています。</p>
   </div>
   ```

### Manufacturer Authority

Japanese users heavily verify against official specs. Always cite the source:

```
❌ "V30 is needed"
✓ "公式サイト: GoPro Hero 13の公式仕様によると、V30以上のSDカードを推奨しています"
  (According to the official GoPro Hero 13 specifications, V30 or higher is recommended)
```

### Official Certification Logos

Include the official SD Association logos:

```
Display these prominently:
├─ SD Logo (official SD card association mark)
├─ V30 Speed Class Logo
├─ UHS-II/UHS-I Logo
└─ microSD Logo

These are visual "Stamps of Approval" that Japanese users trust.
```

---

## Information Architecture & Density

### The Whitespace Paradox

**Western UX:** Whitespace = clean, premium, trustworthy.

**Japanese UX:** Dense, organized information = thorough, expert, trustworthy.

### Recommended Page Structure (Device Pages)

```
1. Breadcrumb:         「ホーム > デバイス > GoPro Hero 13」
2. Trust Badge:        「動作確認済み」「メーカー仕様準拠」
3. H1 + Subtitle:      Device name + brief description
4. Answer Box:         Recommended card + why (blue gradient)
5. Quick Specs:        4-column grid (desktop): Type, Speed, Capacity, Max
6. Why These Specs:    1-2 paragraphs with official source
7. Brands Table:       All compatible brands (comparison, not just 1-2)
8. Where to Buy:       Amazon affiliate links (prominent)
9. Additional Notes:   Slot count, compatibility quirks, etc.
10. FAQ:               5-8 device-specific questions
11. Related Devices:   Link section
```

**Difference from English:**
- English: Minimize "above the fold" (whitespace is OK)
- Japanese: More data visible without scrolling (users want full context)

### Device Card in Search Results

**English Version:**
```
┌──────────────────────┐
│   [Device Image]     │
│                      │
│   GoPro Hero 13      │
│   Action Cameras     │
│   [View →]           │
└──────────────────────┘
```

**Japanese Version:**
```
┌──────────────────────┐
│   [Device Image]     │
│   ✓ 動作確認済み      │ ← Add trust badge
│                      │
│   GoPro Hero 13      │
│   アクションカメラ     │
│   microSD UHS-I      │ ← Add spec summary
│   V30 (推奨)          │ ← Add recommendation
│   [詳しく →]          │ ← Change button text
└──────────────────────┘
```

This gives Japanese users confidence in the search results without clicking through.

---

## Search & SEO (Japanese)

### Multi-Language Search Problem

Japanese users search for the same device in multiple ways:

```
User Intent: "I want to find the SD card for GoPro Hero 13"

Possible Searches:
1. English:       GoPro Hero 13
2. Katakana:      ゴープロ ヒーロー 13
3. Abbreviated:   ゴープロ13
4. Lowercase:     gopro hero 13
5. Mixed case:    GoPro hero 13
6. Romaji:        gopuro hero 13 (less common)
```

### Updated `searchTerms` Array (devices-ja.json)

```json
{
  "id": "gopro-hero-13",
  "name": "GoPro Hero 13 Black",
  "slug": "gopro-hero-13",
  "searchTerms": [
    "GoPro Hero 13",
    "ゴープロ ヒーロー 13",
    "ゴープロ13",
    "ゴープロ",
    "gopro hero 13",
    "gopro 13",
    "hero 13",
    "GoPro",
    "goPro",
    "GOPRO"
  ]
}
```

### Search Logic Enhancement

Your search needs to be "fuzzy" to match Katakana ↔ Romaji variations:

```javascript
// Alpine.js search function (pseudo-code)
function searchDevices(query) {
  const normalized = normalizeJapanese(query);
  
  // Handle Katakana/Romaji fuzzy matching
  const romaji = katakanaToRomaji(normalized);
  
  return devices.filter(device => 
    device.searchTerms.some(term =>
      normalizeJapanese(term).includes(normalized) ||
      katakanaToRomaji(term).includes(romaji)
    )
  );
}

function normalizeJapanese(str) {
  return str
    .toLowerCase()
    .replace(/　/g, ' ')      // Full-width space → half-width
    .replace(/[ぁ-ん]/g, '')  // Remove small Hiragana marks
    .trim();
}
```

**Simple Solution:** Include all common variants in `searchTerms` array (as shown above). This is the easiest approach.

### SEO Metadata (Japanese)

Adjust meta descriptions and OG tags for Japanese character limits:

```html
<!-- English: 160 characters is standard -->
<meta name="description" content="Get the best SD card for your device...">

<!-- Japanese: ~90 characters (since Kanji is denser) -->
<meta name="description" content="GoPro Hero 13におすすめのSDカード。動作確認済みのスペックと選び方を解説。">

<!-- Japanese OG Tags -->
<meta property="og:title" content="GoPro Hero 13に最適なSDカード【動作確認済み】">
<meta property="og:description" content="GoPro Hero 13の公式仕様に対応したSDカードの選び方。推奨容量、速度クラスを詳しく解説。">
```

---

## Formatting & Localization

### Numbers & Units

#### Storage Capacity

```
English:   128GB, 256GB, 512GB (comma separator)
Japanese:  128GB、256GB、512GB  (Japanese comma: ideographic comma)

Markup:
<span class="storage">256GB</span>  <!-- Use Half-width numerals -->
```

**Important:** Always use Half-width (半角) numerals and units, not Full-width (全角).

```
✓ Correct:   256GB、V30、U3
✗ Wrong:     ２５６ＧＢ、Ｖ３０、Ｕ３ (Full-width - looks dated/amateurish)
```

#### Speed Classes & Technical Specs

Keep SD card technical terms in English (standard globally):

```
Speed Class V30        → ビデオスピードクラス V30  (or just V30)
UHS-II                 → UHS-II (keep as-is)
microSD XC             → microSD XC (keep as-is)
Read Speed: 200 MB/s   → 読み込み速度: 200 MB/s
Write Speed: 140 MB/s  → 書き込み速度: 140 MB/s
```

#### Currency & Pricing

```
English:   $99.99, $149.99
Japanese:  ¥9,999、¥14,999

Rules:
- Use ¥ symbol
- Use Japanese comma (、) between multiple prices
- No decimal places (Japanese prices are whole numbers)
- Comma separator for thousands: ¥1,000 (not ¥1000)
```

### Dates & Times

```
English:   November 22, 2025 or 11/22/2025
Japanese:  2025年11月22日 (2025年 = year, 月 = month, 日 = day)

Example:
「2025年11月22日現在」(As of November 22, 2025)
```

### Punctuation

| Element | English | Japanese |
|---------|---------|----------|
| Comma | , | 、 (ideographic comma) |
| Period | . | 。 (ideographic full stop) |
| Quotation | "text" | 「text」 or 『text』 |
| Parenthesis | (text) | （text）or (text) |
| Ellipsis | ... | … (Japanese ellipsis) or ・・・ |

```html
<!-- Example: Use Japanese punctuation -->
<p>このSDカードは、GoPro Hero 13に対応しています。</p>
<!-- Comma is 、and period is 。-->
```

---

## Visual Adjustments

### Button Design (Japanese Preference)

Japanese UX tends to favor buttons that look "more clickable" than minimalist Western design.

#### English Design (Current)
```
┌─────────────────┐
│ View Details →  │  ← Minimal, flat, large whitespace inside
└─────────────────┘

Background: #0066cc
Text: White
Padding: 12px 24px
Radius: 6px
Hover: Darker blue
```

#### Japanese Design (Adapted)
```
┌─────────────────┐
│ ▶ 詳しく見る    │  ← Icon + text, subtle gradient, more "tactile"
└─────────────────┘

Background: #0066cc (base) → subtle gradient to #004a99
Text: White, icon included
Padding: 12px 24px (same)
Radius: 6px (same)
Hover: Slightly more pronounced shadow, subtle scale (1.02)
Shadow: 0 2px 8px rgba(0, 102, 204, 0.3) ← More visible
```

**Why:** Japanese UX prefers visual feedback that signals "this is interactive."

### Information Boxes (Specs Cards)

#### English Style
```
┌───────────────┐
│ Speed Class   │
│ V30           │  ← Large, bold, centered
└───────────────┘
```

#### Japanese Style (Enhanced)
```
┌───────────────────────┐
│ 速度クラス             │  ← Label (smaller, uppercase)
│ V30                   │  ← Value (large, bold)
│ ビデオ向け推奨         │  ← Subtext (explanation)
│ ✓ 動作確認済み         │  ← Trust badge
└───────────────────────┘
```

This adds context without much extra space.

### Color Adjustments

Your blue (#0066cc) and orange (#ff9900) are perfect for Japan. No changes needed.

However, for **text contrast**, consider slightly darkening the body text:

```css
/* English */
body { color: #555555; }          /* 55% gray */

/* Japanese */
body[lang="ja"] { color: #444444; }  /* 44% gray - slightly darker for Kanji clarity */
```

This ensures complex Kanji remain sharp on mobile screens without changing the overall aesthetic.

### Accent & Emphasis

Instead of italics, use:

```css
/* Emphasis without italics */
.emphasis {
  font-weight: 700;                           /* Bold */
  color: #0066cc;                             /* Blue */
  background: rgba(255, 153, 0, 0.1);        /* Subtle orange tint */
}

/* Or use a marker-style highlight */
.highlight {
  background: linear-gradient(
    to right, 
    rgba(255, 193, 7, 0.3), 
    transparent
  );
  padding: 0 4px;
}
```

---

## Component Specifications (JP)

### FAQ Accordion (Japanese)

Same structure as English, but adjust language:

```html
<div class="faq-item">
  <button class="faq-toggle" aria-expanded="false">
    <span class="faq-q">「このSDカードで4K動画は録画できますか？」</span>
    <span class="faq-icon">▼</span>
  </button>
  
  <div class="faq-answer" hidden>
    <p>はい。GoPro Hero 13のスペック仕様に対応しており、4K動画の安定した記録が確認されています。</p>
  </div>
</div>
```

**Key Changes:**
- Use Japanese quotation marks: 「」 instead of ""
- Add formality: です・ます form throughout
- Reference official specs when possible: 「スペック仕様に対応」

### Brands Comparison Table (Japanese)

Same layout, but add more brands and trust indicators:

```html
<table class="brands-table-ja">
  <thead>
    <tr>
      <th>ブランド</th>
      <th>モデル</th>
      <th>速度</th>
      <th>容量</th>
      <th>動作確認</th>
      <th>購入</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>SanDisk</td>
      <td>Extreme</td>
      <td>V30</td>
      <td>128GB-512GB</td>
      <td>✓ 確認済み</td>
      <td><a href="...">Amazon</a></td>
    </tr>
  </tbody>
</table>
```

**Additions for JP:**
- Add 「動作確認」 (Operation Confirmed) column with ✓ checkmark
- Include more brands (especially Nextorage, ProGrade Digital)
- Show "certified" or "tested" status visually

### Search Bar (Homepage)

Japanese users need Katakana support:

```html
<input 
  type="search" 
  placeholder="デバイス名を入力（例：GoPro、ゴープロ、Nintendo Switch）"
  aria-label="デバイスを検索"
  x-model="searchQuery"
  @input="filterDevices"
/>
```

---

## Legal Compliance & Disclosures

### PR Disclosure (法的要件)

Japan's "Stealth Marketing" (ステルスマーケティング) law requires prominent affiliate disclosure.

#### Placement

**Top of Device Page** (before the "Answer Box"):

```html
<div class="pr-disclosure-jp">
  <span class="pr-label">広告</span>
  <p>本ページは、プロモーションを含みます。アマゾン アソシエイトとして、当サイトは適格販売により収入を得ています。</p>
</div>
```

Or in Japanese style:

```html
<div class="pr-disclosure-jp">
  <span class="pr-icon">ⓘ</span>
  <p>このページには<strong>プロモーション</strong>が含まれています。</p>
  <small>当サイトはAmazon.co.jpのアソシエイトとして、適格販売により収入を得ています。</small>
</div>
```

#### Styling

```css
.pr-disclosure-jp {
  background: #fff5e6;                  /* Subtle warm background */
  border-left: 4px solid #ff9900;       /* Orange left border */
  padding: 12px 16px;
  margin-top: 12px;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #333;
}

.pr-label {
  display: inline-block;
  background: #ff9900;
  color: white;
  padding: 2px 8px;
  border-radius: 3px;
  font-weight: 700;
  font-size: 0.75rem;
  margin-right: 8px;
}
```

#### Compliant Wording Options

```
Official (very formal):
「本ページはプロモーションが含まれています。」

Friendly (Amazon guideline):
「このページには広告が含まれています。」

Most common (Japanese tech sites):
「プロモーション」「広告」「PR」
```

### Footer Disclosure (全ページ)

Also include in footer, but less prominent:

```
© 2025 SDCardChecker | プライバシーポリシー | 広告について | アマゾン アソシエイト
```

---

## Local Market Insights

### Recommended Brands Priority (Japan-Specific)

Your current brand recommendations should be adjusted for the Japanese market:

```json
{
  "id": "gopro-hero-13",
  "recommendedBrands": [
    { "id": "sandisk-extreme-microsd" },           /* Safe global choice */
    { "id": "nextorage-pro" },                     /* ⭐ JAPAN PREFERRED */
    { "id": "samsung-evo-plus" },                  /* Good alternative */
    { "id": "prograde-digital-microsd" }           /* Audiophile community */
  ]
}
```

#### Why These Brands Matter in Japan

| Brand | Strength in Japan | Market Position |
|-------|-------------------|-----------------|
| **SanDisk** | Trusted globally | Safe, known choice |
| **Nextorage** | Founded by Sony engineers | HIGH LOCAL CREDIBILITY |
| **Samsung** | Strong in consumer electronics | Budget-conscious choice |
| **ProGrade Digital** | Camera/audio professionals | Photography community trust |
| **Transcend** | Popular in Asia | Mid-range quality |
| **Kingston** | Gaming community | Switch/handheld gaming |

**Special Note on Nextorage:** This brand is essentially "Made by Sony engineers" and has massive trust in Japan. If you're not recommending it, you're losing credibility.

### Niche Market Opportunities

#### 1. DAP (Digital Audio Players) - Walkman Dominance

Sony Walkman is a cultural icon in Japan. These pages will drive significant organic traffic:

```
NW-A306  → Popular gaming/music player
NW-ZX707 → High-end, audiophile community follows
           (Forums: Kakaku.com, e-イヤホン forums will link to you)
```

**Action:** Ensure these pages are perfect (detailed specs, high-quality images, forum-ready).

#### 2. Retro Gaming & Emulation

Japanese retro gaming forums love detailed device guides:

```
Nintendo Switch
Game Boy Advance SP
Nintendo DS Lite
etc.
```

These communities share information aggressively. One good page = sustained organic traffic.

#### 3. Photography Community

Japanese photographers are quality-conscious and thorough:

```
Target Camera Models:
- Sony α6400, α7C
- Canon R5, R3
- Nikon Z6, Z7
- Fujifilm X-T5
```

These users trust detailed technical content and will link to you from sites like:
- Kakaku.com
- PhotoZou
- Aperture (photography forums)

### Seasonal Opportunities

```
December-January: Holiday shopping (cameras, gaming devices)
March-April: New school year (Nintendo Switch, Walkman)
July-August: Summer vacation (action cameras)
```

---

## Implementation Checklist

### Phase 1: Setup & Infrastructure

- [ ] Create `data/devices-ja.json` (copy & translate `devices.json`)
- [ ] Create `src/templates/device-ja.html` (copy & adapt device.html)
- [ ] Create `src/css/modern-ja.css` (font stack, line-height overrides)
- [ ] Create `src/js/search-ja.js` (fuzzy matching for Katakana/Romaji)
- [ ] Update `tailwind.config.js` with Japanese language selector
- [ ] Add `lang="ja"` attribute to HTML root in Japanese templates

### Phase 2: Typography & Fonts

- [ ] Update font stack in `modern-ja.css`:
  ```css
  font-family: "Helvetica Neue", Arial, 
               "Hiragino Kaku Gothic ProN", 
               "Hiragino Sans", 
               Meiryo, 
               sans-serif;
  ```
- [ ] Set body `line-height: 1.8` for Japanese
- [ ] Set heading `line-height: 1.5` for Japanese
- [ ] Add `word-break: keep-all` and `overflow-wrap: break-word`
- [ ] Verify no italics render anywhere
- [ ] Test font rendering on multiple OS/browsers

### Phase 3: Content Translation

- [ ] Translate `devices-ja.json`:
  - Device names → Translate to Japanese
  - Categories → Category translations
  - Descriptions → Maintain expert tone (です・ます)
  - FAQ → Expand with trust/compatibility questions
  - `searchTerms` → Include Katakana, Romaji, abbreviated forms
- [ ] Translate page templates (home, device, category, etc.)
- [ ] Use "動作確認済み" (operation confirmed) language
- [ ] Add "メーカー仕様準拠" (manufacturer spec compliant) where applicable

### Phase 4: Trust Signals & Badges

- [ ] Design "動作確認済み" badge (visual design)
- [ ] Add badge component to device cards
- [ ] Add "Trust Note" to answer boxes
- [ ] Create manufacturer certification icon system
- [ ] Add SD Association official logos to pages
- [ ] Update brands table to include "確認済み" column

### Phase 5: Formatting

- [ ] Update number formats:
  - Storage: 256GB (half-width)
  - Currency: ¥9,999 (Japanese comma)
  - Dates: 2025年11月22日
- [ ] Update punctuation (ideographic commas、and periods。)
- [ ] Update quotation marks: use「」 instead of ""
- [ ] Verify all numbers/units use half-width characters

### Phase 6: Search & SEO

- [ ] Implement fuzzy search logic for Katakana/Romaji
- [ ] Update meta descriptions (90 character limit)
- [ ] Update OG tags (Japanese-friendly titles)
- [ ] Adjust page titles for Japanese character limits
- [ ] Create sitemap-ja.xml

### Phase 7: Legal Compliance

- [ ] Add PR disclosure at top of device pages:
  ```
  「本ページはプロモーションが含まれています。」
  ```
- [ ] Add footer affiliate disclosure
- [ ] Include Amazon affiliate disclosure on every page with links
- [ ] Verify compliance with FTC/JOGA stealth marketing regulations

### Phase 8: Component Updates

- [ ] FAQ section: Use Japanese punctuation & formality
- [ ] Brands table: Add 動作確認 column, expand brands (add Nextorage)
- [ ] Search bar: Update placeholder with Katakana examples
- [ ] Buttons: Consider adding subtle gradient/shadow for "clickability"
- [ ] Footer: Add Japanese-specific links (プライバシーポリシー, 広告について)

### Phase 9: Testing

- [ ] Test on macOS (verify Hiragino fonts render)
- [ ] Test on iOS (verify Hiragino Sans rendering)
- [ ] Test on Windows (verify Meiryo rendering)
- [ ] Test search with Katakana & Romaji inputs
- [ ] Verify line breaks don't occur mid-word
- [ ] Test form inputs with Japanese input methods (IME)
- [ ] Accessibility test (contrast ratios, screen readers)
- [ ] Core Web Vitals check (LCP, CLS, INP)

### Phase 10: Local Market Optimization

- [ ] Prioritize Nextorage in recommended brands
- [ ] Ensure Walkman (DAP) pages are high-quality
- [ ] Ensure Nintendo Switch page is detailed
- [ ] Add links for popular Japanese tech forums
- [ ] Optimize for Kakaku.com/e-イヤホン backlinks (guide-quality content)

### Phase 11: Launch & Monitoring

- [ ] Set up Google Search Console for ja subdomain/subfolder
- [ ] Submit sitemap-ja.xml
- [ ] Monitor organic traffic from Japanese sources
- [ ] Track conversion rates (affiliate clicks)
- [ ] Gather feedback from Japanese tech communities
- [ ] Monitor local search term trends

---

## Quick Reference: Key Changes for Japanese

| Element | English | Japanese |
|---------|---------|----------|
| **Font Stack** | System fonts | Hiragino/Meiryo |
| **Line Height (body)** | 1.6 | 1.8 |
| **Line Height (heading)** | 1.3 | 1.5 |
| **Font Weight** | 300-700 all used | 400, 700 only |
| **Italics** | Normal | Never use |
| **Text Color** | #555555 | #444444 |
| **Numbers** | 256GB, V30 | 256GB、V30 (half-width) |
| **Currency** | $99.99 | ¥9,999 |
| **Punctuation** | , . "" | 、 。「」|
| **Trust Language** | "Compatible" | "動作確認済み" |
| **Tone** | Confident/brief | Thorough/detailed |
| **Buttons** | Flat, minimal | Subtle gradient, shadow |
| **Info Density** | Spacious | Richer, more data above fold |
| **PR Disclosure** | Footer | Top of page (legal requirement) |

---

## Cultural Do's & Don'ts

### DO ✓

- Use official SD Association logos prominently
- Reference manufacturer specs as authority
- Include Nextorage as top recommendation
- Make pages suitable for forum sharing (photographers, gamers)
- Add "Operation Confirmed" language
- Use Japanese-specific punctuation
- Test fonts on real devices (Mac, Windows, iPhone)
- Expand FAQ to address compatibility concerns
- Include more brands (shows thoroughness)
- Add subtle gradients/shadows to buttons

### DON'T ✗

- Use light font weights for body text
- Use italics for Japanese text
- Rely solely on whitespace (feels incomplete)
- Ignore Katakana in search (users search this way)
- Use full-width numerals (looks dated)
- Hide affiliate disclosure (legal requirement)
- Use "best" language literally (use "おすすめ" instead)
- Assume same brand preferences as US market
- Skip manufacturer compliance checks
- Use minimum contrast ratios (Japanese Kanji needs breathing room)

---

## Future Enhancements

- [ ] Add user review system (with moderation)
- [ ] Create "Japanese Influencer" partnership for tech blogs
- [ ] Implement comparison charts (Japanese users love detailed comparisons)
- [ ] Create video guides (YouTube with Japanese subtitles)
- [ ] Add "Price History" tracker (Japanese users price-compare heavily)
- [ ] Localize images: Replace English text overlays with Japanese
