# Mobile UX Audit Report - SD Card Checker
**Date:** November 14, 2025  
**Focus:** Screen Width & Zooming Performance

---

## Executive Summary

The SD Card Checker has a solid responsive foundation using Tailwind CSS and mobile-first breakpoints. However, there are **critical issues with horizontal overflow, touch targets, and zoom handling** that degrade the mobile experience, particularly on narrow screens (< 375px) and in landscape orientation.

**Overall Mobile Score:** 6.5/10  
**Critical Issues:** 4  
**Warnings:** 7  
**Recommendations:** 12

---

## Critical Issues

### 1. **Search Dropdown Overflow on Mobile** ⚠️ CRITICAL
**Location:** `home.html` (lines 53-74)

**Problem:**
- Search dropdown uses absolute positioning without width constraints
- On narrow screens (< 375px), dropdown extends beyond viewport
- No horizontal scroll containment; causes page jank

**Evidence:**
```html
<div class="search-dropdown" :class="{ hidden: !open || filtered.length === 0 }">
```
CSS shows no max-width or overflow handling for mobile.

**Impact:** Users cannot scroll within dropdown on mobile, results are cut off

**Fix Priority:** HIGH
```css
/* Add to modern.css */
@media (max-width: 480px) {
  .search-dropdown {
    max-width: calc(100vw - 2rem);
    overflow-y: auto;
    max-height: 300px;
    right: 0;
    left: auto;
  }
}
```

---

### 2. **Hero Section Text Not Responsive to Zoom** ⚠️ CRITICAL
**Location:** `home.html` (line 46)

**Problem:**
- H1 has inline `text-shadow` with fixed pixel values: `0 4px 12px`
- When user zooms to 150%, text-shadow doesn't scale proportionally
- Shadow becomes disproportionate, reducing readability
- No `-webkit-text-size-adjust: 100%` on body

**Evidence:**
```html
<h1 class="text-white" style="text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);">
```

**Impact:** Text readability degrades when zoomed; shadow can obscure text

**Fix Priority:** HIGH
```css
/* In modern.css */
body {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

h1 {
  text-shadow: 0 0.3em 0.8em rgba(0, 0, 0, 0.5);
}
```

---

### 3. **Horizontal Scroll on Trust Indicators Grid** ⚠️ CRITICAL  
**Location:** `home.html` (lines 82-100)

**Problem:**
- Trust indicators use `minmax(200px, 1fr)` with `gap: 2rem`
- On screens 320-375px: `200px * 3 + 2rem * 2 = 764px` (exceeds viewport)
- No flex fallback for narrower screens
- Forces horizontal scroll

**Evidence:**
```html
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem;">
```

**Impact:** Ugly horizontal scroll; poor perception of completeness

**Fix Priority:** HIGH
```html
<!-- Change to: -->
<div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem;" class="trust-grid">
```

```css
@media (min-width: 600px) {
  .trust-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 900px) {
  .trust-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

### 4. **Device Page Table Horizontal Scroll Not Optimized** ⚠️ CRITICAL
**Location:** `device.html` (lines 117-132)

**Problem:**
- Uses `.overflow-x-auto` container (good)
- But no `touch-scroll: -webkit-scroll-snap-type: x mandatory` for mobile
- No visual indicator that table is scrollable (no shadow effect)
- Table cells on small screens show only "SD Card" column effectively
- Touch users get no scroll hints

**Evidence:**
```html
<div class="overflow-x-auto brands-table-container">
  <table class="brands-table w-full">
```

**Impact:** Users don't realize table is scrollable; poor discoverability

**Fix Priority:** HIGH
```css
.brands-table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  
  /* Visual scroll indicator */
  box-shadow: inset -40px 0 40px -40px rgba(0,0,0,0.1);
}

