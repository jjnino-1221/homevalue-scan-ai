# Phase 2: Forms & Data Flow - Design Document

**Date:** March 12, 2026
**Author:** Product Management
**Status:** Approved
**Phase:** 2 of 4
**Dependencies:** Phase 1 (Foundation & Landing Page)

---

## Executive Summary

Phase 2 builds the address entry and photo instructions pages, introducing real-world API integration (Google Places & Geocoding), form validation, data persistence, and resume functionality. This phase establishes the data collection foundation needed for the camera capture flow in Phase 3.

**Key Features:**
- Geolocation-first address entry with manual fallback
- Google Places Autocomplete for address suggestions
- Strict validation with graceful error handling
- Auto-save progress to localStorage
- Resume detection for returning users
- Detailed photo capture instructions

**Learning Focus:**
- Asynchronous JavaScript (Promises, Async/Await)
- External API integration
- Form validation patterns
- Data persistence strategies
- Error handling and graceful degradation

---

## 1. Scope & Goals

### What We're Building

#### **Page 1: Address Entry (`address.html`)**

**Primary Flow: Geolocation**
- Large "Use My Location" button as primary action
- Shows explanatory modal before requesting browser permission
- Uses Geolocation API → Google Geocoding API
- Auto-fills address field on success
- Enables Continue button when valid

**Secondary Flow: Manual Entry**
- Single text field with Google Places Autocomplete
- Real-time suggestions dropdown as user types
- Strict validation on Continue click
- Graceful degradation if APIs fail

**Features:**
- Auto-save to localStorage on every action
- Resume detection when user returns
- Clear error messages for invalid input
- Privacy reassurance messaging

#### **Page 2: Photo Instructions (`instructions.html`)**

**Content:**
- Detailed guidance for 5 room photos
- Card-based layout with icons, tips, and example placeholders
- Time estimate: "Takes about 10 minutes"
- "Start Capturing" CTA linking to capture page (Phase 3)

**5 Rooms:**
1. Front Exterior 🏠 - "Stand across the street if possible"
2. Kitchen 🍳 - "Capture countertops and appliances"
3. Living Room 🛋️ - "Show the main living space"
4. Master Bedroom 🛏️ - "Capture the room from the doorway"
5. Master Bathroom 🚿 - "Show vanity and fixtures"

### Out of Scope

- Camera capture functionality (Phase 3)
- Photo storage and review (Phase 3)
- LiDAR scanning (Phase 3)
- Valuation results (Phase 4)

### Success Criteria

**Technical:**
- ✅ Geolocation flow works on 95%+ of devices
- ✅ Autocomplete provides relevant suggestions
- ✅ Data persists across browser sessions
- ✅ Resume detection works correctly
- ✅ Graceful degradation when APIs fail

**User Experience:**
- ✅ Address entry feels fast and easy
- ✅ Error messages are clear and helpful
- ✅ Instructions build confidence for photo capture
- ✅ Flow feels natural: landing → address → instructions

**Learning:**
- ✅ Understand asynchronous JavaScript
- ✅ Can integrate external APIs
- ✅ Understand form validation patterns
- ✅ Can debug API and network issues

---

## 2. Technical Architecture

### Google APIs Required

**1. Google Places Autocomplete API**
- **Purpose:** Address suggestions as user types
- **Endpoint:** `https://maps.googleapis.com/maps/api/js?libraries=places`
- **Cost:** ~$17 per 1,000 requests (free tier: $200/month = ~11,700 requests)

**2. Google Geocoding API**
- **Purpose:** Convert lat/long coordinates to street address
- **Endpoint:** `https://maps.googleapis.com/maps/api/geocode/json`
- **Cost:** ~$5 per 1,000 requests (free tier: $200/month = 40,000 requests)

**Setup Steps:**
1. Create Google Cloud Project: "Mobile Valuation PoC"
2. Enable both APIs in API Library
3. Create API Key in Credentials
4. Restrict key with HTTP referrers (localhost + eventual domain)
5. Store key in JavaScript file (client-side for PoC)

**Security Note:** For PoC, client-side API key is acceptable with proper restrictions. Production would use server-side proxy.

### Data Flow Diagrams

#### **Flow 1: Geolocation Path**

```
User clicks "Use My Location"
  ↓
Show modal: "We'll use your location to find your property
             address. Your location is private and never shared."
  ↓
User clicks [Allow] or [No thanks]
  ↓
If Allow:
  ↓
  Request navigator.geolocation.getCurrentPosition()
  ↓
  Receive: {latitude: 37.7749, longitude: -122.4194}
  ↓
  Call Google Geocoding API:
  GET https://maps.googleapis.com/maps/api/geocode/json
      ?latlng=37.7749,-122.4194&key=API_KEY
  ↓
  Parse response: {
    results: [{
      formatted_address: "123 Main St, San Francisco, CA 94102",
      address_components: [...]
    }]
  }
  ↓
  Extract components:
    street: "123 Main St"
    city: "San Francisco"
    state: "CA"
    zip: "94102"
  ↓
  Auto-fill address field
  ↓
  Save to localStorage: propertyAddress
  ↓
  Enable Continue button
  ↓
  Show success checkmark animation

If No thanks:
  ↓
  Close modal
  ↓
  Focus address input field
  ↓
  Show helper text: "No problem! Just type your address above"
```

#### **Flow 2: Manual Entry Path**

```
User types in address field: "123 mai..."
  ↓
Debounce 300ms (wait for user to pause typing)
  ↓
Initialize Google Places Autocomplete on input field
  ↓
User continues typing: "123 main st san..."
  ↓
Autocomplete API returns suggestions:
  [
    "123 Main St, San Francisco, CA 94102",
    "123 Main St, San Jose, CA 95110",
    "123 Main St, Oakland, CA 94607"
  ]
  ↓
Display dropdown below input field
  ↓
User selects suggestion OR continues typing full address
  ↓
If selected from dropdown:
  Parse autocomplete place object
  Extract address components
  Fill form with complete address

If typed manually:
  User clicks Continue
  Validate format with regex
  Parse free-form text
  Extract components
  ↓
Validate address components:
  - Street address present
  - City present
  - State is 2 letters
  - ZIP is 5 digits
  ↓
If valid:
  Save to localStorage: propertyAddress
  Enable Continue button
  Navigate to instructions.html

If invalid:
  Show error message below field
  Keep Continue disabled
  Highlight which field is invalid
```

#### **Flow 3: Fallback Path (API Failure)**

```
Google APIs fail to load OR timeout
  ↓
Show warning banner:
"💡 Address suggestions unavailable. Please type your complete
    address: street, city, state, zip"
  ↓
Accept free-form text input
  ↓
User types: "123 Main St, San Francisco, CA 94102"
  ↓
User clicks Continue
  ↓
Parse with regex patterns:
  /^(.+?),\s*(.+?),\s*([A-Z]{2})\s*(\d{5})$/
  ↓
Extract components:
  street: "123 Main St"
  city: "San Francisco"
  state: "CA"
  zip: "94102"
  ↓
Validate minimum requirements:
  - Street not empty
  - ZIP is 5 digits
  ↓
If valid: Save and continue
If invalid: Show specific error
```

### localStorage Schema

```javascript
// Session progress tracking
{
  "currentStep": "address",              // Current page: address, instructions, capture, etc.
  "sessionStarted": "2026-03-12T14:30:00" // ISO timestamp
}

// Property address (incrementally saved)
{
  "propertyAddress": {
    "street": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94102",
    "fullAddress": "123 Main St, San Francisco, CA 94102",
    "source": "geolocation",             // or "autocomplete" or "manual"
    "timestamp": "2026-03-12T14:35:00"
  }
}
```

**Storage Strategy: Auto-Save on Every Action**
- User selects autocomplete suggestion → save immediately
- Geolocation succeeds → save immediately
- User manually types complete address → save on Continue click
- Before page navigation → verify data saved

**Benefits:**
- Never lose progress
- Can resume from exact point
- Survives browser crashes

### File Structure

**New Files:**
```
mobile-valuation/
├── address.html              ← New: Address entry page
├── instructions.html         ← New: Photo instructions page
│
├── js/
│   ├── geolocation.js       ← New: Geolocation + Geocoding logic
│   ├── autocomplete.js      ← New: Google Places integration
│   └── validation.js        ← New: Form validation helpers
│
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-03-12-phase-2-forms-data-flow-design.md  ← This document
```

