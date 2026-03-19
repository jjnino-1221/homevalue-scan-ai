// App Initialization - Loads on page start
// Checks for resume conversations and starts the chat

import { ChatInterface } from './chat-interface.js';

// Initialize app on DOM load
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Rocket Valuation V2 - Initializing...');

  // Check for existing conversation to resume
  const recentConversation = window.AIOrchestrator.checkForResumeConversation();

  if (recentConversation) {
    console.log('Found recent conversation:', recentConversation.id);
    showResumeBanner(recentConversation);
  } else {
    // Start new conversation immediately
    startFreshConversation();
  }

  // Set up event listeners
  setupEventListeners();
});

// Show resume conversation banner
function showResumeBanner(conversation) {
  const banner = document.getElementById('resumeBanner');
  const resumeButton = document.getElementById('resumeButton');
  const startFreshButton = document.getElementById('startFreshButton');

  banner.style.display = 'block';

  resumeButton.onclick = () => {
    banner.style.display = 'none';
    resumeConversation(conversation);
  };

  startFreshButton.onclick = () => {
    banner.style.display = 'none';
    startFreshConversation();
  };
}

// Resume existing conversation
function resumeConversation(conversation) {
  console.log('Resuming conversation:', conversation.id);

  // Load conversation state
  window.AIOrchestrator.loadConversationState(conversation.id);

  // Restore messages in UI
  ChatInterface.clearMessages();
  const state = window.AIOrchestrator.getConversationState();

  for (const message of state.messages) {
    if (typeof message.content === 'string') {
      ChatInterface.appendMessage(message.role, message.content);
    } else if (Array.isArray(message.content)) {
      // Handle tool messages
      const textContent = message.content.find(c => c.type === 'text');
      if (textContent) {
        ChatInterface.appendMessage(message.role, textContent.text);
      }
    }
  }

  ChatInterface.showSystemMessage('💬 Conversation resumed. Continue where you left off!');
  ChatInterface.scrollToBottom();
}

// Start fresh conversation
function startFreshConversation() {
  console.log('Starting fresh conversation');
  ChatInterface.clearMessages();
  window.AIOrchestrator.startNewConversation();
}

// Setup event listeners
function setupEventListeners() {
  // Voice button (Phase 3)
  const voiceButton = document.getElementById('voiceToggle');
  if (voiceButton) {
    voiceButton.addEventListener('click', () => {
      console.log('Voice feature coming in Phase 3');
      ChatInterface.showSystemMessage('🎤 Voice input coming soon!');
    });
  }

  // Camera button (Phase 3)
  const cameraButton = document.getElementById('cameraButton');
  if (cameraButton) {
    cameraButton.addEventListener('click', () => {
      console.log('Camera feature coming in Phase 3');
      ChatInterface.showSystemMessage('📷 Photo capture coming soon!');
    });
  }

  // Profile button
  const profileButton = document.getElementById('profileButton');
  if (profileButton) {
    profileButton.addEventListener('click', () => {
      showProfile();
    });
  }
}

// Show profile/conversation info
function showProfile() {
  const state = window.AIOrchestrator.getConversationState();
  const info = `
Conversation ID: ${state.id}
Stage: ${state.stage}
Messages: ${state.messages.length}
Started: ${new Date(state.metadata.startedAt).toLocaleString()}
Browser: ${state.metadata.deviceInfo.browser}
Camera: ${state.metadata.deviceInfo.hasCamera ? 'Available' : 'Not available'}
Voice: ${state.metadata.deviceInfo.hasVoice ? 'Available' : 'Not available'}
  `.trim();

  alert(info);
}

console.log('✅ App initialized');
