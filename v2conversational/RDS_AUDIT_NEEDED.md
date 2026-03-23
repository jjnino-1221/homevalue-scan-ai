# Nova RDS Compliance Audit - Items to Verify

## Current Implementation vs Nova Design System

### What I've Implemented (Needs Verification)

#### Colors Currently Used
```css
--primary-color: #DE3341 (red-500) - Used for primary actions
--primary-dark: #590213 (red-900) - Used for hover states
--primary-light: #FEE8F4 (red-50) - Used for subtle backgrounds
--secondary-color: #F3EEE7 (putty/gray-50) - Used for AI message bubbles
--text-primary: #111111 (gray-900) - Used for main text
--text-secondary: #666666 - Used for subtitles
--border-color: #e0e0e0 - Used for borders
```

**NEEDS VERIFICATION FROM NOVA FOUNDATIONS:**
- Are these exact hex values correct?
- Are there official variable names in Nova? (e.g., `$color-primary-500`)
- What are the complete color scales? (red-50 through red-900)
- What secondary colors exist? (blue, green, yellow for states?)

#### Spacing Currently Used
```css
/* Using 4px increment system */
4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px
```

**NEEDS VERIFICATION FROM NOVA FOUNDATIONS:**
- Is 4px the base unit?
- What are the official spacing tokens? (`$spacing-xs`, `$spacing-sm`, etc.)
- Component-specific spacing rules?

#### Typography Currently Used
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif
```

**Font Sizes:**
- Hero: 32px
- Title: 20-24px
- Body: 16px
- Subtitle: 14px
- Small: 12px

**NEEDS VERIFICATION FROM NOVA FOUNDATIONS:**
- Official font stack for Nova?
- Type scale (heading-1, heading-2, body, caption, etc.)
- Line heights for each size?
- Font weights (400, 500, 600, 700)?

#### Shadows/Elevation Currently Used
```css
.rkt-Elevation-1: 0 1px 2px rgba(0,0,0,0.05)
.rkt-Elevation-2: 0 2px 4px rgba(0,0,0,0.06)
.rkt-Elevation-3: 0 4px 8px rgba(0,0,0,0.08)
.rkt-Elevation-4: 0 8px 16px rgba(0,0,0,0.12)
```

**NEEDS VERIFICATION FROM NOVA FOUNDATIONS:**
- Are these shadow values correct?
- Official elevation scale?
- When to use each level?

#### Border Radius Currently Used
```css
--radius-sm: 4px (buttons)
--radius-md: 8px (cards)
--radius-lg: 16px (chips)
--radius-xl: 24px (large cards)
```

**NEEDS VERIFICATION FROM NOVA FOUNDATIONS:**
- Official border radius values?
- Component-specific overrides?

---

## Components That Need Nova Verification

### 1. Buttons
**Current Implementation:**
```css
.rkt-Button--primary {
  background: #DE3341;
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  min-height: 44px;
}
```

**NEEDS FROM NOVA UI KIT:**
- Exact padding values?
- Font size and weight?
- Border radius?
- Hover/active/disabled states?
- Icon placement rules?
- Button variants (primary, secondary, tertiary, ghost)?

### 2. Cards
**Current Implementation:**
```css
.rkt-Card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.06);
}
```

**NEEDS FROM NOVA UI KIT:**
- Official card padding?
- Border radius?
- Shadow level?
- Header/content/footer structure?
- Card variants (elevated, outlined, flat)?

### 3. Chips (Selection Pills)
**Current Implementation:**
```css
.rkt-Chip {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 8px 16px;
  font-size: 14px;
}