**Updated Files:**
```
js/utils.js                   ← Add resume detection, enhanced storage
js/main.js                    ← Add initAddressPage(), initInstructionsPage()
css/components.css            ← Add form components, modals, cards
css/pages.css                 ← Add address + instructions page styles
README.md                     ← Update progress to Phase 2
```

### Error Handling Strategy

| Scenario | Handling Approach | User Experience |
|----------|-------------------|-----------------|
| **Google API fails to load** | Show warning, allow free-form text | "💡 Address suggestions unavailable. Please type your complete address..." |
| **Geolocation permission denied** | Close modal, focus input, show helper | "No problem! Just type your address above" |
| **Geolocation timeout** | After 10s, fall back to manual | "Taking too long. Try typing instead?" |
| **No internet connection** | Try API calls, timeout, fall back | Works offline with manual parsing |
| **Invalid address format** | Block Continue, show specific error | "Please enter a valid 5-digit ZIP code" |
| **localStorage full** | Try to save, catch quota error, warn | "Unable to save. Continue anyway?" |
| **localStorage disabled** | Detect early, warn user | "⚠️ Enable cookies/storage for best experience" |
| **User closes browser mid-entry** | Auto-save catches this, resume on return | "Welcome back! Continue where you left off?" |

**Philosophy: Graceful Degradation**
- APIs enhance experience but aren't required
- Manual entry always works
- Clear, actionable error messages
- No dead ends - always provide next step

---

## 3. Detailed UI/UX Specifications

### Address Entry Page (`address.html`)

#### Layout Structure (Mobile First)

```
┌─────────────────────────────┐
│ [← Back to Home]            │  ← Navigation link (Rocket Red)
│                             │
│ Where's your property?      │  ← H1 (32px, bold)
│ We'll use this to find      │  ← Subtext (18px, gray)
│ homes like yours nearby     │
│                             │  Space: 24px
│ ┌───────────────────────┐   │
│ │ 📍 Use My Location    │   │  ← Primary button
│ └───────────────────────┘   │  Rocket Red, white text
│                             │  56px min height
│         - or -              │  ← Divider (16px, gray)
│                             │
│ PROPERTY ADDRESS            │  ← Label (14px, uppercase, gray)
│ ┌───────────────────────┐   │
│ │ 123 Main St...        │   │  ← Input field (18px)
│ └───────────────────────┘   │  Border: 2px gray → red on focus
│   ↓ Autocomplete dropdown   │  Shows below when typing
│                             │
│ [Error: ZIP code required]  │  ← Error state (red, 14px)
│                             │  Only shown when validation fails
│                             │  Space: 24px
│ ┌───────────────────────┐   │
│ │ Continue →            │   │  ← Secondary button
│ └───────────────────────┘   │  Disabled: gray, Enabled: red
│                             │
│ 🔒 Your data stays private  │  ← Footer reassurance (14px, gray)
└─────────────────────────────┘
```

**Responsive Behavior:**
- Mobile (<768px): Full width, single column
- Tablet/Desktop (768px+): Max width 600px, centered
- All touch targets: 56px minimum height

#### Location Permission Modal

```
┌─────────────────────────────┐
│      Dark Overlay (50%)     │  ← rgba(0,0,0,0.5)
│  ┌───────────────────────┐  │
│  │                       │  │
│  │  📍                   │  │  ← Icon (64px)
│  │  Use Your Location    │  │  ← H2 (24px, bold)
│  │                       │  │
│  │  We'll use your       │  │  ← Body text (18px)
│  │  location to find     │  │
│  │  your property        │  │
│  │  address.             │  │
│  │                       │  │
│  │  Your location is     │  │
│  │  private and never    │  │
│  │  shared.              │  │
│  │                       │  │
│  │  ┌─────────────────┐  │  │
│  │  │ Allow           │  │  │  ← Primary (Rocket Red)
│  │  └─────────────────┘  │  │  56px height
│  │                       │  │
│  │  ┌─────────────────┐  │  │
│  │  │ No thanks       │  │  │  ← Secondary (white, gray text)
│  │  └─────────────────┘  │  │  56px height
│  │                       │  │
│  └───────────────────────┘  │
│                             │
│  (Click outside to close)   │
└─────────────────────────────┘
```

**Modal Behavior:**
- Fades in over 300ms
- Centers vertically and horizontally
- Prevents body scroll while open
- ESC key closes modal
- Click outside closes modal
- Focus trapped inside modal

#### UI States

**1. Default State**
- Location button: enabled, Rocket Red
- Address input: empty, gray border
- Continue button: disabled, gray
- No errors shown

**2. Typing State**
- Address input: focused, red border
- Autocomplete dropdown: visible below input
- Continue button: still disabled until valid
- Character count if approaching limit

**3. Valid State**
- Address input: filled, green checkmark icon
- Continue button: enabled, Rocket Red
- No errors
- Ready to proceed

**4. Error State**
- Address input: red border
- Error message: red text below input
  - "Street address is required"
  - "Please enter a valid 5-digit ZIP code"
  - "Please enter city and state"
- Continue button: disabled, gray
- Specific, actionable guidance

**5. Loading State (Geolocation)**
- Location button: shows spinner, "Getting location..."
- Input field: disabled during geolocation
- Continue button: disabled
- Overlay prevents interaction

**6. Success State (Geolocation)**
- Address auto-filled
- Green checkmark animation
- Brief success message: "✓ Address found"
- Continue button: enabled
- Celebration micro-animation (optional)

**7. API Failure State**
- Warning banner at top (yellow background):
  "💡 Address suggestions unavailable. Please type your complete address."
- Input field still functional
- Manual parsing on Continue
- Continue button enabled once text present

### Autocomplete Dropdown

```
┌───────────────────────────┐
│ [123 Main St, San...]     │  ← Input field
└───────────────────────────┘
┌───────────────────────────┐  ← Dropdown appears
│ 📍 123 Main St,           │  ← Suggestion item
│    San Francisco, CA 94102│    Hover: light gray bg
├───────────────────────────┤
│ 📍 123 Main St,           │
│    San Jose, CA 95110     │
├───────────────────────────┤
│ 📍 123 Main St,           │
│    Oakland, CA 94607      │
└───────────────────────────┘
```

**Dropdown Behavior:**
- Appears below input field (absolute positioning)
- Max 5 suggestions shown
- Keyboard navigation: ↑↓ arrows, Enter to select
- Mouse: hover highlights, click selects
- Click outside or ESC closes
- Selected item fills input and closes dropdown

### Instructions Page (`instructions.html`)

#### Layout Structure

```
┌─────────────────────────────┐
│ [← Back]                    │  ← Back to address page
│                             │
│ Let's capture your property │  ← H1 (32px, bold)
│ in 5 quick photos           │
│                             │
│ ┌───────────────────────┐   │
│ │ 🏠 1. Front Exterior  │   │  ← Instruction Card
│ │                       │   │
│ │ Stand across the      │   │  ← Tip text (16px, gray)
│ │ street if possible    │   │
│ │                       │   │
│ │ ┌─────────────────┐   │   │
│ │ │  [Placeholder]  │   │   │  ← Example image placeholder
│ │ │   Image: 16:9   │   │   │  Light gray box, 16:9 ratio
│ │ └─────────────────┘   │   │
│ └───────────────────────┘   │
│                             │  Space: 24px between cards
│ ┌───────────────────────┐   │
│ │ 🍳 2. Kitchen         │   │  ← Card 2
│ │                       │   │
│ │ Capture countertops   │   │
│ │ and appliances        │   │
│ │                       │   │
│ │ ┌─────────────────┐   │   │
│ │ │  [Placeholder]  │   │   │
│ │ └─────────────────┘   │   │
│ └───────────────────────┘   │
│                             │
│ ... (3 more cards)          │
│                             │
│ ⏱️ Takes about 10 minutes   │  ← Time estimate (16px, gray)
│                             │  Space: 32px
│ ┌───────────────────────┐   │
│ │ Start Capturing       │   │  ← Primary CTA (Rocket Red)
│ └───────────────────────┘   │  56px height
└─────────────────────────────┘
```

**Responsive Behavior:**
- Mobile (<768px): Single column, full width cards
- Tablet (768px+): 2 column grid for cards
- Desktop (1024px+): Still 2 columns (max width 800px)

