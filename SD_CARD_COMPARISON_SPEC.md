# SD Card Comparison Tool - Specifications & Recommendations

> **⚠️ SUPERSEDED — kept for historical reference only.** See [SD_CARD_COMPARISON_SERVICE_DESIGN.md](SD_CARD_COMPARISON_SERVICE_DESIGN.md) and [SD_CARD_COMPARISON_KANBAN.md](SD_CARD_COMPARISON_KANBAN.md) for the current, approved design. In particular, this doc's "pre-generate static vs-pages for SEO" strategy was reconsidered and rejected — see the Decision Log in the new doc.

**Status:** Design Phase (Pre-Implementation)  
**Created:** November 13, 2025  
**Owner:** TBD

---

## 📋 OVERVIEW

An interactive tool allowing users to compare 2-3 SD cards side-by-side, displaying specs, performance metrics, pros/cons, and pricing. Positioned as the conversion funnel final step: Device → Recommended Cards → Compare Cards → Purchase.

---

## 🎯 BUSINESS GOALS

| Goal | Metric | Impact |
|------|--------|--------|
| Increase conversion | +15-20% affiliate clicks | Users compare before buying |
| Reduce decision fatigue | Reduce bounce on card pages | Direct comparison prevents tab-switching |
| SEO long-tail keywords | Target comparison queries | "SanDisk vs Lexar SD card", etc. |
| Organic traffic | +10% monthly traffic | Comparison pages rank for new queries |

---

## 🔍 SEO STRATEGY

### Target Keywords
```
Primary:
- "SD card comparison"
- "best SD card for [device]"
- "[Brand A] vs [Brand B] SD card"
- "SD card speed comparison chart"

Secondary (long-tail):
- "microSD vs SD card comparison"
- "UHS-I vs UHS-II comparison"
- "V30 vs V60 vs V90 SD card"
- "[Device] SD card recommendations vs alternatives"
```

### Schema Markup

**1. Product Schema (for each card)**
```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "SanDisk Extreme microSD",
  "image": "/img/cards/sandisk-extreme-microsd.webp",
  "description": "Fast V30 microSD card for 4K video",
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "USD",
    "price": "35"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1250"
  }
}
```

**2. ComparisonChart Schema (if showing multiple cards)**
```json
{
  "@context": "https://schema.org/",
  "@type": "ComparisonChart",
  "headline": "SD Card Comparison: SanDisk vs Lexar vs Kingston",
  "image": "/img/comparison-og.webp",
  "creator": {
    "@type": "Organization",
    "name": "SD Card Checker"
  }
}
```

**3. Breadcrumb Schema**
```
Home > Devices > [Device] > Recommended Cards > Compare Cards
Home > SD Cards > [Type] > Comparison
```

### Page Titles & Meta Descriptions

**Pattern 1: Direct Comparison**
- Title: `[Card A] vs [Card B] SD Card Comparison | SD Card Checker`
- Meta: `Compare [Card A] and [Card B]. See specs, speed, price, and recommendations. Find the best SD card for your needs.`
- URL: `/compare/sandisk-extreme-vs-lexar-professional/`

**Pattern 2: Category Comparison**
- Title: `Best microSD Cards Compared: V30, V60, Budget Options | SD Card Checker`
- Meta: `Compare top-rated microSD cards by speed class, price, and performance. Find the perfect card for your device.`
- URL: `/compare/microsd-cards/`

**Pattern 3: Device-Specific Comparison**
- Title: `Best SD Cards for GoPro Hero 13: Recommended Brands Compared`
- Meta: `Compare the 3 best SD cards for GoPro Hero 13. Speed specs, capacity options, and pricing.`
- URL: `/devices/gopro-hero-13/#compare`

### Internal Linking Strategy
- Device page → "Compare recommended cards" button/link
- Category page → "Compare [Type] cards" section
- Home page search results → "Compare cards" quick action
- Related devices section → Cross-comparison cards

---

## 🎨 UX STRATEGY

### User Flows

**Flow 1: Device → Comparison**
```
User arrives on device page (e.g., GoPro Hero 13)
↓
Sees "Recommended SD Cards" section with 3 options
↓
Clicks "Compare these cards" button
↓
Comparison page loads with pre-selected 3 cards
↓
Sees side-by-side specs, can swap cards
↓
Clicks Amazon link to purchase
```

