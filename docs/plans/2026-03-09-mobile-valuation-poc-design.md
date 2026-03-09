# Mobile Valuation - Proof of Concept Design Document

**Date:** March 9, 2026
**Author:** Product Management
**Status:** Approved
**Target Completion:** December 2026

---

## Executive Summary

This document outlines the design for a mobile-first web application that demonstrates how homeowners can capture property photos and receive instant valuations. This Proof of Concept (PoC) will validate the user experience and serve as a demonstration tool for Rocket Product leadership.

**Core Value Proposition:**
- Replace 7-10 day, $400-600 appraisals with same-day, $100-200 mobile valuations
- Empower homeowners to self-capture property data
- Demonstrate feasibility of lending-grade valuations from consumer-captured data

**Strategic Context:**
This initiative aligns with Rocket's mission to help everyone home by making property valuations faster, cheaper, and more accessible. It positions Rocket as an innovation leader in mortgage technology.

---

## 1. Project Overview

### 1.1 Goals

**Primary Goal:**
Build a working prototype that demonstrates the complete user experience of mobile property valuation, suitable for sharing with Rocket Product peers by end of 2026.

**Secondary Goals:**
- Validate user experience and flow
- Show technical feasibility of key features (camera, LiDAR, address autocomplete)
- Learn web development fundamentals through hands-on building
- Create portfolio piece demonstrating product thinking and execution

### 1.2 Success Criteria

**Technical Success:**
- ✅ Works reliably on iPhone and Android mobile devices
- ✅ Camera captures photos with quality guidance
- ✅ LiDAR scanning experience demonstrated (real on capable devices, mocked otherwise)
- ✅ Complete flow from address entry to valuation results
- ✅ Responsive design works on all screen sizes
- ✅ No major bugs or crashes

**User Experience Success:**
- ✅ Non-technical homeowners can complete flow in <15 minutes without help
- ✅ Instructions are self-explanatory
- ✅ Professional visual design builds trust
- ✅ "Wow factor" - demonstrates innovation

**Learning Success:**
- ✅ Builder understands every file and concept
- ✅ Can modify content, styling, and layout independently
- ✅ Can debug simple issues
- ✅ Builds confidence in web development

### 1.3 Out of Scope (For PoC)

- ❌ Real AVM integration - using mock valuation data
- ❌ Backend/database - everything client-side with localStorage
- ❌ User authentication - comes in MVP phase
- ❌ Real computer vision analysis - simulated responses
- ❌ Payment processing or commercial features

### 1.4 Core Principle: Universal Accessibility

> "If a 65-year-old homeowner with basic phone skills can't use this easily, we've failed."

Every design decision prioritizes:
- Simple, jargon-free language (5th grade reading level)
- Visual + text instructions (never text-only)
- Forgiving UX (easy to go back, fix mistakes)
- Encouraging tone (positive reinforcement)
- Works on older devices and slow connections

---

## 2. User Flow & Information Architecture

### 2.1 Page Structure

The application consists of 8 sequential pages in a linear flow:

```
Landing → Address → Instructions → Capture → Scan → Review → Analyzing → Results
```

### 2.2 Detailed Page Specifications

#### **Page 1: Landing Page** (`index.html`)

**Purpose:** Introduce the app and motivate homeowners to start

**Content:**
- Hero section with value proposition: "Know Your Home's Value in 15 Minutes"
- Three benefit cards:
  - 🚀 **Fast** - Results in minutes, not days
  - 🎯 **Accurate** - Powered by AI and local market data
  - 🔓 **Free** - No cost to get your estimate
- Primary CTA: "Get Started" button (Rocket red)
- Small "Concept Demo" badge in corner
- Footer with disclaimer

**Design Notes:**
- Mobile-first, single column layout
- Hero with gradient background (white to light gray)
- Large, readable typography
- Rocket red accents on buttons and highlights

---

#### **Page 2: Property Address Entry** (`address.html`)

**Purpose:** Capture property location for comparable data

**Features:**
1. **"Use My Location" button**
   - Requests browser geolocation permission
   - Reverse geocodes coordinates to street address
   - Fills form automatically

2. **Manual Entry with Autocomplete**
   - Address field with autocomplete suggestions
   - Uses Google Places API (or mock for PoC)
   - Validates complete address before proceeding

**Form Fields:**
- Street Address (autocomplete)
- City (auto-filled from autocomplete)
- State (auto-filled)
- ZIP Code (auto-filled)

**Validation:**
- Require complete address
- Basic format checking
- "Fix this" messages if invalid

**Data Storage:**
- Save to localStorage as `propertyAddress` object
- Used later for generating mock comparable data

**User Guidance:**
- "We'll use this to find homes like yours nearby"
- Icon showing location pin
- Privacy note: "Your data stays private"

---

#### **Page 3: Photo Capture Instructions** (`instructions.html`)

**Purpose:** Set expectations and explain what's next

