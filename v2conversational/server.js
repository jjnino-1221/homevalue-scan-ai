const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ⚠️ MOCK MODE - Set to true to simulate Claude responses (no external API call)
const MOCK_MODE = true;

console.log(`\n🤖 Mode: ${MOCK_MODE ? 'MOCK (Simulated AI)' : 'REAL (Claude API)'}\n`);

// Initialize Anthropic client (only if not in mock mode)
let anthropic;
if (!MOCK_MODE) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('FATAL: ANTHROPIC_API_KEY not set in .env file');
    process.exit(1);
  }
  anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:8000', 'http://127.0.0.1:8000'],
  methods: ['POST', 'GET'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: 'Too many requests, please try again later' }
});
app.use('/api/', limiter);

// Request size limit
app.use(express.json({ limit: '1mb' }));

// Input validation middleware
function validateChatRequest(req, res, next) {
  const { messages, tools } = req.body;

  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages must be an array' });
  }

  if (messages.length === 0) {
    return res.status(400).json({ error: 'At least one message required' });
  }

  if (messages.length > 100) {
    return res.status(400).json({ error: 'Too many messages (max 100)' });
  }

  for (const msg of messages) {
    if (!msg.role || !['user', 'assistant'].includes(msg.role)) {
      return res.status(400).json({ error: 'Invalid message role' });
    }
    if (!msg.content) {
      return res.status(400).json({ error: 'Message content required' });
    }
    const contentStr = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content);
    if (contentStr.length > 10000) {
      return res.status(400).json({ error: 'Message content too long' });
    }
  }

  if (tools && !Array.isArray(tools)) {
    return res.status(400).json({ error: 'Tools must be an array' });
  }

  next();
}

// Mock AI response generator with interactive UI patterns
function generateMockResponse(messages) {
  const lastMessage = messages[messages.length - 1];
  const userMessage = typeof lastMessage.content === 'string' ? lastMessage.content : '';
  const conversationLength = messages.length;

  // Initial greeting with pre-known property data
  if (conversationLength === 0 || userMessage === '') {
    return {
      text: "Hello! I found a property at 123 Main St, Detroit, MI 48226 - is this what you'd like to value? Based on records, it's a 3-bedroom, 2-bathroom home built in 1950 with approximately 1,800 sq ft.",
      toolCalls: [],
      uiPattern: {
        type: 'chips',
        options: [
          { label: 'Yes, that\'s correct', value: 'confirm_address' },
          { label: 'Different property', value: 'change_address' }
        ]
      },
      progress: { step: 1, total: 5, title: 'Property Confirmation' }
    };
  }

  // Handle address confirmation
  if (conversationLength === 1 || /yes|correct|that's it|confirm/i.test(userMessage)) {
    return {
      text: "Perfect! Now let's capture more details about your home. What would you like to tell me about first?",
      toolCalls: [],
      uiPattern: {
        type: 'category-tiles',
        options: [
          { icon: '🏠', label: 'Property Basics', value: 'basics' },
          { icon: '📐', label: 'Size & Layout', value: 'size' },
          { icon: '🎨', label: 'Condition & Features', value: 'condition' },
          { icon: '📍', label: 'Location Details', value: 'location' }
        ]
      },
      progress: { step: 2, total: 5, title: 'Property Details' },
      confidence: { value: 45, message: 'Basic information confirmed' }
    };
  }

  // Extract property data if user mentions property details
  const hasPropertyInfo = /\d+\s*(bed|bath|sq|feet|street|avenue|road|drive)/i.test(userMessage);

  if (hasPropertyInfo) {
    return {
      text: "Great! Let me capture that information.",
      toolCalls: [{
        id: `toolu_${Date.now()}`,
        name: 'extract_property_data',
        input: {
          text: userMessage,
          current_data: {}
        }
      }],
      progress: { step: 3, total: 5, title: 'Gathering Details' },
      confidence: { value: 65, message: 'Property details captured' }
    };
  }

  // Handle category selection with appropriate UI
  if (/basics|property basics/i.test(userMessage)) {
    return {
      text: "Let's start with the basics. How many bedrooms does your property have?",
      toolCalls: [],
      uiPattern: {
        type: 'chips',
        options: [
          { label: '2 BR', value: '2' },
          { label: '3 BR', value: '3' },
          { label: '4 BR', value: '4' },
          { label: '5+ BR', value: '5+' }
        ]
      },
      progress: { step: 2, total: 5, title: 'Property Basics' },
      confidence: { value: 50, message: 'Capturing bedroom count' }
    };
  }

  if (/size|layout/i.test(userMessage)) {
    return {
      text: "What's the approximate square footage of your home?",
      toolCalls: [],
      uiPattern: {
        type: 'slider',
        min: 500,
        max: 5000,
        step: 100,
        default: 1800,
        unit: 'sq ft'
      },
      progress: { step: 2, total: 5, title: 'Size & Layout' },
      confidence: { value: 55, message: 'Capturing property size' }
    };
  }

  if (/condition|features/i.test(userMessage)) {
    return {
      text: "How would you rate the overall condition of your property?",
      toolCalls: [],
      uiPattern: {
        type: 'chips',
        options: [
          { label: 'Excellent', value: 'excellent' },
          { label: 'Good', value: 'good' },
          { label: 'Fair', value: 'fair' },
          { label: 'Needs Work', value: 'poor' }
        ]
      },
      progress: { step: 2, total: 5, title: 'Condition & Features' },
      confidence: { value: 60, message: 'Assessing property condition' }
    };
  }

  // Check if enough data to calculate valuation
  const hasEnoughData = conversationLength >= 4;
  const wantsValuation = /valuat|value|worth|estimate|calculate|price/i.test(userMessage);

  if (wantsValuation && hasEnoughData) {
    return {
      text: "Excellent! I have enough information to calculate your property's value. Let me run the valuation now.",
      toolCalls: [{
        id: `toolu_${Date.now()}`,
        name: 'calculate_property_valuation',
        input: {
          property_data: {
            address: { street: "123 Main St", city: "Detroit", state: "MI", zip: "48226" },
            bedrooms: 3,
            bathrooms: 2,
            sqft: 1800,
            yearBuilt: 1950
          },
          photos: []
        }
      }],
      progress: { step: 5, total: 5, title: 'Calculating Value' },
      confidence: { value: 95, message: 'Ready to calculate valuation' },
      completion: true
    };
  }

  // Progressive conversation flow
  const conversationSteps = [
    {
      text: "When was your home built?",
      uiPattern: {
        type: 'date-picker',
        yearOnly: true,
        min: 1800,
        max: new Date().getFullYear(),
        default: 1950
      },
      progress: { step: 3, total: 5, title: 'Property Age' },
      confidence: { value: 70, message: 'Capturing year built' }
    },
    {
      text: "How would you describe any recent upgrades or renovations?",
      uiPattern: {
        type: 'chips',
        multiSelect: true,
        options: [
          { label: 'Kitchen', value: 'kitchen' },
          { label: 'Bathrooms', value: 'bathrooms' },
          { label: 'Flooring', value: 'flooring' },
          { label: 'HVAC', value: 'hvac' },
          { label: 'Roof', value: 'roof' },
          { label: 'Windows', value: 'windows' }
        ]
      },
      progress: { step: 4, total: 5, title: 'Updates & Features' },
      confidence: { value: 80, message: 'Capturing improvements' }
    },
    {
      text: "Would you like me to calculate the estimated value with the information we have?",
      uiPattern: {
        type: 'chips',
        options: [
          { label: '✓ Yes, calculate now', value: 'calculate' },
          { label: 'Add more details', value: 'more_details' }
        ]
      },
      progress: { step: 4, total: 5, title: 'Ready to Calculate' },
      confidence: { value: 85, message: 'Sufficient information collected' }
    }
  ];

  const stepIndex = Math.min(conversationLength - 2, conversationSteps.length - 1);
  return conversationSteps[Math.max(0, stepIndex)];
}