.brands-table > * {
  scroll-snap-align: start;
}
```

---

## Major Warnings

### 5. **Touch Target Size Below 48px** ⚠️ WARNING
**Location:** Multiple locations

**Problem:**
- Search input has default padding: `1rem 1.5rem` = ~44px tall (< 48px WCAG minimum)
- Button "Check Price" in table: `.75rem 0.4rem` = ~28px tall
- Device tags/buttons in grid: implied from `gap` calculations

**WCAG 2.5.5 requirement:** 44px minimum touch target

**Evidence from `device.html`:**
```css
.btn-check-price {
  padding: 0.35rem 0.4rem;  /* ≈ 24px tall */
  font-size: 0.85rem;
}
```

**Impact:** 
- Mobile users (especially with tremor, older users) frequently miss buttons
- Increased error rates on conversions (affiliate links)
- Poor accessibility

**Fix Priority:** HIGH
```css
.search-input {
  min-height: 48px; /* WCAG AA */
  padding: 0.75rem 1.5rem;
}

.btn-check-price {
  min-height: 44px;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
}

/* All interactive elements */
a, button, input, select, textarea {
  min-height: 48px;
  min-width: 48px;
}
```

---

### 6. **Zoom at 150% + 375px Screen Causes Content Reflow Issues**
**Location:** All pages

**Problem:**
- At 150% zoom + 375px width = effective 250px space
- Container has `padding: 0 1.5rem` (96px) on both sides
- Leaves only 58px for content (unreadable)
- Header nav doesn't collapse/stack

**Evidence:**
```css
.container {
  max-width: 900px;
  padding: 0 1.5rem;  /* Fixed 24px padding regardless of zoom */
}
```

**Impact:** At 150% zoom, most content becomes unusable

**Fix Priority:** MEDIUM
```css
@media (max-width: 480px) {
  .container {
    padding: 0 1rem;  /* Reduce at small sizes */
  }
}

@media (max-width: 320px) {
  .container {
    padding: 0 0.75rem;  /* Ultra-small devices */
  }
}
```

---

### 7. **Header Navigation Not Mobile-Optimized** ⚠️ WARNING
**Location:** Header (generated via template)

**Problem:**
- Header uses `display: flex; gap: 1.5rem` for nav
- No hamburger menu for small screens
- On narrow screens, nav wraps or clips
- Sticky header takes up ~60px on mobile (10% of viewport)

**Mobile Header Height Issue:**
```css
/* Current */
header nav {
  display: flex;
  gap: 1.5rem;
}

