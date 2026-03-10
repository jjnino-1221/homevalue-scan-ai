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