// Mock streaming function
async function sendMockStream(res, mockResponse) {
  const { text, toolCalls = [], uiPattern, progress, confidence, completion } = mockResponse;

  // Send progress update first (if present)
  if (progress) {
    res.write(`data: ${JSON.stringify({ type: 'progress', data: progress })}\n\n`);
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  // Stream text word by word
  const words = text.split(' ');
  for (let i = 0; i < words.length; i++) {
    const word = words[i] + (i < words.length - 1 ? ' ' : '');
    res.write(`data: ${JSON.stringify({ type: 'text', text: word })}\n\n`);
    await new Promise(resolve => setTimeout(resolve, 50)); // 50ms delay per word
  }

  // Send UI pattern (if present)
  if (uiPattern) {
    res.write(`data: ${JSON.stringify({ type: 'ui_pattern', data: uiPattern })}\n\n`);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Send confidence meter update (if present)
  if (confidence) {
    res.write(`data: ${JSON.stringify({ type: 'confidence', data: confidence })}\n\n`);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Send tool calls if any
  for (const toolCall of toolCalls) {
    console.log(`Tool called: ${toolCall.name}`);
    res.write(`data: ${JSON.stringify({ type: 'tool_use', tool: toolCall })}\n\n`);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Send completion badge (if present)
  if (completion) {
    res.write(`data: ${JSON.stringify({ type: 'completion', message: 'Section Complete!' })}\n\n`);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // End stream
  res.write('data: [DONE]\n\n');
  res.end();
}

// Chat endpoint with streaming
app.post('/api/chat', validateChatRequest, async (req, res) => {
  console.log(`[${new Date().toISOString()}] Chat request - ${req.body.messages.length} messages`);

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    if (MOCK_MODE) {
      // Use mock responses
      const mockResponse = generateMockResponse(req.body.messages);
      await sendMockStream(res, mockResponse);
      console.log('Mock stream completed');
    } else {
      // Use real Claude API
      const stream = await anthropic.messages.stream({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        messages: req.body.messages,
        tools: req.body.tools || []
      });

      stream.on('text', (text) => {
        res.write(`data: ${JSON.stringify({ type: 'text', text })}\n\n`);
      });

      stream.on('tool_use', (tool) => {
        console.log(`Tool called: ${tool.name}`);
        res.write(`data: ${JSON.stringify({ type: 'tool_use', tool })}\n\n`);
      });

      stream.on('end', () => {
        res.write('data: [DONE]\n\n');
        res.end();
        console.log('Stream completed');
      });

      stream.on('error', (error) => {
        console.error('Stream error:', error);
        res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
        res.end();
      });
    }
  } catch (error) {
    console.error('Request error:', error);
    res.status(500).json({ error: 'Failed to create stream' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: MOCK_MODE ? 'mock' : 'real',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log('===========================================');
  console.log('🚀 Rocket Valuation V2 Proxy Server');
  console.log('===========================================');
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Mode: ${MOCK_MODE ? '🤖 MOCK (Simulated)' : '🌐 REAL (Claude API)'}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('===========================================');
});