#### Instruction Card Details

Each card contains:
1. **Icon/Emoji** - 48px size, top left
2. **Number and Room Name** - "1. Front Exterior" (20px, bold)
3. **Capture Tip** - Brief instruction (16px, gray)
4. **Example Image Placeholder** - 16:9 aspect ratio, light gray box with centered text "Example photo"

**Card Styling:**
- Background: white
- Border radius: 12px
- Padding: 24px
- Shadow: `0 2px 8px rgba(0,0,0,0.1)`
- Margin bottom: 24px

**5 Rooms with Tips:**
1. 🏠 **Front Exterior** - "Stand across the street if possible"
2. 🍳 **Kitchen** - "Capture countertops and appliances"
3. 🛋️ **Living Room** - "Show the main living space"
4. 🛏️ **Master Bedroom** - "Capture the room from the doorway"
5. 🚿 **Master Bathroom** - "Show vanity and fixtures"

### Resume Detection Modal

**When user returns to app:**

```
┌─────────────────────────────┐
│      Dark Overlay           │
│  ┌───────────────────────┐  │
│  │                       │  │
│  │  Welcome back! 👋     │  │  ← H2 (24px)
│  │                       │  │
│  │  You were working on  │  │  ← Body text (18px)
│  │  a valuation for:     │  │
│  │                       │  │
│  │  123 Main St          │  │  ← Address (bold)
│  │  San Francisco, CA    │  │
│  │                       │  │
│  │  ┌─────────────────┐  │  │
│  │  │ Continue        │  │  │  ← Primary (Rocket Red)
│  │  └─────────────────┘  │  │
│  │                       │  │
│  │  ┌─────────────────┐  │  │
│  │  │ Start Fresh     │  │  │  ← Secondary (white)
│  │  └─────────────────┘  │  │
│  │                       │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

**Behavior:**
- Appears automatically on landing page if progress detected
- Shows last saved address
- "Continue" → navigates to last `currentStep` page
- "Start Fresh" → clears localStorage, closes modal, stays on landing

---

## 4. Implementation Details

### New JavaScript Concepts

#### 1. Asynchronous JavaScript (Promises & Async/Await)

**Problem:** API calls take time. We can't freeze the UI while waiting.

**Solution: Async/Await** (modern, readable approach)

```javascript
// Old way: Callback hell (confusing nested functions)
navigator.geolocation.getCurrentPosition(
  function(position) {
    fetch('https://api.example.com/geocode?lat=' + position.coords.latitude)
      .then(function(response) {
        return response.json()
      })
      .then(function(data) {
        // Finally do something with data
      })
  },
  function(error) {
    console.error('Failed:', error)
  }
)

