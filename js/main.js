/**
 * Main JavaScript
 * Page-specific initialization and event handlers
 */

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

/**
 * Initialize landing page
 */
function initLandingPage() {
  console.log('Landing page loaded');

  // Check for saved progress
  checkForResume()

  // Add click handlers to all "Get Started" / "Start" buttons
  onClick('.hero-cta, .cta-container .button', function() {
    console.log('Get Started clicked');
    navigateTo('address.html');
  });

  // Log when page is ready
  console.log('✓ Navigation handlers attached');
}

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
 * Detect which page we're on and initialize appropriately
 */
function initPage() {
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

  console.log('Current page:', page);

  // Initialize based on current page
  if (page === 'index.html' || page === '') {
    initLandingPage();
  } else if (page === 'address.html') {
    initAddressPage();
  } else if (page === 'instructions.html') {
    initInstructionsPage();
  }
  // Other page initializations will go here
}

/**
 * Run initialization when page loads
 */
document.addEventListener('DOMContentLoaded', initPage);
