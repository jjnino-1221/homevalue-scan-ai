// AI Orchestrator - Claude API client with streaming and tool calling
// Manages conversation state, tool execution, and localStorage persistence

import { ChatInterface } from './chat-interface.js';
import * as InteractiveUI from './interactive-ui.js';

// Conversation state
let conversationState = {
  id: generateUUID(),
  version: 2,
  stage: 'greeting',
  messages: [],
  propertyData: {},
  photos: [],
  valuation: null,
  recommendations: [],
  metadata: {
    startedAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString(),
    completedAt: null,
    deviceInfo: {
      hasCamera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
      hasVoice: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
      browser: getBrowserInfo()
    }
  }
};

// Claude tool definitions
const tools = [
  {
    name: 'extract_property_data',
    description: 'Extract structured property information from user natural language input. Returns extracted fields with confidence scores.',
    input_schema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'User message text to extract from'
        },
        current_data: {
          type: 'object',
          description: 'Current property data to merge with'
        }
      },
      required: ['text']
    }
  },
  {
    name: 'request_photo_capture',
    description: 'Opens guided camera modal for user to capture room photos. Returns immediately with status.',
    input_schema: {
      type: 'object',
      properties: {
        room_type: {
          type: 'string',
          description: 'Type of room to capture (kitchen, bathroom, living_room, bedroom, exterior)'
        },
        instruction: {
          type: 'string',
          description: 'Specific guidance for what to capture'
        }
      },
      required: ['room_type']
    }
  },
  {
    name: 'calculate_property_valuation',
    description: 'Calculate property value estimate using collected data. Calls V1 ValuationEngine.',
    input_schema: {
      type: 'object',
      properties: {
        property_data: {
          type: 'object',
          description: 'Complete property information'
        },
        photos: {
          type: 'array',
          description: 'Array of captured photos (stored for record-keeping)'
        }
      },
      required: ['property_data']
    }
  },
  {
    name: 'generate_improvement_recommendations',
    description: 'Generate prioritized home improvement recommendations. Calls V1 RecommendationEngine.',
    input_schema: {
      type: 'object',
      properties: {
        property_data: {
          type: 'object',
          description: 'Property information'
        },
        valuation: {
          type: 'object',
          description: 'Current valuation results'
        }
      },
      required: ['property_data', 'valuation']
    }
  },
  {
    name: 'get_property_comparables',
    description: 'Fetch detailed comparable properties for follow-up questions.',
    input_schema: {
      type: 'object',
      properties: {
        address: {
          type: 'object',
          description: 'Property address'
        },
        filters: {
          type: 'object',
          description: 'Optional filters (radius, bedrooms, sqft_range)'
        }
      },
      required: ['address']
    }
  }
];

// Send message to Claude API with streaming
export async function sendMessage(userMessage) {
  // Add user message to conversation (skip if empty continuation)
  if (userMessage) {
    conversationState.messages.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    });

    ChatInterface.appendMessage('user', userMessage);
  }

  // Show typing indicator
  ChatInterface.showTypingIndicator();

  try {
    // Prepare messages for Claude API
    const apiMessages = conversationState.messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    // Use fetch with streaming (not EventSource - POST required)
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: apiMessages,
        tools: tools
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Process streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let currentAssistantMessage = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Decode chunk and add to buffer
      buffer += decoder.decode(value, { stream: true });

      // Process complete SSE messages (ending with \n\n)
      const lines = buffer.split('\n\n');
      buffer = lines.pop(); // Keep incomplete message in buffer

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;

        const dataStr = line.slice(6); // Remove 'data: ' prefix
        if (dataStr === '[DONE]') {
          // Stream complete - save assistant message
          if (currentAssistantMessage) {
            conversationState.messages.push({
              role: 'assistant',
              content: currentAssistantMessage,
              timestamp: new Date().toISOString()
            });
          }
          ChatInterface.hideTypingIndicator();
          saveConversationState();
          return;
        }

        const data = JSON.parse(dataStr);

        if (data.type === 'progress') {
          // Update progress bar
          InteractiveUI.updateProgress(data.data);
        }
        else if (data.type === 'text') {
          // Append text to current message with typing effect
          currentAssistantMessage += data.text;
          ChatInterface.appendToCurrentMessage(data.text);
        }
        else if (data.type === 'ui_pattern') {
          // Render interactive UI element
          ChatInterface.appendInteractiveUI(data.data);
        }
        else if (data.type === 'confidence') {
          // Show confidence meter
          ChatInterface.appendConfidenceMeter(data.data);
        }
        else if (data.type === 'completion') {
          // Show completion badge
          ChatInterface.appendCompletionBadge(data.message);
        }
        else if (data.type === 'tool_use') {
          // Execute tool locally, then continue conversation
          ChatInterface.hideTypingIndicator();
          console.log(`Tool called: ${data.tool.name}`, data.tool.input);

          const toolResult = await executeTool(data.tool);

          // Add tool use and result to conversation history
          conversationState.messages.push({
            role: 'assistant',
            content: [
              { type: 'text', text: currentAssistantMessage },
              { type: 'tool_use', id: data.tool.id, name: data.tool.name, input: data.tool.input }
            ],
            timestamp: new Date().toISOString()
          });

          conversationState.messages.push({
            role: 'user',
            content: [
              {
                type: 'tool_result',
                tool_use_id: data.tool.id,
                content: JSON.stringify(toolResult)
              }
            ],
            timestamp: new Date().toISOString()
          });

          saveConversationState();

          // Continue conversation with tool result (recursive call)
          return sendMessage(''); // Empty message to continue with tool context
        }
        else if (data.type === 'error') {
          throw new Error(data.error);
        }
      }
    }
  } catch (error) {
    ChatInterface.hideTypingIndicator();
    ChatInterface.showError('Connection error. Please try again.');
    console.error('Stream error:', error);
  }
}

