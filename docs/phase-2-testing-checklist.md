# Phase 2 Testing Checklist

**Project:** Mobile Valuation PoC
**Phase:** 2 - Forms & Data Flow
**Date:** March 2026

## Functional Testing

### Address Page - Geolocation Flow
- [ ] "Use My Location" button shows modal
- [ ] Modal displays with proper animation
- [ ] "Allow" button requests browser geolocation permission
- [ ] Location permission granted → address auto-fills
- [ ] Address appears in input field with full format
- [ ] Continue button enables after successful geolocation
- [ ] Data saves to localStorage
- [ ] "No thanks" button closes modal
- [ ] "No thanks" focuses address input field

### Address Page - Autocomplete Flow
- [ ] Typing in address field shows autocomplete dropdown
- [ ] Google Places API returns relevant suggestions
- [ ] Selecting suggestion fills form correctly
- [ ] Selected address saves to localStorage
- [ ] Continue button enables when valid address selected
- [ ] Autocomplete respects US-only restriction

### Address Page - Manual Entry
- [ ] Manual address entry (without autocomplete) works
- [ ] Free-form text parsing extracts street, city, state, ZIP
- [ ] Validation checks all required fields
- [ ] Invalid addresses show error messages
- [ ] Error messages are clear and actionable
- [ ] Continue button stays disabled for invalid input

### Address Page - Validation
- [ ] Empty street → shows "Street address is required"
- [ ] Empty city → shows "City is required"
- [ ] Invalid state (not 2 letters) → shows "State must be 2 letters (e.g., CA)"
- [ ] Invalid ZIP (not 5 digits) → shows "ZIP code must be 5 digits"
- [ ] Multiple errors → all errors display
- [ ] Valid address → errors clear, continue button enables

### Resume Detection
- [ ] Completing address → return to landing page → resume modal appears
- [ ] Resume modal shows correct saved address
- [ ] "Continue" button resumes from last step
- [ ] "Start Fresh" button clears session and closes modal
- [ ] No saved progress → no modal on landing page

### Instructions Page
- [ ] All 5 instruction cards display correctly
- [ ] Card icons render (🏠 🍳 🛋️ 🛏️ 🚿)
- [ ] Card titles and tips are readable
- [ ] Example photo placeholders display
- [ ] Time estimate displays: "⏱️ Takes about 10 minutes"
- [ ] "Start Capturing" button displays
- [ ] "Start Capturing" shows Phase 3 alert
- [ ] Back button navigates to address.html
- [ ] No saved address → redirects to address.html

### Navigation Flow
- [ ] Landing → Address page works
- [ ] Address → Instructions page works
- [ ] Instructions → Back to Address works
- [ ] Current step saves to localStorage at each page
- [ ] Page refresh maintains state

## Cross-Browser Testing

### Desktop Browsers
- [ ] Chrome (Windows/Mac)
- [ ] Firefox (Windows/Mac)
- [ ] Safari (Mac)
- [ ] Edge (Windows)

### Mobile Browsers
- [ ] Safari (iPhone)
- [ ] Chrome (Android)
- [ ] Samsung Internet (Android)

### Browser-Specific Features
- [ ] Geolocation API works in all browsers
- [ ] localStorage works in all browsers
- [ ] Google Places API loads correctly
- [ ] Modal animations smooth
- [ ] No console errors

## Responsive Design Testing

### Mobile (375px - iPhone SE)
- [ ] All text readable without zooming
- [ ] Touch targets minimum 56px (buttons, inputs)
- [ ] Instruction cards stack vertically
- [ ] Modals fit screen without scrolling
- [ ] No horizontal overflow

### Tablet (768px - iPad)
- [ ] Instruction cards display in 2-column grid
- [ ] 5th card spans half-width
- [ ] Forms constrained to readable width
- [ ] Touch targets appropriate size

### Desktop (1024px+)
- [ ] Page content max-width 600px, centered
- [ ] Instruction grid maintains 2 columns
- [ ] All interactive elements have hover states
- [ ] Keyboard navigation works

## Error Handling & Edge Cases

### No Internet Connection
- [ ] Offline mode → warning appears
- [ ] Manual entry still functional
- [ ] Validation works without API
- [ ] Graceful degradation