**Content:**
- "Let's capture your property in 5 quick photos"
- List of rooms to photograph:
  1. 🏠 Front Exterior - Stand across the street
  2. 🍳 Kitchen - Capture counters and appliances
  3. 🛋️ Living Room - Show the main living space
  4. 🛏️ Master Bedroom - Capture the room from doorway
  5. 🚿 Master Bathroom - Show vanity and fixtures

**For Each Room:**
- Icon representing the room
- Brief instruction
- Example photo (small thumbnail showing what good looks like)

**Time Estimate:**
- "This takes about 10 minutes"
- Progress preview: "5 photos, then we'll analyze"

**CTA:**
- "Start Capturing" button
- Links to Page 4 (Capture) with room counter at 1

---

#### **Page 4: Room Capture Screen** (`capture.html`)

**Purpose:** Capture photos of each room with quality guidance

**Layout:**
```
┌─────────────────────────────┐
│ Kitchen - Room 2 of 5       │ ← Header
│ ■■■■■□□□□□ 40% Complete     │ ← Progress bar
├─────────────────────────────┤
│                             │
│   [Camera Viewfinder]       │ ← Live camera feed (fullscreen)
│   [Visual corner guides]    │ ← Semi-transparent overlays
│                             │
│   💡 Stand in doorway to    │ ← Contextual tip
│   capture the whole room    │
│                             │
│   Quality: ⚠️ Too dark       │ ← Real-time feedback
│   Try adding light          │
│                             │
├─────────────────────────────┤
│ [📷 Capture Photo]          │ ← Primary action
│ [📏 Scan Room with LiDAR]   │ ← If device supports
│                             │
│ [Thumbnail if captured]     │ ← Photo preview
│                             │
│ [← Back] [Next Room →]      │ ← Navigation
└─────────────────────────────┘
```

**Camera Features:**
- Full-screen live camera viewfinder
- Visual guides: corner markers showing ideal framing
- Real-time quality feedback:
  - ✅ "Good lighting" (green)
  - ⚠️ "Too dark - add light" (yellow)
  - ❌ "Hold steady" if motion blur detected (red)

**Photo Capture:**
- Tapping "Capture Photo" takes picture
- Flash effect + shutter sound
- Photo preview appears as thumbnail
- Can retake if not satisfied

**LiDAR Button:**
- Appears only if device supports (iPhone 12 Pro+)
- Links to scanning page (Page 5)
- Badge: "Enhanced Accuracy"

**Room-Specific Tips:**
- Kitchen: "Show countertops and appliances"
- Living Room: "Capture from corner to show full room"
- Bedroom: "Stand in doorway"
- Bathroom: "Show vanity and fixtures"
- Exterior: "Stand across the street if possible"

**Data Handling:**
- Convert photo to base64 string
- Store in localStorage: `photos` array
- Each photo object: `{ room: 'kitchen', imageData: 'base64...', timestamp: Date }`

**Navigation:**
- "Back" returns to previous room (or instructions)
- "Next Room" advances to next room in sequence
- Auto-advances when all 5 rooms captured → Review page

---

#### **Page 5: LiDAR Scanning Screen** (`scan.html`)

**Purpose:** Capture room dimensions using LiDAR or mock the experience

**Two Modes:**

**Mode A: LiDAR-Capable Devices (iPhone 12 Pro+)**
- Use WebXR Device API or AR Quick Look
- Real room scanning with AR overlay
- Show real-time scanning progress
- Capture actual room dimensions

**Mode B: Non-LiDAR Devices (All Others)**
- Animated scanning visualization
- Simulated scanning progress (3-5 seconds)
- Generate mock but realistic dimensions
- Same UI/UX, just simulated backend

**Scanning Interface:**
```
┌─────────────────────────────┐
│ Scanning Kitchen...         │
│                             │
│   [AR View / Animation]     │
│                             │
│   ↻ Move closer to walls    │ ← Real-time guidance
│   Progress: ████████░░ 75%  │
│                             │
│   Scanning left wall...     │ ← Directional prompts
│                             │
└─────────────────────────────┘
```

**Real-Time Guidance:**
- Distance indicators: "Move closer" / "Move back"
- Directional prompts: "Scan left wall" → "Now right wall"
- Progress ring showing coverage: 25% → 50% → 75% → 100%
- "Hold steady" or "Move slower" feedback

**Results Screen:**
```
┌─────────────────────────────┐
│ ✅ Kitchen Scanned!          │
│                             │
│   📏 Dimensions:             │
│   Length: 12.5 ft           │
│   Width: 15.2 ft            │
│   Height: 9.0 ft            │
│   Area: 190 sq ft           │
│                             │
│   Coverage: 95% - Excellent │ ← Quality indicator
│                             │
│   [Continue →]              │
└─────────────────────────────┘
```

