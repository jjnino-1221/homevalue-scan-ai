/**
 * Valuation Engine
 * Mock AVM (Automated Valuation Model) for property valuation
 */

const ValuationEngine = (function() {
  // Base price per square foot by state (mock data)
  const PRICE_PER_SQFT = {
    'CA': 450,  // California
    'NY': 400,  // New York
    'TX': 200,  // Texas
    'FL': 250,  // Florida
    'WA': 350,  // Washington
    'DEFAULT': 250
  };

  /**
   * Calculate property valuation
   * @param {Array} photos - Array of photo objects with dimensions
   * @param {Object} address - Address object with state
   * @returns {Object} Valuation result
   */
  function calculateValuation(photos, address) {
    // Calculate total square footage
    const totalSqFt = calculateTotalSquareFootage(photos);

    // Get price per sqft for state
    const state = address?.state || 'DEFAULT';
    const basePricePerSqFt = PRICE_PER_SQFT[state] || PRICE_PER_SQFT.DEFAULT;

    // Add some variance (+/- 10%)
    const variance = (Math.random() * 0.2) - 0.1; // -0.1 to +0.1
    const pricePerSqFt = basePricePerSqFt * (1 + variance);

    // Calculate base value
    const baseValue = totalSqFt * pricePerSqFt;

    // Calculate confidence (85-95% for complete data)
    const confidence = 85 + Math.floor(Math.random() * 10);

    // Calculate range (+/- 5%)
    const rangeLow = Math.round(baseValue * 0.95 / 1000) * 1000; // Round to nearest $1000
    const rangeHigh = Math.round(baseValue * 1.05 / 1000) * 1000;
    const estimate = Math.round(baseValue / 1000) * 1000;

    return {
      estimate: estimate,
      rangeLow: rangeLow,
      rangeHigh: rangeHigh,
      confidence: confidence,
      totalSqFt: totalSqFt,
      pricePerSqFt: Math.round(pricePerSqFt)
    };
  }

  /**
   * Calculate total square footage from room dimensions
   * @param {Array} photos - Array of photo objects with dimensions
   * @returns {number} Total square footage
   */
  function calculateTotalSquareFootage(photos) {
    let total = 0;

    photos.forEach(photo => {
      if (photo.dimensions) {
        const sqft = photo.dimensions.squareFootage ||
                     (photo.dimensions.width * photo.dimensions.depth);
        total += sqft;
      }
    });

    return Math.round(total);
  }

  /**
   * Generate mock comparable properties
   * @param {number} baseValue - Base property value
   * @param {Object} address - Property address
   * @returns {Array} Array of 3 comparable properties
   */
  function generateComparables(baseValue, address) {
    const comparables = [];
    const streets = ['Oak St', 'Pine Ave', 'Elm Blvd', 'Maple Dr', 'Cedar Ln'];
    const city = address?.city || 'Your City';

    for (let i = 0; i < 3; i++) {
      // Generate value within +/- 8% of base
      const variance = (Math.random() * 0.16) - 0.08;
      const value = Math.round((baseValue * (1 + variance)) / 1000) * 1000;

      // Generate sold date (last 1-4 weeks)
      const weeksAgo = Math.floor(Math.random() * 4) + 1;
      const soldDate = weeksAgo === 1 ? '1 week ago' : `${weeksAgo} weeks ago`;

      // Generate street address
      const streetNumber = 100 + Math.floor(Math.random() * 900);
      const street = streets[i % streets.length];

      comparables.push({
        address: `${streetNumber} ${street}, ${city}`,
        value: value,
        soldDate: soldDate,
        distance: Math.round((Math.random() * 0.5 + 0.1) * 10) / 10 // 0.1 - 0.6 miles
      });
    }

    // Sort by value
    comparables.sort((a, b) => a.value - b.value);

    return comparables;
  }

  /**
   * Format currency
   * @param {number} value - Dollar amount
   * @returns {string} Formatted currency string
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
   * Format number with commas
   * @param {number} value - Number to format
   * @returns {string} Formatted number string
   */
  function formatNumber(value) {
    return new Intl.NumberFormat('en-US').format(value);
  }

  // Public API
  return {
    calculateValuation,
    calculateTotalSquareFootage,
    generateComparables,
    formatCurrency,
    formatNumber
  };
})();
