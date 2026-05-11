// Mock Orchestrator - Simplified conversation flow for UX testing
// No external dependencies, pure client-side mock responses

// Import only what we need
import { ChatInterface } from './chat-interface.js';
import * as InteractiveUI from './interactive-ui.js';

// Simple conversation state
let conversationState = {
  step: 0,
  path: null, // 'evaluate' or 'appraisal-check'
  propertyData: {},
  messages: []
};

// Waiver eligibility assessment
function assessWaiverEligibility() {
  const { transactionPurpose, propertyValue, propertyIssues } = conversationState.propertyData;

  // Default to may qualify
  let eligibility = 'may_qualify';
  let reasoning = [];

  // Check for property issues
  if (propertyIssues && propertyIssues !== 'issue_none') {
    eligibility = 'appraisal_required';
    reasoning.push('Property condition issues detected');
  }

  // Check property value thresholds
  if (propertyValue === 'value_over_1m') {
    eligibility = 'appraisal_required';
    reasoning.push('Property value exceeds typical waiver threshold ($1M)');
  }

  // Higher value ranges have stricter requirements
  if (propertyValue === 'value_500k_1m' && eligibility === 'may_qualify') {
    eligibility = 'may_qualify_strict';
    reasoning.push('Higher property value may require additional documentation');
  }

  // HELOC typically has stricter requirements
  if (transactionPurpose === 'purpose_heloc' && eligibility === 'may_qualify') {
    eligibility = 'may_qualify_strict';
    reasoning.push('Home equity loans often have stricter appraisal requirements');
  }

  return { eligibility, reasoning };
}

// Generate dynamic waiver assessment message
function generateWaiverMessage() {
  console.log('DEBUG: generateWaiverMessage called');
  console.log('DEBUG: propertyData:', JSON.stringify(conversationState.propertyData, null, 2));

  const assessment = assessWaiverEligibility();
  const { eligibility, reasoning } = assessment;

  console.log('DEBUG: assessment:', { eligibility, reasoning });

  let message = "Based on your transaction details, here's what I found:\n\n";

  if (eligibility === 'may_qualify') {
    message += "**Appraisal Requirement:** ✅ You may qualify for an appraisal waiver\n\n";
    message += "**GSE Programs Available:**\n";
    message += "• Fannie Mae PIW (Property Inspection Waiver)\n";
    message += "• Freddie Mac ACE (Automated Collateral Evaluation)\n\n";
    message += "**Benefits:**\n";
    message += "• Faster closing (5-7 days vs 2-3 weeks)\n";
    message += "• Lower costs (save $300-$600)\n";
    message += "• Less hassle and paperwork\n\n";
  } else if (eligibility === 'may_qualify_strict') {
    message += "**Appraisal Requirement:** ⚠️ You may qualify, but with conditions\n\n";
    message += "**Considerations:**\n";
    reasoning.forEach(reason => {
      message += `• ${reason}\n`;
    });
    message += "\n**Recommendation:** Getting a property valuation will strengthen your application and provide accurate market data.\n\n";
  } else {
    message += "**Appraisal Requirement:** ❌ An appraisal is likely required\n\n";
    message += "**Why:**\n";
    reasoning.forEach(reason => {
      message += `• ${reason}\n`;
    });
    message += "\n**Next Steps:** A professional appraisal will be needed. I can help you prepare by gathering property details upfront.\n\n";
  }

  message += "Would you like to get a formal property valuation to support your application?";

  return message;
}