**Flow 2: Browse → Comparison**
```
User searches for "microSD card comparison"
↓
Lands on SD Card Checker comparison landing page
↓
Selects card type (microSD, SD, CFast, etc.)
↓
Selects speed class/tier (Budget, Mid-Range, Premium)
↓
Page auto-populates top 3 cards
↓
User can manually select different cards
↓
Compares and purchases
```

**Flow 3: Direct Comparison**
```
User already decided on 2 cards, wants quick comparison
↓
Searches "[Card A] vs [Card B]"
↓
Lands on dedicated comparison page
↓
Sees direct side-by-side, can swap/add third card
↓
Purchases
```

### Page Layout Options

**Option A: 2-Column Comparison (Desktop)**
```
┌─────────────────────────────────────────────────┐
│ Header: "Compare SD Cards"                      │
│ Search/Select: [Dropdown] [Dropdown] [Add Card] │
├──────────────────────┬──────────────────────────┤
│  Card A              │  Card B                  │
│  [Image]             │  [Image]                 │
│  Name                │  Name                    │
│  Price: $35          │  Price: $40              │
│  ─────────────────── │  ──────────────────────  │
│  Type: microSD       │  Type: microSD           │
│  Speed: V30          │  Speed: V30              │
│  Write: 90 MB/s      │  Write: 70 MB/s          │
│  UHS: UHS-I          │  UHS: UHS-I              │
│  Tier: Mid-Range     │  Tier: Mid-Range         │
│  ─────────────────── │  ──────────────────────  │
│  Pros:               │  Pros:                   │
│  • Fast              │  • Professional          │
│  • Reliable          │  • Great warranty        │
│  ─────────────────── │  ──────────────────────  │
│  Cons:               │  Cons:                   │
│  • Mid-price         │  • More expensive        │
│  ─────────────────── │  ──────────────────────  │
│  [Buy on Amazon]     │  [Buy on Amazon]         │
└──────────────────────┴──────────────────────────┘
```

**Option B: 3-Column Comparison (Desktop)**
```
Same as above, but with 3 cards side-by-side. 
On mobile, stack vertically.
```

**Option C: Tabbed Comparison**
```
Tabs: [Card A] [Card B] [Card C] [vs Summary]

vs Summary view shows a comparison table:
┌────────────────┬──────────┬──────────┬──────────┐
│ Spec           │ Card A   │ Card B   │ Card C   │
├────────────────┼──────────┼──────────┼──────────┤
│ Type           │ microSD  │ microSD  │ microSD  │
│ Price          │ $35      │ $40      │ $20      │
│ Speed Class    │ V30      │ V30      │ V30      │
│ Write Speed    │ 90 MB/s  │ 70 MB/s  │ 60 MB/s  │
│ UHS            │ UHS-I    │ UHS-I    │ UHS-I    │
│ Tier           │ ⭐⭐⭐   │ ⭐⭐⭐   │ ⭐⭐     │
└────────────────┴──────────┴──────────┴──────────┘
```

**Recommended: Option A (2-col) or B (3-col) for clarity**

### Card Selection Mechanism

**Method 1: Dropdowns (Simple)**
```
Select card 1: [SanDisk Extreme ▼]
Select card 2: [Lexar Professional ▼]
[+ Add third card]
```
- Pro: Simple, clean
- Con: Requires knowing card names

**Method 2: Search + Filter (Better UX)**
```
Card 1:
Type: [microSD ▼]  Speed: [V30 ▼]  Brand: [All ▼]
Search: [_____]
[SanDisk Extreme] [Kingston Canvas] [Lexar Pro]

Card 2:
Type: [microSD ▼]  Speed: [V30 ▼]  Brand: [All ▼]
Search: [_____]
[SanDisk Ultra] [Kingston Canvas Go] [Samsung EVO]
```
- Pro: Users can filter by preferences
- Con: More complex UI

**Method 3: Quick Presets (Best for UX)**
```
Quick Compare Sets:
☐ Budget (under $25)     → [Kingston Canvas, SanDisk Ultra, Samsung EVO]
☐ Best Value ($25-45)    → [SanDisk Extreme, Kingston Canvas Go Pro, Lexar Silver]
☐ Professional ($45+)    → [SanDisk Extreme PRO, Lexar Professional, Sony TOUGH]

Or: Compare all 3 ▼
```
- Pro: Instant comparison, no friction
- Con: Less customization

**Recommended: Method 3 (presets) + Method 2 (advanced search)**

