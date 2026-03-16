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

/**
 * Find component by type in Google address components
 */
function findComponent(components, type, shortName = false) {
  const component = components.find(c => c.types.includes(type))
  return component ? (shortName ? component.short_name : component.long_name) : ''
}
