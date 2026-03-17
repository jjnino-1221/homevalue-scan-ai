# Phase 6: Value Enhancement Recommendations - Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an AI-styled recommendation engine that generates prioritized property improvement suggestions with cost estimates, value impact, and ROI calculations.

**Architecture:** Three-module design - `recommendation-engine.js` (pure functions for scoring and generation), `recommendations-page.js` (UI controller with loading animation), and `recommendations.html` (page structure). Integrates with existing results page via button navigation.

**Tech Stack:** Vanilla JavaScript (ES6), HTML5, CSS3, localStorage API

---

## File Structure

**New Files:**
- `recommendations.html` - Recommendations page with loading and content states
- `js/recommendation-engine.js` - Recommendation generation logic (~350 lines)
- `js/recommendations-page.js` - Page controller with animations (~280 lines)

**Modified Files:**
- `results.html` - Add navigation button
- `js/results-page.js` - Add button click handler
- `css/components.css` - Add recommendation styles (~200 lines)
- `README.md` - Document Phase 6 completion

---

## Task 1: Create Recommendation Engine Core

**Files:**
- Create: `js/recommendation-engine.js`

### Step 1: Create recommendation-engine.js skeleton

- [ ] **Create file with module structure**

```javascript
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

  // Public API placeholder
  return {
    generateRecommendations: function() {},
    formatCurrency: function() {}
  };
})();
```

- [ ] **Verify file structure**

Open: `js/recommendation-engine.js`
Expected: Module skeleton with ROI_MULTIPLIERS constant

- [ ] **Commit**

```bash
git add js/recommendation-engine.js
git commit -m "feat: create recommendation-engine.js skeleton"
```

### Step 2: Add utility functions

- [ ] **Add scoring and formatting utilities**

Add after ROI_MULTIPLIERS constant:

```javascript
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
```

- [ ] **Commit**

```bash
git add js/recommendation-engine.js
git commit -m "feat: add utility functions for scoring and formatting"
```

### Step 3: Add HVAC recommendation analyzer

- [ ] **Implement analyzeHVAC function**

Add after utility functions:

```javascript
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
```

- [ ] **Commit**

```bash
git add js/recommendation-engine.js
git commit -m "feat: add HVAC recommendation analyzer"
```

### Step 4: Add Roof recommendation analyzer

- [ ] **Implement analyzeRoof function**

Add after analyzeHVAC:

```javascript
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
```

- [ ] **Commit**

```bash
git add js/recommendation-engine.js
git commit -m "feat: add roof recommendation analyzer"
```

### Step 5: Add Kitchen recommendation analyzer

- [ ] **Implement analyzeKitchen function**

Add after analyzeRoof:

```javascript
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
```

- [ ] **Commit**

```bash
git add js/recommendation-engine.js
git commit -m "feat: add kitchen recommendation analyzer"
```

### Step 6: Add Bathroom recommendation analyzer

- [ ] **Implement analyzeBathroom function**

Add after analyzeKitchen:

