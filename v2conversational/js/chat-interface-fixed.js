// Chat Interface - Message rendering and user input handling
// Manages message bubbles, typing indicators, and scroll behavior

import * as InteractiveUI from './interactive-ui.js';
import * as ResultCards from './result-cards.js';
import { Security } from './security.js';

// DOM elements - will be initialized after DOM is ready
let messagesContainer;
let messageInput;
let sendButton;
let typingIndicator;

let currentMessageElement = null;
let currentInteractiveContainer = null;
let isInitialized = false;

// Initialize DOM references (call this after DOMContentLoaded)
function initializeDOMReferences() {
  if (isInitialized) return true;

  messagesContainer = document.getElementById('messagesContainer');
  messageInput = document.getElementById('messageInput');
  sendButton = document.getElementById('sendButton');
  typingIndicator = document.getElementById('typingIndicator');

  if (!messagesContainer || !messageInput || !sendButton || !typingIndicator) {
    console.error('ChatInterface: Required DOM elements not found');
    return false;
  }

  // Set up event listeners
  setupEventListeners();

  isInitialized = true;
  console.log('ChatInterface initialized successfully');
  return true;
}

// Set up event listeners (called once during initialization)
function setupEventListeners() {
  // Handle send button click
  sendButton.addEventListener('click', handleSendMessage);

  // Handle Enter key in input
  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });

  // Auto-resize textarea
  messageInput.addEventListener('input', () => {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
  });
}

// Ensure initialized before operations
function ensureInitialized() {
  if (!isInitialized) {
    initializeDOMReferences();
  }
}

