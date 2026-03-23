// Error Tracking and Monitoring
// Captures errors, logs them, and optionally sends to external services (Sentry, Rollbar, etc.)

import { Config } from './config.js';

/**
 * Error severity levels
 */
const SEVERITY = {
  DEBUG: 'debug',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  FATAL: 'fatal'
};

/**
 * Initialize error tracking
 */
function initialize() {
  if (!Config.isFeatureEnabled('errorTracking')) {
    Config.log('info', 'Error tracking disabled');
    return;
  }

  // Set up global error handlers
  setupGlobalErrorHandlers();

  // Initialize external service if configured
  initializeExternalService();

  Config.log('info', 'Error tracking initialized');
}

/**
 * Set up global error handlers
 */
function setupGlobalErrorHandlers() {
  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    captureError(event.reason, {
      type: 'unhandledrejection',
      promise: event.promise
    }, SEVERITY.ERROR);
  });

  // Catch uncaught errors
  window.addEventListener('error', (event) => {
    captureError(event.error || event.message, {
      type: 'uncaught',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    }, SEVERITY.ERROR);
  });

  // Catch console errors
  const originalConsoleError = console.error;
  console.error = function(...args) {
    // Only capture if error tracking is enabled and not in development
    if (Config.isFeatureEnabled('errorTracking') && !Config.isDevelopment) {
      captureError(args[0], {
        type: 'console.error',
        arguments: args
      }, SEVERITY.ERROR);
    }
    originalConsoleError.apply(console, args);
  };
}

/**
 * Initialize external error tracking service (Sentry, Rollbar, etc.)
 */
function initializeExternalService() {
  // TODO: Add Sentry or Rollbar initialization here when needed
  // Example for Sentry:
  // if (window.Sentry && Config.isProduction) {
  //   Sentry.init({
  //     dsn: 'YOUR_SENTRY_DSN',
  //     environment: Config.ENVIRONMENT,
  //     release: Config.get('version'),
  //     beforeSend(event) {
  //       // Filter out sensitive data
  //       return filterSensitiveData(event);
  //     }
  //   });
  // }

  Config.log('debug', 'External error service not configured');
}

/**
 * Capture and track an error
 * @param {Error|string} error - Error object or message
 * @param {Object} context - Additional context about the error
 * @param {string} severity - Error severity level
 */
function captureError(error, context = {}, severity = SEVERITY.ERROR) {
  if (!Config.isFeatureEnabled('errorTracking')) {
    return;
  }

  // Build error data
  const errorData = buildErrorData(error, context, severity);

  // Log to console in development
  if (Config.debug) {
    console.group(`[${severity.toUpperCase()}] Error Captured`);
    console.error('Error:', error);
    console.log('Context:', context);
    console.log('User:', getUserContext());
    console.groupEnd();
  }

  // Log using config
  Config.log('error', errorData.message, errorData);

  // Send to external service if available
  sendToExternalService(errorData);

  // Store in local error log for debugging
  storeErrorLocally(errorData);
}

/**
 * Build structured error data
 * @param {Error|string} error - Error object or message
 * @param {Object} context - Additional context
 * @param {string} severity - Severity level
 * @returns {Object} Structured error data
 */
function buildErrorData(error, context, severity) {
  const isErrorObject = error instanceof Error;

  return {
    timestamp: new Date().toISOString(),
    environment: Config.ENVIRONMENT,
    severity: severity,
    message: isErrorObject ? error.message : String(error),
    stack: isErrorObject ? error.stack : null,
    type: context.type || 'manual',
    context: {
      ...context,
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    },
    user: getUserContext(),
    breadcrumbs: getBreadcrumbs()
  };
}

/**
 * Get user context (anonymized)
 * @returns {Object} User context
 */
function getUserContext() {
  return {
    id: getAnonymousUserId(),
    sessionId: getSessionId(),
    browser: getBrowserInfo(),
    os: getOSInfo()
  };
}

/**
 * Get anonymous user ID (persisted across sessions)
 * @returns {string} Anonymous user ID
 */
function getAnonymousUserId() {
  let userId = localStorage.getItem('rocket_anonymous_user_id');

  if (!userId) {
    userId = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem('rocket_anonymous_user_id', userId);
  }

  return userId;
}

/**
 * Get session ID (reset on page load)
 * @returns {string} Session ID
 */
