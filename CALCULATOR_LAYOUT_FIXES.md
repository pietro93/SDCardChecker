# Calculator Layout Fixes - Quick Reference

## Issues Found & Fixes

### Issue #1: FAQ Section Implementation (HIGH PRIORITY) ⚠️

**Current State**:
- **Calculator pages**: Use HTML5 `<details>` element for expandable FAQs
- **Device pages**: Use custom JavaScript accordion with `.faq-item` class

**Problem**: Inconsistent user experience and styling patterns

**Files to Change**:
- `/c:/Users/Pietro/Desktop/SDCardChecker/src/templates/calculator/video-storage-calculator.html` (lines 85-163)
- `/c:/Users/Pietro/Desktop/SDCardChecker/src/templates/calculator/photo-storage-calculator.html` (lines 85-163)

**Current Code (lines 89-100)**:
```html
<div class="space-y-4">
  <details class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 cursor-pointer group">
    <summary class="font-bold text-slate-900 text-lg select-none flex items-center justify-between">
      What's the difference between H.264, H.265, and ProRes?
      <i class="fas fa-chevron-right text-slate-400 group-open:rotate-90 transition-transform"></i>
    </summary>
    <div class="mt-4 text-slate-700 space-y-3">
      <p><strong>H.264:</strong> The industry standard...</p>
    </div>
  </details>
```

**Replacement Code**:
```html
<div class="space-y-3 faq-section">
  <div class="faq-item">
    <div class="faq-question">
      What's the difference between H.264, H.265, and ProRes?
      <span class="faq-toggle">↓</span>
    </div>
    <div class="faq-answer">
      <p><strong>H.264:</strong> The industry standard...</p>
    </div>
  </div>
```

**Add CSS** (from device.html):
```css
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
```

**Add JavaScript** (from device.html):
```javascript
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

---

### Issue #2: Flex Layout Breakpoint (LOW PRIORITY) ⚠️

**Current State**:
- Calculator pages: `flex-col lg:flex-row` (switches at ~1024px)
- Device pages: `flex-col md:flex-row` (switches at ~768px)

**Problem**: Mobile users may not see sidebar if viewport is 768px-1024px

**Files to Change**:
- `/c:/Users/Pietro/Desktop/SDCardChecker/src/templates/calculator/video-storage-calculator.html` (line 36)
- `/c:/Users/Pietro/Desktop/SDCardChecker/src/templates/calculator/photo-storage-calculator.html` (line 36)

**Current Code** (line 36):
```html
<div class="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
```

**Fixed Code**:
```html
<div class="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
```

---

## Implementation Steps

### Step 1: Fix FAQ Section
1. Open `video-storage-calculator.html`
2. Locate lines 85-163 (FAQ section)
3. Replace all `<details>` blocks with `<div class="faq-item">` structure
4. Add CSS styling in a `<style>` tag before `</body>` or in the template
5. Add JavaScript initialization script before `</body>`
6. Repeat for `photo-storage-calculator.html`

### Step 2: Fix Breakpoint
1. Open `video-storage-calculator.html` line 36
2. Change `lg:flex-row` to `md:flex-row`
3. Repeat for `photo-storage-calculator.html`

### Step 3: Rebuild & Test
```bash
npm run build
```

### Step 4: Verify
- Test on mobile (< 768px), tablet (~768px), and desktop (> 1024px)
- Verify FAQ opens/closes correctly
- Verify sidebar appears on tablet and desktop

---

## Comparison: Device Page FAQ Pattern

**Reference**: `/c:/Users/Pietro/Desktop/SDCardChecker/src/templates/device.html` (lines 136-141 & 309-341)

The device page FAQ uses:
- `.faq-section` wrapper
- `.faq-item` containers
- `.faq-question` clickable header with `.faq-toggle` arrow
- `.faq-answer` hidden content (revealed on click)
- JavaScript to handle state and prevent multiple open items

This pattern should be replicated in calculator pages for consistency.

---

## Testing Checklist

After implementing fixes:

- [ ] FAQ items can be opened individually
- [ ] Opening one FAQ closes others (accordion behavior)
- [ ] Arrow icon rotates on open/close
- [ ] Styling matches device page FAQs
- [ ] Mobile layout (< 768px): main + sidebar stacked vertically
- [ ] Tablet layout (768px-1024px): main + sidebar side-by-side
- [ ] Desktop layout (> 1024px): main + sidebar side-by-side
- [ ] No visual glitches or layout shifts
- [ ] Touch/click interactions work smoothly

---

## Files Affected Summary

| File | Changes | Lines |
|------|---------|-------|
| `video-storage-calculator.html` | FAQ structure + breakpoint | 36, 85-163 |
| `photo-storage-calculator.html` | FAQ structure + breakpoint | 36, 85-163 |
| CSS (in template) | Add FAQ styling | Add `<style>` block |
| JS (in template) | Add FAQ initialization | Add `<script>` block |

---

## Rollback

If needed, changes can be reverted by:
1. Restoring the `<details>` element structure
2. Removing added CSS and JavaScript
3. Reverting `lg:flex-row` to its original state

No database or external service changes needed.
