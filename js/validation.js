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
 * Enable continue button
 */
function enableContinueButton() {
  const button = document.getElementById('continue-button')
  button.disabled = false
  button.classList.remove('button-disabled')
  button.classList.add('button-primary')
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
