# SDCardChecker Brand Guidelines
**Version 1.0**

## 1. Brand Essence

**Who We Are:** The fastest way to find the correct SD card for any device.

**Core Promise:** Answer one question perfectly: "What SD card do I need for [device]?" No jargon. No friction. No guessing.

**Personality:**
- Expert, direct, and helpful
- Honest about monetization (affiliate links, clearly disclosed)
- Fast-moving and decisive
- Zero ego—users' success comes first

---

## 2. Target Audience

Mid-funnel device owners actively searching for SD card compatibility. They're looking for:
- **One correct answer** (not options)
- **Quick results** (seconds, not minutes)
- **Product recommendations** (not educational content)
- **Price comparisons** (working affiliate links)

Common search intent: "GoPro Hero 13 SD card" or "Nintendo Switch microSD" or "DJI Air 3 memory card"

---

## 3. Brand Voice & Copy

**Tone:** Confident, clear, direct. Like a technician who's solved this 1,000 times.

**Headlines:** Energetic, benefit-focused
- ✓ "Find the Perfect SD Card for Your Device in Seconds"
- ✗ "Learn About SD Card Options"

**Body Copy:** Brief, factual, no filler
- Specs: exact numbers only
- Descriptions: 1–2 sentences per point
- CTAs: action-driven ("Check Price on Amazon," not "Learn More")

**Affiliate Disclosure:** Always visible, friendly tone
- Current: "This website contains affiliate links. We may earn a small commission when you purchase through our links at no extra cost to you."
- Tone: candid, never apologetic

**Do Not Change:** All current copy and messaging across templates (home, device pages, footer).

---

## 4. Visual Identity

### Logo & Branding
- **Wordmark:** "SDCardChecker" in bold sans-serif, no icon
- **Minimum size:** 24px height for readability
- **Usage:** Header, footer, social (never modified, stretched, or styled)

### Color Palette

| Element | Color | Usage |
|---------|-------|-------|
| Primary | #0066cc (Blue) | Links, form focus, accent cards, trust indicators |
| Dark | #1a1a1a (Near Black) | Headings, body text, header |
| Body | #555555 (Gray) | Paragraph text, secondary labels |
| Light | #f8f8f8 (Off White) | Card backgrounds, light sections |
| Accent | #ff9900 (Orange) | "Check Price" buttons (Amazon CTA) |
| Border | #e5e5e5 (Light Gray) | Card borders, table borders, dividers |

**Rules:**
- All interactive elements use primary blue or orange
- Body text always uses #555 on white/light backgrounds
- Headings always use #1a1a1a
- No custom colors without updating this guide

### Typography

**Font Stack:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

**Sizing:**
| Element | Size | Weight | Line Height |
|---------|------|--------|------------|
| H1 | 2.5rem | 700 | 1.3 |
| H2 | 1.75rem | 700 | 1.3 |
| H3 | 1.25rem | 700 | 1.3 |
| Body | 1rem (16px) | 400 | 1.6–1.7 |
| Small | 0.875rem | 400 | 1.5 |
| Labels | 0.75rem | 600 | 1.4 |

**Rules:**
- All headings: 700 weight, tight line height
- Body text: always #555 unless hovering (then opacity change)
- Labels: uppercase, 0.75rem, bold, tracking-wide

### Imagery

**Real Hardware Only**
- Device photos, product shots, SD card comparisons
- No lifestyle photos, no generic stock imagery
- Hero images: 1200×350px minimum, high contrast
- Product cards: 115×115px (mobile: 120×120px)

**Text Overlays on Images:**
- Dark overlay gradient: `rgba(0,0,0,0.2) to rgba(0,0,0,0.4)`
- Text always white, use text-shadow for legibility
- Center text on hero images

### Iconography

**FontAwesome 6 (solid set)**
- Search: `fas fa-search`
- Chevron/arrows: `fas fa-chevron-right`, `fas fa-arrow-right`
- Hamburger menu: `fas fa-bars`
- Size: inherit from parent font size (1.25rem for headers, 1rem for body)
- Color: inherit from parent (blue on links, dark on headings)

---

## 5. Layout & Grid System

### Container & Spacing
- **Max width:** 900px (`.container`)
- **Base spacing unit:** 0.5rem (8px)
- **Horizontal padding:** 1.5rem (24px) desktop, 1rem (16px) mobile
- **Vertical rhythm:** Multiples of 0.5rem (0.5rem, 1rem, 1.5rem, 2rem, 2.5rem)