function getSessionId() {
  if (!window._rocketSessionId) {
    window._rocketSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
  return window._rocketSessionId;
}

/**
 * Get browser information
 * @returns {Object} Browser info
 */
function getBrowserInfo() {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  let version = 'Unknown';

  if (ua.includes('Chrome')) {
    browser = 'Chrome';
    const match = ua.match(/Chrome\/(\d+)/);
    version = match ? match[1] : version;
  } else if (ua.includes('Firefox')) {
    browser = 'Firefox';
    const match = ua.match(/Firefox\/(\d+)/);
    version = match ? match[1] : version;
  } else if (ua.includes('Safari')) {
    browser = 'Safari';
    const match = ua.match(/Version\/(\d+)/);
    version = match ? match[1] : version;
  } else if (ua.includes('Edge')) {
    browser = 'Edge';
    const match = ua.match(/Edge\/(\d+)/);
    version = match ? match[1] : version;
  }

  return { browser, version };
}

/**
 * Get OS information
 * @returns {string} OS name
 */
function getOSInfo() {
  const ua = navigator.userAgent;

  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';

  return 'Unknown';
}

/**
 * Get breadcrumbs (user action trail)
 * @returns {Array} Breadcrumbs
 */
function getBreadcrumbs() {
  return window._rocketBreadcrumbs || [];
}

/**
 * Add breadcrumb (track user actions)
 * @param {string} category - Breadcrumb category
 * @param {string} message - Breadcrumb message
 * @param {Object} data - Additional data
 */
function addBreadcrumb(category, message, data = {}) {
  if (!window._rocketBreadcrumbs) {
    window._rocketBreadcrumbs = [];
  }

  window._rocketBreadcrumbs.push({
    timestamp: new Date().toISOString(),
    category: category,
    message: message,
    data: data
  });

  // Keep only last 50 breadcrumbs
  if (window._rocketBreadcrumbs.length > 50) {
    window._rocketBreadcrumbs.shift();
  }
}

/**
 * Send error to external service
 * @param {Object} errorData - Error data
 */
function sendToExternalService(errorData) {
  // TODO: Implement external service integration
  // Example for Sentry:
  // if (window.Sentry) {
  //   Sentry.captureException(errorData);
  // }

  // For now, just log that we would send it
  if (Config.isProduction) {
    Config.log('debug', 'Would send to external service', { message: errorData.message });
  }
}

/**
 * Store error locally for debugging
 * @param {Object} errorData - Error data
 */
function storeErrorLocally(errorData) {
  try {
    const key = 'rocket_error_log';
    let errorLog = JSON.parse(localStorage.getItem(key) || '[]');

    errorLog.push({
      ...errorData,
      // Remove stack trace to save space
      stack: errorData.stack ? errorData.stack.substring(0, 500) : null
    });

    // Keep only last 20 errors
    if (errorLog.length > 20) {
      errorLog = errorLog.slice(-20);
    }

    localStorage.setItem(key, JSON.stringify(errorLog));
  } catch (error) {
    // Failed to store error - ignore
    Config.log('warn', 'Failed to store error locally', error);
  }
}

/**
 * Get local error log
 * @returns {Array} Error log
 */
function getErrorLog() {
  try {
    return JSON.parse(localStorage.getItem('rocket_error_log') || '[]');
  } catch {
    return [];
  }
}

/**
 * Clear local error log
 */
function clearErrorLog() {
  localStorage.removeItem('rocket_error_log');
  Config.log('info', 'Error log cleared');
}

/**
 * Set user context (for authenticated users)
 * @param {Object} userData - User data
 */
function setUser(userData) {
  window._rocketUserData = {
    id: userData.id || null,
    email: userData.email ? hashEmail(userData.email) : null, // Hash for privacy
    name: userData.name || null
  };

  Config.log('debug', 'User context set');
}

/**
 * Hash email for privacy
 * @param {string} email - Email address
 * @returns {string} Hashed email
 */
function hashEmail(email) {
  // Simple hash for privacy (not cryptographic)
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = ((hash << 5) - hash) + email.charCodeAt(i);
    hash = hash & hash;
  }
  return `user_${Math.abs(hash)}`;
}

// Export error tracker interface
export const ErrorTracker = {
  initialize,
  captureError,
  addBreadcrumb,
  getErrorLog,
  clearErrorLog,
  setUser,
  SEVERITY
};

// Auto-initialize
initialize();

// Make available globally for debugging
window.ErrorTracker = ErrorTracker;