**Data Storage:**
- Store dimensions in localStorage: `roomDimensions` object
- Format: `{ kitchen: { length: 12.5, width: 15.2, height: 9.0, area: 190, coverage: 95 } }`
- Include quality/coverage score

**Progressive Enhancement:**
- Feature detection at page load
- If WebXR supported: real scanning
- If not: graceful fallback to mock
- User never knows the difference (both look professional)

---

#### **Page 6: Review Photos** (`review.html`)

**Purpose:** Let user verify all photos before analysis

**Layout:**
```
┌─────────────────────────────┐
│ Review Your Photos          │
│ Make sure everything looks  │
│ good before we analyze      │
├─────────────────────────────┤
│ ┌─────┐ Front Exterior      │
│ │photo│ ✅ 190 sq ft         │
│ └─────┘ [Retake]            │
├─────────────────────────────┤
│ ┌─────┐ Kitchen             │
│ │photo│ ✅ 190 sq ft         │
│ └─────┘ [Retake]            │
├─────────────────────────────┤
│ ... (3 more rooms)          │
├─────────────────────────────┤
│ [← Back] [Analyze Property] │
└─────────────────────────────┘
```

**Features:**
- Grid of all 5 captured photos
- Each card shows:
  - Photo thumbnail (tappable to view full-size)
  - Room name
  - Dimensions (if scanned)
  - ✅ Checkmark indicating captured
- "Retake" button per photo
  - Returns to capture page for that room
  - Preserves other photos

**Validation:**
- All 5 photos required to proceed
- "Analyze Property" button disabled until complete
- Clear messaging: "Complete all 5 photos to continue"

**Data Review:**
- Pull from localStorage: `photos` and `roomDimensions`
- Display inline

---

#### **Page 7: Analysis Loading** (`analyzing.html`)

**Purpose:** Build anticipation while simulating AI processing

**Layout:**
```
┌─────────────────────────────┐
│                             │
│      🔄 Analyzing...        │
│                             │
│   █████████████░░░░ 75%     │ ← Animated progress bar
│                             │
│   Analyzing property        │ ← Cycling messages
│   features...               │
│                             │
└─────────────────────────────┘
```

**Cycling Messages** (change every 2 seconds):
1. "Analyzing property features..."
2. "Detecting finishes and materials..."
3. "Measuring room dimensions..."
4. "Comparing with nearby homes..."
5. "Calculating market value..."
6. "Generating your report..."

**Animation:**
- Progress bar animates from 0% to 100% over 8-10 seconds
- Smooth, consistent progress (not jerky)
- Messages sync with progress milestones

**Behind the Scenes:**
- Generate mock valuation data based on:
  - Entered address (ZIP code determines base price)
  - Room dimensions (total sq ft)
  - Number of photos (completion indicator)
  - Random variance (±5%) for realism
- Create mock comparable properties
- Prepare results data

**Auto-Redirect:**
- After 10 seconds, automatically navigate to results
- No user action required (sit back and watch)

---

#### **Page 8: Valuation Results** (`results.html`)

**Purpose:** Display valuation and supporting data

**Layout Sections:**

**Hero Section:**
```
┌─────────────────────────────┐
│   Your Home's Value         │
│                             │
│     $450,000                │ ← Large, bold number
│                             │
│   High Confidence (95%)     │ ← Badge with checkmark
│   $440,000 - $460,000       │ ← Range
└─────────────────────────────┘
```

**Breakdown Section:**
```
┌─────────────────────────────┐
│ How We Calculated This      │
├─────────────────────────────┤
│ 📐 Property Size            │
│    1,850 sq ft              │
│    Value impact: +$15,000   │
├─────────────────────────────┤
│ ✨ Condition                 │
│    Good - Well maintained   │
│    Value impact: +$8,000    │
├─────────────────────────────┤
│ 📍 Location                  │
│    Excellent neighborhood   │
│    Value impact: +$22,000   │
├─────────────────────────────┤
│ 🏠 Upgrades Detected         │
│    • Granite countertops    │
│    • Hardwood floors        │
│    • Stainless appliances   │
│    Value impact: +$12,000   │
├─────────────────────────────┤
│ 📈 Market Trend              │
│    Values up 3% in your area│
│    Value impact: +$7,000    │
├─────────────────────────────┤
│ Base Value: $386,000        │
│ Total Adjustments: +$64,000 │
│ Final Value: $450,000       │
└─────────────────────────────┘
```

**Comparable Properties Section:**
```
┌─────────────────────────────┐
│ Nearby Homes                │
│ [Map with 3-5 pins]         │
├─────────────────────────────┤
│ ┌─────┐ 123 Oak Street      │
│ │photo│ $445,000            │
│ └─────┘ Sold 30 days ago    │
│         1,800 sq ft, 3bd/2ba│
│         Similarity: 95%     │
├─────────────────────────────┤
│ ┌─────┐ 456 Maple Avenue    │
│ │photo│ $438,000            │
│ └─────┘ Sold 45 days ago    │
│         1,900 sq ft, 3bd/2ba│
│         Similarity: 92%     │
├─────────────────────────────┤
│ ... (3 more comparables)    │
└─────────────────────────────┘
```

