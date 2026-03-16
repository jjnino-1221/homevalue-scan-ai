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
