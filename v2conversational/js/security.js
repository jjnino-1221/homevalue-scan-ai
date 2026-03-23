// Security Utilities
// Client-side security measures and utilities

import { Config } from './config.js';

/**
 * Initialize security measures
 */
function initialize() {
  // Enforce HTTPS in production
  enforceHTTPS();

  // Set up CSP violation reporting
  setupCSPReporting();

  // Prevent clickjacking
  preventClickjacking();

  Config.log('info', 'Security utilities initialized');
}

/**
 * Enforce HTTPS in production
 */
function enforceHTTPS() {
  if (Config.isProduction && window.location.protocol !== 'https:') {
    Config.log('warn', 'Redirecting to HTTPS');
    window.location.href = window.location.href.replace('http:', 'https:');
  }
}

/**
 * Set up CSP violation reporting
 */
function setupCSPReporting() {
  document.addEventListener('securitypolicyviolation', (event) => {
    Config.log('error', 'CSP Violation', {
      violated: event.violatedDirective,
      blocked: event.blockedURI,
      original: event.originalPolicy
    });

    // Send to error tracker if available
    if (window.ErrorTracker) {
      window.ErrorTracker.captureError(
        new Error(`CSP Violation: ${event.violatedDirective}`),
        {
          type: 'csp_violation',
          blockedURI: event.blockedURI,
          violated: event.violatedDirective
        },
        window.ErrorTracker.SEVERITY.WARNING
      );
    }
  });
}

/**
 * Prevent clickjacking (frame busting)
 */
function preventClickjacking() {
  if (window.top !== window.self) {
    Config.log('warn', 'Application loaded in frame - potential clickjacking');

    if (Config.isProduction) {
      // Break out of frame in production
      window.top.location = window.self.location;
    }
  }
}

/**
 * Sanitize HTML to prevent XSS
 * @param {string} html - HTML string
 * @returns {string} Sanitized HTML
 */
function sanitizeHTML(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Sanitize user input
 * @param {string} input - User input
 * @param {Object} options - Sanitization options
 * @returns {string} Sanitized input
 */
function sanitizeInput(input, options = {}) {
  if (typeof input !== 'string') {
    return '';
  }

  let sanitized = input;

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Trim whitespace
  sanitized = sanitized.trim();

  // Limit length
  const maxLength = options.maxLength || 2000;
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  // Remove control characters (except newlines and tabs if allowed)
  if (!options.allowNewlines) {
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  } else {
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  }

  // HTML encode if needed
  if (options.htmlEncode) {
    sanitized = sanitizeHTML(sanitized);
  }

  return sanitized;
}

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @param {Object} options - Validation options
 * @returns {boolean} True if valid
 */
function isValidURL(url, options = {}) {
  try {
    const parsed = new URL(url);

    // Check protocol
    const allowedProtocols = options.allowedProtocols || ['http:', 'https:'];
    if (!allowedProtocols.includes(parsed.protocol)) {
      return false;
    }

    // Check for localhost in production
    if (Config.isProduction && (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1')) {
      return false;
    }

    // Check for allowed domains if specified
    if (options.allowedDomains && !options.allowedDomains.some(domain => parsed.hostname.endsWith(domain))) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Generate secure random string
 * @param {number} length - Length of string
 * @returns {string} Random string
 */
function generateSecureRandom(length = 32) {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Check if localStorage is available and not full
 * @returns {boolean} True if available
 */
function isStorageAvailable() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Clear sensitive data from memory
 * @param {Object} obj - Object to clear
 */
function clearSensitiveData(obj) {
  if (!obj || typeof obj !== 'object') return;

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      obj[key] = null;
    }
  }
}

/**
 * Mask sensitive data for logging
 * @param {string} data - Sensitive data
 * @param {number} visibleChars - Number of visible characters
 * @returns {string} Masked data
 */
function maskSensitiveData(data, visibleChars = 4) {
  if (!data || typeof data !== 'string') return '';

  if (data.length <= visibleChars) {
    return '*'.repeat(data.length);
  }

  const visible = data.substring(data.length - visibleChars);
  const masked = '*'.repeat(data.length - visibleChars);
  return masked + visible;
}

/**
 * Rate limiter for API calls
 */
class RateLimiter {
  constructor(maxRequests = 10, timeWindow = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }

  /**
   * Check if request is allowed
   * @returns {boolean} True if allowed
   */
  isAllowed() {
    const now = Date.now();

    // Remove old requests outside time window
    this.requests = this.requests.filter(time => now - time < this.timeWindow);

    // Check if under limit
    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }

    Config.log('warn', 'Rate limit exceeded', {
      requests: this.requests.length,
      maxRequests: this.maxRequests,
      timeWindow: this.timeWindow
    });

    return false;
  }

  /**
   * Get time until next allowed request
   * @returns {number} Milliseconds until next allowed request
   */
  getTimeUntilAllowed() {
    if (this.requests.length < this.maxRequests) {
      return 0;
    }

    const now = Date.now();
    const oldestRequest = this.requests[0];
    return Math.max(0, this.timeWindow - (now - oldestRequest));
  }

  /**
   * Reset rate limiter
   */
  reset() {
    this.requests = [];
  }
}

/**
 * Validate file upload
 * @param {File} file - File object
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
function validateFileUpload(file, options = {}) {
  const result = {
    valid: true,
    errors: []
  };

  // Check file size
  const maxSize = options.maxSize || 5 * 1024 * 1024; // Default 5MB
  if (file.size > maxSize) {
    result.valid = false;
    result.errors.push(`File size exceeds ${maxSize / 1024 / 1024}MB`);
  }

  // Check file type
  const allowedTypes = options.allowedTypes || ['image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedTypes.includes(file.type)) {
    result.valid = false;
    result.errors.push(`File type ${file.type} not allowed`);
  }

  // Check file name
  if (file.name.length > 255) {
    result.valid = false;
    result.errors.push('File name too long');
  }

  // Check for double extensions (potential security issue)
  if ((file.name.match(/\./g) || []).length > 1) {
    Config.log('warn', 'File with multiple extensions detected', { fileName: file.name });
  }

  return result;
}

// Export security utilities
export const Security = {
  initialize,
  sanitizeHTML,
  sanitizeInput,
  isValidURL,
  generateSecureRandom,
  isStorageAvailable,
  clearSensitiveData,
  maskSensitiveData,
  RateLimiter,
  validateFileUpload
};

// Auto-initialize
initialize();

// Make available globally for debugging
window.RocketSecurity = Security;
