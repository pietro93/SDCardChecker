# Calculator Layout Implementation Checklist

## Pre-Implementation

- [ ] Read all audit documents:
  - [ ] LAYOUT_CONSISTENCY_SUMMARY.md (Executive Summary)
  - [ ] LAYOUT_CONSISTENCY_AUDIT.md (Detailed Analysis)
  - [ ] CALCULATOR_LAYOUT_FIXES.md (Step-by-Step Guide)
  - [ ] LAYOUT_COMPARISON_VISUAL.md (Visual Comparisons)
  
- [ ] Backup current calculator templates:
  - [ ] Backup `video-storage-calculator.html`
  - [ ] Backup `photo-storage-calculator.html`
  
- [ ] Set up test environment:
  - [ ] Local testing environment ready
  - [ ] Browser dev tools open
  - [ ] Build command ready (`npm run build`)

---

## Fix #1: FAQ Section Standardization (HIGH PRIORITY)

### File 1: video-storage-calculator.html

#### Step 1: Update Line 36 Breakpoint
- [ ] Open file at line 36
- [ ] Change: `flex-col lg:flex-row` → `flex-col md:flex-row`
- [ ] Verify change saved

#### Step 2: Replace FAQ HTML Structure (Lines 85-163)

**BEFORE: Line 86 should read:**
```html
<div class="mb-8">
  <h2 class="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
  
  <div class="space-y-4">
    <details class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 cursor-pointer group">
```

**ACTION STEPS:**

1. [ ] Locate FAQ section header (line 87): `<h2 class="text-2xl font-bold...`
2. [ ] Keep the `<h2>` heading as-is
3. [ ] Replace `<div class="space-y-4">` with `<div class="space-y-3 faq-section">`
4. [ ] Replace EACH `<details>...</details>` block with new structure:

**Replace THIS:**
```html
<details class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 cursor-pointer group">
  <summary class="font-bold text-slate-900 text-lg select-none flex items-center justify-between">
    What's the difference between H.264, H.265, and ProRes?
    <i class="fas fa-chevron-right text-slate-400 group-open:rotate-90 transition-transform"></i>
  </summary>
  <div class="mt-4 text-slate-700 space-y-3">
    <p><strong>H.264:</strong> The industry standard for video compression. Good quality at manageable file sizes. Compatible with almost all devices.</p>
    ...more content...
  </div>
</details>
```

**WITH THIS:**
```html
<div class="faq-item">
  <div class="faq-question">
    What's the difference between H.264, H.265, and ProRes?
    <span class="faq-toggle">↓</span>
  </div>
  <div class="faq-answer">
    <p><strong>H.264:</strong> The industry standard for video compression. Good quality at manageable file sizes. Compatible with almost all devices.</p>
    ...more content...
  </div>
</div>
```

5. [ ] Repeat for ALL 6 FAQ items in video-storage-calculator.html
   - [ ] H.264/H.265/ProRes question
   - [ ] Speed Class for 4K video question
   - [ ] How to calculate bitrate question
   - [ ] microSD cards for video question
   - [ ] UHS-II vs UHS-III question
   - [ ] Overprovision card question

#### Step 3: Add CSS Styling

**LOCATION:** Add before `</head>` or in a `<style>` tag before `</body>`

```html
<style>
  .faq-item {
    @apply bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow;
  }

  .faq-question {
    @apply p-6 cursor-pointer flex justify-between items-center font-semibold text-slate-900 hover:text-blue-600 transition-colors;
    min-height: 48px;
    user-select: none;
    -webkit-user-select: none;
  }

  .faq-question:active {
    background-color: rgba(59, 130, 246, 0.05);
    transition: background-color 0.1s ease;
  }

  .faq-toggle {
    @apply text-slate-400 transition-transform duration-300;
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .faq-toggle.open {
    @apply rotate-180;
  }

  .faq-answer {
    @apply px-6 pb-6 text-slate-700 leading-relaxed border-t border-slate-200 hidden;
  }

  .faq-answer.open {
    @apply block;
  }
</style>
```