// Execute tool based on name
async function executeTool(tool) {
  switch (tool.name) {
    case 'extract_property_data':
      return extractPropertyData(tool.input);

    case 'request_photo_capture':
      // TODO: Open camera modal in Phase 3
      console.log('Camera modal would open for:', tool.input.room_type);
      return { status: 'modal_opened', room: tool.input.room_type };

    case 'calculate_property_valuation':
      // TODO: Call V1 ValuationEngine in Phase 4
      console.log('Calculating valuation for:', tool.input.property_data);
      const mockValuation = {
        estimate: 285000,
        rangeLow: 270000,
        rangeHigh: 300000,
        confidence: 0.85,
        comparables: []
      };
      conversationState.valuation = mockValuation;
      return mockValuation;

    case 'generate_improvement_recommendations':
      // TODO: Call V1 RecommendationEngine in Phase 4
      console.log('Generating recommendations');
      const mockRecommendations = [
        {
          id: generateUUID(),
          category: 'curb_appeal',
          priority: 'high',
          title: 'Exterior Paint',
          description: 'Fresh paint increases curb appeal',
          costRange: { min: 3000, max: 6000 },
          impactScore: 85,
          roiEstimate: 1.5
        }
      ];
      conversationState.recommendations = mockRecommendations;
      return { recommendations: mockRecommendations };

    case 'get_property_comparables':
      // TODO: Fetch real comparables in Phase 4
      console.log('Fetching comparables for:', tool.input.address);
      return { comparables: [] };

    default:
      throw new Error(`Unknown tool: ${tool.name}`);
  }
}

