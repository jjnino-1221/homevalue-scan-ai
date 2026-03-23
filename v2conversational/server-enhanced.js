// COMPREHENSIVE V2 CONVERSATION FLOW
// Matches V1's detailed property verification + adds conversational guidance

// Property verification state tracker (session-based)
const sessions = new Map();

function getSession(messages) {
  // Use conversation ID or create new session
  const sessionKey = messages[0]?.timestamp || 'default';
  console.log(`[SESSION] Key: ${sessionKey}, Has session: ${sessions.has(sessionKey)}, Total sessions: ${sessions.size}`);
  if (!sessions.has(sessionKey)) {
    console.log(`[SESSION] Creating new session for key: ${sessionKey}`);
    sessions.set(sessionKey, {
      address: null,
      propertyType: 'Single Family',
      yearBuilt: 1950,
      sqft: 1800,
      lotSize: 0.25,
      bedrooms: 3,
      bathrooms: 2.5,
      garage: '2-car',
      basement: 'Finished',
      hvacType: 'Central AC',
      hvacAge: null,
      roofType: 'Asphalt Shingles',
      roofAge: null,
      kitchenCondition: null,
      bathroomCondition: null,
      flooring: null,
      recentChanges: [],
      photosCount: 0,
      currentStep: 0
    });
  } else {
    console.log(`[SESSION] Retrieved existing session, currentStep: ${sessions.get(sessionKey).currentStep}`);
  }
  return sessions.get(sessionKey);
}

