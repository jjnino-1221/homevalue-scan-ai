# Learning Notes - Phase 1

## Session 1: CSS Custom Properties

**Date:** 2026-03-09

### What I Learned

**CSS Custom Properties (Variables):**
- Defined with `--` prefix in `:root` selector
- Used with `var()` function: `color: var(--rocket-red)`
- Makes updating design consistent (change once, updates everywhere)
- Organized by category: colors, typography, spacing

**Box Model:**
- `box-sizing: border-box` includes padding/border in width
- Prevents elements from overflowing their containers
- Applied to all elements with `*` selector

**CSS Reset:**
- Removes default browser margins and paddings
- Creates consistent starting point across browsers
- Essential for professional web development

**System Font Stack:**
- Uses native OS fonts for best performance
- Format: `-apple-system, BlinkMacSystemFont, 'Segoe UI', ...`
- Looks native on every platform

### Questions for Next Session
- How do media queries work for responsive design?
- When should I create a new CSS file vs. add to existing?

## Session 2: CSS Components - Buttons

**Date:** 2026-03-10

### What I Learned

**CSS Classes:**
- Classes let you apply styles to multiple elements
- Use `.classname` selector in CSS
- Apply with `class="classname"` in HTML
- Can combine multiple classes: `class="button button-primary"`

**Flexbox Basics:**
- `display: flex` creates flexible container
- `align-items: center` centers items vertically
- `justify-content: center` centers items horizontally
- Perfect for centering button text

**Pseudo-Classes:**
- `:hover` applies when mouse is over element
- `:active` applies when element is being clicked
- `:disabled` applies to disabled form elements
- `:focus-visible` applies when keyboard-focused
- `:not()` excludes elements from selector

**Touch-Friendly Design:**
- Minimum 44x44px touch targets (iOS guideline)
- We use 56px for better accessibility
- Remove tap highlight: `-webkit-tap-highlight-color: transparent`
- Prevent text selection: `user-select: none`

**Transitions:**
- Smooth animations when properties change
- Format: `transition: property duration easing`
- Example: `transition: all 0.3s ease`
- Makes hover effects smooth instead of instant

### Key Concepts
- Build base styles first, then variants
- Combine classes for maximum flexibility
- Test on real devices early
- Accessibility matters (focus states, sizes)
