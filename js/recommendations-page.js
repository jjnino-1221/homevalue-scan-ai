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

  // Initialize when DOM ready
  document.addEventListener('DOMContentLoaded', init);
})();