function generateComprehensiveResponse(messages) {
  const lastMessage = messages[messages.length - 1];
  const userMessage = typeof lastMessage.content === 'string' ? lastMessage.content.toLowerCase() : '';
  const session = getSession(messages);
  const msgCount = messages.length;

  console.log(`[ENHANCED] Msg #${msgCount}: Step ${session.currentStep} | "${userMessage.substring(0, 40)}"`);

  // PRIORITY: Handle actions (restart, view, download)
  if (userMessage.includes('restart') || userMessage.includes('start new') || userMessage.includes('start over')) {
    session.currentStep = 0;
    return {
      text: "Let's start fresh! I can help you get an accurate estimate of your property's value. Ready to begin?",
      toolCalls: [],
      uiPattern: {
        type: 'chips',
        options: [
          { label: '✓ Yes, evaluate my property', value: 'start_valuation' },
          { label: 'Tell me more', value: 'learn_more' }
        ]
      },
      progress: { step: 1, total: 15, title: 'Welcome' }
    };
  }

  if (userMessage.includes('view_comps') || userMessage.includes('comparables')) {
    return {
      text: "Here are 3 comparable properties near your home:",
      toolCalls: [],
      uiPattern: {
        type: 'comparables_cards',
        data: [
          { address: '145 Oak Ave, Detroit, MI', price: 275000, sqft: 1750, beds: 3, baths: 2, distance: '0.5 miles' },
          { address: '89 Elm Street, Detroit, MI', price: 292000, sqft: 1850, beds: 3, baths: 2, distance: '0.7 miles' },
          { address: '210 Maple Dr, Detroit, MI', price: 288000, sqft: 1800, beds: 3, baths: 2, distance: '0.9 miles' }
        ]
      }
    };
  }

  if (userMessage.includes('view_recommendations') || userMessage.includes('recommendations')) {
    return {
      text: "Here are personalized recommendations to increase your property value:",
      toolCalls: [],
      uiPattern: {
        type: 'recommendations_cards',
        summary: { count: 5, valueIncrease: { min: 35000, max: 55000 } },
        data: [
          { title: 'Kitchen Update', description: 'Modern appliances, countertops, and cabinets', investment: {min: 15000, max: 25000}, valueAdd: {min: 20000, max: 30000}, impact: 95, roi: 120 },
          { title: 'Bathroom Refresh', description: 'Update fixtures, tile, and vanity', investment: {min: 8000, max: 12000}, valueAdd: {min: 10000, max: 15000}, impact: 85, roi: 125 },
          { title: 'Curb Appeal', description: 'Landscaping, paint, and exterior improvements', investment: {min: 3000, max: 5000}, valueAdd: {min: 5000, max: 10000}, impact: 75, roi: 150 },
          { title: 'HVAC Update', description: 'Energy-efficient heating and cooling system', investment: {min: 6000, max: 10000}, valueAdd: {min: 8000, max: 12000}, impact: 70, roi: 115 },
          { title: 'New Flooring', description: 'Hardwood or high-quality laminate throughout', investment: {min: 5000, max: 8000}, valueAdd: {min: 6000, max: 10000}, impact: 65, roi: 120 }
        ]
      }
    };
  }

  if (userMessage.includes('download_pdf') || userMessage.includes('get full report')) {
    return {
      text: "I'll generate your complete property valuation report now...",
      toolCalls: [{
        id: `toolu_${Date.now()}`,
        name: 'generate_pdf_report',
        input: { property: session }
      }]
    };
  }

  // CONVERSATIONAL FLOW STEPS

  // STEP 0: Welcome
  if (msgCount === 1 && userMessage === '') {
    session.currentStep = 0;
    return {
      text: "Welcome to Rocket Valuation! I can help you get an accurate estimate of your property's value in minutes. Would you like to get started?",
      toolCalls: [],
      uiPattern: {
        type: 'chips',
        options: [
          { label: '✓ Yes, evaluate my property', value: 'start_valuation' },
          { label: 'Tell me more', value: 'learn_more' }
        ]
      },
      progress: { step: 1, total: 15, title: 'Welcome' }
    };
  }

  // STEP 1: Ask for address
  if (userMessage.includes('start_valuation') || userMessage.includes('evaluate')) {
    session.currentStep = 1;
    return {
      text: "Great! Let's start by finding your property. What's the address of the home you'd like to value?",
      toolCalls: [],
      progress: { step: 2, total: 15, title: 'Property Search' }
    };
  }

  // STEP 2: Address provided - Start detailed verification
  if (session.currentStep === 1 && /\d+/.test(userMessage) && /street|st |avenue|ave|road|rd|drive|dr|lane|ln|blvd/.test(userMessage)) {
    session.address = "123 Main St, Detroit, MI 48226";
    session.currentStep = 2;
    return {
      text: "Perfect! I found your property at 123 Main St, Detroit, MI 48226.\n\nNow let me verify the details with you. I'll go through this step-by-step to ensure accuracy.\n\n<strong>Property Type:</strong> Single Family\n\nIs this correct?",
      toolCalls: [],
      uiPattern: {
        type: 'chips',
        options: [
          { label: '✓ Correct', value: 'property_type_correct' },
          { label: 'Update', value: 'property_type_update' }
        ]
      },
      progress: { step: 3, total: 15, title: 'Verify Property Type' }
    };
  }

  // STEP 3: Property Type → Year Built
  if (userMessage.includes('property_type_correct') || userMessage.includes('property_type_update')) {
    session.currentStep = 3;
    return {
      text: "<strong>Year Built:</strong> 1950\n\nIs this correct?",
      toolCalls: [],
      uiPattern: {
        type: 'chips',
        options: [
          { label: '✓ Correct', value: 'year_built_correct' },
          { label: 'Update', value: 'year_built_update' }
        ]
      },
      progress: { step: 4, total: 15, title: 'Verify Year Built' }
    };
  }

  // STEP 4: Year Built → Square Footage
  if (userMessage.includes('year_built_correct') || userMessage.includes('year_built_update')) {
    session.currentStep = 4;
    return {
      text: "<strong>Square Footage:</strong> 1,800 sq ft\n\nIs this correct?",
      toolCalls: [],
      uiPattern: {
        type: 'chips',
        options: [
          { label: '✓ Correct', value: 'sqft_correct' },
          { label: 'Update', value: 'sqft_update' }
        ]
      },
      progress: { step: 5, total: 15, title: 'Verify Square Footage' }
    };
  }

  // STEP 5: Sqft → Bedrooms
  if (userMessage.includes('sqft_correct') || userMessage.includes('sqft_update')) {
    session.currentStep = 5;
    return {
      text: "<strong>Bedrooms:</strong> 3 bedrooms\n\nIs this correct?",
      toolCalls: [],
      uiPattern: {
        type: 'chips',
        options: [
          { label: '✓ Correct', value: 'bedrooms_correct' },
          { label: 'Update', value: 'bedrooms_update' }
        ]
      },
      progress: { step: 6, total: 15, title: 'Verify Bedrooms' }
    };
  }

  // STEP 6: Bedrooms → Bathrooms
  if (userMessage.includes('bedrooms_correct') || userMessage.includes('bedrooms_update')) {
    session.currentStep = 6;
    return {
      text: "<strong>Bathrooms:</strong> 2.5 bathrooms\n\nIs this correct?",
      toolCalls: [],
      uiPattern: {
        type: 'chips',
        options: [
          { label: '✓ Correct', value: 'bathrooms_correct' },
          { label: 'Update', value: 'bathrooms_update' }
        ]
      },
      progress: { step: 7, total: 15, title: 'Verify Bathrooms' }
    };
  }

  // STEP 7: Bathrooms → Garage
  if (userMessage.includes('bathrooms_correct') || userMessage.includes('bathrooms_update')) {
    session.currentStep = 7;
    return {
      text: "<strong>Garage:</strong> 2-car garage\n\nIs this correct?",
      toolCalls: [],
      uiPattern: {
        type: 'chips',
        options: [
          { label: '✓ Correct', value: 'garage_correct' },
          { label: 'Update', value: 'garage_update' }
        ]
      },
      progress: { step: 8, total: 15, title: 'Verify Garage' }
    };
  }

  // STEP 8: Garage → HVAC Age
  if (userMessage.includes('garage_correct') || userMessage.includes('garage_update')) {
    session.currentStep = 8;
    return {
      text: "Great! Now let's talk about key features.\n\nHow old is your HVAC system (in years)?",
      toolCalls: [],
      uiPattern: {
        type: 'chips',
        options: [
          { label: '0-5 years', value: 'hvac_0_5' },
          { label: '6-10 years', value: 'hvac_6_10' },
          { label: '11-15 years', value: 'hvac_11_15' },
          { label: '15+ years', value: 'hvac_15plus' },
          { label: 'Not sure', value: 'hvac_unknown' }
        ]
      },
      progress: { step: 9, total: 15, title: 'HVAC System Age' }
    };
  }

  // STEP 9: HVAC → Roof Age
  if (userMessage.includes('hvac_')) {
    session.hvacAge = userMessage;
    session.currentStep = 9;
    return {
      text: "How old is your roof (in years)?",
      toolCalls: [],
      uiPattern: {
        type: 'chips',
        options: [
          { label: '0-5 years', value: 'roof_0_5' },
          { label: '6-10 years', value: 'roof_6_10' },
          { label: '11-15 years', value: 'roof_11_15' },
          { label: '15+ years', value: 'roof_15plus' },
          { label: 'Not sure', value: 'roof_unknown' }
        ]
      },
      progress: { step: 10, total: 15, title: 'Roof Age' }
    };
  }

  // STEP 10: Roof → Kitchen Condition
  if (userMessage.includes('roof_')) {
    session.roofAge = userMessage;
    session.currentStep = 10;
    return {
      text: "What's the condition of your kitchen?",
      toolCalls: [],
      uiPattern: {
        type: 'chips',
        options: [
          { label: 'Original (not updated)', value: 'kitchen_original' },
          { label: 'Partially Updated', value: 'kitchen_partial' },
          { label: 'Fully Renovated', value: 'kitchen_renovated' }
        ]
      },
      progress: { step: 11, total: 15, title: 'Kitchen Condition' }
    };
  }

  // STEP 11: Kitchen → Recent Changes
  if (userMessage.includes('kitchen_')) {
    session.kitchenCondition = userMessage;
    session.currentStep = 11;
    return {
      text: "Have you made any recent improvements or renovations to the property? Select all that apply:",
      toolCalls: [],
      uiPattern: {
        type: 'chips',
        multiSelect: true,
        options: [
          { label: 'Kitchen Remodel', value: 'kitchen_remodel' },
          { label: 'Bathroom Remodel', value: 'bathroom_remodel' },
          { label: 'New Roof', value: 'new_roof' },
          { label: 'New HVAC', value: 'new_hvac' },
          { label: 'New Windows', value: 'new_windows' },
          { label: 'None', value: 'none' }
        ]
      },
      progress: { step: 12, total: 15, title: 'Recent Improvements' }
    };
  }

  // STEP 12: Changes → Offer Photo Capture
  if ((userMessage.includes('remodel') || userMessage.includes('none') || userMessage.includes('new_')) && session.currentStep === 11) {
    session.recentChanges = userMessage.split(',');
    session.currentStep = 12;
    return {
      text: "Excellent! To provide the most accurate valuation, would you like to take photos of your property?\n\nPhotos can increase accuracy by up to 15% and help me provide better recommendations.",
      toolCalls: [],
      uiPattern: {
        type: 'chips',
        options: [
          { label: '📷 Yes, take photos', value: 'take_photos' },
          { label: 'Skip photos', value: 'skip_photos' }
        ]
      },
      progress: { step: 13, total: 15, title: 'Photo Capture' }
    };
  }

  // STEP 13a: User wants photos - Guide through rooms
  if (userMessage.includes('take_photos')) {
    session.currentStep = 13;
    return {
      text: "Great! Let's capture photos of your property.\n\n<strong>Recommended photos:</strong>\n• Living room\n• Kitchen  \n• Master bedroom\n• Bathroom\n• Exterior/front of home\n\nClick the camera button (📷) at the bottom to start taking photos.\n\nWhen you're done, click 'Continue'.",
      toolCalls: [],
      uiPattern: {
        type: 'chips',
        options: [
          { label: 'Continue to valuation', value: 'continue_valuation' }
        ]
      }
    };
  }

  // STEP 13b/14: Photos done or skipped - Calculate valuation
  if (userMessage.includes('skip_photos') || userMessage.includes('continue_valuation')) {
    session.currentStep = 14;
    return {
      text: "Perfect! I now have everything I need. Let me calculate your property's estimated value...",
      toolCalls: [{
        id: `toolu_${Date.now()}`,
        name: 'calculate_property_valuation',
        input: {
          property_data: session,
          photos: []
        }
      }],
      progress: { step: 14, total: 15, title: 'Calculating Valuation' }
    };
  }

  // STEP 15: Show results with rich card (triggered after calculation tool call returns)
  if (session.currentStep === 14 && msgCount > 25) {
    session.currentStep = 15;
    return {
      text: "✓ Your property valuation is complete!",
      toolCalls: [],
      uiPattern: {
        type: 'valuation_result_card',
        data: {
          estimate: 285000,
          rangeLow: 270000,
          rangeHigh: 300000,
          confidence: 92,
          address: '123 Main St, Detroit, MI 48226',
          sqft: 1800,
          pricePerSqFt: 158,
          bedrooms: 3,
          bathrooms: 2.5
        }
      },
      progress: { step: 15, total: 15, title: 'Results Ready' }
    };
  }

  // FALLBACK
  return {
    text: "I'm here to help you value your property! Please respond to my last question or start over.",
    toolCalls: [],
    uiPattern: {
      type: 'chips',
      options: [
        { label: 'Start over', value: 'restart' }
      ]
    }
  };
}

module.exports = { generateComprehensiveResponse, getSession };