// Extract property data from natural language
function extractPropertyData({ text, current_data = {} }) {
  const extracted = {};
  const confidences = {};

  // Address extraction
  const addressPatterns = [
    /(\d+)\s+([A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd))/i,
    /(\d+)\s+([A-Za-z0-9\s]+),\s*([A-Za-z\s]+),\s*([A-Z]{2})\s*(\d{5})/i
  ];

  for (const pattern of addressPatterns) {
    const match = text.match(pattern);
    if (match) {
      extracted.address = { street: match[0] };
      confidences.address = 0.9;
      break;
    }
  }

  // Numeric field extraction
  const bedroomMatch = text.match(/(\d+)\s*(bed(?:room)?s?|br)/i);
  if (bedroomMatch) {
    extracted.bedrooms = parseInt(bedroomMatch[1]);
    confidences.bedrooms = bedroomMatch[2].includes('bedroom') ? 0.95 : 0.85;
  }

  const bathroomMatch = text.match(/(\d+(?:\.\d+)?)\s*(bath(?:room)?s?|ba)/i);
  if (bathroomMatch) {
    extracted.bathrooms = parseFloat(bathroomMatch[1]);
    confidences.bathrooms = bathroomMatch[2].includes('bathroom') ? 0.95 : 0.85;
  }

  const sqftMatch = text.match(/(\d{3,5})\s*(?:sq\.?\s*ft\.?|square\s*feet|sqft)/i);
  if (sqftMatch) {
    extracted.sqft = parseInt(sqftMatch[1]);
    confidences.sqft = 0.9;
  }

  const yearMatch = text.match(/(?:built|built in|from)\s*(\d{4})/i);
  if (yearMatch) {
    const year = parseInt(yearMatch[1]);
    if (year >= 1800 && year <= 2026) {
      extracted.yearBuilt = year;
      confidences.yearBuilt = 0.85;
    }
  }

  // Condition assessment
  const conditionKeywords = {
    'excellent': { value: 'excellent', confidence: 0.7 },
    'great': { value: 'good', confidence: 0.65 },
    'good': { value: 'good', confidence: 0.75 },
    'fair': { value: 'fair', confidence: 0.75 },
    'needs work': { value: 'poor', confidence: 0.7 },
    'fixer': { value: 'poor', confidence: 0.65 }
  };

  for (const [keyword, data] of Object.entries(conditionKeywords)) {
    if (text.toLowerCase().includes(keyword)) {
      extracted.condition = data.value;
      confidences.condition = data.confidence;
      break;
    }
  }

  // Merge with current data
  const merged = { ...current_data };
  for (const [field, value] of Object.entries(extracted)) {
    if (!merged[field] || confidences[field] > (merged[field].confidence || 0)) {
      merged[field] = { value, confidence: confidences[field] };
    }
  }

  // Update conversationState
  conversationState.propertyData = merged;

  // Calculate overall confidence
  const allConfidences = Object.values(confidences);
  const overallConfidence = allConfidences.length > 0
    ? allConfidences.reduce((a, b) => a + b, 0) / allConfidences.length
    : 0;

  return {
    extracted: merged,
    confidence: overallConfidence
  };
}

// Save conversation state to localStorage
function saveConversationState() {
  try {
    conversationState.metadata.lastUpdatedAt = new Date().toISOString();
    const key = `rocket_valuation_v2_${conversationState.id}`;
    localStorage.setItem(key, JSON.stringify(conversationState));
    console.log('Conversation saved:', key);
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.error('Storage quota exceeded');
      ChatInterface.showError('Browser storage full. Please complete this valuation.');
    } else {
      console.error('Error saving conversation:', error);
    }
  }
}

// Load conversation state from localStorage
export function loadConversationState(conversationId) {
  try {
    const key = `rocket_valuation_v2_${conversationId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      conversationState = JSON.parse(saved);
      console.log('Conversation loaded:', key);
      return true;
    }
  } catch (error) {
    console.error('Error loading conversation:', error);
  }
  return false;
}

// Check for recent conversation to resume
export function checkForResumeConversation() {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('rocket_valuation_v2_'));

  if (keys.length === 0) return null;

  // Find most recent conversation < 24 hours old
  const conversations = keys.map(key => {
    try {
      const data = JSON.parse(localStorage.getItem(key));
      return { key, data };
    } catch {
      return null;
    }
  }).filter(Boolean);

  const recent = conversations
    .filter(c => {
      const age = Date.now() - new Date(c.data.metadata.lastUpdatedAt).getTime();
      return age < 24 * 60 * 60 * 1000; // < 24 hours
    })
    .sort((a, b) => new Date(b.data.metadata.lastUpdatedAt) - new Date(a.data.metadata.lastUpdatedAt))[0];

  return recent ? recent.data : null;
}

// Start new conversation
export function startNewConversation() {
  conversationState = {
    id: generateUUID(),
    version: 2,
    stage: 'greeting',
    messages: [],
    propertyData: {},
    photos: [],
    valuation: null,
    recommendations: [],
    metadata: {
      startedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      completedAt: null,
      deviceInfo: conversationState.metadata.deviceInfo // Keep device info
    }
  };

  // Send initial greeting
  sendMessage('');
}

// Get current conversation state
export function getConversationState() {
  return conversationState;
}

// Utility: Generate UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Utility: Get browser info
function getBrowserInfo() {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  return 'Unknown';
}

// Initialize on load
window.AIOrchestrator = {
  sendMessage,
  startNewConversation,
  loadConversationState,
  checkForResumeConversation,
  getConversationState
};
