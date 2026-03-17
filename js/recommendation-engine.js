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

  /**
   * Analyze HVAC system
   */
  function analyzeHVAC(propertyData, sqft, state) {
    const hvacAge = parseInt(propertyData.hvacAge) || 0;

    // Skip if HVAC is less than 12 years old
    if (hvacAge < 12) return null;

    // Age factor (0-100)
    let ageFactor = 0;
    if (hvacAge >= 20) ageFactor = 100;
    else if (hvacAge >= 15) ageFactor = 75;
    else ageFactor = 50;

    // Condition factor (assume fair if age-based)
    const conditionFactor = Math.min(hvacAge * 4, 100);

    // ROI factor
    const roiFactor = 65; // HVAC typically 60-70% ROI

    // Market factor (HVAC is important in hot/cold climates)
    const marketFactors = {
      'TX': 95, 'FL': 95, 'CA': 70, 'MI': 80, 'DEFAULT': 75
    };
    const marketFactor = marketFactors[state] || marketFactors.DEFAULT;

    // Calculate priority score
    const priorityScore = calculatePriorityScore(ageFactor, conditionFactor, roiFactor, marketFactor);
    const priority = getPriorityCategory(priorityScore);

    // Calculate cost (base + size adjustment)
    const baseCost = 5000;
    const costPerSqft = 2; // $2 per sqft
    const totalCost = baseCost + (sqft * costPerSqft);
    const costLow = Math.round(totalCost * 0.9);
    const costHigh = Math.round(totalCost * 1.3);

    // Calculate value increase (cost × ROI multiplier)
    const roiMultiplier = (ROI_MULTIPLIERS[state] || ROI_MULTIPLIERS.DEFAULT).hvac;
    const valueLow = Math.round(costLow * roiMultiplier * 0.9);
    const valueHigh = Math.round(costHigh * roiMultiplier * 1.1);

    // ROI percentage
    const roiLow = Math.round((valueLow / costHigh) * 100);
    const roiHigh = Math.round((valueHigh / costLow) * 100);

    return {
      id: 'hvac-replacement',
      title: 'Replace HVAC System',
      description: `Your ${hvacAge}-year-old ${propertyData.hvacType || 'HVAC'} system is ${hvacAge >= 20 ? 'past its typical lifespan' : 'aging'}. Replacing it with an energy-efficient system will improve comfort and reduce utility costs.`,
      priority: priority,
      priorityScore: priorityScore,
      icon: '❄️',
      costRange: { low: costLow, high: costHigh },
      valueIncrease: { low: valueLow, high: valueHigh },
      roi: { low: roiLow, high: roiHigh },
      insight: 'Energy-efficient HVAC can reduce utility costs by $800-1,200/year',
      confidence: hvacAge > 0 ? 92 : 70
    };
  }

  /**
   * Analyze roof condition
   */
  function analyzeRoof(propertyData, sqft, state) {
    const roofAge = parseInt(propertyData.roofAge) || 0;

    // Skip if roof is less than 18 years old
    if (roofAge < 18) return null;

    // Age factor (0-100)
    let ageFactor = 0;
    if (roofAge >= 25) ageFactor = 100;
    else if (roofAge >= 20) ageFactor = 75;
    else ageFactor = 50;

    // Condition factor
    const conditionFactor = Math.min(roofAge * 3.5, 100);

    // ROI factor
    const roiFactor = 55; // Roof typically 50-60% ROI

    // Market factor
    const marketFactor = 75; // Important everywhere

    // Calculate priority score
    const priorityScore = calculatePriorityScore(ageFactor, conditionFactor, roiFactor, marketFactor);
    const priority = getPriorityCategory(priorityScore);

    // Calculate cost
    const baseCost = 8000;
    const costPerSqft = 1.5;
    const totalCost = baseCost + (sqft * costPerSqft);
    const costLow = Math.round(totalCost * 0.9);
    const costHigh = Math.round(totalCost * 1.2);

    // Calculate value increase
    const roiMultiplier = (ROI_MULTIPLIERS[state] || ROI_MULTIPLIERS.DEFAULT).roof;
    const valueLow = Math.round(costLow * roiMultiplier * 0.9);
    const valueHigh = Math.round(costHigh * roiMultiplier * 1.1);

    // ROI percentage
    const roiLow = Math.round((valueLow / costHigh) * 100);
    const roiHigh = Math.round((valueHigh / costLow) * 100);

    return {
      id: 'roof-replacement',
      title: 'Roof Replacement',
      description: `Your ${roofAge}-year-old ${propertyData.roofType || 'roof'} is ${roofAge >= 25 ? 'well past its typical lifespan' : 'nearing the end of its lifespan'}. A new roof protects your investment and is a top concern for buyers.`,
      priority: priority,
      priorityScore: priorityScore,
      icon: '🏠',
      costRange: { low: costLow, high: costHigh },
      valueIncrease: { low: valueLow, high: valueHigh },
      roi: { low: roiLow, high: roiHigh },
      insight: 'New roof protects your investment and is a top concern for buyers',
      confidence: roofAge > 0 ? 90 : 65
    };
  }

  /**
   * Analyze kitchen condition
   */
  function analyzeKitchen(propertyData, sqft, state, city) {
    const kitchenYear = parseInt(propertyData.kitchenYear) || 0;
    const kitchenCondition = propertyData.kitchenCondition || '';
    const currentYear = getCurrentYear();
    const kitchenAge = kitchenYear > 0 ? currentYear - kitchenYear : 0;

    // Skip if kitchen is recent (< 10 years) and good condition
    if (kitchenAge < 10 && kitchenCondition !== 'Poor' && kitchenCondition !== 'Fair') {
      return null;
    }

    // Age factor
    let ageFactor = 0;
    if (kitchenAge >= 25 || kitchenYear < 2000) ageFactor = 90;
    else if (kitchenAge >= 15 || kitchenYear < 2010) ageFactor = 60;
    else ageFactor = 30;

    // Condition factor
    let conditionFactor = 50;
    if (kitchenCondition === 'Poor') conditionFactor = 100;
    else if (kitchenCondition === 'Fair') conditionFactor = 60;
    else if (kitchenCondition === 'Good') conditionFactor = 30;
    else conditionFactor = Math.min(kitchenAge * 3, 100);

    // ROI factor
    const roiFactor = 85; // Kitchen typically 75-85% ROI

    // Market factor
    const marketFactors = {
      'CA': 90, 'NY': 85, 'MI': 80, 'TX': 80, 'DEFAULT': 85
    };
    const marketFactor = marketFactors[state] || marketFactors.DEFAULT;

    // Calculate priority score
    const priorityScore = calculatePriorityScore(ageFactor, conditionFactor, roiFactor, marketFactor);
    const priority = getPriorityCategory(priorityScore);

    // Determine scope (major vs minor remodel)
    const isMajorRemodel = kitchenCondition === 'Poor' || kitchenYear < 2000;
    const isMinorUpdate = !isMajorRemodel;

    // Calculate cost
    let costLow, costHigh;
    if (isMajorRemodel) {
      costLow = 25000;
      costHigh = 40000;
    } else {
      costLow = 15000;
      costHigh = 25000;
    }

    // Calculate value increase
    const roiMultiplier = (ROI_MULTIPLIERS[state] || ROI_MULTIPLIERS.DEFAULT).kitchen;
    const valueLow = Math.round(costLow * roiMultiplier * 0.95);
    const valueHigh = Math.round(costHigh * roiMultiplier * 1.05);

    // ROI percentage
    const roiLow = Math.round((valueLow / costHigh) * 100);
    const roiHigh = Math.round((valueHigh / costLow) * 100);

    return {
      id: 'kitchen-remodel',
      title: isMajorRemodel ? 'Kitchen Remodel' : 'Kitchen Update',
      description: isMajorRemodel
        ? `Your kitchen hasn't been updated since ${kitchenYear || 'the original build'} and shows its age. A modern kitchen remodel will significantly improve your home's appeal and value.`
        : `Your kitchen could benefit from updates. Modernizing fixtures, countertops, and appliances will improve functionality and appeal to buyers.`,
      priority: priority,
      priorityScore: priorityScore,
      icon: '🍳',
      costRange: { low: costLow, high: costHigh },
      valueIncrease: { low: valueLow, high: valueHigh },
      roi: { low: roiLow, high: roiHigh },
      insight: `Homes in ${city || 'your area'} with updated kitchens sell 15% faster`,
      confidence: kitchenYear > 0 ? 88 : 75
    };
  }

  // Public API placeholder
  return {
    generateRecommendations: function() {},
    formatCurrency: function() {}
  };
})();
