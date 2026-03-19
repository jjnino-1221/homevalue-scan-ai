# Rocket Valuation V2 - Conversational AI

ChatGPT-style conversational property valuation experience powered by Claude API.

## Quick Start

### 1. Start the Server
```bash
cd v2conversational
npm start
```
Server runs on: http://localhost:3000

### 2. Open the Chat Interface
Open `index.html` in Chrome:
```bash
# Option A: Direct file
start index.html

# Option B: Local server (recommended)
python -m http.server 8000
# Then visit: http://localhost:8000
```

### 3. Test the Connection
Health check: http://localhost:3000/health

## Project Structure

```
v2conversational/
├── index.html          # Chat interface
├── server.js           # Express proxy (secures API key)
├── .env                # API key (NEVER commit!)
├── package.json        # Dependencies
├── js/                 # Client-side modules (TODO: Phase 2)
│   ├── chat-interface.js
│   ├── ai-orchestrator.js
│   ├── voice-handler.js
│   └── camera-modal.js
└── css/
    └── chat.css        # Chat styling
```

## Current Status

### ✅ Phase 1: Foundation (COMPLETE)
- [x] Project structure created
- [x] Dependencies installed (381 packages)
- [x] Express server with security (rate limiting, CORS, validation)
- [x] HTML layout with modal overlay
- [x] Complete CSS styling
- [x] API key configured
- [x] Server running successfully

### 🚧 Phase 2: Core Conversation (NEXT)
- [ ] Build ai-orchestrator.js (Claude API client)
- [ ] Implement 5 tools (extract, photo, valuation, recommendations, comparables)
- [ ] Create chat-interface.js (message rendering)
- [ ] Add localStorage state management
- [ ] Test full conversation flow

### 📅 Phase 3: Camera & Voice
- [ ] Camera modal functionality
- [ ] Web Speech API integration

### 📅 Phase 4: Results & Polish
- [ ] Inline rich cards
- [ ] V1 engine integration
- [ ] Rocket Nova styling

## API Usage

- **Free Credit**: $5 from Anthropic
- **Estimated Cost**: $0.02-0.05 per conversation
- **Budget**: ~100-250 test conversations
- **Monitor**: https://console.anthropic.com/usage

## Development Commands

```bash
npm start              # Start server
npm run dev           # Start with auto-reload (nodemon)
npm test              # Run tests (when implemented)
```

## Security Notes

⚠️ **IMPORTANT**:
- Never commit `.env` file
- API key only visible to localhost
- Rate limited: 50 requests per 15 minutes
- CORS restricted to localhost origins

## Documentation

Full design spec: `docs/superpowers/specs/2026-03-18-v2-conversational-ai-design.md`

## Next Steps

1. Build JavaScript modules (Phase 2)
2. Test Claude API streaming
3. Implement tool calling
4. Add conversation state management

---

Built with Claude API, Express.js, and vanilla JavaScript.