#### Step 4: Add JavaScript Initialization

**LOCATION:** Add before `</body>` tag (after all HTML)

```html
<script>
  // Initialize FAQ accordion on load
  document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.faq-item');
    items.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      const toggle = item.querySelector('.faq-toggle');

      if (question) {
        question.addEventListener('click', () => {
          const isOpen = answer.classList.contains('open');

          // Close all others
          document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
          document.querySelectorAll('.faq-toggle').forEach(t => t.classList.remove('open'));

          // Toggle current
          if (!isOpen) {
            answer.classList.add('open');
            toggle.classList.add('open');
          }
        });
      }
    });
  });
</script>
```

- [ ] Verify script is placed before `</body>` closing tag
- [ ] Verify no syntax errors in console

#### Step 5: Verify File Structure
- [ ] Line 36: `md:flex-row` ✓
- [ ] FAQ section: All 6 items converted to `.faq-item` ✓
- [ ] CSS `<style>` block added ✓
- [ ] JavaScript `<script>` block added ✓
- [ ] No stray `<details>` tags remaining ✓

### File 2: photo-storage-calculator.html

**REPEAT ENTIRE PROCESS ABOVE for photo-storage-calculator.html**

Note: Photo storage calculator has same structure, different FAQ content (about JPEG/RAW instead of codecs)

- [ ] Line 36: Change to `md:flex-row`
- [ ] Lines 85-163: Convert FAQ section (6 items)
  - [ ] JPEG vs RAW question
  - [ ] Know camera file size question
  - [ ] Speed Class for burst shooting question
  - [ ] Mix JPEG and RAW question
  - [ ] 256GB overkill for photos question
  - [ ] Should I shoot RAW or JPEG question
- [ ] Add CSS `<style>` block (identical to video page)
- [ ] Add JavaScript `<script>` block (identical to video page)
- [ ] Verify no remaining `<details>` tags

---

## Fix #2: Responsive Breakpoint (ALREADY DONE IN FIX #1)

- [ ] video-storage-calculator.html line 36: `md:flex-row` ✓
- [ ] photo-storage-calculator.html line 36: `md:flex-row` ✓

---

## Testing Phase

### Pre-Build Verification
- [ ] No syntax errors visible in editors
- [ ] All HTML tags properly closed
- [ ] CSS block has no unclosed braces
- [ ] JavaScript has no syntax errors

### Build Process
- [ ] Run: `npm run build`
- [ ] Check build output for errors
- [ ] Verify no warnings about calculator pages
- [ ] Check `/dist/tools/calculators/` directories created

### Mobile Testing (< 768px)
- [ ] Open `/tools/calculators/video-storage/` on phone or mobile browser
- [ ] [ ] Page loads without errors
- [ ] [ ] Text readable (no tiny fonts)
- [ ] [ ] Sidebar at bottom (stacked)
- [ ] [ ] Click FAQ item - content appears
- [ ] [ ] Arrow icon appears next to question
- [ ] [ ] Click another FAQ - first closes, second opens
- [ ] [ ] Calculator widget inputs accessible
- [ ] [ ] No horizontal scrolling
- [ ] Repeat for photo-storage calculator

### Tablet Testing (768px - 1024px) ⚠️ CRITICAL
- [ ] Open on tablet or tablet-sized browser window
- [ ] **NEW**: Sidebar should appear NEXT to main content (not at bottom)
- [ ] Layout should be two-column
- [ ] FAQ items properly styled
- [ ] Calculator widget responsive
- [ ] Click FAQ - works smoothly
- [ ] Repeat for photo-storage calculator

### Desktop Testing (1024px+)
- [ ] Open on desktop browser or wide window
- [ ] Two-column layout with sidebar
- [ ] FAQ items all visible
- [ ] Hover over FAQ question - text color changes to blue
- [ ] Click FAQ question - opens smoothly
- [ ] Arrow icon rotates 180°
- [ ] Click another FAQ - previous closes
- [ ] All buttons functional
- [ ] Links navigate correctly
- [ ] Repeat for photo-storage calculator