// Modern way: Async/Await (clear, sequential-looking code)
async function getAddressFromLocation() {
  try {
    // Wait for geolocation
    const position = await getCurrentPosition()

    // Wait for API call
    const response = await fetch(
      `https://api.example.com/geocode?lat=${position.coords.latitude}`
    )

    // Wait for JSON parsing
    const data = await response.json()

    // Now use the data
    return parseAddress(data)
  } catch (error) {
    // Any error in the chain caught here
    console.error('Failed:', error)
    showErrorMessage('Unable to get location')
  }
}
```

**Key Concepts:**
- `async` function: Can use `await` inside
- `await`: Pause until promise resolves
- `try/catch`: Handle errors cleanly
- Returns a Promise automatically

#### 2. Fetch API (Making HTTP Requests)

```javascript
// GET request to Google Geocoding API
async function reverseGeocode(lat, lng) {
  const apiKey = 'YOUR_API_KEY'
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`

  try {
    // Make request
    const response = await fetch(url)

    // Check if successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Parse JSON
    const data = await response.json()

    // Extract address
    if (data.results && data.results[0]) {
      return parseAddressComponents(data.results[0].address_components)
    } else {
      throw new Error('No results found')
    }
  } catch (error) {
    console.error('Geocoding failed:', error)
    return null
  }
}
```

**Response Structure (Google Geocoding):**
```json
{
  "results": [{
    "formatted_address": "123 Main St, San Francisco, CA 94102, USA",
    "address_components": [
      {"long_name": "123", "short_name": "123", "types": ["street_number"]},
      {"long_name": "Main Street", "short_name": "Main St", "types": ["route"]},
      {"long_name": "San Francisco", "types": ["locality"]},
      {"long_name": "California", "short_name": "CA", "types": ["administrative_area_level_1"]},
      {"long_name": "94102", "types": ["postal_code"]}
    ]
  }],
  "status": "OK"
}
```

#### 3. Event Debouncing (Performance Optimization)

**Problem:** User types "123 Main St" → 12 API calls (one per keystroke!) → expensive, slow

**Solution: Debounce** (wait until user stops typing)

```javascript
// Without debounce: API call on EVERY keystroke
inputElement.addEventListener('input', () => {
  callAutocompleteAPI(inputElement.value) // Called 12 times!
})

// With debounce: Wait 300ms after user stops typing
let debounceTimeout
inputElement.addEventListener('input', (e) => {
  // Clear previous timer
  clearTimeout(debounceTimeout)

  // Set new timer
  debounceTimeout = setTimeout(() => {
    callAutocompleteAPI(e.target.value) // Only called once!
  }, 300) // Wait 300ms
})
```

**Result:** User types "123 Main St" → only 1 API call after they pause

#### 4. Form Validation Patterns

```javascript
// validation.js

/**
 * Validate address object
 * @param {Object} address - {street, city, state, zip}
 * @returns {Object} - {valid: boolean, errors: string[]}
 */
function validateAddress(address) {
  const errors = []

  // Street address required
  if (!address.street || address.street.trim().length === 0) {
    errors.push('Street address is required')
  }

  // City required
  if (!address.city || address.city.trim().length === 0) {
    errors.push('City is required')
  }

  // State must be 2 letters
  if (!address.state || !/^[A-Z]{2}$/.test(address.state)) {
    errors.push('State must be 2 letters (e.g., CA)')
  }

  // ZIP must be 5 digits
  if (!address.zip || !/^\d{5}$/.test(address.zip)) {
    errors.push('ZIP code must be 5 digits')
  }

  return {
    valid: errors.length === 0,
    errors: errors
  }
}

/**
 * Show validation errors in UI
 */
function showValidationErrors(errors) {
  const errorContainer = document.getElementById('address-errors')

  if (errors.length === 0) {
    errorContainer.style.display = 'none'
    return
  }

  errorContainer.innerHTML = errors.map(error =>
    `<p class="form-error">${error}</p>`
  ).join('')

  errorContainer.style.display = 'block'
}

/**
 * Enable/disable Continue button based on validation
 */
function updateContinueButton(isValid) {
  const button = document.getElementById('continue-button')
  button.disabled = !isValid

  if (isValid) {
    button.classList.remove('button-disabled')
    button.classList.add('button-primary')
  } else {
    button.classList.add('button-disabled')
    button.classList.remove('button-primary')
  }
}
```

#### 5. Modal Management

```javascript
/**
 * Show modal with fade-in animation
 */
function showModal(modalId) {
  const modal = document.getElementById(modalId)
  const overlay = modal.querySelector('.modal-overlay')

  // Prevent body scroll
  document.body.style.overflow = 'hidden'

  // Show modal
  modal.style.display = 'flex'

  // Trigger fade-in (after brief delay for CSS transition)
  setTimeout(() => {
    overlay.classList.add('active')
  }, 10)

  // Focus first button
  const firstButton = modal.querySelector('button')
  if (firstButton) {
    firstButton.focus()
  }

  // Add keyboard handlers
  modal.addEventListener('keydown', handleModalKeydown)
}

/**
 * Close modal with fade-out animation
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId)
  const overlay = modal.querySelector('.modal-overlay')

  // Fade out
  overlay.classList.remove('active')

  // Wait for animation, then hide
  setTimeout(() => {
    modal.style.display = 'none'
    document.body.style.overflow = '' // Restore scroll
  }, 300) // Match CSS transition duration

  // Remove keyboard handlers
  modal.removeEventListener('keydown', handleModalKeydown)
}

/**
 * Handle modal keyboard events
 */
function handleModalKeydown(e) {
  if (e.key === 'Escape') {
    closeModal(e.currentTarget.id)
  }
}

/**
 * Close modal when clicking outside
 */
function setupModalClickOutside(modalId) {
  const modal = document.getElementById(modalId)
  const overlay = modal.querySelector('.modal-overlay')

  overlay.addEventListener('click', (e) => {
    // Only close if clicking overlay itself, not modal content
    if (e.target === overlay) {
      closeModal(modalId)
    }
  })
}
```

### New CSS Components

#### 1. Form Components

```css
/* Form Group Container */
.form-group {
  margin-bottom: var(--space-3); /* 24px */
}

/* Form Label */
.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: var(--space-1); /* 8px */
  letter-spacing: 0.5px;
}

/* Form Input */
.form-input {
  width: 100%;
  font-size: 18px;
  padding: 16px;
  border: 2px solid var(--border-gray);
  border-radius: 8px;
  transition: border-color 0.2s, box-shadow 0.2s;
  font-family: var(--font-family);
}

.form-input:focus {
  border-color: var(--rocket-red);
  outline: none;
  box-shadow: 0 0 0 3px rgba(210, 34, 45, 0.1);
}

.form-input.error {
  border-color: var(--error-red);
}

.form-input:disabled {
  background: var(--background-gray);
  cursor: not-allowed;
  opacity: 0.6;
}

/* Form Error Message */
.form-error {
  color: var(--error-red);
  font-size: 14px;
  margin-top: var(--space-1); /* 8px */
  display: flex;
  align-items: center;
  gap: 4px;
}

.form-error::before {
  content: '⚠️';
}

/* Success State */
.form-input.success {
  border-color: var(--success-green);
}

.form-success {
  color: var(--success-green);
  font-size: 14px;
  margin-top: var(--space-1);
  display: flex;
  align-items: center;
  gap: 4px;
}

.form-success::before {
  content: '✓';
}
```

#### 2. Modal & Overlay

```css
/* Modal Container */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: none; /* Hidden by default */
}

/* Modal Overlay (dark background) */
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.modal-overlay.active {
  opacity: 1;
}

/* Modal Content Box */
.modal-content {
  background: white;
  padding: var(--space-4); /* 32px */
  border-radius: 12px;
  max-width: 90%;
  width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  text-align: center;
  transform: scale(0.9);
  transition: transform 0.3s ease;
}

.modal-overlay.active .modal-content {
  transform: scale(1);
}

/* Modal Header */
.modal-header {
  font-size: 48px;
  margin-bottom: var(--space-2);
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: var(--space-2);
}

.modal-body {
  font-size: 18px;
  color: var(--text-secondary);
  margin-bottom: var(--space-4);
  line-height: 1.5;
}

/* Modal Buttons */
.modal-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.modal-actions .button {
  width: 100%;
}
```

#### 3. Autocomplete Dropdown

```css
/* Dropdown Container */
.autocomplete-container {
  position: relative;
}

.autocomplete-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid var(--border-gray);
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  display: none; /* Hidden by default */
}

.autocomplete-dropdown.active {
  display: block;
}

/* Dropdown Item */
.autocomplete-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.autocomplete-item:hover,
.autocomplete-item.highlighted {
  background: var(--background-gray);
}

.autocomplete-item.selected {
  background: rgba(210, 34, 45, 0.1);
  color: var(--rocket-red);
}

.autocomplete-item-icon {
  font-size: 20px;
}

.autocomplete-item-text {
  flex: 1;
  font-size: 16px;
}

/* Empty State */
.autocomplete-empty {
  padding: 16px;
  text-align: center;
  color: var(--text-light);
  font-size: 14px;
}
```

#### 4. Loading Spinner

```css
/* Spinner */
.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Button with loading state */
.button.loading {
  position: relative;
  color: transparent; /* Hide text */
  pointer-events: none; /* Disable clicks */
}

.button.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -10px 0 0 -10px;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Loading overlay for page */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.loading-spinner-large {
  width: 48px;
  height: 48px;
  border: 4px solid var(--background-gray);
  border-top-color: var(--rocket-red);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: var(--space-3);
  font-size: 18px;
  color: var(--text-secondary);
}
```

#### 5. Instruction Cards

```css
/* Instruction Card */
.instruction-card {
  background: white;
  border-radius: 12px;
  padding: var(--space-3); /* 24px */
  margin-bottom: var(--space-3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s, transform 0.3s;
}

.instruction-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* Card Icon */
.instruction-icon {
  font-size: 48px;
  margin-bottom: var(--space-2);
  display: block;
}

/* Card Title */
.instruction-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: var(--space-1);
  color: var(--text-primary);
}

/* Card Tip Text */
.instruction-tip {
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: var(--space-2);
  line-height: 1.5;
}

/* Example Image Placeholder */
.instruction-example {
  width: 100%;
  aspect-ratio: 16/9;
  background: var(--background-gray);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-light);
  font-size: 14px;
  border: 2px dashed var(--border-gray);
}

/* Responsive Grid for Instructions */
@media (min-width: 768px) {
  .instructions-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-3);
  }

  .instruction-card {
    margin-bottom: 0; /* Grid gap handles spacing */
  }
}
```

#### 6. Warning Banner

```css
/* Warning Banner (for API failures) */
.warning-banner {
  background: #FFF3CD;
  border-left: 4px solid #FFA500;
  padding: var(--space-2);
  margin-bottom: var(--space-3);
  border-radius: 4px;
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
}

.warning-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.warning-content {
  flex: 1;
}

.warning-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.warning-text {
  font-size: 14px;
  color: var(--text-secondary);
}

/* Closeable banner */
.warning-banner.closeable {
  padding-right: 40px;
  position: relative;
}

.warning-close {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.warning-close:hover {
  opacity: 1;
}
```

---

## 5. Implementation Plan

### Task Breakdown (14 Tasks)

#### **Task 1: Setup & Google API Configuration**
**Duration:** 1 session (~45-60 min)
**Goal:** Get Google APIs working and testable

**Steps:**
1. Go to https://console.cloud.google.com
2. Create new project: "Mobile Valuation PoC"
3. Navigate to "APIs & Services" → "Library"
4. Enable "Places API"
5. Enable "Geocoding API"
6. Navigate to "Credentials" → "Create Credentials" → "API Key"
7. Copy API key
8. Click "Restrict Key":
   - API restrictions: Restrict to "Places API" and "Geocoding API"
   - Application restrictions: HTTP referrers
   - Add referrer: `http://localhost/*`
   - Add referrer: `http://127.0.0.1/*`
9. Save restrictions

**Test in Browser Console:**
```javascript
// Test Geocoding API
fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=37.7749,-122.4194&key=YOUR_API_KEY')
  .then(r => r.json())
  .then(console.log)
```

**Document:**
- Save API key in `docs/api-key.txt` (gitignored)
- Add setup notes to `learning-notes.md`

---

#### **Task 2: Build Address Page HTML Structure**
**Duration:** 1 session
**Goal:** Create semantic HTML for address entry page

**File:** `address.html`

**HTML Structure:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enter Address - Mobile Valuation</title>
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/pages.css">

  <!-- Google Places API -->
  <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script>
</head>
<body>
  <div class="page-container">
    <!-- Navigation -->
    <nav class="page-nav">
      <a href="index.html" class="nav-back">← Back to Home</a>
    </nav>

    <!-- Main Content -->
    <main>
      <h1>Where's your property?</h1>
      <p class="subtitle">We'll use this to find homes like yours nearby</p>

      <!-- Location Button -->
      <button type="button" id="location-button" class="button button-primary button-full">
        📍 Use My Location
      </button>

      <!-- Divider -->
      <div class="divider">
        <span>or</span>
      </div>

      <!-- Address Input -->
      <div class="form-group autocomplete-container">
        <label for="address-input" class="form-label">Property Address</label>
        <input
          type="text"
          id="address-input"
          class="form-input"
          placeholder="123 Main Street, City, State ZIP"
          autocomplete="off"
        >
        <div id="autocomplete-dropdown" class="autocomplete-dropdown"></div>
        <div id="address-errors"></div>
      </div>

      <!-- Continue Button -->
      <button type="button" id="continue-button" class="button button-secondary button-full" disabled>
        Continue →
      </button>

      <!-- Privacy Note -->
      <p class="privacy-note">🔒 Your data stays private</p>
    </main>
  </div>

  <!-- Location Permission Modal -->
  <div id="location-modal" class="modal">
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">📍</div>
        <h2 class="modal-title">Use Your Location</h2>
        <div class="modal-body">
          <p>We'll use your location to find your property address.</p>
          <p>Your location is private and never shared.</p>
        </div>
        <div class="modal-actions">
          <button type="button" class="button button-primary" id="allow-location">Allow</button>
          <button type="button" class="button button-secondary" id="deny-location">No thanks</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Scripts -->
  <script src="js/utils.js"></script>
  <script src="js/validation.js"></script>
  <script src="js/geolocation.js"></script>
  <script src="js/autocomplete.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

**Test:** Open `address.html` in browser, verify structure appears

---

#### **Task 3: Style Address Page**
**Duration:** 1 session
**Goal:** Make address page visually polished

**Files to Update:**
- `css/components.css` - Add form, modal, button styles
- `css/pages.css` - Add address page specific styles

**Add to `components.css`:**
```css
/* Form components (from Section 4 above) */
/* Modal styles (from Section 4 above) */
/* Loading spinner (from Section 4 above) */

/* Divider */
.divider {
  text-align: center;
  margin: var(--space-3) 0;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background: var(--border-gray);
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  color: var(--text-light);
  font-size: 14px;
  padding: 0 16px;
  background: var(--background);
}
```

**Add to `pages.css`:**
```css
/* Address Page */
.page-nav {
  margin-bottom: var(--space-4);
}

.nav-back {
  color: var(--rocket-red);
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: opacity 0.2s;
}

.nav-back:hover {
  opacity: 0.8;
}

.privacy-note {
  text-align: center;
  font-size: 14px;
  color: var(--text-light);
  margin-top: var(--space-3);
}
```

**Test:** Verify styling on mobile, tablet, desktop viewports

---

#### **Task 4: Implement Geolocation Flow**
**Duration:** 1-2 sessions
**Goal:** Get user's location and convert to address

**File:** Create `js/geolocation.js`

```javascript
/**
 * Geolocation & Geocoding Logic
 */

const GOOGLE_API_KEY = 'YOUR_API_KEY' // Replace with actual key

/**
 * Initialize geolocation flow
 */
function initGeolocation() {
  const locationButton = document.getElementById('location-button')

  onClick('#location-button', () => {
    showModal('location-modal')
  })

  onClick('#allow-location', async () => {
    closeModal('location-modal')
    await requestGeolocation()
  })

  onClick('#deny-location', () => {
    closeModal('location-modal')
    focusAddressInput()
    showHelper('No problem! Just type your address above')
  })
}

/**
 * Request browser geolocation
 */
async function requestGeolocation() {
  showLoadingState('Getting your location...')

  try {
    const position = await getCurrentPosition()
    const { latitude, longitude } = position.coords

    console.log('Got coordinates:', latitude, longitude)

    const address = await reverseGeocode(latitude, longitude)

    if (address) {
      fillAddressForm(address)
      saveToStorage('propertyAddress', address)
      showSuccess('✓ Address found!')
      enableContinueButton()
    } else {
      throw new Error('Could not find address')
    }
  } catch (error) {
    console.error('Geolocation failed:', error)
    handleGeolocationError(error)
  } finally {
    hideLoadingState()
  }
}

/**
 * Wrap geolocation API in Promise
 */
function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      error => reject(error),
      {
        timeout: 10000, // 10 second timeout
        enableHighAccuracy: true
      }
    )
  })
}

/**
 * Convert coordinates to address using Google Geocoding API
 */
async function reverseGeocode(lat, lng) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.status !== 'OK' || !data.results[0]) {
      throw new Error('No address found')
    }

    return parseGoogleAddress(data.results[0])
  } catch (error) {
    console.error('Geocoding API failed:', error)
    return null
  }
}

/**
 * Parse Google Geocoding response into address object
 */
function parseGoogleAddress(result) {
  const components = result.address_components
  const address = {
    street: '',
    city: '',
    state: '',
    zip: '',
    fullAddress: result.formatted_address,
    source: 'geolocation'
  }

  // Extract street number and route
  const streetNumber = findComponent(components, 'street_number')
  const route = findComponent(components, 'route')
  address.street = [streetNumber, route].filter(Boolean).join(' ')

  // Extract city
  address.city = findComponent(components, 'locality') ||
                 findComponent(components, 'sublocality')

  // Extract state
  address.state = findComponent(components, 'administrative_area_level_1', true)

  // Extract ZIP
  address.zip = findComponent(components, 'postal_code')

  return address
}

/**
 * Find component by type in Google address components
 */
function findComponent(components, type, shortName = false) {
  const component = components.find(c => c.types.includes(type))
  return component ? (shortName ? component.short_name : component.long_name) : ''
}

/**
 * Handle geolocation errors
 */
function handleGeolocationError(error) {
  let message = 'Unable to get your location. Please enter address manually.'

  if (error.code === 1) { // PERMISSION_DENIED
    message = 'Location access denied. No problem! Just type your address above.'
  } else if (error.code === 3) { // TIMEOUT
    message = 'Location request timed out. Please try again or enter manually.'
  }

  showErrorMessage(message)
  focusAddressInput()
}

/**
 * Fill form with address data
 */
function fillAddressForm(address) {
  const input = document.getElementById('address-input')
  input.value = address.fullAddress
  input.classList.add('success')
}

/**
 * Focus address input field
 */
function focusAddressInput() {
  const input = document.getElementById('address-input')
  input.focus()
}

/**
 * Show loading state
 */
function showLoadingState(message) {
  const button = document.getElementById('location-button')
  button.classList.add('loading')
  button.disabled = true
  button.dataset.originalText = button.textContent
  button.textContent = message
}

/**
 * Hide loading state
 */
function hideLoadingState() {
  const button = document.getElementById('location-button')
  button.classList.remove('loading')
  button.disabled = false
  button.textContent = button.dataset.originalText || '📍 Use My Location'
}

/**
 * Show success message
 */
function showSuccess(message) {
  // Could show toast notification or temporary message
  console.log('Success:', message)
}

/**
 * Show error message
 */
function showErrorMessage(message) {
  const errorContainer = document.getElementById('address-errors')
  errorContainer.innerHTML = `<p class="form-error">${message}</p>`
  errorContainer.style.display = 'block'
}

/**
 * Show helper text
 */
function showHelper(message) {
  const errorContainer = document.getElementById('address-errors')
  errorContainer.innerHTML = `<p style="color: var(--text-secondary);">${message}</p>`
  errorContainer.style.display = 'block'
}

/**
 * Enable continue button
 */
function enableContinueButton() {
  const button = document.getElementById('continue-button')
  button.disabled = false
  button.classList.remove('button-disabled')
  button.classList.add('button-primary')
}
```

**Test:**
- Click "Use My Location"
- Allow browser permission
- Verify address appears in input field
- Verify data saved to localStorage

---

#### **Task 5: Implement Address Autocomplete**
**Duration:** 1-2 sessions
**Goal:** Google Places autocomplete for manual entry

**File:** Create `js/autocomplete.js`

```javascript
/**
 * Google Places Autocomplete Logic
 */

let autocompleteInstance = null

/**
 * Initialize Google Places Autocomplete
 */
function initAutocomplete() {
  const input = document.getElementById('address-input')

  if (!window.google || !window.google.maps) {
    console.error('Google Maps not loaded')
    showAPIFallbackMessage()
    setupManualEntry()
    return
  }

  try {
    // Initialize autocomplete
    autocompleteInstance = new google.maps.places.Autocomplete(input, {
      types: ['address'],
      componentRestrictions: { country: 'us' }
    })

    // Listen for place selection
    autocompleteInstance.addListener('place_changed', handlePlaceSelected)

    console.log('✓ Autocomplete initialized')
  } catch (error) {
    console.error('Autocomplete failed:', error)
    showAPIFallbackMessage()
    setupManualEntry()
  }
}

/**
 * Handle autocomplete place selection
 */
function handlePlaceSelected() {
  const place = autocompleteInstance.getPlace()

  if (!place.address_components) {
    console.error('No address components')
    return
  }

  const address = parseGooglePlace(place)

  // Fill form
  const input = document.getElementById('address-input')
  input.value = address.fullAddress
  input.classList.add('success')

  // Save to storage
  saveToStorage('propertyAddress', address)

  // Validate and enable continue
  const validation = validateAddress(address)
  if (validation.valid) {
    enableContinueButton()
    clearErrors()
  } else {
    showValidationErrors(validation.errors)
  }
}

/**
 * Parse Google Place object into address
 */
function parseGooglePlace(place) {
  const components = place.address_components
  const address = {
    street: '',
    city: '',
    state: '',
    zip: '',
    fullAddress: place.formatted_address || place.name,
    source: 'autocomplete'
  }

  // Extract street
  const streetNumber = findComponent(components, 'street_number')
  const route = findComponent(components, 'route')
  address.street = [streetNumber, route].filter(Boolean).join(' ')

  // Extract city
  address.city = findComponent(components, 'locality') ||
                 findComponent(components, 'sublocality')

  // Extract state
  address.state = findComponent(components, 'administrative_area_level_1', true)

  // Extract ZIP
  address.zip = findComponent(components, 'postal_code')

  return address
}

/**
 * Setup manual entry fallback (no autocomplete)
 */
function setupManualEntry() {
  const input = document.getElementById('address-input')

  // Debounce input for validation
  let debounceTimeout
  input.addEventListener('input', () => {
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => {
      validateManualInput(input.value)
    }, 500)
  })
}

/**
 * Validate manually typed address
 */
function validateManualInput(text) {
  if (!text || text.trim().length < 10) {
    disableContinueButton()
    return
  }

  // Try to parse free-form text
  const address = parseManualAddress(text)

  // Validate
  const validation = validateAddress(address)

  if (validation.valid) {
    enableContinueButton()
    clearErrors()

    // Save to storage
    saveToStorage('propertyAddress', address)
  } else {
    disableContinueButton()
    // Don't show errors while typing, only on Continue click
  }
}

/**
 * Parse manually typed address with regex
 */
function parseManualAddress(text) {
  // Try common patterns:
  // "123 Main St, San Francisco, CA 94102"
  // "123 Main St San Francisco CA 94102"

  const address = {
    fullAddress: text,
    source: 'manual'
  }

  // Extract ZIP (5 digits at end)
  const zipMatch = text.match(/\b(\d{5})\b/)
  if (zipMatch) {
    address.zip = zipMatch[1]
    text = text.replace(zipMatch[0], '').trim()
  }

  // Extract state (2 capital letters)
  const stateMatch = text.match(/\b([A-Z]{2})\b/)
  if (stateMatch) {
    address.state = stateMatch[1]
    text = text.replace(stateMatch[0], '').trim()
  }

  // Remaining text: split by comma or multiple spaces
  const parts = text.split(/,|\s{2,}/).map(p => p.trim()).filter(Boolean)

  if (parts.length >= 2) {
    address.street = parts[0]
    address.city = parts[1]
  } else if (parts.length === 1) {
    address.street = parts[0]
  }

  return address
}

/**
 * Show API fallback message
 */
function showAPIFallbackMessage() {
  const warningHTML = `
    <div class="warning-banner">
      <span class="warning-icon">💡</span>
      <div class="warning-content">
        <div class="warning-title">Address suggestions unavailable</div>
        <div class="warning-text">Please type your complete address: street, city, state, ZIP</div>
      </div>
    </div>
  `

  const container = document.querySelector('.page-container main')
  container.insertAdjacentHTML('afterbegin', warningHTML)
}

/**
 * Clear error messages
 */
function clearErrors() {
  const errorContainer = document.getElementById('address-errors')
  errorContainer.innerHTML = ''
  errorContainer.style.display = 'none'

  const input = document.getElementById('address-input')
  input.classList.remove('error')
}

/**
 * Disable continue button
 */
function disableContinueButton() {
  const button = document.getElementById('continue-button')
  button.disabled = true
  button.classList.add('button-disabled')
  button.classList.remove('button-primary')
}
```

**Test:**
- Type address manually
- Verify autocomplete suggestions appear
- Select suggestion
- Verify form fills correctly
- Test with Google API disabled (fallback mode)

---

#### **Task 6: Form Validation**
**Duration:** 1 session
**Goal:** Validate address before continuing

**File:** Create `js/validation.js`

```javascript
/**
 * Form Validation Helpers
 */

/**
 * Validate address object
 * @param {Object} address - {street, city, state, zip}
 * @returns {Object} - {valid: boolean, errors: string[]}
 */
function validateAddress(address) {
  const errors = []

  // Street address required
  if (!address.street || address.street.trim().length === 0) {
    errors.push('Street address is required')
  }

  // City required
  if (!address.city || address.city.trim().length === 0) {
    errors.push('City is required')
  }

  // State must be 2 letters
  if (!address.state || !/^[A-Z]{2}$/.test(address.state)) {
    errors.push('State must be 2 letters (e.g., CA)')
  }

  // ZIP must be 5 digits
  if (!address.zip || !/^\d{5}$/.test(address.zip)) {
    errors.push('ZIP code must be 5 digits')
  }

  return {
    valid: errors.length === 0,
    errors: errors
  }
}

/**
 * Show validation errors in UI
 */
function showValidationErrors(errors) {
  const errorContainer = document.getElementById('address-errors')

  if (errors.length === 0) {
    errorContainer.style.display = 'none'
    return
  }

  const input = document.getElementById('address-input')
  input.classList.add('error')

  errorContainer.innerHTML = errors.map(error =>
    `<p class="form-error">${error}</p>`
  ).join('')

  errorContainer.style.display = 'block'
}

/**
 * Validate before navigation
 */
function validateBeforeContinue() {
  const address = loadFromStorage('propertyAddress')

  if (!address) {
    showValidationErrors(['Please enter your property address'])
    return false
  }

  const validation = validateAddress(address)

  if (!validation.valid) {
    showValidationErrors(validation.errors)
    return false
  }

  return true
}
```

**Test:**
- Enter incomplete address
- Click Continue
- Verify error messages appear
- Complete address
- Verify errors clear
- Verify Continue enables

---

#### **Task 7: Data Persistence & Auto-Save**
**Duration:** 1 session
**Goal:** Save progress automatically

**File:** Update `js/utils.js`

```javascript
/**
 * Enhanced storage helpers with auto-save
 */

/**
 * Save current step to localStorage
 */
function saveCurrentStep(step) {
  saveToStorage('currentStep', step)
}

/**
 * Get current step from localStorage
 */
function getCurrentStep() {
  return loadFromStorage('currentStep')
}

/**
 * Initialize session if new
 */
function initSession() {
  const sessionStarted = loadFromStorage('sessionStarted')

  if (!sessionStarted) {
    saveToStorage('sessionStarted', new Date().toISOString())
    console.log('✓ New session started')
  }
}

/**
 * Check if session has saved progress
 */
function hasProgress() {
  const currentStep = getCurrentStep()
  const address = loadFromStorage('propertyAddress')

  return currentStep && currentStep !== 'landing' && address
}

/**
 * Clear all session data
 */
function clearSession() {
  clearStorage()
  console.log('✓ Session cleared')
}
```

**Update `js/main.js`:**
```javascript
/**
 * Initialize address page
 */
function initAddressPage() {
  console.log('Address page loaded')

  // Set current step
  saveCurrentStep('address')

  // Initialize geolocation
  initGeolocation()

  // Initialize autocomplete
  initAutocomplete()

  // Continue button handler
  onClick('#continue-button', () => {
    if (validateBeforeContinue()) {
      navigateTo('instructions.html')
    }
  })

  // Load saved address if exists
  const savedAddress = loadFromStorage('propertyAddress')
  if (savedAddress) {
    fillAddressForm(savedAddress)
    enableContinueButton()
  }

  console.log('✓ Address page initialized')
}
```

**Test:**
- Enter address
- Close browser
- Reopen address.html
- Verify address still filled in

---

#### **Task 8: Resume Detection**
**Duration:** 1 session
**Goal:** Offer to resume from saved progress

**File:** Update `js/main.js`

```javascript
/**
 * Check for saved progress on landing page
 */
function checkForResume() {
  if (!hasProgress()) {
    return // No saved progress
  }

  const address = loadFromStorage('propertyAddress')
  const currentStep = getCurrentStep()

  showResumeModal(address, currentStep)
}

/**
 * Show resume modal with saved progress
 */
function showResumeModal(address, step) {
  const modalHTML = `
    <div id="resume-modal" class="modal" style="display: flex;">
      <div class="modal-overlay active">
        <div class="modal-content">
          <div class="modal-header">👋</div>
          <h2 class="modal-title">Welcome back!</h2>
          <div class="modal-body">
            <p>You were working on a valuation for:</p>
            <p style="font-weight: 600; margin-top: 8px;">
              ${address.street}<br>
              ${address.city}, ${address.state} ${address.zip}
            </p>
          </div>
          <div class="modal-actions">
            <button type="button" class="button button-primary" id="resume-continue">
              Continue
            </button>
            <button type="button" class="button button-secondary" id="resume-fresh">
              Start Fresh
            </button>
          </div>
        </div>
      </div>
    </div>
  `

  document.body.insertAdjacentHTML('beforeend', modalHTML)

  // Continue button
  onClick('#resume-continue', () => {
    const pageMap = {
      'address': 'address.html',
      'instructions': 'instructions.html',
      'capture': 'capture.html' // Phase 3
    }

    const targetPage = pageMap[step] || 'address.html'
    navigateTo(targetPage)
  })

  // Start fresh button
  onClick('#resume-fresh', () => {
    clearSession()
    document.getElementById('resume-modal').remove()
  })
}
```

**Update landing page init:**
```javascript
function initLandingPage() {
  console.log('Landing page loaded')

  // Check for saved progress
  checkForResume()

  // Get Started buttons
  onClick('.hero-cta, .cta-container .button', function() {
    console.log('Get Started clicked')
    navigateTo('address.html')
  })

  console.log('✓ Navigation handlers attached')
}
```

**Test:**
- Complete address entry
- Navigate to instructions
- Close browser
- Reopen landing page
- Verify resume modal appears
- Test both "Continue" and "Start Fresh"

---

#### **Task 9: Build Instructions Page**
**Duration:** 1 session
**Goal:** Create HTML for photo instructions

**File:** Create `instructions.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Photo Instructions - Mobile Valuation</title>
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/pages.css">
</head>
<body>
  <div class="page-container">
    <!-- Navigation -->
    <nav class="page-nav">
      <a href="address.html" class="nav-back">← Back</a>
    </nav>

    <!-- Main Content -->
    <main>
      <h1>Let's capture your property in 5 quick photos</h1>

      <!-- Instructions Grid -->
      <div class="instructions-grid">

        <!-- Card 1: Front Exterior -->
        <div class="instruction-card">
          <span class="instruction-icon">🏠</span>
          <h3 class="instruction-title">1. Front Exterior</h3>
          <p class="instruction-tip">Stand across the street if possible</p>
          <div class="instruction-example">Example photo</div>
        </div>

        <!-- Card 2: Kitchen -->
        <div class="instruction-card">
          <span class="instruction-icon">🍳</span>
          <h3 class="instruction-title">2. Kitchen</h3>
          <p class="instruction-tip">Capture countertops and appliances</p>
          <div class="instruction-example">Example photo</div>
        </div>

        <!-- Card 3: Living Room -->
        <div class="instruction-card">
          <span class="instruction-icon">🛋️</span>
          <h3 class="instruction-title">3. Living Room</h3>
          <p class="instruction-tip">Show the main living space</p>
          <div class="instruction-example">Example photo</div>
        </div>

        <!-- Card 4: Master Bedroom -->
        <div class="instruction-card">
          <span class="instruction-icon">🛏️</span>
          <h3 class="instruction-title">4. Master Bedroom</h3>
          <p class="instruction-tip">Capture the room from the doorway</p>
          <div class="instruction-example">Example photo</div>
        </div>

        <!-- Card 5: Master Bathroom -->
        <div class="instruction-card">
          <span class="instruction-icon">🚿</span>
          <h3 class="instruction-title">5. Master Bathroom</h3>
          <p class="instruction-tip">Show vanity and fixtures</p>
          <div class="instruction-example">Example photo</div>
        </div>

      </div>

      <!-- Time Estimate -->
      <p class="time-estimate">⏱️ Takes about 10 minutes</p>

      <!-- Start Button -->
      <button type="button" id="start-capture" class="button button-primary button-full">
        Start Capturing
      </button>
    </main>
  </div>

  <!-- Scripts -->
  <script src="js/utils.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

**Test:** Open instructions.html, verify all 5 cards display

---

#### **Task 10: Style Instructions Page**
**Duration:** 1 session
**Goal:** Polish instructions page styling

**Add to `css/pages.css`:**
```css
/* Instructions Page */
.instructions-grid {
  margin: var(--space-4) 0;
}

.time-estimate {
  text-align: center;
  font-size: 18px;
  color: var(--text-secondary);
  margin: var(--space-4) 0;
}

/* Responsive Grid */
@media (min-width: 768px) {
  .instructions-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-3);
  }

  /* Full width for odd last item */
  .instruction-card:last-child:nth-child(odd) {
    grid-column: 1 / -1;
    max-width: calc(50% - var(--space-3) / 2);
  }
}
```

**Test:** View on mobile, tablet, desktop - verify responsive grid

---

#### **Task 11: Connect Address → Instructions Flow**
**Duration:** 1 session
**Goal:** Complete navigation between pages

**Update `js/main.js`:**
```javascript
/**
 * Initialize instructions page
 */
