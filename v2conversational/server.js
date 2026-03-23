const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import enhanced conversation flow
const { generateComprehensiveResponse, getSession } = require('./server-enhanced-v2');

const app = express();
const PORT = process.env.PORT || 3001;

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
  origin: ['http://localhost:3001', 'http://127.0.0.1:3001', 'http://localhost:8001', 'http://127.0.0.1:8001'],
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
    if (msg.content === undefined || msg.content === null) {
      return res.status(400).json({ error: 'Message content required' });
    }
    // Allow empty string for initial trigger
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

// Mock AI response generator - USE ENHANCED COMPREHENSIVE FLOW
function generateMockResponse(messages) {
  return generateComprehensiveResponse(messages);
}

// Mock streaming function
async function sendMockStream(res, mockResponse) {
  const { text, toolCalls = [], uiPattern, progress, confidence, completion } = mockResponse;

  // Send progress update first (if present)
  if (progress) {
    res.write(`data: ${JSON.stringify({ type: 'progress', data: progress })}\n\n`);
    await new Promise(resolve => setTimeout(resolve, 20));
  }

  // Stream text word by word (faster for better UX)
  const words = text.split(' ');
  for (let i = 0; i < words.length; i++) {
    const word = words[i] + (i < words.length - 1 ? ' ' : '');
    res.write(`data: ${JSON.stringify({ type: 'text', text: word })}\n\n`);
    await new Promise(resolve => setTimeout(resolve, 15)); // 15ms delay per word (faster)
  }

  // Send UI pattern (if present)
  if (uiPattern) {
    res.write(`data: ${JSON.stringify({ type: 'ui_pattern', data: uiPattern })}\n\n`);
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  // Send confidence meter update (if present)
  if (confidence) {
    res.write(`data: ${JSON.stringify({ type: 'confidence', data: confidence })}\n\n`);
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  // Send tool calls if any
  for (const toolCall of toolCalls) {
    console.log(`Tool called: ${toolCall.name}`);
    res.write(`data: ${JSON.stringify({ type: 'tool_use', tool: toolCall })}\n\n`);
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  // Send completion badge (if present)
  if (completion) {
    res.write(`data: ${JSON.stringify({ type: 'completion', message: 'Section Complete!' })}\n\n`);
    await new Promise(resolve => setTimeout(resolve, 50));
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
