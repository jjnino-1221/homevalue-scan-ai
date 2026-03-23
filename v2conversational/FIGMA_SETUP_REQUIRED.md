# 🎨 Figma Setup Required for Token Extraction

**Date:** March 22, 2026
**Status:** Need Figma Desktop App Connection

---

## Issue

The Figma MCP requires the **Figma desktop app** to be open with specific layers selected to extract design tokens.

**Current Error:**
```
You currently have nothing selected. You need to select a layer first before using this tool.
```

---

## What I Found

From the metadata, I can see the Nova Foundations Library structure:

### Nova Foundations (wcPoA5K43Np5znrldVD7Oi)
- **Page:** Color (node-id: 1:64)
  - Contains color palettes with shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
  - Categories: Success, Warning/Error, Informational
  - Multiple color ranges organized in rows

However, I need the **actual color values** (hex codes, RGB values) which require:
1. Figma desktop app open
2. Specific nodes selected
3. Then I can use Figma MCP to extract values

---

## Options to Proceed

### Option 1: Use Figma Desktop App (Recommended)

**Steps:**
1. **Open Figma Desktop App** (not browser)
2. **Open Nova Foundations Library:**
   ```
   https://www.figma.com/design/wcPoA5K43Np5znrldVD7Oi/Nova-Foundations-Library
   ```
3. **Navigate to "Color" page**
4. **Select a color swatch** (any one to start)
5. **Tell me when ready** - I'll extract all color tokens

**Then repeat for:**
- Typography page (if exists)
- Spacing page (if exists)
- Other token pages

---

### Option 2: Export Variables from Figma

**If Nova Foundations uses Figma Variables:**

1. Open file in Figma
2. Click on **Variables icon** (in right panel)
3. Click **Export** or copy variable values
4. Provide me with:
   - Color variables (all shades)
   - Spacing variables
   - Typography variables
   - Border radius variables
   - Shadow variables

**Example Format:**
```json
{
  "colors": {
    "red/50": "#FEF2F2",
    "red/100": "#FEE2E2",
    "red/600": "#DC2626",
    ...
  },
  "spacing": {
    "1": "4px",
    "2": "8px",
    ...
  }
}
```

---

### Option 3: Manual Token Extraction

**I can guide you through:**

1. **Take screenshots** of color palettes
2. **Read hex values** from Figma (select swatch → see hex in properties)
3. **Provide me with values** in organized format

**Example:**
```
Red palette:
- red-50: #FEF2F2
- red-100: #FEE2E2
- red-200: #FECACA
...
- red-600: #DC2626 (PRIMARY)
- red-700: #B91C1C
...
```

---

### Option 4: Use CSS Export Plugin

**If available:**
1. Install "Design Tokens" or similar plugin in Figma
2. Export all variables/styles as CSS
3. Provide me with the exported CSS file

---

## What I Need to Extract

### 1. Colors (Priority: HIGH)
```css
/* Brand colors */
--rkt-red-50: #???;
--rkt-red-100: #???;
--rkt-red-200: #???;
--rkt-red-300: #???;
--rkt-red-400: #???;
--rkt-red-500: #???;
--rkt-red-600: #???;  /* Primary brand */
--rkt-red-700: #???;  /* Hover state */
--rkt-red-800: #???;
--rkt-red-900: #???;

/* Gray/Neutral */
--rkt-gray-50: #???;
--rkt-gray-100: #???;
...
--rkt-gray-900: #???;

/* Success/Warning/Error */
--rkt-green-600: #???;  /* Success */
--rkt-yellow-600: #???; /* Warning */
--rkt-orange-600: #???; /* Error */

/* Semantic tokens */
--rkt-text-primary: #???;
--rkt-text-secondary: #???;
--rkt-border: #???;
--rkt-background: #???;
```

### 2. Typography (Priority: HIGH)
```css
/* Font family */
--rkt-font-family: ???;

/* Font sizes */
--rkt-font-size-xs: ???;
--rkt-font-size-sm: ???;
--rkt-font-size-base: ???;
--rkt-font-size-lg: ???;
--rkt-font-size-xl: ???;
--rkt-font-size-2xl: ???;

/* Font weights */
--rkt-font-weight-regular: ???;
--rkt-font-weight-medium: ???;
--rkt-font-weight-semibold: ???;
--rkt-font-weight-bold: ???;

/* Line heights */
--rkt-line-height-tight: ???;
--rkt-line-height-normal: ???;
--rkt-line-height-relaxed: ???;
```

### 3. Spacing (Priority: HIGH)
```css
--rkt-space-1: ???;
--rkt-space-2: ???;
--rkt-space-3: ???;
--rkt-space-4: ???;
--rkt-space-6: ???;
--rkt-space-8: ???;
--rkt-space-12: ???;
--rkt-space-16: ???;
--rkt-space-20: ???;
```

### 4. Border Radius (Priority: MEDIUM)
```css
--rkt-radius-sm: ???;
--rkt-radius-md: ???;
--rkt-radius-lg: ???;
--rkt-radius-xl: ???;
--rkt-radius-full: 9999px;
```

### 5. Elevation/Shadows (Priority: MEDIUM)
```css
--rkt-elevation-1: ???;
--rkt-elevation-2: ???;
--rkt-elevation-3: ???;
--rkt-elevation-4: ???;
```

### 6. Component Specs from Nova UI Kit

**For each component (Button, Card, Chip):**
- Padding values
- Border radius
- Font size
- Font weight
- Border width
- Gap/spacing
- Height
- Min-width

---

## Immediate Next Steps

**Choose your preferred option:**

1. **"I'll open Figma Desktop"** → I'll wait for you to select layers, then extract
2. **"Here are the exported variables"** → Provide JSON/CSS, I'll convert
3. **"I'll send screenshots"** → I'll extract values from images
4. **"I'll read values manually"** → I'll format what you provide

---

## Alternative: Start with Key Colors Only

If full extraction is complex, we can start with just the essential colors:

**Minimum needed for 80% improvement:**
```
Primary Red (brand): #???
Primary Red Hover: #???
Text Primary (dark): #???
Text Secondary (medium gray): #???
Border Color (light gray): #???
Background (very light gray/white): #???
Success Green: #???
Error Red: #???
```

With just these 8 colors, I can update the app significantly closer to RDS.

---

**Status:** ⏸️ AWAITING FIGMA ACCESS OR TOKEN EXPORT
**Next:** Choose option and provide tokens/access