// Append message to chat
export function appendMessage(role, content, cardData = null) {
  ensureInitialized();
  if (!messagesContainer) return;

  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role}`;

  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'message-bubble';
  bubbleDiv.textContent = content;

  messageDiv.appendChild(bubbleDiv);

  // Add inline card if provided
  if (cardData) {
    const cardDiv = createMessageCard(cardData);
    bubbleDiv.appendChild(cardDiv);
  }

  messagesContainer.appendChild(messageDiv);
  scrollToBottom();

  // If this is an assistant message, set as current for streaming
  if (role === 'assistant') {
    currentMessageElement = bubbleDiv;
  }

  return messageDiv;
}

// Append text to current message (for streaming)
export function appendToCurrentMessage(text) {
  ensureInitialized();
  if (!messagesContainer) return;

  if (!currentMessageElement) {
    // Create new assistant message if none exists
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant';

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';

    messageDiv.appendChild(bubbleDiv);
    messagesContainer.appendChild(messageDiv);

    currentMessageElement = bubbleDiv;
  }

  currentMessageElement.textContent += text;
  scrollToBottom();
}

// Append interactive UI pattern to current message
export function appendInteractiveUI(pattern) {
  ensureInitialized();
  if (!currentMessageElement) {
    console.warn('No current message to append interactive UI to');
    return;
  }

  // Create container for interactive elements
  const interactiveContainer = document.createElement('div');
  interactiveContainer.className = 'interactive-options';

  // Render the UI pattern with callback
  const uiElement = InteractiveUI.renderUIPattern(pattern, (value, label) => {
    // When user selects an option, send it as a message
    handleInteractiveSelection(value, label || value);
  });

  if (uiElement) {
    interactiveContainer.appendChild(uiElement);
    currentMessageElement.appendChild(interactiveContainer);
    currentInteractiveContainer = interactiveContainer;
    scrollToBottom();
  }
}

// Handle selection from interactive UI element
function handleInteractiveSelection(value, displayText) {
  // Remove the interactive container after selection
  if (currentInteractiveContainer) {
    currentInteractiveContainer.remove();
    currentInteractiveContainer = null;
  }

  // Send the VALUE to API (for pattern matching) with displayText for UI
  if (window.AIOrchestrator) {
    window.AIOrchestrator.sendMessageWithDisplay(value, displayText);
  }
}

// Append confidence meter to current message
export function appendConfidenceMeter(confidenceData) {
  if (!currentMessageElement) return;

  const meter = InteractiveUI.renderConfidenceMeter(confidenceData);
  currentMessageElement.appendChild(meter);
  scrollToBottom();
}

// Append completion badge
export function appendCompletionBadge(message) {
  if (!currentMessageElement) return;

  const badge = InteractiveUI.renderCompletionBadge(message);
  currentMessageElement.appendChild(badge);
  scrollToBottom();
}

// Create inline message card (valuation, recommendation, etc.) - RDS Card pattern
function createMessageCard(cardData) {
  const cardDiv = document.createElement('div');
  cardDiv.className = 'message-card rkt-Card rkt-Card--tall';

  const headerDiv = document.createElement('div');
  headerDiv.className = 'card-header rkt-Card__header';

  const contentDiv = document.createElement('div');
  contentDiv.className = 'card-content rkt-Card__content';

  switch (cardData.type) {
    case 'valuation':
      headerDiv.innerHTML = '<span class="rkt-Icon">📊</span> <span>Property Valuation</span>';

      const estimate = document.createElement('div');
      estimate.className = 'valuation-estimate rkt-Card__value';
      estimate.textContent = `$${cardData.data.estimate.toLocaleString()}`;

      const range = document.createElement('div');
      range.className = 'valuation-range rkt-Card__subtitle rkt-Spacing--mb12';
      range.textContent = `Range: $${cardData.data.rangeLow.toLocaleString()} - $${cardData.data.rangeHigh.toLocaleString()}`;

      const badge = document.createElement('span');
      badge.className = 'confidence-badge rkt-Badge rkt-Badge--success';
      badge.textContent = `${Math.round(cardData.data.confidence * 100)}% Confidence`;

      contentDiv.appendChild(estimate);
      contentDiv.appendChild(range);
      contentDiv.appendChild(badge);
      break;

    case 'recommendation':
      headerDiv.innerHTML = `<span class="rkt-Icon">💡</span> <span>${cardData.data.title}</span>`;
      contentDiv.innerHTML = `
        <p class="rkt-Spacing--mb12">${cardData.data.description}</p>
        <p class="rkt-Spacing--mb8"><strong>Cost Range:</strong> $${cardData.data.costRange.min.toLocaleString()} - $${cardData.data.costRange.max.toLocaleString()}</p>
        <p><strong>Impact Score:</strong> ${cardData.data.impactScore}/100</p>
      `;
      break;

    case 'profile':
      headerDiv.innerHTML = '<span class="rkt-Icon">🏠</span> <span>Property Profile</span>';
      contentDiv.innerHTML = `
        <p class="rkt-Spacing--mb8"><strong>Address:</strong> ${cardData.data.address || 'Not provided'}</p>
        <p class="rkt-Spacing--mb8"><strong>Bedrooms:</strong> ${cardData.data.bedrooms || 'Not provided'}</p>
        <p class="rkt-Spacing--mb8"><strong>Bathrooms:</strong> ${cardData.data.bathrooms || 'Not provided'}</p>
        <p><strong>Square Feet:</strong> ${cardData.data.sqft || 'Not provided'}</p>
      `;
      break;
  }

  cardDiv.appendChild(headerDiv);
  cardDiv.appendChild(contentDiv);
  return cardDiv;
}

// Show typing indicator
export function showTypingIndicator() {
  ensureInitialized();
  if (!typingIndicator) return;

  typingIndicator.style.display = 'block';
  currentMessageElement = null; // Reset for new message
  scrollToBottom();
}

// Hide typing indicator
export function hideTypingIndicator() {
  ensureInitialized();
  if (!typingIndicator) return;

  typingIndicator.style.display = 'none';
}

// Show error message
export function showError(message) {
  ensureInitialized();
  if (!messagesContainer) return;

  const errorDiv = document.createElement('div');
  errorDiv.className = 'system-message';
  errorDiv.style.color = 'var(--error-color)';
  errorDiv.textContent = `⚠️ ${message}`;
  messagesContainer.appendChild(errorDiv);
  scrollToBottom();
}

// Show system message
export function showSystemMessage(message) {
  ensureInitialized();
  if (!messagesContainer) return;

  const systemDiv = document.createElement('div');
  systemDiv.className = 'system-message';
  systemDiv.textContent = message;
  messagesContainer.appendChild(systemDiv);
  scrollToBottom();
}

// Scroll to bottom of messages
export function scrollToBottom() {
  if (!messagesContainer) return;

  setTimeout(() => {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, 0);
}

// Clear all messages
export function clearMessages() {
  ensureInitialized();
  if (!messagesContainer) return;

  messagesContainer.innerHTML = '';
  currentMessageElement = null;
}

// Sanitize user input
function sanitizeUserInput(text) {
  const sanitized = Security.sanitizeInput(text, {
    maxLength: 2000,
    allowNewlines: true
  });

  // Show warning if input was truncated
  if (text.length > 2000) {
    showError('Message truncated to 2000 characters');
  }

  return sanitized;
}

// Handle sending message
function handleSendMessage() {
  const text = sanitizeUserInput(messageInput.value);

  if (!text || text.length < 1) {
    return;
  }

  // Clear input
  messageInput.value = '';
  messageInput.style.height = 'auto';

  // Send to AI Orchestrator
  if (window.AIOrchestrator) {
    window.AIOrchestrator.sendMessage(text);
  } else {
    showError('AI Orchestrator not loaded');
  }
}

// Append rich result card (valuation, comparables, recommendations)
export function appendResultCard(cardType, cardData) {
  if (!currentMessageElement) {
    console.warn('No current message to append card to');
    return;
  }

  let card;
  switch (cardType) {
    case 'valuation_result_card':
      card = ResultCards.renderValuationCard(cardData);
      break;
    case 'comparables_cards':
      card = ResultCards.renderComparablesCards(cardData);
      break;
    case 'recommendations_cards':
      card = ResultCards.renderRecommendationsCards(cardData.summary, cardData.data);
      break;
    case 'pdf_download':
      card = ResultCards.renderPDFDownload(cardData.url);
      break;
    default:
      console.warn('Unknown card type:', cardType);
      return;
  }

  if (card) {
    currentMessageElement.appendChild(card);
    scrollToBottom();
  }
}

// Export interface
export const ChatInterface = {
  initialize: initializeDOMReferences, // Expose initialization function
  appendMessage,
  appendToCurrentMessage,
  appendInteractiveUI,
  appendResultCard,
  appendConfidenceMeter,
  appendCompletionBadge,
  showTypingIndicator,
  hideTypingIndicator,
  showError,
  showSystemMessage,
  scrollToBottom,
  clearMessages
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeDOMReferences);
} else {
  // DOM already loaded
  initializeDOMReferences();
}

// Make available globally
window.ChatInterface = ChatInterface;