### Google API Failures
- [ ] API key missing → fallback message displays
- [ ] API returns error → manual entry enabled
- [ ] Free-form text parsing works as fallback
- [ ] Warning banner shows: "Address suggestions unavailable"

### Geolocation Errors
- [ ] Permission denied → friendly message
- [ ] Timeout → "Location request timed out" message
- [ ] Manual entry focused after error
- [ ] User can proceed without geolocation

### Invalid Input Handling
- [ ] "123" (incomplete) → blocks continue
- [ ] "Main Street" (no number) → shows error
- [ ] "123 Main St" (no city) → shows specific errors
- [ ] Empty form → cannot proceed

### localStorage Issues
- [ ] localStorage disabled → app doesn't crash
- [ ] Storage quota exceeded → shows alert
- [ ] Corrupted data → clears automatically
- [ ] App continues to function

### Resume Data Corruption
- [ ] Manually corrupt localStorage in DevTools
- [ ] Reload page → app handles gracefully
- [ ] Bad data cleared automatically
- [ ] No JavaScript errors

## Performance Testing

### Load Times
- [ ] Address page loads < 2 seconds
- [ ] Instructions page loads < 2 seconds
- [ ] Google API script loads without blocking

### Animations
- [ ] Modal fade-in smooth (300ms)
- [ ] Modal scale animation smooth
- [ ] Hover effects no jank
- [ ] Page transitions instant

### API Response Times
- [ ] Geolocation response < 10 seconds (or timeout)
- [ ] Geocoding API response < 3 seconds
- [ ] Autocomplete suggestions appear instantly (debounced 300ms)

### Slow Connection Testing
- [ ] Throttle to Slow 3G in DevTools
- [ ] Loading states display
- [ ] User can proceed if APIs timeout
- [ ] No hanging/frozen UI

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Modal traps focus correctly
- [ ] Escape key closes modals
- [ ] Enter key submits forms

### Screen Reader
- [ ] Form labels properly associated
- [ ] Error messages announced (aria-live)
- [ ] Modal dialog role announced
- [ ] Decorative emojis hidden (aria-hidden)

### Visual
- [ ] Text contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] Touch targets 56px minimum
- [ ] Form errors visually distinct

## Polish & UX

### Visual Polish
- [ ] All transitions smooth
- [ ] Loading states clear
- [ ] Success states visible (checkmarks)
- [ ] Error states obvious (red borders, icons)

### User Feedback
- [ ] Button clicks feel responsive
- [ ] Loading spinners when waiting
- [ ] Success messages auto-hide (3 seconds)
- [ ] Error messages stay until resolved

### Copy & Messaging
- [ ] All instructions clear
- [ ] Error messages actionable
- [ ] Success messages encouraging
- [ ] No technical jargon

## Security & Privacy

### Data Privacy
- [ ] Privacy note displays: "🔒 Your data stays private"
- [ ] Location permission explained
- [ ] Data only stored locally
- [ ] No data transmitted to third parties (except Google APIs)

### API Security
- [ ] Google API key restricted (HTTP referrers)
- [ ] API key not in git history
- [ ] API key in .gitignore

## Final Checks

### Code Quality
- [ ] No console errors
- [ ] No console warnings (relevant ones)
- [ ] JavaScript functions documented
- [ ] CSS organized and commented

### Git Repository
- [ ] All changes committed
- [ ] Commit messages descriptive
- [ ] No sensitive data in commits
- [ ] Working tree clean

### Documentation
- [ ] README updated with Phase 2 status
- [ ] Learning notes documented
- [ ] Testing checklist complete
- [ ] Git tag created: `v0.2.0-phase2`

---

## Notes

**Testing Date:** _____________

**Tester:** _____________

**Issues Found:**
-
-
-

**Browser/Device Matrix:**

| Feature | Chrome | Firefox | Safari | Mobile |
|---------|--------|---------|--------|--------|
| Geolocation | ⬜ | ⬜ | ⬜ | ⬜ |
| Autocomplete | ⬜ | ⬜ | ⬜ | ⬜ |
| localStorage | ⬜ | ⬜ | ⬜ | ⬜ |
| Modals | ⬜ | ⬜ | ⬜ | ⬜ |
| Validation | ⬜ | ⬜ | ⬜ | ⬜ |

**Sign-off:** ✅ Phase 2 ready for Phase 3 development
