// V1 Engines Client - Integration layer for V1 ValuationEngine and RecommendationEngine
// Provides clean interface for V2 conversational AI to use existing V1 engines

/**
 * Calculate property valuation using V1 ValuationEngine
 * @param {Object} params - Valuation parameters
 * @param {Object} params.property_data - Property information
 * @param {Array} params.photos - Array of photo objects with room data
 * @returns {Promise<Object>} Valuation result
 */
export async function calculateValuation({ property_data, photos = [] }) {
  try {
    // Load V1 ValuationEngine if not already loaded
    if (typeof ValuationEngine === 'undefined') {
      await loadV1Engine('valuation-engine.js');
    }

    // Transform photos to V1 format (with dimensions)
    const v1Photos = transformPhotosForV1(photos, property_data);

    // Extract address from property data
    const address = extractAddress(property_data);

    // Call V1 ValuationEngine
    const valuation = ValuationEngine.calculateValuation(v1Photos, address);

    // Generate comparables
    const comparables = ValuationEngine.generateComparables(valuation.estimate, address);

    return {
      success: true,
      estimate: valuation.estimate,
      rangeLow: valuation.rangeLow,
      rangeHigh: valuation.rangeHigh,
      confidence: valuation.confidence / 100, // Convert to 0-1 range
      totalSqFt: valuation.totalSqFt,
      pricePerSqFt: valuation.pricePerSqFt,
      comparables: comparables
    };
  } catch (error) {
    console.error('Error calculating valuation:', error);
    return {
      success: false,
      error: error.message || 'Failed to calculate valuation',
      // Fallback to mock data
      estimate: 285000,
      rangeLow: 270000,
      rangeHigh: 300000,
      confidence: 0.75,
      totalSqFt: 1800,
      pricePerSqFt: 158,
      comparables: []
    };
  }
}

/**
 * Generate improvement recommendations using V1 RecommendationEngine
 * @param {Object} params - Recommendation parameters
 * @param {Object} params.property_data - Property information
 * @param {Array} params.photos - Array of photo objects
 * @param {Object} params.valuation - Valuation results
 * @returns {Promise<Object>} Recommendations result
 */
export async function generateRecommendations({ property_data, photos = [], valuation }) {
  try {
    // Load V1 RecommendationEngine if not already loaded
    if (typeof RecommendationEngine === 'undefined') {
      await loadV1Engine('recommendation-engine.js');
    }

    // Transform photos to V1 format
    const v1Photos = transformPhotosForV1(photos, property_data);

    // Extract address from property data
    const address = extractAddress(property_data);

    // Transform valuation to V1 format
    const v1Valuation = {
      totalSqFt: valuation?.totalSqFt || property_data?.sqft?.value || 1800
    };

    // Transform property data to V1 format
    const v1PropertyData = transformPropertyDataForV1(property_data);

    // Call V1 RecommendationEngine
    const recommendations = RecommendationEngine.generateRecommendations(
      v1PropertyData,
      v1Photos,
      v1Valuation,
      address
    );

    return {
      success: true,
      recommendations: recommendations.map(rec => ({
        id: rec.id,
        category: rec.id.split('-')[0], // Extract category from id
        priority: rec.priority,
        priorityScore: rec.priorityScore,
        title: rec.title,
        description: rec.description,
        icon: rec.icon,
        costRange: {
          min: rec.costRange.low,
          max: rec.costRange.high
        },
        valueIncrease: {
          low: rec.valueIncrease.low,
          high: rec.valueIncrease.high
        },
        impactScore: rec.priorityScore, // Map priorityScore to impactScore
        roiEstimate: rec.roi.high / 100, // Use high ROI as multiplier
        insight: rec.insight,
        confidence: rec.confidence
      }))
    };
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate recommendations',
      // Fallback to empty array
      recommendations: []
    };
  }
}

/**
 * Transform photos from V2 format to V1 format with dimensions
 * @param {Array} photos - V2 photo objects
 * @param {Object} property_data - Property data for fallback dimensions
 * @returns {Array} V1 photo objects with dimensions
 */
function transformPhotosForV1(photos, property_data) {
  if (!photos || photos.length === 0) {
    // No photos - use property data to create estimated dimensions
    const sqft = property_data?.sqft?.value || 1800;
    const bedrooms = property_data?.bedrooms?.value || 3;
    const bathrooms = property_data?.bathrooms?.value || 2;

    // Estimate room sizes based on total sqft
    const avgRoomSize = sqft / (bedrooms + bathrooms + 2); // +2 for kitchen/living

    return [{
      roomType: 'total',
      dimensions: {
        squareFootage: sqft,
        width: Math.sqrt(sqft),
        depth: Math.sqrt(sqft)
      }
    }];
  }

  // Transform actual photos
  return photos.flatMap(photoGroup => {
    const roomType = photoGroup.roomType;

    // Estimate dimensions based on room type
    const estimatedSqft = estimateRoomSize(roomType, property_data);

    return photoGroup.photos.map(photo => ({
      roomType: roomType,
      dataUrl: photo.dataUrl,
      timestamp: photo.timestamp,
      dimensions: {
        squareFootage: estimatedSqft,
        width: Math.sqrt(estimatedSqft),
        depth: Math.sqrt(estimatedSqft)
      }
    }));
  });
}