function initInstructionsPage() {
  console.log('Instructions page loaded')

  // Set current step
  saveCurrentStep('instructions')

  // Load saved address (for resume)
  const address = loadFromStorage('propertyAddress')
  if (!address) {
    // No address saved, redirect back
    console.warn('No address found, redirecting...')
    navigateTo('address.html')
    return
  }

  console.log('Address loaded:', address.fullAddress)

  // Start Capturing button
  onClick('#start-capture', () => {
    console.log('Start Capturing clicked')
    // Will navigate to capture.html in Phase 3
    alert('Camera capture coming in Phase 3!')
  })

  console.log('✓ Instructions page initialized')
}

/**
 * Detect which page and initialize
 */
function initPage() {
  const path = window.location.pathname
  const page = path.substring(path.lastIndexOf('/') + 1) || 'index.html'

  console.log('Current page:', page)

  // Initialize session
  initSession()

  // Initialize based on page
  if (page === 'index.html' || page === '') {
    initLandingPage()
  } else if (page === 'address.html') {
    initAddressPage()
  } else if (page === 'instructions.html') {
    initInstructionsPage()
  }
}

document.addEventListener('DOMContentLoaded', initPage)
```

**Test Full Flow:**
1. Start on landing page
2. Click "Get Started"
3. Enter address (geolocation or manual)
4. Click Continue
5. Verify navigation to instructions page
6. Verify 5 cards display
7. Close browser
8. Reopen landing page
9. Verify resume modal
10. Click "Continue"
11. Verify back on instructions page

---

#### **Task 12: Error Handling & Edge Cases**
**Duration:** 1 session
**Goal:** Test and handle all error scenarios

**Scenarios to Test:**

1. **No Internet Connection**
   - Disconnect WiFi
   - Try to load address.html
   - Verify warning appears
   - Verify manual entry still works

2. **Google API Disabled**
   - Remove API key temporarily
   - Verify fallback message
   - Verify free-form text parsing works

3. **Geolocation Denied**
   - Click "Use My Location" → deny permission
   - Verify friendly message
   - Verify manual entry focused

4. **Invalid Address Formats**
   - Try: "123" (incomplete)
   - Try: "Main Street" (no number)
   - Try: "123 Main St" (no city/state/zip)
   - Verify specific error messages

5. **localStorage Disabled**
   - Disable cookies in browser
   - Try to save data
   - Verify app handles gracefully

6. **Resume with Corrupted Data**
   - Manually edit localStorage in DevTools
   - Reload page
   - Verify app doesn't crash

**Add Error Handling:**
```javascript
// In utils.js
function saveToStorage(key, value) {
  try {
    const jsonValue = JSON.stringify(value)
    localStorage.setItem(key, jsonValue)
    return true
  } catch (error) {
    console.error('Error saving to localStorage:', error)
    if (error.name === 'QuotaExceededError') {
      alert('Storage full. Please clear some data.')
    }
    return false
  }
}