```javascript
  /**
   * Analyze bathroom condition
   */
  function analyzeBathroom(propertyData, sqft, state, city) {
    const bathroomYear = parseInt(propertyData.bathroomYear) || 0;
    const bathroomCondition = propertyData.bathroomCondition || '';
    const currentYear = getCurrentYear();
    const bathroomAge = bathroomYear > 0 ? currentYear - bathroomYear : 0;

    // Skip if bathroom is recent (< 10 years) and good condition
    if (bathroomAge < 10 && bathroomCondition !== 'Poor' && bathroomCondition !== 'Fair') {
      return null;
    }

    // Age factor
    let ageFactor = 0;
    if (bathroomAge >= 25 || bathroomYear < 2000) ageFactor = 85;
    else if (bathroomAge >= 15 || bathroomYear < 2010) ageFactor = 55;
    else ageFactor = 25;

    // Condition factor
    let conditionFactor = 50;
    if (bathroomCondition === 'Poor') conditionFactor = 100;
    else if (bathroomCondition === 'Fair') conditionFactor = 60;
    else if (bathroomCondition === 'Good') conditionFactor = 30;
    else conditionFactor = Math.min(bathroomAge * 3, 100);

    // ROI factor
    const roiFactor = 75; // Bathroom typically 70-80% ROI

    // Market factor
    const marketFactors = {
      'CA': 85, 'NY': 82, 'MI': 75, 'TX': 75, 'DEFAULT': 78
    };
    const marketFactor = marketFactors[state] || marketFactors.DEFAULT;

    // Calculate priority score
    const priorityScore = calculatePriorityScore(ageFactor, conditionFactor, roiFactor, marketFactor);
    const priority = getPriorityCategory(priorityScore);

    // Determine scope
    const isFullRemodel = bathroomCondition === 'Poor' || bathroomYear < 2000;

    // Calculate cost
    let costLow, costHigh;
    if (isFullRemodel) {
      costLow = 15000;
      costHigh = 25000;
    } else {
      costLow = 8000;
      costHigh = 15000;
    }

    // Calculate value increase
    const roiMultiplier = (ROI_MULTIPLIERS[state] || ROI_MULTIPLIERS.DEFAULT).bathroom;
    const valueLow = Math.round(costLow * roiMultiplier * 0.95);
    const valueHigh = Math.round(costHigh * roiMultiplier * 1.05);

    // ROI percentage
    const roiLow = Math.round((valueLow / costHigh) * 100);
    const roiHigh = Math.round((valueHigh / costLow) * 100);

    return {
      id: 'bathroom-update',
      title: isFullRemodel ? 'Bathroom Remodel' : 'Bathroom Update',
      description: isFullRemodel
        ? `Your bathroom hasn't been updated since ${bathroomYear || 'the original build'} and needs modernization. Updated fixtures and finishes will greatly improve appeal.`
        : `Your bathroom could use refreshing. Updating fixtures, lighting, and finishes will modernize the space and appeal to buyers.`,
      priority: priority,
      priorityScore: priorityScore,
      icon: '🚿',
      costRange: { low: costLow, high: costHigh },
      valueIncrease: { low: valueLow, high: valueHigh },
      roi: { low: roiLow, high: roiHigh },
      insight: `Modern bathroom fixtures are a top priority for buyers in ${city || 'your area'}`,
      confidence: bathroomYear > 0 ? 86 : 72
    };
  }
```

- [ ] **Commit**

```bash
git add js/recommendation-engine.js
git commit -m "feat: add bathroom recommendation analyzer"
```

### Step 7: Add Exterior and Energy analyzers

- [ ] **Implement analyzeExterior and analyzeEnergy functions**

Add after analyzeBathroom:

```javascript
  /**
   * Analyze exterior condition
   */
  function analyzeExterior(propertyData, sqft, state) {
    const yearBuilt = parseInt(propertyData.yearBuilt) || 0;
    const currentYear = getCurrentYear();
    const propertyAge = yearBuilt > 0 ? currentYear - yearBuilt : 0;
    const recentChanges = propertyData.changes || [];

    // Skip if property is < 30 years old or has recent exterior changes
    if (propertyAge < 30) return null;
    if (recentChanges.includes('Exterior painting/siding')) return null;

    // Age factor
    const ageFactor = Math.min(propertyAge * 2, 100);

    // Condition factor (assume fair for older properties)
    const conditionFactor = 50;

    // ROI factor
    const roiFactor = 70; // Exterior typically 65-75% ROI

    // Market factor
    const marketFactor = 80; // Curb appeal important everywhere

    // Calculate priority score
    const priorityScore = calculatePriorityScore(ageFactor, conditionFactor, roiFactor, marketFactor);
    const priority = getPriorityCategory(priorityScore);

    // Calculate cost
    const costLow = 5000;
    const costHigh = 12000;

    // Calculate value increase
    const roiMultiplier = (ROI_MULTIPLIERS[state] || ROI_MULTIPLIERS.DEFAULT).exterior;
    const valueLow = Math.round(costLow * roiMultiplier);
    const valueHigh = Math.round(costHigh * roiMultiplier);

    // ROI percentage
    const roiLow = Math.round((valueLow / costHigh) * 100);
    const roiHigh = Math.round((valueHigh / costLow) * 100);

    return {
      id: 'exterior-improvements',
      title: 'Exterior Improvements',
      description: `Your property's exterior could benefit from updates. Fresh paint, new siding, and improved landscaping will create strong curb appeal and attract more buyers.`,
      priority: priority,
      priorityScore: priorityScore,
      icon: '🏡',
      costRange: { low: costLow, high: costHigh },
      valueIncrease: { low: valueLow, high: valueHigh },
      roi: { low: roiLow, high: roiHigh },
      insight: 'Curb appeal creates strong first impressions and attracts more buyers',
      confidence: 78
    };
  }

  /**
   * Analyze energy efficiency opportunities
   */
  function analyzeEnergy(propertyData, sqft, state) {
    const hvacAge = parseInt(propertyData.hvacAge) || 0;
    const yearBuilt = parseInt(propertyData.yearBuilt) || 0;
    const currentYear = getCurrentYear();
    const propertyAge = yearBuilt > 0 ? currentYear - yearBuilt : 0;

    // Only recommend if HVAC > 10 years OR property built before 2000
    if (hvacAge < 10 && yearBuilt >= 2000) return null;

    // Age factor
    const ageFactor = Math.max(hvacAge * 3, propertyAge * 1.5);

    // Condition factor
    const conditionFactor = 50;

    // ROI factor
    const roiFactor = 58; // Energy typically 50-60% ROI

    // Market factor
    const marketFactors = {
      'CA': 85, 'NY': 80, 'WA': 80, 'DEFAULT': 70
    };
    const marketFactor = marketFactors[state] || marketFactors.DEFAULT;

    // Calculate priority score
    const priorityScore = calculatePriorityScore(ageFactor, conditionFactor, roiFactor, marketFactor);
    const priority = getPriorityCategory(priorityScore);

    // Calculate cost
    const costLow = 3000;
    const costHigh = 8000;

    // Calculate value increase (includes utility savings)
    const roiMultiplier = (ROI_MULTIPLIERS[state] || ROI_MULTIPLIERS.DEFAULT).energy;
    const valueLow = Math.round(costLow * roiMultiplier);
    const valueHigh = Math.round(costHigh * roiMultiplier);

    // ROI percentage
    const roiLow = Math.round((valueLow / costHigh) * 100);
    const roiHigh = Math.round((valueHigh / costLow) * 100);

    return {
      id: 'energy-efficiency',
      title: 'Energy Efficiency Upgrades',
      description: `Improving your home's energy efficiency through better insulation, modern windows, and a smart thermostat will reduce utility costs and appeal to eco-conscious buyers.`,
      priority: priority,
      priorityScore: priorityScore,
      icon: '⚡',
      costRange: { low: costLow, high: costHigh },
      valueIncrease: { low: valueLow, high: valueHigh },
      roi: { low: roiLow, high: roiHigh },
      insight: 'Energy-efficient homes qualify for better financing and lower insurance rates',
      confidence: 82
    };
  }