**Action Buttons:**
```
┌─────────────────────────────┐
│ [📥 Download Report]        │ ← Primary CTA
│ [📤 Share Results]          │ ← Secondary
│ [🔄 Start New Valuation]    │ ← Tertiary
└─────────────────────────────┘
```

**Mock Data Generation:**

Based on user inputs, generate realistic data:

**Valuation Formula:**
```javascript
baseValue = getBaseValueByZipCode(address.zip) // e.g., $250-500K
sizeAdjustment = (totalSqFt - 1500) * 100 // $100 per sq ft variance
conditionAdjustment = randomBetween(5000, 15000) // Mock "good condition"
locationAdjustment = randomBetween(10000, 30000) // Based on ZIP
upgradesAdjustment = detectUpgrades(photos) // Mock: 8K-15K
marketAdjustment = baseValue * 0.03 // 3% market growth

finalValue = baseValue + all adjustments
confidenceLevel = 90-98% (random)
range = finalValue ± 2%
```

**Comparable Properties:**
- Generate 3-5 mock comparables
- Use same ZIP code as entered address
- Slight variations in price (±5-10%)
- Randomize sold dates (last 30-60 days)
- Display on map with Leaflet.js

**Map Integration:**
- Use Leaflet.js (free, open-source)
- Center on entered address
- Place pins for comparables
- Click pin to highlight that comparable card

**Download Report:**
- Generate simple HTML page with results
- Convert to PDF using browser print → PDF
- Includes: valuation, breakdown, comparables, disclaimer

**Share Results:**
- Generate shareable URL (encode data in URL params)
- Copy to clipboard
- Social share buttons (optional)

---

### 2.3 Navigation Flow

