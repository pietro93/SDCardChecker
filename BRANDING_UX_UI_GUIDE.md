# SD Card Checker - Branding, UX/UI & Look & Feel Guide

**Version:** 1.0  
**Last Updated:** September 26, 2026 (added Writing Rules section and `scripts/lint-copy.js`)  
**Purpose:** Design system, visual identity, and user experience guidelines for all interfaces

---

## Table of Contents

1. [Brand Identity](#brand-identity)
2. [Design System](#design-system)
3. [Color Palette](#color-palette)
4. [Typography](#typography)
5. [Spacing & Layout](#spacing--layout)
6. [UI Components](#ui-components)
7. [UX Principles](#ux-principles)
8. [Accessibility Standards](#accessibility-standards)
9. [Responsive Design](#responsive-design)
10. [Visual Patterns](#visual-patterns)
11. [Interactive Elements](#interactive-elements)
12. [Imagery & Icons](#imagery--icons)

---

## Brand Identity

### Brand Positioning

**SD Card Checker** is positioned as a **trusted, authoritative, yet accessible guide** for choosing the right SD card. The brand balances:

- **Expertise**: Professional, research-backed recommendations
- **Clarity**: No jargon—anyone can understand
- **Trustworthiness**: Transparent, unbiased information
- **Simplicity**: Finding the right card is uncomplicated

### Brand Voice & Tone

#### Voice Characteristics

| Dimension | Approach |
|-----------|----------|
| **Tone** | Helpful, friendly, confident (not condescending) |
| **Language** | Clear, direct, minimal jargon |
| **Confidence** | Definitive recommendations without hedging |
| **Formality** | Professional but approachable |
| **Personality** | Expert guide, not corporate |

#### Example Messaging

❌ **Too Corporate:**
> "The selection of optimal storage media for your recording device necessitates consideration of various technical parameters..."

✅ **Brand Voice:**
> "Here's the best SD card for your device and why it works."

❌ **Too Casual:**
> "yo, just get this card bruh, it slaps"

✅ **Brand Voice:**
> "This card is perfect for 4K video. Here's why."

### Brand Promise

**"Get the right SD card in seconds. No guessing."**

Every page, interaction, and feature should reinforce this promise.

---

## Writing Rules

**Added:** September 26, 2026. This section is the single source for how every English sentence on the site is written: device data (`data/categories/*.json`), card and reader data, enrichment files, calculator content, guides, templates, meta descriptions and schema text. Localized copy is out of scope for now.

**Enforced by:** `node scripts/lint-copy.js` (add `--verbose` for every hit, `--file <path>` for one file, `--rule <id>` for one rule). Run it before committing copy changes. Some hits are legitimate (see "Allowed uses" below); the linter flags, a person decides.

Two tests sit under every rule:

- **The paste test.** If a sentence could paste unchanged onto another device's page, it says nothing about this one. Rewrite it with a fact only this device has: its max bitrate, its card slot type, its capacity limit, its file system, its known quirk.
- **The deletion test.** Delete the sentence. If the reader loses no fact and no decision, leave it deleted.

### Voice

- Direct, plain, declarative sentences. A technician who has answered this question a thousand times.
- US spelling and US dates: "optimize," "color," "gray," "September 26, 2026."
- Lead with the answer, then the reason. "Use a V30 microSDXC card. The camera writes up to 120 Mbps in 4K."
- Numbers beat adjectives. "Writes 170 Mbps" beats "demanding." "Fills 128GB in about 90 minutes" beats "huge files."

### Sentence-level bans

| Pattern | Example to cut | Do instead |
|---|---|---|
| Em dashes | "The card is fast — about 90 MB/s" | Comma, period, or colon |
| "Not X, Y" contrast | "It's not just about speed, it's about reliability" | Say what it is |
| Sincerity flags | actually, honestly, genuinely, truly, "real" or "actual" as emphasis | State the fact |
| Hedges as emphasis | really, in fact, notably, simply, essentially, basically | Cut |
| Chopped fragment lists | "Fast. Reliable. Affordable." | One connected sentence |
| AI vocabulary | seamless, stunning, effortless, hassle-free, peace of mind, robust, unlock, elevate, leverage, navigate, journey, boasts, cutting-edge, "whether you're…", "in today's…" | The plain word, or a number |
| Hype adjectives | perfect, ideal, ultimate, must-have, amazing, blazing | Say who it fits and why: "fits 4K60 recording because…" |
| Copula dodges | "serves as," "stands as," "acts as" | "is" |
| Fake ranges | "from beginners to pros" | Name who it is for |
| Reflexive triples | "fast, reliable, and affordable" | Keep the one item that matters |
| Colon reveals and bold fragment labels | "The result:", "Here's the kicker:" | A full sentence |
| Rhetorical question leads | "Tired of corrupted footage?" | Open on the fact |
| Closing "-ing" morals | "…, ensuring you never miss a moment" | Stop at the fact |
| Exclamation marks | "Great choice!" | None |

FAQ questions are the exception to the question rule. They are search queries and should read like one.

### Allowed uses (linter false positives)

- "genuine" in the counterfeit sense: "a genuine SanDisk card" versus a fake.
- "landscape" as photography: "landscape photographers."
- "ideal" and "perfect" inside a quoted product name or a spec sheet quote.
- "real-world speed" as a technical term (sustained versus peak).

### Overexplaining

- **Say it once.** `whySpecs`, the hero explanation and the FAQ answers each carry a different fact. The explanation does not restate the spec box; the FAQ does not restate `whySpecs`.
- **No signposting.** Cut "This guide covers…", "Below you'll find…", "It's worth noting that", "Here's how it works."
- **No stalling openers.** Cut "The short version," "That said," "Simply put," "At the end of the day."
- **No closing morals.** Stop when the fact is delivered.
- **Don't define what the reader knows.** Someone searching "Steam Deck SD card" knows what a Steam Deck is.
- **One caveat, one place.**

### Oversharing

- Tell the reader what they need to buy the right card, not how the site works inside. No pipeline talk, no "AI-generated," no enrichment or scoring mechanics in public copy.
- Internal notes (for example `notes` fields that are editor instructions) never render on a page. If a field renders, write it for the reader.

### Accuracy rules

Every spec claim must be checkable against the manufacturer's spec sheet or manual.

- **Card format:** say exactly what the slot takes (SD, microSD, CFexpress Type A/B, internal only, USB drive). Do not recommend SD cards for a device that records to a USB drive or internal storage without saying so plainly.
- **Max capacity:** use the manufacturer's stated maximum. If they state none, say "tested up to" with a source, or omit it. microSDXC tops out at 2TB by spec; SDUC goes higher.
- **Speed classes:** V30 = 30 MB/s minimum sustained write, U3 = 30 MB/s, U1 = 10 MB/s, V60 = 60 MB/s, V90 = 90 MB/s. A1/A2 are app (random IOPS) ratings, not video ratings. UHS-II only helps in a UHS-II slot.
- **Endurance:** manufacturers rate high-endurance cards in hours of recording (for example "up to 120,000 hours"), not in write cycles. Do not invent cycle counts or TBW figures.
- **Bitrates:** quote the device's top bitrate in Mbps and convert correctly (8 Mbps = 1 MB/s).
- **Recording time estimates:** show the math or round conservatively. "About 2.5 hours of 4K at 100 Mbps on 128GB."

### SEO copy

- The page `<title>`, meta description and H1 keep the search phrase ("[Device] SD card", "best SD card for [Device]"). Brand voice goes around the keyword, never in place of it.
- Meta descriptions: 140 to 160 characters, lead with the answer (format + speed class + capacity), end with a concrete reason.
- FAQ questions match how people search: "What SD card does the DJI Mini 4 Pro use?", "What is the max SD card size for Steam Deck?"
- The first sentence on the page answers the query in full.

### Headers

- Guide H2s state the finding: "V30 is enough for 4K at 100 Mbps" over "Speed Requirements."
- No placeholder section titles: "The Bottom Line," "Key Takeaways," "Final Thoughts," "Conclusion," "Summary."
- Allowed: short UI headings, numbered steps followed by a sentence, card and device names as labels in comparison tables.

### UI copy budgets

| Element | Budget |
|---|---|
| Heading | 8 words or fewer, sentence case |
| Helper text | One sentence, or none if the label says it |
| Button | Verb + object ("Check price on Amazon"), never "Click here" |
| Error | What happened, then what to do |
| Exclamation marks | None |

### Before publishing

1. Run `node scripts/lint-copy.js --file <changed file> --verbose` and clear or justify every hit.
2. Read every heading and bold label against the header rules. The linter does not catch these.
3. Apply the deletion test to the first and last sentence of each section.
4. Check every number against a source.

---

## Design System

### Design Philosophy

1. **Content-First**: Design supports content, not the reverse
2. **Scannable**: Users scan, not read. Use visual hierarchy
3. **Purposeful**: Every element serves a function
4. **Accessible**: Works for everyone (color-blind, keyboard-only, screen readers)
5. **Fast**: Design respects user time—no unnecessary animations
6. **Consistent**: Predictable patterns throughout the site

### Design Tokens

Core design values baked into every decision:

```
CLARITY:      Content is easy to find and understand
SPEED:        Pages load fast, interactions respond instantly
TRUST:        Professional, well-organized, transparent
SIMPLICITY:   Unnecessary complexity removed
ACCESSIBILITY: Usable by everyone, regardless of ability
```

---

## Color Palette

### Primary Colors

| Color | Value | Usage | Purpose |
|-------|-------|-------|---------|
| **Primary Blue** | `#1F4788` | CTA buttons, links, active states | Trust, professionalism |
| **Accent Orange** | `#FF8C42` | Highlights, badges, emphasis | Energy, approachability |
| **Dark Slate** | `#1A1A1A` | Text, headings, borders | Contrast, readability |
| **Neutral Gray** | `#F5F5F5` | Backgrounds, containers | Cleanliness, breathing room |

### Secondary Colors

| Color | Value | Usage |
|-------|-------|-------|
| **Success Green** | `#22C55E` | Checkmarks, confirmations |
| **Warning Red** | `#EF4444` | Alerts, incompatibilities |
| **Neutral Silver** | `#E5E5E5` | Subtle dividers, disabled states |
| **Light Cream** | `#FFFBF0` | Subtle backgrounds |

### Color Application

#### Buttons

```
Primary Button:    Dark Blue (#1F4788) text white
Secondary Button:  Outline dark blue, no fill
Accent Button:     Orange (#FF8C42) text white
Disabled:          Gray (#E5E5E5) text lighter gray
```

#### Cards & Containers

```
White background   (#FFFFFF) - Device cards, specs
Light gray         (#F5F5F5) - Section backgrounds
Subtle cream       (#FFFBF0) - Call-to-action areas
```

#### Text

```
Headings:          #1A1A1A (dark slate)
Body text:         #333333 (dark gray)
Secondary text:    #666666 (medium gray)
Links:             #1F4788 (primary blue), underlined
Links (hover):     #FF8C42 (accent orange)
```

### Color Accessibility

- **Contrast Ratio**: All text meets WCAG AA (4.5:1 minimum)
- **Color Blindness**: No information conveyed by color alone
- **Example**: "✓ Available" (checkmark + text, not just color)

---

## Typography

### Typeface Stack

```css
/* Headings & Display */
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
/* Professional, modern, reads well at all sizes */

/* Body Text */
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
/* Same as headings for consistency */

/* Code & Technical Text */
font-family: "Courier New", monospace;
/* Monospace for specs, technical details */
```

### Font Sizes & Scale

```
Headline 1 (H1):      32px / 1.2 line-height    (Page titles)
Headline 2 (H2):      24px / 1.3 line-height    (Section titles)
Headline 3 (H3):      20px / 1.3 line-height    (Subsections)
Headline 4 (H4):      18px / 1.4 line-height    (Card titles)
Body Large:           18px / 1.6 line-height    (Important content)
Body Regular:         16px / 1.6 line-height    (Primary content)
Body Small:           14px / 1.5 line-height    (Secondary info)
Caption:              12px / 1.5 line-height    (Metadata, labels)
```

### Font Weights

```
Thin/Light:          300  (Not used for body—too hard to read)
Regular:             400  (Default for body text)
Medium:              500  (Emphasis within text)
Semibold:            600  (Subheadings, labels)
Bold:                700  (Headings, strong emphasis)
```

### Line Height & Spacing

```
Headings:            1.2 (tighter, more impactful)
Body Text:           1.6 (spacious, easy reading)
Lists:               1.8 (extra breathing room)
Code:                1.4 (compact, precise)
```

### Text Hierarchy Example

```
Page Title          → H1, 32px, bold, dark slate
Section Title       → H2, 24px, bold, dark slate
Content Heading     → H3, 20px, semibold, dark slate
Card Title          → H4, 18px, semibold, dark gray
Body Copy           → 16px, regular, dark gray (#333)
Secondary Info      → 14px, regular, medium gray (#666)
Metadata            → 12px, regular, light gray (#999)
```

---

## Spacing & Layout

### Spacing Scale

Consistent spacing creates rhythm and clarity.

```
4px   - Micro spacing (between small elements)
8px   - Tight spacing (tight component margins)
12px  - Default text padding
16px  - Standard spacing (most common)
24px  - Generous spacing (between sections)
32px  - Large spacing (major section breaks)
48px  - Extra large spacing (page sections)
64px  - Hero spacing (top/bottom of major areas)
```

### Grid System

```
12-column grid (desktop)
Container: 1200px max width
Gutters: 24px between columns
Padding: 24px sides (desktop), 16px (tablet), 12px (mobile)

Breakpoints:
- Mobile:   320px - 639px
- Tablet:   640px - 1024px
- Desktop:  1025px+
```

### Layout Patterns

#### Card Layout

```
Device Card:
┌─────────────────────┐
│  [Card Header]      │ ← 12px padding top
├─────────────────────┤
│                     │
│  [Card Body]        │ ← 16px padding sides
│  [Main Content]     │ ← 24px padding vertical
│                     │
├─────────────────────┤
│ [Card Footer]       │ ← 12px padding bottom
└─────────────────────┘
```

#### Section Layout

```
[Page Section]
├─ Margin top: 48px
├─ Padding: 24px sides, 32px vertical
├─ Content max-width: 900px
└─ Margin bottom: 48px
```

#### Whitespace Strategy

- **Between Elements**: 16px default
- **Between Sections**: 32-48px
- **Around Text Blocks**: 24px sides

**Rule**: If it looks cramped, add 8px more.

---

## UI Components

### Buttons

#### Button Types

##### Primary Button (CTA)

```
Background:  #1F4788 (dark blue)
Text:        White, 16px, semibold
Padding:     12px 24px (height 44px minimum for touch)
Border:      None
Radius:      6px
Hover:       #153A5C (darker blue), shadow
Active:      #0F2844 (even darker)
Focus:       Blue outline, 2px
```

**Use for:**
- "View Recommendations"
- "Get Calculator"
- Primary actions

##### Secondary Button

```
Background:  Transparent
Border:      2px #1F4788
Text:        #1F4788, 16px, semibold
Padding:     10px 22px (account for border)
Radius:      6px
Hover:       Light blue background #F0F4F8
Focus:       Blue outline
```

**Use for:**
- Alternative actions
- Less important CTAs
- "Learn More"

##### Accent Button

```
Background:  #FF8C42 (orange)
Text:        White, 16px, semibold
Padding:     12px 24px
Radius:      6px
Hover:       #E07A2F (darker orange)
```

**Use for:**
- Highlight featured cards
- Special promotions
- Emphasis

#### Button States

```
Default:     Normal appearance
Hover:       Darker color, subtle shadow
Active:      Even darker, pressed feel
Focus:       2px outline visible
Disabled:    Gray background #E5E5E5, gray text
Loading:     Spinner, text changes to "Loading..."
```

### Cards

#### Device Card

```
┌────────────────────────────────┐
│  [Image - 240px x 180px]       │
├────────────────────────────────┤
│ Device Name                    │
│ Category • Rating              │
├────────────────────────────────┤
│ Compatible with:               │
│ • SD UHS-II (V30)              │
│ • 128GB-512GB capacity         │
├────────────────────────────────┤
│ [View Recommendations] →       │
└────────────────────────────────┘

Width:      On grid (responsive)
Padding:    16px internal
Border:     1px light gray
Radius:     8px
Shadow:     Subtle (0 2px 8px rgba(0,0,0,0.1))
Hover:      Shadow increases, slight lift
```

#### Spec Card

```
┌──────────────────┐
│ Speed Class      │
│ V30              │ ← Large, bold
│                  │
│ Min 30MB/s write │ ← Subtitle explanation
└──────────────────┘

Background: #F5F5F5
Padding:    16px
Radius:     6px
Border:     1px #E5E5E5
```

### Forms & Inputs

#### Input Fields

```
┌─────────────────────────────┐
│ Enter your device name... ▼  │
└─────────────────────────────┘

Height:      44px
Padding:     12px 16px
Border:      2px solid #E5E5E5
Radius:      6px
Font:        16px (prevents mobile zoom)
Focus:       2px solid #1F4788 border
Error:       2px solid #EF4444 border
```

#### Dropdown/Select

```
Closed:     Shows selected option, chevron down
Open:       Options list, highlight on hover
Selection:  Shows selected, chevron closes
```

### Tables

#### Specs Table

```
┌──────────────────┬──────────────────┐
│ Specification    │ Value            │ ← Header: semibold
├──────────────────┼──────────────────┤
│ Card Type        │ microSD UHS-II   │ ← Row height: 48px
├──────────────────┼──────────────────┤
│ Write Speed      │ V30 (30 MB/s)    │
├──────────────────┼──────────────────┤
│ Capacity         │ 128GB, 256GB     │
└──────────────────┴──────────────────┘

Row height:       48px
Text padding:     16px
Alternating rows: White / #F5F5F5 (optional)
Border:           Light gray (#E5E5E5)
```

### Badges & Tags

#### Badge (for labels)

```
[V30] [UHS-II] [Recommended]

Background:  #1F4788
Text:        White, 12px, semibold
Padding:     4px 12px
Radius:      4px (pill-shaped)
```

#### Tag (for filtering)

```
[Action Cameras] [Gaming] [4K Video]

Background:  #F0F4F8
Text:        #1F4788, 12px
Padding:     8px 12px
Radius:      6px
Border:      1px #1F4788 (optional)
Hover:       Background darker
```

---

## UX Principles

### 1. Progressive Disclosure

Show essentials first, details on demand.

```
Device Page Layout:
├─ Top Priority: Device name, best SD card recommendation
├─ Mid Priority: Why specs matter, where to buy
└─ Low Priority: FAQ, related devices, specs deep-dive
```

### 2. Scanability > Reading

Users scan. Support that.

```
✓ Use headings liberally
✓ Bold key phrases
✓ Short paragraphs (2-3 sentences)
✓ Lists over prose
✓ Icons + text (not text alone)
```

### 3. Reduce Cognitive Load

Make decisions easy.

```
❌ "Here are 47 cards to choose from"
✓ "Best for this device: SanDisk Extreme (here's why)"

❌ "Choose from: UHS-II, UHS-I, HS..."
✓ "This device needs: [SPEC]. Here's what that means."
```

### 4. Consistency is Predictability

Same patterns work the same way everywhere.

```
All links styled the same
All buttons function the same way
All cards have same interaction
All forms follow same layout
```

### 5. Mobile-First Design

Design for mobile first, enhance for desktop.

```
Mobile (320px):      Single column, touch-friendly
Tablet (640px):      Two columns where appropriate
Desktop (1200px):    Full layout, more whitespace
```

### 6. Error Prevention

Don't let users make mistakes.

```
✓ Disable incompatible options
✓ Show clear incompatibility reasons
✓ Confirmation before major actions
✓ Undo/back options always available
```

### 7. Feedback & Responsiveness

User actions need immediate feedback.

```
Button click → Highlight + show result
Form submission → Loading spinner + success message
Search → Results appear as user types
Filter → Page updates without page reload
```

---

## Accessibility Standards

### WCAG 2.1 Level AA Compliance

**SD Card Checker** meets or exceeds WCAG AA standards.

### Color & Contrast

```
Text:            Minimum 4.5:1 contrast ratio
Large text:      Minimum 3:1 contrast ratio
UI components:   3:1 for visual indicator
Focus:           Visible focus indicator (2px minimum)
```

### Keyboard Navigation

```
Tab order follows visual flow
All interactive elements keyboard-accessible
No keyboard traps
Focus indicators clearly visible
Shortcuts documented (if used)
```

### Screen Readers

```
Semantic HTML (not divs)
Alt text for all meaningful images
ARIA labels where needed
Form labels properly associated
Skip links for navigation
```

### Text & Readability

```
Max line length:       75 characters
Font size minimum:     14px for body text
Line height:           1.5 minimum
Color not only means:  Use text + icon + color
```

### Testing

- ✓ Chrome DevTools Lighthouse (Accessibility score)
- ✓ WebAIM Contrast Checker
- ✓ Keyboard-only navigation
- ✓ Screen reader testing (NVDA, JAWS)
- ✓ Mobile accessibility (VoiceOver on iOS)

---

## Responsive Design

### Breakpoint Strategy

```
Mobile-first approach: Design mobile first, enhance up

Mobile      < 640px   (phones, vertical orientation)
Tablet      640-1024px  (iPads, small laptops)
Desktop     > 1024px   (full-size screens)
```

### Device Optimization

#### Mobile (< 640px)

```
Single column layout
Full-width content
Large touch targets (44px minimum)
Hamburger navigation
Simplified tables → stacked rows
Reduced animations (performance)
```

#### Tablet (640-1024px)

```
Two-column layout (where appropriate)
Increased padding
Medium touch targets
Visible navigation
More breathing room
```

#### Desktop (> 1024px)

```
Multi-column layouts
Sidebar navigation
Hover states (desktop-only interactions)
Full feature set
Maximum whitespace
```

### Responsive Components

#### Navigation

```
Desktop:   Horizontal navbar + sidebar
Tablet:    Horizontal navbar, collapsible sidebar
Mobile:    Hamburger menu, full-screen drawer
```

#### Grid

```
Desktop:   4-column card grid
Tablet:    2-column card grid
Mobile:    1-column card grid
```

#### Tables

```
Desktop:   Full table view
Tablet:    Horizontal scroll (if <640px: stack)
Mobile:    Stacked row format
```

---

## Visual Patterns

### Loading States

#### Skeleton Screen (preferred)

```
Shows layout structure in gray
Gradual animation (subtle pulse)
Matches final layout exactly
Users know what's loading
```

#### Spinner

```
Circular, continuous rotation
Small size (24px-32px)
Centered on content
Text: "Loading..." or action verb
```

### Empty States

```
┌─────────────────────┐
│                     │
│    📭 No results    │
│                     │
│  Try different      │
│  search terms       │
│                     │
│  [Clear filters]    │
└─────────────────────┘

Visual:       Icon + message
Action:       Clear button or link
Helpful:      Suggestion, not error
```

### Success Messages

```
✓ "SD Card added to comparison!"

Background:   #F0FDF4 (light green)
Border:       1px #22C55E (green)
Text:         #166534 (dark green)
Icon:         ✓ checkmark
Position:     Top-right, toast style
Duration:     Auto-dismiss 4 seconds
```

### Error Messages

```
⚠ "Device not found. Check spelling and try again."

Background:   #FEF2F2 (light red)
Border:       1px #EF4444 (red)
Text:         #991B1B (dark red)
Icon:         ⚠ warning triangle
Position:     Top-center or inline
Duration:     Persistent until fixed
```

### Modals & Overlays

```
├─ Dark overlay (rgba(0,0,0,0.5))
│
└─ White modal centered
   ├─ Padding: 32px
   ├─ Border-radius: 8px
   ├─ Shadow: Large drop shadow
   ├─ Max-width: 600px
   └─ Close button: top-right or [Cancel]
```

---

## Interactive Elements

### Hover Effects

**Desktop Only** (mobile doesn't have hover):

```
Buttons:       Darker color + subtle shadow
Links:         Color change + underline
Cards:         Slight lift (shadow increase) + opacity
Icons:         Color change or rotation
```

### Focus Indicators

```
All interactive elements must show focus

Style:       2px solid #1F4788 outline
Offset:      2px from element
Radius:      Match element border-radius
Visible:     High contrast, always visible
Keyboard:    Appears on Tab key
```

### Transitions & Animations

```
Duration:    200-300ms (fast, responsive)
Easing:      ease-in-out (natural)
Purpose:     Feedback or wayfinding only
Reduced motion: Respect prefers-reduced-motion

Examples:
- Button hover fade: 200ms
- Page transition: 300ms
- Loading spinner: Continuous 1.5s
- Modal slide-in: 250ms
```

### Clickable Areas

```
Buttons:       44px minimum height (touch-friendly)
Links:         Underlined, adequate padding
Icons:         24px minimum touch target
Cards:         Entire card clickable (cursor: pointer)
Checkboxes:    16x16px, label extends target area
```

---

## Imagery & Icons

### Image Strategy

#### Device Images

```
Purpose:       Product/device reference
Format:        WebP (fallback: JPG)
Resolution:    2x display density
Size:          240x180px (cards), 400x300px (detail)
Background:    White or transparent
Style:         Professional product photo or render
Alt text:      "{Device Name}" (functional, not decorative)
```

#### Brand Logos

```
Purpose:       Brand identification
Format:        SVG (scalable, crisp)
Size:          Variable (60x60px in cards)
Background:    Transparent
Style:         Official brand logo
Alt text:      "{Brand Name}" (e.g., "SanDisk")
```

#### Illustrations

```
Purpose:       Conceptual support (loading, empty states)
Style:         Consistent illustration system
Colors:        Brand palette
Complexity:    Simple, not photorealistic
Use case:      Decorative (can have empty alt="")
```

### Icon System

#### Icon Design

```
Style:         Rounded, modern, 24px base size
Strokes:       2px for consistency
Colors:        Match text color, or accent color
Consistent:    All icons from same set/style
Accessibility: Icons paired with text when meaningful
```

#### Common Icons

```
Device icon:        Device representation
Speed icon:         Speedometer or lightning bolt
Storage icon:       SD card or folder
Compatible icon:    Checkmark or link
Incompatible icon:  X or blocked
Search icon:        Magnifying glass
Menu icon:          Hamburger menu
Close icon:         X or back arrow
Filter icon:        Funnel shape
```

#### Icon + Text Pattern

```
✓ [Icon] Label              ← Standard (preferred)
[Icon alone]                ← Only if obvious or in menu
[Label with icon below]     ← Alternative layout
```

---

## Design Implementation

### Tailwind CSS Configuration

Color tokens in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    600: '#1F4788',    // Dark blue
    500: '#2952A3',    // Medium blue
    400: '#3D6AC7',    // Light blue
  },
  accent: {
    500: '#FF8C42',    // Orange
    400: '#FFB380',    // Light orange
  },
  gray: {
    900: '#1A1A1A',    // Dark slate
    700: '#333333',    // Dark gray
    600: '#666666',    // Medium gray
    400: '#999999',    // Light gray
    200: '#E5E5E5',    // Lighter gray
    100: '#F5F5F5',    // Very light gray
  },
}
```

### CSS Classes Pattern

```css
/* Buttons */
.btn-primary    → Primary button
.btn-secondary  → Secondary button
.btn-accent     → Accent button

/* Cards */
.card           → Base card style
.card-device    → Device-specific card
.card-spec      → Spec card

/* Text */
.text-heading   → Heading text
.text-body      → Body text
.text-secondary → Secondary text

/* Layout */
.container      → Max-width container
.grid           → Responsive grid
.section        → Page section spacing
```

### Component Example (HTML)

```html
<!-- Device Card -->
<div class="card card-device">
  <img src="device.jpg" alt="GoPro Hero 13" class="w-full h-48 object-cover">
  
  <div class="p-4">
    <h3 class="text-xl font-semibold text-slate-900">GoPro Hero 13</h3>
    <p class="text-sm text-gray-600 mt-1">Action Cameras</p>
    
    <div class="mt-4 space-y-2">
      <p class="text-sm"><span class="font-semibold">Card Type:</span> microSD UHS-I</p>
      <p class="text-sm"><span class="font-semibold">Speed:</span> V30 (30 MB/s)</p>
    </div>
    
    <button class="btn-primary w-full mt-6">View Recommendations →</button>
  </div>
</div>
```

---

## Design Dos & Don'ts

### DO ✓

- Use consistent spacing (from scale)
- Provide clear hierarchy with size/weight
- Include alt text on all images
- Test on actual devices (not just browsers)
- Use semantic HTML
- Implement focus indicators
- Test color contrast ratios
- Make animations optional (prefers-reduced-motion)
- Use meaningful button text ("Buy Now" not "Click Here")
- Validate forms helpfully

### DON'T ✗

- Mix font families (stick to system stack)
- Use red + green alone for meaning (color-blind users)
- Auto-play videos or audio
- Pop-ups without close button
- Skip focus indicators (improves usability for everyone)
- Use placeholder text as label
- Rely on hover for mobile
- Create layouts that break at specific sizes
- Use too many animation effects
- Forget about 100% keyboard navigation

---

## Brand Application Examples

### Device Page (Top Section)

```
[Hero Image - 100% width]

[Device Name] H1
Category badge | Rating

[4 Spec Cards in grid]
├─ Card Type: microSD UHS-I
├─ Speed: V30
├─ Capacity: 128GB-512GB
└─ Max Capacity: 512GB

[Why These Specs] (explainer text)

[Primary Button: "View Recommendations"]
```

### Homepage (Hero Section)

```
┌──────────────────────────────────┐
│                                  │
│  [Search Box]                    │ ← Center, large
│  "Find the right SD card..."     │
│                                  │
│  [Popular: GoPro • Nintendo...]  │ ← Suggestion chips
│                                  │
└──────────────────────────────────┘

Colors:  Dark slate bg, white text, orange accent
Spacing: Large padding (64px top/bottom)
```

### Product Card (Comparative View)

```
┌─────────────────────┐
│ [Brand Logo]        │
├─────────────────────┤
│ Product Name        │
│ ★★★★★ (5 stars)    │
├─────────────────────┤
│ $89.99              │ ← Price
│ 1000x Speed         │
│ V30 Class           │
├─────────────────────┤
│ [Compare] [Buy →]   │
└─────────────────────┘
```

---

## Localization Considerations

### Multi-Language Design

- **Text expansion**: German/Spanish longer than English (allocate 30% more space)
- **RTL support**: If adding Arabic/Hebrew, mirror layouts
- **Icons**: Some regional variations (e.g., phone numbers)
- **Numbers/dates**: Locale-specific formatting

### Design for Translation

- Leave 20% extra space in UI for text expansion
- Don't embed text in images
- Use variable-width fonts (not monospace for body)
- Test translated content in actual layout

---

## Performance & Design

### Image Optimization

```
WebP + JPG fallback
Responsive images (srcset)
Lazy loading for below-fold images
Appropriate sizing (not oversized)
```

### Animation Performance

```
Use CSS transforms (GPU-accelerated)
Avoid animating position/size
60fps target
Reduce animations on low-end devices
Respect prefers-reduced-motion
```

### File Size Budget

```
Total CSS:        < 50KB (Tailwind compiled)
Total JS:         < 100KB
Hero images:      < 200KB (optimized)
Card images:      < 50KB each
```

---

## Deployment & Testing

### Design QA Checklist

- [ ] All buttons clickable, styled consistently
- [ ] Color contrast passes WCAG AA
- [ ] Keyboard navigation works (Tab through page)
- [ ] Focus indicators visible
- [ ] Mobile view responsive (no horizontal scroll)
- [ ] Images load correctly (alt text present)
- [ ] Links styled uniquely (underlined or colored)
- [ ] Forms functional, labels present
- [ ] Error/success messages styled
- [ ] Print styles work (if applicable)
- [ ] Dark mode tested (if implemented)
- [ ] Different browsers tested (Chrome, Safari, Firefox, Edge)

### Browser Support

```
Chrome/Edge:     Latest 2 versions
Firefox:         Latest 2 versions
Safari:          Latest 2 versions
Mobile:          iOS Safari 12+, Chrome Android latest
```

---

## Future Design Enhancements

- [ ] Dark mode support
- [ ] Advanced animations (page transitions)
- [ ] Micro-interactions (button feedback)
- [ ] Comparison view (side-by-side cards)
- [ ] User ratings & reviews
- [ ] Advanced filtering UI
- [ ] Interactive device selector
- [ ] Video tutorials
- [ ] Live price tracking