function loadFromStorage(key) {
  try {
    const jsonValue = localStorage.getItem(key)
    return jsonValue ? JSON.parse(jsonValue) : null
  } catch (error) {
    console.error('Error loading from localStorage:', error)
    // Corrupted data, clear it
    localStorage.removeItem(key)
    return null
  }
}
```

---

#### **Task 13: Testing & Polish**
**Duration:** 1 session
**Goal:** Full QA across devices and browsers

**Testing Checklist:**

**Functional:**
- [ ] "Use My Location" shows modal
- [ ] Location permission works
- [ ] Address auto-fills from geolocation
- [ ] Autocomplete shows suggestions
- [ ] Selected suggestion fills form
- [ ] Manual entry parses correctly
- [ ] Validation blocks invalid input
- [ ] Error messages are clear
- [ ] Continue button enables when valid
- [ ] Data saves to localStorage
- [ ] Resume modal appears on return
- [ ] Resume "Continue" works
- [ ] Resume "Start Fresh" clears data
- [ ] Instructions page displays correctly
- [ ] Back button navigates correctly

**Cross-Device:**
- [ ] iPhone Safari
- [ ] Android Chrome
- [ ] Desktop Chrome
- [ ] Desktop Safari
- [ ] Desktop Firefox

**Responsive:**
- [ ] 375px (iPhone SE)
- [ ] 768px (iPad)
- [ ] 1024px+ (desktop)

**Edge Cases:**
- [ ] Works offline (manual entry)
- [ ] Works without Google API
- [ ] Works with geolocation denied
- [ ] Handles slow 3G connection
- [ ] Handles localStorage disabled

**Polish:**
- [ ] All transitions smooth
- [ ] Loading states clear
- [ ] Error messages helpful
- [ ] Touch targets 56px min
- [ ] No console errors
- [ ] Animations performant

---

#### **Task 14: Documentation**
**Duration:** 1 session
**Goal:** Document Phase 2 work

**Update `docs/learning-notes.md`:**
```markdown
## Phase 2: Forms & Data Flow