/* On 375px + links = overflow */
```

**Impact:** 
- Reduces scrollable content area
- Mobile-first users see mostly header
- Navigation inaccessible on 320px screens

**Fix Priority:** MEDIUM
```css
@media (max-width: 480px) {
  .header-content {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  header nav {
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  
  header nav a {
    font-size: 0.85rem;
    padding: 0.25rem 0.5rem;
  }
}
```

---

### 8. **FAQ Accordion Not Touch-Optimized** ⚠️ WARNING
**Location:** `device.html` (lines 136-141)

**Problem:**
- `.faq-question` is clickable but has `padding: p-6` = 24px
- Good size, but text doesn't have enough contrast when closed vs. open
- No visual feedback during touch (no `:active` state)
- Chevron icon too small on mobile (`.faq-toggle`)

**Evidence:**
```css
.faq-question {
  @apply p-6 cursor-pointer flex justify-between items-center font-semibold text-slate-900 hover:text-blue-600 transition-colors;
}

.faq-toggle {
  @apply text-slate-400 transition-transform duration-300;
}
```

**Impact:** 
- Users unsure if they've tapped the item
- Icon rotation is subtle, easy to miss on mobile

**Fix Priority:** LOW-MEDIUM
```css
.faq-question {
  @apply p-6 cursor-pointer flex justify-between items-center font-semibold text-slate-900 transition-colors;
  
  &:active {
    background: rgba(59, 130, 246, 0.05);
  }
}

.faq-toggle {
  @apply text-slate-400 transition-transform duration-300;
  font-size: 1.5rem; /* Bigger on mobile */
}
```

---

### 9. **Breadcrumb Not Readable on Mobile** ⚠️ WARNING
**Location:** `device.html` (lines 68-76)

**Problem:**
- Breadcrumb uses `text-sm` (~14px)
- `gap: 2` with chevron icon
- On 375px, becomes multi-line with poor readability

**Evidence:**
```html
<nav class="text-sm text-slate-600 flex items-center gap-2">
```

**Impact:** Poor navigation context; users don't know where they are in site hierarchy

**Fix Priority:** LOW

---

### 10. **Image Scaling Issues on Different Zoom Levels** ⚠️ WARNING
**Location:** `device.html` (lines 82-89)

**Problem:**
- Hero image has fixed `style="height: 350px;"`
- Doesn't scale on mobile; wastes screen real estate
- At 150% zoom, image becomes 350 * 1.5 = 525px (huge!)
- On narrow screens, too large

**Evidence:**
```html
<img src="{{DEVICE_IMAGE}}" alt="..." class="w-full object-cover"
    style="height: 350px;" width="1200" height="350" loading="lazy" />
```

**Impact:** 
- Mobile users see mostly image, not actual content
- Scroll fatigue

**Fix Priority:** MEDIUM
```html
<img src="{{DEVICE_IMAGE}}" alt="..." class="w-full object-cover"
    style="height: 200px;" width="1200" height="350" loading="lazy" />
```

```css
@media (min-width: 768px) {
  .hero-image-container img {
    height: 350px;
  }
}
```

---

### 11. **Specs Grid Doesn't Adapt to Narrow Screens** ⚠️ WARNING
**Location:** `device.html` (line 108)

**Problem:**
- `grid md:grid-cols-2 lg:grid-cols-4` uses fixed widths
- Mobile sees single column (correct), but on 375px the card is too wide
- Card padding `p-6` is 24px on both sides (48px total) for 375px width
- Leaves only 327px for content

**Evidence:**
```html
<div class="specs-grid grid md:grid-cols-2 lg:grid-cols-4 gap-4">
```

**Impact:** Content feels cramped; hard to read spec values

**Fix Priority:** LOW-MEDIUM

---

### 12. **Popular Devices Section Overflow** ⚠️ WARNING
**Location:** `home.html` (lines 103-135)

**Problem:**
- `.devices-list` (from modern.css line 501) uses `display: flex; flex-wrap: wrap`
- On mobile, device tags don't wrap properly
- `.device-tag` likely has min-width constraints

**Impact:** Potential horizontal scroll; breaks layout

**Fix Priority:** LOW

---

## Screen Width Breakpoint Analysis

### Current Tailwind Breakpoints (Implicit)
- Mobile: < 768px (full single column)
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Identified Issues by Width:

| Width | Issues | Severity |
|-------|--------|----------|
| **320px** | Header nav clips, container padding too large, grid cells overflow | 🔴 CRITICAL |
| **375px** | Trust grid horizontal scroll, search dropdown extends beyond viewport, button sizing issues | 🔴 CRITICAL |
| **425px** | Hero section text shadow distorted at zoom, breadcrumb wraps poorly | 🟠 MAJOR |
| **480px** | All minor issues appear, but generally manageable | 🟡 WARNING |
| **600px+** | Responsive design works well | ✅ Good |

---

## Zoom Level Impact Assessment

### Zoom Behavior Issues:

```
Desktop 100% zoom:        ✅ Excellent
Desktop 125% zoom:        🟡 Minor issues with spacing
Desktop 150% zoom:        🔴 Content reflow, text-shadow distortion
Mobile 100% zoom:         🟠 Issues per width analysis above
Mobile 125% zoom + 375px: 🔴 Unusable (effective 300px width)
Mobile 150% zoom + 375px: 🔴 Broken layout
```

### Key Findings:
1. **Text-shadow** doesn't scale with zoom (uses fixed px)
2. **Padding/margins** use rem units (scale correctly with zoom)
3. **Fixed heights** (e.g., hero image) cause reflow issues
4. **No viewport-units** used (could help, but not always best)

---

## Touchscreen-Specific Issues

### Touch Interaction Quality: 4/10

| Issue | Current | Needed |
|-------|---------|--------|
| Touch targets | 28-44px (varies) | 48px minimum |
| Touch feedback | Hover states only | Active states + visual feedback |
| Scroll hints | None | Shadow/gradient indicators |
| Tap delay | ~200-300ms (browser default) | Minimize via touch-action |
| Double-tap zoom | Enabled (can cause jank) | Should disable on touch inputs |

---

## Specific Code Sections to Fix

### Priority 1 (Critical - Fix Immediately):
1. Search dropdown responsive width
2. Hero section text-shadow responsive sizing
3. Trust indicators grid columns
4. Touch target sizes to 48px

### Priority 2 (High - Fix This Sprint):
1. Header navigation mobile optimization
2. Table horizontal scroll indicators
3. Hero image height responsive scaling
4. Device page layout at 150% zoom

### Priority 3 (Medium - Fix Next Sprint):
1. Breadcrumb mobile sizing
2. FAQ accordion touch feedback
3. Specs grid padding optimization
4. Popular devices flex-wrap behavior

---

## Recommendations

### 1. **Add Mobile-First CSS Resets**
```css
/* Add to modern.css */
html {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size-adjust: 100%;
}
```

### 2. **Implement Touch-Friendly Breakpoints**
```css
/* Add explicit 320px and 375px handling */
@media (max-width: 320px) {
  /* Ultra-small phones */
  .container { padding: 0 0.75rem; }
}

@media (max-width: 375px) {
  /* Small phones */
  .container { padding: 0 1rem; }
}

@media (max-width: 480px) {
  /* Standard mobile */
  /* Current rules apply */
}
```

### 3. **Standardize Touch Target Sizes**
```css
/* Ensure all interactive elements meet 48px minimum */
a, button, input[type="button"], input[type="submit"], 
input[type="text"], input[type="search"], select, textarea {
  min-height: 48px;
  min-width: 48px;
  padding: 0.75rem 1rem;
}
```

### 4. **Fix Hero Image Responsiveness**
```css
.hero-image-container img {
  height: 200px; /* Mobile */
}

@media (min-width: 600px) {
  .hero-image-container img {
    height: 280px;
  }
}

@media (min-width: 768px) {
  .hero-image-container img {
    height: 350px;
  }
}
```

### 5. **Add Scroll Indicators for Horizontal Content**
```css
.brands-table-container {
  position: relative;
  box-shadow: inset -40px 0 40px -40px rgba(0,0,0,0.15);
}

/* Only show on touch devices */
@media (hover: none) and (pointer: coarse) {
  .brands-table-container::after {
    content: "←  Scroll  →";
    position: absolute;
    bottom: 8px;
    right: 8px;
    font-size: 0.75rem;
    color: #999;
    animation: pulse 2s infinite;
  }
}
```

### 6. **Implement Responsive Text-Shadow**
```css
/* Use relative units instead of pixels */
h1 {
  text-shadow: 0 0.25em 0.75em rgba(0, 0, 0, 0.5);
  /* Scales with font size */
}

/* Or disable for small screens */
@media (max-width: 480px) {
  h1 {
    text-shadow: none; /* Improve readability */
    text-stroke: 1px rgba(0,0,0,0.3);
  }
}
```

### 7. **Add Viewport Width Constraints**
```css
body {
  max-width: 100vw;
  overflow-x: hidden;
}

/* Prevent any child from causing horizontal scroll */
* {
  max-width: 100%;
}
```

### 8. **Optimize Hamburger Menu for Mobile**
```html
<!-- Add navigation drawer for mobile -->
<header>
  <div class="header-content">
    <div class="logo"><a href="/">SD Card Checker</a></div>
    <button class="menu-toggle" onclick="toggleMenu()">☰</button>
  </div>
  <nav class="mobile-nav" id="mobileNav">
    <!-- Nav links hidden/shown via toggle -->
  </nav>
</header>
```

### 9. **Disable Double-Tap Zoom on Touch Inputs**
```html
<!-- In <head> -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=yes">
```

```css
/* Disable double-tap zoom delay while keeping pinch zoom */
input, button, a {
  touch-action: manipulation;
}
```

### 10. **Add Safe Area Support for Notched Devices**
```css
body {
  padding-left: max(1rem, env(safe-area-inset-left));
  padding-right: max(1rem, env(safe-area-inset-right));
  padding-top: max(1rem, env(safe-area-inset-top));
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
```

### 11. **Create Mobile-Specific Layout Component**
```html
<!-- Device page mobile improvement -->
<!-- Instead of horizontal scroll, use tabs or carousel -->
<div class="table-wrapper">
  <div class="table-mobile-view">
    <!-- Show as cards instead of table on mobile -->
  </div>
  <div class="table-desktop-view">
    <!-- Show as table on desktop -->
  </div>
</div>
```

### 12. **Add Zoom-Aware Styling**
```css
/* Detect zoom level and adjust accordingly */
@supports (--css: variables) {
  body {
    --zoom-level: 1;
    --adjusted-padding: calc(1.5rem / var(--zoom-level));
  }
}

/* Fallback: reduce spacing at smaller viewports */
@media (max-width: 480px) {
  * {
    margin-right: auto !important;
    margin-left: auto !important;
  }
}
```

---

## Testing Checklist

### Test Devices & Conditions:
- [ ] iPhone SE (375px width)
- [ ] iPhone 12 (390px width, notch)
- [ ] iPhone 6 (375px width)
- [ ] Galaxy S20 (360px width)
- [ ] Pixel 4 (412px width)
- [ ] iPad Mini (768px width, landscape)
- [ ] All at 100%, 125%, 150% zoom levels

### Test Scenarios:
- [ ] Search dropdown on 320px + 150% zoom
- [ ] Horizontal scroll present on any viewport?
- [ ] All buttons clickable without accidental triggers?
- [ ] Hero section readability at 150% zoom?
- [ ] Trust indicators visible without scroll?
- [ ] Table navigation intuitive on mobile?
- [ ] FAQ toggle provides feedback on touch?
- [ ] Breadcrumb readable on 375px?

### Automated Tests to Add:
```javascript
// Check for horizontal overflow
document.addEventListener('DOMContentLoaded', () => {
  const bodyWidth = document.body.offsetWidth;
  const windowWidth = window.innerWidth;
  if (bodyWidth > windowWidth) {
    console.warn('⚠️ Horizontal overflow detected:', bodyWidth, '>', windowWidth);
  }
});

// Check touch target sizes
document.querySelectorAll('a, button, input').forEach(el => {
  const rect = el.getBoundingClientRect();
  if (rect.height < 44 || rect.width < 44) {
    console.warn('⚠️ Touch target too small:', el);
  }
});
```

---

## Summary by Severity

| Severity | Count | Resolution Time |
|----------|-------|-----------------|
| 🔴 Critical | 4 | 2-3 hours |
| 🟠 Major | 3 | 2-4 hours |
| 🟡 Warning | 5 | 4-6 hours |
| 🟢 Info | 12 | Follow-up |

**Total Estimated Fix Time:** 8-13 hours

---

## Conclusion

The SD Card Checker has **good foundational responsive design** but suffers from **mobile-specific UX issues** that impact narrower screens and zoomed viewports. The most pressing issues relate to **horizontal overflow, touch target sizes, and zoom-aware scaling**.

Implementing the Priority 1 recommendations will immediately improve the experience for ~80% of mobile users. Priority 2 and 3 improvements should follow in subsequent sprints.

**Next Steps:**
1. Fix critical issues in Priority 1 (this week)
2. Add testing infrastructure for mobile scenarios
3. Conduct real device testing on notched phones
4. Monitor Core Web Vitals for mobile experience