/**
 * Estimate room size based on room type and property data
 * @param {string} roomType - Type of room
 * @param {Object} property_data - Property data
 * @returns {number} Estimated square footage
 */
function estimateRoomSize(roomType, property_data) {
  const totalSqft = property_data?.sqft?.value || 1800;

  const roomSizeRatios = {
    living_room: 0.20,  // 20% of total
    kitchen: 0.12,      // 12% of total
    bedroom: 0.15,      // 15% of total
    bathroom: 0.08,     // 8% of total
    exterior: totalSqft // Full property
  };

  return Math.round(totalSqft * (roomSizeRatios[roomType] || 0.12));
}

/**
 * Extract address object from property data
 * @param {Object} property_data - Property data
 * @returns {Object} Address object
 */
function extractAddress(property_data) {
  // Check if address is already structured
  if (property_data?.address?.value) {
    const addrValue = property_data.address.value;

    // Parse address string if it's a string
    if (typeof addrValue === 'string') {
      return parseAddressString(addrValue);
    }

    // Return if already an object
    if (typeof addrValue === 'object') {
      return addrValue;
    }
  }

  // Return empty address
  return {
    street: property_data?.address?.value?.street || '',
    city: 'Your City',
    state: 'DEFAULT',
    zip: ''
  };
}

/**
 * Parse address string into components
 * @param {string} addressString - Full address string
 * @returns {Object} Address components
 */
function parseAddressString(addressString) {
  // Try to extract state from address
  const stateMatch = addressString.match(/\b([A-Z]{2})\b/);
  const state = stateMatch ? stateMatch[1] : 'DEFAULT';

  // Try to extract city (text before state)
  const cityMatch = addressString.match(/,\s*([^,]+),\s*[A-Z]{2}/);
  const city = cityMatch ? cityMatch[1].trim() : 'Your City';

  return {
    street: addressString,
    city: city,
    state: state,
    zip: ''
  };
}

/**
 * Transform property data from V2 format to V1 format
 * @param {Object} property_data - V2 property data with confidence values
 * @returns {Object} V1 property data (flat structure)
 */
function transformPropertyDataForV1(property_data) {
  const v1Data = {};

  // Extract values from V2 structure (which has {value, confidence} pairs)
  Object.keys(property_data).forEach(key => {
    const data = property_data[key];

    if (data && typeof data === 'object' && 'value' in data) {
      v1Data[key] = data.value;
    } else {
      v1Data[key] = data;
    }
  });

  // Map V2 field names to V1 expected field names
  return {
    squareFootage: v1Data.sqft || v1Data.squareFootage || 1800,
    bedrooms: v1Data.bedrooms || 3,
    bathrooms: v1Data.bathrooms || 2,
    yearBuilt: v1Data.yearBuilt || 2000,
    condition: v1Data.condition || 'good',

    // System ages (needed for recommendations)
    hvacAge: v1Data.hvacAge || 0,
    hvacType: v1Data.hvacType || 'Central Air',
    roofAge: v1Data.roofAge || 0,
    roofType: v1Data.roofType || 'Asphalt Shingle',

    // Room conditions and years
    kitchenYear: v1Data.kitchenYear || v1Data.yearBuilt || 0,
    kitchenCondition: v1Data.kitchenCondition || v1Data.condition || '',
    bathroomYear: v1Data.bathroomYear || v1Data.yearBuilt || 0,
    bathroomCondition: v1Data.bathroomCondition || v1Data.condition || '',

    // Recent changes
    changes: v1Data.changes || []
  };
}

/**
 * Load V1 engine script dynamically
 * @param {string} scriptName - Name of the script file
 * @returns {Promise} Promise that resolves when script is loaded
 */
function loadV1Engine(scriptName) {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    const existingScript = document.querySelector(`script[src*="${scriptName}"]`);
    if (existingScript) {
      resolve();
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = `../../js/${scriptName}`;
    script.async = false; // Load synchronously to ensure availability

    script.onload = () => {
      console.log(`V1 Engine loaded: ${scriptName}`);
      resolve();
    };

    script.onerror = () => {
      console.error(`Failed to load V1 Engine: ${scriptName}`);
      reject(new Error(`Failed to load ${scriptName}`));
    };

    document.head.appendChild(script);
  });
}

// Export client interface
export const V1EnginesClient = {
  calculateValuation,
  generateRecommendations
};

// Make available globally for debugging
window.V1EnginesClient = V1EnginesClient;