### Session X: Google API Setup
**Date:** YYYY-MM-DD

**What I Built:**
- Google Cloud project
- Enabled Places and Geocoding APIs
- API key with restrictions

**What I Learned:**
- How to set up Google Cloud Console
- API key security (HTTP referrer restrictions)
- Free tier limits and costs

**Questions:**
- How do I hide API key in production?
- What happens if I exceed free tier?

---

### Session X: Asynchronous JavaScript
**Date:** YYYY-MM-DD

**What I Built:**
- Geolocation flow with async/await
- Google API calls with fetch()

**What I Learned:**
- Promises vs callbacks
- async/await syntax (cleaner than .then())
- try/catch for error handling
- Why await pauses execution

**Key Concepts:**
```javascript
// Old way: callback hell
doSomething(function(result) {
  doAnother(result, function(result2) {
    // Nested and hard to read
  })
})

// New way: async/await
async function myFunction() {
  const result = await doSomething()
  const result2 = await doAnother(result)
  // Clean and sequential
}
```

---

(Continue documenting each session...)
```

**Update `README.md`:**
```markdown
## 🚀 Current Status: Phase 2 Complete

### ✅ Completed
- Project foundation and CSS design system
- Landing page (fully responsive)
- **Address entry with geolocation** ⬅️ NEW
- **Google Places autocomplete** ⬅️ NEW
- **Photo capture instructions** ⬅️ NEW
- **Resume detection** ⬅️ NEW