### Mobile UX

**Vertical Stack**
```
[Card A]
  [Image]
  Name
  Price
  Specs
  [Buy]

[Card B]
  [Image]
  Name
  Price
  Specs
  [Buy]

[Card C]
  [Image]
  Name
  Price
  Specs
  [Buy]
```

**Or: Horizontal Swiper (touch-friendly)**
```
← [Card A] | [Card B] | [Card C] →
   [Image] [Image] [Image]
   Swipe to see each card
```

**CTA Buttons**
- Make Amazon affiliate buttons PROMINENT and sticky (bottom of mobile)
- Use contrasting color (e.g., orange, not blue)
- Text: "View on Amazon" or "Check Price"

---

## 📊 DATA STRUCTURE FOR COMPARISON

### Required Card Fields
```json
{
  "id": "sandisk-extreme-microsd",
  "name": "SanDisk Extreme microSD",
  "type": "microSD",                    // Essential for filtering
  "uhs": "UHS-I",                       // Essential for comparison
  "speed": "V30",                       // Speed class
  "writeSpeed": "90 MB/s",              // Performance metric
  "priceEstimate": 35,                  // For sorting/filtering
  "priceTier": "Mid-Range",             // For quick presets
  "imageUrl": "/img/cards/...",
  "amazonSearchUrl": "https://...",
  "pros": "Fast, reliable, ...",
  "cons": "Mid-price point",
  "tier": "recommended",                // Tier indicator
  "capacity": "32GB, 64GB, 128GB, 256GB" // Optional but useful
}
```

### Additional Fields (Nice to Have)
```json
{
  "readSpeed": "170 MB/s",              // For pro comparisons
  "videoSpeed": "V30",                  // Can be different from write speed
  "durability": {                       // For positioning
    "waterproof": true,
    "shockproof": true,
    "temperature": "-25°C to 85°C"
  },
  "warranty": "Lifetime",               // Trust building
  "useCase": "4K Video, Gaming, etc",   // Situational
  "rating": 4.8,                        // From reviews
  "reviewCount": 1250,
  "bestFor": ["GoPro", "Nintendo Switch", "Drone"]
}
```

---

## 🔗 URL STRUCTURE

### Comparison Pages

**Dynamic: Pre-selected cards**
```
/compare/sandisk-extreme-vs-lexar-professional/
/compare/microsd-budget-comparison/
/compare/sd-4k-video-cards/
```

**With query params (for flexibility)**
```
/compare/?cards=sandisk-extreme-microsd,lexar-professional-633x,kingston-canvas-go
/compare/?type=microsd&tier=budget
/compare/?device=gopro-hero-13
```

**Device-specific anchor**
```
/devices/gopro-hero-13/#compare
Comparison section embedded on device page
```

### Recommendation
- Use static URLs for SEO (e.g., `/compare/sandisk-vs-lexar/`)
- Support query params for custom selections
- Device pages link to device-specific comparisons

---

## 📈 CONVERSION OPTIMIZATION

### Funnel Steps
1. **Discovery:** User lands on site (search, direct)
2. **Exploration:** User browses device or category page
3. **Recommendation:** User sees recommended SD cards
4. **Comparison:** User compares 2-3 cards side-by-side ← **YOU ARE HERE**
5. **Purchase:** User clicks Amazon affiliate link

### Conversion Levers

**CTA Placement**
- Sticky button at bottom of page (mobile & desktop)
- "View on Amazon" button next to each card
- Direct Amazon search URLs (not single product links—gives user flexibility)

**Trust Signals**
- Show Amazon rating/review count
- "Best Value" badge on recommended cards
- Tier indicators (Budget, Mid-Range, Professional)
- Price comparison chart

**Reduce Friction**
- No account required to compare
- Load comparison in <1 second
- Mobile-optimized interface
- One-click Amazon redirect

### Analytics to Track
```
- Comparison page views
- % of users who reach comparison page from device pages
- % of users who click Amazon link from comparison page
- Time spent on comparison page (optimal: 30-60 seconds)
- Device-to-purchase conversion rate by card
- Mobile vs Desktop comparison behavior
```

---

## 🎯 COMPARISON SCENARIOS

### Scenario 1: Budget Shopper
User searches: "cheapest microSD card that works"
- Lands on page
- Compares Budget tier cards
- Sees Kingston Canvas Go ($16) vs SanDisk Ultra ($20) vs Samsung EVO ($13)
- Picks Samsung EVO
- Buys on Amazon

