# Visual Layout Comparison: Calculator vs Device Pages

## Page Structure Comparison

```
┌─────────────────────────────────────┐
│         HEADER (Identical)          │
│  Logo | Nav Items | Mobile Menu     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│     BREADCRUMB (Identical CSS)      │
│  Home / Tools / Calculators / Video │
└─────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│              MAIN CONTENT AREA                  │
│  max-w-7xl mx-auto px-4 py-12                   │
│  flex flex-col [lg|md]:flex-row gap-8           │
│                                                 │
│  ┌────────────────────────┐  ┌──────────────┐  │
│  │   MAIN (flex-1)        │  │   SIDEBAR    │  │
│  │                        │  │   (fixed)    │  │
│  │  [Hero Section]        │  │              │  │
│  │  [Calculator Widget]   │  │  - Links     │  │
│  │  [FAQ Section]         │  │  - Info Box  │  │
│  │  [Related Content]     │  │              │  │
│  │                        │  └──────────────┘  │
│  └────────────────────────┘                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────┐
│  FOOTER (Identical)                 │
│  Generated from components.js       │
└─────────────────────────────────────┘
```

---

## Detailed Section Comparison

### 1. Hero Section

**Device Page:**
```
┌─────────────────────────────────────┐
│  🖼️ HERO IMAGE with overlay title  │
│  (Background image with dark overlay)│
│                                     │
│     "Best SD Card for Device"       │
└─────────────────────────────────────┘
```

**Calculator Page:**
```
┌─────────────────────────────────────┐
│  📝 TEXT CONTENT                    │
│  "Video Storage Calculator"         │
│  "How Much Can You Record?"         │
│  "Find out if your SD card has..."  │
│                                     │
│  ✓ Feature 1    ✓ Feature 2        │
│  ✓ Feature 3                        │
└─────────────────────────────────────┘
```

**CSS Classes (Both)**:
- h1: `text-4xl font-bold text-slate-900`
- h2: `text-2xl font-semibold text-slate-700`
- p: `text-lg text-slate-600 leading-relaxed`

✅ **Typography**: Identical
⚠️ **Layout**: Different (image vs text), both appropriate for content type

---

### 2. Card / Widget Styling

**Both use identical pattern:**

```css
bg-white               /* White background */
rounded-lg            /* 8px border radius */
shadow-sm             /* Subtle shadow */
border border-slate-200  /* Light gray border */
p-6 / p-8             /* Internal padding */
```

**Visual:**
```
┌──────────────────────────────┐
│  Background: White           │
│  Padding: 24-32px            │
│  Border: 1px solid #e2e8f0   │
│  Shadow: 0 1px 2px rgba(...) │
│  Radius: 8px                 │
└──────────────────────────────┘
```

✅ **Status**: Perfectly consistent

---

### 3. Button Styling

**Calculate Button (Calculator Page):**
```css
.calculate-btn {
  width: 100%;              /* Full width */
  height: 48px (h-12);      /* Taller for touch */
  padding: 1rem (py-3);
  background: #f97316;      /* orange-500 */
  hover: #ea580c;           /* orange-600 */
  color: white;
  font-weight: 700;
  border-radius: 8px;
  transition: all 0.2s;
}
```

**Visual:**
```
┌────────────────────────────────┐
│  Calculate Storage Needed ➜    │
└────────────────────────────────┘
 Default: bg-orange-500
 Hover:   bg-orange-600 + lighter text
 Disabled: opacity-50 cursor-not-allowed
```

✅ **Status**: Matches device page button pattern

---

### 4. FAQ Section - ⚠️ DIFFERENT IMPLEMENTATION

**Device Page Pattern:**
```
┌────────────────────────────────────┐
│  ❓ What's the difference?      ▼  │  ← Clickable
└────────────────────────────────────┘
  
After click:
┌────────────────────────────────────┐
│  ❓ What's the difference?      ▲  │  ← Arrow rotates
├────────────────────────────────────┤
│  Answer content appears here       │
│  with proper spacing and styling  │
└────────────────────────────────────┘
```

**CSS Classes Used:**
- `.faq-item` - Container
- `.faq-question` - Clickable header (hover effect)
- `.faq-toggle` - Arrow icon (rotates on open)
- `.faq-answer` - Content (hidden by default, shown on click)

```css
.faq-item {
  @apply bg-white rounded-lg border border-slate-200 
         overflow-hidden shadow-sm hover:shadow-md transition-shadow;
}

.faq-question {
  @apply p-6 cursor-pointer flex justify-between items-center 
         font-semibold text-slate-900 hover:text-blue-600 transition-colors;
}

.faq-toggle {
  @apply text-slate-400 transition-transform duration-300;
  font-size: 1.5rem;
}

.faq-toggle.open {
  @apply rotate-180;
}

.faq-answer {
  @apply hidden px-6 pb-6 text-slate-700 border-t border-slate-200;
}

.faq-answer.open {
  @apply block;
}
```

---

**Calculator Page Pattern (Current):**
```
┌────────────────────────────────────┐
│  ❓ What's the difference?      ➜  │  ← HTML5 <details>
└────────────────────────────────────┘
  
After click:
┌────────────────────────────────────┐
│  ❓ What's the difference?      ▼  │
├────────────────────────────────────┤
│  Answer content appears here       │
│  with proper spacing and styling  │
└────────────────────────────────────┘
```

Uses HTML5 `<details>` and `<summary>` tags

**Problem**: 
- Different implementation than device pages
- Uses native browser styling vs custom styling
- Icon animation works but feels different
- Harder to sync styling across site

⚠️ **Recommendation**: Standardize to device page pattern

---

### 5. Color Palette Comparison

