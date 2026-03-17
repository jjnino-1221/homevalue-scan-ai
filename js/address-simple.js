/**
 * Simplified Address Entry (Demo Mode)
 * Mock geolocation for demo purposes
 */

(function() {
  // Mock property data for demo
  const MOCK_ADDRESS = {
    street: '662 Woodward Ave',
    city: 'Detroit',
    state: 'MI',
    zip: '48226',
    fullAddress: '662 Woodward Ave, Detroit, MI 48226',
    source: 'geolocation_demo'
  };

  /**
   * Initialize address page
   */
  function init() {
    console.log('Address page loaded (demo mode)');

    // Set current step
    saveCurrentStep('address');

    // Setup event handlers
    setupEventHandlers();

    // Check for saved address
    const savedAddress = loadFromStorage('propertyAddress');
    if (savedAddress) {
      showAddress(savedAddress);
      enableContinueButton();
    }

    console.log('✓ Address page initialized');
  }

  /**
   * Setup event handlers
   */
  function setupEventHandlers() {
    // Location button
    document.getElementById('location-button').addEventListener('click', handleLocationClick);

    // Continue button
    document.getElementById('continue-button').addEventListener('click', handleContinue);
  }

  /**
   * Handle location button click
   */
  async function handleLocationClick() {
    const button = document.getElementById('location-button');

    // Show loading state
    button.disabled = true;
    button.textContent = '📍 Getting your location...';

    // Simulate brief loading (for realism)
    await delay(800);

    // "Find" the mock address
    showAddress(MOCK_ADDRESS);

    // Save to storage
    saveToStorage('propertyAddress', MOCK_ADDRESS);

    // Enable continue button
    enableContinueButton();

    // Hide location button
    button.style.display = 'none';

    console.log('✓ Mock address loaded:', MOCK_ADDRESS.fullAddress);
  }

  /**
   * Show address in UI
   */
  function showAddress(address) {
    const displayDiv = document.getElementById('address-display');
    const addressText = document.getElementById('address-text');

    addressText.textContent = address.fullAddress;
    displayDiv.style.display = 'block';

    // Fade in animation
    setTimeout(() => {
      displayDiv.style.opacity = '1';
    }, 10);
  }

  /**
   * Enable continue button
   */
  function enableContinueButton() {
    const button = document.getElementById('continue-button');
    button.disabled = false;
    button.classList.remove('button-secondary');
    button.classList.add('button-primary');
    button.style.display = 'block';
  }

  /**
   * Handle continue button click
   */
  function handleContinue() {
    const address = loadFromStorage('propertyAddress');

    if (!address) {
      alert('Please use your location first');
      return;
    }

    console.log('Continuing with address:', address.fullAddress);

    // Navigate to property verification
    navigateTo('property-verification.html');
  }

  /**
   * Delay helper
   */
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Initialize when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