```

- [ ] **Commit**

```bash
git add js/recommendation-engine.js
git commit -m "feat: add exterior and energy efficiency analyzers"
```

### Step 8: Add main generateRecommendations function

- [ ] **Implement generateRecommendations function**

Replace the placeholder in the return statement with:

```javascript
  /**
   * Generate recommendations based on property data
   * @param {Object} propertyData - Property verification data
   * @param {Array} photos - Photos with dimensions
   * @param {Object} valuation - Valuation results
   * @param {Object} address - Address data
   * @returns {Array} Array of recommendation objects
   */
  function generateRecommendations(propertyData, photos, valuation, address) {
    // Validate inputs
    if (!propertyData) {
      console.warn('No property data available');
      return [];
    }

    // Extract data
    const sqft = valuation?.totalSqFt || parseInt(propertyData.squareFootage) || 2000;
    const state = address?.state || 'DEFAULT';
    const city = address?.city || 'your area';

    // Run all analyzers
    const recommendations = [];

    // HVAC
    const hvac = analyzeHVAC(propertyData, sqft, state);
    if (hvac) recommendations.push(hvac);

    // Roof
    const roof = analyzeRoof(propertyData, sqft, state);
    if (roof) recommendations.push(roof);

    // Kitchen
    const kitchen = analyzeKitchen(propertyData, sqft, state, city);
    if (kitchen) recommendations.push(kitchen);

    // Bathroom
    const bathroom = analyzeBathroom(propertyData, sqft, state, city);
    if (bathroom) recommendations.push(bathroom);

    // Exterior
    const exterior = analyzeExterior(propertyData, sqft, state);
    if (exterior) recommendations.push(exterior);

    // Energy
    const energy = analyzeEnergy(propertyData, sqft, state);
    if (energy) recommendations.push(energy);

    // Sort by priority score (descending)
    recommendations.sort((a, b) => {
      // First by priority category
      const priorityOrder = { critical: 3, high: 2, medium: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Then by priority score
      return b.priorityScore - a.priorityScore;
    });

    // If no recommendations generated, return generic ones
    if (recommendations.length === 0) {
      recommendations.push(generateGenericRecommendation(sqft, state, city));
    }

    return recommendations;
  }

  /**
   * Generate generic recommendation when data is insufficient
   */
  function generateGenericRecommendation(sqft, state, city) {
    return {
      id: 'general-improvements',
      title: 'Property Improvements',
      description: 'Based on typical properties in your area, consider updating key areas like the kitchen, bathrooms, and improving curb appeal to maximize your home\'s value.',
      priority: 'medium',
      priorityScore: 50,
      icon: '🏠',
      costRange: { low: 10000, high: 30000 },
      valueIncrease: { low: 7500, high: 24000 },
      roi: { low: 70, high: 85 },
      insight: `Most homes in ${city} benefit from kitchen and bathroom updates`,
      confidence: 60
    };
  }
```

- [ ] **Update public API**

Replace the return statement:

```javascript
  // Public API
  return {
    generateRecommendations: generateRecommendations,
    formatCurrency: formatCurrency
  };
```

- [ ] **Verify complete file**

Open: `js/recommendation-engine.js`
Expected: Complete module with all analyzers and public API

- [ ] **Commit**

```bash
git add js/recommendation-engine.js
git commit -m "feat: add generateRecommendations main function and generic fallback"
```

---

## Task 2: Create Recommendations HTML Page

**Files:**
- Create: `recommendations.html`

### Step 1: Create recommendations.html structure

- [ ] **Create file with basic structure**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Improve Your Value - Mobile Valuation</title>
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/pages.css">
</head>
<body>
  <div class="page-container">
    <!-- Loading State (hidden after load) -->
    <div id="loading-state" class="loading-state">
      <div class="loading-content">
        <h2>Analyzing Improvement Opportunities...</h2>
        <div class="loading-steps">
          <div class="loading-step" data-step="1">
            <span class="loading-icon">⏳</span>
            <span class="loading-text">Analyzing property features</span>
          </div>
          <div class="loading-step" data-step="2">
            <span class="loading-icon">⏳</span>
            <span class="loading-text">Comparing with market data</span>
          </div>
          <div class="loading-step" data-step="3">
            <span class="loading-icon">⏳</span>
            <span class="loading-text">Evaluating improvement opportunities</span>
          </div>
          <div class="loading-step" data-step="4">
            <span class="loading-icon">⏳</span>
            <span class="loading-text">Calculating ROI projections</span>
          </div>
          <div class="loading-step" data-step="5">
            <span class="loading-icon">⏳</span>
            <span class="loading-text">Generating recommendations</span>
          </div>
        </div>
        <div class="loading-spinner"></div>
      </div>
    </div>

    <!-- Recommendations Content (hidden until loaded) -->
    <div id="recommendations-content" class="recommendations-content" style="display: none;">
      <!-- Navigation -->
      <nav class="page-nav">
        <a href="results.html" class="nav-back">← Back to Results</a>
      </nav>

      <!-- Main Content -->
      <main>
        <h1>💡 Increase Your Property Value</h1>
        <p class="subtitle">Based on analysis of your property data and local market trends</p>

        <!-- Summary Card -->
        <div class="summary-card" id="summary-card">
          <div class="summary-icon">📊</div>
          <div class="summary-content">
            <h3>We found <strong id="recommendation-count">—</strong> recommendations</h3>
            <p>Potential value increase: <strong id="value-range">$— - $—</strong></p>
          </div>
        </div>

        <!-- Recommendations Grid -->
        <div class="recommendations-grid" id="recommendations-grid">
          <!-- Dynamically populated -->
        </div>

        <!-- CTA Section -->
        <div class="cta-section">
          <a href="results.html" class="button button-secondary">← Back to Results</a>
          <button type="button" id="get-report" class="button button-primary">📄 Get Full Report</button>
          <button type="button" id="start-new" class="button button-secondary">🔄 Start New Valuation</button>
        </div>

        <!-- Disclaimer -->
        <p class="disclaimer">
          These recommendations are estimates based on typical market conditions and property data.
          Actual costs and value increases may vary. Consult with licensed contractors for accurate quotes.
        </p>
      </main>
    </div>
  </div>

  <!-- Scripts -->
  <script src="js/utils.js"></script>
  <script src="js/photo-storage.js"></script>
  <script src="js/valuation-engine.js"></script>
  <script src="js/recommendation-engine.js"></script>
  <script src="js/recommendations-page.js"></script>
</body>
</html>
```

- [ ] **Verify page structure**

Open in browser: `recommendations.html`
Expected: Page loads with loading state visible, recommendations content hidden

- [ ] **Commit**

```bash
git add recommendations.html
git commit -m "feat: create recommendations.html page structure"
```

---

## Task 3: Create Recommendations Page Controller

**Files:**
- Create: `js/recommendations-page.js`

### Step 1: Create page controller skeleton

- [ ] **Create file with IIFE structure**

```javascript
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
```

- [ ] **Commit**

```bash
git add js/recommendations-page.js
git commit -m "feat: create recommendations-page.js controller skeleton"
```

### Step 2: Add loading animation

- [ ] **Implement animateLoading function**

Add after init function:

```javascript
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
```

- [ ] **Commit**

```bash
git add js/recommendations-page.js
git commit -m "feat: add loading animation sequence"
```

### Step 3: Add displayRecommendations function

- [ ] **Implement displayRecommendations function**

Add after animateLoading:

```javascript
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
```

- [ ] **Commit**

```bash
git add js/recommendations-page.js
git commit -m "feat: add displayRecommendations and displaySummary functions"
```

### Step 4: Add createRecommendationCard function

- [ ] **Implement createRecommendationCard function**

Add after displaySummary:

```javascript
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
```

- [ ] **Commit**

```bash
git add js/recommendations-page.js
git commit -m "feat: add createRecommendationCard function"
```

### Step 5: Add event handlers

- [ ] **Implement setupEventHandlers function**

Add after getPriorityLabel:

```javascript
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
    // - Generate PDF report with valuation + recommendations
    // - Email report to user

    alert(
      '📄 Full Report\n\n' +
      'In production, this would:\n' +
      '• Capture your email address\n' +
      '• Generate a detailed PDF report\n' +
      '• Include valuation and recommendations\n' +
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
      localStorage.removeItem('propertyData');
      localStorage.removeItem('currentStep');
      localStorage.removeItem('sessionStarted');

      console.log('✓ Session cleared');

      // Navigate to home
      navigateTo('index.html');
    }
  }
```

- [ ] **Verify complete file**

Open: `js/recommendations-page.js`
Expected: Complete controller with all functions

- [ ] **Commit**

```bash
git add js/recommendations-page.js
git commit -m "feat: add event handlers for Get Report and Start New"
```

---

## Task 4: Add CSS Styling

**Files:**
- Modify: `css/components.css`

### Step 1: Add summary card styles

- [ ] **Add summary card CSS**

Add to end of `css/components.css`:

```css
/* ============================================
   RECOMMENDATIONS PAGE STYLES
   ============================================ */

/* Summary Card */
.summary-card {
  background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
  border: 2px solid #3B82F6;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.summary-icon {
  font-size: 48px;
  flex-shrink: 0;
}

.summary-content h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.summary-content p {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0;
}

.summary-content strong {
  color: var(--primary-blue);
  font-weight: 700;
}

@media (max-width: 640px) {
  .summary-card {
    flex-direction: column;
    text-align: center;
  }
}
```

- [ ] **Commit**

```bash
git add css/components.css
git commit -m "style: add summary card styling"
```

### Step 2: Add recommendations grid styles

- [ ] **Add grid CSS**

Add after summary card styles:

```css
/* Recommendations Grid */
.recommendations-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-top: 32px;
  margin-bottom: 40px;
}

@media (min-width: 768px) {
  .recommendations-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.no-recommendations {
  text-align: center;
  color: var(--text-secondary);
  font-size: 16px;
  padding: 40px 20px;
}
```

- [ ] **Commit**

```bash
git add css/components.css
git commit -m "style: add recommendations grid layout"
```

### Step 3: Add recommendation card styles

- [ ] **Add card CSS**

Add after grid styles:

```css
/* Recommendation Card */
.recommendation-card {
  background: white;
  border: 2px solid;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.recommendation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.recommendation-card[data-priority="critical"] {
  border-color: #DC2626;
}

.recommendation-card[data-priority="high"] {
  border-color: #F59E0B;
}

.recommendation-card[data-priority="medium"] {
  border-color: #FCD34D;
}

/* Card Header */
.recommendation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.recommendation-icon {
  font-size: 32px;
}

/* Priority Badge */
.priority-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.priority-badge.critical {
  background: #DC2626;
  color: white;
}

.priority-badge.high {
  background: #F59E0B;
  color: white;
}

.priority-badge.medium {
  background: #FCD34D;
  color: #1F2937;
}

/* Card Content */
.recommendation-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 12px 0;
}

.recommendation-description {
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0 0 20px 0;
}
```

- [ ] **Commit**

```bash
git add css/components.css
git commit -m "style: add recommendation card base styles"
```

### Step 4: Add recommendation stats styles

- [ ] **Add stats CSS**

Add after card content styles:

```css
/* Recommendation Stats */
.recommendation-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
  padding: 16px;
  background: #F9FAFB;
  border-radius: 8px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 2px;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

/* Recommendation Insight */
.recommendation-insight {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  background: #FEF3C7;
  border-left: 3px solid #F59E0B;
  border-radius: 4px;
}

.insight-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.recommendation-insight p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #78350F;
}
```

- [ ] **Commit**

```bash
git add css/components.css
git commit -m "style: add recommendation stats and insight styling"
```

### Step 5: Add responsive adjustments

- [ ] **Add mobile optimizations**

Add after insight styles:

```css
/* Responsive Adjustments */
@media (max-width: 640px) {
  .recommendation-card {
    padding: 20px;
  }

  .recommendation-title {
    font-size: 18px;
  }

  .recommendation-description {
    font-size: 14px;
  }

  .stat-value {
    font-size: 15px;
  }
}
```

- [ ] **Verify CSS**

Open in browser: `recommendations.html`
Expected: All styles applied, cards look professional

- [ ] **Commit**

```bash
git add css/components.css
git commit -m "style: add responsive adjustments for recommendations"
```

---

## Task 5: Integrate with Results Page

**Files:**
- Modify: `results.html`
- Modify: `js/results-page.js`

### Step 1: Add button to results.html

- [ ] **Add recommendations button**

Open: `results.html`

Find the CTA section (around line 104-111) and modify:

```html
        <!-- Call to Action -->
        <div class="cta-section">
          <button type="button" id="see-recommendations" class="button button-primary button-full">
            💡 See How to Increase Value
          </button>
          <button type="button" id="get-report" class="button button-secondary button-full">
            📄 Get Full Report
          </button>
          <button type="button" id="start-new" class="button button-secondary button-full">
            🔄 Start Another Valuation
          </button>
        </div>
```

- [ ] **Verify button appears**

Open in browser: `results.html`
Expected: New "See How to Increase Value" button appears first

- [ ] **Commit**

```bash
git add results.html
git commit -m "feat: add 'See How to Increase Value' button to results page"
```

### Step 2: Add click handler to results-page.js

- [ ] **Add event handler**

Open: `js/results-page.js`

In the `setupEventHandlers` function (around line 161-167), add:

```javascript
  function setupEventHandlers() {
    // See Recommendations button
    document.getElementById('see-recommendations').addEventListener('click', handleSeeRecommendations);

    // Get Full Report button
    document.getElementById('get-report').addEventListener('click', handleGetReport);

    // Start New Valuation button
    document.getElementById('start-new').addEventListener('click', handleStartNew);
  }
```

- [ ] **Add handler function**

Add after setupEventHandlers function:

```javascript
  /**
   * Handle See Recommendations
   */
  function handleSeeRecommendations() {
    navigateTo('recommendations.html');
  }
```

- [ ] **Verify navigation works**

Open in browser: `results.html` → Click "See How to Increase Value"
Expected: Navigates to recommendations.html

- [ ] **Commit**

```bash
git add js/results-page.js
git commit -m "feat: add navigation handler to recommendations page"
```

---

## Task 6: Update Documentation

**Files:**
- Modify: `README.md`

### Step 1: Update README status and progress

- [ ] **Update badges and status**

Open: `README.md`

Change lines 3-4:

```markdown
![Status](https://img.shields.io/badge/status-phase%206%20complete-success)
![Progress](https://img.shields.io/badge/progress-100%25-brightgreen)
```

Change line 18:

```markdown
## 🚀 Current Status: Phase 6 Complete - FULL PoC READY
```

- [ ] **Commit**

```bash
git add README.md
git commit -m "docs: update status badges to Phase 6 complete"
```

### Step 2: Add Phase 6 to completed features

- [ ] **Add Phase 6 section**

Find the "Phase 5:" section (around line 71) and add after it:

```markdown
**Phase 6: Value Enhancement Recommendations**
- AI-styled recommendation engine with multi-factor scoring
- Analysis of 6 improvement areas (HVAC, roof, kitchen, bathroom, exterior, energy)
- Priority-based recommendations (Critical/High/Medium)
- Cost estimates and value increase projections
- ROI calculations per recommendation
- 5-stage loading animation for professional presentation
- Separate recommendations page with card-based layout
- Integration with results page via navigation button
- Complete CSS styling for recommendation cards
- Error handling and graceful degradation
```

- [ ] **Update phase progress checklist**

Find the phase progress section (around line 95) and add:

```markdown
- [x] **Phase 6:** Value Enhancement Recommendations ✅ **COMPLETE**
  - [x] Multi-factor recommendation engine
  - [x] 6 improvement area analyzers
  - [x] Priority-based scoring system
  - [x] Cost and ROI calculations
  - [x] AI-style loading animation
  - [x] Recommendation card layout
  - [x] Integration with results page
  - [x] Complete recommendation styling
```

- [ ] **Commit**

```bash
git add README.md
git commit -m "docs: add Phase 6 to completed features list"
```

### Step 3: Update user flow section

- [ ] **Update Current User Flow**

Find "Current User Flow" section (around line 155) and update:

```markdown
## Current User Flow

1. **Landing Page** - Introduction and "Get Started"
2. **Address Entry** - Mock geolocation (662 Woodward Ave, Detroit MI)
3. **Property Verification** - 4-screen TurboTax-style wizard
   - Screen 1: Property basics (type, year, sqft, lot size)
   - Screen 2: Room details (bedrooms, bathrooms, garage, basement)
   - Screen 3: Feature conditions (HVAC age, roof age, kitchen/bathroom updates)
   - Screen 4: Recent changes (renovations, additions, repairs)
4. **Photo Instructions** - Guide for capturing 5 room photos
5. **Camera Capture** - Take photos of 5 rooms with quality feedback
6. **Photo Review** - Review and retake if needed
7. **Results** - View property valuation with comparables
8. **Recommendations** - AI-styled improvement suggestions with ROI analysis
```

- [ ] **Commit**

```bash
git add README.md
git commit -m "docs: update user flow to include recommendations"
```

### Step 4: Update file structure section

- [ ] **Update file structure**

Find "File Structure" section (around line 213) and update:

```markdown
## File Structure

```
mobile-valuation/
├── index.html                  # Landing page
├── address.html                # Address entry (simplified for demo)
├── property-verification.html  # Property verification wizard
├── instructions.html           # Photo instructions
├── capture.html                # Camera capture
├── review.html                 # Photo review
├── results.html                # Valuation results
├── recommendations.html        # Value improvement recommendations (NEW - Phase 6)
├── css/
│   ├── main.css               # Design system
│   ├── components.css         # Reusable components + all page styles
│   └── pages.css              # Page-specific styles
├── js/
│   ├── utils.js               # Utility functions
│   ├── main.js                # Page initialization
│   ├── address-simple.js      # Mock geolocation
│   ├── property-verification.js # Verification wizard
│   ├── camera.js              # Camera module
│   ├── photo-storage.js       # Storage module
│   ├── quality-analyzer.js    # TensorFlow.js module
│   ├── lidar-scanner.js       # LiDAR mock module
│   ├── capture-controller.js  # Navigation state machine
│   ├── capture-main.js        # Capture orchestration
│   ├── review-page.js         # Review page logic
│   ├── valuation-engine.js    # Mock AVM
│   ├── results-page.js        # Results page logic
│   ├── recommendation-engine.js # Recommendation generation (NEW - Phase 6)
│   └── recommendations-page.js # Recommendations page logic (NEW - Phase 6)
└── docs/
    ├── TESTING_CHECKLIST.md
    ├── BUG_FIX_ADDRESS_ENTRY.md
    ├── phase-2-testing-checklist.md
    └── superpowers/
        ├── specs/
        │   ├── 2026-03-16-phase-3-camera-capture-design.md
        │   ├── 2026-03-17-phase-5-demo-simplification.md
        │   └── 2026-03-17-phase-6-value-recommendations.md
        └── plans/
            ├── 2026-03-16-phase-3-camera-capture.md
            ├── 2026-03-17-phase-5-demo-simplification.md
            └── 2026-03-17-phase-6-value-recommendations.md
```
```

- [ ] **Commit**

```bash
git add README.md
git commit -m "docs: update file structure to include Phase 6 files"
```

### Step 5: Update status section

- [ ] **Update completion status**

Find the "Status" section (around line 139) and update:

```markdown
## Status

✅ **Phase 1 Complete** - Landing page built and tested
✅ **Phase 2 Complete** - Address entry and instructions built
✅ **Phase 3 Complete** - Camera capture and photo review built
✅ **Phase 4 Complete** - Results and valuation page built
✅ **Phase 5 Complete** - Demo simplification and property verification built
✅ **Phase 6 Complete** - Value enhancement recommendations built

**PoC Status:** ✅ Complete and demo-ready
```

- [ ] **Verify README**

Open: `README.md`
Expected: All Phase 6 documentation complete

- [ ] **Commit**

```bash
git add README.md
git commit -m "docs: mark Phase 6 and PoC as complete"
```

---

## Task 7: Create Phase 6 Git Tag

**Files:**
- N/A (git tagging)

### Step 1: Create and verify git tag

- [ ] **Create Phase 6 tag**

```bash
git tag -a phase-6 -m "Phase 6: Value Enhancement Recommendations

AI-styled recommendation engine with multi-factor scoring:
- 6 improvement area analyzers (HVAC, roof, kitchen, bathroom, exterior, energy)
- Priority-based recommendations (Critical/High/Medium)
- Cost estimates, value increase, ROI calculations
- 5-stage AI-style loading animation
- Professional card-based layout
- Integration with results page
- Complete CSS styling

Complete PoC: Landing → Address → Verification → Instructions → Capture → Review → Results → Recommendations"
```

- [ ] **Verify tag created**

```bash
git tag -l "phase-*"
```

Expected output:
```
phase-5
phase-6
v0.1.0-phase1
v0.2.0-phase2
v0.3.0-phase3
v1.0.0-phase4
```

- [ ] **View tag details**

```bash
git show phase-6 --no-patch
```

Expected: Tag details with message

---

## Final Verification

### Step 1: Test complete user flow

- [ ] **Test end-to-end flow**

1. Open `index.html` in browser
2. Click "Get Started"
3. Click "Use My Location" (mock address appears)
4. Complete 4-screen property verification wizard
5. Click through photo instructions
6. (Skip photo capture for now - focus on data flow)
7. Navigate to review page manually: `review.html`
8. Click "Submit Valuation"
9. View results page with loading animation
10. Click "💡 See How to Increase Value"
11. Watch 5-stage loading animation (~4 seconds)
12. Verify recommendations appear with:
    - Summary card showing count and value range
    - 3-6 recommendation cards with priority badges
    - Cost, value, and ROI displayed
    - Insights for each recommendation
13. Click "Back to Results" - returns to results page
14. Click "See How to Increase Value" again
15. Click "Get Full Report" - shows demo alert
16. Click "Start New Valuation" - clears data, returns to home

Expected: Complete flow works end-to-end

### Step 2: Test with different data scenarios

- [ ] **Test with old HVAC (20+ years)**

Modify verification data:
- Set HVAC age: 22 years
- Refresh recommendations page
- Expected: HVAC replacement shows as "Critical" priority

- [ ] **Test with recent renovations**

Modify verification data:
- Set kitchen year: 2023
- Set bathroom year: 2023
- Set HVAC age: 3 years
- Refresh recommendations page
- Expected: Fewer recommendations (possibly only exterior/energy)

- [ ] **Test with poor conditions**

Modify verification data:
- Set kitchen condition: "Poor"
- Set bathroom condition: "Poor"
- Set HVAC age: 18 years
- Set roof age: 27 years
- Refresh recommendations page
- Expected: Multiple high/critical priority recommendations

### Step 3: Verify styling and responsive design

- [ ] **Desktop view (1920x1080)**

- Recommendations grid shows 2 columns
- Cards display properly with all content
- Priority badges visible and colored correctly
- Hover effects work (cards lift on hover)

- [ ] **Tablet view (768x1024)**

- Recommendations grid shows 2 columns
- Cards remain readable
- Summary card adjusts properly

- [ ] **Mobile view (375x667)**

- Recommendations stack vertically (1 column)
- Summary card stacks icon and content
- Text remains readable
- Touch targets are adequate

### Step 4: Verify browser compatibility

- [ ] **Chrome** - All features work
- [ ] **Firefox** - All features work
- [ ] **Edge** - All features work
- [ ] **Safari** (if available) - All features work

### Step 5: Final commit

- [ ] **Final verification commit**

```bash
git add -A
git status
```

Expected: All changes committed, working tree clean

```bash
git log --oneline -15
```

Expected: All Phase 6 commits present

---

## Completion Checklist

- [ ] All 7 tasks completed
- [ ] All files created and modified
- [ ] All commits made with descriptive messages
- [ ] Git tag created for Phase 6
- [ ] End-to-end user flow tested
- [ ] Multiple data scenarios tested
- [ ] Responsive design verified
- [ ] Browser compatibility verified
- [ ] README.md updated with Phase 6 documentation
- [ ] No console errors or warnings

---

## Notes for Implementation

**Code Style:**
- Follow existing IIFE pattern for page controllers
- Use consistent variable naming (camelCase)
- Add descriptive comments for complex logic
- Keep functions focused and single-purpose

**Testing Approach:**
- No automated tests (vanilla JS project)
- Manual testing via browser
- Test with Chrome DevTools console open
- Verify localStorage data between pages

**Common Issues:**
- If recommendations don't appear, check console for errors
- Verify propertyData exists in localStorage
- Ensure all scripts load in correct order in HTML
- Check that CSS classes match between HTML and CSS

**Performance:**
- Loading animation intentionally ~4 seconds (AI feel)
- Recommendation generation is fast (<100ms)
- No network calls - all client-side
- localStorage reads are synchronous

---

**Plan Complete!** Ready for implementation via superpowers:subagent-driven-development or superpowers:executing-plans.