### Responsive Breakpoints
- **Desktop:** 769px and above (full layout)
- **Tablet:** 481px–768px (adjusted spacing, 2-column grids)
- **Mobile:** 480px and below (single column, stacked cards)

### Key Components

**Cards**
- Background: white
- Border: 1px solid #e5e5e5
- Border radius: 6px (0.375rem)
- Shadow: `0 1px 3px rgba(0,0,0,0.1)` (default)
- Shadow on hover: `0 4px 12px rgba(0,0,0,0.15)`
- Padding: 1.5rem (24px)

**Buttons**
- Primary: Blue (#0066cc) text white, 6px radius, 2px border, hover darken or opacity
- Amazon CTA: Orange (#ff9900) text white, 6px radius, min-height 44px, hover scale 1.05
- Secondary: Gray border, black text, hover opacity
- **Never disable buttons**—use opacity 0.6 with `cursor: not-allowed`

**Tables**
- Header: #1a1a1a background, white text, 700 weight
- Rows: alternating white and light gray, 1px border-bottom #e5e5e5
- Padding: 1rem (16px) cells
- Hover: background-color: #f8f8f8
- **Mobile:** Stack as cards in flex-column, add `data-label` attributes

**Forms & Search**
- Input border: #e5e5e5
- Input focus: blue ring (outline: 2px solid #0066cc)
- Dropdown max-height: 400px (desktop), 300px (mobile)
- Rounded: 6px (0.375rem)

---

## 6. Page Structure & Sections

### Hero Section
- Full-width background image, 60–70vh height
- Dark overlay (gradient) for text contrast
- Title centered, white text, text-shadow for depth
- Subtitle below title in white text

### Search Bar (Homepage Only)
- Positioned below hero title
- Dropdown for device suggestions
- Grouped by category (Cameras, Gaming, Drones, etc.)
- Max 400px width on desktop, full width on mobile

### Main Content Area
1. **Breadcrumb** (device pages only): Home > Device Name
2. **Hero Image** with overlay title (device pages)
3. **Answer Box** (blue gradient background): Recommended SD card + explanation
4. **Specifications Grid**: 4 columns on desktop, 2 on tablet, 1 on mobile
5. **Brands Table**: Comparison table, stacks into cards on mobile
6. **FAQ Section**: Accordion (single-open)
7. **Related Devices**: Link section (device pages)

### Sidebar (Device Pages)
- Sticky on desktop
- Full-width on mobile
- Trust badges, category navigation, or affiliate disclosure

---

## 7. Component Specifications

### FAQ Accordion
- One item open at a time
- Click to toggle (not hover)
- Arrow icon rotates on open state
- Smooth collapse/expand (300ms transition)
- Always full-width, no tab UI

### Specs Grid
- 4 columns: desktop, 2: tablet, 1: mobile
- Each spec card:
  - Label: 0.75rem, uppercase, bold, gray
  - Value: 1.5rem, bold, dark
  - Centered text

### Trust Indicators (Homepage)
- 3-column grid (desktop), 1 column (mobile)
- Large number (2.5rem, gradient blue)
- Descriptive label below (gray, bold)

### Mobile Tap Targets
- All interactive elements: **minimum 44px × 44px**
- Buttons, links, search toggle must meet this standard

---

## 8. Accessibility & Performance

### Accessibility (WCAG 2.2 AA)
- All text: 4.5:1 contrast ratio minimum (#555 on white = ✓)
- Blue (#0066cc) on white = ✓, passes AA
- Orange (#ff9900) on white = ✓, passes AA
- All buttons/form fields: `aria-label` or visible text
- Hamburger menu: `aria-expanded`, `aria-controls`
- Search input: `aria-label="Search for devices..."`
- FAQ: `aria-expanded` on toggle buttons

### Performance Targets
- **LCP (Largest Contentful Paint):** < 2.5 seconds
- **CLS (Cumulative Layout Shift):** < 0.1
- **INP (Interaction to Next Paint):** < 200ms
- **JavaScript size:** ≤ 40kB gzipped on initial load
- **CSS size:** ≤ 30kB gzipped (Tailwind + modern.css combined)
- Images: lazy-loaded with `loading="lazy"` attribute
- Hero images: preloaded (no lazy-load)

### Motion
- Respect `prefers-reduced-motion`
- Transitions use `transition: property duration ease`
- Animations avoid long durations (< 400ms preferred)

---

## 9. SEO & Schema Markup

### Required on Every Page
- Canonical link: `<link rel="canonical" href="...">`
- Meta description: 150–160 characters
- Open Graph (og:title, og:description, og:image, og:url)
- Twitter Card (twitter:card, twitter:title, twitter:description, twitter:image)

### Device Pages (JSON-LD Schema)
Required scripts in `<head>`:
1. **Article Schema**: Headline, description, image, author (SD Card Checker)
2. **Product Schema**: Name, description, offers (brands table)
3. **FAQ Schema**: Generated from FAQ section
4. **Breadcrumb Schema**: Home > Device Name

### URLs
- Homepage: `/`
- Device page: `/devices/{slug}/`
- Category: `/category/{slug}/`
- Support: `/about/`, `/contact/`, `/affiliate-disclosure/`

---

## 10. File & Code Structure

### Directories
```
src/
├── css/
│   ├── input.css (Tailwind imports)
│   ├── tailwind.css (compiled)
│   └── modern.css (custom brand styles)
├── js/
│   ├── search.js (device search)
│   └── components.js (FAQ, mobile menu)
├── templates/
│   ├── home.html
│   ├── device.html
│   ├── components.js (reusable HTML)
│   └── [other pages].html
data/
├── devices.json (device specs, URLs, slug)
├── cards.json (SD card catalog)
└── categories.json (category groupings)
img/
├── brand/ (logo, favicon)
├── devices/ (device hero images)
└── cards/ (SD card product images)
dist/ (built output)
```

### CSS Hierarchy
1. **Tailwind CSS** (utilities): `tailwind.css` (compiled from `input.css`)
2. **Modern CSS** (brand/components): `modern.css`
3. **Inline styles** (rare, hero images, overrides only)

### JavaScript
- **Alpine.js** for interactivity (device search, mobile menu, FAQ accordion)
- **No build tooling** for JS (inline or simple script tags)
- Max script size: 40kB gzipped

---

## 11. Monetization & Affiliate Guidelines

### Affiliate Disclosure
- **Location:** Visible on every page (footer, sidebar, or above product table)
- **Wording:** "This website contains affiliate links. We may earn a small commission when you purchase through our links at no extra cost to you."
- **Tone:** Friendly, transparent, never hidden

### Amazon Buttons
- **Style:** Orange (#ff9900), white text, bold
- **Text:** "Check Price on Amazon" or "View on Amazon"
- **Target:** Blank (opens new window)
- **Size:** Min 44px height, padding 0.5rem–0.75rem

### Commission Rules
- All product links are affiliate links (no direct product pages)
- Button text always explicit ("Check Price," not "Buy")
- No cloaking, redirects, or URL shorteners

---

## 12. Future Expansion & Maintenance

### New Pages
1. Follow existing layout structure (container, spacing, card design)
2. Match copy tone (concise, benefit-focused, no jargon)
3. Use established color palette, typography, button styles
4. Add required schema markup and meta tags
5. Test mobile responsiveness, Core Web Vitals, accessibility

### New Components
1. Inherit button, card, and spacing styles from `modern.css`
2. Use Tailwind utilities for layout only (grid, flex, padding)
3. Do not introduce new colors or typography sizes
4. Ensure 44px touch targets on mobile
5. Test with keyboard navigation and screen readers

### Device or SD Card Additions
1. Follow existing data structure (`devices.json`, `cards.json`)
2. Create hero image (1200×350px minimum)
3. Follow FAQ and specs template exactly
4. Update schema markup (breadcrumb, FAQ, product)
5. Add canonical URL and social meta tags

### Bug Fixes & Refactoring
1. Never change visual style without updating this guide
2. Maintain backward-compatible URLs (301 redirects if needed)
3. Preserve all current copy and messaging
4. Test Core Web Vitals before deployment

---

## 13. Brand Governance

**Approvers:** Project owner only.

**Change Log:**
- v1.0 (Nov 2025): Initial brand guidelines, based on existing implementation.

**Contact:** See `BRAND_GUIDELINES.md` for updates.

---

## Quick Reference: Key Values

| What | Value |
|------|-------|
| Primary Color | #0066cc |
| Accent Color | #ff9900 |
| Dark Text | #1a1a1a |
| Body Text | #555555 |
| Border | #e5e5e5 |
| Container Max Width | 900px |
| Base Font Size | 16px (1rem) |
| Heading Weight | 700 |
| Button Radius | 6px (0.375rem) |
| Card Radius | 6px (0.375rem) |
| Min Touch Target | 44px × 44px |
| Mobile Breakpoint | 480px |
| Tab Breakpoint | 768px |