**Linear Flow (Can't Skip Ahead):**
```
index → address → instructions → capture (loop 5x) → [optional: scan] →
review → analyzing → results
```

**Back Navigation:**
- Every page has "← Back" button (except results)
- Returns to previous page in sequence
- Data persists when going back

**Progress Persistence:**
- Save state to localStorage after each step
- If user closes browser and returns:
  - Detect saved state
  - Offer to resume: "Continue where you left off?"
  - Or start fresh

**Exit Points:**
- User can close browser anytime
- No penalties, just saves progress
- No forced completion

---

## 3. Technical Architecture

### 3.1 Technology Stack

**Core Technologies:**
- **HTML5** - Semantic markup, forms, canvas
- **CSS3** - Grid, flexbox, animations, variables
- **Vanilla JavaScript (ES6+)** - No frameworks for PoC
- **Browser APIs** - MediaDevices, Geolocation, WebXR, LocalStorage

**Third-Party Libraries:**
- **Leaflet.js** - Map display (free, open-source)
- **Google Places API** - Address autocomplete (free tier, or mock)

**Development Tools:**
- Git for version control
- VS Code or similar editor
- Browser DevTools for debugging
- Netlify or Vercel for deployment (free tier)

### 3.2 File Structure

```
mobile-valuation/
├── index.html              # Landing page
├── address.html            # Property address entry
├── instructions.html       # Photo capture instructions
├── capture.html            # Room capture screen
├── scan.html              # LiDAR scanning screen
├── review.html            # Review photos
├── analyzing.html         # Analysis loading screen
├── results.html           # Valuation results
│
├── css/
│   ├── main.css           # Global styles, typography, colors
│   ├── components.css     # Reusable UI components
│   └── pages.css          # Page-specific styles
│
├── js/
│   ├── utils.js           # Helper functions (localStorage, navigation)
│   ├── camera.js          # Camera API handling
│   ├── lidar.js           # LiDAR/AR scanning (real + mock)
│   ├── geolocation.js     # Location services & address autocomplete
│   ├── mockData.js        # Mock valuation data generation
│   └── main.js            # Page-specific initialization
│
├── assets/
│   ├── images/            # Icons, logos, sample images
│   │   ├── logo.svg
│   │   ├── icon-*.svg
│   │   └── example-*.jpg
│   └── sounds/            # Optional audio feedback
│       └── shutter.mp3
│
├── docs/
│   ├── plans/             # Design documents
│   └── learning-notes.md  # Learning documentation
│
├── .gitignore
└── README.md
```

### 3.3 Data Flow

**State Management with LocalStorage:**

```javascript
// Data stored in localStorage:

// 1. Property Address
localStorage.setItem('propertyAddress', JSON.stringify({
  street: '123 Main St',
  city: 'San Francisco',
  state: 'CA',
  zip: '94102'
}))

// 2. Captured Photos (array of objects)
localStorage.setItem('photos', JSON.stringify([
  {
    room: 'exterior',
    imageData: 'data:image/jpeg;base64,...',
    timestamp: 1234567890
  },
  // ... 4 more rooms
]))

// 3. Room Dimensions (object)
localStorage.setItem('roomDimensions', JSON.stringify({
  exterior: null, // Exterior not scanned
  kitchen: { length: 12.5, width: 15.2, height: 9.0, area: 190 },
  livingRoom: { length: 18.0, width: 14.5, height: 9.0, area: 261 },
  // ... etc
}))

// 4. Progress State
localStorage.setItem('currentStep', 'capture') // Track where user is
localStorage.setItem('currentRoom', 2) // Which room (1-5)
```

**Data Flow Between Pages:**

```
Page A saves data → localStorage → Page B reads data → Display/Process
```

Example:
```javascript
// address.html saves
const address = { street: '...', city: '...', ... }
localStorage.setItem('propertyAddress', JSON.stringify(address))
window.location.href = 'instructions.html'

// instructions.html reads
const address = JSON.parse(localStorage.getItem('propertyAddress'))
// Use address data...
```

### 3.4 Browser API Usage

**MediaDevices API (Camera):**

```javascript
// Request camera access
navigator.mediaDevices.getUserMedia({
  video: {
    facingMode: 'environment', // Back camera on mobile
    width: { ideal: 1920 },
    height: { ideal: 1080 }
  }
})
.then(stream => {
  videoElement.srcObject = stream
  // Display live camera feed
})
.catch(error => {
  // Handle permission denied or no camera
  showError('Camera access required')
})
```

**Geolocation API (Location):**

```javascript
// Get user's location
navigator.geolocation.getCurrentPosition(
  position => {
    const lat = position.coords.latitude
    const lon = position.coords.longitude
    // Reverse geocode to address
    reverseGeocode(lat, lon)
  },
  error => {
    // Handle permission denied or unavailable
    showManualAddressForm()
  }
)
```

**LocalStorage API (Data Persistence):**

```javascript
// Save data
localStorage.setItem('key', 'value')
localStorage.setItem('object', JSON.stringify({ a: 1, b: 2 }))

// Read data
const value = localStorage.getItem('key')
const object = JSON.parse(localStorage.getItem('object'))

// Clear data (start fresh)
localStorage.clear()
```

**WebXR Device API (LiDAR - Advanced):**

```javascript
// Feature detection
if ('xr' in navigator) {
  navigator.xr.isSessionSupported('immersive-ar')
    .then(supported => {
      if (supported) {
        // Device has AR capabilities (likely LiDAR)
        showLiDARButton()
      } else {
        // Fallback to mock scanning
        useMockScanning()
      }
    })
}
```

### 3.5 Mock Data Generation

**Strategy:**

Since we're not connecting to real APIs (AVM, comparable sales data), we'll generate realistic mock data based on user inputs.

**Address → Base Valuation:**

```javascript
// Simple lookup table by ZIP code
const baseValuesByZip = {
  '94102': 650000, // San Francisco
  '10001': 550000, // NYC
  '90210': 850000, // Beverly Hills
  // ... more ZIPs
  'default': 350000 // Fallback for unknown ZIPs
}

function getBaseValue(zip) {
  return baseValuesByZip[zip] || baseValuesByZip['default']
}
```

**Room Dimensions → Total Square Footage:**

```javascript
function calculateTotalSqFt(roomDimensions) {
  let total = 0
  for (let room in roomDimensions) {
    if (roomDimensions[room]) {
      total += roomDimensions[room].area
    }
  }
  return total
}
```

**Photos → Detected Upgrades:**

```javascript
// Mock: randomly assign upgrades based on rooms photographed
function detectUpgrades(photos) {
  const possibleUpgrades = [
    'Granite countertops',
    'Hardwood floors',
    'Stainless steel appliances',
    'Updated fixtures',
    'Custom cabinetry'
  ]

  // Randomly select 2-4 upgrades
  return possibleUpgrades.slice(0, Math.floor(Math.random() * 3) + 2)
}
```

**Generate Comparable Properties:**

```javascript
function generateComparables(address, baseValue) {
  const comparables = []

  for (let i = 0; i < 4; i++) {
    comparables.push({
      address: `${100 + i * 100} ${getRandomStreetName()} ${address.city}`,
      price: baseValue + (Math.random() * 40000 - 20000), // ±$20K variance
      soldDate: getRandomRecentDate(), // Last 60 days
      sqFt: 1500 + Math.floor(Math.random() * 800), // 1500-2300 sq ft
      beds: 3,
      baths: 2,
      similarity: 90 + Math.floor(Math.random() * 8), // 90-98%
      photo: `assets/images/comparable-${i}.jpg` // Stock photo
    })
  }

  return comparables
}
```

### 3.6 Responsive Design Strategy

**Mobile-First Approach:**

1. **Design for 375px width first** (iPhone SE, smallest common screen)
2. **Enhance for larger screens** (tablets, desktops)

**Breakpoints:**

```css
/* Mobile (default) */
@media (min-width: 375px) { /* Base styles */ }

/* Large mobile / small tablet */
@media (min-width: 768px) {
  /* Two-column layouts */
  /* Larger text */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Max width container (800px) */
  /* Horizontal layouts */
  /* Sidebar navigation */
}
```

**Touch-First Interactions:**

- Minimum 44x44px touch targets
- Swipe gestures for navigation (optional)
- Tap to interact (no hover states required)
- Large, easy-to-press buttons

**Performance:**

- Lazy load images (only load when visible)
- Compress photos before storing (reduce file size)
- Minimize JavaScript bundle size
- Fast page transitions

---

## 4. Visual Design System

### 4.1 Color Palette

**Primary Colors:**
```css
:root {
  /* Primary - Rocket Red */
  --rocket-red: #D2222D;
  --rocket-red-dark: #A51C25;
  --rocket-red-light: #FF5A5F;

  /* Neutrals */
  --text-primary: #1A1A1A;
  --text-secondary: #666666;
  --text-light: #999999;
  --background: #FFFFFF;
  --background-gray: #F5F5F5;
  --border-gray: #E0E0E0;

  /* Status Colors */
  --success-green: #00A86B;
  --warning-yellow: #FFA500;
  --error-red: #DC3545;

  /* Overlay */
  --overlay-dark: rgba(0,0,0,0.5);
}
```

**Usage Guidelines:**
- Rocket Red: Primary CTAs, highlights, brand elements
- Neutrals: Text, backgrounds, borders
- Status Colors: Feedback (success, warning, error)

### 4.2 Typography

**Font Stack:**
```css
:root {
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                 Roboto, 'Helvetica Neue', Arial, sans-serif;
}
```

**Font Sizes:**
```css
:root {
  /* Sizes (mobile-first) */
  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 18px;   /* Larger for accessibility */
  --text-lg: 20px;
  --text-xl: 24px;
  --text-2xl: 32px;
  --text-3xl: 48px;

  /* Weights */
  --weight-normal: 400;
  --weight-medium: 500;
  --weight-bold: 700;
}
```

**Usage:**
- Body text: 18px (larger for accessibility)
- Headings: 24-48px (progressive sizing)
- Small text: 14px minimum (labels, footnotes)

### 4.3 Spacing System

**8px Base Unit:**
```css
:root {
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-5: 40px;
  --space-6: 48px;
  --space-8: 64px;
}
```

**Usage:**
- Tight spacing: 8-16px (within components)
- Comfortable: 24-32px (between sections)
- Generous: 40-48px (major sections)

### 4.4 UI Components

**Buttons:**

```css
/* Primary Button */
.button-primary {
  background: var(--rocket-red);
  color: white;
  font-size: 18px;
  font-weight: 600;
  padding: 16px 32px;
  border-radius: 8px;
  border: none;
  min-height: 56px; /* Extra touch-friendly */
  box-shadow: 0 2px 8px rgba(210,34,45,0.2);
}

.button-primary:hover {
  background: var(--rocket-red-dark);
}

.button-primary:active {
  transform: scale(0.98);
}

/* Secondary Button */
.button-secondary {
  background: white;
  color: var(--rocket-red);
  border: 2px solid var(--rocket-red);
  /* Other styles same as primary */
}
```

**Input Fields:**

```css
.input-field {
  font-size: 20px; /* Large for easy typing */
  padding: 16px;
  border: 1px solid var(--border-gray);
  border-radius: 8px;
  min-height: 56px;
  width: 100%;
}

.input-field:focus {
  border-color: var(--rocket-red);
  outline: none;
  box-shadow: 0 0 0 3px rgba(210,34,45,0.1);
}
```

**Cards:**

```css
.card {
  background: white;
  border-radius: 12px;
  padding: var(--space-3);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

**Progress Bar:**

```css
.progress-bar {
  height: 8px;
  background: var(--background-gray);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg,
    var(--rocket-red) 0%,
    var(--rocket-red-light) 100%);
  transition: width 0.3s ease;
}
```

### 4.5 Layout Patterns

**Page Container:**
```css
.page-container {
  max-width: 600px; /* Constrain on desktop */
  margin: 0 auto;
  padding: var(--space-3);
  min-height: 100vh;
}
```

**Flexbox Patterns:**

```css
/* Vertical stack with spacing */
.stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