.rkt-Chip--is-selected {
  background: #DE3341;
  color: white;
  border-color: #DE3341;
}
```

**NEEDS FROM NOVA UI KIT:**
- Official chip design?
- Padding and border radius?
- Selected vs unselected states?
- Hover states?
- Icon support?

### 4. Input Fields
**Current Implementation:**
```css
.chat-input {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  font-size: 16px;
}
```

**NEEDS FROM NOVA UI KIT:**
- Official input styling?
- Focus states?
- Error states?
- Helper text styling?

### 5. Progress Bar
**Current Implementation:**
```css
.rkt-ProgressBar {
  height: 4px;
  background: #F3EEE7;
  border-radius: 2px;
}

.rkt-ProgressBar__fill {
  background: linear-gradient(90deg, #DE3341 0%, #590213 100%);
  height: 100%;
  transition: width 0.5s ease;
}
```

**NEEDS FROM NOVA UI KIT:**
- Official progress bar height?
- Fill color (solid or gradient)?
- Animation timing?

### 6. Badges/Labels
**Current Implementation:**
```css
.rkt-Badge--success {
  background: #4caf50;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}
```

**NEEDS FROM NOVA UI KIT:**
- Badge variants (success, error, warning, info)?
- Sizing (small, medium, large)?
- Icon support?

---

## Files That Need RDS Updates

### High Priority (User-Facing)
1. `index.html` - Landing page (currently using custom gradient)
2. `chat.html` - Main chat interface
3. `css/chat.css` - All component styles
4. `js/result-cards.js` - Result card components

### Medium Priority (Supporting)
5. `js/interactive-ui.js` - UI pattern rendering
6. `server-enhanced-v2.js` - No UI but returns data structures

---

## Action Items Once Nova Access Is Granted

### Step 1: Extract Design Tokens
- [ ] Get color palette from Nova Foundations
- [ ] Get spacing scale from Nova Foundations
- [ ] Get typography scale from Nova Foundations
- [ ] Get shadow/elevation values from Nova Foundations
- [ ] Get border radius values from Nova Foundations

### Step 2: Extract Component Styles
- [ ] Get Button component styles from Nova UI Kit
- [ ] Get Card component styles from Nova UI Kit
- [ ] Get Chip/Tag component styles from Nova UI Kit
- [ ] Get Input component styles from Nova UI Kit
- [ ] Get Progress component styles from Nova UI Kit
- [ ] Get Badge component styles from Nova UI Kit

### Step 3: Update Implementation
- [ ] Create `css/nova-tokens.css` with official variables
- [ ] Update `css/chat.css` to use Nova tokens
- [ ] Update `index.html` landing page to use Nova styles
- [ ] Update `js/result-cards.js` to use Nova components
- [ ] Update `js/interactive-ui.js` to use Nova patterns

### Step 4: Verify Compliance
- [ ] Compare side-by-side with Nova designs
- [ ] Get screenshots from Figma for reference
- [ ] Test all interactive states (hover, active, disabled)
- [ ] Verify responsive behavior
- [ ] Check accessibility (contrast ratios, focus states)

---

## Questions for Design Team

1. **Brand Colors**: Is #DE3341 the official primary red? Or should it be different?
2. **Font Family**: What's the official font stack for Nova? Is it using a custom font or system fonts?
3. **Illustrations**: Should we use any illustrations from the Nova Illustration Kit?
4. **Motion**: Are there animation/transition guidelines in Nova?
5. **Dark Mode**: Does Nova support dark mode? Should we implement it?
6. **Mobile-First**: What are the responsive breakpoints in Nova?

---

## Current Status

✅ **What's Working:**
- Basic RDS class naming conventions (rkt-*)
- Rough color palette approximation
- 4px spacing increment system
- Basic component structure

⚠️ **What Needs Verification:**
- All color values
- All spacing values
- Typography scale
- Component exact specifications
- Interactive states
- Animation timings

🚫 **What's Not RDS Compliant:**
- Landing page (custom gradient background)
- Some custom styling in result cards
- Approximated values instead of official tokens

---

**Next Step:** Need access to specific pages in Nova Foundations and Nova UI Kit to extract official design tokens and component specifications.
