/**
 * Recommendations Page
 * Display property improvement recommendations with loading animation
 */

(function() {
  let recommendationsData = [];

  /**
   * Initialize recommendations page
   */
  async function init() {
    console.log('Recommendations page loaded');

    // Load data from storage
    const propertyData = loadFromStorage('propertyData');
    const photos = PhotoStorage.getAllPhotos();
    const address = loadFromStorage('propertyAddress');

    // Validate data
    if (!propertyData) {
      console.error('No property data found');
      alert('Please complete property verification to see recommendations.');
      navigateTo('property-verification.html');
      return;
    }

    // Show loading animation
    await animateLoading();

    // Generate recommendations
    const valuation = ValuationEngine.calculateValuation(photos, address);
    recommendationsData = RecommendationEngine.generateRecommendations(
      propertyData,
      photos,
      valuation,
      address
    );
    console.log('Recommendations:', recommendationsData);

    // Display recommendations
    displayRecommendations(recommendationsData);

    // Setup event handlers
    setupEventHandlers();

    console.log('✓ Recommendations page initialized');
  }

  /**
   * Delay helper
   */
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Animate loading steps
   */
  async function animateLoading() {
    const steps = document.querySelectorAll('.loading-step');
    const delays = [700, 800, 900, 700, 600]; // Milliseconds per step

    for (let i = 0; i < steps.length; i++) {
      await delay(delays[i]);

      // Mark step as complete
      const step = steps[i];
      const icon = step.querySelector('.loading-icon');
      icon.textContent = '✓';
      step.classList.add('complete');
    }

    // Wait a moment before showing recommendations
    await delay(500);

    // Hide loading, show recommendations
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('recommendations-content').style.display = 'block';

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Initialize when DOM ready
  document.addEventListener('DOMContentLoaded', init);
})();
