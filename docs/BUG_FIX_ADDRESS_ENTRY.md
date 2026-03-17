# Bug Fix: Address Entry Input Blocking

## Issue Report

**Problem:** After clicking "Use My Location" and granting permission, the geolocation feature would error out and ask users to enter their address manually. However, when users attempted to type in the address field, the input was blocked and they couldn't proceed.

## Root Causes

### 1. Missing Google API Key
- Both `address.html` (line 12) and `js/geolocation.js` (line 5) contained placeholder `'YOUR_API_KEY'` strings
- When geolocation succeeded and obtained coordinates, the reverse geocoding API call failed due to invalid API key
- Google Geocoding API returned an error, causing the flow to fail

### 2. Input Field Blocking
- When Google Places Autocomplete partially initialized with an invalid API key, it attached event listeners to the input field
- These listeners could interfere with normal text input behavior
- Error messages were displayed, but the input field remained in a blocked state

### 3. Insufficient Error Recovery
- Error handling didn't ensure the input field was fully reset and usable
- No explicit check for API key configuration before making API calls
- Input field didn't get proper focus after errors

## Fixes Applied

### 1. API Key Configuration Check (`js/geolocation.js`)
```javascript
// Check if API key is configured
function getAPIKey() {
  if (window.GOOGLE_API_KEY && window.GOOGLE_API_KEY !== 'YOUR_API_KEY') {
    return window.GOOGLE_API_KEY;
  }
  return null; // No valid key
}
```
- Now checks if API key is valid before making reverse geocoding calls
- Provides clear error message: "Google API key not configured. Please enter address manually."

### 2. Enhanced Input Field Recovery (`js/autocomplete.js`)
```javascript
function setupManualEntry() {
  const input = document.getElementById('address-input')

  // Remove any existing listeners by cloning the element
  const newInput = input.cloneNode(true)
  input.parentNode.replaceChild(newInput, input)

  const freshInput = document.getElementById('address-input')

  // Ensure input is fully enabled
  freshInput.disabled = false
  freshInput.readOnly = false
  freshInput.style.pointerEvents = 'auto'

  // Attach fresh event listeners
  // ...
}
```
- Clones input element to remove all attached event listeners
- Explicitly enables input field and pointer events
- Sets up fresh event listeners for manual entry

### 3. Improved Error Handling (`js/geolocation.js`)
```javascript
function handleGeolocationError(error) {
  let message = 'Unable to get your location. Please enter address manually.'

  // ... custom error messages

  showErrorMessage(message)
  focusAddressInput()

  // Ensure input is enabled and not blocked
  const input = document.getElementById('address-input')
  input.disabled = false
  input.readOnly = false
}

function focusAddressInput() {
  const input = document.getElementById('address-input')
  setTimeout(() => {
    input.focus()
    input.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, 300)
}
```
- Explicitly enables input field after errors
- Scrolls input into view and focuses it
- Uses small delay to ensure error message is visible first

### 4. Global API Key Access (`address.html`)
```html
<script>
  // Set API key globally for use by geolocation.js
  window.GOOGLE_API_KEY = 'YOUR_API_KEY'; // Replace with actual key
</script>
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places" async defer></script>
```
- API key now accessible across all JavaScript files
- Single source of truth for API key configuration

### 5. Better Fallback Messaging
- Warning banner now has inline styles to ensure visibility
- Checks for duplicate warnings before inserting
- Clear instructions: "Please type your complete address: street, city, state, ZIP"

## How to Configure API Key

### Step 1: Get a Google API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - Places API
   - Geocoding API
   - Maps JavaScript API
4. Create credentials → API Key
5. Restrict the API key:
   - Application restrictions: HTTP referrers
   - API restrictions: Places API, Geocoding API, Maps JavaScript API

### Step 2: Update the Application
1. Open `address.html`
2. Find line 13: `window.GOOGLE_API_KEY = 'YOUR_API_KEY';`
3. Replace `YOUR_API_KEY` with your actual API key
4. Find line 15: `<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"`
5. Replace `YOUR_API_KEY` with your actual API key
6. Save the file

### Example:
```html
<script>
  window.GOOGLE_API_KEY = 'AIzaSyB1234567890abcdefghijklmnopqrstuv';
</script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB1234567890abcdefghijklmnopqrstuv&libraries=places" async defer></script>
```

## Testing the Fix

### Test Case 1: Geolocation with Valid API Key
1. Open `address.html` in browser
2. Click "Use My Location"
3. Click "Allow" in modal
4. Grant browser location permission
5. **Expected:** Address field auto-fills with your location
6. **Expected:** Continue button becomes enabled

### Test Case 2: Geolocation with Invalid API Key
1. Ensure API key is still `'YOUR_API_KEY'`
2. Click "Use My Location"
3. Click "Allow" in modal
4. Grant browser location permission
5. **Expected:** Error message: "Google API key not configured. Please enter address below."
6. **Expected:** Input field is focused and ready for typing
7. **Expected:** User can type address manually
8. **Expected:** Continue button enables when valid address entered

### Test Case 3: Manual Entry with API Failure
1. Ensure Google Maps fails to load (network error or invalid key)
2. **Expected:** Yellow warning banner appears: "Address suggestions unavailable"
3. **Expected:** Input field is fully functional
4. **Expected:** User can type complete address
5. **Expected:** Continue button enables when address >= 10 characters

### Test Case 4: Input Field Always Usable
1. Try various error scenarios (permission denied, timeout, API failure)
2. **Expected:** Input field always accepts typed input
3. **Expected:** No blocking overlays or disabled states
4. **Expected:** Error messages display below input without blocking it

## Verification Checklist

- [x] Error handling added to reverse geocoding
- [x] API key validation before API calls
- [x] Input field explicitly enabled after errors
- [x] Input element cloning to remove stale listeners
- [x] Focus and scroll to input after errors
- [x] Global API key configuration
- [x] Fallback warning banner with inline styles
- [x] Manual entry always functional
- [x] Duplicate warning banner prevention
- [x] Better error messages for users

## Prevention

To avoid similar issues in future:
1. **Always validate external API configuration** before making calls
2. **Implement graceful degradation** - app should work without external APIs
3. **Explicitly manage input state** after errors (enabled, focused, scrolled into view)
4. **Use element cloning** to remove stale event listeners when needed
5. **Test with invalid API keys** to ensure fallback paths work
6. **Provide clear user feedback** about what went wrong and what to do

## Files Changed

- `js/geolocation.js` - Enhanced error handling and API key validation
- `js/autocomplete.js` - Improved manual entry fallback and input recovery
- `address.html` - Added global API key configuration

## Commit

```
commit df6f980
fix: improve address entry error handling and API key configuration

- Add better error messages when Google API key is not configured
- Ensure address input field is always usable even when APIs fail
- Add input field focus and scroll into view after errors
- Clone and replace input element to remove blocking event listeners
- Add inline styles to warning banner for visibility
- Check for duplicate warning banners before inserting
- Improve error propagation in reverse geocoding
- Add window.GOOGLE_API_KEY for cross-file access
```