**Key UX:** Quick presets, price sorting, clear pros/cons

### Scenario 2: Pro Filmmaker
User searches: "best SD card for 8K video comparison"
- Lands on page
- Compares Professional tier cards
- Sees SanDisk Extreme PRO CFexpress vs Lexar Professional 1000x vs Sony TOUGH
- Compares specs: write speed, V-class, durability
- Chooses based on bitrate requirements
- Buys on Amazon

**Key UX:** Detailed specs table, use-case information, performance metrics

### Scenario 3: Device Owner
User on GoPro Hero 13 device page
- Sees "Recommended Cards" section (3 cards)
- Clicks "Compare these cards"
- Pre-populated comparison shows recommended options
- Reads pros/cons, decides which brand
- Buys on Amazon

**Key UX:** Instant comparison, pre-selected cards, minimal friction

---

## 📱 RESPONSIVE DESIGN

### Desktop (1024px+)
- 2-3 column side-by-side comparison
- Full spec details visible
- All pros/cons expanded

### Tablet (768px-1023px)
- 2 column comparison
- Spec details collapsible/expandable
- Touch-friendly buttons

### Mobile (< 768px)
- Vertical stack or horizontal swiper
- Essential specs only (collapsible advanced specs)
- Large touch targets (>48px)
- Sticky CTA button at bottom
- Simplified card selection UI

---

## 🚀 ENTRY POINTS TO COMPARISON TOOL

1. **Device Page**
   - "Recommended Cards" section
   - [Compare These Cards] button
   - Pre-populated with 3 recommended cards

2. **Category Page**
   - New section: "Compare [Category] Cards"
   - Link to comparison page for that category

3. **Homepage**
   - "Quick Comparisons" widget
   - Popular comparisons: "Budget microSD", "Professional SD", etc.

4. **Search Results**
   - If user searches "[Card] vs [Card]", show comparison page
   - Keyword-triggered comparison landing pages

5. **Direct URL**
   - Users can search "/compare/[card]-vs-[card]" or visit comparison page directly

---

## 🛠️ TECHNICAL CONSIDERATIONS

### Data Source
- Pull from `/data/sdcards.json` (already populated with 30+ cards)
- Extend schema with optional fields (readSpeed, capacity, etc.)

### Rendering
- Static generation (build-time): Pre-generate popular comparisons
- Dynamic (fetch): Allow custom card selection
- Hybrid: Pre-generate top 10 comparisons, allow custom on-page

### Performance
- Lazy-load card images
- Comparison table: ~2KB data per card (acceptable)
- Target page load: <1 second on 3G

### Accessibility
- WCAG 2.1 AA compliant
- Screen reader friendly: table structure, alt text
- Keyboard navigation: Tab through cards, arrow keys to switch
- Color contrast: Don't rely solely on color for "recommended" badges

---

## 📋 IMPLEMENTATION CHECKLIST

Before building, confirm:
- [ ] Data structure updated with all needed fields
- [ ] URL structure approved
- [ ] Comparison layout wireframes approved
- [ ] Entry points identified (device pages, category pages, etc.)
- [ ] Amazon affiliate link strategy confirmed
- [ ] Mobile UX approach chosen (stack vs swiper)
- [ ] Analytics tracking plan defined
- [ ] SEO keywords and schema finalized
- [ ] Accessibility requirements reviewed

---

## 📊 SUCCESS METRICS

| Metric | Target | Timeline |
|--------|--------|----------|
| Comparison page views | 500+/month | 30 days |
| Comparison → Amazon click-through | 8%+ | 30 days |
| Avg time on comparison page | 45-60 sec | Ongoing |
| Mobile usability score | 90+ | Launch |
| Page load time | <1 sec | Launch |
| Lighthouse score | 95+ | Launch |
| Comparison page organic traffic | 200+ sessions/month | 60 days |

---

## 📝 OPEN QUESTIONS

1. Should we show user reviews/ratings on comparison pages? (requires external API or manual curation)
2. Should we include capacity options in comparison? (e.g., "SanDisk Extreme 128GB vs 256GB")
3. Should we generate custom comparison pages for [Card A] vs [Card B] combinations dynamically, or only pre-generate popular ones?
4. Should comparison pages show price ranges (varies by capacity) or fixed prices?
5. Should we include "in-stock" status from Amazon affiliates?