/* Horizontal layout */
.row {
  display: flex;
  gap: var(--space-2);
  align-items: center;
}

/* Space between (nav with back/next) */
.space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

**Grid Patterns:**

```css
/* Photo grid (review page) */
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-2);
}
```

### 4.6 Animations

**Page Transitions:**
```css
/* Slide in from right */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.page-enter {
  animation: slideInRight 0.3s ease-out;
}
```

**Button Press:**
```css
.button:active {
  transform: scale(0.98);
  transition: transform 0.1s;
}
```

**Loading Spinner:**
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  border: 4px solid var(--background-gray);
  border-top-color: var(--rocket-red);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}
```

### 4.7 Accessibility Features

**Visual Accessibility:**
- Text contrast ratio: Minimum 4.5:1 (WCAG AA)
- Large text sizes (18px base)
- Focus indicators on all interactive elements
- Color is never the only indicator (use icons + text)

**Keyboard Accessibility:**
- Logical tab order
- Focus styles visible
- Enter key activates buttons
- Escape key to close modals

**Screen Reader Support:**
- Semantic HTML (`<header>`, `<main>`, `<nav>`, `<button>`)
- Alt text on all images
- ARIA labels where needed
- Form labels properly associated

**Universal Design:**
- Simple language (5th grade reading level)
- Icons supplement text
- Forgiving error handling
- Undo/back options always available

---

## 5. Implementation Plan

### 5.1 Development Phases

**Phase 1: Foundation & Landing Page**

**Goals:**
- Set up project structure
- Build landing page
- Establish global styles and components
- Learn HTML, CSS, Git basics

**Tasks:**
1. Create file structure
2. Set up CSS system (variables, components)
3. Build landing page HTML
4. Style landing page
5. Add responsive design
6. Test on mobile device
7. Commit to Git

**Time:** Flexible, 3-5 sessions

---

**Phase 2: Forms & Data Flow**

**Goals:**
- Build address entry page
- Implement geolocation and autocomplete
- Set up localStorage
- Learn JavaScript basics

**Tasks:**
1. Create address.html
2. Build form with validation
3. Implement geolocation API
4. Add address autocomplete (mock or real)
5. Save data to localStorage
6. Build instructions.html
7. Navigate between pages with data

**Time:** Flexible, 4-6 sessions

---

**Phase 3: Camera & Photo Capture**

**Goals:**
- Build camera capture interface
- Implement MediaDevices API
- Add visual guides and quality feedback
- Build LiDAR scanning experience
- Create review page

**Tasks:**
1. Create capture.html with camera viewfinder
2. Request camera permissions
3. Display live camera feed
4. Add visual overlay guides
5. Capture photos and convert to base64
6. Store photos in localStorage
7. Build scan.html (mock LiDAR for now)
8. Create review.html with photo grid
9. Add "retake" functionality

**Time:** Flexible, 6-8 sessions

---

**Phase 4: Results & Polish**

**Goals:**
- Build analyzing and results pages
- Generate mock valuation data
- Display comparables with map
- Add final polish and animations
- Deploy to production

**Tasks:**
1. Create analyzing.html with loading animation
2. Generate mock valuation in mockData.js
3. Build results.html layout
4. Display valuation breakdown
5. Generate mock comparable properties
6. Integrate Leaflet.js map
7. Add download/share functionality
8. Polish animations and transitions
9. Test full flow end-to-end
10. Deploy to Netlify/Vercel

**Time:** Flexible, 5-7 sessions

---

**Phase 5: LiDAR Enhancement (Optional)**

**Goals:**
- Add real LiDAR scanning on capable devices
- Implement WebXR API
- Progressive enhancement

**Tasks:**
1. Research WebXR API
2. Implement feature detection
3. Build AR scanning interface
4. Capture real room dimensions
5. Fallback to mock on non-capable devices

**Time:** Flexible, 3-5 sessions

---

### 5.2 Learning Approach

**Each Session:**

1. **Concept Introduction** (10 min)
   - Explain what we're building
   - Show examples
   - Answer "why"

2. **Guided Building** (30-45 min)
   - Write code with explanations
   - Read and understand each line
   - Test frequently

3. **Practice Exercise** (15-20 min)
   - Build something similar independently
   - Get stuck, debug, learn

4. **Commit & Document** (5-10 min)
   - Commit to Git with clear message
   - Document learnings

**Resources Provided:**
- learning-notes.md (running documentation)
- Inline code comments (explain everything)
- Cheat sheets (quick reference)
- MDN links (deeper reading)

### 5.3 Success Checkpoints

After each phase:
- ✅ Test on phone
- ✅ Review learnings
- ✅ Commit and push to GitHub
- ✅ Decide: continue or refine?

---

## 6. Testing & Quality Assurance

### 6.1 Testing Strategy

**Manual Testing:**

**Device Testing:**
- iPhone (Safari)
- Android (Chrome)
- Desktop (Chrome, Safari, Firefox)

**Screen Sizes:**
- Mobile: 375px (iPhone SE)
- Mobile: 390px (iPhone 12)
- Tablet: 768px (iPad)
- Desktop: 1024px+

**Functionality Testing:**
- All buttons work
- Navigation flows correctly
- Data persists in localStorage
- Camera access works
- Photos capture and display
- Forms validate properly
- Results calculate correctly

**User Testing:**
- Test with 3-5 non-technical users
- Observe where they get confused
- Iterate based on feedback

### 6.2 Performance Targets

- Page load: <2 seconds
- Camera initialization: <1 second
- Photo capture: Instant
- Page transitions: <300ms
- Works on 3G connection (compressed images)

### 6.3 Browser Compatibility

**Supported:**
- iOS Safari 12+ (iPhone 6s and newer)
- Chrome Android 70+
- Desktop Chrome, Safari, Firefox (latest)

**Graceful Degradation:**
- LiDAR: Works on capable devices, mocks on others
- Camera: Fallback to file upload if camera denied
- Geolocation: Fallback to manual entry if denied

---

## 7. Deployment Strategy

### 7.1 Hosting

**Platform:** Netlify or Vercel (free tier)

**Why:**
- One-command deployment
- Automatic HTTPS
- Custom domain support (optional)
- Form handling (for feedback)
- Instant preview URLs for testing

**Deployment:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Get URL: https://mobile-valuation.netlify.app
```