// Mock conversation flow - Full 15-step verification
const CONVERSATION_STEPS = [
  {
    step: 1,
    message: "Welcome to Rocket Valuation! How can I help you today?",
    uiPattern: {
      type: 'chips',
      options: [
        { label: '✓ Yes, evaluate my property', value: 'yes_evaluate' },
        { label: '❓ Do I need an appraisal?', value: 'appraisal_check' }
      ]
    }
  },
  // Path B: Appraisal Check Flow
  {
    step: 2,
    trigger: 'appraisal_check',
    pathRequired: 'appraisal-check',
    message: "I can help you determine if an appraisal is required for your transaction. What's the purpose of your property transaction?",
    uiPattern: {
      type: 'chips',
      options: [
        { label: 'Purchase', value: 'purpose_purchase' },
        { label: 'Refinance', value: 'purpose_refinance' },
        { label: 'Home Equity (HELOC)', value: 'purpose_heloc' },
        { label: 'Other', value: 'purpose_other' }
      ]
    }
  },
  {
    step: 3,
    trigger: ['purpose_purchase', 'purpose_refinance', 'purpose_heloc', 'purpose_other'],
    pathRequired: 'appraisal-check',
    message: "What's your estimated property value?",
    uiPattern: {
      type: 'chips',
      options: [
        { label: 'Under $250,000', value: 'value_under_250k' },
        { label: '$250,000 - $500,000', value: 'value_250k_500k' },
        { label: '$500,000 - $1,000,000', value: 'value_500k_1m' },
        { label: 'Over $1,000,000', value: 'value_over_1m' }
      ]
    }
  },
  {
    step: 4,
    trigger: ['value_under_250k', 'value_250k_500k', 'value_500k_1m', 'value_over_1m'],
    pathRequired: 'appraisal-check',
    message: "Are you aware of any issues with the property? (Select all that apply)",
    uiPattern: {
      type: 'chips',
      multiSelect: true,
      options: [
        { label: 'Title issues or liens', value: 'issue_title' },
        { label: 'Structural problems', value: 'issue_structural' },
        { label: 'Water damage', value: 'issue_water' },
        { label: 'Foundation issues', value: 'issue_foundation' },
        { label: 'None', value: 'issue_none' }
      ]
    }
  },
  {
    step: 5,
    trigger: ['issue_title', 'issue_structural', 'issue_water', 'issue_foundation', 'issue_none'],
    pathRequired: 'appraisal-check',
    message: "Generating waiver assessment...", // Placeholder - will be overridden
    dynamicMessage: true, // Message will be generated based on waiver assessment
    uiPattern: {
      type: 'chips',
      options: [
        { label: '✓ Yes, evaluate my property', value: 'yes_evaluate' },
        { label: 'Learn more about waivers', value: 'learn_waivers' }
      ]
    }
  },
  {
    step: 5.1,
    trigger: 'learn_waivers',
    pathRequired: 'appraisal-check',
    message: "**Understanding Appraisal Waivers**\n\nGSE (Government-Sponsored Enterprise) appraisal waivers allow eligible borrowers to skip the traditional appraisal process:\n\n**Fannie Mae PIW (Property Inspection Waiver)**\n• Uses automated valuation models (AVMs) and property data\n• Typically requires LTV ≤ 80%\n• Property value < $1M (most cases)\n• No known property condition issues\n\n**Freddie Mac ACE (Automated Collateral Evaluation)**\n• Similar to PIW with proprietary risk models\n• Faster closing times (5-7 days vs 2-3 weeks)\n• Lower costs (saves $300-$600)\n\n**Benefits:**\n✓ Faster closings\n✓ Lower costs\n✓ Less paperwork\n✓ More convenience\n\n**When Waivers Don't Apply:**\n• High LTV ratios (> 80%)\n• Properties over $1M\n• Known condition issues\n• Non-conforming properties\n\nWould you like to proceed with a property valuation?",
    uiPattern: {
      type: 'chips',
      options: [
        { label: '✓ Yes, evaluate my property', value: 'yes_evaluate' },
        { label: 'Start over', value: 'start_over' }
      ]
    }
  },
  // Path A: Property Evaluation Flow
  {
    step: 6,
    trigger: 'yes_evaluate',
    pathRequired: 'evaluate',
    message: "Great! Which property would you like me to evaluate?",
    uiPattern: {
      type: 'chips',
      options: [
        { label: '123 Main Street, Detroit MI 48226', value: 'address_main_st' },
        { label: '456 Oak Avenue, Ann Arbor MI 48103', value: 'address_oak_ave' },
        { label: '789 Maple Drive, Grand Rapids MI 49503', value: 'address_maple_dr' }
      ]
    }
  },
  {
    step: 7,
    trigger: ['address_main_st', 'address_oak_ave', 'address_maple_dr'],
    pathRequired: 'evaluate',
    message: "Thanks! I found some public records. Let me verify a few details with you.\n\n**Property Type:** Single Family\n\nIs this correct?",
    uiPattern: {
      type: 'chips',
      options: [
        { label: '✓ Correct', value: 'correct_type' },
        { label: 'Update', value: 'update_type' }
      ]
    }
  },
  {
    step: 8,
    trigger: 'correct_type',
    pathRequired: 'evaluate',
    message: "**Year Built:** 1950\n\nIs this correct?",
    uiPattern: {
      type: 'chips',
      options: [
        { label: '✓ Correct', value: 'correct_year' },
        { label: 'Update', value: 'update_year' }
      ]
    }
  },
  {
    step: 9,
    trigger: 'correct_year',
    pathRequired: 'evaluate',
    message: "**Square Footage:** 1,800 sq ft\n\nIs this correct?",
    uiPattern: {
      type: 'chips',
      options: [
        { label: '✓ Correct', value: 'correct_sqft' },
        { label: 'Update', value: 'update_sqft' }
      ]
    }
  },
  {
    step: 10,
    trigger: 'correct_sqft',
    pathRequired: 'evaluate',
    message: "**Bedrooms:** 3 bedrooms\n\nIs this correct?",
    uiPattern: {
      type: 'chips',
      options: [
        { label: '✓ Correct', value: 'correct_beds' },
        { label: 'Update', value: 'update_beds' }
      ]
    }
  },
  {
    step: 11,
    trigger: 'correct_beds',
    pathRequired: 'evaluate',
    message: "**Bathrooms:** 2.5 bathrooms\n\nIs this correct?",
    uiPattern: {
      type: 'chips',
      options: [
        { label: '✓ Correct', value: 'correct_baths' },
        { label: 'Update', value: 'update_baths' }
      ]
    }
  },
  {
    step: 12,
    trigger: 'correct_baths',
    pathRequired: 'evaluate',
    message: "**Garage:** 2-car garage\n\nIs this correct?",
    uiPattern: {
      type: 'chips',
      options: [
        { label: '✓ Correct', value: 'correct_garage' },
        { label: 'Update', value: 'update_garage' }
      ]
    }
  },
  {
    step: 13,
    trigger: 'correct_garage',
    pathRequired: 'evaluate',
    message: "How old is your **HVAC system**?",
    uiPattern: {
      type: 'chips',
      options: [
        { label: '0-5 years', value: 'hvac_0_5' },
        { label: '6-10 years', value: 'hvac_6_10' },
        { label: '11-15 years', value: 'hvac_11_15' },
        { label: '15+ years', value: 'hvac_15_plus' }
      ]
    }
  },
  {
    step: 14,
    trigger: ['hvac_0_5', 'hvac_6_10', 'hvac_11_15', 'hvac_15_plus'],
    pathRequired: 'evaluate',
    message: "How old is your **roof**?",
    uiPattern: {
      type: 'chips',
      options: [
        { label: '0-5 years', value: 'roof_0_5' },
        { label: '6-10 years', value: 'roof_6_10' },
        { label: '11-15 years', value: 'roof_11_15' },
        { label: '15+ years', value: 'roof_15_plus' }
      ]
    }
  },
  {
    step: 15,
    trigger: ['roof_0_5', 'roof_6_10', 'roof_11_15', 'roof_15_plus'],
    pathRequired: 'evaluate',
    message: "What's the condition of your **kitchen**?",
    uiPattern: {
      type: 'chips',
      options: [
        { label: 'Original/Dated', value: 'kitchen_original' },
        { label: 'Partially Updated', value: 'kitchen_partial' },
        { label: 'Fully Renovated', value: 'kitchen_renovated' }
      ]
    }
  },
  {
    step: 16,
    trigger: ['kitchen_original', 'kitchen_partial', 'kitchen_renovated'],
    pathRequired: 'evaluate',
    message: "Have you made any **recent improvements**? (Select all that apply)",
    uiPattern: {
      type: 'chips',
      multiSelect: true,
      options: [
        { label: 'Kitchen Remodel', value: 'imp_kitchen' },
        { label: 'Bathroom Remodel', value: 'imp_bathroom' },
        { label: 'New Roof', value: 'imp_roof' },
        { label: 'New HVAC', value: 'imp_hvac' },
        { label: 'New Windows', value: 'imp_windows' },
        { label: 'None', value: 'imp_none' }
      ]
    }
  },
  {
    step: 17,
    trigger: ['imp_kitchen', 'imp_bathroom', 'imp_roof', 'imp_hvac', 'imp_windows'],
    triggerType: 'contains', // Special: trigger if lastValue CONTAINS any of these
    pathRequired: 'evaluate',
    message: "Great! Can you tell me more about these improvements?",
    uiPattern: {
      type: 'chips',
      options: [
        { label: 'Complete remodel with high-end finishes', value: 'desc_high_end' },
        { label: 'Updated fixtures and modern appliances', value: 'desc_updated' },
        { label: 'Recent upgrades within last year', value: 'desc_recent' },
        { label: 'Professional installation by licensed contractors', value: 'desc_professional' }
      ]
    }
  },
  {
    step: 18,
    trigger: ['desc_high_end', 'desc_updated', 'desc_recent', 'desc_professional', 'imp_none'],
    pathRequired: 'evaluate',
    message: "Would you like to take **photos** of your property? Photos can increase accuracy by up to 15%.",
    uiPattern: {
      type: 'chips',
      options: [
        { label: '📷 Yes, take photos', value: 'photos_yes' },
        { label: 'Skip photos', value: 'photos_no' }
      ]
    }
  },
  {
    step: 19,
    trigger: ['photos_yes', 'photos_no'],
    pathRequired: 'evaluate',
    message: "Perfect! Let me calculate your property's estimated value...",
    uiPattern: null,
    autoAdvance: true
  },
  {
    step: 20,
    pathRequired: 'evaluate',
    message: "Based on the property details and current market data, here's your valuation:",
    resultCard: {
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
    uiPattern: {
      type: 'chips',
      options: [
        { label: 'View Comparables', value: 'view_comparables' },
        { label: 'View Recommendations', value: 'view_recommendations' },
        { label: 'Download PDF Report', value: 'download_pdf' }
      ]
    }
  },
  {
    step: 21,
    trigger: 'view_comparables',
    pathRequired: 'evaluate',
    message: "Here are 3 comparable properties in your area:",
    resultCard: {
      type: 'comparables_cards',
      data: [
        { address: '145 Oak Ave', price: 275000, sqft: 1750, bedrooms: 3, bathrooms: 2, distance: 0.5 },
        { address: '89 Elm Street', price: 292000, sqft: 1850, bedrooms: 3, bathrooms: 2, distance: 0.7 },
        { address: '210 Maple Dr', price: 288000, sqft: 1800, bedrooms: 3, bathrooms: 2, distance: 0.9 }
      ]
    },
    uiPattern: {
      type: 'chips',
      options: [
        { label: 'View Recommendations', value: 'view_recommendations' },
        { label: 'Download PDF Report', value: 'download_pdf' },
        { label: 'Start New Evaluation', value: 'start_over' }
      ]
    }
  },
  {
    step: 22,
    trigger: 'view_recommendations',
    pathRequired: 'evaluate',
    message: "Based on your property analysis, here are my top improvement recommendations:",
    resultCard: {
      type: 'recommendations_cards',
      data: {
        summary: {
          count: 5,
          valueIncrease: {
            min: 35000,
            max: 55000
          }
        },
        recommendations: [
          { title: 'Kitchen Update', description: 'Modernize with new appliances and countertops', investmentRange: [15000, 25000], valueAdd: [20000, 30000], roi: 120, impactScore: 95 },
          { title: 'Bathroom Refresh', description: 'Update fixtures and add modern finishes', investmentRange: [8000, 15000], valueAdd: [10000, 18000], roi: 125, impactScore: 88 },
          { title: 'Curb Appeal', description: 'Landscaping and exterior improvements', investmentRange: [3000, 8000], valueAdd: [5000, 12000], roi: 150, impactScore: 82 },
          { title: 'HVAC Upgrade', description: 'Install energy-efficient system', investmentRange: [6000, 12000], valueAdd: [8000, 15000], roi: 115, impactScore: 78 },
          { title: 'Flooring Update', description: 'Replace with hardwood or quality laminate', investmentRange: [5000, 10000], valueAdd: [6000, 12000], roi: 120, impactScore: 75 }
        ]
      }
    },
    uiPattern: {
      type: 'chips',
      options: [
        { label: 'View Comparables', value: 'view_comparables' },
        { label: 'Download PDF Report', value: 'download_pdf' },
        { label: 'Start New Evaluation', value: 'start_over' }
      ]
    }
  }
];

// Start new conversation
export function startNewConversation() {
  conversationState = {
    step: 0,
    path: null,
    propertyData: {},
    messages: []
  };
  console.log('Mock conversation started');
}

// Send message (simplified - just advances through steps)
export async function sendMessage(userMessage, skipUserMessage = false) {
  console.log('Mock: User said:', userMessage);

  // Add user message to state (but don't display if skipUserMessage is true)
  if (userMessage && !skipUserMessage) {
    conversationState.messages.push({
      role: 'user',
      content: userMessage
    });
    ChatInterface.appendMessage('user', userMessage);
  }

  // Show typing indicator
  ChatInterface.showTypingIndicator();

  // Wait a bit to simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));

  // Get next step
  const nextStep = getNextStep(userMessage);

  if (!nextStep) {
    ChatInterface.hideTypingIndicator();
    ChatInterface.appendMessage('assistant', "Thanks for using Rocket Valuation! Would you like to start a new evaluation?");
    return;
  }

  // Hide typing indicator
  ChatInterface.hideTypingIndicator();

  // Generate dynamic message if needed
  let messageToDisplay = nextStep.message;
  if (nextStep.dynamicMessage) {
    messageToDisplay = generateWaiverMessage();
    console.log('DEBUG: Generated dynamic waiver message');
  }

  // Show assistant message
  ChatInterface.appendMessage('assistant', messageToDisplay);

  // Add to state
  conversationState.messages.push({
    role: 'assistant',
    content: messageToDisplay
  });

  // Show result card if present
  if (nextStep.resultCard) {
    ChatInterface.appendResultCard(nextStep.resultCard.type, nextStep.resultCard.data);
  }

  // Show interactive UI if present
  if (nextStep.uiPattern) {
    ChatInterface.appendInteractiveUI(nextStep.uiPattern);
  }

  // Auto-advance if needed
  if (nextStep.autoAdvance) {
    console.log('DEBUG: Auto-advance enabled, will continue in 1.5 seconds...');
    setTimeout(() => {
      console.log('DEBUG: Auto-advance triggered, sending empty message to continue');
      sendMessage(''); // Continue to next step
    }, 1500);
  }

  // Advance step counter
  const previousStep = conversationState.step;
  conversationState.step++;
  console.log('DEBUG: Step counter advanced from', previousStep, 'to', conversationState.step);
}

// Send message with custom display (for button clicks)
export async function sendMessageWithDisplay(value, displayText) {
  console.log('Mock: User selected:', value, '(display:', displayText + ')');
  console.log('DEBUG: Setting lastValue to:', value);

  // Show user's selection
  ChatInterface.appendMessage('user', displayText);

  // Store the value for matching
  conversationState.lastValue = value;
  console.log('DEBUG: conversationState.lastValue is now:', conversationState.lastValue);

  // Store property data for Path B
  if (conversationState.path === 'appraisal-check') {
    if (value.startsWith('purpose_')) {
      conversationState.propertyData.transactionPurpose = value;
      console.log('DEBUG: Stored transaction purpose:', value);
    } else if (value.startsWith('value_')) {
      conversationState.propertyData.propertyValue = value;
      console.log('DEBUG: Stored property value:', value);
    } else if (value.startsWith('issue_')) {
      conversationState.propertyData.propertyIssues = value;
      console.log('DEBUG: Stored property issues:', value);
    }
  }

  // Continue conversation (skip displaying the value again)
  await sendMessage(value, true); // skipUserMessage = true
}

// Get next step based on user input
function getNextStep(userInput) {
  const currentStep = conversationState.step;
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('DEBUG: getNextStep called');
  console.log('  currentStep:', currentStep);
  console.log('  currentPath:', conversationState.path);
  console.log('  lastValue:', conversationState.lastValue);
  console.log('  looking for step:', currentStep + 1);

  // Set path based on user selection
  if (conversationState.lastValue === 'yes_evaluate') {
    conversationState.path = 'evaluate';
    console.log('DEBUG: Path set to "evaluate"');
  } else if (conversationState.lastValue === 'appraisal_check') {
    conversationState.path = 'appraisal-check';
    console.log('DEBUG: Path set to "appraisal-check"');
  }

  // First message - show welcome
  if (currentStep === 0) {
    console.log('DEBUG: Returning welcome step (step 1)');
    return CONVERSATION_STEPS[0];
  }

  // Handle "Update" button clicks - treat as if user confirmed and continue
  if (conversationState.lastValue && conversationState.lastValue.startsWith('update_')) {
    console.log('DEBUG: User clicked "Update" button, treating as confirmed and continuing...');
    // For mock purposes, just continue to next step as if they confirmed
    // In real implementation, this would prompt for correction
    const fieldName = conversationState.lastValue.replace('update_', '');
    conversationState.lastValue = 'correct_' + fieldName; // Convert update to correct
    console.log('DEBUG: Converted', 'update_' + fieldName, 'to', conversationState.lastValue, 'for flow continuation');
  }

  // Log if this is a multi-select value (contains commas)
  if (conversationState.lastValue && conversationState.lastValue.includes(',')) {
    console.log('DEBUG: Multi-select value detected:', conversationState.lastValue);
  }

  // Find next step based on trigger or sequence
  // Check steps starting from currentStep + 1 and look ahead if needed
  for (const step of CONVERSATION_STEPS) {
    // Only consider steps after current step
    if (step.step <= currentStep) {
      continue;
    }

    console.log('DEBUG: Checking step:', step.step);
    console.log('  step.trigger:', step.trigger);
    console.log('  step.pathRequired:', step.pathRequired);
    console.log('  step.message preview:', step.message.substring(0, 50) + '...');

    // Skip steps that require a different path
    if (step.pathRequired && step.pathRequired !== conversationState.path) {
      console.log('❌ DEBUG: Step requires path "' + step.pathRequired + '", but current path is "' + conversationState.path + '", skipping...');
      continue;
    }

    // Check if it needs a specific trigger
    if (step.trigger) {
      // Handle special "contains" trigger type (for multi-select values)
      if (step.triggerType === 'contains') {
        console.log('DEBUG: Step has "contains" trigger type');
        console.log('  Checking if lastValue contains any of:', step.trigger);
        const lastValue = conversationState.lastValue || '';
        // Check if any of the trigger values are contained in lastValue
        const matched = step.trigger.some(triggerVal => lastValue.includes(triggerVal));
        if (matched) {
          console.log('✅ DEBUG: Contains trigger MATCHED! Returning step', step.step);
          return step;
        }
        console.log('❌ DEBUG: Contains trigger did NOT match, continuing search...');
        continue;
      }

      // Handle array of triggers (OR condition)
      if (Array.isArray(step.trigger)) {
        console.log('DEBUG: Step has array trigger:', step.trigger);
        console.log('  Checking if array includes lastValue:', conversationState.lastValue);
        if (step.trigger.includes(conversationState.lastValue)) {
          console.log('✅ DEBUG: Array trigger MATCHED! Returning step', step.step);
          return step;
        }
        console.log('❌ DEBUG: Array trigger did NOT match, continuing search...');
        continue;
      }
      // Handle single trigger
      console.log('DEBUG: Step has single trigger:', step.trigger);
      console.log('  Comparing:', step.trigger, '===', conversationState.lastValue);
      if (conversationState.lastValue === step.trigger) {
        console.log('✅ DEBUG: Single trigger MATCHED! Returning step', step.step);
        return step;
      }
      console.log('❌ DEBUG: Single trigger did NOT match, continuing search...');
      // Continue searching for matching step
      continue;
    }

    // If step has no trigger requirement, use it
    console.log('✅ DEBUG: No trigger required for this step, returning step', step.step);
    return step;
  }

  console.log('❌ DEBUG: No matching step found, returning null (end of conversation)');
  return null; // End of conversation
}

// Get conversation state
export function getConversationState() {
  return conversationState;
}

// Check for resume (not implemented in mock)
export function checkForResumeConversation() {
  return null;
}

// Load conversation (not implemented in mock)
export function loadConversationState(id) {
  return false;
}

// Export as AIOrchestrator for compatibility
export const AIOrchestrator = {
  sendMessage,
  sendMessageWithDisplay,
  startNewConversation,
  loadConversationState,
  checkForResumeConversation,
  getConversationState
};

// Make available globally
window.AIOrchestrator = AIOrchestrator;

console.log('Mock AIOrchestrator loaded');
