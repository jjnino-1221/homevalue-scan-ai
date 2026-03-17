/**
 * Results Page
 * Display valuation results with loading animation
 */

(function() {
  let valuationData = null;

  /**
   * Initialize results page
   */
  async function init() {
    console.log('Results page loaded');

    // Load data from storage
    const photos = PhotoStorage.getAllPhotos();
    const address = loadFromStorage('propertyAddress');

    // Validate data
    if (!photos || photos.length === 0) {
      console.error('No photos found');
      alert('No property data found. Please capture photos first.');
      navigateTo('index.html');
      return;
    }

    // Show loading animation
    await animateLoading();

    // Calculate valuation
    valuationData = ValuationEngine.calculateValuation(photos, address);
    console.log('Valuation:', valuationData);

    // Display results
    displayResults(valuationData, photos, address);

    // Setup event handlers
    setupEventHandlers();

    console.log('✓ Results page initialized');
  }

  /**
   * Animate loading steps
   */
  async function animateLoading() {
    const steps = document.querySelectorAll('.loading-step');
    const delays = [500, 800, 700, 600]; // Milliseconds per step

    for (let i = 0; i < steps.length; i++) {
      await delay(delays[i]);

      // Mark step as complete
      const step = steps[i];
      const icon = step.querySelector('.loading-icon');
      icon.textContent = '✓';
      step.classList.add('complete');
    }

    // Wait a moment before showing results
    await delay(500);

    // Hide loading, show results
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('results-content').style.display = 'block';

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Display valuation results
   */
  function displayResults(valuation, photos, address) {
    // Value card
    document.getElementById('value-low').textContent =
      ValuationEngine.formatCurrency(valuation.rangeLow);
    document.getElementById('value-high').textContent =
      ValuationEngine.formatCurrency(valuation.rangeHigh);
    document.getElementById('value-estimate').textContent =
      ValuationEngine.formatCurrency(valuation.estimate);
    document.getElementById('confidence-level').textContent =
      valuation.confidence + '%';

    // Property details
    document.getElementById('property-address').textContent =
      address?.fullAddress || 'Unknown Address';
    document.getElementById('total-sqft').textContent =
      ValuationEngine.formatNumber(valuation.totalSqFt) + ' sq ft';

    // Room dimensions
    displayRoomDimensions(photos);

    // Comparable properties
    displayComparables(valuation.estimate, address);
  }

  /**
   * Display room dimensions
   */
  function displayRoomDimensions(photos) {
    const container = document.getElementById('room-dimensions');
    container.innerHTML = '';

    photos.forEach(photo => {
      const config = PhotoStorage.getRoomConfig(photo.room);
      if (!config) return;

      const dim = photo.dimensions;
      const sqft = dim.squareFootage || (dim.width * dim.depth);

      const card = document.createElement('div');
      card.className = 'room-card';
      card.innerHTML = `
        <span class="room-icon">${config.icon}</span>
        <div class="room-info">
          <div class="room-name">${config.name}</div>
          <div class="room-dimensions">
            ${dim.width}' × ${dim.depth}' × ${dim.height}'
            <span class="room-sqft">(${Math.round(sqft)} sq ft)</span>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  }

  /**
   * Display comparable properties
   */
  function displayComparables(baseValue, address) {
    const comparables = ValuationEngine.generateComparables(baseValue, address);
    const container = document.getElementById('comparables');
    container.innerHTML = '';

    comparables.forEach((comp, index) => {
      const card = document.createElement('div');
      card.className = 'comparable-card';
      card.innerHTML = `
        <div class="comparable-number">${index + 1}</div>
        <div class="comparable-info">
          <div class="comparable-address">${comp.address}</div>
          <div class="comparable-details">
            <span class="comparable-value">${ValuationEngine.formatCurrency(comp.value)}</span>
            <span class="comparable-separator">•</span>
            <span class="comparable-sold">Sold ${comp.soldDate}</span>
            <span class="comparable-separator">•</span>
            <span class="comparable-distance">${comp.distance} mi away</span>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  }

  /**
   * Setup event handlers
   */
  function setupEventHandlers() {
    // Get Full Report button
    document.getElementById('get-report').addEventListener('click', handleGetReport);

    // Start New Valuation button
    document.getElementById('start-new').addEventListener('click', handleStartNew);
  }

  /**
   * Handle Get Full Report
   */
  function handleGetReport() {
    // In production, this would:
    // - Show email capture modal
    // - Generate PDF report
    // - Email report to user

    alert(
      '📄 Full Report\n\n' +
      'In production, this would:\n' +
      '• Capture your email address\n' +
      '• Generate a detailed PDF report\n' +
      '• Email the report to you\n' +
      '• Save for future reference\n\n' +
      'For this demo, please screenshot the results!'
    );
  }

  /**
   * Handle Start New Valuation
   */
  function handleStartNew() {
    const confirmed = confirm(
      'Start a new valuation?\n\n' +
      'This will clear your current property data and photos.'
    );

    if (confirmed) {
      // Clear all session data
      PhotoStorage.clearAll();
      localStorage.removeItem('propertyAddress');
      localStorage.removeItem('currentStep');
      localStorage.removeItem('sessionStarted');

      console.log('✓ Session cleared');

      // Navigate to home
      navigateTo('index.html');
    }
  }

  /**
   * Delay helper
   */
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Initialize when DOM ready
  document.addEventListener('DOMContentLoaded', init);
})();