### 📋 Phase Progress
- [x] **Phase 1:** Foundation & Landing Page ✅
- [x] **Phase 2:** Forms & Data Flow ✅ **COMPLETE**
- [ ] **Phase 3:** Camera & Photo Capture
- [ ] **Phase 4:** Results & Polish
```

**Create `docs/phase-2-testing-checklist.md`:**
(Copy testing checklist from Task 13)

**Commit & Tag:**
```bash
git add .
git commit -m "feat: complete Phase 2 - forms and data flow

- Add address entry page with geolocation
- Integrate Google Places autocomplete
- Implement form validation
- Add auto-save to localStorage
- Build resume detection flow
- Create photo instructions page
- Handle all error scenarios gracefully

Phase 2 complete: address entry → instructions page flow working"

git tag -a v0.2.0-phase2 -m "Phase 2 Complete: Forms & Data Flow"
```

---

## 6. Testing & Quality Assurance

### Phase 2 Testing Checklist

**Functional Testing:**
- [ ] "Use My Location" button shows modal
- [ ] Location permission request works
- [ ] Address auto-fills from geolocation
- [ ] Autocomplete shows suggestions as typing
- [ ] Selected suggestion fills form correctly
- [ ] Manual entry works without autocomplete
- [ ] Validation blocks invalid addresses
- [ ] Error messages display correctly
- [ ] Continue button enables when valid
- [ ] Data saves to localStorage automatically
- [ ] Resume modal appears on return
- [ ] Continue from resume works
- [ ] Start fresh clears data
- [ ] Instructions page displays 5 cards correctly
- [ ] Back button navigates correctly

**Error Handling:**
- [ ] Works when Google APIs fail
- [ ] Works when geolocation denied
- [ ] Works offline (shows appropriate messages)
- [ ] Handles invalid input gracefully
- [ ] Handles slow network connections
- [ ] Handles localStorage disabled
- [ ] Handles corrupted localStorage data

**Cross-Browser:**
- [ ] iOS Safari (iPhone)
- [ ] Android Chrome
- [ ] Desktop Chrome
- [ ] Desktop Safari
- [ ] Desktop Firefox

**Responsive Design:**
- [ ] Works on 375px (iPhone SE)
- [ ] Works on 768px (iPad)
- [ ] Works on 1024px+ (desktop)
- [ ] Touch targets 56px minimum
- [ ] Text readable without zooming

**Accessibility:**
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Form labels properly associated
- [ ] Error messages announced
- [ ] Modals trap focus
- [ ] ESC closes modals

**Performance:**
- [ ] Page loads in <2 seconds
- [ ] Autocomplete responds <500ms
- [ ] Geolocation completes <10 seconds
- [ ] Animations smooth (60fps)
- [ ] No layout shifts

---

## 7. Success Criteria

### Phase 2 is Complete When:

**Technical:**
- ✅ User can enter address via geolocation OR manual entry
- ✅ Google Places autocomplete works and provides suggestions
- ✅ Address validates before allowing Continue
- ✅ Data auto-saves to localStorage on every action
- ✅ Resume detection offers to continue where user left off
- ✅ Instructions page displays all 5 rooms with clear guidance
- ✅ Full flow works: landing → address → instructions
- ✅ Works on mobile devices (iOS and Android)
- ✅ Handles all error scenarios gracefully
- ✅ Falls back to manual entry when APIs fail

**User Experience:**
- ✅ Address entry feels fast and easy
- ✅ Geolocation flow is clear and non-threatening
- ✅ Error messages are helpful and specific
- ✅ Resume modal makes returning feel welcoming
- ✅ Instructions build confidence for photo capture
- ✅ No dead ends - always a path forward

**Learning:**
- ✅ Understand asynchronous JavaScript (async/await)
- ✅ Can integrate external APIs (Google Places, Geocoding)
- ✅ Understand form validation patterns
- ✅ Can handle errors gracefully
- ✅ Can debug network and API issues
- ✅ All code is understood and documented

**Readiness:**
- ✅ Demo-able: Can show to friends/family
- ✅ Foundation ready for Phase 3 (camera capture)
- ✅ Confident to continue building

---

## 8. Estimated Timeline

**Total Tasks:** 14
**Estimated Sessions:** 15-20 (45-60 minutes each)
**Calendar Time:** 3-4 weeks at 3-4 sessions per week

**Flexible pace - no pressure!** The goal is learning, not speed.

---

## 9. Phase 3 Preview

After Phase 2, we'll build:

**Camera Capture Flow:**
- Live camera viewfinder with MediaDevices API
- Room-by-room photo capture (5 photos)
- Visual guides and quality feedback
- Photo storage in localStorage (base64)
- Review page with retake functionality
- Mock LiDAR scanning experience

**New Concepts:**
- MediaDevices API (camera access)
- Canvas API (image manipulation)
- Base64 encoding (image storage)
- State machine patterns (room progression)
- Image compression (file size management)

---

## Document Status

**Status:** ✅ Approved
**Next Action:** Create implementation plan with writing-plans skill
**Created:** March 12, 2026
**Last Updated:** March 12, 2026

---

*This design document will guide Phase 2 development. Implementation plan will break these tasks into executable steps with review checkpoints.*