| Element | Calculator | Device | Match |
|---------|-----------|--------|-------|
| Background | `slate-50 to slate-100` | `slate-50 to slate-100` | ✅ |
| Text (heading) | `slate-900` | `slate-900` | ✅ |
| Text (body) | `slate-600` | `slate-600` | ✅ |
| Links | `blue-600` | `blue-600` | ✅ |
| Buttons | `orange-500/600` | `orange-500/600` | ✅ |
| Borders | `slate-200` | `slate-200` | ✅ |
| Cards | `white bg` | `white bg` | ✅ |
| FAQ items | White + Tailwind | White + Tailwind | ⚠️ Different CSS |

✅ **All colors match**
⚠️ **FAQ styling implementation differs**

---

### 6. Responsive Breakpoints

**Current State:**

| Viewport | Calculator | Device |
|----------|-----------|--------|
| Mobile (< 640px) | Stacked (flex-col) | Stacked (flex-col) |
| Tablet (640-768px) | Stacked (flex-col) | Stacked (flex-col) |
| Tablet+ (768-1024px) | **Stacked (flex-col)** | Side-by-side (flex-row) |
| Desktop (> 1024px) | Side-by-side (flex-row) | Side-by-side (flex-row) |

⚠️ **Gap at 768px-1024px**: Calculator doesn't show sidebar until 1024px

**Recommended Fix:**
Change Calculator pages from:
```html
flex-col lg:flex-row  <!-- Switches at 1024px -->
```

To:
```html
flex-col md:flex-row  <!-- Switches at 768px -->
```

---

### 7. Spacing & Padding Consistency

```
┌─ Container (max-w-7xl)
│  ├─ Padding: px-4 (16px left/right)
│  ├─ Section padding: py-12 (48px top/bottom)
│  │
│  └─ Cards (p-6 or p-8)
│     ├─ Small: p-6 (24px padding)
│     ├─ Large: p-8 (32px padding)
│     └─ Gaps between cards: gap-4, gap-6, gap-8
│
├─ Typography margins:
│  ├─ h1: mb-4
│  ├─ h2: mb-4 or mb-6
│  ├─ h3: mb-6
│  └─ p: mb-6
│
└─ List spacing:
   └─ space-y-3, space-y-4
```

✅ **Status**: Consistent use of Tailwind spacing scale

---

## Desktop Layout Wireframe

```
┌──────────────────────────────────────────────────┐
│                    HEADER                        │
├──────────────────────────────────────────────────┤
│              BREADCRUMB BAR                      │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌────────────────────────────┐  ┌────────────┐ │
│  │                            │  │            │ │
│  │     HERO SECTION           │  │   SIDEBAR  │ │
│  │                            │  │   Links    │ │
│  ├────────────────────────────┤  │   Info     │ │
│  │                            │  │            │ │
│  │  CALCULATOR WIDGET / SPECS │  └────────────┘ │
│  │                            │                  │
│  ├────────────────────────────┤                  │
│  │                            │                  │
│  │  FAQ SECTION               │                  │
│  │  ┌──────────────────────┐  │                  │
│  │  │ ? Question Item    ▼ │  │                  │
│  │  ├──────────────────────┤  │                  │
│  │  │ Answer shown here    │  │                  │
│  │  └──────────────────────┘  │                  │
│  │  ┌──────────────────────┐  │                  │
│  │  │ ? Question Item 2  ▼ │  │                  │
│  │  └──────────────────────┘  │                  │
│  │                            │                  │
│  ├────────────────────────────┤                  │
│  │                            │                  │
│  │  RELATED CONTENT           │                  │
│  │  [Card] [Card]             │                  │
│  │                            │                  │
│  └────────────────────────────┘                  │
│                                                  │
├──────────────────────────────────────────────────┤
│                    FOOTER                        │
└──────────────────────────────────────────────────┘
```

---

## Mobile Layout Wireframe

```
┌──────────────────────┐
│      HEADER          │
├──────────────────────┤
│   BREADCRUMB BAR     │
├──────────────────────┤
│                      │
│   HERO SECTION       │
│   (Full width)       │
│                      │
├──────────────────────┤
│                      │
│ CALCULATOR WIDGET    │
│ (Full width)         │
│                      │
├──────────────────────┤
│                      │
│ FAQ SECTION          │
│ (Full width)         │
│                      │
├──────────────────────┤
│                      │
│ SIDEBAR              │
│ (Full width)         │
│ (At bottom)          │
│                      │
├──────────────────────┤
│ RELATED CONTENT      │
│ (Full width stack)   │
├──────────────────────┤
│      FOOTER          │
└──────────────────────┘
```

⚠️ **Note**: At tablet sizes (768-1024px), calculator pages don't show sidebar next to content like device pages do.

---

## Summary Table

| Feature | Calculator | Device | Difference |
|---------|-----------|--------|-----------|
| **Head section** | ✅ | ✅ | None |
| **Header** | ✅ | ✅ | Generated component |
| **Breadcrumb** | ✅ | ✅ | Same styling |
| **Main layout** | ⚠️ `lg:` | ✅ `md:` | Breakpoint inconsistency |
| **Typography** | ✅ | ✅ | Identical classes |
| **Hero** | Text-based | Image-based | Appropriate for content |
| **Cards** | ✅ | ✅ | Same styling |
| **Buttons** | ✅ | ✅ | Same styling |
| **FAQ** | ⚠️ `<details>` | ⚠️ JS accordion | **Different implementation** |
| **Colors** | ✅ | ✅ | Perfect match |
| **Spacing** | ✅ | ✅ | Perfect match |
| **Footer** | ✅ | ✅ | Generated component |

**2 Issues Found**:
1. FAQ implementation (HIGH priority)
2. Responsive breakpoint (LOW priority)

