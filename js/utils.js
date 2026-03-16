/**
 * Utility Functions
 * Reusable helper functions for navigation, storage, and validation
 */

/**
 * Navigate to another page
 * @param {string} page - The page filename (e.g., 'address.html')
 */
function navigateTo(page) {
  window.location.href = page;
}

/**
 * Navigate back to previous page
 */
function navigateBack() {
  window.history.back();
}

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store (will be JSON stringified)
 */
function saveToStorage(key, value) {
  try {
    const jsonValue = JSON.stringify(value);
    localStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

/**
 * Load data from localStorage
 * @param {string} key - Storage key
 * @returns {any} - Parsed value or null if not found
 */
function loadFromStorage(key) {
  try {
    const jsonValue = localStorage.getItem(key);
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
}

/**
 * Clear all data from localStorage
 */
function clearStorage() {
  localStorage.clear();
}

/**
 * Add click handler to element(s)
 * @param {string} selector - CSS selector
 * @param {Function} handler - Click handler function
 */
function onClick(selector, handler) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    element.addEventListener('click', handler);
  });
}

/**
 * Show modal with fade-in animation
 */
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  const overlay = modal.querySelector('.modal-overlay');

  // Prevent body scroll
  document.body.style.overflow = 'hidden';

  // Show modal
  modal.style.display = 'flex';

  // Trigger fade-in (after brief delay for CSS transition)
  setTimeout(() => {
    overlay.classList.add('active');
  }, 10);

  // Focus first button
  const firstButton = modal.querySelector('button');
  if (firstButton) {
    firstButton.focus();
  }

  // Add keyboard handlers
  modal.addEventListener('keydown', handleModalKeydown);
}

/**
 * Close modal with fade-out animation
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  const overlay = modal.querySelector('.modal-overlay');

  // Fade out
  overlay.classList.remove('active');

  // Wait for animation, then hide
  setTimeout(() => {
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Restore scroll
  }, 300); // Match CSS transition duration

  // Remove keyboard handlers
  modal.removeEventListener('keydown', handleModalKeydown);
}

/**
 * Handle modal keyboard events
 */
function handleModalKeydown(e) {
  if (e.key === 'Escape') {
    closeModal(e.currentTarget.id);
  }
}

/**
 * Close modal when clicking outside
 */
function setupModalClickOutside(modalId) {
  const modal = document.getElementById(modalId);
  const overlay = modal.querySelector('.modal-overlay');

  overlay.addEventListener('click', (e) => {
    // Only close if clicking overlay itself, not modal content
    if (e.target === overlay) {
      closeModal(modalId);
    }
  });
}

/**
 * Save current step to localStorage
 */
function saveCurrentStep(step) {
  saveToStorage('currentStep', step);
}

/**
 * Get current step from localStorage
 */
function getCurrentStep() {
  return loadFromStorage('currentStep');
}

/**
 * Initialize session if new
 */
function initSession() {
  const sessionStarted = loadFromStorage('sessionStarted');

  if (!sessionStarted) {
    saveToStorage('sessionStarted', new Date().toISOString());
    console.log('✓ New session started');
  }
}

/**
 * Check if session has saved progress
 */
function hasProgress() {
  const currentStep = getCurrentStep();
  const address = loadFromStorage('propertyAddress');

  return currentStep && currentStep !== 'landing' && address;
}

/**
 * Clear all session data
 */
function clearSession() {
  clearStorage();
  console.log('✓ Session cleared');
}