### 7.2 Sharing Strategy

**Demo URL:**
- Short, memorable URL
- HTTPS (secure for camera access)
- Works immediately on any device

**QR Code:**
- Generate QR code for URL
- Easy to share in presentations
- Print on business cards

**GitHub:**
- Code hosted at github.com/jjnino1221/mobile-valuation
- Can share repo with technical peers
- Portfolio piece

---

## 8. Future Enhancements (Post-PoC)

### 8.1 MVP Phase

**Add:**
- User authentication (login/signup)
- Save multiple property valuations
- Email reports to users
- Real AVM integration
- Basic backend (Node.js + database)

### 8.2 Production Phase

**Add:**
- Real computer vision analysis
- Integration with Rocket LOS
- GSE-compatible data collection
- Licensed appraiser review workflow
- Advanced fraud detection
- Full compliance and security

### 8.3 Scale Phase

**Add:**
- Native iOS and Android apps
- Redfin partnership integration
- B2B licensing to other lenders
- Advanced analytics dashboard
- Machine learning model training

---

## 9. Success Metrics

### 9.1 PoC Success Criteria

**Technical:**
- ✅ Works on 95% of mobile devices
- ✅ Camera reliability >98%
- ✅ Zero critical bugs
- ✅ <3 second load times

**User Experience:**
- ✅ 90% of test users complete flow
- ✅ <15 minute completion time
- ✅ 80%+ satisfaction score
- ✅ "Wow" reactions from demos

