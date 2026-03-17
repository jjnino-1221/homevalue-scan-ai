/**
 * Geolocation & Geocoding Logic
 */

// Check if API key is configured
function getAPIKey() {
  // Try to get from window.GOOGLE_API_KEY (set in address.html)
  if (window.GOOGLE_API_KEY && window.GOOGLE_API_KEY !== 'YOUR_API_KEY') {
    return window.GOOGLE_API_KEY;
  }
  return null; // No valid key
}

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

    // Check if API key is available
    const apiKey = getAPIKey();
    if (!apiKey) {
      throw new Error('Google API key not configured. Please enter address manually.')
    }

    const address = await reverseGeocode(latitude, longitude, apiKey)

    if (address) {
      fillAddressForm(address)
      saveToStorage('propertyAddress', address)
      showSuccess('✓ Address found!')
      enableContinueButton()
    } else {
      throw new Error('Could not find address for your location')
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
      reject(new Error('Geolocation not supported by your browser'))
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
async function reverseGeocode(lat, lng, apiKey) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.status === 'REQUEST_DENIED') {
      throw new Error('Google API access denied. Please check API key configuration.')
    }

    if (data.status !== 'OK' || !data.results[0]) {
      throw new Error('No address found for your location')
    }

    return parseGoogleAddress(data.results[0])
  } catch (error) {
    console.error('Geocoding API failed:', error)
    throw error; // Propagate error instead of returning null
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
    message = 'Location access denied. No problem! Just type your address below.'
  } else if (error.code === 3) { // TIMEOUT
    message = 'Location request timed out. Please try again or enter manually.'
  } else if (error.message) {
    // Use custom error message if provided
    message = error.message + ' Please enter address below.'
  }

  showErrorMessage(message)
  focusAddressInput()

  // Ensure input is enabled and not blocked
  const input = document.getElementById('address-input')
  input.disabled = false
  input.readOnly = false
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
  // Small delay to ensure error message is visible first
  setTimeout(() => {
    input.focus()
    input.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, 300)
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
  const errorContainer = document.getElementById('address-errors')
  errorContainer.innerHTML = `<p class="form-success">${message}</p>`
  errorContainer.style.display = 'block'

  // Auto-hide after 3 seconds
  setTimeout(() => {
    errorContainer.style.display = 'none'
  }, 3000)

  console.log('Success:', message)
}

/**
 * Show error message
 */
function showErrorMessage(message) {
  const errorContainer = document.getElementById('address-errors')
  errorContainer.innerHTML = `<p class="form-error">${message}</p>`
  errorContainer.style.display = 'block'

  // Ensure error message doesn't block input
  errorContainer.style.position = 'relative'
  errorContainer.style.zIndex = '1'
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
