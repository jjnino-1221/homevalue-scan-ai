/**
 * Recommendation Engine
 * Generates property improvement recommendations based on property data
 */

const RecommendationEngine = (function() {
  // Constants
  const ROI_MULTIPLIERS = {
    'CA': { kitchen: 0.85, bathroom: 0.80, hvac: 0.65, roof: 0.60, exterior: 0.75, energy: 0.60 },
    'NY': { kitchen: 0.82, bathroom: 0.78, hvac: 0.68, roof: 0.58, exterior: 0.70, energy: 0.62 },
    'TX': { kitchen: 0.75, bathroom: 0.72, hvac: 0.70, roof: 0.55, exterior: 0.68, energy: 0.58 },
    'MI': { kitchen: 0.78, bathroom: 0.75, hvac: 0.67, roof: 0.57, exterior: 0.70, energy: 0.60 },
    'FL': { kitchen: 0.77, bathroom: 0.73, hvac: 0.72, roof: 0.56, exterior: 0.72, energy: 0.59 },
    'WA': { kitchen: 0.83, bathroom: 0.79, hvac: 0.66, roof: 0.59, exterior: 0.74, energy: 0.61 },
    'DEFAULT': { kitchen: 0.75, bathroom: 0.72, hvac: 0.65, roof: 0.55, exterior: 0.70, energy: 0.58 }
  };

  /**
   * Calculate priority score (0-100)
   * Score = (Age Factor × 0.4) + (Condition Factor × 0.3) + (ROI Factor × 0.2) + (Market Factor × 0.1)
   */
  function calculatePriorityScore(ageFactor, conditionFactor, roiFactor, marketFactor) {
    return Math.round(
      (ageFactor * 0.4) +
      (conditionFactor * 0.3) +
      (roiFactor * 0.2) +
      (marketFactor * 0.1)
    );
  }

  /**
   * Get priority category from score
   */
  function getPriorityCategory(score) {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    return 'medium';
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

  /**
   * Format currency
   */
  function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  /**
   * Get current year
   */
  function getCurrentYear() {
    return new Date().getFullYear();
  }

  // Public API placeholder
  return {
    generateRecommendations: function() {},
    formatCurrency: function() {}
  };
})();
