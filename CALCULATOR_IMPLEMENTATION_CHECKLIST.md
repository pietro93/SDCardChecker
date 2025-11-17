# Calculator Implementation Checklist
**Phase 0 Launch Quality Requirements**

Status: 🟡 IN PROGRESS (Core components updated, final validation pending)

---

## ✅ COMPLETED (This Session)

### Accessibility Improvements
- [x] Updated HTML form inputs with min/max/step attributes
- [x] Added aria-label to all numeric inputs (video, photo, continuous, reverse)
- [x] Added aria-describedby for bitrate help text
- [x] Converted Advanced Options `<details>` to proper button-based accordion
- [x] Added aria-expanded/aria-controls to Advanced Options section
- [x] Added aria-expanded/aria-controls to Speed Class Reference table
- [x] Made accordion summaries keyboard-accessible (tabindex="0")

### Unit Clarity Tooltips
- [x] Added Mbps ≠ MB/s clarification to bitrate field
- [x] Created help text with conversion info (1 Mbps ≈ 0.125 MB/s)
- [x] Linked input to help text via aria-describedby/id pair
- [x] Added info icon (ℹ️) with title attribute for hover tooltip

### Input Validation
- [x] Created validateNumericInput() method in calculator-ui.js
- [x] Added @input validation listeners to all numeric inputs
- [x] Implemented min/max range clamping
- [x] Added NaN detection with visual feedback (red border)
- [x] Applied to video, photo, continuous, and reverse modes

### Default State on Page Load
- [x] Added showDefaultResult flag to Alpine.js state
- [x] Created loadDefaultResult() method
- [x] Integrated with default preset values
- [x] Can be disabled per page via showDefaultResult: false

### UI State Management
- [x] Added advancedExpanded state variable
- [x] Added speedClassExpanded state variable
- [x] Integrated with accordion expand/collapse logic
- [x] Reset state on form reset

### Documentation
- [x] Added Section 6 to STORAGE_CALCULATOR_PRODUCT_SPEC.md
- [x] Documented all accessibility requirements
- [x] Included code examples for validation and default results
- [x] Added error handling guidelines

---

## 🟡 IN PROGRESS (Ready for Testing)

### Component Testing
- [ ] Test keyboard navigation on Advanced Options accordion
- [ ] Test keyboard navigation on Speed Class Reference table
- [ ] Verify aria-expanded toggles correctly
- [ ] Test screen reader compatibility (NVDA, JAWS)
- [ ] Verify help text appears and reads correctly

### Input Validation Testing
- [ ] Test entering negative numbers (should clamp to min)
- [ ] Test entering values > max (should clamp to max)
- [ ] Test decimal inputs where applicable
- [ ] Test NaN/invalid input (should show red border)
- [ ] Test on mobile/touch devices

### Default Result Display
- [ ] Verify default result shows on page load
- [ ] Confirm result calculations are correct
- [ ] Test disable functionality via showDefaultResult: false
- [ ] Verify result appears in correct location

---

## 📋 REMAINING TASKS (Phase 0 Launch)

### Performance Optimization
- [ ] Verify calculator-devices.json is pre-bundled (no lazy load delay)
- [ ] Check for layout shift on default result load
- [ ] Measure Cumulative Layout Shift (CLS) impact
- [ ] Add loading skeleton if needed

### Cross-Browser Testing
- [ ] Chrome/Edge (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (desktop)
- [ ] Chrome (mobile/Android)
- [ ] Safari (mobile/iOS)

### Integration Testing
- [ ] Verify card recommendations load after calculation
- [ ] Test GA4 event tracking integration
- [ ] Verify result state persists on mode toggle (forward ↔ reverse)
- [ ] Test device selector integration (Phase 1 pages)

### Final QA
- [ ] Manual accessibility audit with WAVE tool
- [ ] Lighthouse accessibility score ≥ 90
- [ ] Mobile UX audit (button sizing, spacing)
- [ ] Copy review (tooltips, help text, labels)

---

## 📝 IMPLEMENTATION REFERENCE

### Files Modified
1. **src/templates/components/calculator-widget.html**
   - Added validation attributes to all inputs
   - Enhanced accordion accessibility
   - Added bitrate help text

2. **src/js/calculator-ui.js**
   - validateNumericInput() method
   - loadDefaultResult() method
   - State variables: advancedExpanded, speedClassExpanded

3. **STORAGE_CALCULATOR_PRODUCT_SPEC.md**
   - Section 6: Implementation Quality Requirements
   - Accessibility guidelines
   - Code examples

### Code Snippets Ready for Use

**Validate numeric input (all scenarios):**
```javascript
@input="validateNumericInput($event, minValue, maxValue)"
```

**Load default result:**
```javascript
this.loadDefaultResult() // Call on Alpine init or after scenario selection
```

**Keyboard-accessible accordion:**
```html
<button
  role="button"
  tabindex="0"
  @click.prevent="isExpanded = !isExpanded"
  :aria-expanded="isExpanded"
  aria-controls="content-id"
>
  Label
</button>
<div id="content-id" x-show="isExpanded">Content</div>
```

---

## 🎯 Success Criteria for Phase 0 Launch

- [x] All numeric inputs validate on entry
- [x] All inputs have descriptive labels and aria-labels
- [x] Help text clarifies Mbps vs MB/s conversion
- [x] Advanced Options accordion is keyboard-accessible
- [x] Default result appears on page load
- [ ] All tests passing (pending execution)
- [ ] Lighthouse accessibility score ≥ 90
- [ ] No console errors or warnings
- [ ] Mobile UX is smooth and responsive

---

## 🚀 Next Steps

1. **This Week:**
   - [ ] Run accessibility tests (WAVE, Lighthouse)
   - [ ] Cross-browser testing
   - [ ] Mobile UX validation
   - [ ] Fix any issues found

2. **Before Launch:**
   - [ ] Final QA sign-off
   - [ ] Deploy to staging
   - [ ] Real user testing with accessibility tools
   - [ ] Deploy to production

3. **Post-Launch Monitoring:**
   - [ ] Monitor GA4 events (calculator usage, engagement)
   - [ ] Track card recommendations click-through rate
   - [ ] Monitor bounce rate on calculator pages
   - [ ] Collect user feedback

---

## 📊 Metrics to Track

**User Engagement:**
- Calculator calculation completion rate
- Reverse mode usage rate
- Advanced options expansion rate
- Device selector usage (Phase 1)

**Quality:**
- Form validation error rate
- Card recommendation load failures
- JavaScript errors in console
- Page performance metrics (CLS, LCP, FID)

---

## 📞 Questions/Issues

If you encounter issues during testing, note:
- Browser/OS combination
- Steps to reproduce
- Expected vs actual behavior
- Screenshot/console errors

Update this checklist as you progress through testing and launch phases.