**Learning:**
- ✅ Builder understands all code
- ✅ Can make modifications independently
- ✅ Confident in web development basics

### 9.2 Demo Success Criteria

**Rocket Product Feedback:**
- Interest in next phase
- Positive comments on UX
- Questions about feasibility (good sign)
- Requests to test themselves

**Strategic Outcome:**
- Validates user experience
- Proves technical feasibility
- Opens conversations with Product leadership
- Positions builder as innovator

---

## 10. Risk Management

### 10.1 Technical Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Camera API issues | High | Low | Fallback to file upload |
| LocalStorage limits | Medium | Low | Compress photos, clear old data |
| Browser compatibility | Medium | Medium | Test early, polyfill if needed |
| Performance on old devices | Medium | Medium | Optimize images, lazy load |

### 10.2 Product Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| UX too complex | High | Low | User testing, iterate |
| "Not Rocket-like" feedback | Medium | Low | Use Rocket brand guidelines |
| Dismissed as "toy" | Medium | Low | Emphasize learning + vision |
| Technical feasibility questioned | Low | Low | Reference research docs |

### 10.3 Learning Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Concepts too advanced | High | Low | Slow down, simplify |
| Builder loses motivation | Medium | Low | Celebrate wins, flexible pace |
| Stuck on bugs | Medium | Medium | Pair debug, move forward |
| Time commitment too high | Medium | Low | No deadlines, flexible schedule |

---

## 11. Conclusion

This Proof of Concept will demonstrate the viability and user experience of a mobile-first property valuation platform. By building it hands-on with vanilla JavaScript, the builder will gain deep understanding of web development fundamentals while creating a portfolio piece that showcases product thinking and execution.

**Key Differentiators:**
- Universal accessibility (anyone can use it)
- LiDAR demonstration (cutting-edge)
- Professional design (Rocket-quality)
- Complete flow (address to valuation)
- Learn-by-doing approach (builder understands everything)

**Next Steps:**
1. Approve this design document
2. Create detailed implementation plan (writing-plans skill)
3. Begin Phase 1: Foundation & Landing Page
4. Build, learn, iterate
5. Demo to Rocket Product by end of 2026

**Timeline:** Flexible, end-of-year target (December 2026)

**Outcome:** A working prototype that validates the concept and opens strategic conversations at Rocket.

---

**Document Status:** ✅ Approved - March 9, 2026
**Next Action:** Create implementation plan with writing-plans skill

---

*This design document will evolve as we learn and build. Updates will be tracked in Git commits.*