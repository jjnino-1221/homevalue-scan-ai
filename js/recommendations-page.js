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

  /**
   * Display all recommendations
   */
  function displayRecommendations(recommendations) {
    // Update summary card
    displaySummary(recommendations);

    // Display recommendation cards
    const grid = document.getElementById('recommendations-grid');
    grid.innerHTML = '';

    if (recommendations.length === 0) {
      grid.innerHTML = '<p class="no-recommendations">No recommendations available at this time.</p>';
      return;
    }

    recommendations.forEach(rec => {
      const card = createRecommendationCard(rec);
      grid.appendChild(card);
    });
  }

  /**
   * Display summary card
   */
  function displaySummary(recommendations) {
    // Count
    const count = recommendations.length;
    const countText = count === 1 ? '1 recommendation' : `${count} recommendations`;
    document.getElementById('recommendation-count').textContent = countText;

    // Calculate total value increase range
    let totalLow = 0;
    let totalHigh = 0;
    recommendations.forEach(rec => {
      totalLow += rec.valueIncrease.low;
      totalHigh += rec.valueIncrease.high;
    });

    const valueRange = `${RecommendationEngine.formatCurrency(totalLow)} - ${RecommendationEngine.formatCurrency(totalHigh)}`;
    document.getElementById('value-range').textContent = valueRange;
  }

  /**
   * Create recommendation card element
   */
  function createRecommendationCard(rec) {
    const card = document.createElement('div');
    card.className = 'recommendation-card';
    card.dataset.priority = rec.priority;

    // Format values
    const costRange = `${RecommendationEngine.formatCurrency(rec.costRange.low)} - ${RecommendationEngine.formatCurrency(rec.costRange.high)}`;
    const valueRange = `${RecommendationEngine.formatCurrency(rec.valueIncrease.low)} - ${RecommendationEngine.formatCurrency(rec.valueIncrease.high)}`;
    const roiRange = `${rec.roi.low}-${rec.roi.high}%`;

    // Get priority label
    const priorityLabel = getPriorityLabel(rec.priority);

    card.innerHTML = `
      <div class="recommendation-header">
        <span class="priority-badge ${rec.priority}">${priorityLabel}</span>
        <span class="recommendation-icon">${rec.icon}</span>
      </div>

      <h3 class="recommendation-title">${rec.title}</h3>

      <p class="recommendation-description">${rec.description}</p>

      <div class="recommendation-stats">
        <div class="stat-item">
          <span class="stat-icon">💵</span>
          <div class="stat-content">
            <div class="stat-label">Est. Cost</div>
            <div class="stat-value">${costRange}</div>
          </div>
        </div>

        <div class="stat-item">
          <span class="stat-icon">📈</span>
          <div class="stat-content">
            <div class="stat-label">Value Increase</div>
            <div class="stat-value">${valueRange}</div>
          </div>
        </div>

        <div class="stat-item">
          <span class="stat-icon">🎯</span>
          <div class="stat-content">
            <div class="stat-label">Typical ROI</div>
            <div class="stat-value">${roiRange}</div>
          </div>
        </div>
      </div>

      <div class="recommendation-insight">
        <span class="insight-icon">💡</span>
        <p>${rec.insight}</p>
      </div>
    `;

    return card;
  }

  /**
   * Get priority label
   */
  function getPriorityLabel(priority) {
    const labels = {
      'critical': '⚠️ Critical',
      'high': '🔥 High Priority',
      'medium': '⭐ Recommended'
    };
    return labels[priority] || labels.medium;
  }

  // Initialize when DOM ready
  document.addEventListener('DOMContentLoaded', init);
})();
