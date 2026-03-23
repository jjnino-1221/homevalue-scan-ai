// App Initialization - Loads on page start
// Checks for resume conversations and starts the chat

import { ChatInterface } from './chat-interface.js';
import { CameraModal } from './camera-modal.js';
import { VoiceHandler } from './voice-handler.js';

// Initialize app on DOM load
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Rocket Valuation V2 - Initializing...');

  // Check for existing conversation to resume
  const recentConversation = window.AIOrchestrator.checkForResumeConversation();

  if (recentConversation) {
    console.log('Found recent conversation:', recentConversation.id);
    showResumeBanner(recentConversation);
  } else {
    // Show welcome message but DON'T auto-start
    // User must actively engage to begin
    showWelcomeMessage();
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

// Show initial welcome message (with AI chips)
function showWelcomeMessage() {
  console.log('Showing welcome message');
  ChatInterface.clearMessages();

  // Initialize conversation state and send initial AI message with chips
  window.AIOrchestrator.startNewConversation();

  // Send empty message to trigger Step 1 with chips
  window.AIOrchestrator.sendMessage('');
}

// Start fresh conversation
function startFreshConversation() {
  console.log('Starting fresh conversation');

  // Clear any saved conversation data
  const conversationState = window.AIOrchestrator.getConversationState();
  if (conversationState && conversationState.id) {
    const prefix = 'rocket_valuation_v2_';
    const key = `${prefix}${conversationState.id}`;
    localStorage.removeItem(key);
  }

  // Show welcome message (same as initial load)
  showWelcomeMessage();
}

// Setup event listeners
function setupEventListeners() {
  // Voice button
  const voiceButton = document.getElementById('voiceToggle');
  const messageInput = document.getElementById('messageInput');
  const inputWrapper = document.querySelector('.input-wrapper');
  let interimTranscriptElement = null;

  if (voiceButton) {
    // Check if voice is supported
    if (!VoiceHandler.isSupported) {
      voiceButton.disabled = true;
      voiceButton.title = 'Voice input not supported in this browser';
      return;
    }

    // Set up transcription callback
    VoiceHandler.onTranscription((event) => {
      switch (event.type) {
        case 'start':
          // Voice started
          voiceButton.classList.add('listening');
          messageInput.classList.add('voice-active');
          messageInput.placeholder = 'Listening...';
          break;

        case 'interim':
          // Show interim transcript
          if (!interimTranscriptElement) {
            interimTranscriptElement = document.createElement('div');
            interimTranscriptElement.className = 'interim-transcript';
            inputWrapper.appendChild(interimTranscriptElement);
          }
          interimTranscriptElement.textContent = event.transcript;
          break;

        case 'final':
          // Final transcript - send to AI
          if (interimTranscriptElement) {
            interimTranscriptElement.remove();
            interimTranscriptElement = null;
          }

          if (event.transcript && event.transcript.trim()) {
            // Send to AI orchestrator
            window.AIOrchestrator.sendMessage(event.transcript.trim());
          }
          break;

        case 'end':
          // Voice stopped
          voiceButton.classList.remove('listening');
          messageInput.classList.remove('voice-active');
          messageInput.placeholder = 'Type your message...';

          if (interimTranscriptElement) {
            interimTranscriptElement.remove();
            interimTranscriptElement = null;
          }
          break;

        case 'error':
          // Voice error
          voiceButton.classList.remove('listening');
          voiceButton.classList.add('error');
          messageInput.classList.remove('voice-active');
          messageInput.placeholder = 'Type your message...';

          if (interimTranscriptElement) {
            interimTranscriptElement.remove();
            interimTranscriptElement = null;
          }

          ChatInterface.showError(event.error);

          // Remove error state after 3 seconds
          setTimeout(() => {
            voiceButton.classList.remove('error');
          }, 3000);
          break;
      }
    });

    // Toggle voice on button click
    voiceButton.addEventListener('click', () => {
      const success = VoiceHandler.toggleListening();

      if (!success && !VoiceHandler.getState().isListening) {
        // Failed to start
        ChatInterface.showError('Unable to start voice input');
      }
    });
  }

  // Camera button
  const cameraButton = document.getElementById('cameraButton');
  if (cameraButton) {
    cameraButton.addEventListener('click', () => {
      // Open camera modal for general room photos
      CameraModal.onPhotosCaptured((photos, roomType) => {
        if (photos.length > 0) {
          ChatInterface.showSystemMessage(`📷 ${photos.length} photo(s) captured for ${roomType}!`);

          // Store photos in conversation state
          const state = window.AIOrchestrator.getConversationState();
          state.photos.push({
            roomType: roomType,
            photos: photos,
            timestamp: new Date().toISOString()
          });
        }
      });

      CameraModal.open('living_room', 'Capture photos of your property to improve valuation accuracy.');
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