### Visual Comparison Testing
- [ ] Open device page FAQ in one window
- [ ] Open calculator page FAQ in another
- [ ] Compare styling:
  - [ ] Card background (white)
  - [ ] Border color (slate-200)
  - [ ] Text colors match
  - [ ] Spacing/padding matches
  - [ ] Arrow icon behavior matches
  - [ ] Hover effects match

### Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Functionality Tests
- [ ] All FAQ items can be opened
- [ ] Only one FAQ open at a time
- [ ] Arrow icon always visible
- [ ] Click background of answer - nothing happens (correct)
- [ ] Click question area - opens/closes
- [ ] Keyboard navigation (Tab, Enter) works
- [ ] Touch events work on mobile

---

## Post-Testing Verification

### Visual Regression Check
- [ ] Compare with screenshots from LAYOUT_COMPARISON_VISUAL.md
- [ ] No unexpected color changes
- [ ] No unexpected spacing changes
- [ ] Typography unchanged
- [ ] Icons display correctly

### Cross-Page Consistency
- [ ] Calculator FAQ styling = Device page FAQ styling
- [ ] Calculator buttons = Device page buttons
- [ ] Calculator cards = Device page cards
- [ ] Calculator colors = Device page colors
- [ ] Header identical across all pages
- [ ] Footer identical across all pages
- [ ] Sidebar identical across all pages

### Performance Check
- [ ] Page load time acceptable
- [ ] No console errors
- [ ] No console warnings
- [ ] Lighthouse score maintained or improved
- [ ] No layout shifts (CLS)

### Link Verification
- [ ] All internal links working
- [ ] Breadcrumb links work
- [ ] Navigation menu links work
- [ ] Footer links work
- [ ] Related calculators section links work

---

## Documentation Updates

- [ ] Mark LAYOUT_CONSISTENCY_SUMMARY.md as "IMPLEMENTED"
- [ ] Update CHANGES_INDEX.md with FAQ standardization note
- [ ] Update DEPLOYMENT_CHECKLIST.md if applicable
- [ ] Add note to QUICK_REFERENCE.md about FAQ pattern

---

## Rollback Plan (If Needed)

If tests fail or issues arise:

1. [ ] Revert to backup:
   - [ ] Restore video-storage-calculator.html backup
   - [ ] Restore photo-storage-calculator.html backup

2. [ ] Run `npm run build` again

3. [ ] Re-test

4. [ ] Investigate issue and update this checklist

**Common Issues & Fixes:**
- **FAQ doesn't open**: Check JavaScript placement (must be before `</body>`)
- **Styling wrong**: Check CSS block is present and before `</body>`
- **Sidebar not showing at tablet**: Verify `md:flex-row` is set (not `lg:`)
- **Build fails**: Check for unclosed HTML tags in FAQ section

---

## Final Approval

- [ ] All tests passed
- [ ] No visual regressions
- [ ] No console errors
- [ ] Cross-page consistency verified
- [ ] Ready for deployment

**Sign-off:**
- Tested by: _______________
- Date: _______________
- Notes: 

---

## Deployment

- [ ] Commit changes to git
- [ ] Push to repository
- [ ] Wait for CI/CD pipeline
- [ ] Verify deployment to staging
- [ ] Verify deployment to production
- [ ] Monitor for errors

---

## Post-Deployment

- [ ] Monitor error logs for 24 hours
- [ ] Check user feedback
- [ ] Verify analytics working
- [ ] Note any issues in DEPLOYMENT.md

---

## Success!

When all checkboxes are checked:
✅ **Calculator pages now have consistent layout with the rest of the site**
✅ **FAQ section uses same pattern as device pages**
✅ **Responsive design improved for tablet users**
✅ **No technical debt introduced**

